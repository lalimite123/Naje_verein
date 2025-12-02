import { getDb } from "@/lib/mongo"
import { assertNewsletterEnv } from "@/lib/env"
import { buildProgram } from "@/lib/models/program"
import { generateICS, icsFilename, buildGoogleCalendarUrl } from "@/lib/ics"
import sgMail from "@sendgrid/mail"
import { Cache } from "@/lib/cache"

const programCache: { map: Map<string, { at: number; data: any }>; ttl: number } =
  (globalThis as any).__programCache || { map: new Map(), ttl: 10_000 }
;(globalThis as any).__programCache = programCache

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10))
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "20", 10)))
    const search = url.searchParams.get("search")?.toLowerCase() || undefined
    const type = url.searchParams.get("type") || undefined
    const dateFrom = url.searchParams.get("dateFrom") || undefined
    const dateTo = url.searchParams.get("dateTo") || undefined

    const cacheKey = JSON.stringify({ page, limit, search, type, dateFrom, dateTo })
    const cache = new Cache()
    const cached = await cache.get(cacheKey)
    if (cached) {
      return new Response(JSON.stringify(cached), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=5, s-maxage=30, stale-while-revalidate=120",
        },
      })
    }

    const db = await getDb()
    const col = db.collection("Programs")

    const query: Record<string, any> = {}
    if (type) query.type = type
    if (search) query.$text = { $search: search }
    if (dateFrom || dateTo) {
      const range: Record<string, any> = {}
      if (dateFrom) range.$gte = dateFrom
      if (dateTo) range.$lte = dateTo
      query.date = range
    }

    let idxDone = (globalThis as any).__programIndexesDone || false
    if (!idxDone) {
      try {
        await col.createIndex({ date: 1 })
        await col.createIndex({ type: 1, date: 1 })
        await col.createIndex({ title: "text" })
      } catch {}
      ;(globalThis as any).__programIndexesDone = true
    }

    const projection = { title: 1, summary: 1, date: 1, time: 1, location: 1, organizer: 1, type: 1, image: 1 }
    const items = await col
      .find(query)
      .project(projection)
      .sort({ date: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    const payload = { items, page, pageSize: limit }
    await cache.set(cacheKey, payload, 60_000)
    return new Response(JSON.stringify(payload), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=5, s-maxage=30, stale-while-revalidate=120",
      },
    })
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "Server error"
    return new Response(JSON.stringify({ error: msg }), { status: 500 })
  }
}

export async function POST(req: Request) {
  assertNewsletterEnv()
  try {
    const auth = req.headers.get("authorization") || ""
    if (!auth.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }
    const bearer = auth.slice(7)
    const apiToken = process.env.ADMIN_API_TOKEN || ""
    const jwtSecret = process.env.ADMIN_JWT_SECRET || ""
    let ok = false
    if (apiToken && bearer === apiToken) ok = true
    if (!ok && jwtSecret) {
      try {
        const { verifyJwt } = await import("@/lib/auth")
        ok = !!verifyJwt(bearer, jwtSecret)
      } catch {}
    }
    if (!ok) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    const body = await req.json()
    const title = (body?.title ?? "").toString().trim()
    const summary = (body?.summary ?? "").toString()
    const date = (body?.date ?? "").toString().trim()
    const time = (body?.time ?? "").toString().trim() || undefined
    const location = (body?.location ?? "").toString().trim() || undefined
    const organizer = (body?.organizer ?? "").toString().trim() || undefined
    const type = (body?.type ?? "").toString().trim() as "program" | "event"
    const image = (body?.image ?? "").toString().trim() || undefined

    if (!title || !date || !type) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 })
    }

    const db = await getDb()
    const col = db.collection("Programs")
    await col.createIndex({ title: 1 })

    const now = new Date()
    const doc = buildProgram({ title, summary, date, time, location, organizer, type, image }, now)
    const res = await col.insertOne(doc)

    try {
      assertNewsletterEnv()
      const apiKey = process.env.SENDGRID_API_KEY || ""
      const fromEmail = process.env.SENDGRID_FROM_EMAIL || ""
      if (apiKey && fromEmail) {
        sgMail.setApiKey(apiKey)
        const ncol = db.collection("NewsLetter")
        const subs = await ncol.find({ confirmed: true }).project({ email: 1, name: 1 }).toArray()
        const toList = subs.map((s: any) => s.email).filter((e: string) => !!e)
        if (toList.length) {
          const kind = type === "event" ? "Événement" : "Programme"
          const titleLine = `${kind} – ${title}`
          const lines = [
            date ? `Date: ${date}` : "",
            time ? `Heure: ${time}` : "",
            location ? `Lieu: ${location}` : "",
            organizer ? `Organisateur: ${organizer}` : "",
          ].filter(Boolean)
          const appUrl = process.env.APP_URL || ""
          const programUrl = `${appUrl}/#programs-events`
          const gcalUrl = buildGoogleCalendarUrl({ title, description: summary || "", date, time: time || "00:00", location: location || undefined })
          const html = `
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
              <tr><td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
                  <tr><td style="background:#ffffff;padding:16px;border-bottom:1px solid #e5e7eb" align="left">
                    <div style="font-size:16px;color:#111827;font-weight:600">${titleLine}</div>
                    <div style="height:2px;background:#dc2626;margin-top:8px"></div>
                  </td></tr>
                  <tr><td style="padding:24px">
                    <div style="font-size:14px;color:#374151;margin-bottom:12px">${lines.join(" · ")}</div>
                    ${image ? `<div style="margin:12px 0"><img src="${image}" alt="${title}" style="max-width:100%;border:1px solid #e5e7eb;border-radius:8px"/></div>` : ""}
                    ${summary ? `<div style="padding:12px;border:1px solid #e5e7eb;border-radius:8px;background:#fafafa;font-size:14px;color:#374151;line-height:1.6">${summary.replace(/\n/g, "<br/>")}</div>` : ""}
                    <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap">
                      <a href="${programUrl}" style="background:#dc2626;color:#ffffff;text-decoration:none;padding:10px 14px;border-radius:8px;display:inline-block;font-size:14px">Voir les programmes</a>
                      <a href="${gcalUrl}" style="background:#0ea5e9;color:#ffffff;text-decoration:none;padding:10px 14px;border-radius:8px;display:inline-block;font-size:14px">Ajouter à Google Calendar</a>
                    </div>
                  </td></tr>
                  <tr><td style="padding:16px;background:#f3f4f6;color:#6b7280;font-size:12px" align="center">Naje e.V. · Deutschland</td></tr>
                </table>
              </td></tr>
            </table>`

          const ics = generateICS({ uid: String(res.insertedId ?? `${title}-${date}`), title, description: summary || "", date, time: time || "00:00", location: location || undefined })
          const icsContent = Buffer.from(ics).toString("base64")
          const attachment = { content: icsContent, filename: icsFilename(title, date), type: "text/calendar", disposition: "attachment" as const }

          const chunk = 100
          for (let i = 0; i < toList.length; i += chunk) {
            const slice = toList.slice(i, i + chunk)
            await sgMail.sendMultiple({ to: slice, from: { email: fromEmail, name: "Naje e.V." }, subject: titleLine, html, attachments: [attachment] })
          }
        }
      }
    } catch {}

    try {
      const cache = new Cache()
      await cache.clear()
    } catch {}

    return Response.json({ ok: true, id: res.insertedId })
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "Server error"
    return new Response(JSON.stringify({ error: msg }), { status: 500 })
  }
}
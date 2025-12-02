import { getDb } from "@/lib/mongo"
import { assertNewsletterEnv } from "@/lib/env"
import { buildNewsletterSubscription } from "@/lib/models/newsletter"
import sgMail from "@sendgrid/mail"
import { randomBytes } from "crypto"
import { readFileSync } from "fs"
import path from "path"

export async function POST(req: Request) {
  assertNewsletterEnv()
  try {
    const body = await req.json()
    const name = (body?.name ?? "").toString().trim()
    const email = (body?.email ?? "").toString().trim().toLowerCase()

    if (!email) {
      return new Response(JSON.stringify({ error: "Email required" }), { status: 400 })
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), { status: 400 })
    }
    if (name && (name.length < 2 || name.length > 120)) {
      return new Response(JSON.stringify({ error: "Invalid name" }), { status: 400 })
    }

    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri) {
      return new Response(JSON.stringify({ error: "Server not configured" }), { status: 500 })
    }
    const db = await getDb()
    const col = db.collection("NewsLetter")
    await col.createIndex({ email: 1 }, { unique: true })

    const now = new Date()
    const token = randomBytes(24).toString("hex")
    const appUrl = process.env.APP_URL || ""
    const confirmUrl = `${appUrl}/api/newsletter/confirm?token=${token}`

    const logoPath = path.join(process.cwd(), "public", "logo-naje.png")
    let logoContent = ""
    try {
      logoContent = readFileSync(logoPath).toString("base64")
    } catch {}

    const html = `
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
            <tr><td style="background:#ffffff;padding:16px;border-bottom:1px solid #e5e7eb" align="left">
              <img src="cid:logo" alt="Naje e.V." height="36" style="display:block" />
              <div style="font-size:14px;color:#6b7280;margin-top:8px">Naje e.V. – Newsletter Bestätigung</div>
              <div style="height:2px;background:#dc2626;margin-top:8px"></div>
            </td></tr>
            <tr><td style="padding:24px">
              <h1 style="margin:0 0 12px 0;font-size:20px;color:#111827">Bitte bestätigen Sie Ihre Anmeldung</h1>
              <p style="margin:0 0 12px 0;font-size:14px;color:#374151">Hallo ${name || ""}, klicken Sie auf den folgenden Button, um Ihre Newsletter-Anmeldung zu bestätigen.</p>
              <div style="margin-top:16px">
                <a href="${confirmUrl}" style="background:#dc2626;color:#ffffff;text-decoration:none;padding:12px 16px;border-radius:8px;display:inline-block;font-size:14px">Anmeldung bestätigen</a>
              </div>
              <p style="margin-top:16px;font-size:12px;color:#6b7280">Falls der Button nicht funktioniert, kopieren Sie diesen Link in Ihren Browser:<br/><span style="word-break:break-all;color:#374151">${confirmUrl}</span></p>
            </td></tr>
            <tr><td style="padding:16px;background:#f3f4f6;color:#6b7280;font-size:12px" align="center">Naje e.V. · Deutschland</td></tr>
          </table>
        </td></tr>
      </table>`

    const apiKey = process.env.SENDGRID_API_KEY
    const fromEmail = process.env.SENDGRID_FROM_EMAIL
    if (!apiKey || !fromEmail) {
      return new Response(JSON.stringify({ error: "Server not configured" }), { status: 500 })
    }
    sgMail.setApiKey(apiKey)

    const baseDoc = buildNewsletterSubscription(email, name || null, now)
    await col.updateOne(
      { email },
      {
        $setOnInsert: baseDoc,
        $set: { confirmToken: token, confirmTokenCreatedAt: now },
      },
      { upsert: true },
    )

    await sgMail.send({
      to: { email, name: name || undefined },
      from: { email: fromEmail, name: "Naje e.V." },
      subject: "Bitte bestätigen Sie Ihre Newsletter-Anmeldung",
      html,
      attachments: logoContent
        ? [
            {
              content: logoContent,
              filename: "logo-naje.png",
              type: "image/png",
              disposition: "inline",
              contentId: "logo",
            },
          ]
        : undefined,
    })

    return Response.json({ ok: true })
  } catch (e: any) {
    if (e?.code === 11000) {
      return Response.json({ ok: true })
    }
    const msg = typeof e?.message === "string" ? e.message : "Server error"
    return new Response(JSON.stringify({ error: msg }), { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
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
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10))
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "20", 10)))
    const confirmedParam = url.searchParams.get("confirmed")
    const dateFrom = url.searchParams.get("dateFrom") || undefined
    const dateTo = url.searchParams.get("dateTo") || undefined
    const search = url.searchParams.get("search")?.toLowerCase() || undefined
    const format = url.searchParams.get("format") || "json"

    const db = await getDb()
    const col = db.collection("NewsLetter")

    const query: Record<string, any> = {}
    if (confirmedParam === "true") query.confirmed = true
    if (confirmedParam === "false") query.confirmed = false
    if (search) query.email = { $regex: search, $options: "i" }
    if (dateFrom || dateTo) {
      const range: Record<string, any> = {}
      if (dateFrom) range.$gte = dateFrom
      if (dateTo) range.$lte = dateTo
      query.date = range
    }

    const total = await col.countDocuments(query)
    const items = await col
      .find(query)
      .project({ confirmToken: 0, confirmTokenCreatedAt: 0 })
      .sort({ subscribedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    if (format === "csv") {
      const header = ["email", "name", "subscribedAt", "date", "hour", "weekday", "confirmed"].join(",")
      const lines = items.map((it: any) => {
        const cells = [it.email, it.name ?? "", new Date(it.subscribedAt).toISOString(), it.date, it.hour, it.weekday, it.confirmed]
        return cells.map((c) => (typeof c === "string" ? `"${c.replace(/"/g, '""')}"` : String(c))).join(",")
      })
      const csv = [header, ...lines].join("\n")
      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": "attachment; filename=newsletter.csv",
        },
      })
    }

    return Response.json({ items, total, page, pageSize: limit })
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "Server error"
    return new Response(JSON.stringify({ error: msg }), { status: 500 })
  }
}
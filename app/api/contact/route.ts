import sgMail from "@sendgrid/mail"
import { readFileSync } from "fs"
import path from "path"
import { assertRequiredEnv } from "@/lib/env"

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT_MAX = 5
const rateMap: Map<string, { count: number; resetAt: number }> = (globalThis as any).__contactRateMap || new Map()
;(globalThis as any).__contactRateMap = rateMap

export async function POST(req: Request) {
  assertRequiredEnv()
  try {
    const body = await req.json()
    const name = (body?.name ?? "").toString().trim()
    const email = (body?.email ?? "").toString().trim()
    const message = (body?.message ?? "").toString().trim()

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400 })
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), { status: 400 })
    }
    if (name.length < 2 || name.length > 120) {
      return new Response(JSON.stringify({ error: "Invalid name" }), { status: 400 })
    }
    if (message.length < 10 || message.length > 4000) {
      return new Response(JSON.stringify({ error: "Invalid message" }), { status: 400 })
    }
    const urlMatches = (message.match(/https?:\/\/|www\./gi) || []).length
    if (urlMatches > 3) {
      return new Response(JSON.stringify({ error: "Too many links" }), { status: 400 })
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    const now = Date.now()
    const existing = rateMap.get(ip)
    if (!existing || now > existing.resetAt) {
      rateMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    } else {
      if (existing.count >= RATE_LIMIT_MAX) {
        return new Response(JSON.stringify({ error: "Rate limited" }), { status: 429 })
      }
      existing.count += 1
      rateMap.set(ip, existing)
    }

    const apiKey = process.env.SENDGRID_API_KEY
    const toEmail = process.env.SENDGRID_TO_EMAIL
    const fromEmail = process.env.SENDGRID_FROM_EMAIL

    if (!apiKey || !toEmail || !fromEmail) {
      return new Response(JSON.stringify({ error: "Server not configured" }), { status: 500 })
    }

    sgMail.setApiKey(apiKey)

    const logoPath = path.join(process.cwd(), "public", "logo-naje.png")
    let logoContent = ""
    try {
      logoContent = readFileSync(logoPath).toString("base64")
    } catch {}

    const adminHtml = `
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
            <tr><td style="background:#ffffff;padding:16px;border-bottom:1px solid #e5e7eb" align="left">
              <img src="cid:logo" alt="Naje e.V." height="36" style="display:block" />
              <div style="font-size:14px;color:#6b7280;margin-top:8px">Naje e.V. – Kontakt</div>
              <div style="height:2px;background:#dc2626;margin-top:8px"></div>
            </td></tr>
            <tr><td style="padding:24px">
              <h1 style="margin:0 0 12px 0;font-size:20px;color:#111827">Neue Kontaktanfrage</h1>
              <p style="margin:0 0 8px 0;font-size:14px;color:#374151"><strong>Von:</strong> ${name} &lt;${email}&gt;</p>
              <div style="margin-top:16px;padding:16px;border:1px solid #e5e7eb;border-radius:8px;background:#fafafa">
                <p style="margin:0;font-size:14px;line-height:1.6;color:#374151">${message.replace(/\n/g, "<br/>")}</p>
              </div>
            </td></tr>
            <tr><td style="padding:16px;background:#f3f4f6;color:#6b7280;font-size:12px" align="center">Naje e.V. · Deutschland</td></tr>
          </table>
        </td></tr>
      </table>`

    const mail = {
      to: toEmail,
      from: { email: fromEmail, name: "Naje e.V." },
      subject: `Neue Kontaktanfrage – ${name}`,
      text: `Von: ${name} <${email}>\n\n${message}`,
      html: adminHtml,
      replyTo: email,
      attachments: logoContent
        ? [
            {
              content: logoContent,
              filename: "logo-naje.png",
              type: "image/png",
              disposition: "inline",
              content_id: "logo",
            },
          ]
        : undefined,
    }

    const confirmHtml = `
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
            <tr><td style="background:#ffffff;padding:16px;border-bottom:1px solid #e5e7eb" align="left">
              <img src="cid:logo" alt="Naje e.V." height="36" style="display:block" />
              <div style="font-size:14px;color:#6b7280;margin-top:8px">Naje e.V. – Bestätigung</div>
              <div style="height:2px;background:#dc2626;margin-top:8px"></div>
            </td></tr>
            <tr><td style="padding:24px">
              <h1 style="margin:0 0 12px 0;font-size:20px;color:#111827">Vielen Dank für Ihre Nachricht</h1>
              <p style="margin:0 0 8px 0;font-size:14px;color:#374151">Hallo ${name}, wir haben Ihre Anfrage erhalten und melden uns bald bei Ihnen.</p>
              <div style="margin-top:16px;padding:16px;border:1px solid #e5e7eb;border-radius:8px;background:#fafafa">
                <p style="margin:0;font-size:14px;line-height:1.6;color:#374151">${message.replace(/\n/g, "<br/>")}</p>
              </div>
            </td></tr>
            <tr><td style="padding:16px;background:#f3f4f6;color:#6b7280;font-size:12px" align="center">Naje e.V. · Deutschland</td></tr>
          </table>
        </td></tr>
      </table>`

    const confirmation = {
      to: { email, name },
      from: { email: fromEmail, name: "Naje e.V." },
      subject: "Ihre Nachricht wurde empfangen – Naje e.V.",
      text: `Hallo ${name},\n\nVielen Dank für Ihre Nachricht. Wir melden uns bald bei Ihnen.\n\nIhre Nachricht:\n${message}`,
      html: confirmHtml,
      attachments: logoContent
        ? [
            {
              content: logoContent,
              filename: "logo-naje.png",
              type: "image/png",
              disposition: "inline",
              content_id: "logo",
            },
          ]
        : undefined,
    }

    await sgMail.send(mail)
    await sgMail.send(confirmation)
    return Response.json({ ok: true })
  } catch (e) {
    return new Response(JSON.stringify({ error: "Send failed" }), { status: 500 })
  }
}
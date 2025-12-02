import { getDb } from "@/lib/mongo"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const token = url.searchParams.get("token")?.toString() || ""
    if (!token) {
      return new Response("Invalid token", { status: 400 })
    }
    const db = await getDb()
    const col = db.collection("NewsLetter")
    const doc = await col.findOne({ confirmToken: token })
    if (!doc) {
      return new Response("Token not found", { status: 404 })
    }
    await col.updateOne(
      { _id: doc._id },
      { $set: { confirmed: true }, $unset: { confirmToken: "", confirmTokenCreatedAt: "" } },
    )
    const appUrl = process.env.APP_URL || ""
    const homeHref = appUrl || "/"
    const logoSrc = appUrl ? `${appUrl}/logo-naje.png` : "/logo-naje.png"
    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Naje e.V. – Newsletter bestätigt</title>
          <style>
            :root{color-scheme:light}
            body{font-family:Arial,Helvetica,sans-serif;background:#f8fafc;color:#0f172a;margin:0;padding:24px}
            .wrap{max-width:760px;margin:0 auto}
            .card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(17,24,39,0.06)}
            .header{padding:18px 20px;border-bottom:1px solid #e5e7eb;background:#ffffff}
            .logo{height:40px;display:block}
            .subtitle{font-size:14px;color:#6b7280;margin-top:8px}
            .bar{height:2px;background:#dc2626;margin-top:8px}
            .content{padding:28px}
            h1{margin:0 0 12px 0;font-size:22px;color:#111827}
            p{margin:0 0 12px 0;font-size:15px;color:#374151;line-height:1.7}
            .actions{margin-top:20px}
            .btn{background:#dc2626;color:#ffffff;text-decoration:none;padding:12px 16px;border-radius:8px;display:inline-block;font-size:14px}
            .btn-outline{border:1px solid #e5e7eb;color:#111827;background:#ffffff;text-decoration:none;padding:10px 14px;border-radius:8px;display:inline-block;font-size:14px;margin-left:12px}
            .footer{padding:14px;background:#f3f4f6;color:#6b7280;font-size:12px;text-align:center}
          </style>
        </head>
        <body>
          <div class="wrap">
            <div class="card">
              <div class="header">
                <img src="${logoSrc}" alt="Naje e.V." class="logo" />
                <div class="subtitle">Naje e.V. – Newsletter</div>
                <div class="bar"></div>
              </div>
              <div class="content">
                <h1>Ihre Anmeldung wurde bestätigt</h1>
                <p>Vielen Dank. Sie erhalten künftig Benachrichtigungen zu neuen Veröffentlichungen.</p>
                <div class="actions">
                  <a href="${homeHref}" class="btn">Zurück zur Startseite</a>
                </div>
              </div>
              <div class="footer">Naje e.V. · Deutschland</div>
            </div>
          </div>
        </body>
      </html>`
    return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } })
  } catch {
    return new Response("Server error", { status: 500 })
  }
}
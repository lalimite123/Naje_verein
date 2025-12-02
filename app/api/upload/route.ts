import { verifyJwt } from "@/lib/auth"

function b64url(input: Buffer) {
  return input.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
}

async function getAccessToken() {
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || ""
  let pk = process.env.FIREBASE_PRIVATE_KEY || ""
  if (!clientEmail || !pk) throw new Error("Server not configured")
  pk = pk.replace(/\\n/g, "\n")
  const now = Math.floor(Date.now() / 1000)
  const header = b64url(Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })))
  const payload = b64url(
    Buffer.from(
      JSON.stringify({
        iss: clientEmail,
        scope: "https://www.googleapis.com/auth/devstorage.read_write",
        aud: "https://oauth2.googleapis.com/token",
        iat: now,
        exp: now + 3600,
      }),
    ),
  )
  const data = `${header}.${payload}`
  const sign = await import("crypto")
  const signature = sign.createSign("RSA-SHA256").update(data).sign(pk)
  const assertion = `${data}.${b64url(signature)}`
  const body = new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion })
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  })
  const json = await res.json()
  if (!res.ok) throw new Error(typeof json?.error === "string" ? json.error : "Auth error")
  return String(json.access_token || "")
}

function unauthorized(auth: string | null) {
  if (!auth || !auth.startsWith("Bearer ")) return true
  const bearer = auth.slice(7)
  const apiToken = process.env.ADMIN_API_TOKEN || ""
  const jwtSecret = process.env.ADMIN_JWT_SECRET || ""
  if (apiToken && bearer === apiToken) return false
  if (jwtSecret && verifyJwt(bearer, jwtSecret)) return false
  return true
}

export async function POST(req: Request) {
  try {
    const auth = req.headers.get("authorization")
    if (unauthorized(auth)) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || ""
    if (!bucket) return new Response(JSON.stringify({ error: "Server not configured" }), { status: 500 })
    const fd = await req.formData()
    const file = fd.get("file") as File | null
    const prefix = (fd.get("prefix") as string) || "programs"
    if (!file) return new Response(JSON.stringify({ error: "No file" }), { status: 400 })
    const buf = Buffer.from(await file.arrayBuffer())
    const nameSafe = (file.name || `image-${Date.now()}`).replace(/[^A-Za-z0-9._-]/g, "_")
    const objectName = `${prefix}/${Date.now()}-${nameSafe}`
    const token = await getAccessToken()
    const url = `https://www.googleapis.com/upload/storage/v1/b/${encodeURIComponent(bucket)}/o?uploadType=media&name=${encodeURIComponent(objectName)}`
    const up = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": file.type || "application/octet-stream" }, body: buf })
    const meta = await up.json()
    if (!up.ok) return new Response(JSON.stringify({ error: typeof meta?.error?.message === "string" ? meta.error.message : "Upload error" }), { status: 500 })
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(objectName)}?alt=media`
    return Response.json({ ok: true, name: objectName, url: publicUrl })
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "Server error"
    return new Response(JSON.stringify({ error: msg }), { status: 500 })
  }
}
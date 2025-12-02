import { createHmac } from "crypto"

function b64url(input: Buffer | string) {
  const b64 = (input instanceof Buffer ? input.toString("base64") : Buffer.from(input).toString("base64"))
  return b64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
}

export function signJwt(payload: Record<string, any>, secret: string, expiresInSec: number) {
  const header = { alg: "HS256", typ: "JWT" }
  const now = Math.floor(Date.now() / 1000)
  const body = { ...payload, iat: now, exp: now + expiresInSec }
  const h = b64url(JSON.stringify(header))
  const p = b64url(JSON.stringify(body))
  const msg = `${h}.${p}`
  const sig = createHmac("sha256", secret).update(msg).digest()
  return `${msg}.${b64url(sig)}`
}

export function verifyJwt(token: string, secret: string) {
  const parts = token.split(".")
  if (parts.length !== 3) return null
  const [h, p, s] = parts
  const msg = `${h}.${p}`
  const expected = b64url(createHmac("sha256", secret).update(msg).digest())
  if (expected !== s) return null
  try {
    const payload = JSON.parse(Buffer.from(p.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"))
    const now = Math.floor(Date.now() / 1000)
    if (typeof payload.exp === "number" && payload.exp < now) return null
    return payload
  } catch {
    return null
  }
}
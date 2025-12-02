import { getDb } from "@/lib/mongo"
import { verifyPassword } from "@/lib/models/admin"
import { signJwt } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const username = (body?.username ?? "").toString().trim()
    const password = (body?.password ?? "").toString()
    if (!username || !password) {
      return new Response(JSON.stringify({ error: "Missing credentials" }), { status: 400 })
    }

    const db = await getDb()
    const col = db.collection("Admins")
    const admin = await col.findOne({ username })
    if (!admin) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 })
    }

    const ok = verifyPassword(password, admin.password)
    if (!ok) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 })
    }

    const secret = process.env.ADMIN_JWT_SECRET || ""
    if (!secret) {
      return new Response(JSON.stringify({ error: "Server not configured" }), { status: 500 })
    }
    const token = signJwt({ sub: admin._id?.toString?.(), username }, secret, 60 * 60 * 8)
    return Response.json({ token })
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "Server error"
    return new Response(JSON.stringify({ error: msg }), { status: 500 })
  }
}
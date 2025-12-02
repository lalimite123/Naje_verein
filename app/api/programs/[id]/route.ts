import { getDb } from "@/lib/mongo"

async function unauthorized(req: Request) {
  const auth = req.headers.get("authorization") || ""
  if (!auth.startsWith("Bearer ")) return true
  const bearer = auth.slice(7)
  const apiToken = process.env.ADMIN_API_TOKEN || ""
  const jwtSecret = process.env.ADMIN_JWT_SECRET || ""
  if (apiToken && bearer === apiToken) return false
  if (jwtSecret) {
    try {
      const { verifyJwt } = await import("@/lib/auth")
      return !verifyJwt(bearer, jwtSecret)
    } catch {
      return true
    }
  }
  return true
}

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params
    const db = await getDb()
    const col = db.collection("Programs")
    const { ObjectId } = await import("mongodb")
    const item = await col.findOne({ _id: new ObjectId(id) })
    if (!item) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 })
    return Response.json(item)
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "Server error"
    return new Response(JSON.stringify({ error: msg }), { status: 500 })
  }
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    if (await unauthorized(req)) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })

    const body = await req.json()
    const updates: Record<string, any> = {}
    ;["title", "summary", "date", "time", "location", "organizer", "type", "image"].forEach((k) => {
      if (body?.[k] !== undefined) updates[k] = body[k]
    })
    updates.updatedAt = new Date()

    const { id } = await ctx.params
    const db = await getDb()
    const col = db.collection("Programs")
    const { ObjectId } = await import("mongodb")
    const res = await col.updateOne({ _id: new ObjectId(id) }, { $set: updates })
    if (!res.matchedCount) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 })
    return Response.json({ ok: true })
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "Server error"
    return new Response(JSON.stringify({ error: msg }), { status: 500 })
  }
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    if (await unauthorized(req)) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    const { id } = await ctx.params
    const db = await getDb()
    const col = db.collection("Programs")
    const { ObjectId } = await import("mongodb")
    const res = await col.deleteOne({ _id: new ObjectId(id) })
    if (!res.deletedCount) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 })
    return Response.json({ ok: true })
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "Server error"
    return new Response(JSON.stringify({ error: msg }), { status: 500 })
  }
}
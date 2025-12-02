import { verifyJwt } from '@/lib/auth'
import { FirebaseStorageService } from '@/lib/firebase/storage-service'

function unauthorized(auth: string | null) {
  if (!auth || !auth.startsWith('Bearer ')) return true
  const bearer = auth.slice(7)
  const apiToken = process.env.ADMIN_API_TOKEN || ''
  const jwtSecret = process.env.ADMIN_JWT_SECRET || ''
  if (apiToken && bearer === apiToken) return false
  if (jwtSecret && verifyJwt(bearer, jwtSecret)) return false
  return true
}

function derivePathFromUrl(url: string, bucket: string) {
  try {
    if (url.includes('storage.googleapis.com')) {
      const prefix = `https://storage.googleapis.com/${bucket}/`
      if (url.startsWith(prefix)) return decodeURIComponent(url.slice(prefix.length))
    }
    if (url.includes('firebasestorage.googleapis.com')) {
      const marker = `/o/`
      const idx = url.indexOf(marker)
      if (idx !== -1) {
        const rest = url.slice(idx + marker.length)
        const pathEnc = rest.split('?')[0]
        return decodeURIComponent(pathEnc)
      }
    }
  } catch {}
  return ''
}

export async function POST(req: Request) {
  const auth = req.headers.get('authorization')
  if (unauthorized(auth)) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || ''
  if (!bucket) return new Response(JSON.stringify({ error: 'Bucket not configured' }), { status: 500 })
  let payload: any = {}
  try {
    payload = await req.json()
  } catch {}
  const url: string = String(payload?.url || '')
  const pathFromBody: string = String(payload?.path || '')
  const path = pathFromBody || (url ? derivePathFromUrl(url, bucket) : '')
  if (!path) return new Response(JSON.stringify({ error: 'No path' }), { status: 400 })
  try {
    await FirebaseStorageService.deleteImage(path)
    return Response.json({ ok: true, path })
  } catch (e: any) {
    const msg = typeof e?.message === 'string' ? e.message : 'Delete error'
    return new Response(JSON.stringify({ error: msg }), { status: 500 })
  }
}
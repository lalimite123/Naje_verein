import { verifyJwt } from '@/lib/auth'
import { FirebaseStorageService } from '@/lib/firebase/storage-service'
import { v4 as uuidv4 } from 'uuid'
import sharp from 'sharp'

function unauthorized(auth: string | null) {
  if (!auth || !auth.startsWith('Bearer ')) return true
  const bearer = auth.slice(7)
  const apiToken = process.env.ADMIN_API_TOKEN || ''
  const jwtSecret = process.env.ADMIN_JWT_SECRET || ''
  if (apiToken && bearer === apiToken) return false
  if (jwtSecret && verifyJwt(bearer, jwtSecret)) return false
  return true
}

export async function POST(req: Request) {
  const auth = req.headers.get('authorization')
  if (unauthorized(auth)) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  const fd = await req.formData()
  const file = fd.get('file') as File | null
  const name = (fd.get('name') as string) || (file?.name || `image-${Date.now()}`)
  const previous = (fd.get('previous') as string) || ''
  if (!file) return new Response(JSON.stringify({ error: 'No file' }), { status: 400 })
  const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || ''
  if (!bucket) return new Response(JSON.stringify({ error: 'Bucket not configured' }), { status: 500 })
  const arrayBuffer = await file.arrayBuffer()
  const input = Buffer.from(arrayBuffer)
  const imageId = uuidv4()
  const originalBuffer = await sharp(input).rotate().jpeg({ quality: 85 }).toBuffer()
  const thumbnailBuffer = await sharp(input).rotate().resize(180, 180, { fit: 'cover' }).webp({ quality: 80 }).toBuffer()
  const previewBuffer = await sharp(input).rotate().resize(480, 480, { fit: 'inside' }).webp({ quality: 80 }).toBuffer()
  const uploaded = await FirebaseStorageService.uploadOptimizedImages(originalBuffer, thumbnailBuffer, previewBuffer, name, imageId)
  // Optional cleanup of previous image
  if (previous) {
    try {
      const path = derivePathFromUrl(previous, bucket)
      if (path) await FirebaseStorageService.deleteImage(path)
    } catch {}
  }
  return Response.json({ ok: true, id: imageId, original: uploaded.original, thumbnail: uploaded.thumbnail, preview: uploaded.preview })
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
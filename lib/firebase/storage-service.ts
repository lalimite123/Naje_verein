import { adminStorage } from '@/lib/firebase/config'
import { v4 as uuidv4 } from 'uuid'

export interface FirebaseUploadResult {
  url: string
  path: string
  downloadURL: string
}

export class FirebaseStorageService {
  private static readonly BUCKET_NAME = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string

  static async uploadImage(buffer: Buffer, fileName: string, contentType: string, folder: string = 'programs'): Promise<FirebaseUploadResult> {
    const fileId = uuidv4()
    const timestamp = Date.now()
    const safeName = fileName.replace(/[^A-Za-z0-9._-]/g, '_')
    const path = `${folder}/${timestamp}-${fileId}-${safeName}`
    const bucket = adminStorage.bucket(this.BUCKET_NAME)
    const file = bucket.file(path)
    await file.save(buffer, { metadata: { contentType, cacheControl: 'public, max-age=31536000, immutable', metadata: { firebaseStorageDownloadTokens: fileId } } })
    await file.makePublic()
    const downloadURL = `https://storage.googleapis.com/${this.BUCKET_NAME}/${path}`
    return { url: downloadURL, path, downloadURL }
  }

  static async deleteImage(path: string): Promise<void> {
    const bucket = adminStorage.bucket(this.BUCKET_NAME)
    const file = bucket.file(path)
    const [exists] = await file.exists()
    if (!exists) return
    await file.delete()
  }

  static async uploadOptimizedImages(originalBuffer: Buffer, thumbnailBuffer: Buffer, previewBuffer: Buffer, originalFileName: string, imageId: string): Promise<{ original: FirebaseUploadResult; thumbnail: FirebaseUploadResult; preview: FirebaseUploadResult }> {
    const baseFolder = `programs/${imageId}`
    const original = await this.uploadImage(originalBuffer, `original_${originalFileName}`, 'image/jpeg', baseFolder)
    const thumbnail = await this.uploadImage(thumbnailBuffer, `thumbnail_180x180.webp`, 'image/webp', baseFolder)
    const preview = await this.uploadImage(previewBuffer, `preview_480x480.webp`, 'image/webp', baseFolder)
    return { original, thumbnail, preview }
  }

  static async cleanupImages(paths: string[]): Promise<void> {
    const bucket = adminStorage.bucket(this.BUCKET_NAME)
    for (const path of paths) {
      try {
        await bucket.file(path).delete()
      } catch {}
    }
  }
}
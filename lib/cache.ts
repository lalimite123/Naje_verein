type CacheValue = any

class MemoryCache {
  private map = new Map<string, { at: number; ttl: number; val: CacheValue }>()
  async get(key: string): Promise<CacheValue | null> {
    const e = this.map.get(key)
    if (!e) return null
    if (Date.now() - e.at > e.ttl) {
      this.map.delete(key)
      return null
    }
    return e.val
  }
  async set(key: string, val: CacheValue, ttlMs: number): Promise<void> {
    this.map.set(key, { at: Date.now(), ttl: ttlMs, val })
  }
  async del(key: string): Promise<void> {
    this.map.delete(key)
  }
  async clear(): Promise<void> {
    this.map.clear()
  }
}

async function upstashGet(url: string, token: string, key: string): Promise<CacheValue | null> {
  try {
    const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    if (!res.ok) return null
    const data = await res.json().catch(() => null)
    if (!data || data.result === null || data.result === undefined) return null
    try {
      return JSON.parse(data.result)
    } catch {
      return data.result
    }
  } catch {
    return null
  }
}

async function upstashSet(url: string, token: string, key: string, val: CacheValue, ttlSec: number): Promise<void> {
  try {
    const payload = typeof val === 'string' ? val : JSON.stringify(val)
    await fetch(`${url}/set/${encodeURIComponent(key)}/${encodeURIComponent(payload)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    if (ttlSec > 0) {
      await fetch(`${url}/expire/${encodeURIComponent(key)}/${ttlSec}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      })
    }
  } catch {}
}

export class Cache {
  private mem = (globalThis as any).__memCache || new MemoryCache()
  private upstashUrl = process.env.REDIS_URL || ''
  private upstashToken = process.env.REDIS_PASSWORD || ''
  constructor() {
    ;(globalThis as any).__memCache = this.mem
  }
  private hasUpstash(): boolean {
    return this.upstashUrl.startsWith('https://') && !!this.upstashToken
  }
  async get(key: string): Promise<CacheValue | null> {
    if (this.hasUpstash()) {
      const v = await upstashGet(this.upstashUrl, this.upstashToken, key)
      if (v !== null) return v
    }
    return this.mem.get(key)
  }
  async set(key: string, val: CacheValue, ttlMs: number): Promise<void> {
    if (this.hasUpstash()) {
      await upstashSet(this.upstashUrl, this.upstashToken, key, val, Math.floor(ttlMs / 1000))
    }
    await this.mem.set(key, val, ttlMs)
  }
  async del(key: string): Promise<void> {
    await this.mem.del(key)
  }
  async clear(): Promise<void> {
    await this.mem.clear()
  }
}
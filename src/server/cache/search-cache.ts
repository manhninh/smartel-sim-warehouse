import crypto from 'node:crypto'
import { ensureRedisConnected, redis } from '@/server/cache/redis'
import { env } from '@/server/utils/env'

export function buildSearchCacheKey(input: unknown) {
  const hash = crypto.createHash('sha1').update(JSON.stringify(input)).digest('hex')
  return `sim-search:compact:${hash}`
}

export async function getSearchCache<T>(key: string): Promise<T | null> {
  if (!env.cacheEnabled) return null
  await ensureRedisConnected()
  if (!redis.isOpen) return null

  const value = await redis.get(key)
  return value ? (JSON.parse(value) as T) : null
}

export async function setSearchCache<T>(key: string, value: T) {
  if (!env.cacheEnabled) return
  await ensureRedisConnected()
  if (!redis.isOpen) return

  await redis.set(key, JSON.stringify(value), { EX: env.cacheTtlSeconds })
}

export async function invalidateCompactSearchCache() {
  if (!env.cacheEnabled) return
  await ensureRedisConnected()
  if (!redis.isOpen) return

  const iterator = redis.scanIterator({ MATCH: 'sim-search:compact:*', COUNT: 200 })
  for await (const keys of iterator) {
    if (Array.isArray(keys) && keys.length > 0) {
      await redis.del(keys)
    }
  }
}

import crypto from 'node:crypto'
import { redis } from '@/server/cache/redis'
import { env } from '@/server/utils/env'

export function buildSearchCacheKey(input: unknown) {
  const hash = crypto.createHash('sha1').update(JSON.stringify(input)).digest('hex')
  return `sim-search:compact:${hash}`
}

export async function getSearchCache<T>(key: string): Promise<T | null> {
  const value = await redis.get(key)
  return value ? (JSON.parse(value) as T) : null
}

export async function setSearchCache<T>(key: string, value: T) {
  await redis.set(key, JSON.stringify(value), { EX: env.cacheTtlSeconds })
}

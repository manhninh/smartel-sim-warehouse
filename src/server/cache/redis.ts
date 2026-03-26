import { createClient } from 'redis'
import { env } from '@/server/utils/env'

const globalForRedis = globalThis as unknown as {
  redisClient?: ReturnType<typeof createClient>
}

export const redis = globalForRedis.redisClient ?? createClient({ url: env.redisUrl })

if (!globalForRedis.redisClient) {
  globalForRedis.redisClient = redis
}

let didConnect = false

export async function ensureRedisConnected() {
  if (!env.cacheEnabled || didConnect || redis.isOpen) return
  try {
    await redis.connect()
    didConnect = true
  } catch (error) {
    console.error('Redis connect error', error)
  }
}

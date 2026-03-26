import { createClient } from 'redis'
import { env } from '@/server/utils/env'

const globalForRedis = globalThis as unknown as {
  redisClient?: ReturnType<typeof createClient>
}

export const redis = globalForRedis.redisClient ?? createClient({ url: env.redisUrl })

if (!globalForRedis.redisClient) {
  globalForRedis.redisClient = redis
  redis.connect().catch((error) => {
    console.error('Redis connect error', error)
  })
}

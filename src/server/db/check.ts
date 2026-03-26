import 'reflect-metadata'
import { AppDataSource } from '@/server/db/data-source'
import { ensureRedisConnected, redis } from '@/server/cache/redis'

async function main() {
  await AppDataSource.initialize()
  await AppDataSource.query('SELECT 1')
  console.log('DB OK')

  await ensureRedisConnected()
  if (redis.isOpen) {
    await redis.ping()
    console.log('Redis OK')
  } else {
    console.log('Redis disabled or unavailable')
  }

  await AppDataSource.destroy()
  if (redis.isOpen) await redis.quit()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

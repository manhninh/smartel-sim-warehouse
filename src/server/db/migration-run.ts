import 'reflect-metadata'
import { AppDataSource } from '@/server/db/data-source'

async function main() {
  await AppDataSource.initialize()
  const result = await AppDataSource.runMigrations()
  console.log(`Đã chạy ${result.length} migration`) 
  await AppDataSource.destroy()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

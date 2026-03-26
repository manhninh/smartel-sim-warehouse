import 'reflect-metadata'
import { AppDataSource } from '@/server/db/data-source'

async function main() {
  await AppDataSource.initialize()
  await AppDataSource.undoLastMigration()
  console.log('Đã revert migration gần nhất')
  await AppDataSource.destroy()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

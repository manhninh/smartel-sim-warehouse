import 'reflect-metadata'
import { getDataSource } from '@/server/db/data-source'
import { User } from '@/server/entities/User'
import { hashPassword } from '@/server/auth/password'
import { env } from '@/server/utils/env'

async function main() {
  const db = await getDataSource()
  const repo = db.getRepository(User)
  const existing = await repo.findOne({ where: { username: env.admin.username } })
  if (existing) {
    console.log('Admin already exists')
    process.exit(0)
  }

  const passwordHash = await hashPassword(env.admin.password)
  await repo.save({
    username: env.admin.username,
    passwordHash,
    apiKey: env.admin.apiKey,
    role: 'ADMIN',
    fullName: env.admin.fullName,
    dealerId: null,
    isActive: true,
  })

  console.log('Seed admin done')
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

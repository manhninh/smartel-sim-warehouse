import { getDataSource } from '@/server/db/data-source'
import { User } from '@/server/entities/User'

export async function findUserByUsername(username: string) {
  const db = await getDataSource()
  return db.getRepository(User).findOne({ where: { username } })
}

export async function findUserByApiKey(apiKey: string) {
  const db = await getDataSource()
  return db.getRepository(User).findOne({ where: { apiKey } })
}

export async function findUserById(id: number) {
  const db = await getDataSource()
  return db.getRepository(User).findOne({ where: { id } })
}

import { IsNull } from 'typeorm'
import { addSeconds } from '@/server/utils/time'
import { getDataSource } from '@/server/db/data-source'
import { RefreshToken } from '@/server/entities/RefreshToken'
import { env } from '@/server/utils/env'

export async function createRefreshTokenRecord(userId: number, tokenHash: string) {
  const db = await getDataSource()
  return db.getRepository(RefreshToken).save({
    userId,
    tokenHash,
    expiresAt: addSeconds(new Date(), env.jwt.refreshTtlSeconds),
    revokedAt: null,
  })
}

export async function findActiveRefreshTokensByUser(userId: number) {
  const db = await getDataSource()
  return db.getRepository(RefreshToken).find({ where: { userId, revokedAt: IsNull() } })
}

export async function revokeRefreshTokenById(id: number) {
  const db = await getDataSource()
  await db.getRepository(RefreshToken).update({ id }, { revokedAt: new Date() })
}

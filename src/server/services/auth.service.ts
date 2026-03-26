import { findUserById, findUserByUsername } from '@/server/repositories/user.repository'
import {
  createRefreshTokenRecord,
  findActiveRefreshTokensByUser,
  revokeRefreshTokenById,
} from '@/server/repositories/refresh-token.repository'
import { verifyPassword } from '@/server/auth/password'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '@/server/auth/tokens'
import { sha256 } from '@/server/utils/hash'
import { env } from '@/server/utils/env'
import type { JwtUserPayload } from '@/types'

function toPayload(input: { id: number; username: string; role: 'ADMIN' | 'DEALER' | 'CUSTOMER' }): JwtUserPayload {
  return { sub: String(input.id), username: input.username, role: input.role }
}

export async function loginByUsernamePassword(username: string, password: string) {
  const user = await findUserByUsername(username)
  if (!user || !user.isActive) throw new Error('INVALID_CREDENTIALS')

  const ok = await verifyPassword(password, user.passwordHash)
  if (!ok) throw new Error('INVALID_CREDENTIALS')

  const payload = toPayload({ id: user.id, username: user.username, role: user.role })
  const accessToken = await signAccessToken(payload)
  const refreshToken = await signRefreshToken(payload)
  await createRefreshTokenRecord(user.id, sha256(refreshToken))

  return {
    accessToken,
    refreshToken,
    expiresIn: env.jwt.accessTtlSeconds,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      fullName: user.fullName,
      apiKey: user.apiKey,
    },
  }
}

export async function refreshUserSession(refreshToken: string) {
  const payload = await verifyRefreshToken(refreshToken)
  const userId = Number(payload.sub)
  const tokens = await findActiveRefreshTokensByUser(userId)
  const matched = tokens.find((item) => item.tokenHash === sha256(refreshToken) && item.expiresAt > new Date())
  if (!matched) throw new Error('INVALID_REFRESH_TOKEN')

  await revokeRefreshTokenById(matched.id)
  const user = await findUserById(userId)
  if (!user || !user.isActive) throw new Error('INVALID_REFRESH_TOKEN')

  const nextPayload = toPayload({ id: user.id, username: user.username, role: user.role })
  const nextAccessToken = await signAccessToken(nextPayload)
  const nextRefreshToken = await signRefreshToken(nextPayload)
  await createRefreshTokenRecord(user.id, sha256(nextRefreshToken))

  return {
    accessToken: nextAccessToken,
    refreshToken: nextRefreshToken,
    expiresIn: env.jwt.accessTtlSeconds,
  }
}

export async function logoutByRefreshToken(refreshToken: string) {
  const payload = await verifyRefreshToken(refreshToken)
  const userId = Number(payload.sub)
  const tokens = await findActiveRefreshTokensByUser(userId)
  const matched = tokens.find((item) => item.tokenHash === sha256(refreshToken))
  if (matched) {
    await revokeRefreshTokenById(matched.id)
  }
  return { success: true }
}

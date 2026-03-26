import { SignJWT, jwtVerify } from 'jose'
import type { JwtUserPayload } from '@/types'
import { env } from '@/server/utils/env'

const accessSecret = new TextEncoder().encode(env.jwt.accessSecret)
const refreshSecret = new TextEncoder().encode(env.jwt.refreshSecret)

export async function signAccessToken(user: JwtUserPayload) {
  return new SignJWT(user)
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(user.sub))
    .setIssuedAt()
    .setExpirationTime(`${env.jwt.accessTtlSeconds}s`)
    .sign(accessSecret)
}

export async function signRefreshToken(user: JwtUserPayload) {
  return new SignJWT(user)
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(user.sub))
    .setIssuedAt()
    .setExpirationTime(`${env.jwt.refreshTtlSeconds}s`)
    .sign(refreshSecret)
}

export async function verifyAccessToken(token: string) {
  const result = await jwtVerify<JwtUserPayload>(token, accessSecret)
  return result.payload
}

export async function verifyRefreshToken(token: string) {
  const result = await jwtVerify<JwtUserPayload>(token, refreshSecret)
  return result.payload
}

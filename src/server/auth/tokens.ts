import { SignJWT, jwtVerify } from 'jose'
import type { JwtUserPayload } from '@/types'
import { env } from '@/server/utils/env'

const accessSecret = new TextEncoder().encode(env.jwt.accessSecret)
const refreshSecret = new TextEncoder().encode(env.jwt.refreshSecret)

export async function signAccessToken(user: JwtUserPayload) {
  return new SignJWT({ username: user.username, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.sub)
    .setIssuedAt()
    .setExpirationTime(`${env.jwt.accessTtlSeconds}s`)
    .sign(accessSecret)
}

export async function signRefreshToken(user: JwtUserPayload) {
  return new SignJWT({ username: user.username, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.sub)
    .setIssuedAt()
    .setExpirationTime(`${env.jwt.refreshTtlSeconds}s`)
    .sign(refreshSecret)
}

export async function verifyAccessToken(token: string): Promise<JwtUserPayload> {
  const result = await jwtVerify(token, accessSecret)
  return {
    sub: String(result.payload.sub),
    username: String(result.payload.username),
    role: result.payload.role as JwtUserPayload['role'],
  }
}

export async function verifyRefreshToken(token: string): Promise<JwtUserPayload> {
  const result = await jwtVerify(token, refreshSecret)
  return {
    sub: String(result.payload.sub),
    username: String(result.payload.username),
    role: result.payload.role as JwtUserPayload['role'],
  }
}

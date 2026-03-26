import { NextRequest } from 'next/server'
import { verifyAccessToken } from '@/server/auth/tokens'

export async function requireAccessUser(request: NextRequest) {
  const header = request.headers.get('authorization')
  if (!header?.startsWith('Bearer ')) {
    throw new Error('UNAUTHORIZED')
  }

  const token = header.slice('Bearer '.length)
  return verifyAccessToken(token)
}

export function requireAdminUsername(username: string) {
  if (username !== 'admin') {
    throw new Error('FORBIDDEN')
  }
}

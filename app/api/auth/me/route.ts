import { NextRequest } from 'next/server'
import { requireAccessUser } from '@/server/auth/guards'
import { errorJson, okJson } from '@/server/utils/api-response'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAccessUser(request)
    return okJson({ user })
  } catch {
    return errorJson('Unauthorized', 401)
  }
}

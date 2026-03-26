import { refreshSchema } from '@/server/validators/auth.validator'
import { refreshUserSession } from '@/server/services/auth.service'
import { errorJson, okJson } from '@/server/utils/api-response'

export async function POST(request: Request) {
  try {
    const body = refreshSchema.parse(await request.json())
    const result = await refreshUserSession(body.refreshToken)
    return okJson(result)
  } catch {
    return errorJson('Refresh token không hợp lệ', 401)
  }
}

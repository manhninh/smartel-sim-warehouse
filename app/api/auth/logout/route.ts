import { refreshSchema } from '@/server/validators/auth.validator'
import { logoutByRefreshToken } from '@/server/services/auth.service'
import { errorJson, okJson } from '@/server/utils/api-response'

export async function POST(request: Request) {
  try {
    const body = refreshSchema.parse(await request.json())
    const result = await logoutByRefreshToken(body.refreshToken)
    return okJson(result)
  } catch {
    return errorJson('Logout thất bại', 400)
  }
}

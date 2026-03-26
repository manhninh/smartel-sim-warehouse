import { loginSchema } from '@/server/validators/auth.validator'
import { loginByUsernamePassword } from '@/server/services/auth.service'
import { errorJson, okJson } from '@/server/utils/api-response'

export async function POST(request: Request) {
  try {
    const body = loginSchema.parse(await request.json())
    const result = await loginByUsernamePassword(body.username, body.password)
    return okJson(result)
  } catch (error) {
    if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
      return errorJson('Sai tài khoản hoặc mật khẩu', 401)
    }
    return errorJson('Login thất bại', 400)
  }
}

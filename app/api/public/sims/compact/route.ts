import { NextRequest } from 'next/server'
import { compactSearchSchema } from '@/server/validators/search.validator'
import { getCompactSimSearch } from '@/server/services/public-search.service'
import { findUserByApiKey } from '@/server/repositories/user.repository'
import { errorJson, okJson } from '@/server/utils/api-response'

export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key')
    if (!apiKey) return errorJson('Thiếu x-api-key', 401)

    const customer = await findUserByApiKey(apiKey)
    if (!customer || !customer.isActive) return errorJson('API key không hợp lệ', 401)

    const query = compactSearchSchema.parse({
      q: request.nextUrl.searchParams.get('q'),
      inventoryId: request.nextUrl.searchParams.get('inventoryId') ?? undefined,
      dealerId: request.nextUrl.searchParams.get('dealerId') ?? undefined,
      categoryId: request.nextUrl.searchParams.get('categoryId') ?? undefined,
      minPrice: request.nextUrl.searchParams.get('minPrice') ?? undefined,
      maxPrice: request.nextUrl.searchParams.get('maxPrice') ?? undefined,
    })

    const result = await getCompactSimSearch(query)

    return okJson(result)
  } catch {
    return errorJson('Search thất bại', 400)
  }
}

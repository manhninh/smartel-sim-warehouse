import { NextRequest } from 'next/server'
import { requireAccessUser, requireAdminUsername } from '@/server/auth/guards'
import { updatePriceSchema } from '@/server/validators/price.validator'
import { changeListingPrice } from '@/server/services/admin-price.service'
import { errorJson, okJson } from '@/server/utils/api-response'

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAccessUser(request)
    requireAdminUsername(session.username)

    const params = await context.params
    const body = updatePriceSchema.parse(await request.json())

    const result = await changeListingPrice({
      listingId: Number(params.id),
      purchasePrice: body.purchasePrice,
      salePrice: body.salePrice,
      changedByUserId: Number(session.sub),
    })

    return okJson(result)
  } catch (error) {
    if (error instanceof Error && error.message === 'FORBIDDEN') {
      return errorJson('Không có quyền', 403)
    }
    return errorJson('Cập nhật giá thất bại', 400)
  }
}

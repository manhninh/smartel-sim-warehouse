import { NextRequest } from 'next/server'
import { requireAccessUser, requireAdminUsername } from '@/server/auth/guards'
import { importExcel } from '@/server/services/import-excel.service'
import { errorJson, okJson } from '@/server/utils/api-response'

export async function POST(request: NextRequest) {
  try {
    const session = await requireAccessUser(request)
    requireAdminUsername(session.username, session.role)

    const form = await request.formData()
    const dealerId = Number(form.get('dealerId'))
    const inventoryId = Number(form.get('inventoryId'))
    const inventoryCategoryId = Number(form.get('inventoryCategoryId'))
    const file = form.get('file')

    if (!(file instanceof File)) {
      return errorJson('Thiếu file import', 400)
    }

    const result = await importExcel({
      userId: Number(session.sub),
      dealerId,
      inventoryId,
      inventoryCategoryId,
      fileName: file.name,
      fileBuffer: new Uint8Array(await file.arrayBuffer()),
    })

    return okJson(result)
  } catch (error) {
    if (error instanceof Error && error.message === 'FORBIDDEN') {
      return errorJson('Không có quyền', 403)
    }
    return errorJson('Import thất bại', 400)
  }
}

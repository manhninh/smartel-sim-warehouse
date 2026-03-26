import { createImportBatch } from '@/server/repositories/import-batch.repository'

export async function importExcelStub(input: {
  userId: number
  dealerId: number
  inventoryId: number
  inventoryCategoryId: number
  fileName: string
}) {
  const batch = await createImportBatch({
    userId: input.userId,
    dealerId: input.dealerId,
    inventoryId: input.inventoryId,
    inventoryCategoryId: input.inventoryCategoryId,
    fileName: input.fileName,
    totalRows: 0,
    successRows: 0,
    errorRows: 0,
    status: 'completed',
    finishedAt: new Date(),
  })

  return {
    batchId: batch.id,
    message: 'Stub import thành công. AI Agent cần thay phần này bằng parser exceljs thực tế.',
  }
}

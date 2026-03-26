import { getDataSource } from '@/server/db/data-source'
import { ImportBatch } from '@/server/entities/ImportBatch'

export async function createImportBatch(input: Omit<ImportBatch, 'id' | 'createdAt'>) {
  const db = await getDataSource()
  return db.getRepository(ImportBatch).save(input)
}

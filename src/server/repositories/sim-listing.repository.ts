import { getDataSource } from '@/server/db/data-source'
import { SimListing } from '@/server/entities/SimListing'

export async function findListingById(id: number) {
  const db = await getDataSource()
  return db.getRepository(SimListing).findOne({ where: { id } })
}

export async function updateListingPrice(id: number, purchasePrice: number, salePrice: number) {
  const db = await getDataSource()
  await db.getRepository(SimListing).update(
    { id },
    { purchasePrice: purchasePrice.toFixed(2), salePrice: salePrice.toFixed(2) },
  )
}

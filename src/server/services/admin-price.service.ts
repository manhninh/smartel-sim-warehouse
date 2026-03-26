import { getDataSource } from '@/server/db/data-source'
import { PriceHistory } from '@/server/entities/PriceHistory'
import { findListingById, updateListingPrice } from '@/server/repositories/sim-listing.repository'
import { invalidateCompactSearchCache } from '@/server/cache/search-cache'

export async function changeListingPrice(input: {
  listingId: number
  purchasePrice: number
  salePrice: number
  changedByUserId: number
}) {
  const listing = await findListingById(input.listingId)
  if (!listing) throw new Error('LISTING_NOT_FOUND')

  await updateListingPrice(input.listingId, input.purchasePrice, input.salePrice)

  const db = await getDataSource()
  await db.getRepository(PriceHistory).save({
    simListingId: listing.id,
    oldPurchasePrice: listing.purchasePrice,
    newPurchasePrice: input.purchasePrice.toFixed(2),
    oldSalePrice: listing.salePrice,
    newSalePrice: input.salePrice.toFixed(2),
    changedByUserId: input.changedByUserId,
  })

  await invalidateCompactSearchCache()

  return { success: true }
}

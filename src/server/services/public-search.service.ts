import { buildSearchCacheKey, getSearchCache, setSearchCache } from '@/server/cache/search-cache'
import { searchCompactListings } from '@/server/repositories/sim-search.repository'

export async function getCompactSimSearch(input: { q: string; inventoryId?: number }) {
  const cacheKey = buildSearchCacheKey(input)
  const cached = await getSearchCache<Array<{ sdt: string; loai: string[] }>>(cacheKey)
  if (cached) return cached

  const rows = await searchCompactListings(input)
  const result = rows.map((row: { sdt: string; loai: string[] | null }) => ({
    sdt: String(row.sdt),
    loai: Array.isArray(row.loai) ? row.loai : [],
  }))

  await setSearchCache(cacheKey, result)
  return result
}

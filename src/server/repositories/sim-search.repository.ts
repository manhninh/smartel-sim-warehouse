import { getDataSource } from '@/server/db/data-source'

export interface CompactSearchInput {
  q: string
  inventoryId?: number
  dealerId?: number
  categoryId?: number
  minPrice?: number
  maxPrice?: number
}

export async function searchCompactListings(input: CompactSearchInput) {
  const db = await getDataSource()
  const q = input.q.replace(/\s+/g, '')

  const params: Array<string | number> = []
  const where: string[] = ["sl.status = 'available'"]

  if (q.includes('*')) {
    const [prefix = '', suffix = ''] = q.split('*')
    if (prefix) {
      params.push(`${prefix}%`)
      where.push(`sm.msisdn_digits LIKE $${params.length}`)
    }
    if (suffix) {
      params.push(`%${suffix}`)
      where.push(`sm.msisdn_digits LIKE $${params.length}`)
    }
  } else if (/^\d+$/.test(q)) {
    if (q.length >= 8) {
      params.push(q)
      where.push(`(sm.msisdn_digits = $${params.length} OR sm.msisdn_digits LIKE '%' || $${params.length})`)
    } else {
      params.push(`${q}%`)
      where.push(`sm.msisdn_digits LIKE $${params.length}`)
    }
  } else {
    params.push(`%${q}%`)
    where.push(`sm.msisdn_digits LIKE $${params.length}`)
  }

  if (input.inventoryId) {
    params.push(input.inventoryId)
    where.push(`sl.inventory_id = $${params.length}`)
  }

  if (input.dealerId) {
    params.push(input.dealerId)
    where.push(`sl.dealer_id = $${params.length}`)
  }

  if (input.categoryId) {
    params.push(input.categoryId)
    where.push(`sl.category_id = $${params.length}`)
  }

  if (input.minPrice !== undefined) {
    params.push(input.minPrice)
    where.push(`sl.sale_price >= $${params.length}`)
  }

  if (input.maxPrice !== undefined) {
    params.push(input.maxPrice)
    where.push(`sl.sale_price <= $${params.length}`)
  }

  const sql = `
    SELECT
      sm.msisdn_digits AS sdt,
      COALESCE(sl.tags_json, '[]'::jsonb) AS loai
    FROM sim_listings sl
    INNER JOIN sim_masters sm ON sm.id = sl.sim_master_id
    WHERE ${where.join(' AND ')}
    ORDER BY sl.updated_at DESC
    LIMIT 100
  `

  return db.query(sql, params)
}

import { getDataSource } from '@/server/db/data-source'

export async function searchCompactListings(input: { q: string; inventoryId?: number }) {
  const db = await getDataSource()
  const q = input.q.replace(/\s+/g, '')
  const inventoryClause = input.inventoryId ? 'AND sl.inventory_id = $2' : ''
  const params: Array<string | number> = [q]
  if (input.inventoryId) params.push(input.inventoryId)

  let whereSql = `sm.msisdn_digits LIKE '%' || $1`

  if (q.includes('*')) {
    const [prefix, suffix] = q.split('*')
    params.length = 0
    params.push(prefix, suffix)
    if (input.inventoryId) params.push(input.inventoryId)
    whereSql = `sm.msisdn_digits LIKE $1 || '%' AND sm.msisdn_digits LIKE '%' || $2`
  } else if (/^\d+$/.test(q) && q.length >= 8) {
    whereSql = `sm.msisdn_digits = $1 OR sm.msisdn_digits LIKE '%' || $1`
  }

  const inventoryParamSql = input.inventoryId ? ' AND sl.inventory_id = $3' : ''
  const sql = `
    SELECT
      sm.msisdn_digits AS sdt,
      sl.tags_json AS loai
    FROM sim_listings sl
    INNER JOIN sim_masters sm ON sm.id = sl.sim_master_id
    WHERE sl.status = 'available'
      AND ${whereSql}
      ${q.includes('*') ? inventoryParamSql : input.inventoryId ? inventoryClause : ''}
    ORDER BY sl.updated_at DESC
    LIMIT 100
  `

  return db.query(sql, params)
}

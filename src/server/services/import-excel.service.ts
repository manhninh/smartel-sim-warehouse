import { Buffer } from 'node:buffer'
import ExcelJS from 'exceljs'
import { getDataSource } from '@/server/db/data-source'
import { ImportBatch } from '@/server/entities/ImportBatch'
import { SimListing } from '@/server/entities/SimListing'
import { SimMaster } from '@/server/entities/SimMaster'
import { invalidateCompactSearchCache } from '@/server/cache/search-cache'

interface ImportExcelInput {
  userId: number
  dealerId: number
  inventoryId: number
  inventoryCategoryId: number
  fileName: string
  fileBuffer: Uint8Array
}

function normalizeMsisdn(value: unknown) {
  const digits = String(value ?? '').replace(/\D+/g, '')
  return digits
}

function normalizeLoai(value: unknown) {
  if (!value) return []
  return String(value)
    .split(/[;,|]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function getCellValue(row: ExcelJS.Row, indexByHeader: Map<string, number>, headerKeys: string[]) {
  for (const key of headerKeys) {
    const idx = indexByHeader.get(key)
    if (!idx) continue
    const cell = row.getCell(idx)
    return cell.text?.trim() || cell.value
  }
  return null
}

export async function importExcel(input: ImportExcelInput) {
  const db = await getDataSource()

  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(Buffer.from(input.fileBuffer) as never)
  const worksheet = workbook.worksheets[0]
  if (!worksheet) throw new Error('INVALID_EXCEL')

  const batch = await db.getRepository(ImportBatch).save({
    userId: input.userId,
    dealerId: input.dealerId,
    inventoryId: input.inventoryId,
    inventoryCategoryId: input.inventoryCategoryId,
    fileName: input.fileName,
    totalRows: Math.max(worksheet.rowCount - 1, 0),
    successRows: 0,
    errorRows: 0,
    status: 'processing',
    finishedAt: null,
  })

  const headerRow = worksheet.getRow(1)
  const indexByHeader = new Map<string, number>()
  headerRow.eachCell((cell, colNumber) => {
    const key = String(cell.text || cell.value || '')
      .trim()
      .toLowerCase()
    if (key) indexByHeader.set(key, colNumber)
  })

  const msisdnHeaderKeys = ['sdt', 'msisdn', 'sim', 'so_thue_bao', 'so']
  const purchaseHeaderKeys = ['gia_nhap', 'purchase_price', 'gia nhap']
  const saleHeaderKeys = ['gia_ban', 'sale_price', 'gia ban']
  const loaiHeaderKeys = ['loai', 'tags', 'phan_loai']

  let successRows = 0
  let errorRows = 0

  await db.transaction(async (manager) => {
    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
      const row = worksheet.getRow(rowNumber)
      const msisdn = normalizeMsisdn(getCellValue(row, indexByHeader, msisdnHeaderKeys))
      if (!msisdn) {
        errorRows += 1
        continue
      }

      const purchaseRaw = Number(getCellValue(row, indexByHeader, purchaseHeaderKeys) || 0)
      const saleRaw = Number(getCellValue(row, indexByHeader, saleHeaderKeys) || 0)
      const loai = normalizeLoai(getCellValue(row, indexByHeader, loaiHeaderKeys))

      const purchasePrice = Number.isFinite(purchaseRaw) ? purchaseRaw : 0
      const salePrice = Number.isFinite(saleRaw) ? saleRaw : 0

      let simMaster = await manager.getRepository(SimMaster).findOne({ where: { msisdnDigits: msisdn } })
      if (!simMaster) {
        simMaster = await manager.getRepository(SimMaster).save({
          msisdnRaw: msisdn,
          msisdnDigits: msisdn,
          msisdnReverse: msisdn.split('').reverse().join(''),
          prefix: msisdn.slice(0, 4),
          carrierCode: null,
        })
      }

      const listingRepo = manager.getRepository(SimListing)
      const existing = await listingRepo.findOne({
        where: { simMasterId: simMaster.id, inventoryId: input.inventoryId },
      })

      if (existing) {
        await listingRepo.update(
          { id: existing.id },
          {
            dealerId: input.dealerId,
            inventoryId: input.inventoryId,
            categoryId: input.inventoryCategoryId,
            purchasePrice: purchasePrice.toFixed(2),
            salePrice: salePrice.toFixed(2),
            tagsJson: loai,
            sourceSheet: worksheet.name,
            sourceRowNo: rowNumber,
            status: 'available',
          },
        )
      } else {
        await listingRepo.save({
          simMasterId: simMaster.id,
          dealerId: input.dealerId,
          inventoryId: input.inventoryId,
          categoryId: input.inventoryCategoryId,
          purchasePrice: purchasePrice.toFixed(2),
          salePrice: salePrice.toFixed(2),
          tagsJson: loai,
          sourceSheet: worksheet.name,
          sourceRowNo: rowNumber,
          reservedBy: null,
          status: 'available',
        })
      }

      successRows += 1
    }
  })

  await db.getRepository(ImportBatch).update(
    { id: batch.id },
    {
      successRows,
      errorRows,
      status: 'completed',
      finishedAt: new Date(),
    },
  )

  await invalidateCompactSearchCache()

  return {
    batchId: batch.id,
    strategy: 'update_if_exists',
    totalRows: batch.totalRows,
    successRows,
    errorRows,
  }
}

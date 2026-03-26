import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { env } from '@/server/utils/env'
import { User } from '@/server/entities/User'
import { DealerProfile } from '@/server/entities/DealerProfile'
import { InventoryCategory } from '@/server/entities/InventoryCategory'
import { Inventory } from '@/server/entities/Inventory'
import { SimMaster } from '@/server/entities/SimMaster'
import { SimListing } from '@/server/entities/SimListing'
import { PriceHistory } from '@/server/entities/PriceHistory'
import { RefreshToken } from '@/server/entities/RefreshToken'
import { ImportBatch } from '@/server/entities/ImportBatch'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  synchronize: false,
  logging: false,
  entities: [
    User,
    DealerProfile,
    InventoryCategory,
    Inventory,
    SimMaster,
    SimListing,
    PriceHistory,
    RefreshToken,
    ImportBatch,
  ],
  migrations: ['migrations/*.{ts,js}'],
})

let isInitialized = false

export async function getDataSource() {
  if (!isInitialized) {
    await AppDataSource.initialize()
    isInitialized = true
  }
  return AppDataSource
}

import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { DealerProfile } from '@/server/entities/DealerProfile'
import { Inventory } from '@/server/entities/Inventory'
import { SimMaster } from '@/server/entities/SimMaster'
import { InventoryCategory } from '@/server/entities/InventoryCategory'

@Entity({ name: 'sim_listings' })
@Index('uq_sim_listing_inventory_master', ['simMasterId', 'inventoryId'], { unique: true })
export class SimListing {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ name: 'sim_master_id', type: 'integer' })
  simMasterId!: number

  @ManyToOne(() => SimMaster)
  @JoinColumn({ name: 'sim_master_id' })
  simMaster!: SimMaster

  @Column({ name: 'dealer_id', type: 'integer' })
  dealerId!: number

  @ManyToOne(() => DealerProfile)
  @JoinColumn({ name: 'dealer_id' })
  dealer!: DealerProfile

  @Column({ name: 'inventory_id', type: 'integer' })
  inventoryId!: number

  @ManyToOne(() => Inventory)
  @JoinColumn({ name: 'inventory_id' })
  inventory!: Inventory

  @Column({ name: 'category_id', type: 'integer', nullable: true })
  categoryId!: number | null

  @ManyToOne(() => InventoryCategory, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category!: InventoryCategory | null

  @Column({ name: 'purchase_price', type: 'numeric', precision: 18, scale: 2 })
  purchasePrice!: string

  @Column({ name: 'sale_price', type: 'numeric', precision: 18, scale: 2 })
  salePrice!: string

  @Column({ type: 'varchar', default: 'available' })
  status!: string

  @Column({ name: 'reserved_by', type: 'varchar', nullable: true })
  reservedBy!: string | null

  @Column({ name: 'tags_json', type: 'jsonb', default: [] })
  tagsJson!: string[]

  @Column({ name: 'source_sheet', type: 'varchar', nullable: true })
  sourceSheet!: string | null

  @Column({ name: 'source_row_no', nullable: true, type: 'integer' })
  sourceRowNo!: number | null

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date
}

import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { DealerProfile } from '@/server/entities/DealerProfile'
import { Inventory } from '@/server/entities/Inventory'
import { SimMaster } from '@/server/entities/SimMaster'

@Entity({ name: 'sim_listings' })
export class SimListing {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ name: 'sim_master_id' })
  simMasterId!: number

  @ManyToOne(() => SimMaster)
  @JoinColumn({ name: 'sim_master_id' })
  simMaster!: SimMaster

  @Column({ name: 'dealer_id' })
  dealerId!: number

  @ManyToOne(() => DealerProfile)
  @JoinColumn({ name: 'dealer_id' })
  dealer!: DealerProfile

  @Column({ name: 'inventory_id' })
  inventoryId!: number

  @ManyToOne(() => Inventory)
  @JoinColumn({ name: 'inventory_id' })
  inventory!: Inventory

  @Column({ name: 'purchase_price', type: 'numeric', precision: 18, scale: 2 })
  purchasePrice!: string

  @Column({ name: 'sale_price', type: 'numeric', precision: 18, scale: 2 })
  salePrice!: string

  @Column({ name: 'company_cost_price', type: 'numeric', precision: 18, scale: 2, nullable: true })
  companyCostPrice!: string | null

  @Column({ default: 'available' })
  status!: string

  @Column({ name: 'reserved_by', nullable: true })
  reservedBy!: string | null

  @Column({ name: 'tags_json', type: 'jsonb', default: [] })
  tagsJson!: string[]

  @Column({ name: 'source_sheet', nullable: true })
  sourceSheet!: string | null

  @Column({ name: 'source_row_no', nullable: true, type: 'integer' })
  sourceRowNo!: number | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}

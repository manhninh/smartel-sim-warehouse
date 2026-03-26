import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'import_batches' })
export class ImportBatch {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ name: 'user_id' })
  userId!: number

  @Column({ name: 'dealer_id' })
  dealerId!: number

  @Column({ name: 'inventory_id' })
  inventoryId!: number

  @Column({ name: 'inventory_category_id' })
  inventoryCategoryId!: number

  @Column({ name: 'file_name' })
  fileName!: string

  @Column({ name: 'total_rows', type: 'integer', default: 0 })
  totalRows!: number

  @Column({ name: 'success_rows', type: 'integer', default: 0 })
  successRows!: number

  @Column({ name: 'error_rows', type: 'integer', default: 0 })
  errorRows!: number

  @Column({ default: 'processing' })
  status!: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @Column({ name: 'finished_at', type: 'timestamptz', nullable: true })
  finishedAt!: Date | null
}

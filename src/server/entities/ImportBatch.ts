import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'import_batches' })
export class ImportBatch {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ name: 'user_id', type: 'integer' })
  userId!: number

  @Column({ name: 'dealer_id', type: 'integer' })
  dealerId!: number

  @Column({ name: 'inventory_id', type: 'integer' })
  inventoryId!: number

  @Column({ name: 'inventory_category_id', type: 'integer' })
  inventoryCategoryId!: number

  @Column({ name: 'file_name', type: 'varchar' })
  fileName!: string

  @Column({ name: 'total_rows', type: 'integer', default: 0 })
  totalRows!: number

  @Column({ name: 'success_rows', type: 'integer', default: 0 })
  successRows!: number

  @Column({ name: 'error_rows', type: 'integer', default: 0 })
  errorRows!: number

  @Column({ type: 'varchar', default: 'processing' })
  status!: string

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date

  @Column({ name: 'finished_at', type: 'timestamptz', nullable: true })
  finishedAt!: Date | null
}

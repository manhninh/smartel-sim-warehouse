import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { DealerProfile } from '@/server/entities/DealerProfile'
import { InventoryCategory } from '@/server/entities/InventoryCategory'

@Entity({ name: 'inventories' })
export class Inventory {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ name: 'dealer_id', type: 'integer' })
  dealerId!: number

  @ManyToOne(() => DealerProfile)
  @JoinColumn({ name: 'dealer_id' })
  dealer!: DealerProfile

  @Column({ name: 'category_id', type: 'integer' })
  categoryId!: number

  @ManyToOne(() => InventoryCategory)
  @JoinColumn({ name: 'category_id' })
  category!: InventoryCategory

  @Column({ type: 'varchar', unique: true })
  code!: string

  @Column({ type: 'varchar' })
  name!: string

  @Column({ type: 'varchar', default: 'public' })
  visibility!: string

  @Column({ type: 'varchar', default: 'active' })
  status!: string

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date
}

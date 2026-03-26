import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { DealerProfile } from '@/server/entities/DealerProfile'
import { InventoryCategory } from '@/server/entities/InventoryCategory'

@Entity({ name: 'inventories' })
export class Inventory {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ name: 'dealer_id' })
  dealerId!: number

  @ManyToOne(() => DealerProfile)
  @JoinColumn({ name: 'dealer_id' })
  dealer!: DealerProfile

  @Column({ name: 'category_id' })
  categoryId!: number

  @ManyToOne(() => InventoryCategory)
  @JoinColumn({ name: 'category_id' })
  category!: InventoryCategory

  @Column({ unique: true })
  code!: string

  @Column()
  name!: string

  @Column({ default: 'public' })
  visibility!: string

  @Column({ default: 'active' })
  status!: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}

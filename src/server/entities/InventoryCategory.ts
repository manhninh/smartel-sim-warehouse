import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'inventory_categories' })
export class InventoryCategory {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true })
  code!: string

  @Column()
  name!: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}

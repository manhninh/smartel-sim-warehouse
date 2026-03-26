import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'dealer_profiles' })
export class DealerProfile {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'varchar', unique: true })
  code!: string

  @Column({ type: 'varchar' })
  name!: string

  @Column({ type: 'varchar', default: 'active' })
  status!: string

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date
}

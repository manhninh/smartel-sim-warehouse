import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'dealer_profiles' })
export class DealerProfile {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true })
  code!: string

  @Column()
  name!: string

  @Column({ default: 'active' })
  status!: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}

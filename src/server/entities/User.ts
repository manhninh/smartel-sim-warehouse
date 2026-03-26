import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { DealerProfile } from '@/server/entities/DealerProfile'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true })
  username!: string

  @Column({ name: 'password_hash' })
  passwordHash!: string

  @Column({ name: 'api_key', unique: true, nullable: true })
  apiKey!: string | null

  @Column({ type: 'varchar' })
  role!: 'ADMIN' | 'DEALER' | 'CUSTOMER'

  @Column({ name: 'full_name' })
  fullName!: string

  @Column({ name: 'dealer_id', nullable: true })
  dealerId!: number | null

  @ManyToOne(() => DealerProfile, { nullable: true })
  @JoinColumn({ name: 'dealer_id' })
  dealer!: DealerProfile | null

  @Column({ name: 'is_active', default: true })
  isActive!: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}

import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { DealerProfile } from '@/server/entities/DealerProfile'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'varchar', unique: true })
  username!: string

  @Column({ name: 'password_hash', type: 'varchar' })
  passwordHash!: string

  @Column({ name: 'api_key', type: 'varchar', unique: true, nullable: true })
  apiKey!: string | null

  @Column({ type: 'varchar' })
  role!: 'ADMIN' | 'DEALER' | 'CUSTOMER'

  @Column({ name: 'full_name', type: 'varchar' })
  fullName!: string

  @Column({ name: 'dealer_id', type: 'integer', nullable: true })
  dealerId!: number | null

  @ManyToOne(() => DealerProfile, { nullable: true })
  @JoinColumn({ name: 'dealer_id' })
  dealer!: DealerProfile | null

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date
}

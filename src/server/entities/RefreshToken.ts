import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '@/server/entities/User'

@Entity({ name: 'refresh_tokens' })
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ name: 'user_id' })
  userId!: number

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User

  @Column({ name: 'token_hash' })
  tokenHash!: string

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt!: Date

  @Column({ name: 'revoked_at', type: 'timestamptz', nullable: true })
  revokedAt!: Date | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date
}

import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'sim_masters' })
export class SimMaster {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ name: 'msisdn_raw' })
  msisdnRaw!: string

  @Index({ unique: true })
  @Column({ name: 'msisdn_digits' })
  msisdnDigits!: string

  @Index()
  @Column({ name: 'msisdn_reverse' })
  msisdnReverse!: string

  @Column({ name: 'carrier_code', nullable: true })
  carrierCode!: string | null

  @Column({ nullable: true })
  prefix!: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}

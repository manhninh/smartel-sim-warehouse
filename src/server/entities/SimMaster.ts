import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'sim_masters' })
export class SimMaster {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ name: 'msisdn_raw', type: 'varchar' })
  msisdnRaw!: string

  @Index({ unique: true })
  @Column({ name: 'msisdn_digits', type: 'varchar' })
  msisdnDigits!: string

  @Index()
  @Column({ name: 'msisdn_reverse', type: 'varchar' })
  msisdnReverse!: string

  @Column({ name: 'carrier_code', type: 'varchar', nullable: true })
  carrierCode!: string | null

  @Column({ type: 'varchar', nullable: true })
  prefix!: string | null

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date
}

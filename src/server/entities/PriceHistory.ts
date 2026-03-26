import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { SimListing } from '@/server/entities/SimListing'
import { User } from '@/server/entities/User'

@Entity({ name: 'price_histories' })
export class PriceHistory {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ name: 'sim_listing_id' })
  simListingId!: number

  @ManyToOne(() => SimListing)
  @JoinColumn({ name: 'sim_listing_id' })
  simListing!: SimListing

  @Column({ name: 'old_purchase_price', type: 'numeric', precision: 18, scale: 2, nullable: true })
  oldPurchasePrice!: string | null

  @Column({ name: 'new_purchase_price', type: 'numeric', precision: 18, scale: 2, nullable: true })
  newPurchasePrice!: string | null

  @Column({ name: 'old_sale_price', type: 'numeric', precision: 18, scale: 2, nullable: true })
  oldSalePrice!: string | null

  @Column({ name: 'new_sale_price', type: 'numeric', precision: 18, scale: 2, nullable: true })
  newSalePrice!: string | null

  @Column({ name: 'changed_by_user_id' })
  changedByUserId!: number

  @ManyToOne(() => User)
  @JoinColumn({ name: 'changed_by_user_id' })
  changedByUser!: User

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date
}

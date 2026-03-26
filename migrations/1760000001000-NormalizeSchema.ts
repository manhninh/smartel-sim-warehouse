import { MigrationInterface, QueryRunner } from 'typeorm'

export class NormalizeSchema1760000001000 implements MigrationInterface {
  name = 'NormalizeSchema1760000001000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE inventory_categories ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'active'")
    await queryRunner.query('ALTER TABLE sim_listings ADD COLUMN IF NOT EXISTS category_id INTEGER NULL REFERENCES inventory_categories(id)')
    await queryRunner.query('CREATE INDEX IF NOT EXISTS idx_sim_listings_category_status ON sim_listings(category_id, status)')
    await queryRunner.query('CREATE UNIQUE INDEX IF NOT EXISTS uq_sim_listing_inventory_master ON sim_listings(sim_master_id, inventory_id)')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX IF EXISTS uq_sim_listing_inventory_master')
    await queryRunner.query('DROP INDEX IF EXISTS idx_sim_listings_category_status')
    await queryRunner.query('ALTER TABLE sim_listings DROP COLUMN IF EXISTS category_id')
    await queryRunner.query('ALTER TABLE inventory_categories DROP COLUMN IF EXISTS status')
  }
}

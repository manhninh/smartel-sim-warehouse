import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitSchema1760000000000 implements MigrationInterface {
  name = 'InitSchema1760000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS dealer_profiles (
      id SERIAL PRIMARY KEY,
      code VARCHAR(255) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'active',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`)

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS inventory_categories (
      id SERIAL PRIMARY KEY,
      code VARCHAR(255) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`)

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      api_key VARCHAR(255) UNIQUE,
      role VARCHAR(50) NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      dealer_id INTEGER NULL REFERENCES dealer_profiles(id),
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`)

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS inventories (
      id SERIAL PRIMARY KEY,
      dealer_id INTEGER NOT NULL REFERENCES dealer_profiles(id),
      category_id INTEGER NOT NULL REFERENCES inventory_categories(id),
      code VARCHAR(255) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      visibility VARCHAR(50) NOT NULL DEFAULT 'public',
      status VARCHAR(50) NOT NULL DEFAULT 'active',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`)

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS sim_masters (
      id SERIAL PRIMARY KEY,
      msisdn_raw VARCHAR(50) NOT NULL,
      msisdn_digits VARCHAR(20) NOT NULL UNIQUE,
      msisdn_reverse VARCHAR(20) NOT NULL,
      carrier_code VARCHAR(50),
      prefix VARCHAR(20),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`)
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_sim_masters_reverse ON sim_masters(msisdn_reverse)`)

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS sim_listings (
      id SERIAL PRIMARY KEY,
      sim_master_id INTEGER NOT NULL REFERENCES sim_masters(id),
      dealer_id INTEGER NOT NULL REFERENCES dealer_profiles(id),
      inventory_id INTEGER NOT NULL REFERENCES inventories(id),
      purchase_price NUMERIC(18,2) NOT NULL,
      sale_price NUMERIC(18,2) NOT NULL,
      company_cost_price NUMERIC(18,2),
      status VARCHAR(50) NOT NULL DEFAULT 'available',
      reserved_by VARCHAR(255),
      tags_json JSONB NOT NULL DEFAULT '[]'::jsonb,
      source_sheet VARCHAR(255),
      source_row_no INTEGER,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`)
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_sim_listings_inventory_status ON sim_listings(inventory_id, status)`)

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS price_histories (
      id SERIAL PRIMARY KEY,
      sim_listing_id INTEGER NOT NULL REFERENCES sim_listings(id),
      old_purchase_price NUMERIC(18,2),
      new_purchase_price NUMERIC(18,2),
      old_sale_price NUMERIC(18,2),
      new_sale_price NUMERIC(18,2),
      changed_by_user_id INTEGER NOT NULL REFERENCES users(id),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`)

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS refresh_tokens (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      token_hash VARCHAR(255) NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      revoked_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`)
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_active ON refresh_tokens(user_id, revoked_at)`)

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS import_batches (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      dealer_id INTEGER NOT NULL REFERENCES dealer_profiles(id),
      inventory_id INTEGER NOT NULL REFERENCES inventories(id),
      inventory_category_id INTEGER NOT NULL REFERENCES inventory_categories(id),
      file_name VARCHAR(255) NOT NULL,
      total_rows INTEGER NOT NULL DEFAULT 0,
      success_rows INTEGER NOT NULL DEFAULT 0,
      error_rows INTEGER NOT NULL DEFAULT 0,
      status VARCHAR(50) NOT NULL DEFAULT 'processing',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      finished_at TIMESTAMPTZ
    )`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS import_batches')
    await queryRunner.query('DROP TABLE IF EXISTS refresh_tokens')
    await queryRunner.query('DROP TABLE IF EXISTS price_histories')
    await queryRunner.query('DROP TABLE IF EXISTS sim_listings')
    await queryRunner.query('DROP TABLE IF EXISTS sim_masters')
    await queryRunner.query('DROP TABLE IF EXISTS inventories')
    await queryRunner.query('DROP TABLE IF EXISTS users')
    await queryRunner.query('DROP TABLE IF EXISTS inventory_categories')
    await queryRunner.query('DROP TABLE IF EXISTS dealer_profiles')
  }
}

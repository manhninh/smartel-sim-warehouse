# Database design

## users
- id
- username (unique)
- password_hash
- api_key (unique, nullable)
- role
- full_name
- dealer_id (nullable)
- is_active
- created_at
- updated_at

## dealer_profiles
- id
- code
- name
- status
- created_at
- updated_at

## inventory_categories
- id
- code
- name
- created_at
- updated_at

## inventories
- id
- dealer_id
- category_id
- code
- name
- visibility
- status
- created_at
- updated_at

## sim_masters
- id
- msisdn_raw
- msisdn_digits
- msisdn_reverse
- carrier_code
- prefix
- created_at
- updated_at

## sim_listings
- id
- sim_master_id
- dealer_id
- inventory_id
- purchase_price
- sale_price
- company_cost_price
- status
- reserved_by
- tags_json
- source_sheet
- source_row_no
- created_at
- updated_at

## price_histories
- id
- sim_listing_id
- old_purchase_price
- new_purchase_price
- old_sale_price
- new_sale_price
- changed_by_user_id
- created_at

## refresh_tokens
- id
- user_id
- token_hash
- expires_at
- revoked_at
- created_at

## import_batches
- id
- user_id
- dealer_id
- inventory_id
- inventory_category_id
- file_name
- total_rows
- success_rows
- error_rows
- status
- created_at
- finished_at

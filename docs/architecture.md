# Kiến trúc tổng thể

## Mục tiêu

Dùng một project Next.js để xử lý cả frontend và backend cho hệ thống kho SIM.

## Nguyên tắc chính

- App Router cho web pages
- Route Handlers cho API
- Service layer xử lý nghiệp vụ
- Repository layer truy vấn dữ liệu
- TypeORM quản lý entity và migration
- Redis cache search public
- JWT access token + refresh token cho đăng nhập
- API key cho khách hàng gọi public API

## Luồng chính

### 1. Login
- user login bằng username/password
- server trả access token và refresh token
- refresh token được hash và lưu DB

### 2. Search public
- khách hàng gọi API compact bằng api_key
- hệ thống parse query
- đọc cache Redis trước
- nếu cache miss thì query DB và ghi cache TTL 4 giờ

### 3. Import Excel
- admin upload file Excel
- parse từng sheet
- upsert sim_master và sim_listing
- ghi import_batches
- invalidate cache search

### 4. Cập nhật giá
- admin update purchase_price/sale_price
- ghi price_history
- invalidate cache

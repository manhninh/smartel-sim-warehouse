# Smartel SIM Warehouse

## 1) Mục tiêu dự án

Hệ thống quản lý kho SIM đa đại lý, chạy trên Next.js App Router + TypeORM + PostgreSQL 18 + Redis, có đầy đủ:
- Auth JWT (access token + refresh token)
- API key cho user
- RBAC theo `ADMIN`, `DEALER`, `CUSTOMER`
- Rule cứng: chỉ `username = admin` mới import Excel và cập nhật giá
- Public API compact trả đúng format:

```json
[
  {
    "sdt": "028838477282",
    "loai": ["phong_thuy"]
  }
]
```

## 2) Stack công nghệ

- Next.js 16 App Router
- TypeScript strict
- TypeORM (migration only, không dùng `synchronize: true`)
- PostgreSQL 18
- Redis 8 (cache TTL 4 giờ)
- `jose` (JWT), `bcryptjs` (hash password), `exceljs` (import)

## 3) Yêu cầu môi trường

- Node.js >= 20.9
- Docker + Docker Compose

## 4) Cách chạy PostgreSQL 18 + Redis

```bash
docker compose up -d
```

## 5) Cài package

```bash
npm install
```

## 6) Cấu hình môi trường

```bash
cp .env.example .env
```

Biến quan trọng:
- `CACHE_ENABLED=true|false`
- `CACHE_TTL_SECONDS=14400`
- `JWT_ACCESS_TTL_SECONDS=900`
- `JWT_REFRESH_TTL_SECONDS=2592000`

## 7) Chạy migration

```bash
npm run migration:run
```

Revert migration gần nhất:

```bash
npm run migration:revert
```

## 8) Seed tài khoản mặc định

```bash
npm run seed:admin
```

Tài khoản mặc định:
- username: `admin`
- password: `admin123`

## 9) Chạy app

```bash
npm run dev
```

## 10) Login lấy token

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

Kết quả trả:
- `accessToken`
- `refreshToken`
- `expiresIn`
- thông tin user + `apiKey`

Refresh token:

```http
POST /api/auth/refresh
```

Logout:

```http
POST /api/auth/logout
```

## 11) Gọi API public

```http
GET /api/public/sims/compact?q=0288
x-api-key: <api_key>
```

Filter hỗ trợ:
- `dealerId`
- `inventoryId`
- `categoryId`
- `minPrice`
- `maxPrice`
- query `q` hỗ trợ exact/prefix/suffix/wildcard (`*`)

Response compact luôn là mảng `{ sdt, loai }`.

## 12) Import Excel

```http
POST /api/admin/import
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

Form-data:
- `dealerId`
- `inventoryId`
- `inventoryCategoryId`
- `file`

Mapping cột linh hoạt:
- Số SIM: `sdt` | `msisdn` | `sim` | `so_thue_bao` | `so`
- Giá nhập: `gia_nhap` | `purchase_price`
- Giá bán: `gia_ban` | `sale_price`
- Loại: `loai` | `tags`

Chiến lược duplicate: `update_if_exists` theo cặp `(sim_master_id, inventory_id)`.

## 13) Rule permission quan trọng

- Chỉ user có `username = admin` **và** `role = ADMIN` mới được:
  - import kho SIM
  - cập nhật giá nhập/giá bán
- User role khác gọi API admin sẽ nhận `403`.

## 14) Scripts chuẩn

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run typecheck`
- `npm run migration:generate`
- `npm run migration:run`
- `npm run migration:revert`
- `npm run db:check`
- `npm run seed:admin`

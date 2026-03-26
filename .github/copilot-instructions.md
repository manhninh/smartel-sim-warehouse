# GitHub Copilot Instructions - Smartel SIM Inventory

## Mục tiêu repo

Xây dựng hệ thống kho SIM full-stack bằng **Next.js 16 App Router** dùng chung cho:
- frontend admin/dealer
- backend API qua Route Handlers
- TypeORM + PostgreSQL 18
- Redis cache 4 giờ
- access token + refresh token
- public API compact tra cứu SIM

## Công nghệ bắt buộc

- Next.js App Router
- TypeScript strict mode
- Route Handlers trong `app/api/**/route.ts`
- TypeORM + migration
- PostgreSQL 18
- Redis
- `jose` cho JWT
- `bcryptjs` cho password hashing
- `zod` cho validate input
- `exceljs` để import file Excel

## Kiến trúc bắt buộc

### 1. Tách lớp rõ ràng

- `app/**`: UI pages + Route Handlers
- `src/server/services/**`: nghiệp vụ
- `src/server/repositories/**`: truy xuất DB
- `src/server/entities/**`: entity TypeORM
- `src/server/auth/**`: token, session, guard
- `src/server/cache/**`: Redis cache
- `src/server/validators/**`: zod schema

Không viết business logic trực tiếp trong React component.
Không viết logic DB phức tạp trực tiếp trong Route Handler.

### 2. Role hệ thống

Chỉ có 3 role:
- `ADMIN`
- `DEALER`
- `CUSTOMER`

### 3. Rule cứng về quyền

Chỉ user có `username === 'admin'` mới được:
- import kho SIM
- cập nhật giá nhập
- cập nhật giá bán

Mọi user khác phải trả về `403 Forbidden`.

### 4. Dữ liệu chính

Các bảng cốt lõi:
- `users`
- `dealer_profiles`
- `inventory_categories`
- `inventories`
- `sim_masters`
- `sim_listings`
- `price_histories`
- `refresh_tokens`
- `import_batches`

### 5. Public API bắt buộc

Endpoint:
- `GET /api/public/sims/compact`

Format response luôn là:

```json
[
  {
    "sdt": "028838477282",
    "loai": ["phong_thuy"]
  }
]
```

Không được tự ý đổi format này nếu chưa có yêu cầu mới.

### 6. Caching

- Cache search public bằng Redis
- TTL mặc định: `14400` giây
- Sau import thành công hoặc update giá phải invalidate cache liên quan

### 7. Migration

- Tuyệt đối không dùng `synchronize: true`
- Mọi thay đổi schema phải đi qua migration file
- Tên migration rõ nghĩa

### 8. Coding style

- Mọi comment và tài liệu trong repo viết bằng **tiếng Việt**
- Tên biến, hàm, class vẫn dùng tiếng Anh kỹ thuật chuẩn
- Ưu tiên code rõ ràng, dễ maintain hơn là clever code
- Luôn return JSON structure nhất quán

## Quy tắc khi Copilot sửa code

1. Không đổi framework.
2. Không chuyển App Router sang Pages Router.
3. Không xóa các lớp service/repository.
4. Không cho route admin bypass auth.
5. Không lưu plaintext password hoặc plaintext refresh token trong DB.
6. Không cache dữ liệu nhạy cảm của admin.
7. Khi thêm API mới, phải thêm validator zod.
8. Khi thêm bảng mới, phải thêm entity + migration + index nếu cần.

## Thứ tự ưu tiên khi triển khai

1. Database entities + migrations
2. Auth access/refresh token
3. RBAC và admin-only rule
4. Public search compact API
5. Import Excel
6. Admin UI và Dealer UI
7. Audit log, observability, rate limit

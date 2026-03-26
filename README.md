# Smartel SIM Inventory - Next.js 16 Blueprint

Bộ source này là **starter blueprint** cho bài toán kho SIM theo yêu cầu:
- Next.js **16.2.1** App Router
- TypeScript
- PostgreSQL **18**
- TypeORM + migration
- Redis cache TTL **4 giờ**
- Access token + Refresh token
- `x-api-key` cho API public theo khách hàng
- 3 role: `ADMIN`, `DEALER`, `CUSTOMER`
- Chỉ duy nhất `username = admin` mới được import kho SIM, cập nhật giá nhập / giá bán
- Public API compact trả về đúng dạng:

```json
[
  {
    "sdt": "028838477282",
    "loai": ["phong_thuy"]
  }
]
```

## 1. Tại sao dùng Next.js cho bài toán này?

Kiến trúc này bám theo hướng chính thức của Next.js App Router + Route Handlers để làm full-stack trong cùng project. Next.js docs hiện ghi rõ:
- Latest Version: **16.2.1**
- App Router là router chính thức cho kiến trúc mới
- Route Handlers là cách tạo custom HTTP handlers trong `app` directory
- `create-next-app@latest` là cách scaffold chuẩn nhất

Tài liệu tham khảo chính thức:
- Next.js docs: latest version 16.2.1 citeturn600640search0turn372168view0
- Installation và `create-next-app@latest` citeturn372168view0turn372168view1
- Route Handlers trong `app` directory citeturn600640search2turn600640search9
- Next.js 16 release notes citeturn600640search3

## 2. Kiến trúc tổng thể

```text
app/
  (dashboard)/
    admin/
    dealer/
  login/
  api/
    auth/
      login/
      refresh/
      logout/
      me/
    public/
      sims/
        compact/
    admin/
      import/
      listings/[id]/price/

src/
  server/
    auth/
    cache/
    db/
    entities/
    repositories/
    services/
    utils/
    validators/
  components/
  types/

migrations/
docs/
.github/
```

### Nguyên tắc

- React component chỉ làm UI.
- Route Handlers chỉ làm request/response orchestration.
- Business logic nằm ở `src/server/services`.
- Query DB đi qua repository.
- Schema database chỉ thay đổi bằng migration.
- Cache search public nằm ở Redis, TTL mặc định 14,400 giây = 4 giờ. Redis hỗ trợ `EXPIRE` để key tự xóa sau TTL. citeturn994653search7turn994653search3

## 3. Chạy nhanh

### Yêu cầu môi trường

- Node.js >= 20.9.0 theo yêu cầu tối thiểu của Next.js citeturn372168view0
- Docker / Docker Compose

### Khởi động DB và Redis

```bash
cp .env.example .env
docker compose up -d
```

### Cài package và chạy app

```bash
npm install
npm run migration:run
npm run seed:admin
npm run dev
```

Mở:

```bash
http://localhost:3000
```

## 4. Tạo project mới từ zero bằng Next.js chính thức

Nếu anh muốn AI Agent tự dựng repo sạch rồi chép overlay này vào, dùng đúng flow sau:

```bash
pnpm create next-app@latest smartel-sim-nextjs --ts --tailwind --eslint --app --src-dir --yes
```

`create-next-app` hiện có hỗ trợ tạo `AGENTS.md` để hướng dẫn coding agents, và App Router là lựa chọn mặc định được khuyến nghị. citeturn372168view1turn372168view0

## 5. Database model

### Bảng chính

- `users`
- `dealer_profiles`
- `inventory_categories`
- `inventories`
- `sim_masters`
- `sim_listings`
- `price_histories`
- `refresh_tokens`
- `import_batches`

### Logic dữ liệu

- `sim_masters` là số điện thoại chuẩn hóa duy nhất.
- `sim_listings` là bản ghi bán hàng trong từng kho của từng đại lý.
- `inventories` thuộc một `dealer` và một `inventory_category`.
- `users.role` chỉ có 3 giá trị: `ADMIN`, `DEALER`, `CUSTOMER`.
- `users.api_key` dùng cho public API khi cần áp quota / theo dõi khách hàng.
- `username = admin` là điều kiện cứng để import và update giá.

## 6. Auth và phân quyền

### Login

- `POST /api/auth/login`
- Kiểm tra username/password
- Sinh access token + refresh token
- Refresh token lưu DB dạng hash

### Refresh

- `POST /api/auth/refresh`
- Kiểm tra refresh token hợp lệ
- Rotate refresh token
- Cấp access token mới

### Me

- `GET /api/auth/me`

### Logout

- `POST /api/auth/logout`
- Thu hồi refresh token hiện tại

### RBAC

- `ADMIN`: toàn quyền
- `DEALER`: xem kho của chính đại lý
- `CUSTOMER`: dùng API public qua `api_key`

### Rule cứng

Chỉ cho phép import và cập nhật giá nếu:

```ts
session.user.username === 'admin'
```

Không chỉ dựa vào role.

## 7. Cache Redis

Dùng Redis để cache kết quả search public.

Pattern cache:

```text
sim-search:compact:{sha1(query-object)}
```

TTL:

```text
14400 giây = 4 giờ
```

Khi import thành công hoặc update giá:
- xóa cache theo prefix `sim-search:*`
- hoặc đánh version cache để tránh scan key quá lớn

## 8. Search public

### API

```http
GET /api/public/sims/compact?q=8388
GET /api/public/sims/compact?q=098*888
GET /api/public/sims/compact?inventoryId=10&q=0914*
```

### Response

```json
[
  {
    "sdt": "028838477282",
    "loai": ["phong_thuy"]
  }
]
```

### Rule parser query

- `6789` -> suffix
- `0914*` -> prefix
- `098*888` -> prefix + suffix
- `0997777999` -> exact first

## 9. Import Excel

### API

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

### Rule

- Chỉ `admin` import được
- Mỗi dòng map sang `sim_master` + `sim_listing`
- Nếu listing đã tồn tại thì update giá / trạng thái
- Ghi `price_histories` nếu giá thay đổi
- Ghi `import_batches` để audit

## 10. Migration

TypeORM docs khuyến nghị dùng migration thay vì `synchronize: true` ở production. citeturn994653search0turn994653search14

Lệnh:

```bash
npm run migration:generate
npm run migration:run
npm run migration:revert
```

## 11. Tài khoản mặc định

Sau khi chạy:

```bash
npm run seed:admin
```

Sẽ có:
- username: `admin`
- password: `admin123`
- role: `ADMIN`

Đổi ngay sau khi deploy.

## 12. Lưu ý khi giao cho AI Agent

1. Không đổi App Router sang Pages Router.
2. Không dùng `synchronize: true`.
3. Không đưa business logic vào React page.
4. Không để route admin mở cho mọi role.
5. Không cho dealer/customer import hoặc sửa giá.
6. Mọi thay đổi schema phải đi bằng migration.
7. Cache search phải có TTL 4 giờ.
8. Public API compact luôn giữ format mảng object `{ sdt, loai }`.

## 13. Các file tài liệu quan trọng

- `docs/architecture.md`
- `docs/database.md`
- `docs/api-contract.md`
- `.github/copilot-instructions.md`
- `.github/prompts/phase-1-bootstrap.md`
- `.github/prompts/phase-2-backend.md`
- `.github/prompts/phase-3-admin-ui.md`

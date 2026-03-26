# Phase 2 - Backend API

Hãy triển khai backend API theo Route Handlers.

Việc cần làm:
1. POST /api/auth/login
2. POST /api/auth/refresh
3. POST /api/auth/logout
4. GET /api/auth/me
5. GET /api/public/sims/compact
6. POST /api/admin/import
7. PATCH /api/admin/listings/[id]/price

Yêu cầu:
- dùng zod validate input
- chỉ admin mới import và update giá
- refresh token phải rotate
- refresh token lưu DB dạng hash
- public API compact phải cache Redis 4 giờ

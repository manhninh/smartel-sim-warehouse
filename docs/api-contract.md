# API contract

## POST /api/auth/login
Request:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

Response:
```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "expiresIn": 900,
  "user": {
    "id": 1,
    "username": "admin",
    "role": "ADMIN"
  }
}
```

## POST /api/auth/refresh
Request:
```json
{
  "refreshToken": "..."
}
```

## GET /api/auth/me
Header:
```text
Authorization: Bearer <accessToken>
```

## GET /api/public/sims/compact
Query params:
- q
- inventoryId (optional)

Header:
```text
x-api-key: <customer-api-key>
```

Response:
```json
[
  {
    "sdt": "028838477282",
    "loai": ["phong_thuy"]
  }
]
```

## POST /api/admin/import
Header:
```text
Authorization: Bearer <accessToken>
```

Form-data:
- dealerId
- inventoryId
- inventoryCategoryId
- file

## PATCH /api/admin/listings/:id/price
Header:
```text
Authorization: Bearer <accessToken>
```

Request:
```json
{
  "purchasePrice": 1000000,
  "salePrice": 1200000
}
```

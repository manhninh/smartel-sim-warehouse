# AGENTS

This repository uses Next.js App Router with Route Handlers, TypeORM migrations, PostgreSQL 18, and Redis.

Always prefer:
- App Router pages in `app/`
- Route Handlers for HTTP API endpoints in `app/api/**/route.ts`
- Business logic in `src/server/services`
- Database access through repositories in `src/server/repositories`
- TypeORM entities and migrations only, never `synchronize: true`
- Server-side search, auth, RBAC, and caching

Do not:
- Put business logic directly in React components
- Put raw SQL in Route Handlers unless required for performance
- Use client-side secrets
- Bypass admin-only restrictions for import or price updates

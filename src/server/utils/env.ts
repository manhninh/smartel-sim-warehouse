export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USERNAME ?? 'smartel',
    password: process.env.DB_PASSWORD ?? 'smartel',
    database: process.env.DB_DATABASE ?? 'smartel_sim',
  },
  redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',
  cacheTtlSeconds: Number(process.env.CACHE_TTL_SECONDS ?? 14400),
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET ?? 'change-me-access',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'change-me-refresh',
    accessTtlSeconds: Number(process.env.JWT_ACCESS_TTL_SECONDS ?? 900),
    refreshTtlSeconds: Number(process.env.JWT_REFRESH_TTL_SECONDS ?? 2592000),
  },
  admin: {
    username: process.env.ADMIN_DEFAULT_USERNAME ?? 'admin',
    password: process.env.ADMIN_DEFAULT_PASSWORD ?? 'admin123',
    fullName: process.env.ADMIN_DEFAULT_FULL_NAME ?? 'System Admin',
    apiKey: process.env.ADMIN_DEFAULT_API_KEY ?? 'change-me-admin-api-key',
  },
}

import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_URL: z.string().default('http://localhost:3000'),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().int().positive().default(5432),
  DB_USERNAME: z.string().default('smartel'),
  DB_PASSWORD: z.string().default('smartel'),
  DB_DATABASE: z.string().default('smartel_sim'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  CACHE_ENABLED: z.coerce.boolean().default(true),
  CACHE_TTL_SECONDS: z.coerce.number().int().positive().default(14400),
  JWT_ACCESS_SECRET: z.string().min(16).default('change-me-access-secret-1234'),
  JWT_REFRESH_SECRET: z.string().min(16).default('change-me-refresh-secret-1234'),
  JWT_ACCESS_TTL_SECONDS: z.coerce.number().int().positive().default(900),
  JWT_REFRESH_TTL_SECONDS: z.coerce.number().int().positive().default(2592000),
  ADMIN_DEFAULT_USERNAME: z.string().default('admin'),
  ADMIN_DEFAULT_PASSWORD: z.string().default('admin123'),
  ADMIN_DEFAULT_FULL_NAME: z.string().default('System Admin'),
  ADMIN_DEFAULT_API_KEY: z.string().min(16).default('change-me-admin-api-key-1234'),
})

const parsed = envSchema.parse(process.env)

export const env = {
  nodeEnv: parsed.NODE_ENV,
  appUrl: parsed.APP_URL,
  db: {
    host: parsed.DB_HOST,
    port: parsed.DB_PORT,
    username: parsed.DB_USERNAME,
    password: parsed.DB_PASSWORD,
    database: parsed.DB_DATABASE,
  },
  redisUrl: parsed.REDIS_URL,
  cacheEnabled: parsed.CACHE_ENABLED,
  cacheTtlSeconds: parsed.CACHE_TTL_SECONDS,
  jwt: {
    accessSecret: parsed.JWT_ACCESS_SECRET,
    refreshSecret: parsed.JWT_REFRESH_SECRET,
    accessTtlSeconds: parsed.JWT_ACCESS_TTL_SECONDS,
    refreshTtlSeconds: parsed.JWT_REFRESH_TTL_SECONDS,
  },
  admin: {
    username: parsed.ADMIN_DEFAULT_USERNAME,
    password: parsed.ADMIN_DEFAULT_PASSWORD,
    fullName: parsed.ADMIN_DEFAULT_FULL_NAME,
    apiKey: parsed.ADMIN_DEFAULT_API_KEY,
  },
}

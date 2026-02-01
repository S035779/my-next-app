import 'server-only';
import { createDbWithSchema, createDbPool } from './client';
import { schema } from './schema';
import type { AppDb } from './types';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set');
}

/**
 * MySQL connection pool
 * - In dev: hot-reload で pool が増殖しないよう global に保持
 */
export const pool = globalThis.__mysqlPool ?? createDbPool(databaseUrl);

if (process.env.NODE_ENV !== 'production') globalThis.__mysqlPool = pool;

export const db: AppDb = createDbWithSchema(pool, schema);

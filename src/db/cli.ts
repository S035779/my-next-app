import { createDbWithSchema, createDbPool } from './client';
import { schema } from './schema';
import type { AppDb } from './types';

const databaseUrl = process.env.DB_URL ?? process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set');
}

export const pool = createDbPool(databaseUrl);
export const db: AppDb = createDbWithSchema(pool, schema);

import mysql from 'mysql2/promise';
import {
  drizzle,
  type MySql2Database,
  type MySql2DrizzleConfig,
} from 'drizzle-orm/mysql2';

export function createDbPool(databaseUrl: string): mysql.Pool {
  return mysql.createPool({ uri: databaseUrl, connectionLimit: 10 });
}

export function createDbWithSchema<TSchema extends Record<string, unknown>>(
  pool: mysql.Pool,
  schema: TSchema,
): MySql2Database<TSchema> {
  const config: MySql2DrizzleConfig<TSchema> = {
    schema,
    mode: 'default',
  };
  return drizzle(pool, config);
}

export function createDb(pool: mysql.Pool): MySql2Database {
  return drizzle(pool);
}

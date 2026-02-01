import type { MySql2Database } from 'drizzle-orm/mysql2';
import type { Schema } from './schema';

export type AppDb = MySql2Database<Schema>;

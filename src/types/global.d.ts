import type mysql from 'mysql2/promise';

declare global {
  var __mysqlPool: mysql.Pool | undefined;
}

export {};

import mysql from 'mysql2/promise';

async function main() {
  const url = process.env.DB_URL ?? process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');

  // 1) Connect
  const conn = await mysql.createConnection(url);

  // 2) Drop all tables (disable FK)
  await conn.query('SET FOREIGN_KEY_CHECKS = 0');

  const [rows] = await conn.query<any[]>(
    'SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE()',
  );

  for (const r of rows) {
    const table = r.TABLE_NAME ?? r.table_name;
    await conn.query(`DROP TABLE IF EXISTS \`${table}\``);
  }

  await conn.query('SET FOREIGN_KEY_CHECKS = 1');
  await conn.end();

  console.log('✅ dropped all tables');
}

main().catch((e) => {
  console.error('❌ reset failed', e);
  process.exit(1);
});

import { db, pool } from './cli';
import { users } from './schema';
import { eq } from 'drizzle-orm';

type SeedUser = { email: string; name: string | null; note?: string };

function readAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? '';
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

const baseUsers: SeedUser[] = [{ email: 'user1@example.com', name: 'User 1' }];

function buildSeedUsers(): SeedUser[] {
  const admins = readAdminEmails().map((email) => ({
    email,
    name: 'Admin',
    note: 'admin candidate (from ADMIN_EMAILS)',
  }));

  // admin候補を先頭に
  return [...admins, ...baseUsers];
}

async function ensureUser(u: SeedUser) {
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, u.email))
    .limit(1);

  if (existing.length > 0) {
    console.log(`↩︎ skip (exists): ${u.email}${u.note ? ` (${u.note})` : ''}`);
    return;
  }

  await db.insert(users).values({ email: u.email, name: u.name });
  console.log(`➕ inserted: ${u.email}${u.note ? ` (${u.note})` : ''}`);
}

async function main() {
  const seedUsers = buildSeedUsers();

  if (readAdminEmails().length === 0) {
    console.warn(
      '⚠️ ADMIN_EMAILS is empty. No admin candidate will be seeded.',
    );
  }

  for (const u of seedUsers) {
    await ensureUser(u);
  }
  console.log('✅ seed completed (idempotent)');
}

main()
  .then(async () => {
    await pool.end();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error('❌ seed failed', err);
    await pool.end();
    process.exit(1);
  });

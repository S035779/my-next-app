import { NextResponse } from 'next/server';
import { db } from '../../../../db'; // あなたの import に合わせる
import { users } from '../../../../db/schema';
import { sql } from 'drizzle-orm';

// Node runtime（MySQL接続が前提）
export const runtime = 'nodejs';

// ここを超重要：本番ビルドに混ざっても踏めないようガード
function assertTestOnly(req: Request) {
  // 1) NODE_ENV でガード（CI/ローカルで test にする運用が一番堅い）
  // ただし Next の dev は NODE_ENV=development なので、それも許可するなら下を調整
  const env = process.env.NODE_ENV;
  const allowEnv = env === 'test' || env === 'development';
  if (!allowEnv) {
    throw new Error('Forbidden: test-only endpoint');
  }

  // 2) トークンでガード（二重化）
  const token = process.env.E2E_SEED_TOKEN;
  if (!token) throw new Error('E2E_SEED_TOKEN is not set');

  const got = req.headers.get('x-e2e-seed-token');
  if (got !== token) {
    throw new Error('Forbidden: invalid token');
  }
}

type Body = {
  count?: number; // 追加人数
  prefix?: string; // メールprefix
};

export async function POST(req: Request) {
  try {
    assertTestOnly(req);

    const body = (await req.json().catch(() => ({}))) as Body;
    const count = Math.min(Math.max(Number(body.count ?? 30), 1), 200); // 1..200
    const prefix = (body.prefix ?? 'e2e-user').slice(0, 50);

    // 既存件数を取得（連番を安全に作る）
    const [{ c }] = await db.select({ c: sql<string>`count(*)` }).from(users);
    const start = Number(c) + 1;

    const values = Array.from({ length: count }).map((_, i) => {
      const n = start + i;
      return {
        email: `${prefix}+${n}@example.com`,
        name: `E2E User ${n}`,
      };
    });

    // unique(email) があるので重複しない前提で insert
    await db.insert(users).values(values);

    return NextResponse.json({ ok: true, inserted: count });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown error';
    return NextResponse.json({ ok: false, error: msg }, { status: 403 });
  }
}

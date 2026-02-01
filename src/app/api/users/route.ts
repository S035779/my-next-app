import { NextResponse } from 'next/server';
import { db } from '../../../db';
import { users } from '../../../db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  const rows = await db.select().from(users).orderBy(desc(users.id)).limit(50);
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const body = (await req.json()) as { email?: string; name?: string };

  if (!body.email) {
    return NextResponse.json({ error: 'email is required' }, { status: 400 });
  }

  // MySQL では insert の戻り値が driver 依存なので、シンプルに insert のみ行う例
  await db.insert(users).values({
    email: body.email,
    name: body.name ?? null,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}

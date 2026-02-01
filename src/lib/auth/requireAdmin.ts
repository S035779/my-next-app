import { auth } from '@clerk/nextjs/server';
import { forbidden, redirect } from 'next/navigation';
import { getRoleFromSessionClaims } from './role';

/**
 * 認証必須チェック（adminのみ許可）
 * @returns ユーザーID
 */
export async function requireAdmin(): Promise<void> {
  const { userId, sessionClaims } = await auth();
  if (!userId) redirect('/sign-in');

  const role = getRoleFromSessionClaims(sessionClaims);
  if (role !== 'admin') forbidden(); // 403
}

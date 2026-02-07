import { auth } from '@clerk/nextjs/server';
import { forbidden, redirect } from 'next/navigation';
import { getRoleFromSessionClaims } from './role';

/**
 * 管理者必須チェック（未ログインは sign-in へ、非adminは 403）
 * @returns ユーザーID
 */
export async function requireAdmin(): Promise<void> {
  const { userId, sessionClaims } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const role = getRoleFromSessionClaims(sessionClaims);
  if (role !== 'admin') {
    forbidden(); // 403
  }
}

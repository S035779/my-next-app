import { auth } from '@clerk/nextjs/server';
import { forbidden } from 'next/navigation';
import { getRoleFromSessionClaims } from './role';

/**
 * 管理者必須チェック（未ログインは sign-in へ、非adminは 403）
 * @returns ユーザーID
 */
export async function requireAdmin(): Promise<void> {
  const { userId, sessionClaims } = await auth();

  // 未ログインは middleware 側で redirect される想定
  if (!userId) {
    forbidden(); // ここに来るのは基本 “想定外” 扱い（あるいは return; でもOK）
  }

  const role = getRoleFromSessionClaims(sessionClaims);
  if (role !== 'admin') forbidden();
}

'use server';

import { revalidatePath } from 'next/cache';
import { redirect, notFound } from 'next/navigation';
import { createUser, deleteUser, updateUser } from '../../db/users.repo.next';
import { requireAdmin } from '../../lib/auth/requireAdmin';
import type { UserFormState } from './types';
import { createUserCore, updateUserCore, deleteUserCore } from './core';
import type { ActionEffect } from './core';
import { adminUsersRoutes } from '../../lib/routes/adminUsers';
import { logServerError } from '../../lib/server/logServerError';
import { isDuplicateEmailError } from '@/src/lib/db-errors';
import { parseIdOrThrow } from './validation';
import { isNextControlFlowError } from '../../lib/server/nextControlFlow';

const GENERIC_SAVE_ERROR =
  '保存に失敗しました。時間をおいて再度お試しください。';

function applyEffect(effect: ActionEffect) {
  switch (effect.kind) {
    case 'revalidate':
      for (const p of effect.paths) revalidatePath(p);
      return;
    case 'redirect':
      redirect(effect.to);
    case 'notFound':
      notFound();
    case 'none':
      return;
    default:
      // exhaustiveness check
      const _never: never = effect;
      return _never;
  }
}

/**
 * ユーザー作成アクション
 * @param prev 前回のフォーム状態
 * @param formData フォーム入力値
 * @returns 新しいフォーム状態
 */
export async function createUserAction(
  prev: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  try {
    const { state, effect } = await createUserCore(
      {
        requireAdmin,
        createUser,
        updateUser,
        deleteUser,
        routes: adminUsersRoutes,
      },
      prev,
      formData,
    );
    applyEffect(effect);
    return state;
  } catch (err: unknown) {
    if (isNextControlFlowError(err)) throw err;

    if (isDuplicateEmailError(err)) {
      return { fieldErrors: { email: 'このメールアドレスは既に使用されています' } };
    }

    logServerError({ scope: 'users.create' }, err);

    return { message: GENERIC_SAVE_ERROR };
  }
}

/**
 * ユーザー更新アクション
 * @param prev 前回のフォーム状態
 * @param formData フォーム入力値
 * @returns 更新後のフォーム状態
 */
export async function updateUserAction(
  prev: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  try {
    const { state, effect } = await updateUserCore(
      {
        requireAdmin,
        createUser,
        updateUser,
        deleteUser,
        routes: adminUsersRoutes,
      },
      prev,
      formData,
    );
    applyEffect(effect);
    return state;
  } catch (err: unknown) {
    if (isNextControlFlowError(err)) throw err;

    if (isDuplicateEmailError(err)) {
      return { fieldErrors: { email: 'このメールアドレスは既に使用されています' } };
    }

    logServerError({ scope: 'users.update' }, err);

    return { message: GENERIC_SAVE_ERROR };
  }
}

/**
 * ユーザー削除アクション
 * @param formData フォーム入力値
 * @returns void
 */
export async function deleteUserAction(formData: FormData) {
  await requireAdmin();
  try {
    const id = parseIdOrThrow(formData);
    const ok = await deleteUser(id);
    if (!ok) notFound();

    revalidatePath('/admin/users');
    redirect('/admin/users');
  } catch (err: unknown) {
    if (isNextControlFlowError(err)) throw err;
    logServerError({ scope: 'users.delete' }, err);
    throw err;
  }
}

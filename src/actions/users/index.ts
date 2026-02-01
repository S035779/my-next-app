'use server';

import { revalidatePath } from 'next/cache';
import { redirect, notFound } from 'next/navigation';
import { createUser, deleteUser, updateUser } from '../../db/users.repo.next';
import { requireAdmin } from '../../lib/auth/requireAdmin';
import type { UserFormState } from './types';
import { createUserCore, updateUserCore, deleteUserCore } from './core';
import type { ActionEffect } from './core';

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
  const { state, effect } = await createUserCore(
    { requireAdmin, createUser, updateUser, deleteUser },
    prev,
    formData,
  );
  applyEffect(effect);
  return state;
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
  const { state, effect } = await updateUserCore(
    { requireAdmin, createUser, updateUser, deleteUser },
    prev,
    formData,
  );
  applyEffect(effect);
  return state;
}

/**
 * ユーザー削除アクション
 * @param formData フォーム入力値
 * @returns void
 */
export async function deleteUserAction(formData: FormData) {
  const { effect } = await deleteUserCore(
    { requireAdmin, createUser, updateUser, deleteUser },
    formData,
  );
  applyEffect(effect);
}

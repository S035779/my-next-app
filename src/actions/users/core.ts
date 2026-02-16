import type { UserFormState } from './types';
import { validateUserInput, parseIdOrThrow } from './validation';
import { isDuplicateEmailError } from '../../lib/db-errors';
import { safeFrom } from '../../lib/urls';
import type { UsersRoutes } from '../../lib/routes/adminUsers';

export type ActionEffect =
  | { kind: 'none' }
  | { kind: 'revalidate'; paths: string[] }
  | { kind: 'redirect'; to: string; toast?: 'created' | 'saved' | 'deleted' }
  | { kind: 'notFound' };

export type ActionResult = { state: UserFormState; effect: ActionEffect };

export type Deps = {
  requireAdmin: () => Promise<void>;
  createUser: (email: string, name: string | null) => Promise<number>;
  updateUser: (
    id: number,
    email: string,
    name: string | null,
  ) => Promise<boolean>;
  deleteUser: (id: number) => Promise<boolean>;
  routes: UsersRoutes;
};

// from を「一覧に戻るURL」として安全に正規化する（B案の要）
function normalizeFrom(deps: Deps, fromRaw: unknown): string {
  // デフォルトは「一覧1ページ目」（検索はここでは持たない。持ちたいなら opts を追加）
  const fallback = deps.routes.index({ page: 1 });
  return safeFrom(fromRaw, fallback);
}

export async function createUserCore(
  deps: Deps,
  _prevState: UserFormState,
  formData: FormData,
): Promise<ActionResult> {
  await deps.requireAdmin();

  try {
    const v = validateUserInput(formData);
    if (!v.ok)
      return {
        state: { fieldErrors: v.fieldErrors },
        effect: { kind: 'none' },
      };

    const { email, name } = v.values;
    const id = await deps.createUser(email, name);

    const from = normalizeFrom(deps, formData.get('from'));

    return {
      state: {},
      effect: {
        kind: 'redirect',
        to: deps.routes.detail(id, { from }),
        toast: 'created',
      },
    };
  } catch (err: unknown) {
    if (isDuplicateEmailError(err)) {
      return {
        state: {
          fieldErrors: { email: 'このメールアドレスは既に使用されています' },
        },
        effect: { kind: 'none' },
      };
    }
    return {
      state: {
        message: err instanceof Error ? err.message : '作成に失敗しました',
      },
      effect: { kind: 'none' },
    };
  }
}

export async function updateUserCore(
  deps: Deps,
  _prevState: UserFormState,
  formData: FormData,
): Promise<ActionResult> {
  await deps.requireAdmin();

  try {
    const id = parseIdOrThrow(formData);

    const v = validateUserInput(formData);
    if (!v.ok)
      return {
        state: { fieldErrors: v.fieldErrors },
        effect: { kind: 'none' },
      };

    const { email, name } = v.values;

    const ok = await deps.updateUser(id, email, name);
    if (!ok) return { state: {}, effect: { kind: 'notFound' } };

    const from = normalizeFrom(deps, formData.get('from'));

    return {
      state: {},
      effect: {
        kind: 'redirect',
        to: deps.routes.detail(id, { from }),
        toast: 'saved',
      },
    };
  } catch (err: unknown) {
    if (isDuplicateEmailError(err)) {
      return {
        state: {
          fieldErrors: { email: 'このメールアドレスは既に使用されています' },
        },
        effect: { kind: 'none' },
      };
    }
    return {
      state: {
        message: err instanceof Error ? err.message : '更新に失敗しました',
      },
      effect: { kind: 'none' },
    };
  }
}

export async function deleteUserCore(
  deps: Deps,
  formData: FormData,
): Promise<{ effect: ActionEffect; revalidate?: string[] }> {
  await deps.requireAdmin();

  const id = parseIdOrThrow(formData);

  const ok = await deps.deleteUser(id);
  if (!ok) return { effect: { kind: 'notFound' } };

  const from = formData.get('from');
  const fallback = deps.routes.index({ page: 1 });

  const to =
    typeof from === 'string' && from.startsWith('/admin/users?')
      ? from
      : fallback;

  return {
    effect: { kind: 'redirect', to, toast: 'deleted' },
    revalidate: [deps.routes.index({ page: 1 })],
  };
}

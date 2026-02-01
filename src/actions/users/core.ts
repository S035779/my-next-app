import type { UserFormState } from './types';
import { validateUserInput, parseIdOrThrow } from './validation';
import { isDuplicateEmailError } from '../../lib/db-errors';

export type ActionEffect =
  | { kind: 'none' }
  | { kind: 'revalidate'; paths: string[] }
  | { kind: 'redirect'; to: string }
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
};

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

    return {
      state: {},
      effect: { kind: 'redirect', to: `/users/${id}` },
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

    return {
      state: {},
      effect: { kind: 'redirect', to: `/users/${id}` },
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
): Promise<{ effect: ActionEffect }> {
  await deps.requireAdmin();

  const id = parseIdOrThrow(formData);

  const ok = await deps.deleteUser(id);
  if (!ok) return { effect: { kind: 'notFound' } };

  return { effect: { kind: 'redirect', to: '/users' } };
}

'use client';

import { useActionState } from 'react';
import { updateUserAction } from '../../../../actions/users';
import { useFormStatus } from 'react-dom';

/**
 * 送信ボタンコンポーネント
 * @returns JSX.Element
 */
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button data-testid="user-save" type="submit" disabled={pending}>
      {pending ? '保存中...' : '保存'}
    </button>
  );
}

/**
 * ユーザー編集フォームコンポーネント
 * @param props コンポーネントプロパティ
 * @returns JSX.Element
 */
export default function UserEditForm(props: {
  id: number;
  email: string;
  name: string | null;
}) {
  const [state, formAction] = useActionState(updateUserAction, {});
  const emailErrorId = state.fieldErrors?.email
    ? 'edit-email-error'
    : undefined;

  return (
    <form action={formAction} data-testid="user-form">
      <input type="hidden" name="id" value={String(props.id)} />

      <div>
        <label>
          Email:
          <input
            data-testid="user-email"
            name="email"
            type="email"
            defaultValue={props.email}
            required
            aria-invalid={!!state.fieldErrors?.email}
            aria-describedby={emailErrorId}
          />
        </label>

        {state.fieldErrors?.email && (
          <p
            id="edit-email-error"
            data-error-code="DUPLICATE_EMAIL"
            data-testid="error-email"
            style={{ color: 'crimson' }}
          >
            {state.fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <label>
          Name:
          <input
            data-testid="user-name"
            name="name"
            defaultValue={props.name ?? ''}
          />
        </label>

        {state.fieldErrors?.name && (
          <p style={{ color: 'crimson' }} data-testid="error-name">
            {state.fieldErrors.name}
          </p>
        )}
      </div>

      {state.message && (
        <p style={{ color: 'crimson' }} data-testid="error-form">
          {state.message}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}

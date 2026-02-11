'use client';

import { useActionState } from 'react';
import { createUserAction } from '../../../../actions/users';
import { useFormStatus } from 'react-dom';

/**
 * 送信ボタンコンポーネント
 * @returns JSX.Element
 */
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button data-testid="user-submit" type="submit" disabled={pending}>
      {pending ? '追加中...' : '追加'}
    </button>
  );
}

/**
 * ユーザー作成フォームコンポーネント
 * @returns JSX.Element
 */
export default function UserCreateForm() {
  const [state, formAction] = useActionState(createUserAction, {});

  const emailErrorId = state.fieldErrors?.email
    ? 'create-email-error'
    : undefined;

  return (
    <form action={formAction} data-testid="user-form">
      <div>
        <label>
          Email:
          <input
            data-testid="user-email"
            name="email"
            type="email"
            required
            aria-invalid={!!state.fieldErrors?.email}
            aria-describedby={emailErrorId}
          />
        </label>
        {state.fieldErrors?.email && (
          <p
            id="create-email-error"
            data-testid="error-email"
            data-error-code="DUPLICATE_EMAIL"
            style={{ color: 'crimson' }}
          >
            {state.fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <label>
          Name:
          <input data-testid="user-name" name="name" />
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

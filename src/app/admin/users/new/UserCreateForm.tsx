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
    <button type="submit" disabled={pending}>
      {pending ? 'Creating...' : 'Create'}
    </button>
  );
}

/**
 * ユーザー作成フォームコンポーネント
 * @returns JSX.Element
 */
export default function UserCreateForm() {
  const [state, formAction] = useActionState(createUserAction, {});

  return (
    <form action={formAction}>
      <div>
        <label>
          Email:
          <input
            name="email"
            type="email"
            required
            aria-invalid={!!state.fieldErrors?.email}
            aria-describedby={
              state.fieldErrors?.email ? 'email-error' : undefined
            }
          />
        </label>
        {state.fieldErrors?.email && (
          <p id="email-error" style={{ color: 'crimson' }}>
            {state.fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <label>
          Name:
          <input name="name" />
        </label>
        {state.fieldErrors?.name && (
          <p style={{ color: 'crimson' }}>{state.fieldErrors.name}</p>
        )}
      </div>

      {state.message && <p style={{ color: 'crimson' }}>{state.message}</p>}

      <SubmitButton />
    </form>
  );
}

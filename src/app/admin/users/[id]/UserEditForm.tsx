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
    <button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
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

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={String(props.id)} />

      <div>
        <label>
          Email:
          <input
            name="email"
            type="email"
            defaultValue={props.email}
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
          <input name="name" defaultValue={props.name ?? ''} />
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

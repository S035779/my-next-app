'use client';

import { useActionState } from 'react';
import { createUserAction } from '../../../../actions/users';
import AdminFormField from '../../../../components/admin/AdminFormField';
import AdminTextInput from '../../../../components/admin/AdminTextInput';
import AdminPrimaryButton from '../../../../components/admin/AdminPrimaryButton';
import AdminErrorSummary from '../../../../components/admin/AdminErrorSummary';
import AdminFormActions from '../../../../components/admin/AdminFormActions';

/**
 * ユーザー作成フォームコンポーネント
 * @param from 元URL
 * @returns JSX.Element
 */
export default function UserCreateForm({ from }: { from?: string }) {
  const [state, formAction] = useActionState(createUserAction, {});
  const cancelHref = from && from.trim() ? from : '/admin/users?page=1';

  const emailHasError = !!state.fieldErrors?.email;

  return (
    <form
      action={formAction}
      data-testid="user-form"
      className="space-y-4"
      noValidate
    >
      <input type="hidden" name="from" value={from ?? ''} />

      <AdminErrorSummary
        message={state.message}
        fieldErrors={state.fieldErrors}
        fieldIdMap={{ email: 'email', name: 'name' }}
      />

      <AdminFormField
        label="Email"
        htmlFor="email"
        required
        description="ログインIDとして使用します。あとから変更できます。"
        error={state.fieldErrors?.email}
        errorTestId={state.fieldErrors?.email ? 'error-email' : undefined}
        errorCode={state.fieldErrors?.email ? 'DUPLICATE_EMAIL' : undefined}
      >
        <AdminTextInput
          name="email"
          type="email"
          required
          autoComplete="email"
          data-testid="user-email"
          aria-invalid={emailHasError}
        />
      </AdminFormField>

      <AdminFormField
        label="Name"
        htmlFor="name"
        description="表示名（任意）"
        error={state.fieldErrors?.name}
      >
        <AdminTextInput
          name="name"
          autoComplete="name"
          data-testid="user-name"
          aria-invalid={!!state.fieldErrors?.name}
        />
      </AdminFormField>

      <AdminFormActions cancelHref={cancelHref}>
        <AdminPrimaryButton
          label="追加"
          pendingLabel="追加中..."
          testId="user-submit"
        />
      </AdminFormActions>
    </form>
  );
}

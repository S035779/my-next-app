'use client';

import { useActionState } from 'react';
import { updateUserAction } from '../../../../actions/users';
import AdminFormField from '../../../../components/admin/AdminFormField';
import AdminTextInput from '../../../../components/admin/AdminTextInput';
import AdminPrimaryButton from '../../../../components/admin/AdminPrimaryButton';
import AdminErrorSummary from '../../../../components/admin/AdminErrorSummary';
import AdminFormActions from '../../../../components/admin/AdminFormActions';

/**
 * ユーザー編集フォームコンポーネント
 * @param props コンポーネントプロパティ
 * @returns JSX.Element
 */
export default function UserEditForm(props: {
  id: number;
  email: string;
  name: string | null;
  from?: string;
}) {
  const [state, formAction] = useActionState(updateUserAction, {});
  const cancelHref =
    props.from && props.from.trim() ? props.from : '/admin/users?page=1';

  const emailHasError = !!state.fieldErrors?.email;

  return (
    <form
      action={formAction}
      data-testid="user-form"
      className="space-y-4"
      noValidate
    >
      <input type="hidden" name="id" value={String(props.id)} />
      <input type="hidden" name="from" value={props.from ?? ''} />

      <AdminErrorSummary
        message={state.message}
        fieldErrors={state.fieldErrors}
        fieldIdMap={{ email: 'email', name: 'name' }}
      />

      <AdminFormField
        label="Email"
        htmlFor="email"
        required
        description="ログインIDとして使用します。"
        error={state.fieldErrors?.email}
        errorTestId={state.fieldErrors?.email ? 'error-email' : undefined}
        errorCode={state.fieldErrors?.email ? 'DUPLICATE_EMAIL' : undefined}
      >
        <AdminTextInput
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={props.email}
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
          defaultValue={props.name ?? ''}
          data-testid="user-name"
          aria-invalid={!!state.fieldErrors?.name}
        />
      </AdminFormField>

      <AdminFormActions cancelHref={cancelHref}>
        <AdminPrimaryButton
          label="保存"
          pendingLabel="保存中..."
          testId="user-save"
        />
      </AdminFormActions>
    </form>
  );
}

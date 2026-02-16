'use client';

import { useFormStatus } from 'react-dom';

type Props = {
  formId?: string;
  label?: string;
};

function Submit({ formId, label = '削除' }: Props) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      form={formId}
      data-testid="user-delete"
      disabled={pending}
      className="inline-flex items-center rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
    >
      {pending ? '削除中...' : label}
    </button>
  );
}

export default function DeleteUserButton(props: Props) {
  return <Submit {...props} />;
}

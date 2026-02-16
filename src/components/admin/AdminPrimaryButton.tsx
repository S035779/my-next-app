'use client';

import { useFormStatus } from 'react-dom';
import { cn } from '../../lib/cn';

type Props = {
  label: string;
  pendingLabel?: string;
  testId?: string;
  className?: string;
};

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"
    />
  );
}

export default function AdminPrimaryButton({
  label,
  pendingLabel,
  testId,
  className,
}: Props) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      data-testid={testId}
      disabled={pending}
      aria-busy={pending}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium',
        'bg-gray-900 text-white hover:bg-gray-800',
        'disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
    >
      {pending ? <Spinner /> : null}
      {pending ? (pendingLabel ?? label) : label}
    </button>
  );
}

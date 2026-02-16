'use client';

type FieldErrors = Record<string, string | undefined>;

type Props = {
  message?: string;
  fieldErrors?: FieldErrors;
  // 例: { email: 'email', name: 'name' } のように
  // field名 -> input id を対応させる（未指定なら fieldKey をそのまま使う）
  fieldIdMap?: Record<string, string>;
  testId?: string; // 任意
};

function entriesOf(errors?: FieldErrors): Array<[string, string]> {
  if (!errors) return [];
  return Object.entries(errors).filter(
    (e): e is [string, string] =>
      typeof e[1] === 'string' && e[1].trim().length > 0,
  );
}

export default function AdminErrorSummary({
  message,
  fieldErrors,
  fieldIdMap,
  testId = 'error-summary',
}: Props) {
  const items = entriesOf(fieldErrors);
  const hasAny = Boolean(message) || items.length > 0;
  if (!hasAny) return null;

  const focusField = (fieldKey: string) => {
    const id = fieldIdMap?.[fieldKey] ?? fieldKey;
    const el = document.getElementById(id) as HTMLElement | null;
    el?.focus?.();
    el?.scrollIntoView?.({ block: 'center', behavior: 'smooth' });
  };

  return (
    <div
      data-testid={testId}
      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
      role="alert"
      aria-live="polite"
    >
      <div className="font-semibold">入力内容を確認してください</div>

      {message ? <p className="mt-1">{message}</p> : null}

      {items.length > 0 ? (
        <ul className="mt-2 list-disc pl-5 space-y-1">
          {items.map(([k, v]) => (
            <li key={k}>
              <button
                type="button"
                className="underline underline-offset-4 hover:opacity-80"
                onClick={() => focusField(k)}
              >
                {v}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

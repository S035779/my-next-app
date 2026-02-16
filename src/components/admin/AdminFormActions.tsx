import Link from 'next/link';

type Props = {
  cancelHref: string;
  cancelLabel?: string;
  children: React.ReactNode; // primary button
};

export default function AdminFormActions({
  cancelHref,
  cancelLabel = 'キャンセル',
  children,
}: Props) {
  return (
    <div className="pt-2 flex items-center gap-3">
      {children}

      <Link
        href={cancelHref}
        className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        {cancelLabel}
      </Link>
    </div>
  );
}

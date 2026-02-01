import Link from 'next/link';

export default function AdminForbiddenPage() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold">403 Forbidden</h1>
      <p className="mt-2 text-sm text-gray-600">
        このページにアクセスする権限がありません。
      </p>
      <p className="mt-4">
        <Link className="underline" href="/">
          トップへ戻る
        </Link>
      </p>
    </main>
  );
}

import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <main style={{ padding: 16 }}>
      <h1>403 Forbidden</h1>
      <p>この画面を表示する権限がありません。</p>
      <p>
        <Link href="/">トップへ戻る</Link>
      </p>
    </main>
  );
}

import Link from 'next/link';

/**
 * ユーザー未発見ページ
 * @returns ユーザー未発見ページコンポーネント
 */
export default function NotFound() {
  return (
    <main style={{ padding: 16 }}>
      <h1>User not found</h1>
      <p>
        指定されたユーザーは存在しません（削除済み、またはURLのIDが不正です）。
      </p>
      <p>
        <Link href="/users">← ユーザー一覧に戻る</Link>
      </p>
    </main>
  );
}

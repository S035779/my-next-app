/**
 * ユーザー未発見ページ
 * @returns ユーザー未発見ページコンポーネント
 */
export default function NotFound() {
  return (
    <div data-testid="not-found">
      <h1 data-testid="not-found-title">Not Found</h1>
      <p data-testid="not-found-message">
        指定されたユーザーは存在しません（削除済み、またはURLのIDが不正です）。
      </p>
    </div>
  );
}

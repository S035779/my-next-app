/**
 * 参照権限なしページ
 * @returns 参照権限なしページコンポーネント
 */
export default function AdminForbiddenPage() {
  return (
    <div data-testid="forbidden">
      <h1 data-testid="forbidden-title">Forbidden</h1>
      <p data-testid="forbidden-message">
        このページにアクセスする権限がありません。
      </p>
    </div>
  );
}

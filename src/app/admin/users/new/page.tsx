import Link from 'next/link';
import UserCreateForm from './UserCreateForm';

/**
 * 新規ユーザー作成ページ
 * @returns JSX.Element
 */
export default function NewUserPage() {
  return (
    <main style={{ padding: 16 }}>
      <p>
        <Link href="/admin/users">← ユーザー一覧に戻る</Link>
      </p>

      <h1>Create User</h1>
      <UserCreateForm />
    </main>
  );
}

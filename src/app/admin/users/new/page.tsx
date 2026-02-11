import Link from 'next/link';
import UserCreateForm from './UserCreateForm';

/**
 * 新規ユーザー作成ページ
 * @returns JSX.Element
 */
export default function NewUserPage() {
  return (
    <div className="px-6 py-4" data-testid="admin-user-new-page">
      <h1 data-testid="page-title" className="text-lg font-bold">
        ユーザー作成
      </h1>
      <UserCreateForm />
    </div>
  );
}

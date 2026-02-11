import Link from 'next/link';
import { listUsers } from '../../../db/users.repo.next';

/**
 * ユーザー一覧ページ
 * @returns JSX.Element
 */
export default async function UsersPage() {
  const rows = await listUsers(50);
  return (
    <>
      <div
        data-testid="admin-users-page"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 data-testid="page-title" className="text-lg font-bold">
          ユーザー管理
        </h1>
        <Link href="/admin/users/new" data-testid="user-new-link">
          + 新規作成
        </Link>
      </div>

      <ul data-testid="users-list">
        {rows.map((u) => (
          <li key={u.id} data-testid={`user-row-${u.id}`}>
            <Link
              href={`/admin/users/${u.id}`}
              data-testid={`user-link-${u.id}`}
            >
              {u.email}
            </Link>
            {u.name ? ` (${u.name})` : ''}
          </li>
        ))}
      </ul>
    </>
  );
}

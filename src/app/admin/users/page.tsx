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
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ margin: 0 }}>ユーザー一覧</h1>
        <Link href="/admin/users/new">+ 新規作成</Link>
      </div>

      <ul>
        {rows.map((u) => (
          <li key={u.id}>
            <Link href={`/admin/users/${u.id}`}>{u.email}</Link>
            {u.name ? ` (${u.name})` : ''}
          </li>
        ))}
      </ul>
    </>
  );
}

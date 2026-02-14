import Link from 'next/link';
import { listUsersPage } from '../../../db/users.repo.next';

type Props = {
  searchParams: Promise<{ page?: string }>;
};

const PER_PAGE = 20;
/**
 * ユーザー一覧ページ
 * @returns JSX.Element
 */
export default async function UsersPage({ searchParams }: Props) {
  const { page } = await searchParams;
  const pageNum = Number(page ?? '1');

  const data = await listUsersPage(pageNum, PER_PAGE);

  return (
    <>
      <div
        data-testid="admin-users-page"
        className="flex items-center justify-between"
      >
        <h1 data-testid="page-title" className="text-lg font-bold">
          ユーザー管理
        </h1>
        <Link href="/admin/users/new" data-testid="user-new-link">
          + 新規作成
        </Link>
      </div>

      <ul data-testid="users-list" className="mt-4 space-y-1">
        {data.rows.map((u) => (
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

      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {data.total} 件 ({data.page}/{data.totalPages})
        </div>

        <div className="flex gap-2">
          <Link
            aria-disabled={data.page <= 1}
            className={data.page <= 1 ? 'pointer-events-none opacity-50' : ''}
            href={`/admin/users?page=${data.page - 1}`}
          >
            前へ
          </Link>

          <Link
            aria-disabled={data.page >= data.totalPages}
            className={
              data.page >= data.totalPages
                ? 'pointer-events-none opacity-50'
                : ''
            }
            href={`/admin/users?page=${data.page + 1}`}
          >
            次へ
          </Link>
        </div>
      </div>
    </>
  );
}

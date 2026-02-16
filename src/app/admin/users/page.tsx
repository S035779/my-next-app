import Link from 'next/link';
import { listUsersPage } from '../../../db/users.repo.next';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import Pagination from '../../../components/admin/Pagination';
import UserSearchBar from '../../../components/admin/UserSearchBar';

type Props = {
  searchParams: Promise<{ page?: string; q?: string }>;
};

const PAGE_SIZE = 20;

function toPageNum(v: unknown): number {
  const n = Number(v ?? '1');
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
}

function toQ(v: unknown): string {
  return String(v ?? '').trim();
}

function usersListHref(page: number, q?: string) {
  const qs = new URLSearchParams();
  qs.set('page', String(page));
  const qq = (q ?? '').trim();
  if (qq) qs.set('q', qq);
  return `/admin/users?${qs.toString()}`;
}

/**
 * ユーザー一覧ページ
 * @returns JSX.Element
 */
export default async function UsersPage({ searchParams }: Props) {
  const { page, q } = await searchParams;
  const pageNum = toPageNum(page);
  const qStr = toQ(q);

  const data = await listUsersPage(pageNum, PAGE_SIZE, qStr);

  const current = usersListHref(data.page, qStr);

  const clearHref = usersListHref(1);

  const from = data.total === 0 ? 0 : (data.page - 1) * data.perPage + 1;
  const to =
    data.total === 0 ? 0 : Math.min(data.total, data.page * data.perPage);

  return (
    <>
      <AdminPageHeader
        title="ユーザー管理"
        titleTestId="page-title"
        breadcrumbs={[
          { label: '管理', href: '/admin' },
          { label: 'ユーザー管理' },
        ]}
        description="ユーザーの作成・編集・削除を行います。"
        right={
          <div className="flex items-center gap-2">
            <Link
              href={{ pathname: '/admin/users/new', query: { from: current } }}
              data-testid="user-new-link"
              className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
            >
              + 新規作成
            </Link>
          </div>
        }
      />

      {/* 検索 */}
      <UserSearchBar q={qStr} clearHref={clearHref} />

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {data.rows.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-gray-600">
            <div className="mx-auto max-w-md">
              <div className="text-base font-semibold text-gray-900">
                {qStr
                  ? '該当するユーザーが見つかりません。'
                  : 'ユーザーがまだいません。'}
              </div>
              <p className="mt-2 text-gray-600">
                {qStr
                  ? '検索条件を変えて再度お試しください。'
                  : '「+ 新規作成」から追加できます。'}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* table ... */}
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left font-medium w-[90px]"
                  >
                    ID
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium">
                    メール
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium">
                    名前
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">
                    操作
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {data.rows.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-gray-50"
                    data-testid={`user-row-${u.id}`}
                  >
                    <td className="px-4 py-3 text-gray-500 tabular-nums">
                      {u.id}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={{
                          pathname: `/admin/users/${u.id}`,
                          query: { from: current },
                        }}
                        data-testid={`user-link-${u.id}`}
                        className="font-medium text-gray-900 underline-offset-4 hover:underline"
                      >
                        {u.email}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{u.name ?? '-'}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <Link
                        href={{
                          pathname: `/admin/users/${u.id}`,
                          query: { from: current },
                        }}
                        data-testid={`user-edit-link-${u.id}`}
                        className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-50"
                        aria-label={`ユーザー編集: ${u.email}`}
                      >
                        編集
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 text-sm">
          <div className="text-gray-500" data-testid="users-count">
            {data.total === 0
              ? '0 件'
              : `${from}-${to} 件目 / 全 ${data.total} 件（${data.page}/${data.totalPages}）`}
            {qStr ? <span className="ml-2">検索: “{qStr}”</span> : null}
          </div>

          {data.total > 0 ? (
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              makeHref={(p) => usersListHref(p, qStr)}
              testId="users"
            />
          ) : null}
        </div>
      </section>
    </>
  );
}

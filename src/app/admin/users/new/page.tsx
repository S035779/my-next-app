import Link from 'next/link';
import UserCreateForm from './UserCreateForm';
import AdminPageHeader from '../../../../components/admin/AdminPageHeader';
import { adminUsersRoutes } from '../../../../lib/routes/adminUsers';

type Props = {
  searchParams?: { from?: string };
};

/**
 * 新規ユーザー作成ページ
 * @returns JSX.Element
 */
export default function NewUserPage({ searchParams }: Props) {
  const from = (searchParams?.from ?? '').trim();
  const backHref = from || adminUsersRoutes.index({ page: 1 });

  return (
    <div data-testid="admin-user-new-page">
      <AdminPageHeader
        title="ユーザー作成"
        titleTestId="page-title"
        breadcrumbs={[
          { label: '管理', href: '/admin' },
          { label: 'ユーザー管理', href: adminUsersRoutes.index({ page: 1 }) },
          { label: 'ユーザー作成' },
        ]}
        right={
          <Link
            href={backHref}
            className="text-sm text-gray-600 hover:text-gray-900 underline-offset-4 hover:underline"
          >
            ← 一覧へ戻る
          </Link>
        }
      />

      <UserCreateForm from={from || undefined} />
    </div>
  );
}

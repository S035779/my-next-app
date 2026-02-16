import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findUserById } from '../../../../db/users.repo.next';
import UserEditForm from './UserEditForm';
import { deleteUserAction } from '../../../../actions/users';
import AdminPageHeader from '../../../../components/admin/AdminPageHeader';
import { adminUsersRoutes } from '../../../../lib/routes/adminUsers';
import { safeFrom } from '../../../../lib/urls';
import DeleteUserButton from '../../../../components/admin/DeleteUserButton';
import DeleteUserConfirmForm from '../../../../components/admin/DeleteUserConfirmForm';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
};

/**
 * ユーザー編集ページ
 * @param params パスパラメーター
 * @returns JSX.Element
 */
export default async function UserEditPage({ params, searchParams }: Props) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isFinite(id)) notFound();

  const user = await findUserById(id);
  if (!user) notFound();

  const sp = await searchParams;
  const fromRaw = (sp?.from ?? '').trim();
  const backHref = safeFrom(fromRaw, adminUsersRoutes.index({ page: 1 }));

  return (
    <div data-testid="admin-user-edit-page">
      <AdminPageHeader
        title="ユーザー編集"
        titleTestId="page-title"
        breadcrumbs={[
          { label: '管理', href: '/admin' },
          { label: 'ユーザー管理', href: adminUsersRoutes.index({ page: 1 }) },
          { label: 'ユーザー編集' },
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

      <UserEditForm
        id={user.id}
        email={user.email}
        name={user.name ?? null}
        from={backHref}
      />

      {/* 危険操作セクション */}
      <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-sm font-semibold text-red-800">危険操作</h2>

        <p className="mt-2 text-sm text-red-700">
          このユーザーを削除します。削除後は元に戻せません。
        </p>

        <DeleteUserConfirmForm
          id="user-delete-form"
          action={deleteUserAction}
          method="post"
          data-testid="user-delete-form"
          confirmMessage="このユーザーを削除します。よろしいですか？"
        >
          <input type="hidden" name="id" value={String(user.id)} />
          <input type="hidden" name="from" value={backHref} />
        </DeleteUserConfirmForm>

        <DeleteUserButton formId="user-delete-form" />
      </section>
    </div>
  );
}

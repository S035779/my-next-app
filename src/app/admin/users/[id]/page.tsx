import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findUserById } from '../../../../db/users.repo.next';
import UserEditForm from './UserEditForm';
import { deleteUserAction } from '../../../../actions/users';

type Props = { params: Promise<{ id: string }> };

/**
 * ユーザー編集ページ
 * @param params パスパラメーター
 * @returns JSX.Element
 */
export default async function UserEditPage({ params }: Props) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isFinite(id)) notFound();

  const user = await findUserById(id);
  if (!user) notFound();

  return (
    <div className="px-6 py-4" data-testid="admin-user-edit-page">
      <h1 data-testid="page-title" className="text-lg font-bold">
        ユーザー編集
      </h1>
      <UserEditForm id={user.id} email={user.email} name={user.name ?? null} />
      <hr style={{ margin: '16px 0' }} />
      <form action={deleteUserAction} data-testid="user-delete-form">
        <input type="hidden" name="id" value={String(user.id)} />
        <button
          data-testid="user-delete"
          type="submit"
          style={{ color: 'red' }}
        >
          削除
        </button>
      </form>
    </div>
  );
}

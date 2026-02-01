import AdminShell from '../../../components/admin/AdminShell';
import { requireAdmin } from '../../../lib/auth/requireAdmin';

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return <AdminShell title="ユーザー管理">{children}</AdminShell>;
}

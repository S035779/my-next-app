import AdminShell from '../../../components/admin/AdminShell';
import { requireAdmin } from '../../../lib/auth/requireAdmin';

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return <AdminShell>{children}</AdminShell>;
}

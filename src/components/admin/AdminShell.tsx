import AdminShellClient from './AdminShellClient';

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShellClient>{children}</AdminShellClient>;
}

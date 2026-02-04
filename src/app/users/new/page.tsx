import { redirect } from 'next/navigation';

export default function UsersNewLegacyRedirect() {
  redirect('/admin/users/new');
}

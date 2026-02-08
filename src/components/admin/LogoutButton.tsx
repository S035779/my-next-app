'use client';

import { useClerk } from '@clerk/nextjs';
import { usePathname, useSearchParams } from 'next/navigation';

type Props = {
  children: React.ReactNode;
};

export default function LogoutButton({ children }: Props) {
  const clerk = useClerk();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <button
      type="button"
      onClick={async () => {
        // 現在の相対URL（パス + クエリ）を保持
        const qs = searchParams?.toString();
        const returnTo = qs ? `${pathname}?${qs}` : pathname;

        // サインイン画面へ飛ばすURLに「戻り先」を埋め込む
        const signInUrl = `/sign-in?redirect_url=${encodeURIComponent(returnTo)}`;

        await clerk.signOut({ redirectUrl: signInUrl });
      }}
    >
      {children}
    </button>
  );
}

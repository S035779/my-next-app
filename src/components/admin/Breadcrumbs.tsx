'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../lib/cn';

type Crumb = { href: string; label: string };

function userLabel(path: string) {
  // /users/new, /users/[id] の表記を調整
  if (path === 'new') return '新規作成';
  if (/^\d+$/.test(path)) return `#${path}`;
  return path;
}

function buildCrumbs(pathname: string): Crumb[] {
  const parts = pathname.split('?')[0].split('#')[0].split('/').filter(Boolean);

  const crumbs: Crumb[] = [{ href: '/', label: 'ホーム' }];

  // /users...
  if (parts[0] === 'users') {
    crumbs.push({ href: '/users', label: 'ユーザー管理' });

    if (parts.length >= 2) {
      const second = parts[1];
      if (second === 'new') {
        crumbs.push({ href: '/users/new', label: '新規作成' });
      } else {
        crumbs.push({ href: `/users/${second}`, label: userLabel(second) });
      }
    }
    return crumbs;
  }

  // それ以外（必要になったら拡張）
  let acc = '';
  for (const p of parts) {
    acc += `/${p}`;
    crumbs.push({ href: acc, label: p });
  }
  return crumbs;
}

export default function Breadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname() ?? '/';
  const crumbs = buildCrumbs(pathname);

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('text-xs text-gray-500', className)}
    >
      <ol className="flex items-center gap-2">
        {crumbs.map((c, idx) => {
          const isLast = idx === crumbs.length - 1;
          return (
            <li key={c.href} className="flex items-center gap-2">
              {idx !== 0 && <span className="text-gray-300">/</span>}
              {isLast ? (
                <span className="text-gray-700 font-medium">{c.label}</span>
              ) : (
                <Link
                  href={c.href}
                  className="hover:text-gray-700 hover:underline"
                >
                  {c.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

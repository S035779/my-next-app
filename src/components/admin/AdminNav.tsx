'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

export type NavItem = { href: string; label: string; icon: LucideIcon };
export type NavSection = { title: string; items: NavItem[] };

function matches(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + '/');
}

export default function AdminNav({
  sections,
  collapsed,
  onNavigate,
}: {
  sections: NavSection[];
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname() ?? '';

  const allItems = sections.flatMap((s) => s.items);

  // 最長一致で active を1つに
  const activeHref =
    allItems
      .filter((i) => matches(pathname, i.href))
      .sort((a, b) => b.href.length - a.href.length)[0]?.href ?? null;

  return (
    <nav className="mt-4">
      <div className="grid gap-4">
        {sections.map((section) => (
          <section key={section.title}>
            <div
              className={cn(
                'px-3 text-[11px] font-semibold tracking-wide text-gray-500',
                collapsed && 'hidden',
              )}
            >
              {section.title}
            </div>

            <ul className="mt-2 grid gap-1">
              {section.items.map((item) => {
                const active = item.href === activeHref;
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm border transition',
                        collapsed && 'justify-center px-2',
                        active
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-white text-gray-900 border-transparent hover:border-gray-200 hover:bg-gray-50',
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      {/* Active left border */}
                      <span
                        className={cn(
                          'absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r',
                          active ? 'bg-white' : 'bg-transparent',
                        )}
                        aria-hidden="true"
                      />

                      <Icon
                        className={cn(
                          'h-4 w-4 shrink-0',
                          active
                            ? 'text-white'
                            : 'text-gray-500 group-hover:text-gray-700',
                        )}
                      />

                      <span className={cn('truncate', collapsed && 'hidden')}>
                        {item.label}
                      </span>
                      {collapsed && (
                        <span className="sr-only">{item.label}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </nav>
  );
}

'use client';

import { useState } from 'react';
import { UserButton } from '@clerk/nextjs';
import { Users, UserPlus, Settings, PanelLeftClose, Menu } from 'lucide-react';
import AdminNav, { type NavSection } from './AdminNav';
import Breadcrumbs from './Breadcrumbs';
import { cn } from '../../lib/cn';

const navSections: NavSection[] = [
  {
    title: '各種管理',
    items: [
      { href: '/admin/users', label: 'ユーザー管理', icon: Users },
      { href: '/admin/users/new', label: 'ユーザー作成', icon: UserPlus },
    ],
  },
  {
    title: 'システム',
    items: [{ href: '/settings', label: '設定', icon: Settings }],
  },
];

export default function AdminShellClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-dvh">
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar (Desktop) */}
      <aside
        className={cn(
          'hidden md:flex fixed left-0 top-0 h-dvh flex-col border-r border-gray-200 bg-white transition-[width] duration-200',
          collapsed ? 'w-[72px] px-3 py-4' : 'w-[260px] p-4',
        )}
      >
        <div className="mb-4">
          {collapsed ? (
            // collapsed: ロゴ(A)をトグルボタン化（これだけ表示）
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              aria-label="Expand sidebar"
              title="Expand"
              className="h-10 w-10 mx-auto grid place-items-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50"
            >
              <span className="font-bold">A</span>
            </button>
          ) : (
            // expanded: ロゴ + タイトル + 右端ボタン
            <div className="grid grid-cols-[40px_1fr_40px] items-center gap-3">
              <div className="h-10 w-10 grid place-items-center rounded-xl border border-gray-200 font-bold">
                A
              </div>

              <div className="min-w-0">
                <div className="font-bold truncate">システム管理</div>
                <div className="text-xs text-gray-500 truncate">
                  管理者ページ
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCollapsed(true)}
                aria-label="Collapse sidebar"
                title="Collapse"
                className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <AdminNav sections={navSections} collapsed={collapsed} />

        <div
          className={cn(
            'mt-auto pt-4 border-t border-gray-200 w-full',
            collapsed
              ? 'grid place-items-center'
              : 'flex items-center justify-between',
          )}
        >
          {!collapsed && (
            <span className="text-xs text-gray-500">利用者情報</span>
          )}
          <UserButton />
        </div>
      </aside>

      {/* Sidebar (Mobile drawer) */}
      <aside
        className={cn(
          'fixed z-50 md:hidden left-0 top-0 h-dvh w-[280px] bg-white border-r border-gray-200 p-4 transition-transform duration-200',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 grid place-items-center rounded-lg border border-gray-200 font-bold">
            A
          </div>
          <div className="min-w-0">
            <div className="font-bold truncate">システム管理</div>
            <div className="text-xs text-gray-500 truncate">管理者ページ</div>
          </div>

          <button
            className="ml-auto inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 hover:bg-gray-50"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>

        <AdminNav
          sections={navSections}
          collapsed={false}
          onNavigate={() => setMobileOpen(false)}
        />

        <div className="mt-auto pt-4 border-t border-gray-200 w-full flex items-center justify-between">
          <span className="text-xs text-gray-500">利用者情報</span>
          <UserButton />
        </div>
      </aside>

      {/* Main area: add left padding for desktop sidebar */}
      <div
        className={cn(
          'min-h-dvh transition-[padding] duration-200',
          collapsed ? 'md:pl-[72px]' : 'md:pl-[260px]',
        )}
      >
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="md:hidden inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 hover:bg-gray-50"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>

            <div className="min-w-0">
              <Breadcrumbs className="hidden sm:block" />
              <div className="font-bold truncate">管理者ページ</div>
            </div>
          </div>

          <div className="text-xs text-gray-500 hidden sm:block">
            管理者権限
          </div>
        </header>

        <main className="p-4 bg-gray-50">
          <div className="w-full bg-white border border-gray-200 rounded-2xl p-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { CheckCircle2, Save, Trash2 } from 'lucide-react';

type ToastKind = 'created' | 'saved' | 'deleted';

function readToastCookie(): ToastKind | null {
  const m = document.cookie.match(/(?:^|;\s*)toast=([^;]+)/);
  if (!m) return null;
  const v = decodeURIComponent(m[1]);
  return v === 'created' || v === 'saved' || v === 'deleted' ? v : null;
}

function clearToastCookie() {
  document.cookie = `toast=; Path=/; Max-Age=0; SameSite=Lax`;
}

/**
 * 外部ストア（React外）
 */
const listeners = new Set<() => void>();
let current: ToastKind | null = null;
let hideTimer: number | null = null;

function emit() {
  for (const l of listeners) l();
}

function setCurrent(v: ToastKind | null) {
  current = v;
  emit();
}

function scheduleHide(ms: number) {
  if (hideTimer) window.clearTimeout(hideTimer);
  hideTimer = window.setTimeout(() => {
    setCurrent(null);
    hideTimer = null;
  }, ms);
}

function syncFromCookie() {
  const v = readToastCookie();
  if (!v) return;

  clearToastCookie();
  setCurrent(v);
  scheduleHide(2500);
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function getSnapshot() {
  return current;
}

function meta(kind: ToastKind) {
  switch (kind) {
    case 'created':
      return {
        title: '作成しました',
        detail: 'ユーザーを追加しました。',
        Icon: CheckCircle2,
        accent: 'border-l-emerald-500',
        icon: 'text-emerald-600',
      };
    case 'saved':
      return {
        title: '保存しました',
        detail: '変更内容を保存しました。',
        Icon: Save,
        accent: 'border-l-blue-500',
        icon: 'text-blue-600',
      };
    case 'deleted':
      return {
        title: '削除しました',
        detail: 'ユーザーを削除しました。',
        Icon: Trash2,
        accent: 'border-l-red-500',
        icon: 'text-red-600',
      };
  }
}

export default function ToastHost() {
  const kind = useSyncExternalStore(subscribe, getSnapshot, () => null);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    syncFromCookie();
  }, [pathname, searchParams]);

  if (!kind) return null;

  const m = meta(kind);

  return (
    <div className="fixed right-4 top-16 z-50">
      <div
        role="status"
        aria-live="polite"
        className={[
          'w-[320px] max-w-[calc(100vw-2rem)]',
          'rounded-xl bg-white',
          'border border-gray-200 border-l-4',
          m.accent,
          'shadow-lg ring-1 ring-black/5',
          'px-4 py-3',
          // motion-safe only
          'motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2',
        ].join(' ')}
      >
        <div className="flex items-start gap-3">
          <m.Icon className={`mt-0.5 h-5 w-5 ${m.icon}`} />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-900">{m.title}</div>
            <div className="mt-0.5 text-sm text-gray-600">{m.detail}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

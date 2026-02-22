import Link from 'next/link';

type Props = {
  q: string; // 現在の検索文字列（trim済み推奨）
  clearHref: string; // クリアリンク先（例: /admin/users?page=1）
};

export default function UserSearchBar({ q, clearHref }: Props) {
  return (
    <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-3">
      <form
        action="/admin/users"
        method="get"
        className="flex flex-wrap items-center gap-2"
        data-testid="user-search-form"
      >
        {/* 検索したら1ページ目に戻す */}
        <input type="hidden" name="page" value="1" />

        <div className="relative">
          <input
            name="q"
            defaultValue={q}
            placeholder="メール or 名前で検索"
            data-testid="user-search-input"
            className="h-10 w-[320px] max-w-full rounded-lg border border-gray-200 bg-white px-3 pr-10 text-sm outline-none focus:border-gray-300"
          />
          {/* 見た目だけの虫眼鏡（任意。無ければ削除OK） */}
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            ⌕
          </span>
        </div>

        <button
          type="submit"
          data-testid="user-search-submit"
          className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
        >
          検索
        </button>

        {q ? (
          <Link
            href={clearHref}
            data-testid="user-search-clear"
            className="h-10 inline-flex items-center rounded-lg px-2 text-sm text-gray-600 hover:text-gray-900 underline-offset-4 hover:underline"
          >
            クリア
          </Link>
        ) : null}

        {/* 状態表示（E2Eには影響なし） */}
        <div className="ml-auto text-xs text-gray-500">
          {q ? (
            <span>
              検索中: <span className="text-gray-700">“{q}”</span>
            </span>
          ) : (
            <span>検索なし</span>
          )}
        </div>
      </form>
    </div>
  );
}

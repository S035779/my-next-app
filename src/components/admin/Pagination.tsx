import Link from 'next/link';

type Props = {
  page: number;
  totalPages: number;

  // page番号 -> href を作る（q維持もここで吸収）
  makeHref: (page: number) => string;

  prevLabel?: string;
  nextLabel?: string;

  // 表示する最大リンク数（奇数推奨）
  maxLinks?: number;

  /**
   * testid の prefix
   * 例: testId="users"
   *  - prev: users-prev
   *  - next: users-next
   *  - page: users-page-2
   */
  testId?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function buildPageItems(page: number, totalPages: number, maxLinks: number) {
  // totalPages=1 は [1] だけにしておく
  if (totalPages <= 1) return [1] as Array<number | 'gap'>;

  const safeMaxLinks = Math.max(3, maxLinks | 0);
  const half = Math.floor(safeMaxLinks / 2);

  let start = page - half;
  let end = page + half;

  if (start < 1) {
    end += 1 - start;
    start = 1;
  }
  if (end > totalPages) {
    start -= end - totalPages;
    end = totalPages;
  }
  start = Math.max(1, start);

  const pages: number[] = [];
  for (let p = start; p <= end; p++) pages.push(p);

  const items: Array<number | 'gap'> = [];

  if (pages[0] !== 1) {
    items.push(1);
    if (pages[0] > 2) items.push('gap');
  }

  for (const p of pages) items.push(p);

  const last = pages[pages.length - 1];
  if (last !== totalPages) {
    if (last < totalPages - 1) items.push('gap');
    items.push(totalPages);
  }

  return items;
}

export default function Pagination({
  page,
  totalPages,
  makeHref,
  prevLabel = '前へ',
  nextLabel = '次へ',
  maxLinks = 5,
  testId,
}: Props) {
  const safeTotal = Math.max(1, Number.isFinite(totalPages) ? totalPages : 1);
  const safePage = clamp(Number.isFinite(page) ? page : 1, 1, safeTotal);

  const hasPrev = safePage > 1;
  const hasNext = safePage < safeTotal;

  const items = buildPageItems(safePage, safeTotal, Math.max(3, maxLinks | 0));

  const btnBase =
    'inline-flex h-9 items-center rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50';
  const btnDisabled = 'pointer-events-none opacity-50';

  const tid = (suffix: string) => (testId ? `${testId}-${suffix}` : undefined);

  return (
    <nav
      aria-label="Pagination"
      data-testid={testId}
      className="flex items-center gap-1"
    >
      {/* 前へ */}
      <Link
        href={makeHref(Math.max(1, safePage - 1))}
        aria-disabled={!hasPrev}
        className={`${btnBase} ${!hasPrev ? btnDisabled : ''}`}
        data-testid={tid('prev')}
      >
        {prevLabel}
      </Link>

      {/* 数字 */}
      <div className="mx-1 hidden sm:flex items-center gap-1">
        {items.map((it, idx) => {
          if (it === 'gap') {
            return (
              <span
                key={`gap-${idx}`}
                className="inline-flex h-9 items-center px-2 text-sm text-gray-400"
                aria-hidden="true"
              >
                …
              </span>
            );
          }

          const p = it;
          const isCurrent = p === safePage;

          return (
            <Link
              key={p}
              href={makeHref(p)}
              aria-current={isCurrent ? 'page' : undefined}
              className={
                isCurrent
                  ? 'inline-flex h-9 items-center rounded-lg border border-gray-300 bg-gray-100 px-3 text-sm font-semibold text-gray-900'
                  : btnBase
              }
              data-testid={tid(`page-${p}`)}
            >
              {p}
            </Link>
          );
        })}
      </div>

      {/* 次へ */}
      <Link
        href={makeHref(Math.min(safeTotal, safePage + 1))}
        aria-disabled={!hasNext}
        tabIndex={!hasNext ? -1 : undefined}
        className={`${btnBase} ${!hasNext ? btnDisabled : ''}`}
        data-testid={tid('next')}
      >
        {nextLabel}
      </Link>
    </nav>
  );
}

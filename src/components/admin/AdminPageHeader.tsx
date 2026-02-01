import Link from 'next/link';

export type Breadcrumb = {
  label: string;
  href?: string; // 現在地は href を省略
};

export default function AdminPageHeader({
  title,
  breadcrumbs,
  description,
  right,
}: {
  title: string;
  breadcrumbs?: Breadcrumb[];
  description?: string;
  right?: React.ReactNode;
}) {
  return (
    <header className="mb-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-2 text-sm text-gray-500">
          <ol className="flex flex-wrap items-center gap-1">
            {breadcrumbs.map((bc, i) => {
              const isLast = i === breadcrumbs.length - 1;
              return (
                <li
                  key={`${bc.label}-${i}`}
                  className="flex items-center gap-1"
                >
                  {bc.href && !isLast ? (
                    <Link
                      className="hover:text-gray-700 underline-offset-4 hover:underline"
                      href={bc.href}
                    >
                      {bc.label}
                    </Link>
                  ) : (
                    <span className={isLast ? 'text-gray-700' : ''}>
                      {bc.label}
                    </span>
                  )}
                  {!isLast && <span className="text-gray-400">/</span>}
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
        </div>

        {right && <div className="shrink-0">{right}</div>}
      </div>
    </header>
  );
}

export function Skeleton({
  className = "",
}: {
  className?: string;
}) {
  return <div className={`admin-skeleton ${className}`} aria-hidden />;
}

export function SkeletonStatRow({ count = 4 }: { count?: number }) {
  return (
    <ul className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4" aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="admin-stat space-y-2">
          <Skeleton className="h-2.5 w-16" />
          <Skeleton className="h-7 w-12" />
          <Skeleton className="h-2.5 w-24" />
        </li>
      ))}
    </ul>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div
      className="overflow-hidden rounded-xl border border-[color:var(--admin-border)] bg-[var(--admin-panel)]"
      aria-busy="true"
      aria-label="Loading table"
    >
      <div className="border-b border-ink/8 bg-[var(--admin-thead)] px-4 py-3">
        <Skeleton className="h-2.5 w-40" />
      </div>
      <ul className="divide-y divide-ink/6">
        {Array.from({ length: rows }).map((_, i) => (
          <li key={i} className="flex items-center gap-3 px-4 py-3">
            <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-3 w-[40%]" />
              <Skeleton className="h-2.5 w-[65%]" />
            </div>
            <Skeleton className="hidden h-5 w-16 rounded-full sm:block" />
          </li>
        ))}
      </ul>
    </div>
  );
}

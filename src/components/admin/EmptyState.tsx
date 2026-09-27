import type { ReactNode } from "react";

export default function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="admin-empty flex flex-col items-center rounded-xl border border-dashed border-ink/12 bg-[var(--admin-panel)] px-5 py-12 text-center">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-bronze/20 to-bronze/5 text-bronze-dark ring-1 ring-bronze/20 dark:text-bronze-light"
        aria-hidden
      >
        {icon ?? (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M9 12h6m-6 4h6M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z"
            />
          </svg>
        )}
      </div>
      <h2 className="mt-4 font-display text-base font-semibold tracking-tight text-ink sm:text-lg">
        {title}
      </h2>
      <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-muted">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

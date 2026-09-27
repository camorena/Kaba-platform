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
    <div className="admin-empty flex flex-col items-center rounded-2xl border border-dashed border-ink/15 bg-surface px-6 py-14 text-center shadow-[inset_0_1px_0_color-mix(in_srgb,var(--ink)_3%,transparent)]">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-bronze/20 to-bronze/5 text-bronze-dark ring-1 ring-bronze/20 dark:text-bronze-light"
        aria-hidden
      >
        {icon ?? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M9 12h6m-6 4h6M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z"
            />
          </svg>
        )}
      </div>
      <h2 className="mt-5 font-display text-lg font-semibold tracking-tight text-ink">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

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
    <div className="admin-empty admin-gold-rail relative flex flex-col items-center overflow-hidden rounded-xl border border-dashed border-ink/12 bg-[var(--admin-panel)] px-5 py-14 text-center">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--bronze) 18%, transparent), transparent 55%)",
        }}
      />
      <div
        className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-bronze/25 to-bronze/5 text-bronze-dark shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] ring-1 ring-bronze/25 dark:text-bronze-light"
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
      <h2 className="relative mt-5 font-display text-base font-semibold tracking-tight text-ink sm:text-lg">
        {title}
      </h2>
      <p className="relative mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-muted">
        {description}
      </p>
      {action && <div className="relative mt-5">{action}</div>}
    </div>
  );
}

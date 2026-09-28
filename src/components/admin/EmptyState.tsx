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
    <div className="admin-empty relative flex flex-col items-center overflow-hidden rounded-xl border border-dashed border-ink/10 bg-[var(--admin-panel)]/60 px-5 py-12 text-center">
      {icon ? (
        <div
          className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--ink)_5%,transparent)] text-muted"
          aria-hidden
        >
          {icon}
        </div>
      ) : null}
      <h2
        className={`relative font-display text-base font-semibold tracking-tight text-ink ${icon ? "mt-4" : ""}`}
      >
        {title}
      </h2>
      <p className="relative mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-muted">
        {description}
      </p>
      {action && <div className="relative mt-4">{action}</div>}
    </div>
  );
}

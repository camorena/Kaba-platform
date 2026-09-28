import type { ReactNode } from "react";
import Breadcrumbs, { type Crumb } from "@/components/admin/Breadcrumbs";

export default function PageHeader({
  title,
  description,
  actions,
  meta,
  crumbs,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  meta?: ReactNode;
  crumbs?: Crumb[];
}) {
  return (
    <header className="admin-page-header mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {crumbs && crumbs.length > 0 ? <Breadcrumbs items={crumbs} /> : null}
        {meta}
        <div className="admin-title-rule mb-2" aria-hidden />
        <h1 className="font-display text-[1.35rem] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[1.65rem] lg:text-[1.75rem]">
          {title}
        </h1>
        {description && (
          <p className="mt-1 max-w-2xl text-[0.8125rem] leading-relaxed text-muted sm:text-sm">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      )}
    </header>
  );
}

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
    <header className="admin-page-header mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {crumbs && crumbs.length > 0 ? <Breadcrumbs items={crumbs} /> : null}
        {meta}
        <div className="mb-2 h-0.5 w-8 rounded-full bg-bronze" aria-hidden />
        <h1 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl lg:text-[1.75rem]">
          {title}
        </h1>
        {description && (
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
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

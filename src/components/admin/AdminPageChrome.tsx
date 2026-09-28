"use client";

import type { ReactNode } from "react";
import PageHeader from "@/components/admin/PageHeader";
import { useAdminI18n } from "@/components/admin/LocaleProvider";

export type AdminPageId =
  | "dashboard"
  | "quotes"
  | "pipeline"
  | "invoices"
  | "payments"
  | "customers"
  | "schedule"
  | "pricebook"
  | "templates"
  | "activity"
  | "reports"
  | "content"
  | "settings";

export default function AdminPageChrome({
  page,
  actions,
  meta,
  includeAdminCrumb = true,
  description,
  showDictMeta = false,
}: {
  page: AdminPageId;
  actions?: ReactNode;
  meta?: ReactNode;
  includeAdminCrumb?: boolean;
  description?: string;
  showDictMeta?: boolean;
}) {
  const { t } = useAdminI18n();
  const title = t(`pages.${page}.title`);
  const desc = description ?? t(`pages.${page}.description`);
  const crumbs = includeAdminCrumb
    ? [
        { href: "/admin", label: t("nav.admin") },
        { label: title },
      ]
    : [{ label: title }];

  const dictMetaKey = `pages.${page}.meta`;
  const dictMeta = showDictMeta ? t(dictMetaKey) : "";
  const metaNode =
    meta ??
    (showDictMeta && dictMeta && dictMeta !== dictMetaKey ? (
      <p className="mb-1 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-bronze">
        {dictMeta}
      </p>
    ) : undefined);

  return (
    <PageHeader
      title={title}
      description={desc}
      crumbs={crumbs}
      actions={actions}
      meta={metaNode}
    />
  );
}

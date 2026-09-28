"use client";

import Breadcrumbs from "@/components/admin/Breadcrumbs";
import { useAdminI18n } from "@/components/admin/LocaleProvider";

export default function ContentBreadcrumbs({
  typeLabelEn,
  typeLabelEs,
  typeHref,
  docLabel,
}: {
  typeLabelEn?: string;
  typeLabelEs?: string;
  typeHref?: string;
  docLabel?: string;
}) {
  const { t, locale } = useAdminI18n();
  const typeLabel =
    typeLabelEn == null
      ? undefined
      : locale === "es"
        ? (typeLabelEs ?? typeLabelEn)
        : typeLabelEn;

  const crumbs: { href?: string; label: string }[] = [
    { href: "/admin", label: t("nav.admin") },
  ];

  if (!typeLabel) {
    crumbs.push({ label: t("pages.content.title") });
  } else {
    crumbs.push({ href: "/admin/content", label: t("pages.content.title") });
    if (docLabel && typeHref) {
      crumbs.push({ href: typeHref, label: typeLabel });
      crumbs.push({ label: docLabel });
    } else {
      crumbs.push({ label: typeLabel });
    }
  }

  return (
    <div className="mb-3 sm:mb-4">
      <Breadcrumbs items={crumbs} />
    </div>
  );
}

"use client";

import Link from "next/link";
import { useAdminI18n } from "@/components/admin/LocaleProvider";

export function I18nActionLink({
  href,
  labelKey,
  className,
}: {
  href: string;
  labelKey: string;
  className?: string;
}) {
  const { t } = useAdminI18n();
  return (
    <Link href={href} className={className}>
      {t(labelKey)}
    </Link>
  );
}

export function I18nMeta({ labelKey, className }: { labelKey: string; className?: string }) {
  const { t } = useAdminI18n();
  return <p className={className}>{t(labelKey)}</p>;
}

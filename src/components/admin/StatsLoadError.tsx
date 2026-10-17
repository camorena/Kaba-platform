"use client";

import { useAdminI18n } from "@/components/admin/LocaleProvider";

export default function StatsLoadError() {
  const { t } = useAdminI18n();
  return (
    <p role="alert" className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
      {t("stats.loadFailed")}
    </p>
  );
}

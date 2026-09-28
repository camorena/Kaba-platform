"use client";

import { useAdminI18n } from "@/components/admin/LocaleProvider";
import type { AdminLocale } from "@/lib/admin/i18n";

export default function LanguageToggle({
  variant = "dark",
}: {
  variant?: "dark" | "light";
}) {
  const { locale, setLocale, t } = useAdminI18n();

  const options: AdminLocale[] = ["en", "es"];

  const wrap =
    variant === "dark"
      ? "inline-flex items-center rounded-md border border-white/12 bg-white/[0.06] p-0.5"
      : "inline-flex items-center rounded-md border border-ink/12 bg-[var(--admin-panel)] p-0.5 shadow-[var(--shadow-xs)]";

  const activeDark =
    "bg-gradient-to-b from-bronze-light/90 to-bronze-dark text-white shadow-[0_1px_2px_rgba(0,0,0,0.25)]";
  const idleDark = "text-cream/65 hover:text-cream hover:bg-white/8";
  const activeLight =
    "bg-gradient-to-b from-bronze-light/90 to-bronze-dark text-white shadow-[0_1px_2px_rgba(11,17,26,0.12)]";
  const idleLight = "text-muted hover:text-ink hover:bg-[var(--admin-row-hover)]";

  return (
    <div
      className={wrap}
      role="group"
      aria-label={t("lang.label")}
    >
      {options.map((opt) => {
        const active = locale === opt;
        const btn =
          variant === "dark"
            ? active
              ? activeDark
              : idleDark
            : active
              ? activeLight
              : idleLight;
        return (
          <button
            key={opt}
            type="button"
            className={`admin-touch rounded px-2 py-1 text-[0.625rem] font-bold uppercase tracking-[0.1em] transition ${btn}`}
            aria-pressed={active}
            onClick={() => setLocale(opt)}
          >
            {t(`lang.${opt}`)}
          </button>
        );
      })}
    </div>
  );
}

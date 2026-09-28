"use client";

import LanguageToggle from "@/components/admin/LanguageToggle";
import { useAdminI18n } from "@/components/admin/LocaleProvider";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function SettingsAppearance() {
  const { t } = useAdminI18n();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <section
      id="settings-appearance"
      className="admin-glass-panel admin-gold-rail scroll-mt-24 p-4 sm:p-5"
      aria-labelledby="settings-appearance-title"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="admin-section-label">{t("pages.settings.navAppearance")}</p>
          <h2
            id="settings-appearance-title"
            className="admin-card-title mt-1"
          >
            {t("pages.settings.appearanceTitle")}
          </h2>
        </div>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        {t("pages.settings.appearanceBody")}
      </p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div className="admin-settings-pref">
          <label className="text-xs font-semibold text-ink">
            {t("pages.settings.languageLabel")}
          </label>
          <p className="admin-field-hint mt-1">
            {t("pages.settings.languageHelp")}
          </p>
          <div className="mt-3">
            <LanguageToggle variant="light" />
          </div>
        </div>

        <div className="admin-settings-pref">
          <p className="text-xs font-semibold text-ink" id="settings-theme-label">
            {t("pages.settings.themeLabel")}
          </p>
          <p className="admin-field-hint mt-1">
            {t("pages.settings.themeHelp")}
          </p>
          <div
            className="mt-3 inline-flex items-center rounded-md border border-ink/12 bg-[var(--admin-panel)] p-0.5 shadow-[var(--shadow-xs)]"
            role="group"
            aria-labelledby="settings-theme-label"
          >
            {(
              [
                { id: "light", label: t("pages.settings.themeLight") },
                { id: "dark", label: t("pages.settings.themeDark") },
              ] as const
            ).map((opt) => {
              const active = mounted ? (opt.id === "dark" ? isDark : !isDark) : opt.id === "light";
              return (
                <button
                  key={opt.id}
                  type="button"
                  className={`admin-touch rounded px-3 py-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.08em] transition ${
                    active
                      ? "bg-gradient-to-b from-bronze-light/90 to-bronze-dark text-white shadow-[0_1px_2px_rgba(11,17,26,0.12)]"
                      : "text-muted hover:bg-[var(--admin-row-hover)] hover:text-ink"
                  }`}
                  aria-pressed={active}
                  onClick={() => setTheme(opt.id)}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

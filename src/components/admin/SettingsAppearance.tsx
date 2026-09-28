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
      className="admin-glass-panel scroll-mt-24 p-4 sm:p-5"
      aria-labelledby="settings-appearance-title"
    >
      <h2
        id="settings-appearance-title"
        className="admin-card-title"
      >
        {t("pages.settings.appearanceTitle")}
      </h2>
      <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">
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
            className="mt-3 inline-flex items-center rounded-md bg-[color-mix(in_srgb,var(--ink)_4%,transparent)] p-0.5"
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
                  className={`admin-touch rounded px-3 py-1.5 text-xs font-medium transition ${
                    active
                      ? "bg-bronze/12 text-bronze-dark dark:text-bronze-light"
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

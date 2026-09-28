"use client";

import AdminPageChrome from "@/components/admin/AdminPageChrome";
import { useAdminI18n } from "@/components/admin/LocaleProvider";
import SettingsProfile from "@/components/admin/SettingsProfile";

export default function SettingsClient({ configured }: { configured: boolean }) {
  const { t } = useAdminI18n();

  return (
    <>
      <AdminPageChrome page="settings" showDictMeta />

      <div className="mb-3">
        <SettingsProfile />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <section className="admin-glass-panel admin-gold-rail p-4 sm:p-5">
          <h2 className="admin-card-title">{t("pages.settings.authTitle")}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {t("pages.settings.authBody", {
              passwordEnv: "ADMIN_PASSWORD",
              cookie: "kaba_admin_session",
            })
              .split("ADMIN_PASSWORD")
              .flatMap((part, i) =>
                i === 0
                  ? [part]
                  : [
                      <code
                        key={`pw-${i}`}
                        className="rounded bg-ink/5 px-1 text-xs dark:bg-white/10"
                      >
                        ADMIN_PASSWORD
                      </code>,
                      ...part.split("kaba_admin_session").flatMap((p2, j) =>
                        j === 0
                          ? [p2]
                          : [
                              <code
                                key={`ck-${j}`}
                                className="rounded bg-ink/5 px-1 text-xs dark:bg-white/10"
                              >
                                kaba_admin_session
                              </code>,
                              p2,
                            ],
                      ),
                    ],
              )}
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted">
            <li>
              {t("pages.settings.authStatus")}{" "}
              <strong className="text-ink">
                {configured
                  ? t("pages.settings.passwordConfigured")
                  : t("pages.settings.passwordMissing")}
              </strong>
            </li>
            <li>
              {t("pages.settings.authLocal", { envFile: ".env.local" })
                .split(".env.local")
                .flatMap((p, i) =>
                  i === 0
                    ? [p]
                    : [
                        <code
                          key={i}
                          className="rounded bg-ink/5 px-1 text-xs dark:bg-white/10"
                        >
                          .env.local
                        </code>,
                        p,
                      ],
                )}
            </li>
            <li>{t("pages.settings.authProd")}</li>
            <li>{t("pages.settings.authReplace")}</li>
          </ul>
          <p className="mt-3 rounded-lg border border-amber-700/25 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-950 dark:border-amber-400/25 dark:bg-amber-950/40 dark:text-amber-100">
            {t("pages.settings.authRotate")}
          </p>
        </section>

        <section className="admin-glass-panel admin-gold-rail p-4 sm:p-5">
          <h2 className="admin-card-title">{t("pages.settings.dataTitle")}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {t("pages.settings.dataBody", {
              endpoint: "POST /api/quotes",
            })
              .split("POST /api/quotes")
              .flatMap((p, i) =>
                i === 0
                  ? [p]
                  : [
                      <code
                        key={i}
                        className="rounded bg-ink/5 px-1 text-xs dark:bg-white/10"
                      >
                        POST /api/quotes
                      </code>,
                      p,
                    ],
              )}
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted">
            <li>
              <code className="text-xs">src/lib/admin/quotes-store.ts</code>
            </li>
            <li>
              <code className="text-xs">src/lib/admin/invoices-store.ts</code>
            </li>
            <li>
              <code className="text-xs">src/lib/admin/payments-store.ts</code>
            </li>
            <li>{t("pages.settings.dataNext")}</li>
          </ul>
        </section>

        <section className="admin-glass-panel admin-gold-rail p-4 sm:p-5">
          <h2 className="admin-card-title">{t("pages.settings.stripeTitle")}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {t("pages.settings.stripeBody")}
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted">
            <li>{t("pages.settings.stripePlan1")}</li>
            <li>{t("pages.settings.stripePlan2")}</li>
            <li>
              {t("pages.settings.stripeEnv")}{" "}
              <code className="text-xs">STRIPE_SECRET_KEY</code>,{" "}
              <code className="text-xs">STRIPE_WEBHOOK_SECRET</code>
            </li>
          </ul>
        </section>

        <section className="admin-glass-panel admin-gold-rail p-4 sm:p-5">
          <h2 className="admin-card-title">{t("pages.settings.opsTitle")}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {t("pages.settings.opsBody")}
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted">
            <li>
              <strong className="text-ink">{t("nav.pipeline")}</strong>
              {" — "}
              {t("pages.settings.opsPipeline").replace(/^.*?—\s*/, "")}
            </li>
            <li>
              <strong className="text-ink">{t("nav.pricebook")}</strong>
              {" — "}
              {t("pages.settings.opsPricebook").replace(/^.*?—\s*/, "")}
            </li>
            <li>
              <strong className="text-ink">{t("nav.templates")}</strong>
              {" — "}
              {t("pages.settings.opsTemplates").replace(/^.*?—\s*/, "")}
            </li>
            <li>{t("pages.settings.opsQuick")}</li>
          </ul>
        </section>

        <section className="admin-glass-panel admin-gold-rail p-4 sm:p-5">
          <h2 className="admin-card-title">{t("pages.settings.craftTitle")}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {t("pages.settings.craftBody", {
              robots: "robots.txt",
              admin: "/admin",
              api: "/api/",
              noindex: "noindex, nofollow",
            })}
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted">
            <li>
              {t("pages.settings.craftPalette")}{" "}
              <kbd className="admin-kbd">⌘K</kbd> /{" "}
              <kbd className="admin-kbd">Ctrl+K</kbd>
            </li>
            <li>
              {t("pages.settings.craftShortcuts")}{" "}
              <kbd className="admin-kbd">?</kbd>
            </li>
            <li>{t("pages.settings.craftCharts")}</li>
            <li>{t("pages.settings.craftLazy")}</li>
          </ul>
        </section>
      </div>
    </>
  );
}

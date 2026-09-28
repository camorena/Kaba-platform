"use client";

import AdminPageChrome from "@/components/admin/AdminPageChrome";
import { useAdminI18n } from "@/components/admin/LocaleProvider";
import SettingsAppearance from "@/components/admin/SettingsAppearance";
import SettingsProfile from "@/components/admin/SettingsProfile";
import SettingsTrustClaims from "@/components/admin/SettingsTrustClaims";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "settings-profile", labelKey: "pages.settings.navProfile" },
  { id: "settings-appearance", labelKey: "pages.settings.navAppearance" },
  { id: "settings-trust", labelKey: "pages.settings.navTrust" },
  { id: "settings-security", labelKey: "pages.settings.navSecurity" },
  { id: "settings-platform", labelKey: "pages.settings.navPlatform" },
  { id: "settings-about", labelKey: "pages.settings.navAbout" },
] as const;

function Code({ children }: { children: ReactNode }) {
  return <code className="admin-inline-code">{children}</code>;
}

/** Split a translated string on known literal tokens and wrap matches in <Code>. */
function withCode(text: string, tokens: string[]): ReactNode {
  if (!tokens.length) return text;
  type Part = { type: "text" | "code"; value: string };
  let parts: Part[] = [{ type: "text", value: text }];
  for (const token of tokens) {
    const next: Part[] = [];
    for (const part of parts) {
      if (part.type === "code") {
        next.push(part);
        continue;
      }
      const chunks = part.value.split(token);
      chunks.forEach((chunk, i) => {
        if (chunk) next.push({ type: "text", value: chunk });
        if (i < chunks.length - 1) next.push({ type: "code", value: token });
      });
    }
    parts = next;
  }
  return parts.map((p, i) =>
    p.type === "code" ? <Code key={`c-${i}`}>{p.value}</Code> : <span key={`t-${i}`}>{p.value}</span>,
  );
}

export default function SettingsClient({
  configured,
  authMode = "stub",
  stubPasswordConfigured = false,
  credentialsEnabled = false,
  sessionRole = null,
  sessionStub = true,
  rolesDoc = null,
  dataAdapter = "memory",
  databaseUrlConfigured = false,
  stripe = {
    secretKeyConfigured: false,
    publishableKeyConfigured: false,
    webhookSecretConfigured: false,
    checkoutReady: false,
    webhookReady: false,
    badge: "not_connected" as const,
  },
  mail = {
    resendConfigured: false,
    smtpConfigured: false,
    fromConfigured: false,
    ownersConfigured: false,
    transport: "none" as const,
    ready: false,
    badge: "not_configured" as const,
  },
  roles = ["owner", "editor", "viewer"],
}: {
  configured: boolean;
  authMode?: "stub" | "credentials";
  stubPasswordConfigured?: boolean;
  credentialsEnabled?: boolean;
  sessionRole?: string | null;
  sessionStub?: boolean;
  rolesDoc?: string | null;
  dataAdapter?: string;
  databaseUrlConfigured?: boolean;
  stripe?: {
    secretKeyConfigured: boolean;
    publishableKeyConfigured: boolean;
    webhookSecretConfigured: boolean;
    checkoutReady: boolean;
    webhookReady: boolean;
    badge: "not_connected" | "checkout_ready" | "connected";
  };
  mail?: {
    resendConfigured: boolean;
    smtpConfigured: boolean;
    fromConfigured: boolean;
    ownersConfigured: boolean;
    transport: "none" | "resend" | "smtp";
    ready: boolean;
    badge: "not_configured" | "resend" | "smtp";
  };
  roles?: string[];
}) {
  const { t } = useAdminI18n();
  const [active, setActive] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    const nodes = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      Boolean,
    ) as HTMLElement[];
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    setActive(id);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <AdminPageChrome page="settings" showDictMeta />

      <div className="admin-settings-layout">
        <nav
          className="admin-settings-nav"
          aria-label={t("pages.settings.navAria")}
        >
          <ul className="admin-settings-nav-list">
            {SECTIONS.map((s) => {
              const isActive = active === s.id;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    className={`admin-settings-nav-link ${isActive ? "is-active" : ""}`}
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => scrollTo(s.id)}
                  >
                    {t(s.labelKey)}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="admin-settings-panels space-y-5">
          <SettingsProfile />
          <SettingsAppearance />
          <SettingsTrustClaims />

          {/* Security */}
          <section
            id="settings-security"
            className="admin-glass-panel scroll-mt-24 p-4 sm:p-5"
            aria-labelledby="settings-security-title"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="settings-security-title" className="admin-card-title">
                {t("pages.settings.securityTitle")}
              </h2>
              <span
                className={`admin-settings-chip ${
                  authMode === "credentials"
                    ? "admin-settings-chip-ok"
                    : "admin-settings-chip-warn"
                }`}
              >
                {authMode === "credentials"
                  ? t("pages.settings.securityBadgeCredentials")
                  : t("pages.settings.securityBadge")}
              </span>
            </div>
            <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-muted">
              {authMode === "credentials"
                ? withCode(
                    t("pages.settings.authBodyCredentials", {
                      secretEnv: "AUTH_SECRET",
                      cookie: "kaba_admin_session",
                      profiles: "profiles",
                    }),
                    ["AUTH_SECRET", "kaba_admin_session", "profiles"],
                  )
                : withCode(
                    t("pages.settings.authBody", {
                      passwordEnv: "ADMIN_PASSWORD",
                      cookie: "kaba_admin_session",
                    }),
                    ["ADMIN_PASSWORD", "kaba_admin_session"],
                  )}
            </p>

            <dl className="admin-settings-dl mt-4">
              <div className="admin-settings-dl-row">
                <dt>{t("pages.settings.authModeLabel")}</dt>
                <dd>
                  <span className="font-mono text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-bronze">
                    {authMode}
                  </span>
                  <span className="mt-1 block text-xs text-muted">
                    {authMode === "credentials"
                      ? t("pages.settings.authModeCredentialsHint")
                      : t("pages.settings.authModeStubHint")}
                  </span>
                </dd>
              </div>
              <div className="admin-settings-dl-row">
                <dt>{t("pages.settings.authStatus")}</dt>
                <dd>
                  <span
                    className={`admin-settings-chip ${
                      configured
                        ? "admin-settings-chip-ok"
                        : "admin-settings-chip-danger"
                    }`}
                  >
                    {configured
                      ? authMode === "credentials"
                        ? t("pages.settings.credentialsConfigured")
                        : t("pages.settings.passwordConfigured")
                      : authMode === "credentials"
                        ? t("pages.settings.credentialsMissing")
                        : t("pages.settings.passwordMissing")}
                  </span>
                </dd>
              </div>
              {sessionRole ? (
                <div className="admin-settings-dl-row">
                  <dt>{t("pages.settings.authSessionLabel")}</dt>
                  <dd>
                    {t("pages.settings.authSessionValue", {
                      role: sessionRole,
                      stub: sessionStub
                        ? t("pages.settings.authSessionStub")
                        : t("pages.settings.authSessionLive"),
                    })}
                  </dd>
                </div>
              ) : null}
              <div className="admin-settings-dl-row">
                <dt>{t("pages.settings.authLocalLabel")}</dt>
                <dd>
                  {authMode === "credentials"
                    ? withCode(
                        t("pages.settings.authLocalCredentials", {
                          envFile: ".env.local",
                          secretEnv: "AUTH_SECRET",
                        }),
                        [".env.local", "AUTH_SECRET"],
                      )
                    : withCode(t("pages.settings.authLocal", { envFile: ".env.local" }), [
                        ".env.local",
                      ])}
                </dd>
              </div>
              <div className="admin-settings-dl-row">
                <dt>{t("pages.settings.authProdLabel")}</dt>
                <dd>
                  {authMode === "credentials"
                    ? t("pages.settings.authProdCredentials")
                    : t("pages.settings.authProd")}
                </dd>
              </div>
              <div className="admin-settings-dl-row">
                <dt>{t("pages.settings.authRoadmapLabel")}</dt>
                <dd>
                  {authMode === "credentials"
                    ? t("pages.settings.authReplaceCredentials")
                    : t("pages.settings.authReplace")}
                </dd>
              </div>
              {credentialsEnabled && stubPasswordConfigured ? (
                <div className="admin-settings-dl-row">
                  <dt>{t("pages.settings.authFallbackLabel")}</dt>
                  <dd>{t("pages.settings.authFallbackNote")}</dd>
                </div>
              ) : null}
            </dl>

            <aside className="admin-settings-callout mt-4" role="note">
              <p>
                {authMode === "credentials"
                  ? t("pages.settings.securityBadgeCredentials")
                  : t("pages.settings.securityBadge")}
              </p>
              <p className="mt-1 text-xs leading-relaxed">
                {authMode === "credentials"
                  ? t("pages.settings.authRotateCredentials")
                  : t("pages.settings.authRotate")}
              </p>
            </aside>

            <aside className="mt-4 px-0.5" role="note">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted">
                {t("pages.settings.authDemoPasswordTitle")}
              </p>
              <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-muted">
                {withCode(
                  t("pages.settings.authDemoPasswordBody"),
                  [
                    "owner@kabafence.example",
                    "change-me-owner",
                    "password_hash",
                    "profiles",
                    "src/lib/admin/password.ts",
                    "hashPassword",
                  ],
                )}
              </p>
              <p className="mt-2 max-w-3xl text-xs leading-relaxed text-muted">
                {withCode(
                  t("pages.settings.authDemoPasswordHint"),
                  ["AUTH_SECRET", "ADMIN_PASSWORD", "openssl rand -base64 32"],
                )}
              </p>
            </aside>

            <div className="mt-5 border-t border-[color:var(--admin-border)]/60 pt-4">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted">
                {t("pages.settings.rolesTitle")}
              </p>
              <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-muted">
                {withCode(
                  t(
                    authMode === "credentials"
                      ? "pages.settings.rolesBodyCredentials"
                      : "pages.settings.rolesBody",
                    { dal: "src/lib/admin/dal.ts" },
                  ),
                  ["src/lib/admin/dal.ts"],
                )}
              </p>
              <ul className="mt-3 space-y-2">
                {roles.map((role) => (
                  <li
                    key={role}
                    className="flex flex-col gap-0.5 rounded-lg bg-[color-mix(in_srgb,var(--ink)_3%,transparent)] px-3 py-2 sm:flex-row sm:items-baseline sm:gap-3"
                  >
                    <span className="shrink-0 font-mono text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-bronze">
                      {role}
                    </span>
                    <span className="text-sm text-muted">
                      {t(`pages.settings.roleDesc.${role}`)}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {authMode === "credentials"
                  ? t("pages.settings.rolesCredentialsNote")
                  : t("pages.settings.rolesStubNote")}
              </p>
              {rolesDoc ? (
                <aside className="mt-3 px-0.5" role="note">
                  <p className="text-[0.6875rem] font-medium text-muted">
                    {t("pages.settings.rolesDocLabel")}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-muted">{rolesDoc}</p>
                </aside>
              ) : (
                <p className="mt-3 text-xs text-muted">
                  {withCode(
                    t("pages.settings.rolesDocHint", { env: "ADMIN_ROLES_DOC" }),
                    ["ADMIN_ROLES_DOC"],
                  )}
                </p>
              )}
            </div>
          </section>

          {/* Platform */}
          <section
            id="settings-platform"
            className="scroll-mt-24 space-y-3"
            aria-labelledby="settings-platform-title"
          >
            <div className="px-0.5">
              <h2
                id="settings-platform-title"
                className="font-display text-lg font-semibold tracking-[-0.02em] text-ink"
              >
                {t("pages.settings.platformTitle")}
              </h2>
              <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted">
                {t("pages.settings.platformBody")}
              </p>
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              <article className="admin-glass-panel p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="admin-card-title">
                    {t("pages.settings.dataTitle")}
                  </h3>
                  <span className="admin-settings-chip admin-settings-chip-info">
                    {dataAdapter === "memory"
                      ? t("pages.settings.dataBadge")
                      : t("pages.settings.dataBadgeDb")}
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {withCode(
                    t("pages.settings.dataBody", {
                      endpoint: "POST /api/quotes",
                      adapter: dataAdapter,
                      adapterEnv: "KABA_DATA_ADAPTER",
                    }),
                    ["POST /api/quotes", "KABA_DATA_ADAPTER", dataAdapter],
                  )}
                </p>
                <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                  <div className="admin-settings-stat">
                    <dt className="text-[0.6875rem] text-muted">
                      {t("pages.settings.dataAdapterLabel")}
                    </dt>
                    <dd className="mt-1 font-medium text-ink">
                      <Code>{dataAdapter}</Code>
                    </dd>
                  </div>
                  <div className="admin-settings-stat">
                    <dt className="text-[0.6875rem] text-muted">
                      {t("pages.settings.dataUrlLabel")}
                    </dt>
                    <dd className="mt-1 font-medium text-ink">
                      {databaseUrlConfigured
                        ? t("pages.settings.dataUrlSet")
                        : t("pages.settings.dataUrlMissing")}
                    </dd>
                  </div>
                </dl>
                {dataAdapter === "postgres" && !databaseUrlConfigured ? (
                  <p className="mt-3 text-sm font-medium text-amber-700 dark:text-amber-400">
                    {t("pages.settings.dataPostgresMissingUrl")}
                  </p>
                ) : null}
                <p className="mt-4 text-[0.6875rem] font-medium text-muted">
                  {t("pages.settings.dataFilesLabel")}
                </p>
                <ul className="mt-2 space-y-1.5">
                  {[
                    "src/lib/db/",
                    "src/lib/db/postgres/",
                    "db/migrations/0001_ops_foundation.sql",
                    "db/migrations/0003_stripe.sql",
                    "db/migrations/0005_cms_content.sql",
                    "src/lib/cms/",
                    "src/lib/mail/",
                    "db/seeds/0001_angier_raleigh_demo.sql",
                    "npm run db:migrate / db:seed",
                  ].map((path) => (
                    <li key={path}>
                      <Code>{path}</Code>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm font-medium text-ink">
                  {t("pages.settings.dataNext")}
                </p>
                <div className="mt-3 rounded-lg bg-[color-mix(in_srgb,var(--ink)_3%,transparent)] px-3 py-2.5">
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted">
                    {t("pages.settings.dataProdChecklistTitle")}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted">
                    {withCode(
                      t("pages.settings.dataProdChecklist"),
                      [
                        "DATABASE_URL",
                        "KABA_DATA_ADAPTER=postgres",
                      ],
                    )}
                  </p>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  {withCode(
                    t("pages.settings.dataNotify", {
                      notify: "notifyQuoteCreated",
                    }),
                    ["notifyQuoteCreated"],
                  )}
                </p>
              </article>

              <article className="admin-glass-panel p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="admin-card-title">
                    {t("pages.settings.stripeTitle")}
                  </h3>
                  <span
                    className={`admin-settings-chip ${
                      stripe.badge === "connected"
                        ? "admin-settings-chip-ok"
                        : stripe.badge === "checkout_ready"
                          ? "admin-settings-chip-info"
                          : ""
                    }`}
                  >
                    {stripe.badge === "connected"
                      ? t("pages.settings.stripeBadgeConnected")
                      : stripe.badge === "checkout_ready"
                        ? t("pages.settings.stripeBadgeCheckout")
                        : t("pages.settings.stripeBadge")}
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {stripe.badge === "connected"
                    ? t("pages.settings.stripeBodyConnected")
                    : stripe.badge === "checkout_ready"
                      ? t("pages.settings.stripeBodyCheckout")
                      : t("pages.settings.stripeBody")}
                </p>
                <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-1">
                  {(
                    [
                      ["STRIPE_SECRET_KEY", stripe.secretKeyConfigured],
                      ["STRIPE_WEBHOOK_SECRET", stripe.webhookSecretConfigured],
                      [
                        "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
                        stripe.publishableKeyConfigured,
                      ],
                    ] as const
                  ).map(([env, ok]) => (
                    <div
                      key={env}
                      className="admin-settings-stat flex flex-wrap items-center justify-between gap-2"
                    >
                      <dt>
                        <Code>{env}</Code>
                      </dt>
                      <dd className="text-sm text-muted">
                        {ok
                          ? t("pages.settings.stripeKeySet")
                          : t("pages.settings.stripeKeyMissing")}
                      </dd>
                    </div>
                  ))}
                </dl>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted">
                  <li>{t("pages.settings.stripePlan1")}</li>
                  <li>{t("pages.settings.stripePlan2")}</li>
                </ul>
                <p className="mt-3 text-xs leading-relaxed text-muted">
                  {withCode(
                    t("pages.settings.stripeRoutes", {
                      checkout: "POST /api/payments/checkout",
                      webhook: "POST /api/stripe/webhook",
                    }),
                    ["POST /api/payments/checkout", "POST /api/stripe/webhook"],
                  )}
                </p>
                <p className="mt-4 text-[0.6875rem] font-medium text-muted">
                  {t("pages.settings.stripeEnv")}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Code>STRIPE_SECRET_KEY</Code>
                  <Code>STRIPE_WEBHOOK_SECRET</Code>
                  <Code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</Code>
                </div>
              </article>

              <article className="admin-glass-panel p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="admin-card-title">
                    {t("pages.settings.mailTitle")}
                  </h3>
                  <span
                    className={`admin-settings-chip ${
                      mail.badge === "resend" || mail.badge === "smtp"
                        ? "admin-settings-chip-ok"
                        : ""
                    }`}
                  >
                    {mail.badge === "resend"
                      ? t("pages.settings.mailBadgeResend")
                      : mail.badge === "smtp"
                        ? t("pages.settings.mailBadgeSmtp")
                        : t("pages.settings.mailBadge")}
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {mail.badge === "resend"
                    ? t("pages.settings.mailBodyResend")
                    : mail.badge === "smtp"
                      ? t("pages.settings.mailBodySmtp")
                      : t("pages.settings.mailBody")}
                </p>
                <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-1">
                  {(
                    [
                      ["MAIL_FROM", mail.fromConfigured],
                      ["RESEND_API_KEY", mail.resendConfigured],
                      ["SMTP_HOST", mail.smtpConfigured],
                      ["MAIL_TO_OWNERS", mail.ownersConfigured],
                    ] as const
                  ).map(([env, ok]) => (
                    <div
                      key={env}
                      className="admin-settings-stat flex flex-wrap items-center justify-between gap-2"
                    >
                      <dt>
                        <Code>{env}</Code>
                      </dt>
                      <dd className="text-sm text-muted">
                        {ok
                          ? t("pages.settings.mailKeySet")
                          : t("pages.settings.mailKeyMissing")}
                      </dd>
                    </div>
                  ))}
                </dl>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted">
                  <li>{t("pages.settings.mailPlan1")}</li>
                  <li>{t("pages.settings.mailPlan2")}</li>
                </ul>
                <p className="mt-3 text-xs leading-relaxed text-muted">
                  {withCode(
                    t("pages.settings.mailRoutes", {
                      quoteNotify: "notifyQuoteCreated",
                      paymentNotify: "notifyPaymentReceived",
                    }),
                    ["notifyQuoteCreated", "notifyPaymentReceived"],
                  )}
                </p>
                <p className="mt-4 text-[0.6875rem] font-medium text-muted">
                  {t("pages.settings.mailEnv")}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Code>MAIL_FROM</Code>
                  <Code>RESEND_API_KEY</Code>
                  <Code>SMTP_HOST</Code>
                  <Code>SMTP_PORT</Code>
                  <Code>SMTP_USER</Code>
                  <Code>SMTP_PASS</Code>
                  <Code>MAIL_TO_OWNERS</Code>
                </div>
              </article>
            </div>
          </section>

          {/* About */}
          <section
            id="settings-about"
            className="admin-glass-panel scroll-mt-24 p-4 sm:p-5"
            aria-labelledby="settings-about-title"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 id="settings-about-title" className="admin-card-title">
                    {t("pages.settings.aboutTitle")}
                  </h2>
                  <span className="admin-settings-chip">
                    {t("pages.settings.aboutVersion", { version: "0.1.0" })}
                  </span>
                </div>
                <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-muted">
                  {t("pages.settings.aboutBody")}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <div>
                <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted">
                  {t("pages.settings.opsTitle")}
                </h3>
                <p className="mt-1 text-sm text-muted">
                  {t("pages.settings.opsBody")}
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted">
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
              </div>

              <div>
                <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted">
                  {t("pages.settings.craftTitle")}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {withCode(
                    t("pages.settings.craftBody", {
                      robots: "robots.txt",
                      admin: "/admin",
                      api: "/api/",
                      noindex: "noindex, nofollow",
                    }),
                    ["robots.txt", "/admin", "/api/", "noindex, nofollow"],
                  )}
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted">
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
              </div>
            </div>

            <footer className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--admin-border)]/60 pt-4">
              <p className="text-[0.6875rem] text-muted">
                {t("pages.settings.aboutCredit")}{" "}
                <a
                  href="https://datelica.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-bronze underline-offset-2 hover:underline"
                >
                  {t("pages.settings.aboutCreditName")}
                </a>
              </p>
            </footer>
          </section>
        </div>
      </div>
    </>
  );
}

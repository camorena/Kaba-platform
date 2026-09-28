"use client";

import Image from "next/image";
import Link from "next/link";
import LanguageToggle from "@/components/admin/LanguageToggle";
import LoginForm from "@/components/admin/LoginForm";
import { useAdminI18n } from "@/components/admin/LocaleProvider";
import ThemeToggle from "@/components/ThemeToggle";

export default function LoginPageClient({
  configured,
  authMode = "stub",
}: {
  configured: boolean;
  authMode?: "stub" | "credentials";
}) {
  const { t } = useAdminI18n();

  const highlights = [
    { title: t("login.h1"), body: t("login.h1body") },
    { title: t("login.h2"), body: t("login.h2body") },
    { title: t("login.h3"), body: t("login.h3body") },
  ];

  return (
    <div className="admin-app admin-login-root relative min-h-[100dvh] overflow-hidden">
      <div className="admin-login-mesh" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-bronze via-bronze-light to-bronze"
        aria-hidden
      />
      <div className="absolute right-4 top-4 z-20 flex items-center gap-2 sm:right-6 sm:top-5">
        <LanguageToggle variant="light" />
        <ThemeToggle />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[100dvh] max-w-5xl items-center gap-8 px-4 py-12 lg:grid-cols-2 lg:gap-12 lg:px-8">
        <aside className="hidden lg:block">
          <Image
            src="/brand/kaba-fence-icon.png"
            alt=""
            width={56}
            height={56}
            className="h-14 w-14 object-contain"
          />
          <p className="mt-6 admin-section-label !tracking-[0.16em] text-bronze-dark dark:text-bronze-light">
            {t("login.brand")}
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink xl:text-4xl">
            {t("login.headline")}
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            {t("login.subhead")}
          </p>
          <ul className="mt-8 space-y-4">
            {highlights.map((h) => (
              <li key={h.title} className="admin-login-highlight flex gap-3">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-bronze"
                  aria-hidden
                />
                <div>
                  <p className="text-sm font-semibold text-ink">{h.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted">
                    {h.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        <div className="mx-auto w-full max-w-md">
          <p
            role="status"
            className="mb-5 text-xs leading-relaxed text-muted"
          >
            <span className="font-semibold text-ink/80">
              {authMode === "credentials"
                ? t("login.authStrongCredentials")
                : t("login.authStrong")}
            </span>{" "}
            {authMode === "credentials"
              ? t("login.authBodyCredentials")
              : t("login.authBody")}
          </p>

          <div className="mb-6 text-center lg:hidden">
            <Image
              src="/brand/kaba-fence-icon.png"
              alt=""
              width={48}
              height={48}
              className="mx-auto h-12 w-12 object-contain"
            />
            <p className="mt-4 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-bronze">
              {t("login.brandShort")}
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
              {t("login.signInTitle")}
            </h1>
            <p className="mt-2 text-sm text-muted">{t("login.signInMobileSub")}</p>
          </div>

          <div className="mb-2 hidden lg:block">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
              {t("login.signInTitle")}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {authMode === "credentials"
                ? t("login.signInDesktopSubCredentials")
                : t("login.signInDesktopSub")}
            </p>
          </div>

          <div className="admin-glass-panel admin-login-card p-5 sm:p-6">
            <LoginForm configured={configured} authMode={authMode} />
          </div>

          <p className="mt-6 text-center text-xs text-muted">
            <Link href="/" className="underline-offset-2 hover:underline">
              {t("login.backSite")}
            </Link>
          </p>
          <footer className="mt-8 border-t border-ink/8 pt-5 text-center">
            <p className="text-xs text-muted">
              {t("shell.creditPrefix")}{" "}
              <a
                href="https://datelica.com"
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring rounded font-semibold text-ink/75 transition hover:text-bronze"
              >
                Datelica
              </a>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import LanguageToggle from "@/components/admin/LanguageToggle";
import { useAdminI18n } from "@/components/admin/LocaleProvider";
import NotificationCenter from "@/components/admin/NotificationCenter";
import { ToastProvider, useToast } from "@/components/admin/Toast";
import ThemeToggle from "@/components/ThemeToggle";
import { navLabelKey } from "@/lib/admin/i18n";

const CommandPalette = dynamic(() => import("@/components/admin/CommandPalette"), {
  ssr: false,
});
const ShortcutsSheet = dynamic(() => import("@/components/admin/ShortcutsSheet"), {
  ssr: false,
});

const nav = [
  { href: "/admin", exact: true, icon: "grid" },
  { href: "/admin/quotes", icon: "quotes" },
  { href: "/admin/pipeline", icon: "kanban" },
  { href: "/admin/invoices", icon: "invoice" },
  { href: "/admin/payments", icon: "pay" },
  { href: "/admin/customers", icon: "people" },
  { href: "/admin/calendar", icon: "cal" },
  { href: "/admin/pricebook", icon: "book" },
  { href: "/admin/templates", icon: "templates" },
  { href: "/admin/activity", icon: "pulse" },
  { href: "/admin/reports", icon: "chart" },
  { href: "/admin/content", icon: "content" },
  { href: "/admin/settings", icon: "gear" },
];

function NavIcon({ name }: { name: string }) {
  const common = "h-4 w-4 shrink-0 opacity-80";
  switch (name) {
    case "grid":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
        </svg>
      );
    case "quotes":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z" />
        </svg>
      );
    case "kanban":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 5h4v14H4V5zm6 0h4v9h-4V5zm6 0h4v11h-4V5z" />
        </svg>
      );
    case "book":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 5a2 2 0 012-2h10a2 2 0 012 2v14l-6-3-6 3V5z" />
        </svg>
      );
    case "templates":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      );
    case "invoice":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 14l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "pay":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      );
    case "people":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2m14-10a4 4 0 11-8 0 4 4 0 018 0zm6 10v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      );
    case "cal":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7V3m8 4V3M5 11h14M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    case "pulse":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12h4l2-5 4 10 2-5h6" />
        </svg>
      );
    case "chart":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 19V5m0 14h16M8 17V9m4 8V7m4 10v-4" />
        </svg>
      );
    case "content":
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 10h16M4 14h10M4 18h7" />
        </svg>
      );
    default:
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
  }
}

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  const { t } = useAdminI18n();
  return (
    <>
      {nav.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            onClick={onNavigate}
            className={`admin-nav-link admin-touch flex items-center gap-2.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-[0.8125rem] font-semibold transition ${
              active
                ? "bg-navy text-cream shadow-[0_1px_2px_rgba(11,17,26,0.18)] ring-1 ring-bronze/30 dark:bg-bronze/20 dark:text-bronze-light dark:ring-bronze/35 dark:shadow-none"
                : "text-muted hover:bg-[var(--admin-row-hover)] hover:text-ink"
            }`}
          >
            <NavIcon name={item.icon} />
            {t(navLabelKey(item.href))}
          </Link>
        );
      })}
    </>
  );
}

function AdminShellInner({
  children,
  showAuthWarning,
}: {
  children: React.ReactNode;
  showAuthWarning?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();
  const { t } = useAdminI18n();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  /** Mounted while open or closing (exit animation). */
  const [drawerMounted, setDrawerMounted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openCmd = useCallback(() => setCmdOpen(true), []);
  const closeCmd = useCallback(() => setCmdOpen(false), []);
  const openShortcuts = useCallback(() => setShortcutsOpen(true), []);
  const closeShortcuts = useCallback(() => setShortcutsOpen(false), []);

  const openDrawer = useCallback(() => {
    setDrawerMounted(true);
    // Double rAF so enter CSS can transition from closed styles.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setDrawerOpen(true));
    });
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  // Close drawer smoothly on route change (nav link or command palette).
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Unmount after exit transition ends.
  useEffect(() => {
    if (drawerOpen || !drawerMounted) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDrawerMounted(false);
      return;
    }
    const id = window.setTimeout(() => setDrawerMounted(false), 220);
    return () => window.clearTimeout(id);
  }, [drawerOpen, drawerMounted]);

  useEffect(() => {
    if (!drawerMounted) return;
    const prev = document.body.style.overflow;
    if (drawerOpen) document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDrawerOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerMounted, drawerOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey;
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
        return;
      }
      if (!typing && e.key === "?" && !meta && !e.altKey) {
        e.preventDefault();
        setShortcutsOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    toast.push({ title: t("shell.signedOut"), tone: "info" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="admin-app min-h-full text-ink">
      <header className="admin-topbar sticky top-0 z-40 border-b border-white/[0.08] bg-[#0a0c10]/95 text-cream shadow-[0_1px_0_0_rgba(192,139,58,0.4)] pt-[env(safe-area-inset-top,0px)]">
        <div className="h-[2px] w-full bg-gradient-to-r from-bronze-dark via-bronze-light to-bronze-dark" aria-hidden />
        <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-2 px-3 py-2 sm:gap-3 sm:px-5 lg:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              className="admin-touch -ml-1 rounded-md p-2 text-cream/80 transition hover:bg-white/10 hover:text-cream lg:hidden"
              aria-label={t("shell.openMenu")}
              aria-expanded={drawerOpen}
              onClick={openDrawer}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <Image
              src="/brand/kaba-fence-icon.png"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
            />
            <div className="min-w-0 hidden sm:block">
              <p className="truncate font-display text-sm font-semibold tracking-tight">
                {t("shell.brand")}
              </p>
              <p className="truncate text-[0.625rem] uppercase tracking-[0.12em] text-bronze-light/80">
                {t("shell.tagline")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-0.5 sm:gap-1.5">
            <button
              type="button"
              onClick={openCmd}
              className="admin-search-trigger admin-touch hidden items-center gap-2 rounded-md border border-white/12 bg-white/[0.06] px-2.5 py-1.5 text-xs text-cream/75 transition hover:border-bronze/45 hover:bg-white/10 hover:text-cream sm:inline-flex"
              aria-label={t("shell.openCommandPalette")}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
              </svg>
              <span>{t("shell.search")}</span>
              <kbd className="admin-kbd admin-kbd-dark ml-1">⌘K</kbd>
            </button>
            <button
              type="button"
              onClick={openCmd}
              className="admin-touch rounded-md p-2 text-cream/70 transition hover:bg-white/10 hover:text-cream sm:hidden"
              aria-label={t("shell.search")}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
              </svg>
            </button>
            <NotificationCenter />
            <button
              type="button"
              onClick={openShortcuts}
              className="admin-touch hidden rounded-md px-2 py-1.5 text-xs font-medium text-cream/70 transition hover:bg-white/10 hover:text-cream md:inline"
              title={t("shell.keyboardShortcuts")}
            >
              ?
            </button>
            <LanguageToggle variant="dark" />
            <ThemeToggle variant="dark" className="!h-9 !w-9" />
            <Link
              href="/"
              className="admin-touch hidden rounded-md px-2 py-1.5 text-xs font-medium text-cream/70 transition hover:bg-white/10 hover:text-cream sm:inline"
            >
              {t("shell.viewSite")}
            </Link>
            <button
              type="button"
              onClick={() => void logout()}
              aria-label={t("shell.signOut")}
              className="admin-touch inline-flex items-center justify-center gap-1.5 rounded-md bg-gradient-to-b from-bronze-light/90 to-bronze-dark px-2.5 py-2 text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-white shadow-[0_4px_14px_rgba(192,139,58,0.32),inset_0_1px_0_rgba(255,255,255,0.22)] transition hover:brightness-105 active:scale-[0.98]"
            >
              <svg className="h-4 w-4 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
              </svg>
              <span className="hidden sm:inline">{t("shell.signOut")}</span>
            </button>
          </div>
        </div>
      </header>

      {showAuthWarning && (
        <div
          role="status"
          className="admin-auth-banner border-b border-amber-700/30 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-950 sm:px-5 sm:text-sm dark:border-amber-400/25 dark:bg-amber-950/45 dark:text-amber-100"
        >
          <span className="admin-auth-banner-inner">
            <svg
              className="admin-auth-banner-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9.5C7.5 20.5 4 17 4 12V6l8-3z" />
              <path d="M12 8v5" />
              <circle cx="12" cy="16" r="0.75" fill="currentColor" stroke="none" />
            </svg>
            <span>
              <strong className="font-semibold">{t("shell.authStubStrong")}</strong>{" "}
              {t("shell.authWarning")}
            </span>
          </span>
        </div>
      )}

      {/* Mobile drawer — enter/exit via data-state (CSS), unmount after close */}
      {drawerMounted && (
        <div
          className="admin-drawer-root lg:hidden"
          role="presentation"
          data-state={drawerOpen ? "open" : "closed"}
        >
          <button
            type="button"
            className="admin-drawer-backdrop"
            aria-label={t("shell.closeMenu")}
            onClick={closeDrawer}
          />
          <aside
            className="admin-drawer-panel"
            role="dialog"
            aria-modal="true"
            aria-label={t("shell.adminNav")}
          >
            <div className="flex items-center justify-between border-b border-[color:var(--admin-border)] px-3 py-3">
              <p className="admin-section-label">
                {t("nav.navigate")}
              </p>
              <button
                type="button"
                className="admin-touch rounded-md p-2 text-muted hover:bg-[var(--admin-row-hover)] hover:text-ink"
                aria-label={t("shell.closeMenu")}
                onClick={closeDrawer}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav aria-label={t("nav.admin")} className="flex flex-col gap-0.5 overflow-y-auto px-2 py-3">
              <NavLinks pathname={pathname} onNavigate={closeDrawer} />
            </nav>
            <p className="mt-auto border-t border-ink/8 px-4 py-3 text-[0.625rem] leading-relaxed text-muted">
              {t("shell.jumpHint").split("__KBD__")[0]}<kbd className="admin-kbd">⌘K</kbd>{t("shell.jumpHint").split("__KBD__")[1] ?? ""}
            </p>
          </aside>
        </div>
      )}

      <div className="mx-auto grid max-w-[90rem] gap-0 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <aside className="admin-sidebar hidden border-r border-[color:var(--admin-border)] lg:sticky lg:top-[3.35rem] lg:block lg:h-[calc(100dvh-3.35rem)] lg:overflow-y-auto">
          <nav
            aria-label={t("nav.admin")}
            className="flex flex-col gap-0.5 px-2.5 py-3.5"
          >
            <NavLinks pathname={pathname} />
          </nav>
          <p className="px-3.5 pb-4 text-[0.625rem] leading-relaxed text-muted">
            {t("shell.jumpHint").split("__KBD__")[0]}<kbd className="admin-kbd">⌘K</kbd>{t("shell.jumpHint").split("__KBD__")[1] ?? ""}
          </p>
        </aside>

        <main className="admin-main min-w-0 px-[max(0.75rem,env(safe-area-inset-left))] py-3.5 pr-[max(0.75rem,env(safe-area-inset-right))] pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-5 sm:py-4 lg:px-6 lg:py-5">
          {children}
        </main>
      </div>

      <footer className="admin-footer border-t border-[color:var(--admin-border)] pb-[env(safe-area-inset-bottom,0px)]">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-2 px-3 py-3.5 text-[0.6875rem] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-5 lg:px-6">
          <p className="font-medium tracking-tight">{t("shell.brand")}</p>
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
        </div>
      </footer>

      <CommandPalette
        open={cmdOpen}
        onClose={closeCmd}
        onOpenShortcuts={openShortcuts}
      />
      <ShortcutsSheet open={shortcutsOpen} onClose={closeShortcuts} />
    </div>
  );
}

export default function AdminShell({
  children,
  warning,
  showAuthWarning,
}: {
  children: React.ReactNode;
  /** @deprecated use showAuthWarning */
  warning?: string | null | boolean;
  showAuthWarning?: boolean;
}) {
  const show =
    typeof showAuthWarning === "boolean"
      ? showAuthWarning
      : Boolean(warning);
  return (
    <ToastProvider>
      <AdminShellInner showAuthWarning={show}>{children}</AdminShellInner>
    </ToastProvider>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import AdminPageTransition from "@/components/admin/AdminPageTransition";
import { ToastProvider, useToast } from "@/components/admin/Toast";
import ThemeToggle from "@/components/ThemeToggle";
import SiteCredit from "@/components/SiteCredit";

const CommandPalette = dynamic(() => import("@/components/admin/CommandPalette"), {
  ssr: false,
});
const ShortcutsSheet = dynamic(() => import("@/components/admin/ShortcutsSheet"), {
  ssr: false,
});

const nav = [
  { href: "/admin", label: "Dashboard", exact: true, icon: "grid" },
  { href: "/admin/quotes", label: "Quotes", icon: "quotes" },
  { href: "/admin/pipeline", label: "Pipeline", icon: "kanban" },
  { href: "/admin/invoices", label: "Invoices", icon: "invoice" },
  { href: "/admin/payments", label: "Payments", icon: "pay" },
  { href: "/admin/customers", label: "Customers", icon: "people" },
  { href: "/admin/calendar", label: "Schedule", icon: "cal" },
  { href: "/admin/pricebook", label: "Price book", icon: "book" },
  { href: "/admin/templates", label: "Templates", icon: "templates" },
  { href: "/admin/activity", label: "Activity", icon: "pulse" },
  { href: "/admin/reports", label: "Reports", icon: "chart" },
  { href: "/admin/settings", label: "Settings", icon: "gear" },
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
    default:
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
  }
}

function AdminShellInner({
  children,
  warning,
}: {
  children: React.ReactNode;
  warning?: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  const openCmd = useCallback(() => setCmdOpen(true), []);
  const closeCmd = useCallback(() => setCmdOpen(false), []);
  const openShortcuts = useCallback(() => setShortcutsOpen(true), []);
  const closeShortcuts = useCallback(() => setShortcutsOpen(false), []);

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
    toast.push({ title: "Signed out", tone: "info" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="admin-app min-h-full text-ink">
      <header className="admin-topbar sticky top-0 z-40 border-b border-white/10 bg-[#0a0c10] text-cream shadow-[0_1px_0_0_rgba(192,139,58,0.35)]">
        <div className="h-0.5 w-full bg-gradient-to-r from-bronze via-bronze-light to-bronze" aria-hidden />
        <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-3 px-3 py-2.5 sm:px-5 lg:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <Image
              src="/brand/kaba-fence-icon.png"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
            />
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-semibold tracking-tight">
                Kaba Fence Admin
              </p>
              <p className="truncate text-[0.625rem] uppercase tracking-[0.12em] text-bronze-light/80">
                Quotes · invoices · field ops
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              type="button"
              onClick={openCmd}
              className="admin-search-trigger hidden items-center gap-2 rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-cream/70 transition hover:border-bronze/40 hover:bg-white/10 hover:text-cream sm:inline-flex"
              aria-label="Open command palette"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
              </svg>
              <span>Search</span>
              <kbd className="admin-kbd admin-kbd-dark ml-1">⌘K</kbd>
            </button>
            <button
              type="button"
              onClick={openCmd}
              className="rounded-md p-1.5 text-cream/70 transition hover:bg-white/10 hover:text-cream sm:hidden"
              aria-label="Search"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={openShortcuts}
              className="hidden rounded-md px-2 py-1.5 text-xs font-medium text-cream/70 transition hover:bg-white/10 hover:text-cream md:inline"
              title="Keyboard shortcuts"
            >
              ?
            </button>
            <ThemeToggle variant="dark" className="!h-8 !w-8" />
            <Link
              href="/"
              className="rounded-md px-2 py-1.5 text-xs font-medium text-cream/70 transition hover:bg-white/10 hover:text-cream"
            >
              View site
            </Link>
            <button
              type="button"
              onClick={() => void logout()}
              className="rounded-md bg-bronze px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-white shadow-[0_4px_14px_rgba(192,139,58,0.35)] transition hover:brightness-105 active:scale-[0.98]"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {warning && (
        <div
          role="status"
          className="admin-auth-banner border-b border-amber-700/30 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-950 sm:px-5 sm:text-sm dark:border-amber-400/25 dark:bg-amber-950/45 dark:text-amber-100"
        >
          <strong className="font-semibold">Auth stub — not production-ready.</strong>{" "}
          {warning}
        </div>
      )}

      <div className="mx-auto grid max-w-[90rem] gap-0 lg:grid-cols-[13.5rem_minmax(0,1fr)]">
        <aside className="admin-sidebar border-b border-ink/8 lg:sticky lg:top-[3.5rem] lg:h-[calc(100dvh-3.5rem)] lg:overflow-y-auto lg:border-b-0 lg:border-r lg:border-ink/8">
          <nav
            aria-label="Admin"
            className="flex gap-0.5 overflow-x-auto px-2 py-2 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-3 lg:py-4"
          >
            {nav.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`admin-nav-link flex items-center gap-2 whitespace-nowrap rounded-lg px-2.5 py-2 text-[0.8125rem] font-semibold transition ${
                    active
                      ? "bg-[#0a0c10] text-cream shadow-sm ring-1 ring-bronze/25 dark:bg-bronze/20 dark:text-bronze-light dark:ring-bronze/30"
                      : "text-muted hover:bg-[var(--admin-row-hover)] hover:text-ink"
                  }`}
                >
                  <NavIcon name={item.icon} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <p className="hidden px-4 pb-4 text-[0.625rem] leading-relaxed text-muted lg:block">
            Press <kbd className="admin-kbd">⌘K</kbd> to jump anywhere.
          </p>
        </aside>

        <main className="admin-main min-w-0 px-3 py-3.5 sm:px-5 sm:py-4 lg:px-6 lg:py-5">
          <AdminPageTransition>{children}</AdminPageTransition>
        </main>
      </div>

      <footer className="border-t border-ink/8 bg-[var(--admin-panel)]">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-2 px-3 py-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-5 lg:px-6">
          <p>Kaba Fence Admin</p>
          <SiteCredit tone="admin" />
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
}: {
  children: React.ReactNode;
  warning?: string | null;
}) {
  return (
    <ToastProvider>
      <AdminShellInner warning={warning}>{children}</AdminShellInner>
    </ToastProvider>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const nav = [
  { href: "/admin", label: "Dashboard", exact: true, icon: "grid" },
  { href: "/admin/quotes", label: "Quotes", icon: "quotes" },
  { href: "/admin/invoices", label: "Invoices", icon: "invoice" },
  { href: "/admin/payments", label: "Payments", icon: "pay" },
  { href: "/admin/customers", label: "Customers", icon: "people" },
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
    default:
      return (
        <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
  }
}

export default function AdminShell({
  children,
  warning,
}: {
  children: React.ReactNode;
  warning?: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="admin-app min-h-full text-ink">
      <header className="admin-topbar sticky top-0 z-40 border-b border-white/10 bg-navy text-cream">
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
              <p className="truncate text-sm font-semibold tracking-tight">
                Kaba Fence Admin
              </p>
              <p className="truncate text-[0.625rem] uppercase tracking-wider text-cream/50">
                Quotes · invoices · payments
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/"
              className="rounded-md px-2 py-1.5 text-xs font-medium text-cream/70 transition hover:bg-white/10 hover:text-cream"
            >
              View site
            </Link>
            <button
              type="button"
              onClick={() => void logout()}
              className="rounded-md bg-bronze px-2.5 py-1.5 text-xs font-bold text-navy transition hover:brightness-105"
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
        <aside className="admin-sidebar border-b border-ink/8 lg:sticky lg:top-[3.25rem] lg:h-[calc(100dvh-3.25rem)] lg:overflow-y-auto lg:border-b-0 lg:border-r lg:border-ink/8">
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
                      ? "bg-navy text-cream shadow-sm dark:bg-bronze/20 dark:text-bronze-light dark:ring-1 dark:ring-bronze/30"
                      : "text-muted hover:bg-[var(--admin-row-hover)] hover:text-ink"
                  }`}
                >
                  <NavIcon name={item.icon} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="admin-main min-w-0 px-3 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}

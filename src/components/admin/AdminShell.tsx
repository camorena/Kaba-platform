"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const nav = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/quotes", label: "Quotes" },
  { href: "/admin/invoices", label: "Invoices" },
  { href: "/admin/payments", label: "Payments" },
];

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
    <div className="min-h-full bg-[color-mix(in_srgb,var(--ivory-muted)_55%,var(--ivory))] text-ink">
      <div className="border-b border-ink/10 bg-navy text-cream">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Image
              src="/brand/kaba-fence-icon.png"
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight">
                Kaba Fence Admin
              </p>
              <p className="truncate text-[0.6875rem] text-cream/55">
                Internal · quotes / invoices / payments
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-md px-2.5 py-1.5 text-xs font-medium text-cream/75 transition hover:bg-white/10 hover:text-cream"
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
      </div>

      {warning && (
        <div
          role="status"
          className="border-b border-amber-700/30 bg-amber-50 px-4 py-2.5 text-sm text-amber-950 dark:border-amber-400/30 dark:bg-amber-950/40 dark:text-amber-100"
        >
          <strong className="font-semibold">Auth stub — not production-ready.</strong>{" "}
          {warning}
        </div>
      )}

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <nav
          aria-label="Admin"
          className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible"
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
                className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-navy text-cream"
                    : "text-muted hover:bg-surface hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="admin-panel min-w-0 rounded-2xl border border-ink/8 bg-transparent lg:border-0">{children}</div>
      </div>
    </div>
  );
}

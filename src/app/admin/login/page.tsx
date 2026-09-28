import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import SiteCredit from "@/components/SiteCredit";
import ThemeToggle from "@/components/ThemeToggle";
import { getAdminPassword, isAdminAuthenticated } from "@/lib/admin/auth";

export const metadata = {
  title: "Admin login",
};

const HIGHLIGHTS = [
  {
    title: "Quote → invoice → payment",
    body: "Pipeline, detail timelines, and stub ledger — ready for a real DB.",
  },
  {
    title: "Field-ready tools",
    body: "Kanban pipeline, local price book, and follow-up templates — no paid APIs.",
  },
  {
    title: "Agency craft",
    body: "Gold · charcoal · cream, Playfair/Inter, dark/light, ⌘K palette.",
  },
];

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  return (
    <div className="admin-app admin-login-root relative min-h-[100dvh] overflow-hidden">
      <div className="admin-login-mesh" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-bronze via-bronze-light to-bronze"
        aria-hidden
      />
      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-5">
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
            Kaba Fence Admin
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink xl:text-4xl">
            Field ops, refined.
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            A polished foundation for quotes, invoices, and payments — elegant
            enough for agency demos, honest about stub auth.
          </p>
          <ul className="mt-8 space-y-4">
            {HIGHLIGHTS.map((h) => (
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
          <div
            role="status"
            className="mb-5 rounded-lg border border-amber-700/30 bg-amber-50 px-3 py-2.5 text-xs leading-relaxed text-amber-950 dark:border-amber-400/25 dark:bg-amber-950/40 dark:text-amber-100"
          >
            <strong className="font-semibold">Auth stub — not production-ready.</strong>{" "}
            Shared password cookie only. Replace before handling live customer data.
          </div>

          <div className="mb-6 text-center lg:hidden">
            <Image
              src="/brand/kaba-fence-icon.png"
              alt=""
              width={48}
              height={48}
              className="mx-auto h-12 w-12 object-contain"
            />
            <p className="mt-4 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-bronze">
              Kaba Fence
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
              Admin sign-in
            </h1>
            <p className="mt-2 text-sm text-muted">
              Quotes, invoices, and payments foundation.
            </p>
          </div>

          <div className="mb-2 hidden lg:block">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
              Admin sign-in
            </h2>
            <p className="mt-1 text-sm text-muted">
              Enter the shared stub password to continue.
            </p>
          </div>

          <div className="admin-glass-panel admin-login-card p-5 sm:p-6">
            <LoginForm configured={Boolean(getAdminPassword())} />
          </div>

          <p className="mt-6 text-center text-xs text-muted">
            <Link href="/" className="underline-offset-2 hover:underline">
              ← Back to public site
            </Link>
          </p>
          <footer className="mt-8 border-t border-ink/8 pt-5 text-center">
            <SiteCredit tone="admin" />
          </footer>
        </div>
      </div>
    </div>
  );
}

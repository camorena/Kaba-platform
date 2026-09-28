import AdminShell from "@/components/admin/AdminShell";
import PageHeader from "@/components/admin/PageHeader";
import { getAdminPassword } from "@/lib/admin/auth";
import { requireAdmin } from "@/lib/admin/guard";

export const metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const { warning } = await requireAdmin();
  const configured = Boolean(getAdminPassword());

  return (
    <AdminShell warning={warning}>
      <PageHeader
        title="Settings"
        description="Environment docs and honest limits of this scaffold — not fake security controls."
        meta={
          <p className="mb-1 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-bronze">
            Ops · transparency
          </p>
        }
      />

      <div className="grid gap-3 lg:grid-cols-2">
        <section className="admin-glass-panel admin-gold-rail p-4 sm:p-5">
          <h2 className="admin-card-title">Auth (stub)</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Access is gated by a single shared password in{" "}
            <code className="rounded bg-ink/5 px-1 text-xs dark:bg-white/10">
              ADMIN_PASSWORD
            </code>
            . A successful login sets an httpOnly cookie (
            <code className="rounded bg-ink/5 px-1 text-xs dark:bg-white/10">
              kaba_admin_session
            </code>
            ) for ~12 hours. This is <strong>not</strong> multi-user auth, MFA,
            CSRF hardening, rate limiting, or an audit log.
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted">
            <li>
              Status:{" "}
              <strong className="text-ink">
                {configured ? "password configured" : "password missing"}
              </strong>
            </li>
            <li>
              Local: set in{" "}
              <code className="rounded bg-ink/5 px-1 text-xs dark:bg-white/10">
                .env.local
              </code>
            </li>
            <li>Production: set the same env var in Vercel project settings</li>
            <li>
              Replace with Auth.js / Clerk (or similar) + roles before live PII
            </li>
          </ul>
          <p className="mt-3 rounded-lg border border-amber-700/25 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-950 dark:border-amber-400/25 dark:bg-amber-950/40 dark:text-amber-100">
            We intentionally do <strong>not</strong> show or edit the password
            here. Rotate it in your host environment, then redeploy / restart.
          </p>
        </section>

        <section className="admin-glass-panel admin-gold-rail p-4 sm:p-5">
          <h2 className="admin-card-title">Data stores</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Quotes, invoices, and payments live in <strong>process memory</strong>{" "}
            with seed demo rows. On Vercel serverless, cold starts reset the
            list. Public{" "}
            <code className="rounded bg-ink/5 px-1 text-xs dark:bg-white/10">
              POST /api/quotes
            </code>{" "}
            still works for the marketing form on the warm instance that receives
            it.
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
            <li>Next step: Postgres / SQLite (Drizzle or Prisma) + migrations</li>
          </ul>
        </section>

        <section className="admin-glass-panel admin-gold-rail p-4 sm:p-5">
          <h2 className="admin-card-title">Payments / Stripe</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            <strong>Not integrated.</strong> The Payments page records stub
            ledger rows and can flip invoice status to partial/paid. There is no
            Stripe Checkout, Payment Intents, Connect, webhooks, or PCI scope in
            this app yet.
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted">
            <li>Planned: deposit + balance collection against invoices</li>
            <li>Planned: webhook-driven status, receipts, reconciliation</li>
            <li>
              Env placeholders (not used):{" "}
              <code className="text-xs">STRIPE_SECRET_KEY</code>,{" "}
              <code className="text-xs">STRIPE_WEBHOOK_SECRET</code>
            </li>
          </ul>
        </section>

        <section className="admin-glass-panel admin-gold-rail p-4 sm:p-5">
          <h2 className="admin-card-title">Crawlers, craft & shortcuts</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            <code className="rounded bg-ink/5 px-1 text-xs dark:bg-white/10">
              robots.txt
            </code>{" "}
            disallows <code className="text-xs">/admin</code> and{" "}
            <code className="text-xs">/api/</code>. Admin layout also sets{" "}
            <code className="text-xs">noindex, nofollow</code>. Do not link the
            admin from public chrome.
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted">
            <li>
              Command palette: <kbd className="admin-kbd">⌘K</kbd> /{" "}
              <kbd className="admin-kbd">Ctrl+K</kbd>
            </li>
            <li>
              Shortcuts cheat sheet: <kbd className="admin-kbd">?</kbd>
            </li>
            <li>Charts are pure SVG/CSS — no Chart.js or paid analytics</li>
            <li>Palette & shortcuts sheets load via dynamic import (lazy)</li>
          </ul>
        </section>
      </div>
    </AdminShell>
  );
}

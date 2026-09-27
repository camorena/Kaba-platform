import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin/guard";

export const metadata = { title: "Payments" };

export default async function AdminPaymentsPage() {
  const { warning } = await requireAdmin();

  return (
    <AdminShell warning={warning}>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
          Payments
        </h1>
        <p className="mt-1 text-sm text-muted">Placeholder — not live yet.</p>
      </header>
      <div className="rounded-xl border border-dashed border-ink/15 bg-surface px-4 py-12 text-center">
        <p className="text-sm font-semibold text-ink">Payments coming soon</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          Planned: deposit / balance collection (Stripe or similar), payment
          status on invoices, and reconciliation. Nothing is connected yet.
        </p>
      </div>
    </AdminShell>
  );
}

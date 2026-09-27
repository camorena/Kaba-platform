import EmptyState from "@/components/admin/EmptyState";
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
        <p className="mt-1 text-sm text-muted">
          Placeholder UI — payment processing is not connected.
        </p>
      </header>
      <EmptyState
        title="Payments coming soon"
        description="Planned: deposit and balance collection, payment status on invoices, and reconciliation. Nothing is connected in this scaffold."
        icon={
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        }
      />
    </AdminShell>
  );
}

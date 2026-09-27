import EmptyState from "@/components/admin/EmptyState";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin/guard";

export const metadata = { title: "Invoices" };

export default async function AdminInvoicesPage() {
  const { warning } = await requireAdmin();

  return (
    <AdminShell warning={warning}>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
          Invoices
        </h1>
        <p className="mt-1 text-sm text-muted">
          Placeholder UI — invoice data is not live yet.
        </p>
      </header>
      <EmptyState
        title="Invoice tooling coming soon"
        description="Planned: draft from won quotes, PDF export, and send-to-customer email. No invoice records are stored in this demo."
        icon={
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 14l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
    </AdminShell>
  );
}

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
        <p className="mt-1 text-sm text-muted">Placeholder — not live yet.</p>
      </header>
      <div className="rounded-xl border border-dashed border-ink/15 bg-surface px-4 py-12 text-center">
        <p className="text-sm font-semibold text-ink">Invoice tooling coming soon</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          Planned: draft from won quotes, PDF export, send-to-customer email.
          No invoice data is stored yet.
        </p>
      </div>
    </AdminShell>
  );
}

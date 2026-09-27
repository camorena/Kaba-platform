import AdminShell from "@/components/admin/AdminShell";
import QuotesTable from "@/components/admin/QuotesTable";
import { requireAdmin } from "@/lib/admin/guard";
import { listQuotes } from "@/lib/admin/quotes-store";

export const metadata = { title: "Quotes" };
export const dynamic = "force-dynamic";

export default async function AdminQuotesPage() {
  const { warning } = await requireAdmin();
  const quotes = listQuotes();

  return (
    <AdminShell warning={warning}>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
          Quotes
        </h1>
        <p className="mt-1 text-sm text-muted">
          Submissions from the public quote form plus seed demo rows. Backed by
          an in-memory store (swap for a DB later). CRM email follow-up is still
          pending.
        </p>
      </header>
      <QuotesTable quotes={quotes} />
    </AdminShell>
  );
}

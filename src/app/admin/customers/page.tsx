import AdminShell from "@/components/admin/AdminShell";
import CustomersClient from "@/components/admin/CustomersClient";
import { requireAdmin } from "@/lib/admin/guard";
import { listCustomers, listQuotes } from "@/lib/admin/quotes-store";
import type { QuoteStatus } from "@/lib/admin/status";

export const metadata = { title: "Customers" };
export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const { warning } = await requireAdmin();
  const customers = listCustomers();
  const quotes = listQuotes();

  const rows = customers.map((c) => {
    const quoteLink = quotes.find(
      (q) =>
        q.email.toLowerCase() === c.email.toLowerCase() || q.phone === c.phone,
    );
    return {
      key: c.key,
      name: c.name,
      email: c.email,
      phone: c.phone,
      quoteCount: c.quoteCount,
      addresses: c.addresses,
      latestQuoteAt: c.latestQuoteAt,
      statuses: c.statuses as QuoteStatus[],
      quoteId: quoteLink?.id,
    };
  });

  return (
    <AdminShell warning={warning}>
      <CustomersClient customers={rows} />
    </AdminShell>
  );
}

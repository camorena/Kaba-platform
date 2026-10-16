import CustomersClient from "@/components/admin/CustomersClient";
import { listCustomers, listQuotes } from "@/lib/admin/quotes-store";
import type { QuoteStatus } from "@/lib/admin/status";

export const metadata = { title: "Customers" };
export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customers = await listCustomers();
  const quotes = await listQuotes();

  const rows = customers.map((c) => {
    const email = c.email.toLowerCase().trim();
    const phone = c.phone.trim();
    const quoteLink = quotes.find(
      (q) =>
        (email && q.email.toLowerCase().trim() === email) ||
        (phone && q.phone.trim() === phone),
    );
    return {
      key: c.key,
      id: c.id,
      name: c.name,
      company: c.company,
      city: c.city,
      state: c.state,
      email: c.email,
      phone: c.phone,
      quoteCount: c.quoteCount,
      addresses: c.addresses,
      latestQuoteAt: c.latestQuoteAt,
      statuses: c.statuses as QuoteStatus[],
      quoteId: quoteLink?.id,
    };
  });

  return <CustomersClient customers={rows} />;
}

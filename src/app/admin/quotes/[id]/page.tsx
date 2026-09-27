import AdminShell from "@/components/admin/AdminShell";
import QuoteDetailClient from "@/components/admin/QuoteDetailClient";
import { requireAdmin } from "@/lib/admin/guard";
import { listInvoices } from "@/lib/admin/invoices-store";
import { getQuote } from "@/lib/admin/quotes-store";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quote = getQuote(id);
  return { title: quote ? quote.name : "Quote" };
}

export default async function AdminQuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { warning } = await requireAdmin();
  const { id } = await params;
  const quote = getQuote(id);
  if (!quote) notFound();

  const related = listInvoices().find((i) => i.quoteId === quote.id);

  return (
    <AdminShell warning={warning}>
      <QuoteDetailClient
        quote={quote}
        relatedInvoiceId={related?.id ?? null}
      />
    </AdminShell>
  );
}

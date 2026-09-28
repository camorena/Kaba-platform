import QuoteDetailClient from "@/components/admin/QuoteDetailClient";
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
  const quote = await getQuote(id);
  return { title: quote ? quote.name : "Quote" };
}

export default async function AdminQuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quote = await getQuote(id);
  if (!quote) notFound();

  const related = (await listInvoices()).find((i) => i.quoteId === quote.id);

  return (
    <QuoteDetailClient
      quote={quote}
      relatedInvoiceId={related?.id ?? null}
    />
  );
}

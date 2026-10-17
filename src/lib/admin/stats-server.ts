import "server-only";

import { getRepos } from "@/lib/db/adapter";
import { invoiceLinesTotalCents } from "@/lib/invoices/lines";
import {
  computeBusinessStats,
  type BusinessStats,
  type StatsRange,
} from "@/lib/stats/business";

/** Load real records and compute stats (no PII leaves this function). */
export async function loadBusinessStats(range: StatsRange): Promise<BusinessStats> {
  const repos = getRepos();
  const [customers, quotes, invoices, payments, paid] = await Promise.all([
    repos.customers.list(),
    repos.quotes.list(),
    repos.invoices.list(),
    repos.payments.list(),
    repos.payments.paidCentsMap(),
  ]);
  return computeBusinessStats(
    {
      customers: customers.map((c) => ({ city: c.city ?? null })),
      quotes: quotes.map((q) => ({
        id: q.id,
        status: q.status,
        source: q.source ?? "",
        createdAt: q.createdAt,
      })),
      invoices: invoices.map((i) => ({
        id: i.id,
        quoteId: i.quoteId,
        status: i.status,
        demo: i.demo,
        totalCents: invoiceLinesTotalCents(i.lines),
        createdAt: i.createdAt,
      })),
      payments: payments.map((p) => ({
        invoiceId: p.invoiceId,
        amountCents: p.amountCents,
        status: p.status,
        demo: p.demo,
        createdAt: p.createdAt,
      })),
      paidByInvoiceId: paid,
    },
    range,
  );
}

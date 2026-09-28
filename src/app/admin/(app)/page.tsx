import DashboardClient from "@/components/admin/DashboardClient";
import { getLaunchBlockers } from "@/lib/admin/launch-blockers";
import { invoiceStats, listInvoices } from "@/lib/admin/invoices-store";
import { listPayments, paidCentsMap, paymentStats } from "@/lib/admin/payments-store";
import {
  listQuietQuotes,
  listQuotes,
  quietQuoteCount,
  quoteStats,
  QUIET_DAYS_THRESHOLD,
} from "@/lib/admin/quotes-store";
import { QUOTE_STATUSES } from "@/lib/admin/status";
import { daysSince } from "@/lib/admin/format";
import type { InvoiceRecord, PaymentRecord, QuoteRecord } from "@/lib/db/types";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // In-memory stores always resolve; shape as number | null so UI never lies
  // with a silent 0 if a future DB read fails (unknown ≠ fake 0).
  let qStats: {
    new: number | null;
    total: number | null;
    won: number | null;
    scheduled: number | null;
  };
  let iStats: { open: number | null; totalOpenCents: number | null };
  let pStats: { recordedCents: number | null; total: number | null };
  let quietCount: number | null;
  let quotes: QuoteRecord[] = [];
  let quiet: QuoteRecord[] = [];
  let recentInvoices: InvoiceRecord[] = [];
  let recentPayments: PaymentRecord[] = [];
  let blockers = getLaunchBlockers();

  try {
    quotes = await listQuotes();
    quiet = await listQuietQuotes();
    recentInvoices = (await listInvoices()).slice(0, 4);
    recentPayments = (await listPayments()).slice(0, 3);
    const paidMap = await paidCentsMap();
    const qs = await quoteStats();
    qStats = {
      new: qs.new,
      total: qs.total,
      won: qs.won,
      scheduled: qs.scheduled,
    };
    const is = await invoiceStats(paidMap);
    iStats = { open: is.open, totalOpenCents: is.totalOpenCents };
    const ps = await paymentStats();
    pStats = { recordedCents: ps.recordedCents, total: ps.total };
    quietCount = await quietQuoteCount();
  } catch {
    qStats = { new: null, total: null, won: null, scheduled: null };
    iStats = { open: null, totalOpenCents: null };
    pStats = { recordedCents: null, total: null };
    quietCount = null;
    quotes = [];
    quiet = [];
    recentInvoices = [];
    recentPayments = [];
  }

  const recent = quotes.slice(0, 5);
  const allInvoices = await listInvoices().catch(() => [] as InvoiceRecord[]);

  const needsAction = [
    ...quotes
      .filter((q) => q.status === "new" && !quiet.some((qq) => qq.id === q.id))
      .map((q) => ({
        id: q.id,
        href: `/admin/quotes/${q.id}`,
        label: q.name,
        metaKey: "newQuote" as const,
        serviceOrStatus: q.serviceType,
      })),
    ...allInvoices
      .filter((i) => i.status === "sent" || i.status === "partial" || i.status === "draft")
      .slice(0, 3)
      .map((i) => ({
        id: i.id,
        href: `/admin/invoices/${i.id}`,
        label: i.number,
        metaKey: "invoice" as const,
        serviceOrStatus: i.status,
        customer: i.customerName,
      })),
  ].slice(0, 5);

  const funnel = QUOTE_STATUSES.filter((s) => s !== "lost").map((s) => ({
    status: s,
    count: quotes.filter((q) => q.status === s).length,
  }));

  return (
    <DashboardClient
      qStats={qStats}
      iStats={iStats}
      pStats={pStats}
      quietCount={quietCount}
      quietDays={QUIET_DAYS_THRESHOLD}
      quietQuotes={quiet.slice(0, 6).map((q) => ({
        id: q.id,
        name: q.name,
        serviceType: q.serviceType,
        status: q.status,
        updatedAt: q.updatedAt,
        quietDays: daysSince(q.updatedAt),
      }))}
      launchBlockers={blockers}
      needsAction={needsAction}
      funnel={funnel}
      recent={recent.map((q) => ({
        id: q.id,
        name: q.name,
        serviceType: q.serviceType,
        address: q.address,
        status: q.status,
        createdAt: q.createdAt,
      }))}
      recentInvoices={recentInvoices.map((i) => ({
        id: i.id,
        number: i.number,
        status: i.status,
        customerName: i.customerName,
      }))}
      recentPayments={recentPayments.map((p) => ({
        id: p.id,
        invoiceNumber: p.invoiceNumber,
        amountCents: p.amountCents,
      }))}
    />
  );
}

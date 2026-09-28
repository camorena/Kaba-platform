import { listInvoices } from "@/lib/admin/invoices-store";
import { listPayments } from "@/lib/admin/payments-store";
import { listQuotes } from "@/lib/admin/quotes-store";

export type ActivityKind = "quote" | "invoice" | "payment";

export type ActivityItem = {
  id: string;
  kind: ActivityKind;
  at: string;
  /** Customer name or invoice number */
  subject: string;
  status: string;
  /** Remaining detail without status (service · address, customer, method · customer) */
  extra: string;
  href: string;
  tone: "sky" | "amber" | "emerald" | "violet" | "muted";
  /** @deprecated English composite — prefer subject/status/extra */
  title: string;
  detail: string;
};

export async function listActivity(limit = 40): Promise<ActivityItem[]> {
  const items: ActivityItem[] = [];

  for (const q of await listQuotes()) {
    items.push({
      id: `act_q_${q.id}`,
      kind: "quote",
      at: q.updatedAt || q.createdAt,
      subject: q.name,
      status: q.status,
      extra: `${q.serviceType} · ${q.address}`,
      href: `/admin/quotes/${q.id}`,
      title: `Quote · ${q.name}`,
      detail: `${q.status} · ${q.serviceType} · ${q.address}`,
      tone:
        q.status === "won"
          ? "emerald"
          : q.status === "scheduled"
            ? "amber"
            : q.status === "new"
              ? "sky"
              : "violet",
    });
  }

  for (const inv of await listInvoices()) {
    items.push({
      id: `act_inv_${inv.id}`,
      kind: "invoice",
      at: inv.updatedAt || inv.createdAt,
      subject: inv.number,
      status: inv.status,
      extra: inv.customerName,
      href: `/admin/invoices/${inv.id}`,
      title: `Invoice · ${inv.number}`,
      detail: `${inv.status} · ${inv.customerName}`,
      tone:
        inv.status === "paid"
          ? "emerald"
          : inv.status === "partial" || inv.status === "sent"
            ? "amber"
            : "muted",
    });
  }

  for (const p of await listPayments()) {
    items.push({
      id: `act_pay_${p.id}`,
      kind: "payment",
      at: p.createdAt,
      subject: p.invoiceNumber,
      status: p.status,
      extra: `${p.method} · ${p.customerName} · ${p.status}`,
      href: `/admin/payments`,
      title: `Payment · ${p.invoiceNumber}`,
      detail: `${p.method} · ${p.customerName} · ${p.status}`,
      tone: p.status === "recorded" ? "emerald" : "amber",
    });
  }

  return items
    .sort((a, b) => +new Date(b.at) - +new Date(a.at))
    .slice(0, limit);
}

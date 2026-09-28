import { listInvoices } from "@/lib/admin/invoices-store";
import { listPayments } from "@/lib/admin/payments-store";
import { listQuotes } from "@/lib/admin/quotes-store";

export type ActivityKind = "quote" | "invoice" | "payment";

export type ActivityItem = {
  id: string;
  kind: ActivityKind;
  at: string;
  title: string;
  detail: string;
  href: string;
  tone: "sky" | "amber" | "emerald" | "violet" | "muted";
};

export function listActivity(limit = 40): ActivityItem[] {
  const items: ActivityItem[] = [];

  for (const q of listQuotes()) {
    items.push({
      id: `act_q_${q.id}`,
      kind: "quote",
      at: q.updatedAt || q.createdAt,
      title: `Quote · ${q.name}`,
      detail: `${q.status} · ${q.serviceType} · ${q.address}`,
      href: `/admin/quotes/${q.id}`,
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

  for (const inv of listInvoices()) {
    items.push({
      id: `act_inv_${inv.id}`,
      kind: "invoice",
      at: inv.updatedAt || inv.createdAt,
      title: `Invoice · ${inv.number}`,
      detail: `${inv.status} · ${inv.customerName}`,
      href: `/admin/invoices/${inv.id}`,
      tone:
        inv.status === "paid"
          ? "emerald"
          : inv.status === "partial" || inv.status === "sent"
            ? "amber"
            : "muted",
    });
  }

  for (const p of listPayments()) {
    items.push({
      id: `act_pay_${p.id}`,
      kind: "payment",
      at: p.createdAt,
      title: `Payment · ${p.invoiceNumber}`,
      detail: `${p.method} · ${p.customerName} · ${p.status}`,
      href: `/admin/payments`,
      tone: p.status === "recorded" ? "emerald" : "amber",
    });
  }

  return items
    .sort((a, b) => +new Date(b.at) - +new Date(a.at))
    .slice(0, limit);
}

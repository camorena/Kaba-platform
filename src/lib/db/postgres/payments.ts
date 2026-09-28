/**
 * Postgres PaymentsRepo — stub ledger until Stripe.
 */

import { query } from "@/lib/db/postgres/connection";
import { createPostgresInvoicesRepo } from "@/lib/db/postgres/invoices";
import { mapPayment, type PaymentRow } from "@/lib/db/postgres/mappers";
import type { PaymentsRepo } from "@/lib/db/repos/types";

export function createPostgresPaymentsRepo(): PaymentsRepo {
  const invoices = createPostgresInvoicesRepo();

  const repo: PaymentsRepo = {
    async list() {
      const { rows } = await query<PaymentRow>(
        `select p.*, i.number as invoice_number, i.customer_name
         from payments p
         join invoices i on i.id = p.invoice_id
         order by p.created_at desc`,
      );
      return rows.map(mapPayment);
    },

    async listForInvoice(invoiceId) {
      const { rows } = await query<PaymentRow>(
        `select p.*, i.number as invoice_number, i.customer_name
         from payments p
         join invoices i on i.id = p.invoice_id
         where p.invoice_id = $1
         order by p.created_at desc`,
        [invoiceId],
      );
      return rows.map(mapPayment);
    },

    async get(id) {
      const { rows } = await query<PaymentRow>(
        `select p.*, i.number as invoice_number, i.customer_name
         from payments p
         join invoices i on i.id = p.invoice_id
         where p.id = $1`,
        [id],
      );
      return rows[0] ? mapPayment(rows[0]) : undefined;
    },

    async paidCentsForInvoice(invoiceId) {
      const { rows } = await query<{ sum: string | null }>(
        `select coalesce(sum(amount_cents), 0)::text as sum
         from payments
         where invoice_id = $1 and status = 'recorded'`,
        [invoiceId],
      );
      return Number(rows[0]?.sum) || 0;
    },

    async paidCentsMap() {
      const { rows } = await query<{ invoice_id: string; sum: string }>(
        `select invoice_id, coalesce(sum(amount_cents), 0)::text as sum
         from payments
         where status = 'recorded'
         group by invoice_id`,
      );
      const map = new Map<string, number>();
      for (const row of rows) {
        map.set(row.invoice_id, Number(row.sum) || 0);
      }
      return map;
    },

    async record(input) {
      const inv = await invoices.get(input.invoiceId);
      if (!inv) return null;
      if (input.amountCents <= 0) return null;

      const { rows } = await query<PaymentRow>(
        `insert into payments (
           invoice_id, amount_cents, method, status, reference, notes, demo
         ) values ($1, $2, $3, 'recorded', $4, $5, true)
         returning *`,
        [
          inv.id,
          input.amountCents,
          input.method,
          (input.reference ?? "").trim(),
          (input.notes ?? "").trim(),
        ],
      );
      const payment = mapPayment({
        ...rows[0],
        invoice_number: inv.number,
        customer_name: inv.customerName,
      });

      const paid = await repo.paidCentsForInvoice(inv.id);
      const total = invoices.subtotalCents(inv);
      if (paid >= total && total > 0) {
        await invoices.updateStatus(inv.id, "paid");
      } else if (paid > 0 && inv.status !== "void") {
        await invoices.updateStatus(inv.id, "partial");
      }

      return payment;
    },

    async stats() {
      const { rows } = await query<{ total: string; recorded: string }>(
        `select
           count(*)::text as total,
           coalesce(sum(case when status = 'recorded' then amount_cents else 0 end), 0)::text as recorded
         from payments`,
      );
      return {
        total: Number(rows[0]?.total) || 0,
        recordedCents: Number(rows[0]?.recorded) || 0,
      };
    },
  };

  return repo;
}

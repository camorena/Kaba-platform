/**
 * Postgres InvoicesRepo — same contract as Memory*.
 */

import { demoUnitCentsForService } from "@/lib/db/demo-amounts";
import { query } from "@/lib/db/postgres/connection";
import {
  mapInvoice,
  mapInvoiceLine,
  type InvoiceLineRow,
  type InvoiceRow,
} from "@/lib/db/postgres/mappers";
import { createPostgresQuotesRepo } from "@/lib/db/postgres/quotes";
import type { InvoicesRepo } from "@/lib/db/repos/types";
import type { InvoiceLine, InvoiceRecord, InvoiceStatus } from "@/lib/db/types";
import { generatePayToken } from "@/lib/pay/token";

async function loadLines(invoiceIds: string[]): Promise<Map<string, InvoiceLine[]>> {
  const map = new Map<string, InvoiceLine[]>();
  if (!invoiceIds.length) return map;
  const { rows } = await query<InvoiceLineRow>(
    `select * from invoice_lines
     where invoice_id = any($1::uuid[])
     order by sort_order asc, created_at asc`,
    [invoiceIds],
  );
  for (const row of rows) {
    const list = map.get(row.invoice_id) ?? [];
    list.push(mapInvoiceLine(row));
    map.set(row.invoice_id, list);
  }
  return map;
}

async function nextInvoiceNumber(): Promise<string> {
  const { rows } = await query<{ max: string | null }>(
    `select max(number) as max from invoices where number ~ '^KF-[0-9]+$'`,
  );
  const raw = rows[0]?.max;
  let n = 1000;
  if (raw) {
    const parsed = Number(raw.replace(/^KF-/, ""));
    if (Number.isFinite(parsed)) n = parsed;
  }
  return `KF-${n + 1}`;
}

export function createPostgresInvoicesRepo(): InvoicesRepo {
  const quotes = createPostgresQuotesRepo();

  const repo: InvoicesRepo = {
    subtotalCents(inv) {
      return inv.lines.reduce((sum, l) => sum + l.quantity * l.unitCents, 0);
    },

    async list() {
      const { rows } = await query<InvoiceRow>(
        `select * from invoices order by created_at desc`,
      );
      const lines = await loadLines(rows.map((r) => r.id));
      return rows.map((r) => mapInvoice(r, lines.get(r.id) ?? []));
    },

    async get(id) {
      const { rows } = await query<InvoiceRow>(
        `select * from invoices where id = $1`,
        [id],
      );
      if (!rows[0]) return undefined;
      const lines = await loadLines([id]);
      return mapInvoice(rows[0], lines.get(id) ?? []);
    },

    async getByPayToken(token) {
      const t = token.trim();
      if (!t) return undefined;
      const { rows } = await query<InvoiceRow>(
        `select * from invoices where pay_token = $1`,
        [t],
      );
      if (!rows[0]) return undefined;
      const id = rows[0].id;
      const lines = await loadLines([id]);
      return mapInvoice(rows[0], lines.get(id) ?? []);
    },

    async createFromQuote(quoteId) {
      const quote = await quotes.get(quoteId);
      if (!quote) return null;

      const unit = demoUnitCentsForService(quote.serviceType);
      const number = await nextInvoiceNumber();
      const payToken = generatePayToken();
      const { rows } = await query<InvoiceRow>(
        `insert into invoices (
           number, quote_id, customer_id, customer_name, customer_email,
           customer_phone, address, status, notes, demo, pay_token
         ) values ($1,$2,$3,$4,$5,$6,$7,'draft',$8,true,$9)
         returning *`,
        [
          number,
          quote.id,
          quote.customerId,
          quote.name,
          quote.email,
          quote.phone,
          quote.address,
          `Created from quote ${quote.id}. Synthetic demo amount — not a real bid.`,
          payToken,
        ],
      );
      const inv = rows[0];
      const { rows: lineRows } = await query<InvoiceLineRow>(
        `insert into invoice_lines (invoice_id, description, quantity, unit_cents, sort_order)
         values ($1, $2, 1, $3, 0)
         returning *`,
        [
          inv.id,
          `${quote.serviceType} — demo estimate from quote`,
          unit,
        ],
      );
      return mapInvoice(inv, lineRows.map(mapInvoiceLine));
    },

    async updateStatus(id, status: InvoiceStatus) {
      const { rows } = await query<InvoiceRow>(
        `update invoices set status = $2, updated_at = now()
         where id = $1
         returning *`,
        [id, status],
      );
      if (!rows[0]) return undefined;
      const lines = await loadLines([id]);
      return mapInvoice(rows[0], lines.get(id) ?? []);
    },

    async stats(paidByInvoiceId) {
      const all = await repo.list();
      const open = all.filter((i) =>
        ["draft", "sent", "partial"].includes(i.status),
      );
      const totalOpenCents = open.reduce((s, i) => {
        const paid = paidByInvoiceId?.get(i.id) ?? 0;
        return s + Math.max(0, repo.subtotalCents(i) - paid);
      }, 0);
      return {
        total: all.length,
        draft: all.filter((i) => i.status === "draft").length,
        open: open.length,
        paid: all.filter((i) => i.status === "paid").length,
        totalOpenCents,
      };
    },
  };

  return repo;
}

/** Used by payments repo after recording a payment. */
export async function loadInvoiceRecord(
  id: string,
): Promise<InvoiceRecord | undefined> {
  return createPostgresInvoicesRepo().get(id);
}

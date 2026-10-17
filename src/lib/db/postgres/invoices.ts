/**
 * Postgres InvoicesRepo — same contract as Memory*.
 */

import { isUuid } from "@/lib/db/ids";
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
import {
  EDITABLE_INVOICE_STATUSES,
  invoiceLinesTotalCents,
} from "@/lib/invoices/lines";
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
      return invoiceLinesTotalCents(inv.lines);
    },

    async list() {
      const { rows } = await query<InvoiceRow>(
        `select * from invoices order by created_at desc`,
      );
      const lines = await loadLines(rows.map((r) => r.id));
      return rows.map((r) => mapInvoice(r, lines.get(r.id) ?? []));
    },

    async get(id) {
      if (!isUuid(id)) return undefined;
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

      // Real invoice (demo=false) as a draft. Quotes carry no amount, so
      // start with one editable line at $0 — the admin must price it before
      // the invoice can be sent (see isInvoiceSendable).
      const number = await nextInvoiceNumber();
      const payToken = generatePayToken();
      const { rows } = await query<InvoiceRow>(
        `insert into invoices (
           number, quote_id, customer_id, customer_name, customer_email,
           customer_phone, address, status, notes, demo, pay_token
         ) values ($1,$2,$3,$4,$5,$6,$7,'draft',$8,false,$9)
         returning *`,
        [
          number,
          quote.id,
          quote.customerId,
          quote.name,
          quote.email,
          quote.phone,
          quote.address,
          "",
          payToken,
        ],
      );
      const inv = rows[0];
      const { rows: lineRows } = await query<InvoiceLineRow>(
        `insert into invoice_lines (invoice_id, description, quantity, unit_cents, sort_order)
         values ($1, $2, 1, 0, 0)
         returning *`,
        [inv.id, quote.serviceType?.trim() || "Servicio"],
      );
      return mapInvoice(inv, lineRows.map(mapInvoiceLine));
    },

    async replaceLines(id, lines) {
      if (!isUuid(id)) return { ok: false, reason: "not_found" };
      // Single statement → atomic: lock the invoice row, delete old lines,
      // insert new ones, bump updated_at — only while editable.
      const { rows } = await query<{ id: string; editable: boolean }>(
        `with target as (
           select id, (status = any($5::invoice_status[])) as editable
           from invoices where id = $1 for update
         ),
         del as (
           delete from invoice_lines
           where invoice_id in (select id from target where editable)
         ),
         ins as (
           insert into invoice_lines (invoice_id, description, quantity, unit_cents, sort_order)
           select t.id, d.description, d.quantity, d.unit_cents, (d.ord - 1)::int
           from target t
           cross join unnest($2::text[], $3::numeric[], $4::int[])
             with ordinality as d(description, quantity, unit_cents, ord)
           where t.editable
         ),
         upd as (
           update invoices i set updated_at = now()
           from target t
           where i.id = t.id and t.editable
           returning i.*
         )
         select coalesce(u.id, t.id) as id, t.editable
         from target t left join upd u on u.id = t.id`,
        [
          id,
          lines.map((l) => l.description),
          lines.map((l) => l.quantity),
          lines.map((l) => l.unitCents),
          [...EDITABLE_INVOICE_STATUSES],
        ],
      );
      const row = rows[0];
      if (!row) return { ok: false, reason: "not_found" };
      if (!row.editable) return { ok: false, reason: "locked" };
      const fresh = await repo.get(id);
      if (!fresh) return { ok: false, reason: "not_found" };
      return { ok: true, invoice: fresh };
    },

    async updateStatus(id, status: InvoiceStatus) {
      if (!isUuid(id)) return undefined;
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

    async markPayLinkNotified(id, at) {
      if (!isUuid(id)) return undefined;
      const stamp = at === undefined ? new Date().toISOString() : at;
      const { rows } = await query<InvoiceRow>(
        `update invoices
         set pay_link_notified_at = $2::timestamptz, updated_at = now()
         where id = $1
         returning *`,
        [id, stamp],
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

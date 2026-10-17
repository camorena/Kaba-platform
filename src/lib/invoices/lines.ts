/**
 * Invoice line math + validation shared by repos, API routes and UI.
 * Currency is USD; amounts are integer cents. Quantity allows 2 decimals
 * (matches invoice_lines.quantity numeric(12,2)).
 */

import type { InvoiceLine, InvoiceStatus } from "@/lib/db/types";

export type InvoiceLineInput = {
  description: string;
  quantity: number;
  unitCents: number;
};

export const MAX_INVOICE_LINES = 50;
export const MAX_LINE_DESCRIPTION = 300;
export const MAX_LINE_QUANTITY = 100_000;
/** $1,000,000.00 per unit — sanity cap, not a business rule. */
export const MAX_UNIT_CENTS = 100_000_000;

/** Lines can change only before any payment lands. */
export const EDITABLE_INVOICE_STATUSES: readonly InvoiceStatus[] = [
  "draft",
  "sent",
];

export function isInvoiceEditable(status: InvoiceStatus): boolean {
  return EDITABLE_INVOICE_STATUSES.includes(status);
}

export function lineAmountCents(l: Pick<InvoiceLine, "quantity" | "unitCents">): number {
  return Math.round(l.quantity * l.unitCents);
}

export function invoiceLinesTotalCents(
  lines: ReadonlyArray<Pick<InvoiceLine, "quantity" | "unitCents">>,
): number {
  return lines.reduce((s, l) => s + lineAmountCents(l), 0);
}

/**
 * An invoice may be sent / shared / paid only when it has at least one line
 * and a positive total. Never send a $0 invoice to a customer.
 */
export function isInvoiceSendable(
  lines: ReadonlyArray<Pick<InvoiceLine, "quantity" | "unitCents">>,
): boolean {
  return lines.length > 0 && invoiceLinesTotalCents(lines) > 0;
}

export type LineValidationError =
  | "lines_not_array"
  | "too_many_lines"
  | "description_required"
  | "description_too_long"
  | "quantity_invalid"
  | "unit_invalid";

export type LineValidationResult =
  | { ok: true; lines: InvoiceLineInput[] }
  | { ok: false; error: LineValidationError; index?: number };

function isTwoDecimal(n: number): boolean {
  return Math.abs(Math.round(n * 100) - n * 100) < 1e-6;
}

export function validateInvoiceLines(raw: unknown): LineValidationResult {
  if (!Array.isArray(raw)) return { ok: false, error: "lines_not_array" };
  if (raw.length > MAX_INVOICE_LINES) return { ok: false, error: "too_many_lines" };
  const out: InvoiceLineInput[] = [];
  for (let i = 0; i < raw.length; i++) {
    const r = raw[i] as Record<string, unknown> | null;
    const description =
      r && typeof r.description === "string" ? r.description.trim() : "";
    if (!description) return { ok: false, error: "description_required", index: i };
    if (description.length > MAX_LINE_DESCRIPTION) {
      return { ok: false, error: "description_too_long", index: i };
    }
    const quantity = r ? Number(r.quantity) : NaN;
    if (
      !Number.isFinite(quantity) ||
      quantity <= 0 ||
      quantity > MAX_LINE_QUANTITY ||
      !isTwoDecimal(quantity)
    ) {
      return { ok: false, error: "quantity_invalid", index: i };
    }
    const unitCents = r ? Number(r.unitCents) : NaN;
    if (
      !Number.isInteger(unitCents) ||
      unitCents < 0 ||
      unitCents > MAX_UNIT_CENTS
    ) {
      return { ok: false, error: "unit_invalid", index: i };
    }
    out.push({ description, quantity: Math.round(quantity * 100) / 100, unitCents });
  }
  return { ok: true, lines: out };
}

/** Parse "1,234.50" / "1234.5" / "$12" into cents; null when invalid. */
export function parseMoneyToCents(input: string): number | null {
  const s = input.replace(/[$\s,]/g, "");
  if (!s) return null;
  if (!/^\d+(\.\d{0,2})?$/.test(s)) return null;
  const [whole, frac = ""] = s.split(".");
  const cents = Number(whole) * 100 + Number((frac + "00").slice(0, 2));
  return Number.isSafeInteger(cents) ? cents : null;
}

export function centsToInput(cents: number): string {
  return (cents / 100).toFixed(2);
}

/** API error code when an action needs a priced invoice (lines + total > 0). */
export const INVOICE_NOT_SENDABLE = "invoice_not_sendable";
/** API error code when lines can no longer change (payments / paid / void). */
export const INVOICE_LINES_LOCKED = "invoice_lines_locked";

/**
 * Which invoices a public /pay/[token] link (and public checkout) may expose.
 * Production never serves demo tokens/invoices, and nothing is payable until
 * the invoice has lines with a positive total.
 */

import { getDataAdapterName } from "@/lib/db/adapter";
import type { InvoiceRecord } from "@/lib/db/types";
import { isInvoiceSendable } from "@/lib/invoices/lines";
import { isDemoPayToken, isValidPayTokenShape } from "@/lib/pay/token";

/** True on real data: Postgres adapter or a Vercel production deployment. */
export function isRealDataEnvironment(): boolean {
  return (
    getDataAdapterName() === "postgres" ||
    process.env.VERCEL_ENV === "production"
  );
}

/** Cheap pre-check before any DB lookup. */
export function isServablePayToken(token: string): boolean {
  if (!token || !isValidPayTokenShape(token)) return false;
  if (isRealDataEnvironment() && isDemoPayToken(token)) return false;
  return true;
}

export function isPubliclyPayable(invoice: InvoiceRecord): boolean {
  if (isRealDataEnvironment() && invoice.demo) return false;
  return isInvoiceSendable(invoice.lines);
}

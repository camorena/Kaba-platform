"use client";

import { useAdminI18n } from "@/components/admin/LocaleProvider";
import { useToast } from "@/components/admin/Toast";
import { formatMoney } from "@/lib/admin/format";
import type { InvoiceLine } from "@/lib/db/types";
import {
  centsToInput,
  invoiceLinesTotalCents,
  lineAmountCents,
  MAX_INVOICE_LINES,
  parseMoneyToCents,
  type InvoiceLineInput,
} from "@/lib/invoices/lines";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Row = { key: string; description: string; quantity: string; unit: string };

let rowSeq = 0;
function rowKey(): string {
  rowSeq += 1;
  return `row_${rowSeq}`;
}

function toRows(lines: InvoiceLine[]): Row[] {
  return lines.map((l) => ({
    key: rowKey(),
    description: l.description,
    quantity: String(l.quantity),
    unit: centsToInput(l.unitCents),
  }));
}

function parseRow(r: Row): InvoiceLineInput | null {
  const description = r.description.trim();
  const quantity = Number(r.quantity.replace(",", "."));
  const unitCents = parseMoneyToCents(r.unit);
  if (!description) return null;
  if (!Number.isFinite(quantity) || quantity <= 0) return null;
  if (unitCents === null) return null;
  return { description, quantity, unitCents };
}

/**
 * Editable line items for an invoice (draft/sent, no payments yet).
 * Parent should key this by invoice.updatedAt so a save re-seeds the rows.
 */
export default function InvoiceLinesEditor({
  invoiceId,
  lines,
}: {
  invoiceId: string;
  lines: InvoiceLine[];
}) {
  const { t } = useAdminI18n();
  const toast = useToast();
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>(() => toRows(lines));
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  const parsed = rows.map(parseRow);
  const previewTotal = invoiceLinesTotalCents(
    parsed.filter((p): p is InvoiceLineInput => p !== null),
  );

  function update(key: string, patch: Partial<Row>) {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)));
    setDirty(true);
  }

  function addRow() {
    if (rows.length >= MAX_INVOICE_LINES) return;
    setRows((prev) => [
      ...prev,
      { key: rowKey(), description: "", quantity: "1", unit: "" },
    ]);
    setDirty(true);
  }

  function removeRow(key: string) {
    setRows((prev) => prev.filter((r) => r.key !== key));
    setDirty(true);
  }

  function discard() {
    setRows(toRows(lines));
    setDirty(false);
  }

  async function save() {
    const bad = parsed.findIndex((p) => p === null);
    if (bad >= 0) {
      toast.push({ title: t("detail.linesInvalid", { n: String(bad + 1) }), tone: "error" });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/lines`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines: parsed }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        code?: string;
        index?: number;
      };
      if (!res.ok) {
        let title = t("detail.linesSaveFailed");
        if (data.code === "invoice_not_sendable") title = t("detail.sendBlocked");
        else if (data.code === "invoice_lines_locked") title = t("detail.linesLocked");
        else if (typeof data.index === "number") {
          title = t("detail.linesInvalid", { n: String(data.index + 1) });
        }
        toast.push({ title, tone: "error" });
        return;
      }
      setDirty(false);
      toast.push({ title: t("detail.linesSaved"), tone: "success" });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-3 space-y-3">
      <p className="text-[0.6875rem] leading-relaxed text-muted">
        {t("detail.linesEditHint")}
      </p>
      <div className="overflow-x-auto">
        <table className="admin-table min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-[0.625rem] uppercase tracking-wider text-muted">
              <th className="py-2 pr-3 font-semibold">{t("detail.descriptionCol")}</th>
              <th className="w-20 py-2 pr-3 font-semibold">{t("detail.qty")}</th>
              <th className="w-32 py-2 pr-3 font-semibold">{t("detail.unitPrice")}</th>
              <th className="w-28 py-2 pr-3 font-semibold">{t("detail.amount")}</th>
              <th className="w-10 py-2" aria-label={t("detail.removeLine")} />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-3 text-xs text-muted">
                  {t("detail.linesEmpty")}
                </td>
              </tr>
            ) : (
              rows.map((r, i) => {
                const p = parsed[i];
                return (
                  <tr key={r.key} className="border-b border-ink/5 align-top last:border-0">
                    <td className="py-2 pr-3">
                      <input
                        className="field-input text-sm"
                        value={r.description}
                        maxLength={300}
                        placeholder={t("detail.lineDescPlaceholder")}
                        aria-label={t("detail.descriptionCol")}
                        onChange={(e) => update(r.key, { description: e.target.value })}
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        className="field-input text-sm tabular-nums"
                        inputMode="decimal"
                        value={r.quantity}
                        aria-label={t("detail.qty")}
                        onChange={(e) => update(r.key, { quantity: e.target.value })}
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        className="field-input text-sm tabular-nums"
                        inputMode="decimal"
                        value={r.unit}
                        placeholder="0.00"
                        aria-label={t("detail.unitPrice")}
                        onChange={(e) => update(r.key, { unit: e.target.value })}
                      />
                    </td>
                    <td className="py-2 pr-3 pt-3.5 font-medium tabular-nums text-ink">
                      {p ? formatMoney(lineAmountCents(p)) : "—"}
                    </td>
                    <td className="py-2 pt-2.5">
                      <button
                        type="button"
                        className="admin-chip"
                        aria-label={t("detail.removeLine")}
                        title={t("detail.removeLine")}
                        onClick={() => removeRow(r.key)}
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="btn-secondary-light text-sm"
          disabled={saving || rows.length >= MAX_INVOICE_LINES}
          onClick={addRow}
        >
          {t("detail.addLine")}
        </button>
        <button
          type="button"
          className="btn-primary text-sm disabled:opacity-60"
          disabled={saving || !dirty}
          onClick={() => void save()}
        >
          {saving ? t("common.saving") : t("detail.saveLines")}
        </button>
        {dirty && (
          <button
            type="button"
            className="admin-chip"
            disabled={saving}
            onClick={discard}
          >
            {t("detail.discardLines")}
          </button>
        )}
        <span className="ml-auto text-xs tabular-nums text-muted">
          {dirty
            ? t("detail.linesTotalPreview", { total: formatMoney(previewTotal) })
            : null}
        </span>
      </div>
      {dirty && (
        <p className="text-[0.6875rem] text-amber-700 dark:text-amber-400">
          {t("detail.linesUnsaved")}
        </p>
      )}
    </div>
  );
}

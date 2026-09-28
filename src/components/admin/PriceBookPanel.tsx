"use client";

import EmptyState from "@/components/admin/EmptyState";
import { useToast } from "@/components/admin/Toast";
import { useAdminI18n } from "@/components/admin/LocaleProvider";
import { formatMoney } from "@/lib/admin/format";
import {
  DEFAULT_PRICEBOOK,
  PRICEBOOK_STORAGE_KEY,
  type PriceBookItem,
} from "@/lib/admin/pricebook";
import { useEffect, useMemo, useState } from "react";

function loadItems(): PriceBookItem[] {
  try {
    const raw = localStorage.getItem(PRICEBOOK_STORAGE_KEY);
    if (!raw) return DEFAULT_PRICEBOOK;
    const parsed = JSON.parse(raw) as PriceBookItem[];
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_PRICEBOOK;
    return parsed;
  } catch {
    return DEFAULT_PRICEBOOK;
  }
}

export default function PriceBookPanel() {
  const toast = useToast();
  const { t } = useAdminI18n();
  const [items, setItems] = useState<PriceBookItem[]>([]);
  const [ready, setReady] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftCat, setDraftCat] = useState("Misc");
  const [draftUnit, setDraftUnit] = useState("ea");
  const [draftDollars, setDraftDollars] = useState("100");
  const [qtyById, setQtyById] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setItems(loadItems());
    setReady(true);
  }, []);

  function persist(next: PriceBookItem[]) {
    setItems(next);
    try {
      localStorage.setItem(PRICEBOOK_STORAGE_KEY, JSON.stringify(next));
    } catch {
      toast.push({ title: "Could not save locally", tone: "error" });
    }
  }

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ["all", ...[...set].sort()];
  }, [items]);

  const visible = useMemo(
    () =>
      filter === "all" ? items : items.filter((i) => i.category === filter),
    [items, filter],
  );

  const estimateCents = useMemo(() => {
    return items.reduce((sum, item) => {
      const q = qtyById[item.id] ?? 0;
      return sum + q * item.unitCents;
    }, 0);
  }, [items, qtyById]);

  function addItem() {
    const dollars = Number.parseFloat(draftDollars);
    if (!draftName.trim() || !Number.isFinite(dollars) || dollars < 0) {
      toast.push({ title: "Name and unit price required", tone: "error" });
      return;
    }
    const next: PriceBookItem = {
      id: `pb_${Date.now()}`,
      category: draftCat.trim() || "Misc",
      name: draftName.trim(),
      unit: draftUnit.trim() || "ea",
      unitCents: Math.round(dollars * 100),
    };
    persist([...items, next]);
    setDraftName("");
    toast.push({ title: "Line added", tone: "success" });
  }

  function removeItem(id: string) {
    persist(items.filter((i) => i.id !== id));
    setQtyById((m) => {
      const n = { ...m };
      delete n[id];
      return n;
    });
  }

  function resetDefaults() {
    persist(DEFAULT_PRICEBOOK);
    setQtyById({});
    toast.push({ title: "Restored defaults", tone: "info" });
  }

  if (!ready) {
    return (
      <div className="admin-skeleton h-40 w-full rounded-xl" aria-hidden />
    );
  }

  return (
    <div className="space-y-4">
      <div className="admin-glass-panel admin-gold-rail flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:justify-between sm:p-5">
        <div>
          <p className="admin-card-title">{t("pricebook.estimate")}</p>
          <p className="mt-1 text-xs text-muted">
            Set quantities — totals stay on this device (localStorage).
          </p>
          <p className="mt-2 font-display text-2xl font-semibold tabular-nums text-ink">
            {formatMoney(estimateCents)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="admin-chip"
            onClick={() => setQtyById({})}
          >
            Clear qty
          </button>
          <button type="button" className="admin-chip" onClick={resetDefaults}>
            Reset defaults
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            className={`admin-chip capitalize ${filter === c ? "admin-chip-active" : ""}`}
          >
            {c}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title="No lines in this category"
          description={t("pricebook.emptyDesc")}
        />
      ) : (
        <div className="admin-table-wrap admin-gold-rail overflow-hidden rounded-xl border border-[color:var(--admin-border)] bg-[var(--admin-panel)]">
          <div className="overflow-x-auto">
            <table className="admin-table min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[color:var(--admin-border)]">
                  <th className="px-3 py-2.5 font-semibold sm:px-4">Item</th>
                  <th className="px-3 py-2.5 font-semibold sm:px-4">Unit</th>
                  <th className="px-3 py-2.5 font-semibold sm:px-4">Rate</th>
                  <th className="px-3 py-2.5 font-semibold sm:px-4">Qty</th>
                  <th className="px-3 py-2.5 font-semibold sm:px-4">Line</th>
                  <th className="px-3 py-2.5 font-semibold sm:px-4">
                    <span className="sr-only">{t("pricebook.remove")}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => {
                  const qty = qtyById[item.id] ?? 0;
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-ink/5 last:border-0 hover:bg-[var(--admin-row-hover)]"
                    >
                      <td className="px-3 py-2.5 sm:px-4">
                        <div className="font-semibold text-ink">{item.name}</div>
                        <div className="text-[0.625rem] uppercase tracking-wide text-muted">
                          {item.category}
                          {item.notes ? ` · ${item.notes}` : ""}
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-muted sm:px-4">
                        {item.unit}
                      </td>
                      <td className="px-3 py-2.5 tabular-nums text-ink sm:px-4">
                        {formatMoney(item.unitCents)}
                      </td>
                      <td className="px-3 py-2.5 sm:px-4">
                        <input
                          type="number"
                          min={0}
                          step={1}
                          value={qty}
                          onChange={(e) =>
                            setQtyById((m) => ({
                              ...m,
                              [item.id]: Math.max(
                                0,
                                Number.parseInt(e.target.value || "0", 10) || 0,
                              ),
                            }))
                          }
                          className="field-input !mt-0 w-20 py-1 text-sm"
                          aria-label={`Quantity for ${item.name}`}
                        />
                      </td>
                      <td className="px-3 py-2.5 font-medium tabular-nums text-ink sm:px-4">
                        {formatMoney(qty * item.unitCents)}
                      </td>
                      <td className="px-3 py-2.5 sm:px-4">
                        <button
                          type="button"
                          className="text-xs font-semibold text-muted hover:text-danger"
                          onClick={() => removeItem(item.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <section className="admin-card">
        <h2 className="admin-card-title">{t("pricebook.addCustom")}</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          <input
            className="field-input !mt-0 text-sm lg:col-span-2"
            placeholder={t("pricebook.namePh")}
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
          />
          <input
            className="field-input !mt-0 text-sm"
            placeholder={t("pricebook.categoryPh")}
            value={draftCat}
            onChange={(e) => setDraftCat(e.target.value)}
          />
          <input
            className="field-input !mt-0 text-sm"
            placeholder={t("pricebook.unitPh")}
            value={draftUnit}
            onChange={(e) => setDraftUnit(e.target.value)}
          />
          <input
            className="field-input !mt-0 text-sm"
            placeholder={t("pricebook.unitPricePh")}
            type="number"
            min={0}
            step={0.01}
            value={draftDollars}
            onChange={(e) => setDraftDollars(e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={addItem}
          className="btn-primary mt-3 text-sm"
        >
          Add to price book
        </button>
      </section>
    </div>
  );
}

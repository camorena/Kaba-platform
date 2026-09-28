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

function filterClass(active: boolean): string {
  return `admin-touch rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
    active
      ? "bg-bronze/12 text-bronze-dark dark:text-bronze-light"
      : "text-muted hover:bg-[var(--admin-panel)] hover:text-ink"
  }`;
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
  const [query, setQuery] = useState("");

  useEffect(() => {
    setItems(loadItems());
    setReady(true);
  }, []);

  function persist(next: PriceBookItem[]) {
    setItems(next);
    try {
      localStorage.setItem(PRICEBOOK_STORAGE_KEY, JSON.stringify(next));
    } catch {
      toast.push({ title: t("pricebook.saveLocalFailed"), tone: "error" });
    }
  }

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ["all", ...[...set].sort()];
  }, [items]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: items.length };
    for (const i of items) counts[i.category] = (counts[i.category] ?? 0) + 1;
    return counts;
  }, [items]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (filter !== "all" && i.category !== filter) return false;
      if (!q) return true;
      const hay = [i.name, i.category, i.unit, i.notes ?? ""]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [items, filter, query]);

  const estimateCents = useMemo(() => {
    return items.reduce((sum, item) => {
      const q = qtyById[item.id] ?? 0;
      return sum + q * item.unitCents;
    }, 0);
  }, [items, qtyById]);

  function addItem() {
    const dollars = Number.parseFloat(draftDollars);
    if (!draftName.trim() || !Number.isFinite(dollars) || dollars < 0) {
      toast.push({ title: t("pricebook.namePriceRequired"), tone: "error" });
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
    toast.push({ title: t("pricebook.lineAdded"), tone: "success" });
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
    toast.push({ title: t("pricebook.restoredDefaults"), tone: "info" });
  }

  function clearFilters() {
    setFilter("all");
    setQuery("");
  }

  if (!ready) {
    return (
      <div className="admin-skeleton h-40 w-full rounded-xl" aria-hidden />
    );
  }

  return (
    <div className="space-y-4">
      <div className="admin-glass-panel flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:justify-between sm:p-5">
        <div>
          <p className="admin-card-title">{t("pricebook.estimate")}</p>
          <p className="mt-1 text-xs text-muted">{t("pricebook.estimateHint")}</p>
          <p className="mt-2 font-display text-2xl font-semibold tabular-nums text-ink">
            {formatMoney(estimateCents)}
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            className={filterClass(false)}
            onClick={() => setQtyById({})}
          >
            {t("pricebook.clearQty")}
          </button>
          <button type="button" className={filterClass(false)} onClick={resetDefaults}>
            {t("pricebook.resetDefaults")}
          </button>
        </div>
      </div>

      <div className="admin-toolbar flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className={`${filterClass(filter === c)} capitalize`}
              aria-pressed={filter === c}
            >
              {c === "all" ? t("common.all") : c} ({categoryCounts[c] ?? 0})
            </button>
          ))}
        </div>
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <label htmlFor="pricebook-search" className="sr-only">
            {t("pricebook.searchLabel")}
          </label>
          <input
            id="pricebook-search"
            type="search"
            placeholder={t("pricebook.searchPlaceholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="field-input !mt-0 w-full py-2 text-sm"
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title={
            items.length === 0
              ? t("pricebook.emptyTitle")
              : filter !== "all" && !query
                ? t("pricebook.emptyCategory")
                : t("common.noMatches")
          }
          description={
            items.length === 0
              ? t("pricebook.emptyDesc")
              : t("common.noMatchesDesc")
          }
          action={
            filter !== "all" || query ? (
              <button
                type="button"
                className="btn-secondary-light admin-touch text-sm"
                onClick={clearFilters}
              >
                {t("common.clearFilters")}
              </button>
            ) : undefined
          }
        />
      ) : (
        <>
          <ul className="admin-card-list space-y-2.5 md:hidden">
            {visible.map((item) => {
              const qty = qtyById[item.id] ?? 0;
              return (
                <li key={item.id} className="admin-mobile-card">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-ink">{item.name}</p>
                      <p className="mt-0.5 text-[0.6875rem] text-muted">
                        <span className="admin-settings-chip">{item.category}</span>
                        {item.notes ? (
                          <span className="ml-1.5">{item.notes}</span>
                        ) : null}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="admin-touch shrink-0 text-xs font-medium text-muted hover:text-danger"
                      onClick={() => removeItem(item.id)}
                    >
                      {t("pricebook.remove")}
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                    <div className="text-sm">
                      <p className="text-muted">
                        {formatMoney(item.unitCents)} / {item.unit}
                      </p>
                      <p className="mt-0.5 font-medium tabular-nums text-ink">
                        {formatMoney(qty * item.unitCents)}
                      </p>
                    </div>
                    <label className="block">
                      <span className="admin-section-label">
                        {t("pricebook.colQty")}
                      </span>
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
                        className="field-input !mt-1 w-24 py-2 text-sm"
                        aria-label={t("pricebook.qtyFor", { name: item.name })}
                      />
                    </label>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="admin-table-wrap hidden overflow-hidden rounded-xl border border-[color:var(--admin-border)] bg-[var(--admin-panel)] md:block">
            <div className="overflow-x-auto">
              <table className="admin-table min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-ink/10 text-[0.625rem] uppercase tracking-wider text-muted">
                    <th className="px-3 py-2.5 font-semibold sm:px-4">
                      {t("pricebook.colItem")}
                    </th>
                    <th className="px-3 py-2.5 font-semibold sm:px-4">
                      {t("pricebook.colUnit")}
                    </th>
                    <th className="px-3 py-2.5 font-semibold sm:px-4">
                      {t("pricebook.colRate")}
                    </th>
                    <th className="px-3 py-2.5 font-semibold sm:px-4">
                      {t("pricebook.colQty")}
                    </th>
                    <th className="px-3 py-2.5 font-semibold sm:px-4">
                      {t("pricebook.colLine")}
                    </th>
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
                          <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[0.6875rem] text-muted">
                            <span className="admin-settings-chip">
                              {item.category}
                            </span>
                            {item.notes ? <span>{item.notes}</span> : null}
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
                            aria-label={t("pricebook.qtyFor", { name: item.name })}
                          />
                        </td>
                        <td className="px-3 py-2.5 font-medium tabular-nums text-ink sm:px-4">
                          {formatMoney(qty * item.unitCents)}
                        </td>
                        <td className="px-3 py-2.5 sm:px-4">
                          <button
                            type="button"
                            className="text-xs font-medium text-muted hover:text-danger"
                            onClick={() => removeItem(item.id)}
                          >
                            {t("pricebook.remove")}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <section className="admin-glass-panel p-4 sm:p-5">
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
          className="btn-primary admin-touch mt-3 text-sm"
        >
          {t("pricebook.addToBook")}
        </button>
      </section>
    </div>
  );
}

/**
 * Public highlight stats ("Años de experiencia", …) — owner-entered only.
 * Shown publicly only when visible AND set (manual value, or auto > 0).
 */

export const HIGHLIGHT_AUTO_SOURCES = ["customers_count"] as const;
export type HighlightAutoSource = (typeof HIGHLIGHT_AUTO_SOURCES)[number];
export const MAX_HIGHLIGHT_STATS = 6;

export type HighlightStatRecord = {
  id: string;
  label: string;
  value: string;
  visible: boolean;
  autoSource: HighlightAutoSource | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type HighlightStatInput = Pick<
  HighlightStatRecord,
  "label" | "value" | "visible" | "autoSource" | "sortOrder"
>;
export type HighlightStatPatch = Partial<HighlightStatInput>;

export type PublicHighlightStat = { id: string; label: string; value: string };

export type HighlightField = "label" | "value" | "visible" | "autoSource" | "sortOrder";

export function validateHighlight(
  raw: unknown,
  opts: { partial: boolean },
): { ok: true; value: HighlightStatPatch } | { ok: false; field: HighlightField } {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const has = (k: string) => Object.prototype.hasOwnProperty.call(r, k);
  const out: HighlightStatPatch = {};
  if (!opts.partial || has("label")) {
    const v = typeof r.label === "string" ? r.label.trim().replace(/\s+/g, " ") : "";
    if (!v || v.length > 60) return { ok: false, field: "label" };
    out.label = v;
  }
  if (!opts.partial || has("value")) {
    const v = r.value == null ? "" : typeof r.value === "string" ? r.value.trim() : null;
    if (v === null || v.length > 20) return { ok: false, field: "value" };
    out.value = v;
  }
  if (!opts.partial || has("visible")) {
    const v = r.visible ?? (opts.partial ? undefined : false);
    if (typeof v !== "boolean") return { ok: false, field: "visible" };
    out.visible = v;
  }
  if (!opts.partial || has("autoSource")) {
    const v = r.autoSource == null || r.autoSource === "" ? null : r.autoSource;
    if (v !== null && !(HIGHLIGHT_AUTO_SOURCES as readonly unknown[]).includes(v)) {
      return { ok: false, field: "autoSource" };
    }
    out.autoSource = v as HighlightAutoSource | null;
  }
  if (!opts.partial || has("sortOrder")) {
    const v = r.sortOrder == null ? 0 : Number(r.sortOrder);
    if (!Number.isInteger(v) || v < 0 || v > 99) return { ok: false, field: "sortOrder" };
    out.sortOrder = v;
  }
  return { ok: true, value: out };
}

/** Resolve what the public site may show. Never falls back to defaults. */
export function resolvePublicHighlights(
  stats: ReadonlyArray<HighlightStatRecord>,
  auto: { customersCount: number },
): PublicHighlightStat[] {
  const out: PublicHighlightStat[] = [];
  for (const s of [...stats].sort((a, b) => a.sortOrder - b.sortOrder)) {
    if (!s.visible || !s.label.trim()) continue;
    let value = s.value.trim();
    if (s.autoSource === "customers_count") {
      value = auto.customersCount > 0 ? auto.customersCount.toLocaleString("en-US") : "";
    }
    if (!value) continue;
    out.push({ id: s.id, label: s.label.trim(), value });
  }
  return out;
}

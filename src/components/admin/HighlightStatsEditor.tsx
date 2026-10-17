"use client";

import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useAdminI18n } from "@/components/admin/LocaleProvider";
import { useToast } from "@/components/admin/Toast";
import {
  MAX_HIGHLIGHT_STATS,
  resolvePublicHighlights,
  type HighlightStatRecord,
} from "@/lib/stats/highlights";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Draft = {
  label: string;
  value: string;
  visible: boolean;
  auto: boolean;
  sortOrder: string;
};

function toDraft(s?: HighlightStatRecord, nextOrder = 0): Draft {
  return {
    label: s?.label ?? "",
    value: s?.value ?? "",
    visible: s?.visible ?? false,
    auto: s?.autoSource === "customers_count",
    sortOrder: String(s?.sortOrder ?? nextOrder),
  };
}

function HighlightRow({
  stat,
  customersCount,
  nextOrder,
  onDone,
}: {
  stat?: HighlightStatRecord;
  customersCount: number;
  nextOrder: number;
  onDone: () => void;
}) {
  const { t } = useAdminI18n();
  const toast = useToast();
  const router = useRouter();
  const [d, setD] = useState<Draft>(() => toDraft(stat, nextOrder));
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const dirty = JSON.stringify(d) !== JSON.stringify(toDraft(stat, nextOrder));

  const preview = resolvePublicHighlights(
    [
      {
        id: "p",
        label: d.label,
        value: d.value,
        visible: d.visible,
        autoSource: d.auto ? "customers_count" : null,
        sortOrder: 0,
        createdAt: "",
        updatedAt: "",
      },
    ],
    { customersCount },
  )[0];
  const status = !d.visible
    ? t("highlights.statusHidden")
    : preview
      ? t("highlights.statusShown")
      : t("highlights.statusMissing");

  async function save() {
    setBusy(true);
    try {
      const res = await fetch(
        stat ? `/api/admin/highlight-stats/${encodeURIComponent(stat.id)}` : "/api/admin/highlight-stats",
        {
          method: stat ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            label: d.label,
            value: d.auto ? "" : d.value,
            visible: d.visible,
            autoSource: d.auto ? "customers_count" : null,
            sortOrder: Number(d.sortOrder) || 0,
          }),
        },
      );
      const data = (await res.json().catch(() => ({}))) as { code?: string };
      if (!res.ok) {
        toast.push({
          title:
            data.code === "limit"
              ? t("highlights.limit", { max: String(MAX_HIGHLIGHT_STATS) })
              : t("highlights.failed"),
          tone: "error",
        });
        return;
      }
      toast.push({ title: t("highlights.saved"), tone: "success" });
      onDone();
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!stat) {
      onDone();
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/highlight-stats/${encodeURIComponent(stat.id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        toast.push({ title: t("highlights.failed"), tone: "error" });
        return;
      }
      toast.push({ title: t("highlights.deleted"), tone: "success" });
      router.refresh();
    } finally {
      setBusy(false);
      setConfirm(false);
    }
  }

  return (
    <li className="rounded-xl border border-ink/8 bg-[var(--admin-panel)]/60 p-3 sm:p-4">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1.6fr)_minmax(0,0.8fr)_5rem]">
        <label className="block text-xs font-semibold text-ink">
          {t("highlights.labelField")}
          <input
            className="field-input mt-1 text-sm"
            value={d.label}
            maxLength={60}
            placeholder={t("highlights.labelPlaceholder")}
            onChange={(e) => setD({ ...d, label: e.target.value })}
          />
        </label>
        <label className="block text-xs font-semibold text-ink">
          {t("highlights.valueField")}
          <input
            className="field-input mt-1 text-sm tabular-nums disabled:opacity-60"
            value={d.auto ? (customersCount ? customersCount.toLocaleString("en-US") : "") : d.value}
            maxLength={20}
            disabled={d.auto}
            placeholder={t("highlights.valuePlaceholder")}
            onChange={(e) => setD({ ...d, value: e.target.value })}
          />
        </label>
        <label className="block text-xs font-semibold text-ink">
          {t("highlights.order")}
          <input
            className="field-input mt-1 text-sm tabular-nums"
            inputMode="numeric"
            value={d.sortOrder}
            onChange={(e) => setD({ ...d, sortOrder: e.target.value.replace(/[^0-9]/g, "").slice(0, 2) })}
          />
        </label>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
        <label className="inline-flex items-center gap-2 text-ink">
          <input
            type="checkbox"
            checked={d.visible}
            onChange={(e) => setD({ ...d, visible: e.target.checked })}
          />
          {t("highlights.visible")}
        </label>
        <label className="inline-flex items-center gap-2 text-ink" title={t("highlights.autoHint")}>
          <input
            type="checkbox"
            checked={d.auto}
            onChange={(e) => setD({ ...d, auto: e.target.checked })}
          />
          {t("highlights.auto", { count: customersCount.toLocaleString("en-US") })}
        </label>
        <span
          className={`admin-settings-chip ${preview && d.visible ? "" : "admin-settings-chip-warn"}`}
        >
          {status}
        </span>
        <span className="ml-auto flex gap-2">
          <button
            type="button"
            className="admin-chip"
            disabled={busy}
            onClick={() => (stat ? setConfirm(true) : onDone())}
          >
            {stat ? t("highlights.remove") : t("reviews.cancel")}
          </button>
          <button
            type="button"
            className="btn-primary text-xs disabled:opacity-60"
            disabled={busy || (!dirty && Boolean(stat)) || !d.label.trim()}
            onClick={() => void save()}
          >
            {busy ? t("common.saving") : t("highlights.save")}
          </button>
        </span>
      </div>
      <ConfirmDialog
        open={confirm}
        title={t("highlights.removeTitle")}
        description={t("highlights.removeDesc")}
        confirmLabel={t("highlights.remove")}
        busy={busy}
        onCancel={() => setConfirm(false)}
        onConfirm={() => void remove()}
      />
    </li>
  );
}

export default function HighlightStatsEditor({
  stats,
  customersCount,
}: {
  stats: HighlightStatRecord[];
  customersCount: number;
}) {
  const { t } = useAdminI18n();
  const [adding, setAdding] = useState(false);
  const canAdd = stats.length < MAX_HIGHLIGHT_STATS && !adding;
  const nextOrder = stats.reduce((m, s) => Math.max(m, s.sortOrder + 1), 0);

  return (
    <section className="admin-glass-panel admin-gold-rail p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="admin-card-title">{t("highlights.title")}</h2>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted">{t("highlights.subtitle")}</p>
        </div>
        <button
          type="button"
          className="btn-secondary-light shrink-0 text-sm disabled:opacity-50"
          disabled={!canAdd}
          title={stats.length >= MAX_HIGHLIGHT_STATS ? t("highlights.limit", { max: String(MAX_HIGHLIGHT_STATS) }) : undefined}
          onClick={() => setAdding(true)}
        >
          {t("highlights.add")}
        </button>
      </div>
      {stats.length === 0 && !adding ? (
        <p className="rounded-lg border border-dashed border-ink/12 px-4 py-6 text-center text-xs text-muted">
          {t("highlights.empty")}
        </p>
      ) : (
        <ul className="space-y-2.5">
          {stats.map((s) => (
            <HighlightRow
              key={`${s.id}:${s.updatedAt}`}
              stat={s}
              customersCount={customersCount}
              nextOrder={nextOrder}
              onDone={() => undefined}
            />
          ))}
          {adding ? (
            <HighlightRow
              customersCount={customersCount}
              nextOrder={nextOrder}
              onDone={() => setAdding(false)}
            />
          ) : null}
        </ul>
      )}
    </section>
  );
}

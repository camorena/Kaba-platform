"use client";

import ConfirmDialog from "@/components/admin/ConfirmDialog";
import EmptyState from "@/components/admin/EmptyState";
import { useAdminI18n } from "@/components/admin/LocaleProvider";
import {
  CHART_COLORS,
  ChartCard,
  ChartEmpty,
  formatMonthKey,
  HBarList,
  KpiTile,
  LineSeries,
} from "@/components/admin/StatsCharts";
import { useToast } from "@/components/admin/Toast";
import {
  averageRating,
  REVIEW_LIMITS,
  REVIEW_SOURCES,
  type ReviewRecord,
  type ReviewSource,
} from "@/lib/reviews/model";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useState } from "react";

export type ReviewCustomerOption = { id: string; name: string };

type StatusFilter = "all" | "published" | "draft" | "featured";

const SOURCE_KEY: Record<ReviewSource, string> = {
  google: "reviews.srcGoogle",
  nextdoor: "reviews.srcNextdoor",
  facebook: "reviews.srcFacebook",
  direct: "reviews.srcDirect",
  other: "reviews.srcOther",
};

const SOURCE_COLOR: Record<ReviewSource, string> = {
  google: CHART_COLORS.navy,
  nextdoor: CHART_COLORS.emerald,
  facebook: "#3b5b99",
  direct: CHART_COLORS.bronze,
  other: CHART_COLORS.slate,
};

function Stars({ value, size = "text-sm" }: { value: number; size?: string }) {
  return (
    <span className={`${size} tracking-[0.08em]`} aria-hidden>
      <span className="text-bronze">{"★".repeat(value)}</span>
      <span className="text-ink/15 dark:text-white/20">{"★".repeat(5 - value)}</span>
    </span>
  );
}

function todayYmd(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

type FormState = {
  customerName: string;
  city: string;
  rating: number;
  body: string;
  source: ReviewSource;
  sourceUrl: string;
  reviewDate: string;
  customerId: string;
  published: boolean;
  featured: boolean;
};

function toForm(r?: ReviewRecord): FormState {
  return {
    customerName: r?.customerName ?? "",
    city: r?.city ?? "",
    rating: r?.rating ?? 5,
    body: r?.body ?? "",
    source: r?.source ?? "google",
    sourceUrl: r?.sourceUrl ?? "",
    reviewDate: r?.reviewDate ?? todayYmd(),
    customerId: r?.customerId ?? "",
    published: r?.published ?? false,
    featured: r?.featured ?? false,
  };
}

function ReviewFormDialog({
  review,
  customers,
  onClose,
}: {
  review?: ReviewRecord;
  customers: ReviewCustomerOption[];
  onClose: () => void;
}) {
  const { t } = useAdminI18n();
  const toast = useToast();
  const router = useRouter();
  const titleId = useId();
  const [f, setF] = useState<FormState>(() => toForm(review));
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch(
        review ? `/api/admin/reviews/${encodeURIComponent(review.id)}` : "/api/admin/reviews",
        {
          method: review ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...f,
            sourceUrl: f.sourceUrl.trim() || null,
            customerId: f.customerId || null,
          }),
        },
      );
      const data = (await res.json().catch(() => ({}))) as { field?: string };
      if (!res.ok) {
        toast.push({
          title: data.field
            ? t("reviews.invalid", { field: t(`reviews.${data.field}`) })
            : t("reviews.failed"),
          tone: "error",
        });
        return;
      }
      toast.push({ title: t("reviews.saved"), tone: "success" });
      onClose();
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  const label = "block text-xs font-semibold text-ink";
  return (
    <div className="admin-cmd-root" role="presentation">
      <button type="button" className="admin-cmd-backdrop" aria-label={t("reviews.cancel")} onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="admin-cmd-panel max-h-[calc(100dvh-2rem)] w-[min(40rem,calc(100vw-1.5rem))] overflow-y-auto"
      >
        <div className="admin-cmd-rail" aria-hidden />
        <form onSubmit={(e) => void submit(e)} className="space-y-3.5 px-4 py-4 sm:px-5">
          <h2 id={titleId} className="font-display text-lg font-semibold tracking-tight text-ink">
            {review ? t("reviews.edit") : t("reviews.add")}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className={label}>
              {t("reviews.customerName")}
              <input
                required
                className="field-input mt-1 text-sm"
                maxLength={REVIEW_LIMITS.name}
                value={f.customerName}
                placeholder={t("reviews.namePlaceholder")}
                onChange={(e) => setF({ ...f, customerName: e.target.value })}
              />
              <span className="mt-1 block font-normal text-muted">{t("reviews.nameHint")}</span>
            </label>
            <label className={label}>
              {t("reviews.city")}
              <input
                className="field-input mt-1 text-sm"
                maxLength={REVIEW_LIMITS.city}
                value={f.city}
                placeholder={t("reviews.cityPlaceholder")}
                onChange={(e) => setF({ ...f, city: e.target.value })}
              />
            </label>
          </div>
          <fieldset>
            <legend className={label}>{t("reviews.rating")}</legend>
            <div className="mt-1 flex gap-1" role="radiogroup">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={f.rating === n}
                  aria-label={n === 1 ? t("reviews.star1") : t("reviews.stars", { n: String(n) })}
                  className={`h-9 w-9 rounded-lg border text-lg leading-none transition ${
                    n <= f.rating
                      ? "border-bronze/40 bg-bronze/10 text-bronze"
                      : "border-ink/10 text-ink/25 dark:text-white/25"
                  }`}
                  onClick={() => setF({ ...f, rating: n })}
                >
                  ★
                </button>
              ))}
            </div>
          </fieldset>
          <label className={label}>
            {t("reviews.body")}
            <textarea
              required
              rows={4}
              className="field-input mt-1 text-sm"
              maxLength={REVIEW_LIMITS.body}
              value={f.body}
              onChange={(e) => setF({ ...f, body: e.target.value })}
            />
            <span className="mt-1 flex justify-between font-normal text-muted">
              <span>{t("reviews.bodyHint")}</span>
              <span className="tabular-nums">{f.body.length}/{REVIEW_LIMITS.body}</span>
            </span>
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className={label}>
              {t("reviews.source")}
              <select
                className="field-input mt-1 text-sm"
                value={f.source}
                onChange={(e) => setF({ ...f, source: e.target.value as ReviewSource })}
              >
                {REVIEW_SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {t(SOURCE_KEY[s])}
                  </option>
                ))}
              </select>
            </label>
            <label className={label}>
              {t("reviews.reviewDate")}
              <input
                type="date"
                required
                className="field-input mt-1 text-sm"
                value={f.reviewDate}
                max={todayYmd()}
                onChange={(e) => setF({ ...f, reviewDate: e.target.value })}
              />
            </label>
          </div>
          <label className={label}>
            {t("reviews.sourceUrl")}
            <input
              type="url"
              className="field-input mt-1 text-sm"
              maxLength={REVIEW_LIMITS.url}
              value={f.sourceUrl}
              placeholder="https://"
              onChange={(e) => setF({ ...f, sourceUrl: e.target.value })}
            />
          </label>
          <label className={label}>
            {t("reviews.customerId")}
            <select
              className="field-input mt-1 text-sm"
              value={f.customerId}
              onChange={(e) => setF({ ...f, customerId: e.target.value })}
            >
              <option value="">{t("reviews.noCustomer")}</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <div className="space-y-2 rounded-lg bg-ink/[0.03] p-3 text-sm dark:bg-white/[0.04]">
            <label className="flex items-center gap-2 text-ink">
              <input
                type="checkbox"
                checked={f.published}
                onChange={(e) => setF({ ...f, published: e.target.checked })}
              />
              {t("reviews.published")}
            </label>
            <label className="flex items-center gap-2 text-ink">
              <input
                type="checkbox"
                checked={f.featured}
                onChange={(e) => setF({ ...f, featured: e.target.checked })}
              />
              {t("reviews.featured")}
            </label>
            <p className="text-[0.6875rem] text-muted">{t("reviews.featuredHint")}</p>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" className="btn-secondary-light text-sm" onClick={onClose} disabled={busy}>
              {t("reviews.cancel")}
            </button>
            <button type="submit" className="btn-primary text-sm disabled:opacity-60" disabled={busy}>
              {busy ? t("common.saving") : t("reviews.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function lastMonths(n: number): string[] {
  const now = new Date();
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getFullYear(), now.getMonth() - i, 1));
    out.push(`${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`);
  }
  return out;
}

export default function ReviewsManager({
  reviews,
  customers,
}: {
  reviews: ReviewRecord[];
  customers: ReviewCustomerOption[];
}) {
  const { t, locale } = useAdminI18n();
  const toast = useToast();
  const router = useRouter();
  const [status, setStatus] = useState<StatusFilter>("all");
  const [source, setSource] = useState<"all" | ReviewSource>("all");
  const [rating, setRating] = useState<"all" | string>("all");
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<ReviewRecord | "new" | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ReviewRecord | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return reviews.filter((r) => {
      if (status === "published" && !r.published) return false;
      if (status === "draft" && r.published) return false;
      if (status === "featured" && !r.featured) return false;
      if (source !== "all" && r.source !== source) return false;
      if (rating !== "all" && r.rating !== Number(rating)) return false;
      if (needle) {
        const hay = `${r.customerName} ${r.city} ${r.body}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [reviews, status, source, rating, q]);

  const avg = averageRating(filtered);
  const fmtAvg = (n: number) =>
    n.toLocaleString(locale === "es" ? "es-CO" : "en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });

  const months = lastMonths(12);
  const monthly = months.map((m) => {
    const inMonth = filtered.filter((r) => r.reviewDate.startsWith(m));
    return inMonth.length ? averageRating(inMonth) : null;
  });

  async function patch(r: ReviewRecord, body: Partial<ReviewRecord>) {
    setBusyId(r.id);
    try {
      const res = await fetch(`/api/admin/reviews/${encodeURIComponent(r.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      toast.push({
        title: res.ok ? t("reviews.saved") : t("reviews.failed"),
        tone: res.ok ? "success" : "error",
      });
      if (res.ok) router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function remove(r: ReviewRecord) {
    setBusyId(r.id);
    try {
      const res = await fetch(`/api/admin/reviews/${encodeURIComponent(r.id)}`, { method: "DELETE" });
      toast.push({
        title: res.ok ? t("reviews.deleted") : t("reviews.failed"),
        tone: res.ok ? "success" : "error",
      });
      if (res.ok) router.refresh();
    } finally {
      setBusyId(null);
      setConfirmDelete(null);
    }
  }

  const statusChips: { key: StatusFilter; label: string }[] = [
    { key: "all", label: t("reviews.filterAll") },
    { key: "published", label: t("reviews.filterPublished") },
    { key: "draft", label: t("reviews.filterDraft") },
    { key: "featured", label: t("reviews.filterFeatured") },
  ];

  const addButton = (
    <button type="button" className="btn-primary shrink-0 whitespace-nowrap text-sm" onClick={() => setEditing("new")}>
      {t("reviews.add")}
    </button>
  );

  return (
    <div className="space-y-4">
      <ul className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiTile label={t("reviews.kpiTotal")} value={String(reviews.length)} />
        <KpiTile label={t("reviews.kpiPublished")} value={String(reviews.filter((r) => r.published).length)} />
        <KpiTile
          label={t("reviews.kpiAverage")}
          value={avg === null ? "—" : `${fmtAvg(avg)} / 5`}
          hint={avg === null ? undefined : t("reviews.kpiAverageHint", { count: String(filtered.length) })}
        />
        <KpiTile
          label={t("reviews.kpiFeatured")}
          value={String(reviews.filter((r) => r.featured && r.published).length)}
        />
      </ul>

      {reviews.length === 0 ? (
        <EmptyState title={t("reviews.emptyTitle")} description={t("reviews.emptyBody")} action={addButton} />
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-3">
            <ChartCard title={t("reviews.ratingDist")} subtitle={t("reviews.ratingDistSub")}>
              {filtered.length ? (
                <HBarList
                  ariaLabel={t("reviews.ratingDist")}
                  labelHead={t("reviews.ratingCol")}
                  valueHead={t("reviews.reviewsCol")}
                  items={[5, 4, 3, 2, 1].map((n) => ({
                    label: n === 1 ? t("reviews.star1") : t("reviews.stars", { n: String(n) }),
                    value: filtered.filter((r) => r.rating === n).length,
                    color: n >= 4 ? CHART_COLORS.bronze : n === 3 ? CHART_COLORS.sand : CHART_COLORS.slate,
                  }))}
                />
              ) : (
                <ChartEmpty>{t("reviews.noMatch")}</ChartEmpty>
              )}
            </ChartCard>
            <ChartCard title={t("reviews.avgOverTime")} subtitle={t("reviews.avgOverTimeSub")}>
              {monthly.some((v) => v !== null) ? (
                <LineSeries
                  labels={months.map((m) => formatMonthKey(m, locale))}
                  values={monthly}
                  min={1}
                  max={5}
                  format={(n) => fmtAvg(n)}
                  ariaLabel={t("reviews.avgOverTime")}
                  size="compact"
                  periodHead={t("stats.monthCol")}
                  valueHead={t("reviews.averageCol")}
                />
              ) : (
                <ChartEmpty>{t("reviews.noMatch")}</ChartEmpty>
              )}
            </ChartCard>
            <ChartCard title={t("reviews.bySource")} subtitle={t("reviews.bySourceSub")}>
              {filtered.length ? (
                <HBarList
                  ariaLabel={t("reviews.bySource")}
                  labelHead={t("reviews.source")}
                  valueHead={t("reviews.reviewsCol")}
                  items={REVIEW_SOURCES.map((s) => ({
                    label: t(SOURCE_KEY[s]),
                    value: filtered.filter((r) => r.source === s).length,
                    color: SOURCE_COLOR[s],
                  })).filter((i) => i.value > 0)}
                />
              ) : (
                <ChartEmpty>{t("reviews.noMatch")}</ChartEmpty>
              )}
            </ChartCard>
          </div>

          <div className="admin-toolbar flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-1.5" role="group">
              {statusChips.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  aria-pressed={status === c.key}
                  className={`admin-chip admin-touch ${status === c.key ? "admin-chip-active" : ""}`}
                  onClick={() => setStatus(c.key)}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                type="search"
                className="field-input !mt-0 py-2 text-sm sm:w-64"
                placeholder={t("reviews.search")}
                aria-label={t("reviews.search")}
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <select
                className="field-input !mt-0 py-2 text-sm"
                aria-label={t("reviews.source")}
                value={source}
                onChange={(e) => setSource(e.target.value as "all" | ReviewSource)}
              >
                <option value="all">{t("reviews.allSources")}</option>
                {REVIEW_SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {t(SOURCE_KEY[s])}
                  </option>
                ))}
              </select>
              <select
                className="field-input !mt-0 py-2 text-sm"
                aria-label={t("reviews.rating")}
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option value="all">{t("reviews.allRatings")}</option>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={String(n)}>
                    {n === 1 ? t("reviews.star1") : t("reviews.stars", { n: String(n) })}
                  </option>
                ))}
              </select>
              {addButton}
            </div>
          </div>

          {filtered.length === 0 ? (
            <ChartEmpty>{t("reviews.noMatch")}</ChartEmpty>
          ) : (
            <ul className="grid gap-3 md:grid-cols-2">
              {filtered.map((r) => (
                <li key={r.id} className="admin-card flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">
                        {r.customerName}
                        {r.city ? <span className="font-normal text-muted"> · {r.city}</span> : null}
                      </p>
                      <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted">
                        <Stars value={r.rating} />
                        <span className="sr-only">
                          {r.rating === 1 ? t("reviews.star1") : t("reviews.stars", { n: String(r.rating) })}
                        </span>
                        <span>{t(SOURCE_KEY[r.source])}</span>
                        <span aria-hidden>·</span>
                        <time dateTime={r.reviewDate}>
                          {new Date(`${r.reviewDate}T12:00:00Z`).toLocaleDateString(
                            locale === "es" ? "es-CO" : "en-US",
                            { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" },
                          )}
                        </time>
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-wrap justify-end gap-1">
                      <span
                        className={`admin-settings-chip ${r.published ? "" : "admin-settings-chip-warn"}`}
                      >
                        {r.published ? t("reviews.publishedBadge") : t("reviews.draftBadge")}
                      </span>
                      {r.featured ? (
                        <span className="admin-settings-chip">{t("reviews.featuredBadge")}</span>
                      ) : null}
                    </div>
                  </div>
                  <p className="line-clamp-4 text-sm leading-relaxed text-muted">{r.body}</p>
                  <div className="mt-auto flex flex-wrap items-center gap-1.5 border-t border-ink/6 pt-3">
                    <button
                      type="button"
                      className="admin-chip"
                      disabled={busyId === r.id}
                      onClick={() => void patch(r, { published: !r.published })}
                    >
                      {r.published ? t("reviews.unpublish") : t("reviews.publish")}
                    </button>
                    <button
                      type="button"
                      className="admin-chip"
                      aria-pressed={r.featured}
                      disabled={busyId === r.id}
                      onClick={() => void patch(r, { featured: !r.featured })}
                    >
                      {r.featured ? "★ " : "☆ "}
                      {t("reviews.featuredBadge")}
                    </button>
                    <button type="button" className="admin-chip" onClick={() => setEditing(r)}>
                      {t("reviews.edit")}
                    </button>
                    {r.sourceUrl ? (
                      <a
                        className="admin-chip"
                        href={r.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t("reviews.viewSource")}
                      </a>
                    ) : null}
                    <button
                      type="button"
                      className="admin-chip ml-auto text-red-700 dark:text-red-400"
                      disabled={busyId === r.id}
                      onClick={() => setConfirmDelete(r)}
                    >
                      {t("reviews.delete")}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <p className="px-0.5 text-[0.6875rem] leading-relaxed text-muted">{t("reviews.publicNote")}</p>

      {editing ? (
        <ReviewFormDialog
          review={editing === "new" ? undefined : editing}
          customers={customers}
          onClose={() => setEditing(null)}
        />
      ) : null}
      <ConfirmDialog
        open={confirmDelete !== null}
        title={t("reviews.deleteTitle")}
        description={t("reviews.deleteDesc")}
        confirmLabel={t("reviews.delete")}
        busy={busyId !== null}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && void remove(confirmDelete)}
      />
    </div>
  );
}

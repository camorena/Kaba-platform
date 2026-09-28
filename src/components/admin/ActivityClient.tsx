"use client";

import Link from "next/link";
import AdminPageChrome from "@/components/admin/AdminPageChrome";
import EmptyState from "@/components/admin/EmptyState";
import { useAdminI18n } from "@/components/admin/LocaleProvider";
import { formatDateTime } from "@/lib/admin/format";
import {
  invoiceStatusLabel,
  paymentMethodLabel,
  paymentStatusLabel,
  quoteStatusLabel,
} from "@/lib/admin/i18n";
import type { ActivityKind } from "@/lib/admin/activity";
import { useMemo, useState } from "react";

export type ActivityRow = {
  id: string;
  kind: ActivityKind;
  at: string;
  subject: string;
  status: string;
  extra: string;
  href: string;
  tone: string;
};

const toneDot: Record<string, string> = {
  sky: "bg-sky-500",
  amber: "bg-amber-500",
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
  muted: "bg-ink/30",
};

type KindFilter = "all" | ActivityKind;

function filterClass(active: boolean): string {
  return `admin-touch rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
    active
      ? "bg-bronze/12 text-bronze-dark dark:text-bronze-light"
      : "text-muted hover:bg-[var(--admin-panel)] hover:text-ink"
  }`;
}

function kindChipTone(kind: ActivityKind): string {
  if (kind === "quote") return "admin-settings-chip-info";
  if (kind === "invoice") return "admin-settings-chip-ok";
  return "admin-settings-chip-warn";
}

export default function ActivityClient({ feed }: { feed: ActivityRow[] }) {
  const { t, locale } = useAdminI18n();
  const [kind, setKind] = useState<KindFilter>("all");
  const [query, setQuery] = useState("");

  function kindLabel(k: ActivityKind) {
    if (k === "quote") return t("pages.activity.kindQuote");
    if (k === "invoice") return t("pages.activity.kindInvoice");
    return t("pages.activity.kindPayment");
  }

  function statusLabel(k: ActivityKind, status: string) {
    if (k === "quote") return quoteStatusLabel(locale, status);
    if (k === "invoice") return invoiceStatusLabel(locale, status);
    return paymentStatusLabel(locale, status);
  }

  const counts = useMemo(() => {
    const c: Record<KindFilter, number> = {
      all: feed.length,
      quote: 0,
      invoice: 0,
      payment: 0,
    };
    for (const item of feed) c[item.kind] += 1;
    return c;
  }, [feed]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return feed.filter((item) => {
      if (kind !== "all" && item.kind !== kind) return false;
      if (!q) return true;
      const hay = [item.subject, item.extra, item.status, kindLabel(item.kind)]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
    // kindLabel depends on t/locale; intentional for search
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feed, kind, query, locale, t]);

  function clearFilters() {
    setKind("all");
    setQuery("");
  }

  const kinds: KindFilter[] = ["all", "quote", "invoice", "payment"];

  return (
    <>
      <AdminPageChrome page="activity" showDictMeta />

      {feed.length === 0 ? (
        <EmptyState
          title={t("pages.activity.emptyTitle")}
          description={t("pages.activity.emptyDesc")}
        />
      ) : (
        <>
          <div className="admin-toolbar mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-1">
              {kinds.map((k) => {
                const label =
                  k === "all" ? t("common.all") : kindLabel(k);
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKind(k)}
                    className={filterClass(kind === k)}
                    aria-pressed={kind === k}
                  >
                    {label} ({counts[k]})
                  </button>
                );
              })}
            </div>
            <div className="relative min-w-0 flex-1 sm:max-w-xs">
              <label htmlFor="activity-search" className="sr-only">
                {t("pages.activity.searchLabel")}
              </label>
              <input
                id="activity-search"
                type="search"
                placeholder={t("pages.activity.searchPlaceholder")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="field-input !mt-0 w-full py-2 text-sm"
              />
            </div>
          </div>

          <p className="mb-3 text-[0.6875rem] text-muted">
            {t("common.showingOf", {
              filtered: filtered.length,
              total: feed.length,
            })}
          </p>

          {filtered.length === 0 ? (
            <EmptyState
              title={t("common.noMatches")}
              description={t("common.noMatchesDesc")}
              action={
                <button
                  type="button"
                  className="btn-secondary-light admin-touch text-sm"
                  onClick={clearFilters}
                >
                  {t("common.clearFilters")}
                </button>
              }
            />
          ) : (
            <ol className="admin-activity-feed admin-glass-panel relative space-y-0 overflow-hidden">
              {filtered.map((item, i) => {
                let detail = "";
                if (item.kind === "payment") {
                  const [method, customer, payStatus] = item.extra.split(" · ");
                  detail = [
                    paymentMethodLabel(locale, method),
                    customer,
                    paymentStatusLabel(locale, payStatus || item.status),
                  ]
                    .filter(Boolean)
                    .join(" · ");
                } else {
                  detail = `${statusLabel(item.kind, item.status)} · ${item.extra}`;
                }
                return (
                  <li key={item.id} className="admin-activity-item relative">
                    {i < filtered.length - 1 && (
                      <span className="admin-activity-line" aria-hidden />
                    )}
                    <span
                      className={`admin-activity-dot ${toneDot[item.tone] ?? toneDot.muted}`}
                      aria-hidden
                    />
                    <Link
                      href={item.href}
                      className="block rounded-lg px-3 py-3 transition hover:bg-[var(--admin-row-hover)] sm:px-4"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                          <span
                            className={`admin-settings-chip ${kindChipTone(item.kind)}`}
                          >
                            {kindLabel(item.kind)}
                          </span>
                          <p className="font-semibold text-ink">{item.subject}</p>
                        </div>
                        <time
                          dateTime={item.at}
                          className="text-[0.6875rem] tabular-nums text-muted"
                        >
                          {formatDateTime(item.at)}
                        </time>
                      </div>
                      <p className="mt-0.5 text-sm text-muted">{detail}</p>
                    </Link>
                  </li>
                );
              })}
            </ol>
          )}
        </>
      )}
    </>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import EmptyState from "@/components/admin/EmptyState";
import { useAdminI18n } from "@/components/admin/LocaleProvider";
import type { ContentTypeSpec } from "@/lib/cms/content-types";
import type { ContentDocument } from "@/lib/cms/types";

type StatusFilter = "all" | "published" | "draft";

export default function ContentListClient({
  spec,
  documents,
  isPublicCutover,
  livePaths,
}: {
  spec: ContentTypeSpec;
  documents: ContentDocument[];
  isPublicCutover: boolean;
  livePaths: string;
}) {
  const { t, locale } = useAdminI18n();
  const plural = locale === "es" ? spec.pluralEs : spec.plural;
  const titleField = spec.titleField;
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const publishedCount = documents.filter((d) => d.status === "published").length;
  const draftCount = documents.length - publishedCount;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return documents.filter((doc) => {
      if (statusFilter !== "all" && doc.status !== statusFilter) return false;
      if (!q) return true;
      const title = String(doc.fields[titleField] ?? doc.id);
      const hay = [title, doc.id, doc.status, ...Object.values(doc.fields).map(String)]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [documents, query, statusFilter, titleField]);

  function formatUpdated(iso: string) {
    return new Date(iso).toLocaleString(locale === "es" ? "es-CO" : "en-US", {
      timeZone: "America/Chicago",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <div className="admin-content-list space-y-5">
      <div className="admin-content-sticky sticky top-0 z-20 -mx-1 space-y-3 bg-[color-mix(in_srgb,var(--admin-bg,var(--cream))_94%,transparent)] px-1 py-2.5 backdrop-blur-md">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 max-w-xl">
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-muted">
              {spec.key}
            </p>
            <h2 className="mt-0.5 font-display text-lg font-semibold tracking-[-0.02em] text-ink sm:text-xl">
              {plural}
            </h2>
            <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted">
              {isPublicCutover
                ? t("pages.content.listHintLive", { plural, paths: livePaths })
                : t("pages.content.listHintAdmin", { plural })}
            </p>
          </div>
          <Link
            href="/admin/content"
            className="admin-touch shrink-0 text-sm font-medium text-bronze underline-offset-2 hover:underline"
          >
            {t("pages.content.backHub")}
          </Link>
        </div>

        <p className="text-[0.6875rem] tracking-wide text-muted">
          <span className="text-ink/80">
            {publishedCount} {t("pages.content.statusPublished").toLowerCase()}
          </span>
          <span className="mx-2 text-ink/20" aria-hidden>
            ·
          </span>
          <span>
            {draftCount} {t("pages.content.statusDraft").toLowerCase()}
          </span>
          {isPublicCutover ? (
            <>
              <span className="mx-2 text-ink/20" aria-hidden>
                ·
              </span>
              <span className="text-emerald-800/80 dark:text-emerald-300/80">
                {t("pages.content.liveBadge")}
              </span>
            </>
          ) : null}
        </p>

        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <label className="relative block min-w-0 flex-1 sm:max-w-xs">
            <span className="sr-only">{t("pages.content.searchLabel")}</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("pages.content.searchListPlaceholder")}
              className="field-input admin-touch w-full pl-9 text-sm"
            />
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
              />
            </svg>
          </label>
          <div
            className="flex flex-wrap gap-1"
            role="group"
            aria-label={t("pages.content.statusFilterAria")}
          >
            {(
              [
                ["all", t("common.all")],
                ["published", t("pages.content.statusPublished")],
                ["draft", t("pages.content.statusDraft")],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setStatusFilter(id)}
                className={`admin-touch rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                  statusFilter === id
                    ? "bg-bronze/12 text-bronze-dark dark:text-bronze-light"
                    : "text-muted hover:bg-[var(--admin-panel)] hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {documents.length === 0 ? (
        <EmptyState
          title={t("pages.content.emptyTitle")}
          description={t("pages.content.empty")}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={t("common.noMatches")}
          description={t("common.noMatchesDesc")}
          action={
            <button
              type="button"
              className="btn-secondary-light admin-touch text-sm"
              onClick={() => {
                setQuery("");
                setStatusFilter("all");
              }}
            >
              {t("common.clearFilters")}
            </button>
          }
        />
      ) : (
        <>
          <div className="admin-glass-panel hidden overflow-hidden md:block">
            <div className="admin-table-wrap overflow-x-auto">
              <table className="w-full min-w-[36rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--admin-border)] text-[0.625rem] uppercase tracking-[0.08em] text-muted">
                    <th className="px-4 py-2.5 font-semibold">
                      {t("pages.content.colTitle")}
                    </th>
                    <th className="px-4 py-2.5 font-semibold">
                      {t("pages.content.colStatus")}
                    </th>
                    <th className="px-4 py-2.5 font-semibold">
                      {t("pages.content.colOrder")}
                    </th>
                    <th className="px-4 py-2.5 font-semibold">
                      {t("pages.content.colUpdated")}
                    </th>
                    <th className="px-4 py-2.5 font-semibold">
                      <span className="sr-only">{t("pages.content.edit")}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((doc) => {
                    const title = String(doc.fields[titleField] ?? doc.id);
                    return (
                      <tr
                        key={doc.id}
                        className="border-b border-[var(--admin-border)]/50 transition hover:bg-[var(--admin-row-hover)]"
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={`/admin/content/${spec.key}/${doc.id}`}
                            className="font-medium text-ink hover:text-bronze-dark dark:hover:text-bronze-light"
                          >
                            {title}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`admin-content-chip ${
                              doc.status === "published"
                                ? "admin-content-chip-live"
                                : ""
                            }`}
                          >
                            {doc.status === "published"
                              ? t("pages.content.statusPublished")
                              : t("pages.content.statusDraft")}
                          </span>
                        </td>
                        <td className="px-4 py-3 tabular-nums text-muted">
                          {doc.sortOrder}
                        </td>
                        <td className="px-4 py-3 text-muted">
                          {formatUpdated(doc.updatedAt)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/admin/content/${spec.key}/${doc.id}`}
                            className="text-sm font-medium text-bronze underline-offset-2 hover:underline"
                          >
                            {t("pages.content.edit")}
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <ul className="grid gap-2.5 md:hidden">
            {filtered.map((doc) => {
              const title = String(doc.fields[titleField] ?? doc.id);
              return (
                <li key={doc.id}>
                  <Link
                    href={`/admin/content/${spec.key}/${doc.id}`}
                    className="admin-glass-panel admin-mobile-card admin-touch block p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium leading-snug text-ink">{title}</h3>
                      <span
                        className={`admin-content-chip shrink-0 ${
                          doc.status === "published"
                            ? "admin-content-chip-live"
                            : ""
                        }`}
                      >
                        {doc.status === "published"
                          ? t("pages.content.statusPublished")
                          : t("pages.content.statusDraft")}
                      </span>
                    </div>
                    <p className="mt-2 text-[0.6875rem] text-muted">
                      {t("pages.content.colOrder")} {doc.sortOrder}
                      <span className="mx-1.5 text-ink/20" aria-hidden>
                        ·
                      </span>
                      {formatUpdated(doc.updatedAt)}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="text-[0.6875rem] text-muted">
            {t("common.showingOf", {
              filtered: filtered.length,
              total: documents.length,
            })}
          </p>
        </>
      )}

      <p className="max-w-3xl text-[0.6875rem] leading-relaxed text-muted/75">
        {t("pages.content.swapNote")}
      </p>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAdminI18n } from "@/components/admin/LocaleProvider";
import type { ContentTypeSpec, CmsRegistryPhase } from "@/lib/cms/content-types";
import type { PlannedContentType } from "@/lib/cms/roadmap";

const PHASES: CmsRegistryPhase[] = ["A", "B", "C"];

type LiveFilter = "all" | "live" | "admin";

export default function ContentHubClient({
  types,
  counts,
  upcoming,
  cutoverLabels,
}: {
  types: ContentTypeSpec[];
  counts: Record<string, number>;
  upcoming: PlannedContentType[];
  /** key → human paths shown on live badge, e.g. "/faq" or "/reviews, home" */
  cutoverLabels: Record<string, string>;
}) {
  const { t, locale } = useAdminI18n();
  const [query, setQuery] = useState("");
  const [liveFilter, setLiveFilter] = useState<LiveFilter>("all");

  const phaseTitle: Record<CmsRegistryPhase, string> = {
    A: t("pages.content.phaseA"),
    B: t("pages.content.phaseB"),
    C: t("pages.content.phaseC"),
  };

  const filteredTypes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return types.filter((spec) => {
      const livePaths = cutoverLabels[spec.key];
      const isLive = Boolean(livePaths);
      if (liveFilter === "live" && !isLive) return false;
      if (liveFilter === "admin" && isLive) return false;
      if (!q) return true;
      const plural = locale === "es" ? spec.pluralEs : spec.plural;
      const hay = [spec.key, plural, spec.siteSource, spec.publicPath ?? "", livePaths ?? ""]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [types, query, liveFilter, cutoverLabels, locale]);

  const liveCount = types.filter((s) => cutoverLabels[s.key]).length;
  const adminOnlyCount = types.length - liveCount;
  const totalItems = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="admin-content-hub space-y-6 sm:space-y-8">
      <div className="admin-content-sticky sticky top-0 z-20 -mx-1 space-y-3 bg-[color-mix(in_srgb,var(--admin-bg,var(--cream))_92%,transparent)] px-1 py-2 backdrop-blur-md sm:py-3">
        <p className="max-w-3xl text-sm leading-relaxed text-muted">
          {t("pages.content.hubIntro")}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <span className="admin-badge admin-badge-emerald rounded-full px-2.5 py-1 text-[0.5625rem] font-bold uppercase tracking-[0.08em]">
            {t("pages.content.hubStatLive", { count: liveCount })}
          </span>
          <span className="admin-badge admin-badge-muted rounded-full px-2.5 py-1 text-[0.5625rem] font-bold uppercase tracking-[0.08em]">
            {t("pages.content.hubStatAdmin", { count: adminOnlyCount })}
          </span>
          <span className="admin-badge admin-badge-muted rounded-full px-2.5 py-1 text-[0.5625rem] font-bold uppercase tracking-[0.08em]">
            {t("pages.content.hubStatItems", { count: totalItems })}
          </span>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative block min-w-0 flex-1 sm:max-w-md">
            <span className="sr-only">{t("pages.content.searchLabel")}</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("pages.content.searchPlaceholder")}
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
            className="flex flex-wrap gap-1.5"
            role="group"
            aria-label={t("pages.content.filterAria")}
          >
            {(
              [
                ["all", t("pages.content.filterAll")],
                ["live", t("pages.content.filterLive")],
                ["admin", t("pages.content.filterAdmin")],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setLiveFilter(id)}
                className={`admin-touch rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  liveFilter === id
                    ? "bg-bronze/15 text-bronze-dark ring-1 ring-bronze/35 dark:text-bronze-light"
                    : "bg-[var(--admin-panel)] text-muted ring-1 ring-[var(--admin-border)] hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {PHASES.map((phase) => {
        const group = filteredTypes.filter((spec) => spec.phase === phase);
        if (group.length === 0) return null;
        return (
          <section key={phase} aria-labelledby={`content-phase-${phase}`}>
            <div className="admin-content-phase-head mb-3 flex items-baseline justify-between gap-2">
              <h2
                id={`content-phase-${phase}`}
                className="admin-section-label"
              >
                {phaseTitle[phase]}
              </h2>
              <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted">
                {t("pages.content.phaseCount", { count: group.length })}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {group.map((spec) => {
                const plural = locale === "es" ? spec.pluralEs : spec.plural;
                const count = counts[spec.key] ?? 0;
                const livePaths = cutoverLabels[spec.key];
                return (
                  <Link
                    key={spec.key}
                    href={`/admin/content/${spec.key}`}
                    className="admin-glass-panel admin-gold-rail admin-content-card admin-touch group relative block overflow-hidden p-4 transition hover:ring-1 hover:ring-bronze/30 sm:p-5"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="admin-section-label">{spec.key}</p>
                      {livePaths ? (
                        <span className="admin-badge admin-badge-emerald rounded-full px-2 py-0.5 text-[0.5625rem] font-bold uppercase tracking-[0.1em]">
                          {t("pages.content.liveBadge", { paths: livePaths })}
                        </span>
                      ) : (
                        <span className="admin-badge admin-badge-muted rounded-full px-2 py-0.5 text-[0.5625rem] font-bold uppercase tracking-[0.1em]">
                          {t("pages.content.adminOnlyBadge")}
                        </span>
                      )}
                    </div>
                    <h3 className="admin-card-title mt-1.5 group-hover:text-bronze-dark dark:group-hover:text-bronze-light">
                      {plural}
                    </h3>
                    <p className="mt-2 text-sm font-medium text-ink">
                      {t("pages.content.count", { count })}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted">
                      {t("pages.content.mirrors", { source: spec.siteSource })}
                    </p>
                    {spec.publicPath ? (
                      <p className="mt-1 text-xs text-muted">
                        {t("pages.content.publicPath", { path: spec.publicPath })}
                      </p>
                    ) : null}
                    {livePaths ? (
                      <p className="mt-2.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                        {t("pages.content.publishAffects", { paths: livePaths })}
                      </p>
                    ) : (
                      <p className="mt-2.5 text-xs text-muted">
                        {t("pages.content.publishAdminOnly")}
                      </p>
                    )}
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-bronze opacity-0 transition group-hover:opacity-100">
                      {t("pages.content.openType")}
                      <span aria-hidden>→</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      {filteredTypes.length === 0 ? (
        <div className="admin-empty admin-gold-rail rounded-xl border border-dashed border-ink/12 bg-[var(--admin-panel)] px-5 py-12 text-center">
          <p className="font-display text-base font-semibold text-ink">
            {t("common.noMatches")}
          </p>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-muted">
            {t("common.noMatchesDesc")}
          </p>
          <button
            type="button"
            className="btn-secondary-light admin-touch mt-4 text-sm"
            onClick={() => {
              setQuery("");
              setLiveFilter("all");
            }}
          >
            {t("common.clearFilters")}
          </button>
        </div>
      ) : null}

      {upcoming.length > 0 ? (
        <section aria-labelledby="content-upcoming">
          <h2 id="content-upcoming" className="admin-section-label mb-3">
            {t("pages.content.upcomingTitle")}
          </h2>
          <p className="mb-3 max-w-3xl text-sm text-muted">
            {t("pages.content.upcomingBody")}
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {upcoming.map((item) => {
              const plural = locale === "es" ? item.pluralEs : item.plural;
              return (
                <li
                  key={item.key}
                  className="admin-glass-panel border border-dashed border-[var(--admin-border)] p-4 opacity-90 sm:p-5"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="admin-section-label">{item.key}</p>
                    <span className="admin-badge admin-badge-muted rounded-full px-2 py-0.5 text-[0.5625rem] font-bold uppercase tracking-[0.1em]">
                      {t("pages.content.phaseBadge", { phase: item.phase })}
                    </span>
                  </div>
                  <h3 className="admin-card-title mt-1">{plural}</h3>
                  <p className="mt-2 text-xs text-muted">
                    {t("pages.content.replaces", {
                      source: item.siteSources.join(", "),
                    })}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {item.publicPaths.join(" · ")}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <p className="rounded-lg border border-border/60 bg-surface/40 px-3 py-2 text-xs leading-relaxed text-muted">
        {t("pages.content.swapNote")}
      </p>
    </div>
  );
}

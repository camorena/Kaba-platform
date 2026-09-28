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
    <div className="admin-content-hub space-y-8 sm:space-y-10">
      <div className="admin-content-sticky sticky top-0 z-20 -mx-1 space-y-3 bg-[color-mix(in_srgb,var(--admin-bg,var(--cream))_94%,transparent)] px-1 py-2.5 backdrop-blur-md">
        <p className="text-[0.6875rem] tracking-wide text-muted">
          <span className="text-ink/80">{t("pages.content.hubStatLive", { count: liveCount })}</span>
          <span className="mx-2 text-ink/20" aria-hidden>
            ·
          </span>
          <span>{t("pages.content.hubStatAdmin", { count: adminOnlyCount })}</span>
          <span className="mx-2 text-ink/20" aria-hidden>
            ·
          </span>
          <span>{t("pages.content.hubStatItems", { count: totalItems })}</span>
        </p>

        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative block min-w-0 flex-1 sm:max-w-sm">
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
            className="flex flex-wrap gap-1"
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
                className={`admin-touch rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                  liveFilter === id
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

      {PHASES.map((phase) => {
        const group = filteredTypes.filter((spec) => spec.phase === phase);
        if (group.length === 0) return null;
        return (
          <section key={phase} aria-labelledby={`content-phase-${phase}`} className="space-y-3">
            <div className="admin-content-phase-head flex items-baseline justify-between gap-3 border-b border-[var(--admin-border)]/50 pb-2">
              <h2
                id={`content-phase-${phase}`}
                className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-muted"
              >
                {phaseTitle[phase]}
              </h2>
              <span className="text-[0.6875rem] tabular-nums text-muted/80">
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
                    title={livePaths ? t("pages.content.livePathsHint", { paths: livePaths }) : undefined}
                    className="admin-glass-panel admin-content-card admin-touch group relative block p-4 transition hover:border-bronze/25 sm:p-5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[0.625rem] font-medium uppercase tracking-[0.08em] text-muted">
                        {spec.key}
                      </p>
                      {livePaths ? (
                        <span className="admin-content-chip admin-content-chip-live">
                          {t("pages.content.liveBadge")}
                        </span>
                      ) : (
                        <span className="admin-content-chip">
                          {t("pages.content.adminOnlyBadge")}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 font-display text-[1.05rem] font-semibold leading-snug tracking-[-0.02em] text-ink group-hover:text-bronze-dark dark:group-hover:text-bronze-light">
                      {plural}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted">
                      {t("pages.content.count", { count })}
                    </p>
                    {livePaths ? (
                      <p className="mt-2 truncate text-[0.6875rem] text-muted/80">
                        {livePaths}
                      </p>
                    ) : (
                      <p className="mt-2 text-[0.6875rem] text-muted/70">
                        {t("pages.content.mirrors", { source: spec.siteSource })}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      {filteredTypes.length === 0 ? (
        <div className="admin-empty rounded-xl border border-dashed border-ink/10 bg-[var(--admin-panel)]/60 px-5 py-14 text-center">
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
        <section aria-labelledby="content-upcoming" className="space-y-3">
          <div className="border-b border-[var(--admin-border)]/50 pb-2">
            <h2
              id="content-upcoming"
              className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-muted"
            >
              {t("pages.content.upcomingTitle")}
            </h2>
          </div>
          <p className="max-w-2xl text-[0.8125rem] text-muted">
            {t("pages.content.upcomingBody")}
          </p>
          <ul className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
            {upcoming.map((item) => {
              const plural = locale === "es" ? item.pluralEs : item.plural;
              return (
                <li
                  key={item.key}
                  className="rounded-xl border border-dashed border-[var(--admin-border)]/80 bg-[var(--admin-panel)]/40 px-4 py-3.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[0.625rem] font-medium uppercase tracking-[0.08em] text-muted">
                      {item.key}
                    </p>
                    <span className="admin-content-chip">
                      {t("pages.content.phaseBadge", { phase: item.phase })}
                    </span>
                  </div>
                  <h3 className="mt-1.5 text-sm font-semibold text-ink">{plural}</h3>
                  <p className="mt-1 text-[0.6875rem] text-muted/80">
                    {item.publicPaths.join(" · ")}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <p className="max-w-3xl text-[0.6875rem] leading-relaxed text-muted/75">
        {t("pages.content.swapNote")}
      </p>
    </div>
  );
}

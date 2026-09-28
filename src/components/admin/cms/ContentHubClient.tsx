"use client";

import Link from "next/link";
import { useAdminI18n } from "@/components/admin/LocaleProvider";
import type { ContentTypeSpec, CmsRegistryPhase } from "@/lib/cms/content-types";
import type { PlannedContentType } from "@/lib/cms/roadmap";

const PHASES: CmsRegistryPhase[] = ["A", "B", "C"];

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

  const phaseTitle: Record<CmsRegistryPhase, string> = {
    A: t("pages.content.phaseA"),
    B: t("pages.content.phaseB"),
    C: t("pages.content.phaseC"),
  };

  return (
    <div className="space-y-8">
      <p className="max-w-3xl text-sm leading-relaxed text-muted">
        {t("pages.content.hubIntro")}
      </p>

      {PHASES.map((phase) => {
        const group = types.filter((spec) => spec.phase === phase);
        if (group.length === 0) return null;
        return (
          <div key={phase}>
            <h2 className="admin-section-label mb-3">{phaseTitle[phase]}</h2>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {group.map((spec) => {
                const plural = locale === "es" ? spec.pluralEs : spec.plural;
                const count = counts[spec.key] ?? 0;
                const livePaths = cutoverLabels[spec.key];
                return (
                  <Link
                    key={spec.key}
                    href={`/admin/content/${spec.key}`}
                    className="admin-glass-panel admin-gold-rail admin-touch block p-4 transition hover:ring-1 hover:ring-bronze/30 sm:p-5"
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
                    <h3 className="admin-card-title mt-1">{plural}</h3>
                    <p className="mt-2 text-sm text-muted">
                      {t("pages.content.count", { count })}
                    </p>
                    <p className="mt-2 text-xs text-muted">
                      {t("pages.content.mirrors", { source: spec.siteSource })}
                    </p>
                    {spec.publicPath ? (
                      <p className="mt-1 text-xs text-muted">
                        {t("pages.content.publicPath", { path: spec.publicPath })}
                      </p>
                    ) : null}
                    {livePaths ? (
                      <p className="mt-2 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                        {t("pages.content.publishAffects", { paths: livePaths })}
                      </p>
                    ) : (
                      <p className="mt-2 text-xs text-muted">
                        {t("pages.content.publishAdminOnly")}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}

      {upcoming.length > 0 ? (
        <div>
          <h2 className="admin-section-label mb-3">
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
        </div>
      ) : null}

      <p className="rounded-lg border border-border/60 bg-surface/40 px-3 py-2 text-xs leading-relaxed text-muted">
        {t("pages.content.swapNote")}
      </p>
    </div>
  );
}

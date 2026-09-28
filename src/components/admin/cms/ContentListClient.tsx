"use client";

import Link from "next/link";
import { useAdminI18n } from "@/components/admin/LocaleProvider";
import type { ContentTypeSpec } from "@/lib/cms/content-types";
import type { ContentDocument } from "@/lib/cms/types";

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
  const publishedCount = documents.filter((d) => d.status === "published").length;
  const draftCount = documents.length - publishedCount;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted">
          {isPublicCutover
            ? t("pages.content.listHintLive", { plural, paths: livePaths })
            : t("pages.content.listHintAdmin", { plural })}
        </p>
        <Link
          href="/admin/content"
          className="btn-secondary-light admin-touch text-sm"
        >
          {t("pages.content.backHub")}
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <span className="admin-badge admin-badge-emerald rounded-full px-2.5 py-1 font-bold uppercase tracking-[0.08em]">
          {t("pages.content.statusPublished")}: {publishedCount}
        </span>
        <span className="admin-badge admin-badge-muted rounded-full px-2.5 py-1 font-bold uppercase tracking-[0.08em]">
          {t("pages.content.statusDraft")}: {draftCount}
        </span>
        {isPublicCutover ? (
          <span className="admin-badge admin-badge-emerald rounded-full px-2.5 py-1 font-bold uppercase tracking-[0.08em]">
            {t("pages.content.liveBadge", { paths: livePaths })}
          </span>
        ) : (
          <span className="admin-badge admin-badge-muted rounded-full px-2.5 py-1 font-bold uppercase tracking-[0.08em]">
            {t("pages.content.adminOnlyBadge")}
          </span>
        )}
      </div>

      <div className="admin-glass-panel hidden overflow-x-auto md:block">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--admin-border)] text-[0.6875rem] uppercase tracking-[0.08em] text-muted">
              <th className="px-4 py-3 font-bold">{t("pages.content.colTitle")}</th>
              <th className="px-4 py-3 font-bold">{t("pages.content.colStatus")}</th>
              <th className="px-4 py-3 font-bold">{t("pages.content.colOrder")}</th>
              <th className="px-4 py-3 font-bold">{t("pages.content.colUpdated")}</th>
              <th className="px-4 py-3 font-bold">
                <span className="sr-only">{t("pages.content.edit")}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => {
              const title = String(doc.fields[titleField] ?? doc.id);
              return (
                <tr
                  key={doc.id}
                  className="border-b border-[var(--admin-border)]/60 hover:bg-[var(--admin-row-hover)]"
                >
                  <td className="px-4 py-3 font-medium text-ink">{title}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`admin-badge rounded-full px-2 py-0.5 text-[0.5625rem] font-bold uppercase tracking-[0.1em] ${
                        doc.status === "published"
                          ? "admin-badge-emerald"
                          : "admin-badge-muted"
                      }`}
                    >
                      {doc.status === "published"
                        ? t("pages.content.statusPublished")
                        : t("pages.content.statusDraft")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">{doc.sortOrder}</td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(doc.updatedAt).toLocaleString(
                      locale === "es" ? "es-CO" : "en-US",
                      {
                        timeZone: "America/Chicago",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      },
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/content/${spec.key}/${doc.id}`}
                      className="font-semibold text-bronze underline-offset-2 hover:underline"
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

      <ul className="grid gap-3 md:hidden">
        {documents.map((doc) => {
          const title = String(doc.fields[titleField] ?? doc.id);
          return (
            <li key={doc.id}>
              <Link
                href={`/admin/content/${spec.key}/${doc.id}`}
                className="admin-glass-panel admin-touch block p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-ink">{title}</h3>
                  <span
                    className={`admin-badge shrink-0 rounded-full px-2 py-0.5 text-[0.5625rem] font-bold uppercase tracking-[0.1em] ${
                      doc.status === "published"
                        ? "admin-badge-emerald"
                        : "admin-badge-muted"
                    }`}
                  >
                    {doc.status === "published"
                      ? t("pages.content.statusPublished")
                      : t("pages.content.statusDraft")}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted">
                  {t("pages.content.colOrder")}: {doc.sortOrder}
                </p>
                <p className="mt-1 text-sm font-semibold text-bronze">
                  {t("pages.content.edit")} →
                </p>
              </Link>
            </li>
          );
        })}
      </ul>

      {documents.length === 0 ? (
        <p className="text-sm text-muted">{t("pages.content.empty")}</p>
      ) : null}

      <p className="rounded-lg border border-border/60 bg-surface/40 px-3 py-2 text-xs leading-relaxed text-muted">
        {t("pages.content.swapNote")}
      </p>
    </div>
  );
}

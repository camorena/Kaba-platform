"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAdminI18n } from "@/components/admin/LocaleProvider";
import { useToast } from "@/components/admin/Toast";
import type { ContentTypeSpec } from "@/lib/cms/content-types";
import type { ContentDocument, ContentFieldValue } from "@/lib/cms/types";

export default function ContentEditClient({
  spec,
  document: initial,
  isPublicCutover,
  livePaths,
}: {
  spec: ContentTypeSpec;
  document: ContentDocument;
  isPublicCutover: boolean;
  livePaths: string;
}) {
  const { t, locale } = useAdminI18n();
  const toast = useToast();
  const router = useRouter();
  const [status, setStatus] = useState(initial.status);
  const [fields, setFields] = useState<Record<string, ContentFieldValue>>({
    ...initial.fields,
  });
  const [saving, setSaving] = useState(false);
  const dirty =
    status !== initial.status ||
    JSON.stringify(fields) !== JSON.stringify(initial.fields);

  function setField(name: string, value: ContentFieldValue) {
    setFields((prev) => ({ ...prev, [name]: value }));
  }

  async function saveWithStatus(nextStatus: "draft" | "published") {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/content/${spec.key}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: initial.id, status: nextStatus, fields }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        document?: ContentDocument;
      };
      if (!res.ok) {
        toast.push({
          title: data.error ?? t("pages.content.saveFailed"),
          tone: "error",
        });
        return;
      }
      toast.push({
        title:
          nextStatus === "published"
            ? t("pages.content.savedPublished")
            : t("pages.content.savedDraft"),
        tone: "success",
      });
      if (data.document) {
        setFields({ ...data.document.fields });
        setStatus(data.document.status);
      } else {
        setStatus(nextStatus);
      }
      router.refresh();
    } catch {
      toast.push({ title: t("pages.content.saveFailed"), tone: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    await saveWithStatus(status);
  }

  const title = String(fields[spec.titleField] ?? initial.id);

  return (
    <form onSubmit={onSave} className="admin-content-edit mx-auto max-w-2xl space-y-4 pb-24">
      <div className="admin-content-sticky sticky top-0 z-20 -mx-1 space-y-3 bg-[color-mix(in_srgb,var(--admin-bg,var(--cream))_92%,transparent)] px-1 py-2 backdrop-blur-md sm:py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="admin-section-label">{spec.key}</p>
            <h2 className="admin-card-title truncate">{title}</h2>
          </div>
          <Link
            href={`/admin/content/${spec.key}`}
            className="btn-secondary-light admin-touch text-sm"
          >
            {t("pages.content.backList")}
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`admin-badge rounded-full px-2.5 py-1 text-[0.5625rem] font-bold uppercase tracking-[0.08em] ${
              status === "published"
                ? "admin-badge-emerald"
                : "admin-badge-muted"
            }`}
          >
            {status === "published"
              ? t("pages.content.statusPublished")
              : t("pages.content.statusDraft")}
          </span>
          {dirty ? (
            <span className="admin-badge rounded-full bg-amber-500/15 px-2.5 py-1 text-[0.5625rem] font-bold uppercase tracking-[0.08em] text-amber-800 dark:text-amber-200">
              {t("pages.content.unsaved")}
            </span>
          ) : null}
          {isPublicCutover ? (
            <span className="admin-badge admin-badge-emerald rounded-full px-2.5 py-1 text-[0.5625rem] font-bold uppercase tracking-[0.08em]">
              {t("pages.content.liveBadge", { paths: livePaths })}
            </span>
          ) : (
            <span className="admin-badge admin-badge-muted rounded-full px-2.5 py-1 text-[0.5625rem] font-bold uppercase tracking-[0.08em]">
              {t("pages.content.adminOnlyBadge")}
            </span>
          )}
        </div>
      </div>

      <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs leading-relaxed text-amber-900 dark:text-amber-200">
        {isPublicCutover
          ? t("pages.content.editStubNoteLive", { paths: livePaths })
          : t("pages.content.editStubNoteAdmin")}
      </p>

      <div className="admin-glass-panel admin-gold-rail space-y-5 p-4 sm:p-5">
        <div>
          <p className="admin-section-label">{t("pages.content.colStatus")}</p>
          <div
            className="mt-2 grid grid-cols-2 gap-2"
            role="group"
            aria-label={t("pages.content.colStatus")}
          >
            {(
              [
                ["draft", t("pages.content.statusDraft")],
                ["published", t("pages.content.statusPublished")],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setStatus(id)}
                className={`admin-touch rounded-xl px-3 py-2.5 text-sm font-semibold transition ring-1 ${
                  status === id
                    ? id === "published"
                      ? "bg-emerald-500/15 text-emerald-800 ring-emerald-500/35 dark:text-emerald-200"
                      : "bg-bronze/15 text-bronze-dark ring-bronze/35 dark:text-bronze-light"
                    : "bg-[var(--admin-bg)] text-muted ring-[var(--admin-border)] hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            {isPublicCutover
              ? t("pages.content.statusHelpLive", { paths: livePaths })
              : t("pages.content.statusHelpAdmin")}
          </p>
        </div>

        <div className="border-t border-[var(--admin-border)]/70 pt-4">
          <p className="admin-section-label mb-3">
            {t("pages.content.fieldsHeading")}
          </p>
          <div className="space-y-4">
            {spec.fields.map((field) => {
              const label = locale === "es" ? field.labelEs : field.label;
              const hint = locale === "es" ? field.hintEs : field.hint;
              const value = fields[field.name];
              const locked = Boolean(field.locked);
              const strVal = value == null ? "" : String(value);

              if (field.kind === "checkbox") {
                return (
                  <label
                    key={field.name}
                    className="flex min-h-11 items-center gap-2.5 rounded-lg border border-[var(--admin-border)]/60 bg-[var(--admin-bg)]/40 px-3 py-2"
                  >
                    <input
                      type="checkbox"
                      className="size-4 rounded border-border"
                      checked={Boolean(value)}
                      disabled={locked}
                      onChange={(e) => setField(field.name, e.target.checked)}
                    />
                    <span className="text-sm font-medium text-ink">{label}</span>
                  </label>
                );
              }

              if (field.kind === "textarea") {
                return (
                  <label key={field.name} className="block">
                    <span className="admin-section-label flex items-center justify-between gap-2">
                      <span>{label}</span>
                      {field.maxLength ? (
                        <span className="font-normal normal-case tracking-normal text-muted">
                          {strVal.length}/{field.maxLength}
                        </span>
                      ) : null}
                    </span>
                    <textarea
                      className="field-input mt-1.5 min-h-[7rem] w-full"
                      value={strVal}
                      disabled={locked}
                      maxLength={field.maxLength}
                      required={field.required}
                      onChange={(e) => setField(field.name, e.target.value)}
                    />
                    {hint ? (
                      <span className="mt-1 block text-xs text-muted">{hint}</span>
                    ) : null}
                  </label>
                );
              }

              if (field.kind === "select" && field.options) {
                return (
                  <label key={field.name} className="block">
                    <span className="admin-section-label">{label}</span>
                    <select
                      className="field-input mt-1.5 w-full"
                      value={strVal}
                      disabled={locked}
                      onChange={(e) => setField(field.name, e.target.value)}
                    >
                      {field.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {locale === "es" ? opt.labelEs : opt.label}
                        </option>
                      ))}
                    </select>
                    {hint ? (
                      <span className="mt-1 block text-xs text-muted">{hint}</span>
                    ) : null}
                  </label>
                );
              }

              return (
                <label key={field.name} className="block">
                  <span className="admin-section-label flex items-center justify-between gap-2">
                    <span>
                      {label}
                      {locked ? ` (${t("pages.content.locked")})` : ""}
                    </span>
                    {field.maxLength && field.kind !== "number" ? (
                      <span className="font-normal normal-case tracking-normal text-muted">
                        {strVal.length}/{field.maxLength}
                      </span>
                    ) : null}
                  </span>
                  <input
                    type={field.kind === "number" ? "number" : "text"}
                    className="field-input mt-1.5 w-full"
                    value={strVal}
                    disabled={locked}
                    maxLength={field.maxLength}
                    required={field.required}
                    onChange={(e) =>
                      setField(
                        field.name,
                        field.kind === "number"
                          ? e.target.value === ""
                            ? null
                            : Number(e.target.value)
                          : e.target.value,
                      )
                    }
                  />
                  {hint ? (
                    <span className="mt-1 block text-xs text-muted">{hint}</span>
                  ) : null}
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <div className="admin-content-savebar admin-detail-actions fixed inset-x-0 bottom-0 z-30 border-t border-[var(--admin-border)] bg-[color-mix(in_srgb,var(--admin-panel)_94%,transparent)] px-4 py-3 backdrop-blur-md sm:static sm:inset-auto sm:z-auto sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <div className="mx-auto flex max-w-2xl flex-wrap gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => saveWithStatus("draft")}
            className="admin-touch btn-secondary-light text-sm disabled:opacity-60"
          >
            {saving ? t("common.saving") : t("pages.content.saveDraft")}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => saveWithStatus("published")}
            className="admin-touch btn-primary text-sm disabled:opacity-60"
          >
            {saving ? t("common.saving") : t("pages.content.savePublish")}
          </button>
          <button
            type="submit"
            disabled={saving || !dirty}
            className="admin-touch btn-secondary-light text-sm disabled:opacity-60 sm:ml-auto"
          >
            {saving ? t("common.saving") : t("pages.content.save")}
          </button>
        </div>
      </div>
    </form>
  );
}

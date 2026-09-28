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
}: {
  spec: ContentTypeSpec;
  document: ContentDocument;
}) {
  const { t, locale } = useAdminI18n();
  const toast = useToast();
  const router = useRouter();
  const [status, setStatus] = useState(initial.status);
  const [fields, setFields] = useState<Record<string, ContentFieldValue>>({
    ...initial.fields,
  });
  const [saving, setSaving] = useState(false);

  function setField(name: string, value: ContentFieldValue) {
    setFields((prev) => ({ ...prev, [name]: value }));
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/content/${spec.key}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: initial.id, status, fields }),
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
      toast.push({ title: t("pages.content.saved"), tone: "success" });
      if (data.document) {
        setFields({ ...data.document.fields });
        setStatus(data.document.status);
      }
      router.refresh();
    } catch {
      toast.push({ title: t("pages.content.saveFailed"), tone: "error" });
    } finally {
      setSaving(false);
    }
  }

  const title = String(fields[spec.titleField] ?? initial.id);

  return (
    <form onSubmit={onSave} className="mx-auto max-w-2xl space-y-4">
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

      <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs leading-relaxed text-amber-900 dark:text-amber-200">
        {t("pages.content.editStubNote")}
      </p>

      <div className="admin-glass-panel space-y-4 p-4 sm:p-5">
        <label className="block">
          <span className="admin-section-label">{t("pages.content.colStatus")}</span>
          <select
            className="field-input mt-1.5 w-full"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value === "published" ? "published" : "draft")
            }
          >
            <option value="draft">{t("pages.content.statusDraft")}</option>
            <option value="published">{t("pages.content.statusPublished")}</option>
          </select>
        </label>

        {spec.fields.map((field) => {
          const label = locale === "es" ? field.labelEs : field.label;
          const hint = locale === "es" ? field.hintEs : field.hint;
          const value = fields[field.name];
          const locked = Boolean(field.locked);

          if (field.kind === "checkbox") {
            return (
              <label key={field.name} className="flex min-h-11 items-center gap-2">
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
                <span className="admin-section-label">{label}</span>
                <textarea
                  className="field-input mt-1.5 min-h-[6rem] w-full"
                  value={value == null ? "" : String(value)}
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
                  value={value == null ? "" : String(value)}
                  disabled={locked}
                  onChange={(e) => setField(field.name, e.target.value)}
                >
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {locale === "es" ? opt.labelEs : opt.label}
                    </option>
                  ))}
                </select>
              </label>
            );
          }

          return (
            <label key={field.name} className="block">
              <span className="admin-section-label">
                {label}
                {locked ? ` (${t("pages.content.locked")})` : ""}
              </span>
              <input
                type={field.kind === "number" ? "number" : "text"}
                className="field-input mt-1.5 w-full"
                value={value == null ? "" : String(value)}
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

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={saving}
          className="admin-touch btn-primary text-sm disabled:opacity-60"
        >
          {saving ? t("common.saving") : t("pages.content.save")}
        </button>
      </div>
    </form>
  );
}

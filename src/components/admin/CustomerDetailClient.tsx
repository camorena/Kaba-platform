"use client";

import CopyChip from "@/components/admin/CopyChip";
import StatusBadge from "@/components/admin/StatusBadge";
import { useAdminI18n } from "@/components/admin/LocaleProvider";
import { useToast } from "@/components/admin/Toast";
import { formatDateTime, formatShortDate } from "@/lib/admin/format";
import { quoteStatusLabel } from "@/lib/admin/i18n";
import { quoteStatusTone, type QuoteStatus } from "@/lib/admin/status";
import { formatCustomerAddress } from "@/lib/db/customers-merge";
import type { CustomerProfile } from "@/lib/db/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type EditableField =
  | "name"
  | "email"
  | "phone"
  | "company"
  | "street"
  | "city"
  | "state"
  | "zip"
  | "notes";

type FormState = Record<EditableField, string>;

type RelatedQuote = {
  id: string;
  serviceType: string;
  status: QuoteStatus;
  createdAt: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function toForm(c: CustomerProfile): FormState {
  return {
    name: c.name,
    email: c.email,
    phone: c.phone,
    company: c.company,
    street: c.street,
    city: c.city,
    state: c.state,
    zip: c.zip,
    notes: c.notes,
  };
}

const labelClass = "block text-sm font-medium text-ink";

export default function CustomerDetailClient({
  customer,
  quotes,
}: {
  customer: CustomerProfile;
  quotes: RelatedQuote[];
}) {
  const router = useRouter();
  const toast = useToast();
  const { t, locale } = useAdminI18n();
  const [form, setForm] = useState<FormState>(() => toForm(customer));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saved = useMemo(() => toForm(customer), [customer]);
  const dirty = (Object.keys(form) as EditableField[]).some(
    (k) => form[k] !== saved[k],
  );
  const address = formatCustomerAddress(customer);

  function set(field: EditableField, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate(): string | null {
    if (!form.name.trim()) return t("pages.customers.errName");
    if (form.email.trim() && !EMAIL_RE.test(form.email.trim())) {
      return t("pages.customers.errEmail");
    }
    if (!form.email.trim() && !form.phone.trim()) {
      return t("pages.customers.errContact");
    }
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const problem = validate();
    setError(problem);
    if (problem) return;

    const patch: Partial<FormState> = {};
    for (const k of Object.keys(form) as EditableField[]) {
      if (form[k] !== saved[k]) patch[k] = form[k];
    }
    if (Object.keys(patch).length === 0) return;

    setBusy(true);
    try {
      const res = await fetch(`/api/customers/${customer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { field?: string };
        const message =
          res.status === 409
            ? t("pages.customers.errEmailTaken")
            : data.field === "email"
              ? t("pages.customers.errEmail")
              : data.field === "contact"
                ? t("pages.customers.errContact")
                : data.field === "name"
                  ? t("pages.customers.errName")
                  : null;
        setError(message);
        toast.push({
          title: t("pages.customers.saveFailed"),
          description: message ?? undefined,
          tone: "error",
        });
        return;
      }
      toast.push({ title: t("pages.customers.saved"), tone: "success" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  function field(
    name: EditableField,
    label: string,
    opts: {
      type?: string;
      autoComplete?: string;
      className?: string;
      inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
      maxLength?: number;
    } = {},
  ) {
    const id = `customer-${name}`;
    return (
      <div className={opts.className}>
        <label htmlFor={id} className={labelClass}>
          {label}
        </label>
        <input
          id={id}
          name={name}
          type={opts.type ?? "text"}
          autoComplete={opts.autoComplete ?? "off"}
          inputMode={opts.inputMode}
          maxLength={opts.maxLength}
          className="field-input mt-1.5 text-sm"
          value={form[name]}
          disabled={busy}
          onChange={(e) => set(name, e.target.value)}
        />
      </div>
    );
  }

  const notSet = t("pages.customers.notSet");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
        <Link href="/admin/customers" className="font-semibold hover:underline">
          ← {t("pages.customers.detailBack")}
        </Link>
        <span aria-hidden>·</span>
        <span className="font-mono text-[0.6875rem]">{customer.id}</span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            {customer.name}
          </h1>
          {customer.company || address ? (
            <p className="mt-1 text-sm text-muted">
              {[customer.company, address].filter(Boolean).join(" · ")}
            </p>
          ) : null}
        </div>
        <div className="admin-detail-actions flex flex-wrap gap-2">
          {customer.phone ? (
            <a href={`tel:${customer.phone}`} className="btn-secondary-light text-sm">
              {t("detail.call")}
            </a>
          ) : null}
          {customer.email ? (
            <a href={`mailto:${customer.email}`} className="btn-secondary-light text-sm">
              {t("detail.email")}
            </a>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {customer.phone ? (
          <CopyChip value={customer.phone} label={t("common.copyPhone")} />
        ) : null}
        {customer.email ? (
          <CopyChip value={customer.email} label={t("common.copyEmail")} />
        ) : null}
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <div className="space-y-3">
          <section className="admin-card">
            <h2 className="admin-card-title">{t("pages.customers.detailContact")}</h2>
            <dl className="admin-dl mt-3">
              <div>
                <dt>{t("pages.customers.fieldPhone")}</dt>
                <dd>
                  {customer.phone ? (
                    <a href={`tel:${customer.phone}`} className="hover:underline">
                      {customer.phone}
                    </a>
                  ) : (
                    notSet
                  )}
                </dd>
              </div>
              <div>
                <dt>{t("pages.customers.fieldEmail")}</dt>
                <dd className="break-all">
                  {customer.email ? (
                    <a href={`mailto:${customer.email}`} className="hover:underline">
                      {customer.email}
                    </a>
                  ) : (
                    notSet
                  )}
                </dd>
              </div>
              <div>
                <dt>{t("pages.customers.fieldCompany")}</dt>
                <dd>{customer.company || notSet}</dd>
              </div>
              <div>
                <dt>{t("pages.customers.fieldStreet")}</dt>
                <dd>{customer.street || notSet}</dd>
              </div>
              <div>
                <dt>{t("pages.customers.fieldCity")}</dt>
                <dd>{customer.city || notSet}</dd>
              </div>
              <div>
                <dt>{t("pages.customers.fieldState")}</dt>
                <dd>{customer.state || notSet}</dd>
              </div>
              <div>
                <dt>{t("pages.customers.fieldZip")}</dt>
                <dd>{customer.zip || notSet}</dd>
              </div>
              <div>
                <dt>{t("pages.customers.created")}</dt>
                <dd>{formatDateTime(customer.createdAt)}</dd>
              </div>
              <div>
                <dt>{t("pages.customers.updated")}</dt>
                <dd>{formatDateTime(customer.updatedAt)}</dd>
              </div>
            </dl>
          </section>

          <section className="admin-card">
            <h2 className="admin-card-title">{t("pages.customers.colQuotes")}</h2>
            {quotes.length === 0 ? (
              <p className="mt-2 text-sm text-muted">{t("pages.customers.noQuotes")}</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {quotes.map((q) => (
                  <li key={q.id} className="flex flex-wrap items-center gap-2 text-sm">
                    <Link
                      href={`/admin/quotes/${q.id}`}
                      className="font-medium text-ink hover:text-bronze-dark hover:underline dark:hover:text-bronze-light"
                    >
                      {q.serviceType || q.id}
                    </Link>
                    <StatusBadge
                      label={quoteStatusLabel(locale, q.status)}
                      tone={quoteStatusTone[q.status]}
                    />
                    <span className="text-xs text-muted">
                      {formatShortDate(q.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <section className="admin-card lg:col-span-2">
          <h2 className="admin-card-title">{t("pages.customers.detailEditTitle")}</h2>
          <p className="admin-field-hint">{t("pages.customers.detailEditHint")}</p>
          <form className="mt-3 space-y-4" onSubmit={(e) => void onSubmit(e)} noValidate>
            <div className="grid gap-3 sm:grid-cols-2">
              {field("name", t("pages.customers.fieldName"), {
                className: "sm:col-span-2",
                maxLength: 200,
              })}
              {field("email", t("pages.customers.fieldEmail"), {
                type: "email",
                inputMode: "email",
                maxLength: 254,
              })}
              {field("phone", t("pages.customers.fieldPhone"), {
                type: "tel",
                inputMode: "tel",
                maxLength: 40,
              })}
            </div>

            <fieldset className="grid gap-3 sm:grid-cols-6">
              <legend className="admin-card-title mb-2 sm:col-span-6">
                {t("pages.customers.detailAddress")}
              </legend>
              {field("company", t("pages.customers.fieldCompany"), {
                className: "sm:col-span-6",
                maxLength: 200,
              })}
              {field("street", t("pages.customers.fieldStreet"), {
                className: "sm:col-span-6",
                maxLength: 200,
              })}
              {field("city", t("pages.customers.fieldCity"), {
                className: "sm:col-span-3",
                maxLength: 100,
              })}
              {field("state", t("pages.customers.fieldState"), {
                className: "sm:col-span-1",
                maxLength: 50,
              })}
              {field("zip", t("pages.customers.fieldZip"), {
                className: "sm:col-span-2",
                inputMode: "numeric",
                maxLength: 20,
              })}
            </fieldset>

            <div>
              <label htmlFor="customer-notes" className={labelClass}>
                {t("pages.customers.fieldNotes")}
              </label>
              <textarea
                id="customer-notes"
                rows={5}
                className="field-input mt-1.5 resize-y text-sm"
                value={form.notes}
                disabled={busy}
                maxLength={8000}
                onChange={(e) => set("notes", e.target.value)}
                placeholder={t("detail.notesPlaceholder")}
              />
            </div>

            {error ? (
              <p
                role="alert"
                className="rounded-lg border border-danger/25 bg-danger/5 px-3 py-2 text-sm text-danger"
              >
                {error}
              </p>
            ) : null}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={busy || !dirty}
                onClick={() => {
                  setForm(saved);
                  setError(null);
                }}
                className="btn-secondary-light admin-touch text-sm disabled:opacity-60"
              >
                {t("pages.customers.reset")}
              </button>
              <button
                type="submit"
                disabled={busy || !dirty}
                className="btn-primary admin-touch text-sm disabled:opacity-60"
              >
                {busy ? t("common.saving") : t("pages.customers.save")}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

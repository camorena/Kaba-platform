"use client";

import { useToast } from "@/components/admin/Toast";
import {
  fillTemplate,
  FOLLOWUP_TEMPLATES,
  type MessageTemplate,
} from "@/lib/admin/templates-data";
import { useMemo, useState } from "react";
import { useAdminI18n } from "@/components/admin/LocaleProvider";

export default function TemplatesPanel() {
  const toast = useToast();
  const { t: tr } = useAdminI18n();
  const [channel, setChannel] = useState<"all" | MessageTemplate["channel"]>(
    "all",
  );
  const [name, setName] = useState("Jordan");
  const [service, setService] = useState("Wood Fence");
  const [address, setAddress] = useState("Angier, NC");
  const [when, setWhen] = useState("Tue 10am");
  const [amount, setAmount] = useState("$4,850");
  const [invoice, setInvoice] = useState("KF-1002");
  const [previewId, setPreviewId] = useState(FOLLOWUP_TEMPLATES[0]?.id ?? "");

  const vars = useMemo(
    () => ({
      name,
      service,
      address,
      when,
      amount,
      invoice,
    }),
    [name, service, address, when, amount, invoice],
  );

  const list = useMemo(
    () =>
      channel === "all"
        ? FOLLOWUP_TEMPLATES
        : FOLLOWUP_TEMPLATES.filter((t) => t.channel === channel),
    [channel],
  );

  const active = list.find((t) => t.id === previewId) ?? list[0];
  const filled = active ? fillTemplate(active.body, vars) : "";

  async function copyBody() {
    if (!filled) return;
    try {
      await navigator.clipboard.writeText(filled);
      toast.push({ title: tr("templates.copied"), tone: "success" });
    } catch {
      toast.push({ title: tr("common.copyFailed"), tone: "error" });
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="space-y-3 lg:col-span-2">
        <div className="flex flex-wrap gap-1.5">
          {(["all", "sms", "email", "note"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setChannel(c)}
              className={`admin-chip capitalize ${channel === c ? "admin-chip-active" : ""}`}
            >
              {c === "all" ? tr("templates.all") : tr(`templates.${c}`)}
            </button>
          ))}
        </div>
        <ul className="divide-y divide-ink/8 overflow-hidden rounded-xl border border-[color:var(--admin-border)] bg-[var(--admin-panel)]">
          {list.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => setPreviewId(t.id)}
                className={`flex w-full flex-col items-start gap-0.5 px-3 py-2.5 text-left transition hover:bg-[var(--admin-row-hover)] ${
                  active?.id === t.id
                    ? "bg-bronze/10 ring-1 ring-inset ring-bronze/25"
                    : ""
                }`}
              >
                <span className="text-[0.625rem] font-bold uppercase tracking-wider text-bronze">
                  {tr(`templates.${t.channel}`)}
                </span>
                <span className="text-sm font-semibold text-ink">{t.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3 lg:col-span-3">
        <section className="admin-glass-panel admin-gold-rail p-4 sm:p-5">
          <h2 className="admin-card-title">{tr("templates.mergeTitle")}</h2>
          <p className="mt-1 text-xs text-muted">
            {tr("templates.mergeHint")}
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {(
              [
                ["name", name, setName, tr("templates.name")],
                ["service", service, setService, tr("templates.service")],
                ["address", address, setAddress, tr("templates.address")],
                ["when", when, setWhen, tr("templates.when")],
                ["amount", amount, setAmount, tr("templates.amount")],
                ["invoice", invoice, setInvoice, tr("templates.invoice")],
              ] as const
            ).map(([key, val, set, label]) => (
              <label key={key} className="block text-xs font-medium text-muted">
                {label}
                <input
                  className="field-input mt-1 text-sm"
                  value={val}
                  onChange={(e) => set(e.target.value)}
                />
              </label>
            ))}
          </div>
        </section>

        <section className="admin-card">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="admin-card-title">
              {active?.title ?? tr("templates.preview")}
            </h2>
            <button
              type="button"
              onClick={() => void copyBody()}
              className="btn-primary text-sm"
              disabled={!filled}
            >
              {tr("templates.copy")}
            </button>
          </div>
          <pre className="admin-template-preview mt-3 whitespace-pre-wrap rounded-lg border border-ink/8 bg-[var(--admin-bg)] p-3 text-sm leading-relaxed text-ink">
            {filled || tr("templates.select")}
          </pre>
        </section>
      </div>
    </div>
  );
}

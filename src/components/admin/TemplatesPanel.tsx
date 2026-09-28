"use client";

import { useToast } from "@/components/admin/Toast";
import {
  fillTemplate,
  FOLLOWUP_TEMPLATES,
  templateSnippet,
  templateVars,
  type MessageTemplate,
  type TemplateChannel,
} from "@/lib/admin/templates-data";
import { useEffect, useMemo, useState } from "react";
import { useAdminI18n } from "@/components/admin/LocaleProvider";

type ChannelFilter = "all" | TemplateChannel;

const CHANNELS: ChannelFilter[] = ["all", "sms", "email", "note"];

const MERGE_FIELDS = [
  "name",
  "service",
  "address",
  "when",
  "amount",
  "invoice",
] as const;

function channelChipTone(channel: TemplateChannel): string {
  if (channel === "sms") return "admin-settings-chip-info";
  if (channel === "email") return "admin-settings-chip-ok";
  return "";
}

export default function TemplatesPanel() {
  const toast = useToast();
  const { t: tr } = useAdminI18n();
  const [channel, setChannel] = useState<ChannelFilter>("all");
  const [query, setQuery] = useState("");
  const [name, setName] = useState("Jordan");
  const [service, setService] = useState("Wood Fence");
  const [address, setAddress] = useState("Angier, NC");
  const [when, setWhen] = useState("Tue 10am");
  const [amount, setAmount] = useState("$4,850");
  const [invoice, setInvoice] = useState("KF-1002");
  const [previewId, setPreviewId] = useState(FOLLOWUP_TEMPLATES[0]?.id ?? "");
  const [copied, setCopied] = useState(false);

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

  const setters: Record<(typeof MERGE_FIELDS)[number], (v: string) => void> = {
    name: setName,
    service: setService,
    address: setAddress,
    when: setWhen,
    amount: setAmount,
    invoice: setInvoice,
  };

  const channelCounts = useMemo(() => {
    const counts: Record<ChannelFilter, number> = {
      all: FOLLOWUP_TEMPLATES.length,
      sms: 0,
      email: 0,
      note: 0,
    };
    for (const t of FOLLOWUP_TEMPLATES) counts[t.channel] += 1;
    return counts;
  }, []);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FOLLOWUP_TEMPLATES.filter((t) => {
      if (channel !== "all" && t.channel !== channel) return false;
      if (!q) return true;
      const title = tr(`templates.items.${t.titleKey}`).toLowerCase();
      return title.includes(q) || t.body.toLowerCase().includes(q);
    });
  }, [channel, query, tr]);

  useEffect(() => {
    if (list.length === 0) return;
    if (!list.some((t) => t.id === previewId)) {
      setPreviewId(list[0].id);
    }
  }, [list, previewId]);

  const active: MessageTemplate | undefined =
    list.find((t) => t.id === previewId) ?? list[0];
  const filled = active ? fillTemplate(active.body, vars) : "";
  const usedVars = active ? templateVars(active.body) : [];
  const charCount = filled.length;

  const countLabel =
    FOLLOWUP_TEMPLATES.length === 1
      ? tr("templates.countLabel_one", { count: FOLLOWUP_TEMPLATES.length })
      : tr("templates.countLabel", { count: FOLLOWUP_TEMPLATES.length });

  async function copyBody() {
    if (!filled) return;
    try {
      await navigator.clipboard.writeText(filled);
      setCopied(true);
      toast.push({ title: tr("templates.copiedToast"), tone: "success" });
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      toast.push({ title: tr("common.copyFailed"), tone: "error" });
    }
  }

  function clearFilters() {
    setChannel("all");
    setQuery("");
  }

  function channelHint(ch: TemplateChannel): string {
    if (ch === "sms") return tr("templates.smsHint");
    if (ch === "email") return tr("templates.emailHint");
    return tr("templates.noteHint");
  }

  function filterClass(activeFilter: boolean): string {
    return `admin-touch rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
      activeFilter
        ? "bg-bronze/12 text-bronze-dark dark:text-bronze-light"
        : "text-muted hover:bg-[var(--admin-panel)] hover:text-ink"
    }`;
  }

  return (
    <div className="space-y-4">
      {/* Toolbar: soft channel filters + search + quiet count */}
      <div className="admin-toolbar flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1">
          {CHANNELS.map((c) => {
            const label =
              c === "all" ? tr("templates.all") : tr(`templates.${c}`);
            return (
              <button
                key={c}
                type="button"
                onClick={() => setChannel(c)}
                className={filterClass(channel === c)}
                aria-pressed={channel === c}
              >
                {tr("templates.channelCount", {
                  label,
                  count: channelCounts[c],
                })}
              </button>
            );
          })}
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:max-w-xs sm:justify-end">
          <label htmlFor="templates-search" className="sr-only">
            {tr("templates.searchLabel")}
          </label>
          <input
            id="templates-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tr("templates.searchPlaceholder")}
            className="field-input w-full text-sm"
          />
        </div>
      </div>

      <p className="text-[0.6875rem] text-muted">
        {countLabel}
        <span className="text-ink/25"> · </span>
        {tr("templates.footnote")}
      </p>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Library */}
        <div className="space-y-2 lg:col-span-2">
          <h2 className="admin-section-label">{tr("templates.listTitle")}</h2>

          {list.length === 0 ? (
            <div className="admin-empty rounded-xl border border-dashed border-ink/10 bg-[var(--admin-panel)]/60 px-5 py-12 text-center">
              <p className="font-display text-base font-semibold text-ink">
                {tr("templates.emptyTitle")}
              </p>
              <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted">
                {tr("templates.emptyDesc")}
              </p>
              <button
                type="button"
                className="btn-secondary-light admin-touch mt-4 text-sm"
                onClick={clearFilters}
              >
                {tr("templates.clearFilters")}
              </button>
            </div>
          ) : (
            <ul
              className="divide-y divide-ink/8 overflow-hidden rounded-xl border border-[color:var(--admin-border)] bg-[var(--admin-panel)]"
              role="listbox"
              aria-label={tr("templates.listTitle")}
            >
              {list.map((t) => {
                const selected = active?.id === t.id;
                const title = tr(`templates.items.${t.titleKey}`);
                return (
                  <li key={t.id} role="option" aria-selected={selected}>
                    <button
                      type="button"
                      onClick={() => setPreviewId(t.id)}
                      className={`flex w-full flex-col items-start gap-1 px-3 py-2.5 text-left transition hover:bg-[var(--admin-row-hover)] sm:px-3.5 ${
                        selected
                          ? "bg-bronze/8 ring-1 ring-inset ring-bronze/20"
                          : ""
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`admin-settings-chip ${channelChipTone(t.channel)}`}
                        >
                          {tr(`templates.${t.channel}`)}
                        </span>
                      </div>
                      <span className="text-sm font-semibold leading-snug text-ink">
                        {title}
                      </span>
                      <span className="line-clamp-2 text-[0.6875rem] leading-relaxed text-muted">
                        {templateSnippet(t.body, 110)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Merge + preview */}
        <div className="space-y-3 lg:col-span-3">
          <section className="admin-glass-panel p-4 sm:p-5">
            <h2 className="admin-card-title">{tr("templates.mergeTitle")}</h2>
            <p className="mt-1 text-xs text-muted">{tr("templates.mergeHint")}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {MERGE_FIELDS.map((key) => (
                <label key={key} className="block text-xs font-medium text-muted">
                  {tr(`templates.${key}`)}
                  <span className="ml-1 font-normal text-ink/30">{`{{${key}}}`}</span>
                  <input
                    className="field-input mt-1 text-sm"
                    value={vars[key]}
                    onChange={(e) => setters[key](e.target.value)}
                    autoComplete="off"
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="admin-glass-panel p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  {active ? (
                    <span
                      className={`admin-settings-chip ${channelChipTone(active.channel)}`}
                    >
                      {tr(`templates.${active.channel}`)}
                    </span>
                  ) : null}
                  <h2 className="admin-card-title">
                    {active
                      ? tr(`templates.items.${active.titleKey}`)
                      : tr("templates.preview")}
                  </h2>
                </div>
                {active ? (
                  <p className="mt-1 text-[0.6875rem] text-muted">
                    {channelHint(active.channel)}
                    <span className="text-ink/25"> · </span>
                    {tr("templates.chars", { count: charCount })}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => void copyBody()}
                className="btn-primary admin-touch shrink-0 text-sm"
                disabled={!filled}
                title={tr("templates.copyFull")}
              >
                {copied ? tr("templates.copied") : tr("templates.copy")}
              </button>
            </div>

            {usedVars.length > 0 ? (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="text-[0.625rem] font-medium uppercase tracking-wider text-muted">
                  {tr("templates.varsUsed")}
                </span>
                {usedVars.map((v) => (
                  <span
                    key={v}
                    className="rounded-md bg-[color-mix(in_srgb,var(--ink)_5%,transparent)] px-1.5 py-0.5 font-mono text-[0.625rem] text-muted"
                  >
                    {`{{${v}}}`}
                  </span>
                ))}
              </div>
            ) : null}

            <pre className="admin-template-preview mt-3 whitespace-pre-wrap rounded-lg border border-ink/8 bg-[var(--admin-bg)] p-3 text-sm leading-relaxed text-ink sm:p-4">
              {filled || tr("templates.select")}
            </pre>
          </section>
        </div>
      </div>
    </div>
  );
}

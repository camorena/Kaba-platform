"use client";

import type { InvoiceStatus, QuoteStatus } from "@/lib/admin/status";
import { useAdminI18n } from "@/components/admin/LocaleProvider";
import { invoiceStatusLabel, quoteStatusLabel } from "@/lib/admin/i18n";

const QUOTE_FLOW: QuoteStatus[] = [
  "new",
  "contacted",
  "scheduled",
  "won",
];

const INVOICE_FLOW: InvoiceStatus[] = [
  "draft",
  "sent",
  "partial",
  "paid",
];

export function QuoteStatusTimeline({
  status,
}: {
  status: QuoteStatus;
}) {
  const { t, locale } = useAdminI18n();
  if (status === "lost") {
    return (
      <ol className="admin-timeline">
        <li className="admin-timeline-step is-done">
          <span className="admin-timeline-dot" />
          <span className="admin-timeline-label">{t("timeline.pipelineEnded")}</span>
        </li>
        <li className="admin-timeline-step is-active is-lost">
          <span className="admin-timeline-dot" />
          <span className="admin-timeline-label">{quoteStatusLabel(locale, "lost")}</span>
        </li>
      </ol>
    );
  }

  const idx = QUOTE_FLOW.indexOf(status);
  return (
    <ol className="admin-timeline" aria-label={t("timeline.quoteProgress")}>
      {QUOTE_FLOW.map((step, i) => {
        const state =
          i < idx ? "is-done" : i === idx ? "is-active" : "is-todo";
        return (
          <li key={step} className={`admin-timeline-step ${state}`}>
            <span className="admin-timeline-dot" />
            <span className="admin-timeline-label">{quoteStatusLabel(locale, step)}</span>
          </li>
        );
      })}
    </ol>
  );
}

export function InvoiceStatusTimeline({
  status,
}: {
  status: InvoiceStatus;
}) {
  const { t, locale } = useAdminI18n();
  if (status === "void") {
    return (
      <ol className="admin-timeline">
        <li className="admin-timeline-step is-done">
          <span className="admin-timeline-dot" />
          <span className="admin-timeline-label">{t("timeline.issued")}</span>
        </li>
        <li className="admin-timeline-step is-active is-lost">
          <span className="admin-timeline-dot" />
          <span className="admin-timeline-label">{invoiceStatusLabel(locale, "void")}</span>
        </li>
      </ol>
    );
  }

  const idx = INVOICE_FLOW.indexOf(status);
  return (
    <ol className="admin-timeline" aria-label={t("timeline.invoiceProgress")}>
      {INVOICE_FLOW.map((step, i) => {
        const state =
          i < idx ? "is-done" : i === idx ? "is-active" : "is-todo";
        return (
          <li key={step} className={`admin-timeline-step ${state}`}>
            <span className="admin-timeline-dot" />
            <span className="admin-timeline-label">{invoiceStatusLabel(locale, step)}</span>
          </li>
        );
      })}
    </ol>
  );
}

import type { InvoiceStatus, QuoteStatus } from "@/lib/admin/status";

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
  if (status === "lost") {
    return (
      <ol className="admin-timeline">
        <li className="admin-timeline-step is-done">
          <span className="admin-timeline-dot" />
          <span className="admin-timeline-label">Pipeline ended</span>
        </li>
        <li className="admin-timeline-step is-active is-lost">
          <span className="admin-timeline-dot" />
          <span className="admin-timeline-label">Lost</span>
        </li>
      </ol>
    );
  }

  const idx = QUOTE_FLOW.indexOf(status);
  return (
    <ol className="admin-timeline" aria-label="Quote progress">
      {QUOTE_FLOW.map((step, i) => {
        const state =
          i < idx ? "is-done" : i === idx ? "is-active" : "is-todo";
        return (
          <li key={step} className={`admin-timeline-step ${state}`}>
            <span className="admin-timeline-dot" />
            <span className="admin-timeline-label capitalize">{step}</span>
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
  if (status === "void") {
    return (
      <ol className="admin-timeline">
        <li className="admin-timeline-step is-done">
          <span className="admin-timeline-dot" />
          <span className="admin-timeline-label">Issued</span>
        </li>
        <li className="admin-timeline-step is-active is-lost">
          <span className="admin-timeline-dot" />
          <span className="admin-timeline-label">Void</span>
        </li>
      </ol>
    );
  }

  const idx = INVOICE_FLOW.indexOf(status);
  return (
    <ol className="admin-timeline" aria-label="Invoice progress">
      {INVOICE_FLOW.map((step, i) => {
        const state =
          i < idx ? "is-done" : i === idx ? "is-active" : "is-todo";
        return (
          <li key={step} className={`admin-timeline-step ${state}`}>
            <span className="admin-timeline-dot" />
            <span className="admin-timeline-label capitalize">{step}</span>
          </li>
        );
      })}
    </ol>
  );
}

"use client";

import Link from "next/link";
import AdminPageChrome from "@/components/admin/AdminPageChrome";
import EmptyState from "@/components/admin/EmptyState";
import { useAdminI18n } from "@/components/admin/LocaleProvider";
import { formatDateTime } from "@/lib/admin/format";
import {
  invoiceStatusLabel,
  paymentMethodLabel,
  paymentStatusLabel,
  quoteStatusLabel,
} from "@/lib/admin/i18n";
import type { ActivityKind } from "@/lib/admin/activity";

export type ActivityRow = {
  id: string;
  kind: ActivityKind;
  at: string;
  subject: string;
  status: string;
  extra: string;
  href: string;
  tone: string;
};

const toneDot: Record<string, string> = {
  sky: "bg-sky-500",
  amber: "bg-amber-500",
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
  muted: "bg-ink/30",
};

export default function ActivityClient({ feed }: { feed: ActivityRow[] }) {
  const { t, locale } = useAdminI18n();

  function kindLabel(kind: ActivityKind) {
    if (kind === "quote") return t("pages.activity.kindQuote");
    if (kind === "invoice") return t("pages.activity.kindInvoice");
    return t("pages.activity.kindPayment");
  }

  function statusLabel(kind: ActivityKind, status: string) {
    if (kind === "quote") return quoteStatusLabel(locale, status);
    if (kind === "invoice") return invoiceStatusLabel(locale, status);
    return paymentStatusLabel(locale, status);
  }

  return (
    <>
      <AdminPageChrome page="activity" />
      {feed.length === 0 ? (
        <EmptyState
          title={t("pages.activity.emptyTitle")}
          description={t("pages.activity.emptyDesc")}
        />
      ) : (
        <ol className="admin-activity-feed admin-glass-panel admin-gold-rail relative space-y-0 overflow-hidden">
          {feed.map((item, i) => {
            let detail = "";
            if (item.kind === "payment") {
              const [method, customer, payStatus] = item.extra.split(" · ");
              detail = [
                paymentMethodLabel(locale, method),
                customer,
                paymentStatusLabel(locale, payStatus || item.status),
              ]
                .filter(Boolean)
                .join(" · ");
            } else {
              detail = `${statusLabel(item.kind, item.status)} · ${item.extra}`;
            }
            return (
              <li key={item.id} className="admin-activity-item relative">
                {i < feed.length - 1 && (
                  <span className="admin-activity-line" aria-hidden />
                )}
                <span
                  className={`admin-activity-dot ${toneDot[item.tone] ?? toneDot.muted}`}
                  aria-hidden
                />
                <Link
                  href={item.href}
                  className="block rounded-lg px-3 py-3 transition hover:bg-[var(--admin-row-hover)] sm:px-4"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-semibold text-ink">
                      {kindLabel(item.kind)} · {item.subject}
                    </p>
                    <time
                      dateTime={item.at}
                      className="text-[0.6875rem] tabular-nums text-muted"
                    >
                      {formatDateTime(item.at)}
                    </time>
                  </div>
                  <p className="mt-0.5 text-sm text-muted">{detail}</p>
                  <p className="mt-1 text-[0.625rem] font-bold uppercase tracking-wider text-bronze/80">
                    {kindLabel(item.kind)}
                  </p>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </>
  );
}

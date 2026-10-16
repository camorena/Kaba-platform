"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useAdminI18n } from "@/components/admin/LocaleProvider";
import { formatMoney } from "@/lib/admin/format";
import type { AdminLocale } from "@/lib/admin/i18n";
import type { AdminNotification } from "@/lib/admin/notifications-derive";
import { chicagoYmd } from "@/lib/db/visits";

type FeedResponse = {
  items: AdminNotification[];
  unreadCount: number;
  total: number;
};

const POLL_MS = 60_000;

function rtf(locale: AdminLocale) {
  return new Intl.RelativeTimeFormat(locale === "es" ? "es-CO" : "en-US", {
    numeric: "auto",
  });
}

/** "hace 26 h", "hace 3 d", "hace 5 min" — from an ISO instant. */
function relativeFromNow(iso: string, locale: AdminLocale, now: number): string {
  const diffMs = new Date(iso).getTime() - now;
  const abs = Math.abs(diffMs);
  const f = rtf(locale);
  if (abs < 60 * 60_000) return f.format(Math.round(diffMs / 60_000), "minute");
  if (abs < 48 * 3_600_000) return f.format(Math.round(diffMs / 3_600_000), "hour");
  return f.format(Math.round(diffMs / 86_400_000), "day");
}

/** "hoy", "mañana", "pasado mañana" — calendar days in America/Chicago. */
function relativeDay(ymd: string, locale: AdminLocale, now: number): string {
  const today = chicagoYmd(new Date(now));
  const toUtc = (d: string) => {
    const [y, m, dd] = d.split("-").map(Number);
    return Date.UTC(y, m - 1, dd);
  };
  const days = Math.round((toUtc(ymd) - toUtc(today)) / 86_400_000);
  return rtf(locale).format(days, "day");
}

function joinParts(parts: Array<string | number | undefined>): string {
  return parts
    .map((p) => (p === undefined ? "" : String(p).trim()))
    .filter(Boolean)
    .join(" · ");
}

function describe(
  n: AdminNotification,
  t: (key: string, vars?: Record<string, string | number>) => string,
): { title: string; body: string } {
  const v = n.vars;
  switch (n.kind) {
    case "quote_new":
      return {
        title: t("notifications.quoteNewTitle", { name: v.name }),
        body: joinParts([
          v.service,
          v.city,
          Number(v.days) >= 1
            ? t("notifications.quoteNewBody", { days: v.days })
            : t("notifications.quoteNewBodyToday"),
        ]),
      };
    case "quote_quiet":
      return {
        title: t("notifications.quoteQuietTitle", { name: v.name }),
        body: t("notifications.quoteQuietBody", { days: v.days }),
      };
    case "notify_failed":
      return {
        title: t("notifications.notifyFailedTitle", { name: v.name }),
        body: t("notifications.notifyFailedBody", { attempts: v.attempts }),
      };
    case "visit_upcoming":
      return {
        title: t(
          Number(v.install) ? "notifications.installTitle" : "notifications.visitTitle",
          { name: v.name },
        ),
        body: joinParts([v.service, v.city]),
      };
    case "visit_reminder_missing":
      return {
        title: t("notifications.reminderMissingTitle", { name: v.name }),
        body: t("notifications.reminderMissingBody"),
      };
    case "invoice_open":
      return {
        title: t("notifications.invoiceOpenTitle", { number: v.number }),
        body: t("notifications.invoiceOpenBody", {
          name: v.name,
          amount: formatMoney(Number(v.balanceCents) || 0),
        }),
      };
    case "payment_received":
      return {
        title: t("notifications.paymentTitle", { number: v.number }),
        body: t("notifications.paymentBody", {
          name: v.name,
          amount: formatMoney(Number(v.amountCents) || 0),
        }),
      };
  }
}

export default function NotificationCenter() {
  const { t, locale } = useAdminI18n();
  const [open, setOpen] = useState(false);
  const [feed, setFeed] = useState<FeedResponse | null>(null);
  const [error, setError] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/notifications", { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as FeedResponse;
      setFeed(data);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setNow(Date.now());
    }
  }, []);

  // Initial load + 60s poll while the tab is visible; refresh on return to tab.
  useEffect(() => {
    let timer: number | null = null;
    const start = () => {
      if (timer === null) timer = window.setInterval(() => void load(), POLL_MS);
    };
    const stop = () => {
      if (timer !== null) window.clearInterval(timer);
      timer = null;
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        void load();
        start();
      } else {
        stop();
      }
    };
    // Deferred so the first fetch runs outside the effect body.
    const first = window.setTimeout(() => void load(), 0);
    if (document.visibilityState === "visible") start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearTimeout(first);
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [load]);

  const items = feed?.items ?? [];
  const unreadCount = feed?.unreadCount ?? 0;

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    // Mobile sheet: lock scroll behind overlay
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches) {
      document.body.style.overflow = "hidden";
    }
    // Prefer focus close on sheet open for a11y
    requestAnimationFrame(() => closeBtnRef.current?.focus?.());
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  async function postRead(body: { keys: string[] } | { all: true }) {
    try {
      await fetch("/api/admin/notifications/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } finally {
      void load();
    }
  }

  function markOne(key: string) {
    setFeed((prev) => {
      if (!prev) return prev;
      const target = prev.items.find((n) => n.key === key);
      if (!target?.unread) return prev;
      return {
        ...prev,
        unreadCount: Math.max(0, prev.unreadCount - 1),
        items: prev.items.map((n) => (n.key === key ? { ...n, unread: false } : n)),
      };
    });
    void postRead({ keys: [key] });
  }

  function markAll() {
    setFeed((prev) =>
      prev
        ? { ...prev, unreadCount: 0, items: prev.items.map((n) => ({ ...n, unread: false })) }
        : prev,
    );
    void postRead({ all: true });
  }

  function toggle() {
    setOpen((v) => {
      if (!v) void load();
      return !v;
    });
  }

  function close() {
    setOpen(false);
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className="admin-touch relative inline-flex h-11 w-11 items-center justify-center rounded-md text-cream/70 transition hover:bg-white/10 hover:text-cream"
        aria-label={
          unreadCount
            ? t("notifications.unread", { count: unreadCount })
            : t("notifications.label")
        }
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-bronze px-1 text-[0.5625rem] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Mobile dismissible overlay */}
          <button
            type="button"
            className="admin-notify-backdrop sm:hidden"
            aria-label={t("notifications.close")}
            onClick={close}
          />
          <div
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label={t("notifications.label")}
            className="admin-notify-panel"
          >
            <div className="admin-cmd-rail" aria-hidden />
            <div className="flex items-start justify-between gap-3 border-b border-ink/8 px-3 py-2.5 sm:px-3.5">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-muted">
                  {t("notifications.label")}
                </p>
                <button
                  type="button"
                  className="admin-touch mt-1 inline-flex min-h-9 items-center text-[0.6875rem] font-semibold text-bronze-dark hover:underline disabled:cursor-default disabled:opacity-50 disabled:no-underline dark:text-bronze-light"
                  onClick={markAll}
                  disabled={unreadCount === 0}
                >
                  {t("notifications.markAll")}
                </button>
              </div>
              <button
                ref={closeBtnRef}
                type="button"
                className="admin-touch inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-muted transition hover:bg-[var(--admin-row-hover)] hover:text-ink sm:h-9 sm:w-9"
                aria-label={t("notifications.close")}
                onClick={close}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {feed === null && !error ? (
              <p className="px-3 py-6 text-center text-xs text-muted sm:px-3.5" role="status">
                {t("notifications.loading")}
              </p>
            ) : error && feed === null ? (
              <div className="px-3 py-6 text-center sm:px-3.5" role="alert">
                <p className="text-xs text-muted">{t("notifications.loadError")}</p>
                <button
                  type="button"
                  className="admin-touch mt-2 inline-flex min-h-9 items-center text-[0.6875rem] font-semibold text-bronze-dark hover:underline dark:text-bronze-light"
                  onClick={() => void load()}
                >
                  {t("notifications.retry")}
                </button>
              </div>
            ) : items.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted sm:px-3.5" role="status">
                {t("notifications.empty")}
              </p>
            ) : (
              <ul className="max-h-[min(24rem,calc(100dvh-8rem))] divide-y divide-ink/6 overflow-y-auto overscroll-contain sm:max-h-[min(20rem,50vh)]">
                {items.map((n) => {
                  const { title, body } = describe(n, t);
                  const when = n.day
                    ? relativeDay(n.day, locale, now)
                    : relativeFromNow(n.at, locale, now);
                  return (
                    <li key={n.key}>
                      <Link
                        href={n.href}
                        className="admin-touch block px-3 py-3 transition hover:bg-[var(--admin-row-hover)] sm:px-3.5 sm:py-2.5"
                        onClick={() => {
                          markOne(n.key);
                          setOpen(false);
                        }}
                      >
                        <div className="flex items-start gap-2.5">
                          {n.unread ? (
                            <span
                              className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                                n.severity === "urgent" ? "bg-danger" : "bg-bronze"
                              }`}
                              aria-hidden
                            />
                          ) : (
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0" aria-hidden />
                          )}
                          <div className="min-w-0 flex-1">
                            <p
                              className={`break-words text-sm leading-snug text-ink ${
                                n.unread ? "font-semibold" : "font-medium"
                              }`}
                            >
                              {title}
                            </p>
                            {body ? (
                              <p className="admin-notify-body mt-1 text-xs leading-relaxed text-muted">
                                {body}
                              </p>
                            ) : null}
                            <p className="mt-1.5 text-[0.625rem] text-muted-light">
                              {when}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
            <p className="border-t border-ink/8 px-3 py-2.5 text-[0.625rem] leading-relaxed text-muted sm:px-3.5">
              {t("notifications.footer")}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

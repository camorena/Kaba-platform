"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useAdminI18n } from "@/components/admin/LocaleProvider";

type StubNote = {
  id: string;
  titleKey: string;
  bodyKey: string;
  timeKey: string;
  href: string;
  unread?: boolean;
};

const STUB: StubNote[] = [
  {
    id: "n1",
    titleKey: "notifications.n1title",
    bodyKey: "notifications.n1body",
    timeKey: "notifications.time26h",
    href: "/admin/quotes/q_seed_1",
    unread: true,
  },
  {
    id: "n2",
    titleKey: "notifications.n2title",
    bodyKey: "notifications.n2body",
    timeKey: "notifications.time2d",
    href: "/admin/calendar",
    unread: true,
  },
  {
    id: "n3",
    titleKey: "notifications.n3title",
    bodyKey: "notifications.n3body",
    timeKey: "notifications.time3d",
    href: "/admin/invoices",
  },
];

export default function NotificationCenter() {
  const { t } = useAdminI18n();
  const [open, setOpen] = useState(false);
  const [read, setRead] = useState<Set<string>>(new Set());
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const unreadCount = useMemo(
    () => STUB.filter((n) => n.unread && !read.has(n.id)).length,
    [read],
  );

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

  function markAll() {
    setRead(new Set(STUB.map((n) => n.id)));
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
        onClick={() => setOpen((v) => !v)}
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
                  className="admin-touch mt-1 inline-flex min-h-9 items-center text-[0.6875rem] font-semibold text-bronze-dark hover:underline dark:text-bronze-light"
                  onClick={markAll}
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
            <ul className="max-h-[min(24rem,calc(100dvh-8rem))] divide-y divide-ink/6 overflow-y-auto overscroll-contain sm:max-h-[min(20rem,50vh)]">
              {STUB.map((n) => {
                const isUnread = Boolean(n.unread && !read.has(n.id));
                return (
                  <li key={n.id}>
                    <Link
                      href={n.href}
                      className="admin-touch block px-3 py-3 transition hover:bg-[var(--admin-row-hover)] sm:px-3.5 sm:py-2.5"
                      onClick={() => {
                        setRead((prev) => new Set(prev).add(n.id));
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-start gap-2.5">
                        {isUnread ? (
                          <span
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-bronze"
                            aria-hidden
                          />
                        ) : (
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0" aria-hidden />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="break-words text-sm font-semibold leading-snug text-ink">
                            {t(n.titleKey)}
                          </p>
                          <p className="admin-notify-body mt-1 text-xs leading-relaxed text-muted">
                            {t(n.bodyKey)}
                          </p>
                          <p className="mt-1.5 text-[0.625rem] text-muted-light">
                            {t(n.timeKey)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <p className="border-t border-ink/8 px-3 py-2.5 text-[0.625rem] leading-relaxed text-muted sm:px-3.5">
              {t("notifications.stubFooter")}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

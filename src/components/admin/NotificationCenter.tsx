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
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function markAll() {
    setRead(new Set(STUB.map((n) => n.id)));
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className="admin-touch relative rounded-md p-2 text-cream/70 transition hover:bg-white/10 hover:text-cream"
        aria-label={
          unreadCount
            ? t("notifications.unread", { count: unreadCount })
            : t("notifications.label")
        }
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-bronze px-1 text-[0.5625rem] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label={t("notifications.label")}
          className="admin-notify-panel absolute right-0 top-[calc(100%+0.4rem)] z-50 w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-[color:var(--admin-border)] bg-[var(--admin-panel)] text-ink shadow-[var(--shadow-lg)]"
        >
          <div className="admin-cmd-rail" aria-hidden />
          <div className="flex items-center justify-between gap-2 border-b border-ink/8 px-3 py-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">
              {t("notifications.label")}
            </p>
            <button
              type="button"
              className="text-[0.6875rem] font-semibold text-bronze-dark hover:underline dark:text-bronze-light"
              onClick={markAll}
            >
              {t("notifications.markAll")}
            </button>
          </div>
          <ul className="max-h-[min(20rem,50vh)] divide-y divide-ink/6 overflow-y-auto">
            {STUB.map((n) => {
              const isUnread = Boolean(n.unread && !read.has(n.id));
              return (
                <li key={n.id}>
                  <Link
                    href={n.href}
                    className="block px-3 py-2.5 transition hover:bg-[var(--admin-row-hover)]"
                    onClick={() => {
                      setRead((prev) => new Set(prev).add(n.id));
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-start gap-2">
                      {isUnread && (
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-bronze"
                          aria-hidden
                        />
                      )}
                      <div className={isUnread ? "" : "pl-3.5"}>
                        <p className="text-sm font-semibold text-ink">
                          {t(n.titleKey)}
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-muted">
                          {t(n.bodyKey)}
                        </p>
                        <p className="mt-1 text-[0.625rem] text-muted-light">
                          {t(n.timeKey)}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="border-t border-ink/8 px-3 py-2 text-[0.625rem] leading-relaxed text-muted">
            {t("notifications.stubFooter")}
          </p>
        </div>
      )}
    </div>
  );
}

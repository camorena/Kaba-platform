"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";

type StubNote = {
  id: string;
  title: string;
  body: string;
  href: string;
  time: string;
  unread?: boolean;
};

const STUB: StubNote[] = [
  {
    id: "n1",
    title: "New quote · Jordan Miles",
    body: "Wood fence request from Angier — needs first contact.",
    href: "/admin/quotes/q_seed_1",
    time: "26h ago",
    unread: true,
  },
  {
    id: "n2",
    title: "Site visit tomorrow",
    body: "Chris Nguyen · vinyl privacy · Fuquay-Varina.",
    href: "/admin/calendar",
    time: "2d ago",
    unread: true,
  },
  {
    id: "n3",
    title: "Invoice balance open",
    body: "Demo AR still has an open balance — record a stub payment.",
    href: "/admin/invoices",
    time: "3d ago",
  },
];

export default function NotificationCenter() {
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
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
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
          aria-label="Notifications"
          className="admin-notify-panel absolute right-0 top-[calc(100%+0.4rem)] z-50 w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-[color:var(--admin-border)] bg-[var(--admin-panel)] text-ink shadow-[var(--shadow-lg)]"
        >
          <div className="admin-cmd-rail" aria-hidden />
          <div className="flex items-center justify-between gap-2 border-b border-ink/8 px-3 py-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">
              Notifications
            </p>
            <button
              type="button"
              className="text-[0.6875rem] font-semibold text-bronze-dark hover:underline dark:text-bronze-light"
              onClick={markAll}
            >
              Mark all read
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
                        <p className="text-sm font-semibold text-ink">{n.title}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-muted">
                          {n.body}
                        </p>
                        <p className="mt-1 text-[0.625rem] text-muted-light">{n.time}</p>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="border-t border-ink/8 px-3 py-2 text-[0.625rem] leading-relaxed text-muted">
            Stub feed — no push, email, or realtime yet. Wired for craft only.
          </p>
        </div>
      )}
    </div>
  );
}

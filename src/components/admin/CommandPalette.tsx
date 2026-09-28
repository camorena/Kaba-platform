"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

type NavItem = { href: string; label: string; group: string; keywords?: string };

const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", group: "Navigate", keywords: "home overview" },
  { href: "/admin/quotes", label: "Quotes", group: "Navigate", keywords: "leads table" },
  { href: "/admin/pipeline", label: "Pipeline", group: "Navigate", keywords: "kanban board stages drag" },
  { href: "/admin/invoices", label: "Invoices", group: "Navigate", keywords: "billing" },
  { href: "/admin/payments", label: "Payments", group: "Navigate", keywords: "money ledger" },
  { href: "/admin/customers", label: "Customers", group: "Navigate", keywords: "contacts crm" },
  { href: "/admin/calendar", label: "Schedule", group: "Navigate", keywords: "calendar jobs visits" },
  { href: "/admin/pricebook", label: "Price book", group: "Navigate", keywords: "rates estimate calculator materials" },
  { href: "/admin/templates", label: "Templates", group: "Navigate", keywords: "sms email follow-up copy" },
  { href: "/admin/activity", label: "Activity", group: "Navigate", keywords: "feed timeline log" },
  { href: "/admin/reports", label: "Reports", group: "Navigate", keywords: "charts analytics" },
  { href: "/admin/settings", label: "Settings", group: "Navigate", keywords: "auth env" },
];

type QuoteHit = {
  id: string;
  name: string;
  serviceType: string;
  address: string;
  status: string;
};

export default function CommandPalette({
  open,
  onClose,
  onOpenShortcuts,
}: {
  open: boolean;
  onClose: () => void;
  onOpenShortcuts?: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [quotes, setQuotes] = useState<QuoteHit[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActive(0);
      return;
    }
    const t = window.setTimeout(() => inputRef.current?.focus(), 30);
    if (!loaded) {
      void fetch("/api/quotes")
        .then((r) => (r.ok ? r.json() : null))
        .then((data: { quotes?: QuoteHit[] } | null) => {
          if (data?.quotes) {
            setQuotes(
              data.quotes.map((q) => ({
                id: q.id,
                name: q.name,
                serviceType: q.serviceType,
                address: q.address,
                status: q.status,
              })),
            );
          }
          setLoaded(true);
        })
        .catch(() => setLoaded(true));
    }
    return () => window.clearTimeout(t);
  }, [open, loaded]);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    const navHits = NAV.filter((n) => {
      if (!q) return true;
      return `${n.label} ${n.keywords ?? ""}`.toLowerCase().includes(q);
    }).map((n) => ({
      key: n.href,
      href: n.href,
      title: n.label,
      subtitle: n.group,
      kind: "nav" as const,
    }));

    const quoteHits = quotes
      .filter((row) => {
        if (!q) return false;
        return [row.name, row.serviceType, row.address, row.status, row.id]
          .join(" ")
          .toLowerCase()
          .includes(q);
      })
      .slice(0, 8)
      .map((row) => ({
        key: row.id,
        href: `/admin/quotes/${row.id}`,
        title: row.name,
        subtitle: `${row.serviceType} · ${row.address} · ${row.status}`,
        kind: "quote" as const,
      }));

    const actions: {
      key: string;
      href?: string;
      title: string;
      subtitle: string;
      kind: "action";
      run?: () => void;
    }[] = [];

    if (!q || "shortcuts keyboard help".includes(q)) {
      actions.push({
        key: "shortcuts",
        title: "Keyboard shortcuts",
        subtitle: "Cheat sheet",
        kind: "action",
        run: () => {
          onClose();
          onOpenShortcuts?.();
        },
      });
    }

    return [...navHits, ...quoteHits, ...actions];
  }, [query, quotes, onClose, onOpenShortcuts]);

  useEffect(() => {
    setActive(0);
  }, [query, open]);

  const go = useCallback(
    (index: number) => {
      const item = items[index];
      if (!item) return;
      if (item.kind === "action" && "run" in item && item.run) {
        item.run();
        return;
      }
      if (item.href) {
        onClose();
        router.push(item.href);
      }
    },
    [items, onClose, router],
  );

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => Math.min(i + 1, Math.max(items.length - 1, 0)));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        go(active);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, active, items.length, go, onClose]);

  if (!open) return null;

  return (
    <div className="admin-cmd-root" role="presentation">
      <button
        type="button"
        className="admin-cmd-backdrop"
        aria-label="Close command palette"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="admin-cmd-panel"
      >
        <div className="admin-cmd-rail" aria-hidden />
        <div className="flex items-center gap-2 border-b border-ink/8 px-3 py-2.5">
          <svg
            className="h-4 w-4 shrink-0 text-bronze"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
            />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to page, quote, or action…"
            className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
            aria-controls={listId}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="admin-kbd hidden sm:inline">esc</kbd>
        </div>
        <ul
          id={listId}
          role="listbox"
          className="max-h-[min(22rem,50vh)] overflow-y-auto py-1.5"
        >
          {items.length === 0 ? (
            <li className="px-4 py-8 text-center text-sm text-muted">
              No matches — try a name, service, or page.
            </li>
          ) : (
            items.map((item, i) => (
              <li key={item.key} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  className={`admin-cmd-item ${i === active ? "is-active" : ""}`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(i)}
                >
                  <span className="min-w-0 flex-1 text-left">
                    <span className="block truncate text-sm font-semibold text-ink">
                      {item.title}
                    </span>
                    <span className="block truncate text-[0.6875rem] text-muted">
                      {item.subtitle}
                    </span>
                  </span>
                  <span className="shrink-0 text-[0.625rem] font-bold uppercase tracking-wider text-bronze/80">
                    {item.kind === "quote"
                      ? "Quote"
                      : item.kind === "action"
                        ? "Action"
                        : "Go"}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
        <div className="flex items-center justify-between border-t border-ink/8 px-3 py-2 text-[0.625rem] text-muted">
          <span>↑↓ navigate · ↵ open</span>
          <span>Quotes search as you type</span>
        </div>
      </div>
    </div>
  );
}

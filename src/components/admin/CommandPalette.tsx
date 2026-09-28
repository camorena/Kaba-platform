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
import { useAdminI18n } from "@/components/admin/LocaleProvider";
import { navLabelKey } from "@/lib/admin/i18n";

const NAV_BASE: { href: string; keywords?: string }[] = [
  { href: "/admin", keywords: "home overview panel dashboard" },
  { href: "/admin/quotes", keywords: "leads table cotizaciones" },
  { href: "/admin/pipeline", keywords: "kanban board stages drag embudo" },
  { href: "/admin/invoices", keywords: "billing facturas" },
  { href: "/admin/payments", keywords: "money ledger pagos" },
  { href: "/admin/customers", keywords: "contacts crm clientes" },
  { href: "/admin/calendar", keywords: "calendar jobs visits agenda" },
  { href: "/admin/pricebook", keywords: "rates estimate calculator materials precios" },
  { href: "/admin/templates", keywords: "sms email follow-up copy plantillas" },
  { href: "/admin/activity", keywords: "feed timeline log actividad" },
  { href: "/admin/reports", keywords: "charts analytics informes" },
  { href: "/admin/content", keywords: "cms fence types services projects faqs contenido" },
  { href: "/admin/settings", keywords: "auth env configuración" },
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
  const { t } = useAdminI18n();
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
    const navHits = NAV_BASE.filter((n) => {
      const label = t(navLabelKey(n.href));
      if (!q) return true;
      return `${label} ${n.keywords ?? ""}`.toLowerCase().includes(q);
    }).map((n) => ({
      key: n.href,
      href: n.href,
      title: t(navLabelKey(n.href)),
      subtitle: t("cmd.groupNavigate"),
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
        title: t("cmd.shortcuts"),
        subtitle: t("cmd.cheatSheet"),
        kind: "action",
        run: () => {
          onClose();
          onOpenShortcuts?.();
        },
      });
    }

    return [...navHits, ...quoteHits, ...actions];
  }, [query, quotes, onClose, onOpenShortcuts, t]);

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
        aria-label={t("cmd.close")}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("cmd.label")}
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
            placeholder={t("cmd.placeholder")}
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
              {t("cmd.empty")}
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
                      ? t("cmd.quote")
                      : item.kind === "action"
                        ? t("cmd.action")
                        : t("cmd.go")}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
        <div className="flex items-center justify-between border-t border-ink/8 px-3 py-2 text-[0.625rem] text-muted">
          <span>{t("cmd.footerNav")}</span>
          <span>{t("cmd.footerSearch")}</span>
        </div>
      </div>
    </div>
  );
}

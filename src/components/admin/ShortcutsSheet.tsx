"use client";

import { useEffect } from "react";
import { useAdminI18n } from "@/components/admin/LocaleProvider";

export default function ShortcutsSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useAdminI18n();

  const ROWS: { keys: string[]; actionKey: string }[] = [
    { keys: ["⌘", "K"], actionKey: "shortcuts.a1" },
    { keys: ["Ctrl", "K"], actionKey: "shortcuts.a2" },
    { keys: ["?"], actionKey: "shortcuts.a3" },
    { keys: ["Esc"], actionKey: "shortcuts.a4" },
    { keys: ["↑", "↓"], actionKey: "shortcuts.a5" },
    { keys: ["↵"], actionKey: "shortcuts.a6" },
  ];

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="admin-cmd-root" role="presentation">
      <button
        type="button"
        className="admin-cmd-backdrop"
        aria-label={t("shortcuts.close")}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-shortcuts-title"
        className="admin-cmd-panel admin-shortcuts-panel"
      >
        <div className="admin-cmd-rail" aria-hidden />
        <div className="border-b border-ink/8 px-4 py-3">
          <h2
            id="admin-shortcuts-title"
            className="font-display text-lg font-semibold tracking-tight text-ink"
          >
            {t("shortcuts.title")}
          </h2>
          <p className="mt-0.5 text-xs text-muted">{t("shortcuts.sub")}</p>
        </div>
        <ul className="divide-y divide-ink/6 px-2 py-2">
          {ROWS.map((row) => (
            <li
              key={row.actionKey}
              className="flex items-center justify-between gap-3 px-2 py-2.5"
            >
              <span className="text-sm text-ink">{t(row.actionKey)}</span>
              <span className="flex shrink-0 items-center gap-1">
                {row.keys.map((k) => (
                  <kbd key={k} className="admin-kbd">
                    {k}
                  </kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
        <div className="border-t border-ink/8 px-4 py-2.5 text-[0.6875rem] text-muted">
          {t("shortcuts.tip")}
        </div>
      </div>
    </div>
  );
}

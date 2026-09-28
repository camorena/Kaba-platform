"use client";

import { useEffect } from "react";

const ROWS: { keys: string[]; action: string }[] = [
  { keys: ["⌘", "K"], action: "Open command palette" },
  { keys: ["Ctrl", "K"], action: "Open command palette (Windows/Linux)" },
  { keys: ["?"], action: "Show this shortcuts sheet" },
  { keys: ["Esc"], action: "Close palette / sheet" },
  { keys: ["↑", "↓"], action: "Move selection in palette" },
  { keys: ["↵"], action: "Open selected palette item" },
];

export default function ShortcutsSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
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
        aria-label="Close shortcuts"
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
            Keyboard shortcuts
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            Agency-speed navigation — no extensions required.
          </p>
        </div>
        <ul className="divide-y divide-ink/6 px-2 py-2">
          {ROWS.map((row) => (
            <li
              key={row.action}
              className="flex items-center justify-between gap-3 px-2 py-2.5"
            >
              <span className="text-sm text-ink">{row.action}</span>
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
          Tip: open the palette, then type a customer name to jump into a quote.
        </div>
      </div>
    </div>
  );
}

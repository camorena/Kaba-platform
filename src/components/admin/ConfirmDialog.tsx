"use client";

import { useEffect, useId, useRef } from "react";
import { useAdminI18n } from "@/components/admin/LocaleProvider";

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  tone = "danger",
  busy = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "default";
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const titleId = useId();
  const descId = useId();
  const confirmRef = useRef<HTMLButtonElement>(null);
  const { t } = useAdminI18n();
  const confirmText = confirmLabel ?? t("common.confirm");
  const cancelText = cancelLabel ?? t("common.cancel");

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    confirmRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="admin-dialog-root" role="presentation">
      <button
        type="button"
        className="admin-dialog-backdrop"
        aria-label={t("common.dismiss")}
        onClick={onCancel}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className="admin-dialog-panel"
      >
        <div className="admin-cmd-rail" aria-hidden />
        <div className="p-4 sm:p-5">
          <h2 id={titleId} className="font-display text-lg font-semibold text-ink">
            {title}
          </h2>
          {description && (
            <p id={descId} className="mt-2 text-sm leading-relaxed text-muted">
              {description}
            </p>
          )}
          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="admin-touch btn-secondary-light text-sm"
              onClick={onCancel}
              disabled={busy}
            >
              {cancelText}
            </button>
            <button
              ref={confirmRef}
              type="button"
              className={`admin-touch text-sm font-bold uppercase tracking-[0.06em] ${
                tone === "danger"
                  ? "rounded-md bg-rose-700 px-3.5 py-2 text-white shadow-sm transition hover:brightness-105 disabled:opacity-50"
                  : "btn-primary"
              }`}
              onClick={onConfirm}
              disabled={busy}
            >
              {busy ? t("common.working") : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

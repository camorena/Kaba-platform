"use client";

import { useToast } from "@/components/admin/Toast";
import { useAdminI18n } from "@/components/admin/LocaleProvider";
import {
  DEFAULT_TRUST_CLAIMS,
  readTrustClaimsClient,
  writeTrustClaimsClient,
  type TrustClaims,
} from "@/lib/admin/trust-claims";
import { useEffect, useState } from "react";

export default function SettingsTrustClaims() {
  const toast = useToast();
  const { t } = useAdminI18n();
  const [claims, setClaims] = useState<TrustClaims>(DEFAULT_TRUST_CLAIMS);
  const [hydrated, setHydrated] = useState(false);
  const [busy, setBusy] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    setClaims(readTrustClaimsClient());
    setHydrated(true);
  }, []);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    await new Promise((r) => setTimeout(r, 200));
    const next = writeTrustClaimsClient({
      claimFreeEstimates: claims.claimFreeEstimates,
      claimLocallyOwned: claims.claimLocallyOwned,
    });
    setClaims(next);
    setSavedAt(next.updatedAt);
    setBusy(false);
    toast.push({
      title: t("pages.settings.trustSavedTitle"),
      description: t("pages.settings.trustSavedDesc"),
      tone: "success",
    });
  }

  return (
    <form
      id="settings-trust"
      onSubmit={onSave}
      className="admin-glass-panel admin-gold-rail scroll-mt-24 p-4 sm:p-5"
      noValidate
      aria-labelledby="settings-trust-title"
    >
      <div className="flex flex-wrap items-center gap-2">
        <p className="admin-section-label">{t("pages.settings.navTrust")}</p>
        <span className="admin-badge admin-badge-amber rounded-full px-2 py-0.5 text-[0.5625rem] font-bold uppercase tracking-[0.1em]">
          {t("pages.settings.trustBadge")}
        </span>
      </div>
      <h2 id="settings-trust-title" className="admin-card-title mt-1">
        {t("pages.settings.trustTitle")}
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
        {t("pages.settings.trustBody")}
      </p>

      <fieldset className="mt-5 space-y-4" disabled={!hydrated || busy}>
        <legend className="sr-only">{t("pages.settings.trustTitle")}</legend>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-row-hover)]/40 px-3 py-3 transition hover:border-bronze/35">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 shrink-0 rounded border-ink/25 text-bronze focus:ring-bronze"
            checked={claims.claimFreeEstimates}
            onChange={(e) => {
              setClaims((c) => ({ ...c, claimFreeEstimates: e.target.checked }));
              setSavedAt(null);
            }}
            aria-describedby="claim-free-hint"
          />
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-ink">
              {t("pages.settings.trustFreeEstimates")}
            </span>
            <span id="claim-free-hint" className="mt-0.5 block text-xs leading-relaxed text-muted">
              {t("pages.settings.trustFreeEstimatesHint")}
            </span>
          </span>
        </label>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-row-hover)]/40 px-3 py-3 transition hover:border-bronze/35">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 shrink-0 rounded border-ink/25 text-bronze focus:ring-bronze"
            checked={claims.claimLocallyOwned}
            onChange={(e) => {
              setClaims((c) => ({ ...c, claimLocallyOwned: e.target.checked }));
              setSavedAt(null);
            }}
            aria-describedby="claim-local-hint"
          />
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-ink">
              {t("pages.settings.trustLocallyOwned")}
            </span>
            <span id="claim-local-hint" className="mt-0.5 block text-xs leading-relaxed text-muted">
              {t("pages.settings.trustLocallyOwnedHint")}
            </span>
          </span>
        </label>
      </fieldset>

      <aside className="admin-settings-callout mt-4" role="note">
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-amber-950 dark:text-amber-100">
          {t("pages.settings.trustPublicNoteLabel")}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-amber-950/90 dark:text-amber-100/90">
          {t("pages.settings.trustPublicNote")}
        </p>
      </aside>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-[var(--admin-border)] pt-4">
        <button type="submit" className="admin-touch btn-primary text-sm" disabled={!hydrated || busy}>
          {busy ? t("pages.settings.trustSaving") : t("pages.settings.trustSave")}
        </button>
        {savedAt || claims.updatedAt ? (
          <p className="admin-settings-saved" role="status">
            <span className="admin-settings-saved-dot" aria-hidden />
            {t("pages.settings.trustSavedInline")}
          </p>
        ) : (
          <p className="text-[0.6875rem] leading-relaxed text-muted">
            {t("pages.settings.trustStorageHint")}
          </p>
        )}
      </div>
    </form>
  );
}

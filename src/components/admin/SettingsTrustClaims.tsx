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

type StorageKind = "server" | "local" | "unknown";

export default function SettingsTrustClaims() {
  const toast = useToast();
  const { t } = useAdminI18n();
  const [claims, setClaims] = useState<TrustClaims>(DEFAULT_TRUST_CLAIMS);
  const [hydrated, setHydrated] = useState(false);
  const [busy, setBusy] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [storage, setStorage] = useState<StorageKind>("unknown");
  const [adapter, setAdapter] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/trust-claims", {
          method: "GET",
          credentials: "same-origin",
        });
        if (res.ok) {
          const data = (await res.json()) as {
            claims?: TrustClaims;
            adapter?: string;
            storage?: string;
          };
          if (!cancelled && data.claims) {
            setClaims(data.claims);
            setSavedAt(data.claims.updatedAt);
            setStorage("server");
            setAdapter(data.adapter ?? null);
            setHydrated(true);
            return;
          }
        }
      } catch {
        /* fall through to localStorage */
      }
      if (!cancelled) {
        const local = readTrustClaimsClient();
        setClaims(local);
        setSavedAt(local.updatedAt);
        setStorage("local");
        setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const patch = {
      claimFreeEstimates: claims.claimFreeEstimates,
      claimLocallyOwned: claims.claimLocallyOwned,
    };

    try {
      const res = await fetch("/api/admin/trust-claims", {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          claims?: TrustClaims;
          adapter?: string;
        };
        const next = data.claims ?? {
          ...patch,
          updatedAt: new Date().toISOString(),
        };
        setClaims(next);
        setSavedAt(next.updatedAt);
        setStorage("server");
        setAdapter(data.adapter ?? null);
        // Keep local mirror in sync for offline fallback
        writeTrustClaimsClient(patch);
        setBusy(false);
        toast.push({
          title: t("pages.settings.trustSavedTitle"),
          description: t("pages.settings.trustSavedDescServer", {
            adapter: data.adapter ?? "server",
          }),
          tone: "success",
        });
        return;
      }
    } catch {
      /* fall through */
    }

    // Fallback: localStorage when server save fails
    const next = writeTrustClaimsClient(patch);
    setClaims(next);
    setSavedAt(next.updatedAt);
    setStorage("local");
    setBusy(false);
    toast.push({
      title: t("pages.settings.trustSavedTitle"),
      description: t("pages.settings.trustSavedDescLocal"),
      tone: "info",
    });
  }

  const badgeKey =
    storage === "server"
      ? "pages.settings.trustBadgeServer"
      : storage === "local"
        ? "pages.settings.trustBadge"
        : "pages.settings.trustBadge";

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
          {t(badgeKey)}
        </span>
        {adapter ? (
          <span className="admin-badge admin-badge-violet rounded-full px-2 py-0.5 text-[0.5625rem] font-bold uppercase tracking-[0.1em]">
            {adapter}
          </span>
        ) : null}
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
            {storage === "server"
              ? t("pages.settings.trustSavedInlineServer")
              : t("pages.settings.trustSavedInline")}
          </p>
        ) : (
          <p className="text-[0.6875rem] leading-relaxed text-muted">
            {storage === "server"
              ? t("pages.settings.trustStorageHintServer")
              : t("pages.settings.trustStorageHint")}
          </p>
        )}
      </div>
    </form>
  );
}

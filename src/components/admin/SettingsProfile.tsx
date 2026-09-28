"use client";

import { useToast } from "@/components/admin/Toast";
import { useAdminI18n } from "@/components/admin/LocaleProvider";
import { useMemo, useState } from "react";

type FieldKey = "name" | "email" | "phone" | "role";
type FieldErrors = Partial<Record<FieldKey, string>>;

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function SettingsProfile() {
  const toast = useToast();
  const { t } = useAdminI18n();
  const [name, setName] = useState("Ops Lead");
  const [email, setEmail] = useState("ops@kabafence.example");
  const [phone, setPhone] = useState("(919) 292-4777");
  const [role, setRole] = useState("Owner");
  const [touched, setTouched] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (!name.trim() || name.trim().length < 2) next.name = t("profile.errName");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = t("profile.errEmail");
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      next.phone = t("profile.errPhone");
    }
    if (!role.trim()) next.role = t("profile.errRole");
    return next;
  }

  const errors = submitted ? validate() : touched;
  const show = (key: FieldKey) =>
    submitted || touched[key] !== undefined ? errors[key] : undefined;

  const avatar = useMemo(() => initials(name), [name]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate();
    if (Object.keys(errs).length) {
      toast.push({ title: t("profile.fixFields"), tone: "error" });
      return;
    }
    setBusy(true);
    await new Promise((r) => setTimeout(r, 350));
    setBusy(false);
    setSavedAt(Date.now());
    toast.push({
      title: t("profile.savedTitle"),
      description: t("profile.savedDesc"),
      tone: "success",
    });
  }

  function mark(key: FieldKey) {
    setTouched((prev) => ({ ...prev, [key]: validate()[key] ?? "" }));
  }

  const fields: Array<{
    key: FieldKey;
    id: string;
    label: string;
    help: string;
    value: string;
    set: (v: string) => void;
    type?: string;
    autoComplete?: string;
  }> = [
    {
      key: "name",
      id: "prof-name",
      label: t("profile.displayName"),
      help: t("profile.displayNameHelp"),
      value: name,
      set: setName,
      autoComplete: "name",
    },
    {
      key: "role",
      id: "prof-role",
      label: t("profile.roleLabel"),
      help: t("profile.roleHelp"),
      value: role,
      set: setRole,
    },
    {
      key: "email",
      id: "prof-email",
      label: t("profile.email"),
      help: t("profile.emailHelp"),
      value: email,
      set: setEmail,
      type: "email",
      autoComplete: "email",
    },
    {
      key: "phone",
      id: "prof-phone",
      label: t("profile.phone"),
      help: t("profile.phoneHelp"),
      value: phone,
      set: setPhone,
      type: "tel",
      autoComplete: "tel",
    },
  ];

  return (
    <form
      id="settings-profile"
      onSubmit={onSubmit}
      className="admin-glass-panel admin-gold-rail scroll-mt-24 p-4 sm:p-5"
      noValidate
      aria-labelledby="settings-profile-title"
    >
      <div className="flex flex-wrap items-start gap-3 sm:gap-4">
        <div
          className="admin-settings-avatar"
          aria-hidden
          title={t("profile.avatarLabel")}
        >
          {avatar}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="admin-section-label">{t("pages.settings.navProfile")}</p>
            <span className="admin-badge admin-badge-amber rounded-full px-2 py-0.5 text-[0.5625rem] font-bold uppercase tracking-[0.1em]">
              {t("profile.badge")}
            </span>
          </div>
          <h2 id="settings-profile-title" className="admin-card-title mt-1">
            {t("profile.title")}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            {t("profile.body")}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {fields.map((f) => {
          const err = show(f.key);
          const helpId = `${f.id}-help`;
          const errId = `${f.id}-err`;
          return (
            <div key={f.key} className="min-w-0">
              <label htmlFor={f.id} className="text-xs font-semibold text-ink">
                {f.label}
                <span className="ml-0.5 text-bronze" aria-hidden>
                  *
                </span>
              </label>
              <input
                id={f.id}
                type={f.type ?? "text"}
                className={`field-input mt-1.5 text-sm ${err ? "admin-field-invalid" : ""}`}
                value={f.value}
                onChange={(e) => {
                  f.set(e.target.value);
                  if (savedAt) setSavedAt(null);
                }}
                onBlur={() => mark(f.key)}
                aria-invalid={Boolean(err)}
                aria-describedby={err ? `${helpId} ${errId}` : helpId}
                autoComplete={f.autoComplete}
                required
              />
              <p id={helpId} className="admin-field-hint">
                {f.help}
              </p>
              {err ? (
                <p id={errId} className="admin-field-error" role="alert">
                  {err}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-[var(--admin-border)] pt-4">
        <button
          type="submit"
          className="admin-touch btn-primary text-sm"
          disabled={busy}
        >
          {busy ? t("profile.saving") : t("profile.save")}
        </button>
        {savedAt ? (
          <p className="admin-settings-saved" role="status">
            <span className="admin-settings-saved-dot" aria-hidden />
            {t("profile.savedInline")}
          </p>
        ) : (
          <p className="text-[0.6875rem] leading-relaxed text-muted">
            {t("profile.noPassword")}
          </p>
        )}
      </div>
    </form>
  );
}

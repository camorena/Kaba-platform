"use client";

import { useToast } from "@/components/admin/Toast";
import { useState } from "react";

type FieldErrors = Partial<Record<"name" | "email" | "phone" | "role", string>>;

export default function SettingsProfile() {
  const toast = useToast();
  const [name, setName] = useState("Ops Lead");
  const [email, setEmail] = useState("ops@kabafence.example");
  const [phone, setPhone] = useState("(919) 292-4777");
  const [role, setRole] = useState("Owner");
  const [touched, setTouched] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (!name.trim() || name.trim().length < 2) next.name = "Enter a display name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Enter a valid email.";
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      next.phone = "Enter a 10-digit phone.";
    }
    if (!role.trim()) next.role = "Pick a role label.";
    return next;
  }

  const errors = submitted ? validate() : touched;
  const show = (key: keyof FieldErrors) =>
    submitted || touched[key] ? errors[key] : undefined;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate();
    if (Object.keys(errs).length) {
      toast.push({ title: "Fix the highlighted fields", tone: "error" });
      return;
    }
    setBusy(true);
    await new Promise((r) => setTimeout(r, 350));
    setBusy(false);
    toast.push({
      title: "Profile saved (local stub)",
      description: "Not persisted — no DB yet. Values stay for this session only.",
      tone: "success",
    });
  }

  function mark(key: keyof FieldErrors) {
    setTouched((prev) => ({ ...prev, [key]: validate()[key] ?? "" }));
  }

  return (
    <form onSubmit={onSubmit} className="admin-glass-panel admin-gold-rail p-4 sm:p-5" noValidate>
      <h2 className="admin-card-title">Profile (stub)</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Display preferences for the signed-in operator. Saved in-memory only —
        replace with real user records when Auth.js / Clerk lands.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="prof-name" className="text-xs font-semibold text-muted">
            Display name
          </label>
          <input
            id="prof-name"
            className={`field-input mt-1 text-sm ${show("name") ? "admin-field-invalid" : ""}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => mark("name")}
            aria-invalid={Boolean(show("name"))}
            aria-describedby={show("name") ? "prof-name-err" : undefined}
            autoComplete="name"
          />
          {show("name") && (
            <p id="prof-name-err" className="admin-field-error">
              {show("name")}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="prof-role" className="text-xs font-semibold text-muted">
            Role label
          </label>
          <input
            id="prof-role"
            className={`field-input mt-1 text-sm ${show("role") ? "admin-field-invalid" : ""}`}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            onBlur={() => mark("role")}
            aria-invalid={Boolean(show("role"))}
            aria-describedby={show("role") ? "prof-role-err" : undefined}
          />
          {show("role") && (
            <p id="prof-role-err" className="admin-field-error">
              {show("role")}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="prof-email" className="text-xs font-semibold text-muted">
            Email
          </label>
          <input
            id="prof-email"
            type="email"
            className={`field-input mt-1 text-sm ${show("email") ? "admin-field-invalid" : ""}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => mark("email")}
            aria-invalid={Boolean(show("email"))}
            aria-describedby={show("email") ? "prof-email-err" : undefined}
            autoComplete="email"
          />
          {show("email") && (
            <p id="prof-email-err" className="admin-field-error">
              {show("email")}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="prof-phone" className="text-xs font-semibold text-muted">
            Phone
          </label>
          <input
            id="prof-phone"
            type="tel"
            className={`field-input mt-1 text-sm ${show("phone") ? "admin-field-invalid" : ""}`}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onBlur={() => mark("phone")}
            aria-invalid={Boolean(show("phone"))}
            aria-describedby={show("phone") ? "prof-phone-err" : undefined}
            autoComplete="tel"
          />
          {show("phone") && (
            <p id="prof-phone-err" className="admin-field-error">
              {show("phone")}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="submit" className="admin-touch btn-primary text-sm" disabled={busy}>
          {busy ? "Saving…" : "Save profile"}
        </button>
        <p className="text-[0.6875rem] text-muted">No password change here — rotate env vars.</p>
      </div>
    </form>
  );
}

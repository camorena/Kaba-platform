"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminI18n } from "@/components/admin/LocaleProvider";

export default function LoginForm({
  configured,
  authMode = "stub",
}: {
  configured: boolean;
  authMode?: "stub" | "credentials";
}) {
  const router = useRouter();
  const { t } = useAdminI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const credentials = authMode === "credentials";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          credentials ? { email, password } : { password },
        ),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || t("login.loginFailed"));
        setPending(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError(t("login.networkError"));
      setPending(false);
    }
  }

  if (!configured) {
    const body = credentials
      ? t("login.notConfiguredCredentialsBody", {
          secretEnv: "AUTH_SECRET",
          envFile: ".env.local",
        })
      : t("login.notConfiguredBody", {
          passwordEnv: "ADMIN_PASSWORD",
          envFile: ".env.local",
        });
    const codeToken = credentials ? "AUTH_SECRET" : "ADMIN_PASSWORD";
    return (
      <div className="rounded-xl border border-amber-700/25 bg-amber-50 p-5 text-sm text-amber-950 dark:bg-amber-950/30 dark:text-amber-100">
        <p className="font-semibold">
          {credentials
            ? t("login.notConfiguredCredentialsTitle")
            : t("login.notConfiguredTitle")}
        </p>
        <p className="mt-2 leading-relaxed">
          {body.includes(codeToken) ? (
            <>
              {body.split(codeToken)[0]}
              <code className="rounded bg-black/5 px-1 dark:bg-white/10">
                {codeToken}
              </code>
              {body.split(codeToken)[1]?.includes(".env.local") ? (
                <>
                  {body.split(codeToken)[1].split(".env.local")[0]}
                  <code className="rounded bg-black/5 px-1 dark:bg-white/10">
                    .env.local
                  </code>
                  {body.split(codeToken)[1].split(".env.local")[1]}
                </>
              ) : (
                body.split(codeToken)[1]
              )}
            </>
          ) : (
            body
          )}
        </p>
      </div>
    );
  }

  const canSubmit = credentials
    ? Boolean(email.trim() && password)
    : Boolean(password);

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {credentials ? (
        <div>
          <label htmlFor="admin-email" className="block text-sm font-medium text-ink">
            {t("login.emailLabel")}
          </label>
          <input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field-input mt-1.5"
            required
            autoFocus
          />
        </div>
      ) : null}
      <div>
        <label htmlFor="admin-password" className="block text-sm font-medium text-ink">
          {t("login.passwordLabel")}
        </label>
        <div className="relative mt-1.5">
          <input
            id="admin-password"
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field-input !mt-0 pr-16"
            required
            autoFocus={!credentials}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 text-xs font-semibold text-muted hover:text-ink"
            onClick={() => setShow((v) => !v)}
            tabIndex={-1}
          >
            {show ? t("login.hide") : t("login.show")}
          </button>
        </div>
      </div>
      {error && (
        <p
          role="alert"
          className="admin-login-error rounded-lg border border-danger/25 bg-danger/5 px-3 py-2 text-sm font-medium text-danger"
        >
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending || !canSubmit}
        className="btn-primary admin-login-submit w-full disabled:opacity-60"
      >
        {pending ? (
          <span className="inline-flex items-center gap-2">
            <span className="admin-spinner" aria-hidden />
            {t("login.signingIn")}
          </span>
        ) : (
          t("login.signIn")
        )}
      </button>
      <p className="rounded-lg border border-ink/8 bg-ivory-muted/50 px-3 py-2 text-xs leading-relaxed text-muted dark:bg-ivory-muted/25">
        {credentials ? t("login.credentialsNote") : t("login.stubNote")}
      </p>
    </form>
  );
}

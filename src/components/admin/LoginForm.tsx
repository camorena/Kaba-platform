"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Login failed.");
        setPending(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error. Try again.");
      setPending(false);
    }
  }

  if (!configured) {
    return (
      <div className="rounded-xl border border-amber-700/25 bg-amber-50 p-5 text-sm text-amber-950 dark:bg-amber-950/30 dark:text-amber-100">
        <p className="font-semibold">Admin password not configured</p>
        <p className="mt-2 leading-relaxed">
          Set <code className="rounded bg-black/5 px-1 dark:bg-white/10">ADMIN_PASSWORD</code>{" "}
          in <code className="rounded bg-black/5 px-1 dark:bg-white/10">.env.local</code>{" "}
          (or your host env) and restart the server. This gate is a temporary stub —
          replace with real auth before any production use.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="admin-password" className="block text-sm font-medium text-ink">
          Admin password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="field-input"
          required
        />
      </div>
      {error && (
        <p role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
      <p className="rounded-lg border border-ink/8 bg-ivory-muted/50 px-3 py-2 text-xs leading-relaxed text-muted dark:bg-ivory-muted/25">
        Stub auth only — cookie session lasts ~12 hours. Not suitable as sole
        protection for customer PII in production.
      </p>
    </form>
  );
}

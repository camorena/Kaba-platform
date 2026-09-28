"use client";

import { useToast } from "@/components/admin/Toast";
import { useState } from "react";

export default function CopyChip({
  value,
  label = "Copy",
  className = "",
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const toast = useToast();
  const [ok, setOk] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setOk(true);
      toast.push({ title: "Copied", tone: "success" });
      window.setTimeout(() => setOk(false), 1400);
    } catch {
      toast.push({ title: "Copy failed", tone: "error" });
    }
  }

  return (
    <button
      type="button"
      onClick={() => void copy()}
      className={`admin-chip inline-flex items-center gap-1 ${className}`}
      title={`Copy ${value}`}
    >
      <svg className="h-3 w-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      {ok ? "Copied" : label}
    </button>
  );
}

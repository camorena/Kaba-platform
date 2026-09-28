"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle({
  className = "",
  variant = "default",
}: {
  className?: string;
  /** dark = cream icons for charcoal chrome (admin topbar) */
  variant?: "default" | "dark";
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const tone =
    variant === "dark"
      ? "text-cream/80 hover:bg-white/10 hover:text-cream"
      : "text-ink hover:bg-ivory-muted";

  const display =
    /\b(hidden|inline-flex|flex|block)\b/.test(className)
      ? ""
      : "inline-flex";

  return (
    <button
      type="button"
      className={`focus-ring ${display} h-11 w-11 items-center justify-center rounded-lg transition-colors ${tone} ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <svg
        className={`h-5 w-5 transition-opacity ${mounted && isDark ? "opacity-100" : "opacity-0 absolute"}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      <svg
        className={`h-5 w-5 transition-opacity ${mounted && !isDark ? "opacity-100" : mounted ? "opacity-0 absolute" : "opacity-100"}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3a7 7 0 0 0 11.5 11.5z" />
      </svg>
    </button>
  );
}

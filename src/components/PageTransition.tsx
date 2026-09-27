"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

/**
 * Subtle main-content enter animation on client navigations.
 * Respects prefers-reduced-motion; skips flash on first paint.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [key, setKey] = useState(pathname);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setReady(true);
      setKey(pathname);
      return;
    }
    setReady(false);
    setKey(pathname);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setReady(true));
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <div
      key={key}
      className={`page-enter ${ready ? "page-enter-active" : ""}`}
    >
      {children}
    </div>
  );
}

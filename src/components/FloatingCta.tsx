"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Cookie-light "Free estimate" pill. Sits bottom-left so it never
 * fights the chat launcher (bottom-right). Hidden on /quote and
 * until the user scrolls a bit past the hero.
 */
export default function FloatingCta() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("kaba-cta-dismissed") === "1") {
        setDismissed(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (pathname === "/quote" || dismissed) {
      setShow(false);
      return;
    }
    function onScroll() {
      setShow(window.scrollY > 420);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname, dismissed]);

  if (!show || dismissed || pathname === "/quote") return null;

  return (
    <div className="pointer-events-none fixed bottom-0 left-0 z-[55] p-3 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pl-[max(0.75rem,env(safe-area-inset-left))]">
      <div className="pointer-events-auto flex items-center gap-1.5">
        <Link
          href="/quote"
          className="focus-ring floating-cta group inline-flex items-center gap-2 rounded-full bg-navy pl-1.5 pr-4 py-1.5 text-sm font-semibold text-cream shadow-[var(--shadow-lg),0_0_0_1px_color-mix(in_srgb,var(--bronze)_40%,transparent)] transition hover:bg-navy-light"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bronze text-navy shadow-[inset_0_1px_0_color-mix(in_srgb,#fff_40%,transparent)]">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M9 5l7 7-7 7" />
            </svg>
          </span>
          <span>Free estimate</span>
        </Link>
        <button
          type="button"
          className="focus-ring inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 text-muted shadow-sm ring-1 ring-ink/10 backdrop-blur-md transition hover:bg-surface hover:text-ink dark:ring-cream/15"
          aria-label="Dismiss free estimate shortcut"
          onClick={() => {
            setDismissed(true);
            setShow(false);
            try {
              sessionStorage.setItem("kaba-cta-dismissed", "1");
            } catch {
              /* ignore */
            }
          }}
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

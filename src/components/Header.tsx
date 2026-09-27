"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks, siteConfig } from "@/lib/site";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/8 bg-surface/95 backdrop-blur-md">
      <div className="container-page flex h-14 items-center justify-between gap-3 lg:h-[3.75rem]">
        <Link
          href="/"
          className="focus-ring group flex min-w-0 items-center gap-2.5 rounded-md"
          onClick={() => setOpen(false)}
        >
          <span
            aria-hidden
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-ink text-sm font-bold tracking-wide text-ivory shadow-sm"
          >
            KF
          </span>
          <span className="truncate font-display text-lg font-semibold tracking-tight text-ink transition group-hover:text-ink-light">
            {siteConfig.name}
          </span>
        </Link>

        <nav
          className="hidden items-center gap-0.5 md:flex"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`focus-ring rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-ink/6 text-ink"
                    : "text-muted hover:bg-ivory-muted hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/quote"
            className="focus-ring btn-primary hidden px-4 py-2 sm:inline-flex"
          >
            Get a Free Quote
          </Link>
          <button
            type="button"
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-md text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-ink/8 bg-surface md:hidden"
        >
          <nav
            className="container-page flex flex-col gap-1 py-3 pb-5"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`focus-ring rounded-md px-3 py-3 text-base font-medium transition-colors ${
                    active
                      ? "bg-ink/6 text-ink"
                      : "text-muted hover:bg-ivory-muted hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/quote"
              onClick={() => setOpen(false)}
              className="focus-ring btn-primary mt-2 w-full py-3 text-center"
            >
              Get a Free Quote
            </Link>
            <a
              href={siteConfig.phoneHref}
              className="focus-ring btn-secondary-light mt-1 w-full py-3 text-center"
            >
              Call {siteConfig.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

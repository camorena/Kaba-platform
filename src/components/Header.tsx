"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks, siteConfig } from "@/lib/site";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [navPath, setNavPath] = useState(pathname);

  if (navPath !== pathname) {
    setNavPath(pathname);
    if (open) setOpen(false);
  }

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
    <header className="sticky top-0 z-50 border-b border-ink/[0.06] bg-ivory/80 shadow-[0_1px_0_color-mix(in_srgb,var(--bronze)_12%,transparent),0_8px_24px_color-mix(in_srgb,var(--ink)_4%,transparent)] backdrop-blur-xl">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-bronze/55 to-transparent"
        aria-hidden
      />
      <div className="container-page flex h-14 items-center justify-between gap-2 sm:gap-3 lg:h-[3.75rem]">
        <Link
          href="/"
          className="focus-ring group flex min-w-0 shrink items-center gap-2 rounded-md sm:gap-2.5"
          onClick={() => setOpen(false)}
        >
          <span
            aria-hidden
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink text-sm font-bold tracking-wide text-ivory shadow-[inset_0_1px_0_color-mix(in_srgb,#fff_14%,transparent),0_2px_8px_color-mix(in_srgb,var(--ink)_22%,transparent)]"
          >
            KF
            <span className="absolute inset-x-2 bottom-1 h-0.5 rounded-full bg-bronze/90" />
          </span>
          <span className="truncate font-display text-base font-semibold tracking-tight text-ink transition group-hover:text-ink-light sm:text-lg">
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
                className={`focus-ring relative rounded-md px-3 py-2 text-[0.8125rem] font-medium tracking-[-0.01em] transition-colors lg:px-3.5 ${
                  active
                    ? "bg-ink/[0.05] text-ink"
                    : "text-muted hover:bg-ivory-muted hover:text-ink"
                }`}
              >
                {link.label}
                {active && (
                  <span
                    className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-bronze-dark via-bronze to-bronze-light lg:inset-x-3.5"
                    aria-hidden
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/quote"
            className="focus-ring btn-primary hidden px-3.5 py-2 text-sm md:inline-flex lg:px-4"
          >
            Get a Free Quote
          </Link>
          <button
            type="button"
            className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-md text-ink md:hidden"
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
          className="max-h-[min(100dvh-3.5rem,32rem)] overflow-y-auto border-t border-ink/[0.06] bg-ivory/95 backdrop-blur-xl md:hidden"
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
                  className={`focus-ring rounded-md px-3 py-3.5 text-base font-medium transition-colors ${
                    active
                      ? "bg-ink/[0.05] text-ink"
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
              className="focus-ring btn-primary mt-2 w-full py-3.5 text-center"
            >
              Get a Free Quote
            </Link>
            <a
              href={siteConfig.phoneHref}
              className="focus-ring btn-secondary-light mt-1 w-full py-3.5 text-center"
            >
              Call {siteConfig.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { navLinks, siteConfig } from "@/lib/site";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [navPath, setNavPath] = useState(pathname);
  const [scrolled, setScrolled] = useState(false);

  if (navPath !== pathname) {
    setNavPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-[height,box-shadow,background-color,border-color,padding] duration-300 ${
        scrolled
          ? "border-ink/[0.1] bg-ivory/92 shadow-[0_1px_0_color-mix(in_srgb,var(--bronze)_28%,transparent),0_12px_32px_color-mix(in_srgb,var(--navy)_8%,transparent)] dark:border-cream/12 dark:bg-ivory/94 dark:shadow-[0_1px_0_color-mix(in_srgb,var(--bronze)_30%,transparent),0_12px_32px_color-mix(in_srgb,#000_42%,transparent)]"
          : "border-ink/[0.07] bg-ivory/85 shadow-[0_1px_0_color-mix(in_srgb,var(--bronze)_18%,transparent),0_10px_28px_color-mix(in_srgb,var(--navy)_5%,transparent)] dark:border-cream/10 dark:shadow-[0_1px_0_color-mix(in_srgb,var(--bronze)_22%,transparent),0_10px_28px_color-mix(in_srgb,#000_35%,transparent)]"
      }`}
      data-scrolled={scrolled ? "true" : "false"}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-bronze/65 to-transparent"
        aria-hidden
      />
      <div
        className={`container-page flex items-center justify-between gap-3 transition-[height] duration-300 sm:gap-4 ${
          scrolled ? "h-14 lg:h-14" : "h-[3.75rem] lg:h-[4.25rem]"
        }`}
      >
        <Link
          href="/"
          className="focus-ring group flex min-w-0 shrink items-center gap-2.5 rounded-md sm:gap-3"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/brand/kaba-fence-icon.png"
            alt="Kaba Fence"
            width={44}
            height={44}
            className={`shrink-0 object-contain transition-[height,width] duration-300 ${
              scrolled
                ? "h-8 w-8 sm:h-9 sm:w-9"
                : "h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11"
            }`}
            priority
          />
          <span
            className={`truncate font-display font-semibold tracking-tight text-ink transition-[font-size,opacity] duration-300 group-hover:opacity-80 ${
              scrolled ? "text-base sm:text-[1.05rem]" : "text-[1.05rem] sm:text-lg"
            }`}
          >
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
                aria-current={active ? "page" : undefined}
                className={`focus-ring relative rounded-md px-3 py-2 text-[0.8125rem] font-semibold tracking-[-0.01em] transition-colors lg:px-3.5 ${
                  active
                    ? "bg-ink/[0.055] text-ink dark:bg-cream/[0.08]"
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

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <Link
            href="/quote"
            className="focus-ring btn-primary hidden min-h-0 px-3.5 py-2 text-sm md:inline-flex lg:px-4"
          >
            Get a Free Quote
          </Link>
          <button
            type="button"
            className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-lg text-ink hover:bg-ivory-muted md:hidden"
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
          className="max-h-[min(100dvh-3.75rem,34rem)] overflow-y-auto border-t border-ink/[0.07] bg-ivory/96 backdrop-blur-xl dark:border-cream/10 md:hidden"
        >
          <nav
            className="container-page flex flex-col gap-1 py-3.5 pb-6"
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
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`focus-ring rounded-md px-3 py-3.5 text-base font-medium transition-colors ${
                    active
                      ? "bg-ink/[0.05] text-ink dark:bg-cream/[0.08]"
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

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { navLinks, siteConfig } from "@/lib/site";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [navPath, setNavPath] = useState(pathname);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const scrollLockY = useRef(0);
  const bodyStylePrev = useRef<{
    overflow: string;
    position: string;
    top: string;
    left: string;
    right: string;
    width: string;
  } | null>(null);

  // Close mobile nav on route change (adjust state during render).
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

  // Body scroll lock + Escape. scrollY is captured in toggleMenu() before
  // layout flips to fixed header, so restore is accurate even under Strict Mode.
  useEffect(() => {
    if (!open) {
      document.documentElement.removeAttribute("data-mobile-nav");
      return;
    }

    document.documentElement.setAttribute("data-mobile-nav", "open");
    const body = document.body;
    const y = scrollLockY.current;

    if (!bodyStylePrev.current) {
      bodyStylePrev.current = {
        overflow: body.style.overflow,
        position: body.style.position,
        top: body.style.top,
        left: body.style.left,
        right: body.style.right,
        width: body.style.width,
      };
      body.style.overflow = "hidden";
      body.style.position = "fixed";
      body.style.top = `-${y}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus({ preventScroll: true });
      }
    }

    document.addEventListener("keydown", onKeyDown);

    const t = window.setTimeout(() => {
      const first = mobileNavRef.current?.querySelector<HTMLElement>(
        "a, button",
      );
      first?.focus({ preventScroll: true });
    }, 10);

    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKeyDown);
      // Defer unlock so React Strict Mode remount can re-claim the lock.
      const restoreY = scrollLockY.current;
      queueMicrotask(() => {
        if (document.documentElement.getAttribute("data-mobile-nav") === "open") {
          return;
        }
        const prev = bodyStylePrev.current;
        bodyStylePrev.current = null;
        document.documentElement.removeAttribute("data-mobile-nav");
        if (prev) {
          body.style.overflow = prev.overflow;
          body.style.position = prev.position;
          body.style.top = prev.top;
          body.style.left = prev.left;
          body.style.right = prev.right;
          body.style.width = prev.width;
        }
        window.scrollTo({ top: restoreY, left: 0, behavior: 'instant' });
      });
    };
  }, [open]);

  function captureScrollY() {
    if (!open) {
      // pointerdown fires before focus scrolls the sticky control into view.
      scrollLockY.current = window.scrollY;
    }
  }

  function toggleMenu() {
    setOpen((v) => !v);
  }

  function closeMenu() {
    setOpen(false);
    window.setTimeout(() => menuButtonRef.current?.focus({ preventScroll: true }), 0);
  }

  const barHeight = scrolled ? "h-14 lg:h-14" : "h-[3.75rem] lg:h-[4.25rem]";

  return (
    <>
      {/* Keep document flow when header becomes fixed while the menu is open */}
      {open && <div className={`md:hidden ${barHeight}`} aria-hidden />}
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-[65] bg-ink/45 backdrop-blur-[2px] md:hidden"
          aria-label="Close menu"
          tabIndex={-1}
          onClick={closeMenu}
        />
      )}
      <header
        className={`top-0 z-[70] border-b backdrop-blur-xl transition-[height,box-shadow,background-color,border-color,padding] duration-300 ${
          open ? "fixed inset-x-0" : "sticky"
        } ${
          scrolled
            ? "border-ink/[0.1] bg-ivory/92 shadow-[0_1px_0_color-mix(in_srgb,var(--bronze)_28%,transparent),0_12px_32px_color-mix(in_srgb,var(--navy)_8%,transparent)] dark:border-cream/12 dark:bg-ivory/94 dark:shadow-[0_1px_0_color-mix(in_srgb,var(--bronze)_30%,transparent),0_12px_32px_color-mix(in_srgb,#000_42%,transparent)]"
            : "border-ink/[0.07] bg-ivory/85 shadow-[0_1px_0_color-mix(in_srgb,var(--bronze)_18%,transparent),0_10px_28px_color-mix(in_srgb,var(--navy)_5%,transparent)] dark:border-cream/10 dark:shadow-[0_1px_0_color-mix(in_srgb,var(--bronze)_22%,transparent),0_10px_28px_color-mix(in_srgb,#000_35%,transparent)]"
        }`}
        data-scrolled={scrolled ? "true" : "false"}
        data-mobile-nav-open={open ? "true" : "false"}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-bronze/65 to-transparent"
          aria-hidden
        />
        <div
          className={`container-page flex items-center justify-between gap-3 transition-[height] duration-300 sm:gap-4 ${barHeight}`}
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
                scrolled
                  ? "text-base sm:text-[1.05rem]"
                  : "text-[1.05rem] sm:text-lg"
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
              ref={menuButtonRef}
              type="button"
              className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-lg text-ink hover:bg-ivory-muted md:hidden"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? "Close menu" : "Open menu"}
              onPointerDown={captureScrollY}
              onClick={toggleMenu}
            >
              {open ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {open && (
            <div
              ref={mobileNavRef}
              id={menuId}
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              className="absolute inset-x-0 top-full z-[66] max-h-[min(100dvh-3.5rem,34rem)] overflow-y-auto border-t border-ink/[0.07] bg-ivory/98 shadow-[0_24px_48px_color-mix(in_srgb,var(--navy)_18%,transparent)] backdrop-blur-xl dark:border-cream/10 dark:bg-ivory/96 md:hidden"
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
                      onClick={closeMenu}
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
                  onClick={closeMenu}
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
    </>
  );
}

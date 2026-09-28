"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import {
  fencingOptionsNav,
  navLinks,
  siteConfig,
} from "@/lib/site";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileFenceOpen, setMobileFenceOpen] = useState(false);
  const [navPath, setNavPath] = useState(pathname);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollLockY = useRef(0);
  const bodyStylePrev = useRef<{
    overflow: string;
    position: string;
    top: string;
    left: string;
    right: string;
    width: string;
  } | null>(null);

  if (navPath !== pathname) {
    setNavPath(pathname);
    if (open) setOpen(false);
    setDropdownOpen(false);
    setMobileFenceOpen(false);
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
    function onDocClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

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
      const restoreY = scrollLockY.current;
      queueMicrotask(() => {
        if (
          document.documentElement.getAttribute("data-mobile-nav") === "open"
        ) {
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
        window.scrollTo({ top: restoreY, left: 0, behavior: "instant" });
      });
    };
  }, [open]);

  function captureScrollY() {
    if (!open) {
      scrollLockY.current = window.scrollY;
    }
  }

  function toggleMenu() {
    setOpen((v) => !v);
  }

  function closeMenu() {
    setOpen(false);
    window.setTimeout(
      () => menuButtonRef.current?.focus({ preventScroll: true }),
      0,
    );
  }

  const barHeight = "h-[4rem] lg:h-[4.5rem]";

  return (
    <>
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
            ? "border-[color:var(--header-border)] bg-[var(--header-bg)] shadow-[var(--shadow-sm)]"
            : "border-[color:var(--header-border)] bg-[var(--header-bg)]"
        }`}
        data-scrolled={scrolled ? "true" : "false"}
        data-mobile-nav-open={open ? "true" : "false"}
      >
        <div
          className={`container-page grid grid-cols-[1fr_auto] items-center gap-2 transition-[height] duration-300 sm:gap-3 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-3 xl:gap-4 ${barHeight}`}
        >
          <Link
            href="/"
            className="focus-ring group flex min-w-0 shrink items-center gap-2.5 justify-self-start rounded-md sm:gap-3"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/brand/kaba-fence-icon.png"
              alt=""
              width={44}
              height={44}
              className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"
              priority
            />
            <span className="font-display text-[1.05rem] font-semibold tracking-tight text-ink whitespace-nowrap sm:text-lg">
              {siteConfig.name}
            </span>
          </Link>

          <nav
            className="hidden items-center justify-center gap-0.5 lg:flex"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              if ("hasDropdown" in link && link.hasDropdown) {
                return (
                  <div
                    key={link.href}
                    className="relative"
                    ref={dropdownRef}
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <button
                      type="button"
                      className={`focus-ring inline-flex items-center gap-1 rounded-md px-2 py-2 text-[0.75rem] font-semibold tracking-[-0.01em] transition-colors xl:px-3 xl:text-[0.8125rem] ${
                        active || pathname.startsWith("/services")
                          ? "bg-ink/[0.05] text-ink"
                          : "text-muted hover:bg-ivory-muted hover:text-ink"
                      }`}
                      aria-expanded={dropdownOpen}
                      aria-haspopup="true"
                      onClick={() => setDropdownOpen((v) => !v)}
                    >
                      {link.label}
                      <svg
                        className={`h-3.5 w-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {dropdownOpen && (
                      <div className="absolute left-0 top-full z-50 min-w-[14rem] pt-2">
                        <ul className="rounded-xl border border-ink/[0.08] bg-surface py-2 shadow-lg">
                          <li>
                            <Link
                              href="/services"
                              className="focus-ring block px-4 py-2.5 text-sm font-semibold text-ink hover:bg-ivory-muted"
                              onClick={() => setDropdownOpen(false)}
                            >
                              All fencing
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/materials"
                              className="focus-ring block px-4 py-2.5 text-sm text-muted hover:bg-ivory-muted hover:text-ink"
                              onClick={() => setDropdownOpen(false)}
                            >
                              Materials guide
                            </Link>
                          </li>
                          {fencingOptionsNav.map((item) => (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                className="focus-ring block px-4 py-2.5 text-sm text-muted hover:bg-ivory-muted hover:text-ink"
                                onClick={() => setDropdownOpen(false)}
                              >
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`focus-ring relative rounded-md px-2 py-2 text-[0.75rem] font-semibold tracking-[-0.01em] transition-colors xl:px-3 xl:text-[0.8125rem] ${
                    active
                      ? "bg-ink/[0.05] text-ink"
                      : "text-muted hover:bg-ivory-muted hover:text-ink"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span
                      className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-bronze"
                      aria-hidden
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center justify-self-end gap-1.5 sm:gap-2">
            <a
              href={siteConfig.phoneHref}
              className="focus-ring btn-phone header-phone hidden whitespace-nowrap xl:inline-flex"
              aria-label={`Call ${siteConfig.phone}`}
            >
              <svg
                className="h-4 w-4 shrink-0 text-bronze"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span className="tabular-nums tracking-tight">{siteConfig.phone}</span>
            </a>
            <ThemeToggle className="hidden h-10 w-10 shrink-0 sm:inline-flex" />
            <Link
              href="/contact"
              className="focus-ring btn-primary header-cta hidden whitespace-nowrap md:inline-flex"
            >
              <span className="xl:hidden">Free Estimate</span>
              <span className="hidden xl:inline">Request a Free Estimate</span>
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-lg text-ink hover:bg-ivory-muted lg:hidden"
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
            className="absolute inset-x-0 top-full z-[66] max-h-[min(100dvh-3.5rem,36rem)] overflow-y-auto border-t border-[color:var(--header-border)] bg-[var(--header-bg)] shadow-xl backdrop-blur-xl lg:hidden"
          >
            <nav
              className="container-page flex flex-col gap-1 py-3.5 pb-6"
              aria-label="Mobile navigation"
            >
              {navLinks.map((link) => {
                const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
                if ("hasDropdown" in link && link.hasDropdown) {
                  return (
                    <div key={link.href} className="flex flex-col">
                      <button
                        type="button"
                        className={`focus-ring flex items-center justify-between rounded-md px-3 py-3.5 text-base font-medium ${
                          active
                            ? "bg-ink/[0.05] text-ink"
                            : "text-muted hover:bg-ivory-muted hover:text-ink"
                        }`}
                        aria-expanded={mobileFenceOpen}
                        onClick={() => setMobileFenceOpen((v) => !v)}
                      >
                        {link.label}
                        <svg
                          className={`h-4 w-4 transition-transform ${mobileFenceOpen ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {mobileFenceOpen && (
                        <div className="ml-3 flex flex-col border-l border-ink/10 pl-3">
                          <Link
                            href="/services"
                            onClick={closeMenu}
                            className="focus-ring rounded-md px-3 py-2.5 text-sm font-semibold text-ink"
                          >
                            All fencing
                          </Link>
                          <Link
                            href="/materials"
                            onClick={closeMenu}
                            className="focus-ring rounded-md px-3 py-2.5 text-sm text-muted hover:text-ink"
                          >
                            Materials guide
                          </Link>
                          {fencingOptionsNav.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={closeMenu}
                              className="focus-ring rounded-md px-3 py-2.5 text-sm text-muted hover:text-ink"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={closeMenu}
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
                href="/contact"
                onClick={closeMenu}
                className="focus-ring btn-primary mt-2 w-full py-3.5 text-center text-sm uppercase tracking-[0.06em]"
              >
                Request a Free Estimate
              </Link>
              <a
                href={siteConfig.phoneHref}
                className="focus-ring btn-phone mt-1 w-full py-3.5 text-center text-base"
              >
                <svg
                  className="h-4 w-4 text-bronze"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Call {siteConfig.phone}
              </a>
              <div className="mt-3 flex items-center justify-between rounded-lg border border-ink/[0.08] bg-ivory-muted/50 px-3 py-2 sm:hidden">
                <span className="text-sm font-medium text-muted">Appearance</span>
                <ThemeToggle />
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

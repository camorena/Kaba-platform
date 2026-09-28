import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  fencingOptionsNav,
  footerLinks,
  legalLinks,
  navLinks,
  siteConfig,
} from "@/lib/site";

function SocialIcon({
  label,
  href,
  children,
}: {
  label: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-cream/80 transition hover:border-bronze hover:text-bronze"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0c10] text-cream">
      <div className="container-page grid gap-10 py-14 sm:gap-12 sm:py-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-3">
          <Link href="/" className="focus-ring inline-flex rounded-md">
            <Image
              src="/brand/kaba-fence-logo.png"
              alt="Kaba Fence"
              width={140}
              height={144}
              className="h-[4.25rem] w-auto object-contain"
            />
          </Link>
          <p className="mt-4 text-sm font-semibold text-cream/90">
            Residential & Commercial Fencing
          </p>
          <p className="mt-1.5 text-sm text-cream/60">
            {siteConfig.address.region}
          </p>
          <p className="mt-3 font-script text-xl text-bronze">
            {siteConfig.tagline}
          </p>
          <p className="mt-4 text-xs text-cream/45">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
        </div>

        <div className="lg:col-span-2 lg:pt-1">
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-bronze">
            Quick Links
          </p>
          <ul className="mt-4 space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="focus-ring -mx-1 inline-flex min-h-9 items-center rounded px-1 text-sm text-cream/80 transition hover:text-cream"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-bronze">
            Explore
          </p>
          <ul className="mt-2 space-y-1">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="focus-ring -mx-1 inline-flex min-h-9 items-center rounded px-1 text-sm text-cream/80 transition hover:text-cream"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2 lg:pt-1">
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-bronze">
            Fencing
          </p>
          <ul className="mt-4 space-y-1">
            {fencingOptionsNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="focus-ring -mx-1 inline-flex min-h-9 items-center rounded px-1 text-sm text-cream/80 transition hover:text-cream"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3 lg:pt-1">
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-bronze">
            Contact
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-cream/80">
            <li>
              <a
                href={siteConfig.phoneHref}
                className="focus-ring -mx-1 inline-flex min-h-9 items-center gap-2.5 rounded px-1 font-medium transition hover:text-cream"
              >
                <svg className="h-4 w-4 shrink-0 text-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {siteConfig.phone}
              </a>
            </li>
            <li>
              <a
                href={siteConfig.emailHref}
                className="focus-ring -mx-1 inline-flex min-h-9 items-center gap-2.5 break-all rounded px-1 transition hover:text-cream"
              >
                <svg className="h-4 w-4 shrink-0 text-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {siteConfig.email}
              </a>
            </li>
            <li className="inline-flex items-start gap-2.5 pt-0.5 text-cream/60">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {siteConfig.address.region}
            </li>
          </ul>
        </div>

        <div className="lg:col-span-2 lg:pt-1">
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-bronze">
            Follow Us
          </p>
          <div className="mt-4 flex gap-2.5">
            <SocialIcon label="Facebook" href={siteConfig.social.facebook}>
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.02H7.9v-2.91h2.4V9.84c0-2.37 1.41-3.68 3.56-3.68 1.03 0 2.11.18 2.11.18v2.32h-1.19c-1.17 0-1.54.73-1.54 1.48v1.78h2.62l-.42 2.91h-2.2V22c4.78-.75 8.44-4.91 8.44-9.93z" />
              </svg>
            </SocialIcon>
            <SocialIcon label="Instagram" href={siteConfig.social.instagram}>
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 017.8 2zm-.2 2A3.6 3.6 0 004 7.6v8.8A3.6 3.6 0 007.6 20h8.8a3.6 3.6 0 003.6-3.6V7.6A3.6 3.6 0 0016.4 4H7.6zm9.65 1.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zM12 7a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z" />
              </svg>
            </SocialIcon>
            <SocialIcon label="LinkedIn" href={siteConfig.social.linkedin}>
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.8v2h.05c.53-1 1.82-2.05 3.75-2.05 4.01 0 4.75 2.64 4.75 6.07V23h-4v-6.6c0-1.57-.03-3.59-2.19-3.59-2.19 0-2.53 1.71-2.53 3.48V23h-4V8.5z" />
              </svg>
            </SocialIcon>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.08]">
        <div className="container-page flex flex-col gap-3 py-5 text-xs text-cream/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {siteConfig.name} — Professional fencing in {siteConfig.serviceArea}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {legalLinks.map((link, i) => (
              <span key={link.href} className="inline-flex items-center gap-4">
                {i > 0 && <span aria-hidden>|</span>}
                <Link
                  href={link.href}
                  className="focus-ring rounded text-cream/55 transition hover:text-cream"
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

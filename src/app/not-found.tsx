import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {
  getPublishedContactInfo,
  getPublishedFencingOptionsNav,
  getPublishedFooterLinks,
  getPublishedLegalLinks,
  getPublishedNavLinks,
} from "@/lib/cms/public";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

const helpful = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/materials", label: "Materials" },
  { href: "/quote", label: "Get a quote" },
  { href: "/faq", label: "FAQ" },
] as const;

export default function NotFound() {
  const contact = getPublishedContactInfo();
  const navLinks = getPublishedNavLinks();
  const footerLinks = getPublishedFooterLinks();
  const fencingOptionsNav = getPublishedFencingOptionsNav();
  const legalLinks = getPublishedLegalLinks();
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-bronze focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-navy focus:shadow-lg"
      >
        Skip to content
      </a>
      <Header
        navLinks={navLinks}
        fencingOptionsNav={fencingOptionsNav}
        contact={contact}
      />
      <main id="main" className="flex flex-1 flex-col" tabIndex={-1}>
        <section className="page-hero flex-1">
          <div className="container-page relative flex flex-col items-start py-16 sm:py-20 lg:py-24">
            <p className="eyebrow">Error 404</p>
            <h1 className="mt-3.5 max-w-xl text-[1.85rem] font-semibold leading-[1.12] tracking-[-0.03em] text-ink sm:text-4xl lg:text-5xl">
              We can’t find that page
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted">
              The link may be outdated, or the page moved. Try one of these
              popular destinations—or call{" "}
              <a
                href={contact.phoneHref}
                className="focus-ring rounded font-semibold text-ink underline-offset-2 hover:underline"
              >
                {contact.phone}
              </a>{" "}
              if you need a human.
            </p>

            <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="focus-ring btn-primary w-full justify-center sm:w-auto"
              >
                Back to home
              </Link>
              <Link
                href="/contact"
                className="focus-ring btn-secondary-light w-full justify-center sm:w-auto"
              >
                Request a quote
              </Link>
            </div>

            <nav aria-label="Helpful links" className="mt-12 w-full max-w-2xl">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-bronze-dark dark:text-bronze-light">
                Popular pages
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {helpful.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="focus-ring card-static flex min-h-12 items-center rounded-xl px-4 py-3 text-sm font-semibold text-ink transition hover:border-bronze/40"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </section>
      </main>
      <Footer
        navLinks={navLinks}
        footerLinks={footerLinks}
        fencingOptionsNav={fencingOptionsNav}
        legalLinks={legalLinks}
        contact={contact}
      />
    </>
  );
}

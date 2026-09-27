import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { siteConfig } from "@/lib/site";

const title = "Terms of Use";
const description = `Website terms for ${siteConfig.name}—fence and deck contractor serving Angier, Raleigh, and surrounding North Carolina communities.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/terms" },
  openGraph: {
    title: `${title} | ${siteConfig.name}`,
    description,
    url: "/terms",
    images: [{ url: "/gallery/cedar-privacy.jpg" }],
  },
  twitter: {
    card: "summary",
    title: `${title} | ${siteConfig.name}`,
    description,
  },
};

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Terms of Use", path: "/terms" },
        ])}
      />

      <section className="page-hero">
        <div className="container-page section-header relative">
          <p className="eyebrow">Legal</p>
          <h1 className="mt-3.5 text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.03em] text-ink sm:text-4xl sm:leading-[1.12] lg:text-5xl lg:leading-[1.1]">
            Terms of Use
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
            These terms govern your use of the {siteConfig.name} website. By
            browsing or submitting a quote request, you agree to them.
          </p>
          <p className="mt-3 text-sm text-muted-light">
            Last updated: September 27, 2026
          </p>
        </div>
      </section>

      <section className="container-page section-y">
        <Reveal className="prose-legal mx-auto max-w-3xl space-y-10 text-[0.9875rem] leading-relaxed text-muted">
          <div>
            <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
              The site &amp; our business
            </h2>
            <p className="mt-3">
              This website describes fence and deck services offered by{" "}
              {siteConfig.name} in {siteConfig.address.city},{" "}
              {siteConfig.address.state}, and surrounding communities (
              {siteConfig.serviceArea}). Content is for general information and
              marketing. A submitted quote request is not a binding contract until
              we provide a written estimate you accept.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
              Estimates &amp; project work
            </h2>
            <p className="mt-3">
              Online forms and phone conversations help us understand your
              project. Final pricing, materials, timelines, and scope are confirmed
              in a written estimate after an on-site visit when needed. Permits,
              HOA rules, underground utilities, and site conditions can affect
              cost and schedule; we discuss those before work begins whenever
              practical.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
              Accuracy of information
            </h2>
            <p className="mt-3">
              We aim to keep service descriptions, gallery examples, and contact
              details current. Gallery images and testimonials may include
              illustrative or placeholder examples until replaced with verified
              project photos and customer quotes. Always confirm details with us
              before relying on a specific product, price, or timeline.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
              Acceptable use
            </h2>
            <p className="mt-3">
              You agree not to misuse the site—including submitting false contact
              information, attempting to disrupt the service, scraping content for
              competing commercial use without permission, or using our contact
              channels for spam or harassment.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
              Intellectual property
            </h2>
            <p className="mt-3">
              Site copy, branding, logos, and photographs are owned by{" "}
              {siteConfig.name} or used with permission. You may not copy or
              republish them for commercial purposes without our written consent.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
              Third-party services
            </h2>
            <p className="mt-3">
              The site may rely on hosting and privacy-friendly analytics
              providers. Their processing of technical data is described in our{" "}
              <Link
                href="/privacy"
                className="focus-ring rounded font-medium text-ink underline-offset-2 hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
              Disclaimer
            </h2>
            <p className="mt-3">
              The website is provided “as is.” To the fullest extent allowed by
              law, {siteConfig.name} disclaims warranties about uninterrupted
              access or error-free content. Nothing on this site replaces a signed
              contract for construction work.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
              Limitation of liability
            </h2>
            <p className="mt-3">
              To the extent permitted by North Carolina law, {siteConfig.name} is
              not liable for indirect or consequential damages arising from use of
              this website. Liability related to contracted fence or deck work is
              governed by the written agreement for that project.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
              Governing law
            </h2>
            <p className="mt-3">
              These terms are governed by the laws of the State of North Carolina,
              without regard to conflict-of-law rules. Venue for disputes related
              to the website is in courts serving Harnett or Wake County, as
              applicable.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
              Contact
            </h2>
            <p className="mt-3">
              Questions about these terms? Contact {siteConfig.name} at{" "}
              <a
                href={siteConfig.emailHref}
                className="focus-ring rounded font-medium text-ink underline-offset-2 hover:underline"
              >
                {siteConfig.email}
              </a>{" "}
              or{" "}
              <a
                href={siteConfig.phoneHref}
                className="focus-ring rounded font-medium text-ink underline-offset-2 hover:underline"
              >
                {siteConfig.phone}
              </a>
              .
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}

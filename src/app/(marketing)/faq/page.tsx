import type { Metadata } from "next";
import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import { breadcrumbJsonLd, faqPageJsonLd } from "@/lib/jsonld";
import { faqs, siteConfig } from "@/lib/site";

const title = "Frequently Asked Questions";
const description = `Answers about fence timelines, permits, materials, deck repairs, and service area from ${siteConfig.name} in Angier and Raleigh NC.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/faq" },
  openGraph: {
    title: `${title} | ${siteConfig.name}`,
    description,
    url: "/faq",
    images: [{ url: "/gallery/cedar-privacy.jpg" }],
  },
  twitter: {
    card: "summary",
    title: `${title} | ${siteConfig.name}`,
    description,
  },
};

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={[
          faqPageJsonLd(),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]),
        ]}
      />

      <section className="page-hero">
        <div className="container-page section-header relative">
          <p className="eyebrow">FAQ</p>
          <h1 className="mt-3.5 text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.03em] text-ink sm:text-4xl sm:leading-[1.12] lg:text-5xl lg:leading-[1.1]">
            Questions before you book
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
            Timelines, permits, materials, deck repairs, and where we work across
            Angier, Raleigh, and nearby towns. Still unsure? Call{" "}
            <a
              href={siteConfig.phoneHref}
              className="focus-ring rounded font-semibold text-ink underline-offset-2 hover:underline"
            >
              {siteConfig.phone}
            </a>
            .
          </p>
        </div>
      </section>

      <section className="container-page section-y">
        <Reveal className="mx-auto max-w-3xl">
          <FaqAccordion items={faqs} />
        </Reveal>
      </section>

      <section className="section-alt py-12 lg:py-16">
        <Reveal className="container-page max-w-3xl text-center">
          <span className="accent-bar mx-auto mb-5" aria-hidden />
          <h2 className="font-display text-2xl font-semibold tracking-[-0.025em] text-ink sm:text-3xl">
            Didn’t see your question?
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Request a free quote or call—we’re happy to talk through your fence
            or deck project.
          </p>
          <div className="mt-7 flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link href="/quote" className="focus-ring btn-primary w-full justify-center sm:w-auto">
              Get a Free Quote
            </Link>
            <Link href="/how-it-works" className="focus-ring btn-secondary-light w-full justify-center sm:w-auto">
              See how it works
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

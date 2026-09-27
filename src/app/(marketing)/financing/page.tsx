import type { Metadata } from "next";
import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import {
  defaultOgImage,
  financingFaqs,
  financingOptions,
  siteConfig,
} from "@/lib/site";

const title = "Project Financing Options";
const description = `How ${siteConfig.name} handles deposits, phased projects, and optional third-party financing for fence and deck work in Angier & Raleigh NC. Educational only—no lender application on this site.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/financing" },
  openGraph: {
    title: `${title} | ${siteConfig.name}`,
    description,
    url: "/financing",
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | ${siteConfig.name}`,
    description,
    images: [defaultOgImage.url],
  },
};

export default function FinancingPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Financing", path: "/financing" },
          ]),
        ]}
      />

      <section className="page-hero">
        <div className="container-page section-header relative">
          <p className="eyebrow">Financing</p>
          <h1 className="mt-3.5 text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.03em] text-ink sm:text-4xl sm:leading-[1.12] lg:text-5xl lg:leading-[1.1]">
            Clear payment paths—no pressure, no mystery fees
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
            Understand deposits, phased builds, and optional third-party
            financing before you book. This page is educational; we do not run a
            lender or credit decision on this website.
          </p>
        </div>
      </section>

      <section className="container-page section-y">
        <Reveal className="rounded-2xl border border-bronze/25 bg-bronze/[0.07] px-5 py-4 text-sm leading-relaxed text-ink dark:bg-bronze/10 sm:px-6">
          <p className="font-semibold">Important</p>
          <p className="mt-1 text-muted">
            {siteConfig.name} provides estimates and project billing. Any
            consumer financing—if offered through a partner—is between you and
            that lender. Rates, approval, and repayment terms are not controlled
            by Kaba Fence.
          </p>
        </Reveal>

        <ul className="mt-10 grid gap-5 lg:grid-cols-3 lg:gap-6">
          {financingOptions.map((opt, i) => (
            <Reveal
              as="li"
              key={opt.id}
              delay={i * 70}
              className="card flex h-full flex-col p-5 sm:p-6"
            >
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-bronze-dark dark:text-bronze-light">
                Option {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-3 font-display text-xl font-semibold tracking-tight text-ink">
                {opt.title}
              </h2>
              <p className="mt-2 text-sm font-medium text-ink/90">{opt.summary}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                {opt.details}
              </p>
              <p className="mt-4 border-t border-ink/[0.07] pt-4 text-sm text-muted dark:border-cream/10">
                <span className="font-semibold text-ink">Good for: </span>
                {opt.goodFor}
              </p>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="section-alt section-y">
        <div className="container-page">
          <Reveal className="mx-auto max-w-3xl">
            <p className="eyebrow text-center">FAQ</p>
            <h2 className="mt-3 text-center font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Financing questions, answered plainly
            </h2>
            <div className="mt-8">
              <FaqAccordion items={[...financingFaqs]} />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-page section-y">
        <Reveal className="band-dark relative overflow-hidden rounded-[1.25rem] px-4 py-10 text-center sm:px-10 sm:py-12">
          <div className="relative">
            <span className="accent-bar mx-auto mb-5" aria-hidden />
            <h2 className="font-display text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
              Start with a free estimate—financing talk comes later
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-cream/70 sm:text-base">
              Know the scope and price first. Then choose the payment approach
              that fits your household.
            </p>
            <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link href="/quote" className="focus-ring btn-primary w-full justify-center sm:w-auto">
                Get a Free Quote
              </Link>
              <a
                href={siteConfig.phoneHref}
                className="focus-ring btn-secondary w-full justify-center sm:w-auto"
              >
                Call {siteConfig.phone}
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import {
  careGuides,
  defaultOgImage,
  siteConfig,
  warrantyFaqs,
  warrantyHighlights,
} from "@/lib/site";

const title = "Warranty & Care";
const description = `Workmanship coverage, manufacturer warranties, and care tips for fences and decks from ${siteConfig.name} in Angier & Raleigh NC.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/warranty" },
  openGraph: {
    title: `${title} | ${siteConfig.name}`,
    description,
    url: "/warranty",
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | ${siteConfig.name}`,
    description,
    images: [defaultOgImage.url],
  },
};

export default function WarrantyPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Warranty & care", path: "/warranty" },
          ]),
        ]}
      />

      <section className="page-hero">
        <div className="container-page section-header relative">
          <p className="eyebrow">Warranty & care</p>
          <h1 className="mt-3.5 text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.03em] text-ink sm:text-4xl sm:leading-[1.12] lg:text-5xl lg:leading-[1.1]">
            Built to last—and backed in writing
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
            Know what we cover as the installer, what manufacturers cover on
            materials, and how simple seasonal care keeps your fence or deck
            looking sharp in Carolina weather.
          </p>
        </div>
      </section>

      <section className="container-page section-y">
        <ul className="grid gap-5 lg:grid-cols-3 lg:gap-6">
          {warrantyHighlights.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              delay={i * 70}
              className="card p-5 sm:p-6"
            >
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-bronze-dark dark:text-bronze-light">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-3 font-display text-xl font-semibold tracking-tight text-ink">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
            </Reveal>
          ))}
        </ul>
        <Reveal className="mt-8 rounded-2xl border border-ink/[0.08] bg-ivory-muted/50 px-5 py-4 text-sm leading-relaxed text-muted dark:border-cream/10 dark:bg-ivory-muted/40 sm:px-6">
          <p>
            <span className="font-semibold text-ink">Note: </span>
            Exact warranty terms are listed on your project contract. The
            overview here is for education and may be refined for your scope, materials, and site conditions.
          </p>
        </Reveal>
      </section>

      <section className="section-alt section-y" aria-labelledby="care-heading">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Care guides</p>
            <h2
              id="care-heading"
              className="mt-3 text-[1.85rem] font-semibold tracking-[-0.028em] text-ink sm:text-3xl"
            >
              Keep it looking new longer
            </h2>
            <p className="mt-3.5 leading-relaxed text-muted">
              A little seasonal attention goes a long way—especially with pollen,
              humidity, and summer sun across Wake and Harnett counties.
            </p>
          </Reveal>
          <ul className="mt-9 grid gap-5 sm:grid-cols-2 lg:gap-6">
            {careGuides.map((guide, i) => (
              <Reveal
                as="li"
                key={guide.material}
                delay={i * 60}
                className="card p-5 sm:p-6"
              >
                <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                  {guide.material}
                </h3>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
                  {guide.tips.map((tip) => (
                    <li key={tip} className="flex gap-2.5">
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-bronze"
                        aria-hidden
                      />
                      {tip}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page section-y">
        <Reveal className="mx-auto max-w-3xl">
          <p className="eyebrow text-center">FAQ</p>
          <h2 className="mt-3 text-center font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Warranty questions
          </h2>
          <div className="mt-8">
            <FaqAccordion items={[...warrantyFaqs]} />
          </div>
        </Reveal>
      </section>

      <section className="section-alt py-12 lg:py-16">
        <Reveal className="container-page max-w-3xl text-center">
          <span className="accent-bar mx-auto mb-5" aria-hidden />
          <h2 className="font-display text-2xl font-semibold tracking-[-0.025em] text-ink sm:text-3xl">
            Need a warranty visit or care advice?
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Call{" "}
            <a
              href={siteConfig.phoneHref}
              className="focus-ring rounded font-semibold text-ink underline-offset-2 hover:underline"
            >
              {siteConfig.phone}
            </a>{" "}
            or request a quote for a new project—we’re happy to help either way.
          </p>
          <div className="mt-7 flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link href="/quote" className="focus-ring btn-primary w-full justify-center sm:w-auto">
              Get a Free Quote
            </Link>
            <Link href="/materials" className="focus-ring btn-secondary-light w-full justify-center sm:w-auto">
              Materials guide
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

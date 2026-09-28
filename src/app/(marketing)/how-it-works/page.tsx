import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { getPublishedProcessTimeline } from "@/lib/cms/public";
import { defaultOgImage, siteConfig } from "@/lib/site";

const title = "How It Works";
const description = `From free estimate to design, build, and walkthrough—see how ${siteConfig.name} delivers fence and deck projects in Angier, Raleigh, and nearby NC.`;

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | ${siteConfig.name}`,
    description,
    images: [defaultOgImage],
  },
};

export const dynamic = "force-dynamic";

export default function HowItWorksPage() {
  const processTimeline = getPublishedProcessTimeline();

  return (
    <>
      <section className="page-hero">
        <div className="container-page section-header relative">
          <p className="eyebrow">Our process</p>
          <h1 className="mt-3.5 text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.03em] text-ink sm:text-4xl sm:leading-[1.12] lg:text-5xl lg:leading-[1.1]">
            Estimate → design → build → walkthrough
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
            A clear path from first conversation to finished fence or deck—so
            Angier and Raleigh homeowners always know what happens next.
          </p>
        </div>
      </section>

      <section className="container-page section-y">
        <ol className="relative mx-auto max-w-3xl space-y-0">
          {/* Vertical timeline line */}
          <span
            className="pointer-events-none absolute left-[1.375rem] top-4 bottom-4 w-px bg-gradient-to-b from-bronze/50 via-bronze/25 to-transparent sm:left-[1.625rem]"
            aria-hidden
          />
          {processTimeline.map((step, i) => (
            <Reveal as="li" key={step.step} delay={i * 90} className="relative flex gap-5 pb-10 last:pb-0 sm:gap-8 sm:pb-12">
              <span className="relative z-[1] flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-bronze bg-surface font-display text-sm font-bold text-bronze-dark shadow-[0_0_0_4px_var(--ivory)] dark:text-bronze dark:shadow-[0_0_0_4px_var(--ivory)] sm:h-14 sm:w-14 sm:text-base">
                {step.step}
              </span>
              <div className="card flex-1 p-5 sm:p-6">
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-bronze-dark dark:text-bronze-light">
                  {step.eyebrow}
                </p>
                <h2 className="mt-2 font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                  {step.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted sm:text-[0.9375rem]">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="section-alt section-y">
        <div className="container-page">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow eyebrow-center">What you get</p>
            <h2 className="mt-3.5 text-2xl font-semibold tracking-[-0.025em] text-ink sm:text-3xl">
              No guesswork along the way
            </h2>
          </Reveal>
          <ul className="mx-auto mt-8 grid max-w-4xl gap-4 sm:mt-10 sm:grid-cols-3 sm:gap-5">
            {[
              {
                title: "Written estimate",
                body: "Scope, materials, and timeline in writing before work begins.",
              },
              {
                title: "Scheduled crew",
                body: "Agreed start dates with a local team that shows up ready.",
              },
              {
                title: "Final walkthrough",
                body: "We review gates, rails, and finish details together before we leave.",
              },
            ].map((item, i) => (
              <Reveal as="li" key={item.title} delay={i * 70} className="card p-5 text-center sm:p-6">
                <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">
                  {item.body}
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page pb-16 lg:pb-20">
        <Reveal className="band-dark relative overflow-hidden rounded-[1.25rem] px-4 py-10 text-center sm:px-10 sm:py-12 md:px-12">
          <div className="relative">
            <span className="accent-bar mx-auto mb-5" aria-hidden />
            <h2 className="font-display text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
              Start with a free estimate
            </h2>
            <p className="mx-auto mt-3 max-w-xl leading-relaxed text-cream/75">
              Tell us about your fence or deck project. We’ll schedule an on-site
              visit in Angier, Raleigh, or your nearby community.
            </p>
            <div className="mt-7 flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link href="/contact" className="focus-ring btn-primary w-full justify-center sm:w-auto">
                Request a Free Estimate
              </Link>
              <Link href="/faq" className="focus-ring btn-secondary w-full justify-center sm:w-auto">
                Read the FAQ
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

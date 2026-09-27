import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { companyValues, siteConfig, trustPoints } from "@/lib/site";

const title = "About Our Crew";
const description = `Meet ${siteConfig.name}—a local Angier & Raleigh NC fence and deck crew focused on clear estimates, solid craftsmanship, and clean job sites.`;

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | ${siteConfig.name}`,
    description,
    images: [{ url: "/gallery/cedar-privacy.png" }],
  },
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container-page section-header relative">
          <p className="eyebrow">Our story</p>
          <h1 className="mt-3.5 text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.03em] text-ink sm:text-4xl sm:leading-[1.12] lg:text-5xl lg:leading-[1.1]">
            A local crew you can call by name
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
            {siteConfig.name} started with a simple idea: fence and deck work
            done right for Angier, Raleigh, and the towns in between—honest
            estimates, materials that survive Carolina weather, and a job site
            left cleaner than we found it.
          </p>
        </div>
      </section>

      <section className="container-page section-y">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14 lg:items-start">
          <Reveal className="lg:col-span-5">
            <span className="accent-bar" aria-hidden />
            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.025em] text-ink sm:text-3xl">
              Rooted in Angier. Working across the Triangle edge.
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              We’re homeowners ourselves. We know what a leaning fence after a
              storm feels like, and how much a solid deck changes weekend plans.
              That’s why we show up on time, explain the options in plain
              language, and stand behind the work.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              Whether it’s a cedar privacy run in Raleigh, vinyl for an HOA
              neighborhood, or a deck rebuild in Angier, you’ll get the same
              careful crew from first measure to final walkthrough.
            </p>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-7">
            <ul className="grid gap-4 sm:grid-cols-2">
              {trustPoints.map((point) => (
                <li
                  key={point.label}
                  className="card flex items-center gap-3 p-4 sm:p-5"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bronze/15 text-bronze-dark dark:text-bronze"
                    aria-hidden
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-sm font-semibold tracking-tight text-ink">
                    {point.label}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section-alt section-y">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">What we stand for</p>
            <h2 className="mt-3 text-[1.85rem] font-semibold tracking-[-0.028em] text-ink sm:mt-3.5 sm:text-3xl">
              Values that show up on every job
            </h2>
            <p className="mt-3.5 leading-relaxed text-muted">
              These aren’t marketing lines—they’re how we schedule, quote, and
              build for neighbors across Wake and Harnett counties.
            </p>
          </Reveal>
          <ul className="mt-9 grid gap-5 sm:mt-11 sm:grid-cols-2 lg:gap-6">
            {companyValues.map((value, i) => (
              <Reveal
                as="li"
                key={value.title}
                delay={i * 70}
                className="card p-5 sm:p-6"
              >
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-bronze-dark dark:text-bronze-light">
                  0{i + 1}
                </p>
                <h3 className="mt-3 font-display text-lg font-semibold tracking-tight text-ink">
                  {value.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">
                  {value.description}
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page section-y">
        <Reveal className="band-dark relative overflow-hidden rounded-[1.25rem] px-4 py-10 text-center sm:px-10 sm:py-12 md:px-12">
          <div className="relative">
            <span className="accent-bar mx-auto mb-5" aria-hidden />
            <h2 className="font-display text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
              Ready to talk through your project?
            </h2>
            <p className="mx-auto mt-3 max-w-xl leading-relaxed text-cream/75">
              Request a free on-site estimate. We’ll measure carefully, recommend
              materials that fit your yard and budget, and leave you with a
              clear written quote.
            </p>
            <div className="mt-7 flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
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

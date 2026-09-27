import type { Metadata } from "next";
import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";
import ServiceIcon from "@/components/ServiceIcon";
import { deckServices, fencingServices, siteConfig } from "@/lib/site";

const title = "Fence & Deck Services";
const description = `Wood, vinyl, chain-link, aluminum fencing and deck repair, rebuilds, and new builds from ${siteConfig.name} in Angier and Raleigh NC.`;

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | ${siteConfig.name}`,
    description,
  },
};

export default function ServicesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container-page section-header relative">
          <p className="eyebrow">What we offer</p>
          <h1 className="mt-3.5 text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.03em] text-ink sm:text-4xl sm:leading-[1.12] lg:text-5xl lg:leading-[1.1]">
            Fence & deck services
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
            Whether you need a new privacy fence along your Angier backyard or
            a full deck rebuild in Raleigh, {siteConfig.name} delivers solid
            craftsmanship with materials suited to North Carolina weather.
          </p>
        </div>
      </section>

      <section className="container-page section-y">
        <div className="max-w-2xl">
          <span className="accent-bar" aria-hidden />
          <h2 className="mt-4 text-2xl font-semibold tracking-[-0.025em] text-ink sm:text-3xl">
            Fencing
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            New installs, replacements, and repairs—built to last and look right
            on your property.
          </p>
        </div>
        <ul className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {fencingServices.map((service) => (
            <li key={service.slug} className="card flex flex-col p-5 sm:p-6">
              <span className="icon-badge">
                <ServiceIcon slug={service.slug} />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-ink">
                {service.title}
              </h3>
              <p className="mt-2.5 text-sm font-medium text-bronze">
                {service.summary}
              </p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                {service.details}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="section-alt section-y">
        <div className="container-page">
          <div className="max-w-2xl">
            <span className="accent-bar" aria-hidden />
            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.025em] text-ink sm:text-3xl">
              Decks
            </h2>
            <p className="mt-3 leading-relaxed text-muted">
              Safe structures, better outdoor living—from small repairs to custom
              new builds.
            </p>
          </div>
          <ul className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6">
            {deckServices.map((service) => (
              <li key={service.slug} className="card flex flex-col p-5 sm:p-6">
                <span className="icon-badge">
                  <ServiceIcon slug={service.slug} />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-ink">
                  {service.title}
                </h3>
                <p className="mt-2.5 text-sm font-medium text-bronze">
                  {service.summary}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {service.details}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page section-y">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow eyebrow-center">FAQ</p>
          <h2 className="mt-3.5 text-2xl font-semibold tracking-[-0.025em] text-ink sm:text-3xl">
            Questions before you book
          </h2>
          <p className="mt-3 text-muted leading-relaxed">
            Timelines, permits, materials, and whether repair or rebuild makes sense.
          </p>
        </div>
        <div className="mx-auto mt-8 max-w-3xl sm:mt-10">
          <FaqAccordion />
        </div>
      </section>

      <section className="container-page pb-16 lg:pb-20">
        <div className="band-dark relative overflow-hidden rounded-[1.25rem] px-4 py-10 text-center sm:px-10 sm:py-12 md:px-12">
          <div className="relative">
            <span className="accent-bar mx-auto mb-5" aria-hidden />
            <h2 className="font-display text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
              Not sure which option fits?
            </h2>
            <p className="mx-auto mt-3 max-w-xl leading-relaxed text-cream/75">
              We&apos;ll walk your property, talk through style and budget, and
              recommend materials that make sense for Angier and Raleigh homes.
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
        </div>
      </section>
    </>
  );
}

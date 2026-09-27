import type { Metadata } from "next";
import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";
import Reveal from "@/components/Reveal";
import ServiceIcon from "@/components/ServiceIcon";
import ServicesSubnav from "@/components/ServicesSubnav";
import {
  deckServices,
  fencingServices,
  howItWorks,
  siteConfig,
} from "@/lib/site";

const title = "Fence & Deck Services";
const description = `Wood, vinyl, chain-link, aluminum fencing and deck repair, rebuilds, and new builds from ${siteConfig.name} in Angier and Raleigh NC.`;

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | ${siteConfig.name}`,
    description,
    images: [{ url: "/gallery/cedar-privacy.jpg" }],
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

      <div className="container-page pt-4 sm:pt-6">
        <ServicesSubnav />
      </div>

      <section id="fencing" className="container-page section-y scroll-mt-[calc(var(--header-offset)+3.5rem)]">
        <Reveal className="max-w-2xl">
          <span className="accent-bar" aria-hidden />
          <h2 className="mt-4 text-2xl font-semibold tracking-[-0.025em] text-ink sm:text-3xl">
            Fencing
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            New installs, replacements, and repairs—built to last and look right
            on your property.
          </p>
        </Reveal>
        <ul className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {fencingServices.map((service, i) => (
            <Reveal
              as="li"
              key={service.slug}
              delay={i * 60}
              className="card group flex flex-col p-5 sm:p-6"
            >
              <span className="icon-badge">
                <ServiceIcon slug={service.slug} />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-ink">
                {service.title}
              </h3>
              <p className="mt-2.5 text-sm font-medium text-bronze-dark dark:text-bronze-light">
                {service.summary}
              </p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                {service.details}
              </p>
              <Link
                href="/quote"
                className="focus-ring btn-ghost mt-5 inline-flex min-h-10 items-center self-start transition"
              >
                Get a quote →
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      <section id="decks" className="section-alt section-y scroll-mt-[calc(var(--header-offset)+3.5rem)]">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <span className="accent-bar" aria-hidden />
            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.025em] text-ink sm:text-3xl">
              Decks
            </h2>
            <p className="mt-3 leading-relaxed text-muted">
              Safe structures, better outdoor living—from small repairs to custom
              new builds.
            </p>
          </Reveal>
          <ul className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6">
            {deckServices.map((service, i) => (
              <Reveal
                as="li"
                key={service.slug}
                delay={i * 60}
                className="card group flex flex-col p-5 sm:p-6"
              >
                <span className="icon-badge">
                  <ServiceIcon slug={service.slug} />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-ink">
                  {service.title}
                </h3>
                <p className="mt-2.5 text-sm font-medium text-bronze-dark dark:text-bronze-light">
                  {service.summary}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {service.details}
                </p>
                <Link
                  href="/quote"
                  className="focus-ring btn-ghost mt-5 inline-flex min-h-10 items-center self-start"
                >
                  Get a quote →
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section id="process" className="container-page section-y scroll-mt-[calc(var(--header-offset)+3.5rem)]">
        <Reveal className="max-w-2xl">
          <span className="accent-bar" aria-hidden />
          <h2 className="mt-4 text-2xl font-semibold tracking-[-0.025em] text-ink sm:text-3xl">
            Our process
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            A clear path from first conversation to finished fence or deck—so you
            always know what happens next.
          </p>
        </Reveal>
        <ol className="process-timeline mt-10 grid gap-8 md:grid-cols-3 md:gap-8">
          {howItWorks.map((step, i) => (
            <Reveal as="li" key={step.step} delay={i * 90} className="relative pl-14 md:pl-0">
              {i < howItWorks.length - 1 && (
                <span
                  className="pointer-events-none absolute left-[3.25rem] top-[1.375rem] hidden h-px w-[calc(100%-1.5rem)] bg-gradient-to-r from-bronze/40 via-bronze/15 to-transparent md:block"
                  aria-hidden
                />
              )}
              <span className="step-badge absolute left-0 top-0 md:static">{step.step}</span>
              <h3 className="mt-0 font-display text-xl font-semibold tracking-tight text-ink md:mt-5">
                {step.title}
              </h3>
              <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-muted">
                {step.description}
              </p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section id="faq" className="section-soft section-y scroll-mt-[calc(var(--header-offset)+3.5rem)]">
        <div className="container-page">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow eyebrow-center">FAQ</p>
            <h2 className="mt-3.5 text-2xl font-semibold tracking-[-0.025em] text-ink sm:text-3xl">
              Questions before you book
            </h2>
            <p className="mt-3 text-muted leading-relaxed">
              Timelines, permits, materials, and whether repair or rebuild makes sense.
            </p>
          </Reveal>
          <Reveal className="mx-auto mt-8 max-w-3xl sm:mt-10" delay={80}>
            <FaqAccordion />
          </Reveal>
          <Reveal className="mt-6 text-center" delay={120}>
            <Link href="/faq" className="focus-ring btn-ghost inline-flex min-h-11 items-center">
              View all FAQs →
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="container-page pb-16 lg:pb-20">
        <Reveal className="band-dark relative overflow-hidden rounded-[1.25rem] px-4 py-10 text-center sm:px-10 sm:py-12 md:px-12">
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
        </Reveal>
      </section>
    </>
  );
}

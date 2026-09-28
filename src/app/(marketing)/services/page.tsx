import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import {
  getPublishedFenceTypes,
  getPublishedServices,
} from "@/lib/cms/public";
import { defaultOgImage, siteConfig } from "@/lib/site";

const title = "Fencing Options";
const description = `Wood, vinyl, aluminum, and chain link fencing from ${siteConfig.name} in Raleigh, NC & surrounding areas.`;

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

export default function ServicesPage() {
  const fencingServices = getPublishedFenceTypes();
  const deckServices = getPublishedServices();

  return (
    <>
      <section className="page-hero">
        <div className="container-page section-header relative">
          <p className="eyebrow">Fencing Options</p>
          <h1 className="mt-3.5 text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.03em] text-ink sm:text-4xl sm:leading-[1.12] lg:text-5xl lg:leading-[1.1]">
            Find the right fence for your property
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
            Wood, vinyl, aluminum, or chain link—{siteConfig.name} helps you
            choose materials that fit your goals, budget, and Raleigh-area home
            or commercial property.
          </p>
        </div>
      </section>

      <section className="container-page section-y">
        <ul className="grid gap-8 lg:gap-12">
          {fencingServices.map((service, i) => (
            <Reveal
              as="li"
              key={service.slug}
              id={service.slug}
              delay={i * 40}
              className="scroll-mt-[calc(var(--header-offset)+1rem)] grid gap-6 overflow-hidden rounded-2xl border border-ink/[0.07] bg-surface shadow-sm dark:border-cream/10 lg:grid-cols-2 lg:gap-0"
            >
              <div
                className={`relative aspect-[16/10] lg:aspect-auto lg:min-h-[18rem] ${
                  i % 2 === 1 ? "lg:order-2" : ""
                }`}
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-bronze-dark dark:text-bronze-light">
                  {service.tagline}
                </p>
                <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
                  {service.title}
                </h2>
                <p className="mt-3 text-sm font-medium text-ink/80">{service.summary}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{service.details}</p>
                <Link
                  href="/contact"
                  className="focus-ring btn-primary mt-6 w-fit gap-2"
                >
                  Request a Free Estimate →
                </Link>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      {deckServices.length > 0 ? (
        <section className="section-soft section-y">
          <div className="container-page">
            <Reveal>
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-bronze-dark dark:text-bronze-light">
                Deck Services
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
                Repair, rebuild, and new deck builds
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                Beyond fencing, {siteConfig.name} helps keep decks safe and
                useful—repairs, rebuilds, new builds, and railing upgrades.
              </p>
            </Reveal>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {deckServices.map((svc, i) => (
                <Reveal
                  as="li"
                  key={svc.slug}
                  id={`deck-${svc.slug}`}
                  delay={i * 60}
                  className="card scroll-mt-[calc(var(--header-offset)+1rem)] p-5"
                >
                  <h3 className="font-display text-base font-semibold text-ink">
                    {svc.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {svc.summary}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    {svc.details}
                  </p>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="band-dark py-14 sm:py-16">
        <Reveal className="container-page max-w-2xl text-center">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            Not sure which fence is right?
          </h2>
          <p className="mt-3 text-cream/75">
            We&apos;ll walk you through options on site—honest guidance, clear
            pricing, no pressure.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link href="/contact" className="focus-ring btn-primary justify-center gap-2">
              Request a Free Estimate →
            </Link>
            <a href={siteConfig.phoneHref} className="focus-ring btn-secondary justify-center">
              Call {siteConfig.phone}
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import {
  getPublishedFenceTypes,
  getPublishedServices,
} from "@/lib/cms/public";
import { defaultOgImage, siteConfig } from "@/lib/site";

const title = "Commercial Fencing";
const description = `Commercial fence installation for businesses and properties in Raleigh, NC & surrounding areas from ${siteConfig.name}.`;

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

const commercialPoints = [
  {
    title: "Secure perimeters",
    description:
      "Chain-link, wood, and aluminum systems sized for lots, yards, and facility boundaries.",
  },
  {
    title: "Clear timelines",
    description:
      "Written scopes and schedules so your property stays operational while we work.",
  },
  {
    title: "Durable materials",
    description:
      "Options built for Carolina weather and everyday commercial wear—not just curb appeal.",
  },
  {
    title: "Local accountability",
    description:
      "A Raleigh-area crew you can call by name—before, during, and after installation.",
  },
] as const;

export default function CommercialPage() {
  const fencingServices = getPublishedFenceTypes("commercial");
  const deckServices = getPublishedServices("commercial");

  return (
    <>
      <section className="page-hero">
        <div className="container-page section-header relative">
          <p className="eyebrow">Commercial</p>
          <h1 className="mt-3.5 text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.03em] text-ink sm:text-4xl sm:leading-[1.12] lg:text-5xl lg:leading-[1.1]">
            Professional fencing for commercial properties
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
            From secure perimeters to clean roadside runs, {siteConfig.name}{" "}
            delivers commercial fencing with the same care we bring to every
            residential project—clear guidance, solid craftsmanship, and a job
            site left clean.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="focus-ring btn-primary gap-2 justify-center sm:w-auto">
              Request a Free Estimate →
            </Link>
            <a href={siteConfig.phoneHref} className="focus-ring btn-secondary-light justify-center">
              Call {siteConfig.phone}
            </a>
          </div>
        </div>
      </section>

      <section className="container-page section-y">
        <Reveal className="max-w-2xl">
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-bronze-dark dark:text-bronze-light">
            Why Kaba
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
            Commercial projects, handled with care
          </h2>
        </Reveal>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2">
          {commercialPoints.map((point, i) => (
            <Reveal as="li" key={point.title} delay={i * 70} className="card p-6">
              <h3 className="font-display text-lg font-semibold text-ink">{point.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{point.description}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      {fencingServices.length > 0 ? (
        <section className="section-soft section-y">
          <div className="container-page">
            <Reveal>
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-bronze-dark dark:text-bronze-light">
                Options
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
                Commercial fencing materials
              </h2>
            </Reveal>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {fencingServices.map((svc, i) => (
                <Reveal as="li" key={svc.slug} delay={i * 60} className="card p-5">
                  <h3 className="font-display text-base font-semibold text-ink">{svc.title}</h3>
                  <p className="mt-1 text-xs text-muted">{svc.tagline}</p>
                  <Link
                    href={`/services#${svc.slug}`}
                    className="focus-ring btn-ghost mt-4 inline-flex min-h-10 items-center"
                  >
                    Learn more →
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {deckServices.length > 0 ? (
        <section className="container-page section-y">
          <Reveal>
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-bronze-dark dark:text-bronze-light">
              Related services
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
              Deck work for commercial properties
            </h2>
          </Reveal>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {deckServices.map((svc, i) => (
              <Reveal as="li" key={svc.slug} delay={i * 60} className="card p-5">
                <h3 className="font-display text-base font-semibold text-ink">{svc.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{svc.summary}</p>
                <Link
                  href={`/services#deck-${svc.slug}`}
                  className="focus-ring btn-ghost mt-4 inline-flex min-h-10 items-center"
                >
                  Learn more →
                </Link>
              </Reveal>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="band-dark py-14 sm:py-16">
        <Reveal className="container-page max-w-2xl text-center">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            Discuss your commercial fence project
          </h2>
          <p className="mt-3 text-cream/75">
            Call {siteConfig.phone} or request a free estimate online.
          </p>
          <Link href="/contact" className="focus-ring btn-primary mt-8 inline-flex gap-2">
            Request a Free Estimate →
          </Link>
        </Reveal>
      </section>
    </>
  );
}

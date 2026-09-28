import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import {
  getPublishedContactInfo,
  getPublishedFenceTypes,
  getPublishedServices,
  getPublishedYourNeeds,
} from "@/lib/cms/public";
import { defaultOgImage, siteConfig } from "@/lib/site";

const title = "Residential Fencing";
const description = `Residential fence installation and repair for homeowners in Raleigh, NC & surrounding areas from ${siteConfig.name}.`;

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

export default function ResidentialPage() {
  const contact = getPublishedContactInfo();
  const yourNeeds = getPublishedYourNeeds();
  const fencingServices = getPublishedFenceTypes("residential");
  const deckServices = getPublishedServices("residential");

  return (
    <>
      <section className="page-hero">
        <div className="container-page section-header relative">
          <p className="eyebrow">Residential</p>
          <h1 className="mt-3.5 text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.03em] text-ink sm:text-4xl sm:leading-[1.12] lg:text-5xl lg:leading-[1.1]">
            Fencing for the way you live at home
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
            Privacy for family gatherings, safer yards for pets, or repairs that
            restore what you already have—{siteConfig.name} guides Raleigh-area
            homeowners from first conversation to finished fence.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="focus-ring btn-primary gap-2 justify-center sm:w-auto">
              Request a Free Estimate →
            </Link>
            <a href={contact.phoneHref} className="focus-ring btn-secondary-light justify-center">
              Call {contact.phone}
            </a>
          </div>
        </div>
      </section>

      <section className="container-page section-y">
        <Reveal>
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-bronze-dark dark:text-bronze-light">
            Your Needs
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
            Built around your home
          </h2>
        </Reveal>
        <ul className="mt-8 grid gap-5 sm:grid-cols-3">
          {yourNeeds.map((need, i) => (
            <Reveal as="li" key={need.id} delay={i * 70} className="card p-6">
              <h3 className="font-display text-lg font-semibold text-ink">{need.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{need.description}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="section-soft section-y">
        <div className="container-page">
          <Reveal>
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-bronze-dark dark:text-bronze-light">
              Options
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
              Residential fencing materials
            </h2>
          </Reveal>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {fencingServices.map((svc, i) => (
              <Reveal as="li" key={svc.slug} delay={i * 60} className="card p-5">
                <h3 className="font-display text-base font-semibold text-ink">{svc.title}</h3>
                <p className="mt-1 text-xs text-muted">{svc.tagline}</p>
                <Link href={`/services#${svc.slug}`} className="focus-ring btn-ghost mt-4 inline-flex min-h-10 items-center">
                  Learn more →
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {deckServices.length > 0 ? (
        <section className="container-page section-y">
          <Reveal>
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-bronze-dark dark:text-bronze-light">
              Deck Services
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
              Decks that match how you live
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
            Ready for a better fence experience?
          </h2>
          <p className="mt-3 text-cream/75">
            Free on-site estimates across {siteConfig.serviceArea}.
          </p>
          <Link href="/contact" className="focus-ring btn-primary mt-8 inline-flex gap-2">
            Request a Free Estimate →
          </Link>
        </Reveal>
      </section>
    </>
  );
}

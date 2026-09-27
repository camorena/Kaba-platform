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
          <h1 className="mt-4 max-w-[16ch] text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.035em] text-ink sm:text-4xl sm:leading-[1.06] lg:text-5xl">
            Fence &amp; deck services
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
            Whether you need a new privacy fence along your Angier backyard or
            a full deck rebuild in Raleigh, {siteConfig.name} delivers solid
            craftsmanship with materials suited to North Carolina weather.
          </p>
        </div>
      </section>

      <section className="container-page section-y">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <span className="accent-bar" aria-hidden />
            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-ink sm:text-3xl">
              Fencing
            </h2>
            <p className="mt-3 leading-relaxed text-muted">
              New installs, replacements, and repairs—built to last and look
              right on your property.
            </p>
          </div>
          <ul className="divide-y divide-ink/15 border-y border-ink/15 lg:col-span-8">
            {fencingServices.map((service, index) => (
              <li
                key={service.slug}
                className="grid gap-3 py-6 sm:grid-cols-[2.5rem_1fr] sm:gap-5"
              >
                <span className="icon-badge">
                  <ServiceIcon slug={service.slug} />
                </span>
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-muted">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-lg font-semibold tracking-tight text-ink sm:text-xl">
                      {service.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm font-medium text-ink/80">
                    {service.summary}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {service.details}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-alt section-y">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <span className="accent-bar" aria-hidden />
              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-ink sm:text-3xl">
                Decks
              </h2>
              <p className="mt-3 leading-relaxed text-muted">
                Safe structures, better outdoor living—from small repairs to
                custom new builds.
              </p>
            </div>
            <ul className="divide-y divide-ink/15 border-y border-ink/15 lg:col-span-8">
              {deckServices.map((service, index) => (
                <li
                  key={service.slug}
                  className="grid gap-3 py-6 sm:grid-cols-[2.5rem_1fr] sm:gap-5"
                >
                  <span className="icon-badge">
                    <ServiceIcon slug={service.slug} />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-muted">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-display text-lg font-semibold tracking-tight text-ink sm:text-xl">
                        {service.title}
                      </h3>
                    </div>
                    <p className="mt-2 text-sm font-medium text-ink/80">
                      {service.summary}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {service.details}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <p className="eyebrow">FAQ</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-ink sm:text-3xl">
                Questions before you book
              </h2>
              <p className="mt-3 text-muted leading-relaxed">
                Timelines, permits, materials, and whether repair or rebuild
                makes sense.
              </p>
            </div>
            <div className="lg:col-span-8">
              <FaqAccordion />
            </div>
          </div>
        </div>
      </section>

      <section className="container-page pb-16 lg:pb-20">
        <div className="band-dark relative grid gap-6 border-t-2 border-bronze px-5 py-10 sm:px-10 sm:py-12 md:grid-cols-12 md:items-end md:gap-8 md:px-12">
          <div className="md:col-span-7">
            <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              Not sure which option fits?
            </h2>
            <p className="mt-3 max-w-xl leading-relaxed text-ivory/70">
              We&apos;ll walk your property, talk through style and budget, and
              recommend materials that make sense for Angier and Raleigh homes.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center md:col-span-5 md:justify-end">
            <Link
              href="/quote"
              className="focus-ring btn-primary w-full justify-center sm:w-auto"
            >
              Get a Free Quote
            </Link>
            <a
              href={siteConfig.phoneHref}
              className="focus-ring text-center text-sm font-semibold text-ivory/80 underline decoration-ivory/30 underline-offset-[0.22em] hover:text-ivory hover:decoration-bronze"
            >
              Call {siteConfig.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

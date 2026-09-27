import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";
import ServiceIcon from "@/components/ServiceIcon";
import {
  deckServices,
  fencingServices,
  galleryProjects,
  howItWorks,
  siteConfig,
  testimonials,
  trustPoints,
} from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `${siteConfig.name} | Fence & Deck Repair in Angier & Raleigh`,
  },
  description:
    "Kaba Fence installs and repairs wood, vinyl, chain-link, and aluminum fencing plus decks across Angier, Raleigh, and nearby NC communities. Free on-site estimates.",
  openGraph: {
    title: `${siteConfig.name} | Fence & Deck Repair in Angier & Raleigh`,
    description:
      "Local fence and deck installation, repairs, and free estimates in Angier, Raleigh, and surrounding NC communities.",
  },
};

export default function HomePage() {
  const featured = [
    ...fencingServices.slice(0, 3),
    ...deckServices.slice(0, 2),
  ];
  const [leadProject, ...restTeaser] = galleryProjects.slice(0, 4);
  const [leadQuote, ...restQuotes] = testimonials;

  return (
    <>
      {/* Hero — editorial masthead + framed field photo */}
      <section className="border-b border-ink/15 bg-surface">
        <div className="container-page grid gap-10 py-12 sm:gap-12 sm:py-16 lg:grid-cols-12 lg:items-end lg:gap-12 lg:py-20">
          <div className="min-w-0 lg:col-span-6 xl:col-span-5">
            <p className="eyebrow">Angier · Raleigh · Nearby NC</p>
            <h1 className="mt-5 max-w-[14ch] text-[2.35rem] font-semibold leading-[1.05] tracking-[-0.035em] text-ink sm:text-[3.15rem] sm:leading-[1.02] lg:text-[3.55rem]">
              Fences &amp; decks built like they matter.
            </h1>
            <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-muted">
              {siteConfig.name} installs and repairs wood, vinyl, chain-link,
              and aluminum fencing—plus deck repairs, rebuilds, and new
              builds—for homeowners across Angier, Raleigh, and nearby towns.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/quote"
                className="focus-ring btn-primary w-full justify-center sm:w-auto"
              >
                Get a Free Quote
              </Link>
              <a
                href={siteConfig.phoneHref}
                className="focus-ring text-center text-sm font-semibold text-ink underline decoration-ink/30 underline-offset-[0.22em] hover:decoration-bronze sm:text-left"
              >
                Or call {siteConfig.phone}
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 xl:col-span-7">
            <figure className="lg:ml-auto lg:max-w-xl xl:max-w-none">
              <div className="frame-photo relative aspect-[5/4] w-full sm:aspect-[4/3]">
                <Image
                  src="/gallery/cedar-privacy.png"
                  alt="Cedar privacy fence installation for a Raleigh-area home"
                  fill
                  priority
                  sizes="(min-width: 1280px) 40rem, (min-width: 1024px) 48vw, 100vw"
                  className="frame-photo-img"
                />
              </div>
              <figcaption className="photo-credit flex flex-wrap items-baseline justify-between gap-2">
                <span>Plate 01 — Cedar privacy, Raleigh</span>
                <span className="text-ink/50">Field install · 2025</span>
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Trust as a ruled strip, not a card grid */}
        <div className="border-t border-ink/15">
          <ul className="container-page flex flex-col gap-3 py-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-8 sm:gap-y-2 sm:py-6">
            {trustPoints.map((point, i) => (
              <li
                key={point.label}
                className="flex items-center gap-2.5 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-ink"
              >
                <span
                  className="inline-block h-2 w-2 shrink-0 bg-bronze"
                  aria-hidden
                />
                {point.label}
                {i < trustPoints.length - 1 && (
                  <span className="ml-2 hidden h-px w-8 bg-ink/15 lg:inline-block" aria-hidden />
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Featured services — asymmetric list, not identical cards */}
      <section className="container-page section-y">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">What we build</p>
            <h2 className="mt-3 text-[1.85rem] font-semibold tracking-[-0.03em] text-ink sm:text-3xl lg:text-[2.35rem]">
              Services for yards that get used.
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              Privacy fences, pet runs, storm repairs, and decks worth sitting
              on—measured carefully and finished clean.
            </p>
            <Link
              href="/services"
              className="focus-ring btn-ghost mt-6 inline-flex min-h-11 items-center"
            >
              All services
            </Link>
          </div>

          <ul className="divide-y divide-ink/15 border-y border-ink/15 lg:col-span-8">
            {featured.map((service, index) => (
              <li
                key={service.slug}
                className="grid grid-cols-[auto_1fr] gap-4 py-5 sm:grid-cols-[3rem_1fr_auto] sm:items-start sm:gap-6 sm:py-6"
              >
                <span className="font-mono text-sm font-semibold tabular-nums text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <div className="flex items-start gap-3">
                    <span className="icon-badge mt-0.5 hidden sm:inline-flex">
                      <ServiceIcon slug={service.slug} />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold tracking-tight text-ink sm:text-xl">
                        {service.title}
                      </h3>
                      <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted">
                        {service.summary}
                      </p>
                    </div>
                  </div>
                </div>
                <span className="hidden font-mono text-[0.65rem] uppercase tracking-[0.08em] text-muted sm:block">
                  Fence &amp; deck
                </span>
              </li>
            ))}
            <li className="mark-left bg-ivory-muted/60 py-5 sm:py-6">
              <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                Need something else?
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                Gate installs, railing upgrades, storm damage—ask. If we can
                help, we will.
              </p>
              <Link
                href="/quote"
                className="focus-ring btn-ghost mt-4 inline-flex min-h-10 items-center"
              >
                Tell us about it
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* Customer notes — editorial pull quote + supporting notes */}
      <section className="section-soft section-y">
        <div className="container-page">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">From the neighborhood</p>
              <h2 className="mt-3 text-[1.85rem] font-semibold tracking-[-0.03em] text-ink sm:text-3xl">
                Neighbors, not reviews bots.
              </h2>
            </div>
          </div>

          <div className="mt-10 grid gap-8 lg:mt-12 lg:grid-cols-12 lg:gap-10">
            <blockquote className="border border-ink/15 bg-surface p-6 sm:p-8 lg:col-span-7 lg:p-10">
              <p className="font-display text-2xl font-medium leading-snug tracking-[-0.02em] text-ink sm:text-3xl sm:leading-snug">
                “{leadQuote.quote}”
              </p>
              <footer className="mt-6 flex items-center gap-3 border-t border-ink/10 pt-5">
                <span className="h-2 w-2 bg-bronze" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-ink">{leadQuote.name}</p>
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-muted">
                    {leadQuote.town}
                  </p>
                </div>
              </footer>
            </blockquote>

            <ul className="flex flex-col gap-5 lg:col-span-5 lg:justify-between">
              {restQuotes.map((testimonial) => (
                <li
                  key={testimonial.name}
                  className="border-t border-ink/15 pt-5 first:border-t-0 first:pt-0 lg:first:border-t lg:first:pt-5"
                >
                  <p className="text-sm leading-relaxed text-muted">
                    “{testimonial.quote}”
                  </p>
                  <p className="mt-3 text-sm font-semibold text-ink">
                    {testimonial.name}
                    <span className="ml-2 font-mono text-[0.65rem] font-medium uppercase tracking-[0.1em] text-muted">
                      {testimonial.town}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Recent work — magazine mosaic, not equal cards */}
      <section className="section-y">
        <div className="container-page">
          <div className="flex flex-col gap-4 border-b border-ink/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow">Field notes</p>
              <h2 className="mt-3 text-[1.85rem] font-semibold tracking-[-0.03em] text-ink sm:text-3xl">
                Recent work
              </h2>
            </div>
            <Link
              href="/gallery"
              className="focus-ring btn-ghost inline-flex min-h-11 items-center shrink-0"
            >
              Browse gallery
            </Link>
          </div>

          <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-12 lg:gap-6">
            <article className="lg:col-span-7">
              <div className="frame-photo relative aspect-[4/3] w-full">
                <Image
                  src={leadProject.image}
                  alt={`${leadProject.title}. ${leadProject.caption}.`}
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="frame-photo-img"
                />
              </div>
              <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-muted">
                    {leadProject.category}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-semibold tracking-tight text-ink">
                    {leadProject.title}
                  </h3>
                </div>
              </div>
            </article>

            <ul className="grid gap-6 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1 lg:gap-5">
              {restTeaser.map((project, i) => (
                <li key={project.id} className="grid grid-cols-[1fr] gap-3 sm:grid-cols-1 lg:grid-cols-[7rem_1fr] lg:items-center lg:gap-4">
                  <div className="frame-photo relative aspect-[4/3] w-full lg:aspect-square">
                    <Image
                      src={project.image}
                      alt={`${project.title}. ${project.caption}.`}
                      fill
                      sizes="(min-width: 1024px) 7rem, (min-width: 640px) 30vw, 100vw"
                      className="frame-photo-img"
                    />
                  </div>
                  <div>
                    <p className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-muted">
                      {String(i + 2).padStart(2, "0")} · {project.category}
                    </p>
                    <p className="mt-1 text-sm font-semibold tracking-tight text-ink">
                      {project.title}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How it works — vertical rail, not three equal columns */}
      <section className="border-y border-ink/15 bg-surface section-y">
        <div className="container-page">
          <div className="max-w-lg">
            <p className="eyebrow">Process</p>
            <h2 className="mt-3 text-[1.85rem] font-semibold tracking-[-0.03em] text-ink sm:text-3xl">
              Three steps. No surprises.
            </h2>
          </div>

          <ol className="mt-10 border-l-2 border-ink pl-6 sm:mt-12 sm:pl-8 lg:mt-14">
            {howItWorks.map((step) => (
              <li key={step.step} className="relative pb-10 last:pb-0 sm:pb-12">
                <span
                  className="absolute -left-[1.9rem] top-0 flex h-7 w-7 items-center justify-center border-2 border-ink bg-surface font-mono text-xs font-bold sm:-left-[2.4rem] sm:h-8 sm:w-8"
                  aria-hidden
                >
                  {step.step}
                </span>
                <h3 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted sm:text-[0.95rem]">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-y">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <p className="eyebrow">FAQ</p>
              <h2 className="mt-3 text-[1.85rem] font-semibold tracking-[-0.03em] text-ink sm:text-3xl">
                Common questions
              </h2>
              <p className="mt-4 text-muted leading-relaxed">
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

      {/* Quote CTA — solid panel, orange rule */}
      <section className="band-dark">
        <div className="container-page grid gap-8 py-14 sm:py-16 lg:grid-cols-12 lg:items-end lg:gap-10 lg:py-20">
          <div className="lg:col-span-7">
            <span className="accent-bar mb-5" aria-hidden />
            <h2 className="font-display text-[1.85rem] font-semibold tracking-[-0.03em] sm:text-3xl lg:text-4xl">
              Ready for a free estimate?
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-ivory/70">
              Tell us about your fence or deck project. We&apos;ll schedule an
              on-site visit in Angier, Raleigh, or your nearby NC community—clear
              quote, no obligation.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:col-span-5 lg:justify-end">
            <Link
              href="/quote"
              className="focus-ring btn-primary w-full justify-center sm:w-auto"
            >
              Get a Free Quote
            </Link>
            <a
              href={siteConfig.phoneHref}
              className="focus-ring text-center text-sm font-semibold text-ivory/80 underline decoration-ivory/30 underline-offset-[0.22em] hover:text-ivory hover:decoration-bronze sm:text-left"
            >
              {siteConfig.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

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
  const teaser = galleryProjects.slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-ivory">
        <div className="hero-mesh" aria-hidden />
        <div className="container-page relative grid gap-10 py-12 sm:gap-12 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-28">
          <div className="min-w-0">
            <p className="eyebrow eyebrow-light">
              Angier · Raleigh NC · Surrounding Areas
            </p>
            <h1 className="mt-4 text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.03em] sm:mt-5 sm:text-4xl sm:leading-[1.12] lg:text-[3.25rem] lg:leading-[1.1]">
              Strong fences. Beautiful decks. Built for Carolina homes.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ivory/78 sm:mt-6 sm:text-lg sm:leading-relaxed">
              {siteConfig.name} installs and repairs wood, vinyl, chain-link,
              and aluminum fencing—plus deck repairs, rebuilds, and new
              builds—across Angier, Raleigh, and nearby communities.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center">
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
          <div className="relative hidden lg:block">
            <div
              className="pointer-events-none absolute -inset-6 rounded-[2rem] opacity-60 blur-2xl"
              aria-hidden
              style={{
                background:
                  "radial-gradient(ellipse at 50% 50%, color-mix(in srgb, var(--bronze) 22%, transparent), transparent 70%)",
              }}
            />
            <div className="glass-panel relative p-7 sm:p-8">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-bronze-light">
                Why homeowners choose us
              </p>
              <span className="accent-bar mt-3" aria-hidden />
              <ul className="mt-5 space-y-4">
                {[
                  "Clear written estimates before work begins",
                  "Local crew familiar with Wake & Harnett soils and codes",
                  "Quality materials matched to your budget and style",
                  "Respectful of your property—we leave it cleaner than we found it",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-ivory/90">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bronze text-[10px] font-bold text-white shadow-sm"
                      aria-hidden
                    >
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section
        className="border-b border-ink/[0.07] bg-surface"
        aria-label="Trust points"
      >
        <div className="mx-auto max-w-6xl">
          <ul className="grid grid-cols-2 gap-px bg-ink/[0.07] lg:grid-cols-4">
            {trustPoints.map((point) => (
              <li
                key={point.label}
                className="flex items-center justify-center gap-2 bg-surface px-2.5 py-4 text-center text-[0.6875rem] font-semibold leading-snug tracking-tight text-ink sm:px-4 sm:py-6 sm:text-sm"
              >
                <span
                  className="hidden h-1.5 w-1.5 shrink-0 rounded-full bg-bronze sm:inline-block"
                  aria-hidden
                />
                {point.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Featured services */}
      <section className="container-page section-y">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">What we do</p>
            <h2 className="mt-3.5 text-[1.75rem] font-semibold tracking-[-0.025em] text-ink sm:text-3xl lg:text-4xl">
              Featured services
            </h2>
            <p className="mt-3 text-muted leading-relaxed">
              From backyard privacy fences to full deck rebuilds, we handle the
              projects that protect and improve your outdoor living space.
            </p>
          </div>
          <Link href="/services" className="focus-ring btn-ghost inline-flex min-h-11 items-center shrink-0">
            View all services →
          </Link>
        </div>
        <ul className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {featured.map((service) => (
            <li key={service.slug} className="card p-5 sm:p-6">
              <span className="icon-badge">
                <ServiceIcon slug={service.slug} />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-ink">
                {service.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">
                {service.summary}
              </p>
            </li>
          ))}
          <li className="relative flex flex-col justify-center overflow-hidden rounded-[1.125rem] bg-ink p-5 text-ivory shadow-md sm:p-6">
            <div
              className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-40"
              aria-hidden
              style={{
                background:
                  "radial-gradient(circle, color-mix(in srgb, var(--bronze) 45%, transparent), transparent 70%)",
              }}
            />
            <h3 className="relative font-display text-lg font-semibold tracking-tight">
              Need something else?
            </h3>
            <p className="relative mt-2.5 text-sm leading-relaxed text-ivory/75">
              Gate installs, railing upgrades, storm damage repairs—ask us. If
              we can help, we will.
            </p>
            <Link
              href="/quote"
              className="focus-ring btn-primary relative mt-5 w-fit"
            >
              Get a Free Quote
            </Link>
          </li>
        </ul>
      </section>

      {/* Customer notes */}
      <section className="section-soft section-y">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="eyebrow">Good work travels</p>
            <h2 className="mt-3.5 text-[1.75rem] font-semibold tracking-[-0.025em] text-ink sm:text-3xl lg:text-4xl">
              Trusted by local homeowners
            </h2>
            <p className="mt-3 text-muted leading-relaxed">
              A few words from neighbors who called us for their next outdoor project.
            </p>
          </div>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <li key={testimonial.name} className="card flex flex-col p-5 sm:p-6">
                <span
                  className="font-display text-3xl leading-none text-bronze/50"
                  aria-hidden
                >
                  “
                </span>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {testimonial.quote}
                </p>
                <div className="mt-auto pt-5">
                  <span className="accent-bar mb-3" aria-hidden />
                  <p className="text-sm font-semibold text-ink">
                    {testimonial.name}
                  </p>
                  <p className="mt-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-bronze">
                    {testimonial.town}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Recent work teaser */}
      <section className="section-alt section-y">
        <div className="container-page">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow">Portfolio</p>
              <h2 className="mt-3.5 text-[1.75rem] font-semibold tracking-[-0.025em] text-ink sm:text-3xl lg:text-4xl">
                Recent work
              </h2>
              <p className="mt-3 text-muted leading-relaxed">
                A look at fence and deck projects we&apos;ve completed for
                neighbors in Angier, Raleigh, and nearby towns.
              </p>
            </div>
            <Link href="/gallery" className="focus-ring btn-ghost inline-flex min-h-11 items-center shrink-0">
              Browse gallery →
            </Link>
          </div>
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {teaser.map((project) => (
              <li key={project.id} className="card overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden bg-ivory-muted">
                  <Image
                    src={project.image}
                    alt={`${project.title}. ${project.caption}.`}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="gallery-img object-cover"
                  />
                </div>
                <div className="bg-ivory p-4">
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-bronze">
                    {project.category}
                  </p>
                  <p className="mt-1.5 text-sm font-semibold tracking-tight text-ink">
                    {project.title}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="container-page section-y">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow eyebrow-center">Process</p>
          <h2 className="mt-3.5 text-[1.75rem] font-semibold tracking-[-0.025em] text-ink sm:text-3xl lg:text-4xl">
            How it works
          </h2>
          <p className="mt-3 text-muted leading-relaxed">
            Straightforward from first call to finished project—no surprises.
          </p>
          <div className="divider-ornament mt-6" aria-hidden>
            <span className="h-1.5 w-1.5 rounded-full bg-bronze" />
          </div>
        </div>
        <ol className="mt-12 grid gap-10 md:mt-14 md:grid-cols-3 md:gap-8">
          {howItWorks.map((step, i) => (
            <li key={step.step} className="relative text-center md:text-left">
              {i < howItWorks.length - 1 && (
                <span
                  className="pointer-events-none absolute left-[calc(50%+2rem)] top-5 hidden h-px w-[calc(100%-2rem)] bg-gradient-to-r from-bronze/35 to-transparent md:block"
                  aria-hidden
                />
              )}
              <span className="step-badge">{step.step}</span>
              <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-ink">
                {step.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section className="section-soft section-y">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow eyebrow-center">FAQ</p>
            <h2 className="mt-3.5 text-[1.75rem] font-semibold tracking-[-0.025em] text-ink sm:text-3xl lg:text-4xl">
              Common questions
            </h2>
            <p className="mt-3 text-muted leading-relaxed">
              Quick answers about timelines, permits, materials, and deck repairs.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-3xl sm:mt-12">
            <FaqAccordion />
          </div>
        </div>
      </section>

      {/* Quote CTA */}
      <section className="band-dark py-12 sm:py-14 lg:py-20">
        <div className="container-page relative max-w-3xl text-center">
          <span className="accent-bar mx-auto mb-5" aria-hidden />
          <h2 className="font-display text-[1.75rem] font-semibold tracking-[-0.025em] sm:text-3xl lg:text-4xl">
            Ready for a free estimate?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ivory/75">
            Tell us about your fence or deck project. We&apos;ll schedule an
            on-site visit in Angier, Raleigh, or your nearby NC community—and
            give you a clear quote with no obligation.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-9 sm:flex-row sm:items-center">
            <Link href="/quote" className="focus-ring btn-primary w-full justify-center sm:w-auto">
              Get a Free Quote
            </Link>
            <a
              href={siteConfig.phoneHref}
              className="focus-ring btn-secondary w-full justify-center sm:w-auto"
            >
              Or call {siteConfig.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

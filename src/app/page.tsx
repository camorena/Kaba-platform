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
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 15% 10%, #b8956c40, transparent 45%), radial-gradient(ellipse at 85% 90%, #2c3a4f66, transparent 50%)",
          }}
        />
        <div className="container-page relative grid gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-28">
          <div>
            <p className="eyebrow text-bronze-light">
              Angier · Raleigh NC · Surrounding Areas
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl lg:text-[3.35rem] lg:leading-[1.12]">
              Strong fences. Beautiful decks. Built for Carolina homes.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory/80 sm:text-lg">
              {siteConfig.name} installs and repairs wood, vinyl, chain-link,
              and aluminum fencing—plus deck repairs, rebuilds, and new
              builds—across Angier, Raleigh, and nearby communities.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/quote" className="focus-ring btn-primary w-full sm:w-auto">
                Get a Free Quote
              </Link>
              <a
                href={siteConfig.phoneHref}
                className="focus-ring btn-secondary w-full sm:w-auto"
              >
                Call {siteConfig.phone}
              </a>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-bronze-light">
                Why homeowners choose us
              </p>
              <ul className="mt-5 space-y-4">
                {[
                  "Clear written estimates before work begins",
                  "Local crew familiar with Wake & Harnett soils and codes",
                  "Quality materials matched to your budget and style",
                  "Respectful of your property—we leave it cleaner than we found it",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-ivory/90">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bronze text-[10px] font-bold text-white"
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
        className="border-b border-ink/8 bg-surface"
        aria-label="Trust points"
      >
        <div className="mx-auto max-w-6xl">
          <ul className="grid grid-cols-2 gap-px bg-ink/8 sm:grid-cols-4">
            {trustPoints.map((point) => (
              <li
                key={point.label}
                className="flex items-center justify-center bg-surface px-3 py-5 text-center text-xs font-semibold text-ink sm:px-4 sm:py-6 sm:text-sm"
              >
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
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Featured services
            </h2>
            <p className="mt-3 text-muted leading-relaxed">
              From backyard privacy fences to full deck rebuilds, we handle the
              projects that protect and improve your outdoor living space.
            </p>
          </div>
          <Link href="/services" className="focus-ring btn-ghost shrink-0">
            View all services →
          </Link>
        </div>
        <ul className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {featured.map((service) => (
            <li key={service.slug} className="card p-5 sm:p-6">
              <span className="icon-badge">
                <ServiceIcon slug={service.slug} />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                {service.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">
                {service.summary}
              </p>
            </li>
          ))}
          <li className="flex flex-col justify-center rounded-2xl bg-ink p-5 text-ivory shadow-sm sm:p-6">
            <h3 className="font-display text-lg font-semibold">
              Need something else?
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-ivory/75">
              Gate installs, railing upgrades, storm damage repairs—ask us. If
              we can help, we will.
            </p>
            <Link
              href="/quote"
              className="focus-ring btn-primary mt-5 w-fit"
            >
              Get a Free Quote
            </Link>
          </li>
        </ul>
      </section>

      {/* Customer notes */}
      <section className="container-page pb-16 pt-0 lg:pb-24">
        <div className="max-w-2xl">
          <p className="eyebrow">Good work travels</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Trusted by local homeowners
          </h2>
          <p className="mt-3 text-muted leading-relaxed">
            A few words from neighbors who called us for their next outdoor project.
          </p>
        </div>
        <ul className="mt-10 grid gap-5 md:grid-cols-3 sm:gap-6">
          {testimonials.map((testimonial) => (
            <li key={testimonial.name} className="card flex flex-col p-5 sm:p-6">
              <p className="text-sm leading-relaxed text-muted">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <p className="mt-5 text-sm font-semibold text-ink">
                {testimonial.name}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-bronze">
                {testimonial.town}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Recent work teaser */}
      <section className="border-y border-ink/8 bg-surface section-y">
        <div className="container-page">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow">Portfolio</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Recent work
              </h2>
              <p className="mt-3 text-muted leading-relaxed">
                A look at fence and deck projects we&apos;ve completed for
                neighbors in Angier, Raleigh, and nearby towns.
              </p>
            </div>
            <Link href="/gallery" className="focus-ring btn-ghost shrink-0">
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
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-bronze">
                    {project.category}
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-ink">
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
          <p className="eyebrow">Process</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            How it works
          </h2>
          <p className="mt-3 text-muted leading-relaxed">
            Straightforward from first call to finished project—no surprises.
          </p>
        </div>
        <ol className="mt-12 grid gap-10 md:mt-14 md:grid-cols-3 md:gap-8">
          {howItWorks.map((step) => (
            <li key={step.step} className="relative text-center md:text-left">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-bronze font-display text-lg font-semibold text-white shadow-sm">
                {step.step}
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold text-ink">
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
      <section className="container-page pb-16 pt-0 lg:pb-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">FAQ</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Common questions
          </h2>
          <p className="mt-3 text-muted leading-relaxed">
            Quick answers about timelines, permits, materials, and deck repairs.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-3xl sm:mt-12">
          <FaqAccordion />
        </div>
      </section>

      {/* Quote CTA */}
      <section className="bg-ink py-14 text-ivory lg:py-20">
        <div className="container-page max-w-3xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready for a free estimate?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ivory/75">
            Tell us about your fence or deck project. We&apos;ll schedule an
            on-site visit in Angier, Raleigh, or your nearby NC community—and
            give you a clear quote with no obligation.
          </p>
          <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link href="/quote" className="focus-ring btn-primary">
              Get a Free Quote
            </Link>
            <a
              href={siteConfig.phoneHref}
              className="focus-ring btn-secondary"
            >
              Or call {siteConfig.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

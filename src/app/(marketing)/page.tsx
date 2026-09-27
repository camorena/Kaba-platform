import type { Metadata } from "next";
import WatermarkedImage from "@/components/WatermarkedImage";
import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";
import ServiceIcon from "@/components/ServiceIcon";
import Reveal from "@/components/Reveal";
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
      {/* Hero — editorial split with cinematic gallery photo */}
      <section className="relative overflow-hidden bg-navy text-cream">
        <div className="hero-mesh" aria-hidden />
        <div className="container-page relative grid items-center gap-9 py-12 sm:gap-12 sm:py-16 lg:grid-cols-12 lg:gap-12 lg:py-20 xl:gap-16 xl:py-24">
          <div className="relative min-w-0 lg:col-span-5 xl:col-span-5">
            <span
              className="pointer-events-none absolute -left-5 top-1 hidden h-[5rem] w-px bg-gradient-to-b from-bronze via-bronze/45 to-transparent xl:block"
              aria-hidden
            />
            <p className="eyebrow eyebrow-light hero-reveal">
              Angier · Raleigh NC · Surrounding Areas
            </p>
            <h1 className="hero-reveal hero-reveal-d1 mt-5 max-w-[15ch] text-[2rem] font-semibold leading-[1.1] tracking-[-0.034em] sm:mt-6 sm:max-w-[17ch] sm:text-[2.65rem] sm:leading-[1.06] lg:text-[3.15rem] lg:leading-[1.05] xl:max-w-[14ch] xl:text-[3.45rem]">
              Strong fences. Beautiful decks.{" "}
              <em className="not-italic text-bronze">Built for Carolina homes.</em>
            </h1>
            <p className="hero-reveal hero-reveal-d2 mt-5 max-w-[36rem] text-[0.9875rem] leading-[1.65] text-cream/80 sm:mt-6 sm:text-lg sm:leading-[1.65]">
              {siteConfig.name} installs and repairs wood, vinyl, chain-link,
              and aluminum fencing—plus deck repairs, rebuilds, and new
              builds—across Angier, Raleigh, and nearby communities.
            </p>
            <div className="hero-reveal hero-reveal-d3 mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-3.5">
              <Link
                href="/quote"
                className="focus-ring btn-primary w-full justify-center sm:w-auto sm:min-w-[12.5rem]"
              >
                Get a Free Quote
              </Link>
              <a
                href={siteConfig.phoneHref}
                className="focus-ring btn-secondary w-full justify-center sm:w-auto"
              >
                Call {siteConfig.phone}
              </a>
            </div>
            <p className="hero-reveal hero-reveal-d4 hero-trust mt-7 sm:mt-8">
              <span>Free on-site estimates</span>
              <span className="hero-trust-sep" aria-hidden />
              <span>No obligation</span>
              <span className="hero-trust-sep" aria-hidden />
              <span>Local Wake &amp; Harnett crew</span>
            </p>
          </div>

          <div className="hero-reveal-visual relative lg:col-span-7">
            <div
              className="pointer-events-none absolute -inset-5 rounded-[2.25rem] opacity-80 blur-3xl sm:-inset-7"
              aria-hidden
              style={{
                background:
                  "radial-gradient(ellipse at 55% 42%, color-mix(in srgb, var(--bronze) 32%, transparent), transparent 68%)",
              }}
            />
            <div className="hero-frame relative aspect-[4/3] w-full sm:aspect-[5/3.35] lg:ml-1 lg:aspect-[5/3.5] lg:min-h-[25rem] xl:ml-2 xl:min-h-[29rem]">
              {/* Top-right keeps the hero mark clear of the bottom caption chrome. */}
              <WatermarkedImage
                src="/gallery/cedar-privacy.jpg"
                alt="Cedar privacy fence installation for a Raleigh-area home"
                fill
                priority
                sizes="(min-width: 1280px) 42rem, (min-width: 1024px) 55vw, 100vw"
                className="hero-frame-img hero-kenburns"
                watermarkSize="lg"
                watermarkPosition="tr"
              />
              <div className="hero-cinematic" aria-hidden />
              <div className="hero-overlay absolute inset-x-0 bottom-0 p-4 sm:p-5 lg:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div className="hero-pill">
                    <span className="hero-pill-dot" aria-hidden />
                    Cedar privacy · Raleigh
                  </div>
                  <ul className="hidden max-w-xs space-y-1.5 rounded-xl border border-white/12 bg-navy-dark/65 p-3.5 text-[0.75rem] leading-snug text-cream/92 shadow-lg backdrop-blur-md sm:block lg:max-w-[15.75rem]">
                    {[
                      "Clear written estimates",
                      "Quality materials, matched to budget",
                      "Job sites left cleaner than found",
                    ].map((item) => (
                      <li key={item} className="flex gap-2">
                        <span
                          className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-bronze"
                          aria-hidden
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section
        className="section-ink-rail border-b border-ink/[0.08] bg-surface"
        aria-label="Trust points"
      >
        <Reveal from="none" className="mx-auto max-w-6xl">
          <ul className="trust-rail">
            {trustPoints.map((point) => (
              <li key={point.label} className="trust-rail-item">
                <span className="trust-rail-dot" aria-hidden />
                {point.label}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* Featured services */}
      <section className="container-page section-y">
        <Reveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div className="max-w-xl">
            <p className="eyebrow">What we do</p>
            <h2 className="mt-3 text-[1.85rem] font-semibold tracking-[-0.028em] text-ink sm:mt-3.5 sm:text-3xl lg:text-[2.5rem] lg:leading-[1.12]">
              Featured services
            </h2>
            <p className="mt-3.5 max-w-lg text-[0.9875rem] leading-relaxed text-muted sm:text-base">
              From backyard privacy fences to full deck rebuilds, we handle the
              projects that protect and improve your outdoor living space.
            </p>
          </div>
          <Link href="/services" className="focus-ring btn-ghost inline-flex min-h-11 items-center shrink-0 self-start sm:self-auto">
            View all services →
          </Link>
        </Reveal>
        <ul className="mt-9 grid gap-4 sm:mt-11 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {featured.map((service, i) => (
            <Reveal as="li" key={service.slug} delay={i * 70} className="card p-5 sm:p-6">
              <span className="icon-badge">
                <ServiceIcon slug={service.slug} />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-ink">
                {service.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">
                {service.summary}
              </p>
            </Reveal>
          ))}
          <Reveal as="li" delay={350} className="relative flex flex-col justify-center overflow-hidden rounded-[1rem] border border-bronze/25 bg-navy p-5 text-cream shadow-md sm:p-6">
            <div
              className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full opacity-50"
              aria-hidden
              style={{
                background:
                  "radial-gradient(circle, color-mix(in srgb, var(--bronze) 50%, transparent), transparent 70%)",
              }}
            />
            <p className="relative text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-bronze">
              Custom work
            </p>
            <h3 className="relative mt-2.5 font-display text-lg font-semibold tracking-tight">
              Need something else?
            </h3>
            <p className="relative mt-2.5 text-sm leading-relaxed text-cream/78">
              Gate installs, railing upgrades, storm damage repairs—ask us. If
              we can help, we will.
            </p>
            <Link
              href="/quote"
              className="focus-ring btn-primary relative mt-5 w-fit"
            >
              Get a Free Quote
            </Link>
          </Reveal>
        </ul>
      </section>

      {/* Customer notes */}
      <section className="section-soft section-y">
        <div className="container-page">
          <Reveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
            <div className="max-w-xl">
              <p className="eyebrow">Good work travels</p>
              <h2 className="mt-3 text-[1.85rem] font-semibold tracking-[-0.028em] text-ink sm:mt-3.5 sm:text-3xl lg:text-[2.5rem] lg:leading-[1.12]">
                Trusted by local homeowners
              </h2>
              <p className="mt-3.5 text-[0.9875rem] leading-relaxed text-muted sm:text-base">
                A few words from neighbors who called us for their next outdoor project.
              </p>
            </div>
            <Link href="/reviews" className="focus-ring btn-ghost inline-flex min-h-11 items-center shrink-0 self-start sm:self-auto">
              Read all reviews →
            </Link>
          </Reveal>
          <ul className="mt-9 grid gap-4 sm:mt-11 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {testimonials.map((testimonial, i) => (
              <Reveal as="li" key={testimonial.name} delay={i * 80} className="card flex flex-col p-5 sm:p-6">
                <span
                  className="font-display text-[2.5rem] leading-none text-bronze/55"
                  aria-hidden
                >
                  “
                </span>
                <p className="mt-2 text-sm leading-relaxed text-muted sm:text-[0.9375rem]">
                  {testimonial.quote}
                </p>
                <div className="mt-auto pt-6">
                  <span className="accent-bar mb-3.5" aria-hidden />
                  <p className="text-sm font-semibold text-ink">
                    {testimonial.name}
                  </p>
                  <p className="mt-1 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-bronze-dark dark:text-bronze-light">
                    {testimonial.town}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Recent work teaser */}
      <section className="section-alt section-y">
        <div className="container-page">
          <Reveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
            <div className="max-w-xl">
              <p className="eyebrow">Portfolio</p>
              <h2 className="mt-3 text-[1.85rem] font-semibold tracking-[-0.028em] text-ink sm:mt-3.5 sm:text-3xl lg:text-[2.5rem] lg:leading-[1.12]">
                Recent work
              </h2>
              <p className="mt-3.5 text-[0.9875rem] leading-relaxed text-muted sm:text-base">
                A look at fence and deck projects we&apos;ve completed for
                neighbors in Angier, Raleigh, and nearby towns.
              </p>
            </div>
            <Link href="/gallery" className="focus-ring btn-ghost inline-flex min-h-11 items-center shrink-0 self-start sm:self-auto">
              Browse gallery →
            </Link>
          </Reveal>
          <ul className="mt-9 grid grid-cols-1 gap-4 sm:mt-11 sm:grid-cols-2 sm:gap-5 lg:grid-cols-12 lg:gap-6">
            {teaser.map((project, index) => (
              <Reveal
                as="li"
                key={project.id}
                delay={index * 70}
                className={`card overflow-hidden ${
                  index === 0
                    ? "lg:col-span-5"
                    : index === 1
                      ? "lg:col-span-7"
                      : "lg:col-span-6"
                }`}
              >
                <div
                  className={`relative overflow-hidden bg-ivory-muted ${
                    index < 2 ? "aspect-[16/10] sm:aspect-[5/3]" : "aspect-[4/3]"
                  }`}
                >
                  <WatermarkedImage
                    src={project.image}
                    alt={`${project.title}. ${project.caption}.`}
                    fill
                    sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
                    className="gallery-img object-cover"
                    watermarkSize="sm"
                  />
                </div>
                <div className="border-t border-ink/[0.06] bg-surface px-4 py-3.5 sm:px-5">
                  <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-bronze-dark dark:text-bronze-light">
                    {project.category}
                  </p>
                  <p className="mt-1.5 text-sm font-semibold tracking-tight text-ink">
                    {project.title}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="container-page section-y">
        <Reveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div className="max-w-xl">
            <p className="eyebrow">Process</p>
            <h2 className="mt-3 text-[1.85rem] font-semibold tracking-[-0.028em] text-ink sm:mt-3.5 sm:text-3xl lg:text-[2.5rem] lg:leading-[1.12]">
              How it works
            </h2>
            <p className="mt-3.5 text-[0.9875rem] leading-relaxed text-muted sm:text-base">
              Straightforward from first call to finished project—no surprises.
            </p>
          </div>
          <Link href="/how-it-works" className="focus-ring btn-ghost inline-flex min-h-11 items-center shrink-0 self-start sm:self-auto">
            See full process →
          </Link>
        </Reveal>
        <ol className="mt-10 grid gap-8 border-t border-ink/[0.08] pt-10 sm:mt-12 md:grid-cols-3 md:gap-8 md:pt-12">
          {howItWorks.map((step, i) => (
            <Reveal as="li" key={step.step} delay={i * 90} className="relative">
              {i < howItWorks.length - 1 && (
                <span
                  className="pointer-events-none absolute left-[3.25rem] top-[1.375rem] hidden h-px w-[calc(100%-1.5rem)] bg-gradient-to-r from-bronze/40 via-bronze/15 to-transparent md:block"
                  aria-hidden
                />
              )}
              <span className="step-badge">{step.step}</span>
              <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-ink">
                {step.title}
              </h3>
              <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-muted">
                {step.description}
              </p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section className="section-soft section-y">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12 lg:items-start">
            <Reveal className="max-w-md lg:col-span-4">
              <p className="eyebrow">FAQ</p>
              <h2 className="mt-3 text-[1.85rem] font-semibold tracking-[-0.028em] text-ink sm:mt-3.5 sm:text-3xl lg:text-[2.35rem] lg:leading-[1.12]">
                Common questions
              </h2>
              <p className="mt-3.5 text-[0.9875rem] leading-relaxed text-muted sm:text-base">
                Quick answers about timelines, permits, materials, and deck repairs.
              </p>
              <Link href="/faq" className="focus-ring btn-ghost mt-5 inline-flex min-h-11 items-center">
                View all FAQs →
              </Link>
            </Reveal>
            <Reveal className="lg:col-span-8" delay={100}>
              <FaqAccordion />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Quote CTA */}
      <section className="band-dark section-ink-rail py-14 sm:py-16 lg:py-20">
        <Reveal className="container-page relative max-w-2xl text-center">
          <span className="accent-bar mx-auto mb-6" aria-hidden />
          <h2 className="font-display text-[1.85rem] font-semibold tracking-[-0.028em] sm:text-3xl lg:text-[2.5rem] lg:leading-[1.12]">
            Ready for a free estimate?
          </h2>
          <p className="mt-4 text-[0.9875rem] leading-relaxed text-cream/80 sm:text-base">
            Tell us about your fence or deck project. We&apos;ll schedule an
            on-site visit in Angier, Raleigh, or your nearby NC community—and
            give you a clear quote with no obligation.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-9 sm:flex-row sm:items-center sm:gap-3.5">
            <Link href="/quote" className="focus-ring btn-primary w-full justify-center sm:w-auto sm:min-w-[12.5rem]">
              Get a Free Quote
            </Link>
            <a
              href={siteConfig.phoneHref}
              className="focus-ring btn-secondary w-full justify-center sm:w-auto"
            >
              Or call {siteConfig.phone}
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import {
  getPublishedContactInfo,
  getPublishedFenceTypes,
  getPublishedHeroCopy,
  getPublishedKabaExperience,
  getPublishedProjects,
  getPublishedServiceTowns,
  getPublishedTrustPoints,
  getPublishedYourNeeds,
} from "@/lib/cms/public";
import { getFeaturedReviews, getPublicHighlightStats } from "@/lib/reviews/public";

export function generateMetadata(): Metadata {
  const brand = getPublishedHeroCopy();
  const title = `Fence Installation & Repair in Angier & Raleigh, NC | ${brand.name}`;
  const description = `${brand.name} installs and repairs wood, vinyl, aluminum, and chain-link fences and decks for homes and businesses in Angier, Raleigh, and nearby Harnett, Wake & Johnston County towns. Free on-site estimates.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description,
      url: "/",
    },
  };
}

export const dynamic = "force-dynamic";

function NeedIcon({ icon }: { icon: "paw" | "home" | "wrench" }) {
  const common = "h-5 w-5";
  if (icon === "paw") {
    return (
      <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8.5 10.5c.8-1.5-.2-3.2-1.8-3.2S5 9 5.8 10.5 8 12 8.5 10.5zm7 0c.8-1.5-.2-3.2-1.8-3.2S12 9 12.8 10.5 15 12 15.5 10.5zM7 15.5c1.2-1.8 3.2-1.4 5-1.4s3.8-.4 5 1.4c.7 1-1.1 2.6-2.6 1.8-1.1-.6-2.2-.7-2.4-.7s-1.3.1-2.4.7c-1.5.8-3.3-.8-2.6-1.8zM6.2 7.2c.9-1.2-.1-2.8-1.6-2.6S2.8 6.5 3.7 7.7s2.5.6 2.5-.5zm11.6 0c.9-1.2-.1-2.8-1.6-2.6s-1.8 1.9-.9 3.1 2.5.6 2.5-.5z" />
      </svg>
    );
  }
  if (icon === "home") {
    return (
      <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z" />
      </svg>
    );
  }
  return (
    <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function ExpIcon({ icon }: { icon: "listen" | "guide" | "build" | "care" }) {
  const common = "h-6 w-6";
  if (icon === "listen") {
    return (
      <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 10h8M8 14h5m7-2a9 9 0 11-3.2-6.9L21 5v4h-4" />
      </svg>
    );
  }
  if (icon === "guide") {
    return (
      <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6M7 4h10a2 2 0 012 2v14l-7-3-7 3V6a2 2 0 012-2z" />
      </svg>
    );
  }
  if (icon === "build") {
    return (
      <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
      </svg>
    );
  }
  return (
    <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

function TrustIcon({ icon }: { icon: "home" | "shield" | "pin" }) {
  const common = "h-5 w-5 text-bronze";
  if (icon === "home") {
    return (
      <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z" />
      </svg>
    );
  }
  if (icon === "shield") {
    return (
      <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    );
  }
  return (
    <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

export default async function HomePage() {
  const contact = getPublishedContactInfo();
  const hero = getPublishedHeroCopy();
  const trustPoints = getPublishedTrustPoints();
  const yourNeeds = getPublishedYourNeeds();
  const kabaExperience = getPublishedKabaExperience();
  const fencingServices = getPublishedFenceTypes();
  const teaser = getPublishedProjects()
    .filter((p) => p.category === "fence")
    .slice(0, 4);
  // Only real reviews an admin published AND featured. Empty by default.
  const [homeReviews, highlights] = await Promise.all([
    getFeaturedReviews(3),
    getPublicHighlightStats(),
  ]);
  const towns = getPublishedServiceTowns();

  return (
    <>
      {/* Hero — full-bleed wood fence */}
      <section className="hero-fullbleed">
        <div className="hero-fullbleed-bg">
          <Image
            src="/gallery/cedar-privacy.jpg"
            alt="Horizontal wood privacy fence in a backyard"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="hero-fullbleed-wash" aria-hidden />

        <div className="container-page relative z-[2] flex flex-1 flex-col justify-center py-16 sm:py-20 lg:py-28">
          <div className="max-w-2xl">
            {/* H1 carries service + town for local search; the large headline stays the visual lead. */}
            <h1
              className="hero-reveal text-[0.6875rem] uppercase text-bronze"
              style={{
                // Override global h1 display-serif styles so this keeps the eyebrow look.
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                fontWeight: 700,
                letterSpacing: "0.16em",
                lineHeight: 1.5,
              }}
            >
              {hero.heroLabel}
            </h1>
            <p className="hero-reveal hero-reveal-d1 mt-4 font-display text-[2.15rem] font-semibold leading-[1.12] tracking-[-0.02em] text-white sm:text-[2.85rem] lg:text-[3.5rem] lg:leading-[1.08]">
              {hero.heroHeadline}
            </p>
            <p className="hero-reveal hero-reveal-d2 mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
              {hero.heroSub}
            </p>
            <div className="hero-reveal hero-reveal-d3 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/contact"
                className="focus-ring btn-primary w-full justify-center gap-2 uppercase tracking-[0.06em] sm:w-auto"
              >
                Request a Free Estimate
                <span aria-hidden>→</span>
              </Link>
              <a
                href={contact.phoneHref}
                className="focus-ring inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[0.6875rem] border border-white/40 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/18 sm:w-auto"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call {contact.phone}
              </a>
            </div>
          </div>
        </div>

        <div className="hero-trust-bar">
          <ul className="container-page grid gap-4 py-5 sm:grid-cols-3 sm:gap-6 sm:py-6">
            {trustPoints.map((point) => (
              <li
                key={point.label}
                className="flex items-center justify-center gap-3 text-center text-sm font-semibold text-white/92 sm:justify-start sm:text-left"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <TrustIcon icon={point.icon} />
                </span>
                {point.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Highlight stats — only owner-set, visible figures; nothing by default */}
      {highlights.length > 0 ? (
        <section className="border-b border-ink/8 bg-surface py-8 sm:py-10" aria-label="Kaba Fence at a glance">
          <ul
            className={`container-page grid gap-6 text-center ${
              highlights.length >= 4 ? "grid-cols-2 lg:grid-cols-4" : highlights.length === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"
            }`}
          >
            {highlights.map((h) => (
              <li key={h.id}>
                <p className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">
                  {h.value}
                </p>
                <p className="mt-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-bronze-dark dark:text-bronze-light">
                  {h.label}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Your Needs */}
      <section className="bg-surface section-y">
        <div className="container-page">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-bronze-dark dark:text-bronze-light">
              Your Needs
            </p>
            <h2 className="mt-3 font-display text-[1.85rem] font-semibold tracking-[-0.02em] text-ink sm:text-3xl lg:text-[2.5rem]">
              A Fence That Fits the Way You Live.
            </h2>
          </Reveal>
          <ul className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-3">
            {yourNeeds.map((need, i) => (
              <Reveal as="li" key={need.id} delay={i * 80} className="need-card">
                <div className="relative aspect-[4/3] overflow-hidden bg-ivory-muted">
                  <Image
                    src={need.image}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover"
                  />
                  <span className="absolute bottom-3 left-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-bronze text-white shadow-md">
                    <NeedIcon icon={need.icon} />
                  </span>
                </div>
                <div className="relative px-5 pb-6 pt-5 text-center sm:text-left">
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {need.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {need.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Fencing Options */}
      <section className="bg-ivory-muted/60 section-y">
        <div className="container-page">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-bronze-dark dark:text-bronze-light">
              Fencing Options
            </p>
            <h2 className="mt-3 font-display text-[1.85rem] font-semibold tracking-[-0.02em] text-ink sm:text-3xl lg:text-[2.5rem]">
              Find the Right Fence for Your Property.
            </h2>
          </Reveal>
          <ul className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
            {fencingServices.map((svc, i) => (
              <Reveal as="li" key={svc.slug} delay={i * 70}>
                <Link href={`/services#${svc.slug}`} className="option-card group block h-full">
                  <div className="relative aspect-[4/3] overflow-hidden bg-ivory-muted">
                    <Image
                      src={svc.image}
                      alt={svc.title}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="bg-surface px-4 py-4 text-center">
                    <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-ink">
                      {svc.title}
                    </p>
                    <p className="mt-1.5 text-xs text-muted">{svc.tagline}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-10 flex justify-center">
            <Link href="/services" className="focus-ring btn-primary gap-2 uppercase tracking-[0.06em]">
              Explore Fencing Options
              <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* The Kaba Experience */}
      <section className="relative overflow-hidden bg-[#0a0c10] section-y text-cream">
        <div className="pointer-events-none absolute inset-0 opacity-25" aria-hidden>
          <Image
            src="/gallery/cedar-privacy.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover blur-sm"
          />
          <div className="absolute inset-0 bg-[#0a0c10]/80" />
        </div>
        <div className="container-page relative">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-bronze">
              The Kaba Experience
            </p>
            <h2 className="mt-3 font-display text-[1.85rem] font-semibold tracking-[-0.02em] text-white sm:text-3xl lg:text-[2.5rem]">
              A Better Fence Experience.
            </h2>
          </Reveal>
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {kabaExperience.map((step, i) => (
              <Reveal as="li" key={step.id} delay={i * 80} className="text-center">
                <span className="exp-icon mx-auto">
                  <ExpIcon icon={step.icon} />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold uppercase tracking-[0.06em] text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/70">
                  {step.description}
                </p>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-12 text-center">
            <p className="font-script text-3xl text-white sm:text-4xl">
              {hero.tagline}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Our Work strip */}
      <section className="bg-surface section-y">
        <div className="container-page">
          <Reveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-bronze-dark dark:text-bronze-light">
                Our Work
              </p>
              <h2 className="mt-3 font-display text-[1.85rem] font-semibold tracking-[-0.02em] text-ink sm:text-3xl lg:text-[2.35rem]">
                See the Kaba Difference.
              </h2>
            </div>
            <Link href="/gallery" className="focus-ring btn-primary gap-2 self-start uppercase tracking-[0.06em] sm:self-auto">
              View Our Work
              <span aria-hidden>→</span>
            </Link>
          </Reveal>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 lg:grid-cols-4">
            {teaser.map((project, i) => (
              <Reveal as="li" key={project.id} delay={i * 60} className="overflow-hidden rounded-xl">
                <div className="relative aspect-[4/3] bg-ivory-muted">
                  <Image
                    src={project.image}
                    alt={project.caption}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Service area — Angier home base */}
      <section className="bg-ivory-muted/60 section-y">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
            <Reveal className="lg:col-span-5">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-bronze-dark dark:text-bronze-light">
                Service Area
              </p>
              <h2 className="mt-3 font-display text-[1.85rem] font-semibold tracking-[-0.02em] text-ink sm:text-3xl lg:text-[2.35rem]">
                Based in Angier. Serving Raleigh &amp; Nearby Towns.
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                We install and repair fences and decks across Harnett, Wake,
                and Johnston counties—Angier first, then Raleigh and the
                surrounding communities within a practical drive.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/fence-company-angier-nc"
                  className="focus-ring btn-primary gap-2 whitespace-nowrap uppercase tracking-[0.06em]"
                >
                  Fencing in Angier, NC
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  href="/service-area"
                  className="focus-ring btn-secondary-light justify-center whitespace-nowrap"
                >
                  All towns we serve
                </Link>
              </div>
            </Reveal>
            <Reveal className="lg:col-span-7" delay={80}>
              <h3 className="sr-only">Towns we serve</h3>
              <ul className="flex flex-wrap gap-2.5">
                {towns.map((town) =>
                  town.name.trim().toLowerCase() === "angier" ? (
                    <li key={town.name}>
                      <Link
                        href="/fence-company-angier-nc"
                        className="focus-ring inline-flex items-center rounded-full border-2 border-bronze bg-bronze px-4 py-2 text-sm font-bold text-navy transition hover:bg-bronze-light"
                      >
                        {town.name}, NC ★
                      </Link>
                    </li>
                  ) : (
                    <li
                      key={town.name}
                      className="inline-flex items-center rounded-full border border-ink/[0.1] bg-surface px-3.5 py-1.5 text-sm font-medium text-ink/80 dark:border-cream/15"
                    >
                      {town.name}
                    </li>
                  ),
                )}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Reviews — only rendered when real reviews are published and featured */}
      {homeReviews.length > 0 ? (
        <section className="bg-ivory-muted/60 section-y">
          <div className="container-page">
            <Reveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-bronze-dark dark:text-bronze-light">
                  Reviews
                </p>
                <h2 className="mt-3 font-display text-[1.85rem] font-semibold tracking-[-0.02em] text-ink sm:text-3xl lg:text-[2.35rem]">
                  Trusted by Homeowners in Our Community.
                </h2>
              </div>
              <Link href="/reviews" className="focus-ring btn-primary gap-2 self-start uppercase tracking-[0.06em] sm:self-auto">
                Read Our Reviews
                <span aria-hidden>→</span>
              </Link>
            </Reveal>
            <ul className="mt-10 grid gap-5 sm:grid-cols-3">
              {homeReviews.map((review, i) => (
                <Reveal as="li" key={review.id} delay={i * 80} className="review-card flex flex-col">
                  <span
                    className="font-display text-3xl leading-none text-bronze/50"
                    aria-hidden
                  >
                    “
                  </span>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                    {review.body}
                  </p>
                  <p className="mt-5 text-sm font-semibold text-ink">
                    {review.customerName}
                    {review.city ? (
                      <span className="font-normal text-muted"> | {review.city}</span>
                    ) : null}
                  </p>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Final CTA — own fence photo band (separate from solid charcoal footer) */}
      <section className="relative isolate overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <Image
            src="/gallery/cedar-privacy.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#0a0c10]/68" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0c10]/35 via-transparent to-[#0a0c10]/55" />
        </div>
        <Reveal className="container-page relative z-[1] flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="font-display text-[1.85rem] font-semibold tracking-[-0.02em] text-white sm:text-3xl lg:text-[2.5rem]">
              Ready to Start Your Fence Project?
            </h2>
            <p className="mt-3 text-base text-white/75">
              Let&apos;s talk about what you need.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:items-start lg:items-end">
            <Link href="/contact" className="focus-ring btn-primary gap-2 uppercase tracking-[0.06em]">
              Request a Free Estimate
              <span aria-hidden>→</span>
            </Link>
            <a
              href={contact.phoneHref}
              className="focus-ring inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-bronze"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call {contact.phone}
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}

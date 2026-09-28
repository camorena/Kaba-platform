import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import {
  getPublishedAboutLocalTrust,
  getPublishedAboutStats,
  getPublishedCompanyValues,
  getPublishedServiceTowns,
} from "@/lib/cms/public";
import {
  defaultOgImage,
  kabaExperience,
  siteConfig,
  trustPoints,
} from "@/lib/site";

const title = "About Our Crew";
const description = `Meet ${siteConfig.name}—a local & family-owned fence company based in Angier, serving Raleigh, NC & surrounding areas with clear estimates and solid craftsmanship.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `${title} | ${siteConfig.name}`,
    description,
    url: "/about",
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | ${siteConfig.name}`,
    description,
    images: [defaultOgImage.url],
  },
};

export const dynamic = "force-dynamic";

function ExpIcon({ icon }: { icon: (typeof kabaExperience)[number]["icon"] }) {
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

const experienceDetail: Record<(typeof kabaExperience)[number]["id"], string> = {
  listen:
    "We start with your yard, pets, privacy goals, and budget—before we talk materials or timelines.",
  guide:
    "Wood, vinyl, aluminum, or chain link: we explain trade-offs in plain language and put the scope in writing.",
  build:
    "Posts set properly, panels plumb, gates that swing true—craftsmanship you can lean on for Carolina weather.",
  care:
    "From first measure to final walkthrough—and after—we’re the local crew you can call by name.",
};

export default function AboutPage() {
  const aboutStats = getPublishedAboutStats();
  const aboutLocalTrust = getPublishedAboutLocalTrust();
  const companyValues = getPublishedCompanyValues();
  const serviceTowns = getPublishedServiceTowns();
  const coverageLabel =
    serviceTowns.length > 0
      ? `${serviceTowns
          .map((t) => t.name)
          .slice(0, 8)
          .join(" · ")}${serviceTowns.length > 8 ? " & nearby" : ""}`
      : "Angier · Raleigh · surrounding areas";

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />

      {/* —— Hero —— */}
      <section className="page-hero">
        <div className="container-page section-header relative">
          <p className="eyebrow">Our story</p>
          <h1 className="mt-3.5 max-w-3xl text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.03em] text-ink sm:text-4xl sm:leading-[1.12] lg:text-5xl lg:leading-[1.1]">
            A local crew you can call by name
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
            {siteConfig.name} started with a simple idea: fence and deck work
            done right for Angier, Raleigh, and surrounding areas—honest
            estimates, materials that survive Carolina weather, and a job site
            left cleaner than we found it.
          </p>
          <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Link
              href="/contact"
              className="focus-ring btn-primary w-full justify-center sm:w-auto"
            >
              Request a Free Estimate
            </Link>
            <a
              href="#story"
              className="focus-ring btn-secondary-light w-full justify-center sm:w-auto"
            >
              Read our story
            </a>
          </div>
          <ul
            className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
            aria-label="At a glance"
          >
            {aboutStats.map((stat) => (
              <li
                key={stat.label}
                className="rounded-2xl border border-ink/[0.08] bg-surface px-3.5 py-3.5 shadow-[var(--shadow-xs)] dark:border-cream/10 sm:px-4 sm:py-4"
              >
                <p className="font-display text-lg font-semibold tracking-tight text-ink sm:text-xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs leading-snug text-muted sm:text-sm">
                  {stat.label}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* —— Story —— */}
      <section
        id="story"
        className="container-page section-y scroll-mt-[calc(var(--header-offset)+1rem)]"
        aria-labelledby="story-heading"
      >
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14 lg:items-center">
          <Reveal className="lg:col-span-6">
            <span className="accent-bar" aria-hidden />
            <h2
              id="story-heading"
              className="mt-4 text-2xl font-semibold tracking-[-0.025em] text-ink sm:text-3xl"
            >
              Local &amp; family-owned. Rooted in Angier, working the Triangle edge.
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              We’re homeowners ourselves. We know what a leaning fence after a
              storm feels like, and how much privacy and peace of mind matter.
              That’s why we show up on time, explain the options in plain
              language, and stand behind the work.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              Whether it’s a cedar privacy run in Raleigh, vinyl for an HOA
              neighborhood near Angier, or a chain-link repair nearby, you’ll get
              the same careful crew from first measure to final walkthrough.
            </p>
            <ul className="mt-7 space-y-3">
              {trustPoints.map((point) => (
                <li key={point.label} className="flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bronze/15 text-bronze-dark dark:text-bronze-light"
                    aria-hidden
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-sm font-semibold tracking-tight text-ink">
                    {point.label}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={100} className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-[1.25rem] border border-ink/[0.08] bg-ivory-muted shadow-[var(--shadow-md)] dark:border-cream/10">
              <div className="relative aspect-[4/3] sm:aspect-[5/4]">
                <Image
                  src="/gallery/cedar-privacy.jpg"
                  alt={`Wood privacy fence installed by ${siteConfig.name}`}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                  priority
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/55 via-navy/10 to-transparent"
                  aria-hidden
                />
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5">
                  <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-bronze-light">
                    Craftsmanship
                  </p>
                  <p className="mt-1 font-display text-xl font-semibold text-cream sm:text-2xl">
                    Built for how you live outdoors
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* —— Local trust —— */}
      <section
        className="section-alt section-y"
        aria-labelledby="local-trust-heading"
      >
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Local trust</p>
            <h2
              id="local-trust-heading"
              className="mt-3 text-[1.85rem] font-semibold tracking-[-0.028em] text-ink sm:text-3xl"
            >
              Angier roots. Raleigh reach.
            </h2>
            <p className="mt-3.5 leading-relaxed text-muted">
              Neighbors across Wake and Harnett counties call us for fencing that
              looks right, lasts, and comes with a crew that answers the phone.
            </p>
          </Reveal>

          <ul className="mt-9 grid gap-5 sm:mt-11 sm:grid-cols-2 lg:gap-6">
            {aboutLocalTrust.map((item, i) => (
              <Reveal
                as="li"
                key={item.title}
                delay={i * 70}
                className="card flex gap-4 p-5 sm:p-6"
              >
                <span
                  className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bronze/15 text-bronze-dark dark:text-bronze-light"
                  aria-hidden
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={120} className="mt-8 sm:mt-10">
            <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-ink/[0.08] bg-surface p-5 shadow-[var(--shadow-xs)] dark:border-cream/10 sm:flex-row sm:items-center sm:p-6">
              <div>
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-bronze-dark dark:text-bronze-light">
                  Service area
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted sm:text-base">
                  {coverageLabel}
                </p>
              </div>
              <Link
                href="/service-area"
                className="focus-ring btn-ghost shrink-0 text-sm font-semibold text-bronze-dark dark:text-bronze-light"
              >
                See full coverage →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* —— Values —— */}
      <section
        className="container-page section-y"
        aria-labelledby="values-heading"
      >
        <Reveal className="max-w-2xl">
          <p className="eyebrow">What we stand for</p>
          <h2
            id="values-heading"
            className="mt-3 text-[1.85rem] font-semibold tracking-[-0.028em] text-ink sm:text-3xl"
          >
            Values that show up on every job
          </h2>
          <p className="mt-3.5 leading-relaxed text-muted">
            These aren’t marketing lines—they’re how we schedule, quote, and
            build for neighbors across Wake and Harnett counties.
          </p>
        </Reveal>
        <ul className="mt-9 grid gap-5 sm:mt-11 sm:grid-cols-2 lg:gap-6">
          {companyValues.map((value, i) => (
            <Reveal
              as="li"
              key={value.title}
              delay={i * 70}
              className="card p-5 sm:p-6"
            >
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-bronze-dark dark:text-bronze-light">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 font-display text-lg font-semibold tracking-tight text-ink">
                {value.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">
                {value.description}
              </p>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* —— Team / experience —— */}
      <section
        className="relative overflow-hidden bg-[#0a0c10] section-y text-cream"
        aria-labelledby="experience-heading"
      >
        <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden>
          <Image
            src="/gallery/vinyl-privacy.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover blur-sm"
          />
          <div className="absolute inset-0 bg-[#0a0c10]/85" />
        </div>
        <div className="container-page relative">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-bronze">
              The Kaba Experience
            </p>
            <h2
              id="experience-heading"
              className="mt-3 font-display text-[1.85rem] font-semibold tracking-[-0.02em] text-white sm:text-3xl"
            >
              How our team works with you
            </h2>
            <p className="mt-3.5 leading-relaxed text-cream/80">
              {siteConfig.tagline}—the same rhythm on every Angier and Raleigh
              project, from first call to final handshake.
            </p>
          </Reveal>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {kabaExperience.map((step, i) => (
              <Reveal
                as="li"
                key={step.id}
                delay={i * 80}
                className="rounded-2xl border border-cream/10 bg-cream/[0.04] p-5 text-center backdrop-blur-sm sm:p-6"
              >
                <span className="exp-icon mx-auto">
                  <ExpIcon icon={step.icon} />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold uppercase tracking-[0.06em] text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/75">
                  {experienceDetail[step.id]}
                </p>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-12 text-center">
            <p className="font-script text-3xl text-white sm:text-4xl">
              We Listen. We Guide. We Build. We Care.
            </p>
          </Reveal>
        </div>
      </section>

      {/* —— CTA —— */}
      <section className="container-page pb-16 pt-10 lg:pb-20 lg:pt-14">
        <Reveal className="band-dark relative overflow-hidden rounded-[1.25rem] px-4 py-10 text-center sm:px-10 sm:py-12 md:px-12">
          <div className="relative">
            <span className="accent-bar mx-auto mb-5" aria-hidden />
            <h2 className="font-display text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
              Ready to talk through your project?
            </h2>
            <p className="mx-auto mt-3 max-w-xl leading-relaxed text-cream/80">
              Request a free on-site estimate in Angier, Raleigh, or nearby.
              We’ll measure carefully, recommend materials that fit your yard and
              budget, and leave you with a clear written quote.
            </p>
            <div className="mt-7 flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link
                href="/contact"
                className="focus-ring btn-primary w-full justify-center sm:w-auto"
              >
                Request a Free Estimate
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

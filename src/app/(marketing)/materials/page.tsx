import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import {
  getPublishedDeckMaterials,
  getPublishedFenceMaterials,
  getPublishedMaterialComparison,
  getPublishedMaterialFaqs,
  getPublishedMaterialGuidance,
} from "@/lib/cms/public";
import {
  defaultOgImage,
  siteConfig,
} from "@/lib/site";

const title = "Fence & Deck Materials Guide";
const description = `Compare wood, vinyl, aluminum, and chain-link fencing with ${siteConfig.name}—built for Raleigh-area weather, privacy goals, and upkeep.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/materials" },
  openGraph: {
    title: `${title} | ${siteConfig.name}`,
    description,
    url: "/materials",
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

export default function MaterialsPage() {
  const fenceMaterials = getPublishedFenceMaterials();
  const deckMaterials = getPublishedDeckMaterials();
  const materialGuidance = getPublishedMaterialGuidance();
  const materialComparison = getPublishedMaterialComparison();
  const materialFaqs = getPublishedMaterialFaqs();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Materials", path: "/materials" },
          ]),
        ]}
      />

      {/* —— Hero —— */}
      <section className="page-hero">
        <div className="container-page section-header relative">
          <p className="eyebrow">Materials guide</p>
          <h1 className="mt-3.5 max-w-3xl text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.03em] text-ink sm:text-4xl sm:leading-[1.12] lg:text-5xl lg:leading-[1.1]">
            Materials chosen for Carolina weather—and how you live
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
            An elegant look at wood, vinyl, aluminum, and chain link—plus deck
            boards we install around Raleigh. Compare privacy, upkeep, lifespan,
            and what holds up to heat, humidity, and storms.
          </p>
          <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Link
              href="/contact"
              className="focus-ring btn-primary w-full justify-center sm:w-auto"
            >
              Request a Free Estimate
            </Link>
            <a
              href="#compare"
              className="focus-ring btn-secondary-light w-full justify-center sm:w-auto"
            >
              Compare materials
            </a>
          </div>
          <ul className="mt-10 flex flex-wrap gap-2 sm:gap-2.5" aria-label="Jump to material">
            {fenceMaterials.map((m) => (
              <li key={m.id}>
                <a
                  href={`#${m.id}`}
                  className="focus-ring inline-flex min-h-10 items-center rounded-full border border-ink/[0.1] bg-surface px-3.5 text-xs font-semibold tracking-wide text-ink shadow-[var(--shadow-xs)] transition hover:border-bronze/45 hover:text-bronze-dark dark:border-cream/12 dark:hover:text-bronze-light"
                >
                  {m.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* —— Material cards —— */}
      <section
        className="container-page section-y"
        aria-labelledby="fence-materials-heading"
      >
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Fencing</p>
          <h2
            id="fence-materials-heading"
            className="mt-3 text-[1.85rem] font-semibold tracking-[-0.028em] text-ink sm:text-3xl"
          >
            Four materials. Clear trade-offs.
          </h2>
          <p className="mt-3.5 leading-relaxed text-muted">
            From warm wood privacy to low-maintenance vinyl and open ornamental
            aluminum—pick the look that fits your yard, HOA, and weekend
            bandwidth.
          </p>
        </Reveal>

        <ul className="mt-9 grid gap-6 sm:mt-11 sm:grid-cols-2 lg:gap-7">
          {fenceMaterials.map((m, i) => (
            <Reveal
              as="li"
              key={m.id}
              id={m.id}
              delay={i * 70}
              className="card group scroll-mt-[calc(var(--header-offset)+1rem)] flex h-full flex-col overflow-hidden p-0"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-ivory-muted">
                <Image
                  src={m.image}
                  alt={`${m.name} fencing by ${siteConfig.name}`}
                  fill
                  sizes="(min-width: 1024px) 34vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  priority={i < 2}
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/55 via-navy/10 to-transparent"
                  aria-hidden
                />
                <span className="absolute bottom-3 left-3 rounded-full bg-navy/70 px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-cream backdrop-blur-sm">
                  {m.costTier} · {m.privacy} privacy
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-bronze-dark dark:text-bronze-light">
                  {m.tagline}
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                  {m.name}
                </h3>
                <p className="mt-2 text-sm font-medium text-ink/90">{m.bestFor}</p>

                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-ink/[0.07] bg-ivory-muted/60 px-3 py-2.5 dark:border-cream/10 dark:bg-ivory-muted/40">
                    <dt className="text-[0.625rem] font-bold uppercase tracking-[0.12em] text-muted">
                      Lifespan
                    </dt>
                    <dd className="mt-0.5 font-semibold text-ink">{m.lifespan}</dd>
                  </div>
                  <div className="rounded-xl border border-ink/[0.07] bg-ivory-muted/60 px-3 py-2.5 dark:border-cream/10 dark:bg-ivory-muted/40">
                    <dt className="text-[0.625rem] font-bold uppercase tracking-[0.12em] text-muted">
                      Care
                    </dt>
                    <dd className="mt-0.5 font-semibold text-ink">{m.upkeep}</dd>
                  </div>
                </dl>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-muted">
                      Pros
                    </p>
                    <ul className="mt-1.5 space-y-1 text-sm text-muted">
                      {m.pros.map((p) => (
                        <li key={p} className="flex gap-2">
                          <span
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-bronze"
                            aria-hidden
                          />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-muted">
                      Cons
                    </p>
                    <ul className="mt-1.5 space-y-1 text-sm text-muted">
                      {m.cons.map((c) => (
                        <li key={c} className="flex gap-2">
                          <span
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink/25 dark:bg-cream/30"
                            aria-hidden
                          />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="mt-5 border-t border-ink/[0.07] pt-4 text-sm leading-relaxed text-muted dark:border-cream/10">
                  <span className="font-semibold text-ink">Pro tip: </span>
                  {m.tip}
                </p>

                <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
                  <Link
                    href="/contact"
                    className="focus-ring btn-primary min-h-11 px-4 text-sm"
                  >
                    Get a quote
                  </Link>
                  <Link
                    href={m.servicesHref}
                    className="focus-ring btn-ghost min-h-11 text-sm font-semibold text-bronze-dark dark:text-bronze-light"
                  >
                    See {m.name.toLowerCase()} options →
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* —— Comparison / guidance —— */}
      <section
        id="compare"
        className="section-alt section-y scroll-mt-[calc(var(--header-offset)+1rem)]"
        aria-labelledby="compare-heading"
      >
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Side-by-side</p>
            <h2
              id="compare-heading"
              className="mt-3 text-[1.85rem] font-semibold tracking-[-0.028em] text-ink sm:text-3xl"
            >
              Compare at a glance
            </h2>
            <p className="mt-3.5 leading-relaxed text-muted">
              A quick read on privacy, care, and lifespan—then honest guidance for
              the situations we hear most from Raleigh-area homeowners.
            </p>
          </Reveal>

          <Reveal delay={80} className="mt-8 overflow-hidden rounded-2xl border border-ink/[0.08] bg-surface shadow-sm dark:border-cream/10 sm:mt-10">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
                <caption className="sr-only">
                  Fence material comparison for privacy, maintenance, lifespan, and best use
                </caption>
                <thead>
                  <tr className="border-b border-ink/[0.08] bg-ivory-muted/80 dark:border-cream/10 dark:bg-ivory-muted/50">
                    <th scope="col" className="px-4 py-3.5 font-display text-sm font-semibold text-ink sm:px-5">
                      Material
                    </th>
                    <th scope="col" className="px-4 py-3.5 font-display text-sm font-semibold text-ink sm:px-5">
                      Privacy
                    </th>
                    <th scope="col" className="px-4 py-3.5 font-display text-sm font-semibold text-ink sm:px-5">
                      Maintenance
                    </th>
                    <th scope="col" className="px-4 py-3.5 font-display text-sm font-semibold text-ink sm:px-5">
                      Lifespan
                    </th>
                    <th scope="col" className="px-4 py-3.5 font-display text-sm font-semibold text-ink sm:px-5">
                      Best when
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {materialComparison.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-ink/[0.06] last:border-0 dark:border-cream/10"
                    >
                      <th
                        scope="row"
                        className="px-4 py-3.5 font-semibold text-ink sm:px-5"
                      >
                        <a
                          href={`#${row.id}`}
                          className="focus-ring rounded-sm text-bronze-dark underline-offset-2 hover:underline dark:text-bronze-light"
                        >
                          {row.name}
                        </a>
                      </th>
                      <td className="px-4 py-3.5 text-muted sm:px-5">{row.privacy}</td>
                      <td className="px-4 py-3.5 text-muted sm:px-5">{row.maintenance}</td>
                      <td className="px-4 py-3.5 text-muted sm:px-5">{row.lifespan}</td>
                      <td className="px-4 py-3.5 text-muted sm:px-5">{row.bestWhen}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <ul className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:gap-5">
            {materialGuidance.map((g, i) => (
              <Reveal
                as="li"
                key={g.title}
                delay={i * 60}
                className="card-static flex gap-4 p-5 sm:p-6"
              >
                <span
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bronze/15 text-sm font-bold text-bronze-dark dark:text-bronze-light"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                    {g.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{g.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* —— Deck materials —— */}
      <section
        className="container-page section-y"
        aria-labelledby="deck-materials-heading"
      >
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Decking</p>
          <h2
            id="deck-materials-heading"
            className="mt-3 text-[1.85rem] font-semibold tracking-[-0.028em] text-ink sm:text-3xl"
          >
            Deck boards & framing
          </h2>
          <p className="mt-3.5 leading-relaxed text-muted">
            Framing is usually pressure-treated for strength in NC soil. Surface
            boards can stay wood or go composite for easier weekends.
          </p>
        </Reveal>
        <ul className="mt-9 grid gap-5 sm:mt-11 sm:grid-cols-3 lg:gap-6">
          {deckMaterials.map((m, i) => (
            <Reveal
              as="li"
              key={m.id}
              delay={i * 70}
              className="card flex h-full flex-col p-5 sm:p-6"
            >
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-bronze-dark dark:text-bronze-light">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-ink">
                {m.name}
              </h3>
              <p className="mt-2 text-sm font-medium text-ink/90">{m.bestFor}</p>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex gap-2">
                  <dt className="shrink-0 font-semibold text-ink">Lifespan</dt>
                  <dd className="text-muted">{m.lifespan}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="shrink-0 font-semibold text-ink">Care</dt>
                  <dd className="text-muted">{m.maintenance}</dd>
                </div>
              </dl>
              <p className="mt-auto border-t border-ink/[0.07] pt-4 text-sm leading-relaxed text-muted dark:border-cream/10">
                <span className="font-semibold text-ink">Pro tip: </span>
                {m.tip}
              </p>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* —— FAQ —— */}
      <section className="section-soft section-y">
        <div className="container-page">
          <Reveal className="mx-auto max-w-3xl">
            <p className="eyebrow eyebrow-center">Materials FAQ</p>
            <h2 className="mt-3 text-center font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Common materials questions
            </h2>
            <div className="mt-8">
              <FaqAccordion items={materialFaqs} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* —— CTA —— */}
      <section className="container-page pb-16 pt-4 lg:pb-20 lg:pt-6">
        <Reveal className="band-dark relative overflow-hidden rounded-[1.25rem] px-4 py-10 text-center sm:px-10 sm:py-12 md:px-12">
          <div className="relative">
            <span className="accent-bar mx-auto mb-5" aria-hidden />
            <h2 className="font-display text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
              Still deciding between two options?
            </h2>
            <p className="mx-auto mt-3 max-w-xl leading-relaxed text-cream/80">
              We’ll bring samples, talk HOA rules, and price both paths clearly on
              your free estimate across {siteConfig.serviceArea}.
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

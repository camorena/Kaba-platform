import type { Metadata } from "next";
import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import {
  deckMaterials,
  defaultOgImage,
  fenceMaterials,
  materialFaqs,
  siteConfig,
} from "@/lib/site";

const title = "Fence & Deck Materials Guide";
const description = `Compare cedar, vinyl, aluminum, chain-link, pressure-treated, and composite options with ${siteConfig.name}—built for Angier & Raleigh NC weather.`;

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

function MaterialCard({
  name,
  bestFor,
  lifespan,
  maintenance,
  pros,
  cons,
  tip,
  index,
}: {
  name: string;
  bestFor: string;
  lifespan: string;
  maintenance: string;
  pros: readonly string[];
  cons: readonly string[];
  tip: string;
  index: number;
}) {
  return (
    <Reveal delay={index * 60} className="card flex h-full flex-col p-5 sm:p-6">
      <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-bronze-dark dark:text-bronze-light">
        {String(index + 1).padStart(2, "0")}
      </p>
      <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-ink">
        {name}
      </h3>
      <p className="mt-2 text-sm font-medium text-ink/90">{bestFor}</p>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex gap-2">
          <dt className="shrink-0 font-semibold text-ink">Lifespan</dt>
          <dd className="text-muted">{lifespan}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0 font-semibold text-ink">Care</dt>
          <dd className="text-muted">{maintenance}</dd>
        </div>
      </dl>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-muted">
            Pros
          </p>
          <ul className="mt-1.5 space-y-1 text-sm text-muted">
            {pros.map((p) => (
              <li key={p} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-bronze" aria-hidden />
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
            {cons.map((c) => (
              <li key={c} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink/25" aria-hidden />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-auto border-t border-ink/[0.07] pt-4 text-sm leading-relaxed text-muted dark:border-cream/10">
        <span className="font-semibold text-ink">Pro tip: </span>
        {tip}
      </p>
    </Reveal>
  );
}

export default function MaterialsPage() {
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

      <section className="page-hero">
        <div className="container-page section-header relative">
          <p className="eyebrow">Materials guide</p>
          <h1 className="mt-3.5 text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.03em] text-ink sm:text-4xl sm:leading-[1.12] lg:text-5xl lg:leading-[1.1]">
            Choose materials that survive Carolina weather
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
            A clear look at fence and deck options we install around Angier and
            Raleigh—privacy goals, upkeep, lifespan, and what holds up to heat,
            humidity, and storms. Prefer samples on site? Request a free estimate.
          </p>
        </div>
      </section>

      <section className="container-page section-y" aria-labelledby="fence-materials-heading">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Fencing</p>
          <h2
            id="fence-materials-heading"
            className="mt-3 text-[1.85rem] font-semibold tracking-[-0.028em] text-ink sm:text-3xl"
          >
            Fence materials we recommend
          </h2>
          <p className="mt-3.5 leading-relaxed text-muted">
            From classic cedar privacy to low-maintenance vinyl and open
            ornamental aluminum—pick the look that fits your yard and HOA.
          </p>
        </Reveal>
        <ul className="mt-9 grid gap-5 sm:mt-11 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {fenceMaterials.map((m, i) => (
            <li key={m.id} className="min-w-0">
              <MaterialCard {...m} index={i} />
            </li>
          ))}
        </ul>
      </section>

      <section className="section-alt section-y" aria-labelledby="deck-materials-heading">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Decking</p>
            <h2
              id="deck-materials-heading"
              className="mt-3 text-[1.85rem] font-semibold tracking-[-0.028em] text-ink sm:text-3xl"
            >
              Deck boards & framing
            </h2>
            <p className="mt-3.5 leading-relaxed text-muted">
              Framing is usually pressure-treated for strength in NC soil.
              Surface boards can stay wood or go composite for easier weekends.
            </p>
          </Reveal>
          <ul className="mt-9 grid gap-5 sm:mt-11 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {deckMaterials.map((m, i) => (
              <li key={m.id} className="min-w-0">
                <MaterialCard {...m} index={i} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page section-y">
        <Reveal className="mx-auto max-w-3xl">
          <p className="eyebrow text-center">Materials FAQ</p>
          <h2 className="mt-3 text-center font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Common materials questions
          </h2>
          <div className="mt-8">
            <FaqAccordion items={[...materialFaqs]} />
          </div>
        </Reveal>
      </section>

      <section className="section-alt py-12 lg:py-16">
        <Reveal className="container-page max-w-3xl text-center">
          <span className="accent-bar mx-auto mb-5" aria-hidden />
          <h2 className="font-display text-2xl font-semibold tracking-[-0.025em] text-ink sm:text-3xl">
            Still deciding between two options?
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            We’ll bring samples, talk HOA rules, and price both paths clearly on
            your free estimate.
          </p>
          <div className="mt-7 flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link href="/contact" className="focus-ring btn-primary w-full justify-center sm:w-auto">
              Request a Free Estimate
            </Link>
            <Link href="/faq" className="focus-ring btn-secondary-light w-full justify-center sm:w-auto">
              Read the FAQ
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { getPublishedServiceTowns } from "@/lib/cms/public";
import { defaultOgImage, siteConfig } from "@/lib/site";

const title = "Service Area";
const description = `Fence and deck installation & repair serving Angier, Raleigh, Fuquay-Varina, Holly Springs, Clayton, and surrounding NC communities from ${siteConfig.name}.`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "fence company Angier NC",
    "Raleigh fence installation",
    "Fuquay-Varina deck repair",
    "Holly Springs vinyl fence",
    "Clayton NC fencing",
    "Wake County fence contractor",
    "Harnett County deck builder",
  ],
  openGraph: {
    title: `${title} | ${siteConfig.name}`,
    description,
    images: [defaultOgImage],
  },
};

export const dynamic = "force-dynamic";

export default function ServiceAreaPage() {
  const serviceTowns = getPublishedServiceTowns();

  return (
    <>
      <section className="page-hero">
        <div className="container-page section-header relative">
          <p className="eyebrow">Where we work</p>
          <h1 className="mt-3.5 text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.03em] text-ink sm:text-4xl sm:leading-[1.12] lg:text-5xl lg:leading-[1.1]">
            Serving Angier, Raleigh &amp; nearby NC towns
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
            Based in Angier, {siteConfig.name} installs and repairs fences and
            decks across Wake and Harnett counties—and into nearby Johnston
            communities. If your town is on the list below (or close), we’d love
            to take a look.
          </p>
        </div>
      </section>

      <section className="container-page section-y">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 lg:items-start">
          <Reveal className="lg:col-span-5">
            <span className="accent-bar" aria-hidden />
            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.025em] text-ink sm:text-3xl">
              Local coverage, without the runaround
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              We prioritize projects we can schedule and support well—Angier and
              Raleigh first, then surrounding towns within a practical drive. Not
              sure if we reach you? Call{" "}
              <a
                href={siteConfig.phoneHref}
                className="focus-ring rounded font-semibold text-ink underline-offset-2 hover:underline"
              >
                {siteConfig.phone}
              </a>{" "}
              and ask.
            </p>

            {/* Stylized map graphic — no paid map API */}
            <div
              className="relative mt-8 overflow-hidden rounded-[1.25rem] border border-ink/[0.08] bg-navy p-6 text-cream shadow-md dark:border-cream/10 sm:p-8"
              aria-hidden
            >
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-60"
                style={{
                  background:
                    "radial-gradient(circle, color-mix(in srgb, var(--bronze) 45%, transparent), transparent 70%)",
                }}
              />
              <div
                className="pointer-events-none absolute -bottom-12 left-1/4 h-36 w-36 rounded-full opacity-40"
                style={{
                  background:
                    "radial-gradient(circle, color-mix(in srgb, var(--bronze) 30%, transparent), transparent 70%)",
                }}
              />
              <p className="relative text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-bronze">
                Coverage snapshot
              </p>
              <div className="relative mt-6 flex flex-col items-center gap-3">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="rounded-full border border-bronze/40 bg-bronze/15 px-3 py-1.5 text-xs font-semibold text-bronze-light">
                    Raleigh
                  </span>
                  <span className="rounded-full border border-bronze/40 bg-bronze/15 px-3 py-1.5 text-xs font-semibold text-bronze-light">
                    Cary · Apex
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="rounded-full border border-cream/20 bg-cream/10 px-3 py-1.5 text-xs font-medium text-cream/85">
                    Holly Springs
                  </span>
                  <span className="rounded-full border-2 border-bronze bg-bronze px-4 py-2 text-sm font-bold text-navy shadow-[0_4px_16px_color-mix(in_srgb,var(--bronze)_40%,transparent)]">
                    Angier ★
                  </span>
                  <span className="rounded-full border border-cream/20 bg-cream/10 px-3 py-1.5 text-xs font-medium text-cream/85">
                    Fuquay-Varina
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="rounded-full border border-cream/20 bg-cream/10 px-3 py-1.5 text-xs font-medium text-cream/85">
                    Clayton
                  </span>
                  <span className="rounded-full border border-cream/20 bg-cream/10 px-3 py-1.5 text-xs font-medium text-cream/85">
                    Garner
                  </span>
                  <span className="rounded-full border border-cream/20 bg-cream/10 px-3 py-1.5 text-xs font-medium text-cream/85">
                    Dunn · Lillington
                  </span>
                </div>
              </div>
              <p className="relative mt-6 text-center text-xs text-cream/55">
                Home base in Angier · Wake &amp; Harnett focus
              </p>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal>
              <h2 className="sr-only">Towns we serve</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {serviceTowns.map((town, i) => (
                  <Reveal
                    as="li"
                    key={town.name}
                    delay={(i % 4) * 50}
                    className="card p-4 sm:p-5"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                        {town.name}
                      </h3>
                      <span className="shrink-0 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-bronze-dark dark:text-bronze-light">
                        {town.region}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {town.note}
                    </p>
                  </Reveal>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-soft section-y">
        <Reveal className="container-page max-w-3xl text-center">
          <span className="accent-bar mx-auto mb-5" aria-hidden />
          <h2 className="font-display text-2xl font-semibold tracking-[-0.025em] text-ink sm:text-3xl">
            Planning a fence or deck in your town?
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Tell us your city and project type—we’ll confirm we can serve you and
            schedule a free on-site estimate.
          </p>
          <div className="mt-7 flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link href="/contact" className="focus-ring btn-primary w-full justify-center sm:w-auto">
              Request a Free Estimate
            </Link>
            <Link href="/services" className="focus-ring btn-secondary-light w-full justify-center sm:w-auto">
              View services
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

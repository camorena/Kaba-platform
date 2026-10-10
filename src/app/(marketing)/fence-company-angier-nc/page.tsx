import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import {
  getPublishedContactInfo,
  getPublishedFenceTypes,
  getPublishedHeroCopy,
  getPublishedProcessTimeline,
  getPublishedServices,
} from "@/lib/cms/public";
import { breadcrumbJsonLd, faqPageJsonLd } from "@/lib/jsonld";
import { absoluteUrl, defaultOgImage } from "@/lib/site";

const path = "/fence-company-angier-nc";
const title = "Fence Installation & Repair in Angier, NC";

export function generateMetadata(): Metadata {
  const brand = getPublishedHeroCopy();
  const description = `${brand.name} is a local fence company based in Angier, NC. Wood, vinyl, aluminum, and chain-link fence installation and repair, gates, and deck work across Angier and Harnett County. Free on-site estimates.`;
  return {
    title,
    description,
    keywords: [
      "fence company Angier NC",
      "fence installation Angier NC",
      "fence repair Angier NC",
      "Harnett County fence contractor",
      "wood fence Angier",
      "vinyl fence Angier",
    ],
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${brand.name}`,
      description,
      url: path,
      images: [defaultOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${brand.name}`,
      description,
      images: [defaultOgImage.url],
    },
  };
}

export const dynamic = "force-dynamic";

const whyLocal = [
  {
    title: "Home base in Angier",
    description:
      "We’re based right here in Angier, so projects in town and on nearby Harnett County lots are close to home—easier to schedule, easier to follow up on.",
  },
  {
    title: "Free on-site estimates",
    description:
      "We come out, measure carefully, talk through materials in plain language, and leave you with a clear written quote—no obligation.",
  },
  {
    title: "Materials that last here",
    description:
      "Cedar, pressure-treated wood, vinyl, aluminum, and chain link chosen for Carolina heat, humidity, and storms.",
  },
  {
    title: "Clean job sites",
    description:
      "We protect landscaping, haul debris, and walk the finished fence with you before we leave.",
  },
] as const;

function angierFaqs(phone: string) {
  return [
    {
      question: "Do you install and repair fences in Angier, NC?",
      answer:
        "Yes. Angier is our home base. We install and repair wood, vinyl, aluminum, and chain-link fences and gates for homes and businesses in Angier and the surrounding Harnett County area, and we also handle deck repairs and builds.",
    },
    {
      question: "Do I need a permit for a fence in Angier?",
      answer:
        "Angier and Harnett County may require a permit for some fences, depending on where your property is and what you’re building. HOA rules can apply too. Requirements vary by property, so we’ll help you check what applies before we build.",
    },
    {
      question: "Can you repair my existing fence instead of replacing it?",
      answer:
        "Often, yes. We inspect posts, panels, and gates first. If the structure is sound, targeted repairs can restore function and looks without a full replacement.",
    },
    {
      question: "Is the estimate really free?",
      answer:
        "Yes. On-site estimates for residential fence projects are free and no-obligation. You’ll get a written scope and price so you can decide on your own timeline.",
    },
    {
      question: "How long does a typical fence installation take?",
      answer:
        "Most residential fence projects wrap up in one to three days once materials are on site. Longer runs, steep grades, or HOA review can add time. Your written estimate includes a clear schedule.",
    },
    {
      question: "Which towns near Angier do you serve?",
      answer: `Besides Angier, we work in Fuquay-Varina, Lillington, Dunn, Holly Springs, Raleigh, and other nearby Harnett, Wake, and Johnston County communities. Not sure if you’re in range? Call ${phone}.`,
    },
  ];
}

export default function AngierPage() {
  const brand = getPublishedHeroCopy();
  const contact = getPublishedContactInfo();
  const fenceTypes = getPublishedFenceTypes();
  const deckServices = getPublishedServices();
  const process = getPublishedProcessTimeline();
  const faqItems = angierFaqs(contact.phone);

  return (
    <>
      <JsonLd
        data={[
          faqPageJsonLd(faqItems),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Service Area", path: "/service-area" },
            { name: "Angier, NC", path },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": `${absoluteUrl(path)}#service`,
            name: "Fence installation & repair in Angier, NC",
            serviceType: "Fence installation and repair",
            provider: { "@id": `${absoluteUrl("/")}/#business` },
            areaServed: [
              { "@type": "City", name: "Angier" },
              { "@type": "AdministrativeArea", name: "Harnett County" },
            ],
            url: absoluteUrl(path),
          },
        ]}
      />

      <section className="page-hero">
        <div className="container-page section-header relative">
          <p className="eyebrow">Angier, NC · Harnett County</p>
          <h1 className="mt-3.5 text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.03em] text-ink sm:text-4xl sm:leading-[1.12] lg:text-5xl lg:leading-[1.1]">
            Fence Installation &amp; Repair in Angier, NC
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
            {brand.name} is a local fence company based in Angier. We install
            and repair wood, vinyl, aluminum, and chain-link fences—plus gates
            and decks—for homes and businesses in town and on nearby rural
            lots, with a free on-site estimate to start.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="focus-ring btn-primary gap-2 justify-center sm:w-auto">
              Request a Free Estimate →
            </Link>
            <a href={contact.phoneHref} className="focus-ring btn-secondary-light justify-center">
              Call {contact.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Fence services */}
      <section className="container-page section-y">
        <Reveal className="max-w-2xl">
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-bronze-dark dark:text-bronze-light">
            Fence Services in Angier
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
            New fences, repairs, and gates
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Privacy for the backyard, a safer space for pets, or a repair that
            restores what you already have—we’ll recommend the right fit for
            your property and budget.
          </p>
        </Reveal>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {fenceTypes.map((svc, i) => (
            <Reveal as="li" key={svc.slug} delay={i * 60} className="option-card group flex h-full flex-col">
              <div className="relative aspect-[4/3] overflow-hidden bg-ivory-muted">
                <Image
                  src={svc.image}
                  alt={`${svc.title} by ${brand.name}`}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col bg-surface p-5">
                <h3 className="font-display text-base font-semibold text-ink">{svc.title}</h3>
                <p className="mt-1 text-xs text-muted">{svc.tagline}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{svc.summary}</p>
                <Link
                  href={`/services#${svc.slug}`}
                  className="focus-ring btn-ghost mt-auto inline-flex min-h-10 items-center pt-3"
                >
                  Learn more →
                </Link>
              </div>
            </Reveal>
          ))}
        </ul>

        {deckServices.length > 0 ? (
          <Reveal className="card mt-8 p-6 sm:p-7">
            <h3 className="font-display text-lg font-semibold text-ink">
              Deck work, too
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {deckServices.map((d) => d.title).join(" · ")}. Ask about deck
              repairs and builds when we come out for your fence estimate.
            </p>
          </Reveal>
        ) : null}
      </section>

      {/* Why local */}
      <section className="section-soft section-y">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-bronze-dark dark:text-bronze-light">
              Why a Local Crew
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
              Angier roots, careful work
            </h2>
          </Reveal>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {whyLocal.map((item, i) => (
              <Reveal as="li" key={item.title} delay={i * 70} className="card p-6">
                <span className="accent-bar mb-4" aria-hidden />
                <h3 className="font-display text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Process */}
      <section className="container-page section-y">
        <Reveal className="max-w-2xl">
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-bronze-dark dark:text-bronze-light">
            How It Works
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
            From estimate to walkthrough
          </h2>
        </Reveal>
        <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((step, i) => (
            <Reveal as="li" key={step.step} delay={i * 70} className="card p-6">
              <p className="font-display text-3xl font-semibold text-bronze">{step.step}</p>
              <h3 className="mt-3 font-display text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-1 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-bronze-dark dark:text-bronze-light">
                {step.eyebrow}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{step.description}</p>
            </Reveal>
          ))}
        </ol>
        <Reveal className="mt-8">
          <Link href="/how-it-works" className="focus-ring btn-ghost inline-flex min-h-10 items-center">
            More on our process →
          </Link>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="section-soft section-y">
        <div className="container-page">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-bronze-dark dark:text-bronze-light">
              FAQ
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
              Angier fence questions
            </h2>
          </Reveal>
          <Reveal className="mx-auto mt-8 max-w-3xl">
            <FaqAccordion items={faqItems} />
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="band-dark py-14 sm:py-16">
        <Reveal className="container-page max-w-2xl text-center">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            Planning a fence in Angier?
          </h2>
          <p className="mt-3 text-cream/75">
            Tell us about your project and we’ll schedule a free on-site
            estimate. Prefer to talk? Call{" "}
            <a href={contact.phoneHref} className="focus-ring rounded font-semibold text-cream underline-offset-2 hover:underline">
              {contact.phone}
            </a>
            .
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link href="/contact" className="focus-ring btn-primary inline-flex justify-center gap-2">
              Request a Free Estimate →
            </Link>
            <Link href="/service-area" className="focus-ring inline-flex min-h-12 items-center justify-center rounded-[0.6875rem] border border-cream/30 px-5 text-sm font-semibold text-cream transition hover:bg-cream/10">
              Other towns we serve
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

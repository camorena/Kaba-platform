import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import {
  getPublishedContactInfo,
  getPublishedTestimonials,
  getPublishedHeroCopy,
} from "@/lib/cms/public";
import { defaultOgImage } from "@/lib/site";

const title = "Customer Reviews";

export function generateMetadata(): Metadata {
  const brand = getPublishedHeroCopy();
  const hasReviews = getPublishedTestimonials().length > 0;
  const description = hasReviews
    ? `Read what Angier, Raleigh, and nearby NC customers say about fence and deck work from ${brand.name}.`
    : `Customer reviews for ${brand.name}, fence and deck installation and repair in Angier, Raleigh, and nearby NC towns, are coming soon.`;
  return {
  title,
  description,
  alternates: { canonical: "/reviews" },
  // Keep out of the index until real reviews are published.
  robots: hasReviews ? undefined : { index: false, follow: true },
  openGraph: {
    title: `${title} | ${brand.name}`,
    description,
    images: [defaultOgImage],
  },
  };
}

export const dynamic = "force-dynamic";

export default function ReviewsPage() {
  // Only real, verified testimonials published via the CMS. Never placeholders.
  const items = getPublishedTestimonials();
  const contact = getPublishedContactInfo();

  return (
    <>
      <section className="page-hero">
        <div className="container-page section-header relative">
          <p className="eyebrow">Reviews</p>
          <h1 className="mt-3.5 text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.03em] text-ink sm:text-4xl sm:leading-[1.12] lg:text-5xl lg:leading-[1.1]">
            {items.length > 0
              ? "What local customers say"
              : "Customer reviews coming soon"}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
            {items.length > 0
              ? "Feedback from customers across Angier, Raleigh, and surrounding communities."
              : "We only publish reviews from real Kaba Fence customers, and we’re collecting them now. Worked with us recently? We’d be grateful to hear how it went."}
          </p>
        </div>
      </section>

      {items.length > 0 ? (
        <section className="container-page section-y">
          <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {items.map((testimonial, i) => (
              <Reveal
                as="li"
                key={`${testimonial.name}-${testimonial.town}`}
                delay={i * 60}
                className="card flex flex-col p-5 sm:p-6"
              >
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
        </section>
      ) : (
        <section className="container-page section-y">
          <Reveal className="card mx-auto flex max-w-2xl flex-col items-center p-6 text-center sm:p-8">
            <span className="accent-bar mx-auto mb-5" aria-hidden />
            <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
              Share your Kaba Fence experience
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-[0.9375rem]">
              If we built or repaired your fence or deck, send a few words to{" "}
              <a
                href={contact.emailHref}
                className="focus-ring rounded font-semibold text-ink underline-offset-2 hover:underline"
              >
                {contact.email}
              </a>{" "}
              or call{" "}
              <a
                href={contact.phoneHref}
                className="focus-ring rounded font-semibold text-ink underline-offset-2 hover:underline"
              >
                {contact.phone}
              </a>
              . With your permission, we may share it here.
            </p>
          </Reveal>
        </section>
      )}

      <section className="section-soft section-y">
        <Reveal className="container-page max-w-3xl text-center">
          <span className="accent-bar mx-auto mb-5" aria-hidden />
          <h2 className="font-display text-2xl font-semibold tracking-[-0.025em] text-ink sm:text-3xl">
            Planning a fence or deck project?
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Request a free on-site estimate for your fence or deck project in
            Angier, Raleigh, or a nearby NC town.
          </p>
          <div className="mt-7 flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link href="/contact" className="focus-ring btn-primary w-full justify-center sm:w-auto">
              Request a Free Estimate
            </Link>
            <Link href="/gallery" className="focus-ring btn-secondary-light w-full justify-center sm:w-auto">
              Browse gallery
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

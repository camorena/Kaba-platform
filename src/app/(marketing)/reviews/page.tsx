import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { defaultOgImage, siteConfig, testimonials } from "@/lib/site";

const title = "Customer Reviews";
const description = `Read what Angier, Raleigh, and nearby NC homeowners say about fence and deck work from ${siteConfig.name}.`;

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | ${siteConfig.name}`,
    description,
    images: [defaultOgImage],
  },
};

export default function ReviewsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container-page section-header relative">
          <p className="eyebrow">Testimonials</p>
          <h1 className="mt-3.5 text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.03em] text-ink sm:text-4xl sm:leading-[1.12] lg:text-5xl lg:leading-[1.1]">
            Trusted by local homeowners
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
            A sampling of feedback from neighbors across Angier, Raleigh, and
            surrounding communities. Placeholder reviews for design until
            verified customer quotes are added.
          </p>
        </div>
      </section>

      <section className="container-page section-y">
        <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {testimonials.map((testimonial, i) => (
            <Reveal
              as="li"
              key={`${testimonial.name}-${testimonial.town}`}
              delay={i * 60}
              className="card flex flex-col p-5 sm:p-6"
            >
              <div className="flex items-center gap-1" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, s) => (
                  <svg
                    key={s}
                    className="h-4 w-4 text-bronze"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span
                className="mt-3 font-display text-[2.5rem] leading-none text-bronze/55"
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

      <section className="section-soft section-y">
        <Reveal className="container-page max-w-3xl text-center">
          <span className="accent-bar mx-auto mb-5" aria-hidden />
          <h2 className="font-display text-2xl font-semibold tracking-[-0.025em] text-ink sm:text-3xl">
            Ready to be the next success story?
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Request a free on-site estimate for your fence or deck project in
            Angier, Raleigh, or a nearby NC town.
          </p>
          <div className="mt-7 flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link href="/quote" className="focus-ring btn-primary w-full justify-center sm:w-auto">
              Get a Free Quote
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

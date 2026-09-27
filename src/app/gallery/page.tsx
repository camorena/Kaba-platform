import type { Metadata } from "next";
import Link from "next/link";
import GalleryGrid from "@/components/GalleryGrid";
import { siteConfig } from "@/lib/site";

const title = "Project Gallery";
const description = `See fence and deck projects by ${siteConfig.name} serving Angier, Raleigh NC, and surrounding areas.`;

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | ${siteConfig.name}`,
    description,
  },
};

export default function GalleryPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container-page section-header relative">
          <p className="eyebrow">Our work</p>
          <h1 className="mt-4 max-w-[14ch] text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.035em] text-ink sm:text-4xl sm:leading-[1.06] lg:text-5xl">
            Project gallery
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
            Example fence and deck projects from around Angier, Raleigh, and
            nearby communities. Browse recent installs and repairs completed by
            our local crew.
          </p>
        </div>
      </section>

      <section className="container-page section-y">
        <GalleryGrid />
      </section>

      <section className="border-t border-ink/15 bg-ivory-muted py-12 lg:py-16">
        <div className="container-page grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <span className="accent-bar mb-4" aria-hidden />
            <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-ink sm:text-3xl">
              Have a similar project in mind?
            </h2>
            <p className="mt-3 leading-relaxed text-muted">
              Request a free quote and we&apos;ll take a look at your property.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center md:col-span-5 md:justify-end">
            <Link
              href="/quote"
              className="focus-ring btn-primary w-full justify-center sm:w-auto"
            >
              Get a Free Quote
            </Link>
            <Link
              href="/services"
              className="focus-ring btn-secondary-light w-full justify-center sm:w-auto"
            >
              View services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

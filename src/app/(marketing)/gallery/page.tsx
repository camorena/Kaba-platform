import type { Metadata } from "next";
import Link from "next/link";
import GalleryGrid from "@/components/GalleryGrid";
import Reveal from "@/components/Reveal";
import { defaultOgImage, siteConfig } from "@/lib/site";

const title = "Project Gallery";
const description = `Browse fence and deck projects by ${siteConfig.name}—including before/after pairs—serving Angier, Raleigh NC, and surrounding areas.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: `${title} | ${siteConfig.name}`,
    description,
    url: "/gallery",
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | ${siteConfig.name}`,
    description,
    images: [defaultOgImage.url],
  },
};

export default function GalleryPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container-page section-header relative">
          <p className="eyebrow">Our work</p>
          <h1 className="mt-3.5 text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.03em] text-ink sm:text-4xl sm:leading-[1.12] lg:text-5xl lg:leading-[1.1]">
            Project gallery
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
            Fence and deck projects from around Angier, Raleigh, and nearby
            communities. Toggle Before / After on select jobs to see the
            transformation—then request a free quote for your own yard.
          </p>
        </div>
      </section>

      <section className="container-page section-y">
        <GalleryGrid />
      </section>

      <section className="section-alt py-12 lg:py-16">
        <Reveal className="container-page max-w-3xl text-center">
          <span className="accent-bar mx-auto mb-5" aria-hidden />
          <h2 className="font-display text-2xl font-semibold tracking-[-0.025em] text-ink sm:text-3xl">
            Have a similar project in mind?
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Request a free quote and we&apos;ll take a look at your property.
          </p>
          <div className="mt-7 flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link href="/quote" className="focus-ring btn-primary w-full justify-center sm:w-auto">
              Get a Free Quote
            </Link>
            <Link href="/materials" className="focus-ring btn-secondary-light w-full justify-center sm:w-auto">
              Materials guide
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

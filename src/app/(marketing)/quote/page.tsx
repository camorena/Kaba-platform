import type { Metadata } from "next";
import QuoteForm from "@/components/QuoteForm";
import { defaultOgImage, siteConfig } from "@/lib/site";

const title = "Request a Free Quote";
const description = `Request a free fence or deck estimate from ${siteConfig.name} serving Angier, Raleigh NC, and surrounding areas.`;

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | ${siteConfig.name}`,
    description,
    images: [defaultOgImage],
  },
};

export default function QuotePage() {
  return (
    <>
      <section className="page-hero">
        <div className="container-page section-header relative">
          <p className="eyebrow">Free estimates</p>
          <h1 className="mt-3.5 text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.03em] text-ink sm:text-4xl sm:leading-[1.12] lg:text-5xl lg:leading-[1.1]">
            Request a quote
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
            Three short steps—contact, project, and details—and we&apos;ll schedule
            a free on-site estimate. We serve{" "}
            {siteConfig.serviceArea}. Prefer to talk? Call{" "}
            <a
              href={siteConfig.phoneHref}
              className="focus-ring rounded font-semibold text-ink underline-offset-2 hover:underline"
            >
              {siteConfig.phone}
            </a>
            .
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page max-w-3xl">
          <QuoteForm />
        </div>
      </section>
    </>
  );
}

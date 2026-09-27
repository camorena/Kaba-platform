import type { Metadata } from "next";
import QuoteForm from "@/components/QuoteForm";
import { siteConfig } from "@/lib/site";

const title = "Request a Free Quote";
const description = `Request a free fence or deck estimate from ${siteConfig.name} serving Angier, Raleigh NC, and surrounding areas.`;

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | ${siteConfig.name}`,
    description,
  },
};

export default function QuotePage() {
  return (
    <>
      <section className="page-hero">
        <div className="container-page section-header relative">
          <p className="eyebrow">Free estimates</p>
          <h1 className="mt-4 max-w-[14ch] text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.035em] text-ink sm:text-4xl sm:leading-[1.06] lg:text-5xl">
            Request a quote
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
            Share a few details about your fence or deck project. We serve{" "}
            {siteConfig.serviceArea}. Prefer to talk? Call{" "}
            <a
              href={siteConfig.phoneHref}
              className="focus-ring font-semibold text-ink underline decoration-bronze underline-offset-2 hover:decoration-ink"
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

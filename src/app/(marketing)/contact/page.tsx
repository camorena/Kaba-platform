import type { Metadata } from "next";
import QuoteForm from "@/components/QuoteForm";
import { getPublishedContactInfo, getPublishedHeroCopy } from "@/lib/cms/public";
import { defaultOgImage } from "@/lib/site";

const title = "Free Fence Estimate in Angier & Raleigh, NC";

export async function generateMetadata(): Promise<Metadata> {
  const contact = getPublishedContactInfo();
  const brand = getPublishedHeroCopy();
  const description = `Contact ${brand.name} for a free fence or deck estimate in Angier, Raleigh, NC & nearby towns. Call ${contact.phone} or request online.`;
  return {
    title,
    description,
    alternates: { canonical: "/contact" },
    openGraph: {
      title: `${title} | ${brand.name}`,
      description,
      images: [defaultOgImage],
    },
  };
}

export const dynamic = "force-dynamic";

export default function ContactPage() {
  const contact = getPublishedContactInfo();
  const brand = getPublishedHeroCopy();

  return (
    <>
      <section className="page-hero">
        <div className="container-page section-header relative">
          <p className="eyebrow">Contact</p>
          <h1 className="mt-3.5 text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.03em] text-ink sm:text-4xl sm:leading-[1.12] lg:text-5xl lg:leading-[1.1]">
            Request a free estimate
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
            Three short steps—contact, project, and details—and we&apos;ll
            schedule a free on-site visit. We serve {contact.serviceArea}. Prefer
            to talk? Call{" "}
            <a
              href={contact.phoneHref}
              className="focus-ring rounded font-semibold text-ink underline-offset-2 hover:underline"
            >
              {contact.phone}
            </a>{" "}
            or email{" "}
            <a
              href={contact.emailHref}
              className="focus-ring rounded font-semibold text-ink underline-offset-2 hover:underline"
            >
              {contact.email}
            </a>
            .
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page max-w-3xl">
          <QuoteForm contact={contact} brand={{ name: brand.name }} />
        </div>
      </section>
    </>
  );
}

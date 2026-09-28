import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { defaultOgImage, siteConfig } from "@/lib/site";
import { getPublishedContactInfo } from "@/lib/cms/public";

const title = "Privacy Policy";
const description = `How ${siteConfig.name} handles information you share through our website, quote form, and phone or email contact. Serving Angier and Raleigh NC.`;

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: `${title} | ${siteConfig.name}`,
    description,
    url: "/privacy",
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary",
    title: `${title} | ${siteConfig.name}`,
    description,
  },
};

export default function PrivacyPage() {
  const contact = getPublishedContactInfo();
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy" },
        ])}
      />

      <section className="page-hero">
        <div className="container-page section-header relative">
          <p className="eyebrow">Legal</p>
          <h1 className="mt-3.5 text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.03em] text-ink sm:text-4xl sm:leading-[1.12] lg:text-5xl lg:leading-[1.1]">
            Privacy Policy
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
            This policy explains what information {siteConfig.name} collects when
            you use our website or contact us for fence and deck work in Angier,
            Raleigh, and nearby communities—and how we use it.
          </p>
          <p className="mt-3 text-sm text-muted-light">
            Last updated: September 27, 2026
          </p>
        </div>
      </section>

      <section className="container-page section-y">
        <Reveal className="prose-legal mx-auto max-w-3xl space-y-10 text-[0.9875rem] leading-relaxed text-muted">
          <div>
            <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
              Who we are
            </h2>
            <p className="mt-3">
              {siteConfig.name} is a local fence and deck contractor based in{" "}
              {siteConfig.address.city}, {siteConfig.address.state}. Contact us at{" "}
              <a
                href={contact.emailHref}
                className="focus-ring rounded font-medium text-ink underline-offset-2 hover:underline"
              >
                {contact.email}
              </a>{" "}
              or{" "}
              <a
                href={contact.phoneHref}
                className="focus-ring rounded font-medium text-ink underline-offset-2 hover:underline"
              >
                {contact.phone}
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
              Information you provide
            </h2>
            <p className="mt-3">
              When you request a quote, call, email, or use our site chat, you may
              share details such as your name, phone number, email address,
              property location, and project notes (fence or deck type, photos,
              preferred timing). We use this information only to respond to your
              inquiry, schedule estimates, and perform contracted work.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
              Information collected automatically
            </h2>
            <p className="mt-3">
              We may use privacy-friendly, cookieless analytics (such as Vercel
              Analytics and, if configured, Plausible) to understand page views
              and referral sources. These tools do not rely on advertising cookies
              or cross-site tracking profiles. We do not sell your personal
              information.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
              How we use your information
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Respond to quote requests and schedule on-site visits</li>
              <li>Provide estimates, contracts, and project updates</li>
              <li>Improve our website and service based on aggregate traffic</li>
              <li>Comply with legal or insurance requirements when applicable</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
              Sharing
            </h2>
            <p className="mt-3">
              We do not sell or rent your contact details. We may share information
              with service providers who help us operate the site (hosting,
              analytics) or fulfill a project (for example, material suppliers or
              permit offices) only as needed to do the work you requested.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
              Retention &amp; security
            </h2>
            <p className="mt-3">
              We keep quote and project records as long as needed for business,
              warranty, or legal purposes, then delete or archive them
              appropriately. Reasonable safeguards protect information we store,
              but no online transmission is perfectly secure.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
              Your choices
            </h2>
            <p className="mt-3">
              You can ask us to update or remove contact details we hold by
              emailing {contact.email} or calling {contact.phone}. If you
              prefer not to use the web form, call or email us directly.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
              Children
            </h2>
            <p className="mt-3">
              Our site is intended for homeowners and property decision-makers. We
              do not knowingly collect personal information from children under 13.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
              Changes
            </h2>
            <p className="mt-3">
              We may update this policy as our practices or tools change. The
              “Last updated” date at the top will reflect the latest version.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
              Contact
            </h2>
            <p className="mt-3">
              Questions about privacy? Reach {siteConfig.name} at{" "}
              <a
                href={contact.emailHref}
                className="focus-ring rounded font-medium text-ink underline-offset-2 hover:underline"
              >
                {contact.email}
              </a>
              ,{" "}
              <a
                href={contact.phoneHref}
                className="focus-ring rounded font-medium text-ink underline-offset-2 hover:underline"
              >
                {contact.phone}
              </a>
              , or visit our{" "}
              <Link
                href="/contact"
                className="focus-ring rounded font-medium text-ink underline-offset-2 hover:underline"
              >
                quote page
              </Link>
              .
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}

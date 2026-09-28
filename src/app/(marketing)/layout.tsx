import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import JsonLd from "@/components/JsonLd";
import PageTransition from "@/components/PageTransition";
import {
  getPublishedContactInfo,
  getPublishedFaqs,
  getPublishedFenceTypes,
  getPublishedFencingOptionsNav,
  getPublishedFooterLinks,
  getPublishedLegalLinks,
  getPublishedNavLinks,
  getPublishedServiceTowns,
  getPublishedServices,
} from "@/lib/cms/public";
import { localBusinessJsonLd, websiteJsonLd } from "@/lib/jsonld";

export const dynamic = "force-dynamic";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const contact = getPublishedContactInfo();
  const navLinks = getPublishedNavLinks();
  const footerLinks = getPublishedFooterLinks();
  const fencingOptionsNav = getPublishedFencingOptionsNav();
  const legalLinks = getPublishedLegalLinks();
  const towns = getPublishedServiceTowns();

  const chatCatalog = {
    faqs: getPublishedFaqs(),
    fencingServices: getPublishedFenceTypes().map((f) => ({
      slug: f.slug,
      title: f.title,
      details: f.details,
    })),
    deckServices: getPublishedServices().map((s) => ({
      slug: s.slug,
      title: s.title,
      details: s.details,
    })),
    contact: {
      phone: contact.phone,
      phoneHref: contact.phoneHref,
      email: contact.email,
      serviceArea: contact.serviceArea,
      hoursLine: `${contact.hours.weekdays}; ${contact.hours.saturday}; ${contact.hours.sunday}`,
    },
  };

  return (
    <>
      <JsonLd
        data={[
          localBusinessJsonLd({
            towns,
            contact,
          }),
          websiteJsonLd(),
        ]}
      />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-bronze focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-navy focus:shadow-lg"
      >
        Skip to content
      </a>
      <Header
        navLinks={navLinks}
        fencingOptionsNav={fencingOptionsNav}
        contact={contact}
      />
      <main id="main" className="flex-1" tabIndex={-1}>
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer
        navLinks={navLinks}
        footerLinks={footerLinks}
        fencingOptionsNav={fencingOptionsNav}
        legalLinks={legalLinks}
        contact={contact}
      />
      <ChatWidget catalog={chatCatalog} />
    </>
  );
}

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import JsonLd from "@/components/JsonLd";
import PageTransition from "@/components/PageTransition";
import {
  getPublishedFaqs,
  getPublishedFenceTypes,
  getPublishedServices,
} from "@/lib/cms/public";
import { localBusinessJsonLd, websiteJsonLd } from "@/lib/jsonld";

export const dynamic = "force-dynamic";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
  };

  return (
    <>
      <JsonLd data={[localBusinessJsonLd(), websiteJsonLd()]} />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-bronze focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-navy focus:shadow-lg"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1" tabIndex={-1}>
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <ChatWidget catalog={chatCatalog} />
    </>
  );
}

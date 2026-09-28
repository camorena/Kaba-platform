import type { PublishedContactInfo, PublishedServiceTown } from "@/lib/cms/types";
import { absoluteUrl, faqs as siteFaqs, siteConfig, siteUrl } from "@/lib/site";

type JsonLd = Record<string, unknown>;

export type LocalBusinessJsonLdOptions = {
  towns?: readonly PublishedServiceTown[];
  contact?: PublishedContactInfo;
  brand?: { name: string; description: string };
};

export type WebsiteJsonLdOptions = {
  name?: string;
  description?: string;
};

/**
 * LocalBusiness JSON-LD. When published service-area towns are provided,
 * areaServed is built from those town names (+ GeoCircle blurb). Otherwise
 * falls back to the historic hardcoded Triangle list.
 */
export function localBusinessJsonLd(
  options: LocalBusinessJsonLdOptions = {},
): JsonLd {
  const contact = options.contact;
  const phone = contact?.phone ?? siteConfig.phone;
  const email = contact?.email ?? siteConfig.email;
  const serviceArea = contact?.serviceArea ?? siteConfig.serviceArea;
  const name = options.brand?.name ?? siteConfig.name;
  const description = options.brand?.description ?? siteConfig.description;
  const addressCity = contact?.address.city ?? siteConfig.address.city;
  const addressState = contact?.address.state ?? siteConfig.address.state;
  const addressZip = contact?.address.zip ?? siteConfig.address.zip;

  const towns = options.towns?.filter((t) => t.name.trim().length > 0) ?? [];
  const areaServed: Record<string, unknown>[] =
    towns.length > 0
      ? [
          ...towns.map((t) => ({ "@type": "City", name: t.name })),
          ...Array.from(
            new Set(
              towns
                .map((t) => t.region.trim())
                .filter((r) => r.length > 0),
            ),
          ).map((region) => ({
            "@type": "AdministrativeArea",
            name: region,
          })),
          {
            "@type": "GeoCircle",
            description: serviceArea,
          },
        ]
      : [
          { "@type": "City", name: "Raleigh" },
          { "@type": "City", name: "Apex" },
          { "@type": "City", name: "Holly Springs" },
          { "@type": "City", name: "Cary" },
          { "@type": "AdministrativeArea", name: "Wake County" },
          {
            "@type": "GeoCircle",
            description: serviceArea,
          },
        ];

  return {
    "@context": "https://schema.org",
    "@type": ["HomeAndConstructionBusiness", "LocalBusiness"],
    "@id": `${siteUrl}/#business`,
    name,
    description,
    url: siteUrl,
    telephone: phone,
    email,
    image: absoluteUrl("/brand/kaba-fence-logo.png"),
    logo: absoluteUrl("/brand/kaba-fence-logo.png"),
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: addressCity,
      addressRegion: addressState,
      postalCode: addressZip,
      addressCountry: "US",
    },
    areaServed,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
    ],
    knowsAbout: [
      "Fence installation",
      "Fence repair",
      "Wood fencing",
      "Vinyl fencing",
      "Chain-link fencing",
      "Aluminum fencing",
      "Residential fencing",
      "Commercial fencing",
    ],
  };
}

export function websiteJsonLd(options: WebsiteJsonLdOptions = {}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: options.name ?? siteConfig.name,
    url: siteUrl,
    description: options.description ?? siteConfig.description,
    publisher: { "@id": `${siteUrl}/#business` },
    inLanguage: "en-US",
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqPageJsonLd(
  items: readonly { question: string; answer: string }[] = siteFaqs,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

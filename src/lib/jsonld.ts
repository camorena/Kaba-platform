import type { PublishedContactInfo, PublishedServiceTown } from "@/lib/cms/types";
import { absoluteUrl, faqs as siteFaqs, siteConfig, siteUrl } from "@/lib/site";

type JsonLd = Record<string, unknown>;

/** Approximate center of Angier, NC (home base; not a street address). */
const businessGeo = {
  latitude: 35.5071,
  longitude: -78.7392,
} as const;

/** Verified third-party profiles for this business (Nextdoor listing, phone matches). */
const businessSameAs = [
  "https://nextdoor.com/pages/kaba-fence-llc-wilmington-nc/",
] as const;

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

  // Angier is home base: always list it first in areaServed.
  const towns = [...(options.towns ?? [])]
    .filter((t) => t.name.trim().length > 0)
    .sort(
      (a, b) =>
        Number(b.name.trim().toLowerCase() === "angier") -
        Number(a.name.trim().toLowerCase() === "angier"),
    );
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
          { "@type": "City", name: "Angier" },
          { "@type": "City", name: "Raleigh" },
          { "@type": "City", name: "Fuquay-Varina" },
          { "@type": "City", name: "Holly Springs" },
          { "@type": "City", name: "Apex" },
          { "@type": "City", name: "Cary" },
          { "@type": "AdministrativeArea", name: "Harnett County" },
          { "@type": "AdministrativeArea", name: "Wake County" },
          { "@type": "AdministrativeArea", name: "Johnston County" },
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
    // Service-area business: no street address published.
    address: {
      "@type": "PostalAddress",
      addressLocality: addressCity,
      addressRegion: addressState,
      ...(addressZip ? { postalCode: addressZip } : {}),
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: businessGeo.latitude,
      longitude: businessGeo.longitude,
    },
    sameAs: [...businessSameAs],
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

export type ReviewJsonLdInput = {
  customerName: string;
  rating: number;
  body: string;
  reviewDate: string;
};

/**
 * AggregateRating + Review for the business node (same @id as
 * localBusinessJsonLd, so crawlers merge them). Only call with real,
 * published reviews — returns null when there are none.
 */
export function reviewsJsonLd(
  reviews: ReadonlyArray<ReviewJsonLdInput>,
  brandName: string,
): JsonLd | null {
  if (!reviews.length) return null;
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  return {
    "@context": "https://schema.org",
    "@type": ["HomeAndConstructionBusiness", "LocalBusiness"],
    "@id": `${siteUrl}/#business`,
    name: brandName,
    url: siteUrl,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: Number(avg.toFixed(2)),
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1,
    },
    review: reviews.slice(0, 50).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.customerName },
      datePublished: r.reviewDate,
      reviewBody: r.body,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
    })),
  };
}

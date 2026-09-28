import { absoluteUrl, faqs as siteFaqs, siteConfig, siteUrl } from "@/lib/site";

type JsonLd = Record<string, unknown>;

export function localBusinessJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": ["HomeAndConstructionBusiness", "LocalBusiness"],
    "@id": `${siteUrl}/#business`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteUrl,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    image: absoluteUrl("/brand/kaba-fence-logo.png"),
    logo: absoluteUrl("/brand/kaba-fence-logo.png"),
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.state,
      postalCode: siteConfig.address.zip,
      addressCountry: "US",
    },
    areaServed: [
      { "@type": "City", name: "Raleigh" },
      { "@type": "City", name: "Apex" },
      { "@type": "City", name: "Holly Springs" },
      { "@type": "City", name: "Cary" },
      { "@type": "AdministrativeArea", name: "Wake County" },
      {
        "@type": "GeoCircle",
        description: siteConfig.serviceArea,
      },
    ],
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

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: siteConfig.name,
    url: siteUrl,
    description: siteConfig.description,
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

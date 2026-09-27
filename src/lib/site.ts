export const siteConfig = {
  name: "Kaba Fence",
  tagline: "Fence & Deck Repair and Installation",
  description:
    "Kaba Fence builds and repairs fences and decks for homeowners in Angier, Raleigh, and surrounding North Carolina communities.",
  serviceArea:
    "Angier, Raleigh, Fuquay-Varina, Clayton, Holly Springs, and surrounding communities",
  phone: "(919) 555-0147",
  phoneHref: "tel:+19195550147",
  email: "hello@kabafence.com",
  emailHref: "mailto:hello@kabafence.com",
  hours: {
    weekdays: "Monday – Friday: 8:00 AM – 5:00 PM",
    saturday: "Saturday: By appointment",
    sunday: "Sunday: Closed",
  },
  address: {
    city: "Angier",
    state: "NC",
    zip: "27501",
    region: "Serving Angier, Raleigh & surrounding communities",
  },
} as const;

/** Primary header + footer nav (kept lean for mobile). */
export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/reviews", label: "Reviews" },
  { href: "/materials", label: "Materials" },
  { href: "/quote", label: "Quote" },
] as const;

/** Secondary links — footer (+ optional secondary surfaces). */
export const footerLinks = [
  { href: "/service-area", label: "Service area" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/faq", label: "FAQ" },
] as const;

export const fencingServices = [
  {
    slug: "wood",
    title: "Wood Fencing",
    summary:
      "Classic privacy and picket fences built with quality lumber for lasting curb appeal.",
    details:
      "From cedar privacy panels to traditional picket styles, we install and repair wood fences that stand up to Carolina weather and look great for years.",
  },
  {
    slug: "vinyl",
    title: "Vinyl Fencing",
    summary:
      "Low-maintenance vinyl that keeps its color and never needs staining or painting.",
    details:
      "Ideal for busy homeowners who want privacy and style without the upkeep. Available in white, tan, and other popular finishes.",
  },
  {
    slug: "chain-link",
    title: "Chain-Link Fencing",
    summary:
      "Durable, affordable security fencing for yards, pets, and commercial lots.",
    details:
      "Galvanized and vinyl-coated options. Great for pet containment, sports courts, and secure perimeters.",
  },
  {
    slug: "aluminum",
    title: "Aluminum & Ornamental",
    summary:
      "Elegant, rust-resistant aluminum that adds security without blocking the view.",
    details:
      "Ornamental aluminum and iron-look styles that elevate your property while keeping kids and pets safely inside.",
  },
  {
    slug: "privacy",
    title: "Privacy Fencing",
    summary:
      "Solid panels that create a private outdoor space for your family.",
    details:
      "Wood, vinyl, or composite privacy systems sized and styled for Angier and Raleigh-area homes.",
  },
] as const;

export const deckServices = [
  {
    slug: "repair",
    title: "Deck Repair",
    summary:
      "Fix loose boards, wobbly railings, and weather damage before they become safety issues.",
    details:
      "We inspect, reinforce, and restore decks so you can enjoy your outdoor space with confidence.",
  },
  {
    slug: "rebuild",
    title: "Deck Rebuilds",
    summary:
      "Full rebuilds when your structure has reached the end of its safe life.",
    details:
      "We carefully remove the old deck and rebuild to current code with stronger framing and better materials.",
  },
  {
    slug: "new-builds",
    title: "New Deck Builds",
    summary:
      "Custom decks designed around how you live—entertaining, grilling, or quiet evenings.",
    details:
      "Pressure-treated, cedar, and composite options with layouts tailored to your home and yard.",
  },
  {
    slug: "railings",
    title: "Railings & Stairs",
    summary:
      "Safe, code-compliant railings and stair systems that match your deck style.",
    details:
      "Wood, aluminum, and cable railing upgrades that improve safety and finish the look.",
  },
] as const;

export const galleryProjects = [
  {
    id: "cedar-privacy",
    title: "Cedar Privacy Fence — Raleigh",
    category: "fence" as const,
    image: "/gallery/cedar-privacy.jpg",
    caption: "Cedar privacy fence — Raleigh",
    beforeImage: "/gallery/before/cedar-privacy.jpg",
    beforeCaption: "Tired, uneven privacy line before replacement",
  },
  {
    id: "vinyl-privacy",
    title: "White Vinyl Privacy — Angier",
    category: "fence" as const,
    image: "/gallery/vinyl-privacy.jpg",
    caption: "White vinyl privacy — Angier",
    beforeImage: "/gallery/before/vinyl-privacy.jpg",
    beforeCaption: "Dated wood run prior to low-maintenance vinyl",
  },
  {
    id: "aluminum-ornamental",
    title: "Aluminum Ornamental — Wake County",
    category: "fence" as const,
    image: "/gallery/aluminum-ornamental.jpg",
    caption: "Aluminum ornamental — Wake County",
  },
  {
    id: "chain-link",
    title: "Chain-Link Enclosure — Raleigh Area",
    category: "fence" as const,
    image: "/gallery/chain-link.jpg",
    caption: "Chain-link enclosure — Raleigh area",
  },
  {
    id: "deck-new-build",
    title: "New Elevated Deck — Angier",
    category: "deck" as const,
    image: "/gallery/deck-new-build.jpg",
    caption: "New elevated deck — Angier",
    beforeImage: "/gallery/before/deck-new-build.jpg",
    beforeCaption: "Worn deck surface before rebuild",
  },
  {
    id: "deck-repair",
    title: "Deck Repair & Railing Refresh — Raleigh",
    category: "deck" as const,
    image: "/gallery/deck-repair.jpg",
    caption: "Deck repair & railing refresh — Raleigh",
  },
] as const;

/** Compact 3-step summary used on home + services. */
export const howItWorks = [
  {
    step: "1",
    title: "Request a Quote",
    description:
      "Tell us about your fence or deck project online or by phone. We serve Angier, Raleigh, and nearby towns.",
  },
  {
    step: "2",
    title: "On-Site Estimate",
    description:
      "We visit your property, measure carefully, discuss materials and styles, and give you a clear written estimate.",
  },
  {
    step: "3",
    title: "Build & Finish",
    description:
      "Our crew installs or repairs your project on schedule, cleans up the job site, and walks you through the finished work.",
  },
] as const;

/** Full process timeline for /how-it-works. */
export const processTimeline = [
  {
    step: "01",
    title: "Estimate",
    eyebrow: "Free on-site visit",
    description:
      "Share your goals online or by phone. We schedule a free visit, measure carefully, and deliver a clear written estimate with material options that fit Angier and Raleigh homes.",
  },
  {
    step: "02",
    title: "Design",
    eyebrow: "Materials & layout",
    description:
      "Together we lock in style, height, gates, and finishes—wood, vinyl, chain-link, aluminum, or deck systems—plus any HOA or permit considerations for your neighborhood.",
  },
  {
    step: "03",
    title: "Build",
    eyebrow: "Crafted on schedule",
    description:
      "Our local crew installs or repairs on the agreed timeline. We protect landscaping, set posts and framing properly, and keep the job site organized every day.",
  },
  {
    step: "04",
    title: "Walkthrough",
    eyebrow: "Clean finish",
    description:
      "We walk the finished fence or deck with you, adjust gates and hardware, haul debris, and make sure everything feels solid before we leave.",
  },
] as const;

export const trustPoints = [
  { label: "Local to Angier & Raleigh" },
  { label: "Free On-Site Estimates" },
  { label: "Quality Materials" },
  { label: "Clean Job Sites" },
] as const;

export const companyValues = [
  {
    title: "Local & accountable",
    description:
      "We’re based in Angier and work across the Raleigh area. When you call, you’re talking to the crew that shows up—not a national call center.",
  },
  {
    title: "Clear estimates",
    description:
      "Written quotes with materials, scope, and timeline spelled out. No vague ranges, no surprise line items after the posts are set.",
  },
  {
    title: "Built for Carolina weather",
    description:
      "We specify lumber, fasteners, and finishes that hold up to heat, humidity, and storms—so your fence or deck lasts.",
  },
  {
    title: "Job sites left clean",
    description:
      "Cut-offs hauled, lawn protected, gates swinging true. Neighbors should notice the new fence—not the mess.",
  },
] as const;

export const serviceTowns = [
  {
    name: "Angier",
    region: "Harnett County",
    note: "Home base — fence installs, deck rebuilds, and repairs across town and nearby rural lots.",
  },
  {
    name: "Raleigh",
    region: "Wake County",
    note: "Privacy fences, ornamental aluminum, and deck projects for in-town and suburban homes.",
  },
  {
    name: "Fuquay-Varina",
    region: "Wake County",
    note: "New builds and replacements for growing neighborhoods and larger backyard lots.",
  },
  {
    name: "Holly Springs",
    region: "Wake County",
    note: "HOA-friendly vinyl and wood privacy systems, plus deck rail and stair upgrades.",
  },
  {
    name: "Clayton",
    region: "Johnston County",
    note: "Chain-link, wood privacy, and deck repair for homes east of Raleigh.",
  },
  {
    name: "Garner",
    region: "Wake County",
    note: "Fence replacements and deck refreshes for established neighborhoods.",
  },
  {
    name: "Cary",
    region: "Wake County",
    note: "Select ornamental and privacy projects where schedule and access allow.",
  },
  {
    name: "Apex",
    region: "Wake County",
    note: "Wood and vinyl fencing with clean installs for suburban yards.",
  },
  {
    name: "Dunn",
    region: "Harnett County",
    note: "Rural and in-town fence lines, pet enclosures, and deck repairs.",
  },
  {
    name: "Lillington",
    region: "Harnett County",
    note: "Fence and deck work for Harnett County homeowners south of Angier.",
  },
  {
    name: "Knightdale",
    region: "Wake County",
    note: "Privacy and chain-link installs for east Wake communities.",
  },
  {
    name: "Wake Forest",
    region: "Wake County",
    note: "Select projects in northern Wake—ask us about current scheduling.",
  },
] as const;

export const testimonials = [
  {
    quote:
      "Kaba Fence replaced our tired backyard fence in two days and left the yard spotless. The new cedar looks fantastic.",
    name: "Megan R.",
    town: "Fuquay-Varina",
  },
  {
    quote:
      "They repaired our deck stairs and railing quickly, explained every step, and made the whole process easy.",
    name: "Chris & Dana P.",
    town: "Holly Springs",
  },
  {
    quote:
      "From the first estimate to the final gate adjustment, the crew was on time, thoughtful, and dependable.",
    name: "Laura T.",
    town: "Clayton",
  },
  {
    quote:
      "We needed vinyl privacy that would pass HOA review. Kaba walked us through options, got it approved, and installed it cleanly.",
    name: "Jordan M.",
    town: "Cary",
  },
  {
    quote:
      "Storm damage took out a section of our fence. They matched the existing panels and had us secure again within the week.",
    name: "Pat & Elena S.",
    town: "Angier",
  },
  {
    quote:
      "Our new elevated deck feels solid and the railings look sharp. Clear quote, steady communication, no drama.",
    name: "Marcus W.",
    town: "Raleigh",
  },
] as const;

export const faqs = [
  {
    question: "How long does a typical fence installation take?",
    answer:
      "Most residential fence projects wrap up in one to three days once materials are on site. Longer runs, steep grades, or HOA review can add time. We'll give you a clear schedule with your written estimate.",
  },
  {
    question: "Do you handle permits and HOA approvals?",
    answer:
      "We help you understand local permit and HOA requirements for Angier, Raleigh, and nearby towns. When a permit is needed, we'll guide the paperwork and build to the approved plan.",
  },
  {
    question: "What materials hold up best in North Carolina weather?",
    answer:
      "Cedar and pressure-treated wood, vinyl, and powder-coated aluminum all perform well here. The right choice depends on privacy goals, budget, and how much maintenance you want. We'll walk you through options on site.",
  },
  {
    question: "Can you repair an existing deck instead of replacing it?",
    answer:
      "Often yes. We inspect framing, joists, boards, and railings first. If the structure is sound, targeted repairs and railing upgrades can restore safety and look without a full rebuild.",
  },
  {
    question: "What towns do you serve?",
    answer:
      "We’re based in Angier and regularly work in Raleigh, Fuquay-Varina, Holly Springs, Clayton, Garner, Cary, Apex, Dunn, Lillington, Knightdale, Wake Forest, and nearby communities. If you’re close and unsure, call—we’ll let you know.",
  },
  {
    question: "Is the estimate really free?",
    answer:
      "Yes. On-site estimates for residential fence and deck projects are free and no-obligation. You’ll leave with a written scope and price so you can decide on your timeline.",
  },
  {
    question: "How do I prepare for install day?",
    answer:
      "Clear access along the fence or deck line when you can, note underground utilities we’ve already marked through 811, and let us know about pets or locked gates. We’ll confirm details before we arrive.",
  },
  {
    question: "Do you build gates and hardware upgrades?",
    answer:
      "Absolutely. New gates, latch and hinge upgrades, and walk-through or driveway openings are part of many fence projects—and we can add them to an existing fence when it makes sense.",
  },
] as const;

/** Canonical production origin (metadataBase, sitemap, JSON-LD, analytics). */
export const siteUrl = "https://kaba-fence.vercel.app";

/** Absolute URL helper for sitemap / JSON-LD. */
export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") return siteUrl;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/** All public indexable routes for sitemap. */
export const sitemapRoutes = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/services", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/gallery", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/about", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/reviews", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/quote", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/service-area", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/how-it-works", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/materials", changeFrequency: "monthly" as const, priority: 0.75 },
  { path: "/faq", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly" as const, priority: 0.3 },
] as const;



/** Default Open Graph / Twitter image used across marketing pages. */
export const defaultOgImage = {
  url: "/gallery/cedar-privacy.jpg",
  width: 1280,
  height: 720,
  alt: "Cedar privacy fence installation by Kaba Fence",
} as const;

/** Fence & deck materials guide for /materials. */
export const fenceMaterials = [
  {
    id: "cedar",
    name: "Cedar",
    bestFor: "Privacy, picket, and warm curb appeal",
    lifespan: "15–25 years with care",
    maintenance: "Periodic cleaning; seal or stain every few years",
    pros: ["Natural look", "Insect & rot resistance", "Takes stain beautifully"],
    cons: ["Higher lumber cost", "Needs occasional finish work"],
    tip: "Ideal for Raleigh and Angier yards that want classic wood privacy without going full pressure-treated look.",
  },
  {
    id: "pressure-treated",
    name: "Pressure-treated pine",
    bestFor: "Budget-friendly privacy and farm-style runs",
    lifespan: "10–20 years depending on grade & care",
    maintenance: "Let dry, then seal; watch for warping early on",
    pros: ["Affordable", "Widely available", "Strong for posts & panels"],
    cons: ["Can warp/check while drying", "Less premium look than cedar"],
    tip: "Great workhorse material when we size posts correctly and leave room for Carolina humidity.",
  },
  {
    id: "vinyl",
    name: "Vinyl",
    bestFor: "HOA neighborhoods and low-maintenance privacy",
    lifespan: "20–30+ years",
    maintenance: "Occasional rinse; no staining or painting",
    pros: ["Color-stable", "Easy clean", "Consistent panel look"],
    cons: ["Higher upfront cost", "Can look plastic if poorly specified"],
    tip: "We specify thicker walls and proper posts so panels stay straight through summer heat.",
  },
  {
    id: "aluminum",
    name: "Aluminum / ornamental",
    bestFor: "View-preserving security and front-yard elegance",
    lifespan: "25–40+ years",
    maintenance: "Rinse occasionally; powder coat resists rust",
    pros: ["Rust-resistant", "Open sight lines", "Pet & pool friendly"],
    cons: ["Not full privacy", "Premium vs. chain-link"],
    tip: "Pair with landscaping for soft privacy without blocking breezes or views.",
  },
  {
    id: "chain-link",
    name: "Chain-link",
    bestFor: "Pets, side yards, and secure perimeters on a budget",
    lifespan: "15–30 years (vinyl-coated lasts longer visually)",
    maintenance: "Check tension & posts after storms",
    pros: ["Affordable", "Fast install", "Durable security"],
    cons: ["Industrial look", "Limited privacy unless slatted"],
    tip: "Vinyl-coated mesh and privacy slats upgrade curb appeal without losing strength.",
  },
] as const;

export const deckMaterials = [
  {
    id: "pt-deck",
    name: "Pressure-treated lumber",
    bestFor: "Value-focused new decks and repairs",
    lifespan: "10–20 years with sealing",
    maintenance: "Clean & reseal regularly; replace boards as needed",
    pros: ["Lowest material cost", "Easy to repair locally", "Strong framing"],
    cons: ["Splits/checks over time", "Needs more upkeep"],
    tip: "We still use PT for most framing—even under composite—because it holds fasteners well in NC soil conditions.",
  },
  {
    id: "cedar-deck",
    name: "Cedar decking",
    bestFor: "Warm natural decks with lighter foot feel",
    lifespan: "15–25 years with care",
    maintenance: "Clean; oil or stain to keep color",
    pros: ["Beautiful grain", "Naturally resistant", "Comfortable underfoot"],
    cons: ["Softer than composite", "Periodic finish work"],
    tip: "Looks especially good with cable or aluminum railings for a clean modern contrast.",
  },
  {
    id: "composite",
    name: "Composite / capped polymer",
    bestFor: "Low-maintenance entertaining decks",
    lifespan: "25–30+ years (brand dependent)",
    maintenance: "Soap-and-water cleaning; no staining",
    pros: ["Fade & stain resistant", "Consistent boards", "Long warranties"],
    cons: ["Higher upfront cost", "Can get warm in full sun"],
    tip: "We help pick colors that hide Carolina pine pollen and hold up to afternoon sun.",
  },
] as const;

export const materialFaqs = [
  {
    question: "Which fence material is best for North Carolina weather?",
    answer:
      "Cedar, quality pressure-treated pine, vinyl, and powder-coated aluminum all perform well here. The right pick depends on privacy goals, budget, and how much maintenance you want. We’ll walk options on site with samples when it helps.",
  },
  {
    question: "Do you help with HOA material requirements?",
    answer:
      "Yes. Many Wake County HOAs prefer certain vinyl colors or wood styles. Share your guidelines early—we’ll quote materials that are more likely to pass review.",
  },
  {
    question: "Can I mix materials—like wood privacy with aluminum gates?",
    answer:
      "Often yes. Mixed systems can look sharp and solve practical needs (wider driveway openings, pool codes). We’ll design hardware and posts so the transition feels intentional.",
  },
] as const;

/** Legal / utility links shown in footer bottom bar. */
export const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

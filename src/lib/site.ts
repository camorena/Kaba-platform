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

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/quote", label: "Get a Quote" },
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
    image: "/gallery/cedar-privacy.png",
    caption: "Cedar privacy fence — Raleigh",
  },
  {
    id: "vinyl-privacy",
    title: "White Vinyl Privacy — Angier",
    category: "fence" as const,
    image: "/gallery/vinyl-privacy.png",
    caption: "White vinyl privacy — Angier",
  },
  {
    id: "aluminum-ornamental",
    title: "Aluminum Ornamental — Wake County",
    category: "fence" as const,
    image: "/gallery/aluminum-ornamental.png",
    caption: "Aluminum ornamental — Wake County",
  },
  {
    id: "chain-link",
    title: "Chain-Link Enclosure — Raleigh Area",
    category: "fence" as const,
    image: "/gallery/chain-link.png",
    caption: "Chain-link enclosure — Raleigh area",
  },
  {
    id: "deck-new-build",
    title: "New Elevated Deck — Angier",
    category: "deck" as const,
    image: "/gallery/deck-new-build.png",
    caption: "New elevated deck — Angier",
  },
  {
    id: "deck-repair",
    title: "Deck Repair & Railing Refresh — Raleigh",
    category: "deck" as const,
    image: "/gallery/deck-repair.png",
    caption: "Deck repair & railing refresh — Raleigh",
  },
] as const;

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

export const trustPoints = [
  { label: "Local to Angier & Raleigh" },
  { label: "Free On-Site Estimates" },
  { label: "Quality Materials" },
  { label: "Clean Job Sites" },
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
] as const;

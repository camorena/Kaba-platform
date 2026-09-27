# Kaba Fence

Public marketing website for **Kaba Fence** — fence and deck repair/install serving Angier, Raleigh NC, and surrounding areas.

Built with **Next.js (App Router)** and **Tailwind CSS**.

## Getting started

```bash
cd kaba-fence
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run build`   | Production build         |
| `npm run start`   | Serve the production build |
| `npm run lint`    | Run ESLint               |

## Pages

| Route           | Purpose                                      |
| --------------- | -------------------------------------------- |
| `/`             | Home — hero, trust strip, services, CTA      |
| `/services`     | Fencing types and deck services              |
| `/gallery`      | Filterable project gallery                   |
| `/quote`        | Contact / free quote form (client-validated) |
| `/about`        | Local crew and values                        |
| `/service-area` | Towns served                                 |
| `/how-it-works` | Process timeline                             |
| `/faq`          | Frequently asked questions                   |
| `/reviews`      | Homeowner testimonials (placeholders)        |
| `/privacy`      | Privacy policy                               |
| `/terms`        | Terms of use                                 |

## Configuration

Business details live in `src/lib/site.ts`:

- Company name, tagline, description
- Service area
- Phone, email (placeholders)
- Hours
- Service and gallery content
- Canonical `siteUrl` used by metadata, sitemap, and JSON-LD

Update those values before handing off to a client.

## Analytics (optional)

Privacy-friendly analytics load by default; **no API keys are required to build or run the site**.

| Variable | Required | Purpose |
| -------- | -------- | ------- |
| _(none)_ | — | `@vercel/analytics` is included and works on Vercel deployments without a paid key (cookieless). |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | No | If set (e.g. `kabafence.com`), loads the Plausible script for that domain. Omit to skip Plausible. |

Neither approach uses advertising cookies, so **no cookie consent banner** is shown.

Example `.env.local`:

```bash
# Optional — only if you use Plausible
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=kabafence.com
```

## SEO & AI discovery

- `src/app/sitemap.ts` → `/sitemap.xml`
- `src/app/robots.ts` → `/robots.txt`
- JSON-LD: `HomeAndConstructionBusiness` / `LocalBusiness`, `WebSite`, `FAQPage` on `/faq`, breadcrumbs on legal + FAQ
- `public/llms.txt` — short business summary for AI crawlers
- `metadataBase` + per-page titles/descriptions/OG/Twitter

Aggregate star ratings are **not** emitted in schema (testimonials are placeholders until verified).

## Notes

- Quote form uses **client-side validation only** and shows a success state on submit — no backend yet.
- Gallery and some review copy may still use placeholders; swap in real assets when available.
- Live URL (Vercel): https://kaba-fence.vercel.app

# Kaba Fence

Public marketing website for **Kaba Fence** — fence and deck repair/install serving Angier, Raleigh NC, and surrounding areas.

Built with **Next.js (App Router)** and **Tailwind CSS**.

Live: https://kaba-fence.vercel.app

## Getting started

```bash
cd kaba-fence
npm install
cp .env.example .env.local   # optional analytics + ADMIN_PASSWORD
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

| Command              | Description |
| -------------------- | ----------- |
| `npm run build`      | Production build (memory adapter; no DB required) |
| `npm run start`      | Serve the production build |
| `npm run lint`       | Run ESLint |
| `npm run db:migrate` | Apply `db/migrations/*.sql` (needs `DATABASE_URL`) |
| `npm run db:seed`    | Apply `db/seeds/*.sql` Angier/Raleigh demo |
| `npm run db:reset`   | Migrate then seed |

## Pages (public)

| Route           | Purpose                                      |
| --------------- | -------------------------------------------- |
| `/`             | Home — hero, trust strip, services, CTA      |
| `/services`     | Fencing types and deck services              |
| `/gallery`      | Filterable project gallery                   |
| `/quote`        | Contact / free quote form                    |
| `/about`        | Local crew and values                        |
| `/service-area` | Towns served                                 |
| `/how-it-works` | Process timeline                             |
| `/faq`          | Frequently asked questions                   |
| `/reviews`      | Homeowner testimonials (placeholders)        |
| `/privacy`      | Privacy policy                               |
| `/terms`        | Terms of use                                 |

Public chrome (header/footer/chat) lives under the `(marketing)` route group. Root `layout.tsx` only handles fonts, theme, and analytics.

## Admin scaffold (`/admin`)

**Status: UI foundation — not production-ready.** Dense admin shell for quotes → invoices → payments. Auth remains a password stub; data is in-memory with clearly labeled demo amounts.

| Route | Purpose |
| ----- | ------- |
| `/admin/login` | Password stub (`ADMIN_PASSWORD`) |
| `/admin` | Dashboard — quote / invoice / payment stats |
| `/admin/quotes` | Search, status filters, inline status changes |
| `/admin/quotes/[id]` | Detail, notes, status UX, create-invoice stub |
| `/admin/invoices` | List + create-from-quote (synthetic demo $) |
| `/admin/invoices/[id]` | Detail, line items, balance, status |
| `/admin/payments` | List + record-payment stub (no Stripe) |
| `/admin/customers` | Derived from quote contacts |
| `/admin/settings` | Auth / env / Stripe docs — honest, not fake security |

### How data flows today

1. Public `/quote` → `POST /api/quotes` → **persist** via repo layer (`KABA_DATA_ADAPTER=memory` default) → **notify** stub (`notifyQuoteCreated`, no-op).
2. Admin `PATCH /api/quotes/[id]` updates status and internal notes.
3. `POST /api/invoices` creates a **draft with synthetic amounts** from a quote.
4. `POST /api/payments` records a stub payment and may mark the invoice partial/paid.

Schema: `db/migrations/0001_ops_foundation.sql`. Seed: `db/seeds/0001_angier_raleigh_demo.sql`. Repos: `src/lib/db/` (Memory* default, Postgres* when `KABA_DATA_ADAPTER=postgres` + `DATABASE_URL`). Optional local DB: `docker compose up -d` then `npm run db:migrate` / `db:seed`. On Vercel cold starts the **memory** lists reset. See `preview/REUSE_PORT_v3.md`. **Stripe is not connected** — see `/admin/settings`.

### Auth warning

`ADMIN_PASSWORD` + httpOnly cookie is a **documented stub**. It is **not** real multi-user auth, MFA, CSRF hardening, or audit logging. Replace with Auth.js/Clerk (or similar) + roles before handling live customer PII. If `ADMIN_PASSWORD` is unset, login is disabled and shows a setup notice.

```bash
# .env.local
ADMIN_PASSWORD=choose-a-long-secret
```

`robots.txt` disallows `/admin` and `/api/`. Admin metadata is `noindex`.

## Configuration

Business details live in `src/lib/site.ts`:

- Company name, tagline, description
- Service area
- Phone, email (placeholders)
- Hours
- Service and gallery content
- Canonical `siteUrl` used by metadata, sitemap, and JSON-LD

## Analytics (optional)

| Variable | Required | Purpose |
| -------- | -------- | ------- |
| _(none)_ | — | `@vercel/analytics` works on Vercel without a paid key (cookieless). |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | No | If set, loads Plausible for that domain. |

## SEO & AI discovery

- `src/app/sitemap.ts` → `/sitemap.xml`
- `src/app/robots.ts` → `/robots.txt`
- JSON-LD on marketing pages
- `public/llms.txt`

## Accessibility / Lighthouse

A Lighthouse pass (mobile + desktop) was run on home, services, gallery, quote, and about. Fixes in this iteration:

- Contrast: darker `--bronze-dark` / `--muted-light` for AA text on cream/white
- Redundant logo `alt` next to visible “Kaba Fence” text → empty alt
- Gallery heading order (`h2` cards) and accessible names (removed incomplete `aria-label`)
- Sticky header height stabilized (less layout churn on scroll)
- Gallery images converted PNG → optimized JPEG (~6× smaller sources)
- Font `display: "swap"` explicit; skip link + focus rings retained

Before/after JSON lives under `preview/lighthouse/`. Screenshots: `preview/a11y-*.png`.

## Still pending (do not treat as done)

- Real contact / crew photos
- Quote CRM email notifications
- Custom domain
- Town SEO landing pages
- Production admin auth + database
- Production invoices/payments (Stripe) + durable DB

## Notes

- Gallery and some review copy may still use placeholders; swap in real assets when available.
- Repo: https://github.com/camorena/Kaba-platform

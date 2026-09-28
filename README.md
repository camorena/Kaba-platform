# Kaba Fence

Public marketing website for **Kaba Fence** — fence and deck repair/install serving Angier, Raleigh NC, and surrounding areas.

Built with **Next.js (App Router)** and **Tailwind CSS**.

Live: https://kaba-platform.vercel.app

Ops / reuse notes: `preview/REUSE_PORT_v18.md` (Stripe deposits + webhooks + mail launch), `preview/CMS_PUBLIC_CONTENT_PLAN.md` (public content admin roadmap).


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
| `/pay/[token]`  | Customer invoice deposit (tokenized; no admin cookie) |

Public chrome (header/footer/chat) lives under the `(marketing)` route group. Root `layout.tsx` only handles fonts, theme, and analytics. Pay links use a slim branded layout (no chat).

## Admin scaffold (`/admin`)

**Status: UI foundation — not production-ready.** Dense admin shell for quotes → invoices → payments. Auth remains a password stub; data is in-memory with clearly labeled demo amounts.

| Route | Purpose |
| ----- | ------- |
| `/admin/login` | Stub (`ADMIN_PASSWORD`) or credentials (`AUTH_SECRET` + profiles) |
| `/admin` | Dashboard — quote / invoice / payment stats |
| `/admin/quotes` | Search, status filters, inline status changes |
| `/admin/quotes/[id]` | Detail, notes, status UX, create-invoice stub |
| `/admin/invoices` | List + create-from-quote (synthetic demo $) |
| `/admin/invoices/[id]` | Detail, line items, balance, copy/share pay link, Stripe deposit |
| `/admin/payments` | List + record payment; Stripe Checkout when keys set |
| `/admin/customers` | Derived from quote contacts |
| `/admin/settings` | Live auth mode, trust claims, Stripe status (Platform) |

### How data flows today

1. Public `/quote` → `POST /api/quotes` → **persist** via repo layer (`KABA_DATA_ADAPTER=memory` default) → **notify** stub (`notifyQuoteCreated`, no-op).
2. Admin `PATCH /api/quotes/[id]` updates status and internal notes.
3. `POST /api/invoices` creates a **draft with synthetic amounts** from a quote.
4. `POST /api/payments` records a stub payment and may mark the invoice partial/paid.

Schema: `db/migrations/0001_ops_foundation.sql` (+ `0003_stripe`, `0004_pay_token`). Seed: `db/seeds/0001_angier_raleigh_demo.sql`. Repos: `src/lib/db/` (Memory* default, Postgres* when `KABA_DATA_ADAPTER=postgres` + `DATABASE_URL`). Optional local DB: `docker compose up -d` then `npm run db:migrate` / `db:seed`. On Vercel cold starts the **memory** lists reset. See `preview/REUSE_PORT_v6.md` and production flip `preview/REUSE_PORT_v17.md`. Stripe is optional — without keys the UI says **not connected**; with test keys admin or the customer pay link can open Checkout for a deposit; webhook records the payment.

### Auth (dual mode)

| Mode | Env | Sign-in |
|------|-----|---------|
| **stub** (default) | `ADMIN_PASSWORD` | Shared password cookie |
| **credentials** | `AUTH_SECRET` set | Email/password vs `profiles.role` |

Stub is **not** production auth. Credentials mode loads role from `profiles` on every request (HMAC session). See `preview/REUSE_PORT_v4.md`.

```bash
# .env.local — stub (default)
ADMIN_PASSWORD=choose-a-long-secret

# Optional — credentials mode (demo owner after seed / memory):
# AUTH_SECRET=$(openssl rand -base64 32)
# owner@kabafence.example / change-me-owner
```

`robots.txt` disallows `/admin`, `/api/`, and `/pay`. Admin and pay metadata are `noindex`.

## Configuration

Business details live in `src/lib/site.ts`:

- Company name, tagline, description
- Service area
- Phone, email (placeholders)
- Hours
- Service and gallery content
- Canonical `siteUrl` used by metadata, sitemap, and JSON-LD

## Stripe (optional — code ready)

| Variable | Required | Purpose |
| -------- | -------- | ------- |
| `STRIPE_SECRET_KEY` | For Checkout | Create Checkout Sessions (`sk_test_…` / `sk_live_…`) |
| `STRIPE_WEBHOOK_SECRET` | For webhook | Verify `POST /api/stripe/webhook` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Recommended | Documented / future Elements |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical origin for Checkout return URLs (`https://kaba-platform.vercel.app`) |

Without keys the build and Payments UI stay honest (“not connected”); `/pay/[token]` shows an offline message instead of a fake card form. No live charges unless you set live keys.

**Webhook URL (Stripe Dashboard):** `https://kaba-platform.vercel.app/api/stripe/webhook` (event: `checkout.session.completed`).

**Demo pay link:** `/pay/kf_pay_demo_1002_chris` (seed token). Full launch steps: `preview/REUSE_PORT_v18.md`.

## Mail (optional)

| Variable | Required | Purpose |
| -------- | -------- | ------- |
| `MAIL_FROM` | For send | From: address |
| `RESEND_API_KEY` | Prefer | Resend HTTP API |
| `MAIL_TO_OWNERS` | Optional | Owner alert recipients (else site email) |
| `SMTP_HOST` (+ port/user/pass/secure) | Alt | Used when Resend unset |

`notifyQuoteCreated` / `notifyPaymentReceived` are honest no-ops until mail is configured. See `preview/REUSE_PORT_v7.md` / `v18.md`.

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
- Paste Stripe keys + register webhook (code path is ready — see v18)
- Paste Resend/SMTP + `MAIL_FROM` for receipt/owner email
- Custom domain
- Town SEO landing pages
- Rotate demo owner password before treating credentials auth as production-hardened

## Notes

- Gallery and some review copy may still use placeholders; swap in real assets when available.
- Repo: https://github.com/camorena/Kaba-platform

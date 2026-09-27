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

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run build`   | Production build         |
| `npm run start`   | Serve the production build |
| `npm run lint`    | Run ESLint               |

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

**Status: foundation only — not production-ready.**

| Route              | Status |
| ------------------ | ------ |
| `/admin/login`     | Password stub (env `ADMIN_PASSWORD`) |
| `/admin`           | Dashboard overview (quote counts) |
| `/admin/quotes`    | List + status updates; wired to mock/in-memory store |
| `/admin/invoices`  | Placeholder |
| `/admin/payments`  | Placeholder |

### How quotes flow today

1. Public `/quote` form validates client-side, then `POST /api/quotes`.
2. Records land in an **in-memory store** (`src/lib/admin/quotes-store.ts`) with seed demo rows.
3. Authenticated admin can `GET /api/quotes` and `PATCH /api/quotes/[id]` for status.

On serverless (Vercel) cold starts the in-memory list resets — swap for a real DB before relying on this for leads.

### Auth warning

`ADMIN_PASSWORD` + httpOnly cookie is a **documented stub** so the shell can be gated while building UI. It is **not** real multi-user auth, MFA, CSRF hardening, or audit logging. Replace with Auth.js/Clerk (or similar) + roles before handling live customer PII. If `ADMIN_PASSWORD` is unset, login is disabled and shows a setup notice.

```bash
# .env.local
ADMIN_PASSWORD=choose-a-long-secret
```

`robots.txt` disallows `/admin` and `/api/`.

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
- Invoices & payments (Stripe etc.)

## Notes

- Gallery and some review copy may still use placeholders; swap in real assets when available.
- Repo: https://github.com/camorena/Kaba-platform

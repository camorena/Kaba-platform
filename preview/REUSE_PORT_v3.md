# Reuse port v3 — Postgres adapter + Angier/Raleigh seed

**Date:** 2026-09-28 (America/Chicago)  
**Target:** [camorena/Kaba-platform](https://github.com/camorena/Kaba-platform) (`/workspace/kaba-fence`)  
**Prior:** `preview/REUSE_PORT_v2.md` (schema draft + Memory* repos)

---

## Shipped this pass

1. **Postgres repos** — `src/lib/db/postgres/`  
   Connection pool (`pg`), mappers, and full `Quotes` / `Invoices` / `Payments` / `Customers` / `TrustClaims` implementations behind the same `DataRepos` interfaces. Lazy-loaded only when `KABA_DATA_ADAPTER=postgres`.

2. **Adapter flip** — `KABA_DATA_ADAPTER=memory` (default) | `postgres`  
   `DATABASE_URL` required only for postgres. Builds and demos never need a live DB.

3. **Migrate + seed scripts**  
   - `npm run db:migrate` → applies `db/migrations/*.sql` (tracks `schema_migrations`)  
   - `npm run db:seed` → applies `db/seeds/*.sql`  
   - `npm run db:reset` → migrate then seed  
   Seed: `db/seeds/0001_angier_raleigh_demo.sql` — Angier / Raleigh NC fencing demo (customers, quotes with gone-quiet ages, notes, invoices, lines, payments, trust `site_settings`).

4. **Optional Docker Postgres** — `docker-compose.yml` (`postgres:17-alpine`, user/db `kaba` / `kaba_fence`).

5. **Settings UI** — Platform → Data stores shows live adapter name + whether `DATABASE_URL` is configured (EN + ES). Auth stub / DAL notes unchanged.

6. **Shared helpers** — `src/lib/db/quiet.ts`, `demo-amounts.ts` used by Memory* and Postgres*.

---

## How to migrate + seed locally

```bash
# Option A — Docker
docker compose up -d

# Option B — any Postgres 15+ with a database + user
# CREATE USER kaba WITH PASSWORD 'kaba' SUPERUSER;
# CREATE DATABASE kaba_fence OWNER kaba;

export DATABASE_URL=postgres://kaba:kaba@127.0.0.1:5432/kaba_fence
npm run db:migrate
npm run db:seed

# Point the app at Postgres (restart next after .env.local change)
# KABA_DATA_ADAPTER=postgres
# DATABASE_URL=postgres://kaba:kaba@127.0.0.1:5432/kaba_fence
```

Memory remains default — omit those env vars for demos and CI builds.

### Sample seed counts (typical)

| Entity        | Count | Notes |
|---------------|------:|-------|
| customers     |    10 | Angier, Raleigh, Cary, Apex, … |
| quotes        |    12 | Includes gone-quiet (≥3d stale new/contacted/scheduled) |
| quote_notes   |     8 | Append-only ops history |
| invoices      |     5 | draft / sent / partial / paid / void |
| invoice_lines |     6 | Synthetic demo \$ only |
| payments      |     3 | Stub ledger (check / ACH / card) |
| quiet quotes  |   ~6  | Dashboard “gone quiet” filter |

Exact quiet count depends on wall clock vs `updated_at` ages in the seed.

---

## Auth / DAL (unchanged)

- `ADMIN_PASSWORD` cookie stub still the only sign-in path.  
- `getCurrentAdmin()` → `SessionAdmin` with `stub: true`, role `owner`.  
- Settings → Security documents owner / editor / viewer roadmap; no fake multi-user.

---

## Explicitly next

| Item | Why later |
|------|-----------|
| **Real Stripe** | Checkout / Payment Intents / webhooks |
| **Real auth** | Auth.js/Clerk/Supabase; load role from `profiles` |
| **Trust save API** | Settings still uses localStorage client stub; server `site_settings` is ready |
| **Notify mail** | Wire `notifyQuoteCreated`; drain `notified_at IS NULL` |
| **CMS / LLM chatbot** | Still out of scope |

---

## Non-goals (still)

- Required cloud DB for `npm run build`  
- Fake multi-user accounts  
- Stripe keys live in this pass  

See also: `preview/REUSE_PORT_v1.md`, `preview/REUSE_PORT_v2.md`, `preview/PRIOR_KABA_FENCE_REPO_REVIEW.md`.

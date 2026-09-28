# Reuse port v2 — durable persistence foundation + auth path

**Date:** 2026-09-28 (America/Chicago)  
**Target:** [camorena/Kaba-platform](https://github.com/camorena/Kaba-platform) (`/workspace/kaba-fence`)  
**Prior pass:** `preview/REUSE_PORT_v1.md` (gone quiet, launch blockers, trust claims stub, DAL skeleton)

---

## Shipped this pass

1. **Schema draft** — `db/migrations/0001_ops_foundation.sql`  
   Quotes, quote_notes, invoices, invoice_lines, payments, customers, site_settings (trust claims), profiles + app_role enums. Persist-then-notify columns (`notified_at`, `notify_attempts`) on quotes. Not applied automatically.

2. **Repo layer** — `src/lib/db/`  
   - Domain types (`types.ts`) aligned with the SQL draft  
   - Interfaces: `QuotesRepo`, `InvoicesRepo`, `PaymentsRepo`, `CustomersRepo`, `TrustClaimsRepo`  
   - `Memory*` implementations (default)  
   - Adapter: `KABA_DATA_ADAPTER=memory` (default) | `postgres` (throws until implemented)  
   - Facades: `quotes-store.ts` / `invoices-store.ts` / `payments-store.ts` still work for existing UI

3. **Persist-then-notify stub** — `POST /api/quotes`  
   Saves the quote first, then calls `notifyQuoteCreated` (no-op with clear TODO). Records `notifyAttempts` / `notifiedAt`. Mail failure never drops the lead.

4. **Auth DAL next step** — `dal.ts`  
   Clearer `SessionAdmin` contract (`stub`, `resolvedAt`), role descriptions, `getAdminRolesDoc()` from optional `ADMIN_ROLES_DOC`. ADMIN_PASSWORD stub unchanged. Settings → Security shows owner/editor/viewer roadmap (no fake multi-user).

5. **i18n** — EN + Formal Colombian Spanish for roles roadmap, data adapter, notify stub copy.

6. **Screenshots** — `preview/admin13-reuse-*.png`

---

## How to flip to a real DB later

1. Provision Postgres (Supabase / Neon / RDS / local).  
2. Apply `db/migrations/0001_ops_foundation.sql`.  
3. Implement `createPostgresRepos()` (Drizzle or plain `pg`) behind the same repo interfaces.  
4. Set `KABA_DATA_ADAPTER=postgres` and `DATABASE_URL=…`.  
5. Keep memory as the default so CI and demos never need cloud credentials.  
6. Point `getTrustClaimsForPublic()` / Settings save at `site_settings` (retire localStorage).  
7. Wire `notifyQuoteCreated` to real mail; drain `notified_at IS NULL` with a retry job.

---

## Explicitly next

| Item | Why later |
|------|-----------|
| **Postgres repos + Drizzle (or `pg`)** | This pass only drafts SQL + Memory* |
| **Real Stripe** | Checkout / Payment Intents / webhooks |
| **Real auth (Auth.js/Clerk/Supabase)** | Replace ADMIN_PASSWORD; load role from `profiles` |
| **CMS content-type registry** | When editors own fence types / FAQs |
| **LLM chatbot + validator** | Keep rule-based helper until validator ports |

---

## Non-goals (still)

- Live Supabase project or required cloud DB credentials to build  
- Fake multi-user accounts  
- Stripe keys / CMS / LLM  

See also: `preview/REUSE_PORT_v1.md`, `preview/PRIOR_KABA_FENCE_REPO_REVIEW.md`.

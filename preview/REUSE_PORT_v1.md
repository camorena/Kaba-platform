# Reuse port v1 — prior → Kaba-platform

**Date:** 2026-09-28 (America/Chicago)  
**Source patterns:** [camorena/kaba-fence](https://github.com/camorena/kaba-fence) (local `/workspace/kaba-fence-prior`)  
**Target:** [camorena/Kaba-platform](https://github.com/camorena/Kaba-platform) (`/workspace/kaba-fence`)  
**Constraint:** Highest-leverage patterns only — no monorepo wholesale import, no paid deps.

---

## Shipped this pass

1. **Gone quiet / stale quotes** (`new|contacted|scheduled`, quiet >3 days)  
   - Helpers: `listQuietQuotes`, `isQuietQuote`, `QUIET_DAYS_THRESHOLD` in `quotes-store.ts`  
   - Dashboard section + stat card; Quotes list section (`#gone-quiet`)  
   - Bilingual EN + Formal Colombian Spanish  

2. **Honest dashboard**  
   - Metric values typed `number | null` → render `—` when unknown (never silent fake 0)  
   - **Before launch** checklist: photos, real auth, durable DB, Stripe, hours/contact — each links to Settings / Gallery  

3. **Trust claims Settings stub**  
   - `src/lib/admin/trust-claims.ts` API shape (`TrustClaims`, `getTrustClaimsForPublic`, client read/write)  
   - Settings → Trust claims toggles (free estimates, locally owned) → `localStorage`  
   - Public marketing still uses `site.ts` until a DB feeds `getTrustClaimsForPublic()`  

4. **DAL-shaped auth skeleton**  
   - `src/lib/admin/dal.ts` — `getCurrentAdmin`, `requireAdminSession`, `requireRole`, `requirePageRole`  
   - ADMIN_PASSWORD stub login **kept**; comments point the replacement path  

5. **i18n** — `en.ts` + `es.ts` updated; admin craft / transitions / dark-light preserved  

---

## Explicitly next (out of scope this pass)

| Item | Why later |
|------|-----------|
| **Supabase (or Postgres) migration** | Persist quotes→invoices→payments; swap trust claims + business hours off localStorage/site.ts |
| **Real Stripe** | Checkout / Payment Intents / webhooks; retire stub ledger |
| **Full CMS content-type registry** | Fence types / projects / FAQs editable like prior `content/[type]` — only when editors own content |
| **LLM chatbot + validator** | Port prior `@kaba/ai-core` refusal gates **before** any model; keep rule-based helper until then |

Also queued when hardening: persist-then-notify for leads, media provenance/alt, claims register as launch gate, revalidate strategy if CMS splits cache.

---

## Non-goals (still)

- Importing prior Turbo/pnpm monorepo or `@kaba/ui` class soup  
- Dropping admin Spanish  
- Treating stub auth as production-ready  

See also: `preview/PRIOR_KABA_FENCE_REPO_REVIEW.md`.

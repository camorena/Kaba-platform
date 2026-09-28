# Prior Kaba Fence Repo Review

**Date:** 2026-09-28 (America/Chicago)  
**Prior repo:** [camorena/kaba-fence](https://github.com/camorena/kaba-fence) (private)  
**Local clone:** `/workspace/kaba-fence-prior` (shallow, evaluation only)  
**Current project:** `/workspace/kaba-fence` → deploys as [camorena/Kaba-platform](https://github.com/camorena/Kaba-platform) / https://kaba-fence.vercel.app  
**Scope:** Evaluation and adoption ideas only — no code merge from prior into current.

---

## 1. Candidate repos

| Repo | Visibility | Role |
|------|------------|------|
| **camorena/kaba-fence** | Private | **Previous project** — marketing site + admin CMS console (Datelica). Created 2026-09-19; last meaningful push ~2026-09-21/23. |
| camorena/Kaba-platform | Public | **Current project** — Next.js marketing + dense admin scaffold (quotes → invoices → payments). |

No other `kaba*` / `kabafence` candidates under `camorena`. This review treats **camorena/kaba-fence** as the clear prior.

---

## 2. Prior stack summary

**Shape:** pnpm + Turborepo monorepo (`kaba`).

| Layer | Choice |
|-------|--------|
| Apps | `apps/web` (public Next 16) · `apps/admin` (separate Next 16 console) |
| Packages | `@kaba/ui` (tokens/CSS) · `@kaba/content` (Zod) · `@kaba/ai-core` · `@kaba/analytics` · `@kaba/config` |
| Data | Supabase Postgres, **FORCE RLS**, migrations `0001`–`0014`, seed + RLS test suite |
| Auth | Supabase Auth + `profiles.role` (`owner` / `editor` / `viewer`) · DAL (`dal.ts`) · `proxy.ts` cookie refresh only |
| Media | Supabase Storage (ADR-006 supersedes Vercel Blob) · EXIF strip · alt required · provenance |
| Chat | Anthropic Claude Haiku 4.5 direct · post-generation **validator in code** (ADR-004/007) |
| Mail | Nodemailer; persist-then-notify for leads |
| Design | Two-layer tokens (`brand/tokens.json` → generated CSS/TS) · light + dark · WCAG contrast tests · no-hex lint |
| i18n | **English only** (ASSUMPTIONS A8 — closed 2026-09-18) |
| Hosting | Two Vercel projects, one repo (assumed) · admin→web revalidate webhook (ADR-008) |

**Admin nav (prior):** Dashboard · Leads · Fence Types · Services · Our Work · FAQs · Transcripts · Media · Settings.

**Not in prior:** invoices, payments, price book, Stripe, calendar/scheduling product, bilingual admin UI, command palette, pipeline kanban as a separate surface from leads.

**Public IA (prior):** Residential · Commercial · Services · Fence Types · Our Work · FAQ · Contact/estimate · About · legal/a11y — CMS-backed where publishable.

---

## 3. Current vs prior (capability map)

| Area | Prior (`kaba-fence`) | Current (`Kaba-platform`) | Takeaway |
|------|----------------------|---------------------------|----------|
| Deploy model | Two Next apps + packages | Single Next app | Current is simpler to ship; prior’s split pays off only with real CMS + separate cache |
| Marketing | Token CSS system, CMS content, claims gates | Tailwind marketing, static `site.ts`, strong agency craft | Keep current craft; borrow **content/claims discipline**, not the CSS framework wholesale |
| Admin focus | **CMS + leads + transcripts** | **Ops:** quotes, pipeline, invoices, payments, customers, calendar, pricebook, templates, reports | Different products. Current already outruns prior on commercial ops UI |
| Auth | Real roles + DAL + RLS | Password-cookie **stub** (documented) | Prior is the model when replacing the stub |
| Persistence | Postgres + RLS | In-memory / file-backed stores | Prior schema for **leads/content/media**; current needs **quotes→invoices→payments** schema that prior never built |
| Leads / quotes | `leads` + stale view + notes + notify | `quotes-store` + statuses + notes | Align vocabulary later; steal **ageing / “gone quiet”** UX now |
| i18n | EN only | Admin EN + formal es-CO | Do **not** regress to EN-only admin |
| Chat | LLM + hard validator + transcript review | Rule-based helper (`chatbot.ts`) | Prior validator is gold **if** LLM returns; don’t bolt LLM without it |
| Design system | Measured brand kit + generated tokens | Tailwind admin tokens + marketing gold/charcoal craft | Borrow **palette/contrast rules** and accent→fence-type mapping; don’t port `kb-*` class soup |
| Settings | Live `site_settings` (phone, hours, recipients, claim toggles) | Honest stub docs (auth/env/Stripe) + appearance/profile UI | Prior’s **business settings + claim toggles** belong in current settings when DB lands |
| Honesty culture | Ruthless “lying UI” fixes in commit messages | Honest stub disclaimers in README/settings | Shared Datelica value — keep |

---

## 4. What to borrow (inspiration / model)

Prioritize by **leverage for current craft** without importing monorepo weight.

### Ranked top 8 reusable ideas

1. **“Estimate → Silence” ageing inbox (P0)**  
   Prior surfaces `stale_leads` (status in `new|contacted|quoted` and quiet >3 days) **above** the newest-first list. Dashboard metrics treat “needs action” as attention, never a silent zero.  
   **Adopt in current:** On `/admin` + `/admin/quotes` (and pipeline), a “Gone quiet” section sorted by `updatedAt` / status age. Same business diagnosis the client already named.

2. **Auth Data Access Layer + roles (P0 when leaving stub)**  
   `getUser()` not `getSession()`; role from DB; every Server Action starts with `requireRole`; proxy only refreshes cookies; generic login errors.  
   **Adopt:** When replacing `ADMIN_PASSWORD`, copy the **pattern** (DAL module + rank checks), not necessarily Supabase as vendor.

3. **Persist-then-notify lead pipeline (P0 for production leads)**  
   Row is source of truth; email is notification with `notified_at` / retry. Contact-method CHECK; consent on form.  
   **Adopt:** Before trusting Vercel for live quotes, quotes must land in durable storage first; mail/SMS second.

4. **Owner-asserted trust claims in Settings (P1)**  
   Claims register + Settings toggles (`claim_free_estimates`, `claim_locally_owned`) so trust badges aren’t hard-coded lies. Licence/insured remain evidence-backed.  
   **Adopt:** Wire homepage/about trust bar to settings flags once settings are real; keep `CLAIMS-REGISTER.md` ideas as a living checklist (even if lighter than prior’s build gate).

5. **Chatbot safety validator (P1 if LLM chat returns)**  
   Post-generation refusals: price, schedule, warranty, legal, ungrounded, out-of-scope — with eval suite and adversarial cases. Prompt is not a control.  
   **Adopt:** Port `@kaba/ai-core` validator concepts into current `chatbot` path **before** any Anthropic/OpenAI wiring. Keep rule-based bot until then.

6. **Content-type registry CMS pattern (P1 for gallery/services CMS)**  
   One descriptor drives list + form + actions; route param is an allow-list key, never a table name; locked slugs; publishable vs always-live.  
   **Adopt:** When admin edits fence types / projects / FAQs instead of `site.ts`, use this registry — don’t invent three parallel CRUD pages.

7. **Launch blockers / “Right now” dashboard honesty (P1)**  
   Cards show `—` on read failure (never fake 0); blockers link to Media / Settings; no invented revenue KPIs.  
   **Adopt:** Current dashboard already has polish — apply the **unknown vs zero** rule and a short “Before launch” checklist (photos, hours, auth real, DB, Stripe).

8. **Media provenance + alt discipline (P2)**  
   Alt NOT NULL; provenance decision forced on upload; authorship-claiming surfaces (Our Work) treated differently from product illustration.  
   **Adopt:** For gallery uploads later; don’t ship stock as “jobs we built” without an explicit owner choice.

### Also worth noting (not top 8, still useful)

- **ADR-008 invalidate webhook** when admin and marketing caches diverge (or when CMS ships).  
- **Zod mirroring DB CHECKs** (validate raw phone before normalize).  
- **useActionState + remount-on-result** form feedback (prior fixed “did it save?” on phone).  
- **Brand kit** under `brand/` + mockups in `Light_*` / `Dark_*` as visual reference for accents (wood/vinyl/aluminum/deck).  
- **Audit log** append-only when multi-user editing lands.  
- **Analytics event vocabulary** (`docs/ANALYTICS-EVENTS.md`) for quote funnel consistency.

---

## 5. What is obsolete vs current craft (do NOT copy wholesale)

| Prior artifact | Why not to copy as-is |
|----------------|------------------------|
| Full pnpm/Turbo monorepo + two Next apps | Current single-app ships faster; split only when CMS cache invalidation or team boundaries demand it |
| English-only product decision | Current admin es-CO is an asset; prior A8 would be a regression |
| `@kaba/ui` `kb-*` CSS + generated tokens as the admin skin | Current Tailwind admin + marketing craft already reviewed; porting classes is churn |
| Fake / noisy dashboard designs prior explicitly rejected | Price cards, absurd lead charts — prior already killed these; don’t reintroduce |
| Invoice/payment absence | Prior has **no** invoice model — do not “simplify” current admin by deleting ops surfaces |
| Hard DB trigger that blocked all non-`kaba` media on projects (later dropped in 0013) | Lying guards are worse than none; if provenance UI exists, keep copy honest |
| Sample-content / preview markers that leaked to production | Prior spent days fixing this — current should keep demo labels explicit and non-customer-facing |
| Full draft → in_review → publish → rollback CMS | Overkill until a non-technical editor owns content; static + light CMS is enough mid-flight |
| Supabase Storage + 14 migrations on day one of stub admin | Right architecture later; wrong next step while stores are in-memory |
| Separate “Transcripts” nav before LLM exists | Premature; keep chat simple until validator + model exist |
| Treating prior marketing IA as more authoritative than current live site | Current site already reflects client mockups/agency polish; reconcile page-by-page, don’t revert |

---

## 6. Concrete adoption plan (prioritized)

### P0 — this sprint / next hardening pass

1. **Gone-quiet quotes** on dashboard + quotes list (age threshold configurable in code, e.g. 3 days).  
2. Document in Settings / README: production path = **DB before mail**, auth stub not production.  
3. Keep current invoice/payment/pipeline UX; treat prior as **leads/CMS** inspiration only.

### P1 — when replacing stub auth / in-memory stores

4. Introduce DAL-shaped `requireAdmin` / roles (even if single owner first).  
5. Schema sketch: merge prior `leads` ideas with current `QuoteRecord` + invoice/payment tables (prior never defined money — design that fresh).  
6. Settings: phone, hours, lead recipients, free-estimate / locally-owned toggles feeding the public trust bar.  
7. Optional: port claims checklist into `preview/` or `docs/` as gate before advertising licence numbers.

### P2 — when content editing or LLM chat is in scope

8. Content-type registry for fence types / projects / FAQs.  
9. Media library with alt + provenance.  
10. Revalidate strategy (tag webhook or single-app `revalidateTag`).  
11. LLM chat only behind prior-style validator + transcript review + dark launch.

### Explicit non-goals

- Merging prior app code into `/workspace/kaba-fence`  
- Replacing Tailwind marketing with prior token CSS  
- Dropping admin Spanish  
- Adding Turbo/pnpm workspace “because prior had it”

---

## 7. Structure cheat-sheet (prior)

```
kaba-fence/                    # camorena/kaba-fence
  apps/web/                    # Public site
  apps/admin/                  # CMS + leads console
  packages/{ui,content,ai-core,analytics,config}
  brand/                       # tokens.json, palette, voice, photography
  supabase/migrations/         # foundation, content, leads/chat, RLS, media…
  docs/ADR-001…008             # tokens, data, auth, chat safety, storage, cache
  PLAN.md, CLAIMS-REGISTER.md, ASSUMPTIONS.md, DESIGN-*.md
  Light_*/Dark_*               # Mockup JPGs + Brand_Guides
```

**Current admin already stronger on:** command palette, i18n, invoices/payments/pricebook, pipeline board, calendar, templates, activity, reports, agency visual polish.

**Prior stronger on:** real multi-user auth, RLS-proven data layer, CMS publish workflow, lead ageing product thinking, chatbot legal/commercial safety, measured design tokens, claims honesty machinery.

---

## 8. Recommendation (one paragraph)

Treat **camorena/kaba-fence** as a **reference architecture and product brief**, not a code donor. Steal the **gone-quiet lead discipline**, **DAL/auth posture**, **persist-then-notify**, **claims/settings truthfulness**, and **chat validator** ideas into Kaba-platform’s existing admin craft. Keep the current single-app, Tailwind, bilingual admin, and quotes→invoices→payments surfaces. Introduce Supabase (or equivalent) + CMS registry only when the stub stores and password gate are being retired — not as a decorative port of the monorepo.

---

*Evaluation only. Clone at `/workspace/kaba-fence-prior` may be deleted after review; this markdown is the durable artifact.*

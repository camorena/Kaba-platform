# Reuse port v9 — testimonials + projects public cutover

**Date:** 2026-09-28 (America/Chicago)  
**Target:** [camorena/Kaba-platform](https://github.com/camorena/Kaba-platform) (`/workspace/kaba-fence`)  
**Prior:** `preview/REUSE_PORT_v8.md` (CMS Phase B/C + FAQ cutover)

---

## Shipped this pass

### 1. Safe public cutovers

| Helper | Surfaces | Fallback |
|--------|----------|----------|
| `getPublishedTestimonials()` | `/reviews`, home reviews teaser | `site.ts` `testimonials` when no published CMS rows |
| `getPublishedProjects()` | `/gallery` (`GalleryGrid` props), home work teaser | `site.ts` `galleryProjects` when no published CMS rows |
| `getPublishedFaqs()` | `/faq` (+ JSON-LD) | unchanged from v8 |

- Projects CMS fields gained optional `beforeImage` / `beforeCaption` (seeded from site.ts).
- Home + gallery are `force-dynamic` so memory CMS edits show up in dev.

### 2. Claims honesty

- Removed fake 5-star rows and Google “G” chrome from home reviews and `/reviews`.
- Testimonials are quote + name + town only; copy notes illustrative quotes until verified.
- Admin hints reinforce: no invented star ratings.

### 3. Admin publish status clarity

- Hub cards: **Live · {paths}** vs **Admin only**, plus “Published updates…” / admin-only note.
- List: published/draft counts + live badge; hints differ for cutover vs admin-only types.
- Edit: status help text explains Published → live paths vs memory-only.

### 4. Docs + i18n

- `preview/CMS_PUBLIC_CONTENT_PLAN.md` updated to v9 snapshot.
- Admin EN + Formal Colombian Spanish for new content strings.
- This note is the v9 companion.

---

## How to demo

```bash
npm run dev
# Admin → Content
# Testimonials / Projects cards show Live badges
# Edit a testimonial → Save as Draft (when all draft, /reviews falls back to site.ts)
# Save as Published → refresh /reviews and home
# Projects: set beforeImage path under public/gallery/before/ for Before/After mode
```

---

## Live vs still site.ts

| Live from CMS (when Published) | Still `site.ts` |
|--------------------------------|-----------------|
| `/faq` accordion + FAQ JSON-LD | Chatbot FAQ matching |
| `/reviews` + home review cards | Services, about, materials, service-area |
| `/gallery` + home work teaser | Site copy, how-it-works, nav/footer |
| | Fence-types / services / media / about public consumers |

Admin edits for non-cutover types remain **memory-only**.

---

## Explicitly next

| Item | Why |
|------|-----|
| Postgres CMS adapter | Persist beyond process restart |
| Materials cutover | Low claim risk after review |
| Service-area / trust cutover | Higher claim risk — gate carefully |
| Media binary upload | Only with alt + EXIF strip |
| Chatbot ← CMS FAQs | Optional; keep answers price-free |

---

## Non-goals (this pass)

- Big-bang delete of `site.ts`  
- Cutting over service-area or about without claim review  
- Paid object storage / cloud upload  
- Fake review platform badges or star counts  
- Full draft → review → rollback workflow  

See also: `preview/REUSE_PORT_v1.md` … `v8.md`, `preview/CMS_PUBLIC_CONTENT_PLAN.md`.

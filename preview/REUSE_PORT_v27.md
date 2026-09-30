# Reuse port v27 — honest social footer links

**Date:** 2026-09-30 (America/Chicago)
**Target:** [camorena/Kaba-platform](https://github.com/camorena/Kaba-platform) (`/workspace/kaba-fence`)
**Prior:** `preview/REUSE_PORT_v26.md` (pre-production review checklist)

---

## What changed

- Removed root-only Facebook, Instagram, and LinkedIn defaults from `site.ts`; the memory CMS seed now starts those fields blank.
- Added platform-aware URL validation for the three social fields. Empty, malformed, wrong-platform, and provider-root URLs are treated as unpublished.
- Footer renders each icon only for a valid full profile URL and omits the entire Follow Us section when none are configured.
- Existing published CMS values are still used when valid, so no brand URL is invented.

## Set real URLs later

In **Admin → Content → Site copy**, edit and publish `contact.social.facebook`, `contact.social.instagram`, and/or `contact.social.linkedin` with the business's complete profile URL (for example, `https://www.facebook.com/<profile>`). Leave a field blank until the real profile exists; its icon remains hidden.

## Verification

- `npx tsc --noEmit`
- `npm run lint`

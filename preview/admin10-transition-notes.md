# Admin v10 — page transitions

**Date:** 2026-09-28 (America/Chicago)  
**Live:** https://kaba-fence.vercel.app/admin

## Approach

1. **Route group** `src/app/admin/(app)/` — authenticated pages only; login stays at `/admin/login`.
2. **Persistent shell** — `(app)/layout.tsx` calls `requireAdmin()` and wraps children in `AdminShell` so topbar/sidebar do not remount on in-app nav.
3. **CSS enter via `template.tsx`** — `(app)/template.tsx` remounts on each navigation and applies `.admin-page-enter` (fade + slight `translateY(8px)`, 320ms, agency easing). No framer-motion; no new deps.
4. **Mobile drawer** — `data-state="open|closed"` CSS transitions; unmount after ~220ms exit; `pathname` effect closes drawer on route change; nav `onClick` still closes immediately.
5. **Loading** — `(app)/loading.tsx` is content-only skeleton inside the shell (also uses `.admin-page-enter`).

## Reduced motion

`prefers-reduced-motion: reduce` disables `.admin-page-enter` animation and drawer transform/opacity transitions; drawer unmounts immediately on close.

## Screenshots

| File | Note |
|------|------|
| `preview/admin10-transition-login.png` | Login (enter card still uses existing login animation) |
| `preview/admin10-transition-dashboard.png` | Dashboard after login |
| `preview/admin10-transition-quotes.png` | Quotes after sidebar nav (shell persisted) |
| `preview/admin10-transition-mid-nav.png` | Mid client navigation frame |
| `preview/admin10-transition-mobile-drawer-open.png` | Mobile drawer open |
| `preview/admin10-transition-mobile-drawer-closing.png` | Drawer closed; content loading skeleton in shell |
| `preview/admin10-transition-mobile-after-nav.png` | Mobile after nav settled |
| `preview/admin10-transition-dashboard-dark.png` | Dark mode dashboard |

## Caveats

- Browser View Transitions API / React `ViewTransition` not used (stable React 19.2.8 export unavailable without experimental channel); CSS template pattern is the performant App Router default here.
- Exit crossfade of old page content is not dual-buffered (enter-only); enough for subtle agency feel without layout thrash.
- Login → app still full remount of shell (correct: login is outside `(app)`).

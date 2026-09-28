"use client";

import type { ReactNode } from "react";

/**
 * Legacy client wrapper — admin in-app transitions now use
 * `src/app/admin/(app)/template.tsx` (CSS `.admin-page-enter`) so the
 * persistent shell in `(app)/layout.tsx` does not remount.
 * Kept as a thin pass-through for any leftover imports.
 */
export default function AdminPageTransition({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}

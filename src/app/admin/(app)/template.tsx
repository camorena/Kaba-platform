/**
 * Remounts on every in-app navigation so CSS enter animation re-runs.
 * Shell chrome stays mounted via (app)/layout.tsx.
 * prefers-reduced-motion handled in globals.css (.admin-page-enter).
 */
export default function AdminAppTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="admin-page-enter">{children}</div>;
}

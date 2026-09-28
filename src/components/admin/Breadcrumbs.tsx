import Link from "next/link";

export type Crumb = { href?: string; label: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (!items.length) return null;
  return (
    <nav aria-label="Breadcrumb" className="admin-breadcrumbs mb-1.5">
      <ol className="flex flex-wrap items-center gap-1 text-[0.6875rem] text-muted">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1">
              {i > 0 && (
                <span className="text-muted-light/80" aria-hidden>
                  /
                </span>
              )}
              {last || !item.href ? (
                <span
                  className={last ? "font-semibold text-ink" : undefined}
                  aria-current={last ? "page" : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="font-medium transition hover:text-bronze-dark dark:hover:text-bronze-light"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

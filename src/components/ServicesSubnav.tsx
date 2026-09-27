"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "fencing", label: "Fencing" },
  { id: "decks", label: "Decks" },
  { id: "process", label: "Process" },
  { id: "faq", label: "FAQ" },
] as const;

export default function ServicesSubnav() {
  const [active, setActive] = useState<string>("fencing");

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => !!el);

    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActive(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75],
      }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className="sticky top-[var(--header-offset)] z-30 -mx-4 border-b border-ink/[0.07] bg-background/90 px-4 py-2.5 backdrop-blur-xl dark:border-cream/10 sm:-mx-0 sm:rounded-xl sm:border sm:px-3 sm:shadow-[var(--shadow-xs)]"
      aria-label="Services sections"
    >
      <div className="filter-row sm:!flex-nowrap">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`focus-ring filter-chip ${
              active === s.id ? "filter-chip-active" : "filter-chip-idle"
            }`}
            aria-current={active === s.id ? "true" : undefined}
          >
            {s.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

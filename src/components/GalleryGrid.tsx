"use client";

import WatermarkedImage from "@/components/WatermarkedImage";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { galleryProjects } from "@/lib/site";

type Filter = "All" | "fence" | "deck";
type Project = (typeof galleryProjects)[number];

export default function GalleryGrid() {
  const [filter, setFilter] = useState<Filter>("All");
  const [activeId, setActiveId] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const projects = useMemo(() => {
    if (filter === "All") return galleryProjects;
    return galleryProjects.filter((p) => p.category === filter);
  }, [filter]);

  const activeIndex = useMemo(
    () => (activeId ? projects.findIndex((p) => p.id === activeId) : -1),
    [activeId, projects]
  );
  const active: Project | null =
    activeIndex >= 0 ? projects[activeIndex] : null;

  const filters: { value: Filter; label: string }[] = [
    { value: "All", label: "All" },
    { value: "fence", label: "Fence" },
    { value: "deck", label: "Deck" },
  ];

  const openAt = useCallback((id: string, trigger?: HTMLElement | null) => {
    triggerRef.current = trigger ?? null;
    setActiveId(id);
  }, []);

  const close = useCallback(() => {
    setActiveId(null);
    // Restore focus to the card that opened the lightbox
    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  }, []);

  const go = useCallback(
    (delta: number) => {
      if (projects.length === 0 || activeIndex < 0) return;
      const next = (activeIndex + delta + projects.length) % projects.length;
      setActiveId(projects[next].id);
    },
    [activeIndex, projects]
  );

  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => closeRef.current?.focus(), 40);

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [active, close, go]);

  // If filter changes and active is no longer in list, close
  useEffect(() => {
    if (activeId && !projects.some((p) => p.id === activeId)) {
      setActiveId(null);
    }
  }, [projects, activeId]);

  return (
    <div className="min-w-0">
      <div className="filter-row" role="group" aria-label="Filter projects">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            aria-pressed={filter === f.value}
            className={`focus-ring filter-chip ${
              filter === f.value ? "filter-chip-active" : "filter-chip-idle"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {projects.map((project) => (
          <li key={project.id} className="card min-w-0 overflow-hidden">
            <button
              type="button"
              className="focus-ring group relative block w-full text-left outline-offset-[-2px]"
              onClick={(e) => openAt(project.id, e.currentTarget)}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-ivory-muted">
                <WatermarkedImage
                  src={project.image}
                  alt={`${project.title}. ${project.caption}.`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="gallery-img object-cover"
                  watermarkSize="sm"
                />
                <span className="absolute bottom-3 left-3 rounded-full bg-surface/95 px-2.5 py-1 text-xs font-semibold capitalize tracking-tight text-ink shadow-sm backdrop-blur-sm ring-1 ring-ink/5">
                  {project.category}
                </span>
                <span className="absolute inset-0 flex items-center justify-center bg-navy/0 opacity-0 transition group-hover:bg-navy/25 group-hover:opacity-100 group-focus-visible:bg-navy/25 group-focus-visible:opacity-100">
                  <span className="rounded-full bg-cream/95 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-navy shadow-md" aria-hidden>
                    View
                  </span>
                </span>
              </div>
              <div className="p-4 sm:p-5">
                <h2 className="font-display text-base font-semibold tracking-tight text-ink sm:text-lg">
                  {project.title}
                  <span className="sr-only"> — open larger view</span>
                </h2>
                <p className="mt-1.5 text-sm text-muted">{project.caption}</p>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {projects.length === 0 && (
        <p className="mt-8 text-center text-muted" role="status">
          No projects in this category yet.
        </p>
      )}

      {active && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="lightbox-panel">
            <div className="lightbox-toolbar">
              <p className="min-w-0 truncate text-sm font-semibold text-cream">
                {active.title}
                <span className="ml-2 font-normal text-cream/60">
                  {activeIndex + 1} / {projects.length}
                </span>
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className="focus-ring lightbox-icon-btn"
                  aria-label="Previous photo"
                  onClick={() => go(-1)}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="focus-ring lightbox-icon-btn"
                  aria-label="Next photo"
                  onClick={() => go(1)}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button
                  ref={closeRef}
                  type="button"
                  className="focus-ring lightbox-icon-btn"
                  aria-label="Close gallery lightbox"
                  onClick={close}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="lightbox-stage">
              <WatermarkedImage
                src={active.image}
                alt={`${active.title}. ${active.caption}.`}
                fill
                sizes="100vw"
                className="object-contain"
                watermarkSize="md"
                watermarkPosition="br"
                priority
              />
            </div>
            <p className="lightbox-caption">{active.caption}</p>
            <p className="sr-only">
              Use left and right arrow keys to navigate. Press Escape to close.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

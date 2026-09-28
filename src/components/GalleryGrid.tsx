"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { galleryProjects } from "@/lib/site";

type Filter = "All" | "fence" | "deck";
type ViewMode = "gallery" | "before-after";
type Project = (typeof galleryProjects)[number];

function hasBefore(
  p: Project,
): p is Project & { beforeImage: string; beforeCaption?: string } {
  return "beforeImage" in p && typeof (p as { beforeImage?: string }).beforeImage === "string";
}

export default function GalleryGrid() {
  const [filter, setFilter] = useState<Filter>("All");
  const [viewMode, setViewMode] = useState<ViewMode>("gallery");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [compareShowAfter, setCompareShowAfter] = useState(true);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const filtered = useMemo(() => {
    if (filter === "All") return galleryProjects;
    return galleryProjects.filter((p) => p.category === filter);
  }, [filter]);

  const projects = useMemo(() => {
    if (viewMode === "before-after") return filtered.filter(hasBefore);
    return filtered;
  }, [filtered, viewMode]);

  const activeIndex = useMemo(
    () => (activeId ? projects.findIndex((p) => p.id === activeId) : -1),
    [activeId, projects],
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
    setCompareShowAfter(true);
    setActiveId(id);
  }, []);

  const close = useCallback(() => {
    setActiveId(null);
    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  }, []);

  const go = useCallback(
    (delta: number) => {
      if (projects.length === 0 || activeIndex < 0) return;
      const next = (activeIndex + delta + projects.length) % projects.length;
      setCompareShowAfter(true);
      setActiveId(projects[next].id);
    },
    [activeIndex, projects],
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

  useEffect(() => {
    if (activeId && !projects.some((p) => p.id === activeId)) {
      setActiveId(null);
    }
  }, [projects, activeId]);

  const beforeCount = galleryProjects.filter(hasBefore).length;

  return (
    <div className="min-w-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
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

        <div
          className="filter-row sm:justify-end"
          role="group"
          aria-label="Gallery view mode"
        >
          <button
            type="button"
            onClick={() => setViewMode("gallery")}
            aria-pressed={viewMode === "gallery"}
            className={`focus-ring filter-chip ${
              viewMode === "gallery" ? "filter-chip-active" : "filter-chip-idle"
            }`}
          >
            Gallery
          </button>
          <button
            type="button"
            onClick={() => setViewMode("before-after")}
            aria-pressed={viewMode === "before-after"}
            className={`focus-ring filter-chip ${
              viewMode === "before-after"
                ? "filter-chip-active"
                : "filter-chip-idle"
            }`}
          >
            Before / After
            <span className="ml-1.5 tabular-nums opacity-70">({beforeCount})</span>
          </button>
        </div>
      </div>

      {viewMode === "before-after" && (
        <p className="mt-4 text-sm text-muted" role="status">
          Illustrative before/after pairs for select projects. Drag isn’t
          required—use the toggle on each card or in the lightbox.
        </p>
      )}

      <ul
        className={`mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:gap-6 ${
          viewMode === "before-after"
            ? "sm:grid-cols-1 lg:grid-cols-2"
            : "sm:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {projects.map((project) =>
          viewMode === "before-after" && hasBefore(project) ? (
            <li key={project.id} className="card min-w-0 overflow-hidden">
              <BeforeAfterCard
                project={project}
                onOpen={(el) => openAt(project.id, el)}
              />
            </li>
          ) : (
            <li key={project.id} className="card min-w-0 overflow-hidden">
              <button
                type="button"
                className="focus-ring group relative block w-full text-left outline-offset-[-2px]"
                onClick={(e) => openAt(project.id, e.currentTarget)}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-ivory-muted">
                  <Image
                    src={project.image}
                    alt={`${project.title}. ${project.caption}.`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="gallery-img object-cover"
                  />
                  <span className="absolute bottom-3 left-3 rounded-full bg-surface/95 px-2.5 py-1 text-xs font-semibold capitalize tracking-tight text-ink shadow-sm backdrop-blur-sm ring-1 ring-ink/5">
                    {project.category}
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center bg-navy/0 opacity-0 transition group-hover:bg-navy/25 group-hover:opacity-100 group-focus-visible:bg-navy/25 group-focus-visible:opacity-100">
                    <span
                      className="rounded-full bg-cream/95 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-navy shadow-md"
                      aria-hidden
                    >
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
          ),
        )}
      </ul>

      {projects.length === 0 && (
        <p className="mt-8 text-center text-muted" role="status">
          {viewMode === "before-after"
            ? "No before/after pairs in this filter yet. Switch to Gallery or choose All."
            : "No projects in this category yet."}
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
                {hasBefore(active) && (
                  <button
                    type="button"
                    className="focus-ring lightbox-icon-btn px-2.5 text-xs font-bold uppercase tracking-wide"
                    aria-pressed={compareShowAfter}
                    aria-label={
                      compareShowAfter
                        ? "Showing after — switch to before"
                        : "Showing before — switch to after"
                    }
                    onClick={() => setCompareShowAfter((v) => !v)}
                  >
                    {compareShowAfter ? "After" : "Before"}
                  </button>
                )}
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
              <Image
                src={
                  hasBefore(active) && !compareShowAfter
                    ? active.beforeImage
                    : active.image
                }
                alt={
                  hasBefore(active) && !compareShowAfter
                    ? `${active.title} — before. ${active.beforeCaption ?? ""}`
                    : `${active.title}. ${active.caption}.`
                }
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
            <p className="lightbox-caption">
              {hasBefore(active) && !compareShowAfter
                ? (active.beforeCaption ?? "Before")
                : active.caption}
            </p>
            <p className="sr-only">
              Use left and right arrow keys to navigate. Press Escape to close.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function BeforeAfterCard({
  project,
  onOpen,
}: {
  project: Project & { beforeImage: string; beforeCaption?: string };
  onOpen: (el: HTMLElement | null) => void;
}) {
  const [showAfter, setShowAfter] = useState(true);
  const src = showAfter ? project.image : project.beforeImage;
  const caption = showAfter
    ? project.caption
    : (project.beforeCaption ?? "Before");

  return (
    <div>
      <button
        type="button"
        className="focus-ring group relative block w-full text-left outline-offset-[-2px]"
        onClick={(e) => onOpen(e.currentTarget)}
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-ivory-muted">
          <Image
            src={src}
            alt={`${project.title} — ${showAfter ? "after" : "before"}. ${caption}.`}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="gallery-img object-cover"
          />
          <span className="absolute left-3 top-3 rounded-full bg-navy/90 px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-wider text-cream shadow-sm">
            {showAfter ? "After" : "Before"}
          </span>
        </div>
      </button>
      <div className="flex flex-wrap items-start justify-between gap-3 p-4 sm:p-5">
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-base font-semibold tracking-tight text-ink sm:text-lg">
            {project.title}
          </h2>
          <p className="mt-1.5 text-sm text-muted">{caption}</p>
        </div>
        <div
          className="flex shrink-0 rounded-full bg-ivory-muted p-1 ring-1 ring-ink/10 dark:ring-cream/10"
          role="group"
          aria-label={`Before or after for ${project.title}`}
        >
          <button
            type="button"
            aria-pressed={!showAfter}
            onClick={() => setShowAfter(false)}
            className={`focus-ring rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition ${
              !showAfter
                ? "bg-navy text-cream dark:bg-cream dark:text-navy"
                : "text-muted hover:text-ink"
            }`}
          >
            Before
          </button>
          <button
            type="button"
            aria-pressed={showAfter}
            onClick={() => setShowAfter(true)}
            className={`focus-ring rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition ${
              showAfter
                ? "bg-navy text-cream dark:bg-cream dark:text-navy"
                : "text-muted hover:text-ink"
            }`}
          >
            After
          </button>
        </div>
      </div>
    </div>
  );
}

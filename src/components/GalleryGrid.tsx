"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { galleryProjects } from "@/lib/site";

type Filter = "All" | "fence" | "deck";

export default function GalleryGrid() {
  const [filter, setFilter] = useState<Filter>("All");

  const projects = useMemo(() => {
    if (filter === "All") return galleryProjects;
    return galleryProjects.filter((p) => p.category === filter);
  }, [filter]);

  const filters: { value: Filter; label: string }[] = [
    { value: "All", label: "All" },
    { value: "fence", label: "Fence" },
    { value: "deck", label: "Deck" },
  ];

  return (
    <div>
      <div
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible"
        role="group"
        aria-label="Filter projects"
      >
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            aria-pressed={filter === f.value}
            className={`focus-ring shrink-0 rounded-full px-4 py-2 text-sm font-semibold tracking-tight transition ${
              filter === f.value
                ? "bg-ink text-ivory shadow-[0_2px_8px_color-mix(in_srgb,var(--ink)_20%,transparent)]"
                : "bg-surface text-ink ring-1 ring-ink/10 hover:bg-ivory-muted hover:ring-ink/16"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {projects.map((project) => (
          <li key={project.id} className="card overflow-hidden">
            <div className="relative aspect-[4/3] overflow-hidden bg-ivory-muted">
              <Image
                src={project.image}
                alt={`${project.title}. ${project.caption}.`}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="gallery-img object-cover"
              />
              <span className="absolute bottom-3 left-3 rounded-full bg-surface/95 px-2.5 py-0.5 text-xs font-semibold capitalize tracking-tight text-ink shadow-sm backdrop-blur-sm ring-1 ring-ink/5">
                {project.category}
              </span>
            </div>
            <div className="p-4 sm:p-5">
              <h3 className="font-display font-semibold tracking-tight text-ink">
                {project.title}
              </h3>
              <p className="mt-1.5 text-sm text-muted">{project.caption}</p>
            </div>
          </li>
        ))}
      </ul>

      {projects.length === 0 && (
        <p className="mt-8 text-center text-muted" role="status">
          No projects in this category yet.
        </p>
      )}
    </div>
  );
}

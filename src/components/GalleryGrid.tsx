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

      <ul className="mt-8 grid grid-cols-1 gap-8 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-10">
        {projects.map((project, index) => (
          <li
            key={project.id}
            className={`min-w-0 ${
              index === 0 && filter === "All"
                ? "sm:col-span-2 lg:col-span-2"
                : ""
            }`}
          >
            <div
              className={`frame-photo relative w-full overflow-hidden bg-ivory-muted ${
                index === 0 && filter === "All"
                  ? "aspect-[16/10]"
                  : "aspect-[4/3]"
              }`}
            >
              <Image
                src={project.image}
                alt={`${project.title}. ${project.caption}.`}
                fill
                sizes={
                  index === 0 && filter === "All"
                    ? "(min-width: 1024px) 66vw, 100vw"
                    : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                }
                className="frame-photo-img object-cover"
              />
            </div>
            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-muted">
                  {String(index + 1).padStart(2, "0")} · {project.category}
                </p>
                <h3 className="mt-1 font-display font-semibold tracking-tight text-ink">
                  {project.title}
                </h3>
                <p className="mt-1 text-sm text-muted">{project.caption}</p>
              </div>
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

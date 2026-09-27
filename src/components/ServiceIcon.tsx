import type { ReactNode } from "react";

const icons: Record<string, ReactNode> = {
  wood: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      d="M4 20V8l8-4 8 4v12M4 8l8 4 8-4M12 12v8M8 14v2M16 14v2"
    />
  ),
  vinyl: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      d="M5 20V7h3v13M10 20V5h4v15M16 20V8h3v12M4 20h16"
    />
  ),
  "chain-link": (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      d="M8 8l8 8M8 16l8-8M7 12a2 2 0 11-4 0 2 2 0 014 0zm14 0a2 2 0 11-4 0 2 2 0 014 0z"
    />
  ),
  aluminum: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      d="M5 20V6h2v14M17 20V6h2v14M4 20h16M9 10h6M9 14h6M12 6v2"
    />
  ),
  privacy: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      d="M4 20V7h16v13M4 10h16M8 7V5M12 7V4M16 7V5M8 14h.01M12 14h.01M16 14h.01"
    />
  ),
  repair: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      d="M14.7 6.3a4 4 0 015 5L11 20l-4 1 1-4 8.7-10.7zM12 8l4 4"
    />
  ),
  rebuild: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      d="M4 20h16M6 20V10l6-4 6 4v10M9 20v-5h6v5"
    />
  ),
  "new-builds": (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      d="M3 12l9-8 9 8M5 10v10h14V10M10 20v-5h4v5"
    />
  ),
  railings: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      d="M4 20V8M8 20V8M12 20V8M16 20V8M20 20V8M4 8h16M4 12h16"
    />
  ),
};

export default function ServiceIcon({
  slug,
  className = "h-6 w-6",
}: {
  slug: string;
  className?: string;
}) {
  const path = icons[slug] ?? icons.wood;

  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden
    >
      {path}
    </svg>
  );
}

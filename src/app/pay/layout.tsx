import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: `Pay invoice · ${siteConfig.name}`,
    template: `%s · ${siteConfig.name}`,
  },
  robots: { index: false, follow: false },
};

export default function PayLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[var(--background)]">
      <header className="border-b border-ink/10 bg-navy text-ivory">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <p className="font-display text-lg font-semibold tracking-tight">
              {siteConfig.name}
            </p>
            <p className="text-[0.6875rem] text-ivory/70">{siteConfig.tagline}</p>
          </div>
          <a
            href={siteConfig.phoneHref}
            className="rounded-full bg-bronze px-3 py-1.5 text-xs font-semibold text-navy hover:bg-bronze-light"
          >
            {siteConfig.phone}
          </a>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
      <footer className="border-t border-ink/10 py-4 text-center text-[0.6875rem] text-muted">
        {siteConfig.name} · {siteConfig.address.region} ·{" "}
        <a href={siteConfig.emailHref} className="underline hover:text-ink">
          {siteConfig.email}
        </a>
      </footer>
    </div>
  );
}

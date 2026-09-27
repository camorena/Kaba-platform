import Link from "next/link";
import { navLinks, siteConfig } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-ink/10 bg-ink text-ivory">
      <div className="container-page grid gap-10 py-12 sm:gap-12 sm:py-14 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2 lg:col-span-1">
          <p className="font-display text-xl font-semibold tracking-tight">
            {siteConfig.name}
          </p>
          <p className="mt-2 text-sm text-ivory/75">{siteConfig.tagline}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/60">
            Proudly serving {siteConfig.serviceArea}.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-bronze-light">
            Quick Links
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="focus-ring rounded text-sm text-ivory/80 transition hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-bronze-light">
            Contact & Hours
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-ivory/80">
            <li>
              <a
                href={siteConfig.phoneHref}
                className="focus-ring rounded transition hover:text-white"
              >
                {siteConfig.phone}
              </a>
            </li>
            <li>
              <a
                href={siteConfig.emailHref}
                className="focus-ring rounded break-all transition hover:text-white"
              >
                {siteConfig.email}
              </a>
            </li>
            <li className="pt-2 text-ivory/65">
              {siteConfig.address.city}, {siteConfig.address.state}{" "}
              {siteConfig.address.zip}
            </li>
            <li className="text-ivory/55">{siteConfig.hours.weekdays}</li>
            <li className="text-ivory/55">{siteConfig.hours.saturday}</li>
            <li className="text-ivory/55">{siteConfig.hours.sunday}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-ivory/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>{siteConfig.address.region}</p>
        </div>
      </div>
    </footer>
  );
}

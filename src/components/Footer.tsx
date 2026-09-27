import Image from "next/image";
import Link from "next/link";
import { footerLinks, navLinks, siteConfig } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="band-dark mt-auto border-t border-white/[0.08]">
      <div className="container-page relative grid gap-10 py-12 sm:gap-12 sm:py-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
        <div className="md:col-span-2 lg:col-span-5">
          <Link
            href="/"
            className="focus-ring inline-flex rounded-md"
          >
            <Image
              src="/brand/kaba-fence-logo.png"
              alt="Kaba Fence"
              width={140}
              height={144}
              className="h-[4.25rem] w-auto object-contain sm:h-[4.75rem]"
            />
          </Link>
          <p className="mt-4 text-sm font-medium text-cream/85">{siteConfig.tagline}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/65">
            Proudly serving {siteConfig.serviceArea}.
          </p>
        </div>

        <div className="lg:col-span-3 lg:pt-1">
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-bronze">
            Quick Links
          </p>
          <span className="mt-2.5 block h-px w-8 bg-bronze/50" aria-hidden />
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-1 sm:gap-y-1.5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="focus-ring -mx-1 inline-flex min-h-10 items-center rounded px-1 text-sm text-cream/85 transition hover:text-cream"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="focus-ring -mx-1 inline-flex min-h-10 items-center rounded px-1 text-sm text-cream/85 transition hover:text-cream"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-4 lg:pt-1">
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-bronze">
            Contact & Hours
          </p>
          <span className="mt-2.5 block h-px w-8 bg-bronze/50" aria-hidden />
          <ul className="mt-4 space-y-1.5 text-sm text-cream/85">
            <li>
              <a
                href={siteConfig.phoneHref}
                className="focus-ring -mx-1 inline-flex min-h-10 items-center rounded px-1 font-medium transition hover:text-cream"
              >
                {siteConfig.phone}
              </a>
            </li>
            <li>
              <a
                href={siteConfig.emailHref}
                className="focus-ring -mx-1 inline-flex min-h-10 items-center break-all rounded px-1 transition hover:text-cream"
              >
                {siteConfig.email}
              </a>
            </li>
            <li className="pt-2 text-cream/70">
              {siteConfig.address.city}, {siteConfig.address.state}{" "}
              {siteConfig.address.zip}
            </li>
            <li className="text-cream/60">{siteConfig.hours.weekdays}</li>
            <li className="text-cream/60">{siteConfig.hours.saturday}</li>
            <li className="text-cream/60">{siteConfig.hours.sunday}</li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/[0.08]">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-cream/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>{siteConfig.address.region}</p>
        </div>
      </div>
    </footer>
  );
}

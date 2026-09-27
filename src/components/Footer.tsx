import Image from "next/image";
import Link from "next/link";
import { navLinks, siteConfig } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="band-dark mt-auto border-t border-white/[0.06]">
      <div className="container-page relative grid gap-10 py-12 sm:gap-12 sm:py-14 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2 lg:col-span-1">
          <Link
            href="/"
            className="focus-ring inline-flex rounded-md"
          >
            <Image
              src="/brand/kaba-fence-logo.png"
              alt="Kaba Fence"
              width={140}
              height={144}
              className="h-16 w-auto object-contain sm:h-[4.5rem]"
            />
          </Link>
          <p className="mt-3 text-sm text-ivory/75">{siteConfig.tagline}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/55">
            Proudly serving {siteConfig.serviceArea}.
          </p>
        </div>

        <div>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-bronze-light">
            Quick Links
          </p>
          <span className="mt-2 block h-px w-8 bg-bronze/40" aria-hidden />
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="focus-ring -mx-1 inline-flex min-h-10 items-center rounded px-1 text-sm text-ivory/80 transition hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-bronze-light">
            Contact & Hours
          </p>
          <span className="mt-2 block h-px w-8 bg-bronze/40" aria-hidden />
          <ul className="mt-4 space-y-2.5 text-sm text-ivory/80">
            <li>
              <a
                href={siteConfig.phoneHref}
                className="focus-ring -mx-1 inline-flex min-h-10 items-center rounded px-1 transition hover:text-white"
              >
                {siteConfig.phone}
              </a>
            </li>
            <li>
              <a
                href={siteConfig.emailHref}
                className="focus-ring -mx-1 inline-flex min-h-10 items-center break-all rounded px-1 transition hover:text-white"
              >
                {siteConfig.email}
              </a>
            </li>
            <li className="pt-2 text-ivory/60">
              {siteConfig.address.city}, {siteConfig.address.state}{" "}
              {siteConfig.address.zip}
            </li>
            <li className="text-ivory/50">{siteConfig.hours.weekdays}</li>
            <li className="text-ivory/50">{siteConfig.hours.saturday}</li>
            <li className="text-ivory/50">{siteConfig.hours.sunday}</li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/[0.06]">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-ivory/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>{siteConfig.address.region}</p>
        </div>
      </div>
    </footer>
  );
}

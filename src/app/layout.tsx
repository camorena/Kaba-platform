import type { Metadata } from "next";
import { Inter, Playfair_Display, Great_Vibes, Geist_Mono } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import ThemeScript from "@/components/ThemeScript";
import Analytics from "@/components/Analytics";
import { getPublishedHeroCopy } from "@/lib/cms/public";
import { defaultOgImage, siteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const playfair = Playfair_Display({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  preload: true,
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export function generateMetadata(): Metadata {
  const brand = getPublishedHeroCopy();
  const defaultDescription = `${brand.description} Free estimates.`;
  const titleDefault = `${brand.name} | Fence Company in Raleigh, NC`;
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: titleDefault,
      template: `%s | ${brand.name}`,
    },
    description: defaultDescription,
    keywords: [
      "fence company Raleigh NC",
      "fence installation",
      "wood fence",
      "vinyl fence",
      "aluminum fence",
      "chain link fence",
      "free fence estimate",
    ],
    authors: [{ name: brand.name }],
    creator: brand.name,
    alternates: {
      canonical: "/",
    },
    icons: {
      icon: [
        { url: "/favicon.png", sizes: "32x32", type: "image/png" },
        { url: "/brand/favicon-48.png", sizes: "48x48", type: "image/png" },
      ],
      apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180" }],
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      siteName: brand.name,
      title: titleDefault,
      description: defaultDescription,
      images: [defaultOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title: titleDefault,
      description: defaultDescription,
      images: [defaultOgImage.url],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} ${greatVibes.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}

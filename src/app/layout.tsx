import type { Metadata } from "next";
import { DM_Sans, Fraunces, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import FloatingCta from "@/components/FloatingCta";
import ThemeProvider from "@/components/ThemeProvider";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const defaultDescription =
  "Local fence and deck installation, repairs, and free estimates in Angier, Raleigh, and surrounding NC communities.";

export const metadata: Metadata = {
  metadataBase: new URL("https://kaba-fence.vercel.app"),
  title: {
    default: `${siteConfig.name} | Fence & Deck Repair in Angier & Raleigh`,
    template: `%s | ${siteConfig.name}`,
  },
  description: defaultDescription,
  keywords: [
    "fence installation",
    "deck repair",
    "Angier NC",
    "Raleigh fence",
    "vinyl fence",
    "cedar privacy fence",
    "free fence estimate",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
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
    url: "https://kaba-fence.vercel.app",
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Fence & Deck Repair in Angier & Raleigh`,
    description: defaultDescription,
    images: [
      {
        url: "/gallery/cedar-privacy.png",
        width: 1200,
        height: 900,
        alt: "Cedar privacy fence installation by Kaba Fence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Fence & Deck Repair in Angier & Raleigh`,
    description: defaultDescription,
    images: ["/gallery/cedar-privacy.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${fraunces.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-bronze focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-navy focus:shadow-lg"
          >
            Skip to content
          </a>
          <Header />
          <main id="main" className="flex-1" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <FloatingCta />
          <ChatWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}

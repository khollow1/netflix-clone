import type { Metadata } from "next";
import { Sora, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CineVerse",
    template: "%s | CineVerse",
  },
  description:
    "Plateforme cinéma premium: nouveautés, tendances et détails complets des films en un seul endroit.",
  openGraph: {
    title: "CineVerse",
    description:
      "Découvre les films tendance, explore par genre et regarde les bandes-annonces en HD.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">

        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8933774191305964"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {children}

      </body>
    </html>
  );
}
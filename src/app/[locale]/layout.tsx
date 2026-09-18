import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

import { site } from "@/config/site";
import { hreflang, isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import {
  buildAlternates,
  isPreviewDeploy,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { SmoothScroll } from "@/components/providers/smooth-scroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#04050a",
  colorScheme: "dark",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dict = getDictionary(locale);

  return {
    metadataBase: new URL(site.url),
    title: {
      default: dict.meta.title,
      template: `%s — ${site.name}`,
    },
    description: dict.meta.description,
    applicationName: site.name,
    alternates: buildAlternates(locale),
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: hreflang[locale],
      title: dict.meta.title,
      description: dict.meta.description,
      url: buildAlternates(locale).canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
    },
    robots: isPreviewDeploy
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const typedLocale: Locale = locale;

  return (
    <html
      lang={hreflang[typedLocale]}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-ink-950 text-chalk">
        <JsonLd
          data={[organizationJsonLd(typedLocale), websiteJsonLd(typedLocale)]}
        />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}

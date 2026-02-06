import type { Metadata } from "next";
import "../globals.css";
import { Inter, Space_Grotesk } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

/**
 * Generate static params for all supported locales.
 * Enables static rendering for every locale route at build time.
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Generate locale-aware metadata (title, description, hreflang links).
 * Uses getTranslations to resolve translated strings server-side.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        fr: "/fr",
      },
    },
  };
}

/**
 * Root layout wrapped in the [locale] dynamic segment.
 * - Validates the locale from the URL; returns 404 for unsupported locales.
 * - Provides translations to client components via NextIntlClientProvider.
 * - Sets the html lang attribute dynamically for SEO.
 * - Persists the user's theme preference via inline script (no flash).
 */
export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate locale; 404 if not in our supported list.
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering for this locale.
  setRequestLocale(locale);

  // Load all translations for the current locale (passed to client provider).
  const messages = await getMessages();

  return (
    <html lang={locale} data-theme="dark" suppressHydrationWarning>
      <head>
        {/*
          Apply persisted theme preference ASAP to reduce flash.
          Preconditions: localStorage may be unavailable; falls back to default dark.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function () {
  try {
    var t = localStorage.getItem("theme");
    if (t === "light" || t === "dark") {
      document.documentElement.dataset.theme = t;
    }
  } catch (e) {}
})();`,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

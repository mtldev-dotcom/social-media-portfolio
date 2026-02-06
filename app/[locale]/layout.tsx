import type { Metadata } from "next";
import "../globals.css";
import { Inter, Space_Grotesk } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Footer } from "@/components/Footer";
import { SetLang } from "@/components/SetLang";

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
 * Locale layout — owns <html>/<body> for frontend (root layout is a fragment).
 * - Validates locale; 404 if unsupported.
 * - SetLang sets document.documentElement.lang for SEO.
 * - Theme script persists preference (no flash).
 */
export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <SetLang lang={locale} />
        {/*
          Apply persisted theme preference ASAP to reduce flash.
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
        <div
          className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
        >
          <NextIntlClientProvider messages={messages}>
            {children}
            <div className="mx-auto w-full max-w-[1260px] px-4">
              <Footer />
            </div>
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}

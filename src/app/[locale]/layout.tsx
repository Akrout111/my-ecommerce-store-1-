import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/layout/Header";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartSheet } from "@/components/cart/CartSheet";
import { StyleAssistantLoader } from '@/components/ai/StyleAssistantLoader';
import { LanguageProvider } from "@/components/ecommerce/language-provider";
import { Toaster } from "@/components/ui/toaster";
import { isValidLocale } from "@/i18n/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: '#C9A96E',
  colorScheme: 'light dark',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://persona.fashion'),
    title: {
      default: isArabic ? "برسونا — الموضة بإعادة تصور" : "Persona — Fashion Reimagined",
      template: '%s | Persona',
    },
    description: isArabic
      ? "أسلوبك. قصتك. شخصيتك. اكتشفي الأزياء الفاخرة والجمال والإكسسوارات من أبرز العلامات العالمية."
      : 'Discover premium fashion for women, men, and kids. Free shipping over $50. Shop the latest collections.',
    keywords: ['fashion', 'clothing', 'style', 'luxury', 'women fashion', 'men fashion'],
    authors: [{ name: 'Persona Fashion' }],
    creator: 'Persona Fashion',
    openGraph: {
      type: 'website',
      locale: isArabic ? 'ar_SA' : 'en_US',
      alternateLocale: isArabic ? 'en_US' : 'ar_SA',
      url: 'https://persona.fashion',
      siteName: 'Persona Fashion',
      title: isArabic ? "برسونا — الموضة بإعادة تصور" : 'Persona — Fashion Reimagined',
      description: 'Discover premium fashion for every moment.',
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Persona Fashion' }],
    },
    twitter: { card: 'summary_large_image', site: '@personafashion', creator: '@personafashion' },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    icons: {
      icon: '/favicon.ico',
      apple: '/icons/apple-touch-icon.png',
    },
    manifest: '/manifest.json',
  };
}

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    return null;
  }

  const isRTL = locale === "ar";

  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
            >
              Skip to main content
            </a>
            <div className="flex min-h-screen flex-col">
              <Header />
              <Navbar />
              <main id="main" className="flex-1">
                {children}
              </main>
              <Footer />
              <StyleAssistantLoader />
            </div>
            <CartSheet />
          </LanguageProvider>
        </ThemeProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}

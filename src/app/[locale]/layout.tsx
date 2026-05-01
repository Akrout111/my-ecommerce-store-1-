import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/layout/Header";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartSheet } from "@/components/cart/CartSheet";
import { LanguageProvider } from "@/components/ecommerce/language-provider";
import { Toaster } from "@/components/ui/toaster";
import { isValidLocale } from "@/i18n/config";
import type { Locale } from "@/types/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";

  return {
    title: isArabic ? "برسونا — الموضة بإعادة تصور" : "Persona — Fashion Reimagined",
    description: isArabic
      ? "أسلوبك. قصتك. شخصيتك. اكتشفي الأزياء الفاخرة والجمال والإكسسوارات من أبرز العلامات العالمية."
      : "Your Style. Your Story. Your Persona. Discover luxury fashion, beauty, and accessories from the world's leading brands.",
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <Navbar />
              <main id="main" className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <CartSheet />
          </LanguageProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}

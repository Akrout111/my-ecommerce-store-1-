'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Search, SearchX } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/ecommerce/language-provider';
import { COLORS, NAV_CATEGORIES } from '@/lib/constants';

export default function NotFoundPage() {
  const { language, isRTL } = useLanguage();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const isArabic = language === 'ar';

  const popularCategories = NAV_CATEGORIES.slice(0, 6).map((cat) => ({
    key: cat.key,
    label: isArabic
      ? cat.subcategoriesAr[0].replace(/s$/, '')
      : cat.key.charAt(0).toUpperCase() + cat.key.slice(1),
    href: `/${language}?category=${cat.key}`,
  }));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${language}/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-8 px-4 text-center"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="flex h-28 w-28 items-center justify-center rounded-full"
          style={{ backgroundColor: `${COLORS.gold}20` }}
        >
          <SearchX className="h-14 w-14" style={{ color: COLORS.gold }} />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-3"
      >
        <h1
          className="text-7xl font-bold"
          style={{ color: COLORS.gold }}
        >
          404
        </h1>
        <h2 className="text-2xl font-semibold text-foreground">
          {isArabic ? 'الصفحة غير موجودة' : 'Page Not Found'}
        </h2>
        <p className="max-w-md text-muted-foreground">
          {isArabic
            ? 'عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.'
            : "Sorry, the page you're looking for doesn't exist or has been moved."}
        </p>
      </motion.div>

      {/* Search bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full max-w-lg"
      >
        <form onSubmit={handleSearch} className="relative">
          <Search
            className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isArabic ? 'ابحثي عن منتجات...' : 'Search for products...'}
            className="h-12 w-full rounded-full border border-border bg-card ps-12 pe-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/50 transition-shadow"
          />
        </form>
      </motion.div>

      {/* Popular categories */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="space-y-3"
      >
        <p className="text-sm font-medium text-muted-foreground">
          {isArabic ? 'تصفحي الفئات الشائعة' : 'Browse Popular Categories'}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {popularCategories.map((cat) => (
            <Link
              key={cat.key}
              href={cat.href}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Home link */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Link
          href={`/${language}`}
          className="inline-flex items-center gap-2 h-10 rounded-full px-6 text-sm font-semibold text-[#0F0F0F]"
          style={{ backgroundColor: COLORS.gold }}
        >
          <Home className="h-4 w-4" />
          {isArabic ? 'العودة للرئيسية' : 'Back to Home'}
        </Link>
      </motion.div>
    </div>
  );
}

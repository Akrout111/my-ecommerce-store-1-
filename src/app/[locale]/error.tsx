'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/ecommerce/language-provider';
import { COLORS } from '@/lib/constants';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { language, isRTL } = useLanguage();

  useEffect(() => {
    // Log error for observability
    console.error('[ErrorBoundary] Unhandled error:', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full"
          style={{ backgroundColor: `${COLORS.gold}20` }}
        >
          <AlertTriangle className="h-12 w-12" style={{ color: COLORS.gold }} />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-bold text-foreground">
          {language === 'ar' ? 'حدث خطأ' : 'Something Went Wrong'}
        </h1>
        <p className="max-w-md text-muted-foreground">
          {language === 'ar'
            ? 'نعتذر، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'
            : 'We apologize, an unexpected error occurred. Please try again.'}
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground">
            {language === 'ar' ? 'معرف الخطأ' : 'Error ID'}: {error.digest}
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center gap-2 h-10 rounded-full px-6 text-sm font-semibold text-[#0F0F0F]"
          style={{ backgroundColor: COLORS.gold }}
        >
          <RefreshCw className="h-4 w-4" />
          {language === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
        </button>
        <Link
          href={`/${language}`}
          className="inline-flex items-center justify-center gap-2 h-10 rounded-full border border-border px-6 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
        >
          <Home className="h-4 w-4" />
          {language === 'ar' ? 'الرئيسية' : 'Go Home'}
        </Link>
      </motion.div>
    </div>
  );
}

'use client';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { COLORS } from '@/lib/constants';
import { useParams } from 'next/navigation';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: `${COLORS.gold}20` }}
        >
          <CheckCircle className="w-12 h-12" style={{ color: COLORS.gold }} />
        </motion.div>
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-4">
          Thank you for shopping with Persona. Your order has been placed successfully.
        </p>
        <div className="rounded-2xl border border-border bg-card p-6 mb-6 text-left">
          <div className="flex items-center gap-3 mb-3">
            <Package className="h-5 w-5" style={{ color: COLORS.gold }} />
            <span className="font-semibold">Order Number</span>
          </div>
          <p className="text-lg font-mono text-muted-foreground">{orderId.toUpperCase()}</p>
          <p className="text-sm text-muted-foreground mt-2">Estimated delivery: 5-7 business days</p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full px-8 py-3 font-semibold text-[#0F0F0F]"
          style={{ backgroundColor: COLORS.gold }}
        >
          Continue Shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </main>
  );
}

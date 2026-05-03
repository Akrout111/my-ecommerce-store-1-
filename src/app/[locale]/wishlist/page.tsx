'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlistStore } from '@/store/wishlist-store';
import { COLORS } from '@/lib/constants';

export default function WishlistPage() {
  const { data: session } = useSession();
  const { items: wishlistIds, toggleItem } = useWishlistStore();

  if (!session) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Heart className="w-16 h-16 mx-auto mb-4" style={{ color: COLORS.rose }} />
          <h1 className="text-2xl font-bold text-center mb-2">Your Wishlist</h1>
          <p className="text-muted-foreground text-center mb-6">Sign in to save your favorite items across devices.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/auth/login" className="rounded-full bg-[#C9A96E] text-[#0F0F0F] px-6 py-2.5 font-semibold text-sm">Sign In</Link>
            <Link href="/auth/register" className="rounded-full border border-[#C9A96E] text-[#C9A96E] px-6 py-2.5 font-semibold text-sm">Create Account</Link>
          </div>
        </motion.div>
      </main>
    );
  }

  if (wishlistIds.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <Heart className="w-16 h-16" style={{ color: COLORS.rose }} />
        <h1 className="text-2xl font-bold">Your wishlist is empty</h1>
        <p className="text-muted-foreground">Browse our collections and save items you love.</p>
        <Link href="/" className="rounded-full bg-[#C9A96E] text-[#0F0F0F] px-8 py-3 font-semibold">Start Browsing</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8 px-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">My Wishlist</h1>
      <p className="text-muted-foreground mb-8">{wishlistIds.length} {wishlistIds.length === 1 ? 'item' : 'items'} saved</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {wishlistIds.map((id) => (
          <div key={id} className="rounded-2xl border border-border bg-card p-4 text-center">
            <div className="relative aspect-square bg-muted rounded-lg mb-3 overflow-hidden">
              <Image
                src="/images/placeholder-product.svg"
                alt={`Wishlist item: Product ${id.slice(0, 8)}`}
                fill
                className="object-contain p-6"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
            <p className="text-sm font-medium truncate">Product {id.slice(0, 8)}</p>
            <button
              onClick={() => toggleItem(id)}
              className="mt-2 text-xs text-[#E8A0BF] hover:underline"
            >
              Remove from Wishlist
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

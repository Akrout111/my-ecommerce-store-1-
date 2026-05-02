'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Package, MapPin, Heart, Settings } from 'lucide-react';
import Link from 'next/link';
import { COLORS } from '@/lib/constants';

export default function AccountPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9A96E]" />
      </main>
    );
  }

  if (!session) {
    redirect('/auth/login');
  }

  const tabs = [
    { icon: Package, label: 'Orders', href: '/account?tab=orders' },
    { icon: Heart, label: 'Wishlist', href: '/wishlist' },
    { icon: MapPin, label: 'Addresses', href: '/account?tab=addresses' },
    { icon: Settings, label: 'Settings', href: '/account?tab=settings' },
  ];

  return (
    <main className="min-h-screen py-8 px-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A96E]/10 text-[#C9A96E] font-bold text-xl">
          {session.user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{session.user?.name || 'User'}</h1>
          <p className="text-muted-foreground">{session.user?.email}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tabs.map((tab) => (
          <Link key={tab.label} href={tab.href} className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 transition hover:border-[#C9A96E]/50 hover:shadow-lg">
            <tab.icon className="h-8 w-8" style={{ color: COLORS.gold }} />
            <span className="text-sm font-medium">{tab.label}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}

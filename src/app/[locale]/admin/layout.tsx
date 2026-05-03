'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Diamond, LayoutDashboard, Package, ShoppingBag, Users, Tag, BarChart2, Settings, Menu, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS } from '@/lib/constants';

const navLinks = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { href: '/admin/customers', icon: Users, label: 'Customers' },
  { href: '/admin/deals', icon: Tag, label: 'Deals' },
  { href: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 start-0 z-40 hidden w-60 flex-col border-e border-border bg-card lg:flex">
        <div className="flex h-16 items-center gap-2 px-6 border-b border-border">
          <Diamond className="h-6 w-6" style={{ color: COLORS.gold }} />
          <span className="text-lg font-bold" style={{ color: COLORS.gold }}>Persona Admin</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-[#C9A96E]/10 text-[#C9A96E] border-e-2 border-[#C9A96E]'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C9A96E]/10 text-[#C9A96E] font-semibold text-sm">
              {session?.user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{session?.user?.name || 'Admin'}</p>
              <p className="text-xs text-muted-foreground truncate">{session?.user?.email || 'admin@persona.fashion'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card px-4 lg:hidden">
        <button onClick={() => setSidebarOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent">
          <Menu size={20} />
        </button>
        <Diamond className="h-5 w-5" style={{ color: COLORS.gold }} />
        <span className="font-bold" style={{ color: COLORS.gold }}>Admin</span>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 start-0 z-50 w-60 bg-card shadow-xl"
            >
              <div className="flex h-16 items-center justify-between px-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <Diamond className="h-6 w-6" style={{ color: COLORS.gold }} />
                  <span className="text-lg font-bold" style={{ color: COLORS.gold }}>Admin</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="rounded-full p-1 hover:bg-accent">
                  <X size={18} />
                </button>
              </div>
              <nav className="p-3 space-y-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        isActive
                          ? 'bg-[#C9A96E]/10 text-[#C9A96E]'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                      }`}
                    >
                      <link.icon size={18} />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="lg:ms-60">
        {children}
      </main>
    </div>
  );
}

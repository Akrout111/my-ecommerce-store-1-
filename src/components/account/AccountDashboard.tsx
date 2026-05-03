"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Package, Heart, MapPin, Lock, Eye,
  Pencil, Trash2, X, LogOut,
  Smartphone, Mail, Bell, Shield, AlertTriangle, Camera,
} from "lucide-react";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/types/product";

interface Order {
  id: string; date: string; status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  items: { name: string; image?: string; size?: string; color?: string; qty: number; price: number }[];
  total: number; shippingAddress: string; paymentMethod: string; trackingNumber?: string;
}

interface Address {
  id: string; label: string; firstName: string; lastName: string;
  street: string; city: string; state: string; postalCode: string;
  country: string; phone: string; isDefault: boolean;
}

interface AccountDashboardProps {
  user: { id: string; name: string; email: string; image?: string; };
  orders: Order[];
  wishlist: Product[];
  addresses: Address[];
}

const tabItems = [
  { id: "profile", label: "Profile", icon: User },
  { id: "orders", label: "Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "security", label: "Security", icon: Lock },
];

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500",
  paid: "bg-green-500/10 text-green-500",
  shipped: "bg-blue-500/10 text-blue-500",
  delivered: "bg-emerald-500/10 text-emerald-500",
  cancelled: "bg-red-500/10 text-red-500",
};

const profileSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  dob: z.string().optional(),
  gender: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const addressSchema = z.object({
  label: z.string().min(1),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  street: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(1),
  postalCode: z.string().min(3),
  country: z.string().min(2),
  phone: z.string().min(5),
  isDefault: z.boolean(),
});

type AddressFormData = z.input<typeof addressSchema>;

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((d) => d.newPassword === d.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });

type PasswordFormData = z.infer<typeof passwordSchema>;

function PasswordStrength({ password }: { password: string }) {
  const score = (() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();
  const labels = ["Too short", "Weak", "Fair", "Good", "Strong"];
  const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-green-600"];
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[1,2,3,4].map((i) => <div key={i} className={`h-1 flex-1 rounded-full transition ${i <= score ? colors[score] : "bg-muted"}`} />)}
      </div>
      <p className="text-xs text-muted-foreground">Strength: <span className="font-medium">{labels[score]}</span></p>
    </div>
  );
}

export function AccountDashboard({ user, orders, wishlist, addresses: initialAddresses }: AccountDashboardProps) {
  const [activeTab, setActiveTab] = useState("profile");
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [twoFaDialogOpen, setTwoFaDialogOpen] = useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, sms: false, newsletter: true });

  const profileForm = useForm<ProfileFormData>({ resolver: zodResolver(profileSchema), defaultValues: { name: user.name, phone: "", dob: "", gender: "" } });
  const addressForm = useForm<AddressFormData>({ resolver: zodResolver(addressSchema) });
  const passwordForm = useForm<PasswordFormData>({ resolver: zodResolver(passwordSchema) });

  const filteredOrders = orderFilter === "all" ? orders : orders.filter((o) => o.status === orderFilter);

  const onSaveAddress = (data: AddressFormData) => {
    if (editingAddress) {
      setAddresses((prev) => prev.map((a) => (a.id === editingAddress.id ? { ...a, ...data } : a)));
    } else {
      const newAddr: Address = { id: "addr_" + Date.now(), ...data };
      if (data.isDefault) setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: false })).concat(newAddr));
      else setAddresses((prev) => [...prev, newAddr]);
    }
    setAddressDialogOpen(false);
    setEditingAddress(null);
    addressForm.reset();
  };

  const onDeleteAddress = (id: string) => setAddresses((prev) => prev.filter((a) => a.id !== id));
  const onSetDefault = (id: string) => setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));

  const openEditAddress = (addr: Address) => {
    setEditingAddress(addr);
    addressForm.reset(addr);
    setAddressDialogOpen(true);
  };

  const openAddAddress = () => {
    setEditingAddress(null);
    addressForm.reset();
    setAddressDialogOpen(true);
  };

  const openOrderDetail = (order: Order) => { setSelectedOrder(order); setOrderDetailOpen(true); };

  const tabContent = {
    profile: (
      <div className="space-y-8">
        {/* Profile Card */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="relative">
              <div className="flex h-[120px] w-[120px] items-center justify-center overflow-hidden rounded-full bg-[#C9A96E]/10 text-4xl font-bold text-[#C9A96E]">
                {user.image ? <Image src={user.image} alt={user.name} width={120} height={120} className="h-full w-full object-cover" /> : user.name[0]}
              </div>
              <button onClick={() => setPhotoDialogOpen(true)} className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#C9A96E] text-[#0F0F0F] shadow-md transition hover:bg-[#B8944E]"><Camera size={14} /></button>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold">{user.name}</h2>
              <div className="mt-1 flex items-center justify-center gap-2 sm:justify-start">
                <span className="text-sm text-muted-foreground">{user.email}</span>
                <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-500">Verified ✓</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Member since January 2026</p>
            </div>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-bold">Edit Profile</h3>
          <form onSubmit={profileForm.handleSubmit(() => {})} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Full Name</label>
              <input {...profileForm.register("name")} className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" />
              {profileForm.formState.errors.name && <p className="mt-1 text-xs text-destructive">{profileForm.formState.errors.name.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">Email</label>
              <input value={user.email} disabled className="w-full rounded-xl border bg-muted px-4 py-3 text-sm text-muted-foreground" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Phone</label>
              <input {...profileForm.register("phone")} type="tel" placeholder="+1 (555) 000-0000" className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Date of Birth</label>
              <input {...profileForm.register("dob")} type="date" className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium">Gender</label>
              <select {...profileForm.register("gender")} className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not">Prefer not to say</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <motion.button type="submit" className="h-12 rounded-full bg-[#C9A96E] px-8 font-semibold text-[#0F0F0F]" whileTap={{ scale: 0.98 }}>Save Changes</motion.button>
            </div>
          </form>
        </div>

        {/* Preferences */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-bold">Preferences</h3>
          <div className="space-y-4">
            {[
              { key: "email" as const, label: "Email Notifications", desc: "Receive order updates and promotions", icon: Mail },
              { key: "sms" as const, label: "SMS Notifications", desc: "Get text alerts for shipping and delivery", icon: Smartphone },
              { key: "newsletter" as const, label: "Newsletter Subscription", desc: "Weekly style tips and exclusive offers", icon: Bell },
            ].map((pref) => (
              <div key={pref.key} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C9A96E]/10"><pref.icon size={16} className="text-[#C9A96E]" /></div>
                  <div>
                    <p className="text-sm font-medium">{pref.label}</p>
                    <p className="text-xs text-muted-foreground">{pref.desc}</p>
                  </div>
                </div>
                <button onClick={() => setNotifications((p) => ({ ...p, [pref.key]: !p[pref.key] }))} className={`relative h-6 w-11 rounded-full transition-colors ${notifications[pref.key] ? "bg-[#C9A96E]" : "bg-muted"}`}>
                  <motion.div className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow" animate={{ left: notifications[pref.key] ? 22 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),

    orders: (
      <div>
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-16">
            <Package size={48} className="text-muted-foreground/30" />
            <h3 className="mt-4 text-lg font-bold">No orders yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Start shopping to see your orders here</p>
            <a href="/products" className="mt-4 rounded-full bg-[#C9A96E] px-6 py-2.5 text-sm font-semibold text-[#0F0F0F]">Start Shopping</a>
          </div>
        ) : (
          <>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium">Filter:</span>
              {["all", "pending", "shipped", "delivered"].map((f) => (
                <button key={f} onClick={() => setOrderFilter(f)} className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition ${orderFilter === f ? "bg-[#C9A96E] text-[#0F0F0F]" : "border border-border hover:border-[#C9A96E]"}`}>{f}</button>
              ))}
            </div>
            <div className="space-y-3">
              {filteredOrders.map((order) => (
                <div key={order.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold">{order.id}</span>
                      <span className="text-xs text-muted-foreground">{order.date}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[order.status]}`}>{order.status}</span>
                    </div>
                    <span className="font-bold">${order.total.toFixed(2)}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    {order.items.slice(0, 3).map((item, i) => (
                      <div key={i} className="relative h-10 w-10 overflow-hidden rounded-lg bg-muted">
                        {item.image ? <Image src={item.image} alt={item.name} fill className="object-cover" sizes="40px" /> : <div className="flex h-full w-full items-center justify-center text-xs">👕</div>}
                      </div>
                    ))}
                    {order.items.length > 3 && <span className="text-xs text-muted-foreground">+{order.items.length - 3} more</span>}
                  </div>
                  <button onClick={() => openOrderDetail(order)} className="mt-3 text-sm text-[#C9A96E] underline-offset-2 hover:underline">View Details →</button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    ),

    wishlist: (
      <div>
        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-16">
            <Heart size={48} className="text-muted-foreground/30" />
            <h3 className="mt-4 text-lg font-bold">Your wishlist is empty</h3>
            <p className="mt-1 text-sm text-muted-foreground">Save your favorite items to view them here</p>
            <a href="/products" className="mt-4 rounded-full bg-[#C9A96E] px-6 py-2.5 text-sm font-semibold text-[#0F0F0F]">Browse Products</a>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {wishlist.map((p) => (
              <div key={p.id} className="group relative">
                <ProductCard product={p} variant="compact" />
              </div>
            ))}
          </div>
        )}
      </div>
    ),

    addresses: (
      <div>
        {addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-16">
            <MapPin size={48} className="text-muted-foreground/30" />
            <h3 className="mt-4 text-lg font-bold">No saved addresses</h3>
            <p className="mt-1 text-sm text-muted-foreground">Add an address for faster checkout</p>
            <button onClick={openAddAddress} className="mt-4 rounded-full bg-[#C9A96E] px-6 py-2.5 text-sm font-semibold text-[#0F0F0F]">Add Address</button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-end">
              <button onClick={openAddAddress} className="rounded-full bg-[#C9A96E] px-4 py-2 text-sm font-semibold text-[#0F0F0F]">+ Add New Address</button>
            </div>
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div key={addr.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{addr.label}</span>
                        {addr.isDefault && <span className="rounded-full bg-[#C9A96E]/10 px-2 py-0.5 text-[10px] font-medium text-[#C9A96E]">Default</span>}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{addr.firstName} {addr.lastName}</p>
                      <p className="text-sm text-muted-foreground">{addr.street}</p>
                      <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} {addr.postalCode}</p>
                      <p className="text-sm text-muted-foreground">{addr.country}</p>
                      <p className="text-sm text-muted-foreground">{addr.phone}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openEditAddress(addr)} className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-accent"><Pencil size={14} /></button>
                      <button onClick={() => onDeleteAddress(addr.id)} className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-accent hover:text-destructive"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  {!addr.isDefault && (
                    <button onClick={() => onSetDefault(addr.id)} className="mt-2 text-xs text-[#C9A96E] underline-offset-2 hover:underline">Set as Default</button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    ),

    security: (
      <div className="space-y-8">
        {/* Change Password */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-bold">Change Password</h3>
          <form onSubmit={passwordForm.handleSubmit(() => { passwordForm.reset(); })} className="max-w-md space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Current Password</label>
              <div className="relative">
                <input {...passwordForm.register("currentPassword")} type={showCurrentPassword ? "text" : "password"} className="w-full rounded-xl border bg-background py-3 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" />
                <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Eye size={16} /></button>
              </div>
              {passwordForm.formState.errors.currentPassword && <p className="mt-1 text-xs text-destructive">{passwordForm.formState.errors.currentPassword.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">New Password</label>
              <div className="relative">
                <input {...passwordForm.register("newPassword")} type={showNewPassword ? "text" : "password"} className="w-full rounded-xl border bg-background py-3 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" />
                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Eye size={16} /></button>
              </div>
              {/* eslint-disable-next-line react-hooks/incompatible-library */}
              <PasswordStrength password={passwordForm.watch("newPassword") || ""} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Confirm New Password</label>
              <div className="relative">
                <input {...passwordForm.register("confirmPassword")} type={showConfirmPassword ? "text" : "password"} className="w-full rounded-xl border bg-background py-3 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Eye size={16} /></button>
              </div>
              {passwordForm.formState.errors.confirmPassword && <p className="mt-1 text-xs text-destructive">{passwordForm.formState.errors.confirmPassword.message}</p>}
            </div>
            <motion.button type="submit" className="h-12 rounded-full bg-[#C9A96E] px-8 font-semibold text-[#0F0F0F]" whileTap={{ scale: 0.98 }}>Update Password</motion.button>
          </form>
        </div>

        {/* 2FA */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#C9A96E]/10"><Shield size={18} className="text-[#C9A96E]" /></div>
              <div>
                <h3 className="font-bold">Two-Factor Authentication</h3>
                <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Not Enabled</span>
              <button onClick={() => setTwoFaDialogOpen(true)} className="rounded-full border border-[#C9A96E] px-4 py-1.5 text-xs font-medium text-[#C9A96E] transition hover:bg-[#C9A96E] hover:text-[#0F0F0F]">Enable 2FA</button>
            </div>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-bold">Active Sessions</h3>
          <div className="space-y-3">
            {[
              { browser: "Chrome", os: "macOS", location: "New York, USA", time: "Current session", current: true },
              { browser: "Safari", os: "iOS", location: "London, UK", time: "2 hours ago", current: false },
              { browser: "Firefox", os: "Windows", location: "Dubai, UAE", time: "3 days ago", current: false },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium">{s.browser} on {s.os} {s.current && <span className="ml-1 text-[10px] text-green-500">● Current</span>}</p>
                  <p className="text-xs text-muted-foreground">{s.location} · {s.time}</p>
                </div>
                {!s.current && <button className="rounded-lg px-3 py-1 text-xs font-medium text-destructive transition hover:bg-destructive/10">Sign out</button>}
              </div>
            ))}
          </div>
          <button className="mt-3 text-xs text-destructive underline-offset-2 hover:underline">Sign out all other sessions</button>
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-destructive" />
            <h3 className="font-bold text-destructive">Danger Zone</h3>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Once you delete your account, there is no going back. Please be certain.</p>
          <button onClick={() => setDeleteDialogOpen(true)} className="mt-3 rounded-full border border-destructive px-4 py-2 text-sm font-medium text-destructive transition hover:bg-destructive hover:text-white">Delete Account</button>
        </div>
      </div>
    ),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">My Account</h1>
      <p className="text-sm text-muted-foreground">Manage your profile, orders, and preferences</p>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <aside className="lg:w-[240px] lg:flex-shrink-0">
          {/* Desktop vertical tabs */}
          <div className="hidden lg:block">
            <div className="space-y-1">
              {tabItems.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${activeTab === tab.id ? "bg-[#C9A96E]/10 text-[#C9A96E]" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}>
                    <Icon size={18} /> {tab.label}
                  </button>
                );
              })}
            </div>
            <hr className="my-4 border-border" />
            <button onClick={() => signOut({ callbackUrl: "/" })} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-destructive transition hover:bg-destructive/10">
              <LogOut size={18} /> Sign Out
            </button>
          </div>

          {/* Mobile horizontal tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 lg:hidden">
            {tabItems.map((tab) => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition ${activeTab === tab.id ? "bg-[#C9A96E] text-[#0F0F0F]" : "border border-border text-muted-foreground"}`}>
                  <Icon size={14} /> {tab.label}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {tabContent[activeTab as keyof typeof tabContent]}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Address Dialog */}
      <Dialog.Root open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-background p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <Dialog.Title className="text-lg font-bold">{editingAddress ? "Edit Address" : "Add New Address"}</Dialog.Title>
              <Dialog.Close className="rounded-full p-1 transition hover:bg-muted"><X size={20} /></Dialog.Close>
            </div>
            <form onSubmit={addressForm.handleSubmit(onSaveAddress)} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Label</label>
                <select {...addressForm.register("label")} className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]">
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">First Name</label>
                  <input {...addressForm.register("firstName")} className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" />
                  {addressForm.formState.errors.firstName && <p className="mt-1 text-xs text-destructive">{addressForm.formState.errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Last Name</label>
                  <input {...addressForm.register("lastName")} className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" />
                  {addressForm.formState.errors.lastName && <p className="mt-1 text-xs text-destructive">{addressForm.formState.errors.lastName.message}</p>}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Street Address</label>
                <input {...addressForm.register("street")} className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" />
                {addressForm.formState.errors.street && <p className="mt-1 text-xs text-destructive">{addressForm.formState.errors.street.message}</p>}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">City</label>
                  <input {...addressForm.register("city")} className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">State</label>
                  <input {...addressForm.register("state")} className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">ZIP</label>
                  <input {...addressForm.register("postalCode")} className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Country</label>
                <input {...addressForm.register("country")} className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Phone</label>
                <input {...addressForm.register("phone")} type="tel" className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" />
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" {...addressForm.register("isDefault")} className="h-4 w-4 rounded border-border text-[#C9A96E] focus:ring-[#C9A96E]" />
                <span className="text-sm">Set as default address</span>
              </label>
              <motion.button type="submit" className="h-12 w-full rounded-full bg-[#C9A96E] font-semibold text-[#0F0F0F]" whileTap={{ scale: 0.98 }}>Save Address</motion.button>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Order Detail Dialog */}
      <Dialog.Root open={orderDetailOpen} onOpenChange={setOrderDetailOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-background p-6 shadow-xl max-h-[85vh] overflow-y-auto">
            {selectedOrder && (
              <>
                <div className="flex items-center justify-between">
                  <Dialog.Title className="text-lg font-bold">{selectedOrder.id}</Dialog.Title>
                  <Dialog.Close className="rounded-full p-1 transition hover:bg-muted"><X size={20} /></Dialog.Close>
                </div>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{selectedOrder.date}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[selectedOrder.status]}`}>{selectedOrder.status}</span>
                  </div>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-lg border border-border p-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-muted">
                          {item.image ? <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" /> : <div className="flex h-full w-full items-center justify-center text-sm">👕</div>}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.size && `Size: ${item.size}`}{item.color && ` · Color: ${item.color}`} · Qty: {item.qty}</p>
                        </div>
                        <span className="text-sm font-medium">${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${(selectedOrder.total * 0.92).toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>${(selectedOrder.total * 0.05).toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>${(selectedOrder.total * 0.03).toFixed(2)}</span></div>
                    <hr className="border-border" />
                    <div className="flex justify-between font-bold"><span>Total</span><span className="text-[#C9A96E]">${selectedOrder.total.toFixed(2)}</span></div>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-sm">
                    <p className="font-medium">Shipping Address</p>
                    <p className="text-muted-foreground">{selectedOrder.shippingAddress}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-sm">
                    <p className="font-medium">Payment Method</p>
                    <p className="text-muted-foreground">{selectedOrder.paymentMethod}</p>
                  </div>
                  {selectedOrder.trackingNumber && (
                    <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                      <div className="text-sm">
                        <p className="font-medium">Tracking Number</p>
                        <p className="font-mono text-xs text-muted-foreground">{selectedOrder.trackingNumber}</p>
                      </div>
                      <a href="#" className="text-xs text-[#C9A96E] underline-offset-2 hover:underline">Track Order</a>
                    </div>
                  )}
                  <button className="w-full rounded-full border border-[#C9A96E] py-2.5 text-sm font-medium text-[#C9A96E] transition hover:bg-[#C9A96E] hover:text-[#0F0F0F]">Download Invoice</button>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* 2FA Dialog */}
      <Dialog.Root open={twoFaDialogOpen} onOpenChange={setTwoFaDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-background p-6 shadow-xl text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A96E]/10"><Shield size={28} className="text-[#C9A96E]" /></div>
            <Dialog.Title className="text-lg font-bold">Enable Two-Factor Authentication</Dialog.Title>
            <p className="mt-2 text-sm text-muted-foreground">Scan the QR code below with your authenticator app to get started.</p>
            <div className="mx-auto my-6 flex h-40 w-40 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted">
              <span className="text-xs text-muted-foreground">QR Code Placeholder</span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setTwoFaDialogOpen(false)} className="flex-1 rounded-full border border-border py-2.5 text-sm font-medium">Cancel</button>
              <button onClick={() => setTwoFaDialogOpen(false)} className="flex-1 rounded-full bg-[#C9A96E] py-2.5 text-sm font-semibold text-[#0F0F0F]">Confirm</button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Delete Account Dialog */}
      <Dialog.Root open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-background p-6 shadow-xl">
            <div className="flex items-center gap-2 text-destructive"><AlertTriangle size={20} /><Dialog.Title className="text-lg font-bold">Delete Account</Dialog.Title></div>
            <p className="mt-2 text-sm text-muted-foreground">This action cannot be undone. All your data will be permanently removed.</p>
            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium">Enter your password to confirm</label>
              <input type="password" className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-destructive" placeholder="Current password" />
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={() => setDeleteDialogOpen(false)} className="flex-1 rounded-full border border-border py-2.5 text-sm font-medium">Cancel</button>
              <button onClick={() => setDeleteDialogOpen(false)} className="flex-1 rounded-full bg-destructive py-2.5 text-sm font-semibold text-white">Delete Account</button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Photo Upload Dialog */}
      <Dialog.Root open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-background p-6 shadow-xl text-center">
            <Dialog.Title className="text-lg font-bold">Change Photo</Dialog.Title>
            <div className="mx-auto my-6 flex h-32 w-32 items-center justify-center rounded-full border-2 border-dashed border-border bg-muted">
              <Camera size={32} className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Drag and drop or click to upload a new profile photo</p>
            <button onClick={() => setPhotoDialogOpen(false)} className="mt-4 w-full rounded-full bg-[#C9A96E] py-2.5 text-sm font-semibold text-[#0F0F0F]">Upload Photo</button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

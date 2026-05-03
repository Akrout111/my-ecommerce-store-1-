'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, MapPin, Mail, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface OrderItem {
  id: string;
  name: string;
  brand: string;
  imageUrl: string | null;
  price: number;
  quantity: number;
  size: string | null;
  color: string | null;
}

interface OrderData {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  couponCode: string | null;
  guestEmail: string | null;
  shippingAddress: Record<string, string>;
  items: OrderItem[];
}

export function OrderConfirmationClient({ order }: { order: OrderData }) {
  const statusColor =
    order.status === 'paid'
      ? 'text-green-500'
      : order.status === 'pending'
        ? 'text-yellow-500'
        : order.status === 'failed'
          ? 'text-red-500'
          : 'text-muted-foreground';

  const statusLabel = order.status.charAt(0).toUpperCase() + order.status.slice(1);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl mx-auto"
      >
        {/* Success Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'rgba(201, 169, 110, 0.2)' }}
          >
            <CheckCircle className="w-10 h-10 text-[#C9A96E]" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for shopping with Persona. Your order has been placed successfully.
          </p>
        </div>

        {/* Order Info Card */}
        <div className="rounded-2xl border border-border bg-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-[#C9A96E]" />
              <span className="font-semibold">Order Number</span>
            </div>
            <span className={`text-sm font-semibold ${statusColor}`}>{statusLabel}</span>
          </div>
          <p className="text-lg font-mono text-muted-foreground mb-2">{order.orderNumber}</p>
          <p className="text-sm text-muted-foreground">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
          {order.guestEmail && (
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Mail size={14} /> {order.guestEmail}
            </div>
          )}
        </div>

        {/* Shipping Address */}
        {order.shippingAddress && Object.keys(order.shippingAddress).length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-6 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={16} className="text-[#C9A96E]" />
              <h3 className="font-semibold">Shipping Address</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
              {order.shippingAddress.address}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
              {order.shippingAddress.country}
            </p>
          </div>
        )}

        {/* Order Items */}
        <div className="rounded-2xl border border-border bg-card p-6 mb-6">
          <h3 className="font-semibold mb-4">Items Ordered</h3>
          <div className="max-h-64 space-y-3 overflow-y-auto">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="56px" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg">👕</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.brand}
                    {item.size ? ` · Size: ${item.size}` : ''}
                    {item.color ? ` · ${item.color}` : ''}
                    {` · Qty: ${item.quantity}`}
                  </p>
                </div>
                <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <hr className="my-4 border-border" />

          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-500">
                <span className="flex items-center gap-1">
                  <Tag size={12} /> {order.couponCode && `(${order.couponCode})`} Discount
                </span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <hr className="border-border" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-[#C9A96E]">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#C9A96E] px-8 py-3 font-semibold text-[#0F0F0F] transition hover:opacity-90"
          >
            Continue Shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

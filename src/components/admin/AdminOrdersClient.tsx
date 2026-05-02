'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface OrderItem { id: string; name: string; brand: string; price: number; quantity: number; size?: string; color?: string; }

interface Order {
  id: string; orderNumber: string; status: string; total: number; subtotal: number;
  createdAt: string; items: OrderItem[];
}

const statusColors: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-500',
  paid: 'bg-green-500/10 text-green-500',
  shipped: 'bg-blue-500/10 text-blue-500',
  delivered: 'bg-emerald-500/10 text-emerald-500',
  failed: 'bg-red-500/10 text-red-500',
};

export function AdminOrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const filtered = orders.filter(o => !statusFilter || o.status === statusFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#C9A96E]" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b border-border/50 hover:bg-accent/30 transition">
                <td className="px-4 py-3 font-mono text-xs">{order.orderNumber}</td>
                <td className="px-4 py-3">{order.items?.length || 0} items</td>
                <td className="px-4 py-3 font-medium">${order.total.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[order.status] || 'bg-muted text-muted-foreground'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No orders found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

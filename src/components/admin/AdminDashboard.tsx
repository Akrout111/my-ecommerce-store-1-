"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  MoreHorizontal,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Mock Data
const revenueData = Array.from({ length: 30 }, (_, i) => {
  const base = 1500 + Math.sin(i * 0.5) * 800;
  const noise = (Math.random() - 0.5) * 1200;
  return {
    day: i + 1,
    revenue: Math.max(800, Math.min(4200, Math.round(base + noise))),
  };
});

const categoryData = [
  { name: "Women", revenue: 18500 },
  { name: "Men", revenue: 14200 },
  { name: "Kids", revenue: 8900 },
  { name: "Shoes", revenue: 12100 },
  { name: "Accessories", revenue: 7600 },
  { name: "Beauty", revenue: 5400 },
];

const pieColors = [
  "#C9A96E",
  "#E8A0BF",
  "#B8D4E3",
  "#D4B98A",
  "#A8C5A0",
  "#F5C2C2",
];

const topProducts = [
  { name: "Silk Wrap Midi Dress", category: "Women", sales: 128, revenue: 18560, trend: "+" },
  { name: "Tailored Linen Blazer", category: "Men", sales: 96, revenue: 14400, trend: "+" },
  { name: "Leather Ankle Boots", category: "Shoes", sales: 84, revenue: 12600, trend: "+" },
  { name: "Cashmere Scarf", category: "Accessories", sales: 72, revenue: 5040, trend: "-" },
  { name: "Kids Denim Jacket", category: "Kids", sales: 65, revenue: 3250, trend: "+" },
];

const recentOrders = [
  { id: "ORD-7821", customer: "Sarah Mitchell", email: "sarah.m@email.com", amount: 245.99, status: "paid" as const, date: "2026-04-30" },
  { id: "ORD-7820", customer: "James Cooper", email: "james.c@email.com", amount: 189.50, status: "shipped" as const, date: "2026-04-30" },
  { id: "ORD-7819", customer: "Aisha Rahman", email: "aisha.r@email.com", amount: 420.00, status: "delivered" as const, date: "2026-04-29" },
  { id: "ORD-7818", customer: "Michael Chen", email: "m.chen@email.com", amount: 78.99, status: "pending" as const, date: "2026-04-29" },
  { id: "ORD-7817", customer: "Emma Wilson", email: "emma.w@email.com", amount: 312.50, status: "paid" as const, date: "2026-04-28" },
  { id: "ORD-7816", customer: "David Park", email: "d.park@email.com", amount: 156.00, status: "shipped" as const, date: "2026-04-28" },
  { id: "ORD-7815", customer: "Olivia Brown", email: "olivia.b@email.com", amount: 89.99, status: "delivered" as const, date: "2026-04-27" },
  { id: "ORD-7814", customer: "Lucas Martinez", email: "lucas.m@email.com", amount: 199.00, status: "paid" as const, date: "2026-04-27" },
];

const statCards = [
  {
    label: "Total Revenue",
    value: "$48,291",
    change: "+12.5%",
    trend: "up" as const,
    icon: DollarSign,
    iconBg: "bg-[#C9A96E]/10",
    iconColor: "text-[#C9A96E]",
  },
  {
    label: "Total Orders",
    value: "1,284",
    change: "+8.3%",
    trend: "up" as const,
    icon: ShoppingBag,
    iconBg: "bg-[#E8A0BF]/10",
    iconColor: "text-[#E8A0BF]",
  },
  {
    label: "Active Products",
    value: "342",
    change: "+2.1%",
    trend: "up" as const,
    icon: Package,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
  },
  {
    label: "New Customers",
    value: "89",
    change: "+18.7%",
    trend: "up" as const,
    icon: Users,
    iconBg: "bg-green-500/10",
    iconColor: "text-green-500",
  },
];

const statusStyles = {
  paid: "bg-green-500/10 text-green-500",
  shipped: "bg-blue-500/10 text-blue-500",
  pending: "bg-amber-500/10 text-amber-500",
  delivered: "bg-emerald-500/10 text-emerald-500",
};

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-[#C9A96E]/30 bg-background px-3 py-2 shadow-lg">
        <p className="text-xs text-muted-foreground">Day {label}</p>
        <p className="text-sm font-semibold text-[#C9A96E]">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
}

export function AdminDashboard() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground">
            Good morning, Admin 👋
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium transition hover:bg-accent">
          Last 30 days
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((card) => (
          <motion.div
            key={card.label}
            className="rounded-2xl border border-border bg-card p-6"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="mt-1 text-2xl font-bold">{card.value}</p>
                <div
                  className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${
                    card.trend === "up" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {card.trend === "up" ? (
                    <TrendingUp size={12} />
                  ) : (
                    <TrendingDown size={12} />
                  )}
                  {card.change}
                </div>
              </div>
              <div className={`rounded-xl p-2.5 ${card.iconBg}`}>
                <card.icon size={20} className={card.iconColor} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Revenue Trend */}
        <motion.div
          className="col-span-2 rounded-2xl border border-border bg-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold">Revenue Trend</h3>
            <span className="text-xs text-muted-foreground">Last 30 days</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A96E" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#C9A96E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => (v % 5 === 0 ? `Day ${v}` : "")}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `$${v}`}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#C9A96E"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Sales by Category */}
        <motion.div
          className="rounded-2xl border border-border bg-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="mb-4 font-bold">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="revenue"
              >
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index]} />
                ))}
              </Pie>
              <Tooltip
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => `$${Number(value).toLocaleString()}`}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--background))",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                formatter={(value: string) => (
                  <span className="text-xs">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Top Products */}
        <motion.div
          className="rounded-2xl border border-border bg-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold">Top Products</h3>
            <button className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-accent">
              <MoreHorizontal size={16} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="pb-3 font-medium">Product</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Sales</th>
                  <th className="pb-3 font-medium">Revenue</th>
                  <th className="pb-3 font-medium">Trend</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product) => (
                  <tr
                    key={product.name}
                    className="border-b border-border/50 transition hover:bg-accent/50"
                  >
                    <td className="py-3 font-medium">{product.name}</td>
                    <td className="py-3 text-muted-foreground">
                      {product.category}
                    </td>
                    <td className="py-3">{product.sales}</td>
                    <td className="py-3 font-medium">
                      ${product.revenue.toLocaleString()}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                          product.trend === "+"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {product.trend === "+" ? (
                          <ArrowUpRight size={12} />
                        ) : (
                          <TrendingDown size={12} />
                        )}
                        {product.trend}12%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          className="rounded-2xl border border-border bg-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold">Recent Orders</h3>
            <button className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-accent">
              <MoreHorizontal size={16} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="pb-3 font-medium">Order</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-border/50 transition hover:bg-accent/50"
                  >
                    <td className="py-3 font-mono text-xs">{order.id}</td>
                    <td className="py-3">
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.email}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 font-medium">
                      ${order.amount.toFixed(2)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          statusStyles[order.status]
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

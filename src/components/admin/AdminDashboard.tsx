"use client";

import { useState } from "react";
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
import { useQuery } from "@tanstack/react-query";

// Types
interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  ordersByStatus: Array<{ status: string; count: number }>;
  categoryData: Array<{ name: string; revenue: number }>;
  topProducts: Array<{
    id: string;
    name: string;
    category: string;
    sales: number;
    revenue: number;
  }>;
  recentOrders: Array<{
    id: string;
    customer: string;
    email: string;
    amount: number;
    status: string;
    date: string;
  }>;
  period: { days: number; startDate: string; endDate: string };
}

interface RevenueData {
  dailyRevenue: Array<{ date: string; revenue: number }>;
  totalRevenue: number;
  startDate: string;
  endDate: string;
}

const pieColors = [
  "#C9A96E",
  "#E8A0BF",
  "#B8D4E3",
  "#D4B98A",
  "#A8C5A0",
  "#F5C2C2",
];

const statusStyles: Record<string, string> = {
  paid: "bg-green-500/10 text-green-500",
  shipped: "bg-blue-500/10 text-blue-500",
  pending: "bg-amber-500/10 text-amber-500",
  delivered: "bg-emerald-500/10 text-emerald-500",
  cancelled: "bg-red-500/10 text-red-500",
};

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-[#C9A96E]/30 bg-background px-3 py-2 shadow-lg">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-[#C9A96E]">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-7 w-20 animate-pulse rounded bg-muted" />
          <div className="h-3 w-16 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-5 w-32 animate-pulse rounded bg-muted" />
        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
      </div>
      <div className="flex h-[280px] items-end gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 animate-pulse rounded-t bg-muted"
            style={{ height: `${30 + ((i * 37) % 70)}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-4 h-5 w-32 animate-pulse rounded bg-muted" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            <div className="h-4 w-16 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-3 rounded-full bg-muted p-3">
        <ShoppingBag size={24} className="text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function AdminDashboard() {
  const [period, setPeriod] = useState<7 | 30 | 90>(30);

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["admin-analytics", period],
    queryFn: async () => {
      const res = await fetch(`/api/admin/analytics?days=${period}`);
      if (!res.ok) throw new Error("Failed to fetch analytics");
      const json = await res.json();
      return json.data as AnalyticsData;
    },
  });

  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ["admin-revenue", period],
    queryFn: async () => {
      const endDate = new Date().toISOString().split("T")[0];
      const startDate = new Date(
        Date.now() - period * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0];
      const res = await fetch(
        `/api/admin/analytics/revenue?startDate=${startDate}&endDate=${endDate}`
      );
      if (!res.ok) throw new Error("Failed to fetch revenue data");
      const json = await res.json();
      return json.data as RevenueData;
    },
  });

  const statCards = analytics
    ? [
        {
          label: "Total Revenue",
          value: `$${analytics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          change: analytics.totalOrders > 0 ? `+${period}d` : "—",
          trend: analytics.totalRevenue > 0 ? ("up" as const) : ("down" as const),
          icon: DollarSign,
          iconBg: "bg-[#C9A96E]/10",
          iconColor: "text-[#C9A96E]",
        },
        {
          label: "Total Orders",
          value: analytics.totalOrders.toLocaleString(),
          change: `Last ${period} days`,
          trend: "up" as const,
          icon: ShoppingBag,
          iconBg: "bg-[#E8A0BF]/10",
          iconColor: "text-[#E8A0BF]",
        },
        {
          label: "Total Products",
          value: analytics.totalProducts.toLocaleString(),
          change: "In catalog",
          trend: "up" as const,
          icon: Package,
          iconBg: "bg-orange-500/10",
          iconColor: "text-orange-500",
        },
        {
          label: "Total Customers",
          value: analytics.totalCustomers.toLocaleString(),
          change: "Registered",
          trend: "up" as const,
          icon: Users,
          iconBg: "bg-green-500/10",
          iconColor: "text-green-500",
        },
      ]
    : [];

  const revenueChart = revenueData?.dailyRevenue.map((d) => ({
    day: d.date.slice(5), // MM-DD
    revenue: d.revenue,
  })) || [];

  const categoryChart = analytics?.categoryData || [];

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
        <div className="flex gap-2">
          {([7, 30, 90] as const).map((d) => (
            <button
              key={d}
              onClick={() => setPeriod(d)}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition ${
                period === d
                  ? "border-[#C9A96E] bg-[#C9A96E]/10 text-[#C9A96E]"
                  : "border-border bg-card hover:bg-accent"
              }`}
            >
              Last {d} days
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      {analyticsLoading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
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
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Revenue Trend */}
        {revenueLoading ? (
          <motion.div
            className="col-span-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <SkeletonChart />
          </motion.div>
        ) : (
          <motion.div
            className="col-span-2 rounded-2xl border border-border bg-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold">Revenue Trend</h3>
              <span className="text-xs text-muted-foreground">
                Last {period} days
              </span>
            </div>
            {revenueChart.length === 0 || revenueChart.every((d) => d.revenue === 0) ? (
              <EmptyState message="No revenue data for this period" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={revenueChart}>
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#C9A96E"
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="95%"
                        stopColor="#C9A96E"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11 }}
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
            )}
          </motion.div>
        )}

        {/* Sales by Category */}
        {analyticsLoading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <SkeletonChart />
          </motion.div>
        ) : (
          <motion.div
            className="rounded-2xl border border-border bg-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="mb-4 font-bold">Sales by Category</h3>
            {categoryChart.length === 0 ? (
              <EmptyState message="No category data available" />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={categoryChart}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="revenue"
                  >
                    {categoryChart.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={pieColors[index % pieColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any) =>
                      `$${Number(value).toLocaleString()}`
                    }
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
            )}
          </motion.div>
        )}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Top Products */}
        {analyticsLoading ? (
          <SkeletonTable />
        ) : (
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
            {!analytics?.topProducts.length ? (
              <EmptyState message="No product sales data available" />
            ) : (
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
                    {analytics.topProducts.map((product) => (
                      <tr
                        key={product.id}
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
                          <span className="inline-flex items-center gap-0.5 text-xs font-medium text-green-500">
                            <ArrowUpRight size={12} />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {/* Recent Orders */}
        {analyticsLoading ? (
          <SkeletonTable />
        ) : (
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
            {!analytics?.recentOrders.length ? (
              <EmptyState message="No orders yet" />
            ) : (
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
                    {analytics.recentOrders.map((order) => (
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
                              statusStyles[order.status] || "bg-muted text-muted-foreground"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {order.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { success, forbidden, internalError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return forbidden();
    }

    const { searchParams } = request.nextUrl;
    const days = parseInt(searchParams.get('days') || '30', 10);
    const now = new Date();
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const [
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers,
      ordersByStatus,
      recentOrders,
      categorySales,
      topProductsRaw,
    ] = await Promise.all([
      // Total revenue for period
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: 'paid', paidAt: { gte: startDate } },
      }),
      // Total orders for period
      prisma.order.count({
        where: { status: 'paid', paidAt: { gte: startDate } },
      }),
      // Total products
      prisma.product.count(),
      // Total customers
      prisma.user.count({
        where: { role: 'customer' },
      }),
      // Orders by status
      prisma.order.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      // Recent 5 orders
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          user: { select: { name: true, email: true } },
        },
      }),
      // Category sales distribution
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true, price: true },
        where: {
          order: { status: 'paid', paidAt: { gte: startDate } },
        },
        orderBy: { _sum: { quantity: 'desc' } },
      }),
      // Top selling products (by quantity)
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true, price: true },
        where: {
          order: { status: 'paid', paidAt: { gte: startDate } },
        },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),
    ]);

    // Get product details for category sales
    const productIds = categorySales.map((cs) => cs.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, category: true, name: true, brand: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    // Aggregate category sales
    const categoryMap = new Map<string, number>();
    for (const cs of categorySales) {
      const product = productMap.get(cs.productId);
      if (product) {
        const existing = categoryMap.get(product.category) || 0;
        categoryMap.set(product.category, existing + (cs._sum.price || 0) * (cs._sum.quantity || 1));
      }
    }

    const categoryData = Array.from(categoryMap.entries()).map(([name, revenue]) => ({
      name,
      revenue: Math.round(revenue * 100) / 100,
    }));

    // Top products with details
    const topProductIds = topProductsRaw.map((tp) => tp.productId);
    const topProductsDetails = await prisma.product.findMany({
      where: { id: { in: topProductIds } },
      select: { id: true, name: true, category: true },
    });
    const topProductMap = new Map(topProductsDetails.map((p) => [p.id, p]));

    const topProducts = topProductsRaw.map((tp) => {
      const product = topProductMap.get(tp.productId);
      return {
        id: tp.productId,
        name: product?.name || 'Unknown Product',
        category: product?.category || 'Unknown',
        sales: tp._sum.quantity || 0,
        revenue: Math.round((tp._sum.price || 0) * (tp._sum.quantity || 1) * 100) / 100,
      };
    });

    // Format recent orders
    const formattedRecentOrders = recentOrders.map((order) => ({
      id: order.orderNumber,
      customer: order.user?.name || order.guestEmail || 'Guest',
      email: order.user?.email || order.guestEmail || '',
      amount: order.total,
      status: order.status,
      date: order.createdAt.toISOString().split('T')[0],
    }));

    return success({
      totalRevenue: totalRevenue._sum.total || 0,
      totalOrders,
      totalProducts,
      totalCustomers,
      ordersByStatus: ordersByStatus.map((o) => ({
        status: o.status,
        count: o._count.status,
      })),
      categoryData,
      topProducts,
      recentOrders: formattedRecentOrders,
      period: { days, startDate: startDate.toISOString(), endDate: now.toISOString() },
    });
  } catch (error) {
    console.error('[Admin Analytics Error]', error);
    return internalError();
  }
}

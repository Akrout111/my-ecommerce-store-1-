import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { success, forbidden, internalError } from '@/lib/api-response';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return forbidden();
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [totalRevenue, totalOrders, ordersByStatus, recentOrders] = await Promise.all([
      prisma.order.aggregate({ _sum: { total: true }, where: { status: 'paid', paidAt: { gte: thirtyDaysAgo } } }),
      prisma.order.count({ where: { status: 'paid', paidAt: { gte: thirtyDaysAgo } } }),
      prisma.order.groupBy({ by: ['status'], _count: { status: true } }),
      prisma.order.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { items: true } }),
    ]);

    return success({
      totalRevenue: totalRevenue._sum.total || 0,
      totalOrders,
      ordersByStatus: ordersByStatus.map((o) => ({ status: o.status, count: o._count.status })),
      recentOrders,
    });
  } catch {
    return internalError();
  }
}

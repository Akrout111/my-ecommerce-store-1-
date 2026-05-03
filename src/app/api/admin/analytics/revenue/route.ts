import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { success, forbidden, internalError, validationError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return forbidden();
    }

    const { searchParams } = request.nextUrl;
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    const now = new Date();
    const endDate = endDateParam ? new Date(endDateParam) : now;
    const startDate = startDateParam
      ? new Date(startDateParam)
      : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return validationError({ startDate: 'Invalid date format', endDate: 'Invalid date format' });
    }

    // Fetch paid orders in date range
    const orders = await prisma.order.findMany({
      where: {
        status: 'paid',
        paidAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        paidAt: true,
        total: true,
      },
      orderBy: { paidAt: 'asc' },
    });

    // Group by date
    const revenueByDate = new Map<string, number>();
    for (const order of orders) {
      if (order.paidAt) {
        const dateKey = order.paidAt.toISOString().split('T')[0];
        const existing = revenueByDate.get(dateKey) || 0;
        revenueByDate.set(dateKey, existing + order.total);
      }
    }

    // Fill in missing dates with 0
    const dailyRevenue: Array<{ date: string; revenue: number }> = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      const dateKey = current.toISOString().split('T')[0];
      dailyRevenue.push({
        date: dateKey,
        revenue: Math.round((revenueByDate.get(dateKey) || 0) * 100) / 100,
      });
      current.setDate(current.getDate() + 1);
    }

    return success({
      dailyRevenue,
      totalRevenue: dailyRevenue.reduce((sum, d) => sum + d.revenue, 0),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  } catch (error) {
    console.error('[Admin Revenue Analytics Error]', error);
    return internalError();
  }
}

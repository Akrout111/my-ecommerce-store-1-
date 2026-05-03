import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { OrderStatusUpdateInput } from '@/lib/validations/product';
import { success, forbidden, validationError, notFound, internalError } from '@/lib/api-response';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return forbidden();
    }
    const { id } = await params;
    const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
    if (!order) return notFound('Order');
    return success({ order });
  } catch {
    return internalError();
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return forbidden();
    }
    const { id } = await params;
    const body = await request.json();

    const result = OrderStatusUpdateInput.safeParse(body);
    if (!result.success) {
      return validationError(result.error.issues);
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status: result.data.status },
    });
    return success({ order });
  } catch {
    return internalError();
  }
}

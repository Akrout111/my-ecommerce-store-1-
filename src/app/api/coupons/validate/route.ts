import { NextResponse } from 'next/server';
import { validateCoupon } from '@/lib/coupon-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, cartTotal } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { valid: false, discount: 0, message: 'Coupon code is required' },
        { status: 400 }
      );
    }

    if (typeof cartTotal !== 'number' || cartTotal < 0) {
      return NextResponse.json(
        { valid: false, discount: 0, message: 'Valid cart total is required' },
        { status: 400 }
      );
    }

    const result = await validateCoupon(code, cartTotal);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { valid: false, discount: 0, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

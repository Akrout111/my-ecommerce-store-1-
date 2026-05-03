/**
 * Server-side coupon validation service.
 * Coupon codes are stored in the database for dynamic management.
 */

import { prisma } from '@/lib/db';

export interface CouponResult {
  valid: boolean;
  discount: number;
  message: string;
  coupon?: { code: string; discountPercent: number };
}

export async function validateCoupon(
  code: string,
  cartTotal: number
): Promise<CouponResult> {
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!coupon) {
    return { valid: false, discount: 0, message: 'Invalid coupon code' };
  }

  if (!coupon.isActive) {
    return { valid: false, discount: 0, message: 'This coupon is no longer active' };
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return { valid: false, discount: 0, message: 'This coupon has expired' };
  }

  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    return { valid: false, discount: 0, message: 'This coupon has reached its usage limit' };
  }

  if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
    return {
      valid: false,
      discount: 0,
      message: `Minimum order amount is $${coupon.minOrderAmount}`,
    };
  }

  const discount = cartTotal * (coupon.discountPercent / 100);
  return {
    valid: true,
    discount,
    message: `${coupon.discountPercent}% discount applied`,
    coupon: { code: coupon.code, discountPercent: coupon.discountPercent },
  };
}

/**
 * Increment the used count for a coupon after a successful order.
 */
export async function incrementCouponUsage(code: string): Promise<void> {
  await prisma.coupon.update({
    where: { code: code.toUpperCase() },
    data: { usedCount: { increment: 1 } },
  });
}

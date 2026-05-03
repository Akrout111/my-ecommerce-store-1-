/**
 * Server-side coupon validation service.
 * Coupon codes are kept on the server to prevent client-side tampering.
 * To add a new coupon, simply add an entry to the COUPONS array below.
 */

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase: number;
  active: boolean;
}

const COUPONS: Coupon[] = [
  { code: 'PERSONA10', discountType: 'percentage', discountValue: 10, minPurchase: 0, active: true },
  { code: 'SAVE15', discountType: 'percentage', discountValue: 15, minPurchase: 0, active: true },
  { code: 'WELCOME20', discountType: 'percentage', discountValue: 20, minPurchase: 0, active: true },
  { code: 'FIRSTORDER', discountType: 'percentage', discountValue: 20, minPurchase: 0, active: true },
];

export interface CouponValidationResult {
  valid: boolean;
  discount: number;
  message: string;
  coupon?: Coupon;
}

/**
 * Validates a coupon code against the server-side coupon list.
 *
 * @param code     - The coupon code entered by the user (case-insensitive)
 * @param cartTotal - The current cart subtotal before discount
 * @returns Validation result with discount amount and human-readable message
 */
export function validateCoupon(
  code: string,
  cartTotal: number
): CouponValidationResult {
  const normalizedCode = code.toUpperCase().trim();

  const coupon = COUPONS.find((c) => c.code === normalizedCode);

  if (!coupon) {
    return {
      valid: false,
      discount: 0,
      message: 'Invalid coupon code',
    };
  }

  if (!coupon.active) {
    return {
      valid: false,
      discount: 0,
      message: 'This coupon is no longer active',
    };
  }

  if (cartTotal < coupon.minPurchase) {
    return {
      valid: false,
      discount: 0,
      message: `Minimum purchase of $${coupon.minPurchase.toFixed(2)} required`,
    };
  }

  let discount: number;
  let description: string;

  if (coupon.discountType === 'percentage') {
    discount = cartTotal * (coupon.discountValue / 100);
    description = `${coupon.discountValue}% off`;
  } else {
    discount = Math.min(coupon.discountValue, cartTotal);
    description = `$${coupon.discountValue.toFixed(2)} off`;
  }

  return {
    valid: true,
    discount,
    message: `Coupon ${coupon.code} applied — ${description}`,
    coupon,
  };
}

/**
 * Returns the list of active coupon codes (without exposing discount details).
 * Useful for hinting available coupons in the UI.
 */
export function getActiveCouponCodes(): string[] {
  return COUPONS.filter((c) => c.active).map((c) => c.code);
}

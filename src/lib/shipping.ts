import {
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_COST,
  EXPRESS_SHIPPING_COST,
  NEXTDAY_SHIPPING_COST,
} from './constants';

export type ShippingMethod = 'standard' | 'express' | 'nextday';

export function getShippingCost(subtotal: number, method: ShippingMethod): number {
  switch (method) {
    case 'standard':
      return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
    case 'express':
      return EXPRESS_SHIPPING_COST;
    case 'nextday':
      return NEXTDAY_SHIPPING_COST;
  }
}

export function getShippingLabel(method: ShippingMethod, subtotal: number): string {
  const cost = getShippingCost(subtotal, method);
  return cost === 0 ? 'Free' : `$${cost.toFixed(2)}`;
}

import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '@/store/cart-store';
import type { CartItem } from '@/types/cart';

// Helper to create a valid CartItem
function createCartItem(overrides: Partial<CartItem> & { id: string; productId: string; name: string; price: number }): CartItem {
  return {
    product: {
      id: overrides.productId,
      name: overrides.name,
      description: 'Test product description',
      price: overrides.price,
      brand: 'TestBrand',
      images: ['/test.jpg'],
      category: 'test',
      sizes: ['S', 'M', 'L'],
      colors: ['Black', 'White'],
      rating: 4.5,
      reviewCount: 10,
      inStock: true,
      stockCount: 50,
      isFeatured: false,
      isNew: false,
      isBestSeller: false,
      tags: ['test'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    quantity: 1,
    totalPrice: overrides.price,
    ...overrides,
  };
}

// Reset store to initial state before each test
beforeEach(() => {
  useCartStore.setState({
    items: [],
    isOpen: false,
    couponCode: null,
    itemCount: 0,
    subtotal: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 0,
  });
});

describe('Cart Store', () => {
  describe('addItem', () => {
    it('correctly adds items to the cart', () => {
      const store = useCartStore.getState();
      const item = createCartItem({
        id: 'item-1',
        productId: 'prod-1',
        name: 'T-Shirt',
        price: 29.99,
      });

      store.addItem(item);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].id).toBe('item-1');
      expect(state.items[0].productId).toBe('prod-1');
      expect(state.items[0].name).toBe('T-Shirt');
      expect(state.items[0].price).toBe(29.99);
      expect(state.items[0].quantity).toBe(1);
      expect(state.items[0].totalPrice).toBe(29.99);
    });

    it('correctly adds multiple different items', () => {
      const store = useCartStore.getState();
      const item1 = createCartItem({ id: 'item-1', productId: 'prod-1', name: 'T-Shirt', price: 29.99 });
      const item2 = createCartItem({ id: 'item-2', productId: 'prod-2', name: 'Jeans', price: 59.99 });

      store.addItem(item1);
      store.addItem(item2);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(2);
      expect(state.itemCount).toBe(2);
    });

    it('handles adding the same item with same size/color by incrementing quantity', () => {
      const store = useCartStore.getState();
      const item1 = createCartItem({
        id: 'item-1',
        productId: 'prod-1',
        name: 'T-Shirt',
        price: 29.99,
        size: 'M',
        color: 'Black',
      });
      const item2 = createCartItem({
        id: 'item-1',
        productId: 'prod-1',
        name: 'T-Shirt',
        price: 29.99,
        size: 'M',
        color: 'Black',
      });

      store.addItem(item1);
      store.addItem(item2);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(2);
      expect(state.items[0].totalPrice).toBe(59.98);
      expect(state.itemCount).toBe(2);
    });

    it('handles adding the same item with different size/color as separate items', () => {
      const store = useCartStore.getState();
      const item1 = createCartItem({
        id: 'item-1',
        productId: 'prod-1',
        name: 'T-Shirt',
        price: 29.99,
        size: 'M',
        color: 'Black',
      });
      const item2 = createCartItem({
        id: 'item-2',
        productId: 'prod-1',
        name: 'T-Shirt',
        price: 29.99,
        size: 'L',
        color: 'White',
      });

      store.addItem(item1);
      store.addItem(item2);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(2);
      expect(state.items[0].size).toBe('M');
      expect(state.items[0].color).toBe('Black');
      expect(state.items[1].size).toBe('L');
      expect(state.items[1].color).toBe('White');
      expect(state.itemCount).toBe(2);
    });

    it('handles adding the same item with same size but different color as separate items', () => {
      const store = useCartStore.getState();
      const item1 = createCartItem({
        id: 'item-1',
        productId: 'prod-1',
        name: 'T-Shirt',
        price: 29.99,
        size: 'M',
        color: 'Black',
      });
      const item2 = createCartItem({
        id: 'item-2',
        productId: 'prod-1',
        name: 'T-Shirt',
        price: 29.99,
        size: 'M',
        color: 'White',
      });

      store.addItem(item1);
      store.addItem(item2);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(2);
    });

    it('handles adding the same item with same color but different size as separate items', () => {
      const store = useCartStore.getState();
      const item1 = createCartItem({
        id: 'item-1',
        productId: 'prod-1',
        name: 'T-Shirt',
        price: 29.99,
        size: 'M',
        color: 'Black',
      });
      const item2 = createCartItem({
        id: 'item-2',
        productId: 'prod-1',
        name: 'T-Shirt',
        price: 29.99,
        size: 'L',
        color: 'Black',
      });

      store.addItem(item1);
      store.addItem(item2);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(2);
    });
  });

  describe('removeItem', () => {
    it('correctly removes items from the cart', () => {
      const store = useCartStore.getState();
      const item = createCartItem({ id: 'item-1', productId: 'prod-1', name: 'T-Shirt', price: 29.99 });
      store.addItem(item);

      expect(useCartStore.getState().items).toHaveLength(1);

      useCartStore.getState().removeItem('item-1');

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
      expect(state.itemCount).toBe(0);
      expect(state.subtotal).toBe(0);
      // When cart is empty, subtotal = 0, shipping = 5.99 (0 is not > 50), tax = 0, total = 5.99
      expect(state.total).toBeCloseTo(5.99, 2);
    });

    it('only removes the specified item, not others', () => {
      const store = useCartStore.getState();
      const item1 = createCartItem({ id: 'item-1', productId: 'prod-1', name: 'T-Shirt', price: 29.99 });
      const item2 = createCartItem({ id: 'item-2', productId: 'prod-2', name: 'Jeans', price: 59.99 });

      store.addItem(item1);
      store.addItem(item2);

      useCartStore.getState().removeItem('item-1');

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].id).toBe('item-2');
    });

    it('recalculates totals after removal', () => {
      const store = useCartStore.getState();
      const item1 = createCartItem({ id: 'item-1', productId: 'prod-1', name: 'T-Shirt', price: 29.99 });
      const item2 = createCartItem({ id: 'item-2', productId: 'prod-2', name: 'Jeans', price: 59.99 });

      store.addItem(item1);
      store.addItem(item2);

      useCartStore.getState().removeItem('item-1');

      const state = useCartStore.getState();
      expect(state.subtotal).toBe(59.99);
      expect(state.itemCount).toBe(1);
    });
  });

  describe('updateQuantity', () => {
    it('correctly updates item quantities', () => {
      const store = useCartStore.getState();
      const item = createCartItem({ id: 'item-1', productId: 'prod-1', name: 'T-Shirt', price: 29.99 });
      store.addItem(item);

      useCartStore.getState().updateQuantity('item-1', 3);

      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(3);
      expect(state.items[0].totalPrice).toBe(89.97);
      expect(state.itemCount).toBe(3);
    });

    it('recalculates totals when quantity changes', () => {
      const store = useCartStore.getState();
      const item = createCartItem({ id: 'item-1', productId: 'prod-1', name: 'T-Shirt', price: 29.99 });
      store.addItem(item);

      useCartStore.getState().updateQuantity('item-1', 2);

      const state = useCartStore.getState();
      expect(state.subtotal).toBe(59.98);
    });

    it('removes item when quantity is set to 0', () => {
      const store = useCartStore.getState();
      const item = createCartItem({ id: 'item-1', productId: 'prod-1', name: 'T-Shirt', price: 29.99 });
      store.addItem(item);

      useCartStore.getState().updateQuantity('item-1', 0);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
      expect(state.itemCount).toBe(0);
    });

    it('removes item when quantity is set to a negative number', () => {
      const store = useCartStore.getState();
      const item = createCartItem({ id: 'item-1', productId: 'prod-1', name: 'T-Shirt', price: 29.99 });
      store.addItem(item);

      useCartStore.getState().updateQuantity('item-1', -1);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });
  });

  describe('totals computation', () => {
    it('correctly computes subtotal', () => {
      const store = useCartStore.getState();
      const item1 = createCartItem({ id: 'item-1', productId: 'prod-1', name: 'T-Shirt', price: 29.99, quantity: 2, totalPrice: 59.98 });
      const item2 = createCartItem({ id: 'item-2', productId: 'prod-2', name: 'Jeans', price: 59.99 });

      store.addItem(item1);
      store.addItem(item2);

      const state = useCartStore.getState();
      expect(state.subtotal).toBeCloseTo(119.97, 2);
    });

    it('provides free shipping for orders over $50', () => {
      const store = useCartStore.getState();
      const item = createCartItem({ id: 'item-1', productId: 'prod-1', name: 'Jeans', price: 59.99 });

      store.addItem(item);

      const state = useCartStore.getState();
      expect(state.subtotal).toBeGreaterThan(50);
      expect(state.shipping).toBe(0);
    });

    it('charges shipping for orders under $50', () => {
      const store = useCartStore.getState();
      const item = createCartItem({ id: 'item-1', productId: 'prod-1', name: 'Socks', price: 9.99 });

      store.addItem(item);

      const state = useCartStore.getState();
      expect(state.shipping).toBe(5.99);
    });

    it('computes tax correctly (8%)', () => {
      const store = useCartStore.getState();
      const item = createCartItem({ id: 'item-1', productId: 'prod-1', name: 'T-Shirt', price: 29.99 });

      store.addItem(item);

      const state = useCartStore.getState();
      expect(state.tax).toBeCloseTo(29.99 * 0.08, 2);
    });

    it('computes total correctly', () => {
      const store = useCartStore.getState();
      const item = createCartItem({ id: 'item-1', productId: 'prod-1', name: 'T-Shirt', price: 29.99 });

      store.addItem(item);

      const state = useCartStore.getState();
      const expectedShipping = 5.99; // under $50
      const expectedTax = 29.99 * 0.08;
      const expectedTotal = 29.99 + expectedShipping + expectedTax;
      expect(state.total).toBeCloseTo(expectedTotal, 2);
    });

    it('computes total with free shipping when over $50', () => {
      const store = useCartStore.getState();
      const item = createCartItem({ id: 'item-1', productId: 'prod-1', name: 'Jeans', price: 59.99 });

      store.addItem(item);

      const state = useCartStore.getState();
      const expectedTax = 59.99 * 0.08;
      const expectedTotal = 59.99 + 0 + expectedTax;
      expect(state.total).toBeCloseTo(expectedTotal, 2);
    });
  });

  describe('coupon codes', () => {
    it('applies PERSONA10 coupon (10% discount)', () => {
      const store = useCartStore.getState();
      const item = createCartItem({ id: 'item-1', productId: 'prod-1', name: 'T-Shirt', price: 100 });
      store.addItem(item);

      store.applyCoupon('PERSONA10');

      const state = useCartStore.getState();
      expect(state.couponCode).toBe('PERSONA10');
      expect(state.discount).toBeCloseTo(10, 2); // 10% of $100
    });

    it('applies SAVE15 coupon (15% discount)', () => {
      const store = useCartStore.getState();
      const item = createCartItem({ id: 'item-1', productId: 'prod-1', name: 'T-Shirt', price: 100 });
      store.addItem(item);

      store.applyCoupon('SAVE15');

      const state = useCartStore.getState();
      expect(state.couponCode).toBe('SAVE15');
      expect(state.discount).toBeCloseTo(15, 2); // 15% of $100
    });

    it('applies WELCOME20 coupon (20% discount)', () => {
      const store = useCartStore.getState();
      const item = createCartItem({ id: 'item-1', productId: 'prod-1', name: 'T-Shirt', price: 100 });
      store.addItem(item);

      store.applyCoupon('WELCOME20');

      const state = useCartStore.getState();
      expect(state.couponCode).toBe('WELCOME20');
      expect(state.discount).toBeCloseTo(20, 2); // 20% of $100
    });

    it('applies FIRSTORDER coupon (20% discount)', () => {
      const store = useCartStore.getState();
      const item = createCartItem({ id: 'item-1', productId: 'prod-1', name: 'T-Shirt', price: 100 });
      store.addItem(item);

      store.applyCoupon('FIRSTORDER');

      const state = useCartStore.getState();
      expect(state.couponCode).toBe('FIRSTORDER');
      expect(state.discount).toBeCloseTo(20, 2); // 20% of $100
    });

    it('correctly computes totals with coupon applied', () => {
      const store = useCartStore.getState();
      const item = createCartItem({ id: 'item-1', productId: 'prod-1', name: 'Jeans', price: 100 });
      store.addItem(item);

      store.applyCoupon('PERSONA10');

      const state = useCartStore.getState();
      // subtotal = 100, shipping = 0 (> $50), tax = 8, discount = 10
      // total = 100 + 0 + 8 - 10 = 98
      expect(state.subtotal).toBe(100);
      expect(state.shipping).toBe(0);
      expect(state.tax).toBeCloseTo(8, 2);
      expect(state.discount).toBeCloseTo(10, 2);
      expect(state.total).toBeCloseTo(98, 2);
    });

    it('handles invalid coupon code (no discount)', () => {
      const store = useCartStore.getState();
      const item = createCartItem({ id: 'item-1', productId: 'prod-1', name: 'T-Shirt', price: 100 });
      store.addItem(item);

      store.applyCoupon('INVALIDCODE');

      const state = useCartStore.getState();
      expect(state.couponCode).toBe('INVALIDCODE');
      expect(state.discount).toBe(0);
    });

    it('removes coupon and recalculates totals', () => {
      const store = useCartStore.getState();
      const item = createCartItem({ id: 'item-1', productId: 'prod-1', name: 'Jeans', price: 100 });
      store.addItem(item);
      store.applyCoupon('PERSONA10');

      expect(useCartStore.getState().discount).toBeCloseTo(10, 2);

      useCartStore.getState().removeCoupon();

      const state = useCartStore.getState();
      expect(state.couponCode).toBeNull();
      expect(state.discount).toBe(0);
      expect(state.total).toBeCloseTo(108, 2); // 100 + 0 shipping + 8 tax
    });

    it('coupon discount is case-insensitive', () => {
      const store = useCartStore.getState();
      const item = createCartItem({ id: 'item-1', productId: 'prod-1', name: 'T-Shirt', price: 100 });
      store.addItem(item);

      store.applyCoupon('persona10');

      const state = useCartStore.getState();
      expect(state.discount).toBeCloseTo(10, 2);
    });

    it('reapplies discount when adding items after coupon is set', () => {
      const store = useCartStore.getState();
      const item1 = createCartItem({ id: 'item-1', productId: 'prod-1', name: 'T-Shirt', price: 100 });
      store.addItem(item1);
      store.applyCoupon('PERSONA10');

      expect(useCartStore.getState().discount).toBeCloseTo(10, 2);

      const item2 = createCartItem({ id: 'item-2', productId: 'prod-2', name: 'Jeans', price: 50 });
      store.addItem(item2);

      const state = useCartStore.getState();
      // subtotal = 150, discount = 15 (10% of 150)
      expect(state.subtotal).toBe(150);
      expect(state.discount).toBeCloseTo(15, 2);
    });
  });

  describe('clearCart', () => {
    it('clears the cart completely', () => {
      const store = useCartStore.getState();
      const item1 = createCartItem({ id: 'item-1', productId: 'prod-1', name: 'T-Shirt', price: 29.99 });
      const item2 = createCartItem({ id: 'item-2', productId: 'prod-2', name: 'Jeans', price: 59.99 });

      store.addItem(item1);
      store.addItem(item2);
      store.applyCoupon('PERSONA10');

      useCartStore.getState().clearCart();

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
      expect(state.itemCount).toBe(0);
      expect(state.subtotal).toBe(0);
      expect(state.shipping).toBe(0);
      expect(state.tax).toBe(0);
      expect(state.discount).toBe(0);
      expect(state.total).toBe(0);
      expect(state.couponCode).toBeNull();
    });
  });

  describe('toggleCart / openCart / closeCart', () => {
    it('toggles cart open state', () => {
      const store = useCartStore.getState();
      expect(store.isOpen).toBe(false);

      store.toggleCart();
      expect(useCartStore.getState().isOpen).toBe(true);

      useCartStore.getState().toggleCart();
      expect(useCartStore.getState().isOpen).toBe(false);
    });

    it('opens the cart', () => {
      useCartStore.getState().openCart();
      expect(useCartStore.getState().isOpen).toBe(true);
    });

    it('closes the cart', () => {
      useCartStore.getState().openCart();
      useCartStore.getState().closeCart();
      expect(useCartStore.getState().isOpen).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('free shipping threshold is exactly $50 (no free shipping)', () => {
      const store = useCartStore.getState();
      const item = createCartItem({ id: 'item-1', productId: 'prod-1', name: 'Item', price: 50 });

      store.addItem(item);

      // subtotal = 50, which is NOT > 50, so shipping should be 5.99
      const state = useCartStore.getState();
      expect(state.shipping).toBe(5.99);
    });

    it('free shipping when subtotal is just over $50', () => {
      const store = useCartStore.getState();
      const item = createCartItem({ id: 'item-1', productId: 'prod-1', name: 'Item', price: 50.01 });

      store.addItem(item);

      const state = useCartStore.getState();
      expect(state.shipping).toBe(0);
    });

    it('removing item that does not exist does not throw', () => {
      const store = useCartStore.getState();
      expect(() => store.removeItem('non-existent')).not.toThrow();
      expect(useCartStore.getState().items).toHaveLength(0);
    });

    it('updating quantity of non-existent item does not throw', () => {
      const store = useCartStore.getState();
      expect(() => store.updateQuantity('non-existent', 5)).not.toThrow();
    });
  });
});

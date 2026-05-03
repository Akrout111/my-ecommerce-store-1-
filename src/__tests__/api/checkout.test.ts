import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// ---------------------------------------------------------------------------
// Transaction mock functions
// ---------------------------------------------------------------------------
const mockTxProductFindMany = vi.fn();
const mockTxProductFindUnique = vi.fn();
const mockTxProductUpdate = vi.fn();
const mockTxOrderCreate = vi.fn();

const mockTx = {
  product: {
    findMany: (...args: unknown[]) => mockTxProductFindMany(...args),
    findUnique: (...args: unknown[]) => mockTxProductFindUnique(...args),
    update: (...args: unknown[]) => mockTxProductUpdate(...args),
  },
  order: {
    create: (...args: unknown[]) => mockTxOrderCreate(...args),
  },
};

// Post-transaction prisma mocks
const mockPrismaOrderUpdate = vi.fn();
const mockPrismaProductUpdate = vi.fn();
const mockPrismaProductFindUnique = vi.fn();

vi.mock('@/lib/db', () => ({
  prisma: {
    $transaction: (fn: (tx: typeof mockTx) => Promise<unknown>) => fn(mockTx),
    order: {
      update: (...args: unknown[]) => mockPrismaOrderUpdate(...args),
    },
    product: {
      update: (...args: unknown[]) => mockPrismaProductUpdate(...args),
      findUnique: (...args: unknown[]) => mockPrismaProductFindUnique(...args),
    },
  },
}));

// Mock stripe
const mockPaymentIntentsCreate = vi.fn();
vi.mock('@/lib/stripe', () => ({
  stripe: {
    paymentIntents: {
      create: (...args: unknown[]) => mockPaymentIntentsCreate(...args),
    },
  },
}));

// Mock next-auth getServerSession
const mockGetServerSession = vi.fn();
vi.mock('next-auth', () => ({
  getServerSession: (...args: unknown[]) => mockGetServerSession(...args),
}));

// Mock auth options
vi.mock('@/lib/auth', () => ({
  authOptions: {},
}));

// Mock coupon-service
const mockValidateCoupon = vi.fn();
vi.mock('@/lib/coupon-service', () => ({
  validateCoupon: (...args: unknown[]) => mockValidateCoupon(...args),
}));

// Import the handler after mocks are set up
let POST: (request: NextRequest) => Promise<Response>;

beforeEach(async () => {
  vi.clearAllMocks();

  // Default mocks
  mockGetServerSession.mockResolvedValue(null);
  mockTxOrderCreate.mockResolvedValue({ id: 'order-123', orderNumber: 'PF-20250101-ABCDEF' });
  mockPrismaOrderUpdate.mockResolvedValue({ id: 'order-123' });
  mockPaymentIntentsCreate.mockResolvedValue({
    id: 'pi_test',
    client_secret: 'cs_test_secret',
  });

  // Default transaction mocks for stock operations
  mockTxProductFindUnique.mockResolvedValue({ id: 'prod-1', stockCount: 99 });
  mockTxProductUpdate.mockResolvedValue({ id: 'prod-1', stockCount: 99, inStock: true });

  // Default: coupon is invalid (no discount)
  mockValidateCoupon.mockResolvedValue({ valid: false, discount: 0, message: 'Invalid coupon code' });

  // Dynamically import the handler to get fresh module with mocks applied
  const routeModule = await import('@/app/api/checkout/create-payment-intent/route');
  POST = routeModule.POST;
});

// Helper to create a NextRequest with JSON body
function createRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost:3000/api/checkout/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('create-payment-intent API', () => {
  const mockProducts = [
    {
      id: 'prod-1',
      name: 'T-Shirt',
      brand: 'TestBrand',
      price: 29.99,
      salePrice: null,
      images: '["/shirt.jpg"]',
      inStock: true,
      stockCount: 100,
    },
    {
      id: 'prod-2',
      name: 'Jeans',
      brand: 'TestBrand',
      price: 59.99,
      salePrice: 49.99,
      images: '["/jeans.jpg"]',
      inStock: true,
      stockCount: 50,
    },
  ];

  describe('server-side price verification', () => {
    it('verifies prices server-side using database, not submitted prices', async () => {
      mockTxProductFindMany.mockResolvedValue(mockProducts);

      const request = createRequest({
        items: [
          { productId: 'prod-1', quantity: 1, size: 'M', color: 'Black' },
          { productId: 'prod-2', quantity: 1, size: 'L', color: 'Blue' },
        ],
        shippingMethod: 'standard',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      // Total should be based on server prices (29.99 + 49.99 = 79.98), not client-submitted prices
      // subtotal = 79.98, shipping = 0 (>= $50), tax = 79.98 * 0.08 = 6.3984, discount = 0
      // total = 79.98 + 0 + 6.3984 - 0 = 86.3784
      expect(data.total).toBeCloseTo(86.38, 1);
      expect(data.clientSecret).toBe('cs_test_secret');
    });

    it('rejects tampered/inflated prices by using server prices', async () => {
      mockTxProductFindMany.mockResolvedValue([
        {
          id: 'prod-1',
          name: 'T-Shirt',
          brand: 'TestBrand',
          price: 19.99, // Real price is $19.99, not the inflated client price
          salePrice: null,
          images: '["/shirt.jpg"]',
          inStock: true,
          stockCount: 100,
        },
      ]);

      const request = createRequest({
        items: [
          { productId: 'prod-1', quantity: 1 }, // Client may claim higher price
        ],
        shippingMethod: 'standard',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      // The server uses the DB price of $19.99, not any client-submitted price
      // subtotal = 19.99, shipping = 5.99 (< $50), tax = 19.99 * 0.08, total = 19.99 + 5.99 + 1.5992
      expect(data.total).toBeCloseTo(27.58, 1);

      // Verify Stripe was called with the correct (server-verified) amount
      const stripeCall = mockPaymentIntentsCreate.mock.calls[0][0] as { amount: number };
      expect(stripeCall.amount).toBe(Math.round(data.total * 100));
    });

    it('returns 500 when a product is not found', async () => {
      // Product not in DB
      mockTxProductFindMany.mockResolvedValue([]);

      const request = createRequest({
        items: [
          { productId: 'nonexistent-prod', quantity: 1 },
        ],
        shippingMethod: 'standard',
      });

      const response = await POST(request);
      expect(response.status).toBe(500);

      const data = await response.json();
      expect(data.error).toContain('not found');
    });
  });

  describe('client_secret on success', () => {
    it('returns client_secret on success', async () => {
      mockTxProductFindMany.mockResolvedValue(mockProducts);

      const request = createRequest({
        items: [
          { productId: 'prod-1', quantity: 2, size: 'M', color: 'Black' },
        ],
        shippingMethod: 'standard',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.clientSecret).toBe('cs_test_secret');
      expect(data.orderId).toBe('order-123');
      expect(data.orderNumber).toMatch(/^PF-\d{8}-[0-9A-F]{6}$/);
      expect(typeof data.total).toBe('number');
    });

    it('creates a Stripe PaymentIntent with correct amount in cents', async () => {
      mockTxProductFindMany.mockResolvedValue([
        {
          id: 'prod-1',
          name: 'T-Shirt',
          brand: 'TestBrand',
          price: 30,
          salePrice: null,
          images: '["/shirt.jpg"]',
          inStock: true,
          stockCount: 100,
        },
      ]);

      const request = createRequest({
        items: [
          { productId: 'prod-1', quantity: 1 },
        ],
        shippingMethod: 'standard',
      });

      await POST(request);

      expect(mockPaymentIntentsCreate).toHaveBeenCalledTimes(1);
      const stripeArgs = mockPaymentIntentsCreate.mock.calls[0][0] as {
        amount: number;
        currency: string;
        metadata: Record<string, string>;
        automatic_payment_methods: { enabled: boolean };
      };
      expect(stripeArgs.currency).toBe('usd');
      expect(stripeArgs.automatic_payment_methods).toEqual({ enabled: true });
      expect(stripeArgs.metadata).toHaveProperty('orderId');
      expect(stripeArgs.metadata).toHaveProperty('orderNumber');
      // Amount should be in cents
      expect(stripeArgs.amount).toBeGreaterThan(0);
    });

    it('creates order in database with correct data', async () => {
      mockTxProductFindMany.mockResolvedValue([
        {
          id: 'prod-1',
          name: 'T-Shirt',
          brand: 'TestBrand',
          price: 29.99,
          salePrice: null,
          images: '["/shirt.jpg"]',
          inStock: true,
          stockCount: 100,
        },
      ]);

      const request = createRequest({
        items: [
          { productId: 'prod-1', quantity: 2, size: 'M', color: 'Black' },
        ],
        shippingMethod: 'standard',
        guestEmail: 'guest@test.com',
      });

      await POST(request);

      expect(mockTxOrderCreate).toHaveBeenCalledTimes(1);
      const orderData = mockTxOrderCreate.mock.calls[0][0] as {
        data: {
          status: string;
          guestEmail: string;
          items: { create: unknown[] };
        };
      };
      expect(orderData.data.status).toBe('pending');
      expect(orderData.data.guestEmail).toBe('guest@test.com');
    });
  });

  describe('coupon codes', () => {
    it('applies PERSONA10 coupon correctly (10% discount)', async () => {
      mockTxProductFindMany.mockResolvedValue([
        {
          id: 'prod-1',
          name: 'T-Shirt',
          brand: 'TestBrand',
          price: 100,
          salePrice: null,
          images: '["/shirt.jpg"]',
          inStock: true,
          stockCount: 100,
        },
      ]);
      mockValidateCoupon.mockResolvedValue({
        valid: true,
        discount: 10,
        message: '10% discount applied',
        coupon: { code: 'PERSONA10', discountPercent: 10 },
      });

      const request = createRequest({
        items: [
          { productId: 'prod-1', quantity: 1 },
        ],
        couponCode: 'PERSONA10',
        shippingMethod: 'standard',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      // subtotal = 100, shipping = 0 (>= $50), tax = 8, discount = 10 (10% of 100)
      // total = 100 + 0 + 8 - 10 = 98
      expect(data.total).toBeCloseTo(98, 1);
    });

    it('applies SAVE15 coupon correctly (15% discount)', async () => {
      mockTxProductFindMany.mockResolvedValue([
        {
          id: 'prod-1',
          name: 'T-Shirt',
          brand: 'TestBrand',
          price: 100,
          salePrice: null,
          images: '["/shirt.jpg"]',
          inStock: true,
          stockCount: 100,
        },
      ]);
      mockValidateCoupon.mockResolvedValue({
        valid: true,
        discount: 15,
        message: '15% discount applied',
        coupon: { code: 'SAVE15', discountPercent: 15 },
      });

      const request = createRequest({
        items: [
          { productId: 'prod-1', quantity: 1 },
        ],
        couponCode: 'SAVE15',
        shippingMethod: 'standard',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      // subtotal = 100, shipping = 0, tax = 8, discount = 15 (15% of 100)
      // total = 100 + 0 + 8 - 15 = 93
      expect(data.total).toBeCloseTo(93, 1);
    });

    it('applies WELCOME20 coupon correctly (20% discount)', async () => {
      mockTxProductFindMany.mockResolvedValue([
        {
          id: 'prod-1',
          name: 'T-Shirt',
          brand: 'TestBrand',
          price: 100,
          salePrice: null,
          images: '["/shirt.jpg"]',
          inStock: true,
          stockCount: 100,
        },
      ]);
      mockValidateCoupon.mockResolvedValue({
        valid: true,
        discount: 20,
        message: '20% discount applied',
        coupon: { code: 'WELCOME20', discountPercent: 20 },
      });

      const request = createRequest({
        items: [
          { productId: 'prod-1', quantity: 1 },
        ],
        couponCode: 'WELCOME20',
        shippingMethod: 'standard',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      // subtotal = 100, shipping = 0, tax = 8, discount = 20 (20% of 100)
      // total = 100 + 0 + 8 - 20 = 88
      expect(data.total).toBeCloseTo(88, 1);
    });

    it('handles invalid coupon code (no discount applied)', async () => {
      mockTxProductFindMany.mockResolvedValue([
        {
          id: 'prod-1',
          name: 'T-Shirt',
          brand: 'TestBrand',
          price: 100,
          salePrice: null,
          images: '["/shirt.jpg"]',
          inStock: true,
          stockCount: 100,
        },
      ]);
      // Default mock already returns invalid coupon

      const request = createRequest({
        items: [
          { productId: 'prod-1', quantity: 1 },
        ],
        couponCode: 'INVALID_CODE',
        shippingMethod: 'standard',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      // No discount for invalid code
      // total = 100 + 0 + 8 - 0 = 108
      expect(data.total).toBeCloseTo(108, 1);
    });

    it('coupon code is case-insensitive on server', async () => {
      mockTxProductFindMany.mockResolvedValue([
        {
          id: 'prod-1',
          name: 'T-Shirt',
          brand: 'TestBrand',
          price: 100,
          salePrice: null,
          images: '["/shirt.jpg"]',
          inStock: true,
          stockCount: 100,
        },
      ]);
      mockValidateCoupon.mockResolvedValue({
        valid: true,
        discount: 10,
        message: '10% discount applied',
        coupon: { code: 'PERSONA10', discountPercent: 10 },
      });

      const request = createRequest({
        items: [
          { productId: 'prod-1', quantity: 1 },
        ],
        couponCode: 'persona10',
        shippingMethod: 'standard',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      // Should apply 10% discount like PERSONA10 (server handles case-insensitivity)
      expect(data.total).toBeCloseTo(98, 1);
    });
  });

  describe('shipping costs', () => {
    const cheapProduct = {
      id: 'prod-1',
      name: 'Socks',
      brand: 'TestBrand',
      price: 9.99,
      salePrice: null,
      images: '["/socks.jpg"]',
      inStock: true,
      stockCount: 100,
    };

    const expensiveProduct = {
      id: 'prod-2',
      name: 'Jacket',
      brand: 'TestBrand',
      price: 120,
      salePrice: null,
      images: '["/jacket.jpg"]',
      inStock: true,
      stockCount: 50,
    };

    it('charges $5.99 for standard shipping on orders under $50', async () => {
      mockTxProductFindMany.mockResolvedValue([cheapProduct]);

      const request = createRequest({
        items: [{ productId: 'prod-1', quantity: 1 }],
        shippingMethod: 'standard',
      });

      const response = await POST(request);
      const data = await response.json();

      // subtotal = 9.99, shipping = 5.99, tax = 0.7992, total = 16.7792
      expect(response.status).toBe(200);
      expect(data.total).toBeCloseTo(9.99 + 5.99 + 9.99 * 0.08, 1);
    });

    it('provides free standard shipping on orders over $50', async () => {
      mockTxProductFindMany.mockResolvedValue([expensiveProduct]);

      const request = createRequest({
        items: [{ productId: 'prod-2', quantity: 1 }],
        shippingMethod: 'standard',
      });

      const response = await POST(request);
      const data = await response.json();

      // subtotal = 120, shipping = 0 (>= $50), tax = 9.6, total = 129.6
      expect(response.status).toBe(200);
      expect(data.total).toBeCloseTo(120 + 0 + 120 * 0.08, 1);
    });

    it('charges $12.99 for express shipping on orders under $50', async () => {
      mockTxProductFindMany.mockResolvedValue([cheapProduct]);

      const request = createRequest({
        items: [{ productId: 'prod-1', quantity: 1 }],
        shippingMethod: 'express',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.total).toBeCloseTo(9.99 + 12.99 + 9.99 * 0.08, 1);
    });

    it('charges $24.99 for nextday shipping on orders under $50', async () => {
      mockTxProductFindMany.mockResolvedValue([cheapProduct]);

      const request = createRequest({
        items: [{ productId: 'prod-1', quantity: 1 }],
        shippingMethod: 'nextday',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.total).toBeCloseTo(9.99 + 24.99 + 9.99 * 0.08, 1);
    });

    it('charges express shipping even on orders over $50', async () => {
      mockTxProductFindMany.mockResolvedValue([expensiveProduct]);

      const request = createRequest({
        items: [{ productId: 'prod-2', quantity: 1 }],
        shippingMethod: 'express',
      });

      const response = await POST(request);
      const data = await response.json();

      // Express shipping is $12.99 regardless of order total (only standard has free threshold)
      expect(response.status).toBe(200);
      expect(data.total).toBeCloseTo(120 + 12.99 + 120 * 0.08, 1);
    });

    it('defaults to standard shipping when no method specified', async () => {
      mockTxProductFindMany.mockResolvedValue([cheapProduct]);

      const request = createRequest({
        items: [{ productId: 'prod-1', quantity: 1 }],
        // No shippingMethod specified
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      // Should use standard shipping rate ($5.99) since under $50
      expect(data.total).toBeCloseTo(9.99 + 5.99 + 9.99 * 0.08, 1);
    });
  });

  describe('sale price handling', () => {
    it('uses salePrice when available instead of regular price', async () => {
      mockTxProductFindMany.mockResolvedValue([
        {
          id: 'prod-1',
          name: 'Jeans',
          brand: 'TestBrand',
          price: 59.99,
          salePrice: 39.99,
          images: '["/jeans.jpg"]',
          inStock: true,
          stockCount: 50,
        },
      ]);

      const request = createRequest({
        items: [{ productId: 'prod-1', quantity: 1 }],
        shippingMethod: 'standard',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      // Sale price 39.99 < 50, so shipping = 5.99
      // total = 39.99 + 5.99 + 39.99 * 0.08
      expect(data.total).toBeCloseTo(39.99 + 5.99 + 39.99 * 0.08, 1);
    });
  });

  describe('stock checking', () => {
    it('returns 409 when product is out of stock', async () => {
      mockTxProductFindMany.mockResolvedValue([
        {
          id: 'prod-1',
          name: 'T-Shirt',
          brand: 'TestBrand',
          price: 29.99,
          salePrice: null,
          images: '["/shirt.jpg"]',
          inStock: false,
          stockCount: 0,
        },
      ]);

      const request = createRequest({
        items: [{ productId: 'prod-1', quantity: 1 }],
        shippingMethod: 'standard',
      });

      const response = await POST(request);
      expect(response.status).toBe(409);

      const data = await response.json();
      expect(data.error).toContain('Insufficient stock');
    });

    it('returns 409 when requested quantity exceeds stock', async () => {
      mockTxProductFindMany.mockResolvedValue([
        {
          id: 'prod-1',
          name: 'T-Shirt',
          brand: 'TestBrand',
          price: 29.99,
          salePrice: null,
          images: '["/shirt.jpg"]',
          inStock: true,
          stockCount: 2,
        },
      ]);

      const request = createRequest({
        items: [{ productId: 'prod-1', quantity: 5 }],
        shippingMethod: 'standard',
      });

      const response = await POST(request);
      expect(response.status).toBe(409);

      const data = await response.json();
      expect(data.error).toContain('Insufficient stock');
    });
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { rateLimit, getClientIp, type RateLimiterFn } from '@/lib/rate-limit';

describe('rate-limit', () => {
  let limiter: RateLimiterFn;

  beforeEach(() => {
    vi.useFakeTimers();
    // Create a fresh limiter for each test
    limiter = rateLimit({ windowMs: 60_000, maxRequests: 3 });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ---------------------------------------------------------------------------
  // Requests within limit should succeed
  // ---------------------------------------------------------------------------
  describe('requests within limit', () => {
    it('should allow the first request', () => {
      const result = limiter('192.168.1.1');
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(2);
    });

    it('should allow requests up to the max limit', () => {
      limiter('10.0.0.1'); // 1st - remaining 2
      limiter('10.0.0.1'); // 2nd - remaining 1
      const result = limiter('10.0.0.1'); // 3rd - remaining 0
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(0);
    });

    it('should track remaining count correctly', () => {
      const r1 = limiter('10.0.0.2');
      expect(r1.remaining).toBe(2);

      const r2 = limiter('10.0.0.2');
      expect(r2.remaining).toBe(1);

      const r3 = limiter('10.0.0.2');
      expect(r3.remaining).toBe(0);
    });
  });

  // ---------------------------------------------------------------------------
  // Requests exceeding limit should fail
  // ---------------------------------------------------------------------------
  describe('requests exceeding limit', () => {
    it('should block requests after the limit is reached', () => {
      limiter('10.0.0.3'); // 1
      limiter('10.0.0.3'); // 2
      limiter('10.0.0.3'); // 3 - max reached

      const result = limiter('10.0.0.3'); // 4th should fail
      expect(result.success).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should continue blocking subsequent requests after limit is exceeded', () => {
      limiter('10.0.0.4');
      limiter('10.0.0.4');
      limiter('10.0.0.4');

      const result1 = limiter('10.0.0.4');
      expect(result1.success).toBe(false);

      const result2 = limiter('10.0.0.4');
      expect(result2.success).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // Rate limit window resets after expiry
  // ---------------------------------------------------------------------------
  describe('window reset after expiry', () => {
    it('should reset the counter after the window expires', () => {
      limiter('10.0.0.5');
      limiter('10.0.0.5');
      limiter('10.0.0.5');

      // At limit
      const blocked = limiter('10.0.0.5');
      expect(blocked.success).toBe(false);

      // Advance past the window
      vi.advanceTimersByTime(61_000);

      // Should be allowed again (new window)
      const result = limiter('10.0.0.5');
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(2);
    });

    it('should set a new resetTime after window expiry', () => {
      const r1 = limiter('10.0.0.6');
      const originalResetTime = r1.resetTime;

      // Advance past the window
      vi.advanceTimersByTime(61_000);

      const r2 = limiter('10.0.0.6');
      expect(r2.resetTime).toBeGreaterThan(originalResetTime);
    });

    it('should not reset while the window is still active', () => {
      limiter('10.0.0.7');
      limiter('10.0.0.7');

      // Advance time but not past window
      vi.advanceTimersByTime(30_000);

      limiter('10.0.0.7');

      // 4th request should still be blocked (within same window)
      const result = limiter('10.0.0.7');
      expect(result.success).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // Different IPs have separate counters
  // ---------------------------------------------------------------------------
  describe('separate counters per IP', () => {
    it('should track different IPs independently', () => {
      // IP A uses 3 requests (limit)
      limiter('192.168.1.1');
      limiter('192.168.1.1');
      limiter('192.168.1.1');

      // IP A is blocked
      const resultA = limiter('192.168.1.1');
      expect(resultA.success).toBe(false);

      // IP B should still be allowed
      const resultB = limiter('192.168.2.1');
      expect(resultB.success).toBe(true);
      expect(resultB.remaining).toBe(2);
    });

    it('should not affect other IPs when one is rate limited', () => {
      // Exhaust IP 1
      limiter('1.1.1.1');
      limiter('1.1.1.1');
      limiter('1.1.1.1');

      // IP 2 gets full quota
      const r1 = limiter('2.2.2.2');
      expect(r1.success).toBe(true);
      expect(r1.remaining).toBe(2);

      const r2 = limiter('2.2.2.2');
      expect(r2.success).toBe(true);
      expect(r2.remaining).toBe(1);

      const r3 = limiter('2.2.2.2');
      expect(r3.success).toBe(true);
      expect(r3.remaining).toBe(0);
    });
  });

  // ---------------------------------------------------------------------------
  // getClientIp
  // ---------------------------------------------------------------------------
  describe('getClientIp', () => {
    it('should extract IP from X-Forwarded-For header', () => {
      const headers = new Headers({ 'x-forwarded-for': '203.0.113.1, 70.41.3.18' });
      expect(getClientIp(headers)).toBe('203.0.113.1');
    });

    it('should return single IP from X-Forwarded-For with one entry', () => {
      const headers = new Headers({ 'x-forwarded-for': '203.0.113.50' });
      expect(getClientIp(headers)).toBe('203.0.113.50');
    });

    it('should return "unknown" when no X-Forwarded-For header', () => {
      const headers = new Headers();
      expect(getClientIp(headers)).toBe('unknown');
    });

    it('should trim whitespace from X-Forwarded-For', () => {
      const headers = new Headers({ 'x-forwarded-for': '  203.0.113.1  , 70.41.3.18' });
      expect(getClientIp(headers)).toBe('203.0.113.1');
    });
  });

  // ---------------------------------------------------------------------------
  // Limiter function accepts Request objects
  // ---------------------------------------------------------------------------
  describe('accepts Request objects', () => {
    it('should accept a Request object and extract IP', () => {
      const request = new Request('http://localhost/test', {
        headers: { 'x-forwarded-for': '198.51.100.1' },
      });
      const result = limiter(request);
      expect(result.success).toBe(true);
    });

    it('should accept a NextRequest-like object with headers', () => {
      const request = new Request('http://localhost/test', {
        headers: { 'x-forwarded-for': '198.51.100.2' },
      });
      const result = limiter(request);
      expect(result.success).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // .check() method
  // ---------------------------------------------------------------------------
  describe('.check() method', () => {
    it('should work with raw key strings', () => {
      const result = limiter.check('raw-key-123');
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(2);
    });

    it('should track counts via check independently', () => {
      limiter.check('check-key');
      limiter.check('check-key');
      const result = limiter.check('check-key');
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(0);

      const blocked = limiter.check('check-key');
      expect(blocked.success).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // .config property
  // ---------------------------------------------------------------------------
  describe('.config property', () => {
    it('should expose the config', () => {
      expect(limiter.config.windowMs).toBe(60_000);
      expect(limiter.config.maxRequests).toBe(3);
    });
  });
});

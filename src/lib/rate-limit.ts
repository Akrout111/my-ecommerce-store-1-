import { NextRequest, NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RateLimitConfig {
  /** Time window in milliseconds */
  windowMs: number;
  /** Maximum number of requests allowed within the window */
  maxRequests: number;
}

export interface RateLimitResult {
  /** Whether the request is allowed */
  success: boolean;
  /** Remaining requests in the current window */
  remaining: number;
  /** Timestamp (ms since epoch) when the window resets */
  resetTime: number;
}

/** The rate-limiter function returned by `rateLimit()`. */
export interface RateLimiterFn {
  (input: Request | NextRequest | string): RateLimitResult;
  /** Low-level check that accepts a raw key string directly. */
  check(key: string): RateLimitResult;
  /** The configuration this limiter was created with. */
  config: RateLimitConfig;
}

// ---------------------------------------------------------------------------
// In-memory store
// ---------------------------------------------------------------------------

interface StoreEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, StoreEntry>();

// Auto-cleanup expired entries every 10 minutes
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;

const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetTime) {
      store.delete(key);
    }
  }
}, CLEANUP_INTERVAL_MS);

// Prevent the timer from keeping the Node.js process alive
if (cleanupTimer.unref) {
  cleanupTimer.unref();
}

// ---------------------------------------------------------------------------
// IP extraction helper
// ---------------------------------------------------------------------------

/**
 * Extract the client IP address from request headers.
 * Honours X-Forwarded-For (first IP in the list) for reverse-proxy setups,
 * falls back to 'unknown' when no forwarding header is present.
 */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    // X-Forwarded-For may contain multiple IPs; the first is the original client
    return forwarded.split(',')[0].trim();
  }
  return 'unknown';
}

// ---------------------------------------------------------------------------
// Core rate-limiter factory
// ---------------------------------------------------------------------------

/**
 * Create a rate-limiter with the given configuration.
 *
 * The returned function accepts either a `Request`/`NextRequest` object (from
 * which the client IP is extracted automatically) or a plain string key.
 *
 * @example
 * ```ts
 * const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 5 });
 *
 * // With a Request object
 * const result = loginLimiter(request);
 *
 * // With a raw key string
 * const result = loginLimiter('192.168.1.1');
 * ```
 */
export function rateLimit(config: RateLimitConfig): RateLimiterFn {
  const { windowMs, maxRequests } = config;

  function check(key: string): RateLimitResult {
    const now = Date.now();
    const entry = store.get(key);

    // No entry or expired window – start fresh
    if (!entry || now > entry.resetTime) {
      const resetTime = now + windowMs;
      store.set(key, { count: 1, resetTime });
      return { success: true, remaining: maxRequests - 1, resetTime };
    }

    // Window is active but limit reached
    if (entry.count >= maxRequests) {
      return { success: false, remaining: 0, resetTime: entry.resetTime };
    }

    // Within limits – increment counter
    entry.count += 1;
    return {
      success: true,
      remaining: maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  const limiter = (input: Request | NextRequest | string): RateLimitResult => {
    const key =
      typeof input === 'string'
        ? input
        : getClientIp(input.headers);

    return check(key);
  };

  // Attach utility methods / metadata
  limiter.check = check;
  limiter.config = config;

  return limiter as RateLimiterFn;
}

// ---------------------------------------------------------------------------
// Middleware helper for Next.js API routes
// ---------------------------------------------------------------------------

/**
 * Apply rate-limiting to a Next.js API route handler.
 *
 * When the limit is exceeded it automatically returns a 429 response with
 * standard rate-limit headers and a JSON body `{ error, retryAfter }`.
 * When the request is allowed, the original handler is invoked and
 * rate-limit headers are attached to the successful response.
 *
 * @example
 * ```ts
 * const registerLimiter = rateLimit({ windowMs: 60 * 60 * 1000, maxRequests: 3 });
 *
 * export const POST = rateLimitMiddleware(registerLimiter, async (request) => {
 *   // your handler logic
 * });
 * ```
 */
export function rateLimitMiddleware(
  limiter: RateLimiterFn,
  handler: (request: NextRequest) => Promise<NextResponse>,
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const result = limiter(request);
    const limit = String(limiter.config.maxRequests);

    if (!result.success) {
      const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
      return NextResponse.json(
        { error: 'Too many requests', retryAfter },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit,
            'X-RateLimit-Remaining': String(result.remaining),
            'X-RateLimit-Reset': String(result.resetTime),
            'Retry-After': String(retryAfter),
          },
        },
      );
    }

    const response = await handler(request);

    // Attach rate-limit info headers to successful responses too
    response.headers.set('X-RateLimit-Limit', limit);
    response.headers.set('X-RateLimit-Remaining', String(result.remaining));
    response.headers.set('X-RateLimit-Reset', String(result.resetTime));

    return response;
  };
}

// ---------------------------------------------------------------------------
// Pre-configured limiters for auth endpoints
// ---------------------------------------------------------------------------

/** 5 login attempts per 15 minutes per IP */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
});

/** 3 registrations per hour per IP */
export const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  maxRequests: 3,
});

import { NextResponse } from 'next/server';

/**
 * Standardized API response helpers for consistent error handling and request tracing.
 * Every response includes a correlation ID (UUID) for observability.
 */

interface SuccessMeta {
  page?: number;
  limit?: number;
  total?: number;
}

interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: SuccessMeta;
}

interface ErrorResponse {
  success: false;
  error: string;
  code: string;
  correlationId: string;
}

function getCorrelationId(): string {
  return crypto.randomUUID();
}

/**
 * Create a successful JSON response with optional pagination metadata.
 */
export function success<T>(data: T, meta?: SuccessMeta, status = 200): NextResponse<SuccessResponse<T>> {
  const response: SuccessResponse<T> = { success: true, data };
  if (meta) {
    response.meta = meta;
  }
  return NextResponse.json(response, { status });
}

/**
 * Create a standardized error JSON response with a correlation ID.
 */
export function error(message: string, code: string, status: number): NextResponse<ErrorResponse> {
  const correlationId = getCorrelationId();
  console.error(`[API Error] code=${code} status=${status} correlationId=${correlationId} message=${message}`);
  return NextResponse.json(
    { success: false, error: message, code, correlationId },
    { status },
  );
}

/**
 * 400 Bad Request — Validation error response.
 */
export function validationError(details: unknown): NextResponse {
  const correlationId = getCorrelationId();
  console.error(`[API Error] code=VALIDATION_ERROR status=400 correlationId=${correlationId}`);
  return NextResponse.json(
    { success: false, error: 'Validation failed', code: 'VALIDATION_ERROR', details, correlationId },
    { status: 400 },
  );
}

/**
 * 401 Unauthorized — Missing or invalid authentication.
 */
export function unauthorized(): NextResponse {
  return error('Authentication required', 'UNAUTHORIZED', 401);
}

/**
 * 403 Forbidden — Authenticated but not authorized.
 */
export function forbidden(): NextResponse {
  return error('Forbidden', 'FORBIDDEN', 403);
}

/**
 * 404 Not Found — Resource not found.
 */
export function notFound(resource = 'Resource'): NextResponse {
  return error(`${resource} not found`, 'NOT_FOUND', 404);
}

/**
 * 429 Too Many Requests — Rate limited response.
 */
export function rateLimited(retryAfter: number): NextResponse {
  const correlationId = getCorrelationId();
  console.error(`[API Error] code=RATE_LIMITED status=429 correlationId=${correlationId} retryAfter=${retryAfter}`);
  return NextResponse.json(
    { success: false, error: 'Too many requests', code: 'RATE_LIMITED', correlationId, retryAfter },
    {
      status: 429,
      headers: { 'Retry-After': String(retryAfter) },
    },
  );
}

/**
 * 500 Internal Server Error — Unexpected server error.
 */
export function internalError(message = 'Internal server error'): NextResponse {
  return error(message, 'INTERNAL_ERROR', 500);
}

/**
 * 409 Conflict — Duplicate resource.
 */
export function conflict(message: string): NextResponse {
  return error(message, 'CONFLICT', 409);
}

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { registerRateLimiter } from '@/lib/rate-limit';
import { success, validationError, conflict, rateLimited, internalError } from '@/lib/api-response';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

function withRateLimitHeaders(response: NextResponse, rateLimitResult: { remaining: number; resetTime: number }, maxRequests: number): NextResponse {
  response.headers.set('X-RateLimit-Limit', String(maxRequests));
  response.headers.set('X-RateLimit-Remaining', String(rateLimitResult.remaining));
  response.headers.set('X-RateLimit-Reset', String(rateLimitResult.resetTime));
  return response;
}

export async function POST(request: NextRequest) {
  // Rate limiting: 3 registrations per hour per IP
  const rateLimitResult = registerRateLimiter(request);
  const maxRequests = registerRateLimiter.config.maxRequests;

  if (!rateLimitResult.success) {
    const retryAfter = Math.ceil(
      (rateLimitResult.resetTime - Date.now()) / 1000
    );
    const response = rateLimited(retryAfter);
    response.headers.set('X-RateLimit-Limit', String(maxRequests));
    response.headers.set('X-RateLimit-Remaining', String(rateLimitResult.remaining));
    response.headers.set('X-RateLimit-Reset', String(rateLimitResult.resetTime));
    return response;
  }

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      const response = validationError(parsed.error.issues);
      return withRateLimitHeaders(response, rateLimitResult, maxRequests);
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      const response = conflict('Email already in use');
      return withRateLimitHeaders(response, rateLimitResult, maxRequests);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, email: true, name: true },
    });

    const response = success({ user }, undefined, 201);
    return withRateLimitHeaders(response, rateLimitResult, maxRequests);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const response = validationError(error.issues);
      return withRateLimitHeaders(response, rateLimitResult, maxRequests);
    }
    const response = internalError();
    return withRateLimitHeaders(response, rateLimitResult, maxRequests);
  }
}

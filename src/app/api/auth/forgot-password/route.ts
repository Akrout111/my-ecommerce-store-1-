import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';
import { success, validationError, rateLimited, internalError } from '@/lib/api-response';

// Rate limit: 3 requests per 15 minutes per IP
const forgotPasswordLimiter = rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 3 });

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

export async function POST(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = forgotPasswordLimiter(request);
  if (!rateLimitResult.success) {
    const retryAfter = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000);
    return rateLimited(retryAfter);
  }

  try {
    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.issues);
    }

    const { email } = parsed.data;

    // Always return success — don't reveal if email exists
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      // Generate reset token
      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.passwordResetToken.create({
        data: {
          token,
          userId: user.id,
          expiresAt,
        },
      });

      // Log reset URL (no email service in demo)
      console.error(`[Password Reset] URL: /auth/reset-password?token=${token}`);
    }

    // Always return success for security (don't reveal if email exists)
    return success({ message: 'If an account with that email exists, a password reset link has been sent.' });
  } catch {
    return internalError();
  }
}

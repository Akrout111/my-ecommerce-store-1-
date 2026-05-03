import { NextRequest } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { success, validationError, internalError, error } from '@/lib/api-response';
import { passwordSchema } from '@/lib/validations/auth';

// GET: Validate token
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return error('Token is required', 'MISSING_TOKEN', 400);
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return success({ valid: false });
    }

    // Check if token is expired
    if (resetToken.expiresAt < new Date()) {
      return success({ valid: false });
    }

    // Check if token has been used
    if (resetToken.usedAt) {
      return success({ valid: false });
    }

    return success({ valid: true });
  } catch {
    return internalError();
  }
}

// POST: Reset password
const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: passwordSchema,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.issues);
    }

    const { token, password } = parsed.data;

    // Find and validate token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return error('Invalid or expired reset token', 'INVALID_TOKEN', 400);
    }

    // Check if token is expired
    if (resetToken.expiresAt < new Date()) {
      return error('Reset token has expired. Please request a new one.', 'TOKEN_EXPIRED', 400);
    }

    // Check if token has been used
    if (resetToken.usedAt) {
      return error('This reset token has already been used.', 'TOKEN_USED', 400);
    }

    // Hash new password and update user
    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return success({ message: 'Password has been successfully reset.' });
  } catch {
    return internalError();
  }
}

import { z } from 'zod';

/**
 * Shared password validation rules used across registration and password reset.
 * Enforces: minimum 8 chars, uppercase, lowercase, digit, special character.
 */
export const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one digit")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

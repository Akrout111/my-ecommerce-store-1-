'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Loader2, Diamond, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { passwordSchema } from '@/lib/validations/auth';
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator';

const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch('password', '');

  // Validate token on mount
  useEffect(() => {
    async function validateToken() {
      try {
        const res = await fetch(`/api/auth/reset-password?token=${encodeURIComponent(token)}`);
        const data = await res.json();
        setIsTokenValid(data.valid === true);
      } catch {
        setIsTokenValid(false);
      } finally {
        setIsValidating(false);
      }
    }

    if (token) {
      validateToken();
    } else {
      setIsTokenValid(false);
      setIsValidating(false);
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: data.password }),
      });

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/auth/login?reset=true');
        }, 3000);
      } else {
        const err = await res.json();
        setError(err.error || 'Failed to reset password. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Token validation loading
  if (isValidating) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-[#C9A96E]/5">
        <Loader2 className="h-8 w-8 animate-spin text-[#C9A96E]" />
      </div>
    );
  }

  // Invalid or expired token
  if (!isTokenValid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-[#C9A96E]/5 px-4">
        <motion.div
          className="mx-auto w-full max-w-md rounded-3xl border bg-card p-8 shadow-xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <Diamond className="h-6 w-6 text-destructive" />
            </div>
          </div>
          <h2 className="text-2xl font-bold">Invalid or expired link</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link
            href="/auth/forgot-password"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#C9A96E] transition hover:underline"
          >
            Request new link
          </Link>
        </motion.div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-[#C9A96E]/5 px-4">
        <motion.div
          className="mx-auto w-full max-w-md rounded-3xl border bg-card p-8 shadow-xl text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
          <h2 className="text-2xl font-bold">Password reset!</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your password has been successfully reset. Redirecting to sign in...
          </p>
          <Link
            href="/auth/login"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#C9A96E] transition hover:underline"
          >
            Sign in now
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-[#C9A96E]/5 px-4">
      <motion.div
        className="mx-auto w-full max-w-md rounded-3xl border bg-card p-8 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A96E]/10">
            <Diamond className="h-6 w-6 text-[#C9A96E]" />
          </div>
          <span className="text-2xl font-bold text-[#C9A96E]">Persona</span>
        </div>

        <h2 className="text-center text-2xl font-bold">Reset password</h2>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Enter your new password below
        </p>

        {error && (
          <div className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="New password"
                className="w-full rounded-xl border bg-background py-3 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
            <PasswordStrengthIndicator password={password} />
          </div>

          <div>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                className="w-full rounded-xl border bg-background py-3 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#C9A96E] font-semibold text-[#0F0F0F] transition disabled:opacity-70"
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              'Reset Password'
            )}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 font-medium text-[#C9A96E] transition hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

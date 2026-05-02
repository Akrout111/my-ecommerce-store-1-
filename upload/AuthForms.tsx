=== FILE 1 ===
src/components/auth/LoginForm.tsx

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, Diamond } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      callbackUrl: "/",
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
    } else if (result?.ok) {
      window.location.href = "/";
    }
  };

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

        <h2 className="text-center text-2xl font-bold">Welcome back</h2>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Sign in to your Persona account
        </p>

        {error && (
          <div className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                {...register("email")}
                type="email"
                placeholder="Email address"
                className="w-full rounded-xl border bg-background py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
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
            <Link
              href="/auth/forgot-password"
              className="mt-1 block text-end text-xs text-[#C9A96E] transition hover:underline"
            >
              Forgot password?
            </Link>
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
              "Sign In"
            )}
          </motion.button>
        </form>

        {/* OR Divider */}
        <div className="my-6 flex items-center gap-4">
          <hr className="flex-1 border-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <hr className="flex-1 border-border" />
        </div>

        {/* Google Button */}
        <motion.button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="flex h-12 w-full items-center justify-center gap-3 rounded-full border-2 border-border bg-background font-medium transition hover:bg-accent"
          whileTap={{ scale: 0.98 }}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </motion.button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-[#C9A96E] transition hover:underline"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

=== FILE 2 ===
src/components/auth/RegisterForm.tsx

"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Diamond,
  User,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agreeToTerms: z.boolean().refine((v) => v === true, {
      message: "You must agree to the terms",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

function PasswordStrength({ password }: { password: string }) {
  const strength = useMemo(() => {
    if (password.length < 8) return { level: 0, label: "Too short" };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const labels = ["Too short", "Weak", "Good", "Strong", "Very Strong"];
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-green-500",
      "bg-green-600",
    ];
    return {
      level: score,
      label: labels[score],
      color: colors[score],
    };
  }, [password]);

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition ${
              i <= strength.level ? strength.color : "bg-muted"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Strength: <span className="font-medium">{strength.label}</span>
      </p>
    </div>
  );
}

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { agreeToTerms: false },
  });

  const password = watch("password", "");

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      if (res.ok) {
        router.push("/auth/login?registered=true");
      } else {
        const err = await res.json();
        setError(err.message || "Registration failed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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

        <h2 className="text-center text-2xl font-bold">Create account</h2>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Join Persona and discover your style
        </p>

        {error && (
          <div className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                {...register("name")}
                type="text"
                placeholder="Full Name"
                className="w-full rounded-xl border bg-background py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                {...register("email")}
                type="email"
                placeholder="Email address"
                className="w-full rounded-xl border bg-background py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
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
            <PasswordStrength password={password} />
          </div>

          <div>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                {...register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
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

          <div>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                {...register("agreeToTerms")}
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-border text-[#C9A96E] focus:ring-[#C9A96E]"
              />
              <span className="text-xs text-muted-foreground">
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-[#C9A96E] underline-offset-2 hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-[#C9A96E] underline-offset-2 hover:underline"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.agreeToTerms && (
              <p className="mt-1 text-xs text-destructive">
                {errors.agreeToTerms.message}
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
              "Create Account"
            )}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-[#C9A96E] transition hover:underline"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

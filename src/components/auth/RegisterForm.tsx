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

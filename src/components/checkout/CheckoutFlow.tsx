"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Lock,
  Truck,
  RotateCcw,
  Shield,
  CreditCard,
  MapPin,
  Package,
  Loader2,
  Zap,
  CircleArrowUp,
} from "lucide-react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { useCartStore } from "@/store/cart-store";
import Image from "next/image";

interface CheckoutFlowProps {
  onOrderComplete: (orderId: string) => void;
}

const steps = [
  { id: 1, label: "Information" },
  { id: 2, label: "Shipping" },
  { id: 3, label: "Payment" },
];

const countries = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Netherlands",
  "Japan",
  "South Korea",
  "China",
  "India",
  "Brazil",
  "Mexico",
  "UAE",
  "Saudi Arabia",
  "Turkey",
  "Sweden",
  "Switzerland",
];

const infoSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().optional(),
});

type InfoFormData = z.infer<typeof infoSchema>;

function StepIndicator({
  currentStep,
}: {
  currentStep: number;
}) {
  return (
    <div className="mb-8 flex items-center justify-center">
      {steps.map((step, idx) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;
        const isLast = idx === steps.length - 1;

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition ${
                  isActive
                    ? "border-[#C9A96E] bg-[#C9A96E] text-[#0F0F0F]"
                    : isCompleted
                    ? "border-[#C9A96E] bg-[#C9A96E]/20 text-[#C9A96E]"
                    : "border-muted bg-muted text-muted-foreground"
                }`}
              >
                {isCompleted ? <Check size={18} /> : step.id}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  isActive
                    ? "text-[#C9A96E]"
                    : isCompleted
                    ? "text-[#C9A96E]/70"
                    : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={`mx-3 h-0.5 w-12 sm:w-20 transition ${
                  isCompleted ? "bg-[#C9A96E]" : "bg-muted"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderSummary({
  couponCode,
  setCouponCode,
  couponApplied,
  setCouponApplied,
  couponError,
  setCouponError,
}: {
  couponCode: string;
  setCouponCode: (v: string) => void;
  couponApplied: boolean;
  setCouponApplied: (v: boolean) => void;
  couponError: string;
  setCouponError: (v: string) => void;
}) {
  const { items, subtotal } = useCartStore();
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shipping + tax - discount;

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === "persona10") {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code");
      setCouponApplied(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="mb-4 text-lg font-bold">Order Summary</h3>

      {/* Items */}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3">
            <div className="relative h-[60px] w-[60px] flex-shrink-0 overflow-hidden rounded-lg bg-muted">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="60px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg">
                  👕
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {item.size && `Size: ${item.size}`}
                {item.size && item.color && " · "}
                {item.color && `Color: ${item.color}`}
                {` · Qty: ${item.quantity}`}
              </p>
              <p className="text-sm font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <hr className="my-4 border-border" />

      {/* Coupon */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Coupon code"
          className="flex-1 rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
        />
        <button
          onClick={handleApplyCoupon}
          className="rounded-xl bg-[#C9A96E] px-4 py-2 text-sm font-semibold text-[#0F0F0F]"
        >
          Apply
        </button>
      </div>
      {couponApplied && (
        <p className="mb-2 text-xs text-green-500">Coupon applied! 10% off</p>
      )}
      {couponError && (
        <p className="mb-2 text-xs text-destructive">{couponError}</p>
      )}

      <hr className="mb-4 border-border" />

      {/* Totals */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax (8%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-500">
            <span>Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        <hr className="border-border" />
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-[#C9A96E]">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Trust Row */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Lock size={12} />
          SSL Secure
        </span>
        <span className="flex items-center gap-1">
          <Package size={12} />
          Tracked Delivery
        </span>
      </div>
    </div>
  );
}

export function CheckoutFlow({ onOrderComplete }: CheckoutFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [shippingOption, setShippingOption] = useState("standard");
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<InfoFormData>({
    resolver: zodResolver(infoSchema),
  });

  const { subtotal } = useCartStore();
  const shippingCost =
    shippingOption === "standard"
      ? subtotal >= 50
        ? 0
        : 5.99
      : shippingOption === "express"
      ? 12.99
      : 24.99;
  const tax = subtotal * 0.08;
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shippingCost + tax - discount;

  const goToStep = (step: number, dir: number) => {
    setDirection(dir);
    setCurrentStep(step);
  };

  const onInfoSubmit = (data: InfoFormData) => {
    console.log("Info:", data);
    goToStep(2, 1);
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const orderId = "mock-order-" + Date.now();
    setIsPlacingOrder(false);
    onOrderComplete(orderId);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const parts: string[] = [];
    for (let i = 0; i < v.length; i += 4) {
      parts.push(v.substring(i, i + 4));
    }
    return parts.join(" ").substring(0, 19);
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
    }),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <StepIndicator currentStep={currentStep} />

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left — Form */}
        <div className="relative min-h-[400px] overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            {/* Step 1: Information */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleSubmit(onInfoSubmit)}>
                  <h2 className="mb-6 text-xl font-bold">Contact Information</h2>
                  <div className="mb-6">
                    <label className="mb-1 block text-sm font-medium">
                      Email
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
                      placeholder="you@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <h2 className="mb-4 text-xl font-bold">Shipping Address</h2>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          First Name
                        </label>
                        <input
                          {...register("firstName")}
                          className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-xs text-destructive">
                            {errors.firstName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          Last Name
                        </label>
                        <input
                          {...register("lastName")}
                          className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-xs text-destructive">
                            {errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        Address
                      </label>
                      <input
                        {...register("address")}
                        className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
                        placeholder="123 Fashion Street"
                      />
                      {errors.address && (
                        <p className="mt-1 text-xs text-destructive">
                          {errors.address.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          City
                        </label>
                        <input
                          {...register("city")}
                          className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
                        />
                        {errors.city && (
                          <p className="mt-1 text-xs text-destructive">
                            {errors.city.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          State
                        </label>
                        <input
                          {...register("state")}
                          className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
                        />
                        {errors.state && (
                          <p className="mt-1 text-xs text-destructive">
                            {errors.state.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          ZIP
                        </label>
                        <input
                          {...register("postalCode")}
                          className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
                        />
                        {errors.postalCode && (
                          <p className="mt-1 text-xs text-destructive">
                            {errors.postalCode.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        Country
                      </label>
                      <select
                        {...register("country")}
                        className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
                      >
                        <option value="">Select country</option>
                        {countries.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      {errors.country && (
                        <p className="mt-1 text-xs text-destructive">
                          {errors.country.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        Phone (optional)
                      </label>
                      <input
                        {...register("phone")}
                        type="tel"
                        className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#C9A96E] font-semibold text-[#0F0F0F]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue to Shipping
                    <ChevronRight size={18} />
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* Step 2: Shipping */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <h2 className="mb-6 text-xl font-bold">Shipping Method</h2>

                <RadioGroup.Root
                  value={shippingOption}
                  onValueChange={setShippingOption}
                  className="space-y-3"
                >
                  {/* Standard */}
                  <RadioGroup.Item
                    value="standard"
                    className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                      shippingOption === "standard"
                        ? "border-[#C9A96E] bg-[#C9A96E]/5"
                        : "border-border hover:border-[#C9A96E]/50"
                    }`}
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A96E]/10">
                      <Truck size={20} className="text-[#C9A96E]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Standard Shipping</span>
                        <span className="font-semibold">
                          {subtotal >= 50 ? "Free" : "$5.99"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        5–7 Business Days
                      </p>
                    </div>
                    <div
                      className={`h-5 w-5 rounded-full border-2 ${
                        shippingOption === "standard"
                          ? "border-[#C9A96E] bg-[#C9A96E]"
                          : "border-muted"
                      }`}
                    >
                      {shippingOption === "standard" && (
                        <Check size={12} className="m-auto text-[#0F0F0F]" />
                      )}
                    </div>
                  </RadioGroup.Item>

                  {/* Express */}
                  <RadioGroup.Item
                    value="express"
                    className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                      shippingOption === "express"
                        ? "border-[#C9A96E] bg-[#C9A96E]/5"
                        : "border-border hover:border-[#C9A96E]/50"
                    }`}
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A96E]/10">
                      <Zap size={20} className="text-[#C9A96E]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Express Shipping</span>
                        <span className="font-semibold">$12.99</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        2–3 Business Days
                      </p>
                    </div>
                    <div
                      className={`h-5 w-5 rounded-full border-2 ${
                        shippingOption === "express"
                          ? "border-[#C9A96E] bg-[#C9A96E]"
                          : "border-muted"
                      }`}
                    >
                      {shippingOption === "express" && (
                        <Check size={12} className="m-auto text-[#0F0F0F]" />
                      )}
                    </div>
                  </RadioGroup.Item>

                  {/* Next Day */}
                  <RadioGroup.Item
                    value="nextday"
                    className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                      shippingOption === "nextday"
                        ? "border-[#C9A96E] bg-[#C9A96E]/5"
                        : "border-border hover:border-[#C9A96E]/50"
                    }`}
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A96E]/10">
                      <CircleArrowUp size={20} className="text-[#C9A96E]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Next Day Delivery</span>
                        <span className="font-semibold">$24.99</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Next Business Day
                      </p>
                    </div>
                    <div
                      className={`h-5 w-5 rounded-full border-2 ${
                        shippingOption === "nextday"
                          ? "border-[#C9A96E] bg-[#C9A96E]"
                          : "border-muted"
                      }`}
                    >
                      {shippingOption === "nextday" && (
                        <Check size={12} className="m-auto text-[#0F0F0F]" />
                      )}
                    </div>
                  </RadioGroup.Item>
                </RadioGroup.Root>

                <div className="mt-6 flex gap-3">
                  <motion.button
                    onClick={() => goToStep(1, -1)}
                    className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border-2 border-border font-semibold transition hover:border-[#C9A96E]"
                    whileTap={{ scale: 0.98 }}
                  >
                    <ChevronLeft size={18} />
                    Back
                  </motion.button>
                  <motion.button
                    onClick={() => goToStep(3, 1)}
                    className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#C9A96E] font-semibold text-[#0F0F0F]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue to Payment
                    <ChevronRight size={18} />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6 flex items-center gap-2">
                  <Lock size={20} className="text-[#C9A96E]" />
                  <h2 className="text-xl font-bold">Payment Information</h2>
                </div>

                {/* Card Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Card Number
                    </label>
                    <div className="relative">
                      <CreditCard
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) =>
                          setCardNumber(formatCardNumber(e.target.value))
                        }
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        className="w-full rounded-xl border bg-background py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) =>
                          setExpiry(formatExpiry(e.target.value))
                        }
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) =>
                          setCvv(
                            e.target.value
                              .replace(/\D/g, "")
                              .substring(0, 4)
                          )
                        }
                        placeholder="123"
                        maxLength={4}
                        className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
                    />
                  </div>
                </div>

                {/* Billing Address Toggle */}
                <div className="mt-6">
                  <h3 className="mb-3 text-sm font-medium">Billing Address</h3>
                  <RadioGroup.Root
                    value={billingSameAsShipping ? "same" : "different"}
                    onValueChange={(v) =>
                      setBillingSameAsShipping(v === "same")
                    }
                    className="space-y-2"
                  >
                    <RadioGroup.Item
                      value="same"
                      className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left transition hover:border-[#C9A96E]/50"
                    >
                      <div
                        className={`h-4 w-4 rounded-full border-2 ${
                          billingSameAsShipping
                            ? "border-[#C9A96E] bg-[#C9A96E]"
                            : "border-muted"
                        }`}
                      >
                        {billingSameAsShipping && (
                          <div className="m-auto h-1.5 w-1.5 rounded-full bg-[#0F0F0F]" />
                        )}
                      </div>
                      <span className="text-sm">Same as shipping address</span>
                    </RadioGroup.Item>
                    <RadioGroup.Item
                      value="different"
                      className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left transition hover:border-[#C9A96E]/50"
                    >
                      <div
                        className={`h-4 w-4 rounded-full border-2 ${
                          !billingSameAsShipping
                            ? "border-[#C9A96E] bg-[#C9A96E]"
                            : "border-muted"
                        }`}
                      >
                        {!billingSameAsShipping && (
                          <div className="m-auto h-1.5 w-1.5 rounded-full bg-[#0F0F0F]" />
                        )}
                      </div>
                      <span className="text-sm">Use different billing address</span>
                    </RadioGroup.Item>
                  </RadioGroup.Root>
                </div>

                {/* Cards Accepted */}
                <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>We accept:</span>
                  <span className="rounded border border-border px-2 py-0.5 font-mono">
                    VISA
                  </span>
                  <span className="rounded border border-border px-2 py-0.5 font-mono">
                    MC
                  </span>
                  <span className="rounded border border-border px-2 py-0.5 font-mono">
                    AMEX
                  </span>
                  <span className="rounded border border-border px-2 py-0.5 font-mono">
                    PayPal
                  </span>
                </div>

                {/* Terms */}
                <p className="mt-3 text-[11px] text-muted-foreground">
                  By placing your order, you agree to our Terms of Service and
                  Privacy Policy. Your payment information is encrypted and secure.
                </p>

                <div className="mt-6 flex gap-3">
                  <motion.button
                    onClick={() => goToStep(2, -1)}
                    className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border-2 border-border font-semibold transition hover:border-[#C9A96E]"
                    whileTap={{ scale: 0.98 }}
                  >
                    <ChevronLeft size={18} />
                    Back
                  </motion.button>
                  <motion.button
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                    className="flex h-14 flex-[2] items-center justify-center gap-2 rounded-full bg-[#0F0F0F] font-semibold text-white transition disabled:opacity-70"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isPlacingOrder ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock size={18} />
                        Place Order · ${total.toFixed(2)}
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right — Order Summary */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <OrderSummary
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            couponApplied={couponApplied}
            setCouponApplied={setCouponApplied}
            couponError={couponError}
            setCouponError={setCouponError}
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, ChevronRight, ChevronLeft, Lock, Truck, Package,
  Loader2, Zap, CircleArrowUp, AlertCircle,
} from "lucide-react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import Image from "next/image";
import { useCartStore } from "@/store/cart-store";
import { getShippingCost } from "@/lib/shipping";
import { TAX_RATE, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import type { ShippingMethod } from "@/lib/shipping";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

interface CheckoutFlowProps {
  onOrderComplete: (orderId: string, orderNumber: string) => void;
}

const steps = [
  { id: 1, label: "Information" },
  { id: 2, label: "Shipping" },
  { id: 3, label: "Payment" },
];

const countries = [
  "United States","United Kingdom","Canada","Australia","Germany","France",
  "Italy","Spain","Netherlands","Japan","South Korea","China","India",
  "Brazil","Mexico","UAE","Saudi Arabia","Turkey","Sweden","Switzerland",
];

const infoSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  address: z.string().min(5, "Please enter a valid address"),
  city: z.string().min(2, "City is required"),
  state: z.string().optional(),
  postalCode: z.string().min(3, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  phone: z.string().optional(),
});

type InfoFormData = z.infer<typeof infoSchema>;

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-8 flex items-center justify-center">
      {steps.map((step, idx) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition ${
                isActive ? "border-[#C9A96E] bg-[#C9A96E] text-[#0F0F0F]" :
                isCompleted ? "border-[#C9A96E] bg-[#C9A96E]/20 text-[#C9A96E]" :
                "border-muted bg-muted text-muted-foreground"
              }`}>
                {isCompleted ? <Check size={18} /> : step.id}
              </div>
              <span className={`mt-2 text-xs font-medium ${isActive ? "text-[#C9A96E]" : isCompleted ? "text-[#C9A96E]/70" : "text-muted-foreground"}`}>{step.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`mx-3 h-0.5 w-12 sm:w-20 transition ${isCompleted ? "bg-[#C9A96E]" : "bg-muted"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderSummary({
  shippingOption,
  couponCode,
  setCouponCode,
  couponApplied,
  setCouponApplied,
  couponError,
  setCouponError,
  couponDiscount,
  setCouponDiscount,
}: {
  shippingOption: string;
  couponCode: string; setCouponCode: (v: string) => void;
  couponApplied: boolean; setCouponApplied: (v: boolean) => void;
  couponError: string; setCouponError: (v: string) => void;
  couponDiscount: number; setCouponDiscount: (v: number) => void;
}) {
  const { items, subtotal } = useCartStore();
  const shipping = getShippingCost(subtotal, shippingOption as ShippingMethod);
  const tax = subtotal * TAX_RATE;
  const discount = couponDiscount;
  const total = subtotal + shipping + tax - discount;

  const handleApply = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      setCouponApplied(false);
      setCouponDiscount(0);
      return;
    }
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, cartTotal: subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setCouponApplied(true);
        setCouponError("");
        setCouponDiscount(data.discount);
      } else {
        setCouponApplied(false);
        setCouponError(data.message || "Invalid coupon code");
        setCouponDiscount(0);
      }
    } catch {
      setCouponError("Failed to validate coupon");
      setCouponApplied(false);
      setCouponDiscount(0);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="mb-4 text-lg font-bold">Order Summary</h3>
      <div className="max-h-96 space-y-3 overflow-y-auto">
        {items.map((item) => (
          <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3">
            <div className="relative h-[60px] w-[60px] flex-shrink-0 overflow-hidden rounded-lg bg-muted">
              {item.image ? <Image src={item.image} alt={item.name} fill className="object-cover" sizes="60px" /> : <div className="flex h-full w-full items-center justify-center text-lg">👕</div>}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.size && `Size: ${item.size}`}{item.size && item.color && " · "}{item.color && `Color: ${item.color}`} · Qty: {item.quantity}</p>
              <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
      <hr className="my-4 border-border" />
      <div className="mb-4 flex gap-2">
        <input type="text" value={couponCode} onChange={(e) => { setCouponCode(e.target.value); if (couponApplied) { setCouponApplied(false); setCouponDiscount(0); } }} placeholder="Coupon code" className="flex-1 rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" />
        <button onClick={handleApply} className="rounded-xl bg-[#C9A96E] px-4 py-2 text-sm font-semibold text-[#0F0F0F]">Apply</button>
      </div>
      {couponApplied && <p className="mb-2 text-xs text-green-500">✓ {couponCode} applied!</p>}
      {couponError && <p className="mb-2 text-xs text-destructive">{couponError}</p>}
      <hr className="mb-4 border-border" />
      <div className="space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Tax ({(TAX_RATE * 100).toFixed(0)}%)</span><span>${tax.toFixed(2)}</span></div>
        {discount > 0 && <div className="flex justify-between text-green-500"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
        <hr className="border-border" />
        <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-[#C9A96E]">${total.toFixed(2)}</span></div>
      </div>
      {subtotal < FREE_SHIPPING_THRESHOLD && (
        <p className="mt-3 text-xs text-muted-foreground">Add ${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free standard shipping!</p>
      )}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Lock size={12} /> SSL Secure</span>
        <span className="flex items-center gap-1"><Package size={12} /> Tracked Delivery</span>
      </div>
    </div>
  );
}

// Stripe Payment Form component — rendered inside Elements provider
function StripePaymentForm({
  total,
  onSuccess,
  onError,
}: {
  total: number;
  onSuccess: (orderId: string, orderNumber: string) => void;
  onError: (message: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation`,
      },
      redirect: "if_required",
    });

    if (error) {
      const msg = error.message || "Payment failed. Please try again.";
      setPaymentError(msg);
      onError(msg);
      setIsProcessing(false);
    } else if (paymentIntent) {
      // Payment succeeded (no redirect needed or 3DS completed)
      // Use orderId/orderNumber from server response (set in CheckoutFlow state)
      onSuccess("", "");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        options={{
          layout: "tabs",
        }}
      />
      {paymentError && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-destructive" />
          <p className="text-sm text-destructive">{paymentError}</p>
        </div>
      )}
      <motion.button
        type="submit"
        disabled={!stripe || isProcessing}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#0F0F0F] font-semibold text-white transition disabled:opacity-70"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        {isProcessing ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Processing Payment...
          </>
        ) : (
          <>
            <Lock size={18} /> Pay ${total.toFixed(2)}
          </>
        )}
      </motion.button>
    </form>
  );
}

// Lazy-loaded Stripe promise
let stripePromise: ReturnType<typeof loadStripe> | null = null;

function getStripePromise() {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.error("Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
      return null;
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
}

export function CheckoutFlow({ onOrderComplete }: CheckoutFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [shippingOption, setShippingOption] = useState<ShippingMethod>("standard");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Stripe state
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, getValues } = useForm<InfoFormData>({ resolver: zodResolver(infoSchema) });
  const { items, subtotal, clearCart } = useCartStore();

  const shippingCost = getShippingCost(subtotal, shippingOption);
  const total = subtotal + shippingCost + subtotal * TAX_RATE - couponDiscount;

  const goToStep = (step: number, dir: number) => { setDirection(dir); setCurrentStep(step); };
  const onInfoSubmit = () => goToStep(2, 1);

  const handleContinueToPayment = useCallback(async () => {
    if (isPlacingOrder) return;

    setIsPlacingOrder(true);
    setPaymentError(null);

    try {
      const formValues = getValues();
      const shippingAddress = {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        address: formValues.address,
        city: formValues.city,
        state: formValues.state || "",
        postalCode: formValues.postalCode,
        country: formValues.country,
        phone: formValues.phone || "",
      };

      const response = await fetch("/api/checkout/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          })),
          couponCode: couponApplied ? couponCode : undefined,
          shippingMethod: shippingOption,
          guestEmail: formValues.email,
          shippingAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPaymentError(data.error || "Failed to create payment");
        setIsPlacingOrder(false);
        return;
      }

      setClientSecret(data.clientSecret);
      setOrderId(data.orderId);
      setOrderNumber(data.orderNumber);
      goToStep(3, 1);
    } catch {
      setPaymentError("Network error. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  }, [isPlacingOrder, items, couponApplied, couponCode, shippingOption, getValues]);

  const handlePaymentSuccess = useCallback(
    (_paymentOrderId: string, _paymentOrderNumber: string) => {
      clearCart();
      // Use the orderId/orderNumber we got from the server
      if (orderId && orderNumber) {
        onOrderComplete(orderId, orderNumber);
      }
    },
    [clearCart, orderId, orderNumber, onOrderComplete]
  );

  const handlePaymentError = useCallback((message: string) => {
    setPaymentError(message);
  }, []);

  // Reset payment state when going back
  useEffect(() => {
    if (currentStep < 3) {
      setClientSecret(null);
      setPaymentError(null);
    }
  }, [currentStep]);

  const slide = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  };

  const stripeP = getStripePromise();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <StepIndicator currentStep={currentStep} />
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="relative min-h-[400px] overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            {/* STEP 1 — Information */}
            {currentStep === 1 && (
              <motion.div key="s1" custom={direction} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <form onSubmit={handleSubmit(onInfoSubmit)}>
                  <h2 className="mb-4 text-xl font-bold">Contact Information</h2>
                  <div className="mb-6">
                    <label className="mb-1 block text-sm font-medium">Email</label>
                    <input {...register("email")} type="email" placeholder="you@example.com" className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" />
                    {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
                  </div>
                  <h2 className="mb-4 text-xl font-bold">Shipping Address</h2>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium">First Name</label>
                        <input {...register("firstName")} className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" />
                        {errors.firstName && <p className="mt-1 text-xs text-destructive">{errors.firstName.message}</p>}
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">Last Name</label>
                        <input {...register("lastName")} className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" />
                        {errors.lastName && <p className="mt-1 text-xs text-destructive">{errors.lastName.message}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Address</label>
                      <input {...register("address")} placeholder="123 Fashion Street" className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" />
                      {errors.address && <p className="mt-1 text-xs text-destructive">{errors.address.message}</p>}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium">City</label>
                        <input {...register("city")} className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" />
                        {errors.city && <p className="mt-1 text-xs text-destructive">{errors.city.message}</p>}
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">State</label>
                        <input {...register("state")} className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">ZIP</label>
                        <input {...register("postalCode")} className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" />
                        {errors.postalCode && <p className="mt-1 text-xs text-destructive">{errors.postalCode.message}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Country</label>
                      <select {...register("country")} className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]">
                        <option value="">Select country</option>
                        {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {errors.country && <p className="mt-1 text-xs text-destructive">{errors.country.message}</p>}
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Phone (optional)</label>
                      <input {...register("phone")} type="tel" placeholder="+1 (555) 000-0000" className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" />
                    </div>
                  </div>
                  <motion.button type="submit" className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#C9A96E] font-semibold text-[#0F0F0F]" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    Continue to Shipping <ChevronRight size={18} />
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* STEP 2 — Shipping */}
            {currentStep === 2 && (
              <motion.div key="s2" custom={direction} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <h2 className="mb-6 text-xl font-bold">Shipping Method</h2>
                <RadioGroup.Root value={shippingOption} onValueChange={(v) => setShippingOption(v as ShippingMethod)} className="space-y-3">
                  {[
                    { value: "standard" as const, icon: Truck, title: "Standard Shipping", desc: "5–7 Business Days", price: getShippingCost(subtotal, "standard") === 0 ? "Free" : `$${getShippingCost(subtotal, "standard").toFixed(2)}` },
                    { value: "express" as const, icon: Zap, title: "Express Shipping", desc: "2–3 Business Days", price: `$${getShippingCost(subtotal, "express").toFixed(2)}` },
                    { value: "nextday" as const, icon: CircleArrowUp, title: "Next Day Delivery", desc: "Next Business Day", price: `$${getShippingCost(subtotal, "nextday").toFixed(2)}` },
                  ].map((opt) => (
                    <RadioGroup.Item key={opt.value} value={opt.value}
                      className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${shippingOption === opt.value ? "border-[#C9A96E] bg-[#C9A96E]/5" : "border-border hover:border-[#C9A96E]/50"}`}>
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A96E]/10"><opt.icon size={20} className="text-[#C9A96E]" /></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between"><span className="font-medium">{opt.title}</span><span className="font-semibold">{opt.price}</span></div>
                        <p className="text-sm text-muted-foreground">{opt.desc}</p>
                      </div>
                      <div className={`h-5 w-5 rounded-full border-2 ${shippingOption === opt.value ? "border-[#C9A96E] bg-[#C9A96E]" : "border-muted"}`}>
                        {shippingOption === opt.value && <Check size={12} className="m-auto text-[#0F0F0F]" />}
                      </div>
                    </RadioGroup.Item>
                  ))}
                </RadioGroup.Root>
                <div className="mt-6 flex gap-3">
                  <motion.button onClick={() => goToStep(1, -1)} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border-2 border-border font-semibold transition hover:border-[#C9A96E]" whileTap={{ scale: 0.98 }}><ChevronLeft size={18} /> Back</motion.button>
                  <motion.button onClick={handleContinueToPayment} disabled={isPlacingOrder} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#C9A96E] font-semibold text-[#0F0F0F] disabled:opacity-70" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    {isPlacingOrder ? <Loader2 size={18} className="animate-spin" /> : <>Continue to Payment <ChevronRight size={18} /></>}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* STEP 3 — Payment */}
            {currentStep === 3 && (
              <motion.div key="s3" custom={direction} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <div className="mb-6 flex items-center gap-2"><Lock size={20} className="text-[#C9A96E]" /><h2 className="text-xl font-bold">Payment Information</h2></div>

                {paymentError && (
                  <div className="mb-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-destructive" />
                    <p className="text-sm text-destructive">{paymentError}</p>
                  </div>
                )}

                {clientSecret && stripeP ? (
                  <Elements stripe={stripeP} options={{ clientSecret }}>
                    <StripePaymentForm
                      total={total}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </Elements>
                ) : !clientSecret ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 size={24} className="animate-spin text-[#C9A96E]" />
                    <span className="ml-3 text-muted-foreground">Preparing payment...</span>
                  </div>
                ) : (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                    <p className="text-sm text-destructive">Stripe is not configured. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.</p>
                  </div>
                )}

                <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>We accept:</span>
                  {["VISA", "MC", "AMEX", "PayPal"].map((c) => <span key={c} className="rounded border border-border px-2 py-0.5 font-mono">{c}</span>)}
                </div>
                <p className="mt-3 text-[11px] text-muted-foreground">By placing this order you agree to our Terms of Service and Privacy Policy.</p>

                <div className="mt-4">
                  <motion.button onClick={() => goToStep(2, -1)} className="flex h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-border font-semibold transition hover:border-[#C9A96E]" whileTap={{ scale: 0.98 }}><ChevronLeft size={18} /> Back to Shipping</motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <OrderSummary
            shippingOption={shippingOption}
            couponCode={couponCode} setCouponCode={setCouponCode}
            couponApplied={couponApplied} setCouponApplied={setCouponApplied}
            couponError={couponError} setCouponError={setCouponError}
            couponDiscount={couponDiscount} setCouponDiscount={setCouponDiscount}
          />
        </div>
      </div>
    </div>
  );
}

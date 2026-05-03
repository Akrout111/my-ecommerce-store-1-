'use client';
import { useRouter } from 'next/navigation';
import { CheckoutFlow } from '@/components/checkout/CheckoutFlow';

export default function CheckoutPage() {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-background py-8">
      <div className="mx-auto max-w-6xl px-4">
        <CheckoutFlow onOrderComplete={(orderId, _orderNumber) => router.push(`/order-confirmation?orderId=${orderId}`)} />
      </div>
    </main>
  );
}

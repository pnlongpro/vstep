"use client";

import { CheckoutForm } from "@/components/payment/checkout-form";

export default function CheckoutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Thanh toán</h1>
      <CheckoutForm />
    </div>
  );
}

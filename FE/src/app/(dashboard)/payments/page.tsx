"use client";

import { PaymentHistory } from "@/components/payment/payment-history";

export default function PaymentsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Thanh toán</h1>
        <p className="text-muted-foreground">
          Lịch sử giao dịch và quản lý gói đăng ký
        </p>
      </div>

      <PaymentHistory />
    </div>
  );
}

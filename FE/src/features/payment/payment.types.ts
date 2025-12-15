export interface PaymentMethod {
  id: string;
  name: string;
  code: "vnpay" | "momo" | "credit_card" | "bank_transfer";
  icon: string;
  isAvailable: boolean;
}

export interface CheckoutRequest {
  plan: "free" | "basic" | "premium" | "vip";
  paymentMethod: string;
  billingCycle: "monthly" | "quarterly" | "yearly";
}

export interface CheckoutResponse {
  success: boolean;
  data: {
    transactionId: string;
    paymentUrl?: string;
    qrCode?: string;
  };
}

export interface Transaction {
  id: string;
  transactionId: string;
  type: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: "pending" | "processing" | "completed" | "failed" | "refunded";
  createdAt: string;
}

export interface Subscription {
  id: string;
  plan: "free" | "basic" | "premium" | "vip";
  status: "active" | "cancelled" | "expired";
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  price: number;
}

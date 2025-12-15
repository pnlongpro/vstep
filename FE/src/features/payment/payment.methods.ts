export const VNPAY_CONFIG = {
  tmnCode: process.env.NEXT_PUBLIC_VNPAY_TMN_CODE || "",
  hashSecret: process.env.NEXT_PUBLIC_VNPAY_HASH_SECRET || "",
  url: process.env.NEXT_PUBLIC_VNPAY_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  returnUrl: process.env.NEXT_PUBLIC_VNPAY_RETURN_URL || "",
};

export const MOMO_CONFIG = {
  partnerCode: process.env.NEXT_PUBLIC_MOMO_PARTNER_CODE || "",
  accessKey: process.env.NEXT_PUBLIC_MOMO_ACCESS_KEY || "",
  secretKey: process.env.NEXT_PUBLIC_MOMO_SECRET_KEY || "",
  endpoint: process.env.NEXT_PUBLIC_MOMO_ENDPOINT || "https://test-payment.momo.vn/v2/gateway/api/create",
  returnUrl: process.env.NEXT_PUBLIC_MOMO_RETURN_URL || "",
  notifyUrl: process.env.NEXT_PUBLIC_MOMO_NOTIFY_URL || "",
};

export function formatPrice(amount: number, currency: string = "VND"): string {
  if (currency === "VND") {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }
  return amount.toString();
}

export function getPaymentIcon(method: string): string {
  const icons: Record<string, string> = {
    vnpay: "/icons/vnpay.svg",
    momo: "/icons/momo.svg",
    credit_card: "/icons/credit-card.svg",
    bank_transfer: "/icons/bank.svg",
  };
  return icons[method] || "/icons/payment.svg";
}

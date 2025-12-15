export const PAYMENT_METHODS = {
  VNPAY: "vnpay",
  MOMO: "momo",
  CREDIT_CARD: "credit_card",
  BANK_TRANSFER: "bank_transfer",
} as const;

export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: "free",
    name: "Miễn phí",
    price: 0,
    features: [
      "10 bài luyện tập/tháng",
      "Chấm tự động R/L",
      "Dashboard cơ bản",
    ],
  },
  BASIC: {
    id: "basic",
    name: "Basic",
    price: 199000,
    features: [
      "50 bài luyện tập/tháng",
      "Chấm tự động R/L",
      "AI chấm W/S (giới hạn)",
      "Dashboard đầy đủ",
    ],
  },
  PREMIUM: {
    id: "premium",
    name: "Premium",
    price: 299000,
    features: [
      "Không giới hạn bài tập",
      "AI chấm W/S đầy đủ",
      "Thi thử không giới hạn",
      "Dashboard nâng cao",
      "Lộ trình cá nhân hóa",
    ],
  },
  VIP: {
    id: "vip",
    name: "VIP",
    price: 599000,
    features: [
      "Tất cả tính năng Premium",
      "1-1 với giáo viên",
      "Feedback chi tiết",
      "Ưu tiên hỗ trợ 24/7",
    ],
  },
} as const;

export const BILLING_CYCLES = {
  MONTHLY: {
    id: "monthly",
    name: "Theo tháng",
    discount: 0,
  },
  QUARTERLY: {
    id: "quarterly",
    name: "3 tháng",
    discount: 10,
  },
  YEARLY: {
    id: "yearly",
    name: "12 tháng",
    discount: 20,
  },
} as const;

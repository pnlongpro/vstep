export const ENV = {
  // API URLs
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3000",
  
  // App Config
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "VSTEPRO",
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001",
  
  // Auth
  JWT_SECRET: process.env.JWT_SECRET || "",
  
  // Payment - VNPay
  VNPAY_TMN_CODE: process.env.NEXT_PUBLIC_VNPAY_TMN_CODE || "",
  VNPAY_HASH_SECRET: process.env.NEXT_PUBLIC_VNPAY_HASH_SECRET || "",
  VNPAY_URL: process.env.NEXT_PUBLIC_VNPAY_URL || "",
  
  // Payment - Momo
  MOMO_PARTNER_CODE: process.env.NEXT_PUBLIC_MOMO_PARTNER_CODE || "",
  MOMO_ACCESS_KEY: process.env.NEXT_PUBLIC_MOMO_ACCESS_KEY || "",
  
  // Feature Flags
  ENABLE_AI_CHAT: process.env.NEXT_PUBLIC_ENABLE_AI_CHAT === "true",
  ENABLE_PAYMENT: process.env.NEXT_PUBLIC_ENABLE_PAYMENT === "true",
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
} as const;

export function getEnv(key: keyof typeof ENV): string | boolean {
  return ENV[key];
}

export function validateEnv(): void {
  const required = ["API_URL", "WS_URL"];
  
  for (const key of required) {
    if (!ENV[key as keyof typeof ENV]) {
      console.warn(`⚠️ Missing environment variable: ${key}`);
    }
  }
}

export const ROUTES = {
  // Public
  HOME: "/",
  PRICING: "/pricing",
  ABOUT: "/about",

  // Auth
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",

  // Dashboard
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",

  // Exams
  EXAMS: "/exams",
  EXAM_DETAIL: (id: string) => `/exams/${id}`,

  // Practice
  PRACTICE: "/practice",
  PRACTICE_SESSION: (id: string) => `/practice/${id}`,

  // Chat
  CHAT: "/chat",
  AI_CHAT: "/chat/ai",

  // Payments
  PAYMENTS: "/payments",
  CHECKOUT: "/payments/checkout",

  // Admin
  ADMIN: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_EXAMS: "/admin/exams",
  ADMIN_PAYMENTS: "/admin/payments",
} as const;

export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    PROFILE: "/auth/profile",
    REFRESH: "/auth/refresh",
  },
  EXAMS: {
    LIST: "/exams",
    DETAIL: (id: string) => `/exams/${id}`,
    START: (id: string) => `/exams/${id}/start`,
    SUBMIT: (attemptId: string) => `/exams/attempts/${attemptId}/submit`,
  },
  PRACTICE: {
    LIST: "/practice",
    START: "/practice/start",
    SAVE: (sessionId: string) => `/practice/${sessionId}/save`,
  },
  CHAT: {
    ROOMS: "/chat/rooms",
    MESSAGES: (roomId: string) => `/chat/rooms/${roomId}/messages`,
  },
  PAYMENT: {
    METHODS: "/payment/methods",
    CHECKOUT: "/payment/checkout",
    TRANSACTIONS: "/payment/transactions",
  },
} as const;

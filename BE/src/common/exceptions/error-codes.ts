import { HttpStatus } from '@nestjs/common';

/**
 * Application Error Codes
 * Format: DOMAIN_ACTION_ERROR (e.g., AUTH_LOGIN_INVALID_CREDENTIALS)
 */
export const ErrorCodes = {
  // ==================== GENERAL ====================
  INTERNAL_SERVER_ERROR: {
    code: 'INTERNAL_SERVER_ERROR',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    status: HttpStatus.BAD_REQUEST,
  },
  NOT_FOUND: {
    code: 'NOT_FOUND',
    status: HttpStatus.NOT_FOUND,
  },
  FORBIDDEN: {
    code: 'FORBIDDEN',
    status: HttpStatus.FORBIDDEN,
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    status: HttpStatus.UNAUTHORIZED,
  },

  // ==================== AUTH ====================
  AUTH_INVALID_CREDENTIALS: {
    code: 'AUTH_INVALID_CREDENTIALS',
    status: HttpStatus.UNAUTHORIZED,
  },
  AUTH_ACCOUNT_SUSPENDED: {
    code: 'AUTH_ACCOUNT_SUSPENDED',
    status: HttpStatus.UNAUTHORIZED,
  },
  AUTH_ACCOUNT_INACTIVE: {
    code: 'AUTH_ACCOUNT_INACTIVE',
    status: HttpStatus.UNAUTHORIZED,
  },
  AUTH_EMAIL_EXISTS: {
    code: 'AUTH_EMAIL_EXISTS',
    status: HttpStatus.CONFLICT,
  },
  AUTH_SESSION_EXPIRED: {
    code: 'AUTH_SESSION_EXPIRED',
    status: HttpStatus.UNAUTHORIZED,
  },
  AUTH_SESSION_REVOKED: {
    code: 'AUTH_SESSION_REVOKED',
    status: HttpStatus.UNAUTHORIZED,
  },
  AUTH_DEVICE_LIMIT_REACHED: {
    code: 'AUTH_DEVICE_LIMIT_REACHED',
    status: HttpStatus.FORBIDDEN,
  },
  AUTH_TOKEN_INVALID: {
    code: 'AUTH_TOKEN_INVALID',
    status: HttpStatus.UNAUTHORIZED,
  },
  AUTH_TOKEN_EXPIRED: {
    code: 'AUTH_TOKEN_EXPIRED',
    status: HttpStatus.UNAUTHORIZED,
  },
  AUTH_REFRESH_TOKEN_INVALID: {
    code: 'AUTH_REFRESH_TOKEN_INVALID',
    status: HttpStatus.UNAUTHORIZED,
  },
  AUTH_REFRESH_TOKEN_EXPIRED: {
    code: 'AUTH_REFRESH_TOKEN_EXPIRED',
    status: HttpStatus.UNAUTHORIZED,
  },
  AUTH_PASSWORD_RESET_EXPIRED: {
    code: 'AUTH_PASSWORD_RESET_EXPIRED',
    status: HttpStatus.BAD_REQUEST,
  },
  AUTH_PASSWORD_RESET_INVALID: {
    code: 'AUTH_PASSWORD_RESET_INVALID',
    status: HttpStatus.BAD_REQUEST,
  },
  AUTH_EMAIL_NOT_VERIFIED: {
    code: 'AUTH_EMAIL_NOT_VERIFIED',
    status: HttpStatus.FORBIDDEN,
  },
  AUTH_OAUTH_FAILED: {
    code: 'AUTH_OAUTH_FAILED',
    status: HttpStatus.BAD_REQUEST,
  },

  // ==================== USER ====================
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    status: HttpStatus.NOT_FOUND,
  },
  USER_EMAIL_EXISTS: {
    code: 'USER_EMAIL_EXISTS',
    status: HttpStatus.CONFLICT,
  },
  USER_UPDATE_FAILED: {
    code: 'USER_UPDATE_FAILED',
    status: HttpStatus.BAD_REQUEST,
  },
  USER_DELETE_FAILED: {
    code: 'USER_DELETE_FAILED',
    status: HttpStatus.BAD_REQUEST,
  },

  // ==================== EXAM ====================
  EXAM_NOT_FOUND: {
    code: 'EXAM_NOT_FOUND',
    status: HttpStatus.NOT_FOUND,
  },
  EXAM_ALREADY_STARTED: {
    code: 'EXAM_ALREADY_STARTED',
    status: HttpStatus.BAD_REQUEST,
  },
  EXAM_ALREADY_COMPLETED: {
    code: 'EXAM_ALREADY_COMPLETED',
    status: HttpStatus.BAD_REQUEST,
  },
  EXAM_TIME_EXPIRED: {
    code: 'EXAM_TIME_EXPIRED',
    status: HttpStatus.BAD_REQUEST,
  },
  EXAM_ACCESS_DENIED: {
    code: 'EXAM_ACCESS_DENIED',
    status: HttpStatus.FORBIDDEN,
  },

  // ==================== ADMIN ====================
  ADMIN_USER_NOT_FOUND: {
    code: 'ADMIN_USER_NOT_FOUND',
    status: HttpStatus.NOT_FOUND,
  },
  ADMIN_ROLE_NOT_FOUND: {
    code: 'ADMIN_ROLE_NOT_FOUND',
    status: HttpStatus.NOT_FOUND,
  },
  ADMIN_SESSION_NOT_FOUND: {
    code: 'ADMIN_SESSION_NOT_FOUND',
    status: HttpStatus.NOT_FOUND,
  },
  ADMIN_ACTION_FORBIDDEN: {
    code: 'ADMIN_ACTION_FORBIDDEN',
    status: HttpStatus.FORBIDDEN,
  },

  // ==================== PAYMENT ====================
  PAYMENT_FAILED: {
    code: 'PAYMENT_FAILED',
    status: HttpStatus.BAD_REQUEST,
  },
  PAYMENT_INVALID_AMOUNT: {
    code: 'PAYMENT_INVALID_AMOUNT',
    status: HttpStatus.BAD_REQUEST,
  },
  PAYMENT_SUBSCRIPTION_EXPIRED: {
    code: 'PAYMENT_SUBSCRIPTION_EXPIRED',
    status: HttpStatus.FORBIDDEN,
  },
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

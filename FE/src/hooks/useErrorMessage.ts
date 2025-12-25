'use client';

import { useTranslations } from 'next-intl';
import { LogoutRequiredCodes, SpecialHandlingCodes, ApiError } from '@/lib/error-codes';

/**
 * Hook to get translated error messages based on error codes
 */
export function useErrorMessage() {
  const t = useTranslations('errors');

  /**
   * Get translated error message from error code
   */
  const getErrorMessage = (code: string, fallback?: string): string => {
    try {
      return t(code);
    } catch {
      return fallback || t('default');
    }
  };

  /**
   * Get error message from API error object
   */
  const getApiErrorMessage = (error: ApiError | any): string => {
    if (error?.code) {
      return getErrorMessage(error.code, error.message);
    }
    return error?.message || t('default');
  };

  /**
   * Check if error requires logout
   */
  const isLogoutRequired = (code: string): boolean => {
    return LogoutRequiredCodes.includes(code);
  };

  /**
   * Check if error needs special handling
   */
  const isSpecialHandling = (code: string): boolean => {
    return SpecialHandlingCodes.includes(code);
  };

  return {
    getErrorMessage,
    getApiErrorMessage,
    isLogoutRequired,
    isSpecialHandling,
  };
}

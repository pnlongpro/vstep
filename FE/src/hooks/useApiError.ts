import { useCallback } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { 
  parseApiError, 
  isLogoutRequired, 
  needsSpecialHandling,
  getErrorMessage as getDefaultErrorMessage,
  ApiError 
} from '@/lib/error-codes';
import { tokenUtils } from '@/utils/token.utils';

interface UseApiErrorOptions {
  showToast?: boolean;
  onLogoutRequired?: () => void;
  onDeviceLimitReached?: (details: { limit: number; current: number }) => void;
  onAccountInactive?: () => void;
}

/**
 * Hook for handling API errors consistently with i18n support
 */
export function useApiError(options: UseApiErrorOptions = {}) {
  const router = useRouter();
  const t = useTranslations('errors');
  const { 
    showToast = true, 
    onLogoutRequired, 
    onDeviceLimitReached,
    onAccountInactive,
  } = options;

  /**
   * Get translated error message from error code
   */
  const getTranslatedMessage = useCallback((code: string, fallback?: string): string => {
    try {
      return t(code);
    } catch {
      return fallback || t('default');
    }
  }, [t]);

  const handleError = useCallback((error: any): ApiError => {
    const apiError = parseApiError(error);
    const message = getTranslatedMessage(apiError.code, apiError.message);

    // Handle logout required errors
    if (isLogoutRequired(apiError.code)) {
      if (onLogoutRequired) {
        onLogoutRequired();
      } else {
        // Default: clear tokens and redirect to login
        tokenUtils.clearTokens();
        router.push('/login');
      }
      
      if (showToast) {
        toast.error(message);
      }
      return apiError;
    }

    // Handle special cases
    if (needsSpecialHandling(apiError.code)) {
      switch (apiError.code) {
        case 'AUTH_DEVICE_LIMIT_REACHED':
          if (onDeviceLimitReached && apiError.details) {
            onDeviceLimitReached(apiError.details);
          } else if (showToast) {
            toast.error(message);
          }
          return apiError;

        case 'AUTH_ACCOUNT_INACTIVE':
        case 'AUTH_EMAIL_NOT_VERIFIED':
          if (onAccountInactive) {
            onAccountInactive();
          } else if (showToast) {
            toast.error(message);
          }
          return apiError;
      }
    }

    // Default: show toast
    if (showToast) {
      toast.error(message);
    }

    return apiError;
  }, [showToast, onLogoutRequired, onDeviceLimitReached, onAccountInactive, router, getTranslatedMessage]);

  /**
   * Handle error without throwing
   */
  const handleErrorSilent = useCallback((error: any): ApiError => {
    return parseApiError(error);
  }, []);

  return {
    handleError,
    handleErrorSilent,
    parseApiError,
    getErrorMessage: getTranslatedMessage,
    isLogoutRequired,
    needsSpecialHandling,
  };
}

/**
 * Simple error handler for cases where hook/translations are not available
 * Uses the getErrorMessage from error-codes which has fallback messages
 */
export function handleApiError(error: any, showToast = true): ApiError {
  const apiError = parseApiError(error);
  const message = getDefaultErrorMessage(apiError.code, apiError.message);

  if (showToast) {
    toast.error(message);
  }

  return apiError;
}

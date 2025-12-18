'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/features/auth/auth.store';
import { tokenUtils } from '@/utils/token.utils';

interface AuthGuardProps {
  children: React.ReactNode;
  fallbackUrl?: string;
}

/**
 * AuthGuard - Protects routes that require authentication
 * Redirects to login if user is not authenticated
 */
export default function AuthGuard({ 
  children, 
  fallbackUrl = '/login' 
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isInitialized, checkAuth } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      // Skip if already authenticated and initialized
      if (isAuthenticated && isInitialized) {
        setIsChecking(false);
        return;
      }
      
      // If tokens exist, verify them
      if (tokenUtils.hasValidTokens()) {
        await checkAuth();
      }
      setIsChecking(false);
    };

    verifyAuth();
  }, [checkAuth, isAuthenticated, isInitialized]);

  useEffect(() => {
    if (!isChecking && isInitialized && !isAuthenticated) {
      // Encode current path for redirect after login
      const redirectUrl = encodeURIComponent(pathname);
      router.replace(`${fallbackUrl}?redirect=${redirectUrl}`);
    }
  }, [isChecking, isInitialized, isAuthenticated, router, pathname, fallbackUrl]);

  // Show loading while checking authentication
  if (isChecking || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Đang kiểm tra xác thực...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render children (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

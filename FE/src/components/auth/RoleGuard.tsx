'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldX, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/features/auth/auth.store';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Role = 'student' | 'teacher' | 'admin';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallbackUrl?: string;
  showAccessDenied?: boolean;
}

/**
 * RoleGuard - Protects routes based on user roles
 * Must be used inside an AuthGuard or after authentication is confirmed
 */
export default function RoleGuard({
  children,
  allowedRoles,
  fallbackUrl = '/home',
  showAccessDenied = true,
}: RoleGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, isInitialized } = useAuthStore();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isInitialized) return;

    // If not authenticated, redirect to login (this should be handled by AuthGuard)
    if (!isAuthenticated || !user) {
      router.replace('/login');
      return;
    }

    // Check if user has required role with proper type validation
    const userRole = user.role?.name;
    const validRoles: Role[] = ['student', 'teacher', 'admin'];
    const isValidRole = userRole && validRoles.includes(userRole as Role);
    const hasRequiredRole = isValidRole && allowedRoles.includes(userRole as Role);
    
    setHasAccess(hasRequiredRole);

    // If no access and not showing access denied, redirect
    if (!hasRequiredRole && !showAccessDenied) {
      router.replace(fallbackUrl);
    }
  }, [isInitialized, isAuthenticated, user, allowedRoles, router, fallbackUrl, showAccessDenied]);

  // Loading state
  if (!isInitialized || hasAccess === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Access denied
  if (!hasAccess) {
    if (showAccessDenied) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldX className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Không có quyền truy cập
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
            </p>
            <div className="space-y-3">
              <Link href="/home">
                <Button className="w-full">Về trang chủ</Button>
              </Link>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.back()}
              >
                Quay lại
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  return <>{children}</>;
}

/**
 * Convenience wrapper for admin-only routes
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['admin']}>
      {children}
    </RoleGuard>
  );
}

/**
 * Convenience wrapper for teacher-only routes
 */
export function TeacherGuard({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['teacher', 'admin']}>
      {children}
    </RoleGuard>
  );
}

/**
 * Convenience wrapper for student routes (all authenticated users)
 */
export function StudentGuard({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['student', 'teacher', 'admin']}>
      {children}
    </RoleGuard>
  );
}

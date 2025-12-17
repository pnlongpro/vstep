# FE-005: Protected Route HOC

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-005 |
| **Phase** | 1 - MVP |
| **Sprint** | 1-2 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 3h |
| **Dependencies** | FE-001, FE-006 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Existing files ĐÃ CÓ SẴN:**
> - `middleware.ts` - ✅ Đã có JWT validation và redirect logic
> - `features/auth/auth.store.ts` - ✅ Đã có auth state

**Action:**
- ✅ CHECK existing `middleware.ts` logic
- ✅ ADD client-side guards (AuthGuard, RoleGuard) nếu chưa có
- ❌ KHÔNG viết lại middleware nếu đã hoạt động

---

## 🎯 Objective

ENHANCE Protected Route system (không tạo lại middleware):
- Next.js Middleware cho route protection
- ProtectedRoute component (client-side)
- Role-based access control (RBAC)
- Guest-only routes (redirect if logged in)

---

## 📝 Requirements

### Features

1. **Middleware Protection**:
   - Server-side route protection
   - Redirect unauthenticated users to login
   - Pass original URL for post-login redirect

2. **Client-side Protection**:
   - AuthGuard component
   - Loading states during auth check
   - Role-based rendering

3. **Route Types**:
   - Protected (authenticated only)
   - Guest only (login, register pages)
   - Public (anyone can access)
   - Role-restricted (admin, teacher only)

---

## 💻 Implementation

### File Structure

```
src/
├── middleware.ts
├── components/auth/
│   ├── AuthGuard.tsx
│   ├── RoleGuard.tsx
│   └── GuestGuard.tsx
├── hooks/
│   └── useAuth.ts
└── lib/
    └── auth-config.ts
```

### Step 1: Auth Configuration

```typescript
// src/lib/auth-config.ts

export const AUTH_CONFIG = {
  // Routes that require authentication
  protectedRoutes: [
    '/dashboard',
    '/practice',
    '/exam',
    '/profile',
    '/settings',
    '/history',
  ],
  
  // Routes only for guests (redirect to dashboard if logged in)
  guestOnlyRoutes: [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
  ],
  
  // Routes that require specific roles
  roleRestrictedRoutes: {
    '/admin': ['admin'],
    '/teacher': ['admin', 'teacher'],
  },
  
  // Public routes (no protection needed)
  publicRoutes: [
    '/',
    '/about',
    '/pricing',
    '/contact',
    '/auth/reset-password', // Token-based, handled separately
    '/auth/verify-email',
  ],
  
  // Default redirects
  defaultAuthRedirect: '/dashboard',
  defaultGuestRedirect: '/auth/login',
} as const;

// Helper to check if route matches patterns
export function matchesRoute(pathname: string, patterns: readonly string[]): boolean {
  return patterns.some(pattern => {
    if (pattern.endsWith('*')) {
      return pathname.startsWith(pattern.slice(0, -1));
    }
    return pathname === pattern || pathname.startsWith(pattern + '/');
  });
}

// Get required roles for a route
export function getRequiredRoles(pathname: string): string[] | null {
  for (const [route, roles] of Object.entries(AUTH_CONFIG.roleRestrictedRoutes)) {
    if (pathname.startsWith(route)) {
      return roles;
    }
  }
  return null;
}
```

### Step 2: Next.js Middleware

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_CONFIG, matchesRoute, getRequiredRoles } from '@/lib/auth-config';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip API routes, static files, etc.
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // Static files like favicon.ico
  ) {
    return NextResponse.next();
  }

  // Get tokens from cookies
  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;
  const hasValidTokens = accessToken || refreshToken;

  // Check if route is public
  if (matchesRoute(pathname, AUTH_CONFIG.publicRoutes)) {
    return NextResponse.next();
  }

  // Guest-only routes (login, register)
  if (matchesRoute(pathname, AUTH_CONFIG.guestOnlyRoutes)) {
    if (hasValidTokens) {
      // User is logged in, redirect to dashboard
      return NextResponse.redirect(
        new URL(AUTH_CONFIG.defaultAuthRedirect, request.url)
      );
    }
    return NextResponse.next();
  }

  // Protected routes
  if (matchesRoute(pathname, AUTH_CONFIG.protectedRoutes)) {
    if (!hasValidTokens) {
      // User is not logged in, redirect to login with return URL
      const loginUrl = new URL(AUTH_CONFIG.defaultGuestRedirect, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Role-restricted routes (basic check - full check happens client-side)
  const requiredRoles = getRequiredRoles(pathname);
  if (requiredRoles && !hasValidTokens) {
    const loginUrl = new URL(AUTH_CONFIG.defaultGuestRedirect, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next (Next.js internals)
     * - Static files (favicon, images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
};
```

### Step 3: useAuth Hook

```typescript
// src/hooks/useAuth.ts
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

interface UseAuthOptions {
  required?: boolean;
  redirectTo?: string;
  allowedRoles?: string[];
}

interface UseAuthResult {
  user: ReturnType<typeof useAuthStore>['user'];
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

export function useAuth(options: UseAuthOptions = {}): UseAuthResult {
  const { required = false, redirectTo, allowedRoles } = options;
  const router = useRouter();
  
  const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  // Check auth on mount
  useEffect(() => {
    const check = async () => {
      await checkAuth();
      setIsChecking(false);
    };
    check();
  }, [checkAuth]);

  // Handle redirects
  useEffect(() => {
    if (isChecking || isLoading) return;

    if (required && !isAuthenticated) {
      const redirect = redirectTo || `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      router.push(redirect);
      return;
    }

    if (allowedRoles && isAuthenticated && user) {
      const userRoles = user.roles?.map(r => r.name) || [];
      const hasAllowedRole = allowedRoles.some(role => userRoles.includes(role));
      
      if (!hasAllowedRole) {
        router.push('/403'); // Forbidden page
      }
    }
  }, [isAuthenticated, isLoading, isChecking, required, redirectTo, allowedRoles, user, router]);

  // Role check helpers
  const hasRole = (role: string): boolean => {
    if (!user?.roles) return false;
    return user.roles.some(r => r.name === role);
  };

  const hasAnyRole = (roles: string[]): boolean => {
    if (!user?.roles) return false;
    return roles.some(role => user.roles.some(r => r.name === role));
  };

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || isChecking,
    hasRole,
    hasAnyRole,
  };
}
```

### Step 4: AuthGuard Component

```tsx
// src/components/auth/AuthGuard.tsx
'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export default function AuthGuard({ 
  children, 
  fallback,
  redirectTo = '/auth/login' 
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth({
    required: true,
    redirectTo,
  });

  // Loading state
  if (isLoading) {
    return fallback || <AuthLoadingFallback />;
  }

  // Not authenticated - will redirect via useAuth
  if (!isAuthenticated) {
    return fallback || <AuthLoadingFallback />;
  }

  return <>{children}</>;
}

function AuthLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Đang xác thực...</p>
      </div>
    </div>
  );
}
```

### Step 5: RoleGuard Component

```tsx
// src/components/auth/RoleGuard.tsx
'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, ShieldX } from 'lucide-react';
import Link from 'next/link';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
  showForbidden?: boolean;
}

export default function RoleGuard({
  children,
  allowedRoles,
  fallback,
  showForbidden = true,
}: RoleGuardProps) {
  const { isAuthenticated, isLoading, hasAnyRole } = useAuth({
    required: true,
    allowedRoles,
  });

  // Loading state
  if (isLoading) {
    return fallback || <RoleLoadingFallback />;
  }

  // Not authenticated
  if (!isAuthenticated) {
    return fallback || <RoleLoadingFallback />;
  }

  // No required role
  if (!hasAnyRole(allowedRoles)) {
    if (showForbidden) {
      return <ForbiddenPage />;
    }
    return fallback || null;
  }

  return <>{children}</>;
}

function RoleLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Đang kiểm tra quyền truy cập...</p>
      </div>
    </div>
  );
}

function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldX className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Truy cập bị từ chối
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Bạn không có quyền truy cập vào trang này. 
          Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
        </p>
        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="block w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Về trang chủ
          </Link>
          <Link
            href="/contact"
            className="block w-full py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Liên hệ hỗ trợ
          </Link>
        </div>
      </div>
    </div>
  );
}
```

### Step 6: GuestGuard Component

```tsx
// src/components/auth/GuestGuard.tsx
'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Loader2 } from 'lucide-react';

interface GuestGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

export default function GuestGuard({ 
  children, 
  redirectTo = '/dashboard' 
}: GuestGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  // If authenticated, don't render children (redirect is happening)
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
```

### Step 7: 403 Forbidden Page

```tsx
// src/app/403/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldX } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Truy cập bị từ chối - VSTEPRO',
};

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldX className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          403
        </h1>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Truy cập bị từ chối
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Bạn không có quyền truy cập vào trang này.
        </p>
        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="block w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Về Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
```

---

## 📦 Usage Examples

### Protected Page

```tsx
// src/app/dashboard/page.tsx
import AuthGuard from '@/components/auth/AuthGuard';
import DashboardContent from '@/components/dashboard/DashboardContent';

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
```

### Role-Protected Page

```tsx
// src/app/admin/page.tsx
import RoleGuard from '@/components/auth/RoleGuard';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default function AdminPage() {
  return (
    <RoleGuard allowedRoles={['admin']}>
      <AdminDashboard />
    </RoleGuard>
  );
}
```

### Guest-Only Page

```tsx
// src/app/auth/login/page.tsx
import GuestGuard from '@/components/auth/GuestGuard';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <GuestGuard>
      <LoginForm />
    </GuestGuard>
  );
}
```

---

## ✅ Acceptance Criteria

- [ ] Middleware protects routes server-side
- [ ] Unauthenticated users redirect to login
- [ ] Login page redirects authenticated users to dashboard
- [ ] Original URL preserved for post-login redirect
- [ ] Role-based access control working
- [ ] Forbidden page for unauthorized access
- [ ] Loading states while checking auth
- [ ] Guards reusable as HOC/wrapper

---

## 🧪 Testing

1. Access /dashboard without login → Redirect to /auth/login?redirect=/dashboard
2. Login → Redirect back to /dashboard
3. Access /auth/login when logged in → Redirect to /dashboard
4. Access /admin without admin role → Show 403 page
5. Refresh protected page → Maintain access

---

## ⏭️ Next Task

→ `FE-006_AUTH_STORE.md` - Zustand Auth Store Implementation

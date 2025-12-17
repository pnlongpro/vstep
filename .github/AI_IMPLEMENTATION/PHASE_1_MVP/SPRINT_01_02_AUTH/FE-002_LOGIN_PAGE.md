# FE-002: Login Page

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-002 |
| **Phase** | 1 - MVP |
| **Sprint** | 1-2 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 4h |
| **Dependencies** | FE-001 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Existing files ĐÃ CÓ SẴN:**
> - `app/(auth)/login/page.tsx` - ✅ Đã có login form functional (~78 lines)
> - `features/auth/auth.hooks.ts` - ✅ Đã có useAuth hook
> - `components/ui/input.tsx`, `button.tsx` - ✅ shadcn/ui components

**Existing login page đã có:**
- ✅ Email/password inputs
- ✅ useAuth hook integration
- ✅ Toast notifications
- ✅ Links to register/forgot-password

**Action:**
- ❌ KHÔNG tạo mới `components/auth/LoginForm.tsx`
- ❌ KHÔNG tạo mới `app/auth/login/page.tsx`
- ✅ ENHANCE existing `app/(auth)/login/page.tsx`

**Chỉ cần THÊM vào existing page:**
- Show/hide password toggle
- Remember me checkbox
- Social login buttons
- Better validation với react-hook-form + zod

---

## 🎯 Objective

ENHANCE Login Page hiện có (không tạo mới):
- Email/password form với validation
- Error handling và hiển thị
- Remember me option
- Social login buttons
- Responsive design

---

## 📝 Requirements

### Features

1. **Form Fields**:
   - Email input với validation
   - Password input (show/hide toggle)
   - Remember me checkbox
   - Submit button với loading state

2. **Validation**:
   - Client-side validation
   - Display server errors
   - Field-level error messages

3. **UX**:
   - Loading states
   - Success redirect
   - Keyboard accessibility

---

## 💻 Implementation

### File Structure

```
src/
├── app/auth/
│   ├── login/
│   │   └── page.tsx
│   └── layout.tsx
├── components/auth/
│   ├── LoginForm.tsx
│   ├── SocialLoginButtons.tsx
│   └── AuthLayout.tsx
└── hooks/
    └── useAuth.ts
```

### Step 1: Auth Layout

```tsx
// src/app/auth/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Xác thực - VSTEPRO',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex min-h-screen">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-blue-600 items-center justify-center p-12">
          <div className="max-w-md text-white">
            <h1 className="text-4xl font-bold mb-6">VSTEPRO</h1>
            <p className="text-xl text-blue-100 mb-8">
              Nền tảng luyện thi VSTEP hàng đầu Việt Nam với AI chấm điểm tự động
            </p>
            <ul className="space-y-4 text-blue-100">
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Luyện tập 4 kỹ năng: Nghe, Nói, Đọc, Viết
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                AI chấm điểm Writing & Speaking
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Đề thi thử chuẩn format VSTEP
              </li>
            </ul>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Step 2: Login Form Component

```tsx
// src/components/auth/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { ApiError } from '@/lib/api-error';
import { useAuthStore } from '@/store/auth.store';

// Validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email không được để trống')
    .email('Email không hợp lệ'),
  password: z
    .string()
    .min(1, 'Mật khẩu không được để trống'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.login({
        email: data.email,
        password: data.password,
      });

      // Update auth store
      setUser(result.user);

      // Redirect
      router.push(redirectTo);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.statusCode === 401) {
          setError('Email hoặc mật khẩu không đúng');
        } else {
          setError(err.message);
        }
      } else {
        setError('Đã xảy ra lỗi. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Đăng nhập
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Chào mừng bạn quay trở lại
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Success Message (from registration) */}
      {searchParams.get('registered') && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-600 dark:text-green-400">
            Đăng ký thành công! Vui lòng đăng nhập.
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('email')}
              type="email"
              id="email"
              autoComplete="email"
              className={`
                block w-full pl-10 pr-3 py-3 border rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                dark:bg-gray-700 dark:border-gray-600 dark:text-white
                ${errors.email
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
                }
              `}
              placeholder="email@example.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Mật khẩu
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              className={`
                block w-full pl-10 pr-10 py-3 border rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                dark:bg-gray-700 dark:border-gray-600 dark:text-white
                ${errors.password
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
                }
              `}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              {...register('rememberMe')}
              type="checkbox"
              id="rememberMe"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="rememberMe"
              className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
            >
              Ghi nhớ đăng nhập
            </label>
          </div>
          <Link
            href="/auth/forgot-password"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Quên mật khẩu?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`
            w-full flex justify-center items-center py-3 px-4 border border-transparent
            rounded-lg shadow-sm text-sm font-medium text-white
            bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2
            focus:ring-offset-2 focus:ring-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200
          `}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Đang đăng nhập...
            </>
          ) : (
            'Đăng nhập'
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="my-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
              Hoặc đăng nhập với
            </span>
          </div>
        </div>
      </div>

      {/* Social Login */}
      <SocialLoginButtons />

      {/* Register Link */}
      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Chưa có tài khoản?{' '}
        <Link
          href="/auth/register"
          className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
        >
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}
```

### Step 3: Social Login Buttons

```tsx
// src/components/auth/SocialLoginButtons.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGoogleLogin } from '@react-oauth/google';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';

export default function SocialLoginButtons() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { setUser } = useAuthStore();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      setIsLoading('google');
      try {
        // Exchange access token for ID token or use access token
        const result = await authService.googleAuth({
          idToken: response.access_token, // Note: This is access_token, not id_token
        });
        setUser(result.user);
        router.push('/dashboard');
      } catch (error) {
        console.error('Google login error:', error);
      } finally {
        setIsLoading(null);
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
      setIsLoading(null);
    },
  });

  return (
    <div className="grid grid-cols-1 gap-3">
      {/* Google */}
      <button
        type="button"
        onClick={() => handleGoogleLogin()}
        disabled={!!isLoading}
        className={`
          flex items-center justify-center w-full px-4 py-3 border
          border-gray-300 dark:border-gray-600 rounded-lg shadow-sm
          bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600
          text-sm font-medium text-gray-700 dark:text-gray-200
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
        `}
      >
        {isLoading === 'google' ? (
          <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
        ) : (
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        Tiếp tục với Google
      </button>

      {/* Facebook (Optional) */}
      {/* <button
        type="button"
        disabled={!!isLoading}
        className="..."
      >
        <svg>...</svg>
        Tiếp tục với Facebook
      </button> */}
    </div>
  );
}
```

### Step 4: Login Page

```tsx
// src/app/auth/login/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Đăng nhập - VSTEPRO',
  description: 'Đăng nhập vào tài khoản VSTEPRO của bạn',
};

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFormSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginFormSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto mb-8" />
      <div className="space-y-6">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
}
```

### Step 5: Auth Store (Zustand)

```typescript
// src/store/auth.store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types/auth.types';
import { tokenUtils } from '@/utils/token.utils';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      logout: () => {
        tokenUtils.clearTokens();
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      checkAuth: async () => {
        set({ isLoading: true });
        
        if (!tokenUtils.hasValidTokens()) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return;
        }

        try {
          const { authService } = await import('@/services/auth.service');
          const user = await authService.getMe();
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          tokenUtils.clearTokens();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'vstepro-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);
```

---

## 📦 Dependencies

```bash
npm install react-hook-form @hookform/resolvers zod zustand @react-oauth/google lucide-react
```

---

## ✅ Acceptance Criteria

- [ ] Email/password form working
- [ ] Client-side validation
- [ ] Server error display
- [ ] Show/hide password toggle
- [ ] Remember me checkbox
- [ ] Loading states
- [ ] Google login button
- [ ] Redirect after login
- [ ] Responsive design
- [ ] Keyboard accessible

---

## 🧪 Testing

1. Valid login → Redirect to dashboard
2. Invalid email format → Show error
3. Wrong password → Show "Email hoặc mật khẩu không đúng"
4. Empty fields → Show required errors
5. Google login → Complete OAuth flow

---

## 📚 References

- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [Zustand State Management](https://zustand-demo.pmnd.rs/)

---

## ⏭️ Next Task

→ `FE-003_REGISTER_PAGE.md` - Register Page Implementation

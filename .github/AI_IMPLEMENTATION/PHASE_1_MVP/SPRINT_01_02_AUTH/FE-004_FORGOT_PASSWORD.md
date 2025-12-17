# FE-004: Forgot Password Flow

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-004 |
| **Phase** | 1 - MVP |
| **Sprint** | 1-2 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 3h |
| **Dependencies** | FE-001 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Existing files ĐÃ CÓ SẴN:**
> - `app/(auth)/forgot-password/page.tsx` - ✅ Đã có page (verify completeness)
> - `features/auth/auth.api.ts` - ✅ Đã có forgotPassword, resetPassword methods

**Action:**
- ❌ KHÔNG tạo mới `components/auth/ForgotPasswordForm.tsx` nếu đã có
- ✅ VERIFY existing page completeness
- ✅ ADD reset-password page route nếu chưa có

---

## 🎯 Objective

VERIFY & ENHANCE Forgot Password flow:
- Request reset email page
- Reset password page (from email link)
- Success states và confirmations
- Token validation và error handling

---

## 📝 Requirements

### Features

1. **Forgot Password Page**:
   - Email input field
   - Submit button
   - Success confirmation
   - Rate limiting feedback

2. **Reset Password Page**:
   - Token validation
   - New password input
   - Confirm password input
   - Password strength indicator
   - Success redirect

---

## 💻 Implementation

### File Structure

```
src/
├── app/auth/
│   ├── forgot-password/
│   │   └── page.tsx
│   └── reset-password/
│       └── page.tsx
└── components/auth/
    ├── ForgotPasswordForm.tsx
    └── ResetPasswordForm.tsx
```

### Step 1: Forgot Password Form

```tsx
// src/components/auth/ForgotPasswordForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { ApiError } from '@/lib/api-error';

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email không được để trống')
    .email('Email không hợp lệ'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.forgotPassword(data.email);
      setSubmittedEmail(data.email);
      setIsSuccess(true);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.statusCode === 429) {
          setError('Bạn đã yêu cầu quá nhiều lần. Vui lòng thử lại sau 1 phút.');
        } else {
          // Don't reveal if email exists or not for security
          setSubmittedEmail(data.email);
          setIsSuccess(true);
        }
      } else {
        setError('Đã xảy ra lỗi. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Kiểm tra email của bạn
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Nếu tài khoản với email <strong>{submittedEmail}</strong> tồn tại, 
          chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến hộp thư của bạn.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Không nhận được email? Kiểm tra thư mục spam hoặc thử lại sau 1 phút.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => {
              setIsSuccess(false);
              setError(null);
            }}
            className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Gửi lại email
          </button>
          <Link
            href="/auth/login"
            className="block w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
          >
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      {/* Back Link */}
      <Link
        href="/auth/login"
        className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Quay lại đăng nhập
      </Link>

      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Quên mật khẩu?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
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

        <button
          type="submit"
          disabled={isLoading}
          className={`
            w-full flex justify-center items-center py-3 px-4 border border-transparent
            rounded-lg shadow-sm text-sm font-medium text-white
            bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2
            focus:ring-offset-2 focus:ring-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Đang gửi...
            </>
          ) : (
            'Gửi hướng dẫn'
          )}
        </button>
      </form>
    </div>
  );
}
```

### Step 2: Forgot Password Page

```tsx
// src/app/auth/forgot-password/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Quên mật khẩu - VSTEPRO',
  description: 'Đặt lại mật khẩu tài khoản VSTEPRO của bạn',
};

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="animate-pulse bg-white rounded-2xl h-96" />}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
```

### Step 3: Reset Password Form

```tsx
// src/components/auth/ResetPasswordForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Lock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { ApiError } from '@/lib/api-error';
import PasswordStrengthMeter, { calculatePasswordStrength } from './PasswordStrengthMeter';

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .max(50, 'Mật khẩu không được quá 50 ký tự'),
  confirmPassword: z
    .string()
    .min(1, 'Vui lòng xác nhận mật khẩu'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

type PageState = 'loading' | 'valid' | 'invalid' | 'expired' | 'success';

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [pageState, setPageState] = useState<PageState>('loading');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch('password');

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setPageState('invalid');
        return;
      }

      try {
        await authService.validateResetToken(token);
        setPageState('valid');
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.statusCode === 400) {
            setPageState('expired');
          } else {
            setPageState('invalid');
          }
        } else {
          setPageState('invalid');
        }
      }
    };

    validateToken();
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;

    // Check password strength
    const strength = calculatePasswordStrength(data.password);
    if (strength.score < 3) {
      setError('Mật khẩu quá yếu. Vui lòng tạo mật khẩu mạnh hơn.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authService.resetPassword({
        token,
        newPassword: data.password,
      });
      setPageState('success');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.statusCode === 400) {
          setPageState('expired');
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

  // Loading state
  if (pageState === 'loading') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Đang xác thực...</p>
      </div>
    );
  }

  // Invalid token state
  if (pageState === 'invalid') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Liên kết không hợp lệ
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Liên kết đặt lại mật khẩu không hợp lệ hoặc đã được sử dụng.
        </p>
        <Link
          href="/auth/forgot-password"
          className="inline-block w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
        >
          Yêu cầu liên kết mới
        </Link>
      </div>
    );
  }

  // Expired token state
  if (pageState === 'expired') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-yellow-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Liên kết đã hết hạn
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Liên kết đặt lại mật khẩu này đã hết hạn sau 1 giờ. 
          Vui lòng yêu cầu liên kết mới.
        </p>
        <Link
          href="/auth/forgot-password"
          className="inline-block w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
        >
          Yêu cầu liên kết mới
        </Link>
      </div>
    );
  }

  // Success state
  if (pageState === 'success') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Mật khẩu đã được đặt lại
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Mật khẩu của bạn đã được thay đổi thành công. 
          Bạn có thể đăng nhập bằng mật khẩu mới.
        </p>
        <Link
          href="/auth/login"
          className="inline-block w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
        >
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  // Valid token - show reset form
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Đặt mật khẩu mới
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Tạo mật khẩu mới cho tài khoản của bạn
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Mật khẩu mới
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              className={`
                block w-full pl-10 pr-10 py-3 border rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                dark:bg-gray-700 dark:border-gray-600 dark:text-white
                ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
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
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
          <PasswordStrengthMeter password={password || ''} />
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Xác nhận mật khẩu
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="new-password"
              className={`
                block w-full pl-10 pr-10 py-3 border rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                dark:bg-gray-700 dark:border-gray-600 dark:text-white
                ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
              `}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`
            w-full flex justify-center items-center py-3 px-4 border border-transparent
            rounded-lg shadow-sm text-sm font-medium text-white
            bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2
            focus:ring-offset-2 focus:ring-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Đang cập nhật...
            </>
          ) : (
            'Đặt mật khẩu mới'
          )}
        </button>
      </form>
    </div>
  );
}
```

### Step 4: Reset Password Page

```tsx
// src/app/auth/reset-password/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Đặt lại mật khẩu - VSTEPRO',
  description: 'Đặt lại mật khẩu tài khoản VSTEPRO của bạn',
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="animate-pulse bg-white rounded-2xl h-96" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
```

### Step 5: Add Validate Token API

```typescript
// Add to src/services/auth.service.ts

async validateResetToken(token: string): Promise<{ valid: boolean }> {
  const response = await apiClient.post<{ valid: boolean }>(
    '/auth/validate-reset-token',
    { token }
  );
  return response.data;
}
```

---

## ✅ Acceptance Criteria

- [ ] Forgot password email submission
- [ ] Success confirmation (don't reveal if email exists)
- [ ] Rate limiting feedback
- [ ] Token validation on reset page
- [ ] Invalid token handling
- [ ] Expired token handling
- [ ] Password strength check
- [ ] Password match validation
- [ ] Success redirect to login
- [ ] Responsive design

---

## 🧪 Testing

1. Submit valid email → Show check email message
2. Submit rate limited → Show "try again later"
3. Open reset link → Show password form
4. Open expired link → Show expired message
5. Open invalid link → Show invalid message
6. Reset with weak password → Show error
7. Reset successfully → Redirect to login

---

## 📚 References

- [OWASP Password Reset](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html)

---

## ⏭️ Next Task

→ `FE-005_PROTECTED_ROUTE.md` - Protected Route HOC Implementation

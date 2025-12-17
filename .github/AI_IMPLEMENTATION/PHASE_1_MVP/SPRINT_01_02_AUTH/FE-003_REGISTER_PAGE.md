# FE-003: Register Page

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-003 |
| **Phase** | 1 - MVP |
| **Sprint** | 1-2 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 4h |
| **Dependencies** | FE-001, FE-002 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Existing files ĐÃ CÓ SẴN:**
> - `app/(auth)/register/page.tsx` - ✅ Đã có register form (~115 lines)
> - `features/auth/auth.hooks.ts` - ✅ Đã có useAuth với register method

**Existing register page đã có:**
- ✅ Name, email, password inputs
- ✅ useAuth hook integration
- ✅ Toast notifications

**Action:**
- ❌ KHÔNG tạo mới `components/auth/RegisterForm.tsx`
- ✅ ENHANCE existing `app/(auth)/register/page.tsx`

**Chỉ cần THÊM vào existing page:**
- Password strength meter component
- Confirm password field
- Terms of service checkbox
- Email availability check (debounced)

---

## 🎯 Objective

ENHANCE Register Page hiện có (không tạo mới):
- Full registration form với validation
- Password strength indicator
- Terms of service agreement
- Email verification trigger
- Social registration support

---

## 📝 Requirements

### Features

1. **Form Fields**:
   - Full name (họ và tên)
   - Email với unique check
   - Password với strength indicator
   - Confirm password
   - Terms checkbox
   - Optional: Phone number

2. **Validation**:
   - Real-time email availability check
   - Password strength meter
   - Password match validation
   - All field validations

3. **UX**:
   - Step-by-step guidance
   - Clear error messages
   - Success modal/redirect

---

## 💻 Implementation

### File Structure

```
src/
├── app/auth/
│   └── register/
│       └── page.tsx
├── components/auth/
│   ├── RegisterForm.tsx
│   ├── PasswordStrengthMeter.tsx
│   └── TermsModal.tsx
└── hooks/
    └── useDebounce.ts
```

### Step 1: Password Strength Meter

```tsx
// src/components/auth/PasswordStrengthMeter.tsx
'use client';

import { useMemo } from 'react';

interface PasswordStrengthMeterProps {
  password: string;
}

interface StrengthResult {
  score: number;
  label: string;
  color: string;
  checks: {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    number: boolean;
    special: boolean;
  };
}

export function calculatePasswordStrength(password: string): StrengthResult {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;

  const getLabel = (score: number) => {
    if (score === 0) return '';
    if (score <= 2) return 'Yếu';
    if (score <= 3) return 'Trung bình';
    if (score <= 4) return 'Mạnh';
    return 'Rất mạnh';
  };

  const getColor = (score: number) => {
    if (score === 0) return 'bg-gray-200';
    if (score <= 2) return 'bg-red-500';
    if (score <= 3) return 'bg-yellow-500';
    if (score <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return {
    score,
    label: getLabel(score),
    color: getColor(score),
    checks,
  };
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const strength = useMemo(() => calculatePasswordStrength(password), [password]);

  if (!password) return null;

  return (
    <div className="mt-2">
      {/* Strength Bar */}
      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-colors ${
              level <= strength.score ? strength.color : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>

      {/* Label */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">Độ mạnh: {strength.label}</span>
      </div>

      {/* Requirements Checklist */}
      <ul className="mt-2 space-y-1 text-xs text-gray-500 dark:text-gray-400">
        <li className={`flex items-center ${strength.checks.length ? 'text-green-600' : ''}`}>
          <span className="mr-1">{strength.checks.length ? '✓' : '○'}</span>
          Ít nhất 8 ký tự
        </li>
        <li className={`flex items-center ${strength.checks.lowercase ? 'text-green-600' : ''}`}>
          <span className="mr-1">{strength.checks.lowercase ? '✓' : '○'}</span>
          Chữ cái thường (a-z)
        </li>
        <li className={`flex items-center ${strength.checks.uppercase ? 'text-green-600' : ''}`}>
          <span className="mr-1">{strength.checks.uppercase ? '✓' : '○'}</span>
          Chữ cái in hoa (A-Z)
        </li>
        <li className={`flex items-center ${strength.checks.number ? 'text-green-600' : ''}`}>
          <span className="mr-1">{strength.checks.number ? '✓' : '○'}</span>
          Số (0-9)
        </li>
        <li className={`flex items-center ${strength.checks.special ? 'text-green-600' : ''}`}>
          <span className="mr-1">{strength.checks.special ? '✓' : '○'}</span>
          Ký tự đặc biệt (!@#$%...)
        </li>
      </ul>
    </div>
  );
}
```

### Step 2: Debounce Hook

```typescript
// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

### Step 3: Register Form

```tsx
// src/components/auth/RegisterForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Mail, Lock, User, CheckCircle, XCircle } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { ApiError } from '@/lib/api-error';
import { useDebounce } from '@/hooks/useDebounce';
import PasswordStrengthMeter, { calculatePasswordStrength } from './PasswordStrengthMeter';
import SocialLoginButtons from './SocialLoginButtons';

// Validation schema
const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Họ tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ tên không được quá 100 ký tự')
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, 'Họ tên chỉ được chứa chữ cái'),
  email: z
    .string()
    .min(1, 'Email không được để trống')
    .email('Email không hợp lệ'),
  password: z
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .max(50, 'Mật khẩu không được quá 50 ký tự'),
  confirmPassword: z
    .string()
    .min(1, 'Vui lòng xác nhận mật khẩu'),
  agreeTerms: z
    .boolean()
    .refine(val => val === true, 'Bạn phải đồng ý với điều khoản sử dụng'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Email availability check
  const [emailStatus, setEmailStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    },
  });

  const password = watch('password');
  const email = watch('email');
  const debouncedEmail = useDebounce(email, 500);

  // Check email availability
  useEffect(() => {
    const checkEmail = async () => {
      if (!debouncedEmail || !z.string().email().safeParse(debouncedEmail).success) {
        setEmailStatus('idle');
        return;
      }

      setEmailStatus('checking');
      try {
        const { available } = await authService.checkEmailAvailability(debouncedEmail);
        setEmailStatus(available ? 'available' : 'taken');
      } catch {
        setEmailStatus('idle');
      }
    };

    checkEmail();
  }, [debouncedEmail]);

  const onSubmit = async (data: RegisterFormData) => {
    // Check password strength
    const strength = calculatePasswordStrength(data.password);
    if (strength.score < 3) {
      setError('Mật khẩu quá yếu. Vui lòng tạo mật khẩu mạnh hơn.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authService.register({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
      });

      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/auth/login?registered=true');
      }, 3000);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.statusCode === 409) {
          setError('Email đã được sử dụng');
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

  // Success state
  if (success) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Đăng ký thành công!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Chúng tôi đã gửi email xác nhận đến địa chỉ email của bạn.
          Vui lòng kiểm tra hộp thư và xác nhận email để kích hoạt tài khoản.
        </p>
        <p className="text-sm text-gray-500">
          Bạn sẽ được chuyển đến trang đăng nhập trong giây lát...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tạo tài khoản
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Bắt đầu hành trình chinh phục VSTEP
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Họ và tên
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('fullName')}
              type="text"
              id="fullName"
              autoComplete="name"
              className={`
                block w-full pl-10 pr-3 py-3 border rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                dark:bg-gray-700 dark:border-gray-600 dark:text-white
                ${errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
              `}
              placeholder="Nguyễn Văn A"
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email */}
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
                block w-full pl-10 pr-10 py-3 border rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                dark:bg-gray-700 dark:border-gray-600 dark:text-white
                ${errors.email || emailStatus === 'taken'
                  ? 'border-red-500'
                  : emailStatus === 'available'
                  ? 'border-green-500'
                  : 'border-gray-300 dark:border-gray-600'
                }
              `}
              placeholder="email@example.com"
            />
            {/* Email Status Indicator */}
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {emailStatus === 'checking' && (
                <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
              )}
              {emailStatus === 'available' && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {emailStatus === 'taken' && (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
          {emailStatus === 'taken' && (
            <p className="mt-1 text-sm text-red-600">Email này đã được sử dụng</p>
          )}
          {emailStatus === 'available' && (
            <p className="mt-1 text-sm text-green-600">Email này có thể sử dụng</p>
          )}
        </div>

        {/* Password */}
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

        {/* Terms Checkbox */}
        <div className="flex items-start">
          <input
            {...register('agreeTerms')}
            type="checkbox"
            id="agreeTerms"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
          />
          <label
            htmlFor="agreeTerms"
            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
          >
            Tôi đồng ý với{' '}
            <Link href="/terms" className="text-blue-600 hover:underline" target="_blank">
              Điều khoản sử dụng
            </Link>{' '}
            và{' '}
            <Link href="/privacy" className="text-blue-600 hover:underline" target="_blank">
              Chính sách bảo mật
            </Link>
          </label>
        </div>
        {errors.agreeTerms && (
          <p className="text-sm text-red-600">{errors.agreeTerms.message}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || emailStatus === 'taken'}
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
              Đang tạo tài khoản...
            </>
          ) : (
            'Đăng ký'
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
              Hoặc đăng ký với
            </span>
          </div>
        </div>
      </div>

      {/* Social Login */}
      <SocialLoginButtons />

      {/* Login Link */}
      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Đã có tài khoản?{' '}
        <Link
          href="/auth/login"
          className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
        >
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
```

### Step 4: Register Page

```tsx
// src/app/auth/register/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import RegisterForm from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Đăng ký - VSTEPRO',
  description: 'Tạo tài khoản VSTEPRO để bắt đầu luyện thi VSTEP',
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterFormSkeleton />}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterFormSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto mb-8" />
      <div className="space-y-5">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
}
```

### Step 5: Add Check Email API to Service

```typescript
// Add to src/services/auth.service.ts

async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
  const response = await apiClient.post<{ available: boolean }>(
    '/auth/check-email',
    { email }
  );
  return response.data;
}
```

---

## 📦 Dependencies

Already included from FE-002:
- react-hook-form
- @hookform/resolvers
- zod
- lucide-react

---

## ✅ Acceptance Criteria

- [ ] All form fields working
- [ ] Real-time email availability check
- [ ] Password strength meter displayed
- [ ] Password match validation
- [ ] Terms checkbox required
- [ ] Success state with redirect
- [ ] Error handling complete
- [ ] Google OAuth register option
- [ ] Responsive design
- [ ] Loading states

---

## 🧪 Testing

1. Register with valid data → Show success, send verification email
2. Register with existing email → Show "Email đã được sử dụng"
3. Weak password → Show strength meter as "Yếu"
4. Password mismatch → Show error message
5. Without terms checked → Show required error
6. Google signup → Complete OAuth flow

---

## 📚 References

- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [Password Strength Patterns](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

## ⏭️ Next Task

→ `FE-004_FORGOT_PASSWORD.md` - Forgot Password Page Implementation

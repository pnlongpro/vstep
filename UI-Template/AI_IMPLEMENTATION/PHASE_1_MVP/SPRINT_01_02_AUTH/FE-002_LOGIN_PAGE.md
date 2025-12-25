# FE-002: Login/Register Pages

**Sprint**: 01-02 Authentication  
**Effort**: 5 hours  
**Priority**: P0 (Critical)  
**Status**: 🔴 Not Started

---

## 📋 Context

Tạo UI cho Login và Register pages với form validation, error handling, và loading states. Đây là điểm entry chính cho users vào hệ thống.

### Why this task?

- ✅ First impression của users
- ✅ Security-critical (authentication)
- ✅ Must be user-friendly và accessible
- ✅ Foundation cho all protected routes

### Business Value

- Enables user onboarding
- Professional first impression
- Reduces support tickets (clear error messages)
- Improves conversion rate

---

## 🎯 Requirements

### Functional Requirements

1. **Login Page**
   - Email + Password fields
   - "Remember me" checkbox
   - "Forgot password" link
   - Submit button
   - Link to Register page

2. **Register Page**
   - Full Name field
   - Email field
   - Password field (với strength indicator)
   - Confirm Password field
   - Role selector (Student/Teacher/Admin/Uploader)
   - Terms & Conditions checkbox
   - Submit button
   - Link to Login page

3. **Form Validation**
   - Email format validation
   - Password strength validation (min 8 chars, uppercase, lowercase, number)
   - Confirm password match
   - Required field validation
   - Real-time validation feedback

4. **Error Handling**
   - API error display
   - Network error handling
   - Validation error messages
   - Duplicate email handling

5. **Loading States**
   - Button loading spinner
   - Disable form during submission
   - Progress feedback

### Non-Functional Requirements

- **Performance**: Form response < 100ms
- **Security**: No password exposure, HTTPS only
- **Accessibility**: WCAG AA compliant, keyboard navigation
- **Responsive**: Works on mobile, tablet, desktop

---

## 🛠️ Implementation

### Step 1: Install Dependencies

```bash
npm install react-hook-form@7.55.0
npm install zod
npm install @hookform/resolvers
```

### Step 2: Create Types

```typescript
// types/auth.ts
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'student' | 'teacher' | 'admin' | 'uploader';
  acceptTerms: boolean;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
  token: string;
}

export interface AuthError {
  code: string;
  message: string;
}
```

### Step 3: Create Validation Schemas

```typescript
// utils/validation.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email là bắt buộc')
    .email('Email không hợp lệ'),
  password: z
    .string()
    .min(1, 'Mật khẩu là bắt buộc'),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Họ tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ tên không được quá 100 ký tự'),
  email: z
    .string()
    .min(1, 'Email là bắt buộc')
    .email('Email không hợp lệ'),
  password: z
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa')
    .regex(/[a-z]/, 'Mật khẩu phải có ít nhất 1 chữ thường')
    .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 số'),
  confirmPassword: z
    .string()
    .min(1, 'Xác nhận mật khẩu là bắt buộc'),
  role: z.enum(['student', 'teacher', 'admin', 'uploader']),
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, 'Bạn phải đồng ý với điều khoản'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});
```

### Step 4: Create Auth Hook

```typescript
// hooks/useAuth.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LoginCredentials, RegisterData, AuthResponse } from '../types/auth';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đăng nhập thất bại');
      }

      const data: AuthResponse = await response.json();
      
      // Store token
      if (credentials.rememberMe) {
        localStorage.setItem('token', data.token);
      } else {
        sessionStorage.setItem('token', data.token);
      }
      
      // Store user info
      localStorage.setItem('user', JSON.stringify(data.user));

      // Navigate to dashboard
      navigate(`/${data.user.role}`);
      
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Đã xảy ra lỗi không xác định';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đăng ký thất bại');
      }

      const authData: AuthResponse = await response.json();
      
      // Auto login after register
      localStorage.setItem('token', authData.token);
      localStorage.setItem('user', JSON.stringify(authData.user));

      navigate(`/${authData.user.role}`);
      
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Đã xảy ra lỗi không xác định';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { login, register, isLoading, error };
}
```

### Step 5: Create Login Page

```typescript
// components/auth/LoginPage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form@7.55.0';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { loginSchema } from '../../utils/validation';
import { useAuth } from '../../hooks/useAuth';
import type { LoginCredentials } from '../../types/auth';

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = (data: LoginCredentials) => {
    login(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Chào mừng đến VSTEPRO
          </h1>
          <p className="text-gray-600">
            Đăng nhập để tiếp tục luyện thi VSTEP
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                {...register('email')}
                type="email"
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  errors.email
                    ? 'border-red-500 focus:border-red-600'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
                placeholder="your.email@example.com"
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  errors.password
                    ? 'border-red-500 focus:border-red-600'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                {...register('rememberMe')}
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                disabled={isLoading}
              />
              <span className="text-sm text-gray-600">Ghi nhớ đăng nhập</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Quên mật khẩu?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang đăng nhập...</span>
              </>
            ) : (
              <span>Đăng nhập</span>
            )}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
```

### Step 6: Create Register Page

Similar structure với thêm fields cho fullName, confirmPassword, role, acceptTerms.

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Login với valid credentials → Success
- [ ] Login với invalid email → Error message
- [ ] Login với wrong password → Error message
- [ ] Register với valid data → Success
- [ ] Register với existing email → Error message
- [ ] Password strength indicator works
- [ ] Confirm password validation works
- [ ] "Remember me" persists token
- [ ] Form disabled during submission
- [ ] Loading spinner shows
- [ ] Error messages clear
- [ ] Keyboard navigation works
- [ ] Responsive on mobile

### Automated Tests

```typescript
// components/auth/__tests__/LoginPage.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginPage } from '../LoginPage';

describe('LoginPage', () => {
  it('renders login form', () => {
    render(<LoginPage />);
    expect(screen.getByText('Chào mừng đến VSTEPRO')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('your.email@example.com')).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<LoginPage />);
    
    const submitButton = screen.getByText('Đăng nhập');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email là bắt buộc')).toBeInTheDocument();
      expect(screen.getByText('Mật khẩu là bắt buộc')).toBeInTheDocument();
    });
  });

  it('shows error for invalid email', async () => {
    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('your.email@example.com');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText('Email không hợp lệ')).toBeInTheDocument();
    });
  });

  it('toggles password visibility', () => {
    render(<LoginPage />);
    
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const toggleButton = screen.getByRole('button', { name: '' }); // Eye icon button

    expect(passwordInput).toHaveAttribute('type', 'password');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
```

---

## ✅ Acceptance Criteria

### Must Have

- [ ] Login page renders correctly
- [ ] Register page renders correctly
- [ ] Form validation works (email, password, required fields)
- [ ] Error messages display correctly
- [ ] Loading states show during submission
- [ ] Successful login redirects to dashboard
- [ ] Successful register redirects to dashboard
- [ ] "Remember me" works
- [ ] Password visibility toggle works
- [ ] Responsive design works on all devices
- [ ] Accessibility: keyboard navigation
- [ ] Accessibility: screen reader friendly
- [ ] No TypeScript errors
- [ ] All tests passing

### Nice to Have

- [ ] Password strength indicator with colors
- [ ] Auto-focus on first field
- [ ] Enter key submits form
- [ ] Social login buttons (future)
- [ ] reCAPTCHA integration (future)

---

## 🔗 Dependencies

### Prerequisite Tasks

- ✅ BE-004: JWT Strategy (must complete first)
- ✅ FE-001: Auth API Client (must complete first)

### Blocks These Tasks

- FE-010: Reading Practice UI (needs auth)
- FE-020: Result Page (needs auth)

---

## 📚 Resources

- [React Hook Form Docs](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## ✍️ Completion Checklist

- [ ] Code implemented
- [ ] Manual testing passed
- [ ] Automated tests written và passing
- [ ] Responsive design verified
- [ ] Accessibility checked
- [ ] Error handling comprehensive
- [ ] Loading states implemented
- [ ] Code review approved
- [ ] Documentation updated
- [ ] Deployed to dev
- [ ] Task marked complete

---

**Created**: December 21, 2024  
**Completed**: _______________

# FE-007: Google OAuth Button

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-007 |
| **Phase** | 1 - MVP |
| **Sprint** | 1-2 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 4h |
| **Dependencies** | FE-001, BE-007 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Existing files:**
> - OAuth components chưa có - ✅ **CÓ THỂ TẠO MỚI**
> - `features/auth/auth.api.ts` - Đã có, cần thêm OAuth methods

**Action:**
- ✅ CREATE `components/auth/OAuthButtons.tsx` - Chưa có sẵn
- ✅ ADD OAuth methods vào `features/auth/auth.api.ts`

---

## 🎯 Objective

Implement Google OAuth button hoàn chỉnh:
- Google OAuth Provider setup
- OAuth button component
- Web redirect flow
- Error handling và loading states
- Link/unlink account support

---

## 📝 Requirements

### Features

1. **OAuth Flow**:
   - Google sign-in popup/redirect
   - Token exchange với backend
   - Auto-register if new user
   - Link to existing account

2. **UI**:
   - Google branded button
   - Loading state
   - Error display
   - Connected status (for linking)

---

## 💻 Implementation

### File Structure

```
src/
├── providers/
│   └── GoogleOAuthProvider.tsx
├── components/auth/
│   ├── GoogleLoginButton.tsx
│   ├── GoogleLinkButton.tsx
│   └── SocialLoginButtons.tsx
└── config/
    └── oauth.config.ts
```

### Step 1: OAuth Configuration

```typescript
// src/config/oauth.config.ts

export const OAUTH_CONFIG = {
  google: {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    scopes: [
      'openid',
      'profile',
      'email',
    ].join(' '),
    redirectUri: typeof window !== 'undefined' 
      ? `${window.location.origin}/auth/callback/google`
      : '',
  },
} as const;

// Validate config
if (!OAUTH_CONFIG.google.clientId) {
  console.warn('Warning: NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set');
}
```

### Step 2: Google OAuth Provider

```tsx
// src/providers/GoogleOAuthProvider.tsx
'use client';

import { ReactNode } from 'react';
import { GoogleOAuthProvider as GoogleProvider } from '@react-oauth/google';
import { OAUTH_CONFIG } from '@/config/oauth.config';

interface GoogleOAuthProviderProps {
  children: ReactNode;
}

export default function GoogleOAuthProvider({ children }: GoogleOAuthProviderProps) {
  if (!OAUTH_CONFIG.google.clientId) {
    console.warn('Google OAuth is not configured');
    return <>{children}</>;
  }

  return (
    <GoogleProvider 
      clientId={OAUTH_CONFIG.google.clientId}
      onScriptLoadError={() => console.error('Failed to load Google OAuth script')}
    >
      {children}
    </GoogleProvider>
  );
}
```

### Step 3: Update Root Layout

```tsx
// src/app/layout.tsx
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AuthProvider from '@/providers/AuthProvider';
import GoogleOAuthProvider from '@/providers/GoogleOAuthProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'vietnamese'] });

export const metadata: Metadata = {
  title: 'VSTEPRO - Luyện thi VSTEP với AI',
  description: 'Nền tảng luyện thi VSTEP hàng đầu Việt Nam',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <GoogleOAuthProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
```

### Step 4: Google Login Button

```tsx
// src/components/auth/GoogleLoginButton.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGoogleLogin, TokenResponse } from '@react-oauth/google';
import { Loader2 } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { ApiError } from '@/lib/api-error';

interface GoogleLoginButtonProps {
  mode?: 'login' | 'register';
  redirectTo?: string;
  className?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function GoogleLoginButton({
  mode = 'login',
  redirectTo = '/dashboard',
  className = '',
  onSuccess,
  onError,
}: GoogleLoginButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuthStore.getState();

  const handleSuccess = async (tokenResponse: TokenResponse) => {
    setIsLoading(true);
    setError(null);

    try {
      // Get user info from Google
      const googleUserResponse = await fetch(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        }
      );
      
      if (!googleUserResponse.ok) {
        throw new Error('Failed to get Google user info');
      }

      const googleUser = await googleUserResponse.json();

      // Exchange for ID token or use access token
      const result = await authService.googleAuth({
        accessToken: tokenResponse.access_token,
        // Some implementations might need to get ID token differently
        // idToken: tokenResponse.id_token, // Not available in this flow
        googleId: googleUser.sub,
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
      });

      // Update auth store
      useAuthStore.getState().updateUser(result.user);
      useAuthStore.setState({ 
        isAuthenticated: true,
        isLoading: false,
      });

      onSuccess?.();
      router.push(redirectTo);
    } catch (err) {
      let message = 'Đăng nhập Google thất bại';
      
      if (err instanceof ApiError) {
        if (err.statusCode === 409) {
          message = 'Email này đã được liên kết với tài khoản khác';
        } else {
          message = err.message;
        }
      }

      setError(message);
      onError?.(message);
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleSuccess,
    onError: (errorResponse) => {
      console.error('Google login error:', errorResponse);
      const message = 'Không thể kết nối với Google';
      setError(message);
      onError?.(message);
    },
    flow: 'implicit',
  });

  const buttonText = mode === 'register' 
    ? 'Đăng ký với Google' 
    : 'Đăng nhập với Google';

  return (
    <div>
      <button
        type="button"
        onClick={() => googleLogin()}
        disabled={isLoading}
        className={`
          flex items-center justify-center w-full px-4 py-3 border
          border-gray-300 dark:border-gray-600 rounded-lg shadow-sm
          bg-white dark:bg-gray-700 
          hover:bg-gray-50 dark:hover:bg-gray-600
          text-sm font-medium text-gray-700 dark:text-gray-200
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
          ${className}
        `}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
        ) : (
          <GoogleIcon className="w-5 h-5 mr-2" />
        )}
        {isLoading ? 'Đang xử lý...' : buttonText}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400 text-center">
          {error}
        </p>
      )}
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
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
  );
}
```

### Step 5: Google Link/Unlink Button

```tsx
// src/components/auth/GoogleLinkButton.tsx
'use client';

import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Loader2, Link2, Unlink } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';

interface GoogleLinkButtonProps {
  isLinked: boolean;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function GoogleLinkButton({
  isLinked,
  onSuccess,
  onError,
}: GoogleLinkButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { refreshUser } = useAuthStore();

  const handleLink = async (accessToken: string) => {
    setIsLoading(true);

    try {
      // Get Google user info
      const response = await fetch(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      
      const googleUser = await response.json();

      await authService.linkOAuthAccount({
        provider: 'google',
        googleId: googleUser.sub,
        accessToken,
      });

      await refreshUser();
      onSuccess?.();
    } catch (error: any) {
      onError?.(error.message || 'Không thể liên kết tài khoản Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlink = async () => {
    if (!confirm('Bạn có chắc muốn hủy liên kết tài khoản Google?')) return;

    setIsLoading(true);

    try {
      await authService.unlinkOAuthAccount('google');
      await refreshUser();
      onSuccess?.();
    } catch (error: any) {
      onError?.(error.message || 'Không thể hủy liên kết');
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (response) => handleLink(response.access_token),
    onError: () => onError?.('Không thể kết nối với Google'),
    flow: 'implicit',
  });

  if (isLinked) {
    return (
      <button
        type="button"
        onClick={handleUnlink}
        disabled={isLoading}
        className={`
          flex items-center justify-between w-full px-4 py-3 
          border border-gray-300 dark:border-gray-600 rounded-lg
          bg-white dark:bg-gray-700
          hover:bg-gray-50 dark:hover:bg-gray-600
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors
        `}
      >
        <div className="flex items-center">
          <GoogleIcon className="w-5 h-5 mr-3" />
          <span className="text-gray-700 dark:text-gray-200">Google</span>
        </div>
        <div className="flex items-center text-green-600">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span className="text-sm mr-2">Đã liên kết</span>
              <Unlink className="w-4 h-4" />
            </>
          )}
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => googleLogin()}
      disabled={isLoading}
      className={`
        flex items-center justify-between w-full px-4 py-3 
        border border-dashed border-gray-300 dark:border-gray-600 rounded-lg
        bg-gray-50 dark:bg-gray-800
        hover:bg-gray-100 dark:hover:bg-gray-700
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors
      `}
    >
      <div className="flex items-center">
        <GoogleIcon className="w-5 h-5 mr-3 opacity-50" />
        <span className="text-gray-500 dark:text-gray-400">Google</span>
      </div>
      <div className="flex items-center text-gray-500">
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <span className="text-sm mr-2">Liên kết</span>
            <Link2 className="w-4 h-4" />
          </>
        )}
      </div>
    </button>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
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
  );
}
```

### Step 6: Social Login Buttons (Updated)

```tsx
// src/components/auth/SocialLoginButtons.tsx
'use client';

import GoogleLoginButton from './GoogleLoginButton';

interface SocialLoginButtonsProps {
  mode?: 'login' | 'register';
  redirectTo?: string;
}

export default function SocialLoginButtons({
  mode = 'login',
  redirectTo,
}: SocialLoginButtonsProps) {
  return (
    <div className="space-y-3">
      <GoogleLoginButton
        mode={mode}
        redirectTo={redirectTo}
        onError={(error) => {
          console.error('Social login error:', error);
        }}
      />
      
      {/* Future: Add more providers */}
      {/* <FacebookLoginButton mode={mode} /> */}
      {/* <AppleLoginButton mode={mode} /> */}
    </div>
  );
}
```

### Step 7: Environment Variables

```bash
# .env.local

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

---

## 📦 Dependencies

```bash
npm install @react-oauth/google
```

---

## 📦 Usage Examples

### Login Page

```tsx
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';

function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
      <LoginForm />
      <div className="divider">Or</div>
      <SocialLoginButtons mode="login" />
    </div>
  );
}
```

### Settings Page (Link Account)

```tsx
import GoogleLinkButton from '@/components/auth/GoogleLinkButton';

function SecuritySettings() {
  const user = useUser();
  const isGoogleLinked = user?.oauthProviders?.includes('google');

  return (
    <div>
      <h2>Liên kết tài khoản</h2>
      <GoogleLinkButton
        isLinked={isGoogleLinked}
        onSuccess={() => toast.success('Đã cập nhật')}
        onError={(err) => toast.error(err)}
      />
    </div>
  );
}
```

---

## ✅ Acceptance Criteria

- [ ] Google OAuth Provider configured
- [ ] Login button works with popup
- [ ] New users auto-registered
- [ ] Existing users logged in
- [ ] Link/unlink account in settings
- [ ] Loading states shown
- [ ] Errors displayed to user
- [ ] Works with backend BE-007
- [ ] Environment variables documented

---

## 🧪 Testing

1. Click Google login → OAuth popup appears
2. Select Google account → User logged in
3. New Google user → Account created
4. Existing email → Error or login
5. Link account → Provider added
6. Unlink account → Provider removed

---

## 📚 References

- [react-oauth/google](https://www.npmjs.com/package/@react-oauth/google)
- [Google Identity Services](https://developers.google.com/identity)

---

## ⏭️ Next Sprint

→ `SPRINT_03_04_PRACTICE/` - Practice Module Implementation

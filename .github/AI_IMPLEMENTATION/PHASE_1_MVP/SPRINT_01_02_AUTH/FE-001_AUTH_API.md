# FE-001: Auth API Service Integration

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-001 |
| **Phase** | 1 - MVP |
| **Sprint** | 1-2 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 4h |
| **Dependencies** | BE-001 to BE-009 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Existing files ĐÃ CÓ SẴN:**
> - `features/auth/auth.api.ts` - ✅ Đã có login, register, logout, forgotPassword, resetPassword
> - `features/auth/auth.types.ts` - ✅ Đã có LoginRequest, RegisterRequest, AuthResponse, User
> - `features/auth/auth.store.ts` - ✅ Đã có Zustand store với persist
> - `features/auth/auth.hooks.ts` - ✅ Đã có useAuth hook
> - `lib/axios.ts` - ✅ Đã có apiClient configured

**Action:** 
- ❌ KHÔNG tạo file mới `services/auth.service.ts`
- ✅ EXTEND existing `features/auth/auth.api.ts`
- ✅ ADD refresh token interceptor vào `lib/axios.ts`

---

## 🎯 Objective

Mở rộng Auth API Service layer (KHÔNG tạo mới):
- HTTP client configuration với interceptors
- Auth API methods (login, register, logout, etc.)
- Token management (storage, refresh)
- Error handling

---

## 📝 Requirements

### Features

1. **API Client**:
   - Axios instance với base URL
   - Request interceptor (add auth header)
   - Response interceptor (handle 401, refresh token)

2. **Auth Service**:
   - All auth endpoints
   - Type-safe responses
   - Error handling

3. **Token Management**:
   - Secure storage
   - Auto-refresh before expiry
   - Clear on logout

---

## 💻 Implementation

### File Structure

```
src/
├── lib/
│   ├── api-client.ts
│   └── api-error.ts
├── services/
│   └── auth.service.ts
├── types/
│   └── auth.types.ts
└── utils/
    └── token.utils.ts
```

### Step 1: Types

```typescript
// src/types/auth.types.ts
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar: string | null;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  emailVerifiedAt: string | null;
  role: {
    id: string;
    name: string;
    displayName: string;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface GoogleAuthRequest {
  idToken: string;
}

export interface Session {
  id: string;
  deviceType: string;
  deviceName: string;
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  isCurrent: boolean;
  lastActiveAt: string;
  createdAt: string;
}

export interface SessionListResponse {
  sessions: Session[];
  total: number;
  currentSessionId: string;
}

export interface LoginHistoryItem {
  id: string;
  status: 'success' | 'failed' | 'blocked';
  method: string;
  ipAddress: string;
  location: string;
  deviceType: string;
  deviceName: string;
  browser: string;
  os: string;
  createdAt: string;
}

export interface LoginHistoryResponse {
  items: LoginHistoryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SecurityAlert {
  id: string;
  type: 'new_device' | 'new_location' | 'failed_attempts' | 'password_changed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  metadata: Record<string, any>;
  isDismissed: boolean;
  isRead: boolean;
  createdAt: string;
}

export interface SecurityAlertsResponse {
  alerts: SecurityAlert[];
  unreadCount: number;
  total: number;
}

export interface LinkedAccount {
  provider: string;
  email: string;
  linkedAt: string;
}
```

### Step 2: Token Utilities

```typescript
// src/utils/token.utils.ts
const ACCESS_TOKEN_KEY = 'vstepro_access_token';
const REFRESH_TOKEN_KEY = 'vstepro_refresh_token';
const TOKEN_EXPIRY_KEY = 'vstepro_token_expiry';

export const tokenUtils = {
  /**
   * Get access token from storage
   */
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  /**
   * Get refresh token from storage
   */
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Save tokens to storage
   */
  setTokens(accessToken: string, refreshToken: string, expiresIn: number): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    
    // Calculate and store expiry time
    const expiryTime = Date.now() + expiresIn * 1000;
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  },

  /**
   * Clear all tokens
   */
  clearTokens(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  },

  /**
   * Check if token is expired or about to expire (within 1 minute)
   */
  isTokenExpired(): boolean {
    if (typeof window === 'undefined') return true;
    
    const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiryTime) return true;
    
    // Consider expired if less than 1 minute remaining
    return Date.now() > parseInt(expiryTime) - 60 * 1000;
  },

  /**
   * Check if user has valid tokens
   */
  hasValidTokens(): boolean {
    return !!this.getAccessToken() && !this.isTokenExpired();
  },

  /**
   * Decode JWT payload (without verification)
   */
  decodeToken(token: string): Record<string, any> | null {
    try {
      const base64Payload = token.split('.')[1];
      const payload = Buffer.from(base64Payload, 'base64').toString();
      return JSON.parse(payload);
    } catch {
      return null;
    }
  },
};
```

### Step 3: API Error Handler

```typescript
// src/lib/api-error.ts
export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export class ApiError extends Error {
  public statusCode: number;
  public errors: string[];

  constructor(response: ApiErrorResponse) {
    const message = Array.isArray(response.message)
      ? response.message[0]
      : response.message;
    
    super(message);
    this.name = 'ApiError';
    this.statusCode = response.statusCode;
    this.errors = Array.isArray(response.message)
      ? response.message
      : [response.message];
  }

  /**
   * Check if error is authentication error
   */
  isAuthError(): boolean {
    return this.statusCode === 401;
  }

  /**
   * Check if error is forbidden
   */
  isForbidden(): boolean {
    return this.statusCode === 403;
  }

  /**
   * Check if error is validation error
   */
  isValidationError(): boolean {
    return this.statusCode === 400;
  }

  /**
   * Check if error is not found
   */
  isNotFound(): boolean {
    return this.statusCode === 404;
  }

  /**
   * Check if error is rate limit
   */
  isRateLimited(): boolean {
    return this.statusCode === 429;
  }
}
```

### Step 4: API Client

```typescript
// src/lib/api-client.ts
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { tokenUtils } from '@/utils/token.utils';
import { ApiError, ApiErrorResponse } from './api-error';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

/**
 * Subscribe to token refresh
 */
function subscribeTokenRefresh(callback: (token: string) => void): void {
  refreshSubscribers.push(callback);
}

/**
 * Notify all subscribers with new token
 */
function onTokenRefreshed(token: string): void {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

/**
 * Create API client instance
 */
function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - add auth header
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = tokenUtils.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - handle errors and token refresh
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiErrorResponse>) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // Handle 401 errors
      if (error.response?.status === 401 && !originalRequest._retry) {
        const refreshToken = tokenUtils.getRefreshToken();

        // If no refresh token, clear and redirect
        if (!refreshToken) {
          tokenUtils.clearTokens();
          window.location.href = '/auth/login';
          return Promise.reject(error);
        }

        // If already refreshing, wait for new token
        if (isRefreshing) {
          return new Promise((resolve) => {
            subscribeTokenRefresh((token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(client(originalRequest));
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Attempt to refresh token
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data;
          tokenUtils.setTokens(accessToken, newRefreshToken, expiresIn);

          // Notify subscribers
          onTokenRefreshed(accessToken);
          isRefreshing = false;

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return client(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect
          isRefreshing = false;
          tokenUtils.clearTokens();
          window.location.href = '/auth/login';
          return Promise.reject(refreshError);
        }
      }

      // Transform error to ApiError
      if (error.response?.data) {
        return Promise.reject(new ApiError(error.response.data));
      }

      // Network error
      return Promise.reject(new ApiError({
        statusCode: 0,
        message: 'Network error. Please check your connection.',
      }));
    }
  );

  return client;
}

export const apiClient = createApiClient();
```

### Step 5: Auth Service

```typescript
// src/services/auth.service.ts
import { apiClient } from '@/lib/api-client';
import { tokenUtils } from '@/utils/token.utils';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  GoogleAuthRequest,
  User,
  Session,
  SessionListResponse,
  LoginHistoryResponse,
  SecurityAlertsResponse,
  LinkedAccount,
} from '@/types/auth.types';

export const authService = {
  /**
   * Login with email and password
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    const { accessToken, refreshToken, expiresIn, user } = response.data;
    
    // Save tokens
    tokenUtils.setTokens(accessToken, refreshToken, expiresIn);
    
    return response.data;
  },

  /**
   * Register new account
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    const { accessToken, refreshToken, expiresIn } = response.data;
    
    // Save tokens
    tokenUtils.setTokens(accessToken, refreshToken, expiresIn);
    
    return response.data;
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      tokenUtils.clearTokens();
    }
  },

  /**
   * Get current user info
   */
  async getMe(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  /**
   * Refresh tokens
   */
  async refreshTokens(): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    const refreshToken = tokenUtils.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post('/auth/refresh', { refreshToken });
    const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data;
    
    tokenUtils.setTokens(accessToken, newRefreshToken, expiresIn);
    
    return response.data;
  },

  // ==================== Password Reset ====================

  /**
   * Request password reset email
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    const response = await apiClient.post('/auth/forgot-password', data);
    return response.data;
  },

  /**
   * Validate reset token
   */
  async validateResetToken(token: string): Promise<{ valid: boolean; email?: string }> {
    const response = await apiClient.get(`/auth/reset-password/validate?token=${token}`);
    return response.data;
  },

  /**
   * Reset password with token
   */
  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
  },

  // ==================== Email Verification ====================

  /**
   * Verify email
   */
  async verifyEmail(data: VerifyEmailRequest): Promise<{ message: string; user: User }> {
    const response = await apiClient.post('/auth/verify-email', data);
    return response.data;
  },

  /**
   * Resend verification email
   */
  async resendVerification(email: string): Promise<{ message: string }> {
    const response = await apiClient.post('/auth/resend-verification', { email });
    return response.data;
  },

  /**
   * Get verification status
   */
  async getVerificationStatus(): Promise<{ isVerified: boolean; verifiedAt: string | null }> {
    const response = await apiClient.get('/auth/verification-status');
    return response.data;
  },

  // ==================== Google OAuth ====================

  /**
   * Login/Register with Google ID token
   */
  async googleAuth(data: GoogleAuthRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/google/token', data);
    const { accessToken, refreshToken, expiresIn } = response.data;
    
    tokenUtils.setTokens(accessToken, refreshToken, expiresIn);
    
    return response.data;
  },

  /**
   * Get Google OAuth URL for redirect
   */
  getGoogleAuthUrl(): string {
    return `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  },

  /**
   * Link Google account
   */
  async linkGoogle(idToken: string): Promise<{ message: string }> {
    const response = await apiClient.post('/auth/link/google', { idToken });
    return response.data;
  },

  /**
   * Unlink Google account
   */
  async unlinkGoogle(): Promise<{ message: string }> {
    const response = await apiClient.delete('/auth/link/google');
    return response.data;
  },

  /**
   * Get linked OAuth accounts
   */
  async getLinkedAccounts(): Promise<LinkedAccount[]> {
    const response = await apiClient.get('/auth/linked-accounts');
    return response.data;
  },

  // ==================== Sessions ====================

  /**
   * Get all active sessions
   */
  async getSessions(): Promise<SessionListResponse> {
    const response = await apiClient.get('/auth/sessions');
    return response.data;
  },

  /**
   * Get current session
   */
  async getCurrentSession(): Promise<Session> {
    const response = await apiClient.get('/auth/sessions/current');
    return response.data;
  },

  /**
   * Revoke specific session
   */
  async revokeSession(sessionId: string): Promise<{ message: string }> {
    const response = await apiClient.delete(`/auth/sessions/${sessionId}`);
    return response.data;
  },

  /**
   * Revoke all sessions except current
   */
  async revokeAllSessions(): Promise<{ message: string; revokedCount: number }> {
    const response = await apiClient.delete('/auth/sessions');
    return response.data;
  },

  // ==================== Login History & Security ====================

  /**
   * Get login history
   */
  async getLoginHistory(page = 1, limit = 20): Promise<LoginHistoryResponse> {
    const response = await apiClient.get(`/auth/login-history?page=${page}&limit=${limit}`);
    return response.data;
  },

  /**
   * Get security alerts
   */
  async getSecurityAlerts(): Promise<SecurityAlertsResponse> {
    const response = await apiClient.get('/auth/security-alerts');
    return response.data;
  },

  /**
   * Dismiss security alert
   */
  async dismissAlert(alertId: string): Promise<{ message: string }> {
    const response = await apiClient.post(`/auth/security-alerts/${alertId}/dismiss`);
    return response.data;
  },

  // ==================== Helpers ====================

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return tokenUtils.hasValidTokens();
  },

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return tokenUtils.getAccessToken();
  },
};
```

### Step 6: Export Index

```typescript
// src/services/index.ts
export * from './auth.service';
```

```typescript
// src/types/index.ts
export * from './auth.types';
```

---

## ✅ Acceptance Criteria

- [ ] API client configured with base URL
- [ ] Request interceptor adds auth header
- [ ] Response interceptor handles 401 + refresh
- [ ] All auth endpoints implemented
- [ ] Token storage working
- [ ] Type-safe responses
- [ ] Error handling with ApiError

---

## 🧪 Testing

```typescript
// Example usage
import { authService } from '@/services/auth.service';

// Login
const result = await authService.login({
  email: 'test@example.com',
  password: 'Test@123',
});
console.log(result.user);

// Get current user
const user = await authService.getMe();
console.log(user.fullName);

// Logout
await authService.logout();
```

---

## 📚 References

- [Axios Interceptors](https://axios-http.com/docs/interceptors)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

## ⏭️ Next Task

→ `FE-002_LOGIN_PAGE.md` - Login Page Implementation

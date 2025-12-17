# FE-006: Auth Store (Zustand)

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-006 |
| **Phase** | 1 - MVP |
| **Sprint** | 1-2 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 2h |
| **Dependencies** | FE-001 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Existing files ĐÃ CÓ SẴN:**
> - `features/auth/auth.store.ts` - ✅ Đã có Zustand store với persist!
>
> **Existing store đã có:**
> - ✅ user, accessToken, isAuthenticated state
> - ✅ setAuth, clearAuth, updateUser actions
> - ✅ Persist middleware với localStorage

**Action:**
- ❌ KHÔNG tạo mới `store/auth.store.ts`
- ✅ EXTEND existing `features/auth/auth.store.ts`

**Chỉ cần THÊM vào existing store:**
- isLoading state
- error state
- checkAuth action (verify token)
- refreshUser action

---

## 🎯 Objective

EXTEND existing Zustand Auth Store:
- Global auth state management
- Persistent user data
- Auth actions (login, logout, refresh)
- Session management integration
- Type-safe selectors

---

## 📝 Requirements

### Features

1. **State**:
   - User object với profile
   - isAuthenticated flag
   - isLoading state
   - Error state

2. **Actions**:
   - login/logout/register
   - checkAuth (verify token)
   - updateProfile
   - refreshUser

3. **Persistence**:
   - Persist user to localStorage
   - Hydrate on app start
   - Clear on logout

---

## 💻 Implementation

### File Structure

```
src/
├── store/
│   ├── auth.store.ts
│   ├── selectors/
│   │   └── auth.selectors.ts
│   └── index.ts
├── types/
│   └── auth.types.ts
└── providers/
    └── AuthProvider.tsx
```

### Step 1: Auth Types (Enhanced)

```typescript
// src/types/auth.types.ts

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  roles: Role[];
  profile?: UserProfile;
  stats?: UserStats;
}

export interface Role {
  id: string;
  name: 'student' | 'teacher' | 'admin';
  displayName: string;
}

export interface UserProfile {
  phone?: string;
  dateOfBirth?: string;
  location?: string;
  bio?: string;
  currentLevel?: VstepLevel;
  targetLevel?: VstepLevel;
  targetDate?: string;
  studyGoal?: number; // minutes per day
}

export interface UserStats {
  totalHours: number;
  testsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  averageScore: number;
  xp: number;
  level: number;
}

export type VstepLevel = 'A2' | 'B1' | 'B2' | 'C1';

export interface Session {
  id: string;
  deviceName: string;
  browser: string;
  os: string;
  ip: string;
  location?: string;
  isCurrent: boolean;
  lastActiveAt: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
}
```

### Step 2: Auth Store

```typescript
// src/store/auth.store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { User, LoginCredentials, RegisterData, AuthResponse } from '@/types/auth.types';
import { authService } from '@/services/auth.service';
import { tokenUtils } from '@/utils/token.utils';
import { ApiError } from '@/lib/api-error';

// State interface
interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,
};

// Create store with middleware
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        login: async (credentials) => {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            const response = await authService.login(credentials);
            
            set((state) => {
              state.user = response.user;
              state.isAuthenticated = true;
              state.isLoading = false;
              state.isInitialized = true;
            });

            return response;
          } catch (error) {
            const message = error instanceof ApiError 
              ? error.message 
              : 'Đăng nhập thất bại';
            
            set((state) => {
              state.isLoading = false;
              state.error = message;
            });
            
            throw error;
          }
        },

        register: async (data) => {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            await authService.register(data);
            
            set((state) => {
              state.isLoading = false;
            });
          } catch (error) {
            const message = error instanceof ApiError 
              ? error.message 
              : 'Đăng ký thất bại';
            
            set((state) => {
              state.isLoading = false;
              state.error = message;
            });
            
            throw error;
          }
        },

        logout: async () => {
          set((state) => {
            state.isLoading = true;
          });

          try {
            await authService.logout();
          } catch {
            // Ignore logout API errors
          } finally {
            tokenUtils.clearTokens();
            
            set((state) => {
              state.user = null;
              state.isAuthenticated = false;
              state.isLoading = false;
              state.error = null;
            });
          }
        },

        checkAuth: async () => {
          // Skip if already checking or no tokens
          if (get().isLoading) return;
          
          if (!tokenUtils.hasValidTokens()) {
            set((state) => {
              state.user = null;
              state.isAuthenticated = false;
              state.isLoading = false;
              state.isInitialized = true;
            });
            return;
          }

          set((state) => {
            state.isLoading = true;
          });

          try {
            const user = await authService.getMe();
            
            set((state) => {
              state.user = user;
              state.isAuthenticated = true;
              state.isLoading = false;
              state.isInitialized = true;
            });
          } catch (error) {
            // Token invalid, clear auth state
            tokenUtils.clearTokens();
            
            set((state) => {
              state.user = null;
              state.isAuthenticated = false;
              state.isLoading = false;
              state.isInitialized = true;
            });
          }
        },

        refreshUser: async () => {
          if (!get().isAuthenticated) return;

          try {
            const user = await authService.getMe();
            
            set((state) => {
              state.user = user;
            });
          } catch {
            // Silent fail - user data refresh is not critical
          }
        },

        updateUser: (updates) => {
          set((state) => {
            if (state.user) {
              Object.assign(state.user, updates);
            }
          });
        },

        setError: (error) => {
          set((state) => {
            state.error = error;
          });
        },

        clearError: () => {
          set((state) => {
            state.error = null;
          });
        },

        reset: () => {
          tokenUtils.clearTokens();
          set(initialState);
        },
      })),
      {
        name: 'vstepro-auth',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            // Mark as initialized after hydration
            state.isInitialized = true;
          }
        },
      }
    ),
    { name: 'AuthStore' }
  )
);
```

### Step 3: Auth Selectors

```typescript
// src/store/selectors/auth.selectors.ts
import { useAuthStore } from '../auth.store';

// Primitive selectors - prevent unnecessary re-renders
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useIsAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useIsAuthInitialized = () => useAuthStore((state) => state.isInitialized);
export const useAuthError = () => useAuthStore((state) => state.error);

// Derived selectors
export const useUserRoles = () => {
  return useAuthStore((state) => state.user?.roles?.map(r => r.name) || []);
};

export const useHasRole = (role: string) => {
  return useAuthStore((state) => 
    state.user?.roles?.some(r => r.name === role) || false
  );
};

export const useIsAdmin = () => useHasRole('admin');
export const useIsTeacher = () => useHasRole('teacher');
export const useIsStudent = () => useHasRole('student');

export const useUserProfile = () => {
  return useAuthStore((state) => state.user?.profile);
};

export const useUserStats = () => {
  return useAuthStore((state) => state.user?.stats);
};

export const useUserDisplayName = () => {
  return useAuthStore((state) => state.user?.fullName || state.user?.email || 'User');
};

export const useUserAvatar = () => {
  return useAuthStore((state) => state.user?.avatar);
};

export const useUserLevel = () => {
  return useAuthStore((state) => state.user?.profile?.currentLevel || 'B1');
};

// Action selectors
export const useAuthActions = () => {
  return useAuthStore((state) => ({
    login: state.login,
    register: state.register,
    logout: state.logout,
    checkAuth: state.checkAuth,
    refreshUser: state.refreshUser,
    updateUser: state.updateUser,
    clearError: state.clearError,
  }));
};
```

### Step 4: Auth Provider

```tsx
// src/providers/AuthProvider.tsx
'use client';

import { ReactNode, useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    // Check auth status on mount
    checkAuth();
  }, [checkAuth]);

  // Optional: Show loading while checking auth
  // This prevents flash of unauthenticated content
  // if (!isInitialized) {
  //   return <GlobalLoadingSpinner />;
  // }

  return <>{children}</>;
}
```

### Step 5: Root Layout with Provider

```tsx
// src/app/layout.tsx
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AuthProvider from '@/providers/AuthProvider';
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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### Step 6: Store Index Export

```typescript
// src/store/index.ts
export { useAuthStore } from './auth.store';
export * from './selectors/auth.selectors';
```

---

## 📦 Dependencies

```bash
npm install zustand immer
```

---

## 📦 Usage Examples

### Basic Usage

```tsx
import { useAuthStore } from '@/store/auth.store';

function Component() {
  const { user, isAuthenticated, logout } = useAuthStore();
  
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }
  
  return (
    <div>
      <p>Welcome, {user.fullName}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### With Selectors (Optimized)

```tsx
import { useUser, useIsAuthenticated, useAuthActions } from '@/store';

function UserAvatar() {
  // Only re-renders when user changes
  const user = useUser();
  return <img src={user?.avatar} alt={user?.fullName} />;
}

function LogoutButton() {
  // Only gets the logout action, no re-renders from state changes
  const { logout } = useAuthActions();
  return <button onClick={logout}>Logout</button>;
}
```

### Role-Based Rendering

```tsx
import { useIsAdmin, useIsTeacher } from '@/store';

function Navigation() {
  const isAdmin = useIsAdmin();
  const isTeacher = useIsTeacher();
  
  return (
    <nav>
      <Link href="/dashboard">Dashboard</Link>
      {isTeacher && <Link href="/teacher">Teacher Portal</Link>}
      {isAdmin && <Link href="/admin">Admin Panel</Link>}
    </nav>
  );
}
```

---

## ✅ Acceptance Criteria

- [ ] Auth state managed globally
- [ ] User persisted to localStorage
- [ ] Hydration on app start
- [ ] Login/logout actions working
- [ ] checkAuth verifies token
- [ ] Error state management
- [ ] Type-safe store and selectors
- [ ] DevTools integration
- [ ] Optimized re-renders with selectors
- [ ] AuthProvider in root layout

---

## 🧪 Testing

1. Login → User stored in state + localStorage
2. Refresh page → User hydrated from localStorage
3. Logout → State + localStorage cleared
4. Token expired → checkAuth clears state
5. Multiple components → Share same state

---

## 📚 References

- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [Zustand Persist Middleware](https://docs.pmnd.rs/zustand/integrations/persisting-store-data)
- [Immer with Zustand](https://docs.pmnd.rs/zustand/guides/updating-state#with-immer)

---

## ⏭️ Next Task

→ `FE-007_OAUTH_BUTTON.md` - Google OAuth Button Component

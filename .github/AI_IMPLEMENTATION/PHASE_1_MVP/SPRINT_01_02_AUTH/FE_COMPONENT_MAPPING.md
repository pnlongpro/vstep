# 🎨 Sprint 01-02 - FE Component Mapping

> **⚠️ ĐỌC TRƯỚC KHI IMPLEMENT BẤT KỲ FE TASK NÀO TRONG SPRINT NÀY**

---

## 📁 Existing Components & Files

### Auth Pages (Already Exist!)

| Path | Status | Lines | Notes |
|------|--------|-------|-------|
| `app/(auth)/login/page.tsx` | ✅ Exists | ~78 | Functional login form với useAuth hook |
| `app/(auth)/register/page.tsx` | ✅ Exists | ~115 | Functional register form |
| `app/(auth)/forgot-password/page.tsx` | ✅ Exists | ? | Check if complete |

### Auth Feature Module (Already Exists!)

| Path | Status | Content |
|------|--------|---------|
| `features/auth/auth.api.ts` | ✅ Exists | login, register, logout, forgotPassword, resetPassword |
| `features/auth/auth.hooks.ts` | ✅ Exists | useAuth hook |
| `features/auth/auth.store.ts` | ✅ Exists | Zustand store with persist |
| `features/auth/auth.types.ts` | ✅ Exists | LoginRequest, RegisterRequest, AuthResponse, User |

### Other Existing

| Path | Status | Notes |
|------|--------|-------|
| `middleware.ts` | ✅ Exists | JWT validation, redirect logic |
| `lib/axios.ts` | ✅ Exists | apiClient configured |

---

## 📋 Task Action Summary

| Task | Current Approach | ⚠️ NEW APPROACH |
|------|-----------------|-----------------|
| FE-001 | Create new auth.service.ts | **EXTEND** existing `auth.api.ts` |
| FE-002 | Create new LoginForm.tsx | **ENHANCE** existing `login/page.tsx` |
| FE-003 | Create new RegisterForm.tsx | **ENHANCE** existing `register/page.tsx` |
| FE-004 | Create forgot/reset pages | **VERIFY & ENHANCE** existing page |
| FE-005 | Create ProtectedRoute HOC | **ADD** client-side guards (AuthGuard) |
| FE-006 | Create auth.store.ts | **EXTEND** existing store |
| FE-007 | Create OAuth buttons | ✅ **CREATE NEW** (không có sẵn) |

---

## 🔧 What to ADD vs What EXISTS

### FE-002: Login Page

**Existing (`login/page.tsx`):**
```tsx
- Basic email/password form ✅
- useAuth hook integration ✅
- Toast notifications ✅
- Link to register/forgot ✅
```

**Cần ADD:**
```tsx
- Show/hide password toggle
- Remember me checkbox
- Social login buttons (OAuth)
- Better validation messages
- Loading spinner on button
```

### FE-003: Register Page

**Existing (`register/page.tsx`):**
```tsx
- Name, email, password fields ✅
- Basic validation ✅
- useAuth hook ✅
```

**Cần ADD:**
```tsx
- Password strength meter
- Confirm password field
- Terms of service checkbox
- Email availability check (debounced)
```

### FE-006: Auth Store

**Existing (`auth.store.ts`):**
```tsx
- user, accessToken, isAuthenticated ✅
- setAuth, clearAuth, updateUser ✅
- Persist middleware ✅
```

**Cần ADD:**
```tsx
- checkAuth action (verify token)
- refreshUser action
- isLoading state
- error state
```

---

## 📝 Implementation Pattern

```typescript
// ❌ WRONG - Creating new file
// src/services/auth.service.ts (NEW)
export const authService = { ... }

// ✅ CORRECT - Extending existing file
// Update: src/features/auth/auth.api.ts
// ADD new methods to existing authApi object
```

```tsx
// ❌ WRONG - Creating new component
// src/components/auth/LoginForm.tsx (NEW)
export default function LoginForm() { ... }

// ✅ CORRECT - Enhancing existing page
// Update: src/app/(auth)/login/page.tsx
// ADD features to existing LoginPage
```

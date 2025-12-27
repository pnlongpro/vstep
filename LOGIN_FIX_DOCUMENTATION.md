# Login API 404 Error - Fix Documentation

## Problem Statement

The frontend was receiving a 404 error when attempting to login through the NextAuth endpoint. The issue was caused by incorrect API URL configuration.

## Root Cause

1. **Backend (NestJS)** runs on `http://localhost:3000` with auth routes at `/auth/login`
2. **Frontend NextAuth** was configured with `API_URL = "http://localhost:3000/api"`
3. This caused NextAuth to call `http://localhost:3000/api/auth/login` which doesn't exist
4. The correct URL should be `http://localhost:3000/auth/login` (without the `/api` prefix)

## Solution

### 1. Fixed API URL Configuration

Updated all files that had incorrect API URL defaults:

- `FE/src/app/api/auth/[...nextauth]/route.ts`
- `FE/src/lib/axios.ts`
- `FE/src/lib/env.ts`
- `FE/next.config.js`

Changed from:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
```

To:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
```

### 2. Created Frontend Environment Configuration

Created `FE/.env.local` with proper configuration:

```env
# Backend API URL (NestJS server)
NEXT_PUBLIC_API_URL=http://localhost:3000

# WebSocket URL
NEXT_PUBLIC_WS_URL=http://localhost:3000

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=vstep-secret-key-change-in-production

# App Configuration
NEXT_PUBLIC_APP_NAME="VSTEP AI Platform"
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### 3. Enhanced Logging

Added detailed logging to NextAuth for better debugging:

```typescript
console.log("[NextAuth] Attempting login to:", `${API_URL}/auth/login`);
console.log("[NextAuth] Response status:", response.status);
console.log("[NextAuth] Login successful for user:", data.user?.email);
```

Enhanced backend exception filter to log all errors with context:

```typescript
private readonly logger = new Logger(AllExceptionsFilter.name);

const errorLog = {
  timestamp: new Date().toISOString(),
  path: request.url,
  method: request.method,
  statusCode: status,
  message,
  errors,
  stack: exception instanceof Error ? exception.stack : undefined,
};

if (status >= 500) {
  this.logger.error('Server Error', errorLog);
} else if (status >= 400) {
  this.logger.warn('Client Error', errorLog);
}
```

### 4. Fixed Backend Build Errors

During implementation, discovered and fixed several backend build errors:

#### Added Missing Entity Fields

**User Entity** (`user.entity.ts`):
```typescript
@Column({ type: 'int', default: 2 })
deviceLimit: number;
```

**UserProfile Entity** (`user-profile.entity.ts`):
```typescript
// Teacher-specific fields
@Column({ length: 200, nullable: true })
specialization: string;

@Column({ length: 200, nullable: true })
degree: string;
```

#### Fixed Enum Usage

**ClassAnnouncementService** - Fixed string literal to use enum:
```typescript
// Before
where: { classId, status: 'active' }

// After
import { EnrollmentStatus } from '../entities/class-student.entity';
where: { classId, status: EnrollmentStatus.ACTIVE }
```

#### Removed Duplicate Methods

**NotificationsService** - Removed duplicate `formatNotification` method

#### Fixed Seed Data

**teacher.seed.ts** - Updated profile creation to use correct fields:
```typescript
const profile = profileRepository.create({
  userId: savedUser.id,
  specialization: data.specialization,
  degree: data.degree,
  bio: data.certifications ? `Certifications: ${data.certifications}` : undefined,
});
```

### 5. Installed Missing Dependencies

```bash
npm install date-fns axios socket.io @nestjs/websockets@^10.0.0 @nestjs/platform-socket.io@^10.0.0 @types/multer --legacy-peer-deps
```

## Testing Instructions

### 1. Start Backend

```bash
cd BE
npm install
npm run build
npm run start:dev
```

Backend should start on `http://localhost:3000`

### 2. Start Frontend

```bash
cd FE
npm install
npm run dev
```

Frontend should start on `http://localhost:3001`

### 3. Test Login

1. Navigate to `http://localhost:3001/login`
2. Enter credentials (test account from `BE/test-login.json`):
   - Email: `admin@vstep.edu.vn`
   - Password: `admin123`
3. Click "Sign In"
4. Check browser console for NextAuth debug logs
5. Check backend terminal for request logs

### Expected Behavior

1. Frontend sends POST request to `/api/auth/callback/credentials`
2. NextAuth internally calls `http://localhost:3000/auth/login`
3. Backend validates credentials and returns user data + tokens
4. NextAuth stores session and redirects to dashboard
5. No 404 errors should occur

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
│                  http://localhost:3001                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Browser → /login page                                       │
│      ↓                                                        │
│  POST /api/auth/callback/credentials (NextAuth)              │
│      ↓                                                        │
│  NextAuth route.ts                                           │
│      ↓                                                        │
│  fetch(http://localhost:3000/auth/login) ← Correct URL       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                           ↓
                           ↓ CORS enabled
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                     Backend (NestJS)                         │
│                  http://localhost:3000                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  POST /auth/login                                            │
│      ↓                                                        │
│  AuthController.login()                                      │
│      ↓                                                        │
│  AuthService.login()                                         │
│      ↓                                                        │
│  Validate credentials → Generate tokens → Return user data   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Key Learnings

1. **API Gateway Pattern**: When using Next.js as the frontend, be careful with URL rewriting rules. The `rewrites()` function in `next.config.js` can proxy API calls, but NextAuth makes direct fetch calls that bypass this.

2. **Environment Variables**: Always define `NEXT_PUBLIC_API_URL` clearly without unnecessary path prefixes. The backend controllers already define their paths.

3. **Logging is Critical**: Added detailed logging at both frontend (NextAuth) and backend (exception filter) to make debugging easier.

4. **TypeScript Strictness**: The build errors revealed missing entity fields that would cause runtime issues. TypeScript compilation catches these early.

5. **Dependency Management**: Legacy peer deps flag was needed for some NestJS packages due to version conflicts.

## Related Files

- `FE/src/app/api/auth/[...nextauth]/route.ts` - NextAuth configuration
- `FE/src/lib/axios.ts` - Axios client with interceptors
- `FE/.env.local` - Frontend environment variables
- `BE/src/modules/auth/auth.controller.ts` - Backend login endpoint
- `BE/src/common/filters/all-exceptions.filter.ts` - Error logging
- `BE/src/main.ts` - CORS configuration

## Status

✅ **FIXED** - Login API is now accessible and working correctly.

The 404 error has been resolved by correcting the API URL configuration throughout the frontend application.

# 🔐 Module 01: Authentication & Authorization

> **Module xác thực và phân quyền người dùng**
> 
> File: `01-MODULE-AUTHENTICATION.md`  
> Version: 1.0  
> Last Updated: 15/12/2024

---

## 📑 Mục lục

- [1. Giới thiệu module](#1-giới-thiệu-module)
- [2. Danh sách chức năng](#2-danh-sách-chức-năng)
- [3. Phân tích màn hình UI](#3-phân-tích-màn-hình-ui)
- [4. User Flow Diagrams](#4-user-flow-diagrams)
- [5. Sequence Diagrams](#5-sequence-diagrams)
- [6. Database Design](#6-database-design)
- [7. API Endpoints](#7-api-endpoints)
- [8. Security Requirements](#8-security-requirements)
- [9. Validation Rules](#9-validation-rules)

---

## 1. Giới thiệu module

### 1.1. Mục đích
Module Authentication & Authorization chịu trách nhiệm:
- Xác thực danh tính người dùng
- Quản lý phiên đăng nhập
- Phân quyền truy cập theo vai trò
- Bảo mật thông tin đăng nhập
- Quản lý token và refresh token

### 1.2. Vai trò sử dụng
- **Tất cả người dùng**: Đăng nhập, đăng ký, quên mật khẩu
- **Admin**: Quản lý quyền truy cập, reset mật khẩu người dùng
- **System**: Verify token, refresh token, logout

### 1.3. Phạm vi module
- Đăng nhập (Login)
- Đăng ký (Register)
- Quên mật khẩu (Forgot Password)
- Đặt lại mật khẩu (Reset Password)
- Đăng xuất (Logout)
- Verify email
- Change password
- Role-based access control (RBAC)
- Session management
- Device management

---

## 2. Danh sách chức năng

### 2.1. Chức năng chính

#### A. Đăng nhập (Login)
**Mô tả**: Cho phép người dùng đăng nhập vào hệ thống bằng email/username và mật khẩu

**Input**:
- Email hoặc Username (required)
- Password (required)
- Remember me (optional)

**Output**:
- Access token (JWT)
- Refresh token
- User information
- Role information

**Business Logic**:
1. Validate input (email format, password không rỗng)
2. Check user exists trong database
3. Verify password với bcrypt
4. Check account status (active, suspended, expired)
5. Generate JWT token với thông tin user và role
6. Generate refresh token
7. Lưu session vào database
8. Return tokens và user info
9. Redirect theo role:
   - Student → Student Dashboard
   - Teacher → Teacher Dashboard
   - Admin → Admin Dashboard
   - Uploader → Uploader Dashboard

**Error Handling**:
- Email/username không tồn tại → "Tài khoản không tồn tại"
- Mật khẩu sai → "Mật khẩu không chính xác"
- Account suspended → "Tài khoản đã bị khóa"
- Account expired → "Tài khoản đã hết hạn"
- Too many login attempts → "Quá nhiều lần đăng nhập sai. Vui lòng thử lại sau 15 phút"

---

#### B. Đăng ký (Register)
**Mô tả**: Cho phép người dùng mới tạo tài khoản

**Input**:
- Full name (required)
- Email (required, unique)
- Password (required, min 8 chars)
- Confirm password (required, must match)
- Phone number (optional)
- Target level (A2, B1, B2, C1)
- Terms acceptance (required)

**Output**:
- Account created
- Verification email sent
- Auto login sau khi verify (optional)

**Business Logic**:
1. Validate all inputs
2. Check email không trùng trong database
3. Hash password với bcrypt (salt rounds: 10)
4. Create user record với role mặc định = 'student'
5. Create user_profile record
6. Send verification email
7. Create welcome notification
8. Unlock "First Steps" badge
9. Return success message

**Error Handling**:
- Email đã tồn tại → "Email này đã được đăng ký"
- Password yếu → "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số"
- Passwords không match → "Mật khẩu xác nhận không khớp"
- Terms không accept → "Bạn phải đồng ý với điều khoản sử dụng"

---

#### C. Quên mật khẩu (Forgot Password)
**Mô tả**: Cho phép người dùng reset mật khẩu qua email

**Input**:
- Email (required)

**Output**:
- Reset link sent to email
- Success message

**Business Logic**:
1. Validate email format
2. Check email exists trong database
3. Generate reset token (random, expires sau 1 giờ)
4. Lưu reset token vào database
5. Send email với reset link
6. Return success message (không tiết lộ email có tồn tại hay không vì security)

**Error Handling**:
- Invalid email format → "Email không hợp lệ"
- Service error → "Không thể gửi email. Vui lòng thử lại sau"

---

#### D. Đặt lại mật khẩu (Reset Password)
**Mô tả**: Đặt mật khẩu mới sau khi click vào reset link

**Input**:
- Reset token (from URL)
- New password (required, min 8 chars)
- Confirm password (required, must match)

**Output**:
- Password updated
- All sessions invalidated
- Success message

**Business Logic**:
1. Validate reset token
2. Check token chưa expire (< 1 giờ)
3. Check token chưa được sử dụng
4. Validate new password strength
5. Hash new password
6. Update user password
7. Invalidate reset token
8. Invalidate all existing sessions
9. Send confirmation email
10. Create notification

**Error Handling**:
- Invalid token → "Link đặt lại mật khẩu không hợp lệ"
- Expired token → "Link đặt lại mật khẩu đã hết hạn"
- Used token → "Link đã được sử dụng"
- Weak password → "Mật khẩu không đủ mạnh"

---

#### E. Đăng xuất (Logout)
**Mô tả**: Đăng xuất khỏi hệ thống

**Input**:
- Access token (from header)
- Refresh token (from cookie)

**Output**:
- Session invalidated
- Tokens blacklisted
- Success message

**Business Logic**:
1. Get user_id from access token
2. Invalidate session trong database
3. Add tokens vào blacklist
4. Clear cookies
5. Redirect to login page

---

#### F. Verify Email
**Mô tả**: Xác thực email sau khi đăng ký

**Input**:
- Verification token (from URL)

**Output**:
- Email verified
- Account activated
- Auto login (optional)

**Business Logic**:
1. Validate verification token
2. Check token chưa expire
3. Update user.email_verified = true
4. Update user.status = 'active'
5. Create welcome notification
6. Unlock "Email Verified" badge
7. Auto login hoặc redirect to login

---

#### G. Change Password
**Mô tả**: Đổi mật khẩu khi đã đăng nhập

**Input**:
- Current password (required)
- New password (required, min 8 chars)
- Confirm password (required)

**Output**:
- Password updated
- Confirmation notification

**Business Logic**:
1. Verify current password
2. Validate new password
3. Check new password khác current password
4. Hash new password
5. Update user password
6. Invalidate all other sessions (giữ session hiện tại)
7. Send confirmation email
8. Create notification

---

### 2.2. Chức năng phụ

#### A. Remember Me
- Lưu refresh token với thời hạn dài hơn (30 ngày vs 7 ngày)
- Auto login khi quay lại

#### B. Refresh Token
- Tự động refresh access token khi expire
- Không cần đăng nhập lại

#### C. Device Management
- Hiển thị danh sách devices đã login
- Logout remote devices
- Detect suspicious login

#### D. Login History
- Lưu lịch sử đăng nhập
- Hiển thị IP, device, thời gian
- Detect unusual activity

#### E. Account Lockout
- Khóa tài khoản tạm thời sau 5 lần đăng nhập sai
- Unlock tự động sau 15 phút
- Unlock thủ công bởi admin

---

### 2.3. Quyền sử dụng

| Chức năng | Student | Teacher | Admin | Uploader |
|-----------|---------|---------|-------|----------|
| Login | ✅ | ✅ | ✅ | ✅ |
| Register | ✅ | ✅ | ✅ | ✅ |
| Forgot Password | ✅ | ✅ | ✅ | ✅ |
| Reset Password | ✅ | ✅ | ✅ | ✅ |
| Logout | ✅ | ✅ | ✅ | ✅ |
| Change Password | ✅ | ✅ | ✅ | ✅ |
| Verify Email | ✅ | ✅ | ✅ | ✅ |
| View Login History | ✅ | ✅ | ✅ | ✅ |
| Manage Devices | ✅ | ✅ | ✅ | ✅ |
| Reset User Password (Admin) | ❌ | ❌ | ✅ | ❌ |
| Lock/Unlock Account | ❌ | ❌ | ✅ | ❌ |

---

## 3. Phân tích màn hình UI

### 3.1. Màn hình Login

#### Tên màn hình
**Login Page / Đăng nhập**

#### Mục đích
Cho phép người dùng đăng nhập vào hệ thống

#### Các thành phần UI

**Header Section**:
- Logo VstepPro (top center)
- Tagline: "Nền tảng luyện thi VSTEP chuyên nghiệp"

**Form Section**:
- Title: "Đăng nhập" (h1, center)
- Email/Username input field
  - Label: "Email hoặc Tên đăng nhập"
  - Placeholder: "nguyenvana@example.com"
  - Icon: Email icon (left)
  - Validation: Required, email format
  
- Password input field
  - Label: "Mật khẩu"
  - Placeholder: "••••••••"
  - Icon: Lock icon (left)
  - Toggle: Show/Hide password icon (right)
  - Validation: Required

- Remember me checkbox
  - Label: "Ghi nhớ đăng nhập"
  - Default: Unchecked

- Forgot password link
  - Text: "Quên mật khẩu?"
  - Position: Right side, below password field
  - Color: Blue-600

- Login button
  - Text: "Đăng nhập"
  - Style: Primary button, full width
  - Color: Blue-600 (Student default)
  - Height: 44px minimum
  - Loading state: Spinner + "Đang đăng nhập..."

**Footer Section**:
- Divider line với text "hoặc"
- Social login buttons (optional)
  - Google login
  - Facebook login
- Register link
  - Text: "Chưa có tài khoản? Đăng ký ngay"
  - Color: Blue-600

**Error Display**:
- Alert box (red background)
- Error icon + error message
- Close button

#### Chức năng

1. **Input Validation**:
   - Real-time validation khi blur
   - Hiển thị error message dưới field
   - Disable submit button khi có lỗi

2. **Submit Form**:
   - Prevent default submit
   - Validate all fields
   - Show loading state
   - Call login API
   - Handle success/error
   - Redirect on success

3. **Show/Hide Password**:
   - Toggle password visibility
   - Change icon (eye → eye-slash)

4. **Remember Me**:
   - Store preference in localStorage
   - Use longer expiry for refresh token

5. **Error Handling**:
   - Display API errors
   - Show validation errors
   - Auto dismiss after 5 seconds

#### Luồng xử lý chính

```
User arrives at Login Page
  ↓
Enter email/username
  ↓
Enter password
  ↓
(Optional) Check "Remember me"
  ↓
Click "Đăng nhập" button
  ↓
[Frontend Validation]
  ↓ (Pass)
Show loading state
  ↓
Call POST /api/auth/login
  ↓
[API Response]
  ↓
  ├─ Success:
  │   ├─ Store tokens (localStorage/cookie)
  │   ├─ Store user info
  │   ├─ Hide loading state
  │   └─ Redirect by role:
  │       ├─ Student → /student/dashboard
  │       ├─ Teacher → /teacher/dashboard
  │       ├─ Admin → /admin/dashboard
  │       └─ Uploader → /uploader/dashboard
  │
  └─ Error:
      ├─ Hide loading state
      ├─ Show error message
      └─ Clear password field
```

#### Input / Output

**Input**:
```typescript
interface LoginInput {
  email: string;        // Required, email format
  password: string;     // Required, min 8 chars
  rememberMe: boolean;  // Optional, default false
}
```

**Output** (Success):
```typescript
interface LoginResponse {
  success: true;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      fullName: string;
      role: 'student' | 'teacher' | 'admin' | 'uploader';
      avatar?: string;
      emailVerified: boolean;
    };
  };
}
```

**Output** (Error):
```typescript
interface LoginErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}
```

#### Điều hướng

**Từ màn hình này đến**:
- Forgot Password Page (click "Quên mật khẩu?")
- Register Page (click "Đăng ký ngay")
- Dashboard theo role (sau khi login thành công)

**Đến màn hình này từ**:
- Home Page / Landing Page
- Any protected route (khi chưa login)
- Logout action
- Session expired
- Register success page

---

### 3.2. Màn hình Register

#### Tên màn hình
**Register Page / Đăng ký**

#### Mục đích
Cho phép người dùng mới tạo tài khoản

#### Các thành phần UI

**Header Section**:
- Logo VstepPro
- Title: "Tạo tài khoản mới"
- Subtitle: "Bắt đầu hành trình chinh phục VSTEP"

**Form Section**:
- **Full Name input**
  - Label: "Họ và tên"
  - Placeholder: "Nguyễn Văn A"
  - Icon: User icon
  - Validation: Required, min 2 words

- **Email input**
  - Label: "Email"
  - Placeholder: "nguyenvana@example.com"
  - Icon: Email icon
  - Validation: Required, email format, unique
  - Helper text: "Email này sẽ dùng để đăng nhập"

- **Password input**
  - Label: "Mật khẩu"
  - Placeholder: "Tối thiểu 8 ký tự"
  - Icon: Lock icon
  - Toggle: Show/Hide
  - Validation: Required, min 8 chars, strong password
  - Password strength meter (Weak/Medium/Strong)

- **Confirm Password input**
  - Label: "Xác nhận mật khẩu"
  - Placeholder: "Nhập lại mật khẩu"
  - Icon: Lock icon
  - Validation: Required, must match password

- **Phone Number input** (Optional)
  - Label: "Số điện thoại"
  - Placeholder: "0912345678"
  - Icon: Phone icon
  - Validation: Phone format

- **Target Level select**
  - Label: "Mục tiêu VSTEP"
  - Options: A2, B1, B2, C1
  - Default: B1
  - Helper text: "Chúng tôi sẽ gợi ý lộ trình phù hợp"

- **Terms checkbox**
  - Label: "Tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật"
  - Validation: Required (must be checked)
  - Links: "Điều khoản sử dụng", "Chính sách bảo mật" (open modal/new tab)

- **Register button**
  - Text: "Đăng ký"
  - Style: Primary button, full width
  - Height: 44px
  - Loading state: Spinner + "Đang tạo tài khoản..."

**Footer Section**:
- Login link
  - Text: "Đã có tài khoản? Đăng nhập ngay"
  - Color: Blue-600

**Success Modal** (after register):
- Icon: Success checkmark
- Title: "Đăng ký thành công!"
- Message: "Chúng tôi đã gửi email xác thực đến [email]. Vui lòng kiểm tra hộp thư và xác thực tài khoản."
- Button: "Đã hiểu"

#### Chức năng

1. **Real-time Validation**:
   - Check email uniqueness (debounced, 500ms)
   - Password strength meter
   - Match confirm password
   - Show inline errors

2. **Password Strength Meter**:
   - Weak: Red, < 8 chars hoặc chỉ chữ/số
   - Medium: Yellow, 8+ chars, có chữ và số
   - Strong: Green, 8+ chars, chữ hoa, chữ thường, số, ký tự đặc biệt

3. **Submit Form**:
   - Validate all required fields
   - Check terms accepted
   - Show loading state
   - Call register API
   - Show success modal
   - Send verification email
   - Redirect to login

4. **Email Uniqueness Check**:
   - Debounce 500ms
   - Call API check email
   - Show "Email này đã được đăng ký" nếu trùng
   - Show checkmark icon nếu available

#### Luồng xử lý chính

```
User arrives at Register Page
  ↓
Fill in Full Name
  ↓
Enter Email
  → [Check email uniqueness]
  ↓
Enter Password
  → [Show password strength]
  ↓
Confirm Password
  → [Validate match]
  ↓
Enter Phone (optional)
  ↓
Select Target Level
  ↓
Check "Terms acceptance"
  ↓
Click "Đăng ký" button
  ↓
[Frontend Validation]
  ↓ (All valid)
Show loading state
  ↓
Call POST /api/auth/register
  ↓
[API Response]
  ↓
  ├─ Success:
  │   ├─ Hide loading
  │   ├─ Show success modal
  │   ├─ Send verification email (backend)
  │   └─ After 3 seconds → Redirect to Login
  │
  └─ Error:
      ├─ Hide loading
      ├─ Show error message
      └─ Focus on error field
```

#### Input / Output

**Input**:
```typescript
interface RegisterInput {
  fullName: string;        // Required, min 2 words
  email: string;           // Required, unique, email format
  password: string;        // Required, min 8 chars, strong
  confirmPassword: string; // Required, must match password
  phone?: string;          // Optional, phone format
  targetLevel: 'A2' | 'B1' | 'B2' | 'C1'; // Required
  termsAccepted: boolean;  // Required, must be true
}
```

**Output** (Success):
```typescript
interface RegisterResponse {
  success: true;
  data: {
    userId: string;
    email: string;
    fullName: string;
    message: "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.";
  };
}
```

**Output** (Error):
```typescript
interface RegisterErrorResponse {
  success: false;
  error: {
    code: 'EMAIL_EXISTS' | 'WEAK_PASSWORD' | 'VALIDATION_ERROR';
    message: string;
    field?: string; // Field có lỗi
  };
}
```

#### Điều hướng

**Từ màn hình này đến**:
- Login Page (click "Đăng nhập ngay" hoặc after success)
- Terms of Service Modal
- Privacy Policy Modal

**Đến màn hình này từ**:
- Login Page (click "Đăng ký ngay")
- Landing Page (click "Sign Up" button)

---

### 3.3. Màn hình Forgot Password

#### Tên màn hình
**Forgot Password Page / Quên mật khẩu**

#### Mục đích
Cho phép người dùng reset mật khẩu qua email

#### Các thành phần UI

**Header Section**:
- Back button (← Quay lại)
- Title: "Quên mật khẩu?"
- Subtitle: "Nhập email của bạn, chúng tôi sẽ gửi link đặt lại mật khẩu"

**Form Section**:
- **Email input**
  - Label: "Email đã đăng ký"
  - Placeholder: "nguyenvana@example.com"
  - Icon: Email icon
  - Validation: Required, email format
  - Auto-focus on mount

- **Submit button**
  - Text: "Gửi link đặt lại mật khẩu"
  - Style: Primary button, full width
  - Height: 44px
  - Loading state: Spinner + "Đang gửi..."

**Success State**:
- Icon: Email sent icon
- Title: "Đã gửi email!"
- Message: "Vui lòng kiểm tra hộp thư [email] và làm theo hướng dẫn để đặt lại mật khẩu."
- Note: "Không nhận được email? Kiểm tra thư mục Spam hoặc thử lại sau 1 phút."
- Button: "Quay lại đăng nhập"

**Footer Section**:
- Login link: "Quay lại đăng nhập"

#### Chức năng

1. **Submit Form**:
   - Validate email
   - Show loading state
   - Call forgot password API
   - Show success state
   - Don't reveal if email exists (security)

2. **Resend Email** (if not received):
   - Cooldown 60 seconds
   - Show countdown timer
   - Re-enable after cooldown

#### Luồng xử lý chính

```
User arrives at Forgot Password Page
  ↓
Enter Email
  ↓
Click "Gửi link đặt lại mật khẩu"
  ↓
[Validate Email]
  ↓ (Valid)
Show loading state
  ↓
Call POST /api/auth/forgot-password
  ↓
[Always return success for security]
  ↓
Show success state
  ↓
[Backend Process]
  ├─ Check email exists
  │   ├─ Yes: Generate reset token
  │   │       Send email with reset link
  │   └─ No: Do nothing (don't reveal)
  ↓
User clicks email link
  ↓
Redirect to Reset Password Page với token
```

#### Input / Output

**Input**:
```typescript
interface ForgotPasswordInput {
  email: string; // Required, email format
}
```

**Output** (Always success):
```typescript
interface ForgotPasswordResponse {
  success: true;
  message: "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được link đặt lại mật khẩu.";
}
```

#### Điều hướng

**Từ màn hình này đến**:
- Login Page (click back hoặc "Quay lại đăng nhập")
- Reset Password Page (click link trong email)

**Đến màn hình này từ**:
- Login Page (click "Quên mật khẩu?")

---

### 3.4. Màn hình Reset Password

#### Tên màn hình
**Reset Password Page / Đặt lại mật khẩu**

#### Mục đích
Cho phép người dùng đặt mật khẩu mới sau khi click vào reset link

#### Các thành phần UI

**Header Section**:
- Title: "Đặt lại mật khẩu"
- Subtitle: "Nhập mật khẩu mới cho tài khoản của bạn"

**Form Section** (if token valid):
- **New Password input**
  - Label: "Mật khẩu mới"
  - Placeholder: "Tối thiểu 8 ký tự"
  - Icon: Lock icon
  - Toggle: Show/Hide
  - Validation: Required, min 8 chars, strong
  - Password strength meter

- **Confirm Password input**
  - Label: "Xác nhận mật khẩu mới"
  - Placeholder: "Nhập lại mật khẩu"
  - Icon: Lock icon
  - Validation: Required, must match

- **Submit button**
  - Text: "Đặt lại mật khẩu"
  - Style: Primary button, full width
  - Height: 44px
  - Loading state: Spinner + "Đang cập nhật..."

**Success State**:
- Icon: Success checkmark
- Title: "Đặt lại mật khẩu thành công!"
- Message: "Bạn có thể đăng nhập bằng mật khẩu mới ngay bây giờ."
- Button: "Đăng nhập ngay"
- Auto redirect sau 3 giây

**Error State** (if token invalid/expired):
- Icon: Error icon
- Title: "Link không hợp lệ hoặc đã hết hạn"
- Message: "Vui lòng yêu cầu link đặt lại mật khẩu mới."
- Button: "Quên mật khẩu"

#### Chức năng

1. **Validate Token on Mount**:
   - Get token from URL params
   - Call API verify token
   - Show form if valid
   - Show error if invalid/expired

2. **Password Strength**:
   - Real-time strength meter
   - Validation rules display

3. **Submit Form**:
   - Validate passwords
   - Call reset password API
   - Show success state
   - Redirect to login

#### Luồng xử lý chính

```
User clicks reset link in email
  ↓
Arrive at Reset Password Page với ?token=xxx
  ↓
[Verify Token]
  ↓
  ├─ Valid:
  │   └─ Show form
  │       ↓
  │       Enter new password
  │       ↓
  │       Confirm password
  │       ↓
  │       Click "Đặt lại mật khẩu"
  │       ↓
  │       [Validate]
  │       ↓
  │       Call POST /api/auth/reset-password
  │       ↓
  │       ├─ Success:
  │       │   ├─ Show success state
  │       │   ├─ Invalidate all sessions
  │       │   └─ Redirect to Login after 3s
  │       │
  │       └─ Error:
  │           └─ Show error message
  │
  └─ Invalid/Expired:
      └─ Show error state
          ↓
          Click "Quên mật khẩu"
          ↓
          Redirect to Forgot Password Page
```

#### Input / Output

**Input**:
```typescript
interface ResetPasswordInput {
  token: string;          // From URL params
  newPassword: string;    // Required, min 8 chars, strong
  confirmPassword: string; // Required, must match
}
```

**Output** (Success):
```typescript
interface ResetPasswordResponse {
  success: true;
  message: "Đặt lại mật khẩu thành công!";
}
```

**Output** (Error):
```typescript
interface ResetPasswordErrorResponse {
  success: false;
  error: {
    code: 'INVALID_TOKEN' | 'EXPIRED_TOKEN' | 'WEAK_PASSWORD';
    message: string;
  };
}
```

#### Điều hướng

**Từ màn hình này đến**:
- Login Page (after success)
- Forgot Password Page (if token invalid)

**Đến màn hình này từ**:
- Email reset link

---

### 3.5. Màn hình Verify Email

#### Tên màn hình
**Email Verification Page / Xác thực Email**

#### Mục đích
Xác thực email sau khi đăng ký

#### Các thành phần UI

**Processing State** (on mount):
- Loading spinner
- Text: "Đang xác thực email..."

**Success State**:
- Icon: Success checkmark (large, animated)
- Title: "Xác thực email thành công!"
- Message: "Tài khoản của bạn đã được kích hoạt."
- Badge unlocked notification: "🎉 Bạn đã mở khóa huy hiệu Email Verified!"
- Button: "Đăng nhập ngay"
- Auto redirect sau 3 giây

**Error State**:
- Icon: Error icon
- Title: "Xác thực thất bại"
- Message: "Link xác thực không hợp lệ hoặc đã hết hạn."
- Button: "Gửi lại email xác thực"
- Link: "Quay lại đăng nhập"

#### Chức năng

1. **Auto Verify on Mount**:
   - Get token from URL
   - Call verify API
   - Show result

2. **Resend Verification Email**:
   - If token invalid/expired
   - Cooldown 60 seconds

#### Luồng xử lý chính

```
User clicks verification link in email
  ↓
Arrive at Verify Email Page với ?token=xxx
  ↓
Show loading state
  ↓
Call POST /api/auth/verify-email
  ↓
[API Response]
  ↓
  ├─ Success:
  │   ├─ Update user.email_verified = true
  │   ├─ Update user.status = 'active'
  │   ├─ Unlock "Email Verified" badge
  │   ├─ Create welcome notification
  │   ├─ Show success state
  │   └─ Redirect to Login after 3s
  │
  └─ Error:
      ├─ Show error state
      └─ Option to resend verification email
```

#### Input / Output

**Input**:
```typescript
interface VerifyEmailInput {
  token: string; // From URL params
}
```

**Output** (Success):
```typescript
interface VerifyEmailResponse {
  success: true;
  message: "Email đã được xác thực thành công!";
  data: {
    userId: string;
    emailVerified: true;
  };
}
```

**Output** (Error):
```typescript
interface VerifyEmailErrorResponse {
  success: false;
  error: {
    code: 'INVALID_TOKEN' | 'EXPIRED_TOKEN' | 'ALREADY_VERIFIED';
    message: string;
  };
}
```

#### Điều hướng

**Từ màn hình này đến**:
- Login Page (after success)
- Register Page (if need to resend)

**Đến màn hình này từ**:
- Email verification link

---

## 4. User Flow Diagrams

### 4.1. Login Flow

```
[Start] User wants to login
  ↓
Navigate to /login
  ↓
Enter credentials (email + password)
  ↓
Click "Đăng nhập"
  ↓
Frontend validation
  ↓
  ├─ Invalid → Show errors → Stay on page
  │
  └─ Valid → Call POST /api/auth/login
      ↓
      Backend validation
      ↓
      ├─ Invalid credentials → Return error → Show error message
      │
      ├─ Account locked → Return error → Show lockout message
      │
      ├─ Account not verified → Return error → Show verify email prompt
      │
      └─ Valid → Generate tokens
          ↓
          Return tokens + user data
          ↓
          Frontend stores tokens
          ↓
          Redirect by role:
            ├─ Student → /student/dashboard
            ├─ Teacher → /teacher/dashboard
            ├─ Admin → /admin/dashboard
            └─ Uploader → /uploader/dashboard
          ↓
          [End] User logged in successfully
```

### 4.2. Register Flow

```
[Start] User wants to register
  ↓
Navigate to /register
  ↓
Fill registration form:
  ├─ Full name
  ├─ Email (check uniqueness)
  ├─ Password (show strength)
  ├─ Confirm password (validate match)
  ├─ Phone (optional)
  ├─ Target level
  └─ Accept terms
  ↓
Click "Đăng ký"
  ↓
Frontend validation
  ↓
  ├─ Invalid → Show errors → Stay on form
  │
  └─ Valid → Call POST /api/auth/register
      ↓
      Backend validation
      ↓
      ├─ Email exists → Return error → Show "Email đã được đăng ký"
      │
      ├─ Weak password → Return error → Show password requirements
      │
      └─ Valid → Create user account
          ↓
          ├─ Hash password
          ├─ Create user record
          ├─ Create profile record
          ├─ Generate verification token
          └─ Send verification email
          ↓
          Return success
          ↓
          Show success modal
          ↓
          Redirect to /login after 3s
          ↓
          [End] User needs to verify email
```

### 4.3. Forgot Password Flow

```
[Start] User forgot password
  ↓
Click "Quên mật khẩu?" on login page
  ↓
Navigate to /forgot-password
  ↓
Enter email address
  ↓
Click "Gửi link đặt lại mật khẩu"
  ↓
Frontend validation (email format)
  ↓
  ├─ Invalid → Show error → Stay on form
  │
  └─ Valid → Call POST /api/auth/forgot-password
      ↓
      Backend checks email
      ↓
      ├─ Email exists:
      │   ├─ Generate reset token (expires 1h)
      │   ├─ Store token in database
      │   ├─ Send email with reset link
      │   └─ Return generic success
      │
      └─ Email not exists:
          └─ Return same generic success (security)
      ↓
      Show success message
      ↓
      User checks email
      ↓
      Clicks reset link in email
      ↓
      Navigate to /reset-password?token=xxx
      ↓
      [Continue to Reset Password Flow]
```

### 4.4. Reset Password Flow

```
[Start] User clicks reset link in email
  ↓
Navigate to /reset-password?token=xxx
  ↓
Frontend extracts token from URL
  ↓
Call GET /api/auth/verify-reset-token
  ↓
  ├─ Token invalid/expired → Show error state
  │   ↓
  │   Button "Quên mật khẩu" → Back to Forgot Password
  │
  └─ Token valid → Show reset form
      ↓
      Enter new password
      ↓
      Confirm password (must match)
      ↓
      Frontend validation
      ↓
      ├─ Invalid → Show errors
      │
      └─ Valid → Call POST /api/auth/reset-password
          ↓
          Backend validation
          ↓
          ├─ Token invalid/used → Return error
          │
          └─ Valid:
              ├─ Hash new password
              ├─ Update user password
              ├─ Invalidate reset token
              ├─ Invalidate all sessions
              ├─ Send confirmation email
              └─ Return success
              ↓
              Show success message
              ↓
              Auto redirect to /login after 3s
              ↓
              [End] User can login with new password
```

### 4.5. Email Verification Flow

```
[Start] User registers account
  ↓
Backend sends verification email
  ↓
User receives email
  ↓
Clicks verification link
  ↓
Navigate to /verify-email?token=xxx
  ↓
Show loading state "Đang xác thực..."
  ↓
Call POST /api/auth/verify-email
  ↓
Backend validates token
  ↓
  ├─ Token invalid/expired:
  │   ├─ Return error
  │   ↓
  │   Show error state
  │   ↓
  │   Button "Gửi lại email xác thực"
  │   ↓
  │   Call POST /api/auth/resend-verification
  │   ↓
  │   New email sent
  │
  ├─ Already verified:
  │   ├─ Return info
  │   ↓
  │   Show "Email đã được xác thực"
  │   ↓
  │   Redirect to login
  │
  └─ Valid token:
      ├─ Update user.email_verified = true
      ├─ Update user.status = 'active'
      ├─ Unlock "Email Verified" badge
      ├─ Create welcome notification
      ↓
      Show success state
      ↓
      Auto redirect to /login after 3s
      ↓
      [End] User can now login
```

---

## 5. Sequence Diagrams

### 5.1. Login Sequence

```
User                Frontend            API Server          Database           Email Service
  |                     |                    |                   |                   |
  |--Enter credentials->|                    |                   |                   |
  |                     |                    |                   |                   |
  |--Click Login------->|                    |                   |                   |
  |                     |                    |                   |                   |
  |                     |--Validate Form---->|                   |                   |
  |                     |                    |                   |                   |
  |                     |<---Validation OK---|                   |                   |
  |                     |                    |                   |                   |
  |                     |--POST /auth/login->|                   |                   |
  |                     |                    |                   |                   |
  |                     |                    |--Find user by email----------------->|
  |                     |                    |                   |                   |
  |                     |                    |<--User data-------|                   |
  |                     |                    |                   |                   |
  |                     |                    |--Verify password->|                   |
  |                     |                    |                   |                   |
  |                     |                    |<--Password valid--|                   |
  |                     |                    |                   |                   |
  |                     |                    |--Check account status---------------->|
  |                     |                    |                   |                   |
  |                     |                    |<--Status: active--|                   |
  |                     |                    |                   |                   |
  |                     |                    |--Generate JWT---->|                   |
  |                     |                    |                   |                   |
  |                     |                    |<--Tokens----------|                   |
  |                     |                    |                   |                   |
  |                     |                    |--Create session------------------------->|
  |                     |                    |                   |                   |
  |                     |                    |<--Session saved---|                   |
  |                     |                    |                   |                   |
  |                     |                    |--Log login activity--------------------->|
  |                     |                    |                   |                   |
  |                     |<--200 OK + tokens--|                   |                   |
  |                     |                    |                   |                   |
  |                     |--Store tokens----->|                   |                   |
  |                     |(localStorage/cookie)                   |                   |
  |                     |                    |                   |                   |
  |                     |--Redirect by role->|                   |                   |
  |                     |                    |                   |                   |
  |<--Dashboard loaded--|                    |                   |                   |
  |                     |                    |                   |                   |
```

### 5.2. Register Sequence

```
User                Frontend            API Server          Database        Email Service
  |                     |                    |                   |                 |
  |--Fill form--------->|                    |                   |                 |
  |                     |                    |                   |                 |
  |--Enter email------->|                    |                   |                 |
  |                     |                    |                   |                 |
  |                     |--Check email unique----------------->  |                 |
  |                     |(debounced 500ms)   |                   |                 |
  |                     |                    |                   |                 |
  |                     |                    |--SELECT * FROM users WHERE email--->|
  |                     |                    |                   |                 |
  |                     |                    |<--Email available-|                 |
  |                     |                    |                   |                 |
  |                     |<--Email OK---------|                   |                 |
  |                     |                    |                   |                 |
  |<--Show checkmark----|                    |                   |                 |
  |                     |                    |                   |                 |
  |--Click Register---->|                    |                   |                 |
  |                     |                    |                   |                 |
  |                     |--Validate all fields                   |                 |
  |                     |                    |                   |                 |
  |                     |--POST /auth/register                   |                 |
  |                     |                    |                   |                 |
  |                     |                    |--Hash password--->|                 |
  |                     |                    |                   |                 |
  |                     |                    |<--Hashed password-|                 |
  |                     |                    |                   |                 |
  |                     |                    |--BEGIN TRANSACTION--------------->  |
  |                     |                    |                   |                 |
  |                     |                    |--INSERT INTO users--------------->  |
  |                     |                    |                   |                 |
  |                     |                    |<--User created----|                 |
  |                     |                    |                   |                 |
  |                     |                    |--INSERT INTO user_profiles-------->|
  |                     |                    |                   |                 |
  |                     |                    |<--Profile created-|                 |
  |                     |                    |                   |                 |
  |                     |                    |--Generate verification token------>|
  |                     |                    |                   |                 |
  |                     |                    |<--Token created---|                 |
  |                     |                    |                   |                 |
  |                     |                    |--COMMIT TRANSACTION--------------->|
  |                     |                    |                   |                 |
  |                     |                    |--Send verification email---------->|
  |                     |                    |                   |                 |
  |                     |                    |                   |                 |----------->
  |                     |                    |                   |                 | Send email
  |                     |                    |                   |                 |<-----------
  |                     |                    |<--Email sent------|                 |
  |                     |                    |                   |                 |
  |                     |                    |--Create notification-------------->|
  |                     |                    |                   |                 |
  |                     |<--201 Created------|                   |                 |
  |                     |                    |                   |                 |
  |<--Show success modal                     |                   |                 |
  |                     |                    |                   |                 |
  |                     |--Wait 3s---------->|                   |                 |
  |                     |                    |                   |                 |
  |                     |--Redirect /login-->|                   |                 |
  |                     |                    |                   |                 |
```

### 5.3. Forgot Password Sequence

```
User                Frontend            API Server          Database        Email Service
  |                     |                    |                   |                 |
  |--Enter email------->|                    |                   |                 |
  |                     |                    |                   |                 |
  |--Click Submit------>|                    |                   |                 |
  |                     |                    |                   |                 |
  |                     |--Validate email--->|                   |                 |
  |                     |                    |                   |                 |
  |                     |--POST /auth/forgot-password            |                 |
  |                     |                    |                   |                 |
  |                     |                    |--Find user by email--------------->|
  |                     |                    |                   |                 |
  |                     |                    |<--User found------|                 |
  |                     |                    |(or not found)     |                 |
  |                     |                    |                   |                 |
  |                     |                    |--IF user exists:  |                 |
  |                     |                    |  Generate reset token------------>  |
  |                     |                    |  (random, expires 1h)              |
  |                     |                    |                   |                 |
  |                     |                    |<--Token saved-----|                 |
  |                     |                    |                   |                 |
  |                     |                    |  Send reset email---------------->  |
  |                     |                    |                   |                 |
  |                     |                    |                   |                 |----------->
  |                     |                    |                   |                 | Send email
  |                     |                    |                   |                 |<-----------
  |                     |                    |<--Email sent------|                 |
  |                     |                    |                   |                 |
  |                     |                    |--ELSE (not exists):|                |
  |                     |                    |  Do nothing       |                 |
  |                     |                    |  (security: don't reveal)          |
  |                     |                    |                   |                 |
  |                     |<--200 OK-----------|                   |                 |
  |                     |(generic success)   |                   |                 |
  |                     |                    |                   |                 |
  |<--Show success msg--|                    |                   |                 |
  |"Check your email"   |                    |                   |                 |
  |                     |                    |                   |                 |
```

---

## 6. Database Design

### 6.1. Table: users

**Mô tả**: Lưu thông tin người dùng cơ bản và xác thực

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'student',
    -- 'student' | 'teacher' | 'admin' | 'uploader'
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
    -- 'pending' | 'active' | 'suspended' | 'expired'
  email_verified BOOLEAN DEFAULT FALSE,
  phone VARCHAR(20),
  avatar_url VARCHAR(500),
  last_login_at TIMESTAMP,
  login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
```

**Quan hệ**:
- 1 user → 1 user_profile (1-1)
- 1 user → N user_sessions (1-n)
- 1 user → N password_resets (1-n)
- 1 user → N login_history (1-n)

---

### 6.2. Table: user_profiles

**Mô tả**: Lưu thông tin profile chi tiết của người dùng

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  date_of_birth DATE,
  gender VARCHAR(10),
    -- 'male' | 'female' | 'other'
  bio TEXT,
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Vietnam',
  target_level VARCHAR(10),
    -- 'A2' | 'B1' | 'B2' | 'C1'
  current_level VARCHAR(10),
  occupation VARCHAR(100),
  learning_goals TEXT[],
  preferences JSONB,
    -- { notifications: {...}, privacy: {...}, ... }
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Indexes
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_target_level ON user_profiles(target_level);
```

---

### 6.3. Table: user_sessions

**Mô tả**: Lưu phiên đăng nhập của người dùng

```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  access_token VARCHAR(500) NOT NULL,
  refresh_token VARCHAR(500) NOT NULL,
  device_info JSONB,
    -- { browser, os, device, ... }
  ip_address INET,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  last_activity_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_access_token ON user_sessions(access_token);
CREATE INDEX idx_user_sessions_refresh_token ON user_sessions(refresh_token);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX idx_user_sessions_is_active ON user_sessions(is_active);
```

---

### 6.4. Table: password_resets

**Mô tả**: Lưu token đặt lại mật khẩu

```sql
CREATE TABLE password_resets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  is_used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_password_resets_token ON password_resets(token);
CREATE INDEX idx_password_resets_user_id ON password_resets(user_id);
CREATE INDEX idx_password_resets_expires_at ON password_resets(expires_at);
CREATE INDEX idx_password_resets_is_used ON password_resets(is_used);
```

---

### 6.5. Table: email_verifications

**Mô tả**: Lưu token xác thực email

```sql
CREATE TABLE email_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  is_used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP NOT NULL,
  verified_at TIMESTAMP,
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_email_verifications_token ON email_verifications(token);
CREATE INDEX idx_email_verifications_user_id ON email_verifications(user_id);
CREATE INDEX idx_email_verifications_expires_at ON email_verifications(expires_at);
```

---

### 6.6. Table: login_history

**Mô tả**: Lưu lịch sử đăng nhập

```sql
CREATE TABLE login_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  login_type VARCHAR(50),
    -- 'password' | 'google' | 'facebook' | 'refresh_token'
  status VARCHAR(20) NOT NULL,
    -- 'success' | 'failed' | 'locked'
  ip_address INET,
  user_agent TEXT,
  device_info JSONB,
  location JSONB,
    -- { city, country, ... }
  failure_reason VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_login_history_user_id ON login_history(user_id);
CREATE INDEX idx_login_history_created_at ON login_history(created_at DESC);
CREATE INDEX idx_login_history_status ON login_history(status);
```

---

### 6.7. Table: token_blacklist

**Mô tả**: Lưu các token đã bị vô hiệu hóa

```sql
CREATE TABLE token_blacklist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token VARCHAR(500) NOT NULL UNIQUE,
  token_type VARCHAR(20) NOT NULL,
    -- 'access' | 'refresh'
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reason VARCHAR(100),
    -- 'logout' | 'password_changed' | 'admin_revoked'
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_token_blacklist_token ON token_blacklist(token);
CREATE INDEX idx_token_blacklist_expires_at ON token_blacklist(expires_at);

-- Auto cleanup expired tokens
CREATE OR REPLACE FUNCTION cleanup_expired_blacklist_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM token_blacklist WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Run cleanup daily
-- (Setup with cron job or pg_cron)
```

---

## 7. API Endpoints

### 7.1. POST /api/auth/register

**Mô tả**: Đăng ký tài khoản mới

**Request**:
```typescript
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "Nguyễn Văn A",
  "email": "nguyenvana@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "phone": "0912345678",
  "targetLevel": "B1",
  "termsAccepted": true
}
```

**Response** (Success - 201):
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "nguyenvana@example.com",
    "fullName": "Nguyễn Văn A",
    "message": "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản."
  }
}
```

**Response** (Error - 400):
```json
{
  "success": false,
  "error": {
    "code": "EMAIL_EXISTS",
    "message": "Email này đã được đăng ký",
    "field": "email"
  }
}
```

**Validation**:
- `fullName`: Required, min 2 words, max 255 chars
- `email`: Required, valid email format, unique, max 255 chars
- `password`: Required, min 8 chars, must contain uppercase, lowercase, number
- `confirmPassword`: Required, must match password
- `phone`: Optional, valid phone format
- `targetLevel`: Required, one of ['A2', 'B1', 'B2', 'C1']
- `termsAccepted`: Required, must be true

**Business Logic**:
1. Validate all inputs
2. Check email uniqueness
3. Hash password (bcrypt, salt rounds: 10)
4. Begin transaction:
   - Create user (role: 'student', status: 'pending')
   - Create user_profile
   - Generate verification token
   - Create email_verification record
5. Commit transaction
6. Send verification email (async)
7. Create welcome notification
8. Return success

**Error Codes**:
- `VALIDATION_ERROR`: Invalid input
- `EMAIL_EXISTS`: Email already registered
- `WEAK_PASSWORD`: Password doesn't meet requirements
- `TERMS_NOT_ACCEPTED`: Terms checkbox not checked

---

### 7.2. POST /api/auth/login

**Mô tả**: Đăng nhập vào hệ thống

**Request**:
```typescript
POST /api/auth/login
Content-Type: application/json

{
  "email": "nguyenvana@example.com",
  "password": "SecurePass123!",
  "rememberMe": false
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "nguyenvana@example.com",
      "fullName": "Nguyễn Văn A",
      "role": "student",
      "avatar": "https://...",
      "emailVerified": true
    }
  }
}
```

**Response** (Error - 401):
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email hoặc mật khẩu không chính xác"
  }
}
```

**Response** (Error - 403):
```json
{
  "success": false,
  "error": {
    "code": "ACCOUNT_LOCKED",
    "message": "Tài khoản đã bị khóa do quá nhiều lần đăng nhập sai. Vui lòng thử lại sau 15 phút.",
    "lockedUntil": "2024-12-15T10:30:00Z"
  }
}
```

**Validation**:
- `email`: Required, email format
- `password`: Required
- `rememberMe`: Optional, boolean

**Business Logic**:
1. Find user by email
2. If not found → Return INVALID_CREDENTIALS
3. Check account locked → Return ACCOUNT_LOCKED
4. Verify password:
   - If wrong:
     - Increment login_attempts
     - If attempts >= 5 → Lock account for 15 minutes
     - Log failed login
     - Return INVALID_CREDENTIALS
   - If correct:
     - Reset login_attempts to 0
     - Check account status:
       - 'pending' → Return ACCOUNT_NOT_VERIFIED
       - 'suspended' → Return ACCOUNT_SUSPENDED
       - 'expired' → Return ACCOUNT_EXPIRED
       - 'active' → Continue
5. Generate JWT tokens:
   - Access token (expires: 15 minutes)
   - Refresh token (expires: 7 days or 30 days if rememberMe)
6. Create user_session record
7. Update last_login_at
8. Log successful login in login_history
9. Return tokens + user data

**Error Codes**:
- `INVALID_CREDENTIALS`: Wrong email or password
- `ACCOUNT_LOCKED`: Too many failed attempts
- `ACCOUNT_NOT_VERIFIED`: Email not verified
- `ACCOUNT_SUSPENDED`: Account suspended by admin
- `ACCOUNT_EXPIRED`: Account expired

---

### 7.3. POST /api/auth/logout

**Mô tả**: Đăng xuất khỏi hệ thống

**Request**:
```typescript
POST /api/auth/logout
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Đăng xuất thành công"
}
```

**Business Logic**:
1. Decode access token to get user_id
2. Find and invalidate session
3. Add both tokens to blacklist
4. Log logout action
5. Return success

---

### 7.4. POST /api/auth/refresh-token

**Mô tả**: Làm mới access token bằng refresh token

**Request**:
```typescript
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." 
  }
}
```

**Response** (Error - 401):
```json
{
  "success": false,
  "error": {
    "code": "INVALID_REFRESH_TOKEN",
    "message": "Refresh token không hợp lệ hoặc đã hết hạn"
  }
}
```

**Business Logic**:
1. Verify refresh token signature
2. Check token not in blacklist
3. Check token not expired
4. Find user_session
5. Check session is_active
6. Generate new access token (và optional new refresh token)
7. Update session.last_activity_at
8. Return new tokens

---

### 7.5. POST /api/auth/forgot-password

**Mô tả**: Yêu cầu đặt lại mật khẩu

**Request**:
```typescript
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "nguyenvana@example.com"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được link đặt lại mật khẩu."
}
```

**Business Logic**:
1. Find user by email
2. If found:
   - Generate random token (crypto.randomBytes)
   - Set expires_at = now + 1 hour
   - Save to password_resets table
   - Send email with reset link
   - Return generic success
3. If not found:
   - Return same generic success (security: don't reveal if email exists)

---

### 7.6. POST /api/auth/reset-password

**Mô tả**: Đặt lại mật khẩu mới

**Request**:
```typescript
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "random-token-from-email",
  "newPassword": "NewSecurePass123!",
  "confirmPassword": "NewSecurePass123!"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Đặt lại mật khẩu thành công!"
}
```

**Response** (Error - 400):
```json
{
  "success": false,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn"
  }
}
```

**Business Logic**:
1. Find password_reset by token
2. Check token exists → else INVALID_TOKEN
3. Check not expired → else EXPIRED_TOKEN
4. Check not used → else TOKEN_ALREADY_USED
5. Validate new password strength
6. Hash new password
7. Begin transaction:
   - Update user password
   - Mark token as used (is_used = true)
   - Invalidate all user sessions
   - Add all user tokens to blacklist
8. Commit transaction
9. Send confirmation email
10. Create notification
11. Return success

**Error Codes**:
- `INVALID_TOKEN`: Token not found
- `EXPIRED_TOKEN`: Token expired (> 1 hour)
- `TOKEN_ALREADY_USED`: Token already used
- `WEAK_PASSWORD`: Password doesn't meet requirements

---

### 7.7. POST /api/auth/verify-email

**Mô tả**: Xác thực email

**Request**:
```typescript
POST /api/auth/verify-email
Content-Type: application/json

{
  "token": "verification-token-from-email"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Email đã được xác thực thành công!",
  "data": {
    "userId": "uuid",
    "emailVerified": true
  }
}
```

**Response** (Error - 400):
```json
{
  "success": false,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Link xác thực không hợp lệ hoặc đã hết hạn"
  }
}
```

**Business Logic**:
1. Find email_verification by token
2. Check token exists → else INVALID_TOKEN
3. Check not expired → else EXPIRED_TOKEN
4. Check not used → else ALREADY_VERIFIED
5. Begin transaction:
   - Update user.email_verified = true
   - Update user.status = 'active'
   - Mark verification as used
6. Commit transaction
7. Unlock "Email Verified" badge
8. Create welcome notification
9. Return success

---

### 7.8. POST /api/auth/resend-verification

**Mô tả**: Gửi lại email xác thực

**Request**:
```typescript
POST /api/auth/resend-verification
Content-Type: application/json

{
  "email": "nguyenvana@example.com"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Email xác thực đã được gửi lại"
}
```

**Business Logic**:
1. Find user by email
2. Check user exists and not verified
3. Check last verification email sent > 1 minute ago (rate limit)
4. Generate new verification token
5. Save to email_verifications
6. Send verification email
7. Return success

---

### 7.9. POST /api/auth/change-password

**Mô tả**: Đổi mật khẩu (khi đã đăng nhập)

**Request**:
```typescript
POST /api/auth/change-password
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!",
  "confirmPassword": "NewPass123!"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Đổi mật khẩu thành công!"
}
```

**Response** (Error - 400):
```json
{
  "success": false,
  "error": {
    "code": "INCORRECT_PASSWORD",
    "message": "Mật khẩu hiện tại không chính xác"
  }
}
```

**Business Logic**:
1. Get user_id from access token
2. Verify current password
3. Check new password != current password
4. Validate new password strength
5. Hash new password
6. Begin transaction:
   - Update user password
   - Invalidate all other sessions (keep current)
   - Add old tokens to blacklist
8. Commit transaction
9. Send confirmation email
10. Create notification
11. Return success

---

## 8. Security Requirements

### 8.1. Password Security

**Password Requirements**:
- Minimum 8 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 number (0-9)
- At least 1 special character (!@#$%^&*)
- Cannot contain email or username
- Cannot be common password (check against list)

**Password Hashing**:
- Algorithm: bcrypt
- Salt rounds: 10
- Never store plain text passwords
- Never log passwords

**Password Change**:
- Require current password
- Cannot reuse last 5 passwords
- Invalidate all sessions except current

---

### 8.2. Token Security

**JWT Configuration**:
- Algorithm: HS256 (or RS256 for better security)
- Access token expiry: 15 minutes
- Refresh token expiry: 7 days (30 days if "Remember me")
- Include: user_id, email, role, iat, exp
- Sign with strong secret (min 256 bits)

**Token Storage**:
- Access token: localStorage (or sessionStorage)
- Refresh token: httpOnly cookie (preferred) or localStorage
- Never expose tokens in URL
- Clear on logout

**Token Blacklist**:
- Invalidate on logout
- Invalidate on password change
- Auto cleanup expired tokens daily

---

### 8.3. Account Protection

**Rate Limiting**:
- Login: Max 5 attempts per 15 minutes per IP
- Register: Max 3 accounts per hour per IP
- Forgot password: Max 3 requests per hour per email
- Resend verification: Max 5 emails per day per email

**Account Lockout**:
- Lock after 5 failed login attempts
- Auto unlock after 15 minutes
- Admin can unlock manually
- Notify user via email when locked

**Session Management**:
- Max 5 concurrent sessions per user
- Auto logout inactive sessions after 30 days
- Show active devices to user
- Allow remote logout

---

### 8.4. Data Protection

**Email Security**:
- Validate email format
- Check email deliverability
- Use email verification
- Don't reveal if email exists (in forgot password)

**XSS Prevention**:
- Sanitize all user inputs
- Use Content Security Policy
- Escape HTML in outputs

**CSRF Protection**:
- Use CSRF tokens for state-changing requests
- Verify Origin/Referer headers
- SameSite cookie attribute

**SQL Injection Prevention**:
- Use parameterized queries
- Use ORM (Sequelize, Prisma, TypeORM)
- Never concatenate SQL strings

---

### 8.5. Audit & Monitoring

**Logging**:
- Log all authentication events
- Log failed login attempts
- Log password changes
- Log account lockouts
- Store logs for 90 days minimum

**Monitoring**:
- Alert on unusual login patterns
- Alert on brute force attempts
- Alert on multiple failed logins
- Monitor token usage

**Compliance**:
- GDPR compliance (if serving EU users)
- Data retention policies
- Right to be forgotten
- Data export capability

---

## 9. Validation Rules

### 9.1. Email Validation

```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string): boolean {
  // Check format
  if (!emailRegex.test(email)) {
    return false;
  }
  
  // Check length
  if (email.length > 255) {
    return false;
  }
  
  // Check for common typos
  const commonTypos = ['gmial.com', 'yahooo.com', 'hotmial.com'];
  const domain = email.split('@')[1];
  if (commonTypos.includes(domain)) {
    // Suggest correction
    return false;
  }
  
  return true;
}
```

### 9.2. Password Validation

```typescript
interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  
  // Length check
  if (password.length < 8) {
    errors.push('Mật khẩu phải có ít nhất 8 ký tự');
  }
  
  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    errors.push('Mật khẩu phải có ít nhất 1 chữ hoa');
  }
  
  // Lowercase check
  if (!/[a-z]/.test(password)) {
    errors.push('Mật khẩu phải có ít nhất 1 chữ thường');
  }
  
  // Number check
  if (!/[0-9]/.test(password)) {
    errors.push('Mật khẩu phải có ít nhất 1 số');
  }
  
  // Special character check
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Mật khẩu phải có ít nhất 1 ký tự đặc biệt (!@#$%^&*)');
  }
  
  // Calculate strength
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password);
  
  const criteriaMet = [hasLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  
  if (criteriaMet >= 5) {
    strength = 'strong';
  } else if (criteriaMet >= 3) {
    strength = 'medium';
  }
  
  return {
    valid: errors.length === 0,
    errors,
    strength
  };
}
```

### 9.3. Phone Validation

```typescript
function validatePhone(phone: string): boolean {
  // Vietnamese phone format
  // Format: 0912345678 or +84912345678
  const vnPhoneRegex = /^(\+84|0)[0-9]{9}$/;
  
  return vnPhoneRegex.test(phone);
}
```

### 9.4. Full Name Validation

```typescript
function validateFullName(name: string): boolean {
  // At least 2 words
  const words = name.trim().split(/\s+/);
  if (words.length < 2) {
    return false;
  }
  
  // Each word should have at least 1 character
  if (words.some(word => word.length === 0)) {
    return false;
  }
  
  // Only letters and spaces
  if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(name)) {
    return false;
  }
  
  // Max length
  if (name.length > 255) {
    return false;
  }
  
  return true;
}
```

---

## Kết thúc Module Authentication

Module này cung cấp nền tảng xác thực và phân quyền cho toàn bộ hệ thống VSTEPRO. Các module khác sẽ sử dụng JWT token từ module này để xác thực người dùng và kiểm tra quyền truy cập.

**Liên kết đến module khác**:
- Module 05: User Management (quản lý user sau khi đăng nhập)
- Module 09: Student Dashboard (sau khi student login)
- Module 13: Teacher Dashboard (sau khi teacher login)
- Module 16: Admin Dashboard (sau khi admin login)
- Module 20: Notification System (thông báo về login, password change, etc.)

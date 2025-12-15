# 👥 Module 05: User Management

> **Module quản lý người dùng cho Admin**
> 
> File: `05-MODULE-USER-MANAGEMENT.md`  
> Version: 1.0  
> Last Updated: 15/12/2024

---

## 📑 Mục lục

- [1. Giới thiệu module](#1-giới-thiệu-module)
- [2. Danh sách chức năng](#2-danh-sách-chức-năng)
- [3. Phân tích màn hình UI](#3-phân-tích-màn-hình-ui)
- [4. User Flows](#4-user-flows)
- [5. Database Design](#5-database-design)
- [6. API Endpoints](#6-api-endpoints)

---

## 1. Giới thiệu module

### 1.1. Mục đích
Module User Management cho phép Admin:
- Xem danh sách tất cả người dùng
- CRUD operations (Create, Read, Update, Delete)
- Quản lý roles và permissions
- Theo dõi hoạt động người dùng
- Quản lý tài khoản (active, suspend, expire)
- Reset password
- Quản lý thiết bị đăng nhập
- Export báo cáo

### 1.2. Vai trò

**Admin**:
- Toàn quyền quản lý users
- View all users
- Create/Edit/Delete users
- Change roles
- Suspend/Activate accounts
- Reset passwords
- View login history
- Manage devices
- Export reports

**Super Admin** (optional):
- Tất cả quyền của Admin
- Manage other admins
- System-wide settings

### 1.3. User Types

**Students**:
- Regular users
- Can be free or paid
- Subject to account limits

**Teachers**:
- Can create classes
- Can assign homework
- Can view student progress

**Admins**:
- System administrators
- Full access to management

**Uploaders**:
- Content contributors
- Can upload exams
- Limited management access

---

## 2. Danh sách chức năng

### 2.1. User List & Search

**Display**:
- Table view with pagination
- Columns:
  - Avatar
  - Full Name
  - Email
  - Role (badge)
  - Status (badge)
  - Account Type (Free/Premium)
  - Created Date
  - Last Login
  - Actions

**Filters**:
- Role (Student/Teacher/Admin/Uploader)
- Status (Active/Suspended/Expired)
- Account Type (Free/Premium)
- Registration Date Range
- Last Login Date Range

**Search**:
- By name, email, phone
- Debounced real-time search

**Sort**:
- Name A-Z/Z-A
- Recent registered
- Last login
- Most active

**Bulk Actions**:
- Select multiple users
- Bulk suspend
- Bulk activate
- Bulk delete
- Bulk export

---

### 2.2. Create User

**Form Fields**:
- **Full Name** (required)
- **Email** (required, unique)
- **Password** (required, min 8 chars)
- **Phone** (optional)
- **Role** (required): Student/Teacher/Admin/Uploader
- **Account Type**: Free/Premium
- **Target Level**: A2/B1/B2/C1
- **Status**: Active/Suspended
- **Send Welcome Email**: Checkbox

**Business Logic**:
1. Validate inputs
2. Check email uniqueness
3. Hash password
4. Create user record
5. Create user_profile
6. Assign default role
7. Send welcome email (if checked)
8. Log action

---

### 2.3. Edit User

**Editable Fields**:
- Full Name
- Email (must remain unique)
- Phone
- Role
- Account Type
- Status
- Target Level
- Avatar

**Non-editable**:
- User ID
- Created Date
- Password (separate action)

**Business Logic**:
1. Load user data
2. Validate changes
3. Update user record
4. Update profile
5. Log action
6. Notify user if important changes

---

### 2.4. Delete User

**Types**:

**Soft Delete** (default):
- Set deleted_at timestamp
- Hide from normal queries
- Keep all data
- Can restore within 30 days

**Hard Delete** (permanent):
- Remove all user data
- Remove all submissions
- Remove from classes
- Cannot undo
- Requires confirmation

**Business Logic**:
1. Confirm action
2. Check dependencies:
   - Classes created (teacher)
   - Students in classes (teacher)
   - Submissions/progress (student)
3. Soft delete by default
4. Hard delete only if confirmed
5. Log action
6. Notify user (soft delete only)

---

### 2.5. Change Role

**Flow**:
1. Select user
2. Click "Change Role"
3. Select new role
4. Confirm with reason
5. Update role
6. Update permissions
7. Notify user
8. Log action

**Constraints**:
- Cannot demote yourself
- Cannot change super admin (if exists)
- Changing to/from teacher: Check classes
- Changing to/from admin: Confirm carefully

---

### 2.6. Suspend/Activate Account

**Suspend**:
- **Reason**: Required input
- **Duration**: Optional (days or indefinite)
- **Notify User**: Checkbox
- **Effect**:
  - Cannot login
  - Active sessions invalidated
  - Show "Account suspended" message
- **Reversible**: Yes

**Activate**:
- **Effect**:
  - Can login again
  - Send notification
- **Note**: Optional

---

### 2.7. Reset Password

**Admin Reset**:
1. Select user
2. Click "Reset Password"
3. Options:
   - Auto-generate password
   - Set specific password
4. Send password via email
5. Force change on next login
6. Log action

**User receives**:
- Email with temporary password
- Link to change password
- Security notice

---

### 2.8. Manage Devices

**View Devices**:
- List all logged-in devices
- Columns:
  - Device Type (Desktop/Mobile/Tablet)
  - Browser
  - OS
  - IP Address
  - Location (approximate)
  - Last Active
  - Actions

**Actions**:
- Logout device
- Logout all except current
- Block device

---

### 2.9. View User Details

**Tabs**:

**Overview**:
- Basic info
- Profile picture
- Contact details
- Account settings
- Statistics summary

**Activity**:
- Login history
- Practice history
- Assignments
- Exam attempts

**Classes** (for students):
- Enrolled classes
- Progress
- Attendance

**Classes** (for teachers):
- Created classes
- Students count
- Assignments given

**Payments** (if premium):
- Transaction history
- Subscription status
- Payment methods

**Logs**:
- Account changes
- Role changes
- Suspensions
- Password resets

---

### 2.10. Export Users

**Export Options**:
- **Format**: CSV, Excel, PDF
- **Fields**: Select which columns
- **Filters**: Apply before export
- **Range**: All or selected users

**Generated File**:
- Filename: `Users_Export_YYYY-MM-DD.xlsx`
- Contents: Filtered user list
- Metadata: Export date, filters applied

---

## 3. Phân tích màn hình UI

### 3.1. User Management Page

**File**: `/components/admin/UserManagementPage.tsx`

**Header**:
- Title: "Quản lý người dùng"
- Button: "Thêm người dùng" (+ icon)
- Button: "Xuất Excel"

**Stats Cards** (4 cards):
1. Total Users: 1,234
2. Active Users: 980 (this month)
3. New Users: +52 (this month)
4. Premium Users: 156

**Filters Bar**:
- **Role Filter**: Dropdown
  - All Roles
  - Students (badge: count)
  - Teachers (badge: count)
  - Admins (badge: count)
  - Uploaders (badge: count)

- **Status Filter**: Dropdown
  - All Status
  - Active
  - Suspended
  - Expired

- **Account Type**: Dropdown
  - All Types
  - Free
  - Premium

- **Search**: Input box
  - Placeholder: "Tìm theo tên, email, SĐT..."
  - Icon: Search
  - Real-time debounced

**Users Table**:
- **Columns**:
  1. [ ] Checkbox (select all)
  2. Avatar + Name
  3. Email
  4. Role (colored badge)
  5. Status (colored badge)
  6. Account Type (badge)
  7. Created Date
  8. Last Login
  9. Actions (dropdown)

- **Row Actions**:
  - View Details (eye icon)
  - Edit (pencil icon)
  - Change Role
  - Suspend/Activate
  - Reset Password
  - Delete (trash icon)

**Bulk Actions** (appears when rows selected):
- "X selected"
- Button: "Suspend"
- Button: "Activate"
- Button: "Delete"
- Button: "Export Selected"

**Pagination**:
- Show: "Showing 1-20 of 1,234"
- Per page: Dropdown (20/50/100)
- Previous | 1 2 3 ... 62 | Next

---

### 3.2. Create User Modal

**Modal Header**:
- Title: "Thêm người dùng mới"
- Close button (X)

**Form** (2 columns):

**Left Column**:
- **Full Name**:
  - Label: "Họ và tên *"
  - Placeholder: "Nguyễn Văn A"
  - Validation: Required, min 2 words

- **Email**:
  - Label: "Email *"
  - Placeholder: "user@example.com"
  - Validation: Required, email format, unique
  - Check availability icon

- **Password**:
  - Label: "Mật khẩu *"
  - Placeholder: "Tối thiểu 8 ký tự"
  - Show/Hide toggle
  - Password strength meter
  - Generate password button

- **Phone**:
  - Label: "Số điện thoại"
  - Placeholder: "0912345678"
  - Optional

**Right Column**:
- **Role**:
  - Label: "Vai trò *"
  - Radio buttons:
    - ⚪ Student
    - ⚪ Teacher
    - ⚪ Admin
    - ⚪ Uploader

- **Account Type**:
  - Label: "Loại tài khoản"
  - Select:
    - Free (default)
    - Premium

- **Target Level** (if Student):
  - Label: "Mục tiêu VSTEP"
  - Select: A2/B1/B2/C1

- **Status**:
  - Label: "Trạng thái"
  - Select:
    - Active (default)
    - Suspended

**Options**:
- [ ] Send welcome email
- [ ] Force password change on first login

**Footer**:
- Button: "Hủy" (secondary)
- Button: "Tạo người dùng" (primary)
  - Loading state: "Đang tạo..."

---

### 3.3. Edit User Modal

**Similar to Create**, but:
- Title: "Chỉnh sửa người dùng"
- Pre-filled with existing data
- Password field hidden (separate action)
- Cannot change email (or require re-verification)
- Show "Last updated" timestamp
- Footer button: "Lưu thay đổi"

---

### 3.4. User Detail Page

**Header**:
- Breadcrumb: "Quản lý người dùng > {UserName}"
- User avatar (large)
- Name + role badge
- Status badge
- Actions dropdown:
  - Edit
  - Change Role
  - Suspend/Activate
  - Reset Password
  - Delete

**Tabs**:

**Tab 1: Overview**:
- **Basic Info Card**:
  - Full Name
  - Email (with verification status)
  - Phone
  - Role
  - Account Type
  - Target Level
  - Member Since
  - Last Login
  - Total Login Days

- **Statistics Card**:
  - Total Exercises: X
  - Total Practice Time: Y hours
  - Average Score: Z/10
  - Assignments Completed: W

- **Account Status Card**:
  - Status: Active/Suspended/Expired
  - Subscription: Free/Premium
  - Expires: Date (if premium)
  - Devices Logged In: N

**Tab 2: Activity**:
- **Recent Activities** (timeline):
  - Login events
  - Exercise completions
  - Assignment submissions
  - Exam attempts
  - Badge unlocks

- **Login History** (table):
  - Date/Time
  - IP Address
  - Device
  - Location
  - Status (Success/Failed)

**Tab 3: Classes** (Student):
- Enrolled classes list
- Progress per class
- Attendance rate

**Tab 3: Classes** (Teacher):
- Created classes
- Total students
- Active assignments

**Tab 4: Devices**:
- Active devices list
- Each device card:
  - Device type + icon
  - Browser + OS
  - IP Address
  - Location
  - Last active
  - Button: "Logout"

**Tab 5: Logs**:
- Admin actions on this user
- Role changes
- Status changes
- Password resets
- Suspensions
- Each log:
  - Timestamp
  - Action
  - Performed by
  - Reason/Note

---

## 4. User Flows

### 4.1. Create User Flow

```
Admin navigates to User Management
  ↓
Click "Thêm người dùng"
  ↓
Open Create User Modal
  ↓
Fill form:
  ├─ Full Name: "Nguyễn Văn B"
  ├─ Email: "nguyenvanb@example.com"
  ├─ Password: Auto-generate or manual
  ├─ Phone: "0912345678"
  ├─ Role: "Student"
  ├─ Account Type: "Free"
  ├─ Target Level: "B2"
  └─ Check "Send welcome email"
  ↓
Click "Tạo người dùng"
  ↓
Validate form:
  ├─ Check email uniqueness
  ├─ Validate password strength
  └─ Required fields filled
  ↓
POST /api/admin/users
  ↓
Backend:
  ├─ Hash password
  ├─ Create user record
  ├─ Create user_profile
  ├─ Send welcome email (if checked)
  └─ Log action
  ↓
Close modal
  ↓
Show success toast: "Đã tạo người dùng thành công"
  ↓
Refresh users list
  ↓
New user appears in table
```

### 4.2. Suspend User Flow

```
Admin views user in table
  ↓
Click Actions → "Suspend Account"
  ↓
Open Suspend Confirmation Modal
  ↓
Modal displays:
  ├─ User info
  ├─ Warning: "User won't be able to login"
  └─ Form:
      ├─ Reason: Textarea (required)
      ├─ Duration: Select (7 days/30 days/Indefinite)
      └─ [ ] Notify user via email
  ↓
Fill reason: "Violation of terms"
  ↓
Select duration: "30 days"
  ↓
Check "Notify user"
  ↓
Click "Suspend Account"
  ↓
PUT /api/admin/users/:id/suspend
  ↓
Backend:
  ├─ Update user status: 'suspended'
  ├─ Set locked_until: NOW() + 30 days
  ├─ Invalidate all sessions
  ├─ Add to blacklist
  ├─ Create suspension log
  ├─ Send notification email (if checked)
  └─ Log admin action
  ↓
Close modal
  ↓
Update user row:
  ├─ Status badge: "Suspended" (red)
  └─ Last Action: "Suspended by Admin"
  ↓
Show success: "User suspended successfully"
```

---

## 5. Database Design

### 5.1. Table: users (extended)

```sql
-- Already defined in Module 01, adding admin-related fields

ALTER TABLE users ADD COLUMN IF NOT EXISTS
  account_type VARCHAR(20) DEFAULT 'free',
    -- 'free' | 'premium' | 'trial'
  premium_expires_at TIMESTAMP,
  max_devices INTEGER DEFAULT 3,
  suspension_reason TEXT,
  suspended_by UUID REFERENCES users(id),
  suspended_at TIMESTAMP,
  locked_until TIMESTAMP;
```

### 5.2. Table: admin_logs

```sql
CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES users(id),
  action VARCHAR(50) NOT NULL,
    -- 'create_user' | 'update_user' | 'delete_user' | 'suspend_user' | 
    -- 'activate_user' | 'change_role' | 'reset_password'
  target_user_id UUID REFERENCES users(id),
  details JSONB,
    -- Additional context
  reason TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_target_user ON admin_logs(target_user_id);
CREATE INDEX idx_admin_logs_action ON admin_logs(action);
CREATE INDEX idx_admin_logs_created_at ON admin_logs(created_at DESC);
```

### 5.3. Table: user_suspensions

```sql
CREATE TABLE user_suspensions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  suspended_by UUID NOT NULL REFERENCES users(id),
  reason TEXT NOT NULL,
  duration_days INTEGER,
    -- NULL = indefinite
  suspended_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  lifted_at TIMESTAMP,
  lifted_by UUID REFERENCES users(id),
  lift_reason TEXT,
  
  is_active BOOLEAN DEFAULT TRUE
);

-- Indexes
CREATE INDEX idx_suspensions_user_id ON user_suspensions(user_id);
CREATE INDEX idx_suspensions_is_active ON user_suspensions(is_active);
```

---

## 6. API Endpoints

### 6.1. GET /api/admin/users

**Request**:
```typescript
GET /api/admin/users?role=student&status=active&page=1&limit=20&search=nguyen
Authorization: Bearer {token}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "fullName": "Nguyễn Văn A",
        "email": "nguyenvana@example.com",
        "phone": "0912345678",
        "role": "student",
        "status": "active",
        "accountType": "free",
        "avatar": "https://...",
        "emailVerified": true,
        "createdAt": "2024-12-01T10:00:00Z",
        "lastLoginAt": "2024-12-15T09:30:00Z",
        "totalExercises": 45,
        "avgScore": 7.5
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1234,
      "pages": 62
    },
    "stats": {
      "total": 1234,
      "active": 980,
      "suspended": 12,
      "students": 1100,
      "teachers": 120,
      "admins": 14
    }
  }
}
```

---

### 6.2. POST /api/admin/users

**Request**:
```typescript
POST /api/admin/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "fullName": "Nguyễn Văn B",
  "email": "nguyenvanb@example.com",
  "password": "SecurePass123!",
  "phone": "0912345678",
  "role": "student",
  "accountType": "free",
  "targetLevel": "B2",
  "status": "active",
  "sendWelcomeEmail": true
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "userId": "uuid",
    "fullName": "Nguyễn Văn B",
    "email": "nguyenvanb@example.com",
    "role": "student",
    "status": "active"
  }
}
```

---

### 6.3. PUT /api/admin/users/:id

**Request**:
```typescript
PUT /api/admin/users/uuid
Authorization: Bearer {token}
Content-Type: application/json

{
  "fullName": "Nguyễn Văn B Updated",
  "phone": "0987654321",
  "targetLevel": "C1",
  "accountType": "premium",
  "premiumExpiresAt": "2025-12-15"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "userId": "uuid",
    "updatedFields": ["fullName", "phone", "targetLevel", "accountType"]
  }
}
```

---

### 6.4. PUT /api/admin/users/:id/suspend

**Request**:
```typescript
PUT /api/admin/users/uuid/suspend
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "Violation of terms of service",
  "durationDays": 30,
  "notifyUser": true
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "User suspended successfully",
  "data": {
    "userId": "uuid",
    "status": "suspended",
    "expiresAt": "2025-01-15T00:00:00Z"
  }
}
```

---

### 6.5. PUT /api/admin/users/:id/activate

**Request**:
```typescript
PUT /api/admin/users/uuid/activate
Authorization: Bearer {token}
Content-Type: application/json

{
  "note": "Issue resolved"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "User activated successfully"
}
```

---

### 6.6. POST /api/admin/users/:id/reset-password

**Request**:
```typescript
POST /api/admin/users/uuid/reset-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "method": "auto-generate",  // or "set-password"
  "newPassword": "TempPass123!",  // if method="set-password"
  "sendEmail": true,
  "forceChange": true
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Password reset successfully",
  "data": {
    "temporaryPassword": "TempPass123!",  // if auto-generated
    "emailSent": true
  }
}
```

---

## Kết thúc Module User Management

Module này cung cấp công cụ quản lý người dùng toàn diện cho Admin, tích hợp với:
- Module 01: Authentication (user accounts)
- Module 06: Class Management (student/teacher relationships)
- Module 19: Statistics (user activity data)
- Module 20: Notification (user notifications)

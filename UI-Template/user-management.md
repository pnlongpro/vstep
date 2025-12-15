# 👥 USER MANAGEMENT - QUẢN LÝ NGƯỜI DÙNG

## Mục lục
1. [Tổng quan](#tổng-quan)
2. [Chức năng chi tiết](#chức-năng-chi-tiết)
3. [UI Components](#ui-components)
4. [User Flows](#user-flows)
5. [Sequence Diagrams](#sequence-diagrams)
6. [Database Design](#database-design)
7. [API Endpoints](#api-endpoints)

---

## Tổng quan

### Mục đích
Module User Management cung cấp các chức năng quản lý toàn bộ người dùng trong hệ thống VSTEPRO, bao gồm học viên (students), giáo viên (teachers), và quản trị viên (admins).

### Phạm vi
- Quản lý thông tin người dùng (CRUD)
- Phân quyền và vai trò
- Theo dõi hoạt động người dùng
- Quản lý trạng thái tài khoản
- Thống kê người dùng
- Bulk operations

### Vai trò truy cập
- **Admin**: Full access (CRUD, view, export)
- **Teacher**: Read-only cho students trong lớp của mình
- **Student**: Chỉ xem và chỉnh sửa profile của mình

---

## Chức năng chi tiết

### 1. Danh sách người dùng (User List)

#### Hiển thị thông tin
- Avatar người dùng
- Họ tên đầy đủ
- Email
- Số điện thoại
- Vai trò (Student/Teacher/Admin)
- Trạng thái (Active/Inactive/Banned)
- Ngày tạo tài khoản
- Lần đăng nhập cuối

#### Tính năng
- **Pagination**: 10 users per page
- **Search**: Tìm theo tên, email, số điện thoại
- **Filters**:
  - Vai trò (All/Student/Teacher/Admin)
  - Trạng thái (All/Active/Inactive/Banned)
  - Hoạt động (All/Active 7 days/Active 30 days)
- **Sort**: Newest, Oldest, Most active
- **Bulk selection**: Select all, Select individual
- **Export**: Export to CSV/Excel

#### Actions
- **View**: Xem chi tiết người dùng
- **Edit**: Chỉnh sửa thông tin
- **Reset Password**: Gửi link reset mật khẩu
- **Delete**: Xóa người dùng (soft delete)

#### Bulk Actions
- Send email to selected users
- Deactivate selected users
- Change role (bulk)
- Export selected users

---

### 2. Thống kê người dùng (User Statistics)

#### Stat Cards
1. **Tổng người dùng**
   - Value: 15,234
   - Change: +12.5%
   - Icon: Users
   - Color: Blue gradient

2. **Đang hoạt động**
   - Value: 12,456
   - Change: +8.2%
   - Icon: UserCheck
   - Color: Green gradient

3. **Không hoạt động**
   - Value: 2,778
   - Change: -3.1%
   - Icon: UserX
   - Color: Gray gradient

4. **Mới 7 ngày**
   - Value: 1,234
   - Change: +18.3%
   - Icon: TrendingUp
   - Color: Purple gradient

#### Charts (trong Admin Dashboard)
- User growth line chart (6 months)
- User distribution by role (pie chart)
- Active vs Inactive comparison (bar chart)

---

### 3. Chi tiết người dùng (User Detail)

#### 3.1. Thông tin cơ bản (Profile Info)
```typescript
interface UserProfile {
  id: string;
  avatar: string;
  name: string;
  email: string;
  phone: string;
  role: 'Student' | 'Teacher' | 'Admin';
  status: 'active' | 'inactive' | 'banned';
  createdAt: Date;
  lastLogin: Date;
  bio?: string;
}
```

#### 3.2. Role Selector
- Dropdown với 3 options: Student, Teacher, Admin
- Có confirmation khi thay đổi role
- Log activity khi role thay đổi

#### 3.3. Status Switch
- Toggle: Active / Inactive / Banned
- Có confirmation khi ban user
- Gửi email thông báo khi status thay đổi

#### 3.4. Learning Stats (For Students)
```typescript
interface StudentStats {
  testsTaken: number;
  averageScore: number;
  studyTime: number; // in minutes
  streak: number; // consecutive days
  skillsData: {
    skill: 'Reading' | 'Listening' | 'Writing' | 'Speaking';
    score: number; // 0-10
  }[];
  recentActivities: Activity[];
}
```

**Skills Radar Chart**:
- 4 axes: Reading, Listening, Writing, Speaking
- Score range: 0-10
- Visual representation của điểm mạnh/yếu

**Recent Activities**:
- Hoàn thành bài thi Reading B2
- Làm bài tập Writing Task 1
- Xem video Speaking Tips
- Timestamp và icon cho mỗi activity

#### 3.5. Teaching Stats (For Teachers)
```typescript
interface TeacherStats {
  classesAssigned: number;
  totalStudents: number;
  coursesCreated: number;
  averageRating: number; // 0-5
  teachingSince: Date;
}
```

#### 3.6. Login History
```typescript
interface LoginHistory {
  date: Date;
  ipAddress: string;
  device: string; // "Chrome - Windows", "Mobile App - iOS"
  location?: string;
  status: 'success' | 'failed';
}
```

Display:
- 10 lần đăng nhập gần nhất
- Highlight suspicious activities
- Show device type với icon
- Color coding: Green (success), Red (failed)

#### 3.7. Actions History
```typescript
interface ActionLog {
  id: string;
  action: string; // "Created exam", "Updated profile"
  timestamp: Date;
  details: any;
  ipAddress: string;
}
```

---

### 4. Thêm người dùng mới (Add User)

#### Form Fields
```typescript
interface AddUserForm {
  name: string; // Required, min 2 chars
  email: string; // Required, valid email
  phone: string; // Required, valid phone
  password: string; // Required, min 8 chars
  role: 'Student' | 'Teacher' | 'Admin'; // Required
  status: 'active' | 'inactive'; // Default: active
  avatar?: File;
  bio?: string;
}
```

#### Validation Rules
- **Name**: 2-50 characters, letters only
- **Email**: Valid email format, unique trong DB
- **Phone**: 10-11 digits, format VN (+84)
- **Password**: Min 8 chars, có uppercase, lowercase, number
- **Avatar**: Max 5MB, formats: JPG, PNG, WEBP

#### Process
1. User nhập thông tin
2. Frontend validation
3. Submit form
4. Backend validation
5. Check email uniqueness
6. Hash password
7. Create user record
8. Send welcome email
9. Return success/error

#### Welcome Email Template
```
Subject: Chào mừng đến với VSTEPRO

Xin chào [Name],

Tài khoản của bạn đã được tạo thành công!

Email: [Email]
Mật khẩu: [Password]

Vui lòng đăng nhập và đổi mật khẩu ngay.

Link: https://vstepro.com/login

Trân trọng,
VSTEPRO Team
```

---

### 5. Chỉnh sửa người dùng (Edit User)

#### Editable Fields
- Name
- Phone
- Bio
- Avatar
- Role (Admin only)
- Status (Admin only)

#### Non-editable Fields
- Email (dùng để login, không đổi được)
- Created date
- User ID

#### Process
1. Load current user data
2. Pre-fill form
3. User modifies fields
4. Validate changes
5. Confirm changes
6. Update database
7. Log activity
8. Send notification email (if important fields changed)

---

### 6. Xóa người dùng (Delete User)

#### Soft Delete
- Không xóa thật khỏi database
- Đánh dấu `deleted_at` timestamp
- Giữ lại data cho audit trail

#### Process
1. Admin clicks Delete
2. Confirmation modal:
   ```
   Bạn có chắc muốn xóa người dùng này?
   
   Tên: [Name]
   Email: [Email]
   
   Hành động này không thể hoàn tác.
   
   [Hủy] [Xóa]
   ```
3. If confirmed:
   - Set `deleted_at` = now
   - Set `status` = 'deleted'
   - Revoke all sessions
   - Send email thông báo
   - Log activity

#### Data Retention
- Giữ data trong 30 ngày
- Sau 30 ngày → hard delete (optional)
- User có thể restore trong 30 ngày

---

### 7. Reset mật khẩu (Reset Password)

#### Admin-initiated Reset
1. Admin clicks "Reset Password"
2. System generates reset token
3. Send email với reset link
4. User clicks link
5. User nhập mật khẩu mới
6. Password updated
7. All sessions logged out

#### Email Template
```
Subject: Reset mật khẩu VSTEPRO

Xin chào [Name],

Quản trị viên đã yêu cầu reset mật khẩu cho tài khoản của bạn.

Click vào link dưới để tạo mật khẩu mới:
[Reset Link] (expires in 1 hour)

Nếu không phải bạn yêu cầu, vui lòng bỏ qua email này.

Trân trọng,
VSTEPRO Team
```

---

## UI Components

### Component: UserManagementPage.tsx

#### Structure
```tsx
<UserManagementPage>
  {/* Stats Cards */}
  <div className="grid grid-cols-4 gap-6">
    <StatCard title="Tổng người dùng" value="15,234" />
    <StatCard title="Đang hoạt động" value="12,456" />
    <StatCard title="Không hoạt động" value="2,778" />
    <StatCard title="Mới 7 ngày" value="1,234" />
  </div>

  {/* Filters & Search */}
  <div className="bg-white rounded-xl p-6">
    <SearchInput placeholder="Tìm kiếm..." />
    <FilterDropdown options={roles} />
    <FilterDropdown options={statuses} />
    <FilterDropdown options={activities} />
    <Button>Thêm người dùng</Button>
    <Button>Xuất file</Button>
  </div>

  {/* Users Table */}
  <Table>
    <TableHeader>
      <TableRow>
        <TableCell>Người dùng</TableCell>
        <TableCell>Số điện thoại</TableCell>
        <TableCell>Vai trò</TableCell>
        <TableCell>Trạng thái</TableCell>
        <TableCell>Ngày tạo</TableCell>
        <TableCell>Đăng nhập</TableCell>
        <TableCell>Hành động</TableCell>
      </TableRow>
    </TableHeader>
    <TableBody>
      {users.map(user => (
        <TableRow key={user.id}>
          <TableCell>
            <Avatar />
            <div>
              <p>{user.name}</p>
              <p className="text-xs">{user.email}</p>
            </div>
          </TableCell>
          {/* ... other cells ... */}
          <TableCell>
            <ActionButtons>
              <ViewButton />
              <EditButton />
              <ResetPasswordButton />
              <DeleteButton />
            </ActionButtons>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>

  {/* Pagination */}
  <Pagination currentPage={1} totalPages={10} />

  {/* User Detail Sidebar */}
  {selectedUser && (
    <Sidebar>
      <ProfileHeader />
      <RoleSelector />
      <StatusSwitch />
      <StudentStats />
      <TeacherStats />
      <LoginHistory />
      <ActionButtons />
    </Sidebar>
  )}

  {/* Add User Modal */}
  {showAddModal && (
    <Modal>
      <AddUserForm />
    </Modal>
  )}
</UserManagementPage>
```

#### Props
```typescript
interface UserManagementPageProps {
  // No props, standalone page
}
```

#### State
```typescript
const [searchQuery, setSearchQuery] = useState('');
const [filterRole, setFilterRole] = useState('all');
const [filterStatus, setFilterStatus] = useState('all');
const [filterActivity, setFilterActivity] = useState('all');
const [selectedUser, setSelectedUser] = useState<User | null>(null);
const [showAddModal, setShowAddModal] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
```

---

## User Flows

### Flow 1: Admin xem danh sách người dùng

```
START
  ↓
Admin clicks "Quản lý người dùng" in sidebar
  ↓
System loads UserManagementPage
  ↓
System fetches user list from API
  ↓
Display users in table (page 1, 10 items)
  ↓
Display stats cards
  ↓
Admin can:
  ├─→ Search users
  ├─→ Filter by role/status/activity
  ├─→ View user detail
  ├─→ Edit user
  ├─→ Delete user
  ├─→ Add new user
  ├─→ Export data
  └─→ Navigate pages
  ↓
END
```

### Flow 2: Admin thêm người dùng mới

```
START
  ↓
Admin clicks "Thêm người dùng" button
  ↓
Show AddUserModal
  ↓
Admin fills form:
  - Name
  - Email
  - Phone
  - Password
  - Role
  - Status
  ↓
Admin clicks "Thêm người dùng"
  ↓
Frontend validation
  ├─→ If invalid: Show error, stay on form
  └─→ If valid: Continue
  ↓
Submit to API: POST /api/users
  ↓
Backend validation
  ├─→ If email exists: Return error 409
  ├─→ If invalid data: Return error 400
  └─→ If valid: Continue
  ↓
Hash password
  ↓
Create user record in database
  ↓
Generate welcome email
  ↓
Send email
  ↓
Return success response
  ↓
Frontend shows success notification
  ↓
Close modal
  ↓
Refresh user list
  ↓
END
```

### Flow 3: Admin xem chi tiết người dùng

```
START
  ↓
Admin clicks "View" button on user row
  ↓
System fetches user detail: GET /api/users/:id
  ↓
Open User Detail Sidebar (slide from right)
  ↓
Display:
  ├─→ Profile info (avatar, name, email, phone)
  ├─→ Role selector
  ├─→ Status switch
  ├─→ Learning/Teaching stats
  ├─→ Skills chart (if student)
  ├─→ Login history
  └─→ Recent activities
  ↓
Admin can:
  ├─→ Change role
  ├─→ Change status
  ├─→ Reset password
  ├─→ Ban user
  └─→ View full activity log
  ↓
Admin clicks "Lưu thay đổi"
  ↓
Update user: PATCH /api/users/:id
  ↓
Show success notification
  ↓
Refresh user list
  ↓
Close sidebar
  ↓
END
```

### Flow 4: Admin reset mật khẩu cho người dùng

```
START
  ↓
Admin clicks "Reset Password" icon
  ↓
Confirmation dialog:
  "Bạn có chắc muốn reset mật khẩu cho [User Name]?"
  [Hủy] [Xác nhận]
  ↓
If Cancel: Close dialog, END
  ↓
If Confirm: Continue
  ↓
API call: POST /api/users/:id/reset-password
  ↓
Backend:
  ├─→ Generate reset token (UUID)
  ├─→ Set expiry time (1 hour)
  ├─→ Save token to database
  ├─→ Generate reset link with token
  ├─→ Send email to user
  └─→ Return success
  ↓
Show notification: "Email reset mật khẩu đã được gửi"
  ↓
Log activity: "Admin reset password for User X"
  ↓
END

--- User side ---
User receives email
  ↓
User clicks reset link
  ↓
System validates token
  ├─→ If expired: Show error
  ├─→ If invalid: Show error
  └─→ If valid: Show reset form
  ↓
User enters new password (twice)
  ↓
Frontend validation
  ↓
Submit: POST /api/auth/reset-password
  ↓
Backend:
  ├─→ Validate token again
  ├─→ Validate password strength
  ├─→ Hash new password
  ├─→ Update user record
  ├─→ Delete reset token
  ├─→ Logout all sessions
  └─→ Send confirmation email
  ↓
Redirect to login page
  ↓
END
```

### Flow 5: Admin xóa người dùng

```
START
  ↓
Admin clicks "Delete" icon
  ↓
Confirmation dialog with warning:
  "Bạn có chắc muốn xóa người dùng này?
  
  Tên: [Name]
  Email: [Email]
  
  Hành động này sẽ:
  - Vô hiệu hóa tài khoản
  - Xóa tất cả sessions
  - Giữ lại data trong 30 ngày
  
  [Hủy] [Xóa]"
  ↓
If Cancel: Close dialog, END
  ↓
If Confirm: Continue
  ↓
API call: DELETE /api/users/:id
  ↓
Backend:
  ├─→ Set deleted_at = NOW()
  ├─→ Set status = 'deleted'
  ├─→ Revoke all JWT tokens
  ├─→ Delete all active sessions
  ├─→ Send notification email
  ├─→ Log activity
  └─→ Schedule hard delete after 30 days
  ↓
Frontend:
  ├─→ Show success notification
  ├─→ Remove user from table
  └─→ Refresh user list
  ↓
END
```

### Flow 6: Bulk actions - Send email to multiple users

```
START
  ↓
Admin selects multiple users (checkboxes)
  ↓
Bulk action bar appears:
  "[X] users selected"
  [Send Email] [Deactivate] [Export]
  ↓
Admin clicks "Send Email"
  ↓
Email composer modal opens:
  - To: [Selected users count] users
  - Subject: [Input]
  - Body: [Rich text editor]
  - Attachments: [Upload]
  ↓
Admin composes email
  ↓
Admin clicks "Send"
  ↓
Confirmation: "Send email to [X] users?"
  ↓
If confirm:
  ↓
API call: POST /api/users/bulk/send-email
  Body: {
    userIds: [...],
    subject: "...",
    body: "...",
    attachments: [...]
  }
  ↓
Backend:
  ├─→ Validate userIds
  ├─→ Loop through users
  ├─→ Send email to each (async queue)
  ├─→ Log each send
  └─→ Return summary
  ↓
Show progress bar or notification:
  "Đang gửi email... 5/10"
  ↓
When complete:
  "Đã gửi email thành công đến 10 người dùng"
  ↓
Close modal
  ↓
Deselect all users
  ↓
END
```

---

## Sequence Diagrams

### Diagram 1: Get User List

```
Actor: Admin
UI: UserManagementPage
API: Backend API
DB: Database

Admin -> UI: Navigate to User Management
UI -> UI: Show loading spinner
UI -> API: GET /api/users?page=1&limit=10
API -> DB: SELECT * FROM users WHERE deleted_at IS NULL LIMIT 10 OFFSET 0
DB -> API: Return user records
API -> API: Transform data (remove sensitive fields)
API -> UI: Return user list + metadata
UI -> UI: Update state with users
UI -> UI: Render table
UI -> Admin: Display user list

Admin -> UI: Apply filters (role=Student)
UI -> API: GET /api/users?page=1&limit=10&role=Student
API -> DB: SELECT * FROM users WHERE role='Student' AND deleted_at IS NULL LIMIT 10
DB -> API: Return filtered records
API -> UI: Return filtered list
UI -> Admin: Display filtered results

Admin -> UI: Search "John"
UI -> UI: Debounce 300ms
UI -> API: GET /api/users?page=1&limit=10&search=John
API -> DB: SELECT * FROM users WHERE (name LIKE '%John%' OR email LIKE '%John%') AND deleted_at IS NULL
DB -> API: Return search results
API -> UI: Return results
UI -> Admin: Display search results

Admin -> UI: Click page 2
UI -> API: GET /api/users?page=2&limit=10
API -> DB: SELECT * FROM users LIMIT 10 OFFSET 10
DB -> API: Return records
API -> UI: Return page 2 data
UI -> Admin: Display page 2
```

### Diagram 2: View User Detail

```
Actor: Admin
UI: UserManagementPage
Sidebar: UserDetailSidebar
API: Backend API
DB: Database

Admin -> UI: Click "View" button on user row
UI -> Sidebar: Open sidebar (slide animation)
Sidebar -> Sidebar: Show loading skeleton
Sidebar -> API: GET /api/users/:id/detail
API -> DB: SELECT * FROM users WHERE id=:id
DB -> API: Return user record
API -> DB: SELECT * FROM login_history WHERE user_id=:id ORDER BY created_at DESC LIMIT 10
DB -> API: Return login history
API -> DB: SELECT * FROM user_stats WHERE user_id=:id
DB -> API: Return stats
API -> DB: SELECT * FROM activities WHERE user_id=:id ORDER BY created_at DESC LIMIT 20
DB -> API: Return activities
API -> API: Aggregate all data
API -> Sidebar: Return complete user detail
Sidebar -> Sidebar: Update state
Sidebar -> Sidebar: Render profile, stats, charts
Sidebar -> Admin: Display full user detail

Admin -> Sidebar: Change role from Student to Teacher
Sidebar -> Sidebar: Show confirmation dialog
Admin -> Sidebar: Confirm change
Sidebar -> API: PATCH /api/users/:id
  Body: { role: "Teacher" }
API -> DB: UPDATE users SET role='Teacher' WHERE id=:id
DB -> API: Success
API -> DB: INSERT INTO activity_logs (user_id, action, details)
DB -> API: Success
API -> Sidebar: Return updated user
Sidebar -> Sidebar: Update UI
Sidebar -> Admin: Show success notification
```

### Diagram 3: Add New User

```
Actor: Admin
UI: UserManagementPage
Modal: AddUserModal
API: Backend API
DB: Database
EmailService: Email Service

Admin -> UI: Click "Thêm người dùng"
UI -> Modal: Open modal
Modal -> Admin: Display empty form

Admin -> Modal: Fill form:
  - Name: "Nguyen Van A"
  - Email: "nguyenvana@example.com"
  - Phone: "0901234567"
  - Password: "Password123"
  - Role: "Student"
  - Status: "Active"
Admin -> Modal: Click "Thêm người dùng"

Modal -> Modal: Frontend validation
  - Check required fields
  - Validate email format
  - Validate phone format
  - Check password strength
Modal -> Modal: All valid

Modal -> API: POST /api/users
  Body: {
    name: "Nguyen Van A",
    email: "nguyenvana@example.com",
    phone: "0901234567",
    password: "Password123",
    role: "Student",
    status: "Active"
  }

API -> DB: Check email uniqueness
  SELECT COUNT(*) FROM users WHERE email='nguyenvana@example.com'
DB -> API: Count = 0 (email available)

API -> API: Hash password using bcrypt
  hashedPassword = "$2b$10$..."

API -> DB: INSERT INTO users
  (name, email, phone, password, role, status, created_at)
  VALUES (...)
DB -> API: Return new user ID

API -> DB: INSERT INTO user_stats (user_id, ...)
DB -> API: Success

API -> EmailService: Send welcome email
  To: nguyenvana@example.com
  Subject: "Chào mừng đến với VSTEPRO"
  Body: "Tài khoản của bạn..."
EmailService -> API: Email queued

API -> DB: INSERT INTO activity_logs
  (admin_id, action, details, created_at)
  VALUES (:admin_id, 'Created user', {...}, NOW())
DB -> API: Success

API -> Modal: Return success response
  {
    success: true,
    user: {
      id: 123,
      name: "Nguyen Van A",
      email: "nguyenvana@example.com",
      ...
    }
  }

Modal -> Modal: Close modal
Modal -> UI: Trigger refresh
UI -> API: GET /api/users (refresh list)
API -> DB: SELECT...
DB -> API: Return updated list
API -> UI: Return users
UI -> Admin: Display updated list with new user
UI -> Admin: Show toast: "Thêm người dùng thành công"
```

### Diagram 4: Reset Password

```
Actor: Admin
UI: UserManagementPage
API: Backend API
DB: Database
EmailService: Email Service
--- Later ---
User: End User
ResetPage: Reset Password Page

Admin -> UI: Click "Reset Password" icon for user
UI -> UI: Show confirmation dialog
Admin -> UI: Confirm reset
UI -> API: POST /api/users/:id/reset-password

API -> API: Generate reset token
  token = generateUUID()
  expiresAt = NOW() + 1 hour

API -> DB: INSERT INTO password_reset_tokens
  (user_id, token, expires_at, created_at)
  VALUES (:id, :token, :expiresAt, NOW())
DB -> API: Success

API -> DB: SELECT email FROM users WHERE id=:id
DB -> API: Return user email

API -> EmailService: Send reset email
  To: user.email
  Subject: "Reset mật khẩu VSTEPRO"
  Body: "Click vào link: https://vstepro.com/reset-password?token=..."
EmailService -> API: Email sent

API -> DB: INSERT INTO activity_logs
  (admin_id, action, user_id, created_at)
  VALUES (:admin_id, 'Reset password initiated', :user_id, NOW())
DB -> API: Success

API -> UI: Return success
UI -> Admin: Show notification "Email đã được gửi"

--- Later, User side ---
User -> EmailService: Check email
EmailService -> User: Display reset email
User -> ResetPage: Click reset link with token
ResetPage -> API: GET /api/auth/validate-reset-token?token=...
API -> DB: SELECT * FROM password_reset_tokens 
  WHERE token=:token AND expires_at > NOW() AND used_at IS NULL
DB -> API: Return token record if valid
API -> ResetPage: Return { valid: true }
ResetPage -> User: Show reset form

User -> ResetPage: Enter new password (twice)
User -> ResetPage: Submit form
ResetPage -> ResetPage: Validate password match
ResetPage -> API: POST /api/auth/reset-password
  Body: {
    token: "...",
    newPassword: "NewPass123"
  }

API -> DB: Validate token again
  SELECT user_id FROM password_reset_tokens 
  WHERE token=:token AND expires_at > NOW() AND used_at IS NULL
DB -> API: Return user_id

API -> API: Hash new password
  hashedPassword = bcrypt.hash(newPassword)

API -> DB: UPDATE users SET password=:hashedPassword WHERE id=:user_id
DB -> API: Success

API -> DB: UPDATE password_reset_tokens SET used_at=NOW() WHERE token=:token
DB -> API: Success

API -> DB: DELETE FROM sessions WHERE user_id=:user_id (logout all)
DB -> API: Success

API -> EmailService: Send confirmation email
  "Mật khẩu đã được thay đổi thành công"
EmailService -> API: Sent

API -> ResetPage: Return success
ResetPage -> User: Show success message
ResetPage -> User: Redirect to login page after 3 seconds
```

### Diagram 5: Delete User (Soft Delete)

```
Actor: Admin
UI: UserManagementPage
API: Backend API
DB: Database
EmailService: Email Service

Admin -> UI: Click "Delete" icon for user
UI -> UI: Show confirmation dialog with warning
Admin -> UI: Confirm deletion

UI -> API: DELETE /api/users/:id

API -> DB: SELECT * FROM users WHERE id=:id
DB -> API: Return user record

API -> DB: UPDATE users 
  SET deleted_at=NOW(), status='deleted', updated_at=NOW()
  WHERE id=:id
DB -> API: Success

API -> DB: DELETE FROM sessions WHERE user_id=:id
DB -> API: Deleted N sessions

API -> DB: INSERT INTO activity_logs
  (admin_id, action, user_id, details, created_at)
  VALUES (:admin_id, 'Deleted user', :id, {...}, NOW())
DB -> API: Success

API -> EmailService: Send notification to user
  To: user.email
  Subject: "Tài khoản của bạn đã bị vô hiệu hóa"
  Body: "Tài khoản... Liên hệ support@vstepro.com..."
EmailService -> API: Queued

API -> DB: Schedule hard delete job
  INSERT INTO scheduled_jobs
  (job_type, entity_id, scheduled_at)
  VALUES ('hard_delete_user', :id, NOW() + INTERVAL '30 days')
DB -> API: Success

API -> UI: Return success
  {
    success: true,
    message: "User deleted successfully"
  }

UI -> UI: Remove user from table
UI -> Admin: Show notification "Đã xóa người dùng"
UI -> API: Refresh user list
```

---

## Database Design

### Table: users

```sql
CREATE TABLE users (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Info
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL, -- bcrypt hashed
  avatar VARCHAR(500), -- URL to avatar image
  bio TEXT,
  
  -- Role & Status
  role VARCHAR(20) NOT NULL DEFAULT 'Student', 
    -- ENUM: 'Student', 'Teacher', 'Admin'
  status VARCHAR(20) NOT NULL DEFAULT 'active',
    -- ENUM: 'active', 'inactive', 'banned', 'deleted'
  
  -- Authentication
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP,
  last_login_at TIMESTAMP,
  last_login_ip VARCHAR(45), -- Support IPv6
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP, -- Soft delete
  
  -- Indexes
  INDEX idx_users_email (email),
  INDEX idx_users_role (role),
  INDEX idx_users_status (status),
  INDEX idx_users_deleted_at (deleted_at),
  INDEX idx_users_created_at (created_at)
);
```

### Table: user_profiles

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Additional Info
  date_of_birth DATE,
  gender VARCHAR(10), -- 'male', 'female', 'other'
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Vietnam',
  
  -- Preferences
  language VARCHAR(10) DEFAULT 'vi', -- 'vi', 'en'
  timezone VARCHAR(50) DEFAULT 'Asia/Ho_Chi_Minh',
  notification_email BOOLEAN DEFAULT TRUE,
  notification_push BOOLEAN DEFAULT TRUE,
  notification_sms BOOLEAN DEFAULT FALSE,
  
  -- Social Links
  facebook_url VARCHAR(255),
  linkedin_url VARCHAR(255),
  twitter_url VARCHAR(255),
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  UNIQUE (user_id)
);
```

### Table: roles

```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE, -- 'Student', 'Teacher', 'Admin'
  display_name VARCHAR(100) NOT NULL, -- 'Học viên', 'Giáo viên', 'Quản trị'
  description TEXT,
  permissions JSONB, -- Array of permission strings
  
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Default roles
INSERT INTO roles (name, display_name, description, permissions) VALUES
('Student', 'Học viên', 'Người học', 
  '["practice.access", "exam.take", "profile.edit"]'),
('Teacher', 'Giáo viên', 'Giáo viên hướng dẫn',
  '["practice.access", "class.manage", "student.view", "exam.create"]'),
('Admin', 'Quản trị viên', 'Quản trị hệ thống',
  '["*"]'); -- Full access
```

### Table: permissions

```sql
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE, -- 'practice.access', 'user.create'
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  module VARCHAR(50), -- 'practice', 'user', 'exam'
  
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Sample permissions
INSERT INTO permissions (name, display_name, module) VALUES
('practice.access', 'Truy cập luyện tập', 'practice'),
('practice.submit', 'Nộp bài tập', 'practice'),
('exam.take', 'Làm bài thi', 'exam'),
('exam.create', 'Tạo đề thi', 'exam'),
('user.create', 'Tạo người dùng', 'user'),
('user.edit', 'Sửa người dùng', 'user'),
('user.delete', 'Xóa người dùng', 'user'),
('user.view', 'Xem người dùng', 'user'),
('class.manage', 'Quản lý lớp học', 'class'),
('student.view', 'Xem học viên', 'student');
```

### Table: user_stats

```sql
CREATE TABLE user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Overall Stats
  total_tests INTEGER DEFAULT 0,
  total_study_time INTEGER DEFAULT 0, -- in minutes
  streak_days INTEGER DEFAULT 0, -- consecutive days
  longest_streak INTEGER DEFAULT 0,
  last_practice_date DATE,
  
  -- Skill Scores (0-10 scale)
  reading_score DECIMAL(3,1) DEFAULT 0,
  listening_score DECIMAL(3,1) DEFAULT 0,
  writing_score DECIMAL(3,1) DEFAULT 0,
  speaking_score DECIMAL(3,1) DEFAULT 0,
  average_score DECIMAL(3,1) DEFAULT 0,
  
  -- Activity
  total_reading_tests INTEGER DEFAULT 0,
  total_listening_tests INTEGER DEFAULT 0,
  total_writing_tests INTEGER DEFAULT 0,
  total_speaking_tests INTEGER DEFAULT 0,
  
  -- Achievements
  badges_earned INTEGER DEFAULT 0,
  goals_completed INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1, -- User level (1-100)
  experience_points INTEGER DEFAULT 0, -- XP for leveling
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  UNIQUE (user_id)
);
```

### Table: login_history

```sql
CREATE TABLE login_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Login Details
  ip_address VARCHAR(45) NOT NULL,
  user_agent TEXT,
  device VARCHAR(50), -- 'Chrome - Windows', 'Mobile App - iOS'
  location VARCHAR(100), -- City, Country (from IP)
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Status
  status VARCHAR(20) NOT NULL, -- 'success', 'failed'
  failure_reason VARCHAR(255), -- If failed
  
  -- Session
  session_id UUID,
  
  -- Timestamp
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  INDEX idx_login_history_user_id (user_id),
  INDEX idx_login_history_created_at (created_at),
  INDEX idx_login_history_status (status)
);
```

### Table: activity_logs

```sql
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Who performed the action
  actor_id UUID REFERENCES users(id), -- NULL for system actions
  actor_type VARCHAR(20), -- 'User', 'System', 'API'
  
  -- What action
  action VARCHAR(100) NOT NULL, -- 'Created user', 'Updated profile'
  entity_type VARCHAR(50), -- 'User', 'Exam', 'Class'
  entity_id UUID, -- ID of affected entity
  
  -- Details
  description TEXT,
  old_values JSONB, -- Before change
  new_values JSONB, -- After change
  
  -- Context
  ip_address VARCHAR(45),
  user_agent TEXT,
  
  -- Timestamp
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  INDEX idx_activity_logs_actor_id (actor_id),
  INDEX idx_activity_logs_entity_type_id (entity_type, entity_id),
  INDEX idx_activity_logs_created_at (created_at),
  INDEX idx_activity_logs_action (action)
);
```

### Table: password_reset_tokens

```sql
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Token
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  
  -- Usage
  used_at TIMESTAMP,
  used_ip VARCHAR(45),
  
  -- Created
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  INDEX idx_reset_tokens_token (token),
  INDEX idx_reset_tokens_user_id (user_id),
  INDEX idx_reset_tokens_expires_at (expires_at)
);
```

### Table: sessions

```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Token
  token VARCHAR(500) NOT NULL UNIQUE, -- JWT token
  refresh_token VARCHAR(500) UNIQUE,
  
  -- Device Info
  ip_address VARCHAR(45),
  user_agent TEXT,
  device VARCHAR(100),
  
  -- Expiry
  expires_at TIMESTAMP NOT NULL,
  refresh_expires_at TIMESTAMP,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  revoked_at TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_activity_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_sessions_user_id (user_id),
  INDEX idx_sessions_token (token),
  INDEX idx_sessions_expires_at (expires_at)
);
```

---

## API Endpoints

### Base URL
```
https://api.vstepro.com/v1
```

### Authentication
All endpoints require Bearer token except public endpoints.
```
Authorization: Bearer <JWT_TOKEN>
```

---

### 1. Get User List

**Endpoint**: `GET /api/users`

**Permission**: `user.view` (Admin, Teacher for their students)

**Query Parameters**:
```typescript
interface GetUsersQuery {
  page?: number; // Default: 1
  limit?: number; // Default: 10, Max: 100
  search?: string; // Search in name, email, phone
  role?: 'Student' | 'Teacher' | 'Admin' | 'all'; // Default: 'all'
  status?: 'active' | 'inactive' | 'banned' | 'all'; // Default: 'all'
  activity?: 'all' | '7days' | '30days'; // Default: 'all'
  sortBy?: 'created_at' | 'last_login_at' | 'name'; // Default: 'created_at'
  sortOrder?: 'asc' | 'desc'; // Default: 'desc'
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "name": "Nguyễn Văn A",
        "email": "nguyenvana@example.com",
        "phone": "0901234567",
        "avatar": "https://cdn.vstepro.com/avatars/123.jpg",
        "role": "Student",
        "status": "active",
        "created_at": "2024-01-15T10:30:00Z",
        "last_login_at": "2024-12-11T14:20:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 15234,
      "totalPages": 1524
    },
    "stats": {
      "total": 15234,
      "active": 12456,
      "inactive": 2778,
      "banned": 0,
      "newThisWeek": 1234
    }
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: Insufficient permissions
- `422 Unprocessable Entity`: Invalid query parameters

---

### 2. Get User Detail

**Endpoint**: `GET /api/users/:id`

**Permission**: `user.view` (Admin, Teacher for their students, User for self)

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "Nguyễn Văn A",
      "email": "nguyenvana@example.com",
      "phone": "0901234567",
      "avatar": "https://...",
      "bio": "Học viên chăm chỉ",
      "role": "Student",
      "status": "active",
      "email_verified": true,
      "created_at": "2024-01-15T10:30:00Z",
      "last_login_at": "2024-12-11T14:20:00Z"
    },
    "profile": {
      "date_of_birth": "2000-01-01",
      "gender": "male",
      "address": "123 Nguyễn Huệ, Q1",
      "city": "Hồ Chí Minh",
      "language": "vi",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    "stats": {
      "total_tests": 45,
      "total_study_time": 1250,
      "streak_days": 15,
      "average_score": 7.2,
      "skills": {
        "reading": 7.5,
        "listening": 6.8,
        "writing": 7.2,
        "speaking": 6.5
      },
      "badges_earned": 12,
      "goals_completed": 8,
      "level": 15,
      "experience_points": 3450
    },
    "login_history": [
      {
        "date": "2024-12-11T14:20:00Z",
        "ip_address": "192.168.1.1",
        "device": "Chrome - Windows",
        "location": "Ho Chi Minh City, Vietnam",
        "status": "success"
      }
    ],
    "recent_activities": [
      {
        "id": "uuid",
        "action": "Completed Reading test",
        "details": "VSTEP Reading B2 - Score: 8.0",
        "created_at": "2024-12-11T10:00:00Z"
      }
    ]
  }
}
```

**Error Responses**:
- `404 Not Found`: User not found
- `403 Forbidden`: Cannot view this user

---

### 3. Create User

**Endpoint**: `POST /api/users`

**Permission**: `user.create` (Admin only)

**Request Body**:
```json
{
  "name": "Nguyễn Văn A",
  "email": "nguyenvana@example.com",
  "phone": "0901234567",
  "password": "Password123",
  "role": "Student",
  "status": "active",
  "avatar": "https://..." // Optional
}
```

**Validation Rules**:
```typescript
{
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-ZÀ-ỹ\s]+$/ // Letters and spaces only
  },
  email: {
    required: true,
    format: 'email',
    unique: true
  },
  phone: {
    required: true,
    pattern: /^[0-9]{10,11}$/
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/ // At least 1 lowercase, 1 uppercase, 1 number
  },
  role: {
    required: true,
    enum: ['Student', 'Teacher', 'Admin']
  },
  status: {
    required: false,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}
```

**Response**:
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Nguyễn Văn A",
      "email": "nguyenvana@example.com",
      "role": "Student",
      "status": "active",
      "created_at": "2024-12-11T15:00:00Z"
    }
  }
}
```

**Error Responses**:
- `400 Bad Request`: Validation errors
- `409 Conflict`: Email already exists
- `403 Forbidden`: Insufficient permissions

**Example Error Response**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": "Email already exists",
      "password": "Password must contain at least one uppercase letter"
    }
  }
}
```

---

### 4. Update User

**Endpoint**: `PATCH /api/users/:id`

**Permission**: `user.edit` (Admin for all, User for self - limited fields)

**Request Body** (Admin):
```json
{
  "name": "Nguyễn Văn B",
  "phone": "0907654321",
  "role": "Teacher",
  "status": "inactive",
  "bio": "Updated bio"
}
```

**Request Body** (User - self edit):
```json
{
  "name": "Nguyễn Văn B",
  "phone": "0907654321",
  "bio": "Updated bio",
  "avatar": "https://..."
}
```

**Non-editable fields** (even for Admin):
- `id`
- `email` (requires separate verification flow)
- `password` (use separate endpoint)
- `created_at`

**Response**:
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Nguyễn Văn B",
      "email": "nguyenvana@example.com",
      "phone": "0907654321",
      "role": "Teacher",
      "status": "inactive",
      "updated_at": "2024-12-11T15:30:00Z"
    }
  }
}
```

**Error Responses**:
- `404 Not Found`: User not found
- `400 Bad Request`: Validation errors
- `403 Forbidden`: Cannot edit this user or field

---

### 5. Delete User

**Endpoint**: `DELETE /api/users/:id`

**Permission**: `user.delete` (Admin only)

**Query Parameters**:
```typescript
interface DeleteUserQuery {
  hard?: boolean; // true = permanent delete, false = soft delete (default)
}
```

**Response**:
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {
    "deleted_at": "2024-12-11T16:00:00Z",
    "restore_before": "2025-01-10T16:00:00Z" // 30 days from now
  }
}
```

**Error Responses**:
- `404 Not Found`: User not found
- `403 Forbidden`: Cannot delete this user
- `409 Conflict`: User has active classes/exams

---

### 6. Reset Password (Admin-initiated)

**Endpoint**: `POST /api/users/:id/reset-password`

**Permission**: `user.edit` (Admin only)

**Request Body**: (Empty or optional message)
```json
{
  "message": "Your password has been reset by admin"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Password reset email sent",
  "data": {
    "email_sent_to": "nguyenvana@example.com",
    "expires_at": "2024-12-11T17:00:00Z" // Token expires in 1 hour
  }
}
```

---

### 7. Bulk Send Email

**Endpoint**: `POST /api/users/bulk/send-email`

**Permission**: `user.email` (Admin only)

**Request Body**:
```json
{
  "user_ids": ["uuid1", "uuid2", "uuid3"],
  "subject": "Important Announcement",
  "body": "Dear students...",
  "body_html": "<p>Dear students...</p>",
  "attachments": [
    {
      "filename": "document.pdf",
      "url": "https://cdn.vstepro.com/files/doc.pdf"
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "message": "Emails queued successfully",
  "data": {
    "total_recipients": 3,
    "queued": 3,
    "failed": 0,
    "estimated_time": "2 minutes"
  }
}
```

---

### 8. Bulk Update Users

**Endpoint**: `PATCH /api/users/bulk`

**Permission**: `user.edit` (Admin only)

**Request Body**:
```json
{
  "user_ids": ["uuid1", "uuid2"],
  "updates": {
    "status": "inactive",
    "role": "Student"
  }
}
```

**Response**:
```json
{
  "success": true,
  "message": "Users updated successfully",
  "data": {
    "updated": 2,
    "failed": 0
  }
}
```

---

### 9. Export Users

**Endpoint**: `GET /api/users/export`

**Permission**: `user.export` (Admin only)

**Query Parameters**:
```typescript
interface ExportUsersQuery {
  format?: 'csv' | 'excel' | 'pdf'; // Default: 'csv'
  fields?: string[]; // ['id', 'name', 'email', 'role']
  filters?: {
    role?: string;
    status?: string;
    created_after?: Date;
    created_before?: Date;
  };
}
```

**Response**: File download

**Headers**:
```
Content-Type: text/csv
Content-Disposition: attachment; filename="users_2024-12-11.csv"
```

---

### 10. Get User Stats

**Endpoint**: `GET /api/users/:id/stats`

**Permission**: `user.view`

**Response**:
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_tests": 45,
      "total_study_time": 1250,
      "average_score": 7.2,
      "streak_days": 15,
      "level": 15,
      "experience_points": 3450
    },
    "skills": {
      "reading": {
        "score": 7.5,
        "tests_taken": 12,
        "best_score": 9.0,
        "improvement": "+0.5"
      },
      "listening": {
        "score": 6.8,
        "tests_taken": 10,
        "best_score": 8.5,
        "improvement": "+0.3"
      },
      "writing": {
        "score": 7.2,
        "tests_taken": 15,
        "best_score": 8.0,
        "improvement": "+0.8"
      },
      "speaking": {
        "score": 6.5,
        "tests_taken": 8,
        "best_score": 7.5,
        "improvement": "+0.2"
      }
    },
    "achievements": {
      "badges_earned": 12,
      "goals_completed": 8,
      "certificates": 2
    },
    "study_pattern": {
      "most_active_day": "Monday",
      "most_active_hour": 20,
      "average_session_duration": 45
    }
  }
}
```

---

## Summary

Module User Management cung cấp:
- **10 API endpoints** đầy đủ cho CRUD và các operations
- **8 database tables** với quan hệ rõ ràng
- **5 user flows** chi tiết cho các tác vụ chính
- **5 sequence diagrams** mô tả interaction giữa các components
- **Full validation** và error handling
- **Audit trail** với activity logs
- **Security features**: Soft delete, password reset, session management

**Ngày tạo**: 2024-12-11  
**Phiên bản**: 1.0

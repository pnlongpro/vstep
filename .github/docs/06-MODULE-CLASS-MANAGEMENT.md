# 🏫 Module 06: Class Management

> **Module quản lý lớp học cho giáo viên và học viên**
> 
> File: `06-MODULE-CLASS-MANAGEMENT.md`  
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
- [8. Business Rules](#8-business-rules)

---

## 1. Giới thiệu module

### 1.1. Mục đích
Module Class Management cho phép:
- **Giáo viên**: Tạo và quản lý lớp học, mời học viên, quản lý nội dung lớp
- **Học viên**: Tham gia lớp học, xem tài liệu, làm bài tập được giao
- **Admin**: Giám sát và quản lý tất cả lớp học trong hệ thống

### 1.2. Vai trò sử dụng

**Teacher (Giáo viên)**:
- Tạo lớp học mới
- Chỉnh sửa thông tin lớp học
- Mời học viên vào lớp (qua email hoặc class code)
- Xem danh sách học viên
- Xóa học viên khỏi lớp
- Đóng/Mở lớp học
- Xóa lớp học
- Upload tài liệu lớp
- Giao bài tập
- Quản lý lịch học (Module 15)
- Điểm danh (Module 14)
- Gửi thông báo cho lớp

**Student (Học viên)**:
- Xem danh sách lớp đã tham gia
- Tham gia lớp qua class code
- Xem thông tin lớp
- Xem tài liệu lớp
- Xem bài tập được giao
- Xem lịch học
- Rời khỏi lớp

**Admin**:
- Xem tất cả lớp học
- Xóa lớp học
- Quản lý giáo viên của lớp
- Xem báo cáo lớp học

### 1.3. Phạm vi module
- Tạo/Sửa/Xóa lớp học
- Quản lý thành viên lớp
- Chia sẻ tài liệu lớp
- Giao bài tập (liên kết Module 07)
- Quản lý lịch học (liên kết Module 15)
- Điểm danh (liên kết Module 14)
- Tin nhắn lớp học (liên kết Module 21)

---

## 2. Danh sách chức năng

### 2.1. Chức năng chính - Teacher

#### A. Tạo lớp học mới (Create Class)

**Mô tả**: Giáo viên tạo một lớp học mới

**Input**:
- Class name (required) - Tên lớp học
- Description (optional) - Mô tả lớp
- Level (required) - Cấp độ VSTEP (A2, B1, B2, C1)
- Start date (required) - Ngày bắt đầu
- End date (optional) - Ngày kết thúc
- Schedule (optional) - Lịch học (VD: Thứ 2, 4, 6 - 19:00-21:00)
- Room (optional) - Phòng học (VD: A201, Online)
- Max students (optional) - Số lượng học viên tối đa
- Class code (auto-generated) - Mã lớp tự động
- Cover image (optional) - Ảnh bìa lớp

**Output**:
- Class created successfully
- Class code được tạo (6 ký tự unique)
- Redirect to Class Detail Page

**Business Logic**:
1. Validate input fields
2. Generate unique class code (6 characters, alphanumeric)
3. Set teacher_id = current user_id
4. Set status = 'active'
5. Create class record in database
6. Create default announcement: "Chào mừng đến với lớp {className}!"
7. Create notification for teacher
8. Return success + class_id

**Error Handling**:
- Duplicate class name (for same teacher) → Warning: "Bạn đã có lớp tên này"
- Invalid level → "Vui lòng chọn cấp độ hợp lệ"
- Start date in past → "Ngày bắt đầu phải từ hôm nay trở đi"
- End date < start date → "Ngày kết thúc phải sau ngày bắt đầu"

---

#### B. Chỉnh sửa lớp học (Edit Class)

**Mô tả**: Giáo viên cập nhật thông tin lớp học

**Input**:
- Class ID (required)
- Các trường giống Create Class (có thể sửa hết trừ class_code)

**Output**:
- Class updated successfully
- Updated info displayed

**Business Logic**:
1. Check user is teacher of this class
2. Validate input fields
3. Update class record
4. Create notification if có thay đổi quan trọng (lịch học, phòng học)
5. Return success

**Constraints**:
- Chỉ teacher của lớp mới được sửa
- Không thể sửa class_code
- Không thể giảm max_students xuống dưới số học viên hiện tại

---

#### C. Xóa lớp học (Delete Class)

**Mô tả**: Giáo viên xóa lớp học (soft delete)

**Input**:
- Class ID (required)
- Confirmation (required)

**Output**:
- Class deleted (soft delete)
- Redirect to My Classes list

**Business Logic**:
1. Check user is teacher of this class
2. Check class có học viên → Show warning
3. Soft delete class (set deleted_at = NOW())
4. Keep all related data (students, materials, assignments)
5. Send notification to all students
6. Log deletion action
7. Return success

**Warning**:
- "Lớp này có X học viên. Bạn có chắc muốn xóa?"
- "Tất cả dữ liệu lớp sẽ bị xóa và không thể khôi phục"

---

#### D. Mời học viên vào lớp (Invite Students)

**Mô tả**: Giáo viên mời học viên tham gia lớp

**Phương thức**:

**1. Mời qua Email**:
- Input: Danh sách emails (comma separated)
- Validate email format
- Send invitation emails với class code
- Create pending_invitations records
- Return success

**2. Mời qua Class Code**:
- Share class code với học viên
- Học viên tự join bằng code
- No email needed

**3. Mời qua Link**:
- Generate invitation link: `/join-class?code={classCode}`
- Share link
- Anyone with link can join

**Output**:
- Invitations sent
- Pending invitations count

**Business Logic** (Email Invitation):
1. Parse và validate emails
2. Check each email:
   - User exists → Create invitation
   - User not exists → Send invitation to register
3. Send invitation emails
4. Create pending_invitations records
5. Return success + count

**Email Template**:
```
Subject: Bạn được mời tham gia lớp học VSTEPRO

Xin chào,

Giáo viên {teacherName} đã mời bạn tham gia lớp học:
📚 Lớp: {className}
📊 Cấp độ: {level}
📅 Bắt đầu: {startDate}

Mã lớp: {classCode}

Nhấn vào đây để tham gia: {invitationLink}

Hoặc nhập mã lớp trên VSTEPRO.

Trân trọng,
VSTEPRO Team
```

---

#### E. Quản lý học viên trong lớp (Manage Students)

**Chức năng**:

**1. Xem danh sách học viên**:
- Hiển thị table với columns:
  - Avatar + Full Name
  - Email
  - Ngày tham gia
  - Số bài tập đã làm
  - Điểm trung bình
  - Tỷ lệ điểm danh
  - Actions (Xem chi tiết, Xóa)
- Search students
- Filter by status
- Sort by name, join date, performance

**2. Xem chi tiết học viên**:
- Thông tin cá nhân
- Lịch sử làm bài tập
- Lịch sử điểm danh
- Tiến độ học tập
- Thống kê chi tiết

**3. Xóa học viên khỏi lớp**:
- Confirmation required
- Soft delete: Set class_students.removed_at
- Send notification to student
- Keep history for reporting

**Input**:
- Class ID (from context)
- Student ID (to remove)
- Reason (optional)

**Output**:
- Student removed
- Notification sent

**Business Logic** (Remove Student):
1. Check user is teacher of class
2. Confirm action
3. Set class_students.removed_at = NOW()
4. Set class_students.removal_reason
5. Send notification to student
6. Log action
7. Return success

---

#### F. Upload tài liệu lớp (Upload Class Materials)

**Mô tả**: Giáo viên upload tài liệu để chia sẻ với lớp

**Input**:
- File(s) (required) - PDF, DOCX, PPTX, MP3, MP4
- Title (required) - Tên tài liệu
- Description (optional) - Mô tả
- Category (optional) - Phân loại (Reading, Listening, Writing, Speaking, Grammar, Vocabulary, Other)
- Tags (optional) - Tags để tìm kiếm

**Output**:
- File(s) uploaded successfully
- Materials added to class
- Notification sent to students

**Business Logic**:
1. Validate file type và size (max 100MB per file)
2. Upload to file storage (S3/Cloudflare R2)
3. Create class_materials record
4. Generate shareable link
5. Send notification to all students in class
6. Return success + material_id

**Supported File Types**:
- Documents: PDF, DOCX, DOC, PPTX, PPT
- Audio: MP3, M4A, WAV
- Video: MP4, AVI, MOV
- Images: JPG, PNG, GIF
- Archives: ZIP, RAR

**File Size Limits**:
- Documents: 50MB
- Audio: 100MB
- Video: 500MB
- Images: 10MB
- Archives: 200MB

---

### 2.2. Chức năng chính - Student

#### A. Tham gia lớp học (Join Class)

**Mô tả**: Học viên tham gia lớp bằng class code

**Input**:
- Class code (required) - 6 characters

**Output**:
- Joined class successfully
- Redirect to Class Detail Page

**Business Logic**:
1. Validate class code format (6 alphanumeric)
2. Find class by code
3. Check class exists → else "Mã lớp không tồn tại"
4. Check class status = 'active' → else "Lớp đã đóng"
5. Check student chưa in class → else "Bạn đã tham gia lớp này"
6. Check max_students limit → else "Lớp đã đầy"
7. Add student to class_students
8. Send notification to teacher: "X đã tham gia lớp"
9. Send welcome notification to student
10. Return success + class_id

**Error Codes**:
- `CLASS_NOT_FOUND`: Mã lớp không tồn tại
- `CLASS_CLOSED`: Lớp đã đóng, không nhận học viên mới
- `ALREADY_JOINED`: Bạn đã là thành viên của lớp
- `CLASS_FULL`: Lớp đã đạt số lượng học viên tối đa

---

#### B. Rời khỏi lớp (Leave Class)

**Mô tả**: Học viên rời khỏi lớp

**Input**:
- Class ID (required)
- Confirmation (required)

**Output**:
- Left class successfully
- Redirect to My Courses

**Business Logic**:
1. Check user is member of class
2. Confirm action
3. Set class_students.left_at = NOW()
4. Send notification to teacher
5. Return success

**Warning**:
- "Bạn có chắc muốn rời khỏi lớp? Bạn sẽ không thể xem tài liệu và làm bài tập của lớp."

---

#### C. Xem lớp học (View Class)

**Mô tả**: Học viên xem thông tin và nội dung lớp

**Tabs trong Class Detail Page**:

**1. Tab Overview** (Tổng quan):
- Thông tin lớp (tên, mô tả, level, lịch học, phòng học)
- Teacher info
- Class stats (số học viên, số bài tập, số tài liệu)
- Recent announcements
- Upcoming schedule

**2. Tab Materials** (Tài liệu):
- Danh sách tài liệu do teacher upload
- Filter by category
- Search materials
- Download files

**3. Tab Assignments** (Bài tập):
- Danh sách bài tập được giao
- Status: Not started, In progress, Submitted
- Due dates
- Scores (nếu đã chấm)

**4. Tab Schedule** (Lịch học):
- Calendar view hoặc List view
- Upcoming classes
- Past classes
- Attendance status

---

### 2.3. Chức năng phụ

#### A. Class Code Management
- Auto-generate unique 6-character code
- Regenerate code (nếu teacher muốn)
- Copy code to clipboard

#### B. Class Statistics
- Total students
- Active students (joined in last 30 days)
- Average attendance rate
- Average assignment completion rate
- Average score

#### C. Class Announcements
- Teacher post announcements
- Pin important announcements
- Students receive notifications

#### D. Class Settings
- Cho phép/Không cho phép join bằng code
- Require approval để join
- Enable/Disable features (materials, assignments, schedule)

---

### 2.4. Quyền sử dụng

| Chức năng | Student | Teacher | Admin |
|-----------|---------|---------|-------|
| **Teacher Actions** | | | |
| Create Class | ❌ | ✅ | ✅ |
| Edit Class | ❌ | ✅ (own) | ✅ (all) |
| Delete Class | ❌ | ✅ (own) | ✅ (all) |
| Invite Students | ❌ | ✅ (own) | ✅ (all) |
| Remove Students | ❌ | ✅ (own) | ✅ (all) |
| Upload Materials | ❌ | ✅ (own) | ✅ (all) |
| Create Assignments | ❌ | ✅ (own) | ✅ (all) |
| Manage Schedule | ❌ | ✅ (own) | ✅ (all) |
| Take Attendance | ❌ | ✅ (own) | ✅ (all) |
| **Student Actions** | | | |
| Join Class | ✅ | ✅ | ✅ |
| Leave Class | ✅ | ❌ | ✅ |
| View Class Info | ✅ (joined) | ✅ (own) | ✅ (all) |
| View Materials | ✅ (joined) | ✅ (own) | ✅ (all) |
| View Assignments | ✅ (joined) | ✅ (own) | ✅ (all) |
| View Schedule | ✅ (joined) | ✅ (own) | ✅ (all) |
| **Admin Actions** | | | |
| View All Classes | ❌ | ❌ | ✅ |
| Manage All Classes | ❌ | ❌ | ✅ |
| View Reports | ❌ | ✅ (own) | ✅ (all) |

---

## 3. Phân tích màn hình UI

### 3.1. Teacher - Class Management Page

**File Component**: `/components/teacher/ClassManagementTeacherPage.tsx`

#### Tên màn hình
**Class Management Page / Quản lý lớp học**

#### Mục đích
Hiển thị danh sách tất cả lớp học do giáo viên tạo và quản lý

#### Các thành phần UI

**Header Section**:
- Page title: "Quản lý lớp học"
- Stats cards (4 cards):
  - Total classes
  - Active classes
  - Total students (across all classes)
  - This month's classes
- Button: "Tạo lớp mới" (+ icon, purple-600)

**Filter & Search Section**:
- Search bar: "Tìm kiếm lớp học..."
- Filter dropdown:
  - All classes
  - Active
  - Completed
  - Upcoming
- Sort dropdown:
  - Newest first
  - Oldest first
  - Most students
  - Name A-Z

**Classes Grid/List**:
- View toggle: Grid view / List view
- **Grid view** (default): 3 columns
  - Each class card:
    - Cover image (hoặc placeholder với first letter)
    - Class name (h3)
    - Level badge (A2/B1/B2/C1)
    - Status badge (Active/Completed/Upcoming)
    - Teacher name + avatar (nếu có co-teacher)
    - Stats:
      - 👥 X students
      - 📝 Y assignments
      - 📅 Z sessions
    - Class code: `ABC123` (with copy button)
    - Action buttons:
      - "Xem chi tiết" (primary)
      - More menu (•••):
        - Edit class
        - Manage students
        - Upload materials
        - Take attendance
        - View reports
        - Archive class
        - Delete class

- **List view**: Table format
  - Columns:
    - Class Name + Level
    - Students Count
    - Start Date - End Date
    - Status
    - Last Activity
    - Actions

**Empty State** (no classes):
- Icon: School building
- Title: "Chưa có lớp học nào"
- Message: "Tạo lớp học đầu tiên để bắt đầu quản lý học viên"
- Button: "Tạo lớp học đầu tiên"

#### Chức năng

1. **Display Classes**:
   - Fetch classes của teacher
   - Group by status
   - Show stats

2. **Search & Filter**:
   - Real-time search
   - Filter by status
   - Sort by criteria

3. **Create Class**:
   - Click "Tạo lớp mới"
   - Open Create Class Modal
   - Fill form
   - Submit
   - Refresh list

4. **View Class Detail**:
   - Click "Xem chi tiết"
   - Navigate to Class Detail Page

5. **Quick Actions**:
   - Edit: Open Edit Modal
   - Manage students: Go to Students tab
   - Upload materials: Open Upload Modal
   - Take attendance: Go to Attendance Page
   - Delete: Confirm → Delete → Refresh

#### Luồng xử lý chính

```
Teacher arrives at Class Management Page
  ↓
Fetch teacher's classes from API
  ↓
Display classes in grid/list view
  ↓
Show stats cards
  ↓
[User Actions]
  ├─ Click "Tạo lớp mới"
  │   ├─ Open Create Class Modal
  │   ├─ Fill form
  │   ├─ Submit → API
  │   ├─ Success → Close modal
  │   └─ Refresh classes list
  │
  ├─ Search/Filter classes
  │   ├─ Update display
  │   └─ No API call (client-side)
  │
  ├─ Click "Xem chi tiết"
  │   └─ Navigate to /teacher/classes/{classId}
  │
  └─ More actions
      ├─ Edit → Edit Modal
      ├─ Delete → Confirm → API → Refresh
      └─ Other actions
```

#### Input / Output

**Page Load**:
```typescript
// API Call
GET /api/teacher/classes

// Response
{
  success: true,
  data: {
    classes: ClassItem[],
    stats: {
      total: number,
      active: number,
      totalStudents: number,
      thisMonth: number
    }
  }
}
```

#### Điều hướng

**Từ màn hình này đến**:
- Class Detail Page (click class card)
- Create Class Modal (click "Tạo lớp mới")
- Edit Class Modal (click Edit)
- Attendance Page (click Take Attendance)

**Đến màn hình này từ**:
- Teacher Dashboard
- Teacher Sidebar (click "Quản lý lớp học")

---

### 3.2. Teacher - Create Class Modal

**File Component**: `Inline modal trong ClassManagementTeacherPage.tsx`

#### Tên màn hình
**Create Class Modal / Tạo lớp học mới**

#### Mục đích
Cho phép giáo viên tạo lớp học mới

#### Các thành phần UI

**Modal Header**:
- Title: "Tạo lớp học mới"
- Close button (X)

**Form Section** (2 columns on desktop):

**Column 1 - Basic Info**:
- **Class Name** (required)
  - Label: "Tên lớp học"
  - Placeholder: "VD: VSTEP B2 - Lớp Tối"
  - Max length: 100 characters
  - Validation: Required, min 3 chars

- **Description** (optional)
  - Label: "Mô tả lớp học"
  - Textarea, 3 rows
  - Placeholder: "Mô tả ngắn về lớp học..."
  - Max length: 500 characters

- **Level** (required)
  - Label: "Cấp độ VSTEP"
  - Select dropdown
  - Options: A2, B1, B2, C1
  - Default: B1

- **Cover Image** (optional)
  - Label: "Ảnh bìa lớp"
  - Upload button
  - Preview thumbnail
  - Accepted: JPG, PNG
  - Max size: 5MB

**Column 2 - Schedule & Settings**:
- **Start Date** (required)
  - Label: "Ngày bắt đầu"
  - Date picker
  - Min: Today
  - Validation: Required

- **End Date** (optional)
  - Label: "Ngày kết thúc (dự kiến)"
  - Date picker
  - Min: Start date + 1 day

- **Schedule** (optional)
  - Label: "Lịch học"
  - Text input
  - Placeholder: "VD: Thứ 2, 4, 6 - 19:00-21:00"
  - Helper text: "Bạn có thể chỉnh sửa chi tiết sau"

- **Room** (optional)
  - Label: "Phòng học"
  - Text input
  - Placeholder: "VD: A201, Online, Zoom"

- **Max Students** (optional)
  - Label: "Số lượng học viên tối đa"
  - Number input
  - Min: 1, Max: 100
  - Default: 30

**Settings**:
- Checkbox: "Cho phép học viên tự tham gia bằng mã lớp"
  - Default: Checked
  - Disabled → Only invite by email

**Modal Footer**:
- Button "Hủy" (secondary, left)
- Button "Tạo lớp học" (primary purple, right)
  - Loading state: Spinner + "Đang tạo..."
  - Disabled khi form invalid

**Success State**:
- Close modal
- Show toast: "Tạo lớp học thành công!"
- Show class code modal:
  - Title: "Lớp học đã được tạo!"
  - Class code: `ABC123` (large, copyable)
  - Message: "Chia sẻ mã này với học viên để họ tham gia lớp"
  - Button: "Xem chi tiết lớp"
  - Button: "Đóng"

#### Chức năng

1. **Form Validation**:
   - Real-time validation
   - Show errors inline
   - Disable submit khi invalid

2. **Date Validation**:
   - Start date >= today
   - End date > start date
   - Auto-set end date = start + 3 months nếu không nhập

3. **Image Upload**:
   - Preview before upload
   - Validate size và type
   - Compress nếu > 1MB

4. **Submit Form**:
   - Validate all fields
   - Call API create class
   - Generate class code (backend)
   - Show success modal with code
   - Refresh classes list

#### Luồng xử lý chính

```
Teacher clicks "Tạo lớp mới"
  ↓
Open Create Class Modal
  ↓
Fill form fields:
  ├─ Class name (required)
  ├─ Description (optional)
  ├─ Level (required)
  ├─ Start date (required)
  ├─ End date (optional)
  ├─ Schedule (optional)
  ├─ Room (optional)
  └─ Max students (optional)
  ↓
[Real-time validation]
  ↓
Click "Tạo lớp học"
  ↓
[Frontend Validation]
  ↓ (Valid)
Show loading state
  ↓
Call POST /api/classes
  ↓
[Backend Processing]
  ├─ Validate inputs
  ├─ Generate unique class code
  ├─ Upload cover image (if any)
  ├─ Create class record
  └─ Return class data
  ↓
[Success]
  ├─ Close create modal
  ├─ Show success toast
  ├─ Show class code modal
  ├─ Copy code to clipboard (auto)
  └─ Refresh classes list
  ↓
Teacher can:
  ├─ "Xem chi tiết lớp" → Navigate to class detail
  └─ "Đóng" → Stay on classes list
```

#### Input / Output

**Input**:
```typescript
interface CreateClassInput {
  name: string;              // Required, 3-100 chars
  description?: string;      // Optional, max 500 chars
  level: 'A2' | 'B1' | 'B2' | 'C1'; // Required
  startDate: string;         // Required, ISO date, >= today
  endDate?: string;          // Optional, ISO date, > startDate
  schedule?: string;         // Optional
  room?: string;             // Optional
  maxStudents?: number;      // Optional, 1-100, default 30
  allowSelfJoin: boolean;    // Required, default true
  coverImage?: File;         // Optional, JPG/PNG, max 5MB
}
```

**Output** (Success):
```typescript
interface CreateClassResponse {
  success: true;
  data: {
    classId: string;
    name: string;
    classCode: string;      // Generated code
    level: string;
    startDate: string;
    endDate: string | null;
    coverImageUrl: string | null;
    teacherId: string;
    teacherName: string;
    studentCount: 0;
    createdAt: string;
  };
}
```

**Output** (Error):
```typescript
interface CreateClassErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    field?: string;
  };
}
```

---

### 3.3. Teacher - Class Detail Page

**File Component**: `/components/teacher/ClassDetailPageTeacher.tsx`

#### Tên màn hình
**Class Detail Page / Chi tiết lớp học**

#### Mục đích
Hiển thị thông tin chi tiết lớp học và quản lý nội dung lớp

#### Các thành phần UI

**Page Header**:
- Breadcrumb: "Quản lý lớp học > {ClassName}"
- Back button (← Quay lại)
- Class name (h1)
- Level badge + Status badge
- Class code (with copy button)
- Action buttons (right):
  - "Mời học viên" (primary)
  - "Chỉnh sửa lớp" (secondary)
  - More menu (•••):
    - Regenerate class code
    - Archive class
    - Delete class

**Stats Cards Row** (4 cards):
1. **Total Students**
   - Icon: Users
   - Number: X students
   - Trend: +Y this week

2. **Assignments**
   - Icon: ClipboardList
   - Number: X assignments
   - Link: "Tạo bài tập mới"

3. **Attendance Rate**
   - Icon: CheckCircle
   - Percentage: X%
   - Text: "Trung bình"

4. **Materials**
   - Icon: FileText
   - Number: X files
   - Link: "Upload tài liệu"

**Tabs Section**:

**Tab 1: Overview (Tổng quan)**:
- **Class Information Card**:
  - Teacher info (avatar + name)
  - Start date - End date
  - Schedule
  - Room
  - Max students
  - Created date

- **Recent Announcements**:
  - List of announcements (max 5)
  - Button: "Tạo thông báo mới"
  - Empty state: "Chưa có thông báo"

- **Upcoming Schedule**:
  - Next 5 sessions
  - Date, time, topic
  - Button: "Xem lịch đầy đủ"

**Tab 2: Students (Học viên)**:
- **Students Table**:
  - Search bar
  - Filter: All / Active / Inactive
  - Columns:
    - STT
    - Avatar + Full Name
    - Email
    - Join Date
    - Assignments Completed (X/Y)
    - Avg Score
    - Attendance Rate (%)
    - Actions:
      - View details (eye icon)
      - Remove (trash icon)
  - Pagination
  - Export button (Excel)

- **Invite Students Section** (above table):
  - Button: "Mời qua Email"
  - Button: "Chia sẻ mã lớp"
  - Button: "Tạo link mời"

**Tab 3: Materials (Tài liệu)**:
- **Upload Section**:
  - Button: "Upload tài liệu mới"
  - Drag & drop zone

- **Materials Grid/List**:
  - Filter by category
  - Sort by date, name
  - Each material card:
    - File icon (by type)
    - File name
    - Category badge
    - Upload date
    - File size
    - Download count
    - Actions:
      - Download
      - Copy link
      - Edit
      - Delete

**Tab 4: Assignments (Bài tập)**:
- Button: "Tạo bài tập mới"
- **Assignments List**:
  - Filter: All / Active / Completed
  - Sort: Due date, Created date
  - Each assignment card:
    - Title
    - Type (Reading/Listening/Writing/Speaking/Full Test)
    - Due date
    - Status (Active/Closed)
    - Stats:
      - Submitted: X/Y students
      - Avg score: Z
    - Actions:
      - View details
      - Edit
      - Delete

**Tab 5: Schedule (Lịch học)**:
- Component: `<ScheduleManager />` (Module 15)
- View modes: List / Calendar
- Add session button
- Features:
  - Add/Edit/Delete sessions
  - Set time, room, Zoom link
  - Repeat weekly
  - Mark as completed/cancelled

#### Chức năng

1. **Tab Navigation**:
   - Click tab → Load data
   - Update URL: ?tab=overview|students|materials|assignments|schedule

2. **Invite Students**:
   - **Email**: Modal input emails → Send invitations
   - **Code**: Modal hiển thị code + share buttons
   - **Link**: Generate link → Copy to clipboard

3. **Manage Students**:
   - View details: Open student modal
   - Remove: Confirm → API → Refresh

4. **Upload Materials**:
   - Click upload → File picker
   - Fill metadata → Upload
   - Success → Refresh list

5. **Manage Assignments**:
   - Create: Open Assignment Creator
   - Edit: Open editor
   - Delete: Confirm → API

6. **Manage Schedule**:
   - Full schedule management
   - See Module 15 for details

#### Luồng xử lý chính

```
Teacher navigates to Class Detail Page
  ↓
GET /api/classes/{classId}
  ↓
Render page with Overview tab (default)
  ↓
Load class info + stats
  ↓
[User Actions]
  │
  ├─ Switch Tab
  │   ├─ Overview → Load announcements + upcoming
  │   ├─ Students → Load students list
  │   ├─ Materials → Load materials
  │   ├─ Assignments → Load assignments
  │   └─ Schedule → Load schedule
  │
  ├─ Invite Students
  │   ├─ Email:
  │   │   ├─ Open modal
  │   │   ├─ Input emails
  │   │   ├─ POST /api/classes/{id}/invite
  │   │   └─ Send invitations
  │   │
  │   ├─ Share Code:
  │   │   ├─ Open modal
  │   │   ├─ Display code
  │   │   └─ Copy/Share buttons
  │   │
  │   └─ Create Link:
  │       ├─ Generate link
  │       └─ Copy to clipboard
  │
  ├─ Manage Students
  │   ├─ View: Open StudentHistoryModal
  │   └─ Remove:
  │       ├─ Confirm
  │       ├─ DELETE /api/classes/{id}/students/{studentId}
  │       └─ Refresh list
  │
  ├─ Upload Materials
  │   ├─ Open upload modal
  │   ├─ Select files
  │   ├─ Fill metadata
  │   ├─ POST /api/classes/{id}/materials
  │   └─ Refresh materials
  │
  └─ Manage Assignments
      └─ See Module 07
```

#### Điều hướng

**Từ màn hình này đến**:
- Assignment Creator (click "Tạo bài tập mới")
- Attendance Page (click "Điểm danh")
- Student History Modal (click view student)
- Edit Class Modal (click "Chỉnh sửa lớp")

**Đến màn hình này từ**:
- Class Management Page (click class card)
- Teacher Dashboard (click class in quick access)
- Direct link with class_id

---

### 3.4. Student - My Courses Page

**File Component**: `/components/student/MyCoursesPage.tsx`

#### Tên màn hình
**My Courses / Khóa học của tôi**

#### Mục đích
Hiển thị danh sách lớp học mà học viên đã tham gia

#### Các thành phần UI

**Page Header**:
- Title: "Khóa học của tôi"
- Button: "Tham gia lớp mới" (+ icon, blue-600)

**Stats Cards** (3 cards):
1. **Active Classes**
   - Icon: BookOpen
   - Number: X classes

2. **Total Assignments**
   - Icon: ClipboardList
   - Number: Y assignments
   - Text: "Z cần làm"

3. **Avg Attendance**
   - Icon: CheckCircle
   - Percentage: A%

**Tabs**:
- Active (đang học)
- Completed (đã hoàn thành)
- All

**Classes Grid** (2 columns on desktop):
Each class card:
- Cover image
- Class name
- Teacher name + avatar
- Level badge
- Progress bar (assignments completed)
- Stats:
  - 📝 X/Y assignments done
  - ✅ Z% attendance
  - 📅 Next class: Date
- Button: "Vào lớp" (primary)

**Empty State** (no classes):
- Icon: Book
- Title: "Chưa tham gia lớp học nào"
- Message: "Nhập mã lớp hoặc nhấn link mời từ giáo viên để tham gia"
- Button: "Tham gia lớp ngay"

**Join Class Modal**:
- Title: "Tham gia lớp học"
- Input: "Nhập mã lớp" (6 characters)
- Helper: "Mã lớp do giáo viên cung cấp"
- Button: "Tham gia"

#### Chức năng

1. **Display Classes**:
   - Fetch student's classes
   - Group by status
   - Show progress

2. **Join Class**:
   - Click "Tham gia lớp mới"
   - Input class code
   - Validate → Join
   - Success → Add to list

3. **View Class**:
   - Click "Vào lớp"
   - Navigate to Class Detail

#### Luồng xử lý chính

```
Student arrives at My Courses Page
  ↓
GET /api/student/classes
  ↓
Display classes by status
  ↓
[User Actions]
  │
  ├─ Join New Class
  │   ├─ Click "Tham gia lớp mới"
  │   ├─ Open Join Class Modal
  │   ├─ Input class code (6 chars)
  │   ├─ Click "Tham gia"
  │   ├─ POST /api/classes/join
  │   ├─ [Validate code]
  │   ├─ Success:
  │   │   ├─ Close modal
  │   │   ├─ Show success toast
  │   │   ├─ Add class to list
  │   │   └─ Navigate to class detail
  │   └─ Error:
  │       └─ Show error message
  │
  └─ View Class
      ├─ Click "Vào lớp"
      └─ Navigate to /student/classes/{classId}
```

---

### 3.5. Student - Class Detail Page

**File Component**: `/components/student/ClassDetailPage.tsx`

#### Tên màn hình
**Class Detail Page (Student View)**

#### Mục đích
Học viên xem thông tin lớp và truy cập nội dung học

#### Các thành phần UI

**Page Header**:
- Breadcrumb: "Khóa học của tôi > {ClassName}"
- Back button
- Class name
- Level badge
- Teacher info (avatar + name)
- Button: "Rời khỏi lớp" (secondary, red)

**Stats Cards** (4 cards):
1. **My Progress**
   - Assignments: X/Y completed
   - Progress bar

2. **My Score**
   - Average: Z điểm

3. **Attendance**
   - Rate: A%

4. **Next Class**
   - Date + Time
   - Room/Zoom link

**Tabs**:

**Tab 1: Overview**:
- Class description
- Teacher info
- Schedule
- Recent announcements

**Tab 2: Materials**:
- Materials grid
- Filter by category
- Download materials

**Tab 3: Assignments**:
- Assignments list
- Status: Not started / In progress / Submitted
- Due dates
- Scores

**Tab 4: Schedule**:
- Upcoming sessions
- Calendar view
- My attendance status

#### Chức năng

1. **View Materials**:
   - Browse materials
   - Download files

2. **View Assignments**:
   - See assigned tasks
   - Click to start assignment
   - View scores

3. **View Schedule**:
   - See class schedule
   - Attendance status

4. **Leave Class**:
   - Confirm → Leave
   - Redirect to My Courses

---

## 4. User Flow Diagrams

### 4.1. Teacher Creates Class Flow

```
[Start] Teacher wants to create class
  ↓
Navigate to Class Management Page
  ↓
Click "Tạo lớp mới"
  ↓
Open Create Class Modal
  ↓
Fill form:
  ├─ Class name (required)
  ├─ Description (optional)
  ├─ Level (required)
  ├─ Start date (required)
  ├─ End date (optional)
  ├─ Schedule (optional)
  ├─ Room (optional)
  ├─ Max students (optional)
  └─ Settings
  ↓
Click "Tạo lớp học"
  ↓
Frontend validation
  ↓
  ├─ Invalid → Show errors → Stay in form
  │
  └─ Valid → POST /api/classes
      ↓
      Backend validation
      ↓
      ├─ Error → Return error → Show error
      │
      └─ Success:
          ├─ Generate unique class code
          ├─ Upload cover image (if any)
          ├─ Create class record
          ├─ Create default announcement
          └─ Return class data + code
          ↓
          Close modal
          ↓
          Show success toast
          ↓
          Show class code modal
          ↓
          Teacher options:
            ├─ Copy class code
            ├─ Share via email/link
            ├─ View class detail
            └─ Close modal
          ↓
          [End] Class created successfully
```

### 4.2. Teacher Invites Students Flow

```
[Start] Teacher wants to invite students
  ↓
Go to Class Detail Page
  ↓
Click "Mời học viên"
  ↓
Choose invitation method:
  │
  ├─ Email Invitation:
  │   ├─ Open email modal
  │   ├─ Input email addresses (comma separated)
  │   ├─ Click "Gửi lời mời"
  │   ├─ POST /api/classes/{id}/invite
  │   ├─ Backend:
  │   │   ├─ Parse emails
  │   │   ├─ For each email:
  │   │   │   ├─ User exists?
  │   │   │   │   ├─ Yes: Create invitation
  │   │   │   │   └─ No: Send register invitation
  │   │   │   └─ Send invitation email
  │   │   └─ Return success count
  │   ├─ Show success: "Đã gửi X lời mời"
  │   └─ [End]
  │
  ├─ Share Class Code:
  │   ├─ Open code modal
  │   ├─ Display class code: ABC123
  │   ├─ Teacher can:
  │   │   ├─ Copy code
  │   │   ├─ Share via messaging apps
  │   │   └─ Regenerate code
  │   └─ [End]
  │
  └─ Generate Invite Link:
      ├─ Generate link: domain.com/join-class?code=ABC123
      ├─ Copy to clipboard
      ├─ Share link
      └─ [End]
```

### 4.3. Student Joins Class Flow

```
[Start] Student wants to join class
  ↓
Method 1: Via Class Code
  ├─ Go to My Courses
  ├─ Click "Tham gia lớp mới"
  ├─ Open Join Class Modal
  ├─ Input class code (6 chars)
  ├─ Click "Tham gia"
  └─ → [Join Process]

Method 2: Via Invitation Email
  ├─ Receive invitation email
  ├─ Click "Join Class" link
  ├─ Redirect to join page với code
  └─ → [Join Process]

Method 3: Via Invite Link
  ├─ Click invite link
  ├─ Redirect to join page với code
  └─ → [Join Process]

[Join Process]
  ↓
POST /api/classes/join
  ↓
Backend validation:
  ├─ Class code exists?
  │   └─ No → Error "Mã lớp không tồn tại"
  │
  ├─ Class status active?
  │   └─ No → Error "Lớp đã đóng"
  │
  ├─ Student already joined?
  │   └─ Yes → Error "Bạn đã tham gia lớp này"
  │
  ├─ Class full?
  │   └─ Yes → Error "Lớp đã đầy"
  │
  └─ All checks pass:
      ├─ Add student to class_students
      ├─ Send notification to teacher
      ├─ Send welcome notification to student
      └─ Return success + class_id
      ↓
      Frontend:
        ├─ Show success toast
        ├─ Add class to student's list
        └─ Navigate to class detail page
      ↓
      [End] Successfully joined class
```

### 4.4. Teacher Uploads Material Flow

```
[Start] Teacher wants to share material
  ↓
Go to Class Detail Page
  ↓
Go to Materials Tab
  ↓
Click "Upload tài liệu mới"
  ↓
Open Upload Modal
  ↓
Select file(s):
  ├─ Drag & drop
  └─ File picker
  ↓
Fill metadata:
  ├─ Title (auto from filename)
  ├─ Description (optional)
  ├─ Category (dropdown)
  └─ Tags (optional)
  ↓
Frontend validation:
  ├─ File type allowed?
  ├─ File size within limit?
  └─ Required fields filled?
  ↓
  ├─ Invalid → Show errors
  │
  └─ Valid → Click "Upload"
      ↓
      Show upload progress
      ↓
      POST /api/classes/{id}/materials
      (multipart/form-data)
      ↓
      Backend:
        ├─ Validate file
        ├─ Upload to storage (S3)
        ├─ Create material record
        ├─ Generate shareable link
        ├─ Send notification to all students
        └─ Return material data
      ↓
      Frontend:
        ├─ Hide upload modal
        ├─ Show success toast
        ├─ Add material to list
        └─ Material appears in students' view
      ↓
      [End] Material shared successfully
```

---

## 5. Sequence Diagrams

### 5.1. Create Class Sequence

```
Teacher          Frontend         API Server       Database      Notification
  |                 |                  |               |               |
  |--Fill form----->|                  |               |               |
  |                 |                  |               |               |
  |--Click Create-->|                  |               |               |
  |                 |                  |               |               |
  |                 |--Validate------->|               |               |
  |                 |                  |               |               |
  |                 |--POST /classes-->|               |               |
  |                 |                  |               |               |
  |                 |                  |--Generate code--------------->|
  |                 |                  |  (unique 6 chars)             |
  |                 |                  |               |               |
  |                 |                  |<--Code--------|               |
  |                 |                  |               |               |
  |                 |                  |--Upload image---------------->|
  |                 |                  |(if provided)  |               |
  |                 |                  |               |               |
  |                 |                  |<--Image URL---|               |
  |                 |                  |               |               |
  |                 |                  |--BEGIN TRANSACTION---------->|
  |                 |                  |               |               |
  |                 |                  |--INSERT INTO classes-------->|
  |                 |                  |               |               |
  |                 |                  |<--Class created               |
  |                 |                  |               |               |
  |                 |                  |--INSERT announcement-------->|
  |                 |                  |               |               |
  |                 |                  |--COMMIT--------------------->|
  |                 |                  |               |               |
  |                 |                  |--Create notification-------->|
  |                 |                  |               |               |
  |                 |<--201 Created----|               |               |
  |                 |  + class data    |               |               |
  |                 |                  |               |               |
  |<--Show success--|                  |               |               |
  |   + class code  |                  |               |               |
  |                 |                  |               |               |
```

### 5.2. Join Class Sequence

```
Student         Frontend         API Server       Database      Notification
  |                |                  |               |               |
  |--Enter code--->|                  |               |               |
  |                |                  |               |               |
  |--Click Join--->|                  |               |               |
  |                |                  |               |               |
  |                |--Validate code-->|               |               |
  |                |                  |               |               |
  |                |--POST /join----->|               |               |
  |                |                  |               |               |
  |                |                  |--Find class------------------>|
  |                |                  |               |               |
  |                |                  |<--Class data--|               |
  |                |                  |               |               |
  |                |                  |--Check status--------------->|
  |                |                  |               |               |
  |                |                  |--Check capacity------------->|
  |                |                  |               |               |
  |                |                  |--Check already joined------->|
  |                |                  |               |               |
  |                |                  |<--All checks pass             |
  |                |                  |               |               |
  |                |                  |--INSERT class_students------>|
  |                |                  |               |               |
  |                |                  |<--Student added               |
  |                |                  |               |               |
  |                |                  |--Notify teacher------------->|
  |                |                  |               |               |
  |                |                  |--Notify student------------->|
  |                |                  |               |               |
  |                |<--200 OK---------|               |               |
  |                |  + class data    |               |               |
  |                |                  |               |               |
  |<--Show success-|                  |               |               |
  |   Navigate---->|                  |               |               |
  |   to class     |                  |               |               |
```

### 5.3. Upload Material Sequence

```
Teacher      Frontend       API Server     Storage(S3)    Database    Notification
  |              |               |              |             |             |
  |--Select file>|               |              |             |             |
  |              |               |              |             |             |
  |--Click Up--->|               |              |             |             |
  |   load       |               |              |             |             |
  |              |               |              |             |             |
  |              |--Validate---->|              |             |             |
  |              |   file        |              |             |             |
  |              |               |              |             |             |
  |              |--POST /mat--->|              |             |             |
  |              |   erials      |              |             |             |
  |              |(multipart)    |              |             |             |
  |              |               |              |             |             |
  |              |               |--Upload----->|             |             |
  |              |               |   file       |             |             |
  |              |               |              |             |             |
  |              |               |<--File URL---|             |             |
  |              |               |              |             |             |
  |              |               |--Create mat----------->    |             |
  |              |               |   erial rec  |             |             |
  |              |               |              |             |             |
  |              |               |<--Material---|             |             |
  |              |               |   created    |             |             |
  |              |               |              |             |             |
  |              |               |--Get class------------->   |             |
  |              |               |   students   |             |             |
  |              |               |              |             |             |
  |              |               |<--Students---|             |             |
  |              |               |   list       |             |             |
  |              |               |              |             |             |
  |              |               |--Create notification-------+----------->|
  |              |               |   for each   |             |             |
  |              |               |   student    |             |             |
  |              |               |              |             |             |
  |              |<--201 Created-|              |             |             |
  |              | + material    |              |             |             |
  |              |   data        |              |             |             |
  |              |               |              |             |             |
  |<--Success----|               |              |             |             |
  |   toast      |               |              |             |             |
  |              |               |              |             |             |
```

---

## 6. Database Design

### 6.1. Table: classes

**Mô tả**: Lưu thông tin các lớp học

```sql
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  class_code VARCHAR(6) UNIQUE NOT NULL,
  level VARCHAR(10) NOT NULL,
    -- 'A2' | 'B1' | 'B2' | 'C1'
  teacher_id UUID NOT NULL REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'active',
    -- 'active' | 'completed' | 'archived'
  start_date DATE NOT NULL,
  end_date DATE,
  schedule VARCHAR(255),
    -- VD: "Thứ 2, 4, 6 - 19:00-21:00"
  room VARCHAR(100),
  max_students INTEGER DEFAULT 30,
  current_students INTEGER DEFAULT 0,
  allow_self_join BOOLEAN DEFAULT TRUE,
  cover_image_url VARCHAR(500),
  settings JSONB DEFAULT '{}',
    -- { requireApproval, allowChat, ... }
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX idx_classes_class_code ON classes(class_code);
CREATE INDEX idx_classes_status ON classes(status);
CREATE INDEX idx_classes_level ON classes(level);
CREATE INDEX idx_classes_start_date ON classes(start_date);
CREATE UNIQUE INDEX idx_classes_code_unique ON classes(class_code) WHERE deleted_at IS NULL;

-- Trigger to update updated_at
CREATE TRIGGER update_classes_updated_at
  BEFORE UPDATE ON classes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**Quan hệ**:
- 1 class → 1 teacher (users) (n-1)
- 1 class → N students (class_students) (1-n)
- 1 class → N materials (class_materials) (1-n)
- 1 class → N assignments (assignments) (1-n)
- 1 class → N schedule_sessions (class_schedule) (1-n)
- 1 class → N announcements (class_announcements) (1-n)

---

### 6.2. Table: class_students

**Mô tả**: Lưu quan hệ giữa lớp học và học viên

```sql
CREATE TABLE class_students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'active',
    -- 'active' | 'removed' | 'left'
  join_method VARCHAR(20),
    -- 'code' | 'invitation' | 'link' | 'admin'
  joined_at TIMESTAMP DEFAULT NOW(),
  left_at TIMESTAMP,
  removed_at TIMESTAMP,
  removal_reason TEXT,
  
  -- Stats
  assignments_completed INTEGER DEFAULT 0,
  total_assignments INTEGER DEFAULT 0,
  avg_score DECIMAL(5,2),
  attendance_count INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  
  UNIQUE(class_id, student_id)
);

-- Indexes
CREATE INDEX idx_class_students_class_id ON class_students(class_id);
CREATE INDEX idx_class_students_student_id ON class_students(student_id);
CREATE INDEX idx_class_students_status ON class_students(status);
CREATE INDEX idx_class_students_joined_at ON class_students(joined_at DESC);
```

**Quan hệ**:
- N class_students → 1 class (n-1)
- N class_students → 1 student (users) (n-1)

---

### 6.3. Table: class_invitations

**Mô tả**: Lưu lời mời tham gia lớp

```sql
CREATE TABLE class_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  inviter_id UUID NOT NULL REFERENCES users(id),
    -- Teacher who sent invitation
  invitee_email VARCHAR(255) NOT NULL,
  invitee_id UUID REFERENCES users(id),
    -- If user exists
  status VARCHAR(20) DEFAULT 'pending',
    -- 'pending' | 'accepted' | 'declined' | 'expired'
  invitation_token VARCHAR(255) UNIQUE,
  expires_at TIMESTAMP,
  accepted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_class_invitations_class_id ON class_invitations(class_id);
CREATE INDEX idx_class_invitations_email ON class_invitations(invitee_email);
CREATE INDEX idx_class_invitations_token ON class_invitations(invitation_token);
CREATE INDEX idx_class_invitations_status ON class_invitations(status);
```

---

### 6.4. Table: class_materials

**Mô tả**: Lưu tài liệu của lớp học

```sql
CREATE TABLE class_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES users(id),
    -- Teacher who uploaded
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
    -- Path in storage (S3)
  file_url VARCHAR(500) NOT NULL,
    -- Public URL
  file_type VARCHAR(50),
    -- 'pdf' | 'docx' | 'pptx' | 'mp3' | 'mp4' | ...
  file_size BIGINT,
    -- Bytes
  category VARCHAR(50),
    -- 'reading' | 'listening' | 'writing' | 'speaking' | 'grammar' | 'vocabulary' | 'other'
  tags TEXT[],
  download_count INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_class_materials_class_id ON class_materials(class_id);
CREATE INDEX idx_class_materials_uploaded_by ON class_materials(uploaded_by);
CREATE INDEX idx_class_materials_category ON class_materials(category);
CREATE INDEX idx_class_materials_uploaded_at ON class_materials(uploaded_at DESC);
```

**Quan hệ**:
- N class_materials → 1 class (n-1)
- N class_materials → 1 uploader (users) (n-1)

---

### 6.5. Table: class_announcements

**Mô tả**: Lưu thông báo của lớp học

```sql
CREATE TABLE class_announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id),
    -- Teacher who posted
  title VARCHAR(255),
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_important BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_class_announcements_class_id ON class_announcements(class_id);
CREATE INDEX idx_class_announcements_created_at ON class_announcements(created_at DESC);
CREATE INDEX idx_class_announcements_pinned ON class_announcements(is_pinned) WHERE is_pinned = TRUE;
```

---

### 6.6. Table: class_schedule

**Mô tả**: Lưu lịch học của lớp (chi tiết Module 15)

```sql
CREATE TABLE class_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  session_number INTEGER NOT NULL,
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  topic VARCHAR(255),
  room VARCHAR(100),
  zoom_link VARCHAR(500),
  status VARCHAR(20) DEFAULT 'scheduled',
    -- 'scheduled' | 'completed' | 'cancelled'
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_class_schedule_class_id ON class_schedule(class_id);
CREATE INDEX idx_class_schedule_date ON class_schedule(session_date);
CREATE INDEX idx_class_schedule_status ON class_schedule(status);
```

---

## 7. API Endpoints

### 7.1. POST /api/classes (Teacher)

**Mô tả**: Tạo lớp học mới

**Authentication**: Required (Teacher or Admin)

**Request**:
```typescript
POST /api/classes
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "name": "VSTEP B2 - Lớp Tối",
  "description": "Lớp học VSTEP B2 buổi tối",
  "level": "B2",
  "startDate": "2024-01-15",
  "endDate": "2024-04-15",
  "schedule": "Thứ 2, 4, 6 - 19:00-21:00",
  "room": "A201",
  "maxStudents": 30,
  "allowSelfJoin": true,
  "coverImage": File (optional)
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "classId": "uuid",
    "name": "VSTEP B2 - Lớp Tối",
    "classCode": "ABC123",
    "level": "B2",
    "teacherId": "uuid",
    "teacherName": "Nguyễn Văn A",
    "startDate": "2024-01-15",
    "endDate": "2024-04-15",
    "schedule": "Thứ 2, 4, 6 - 19:00-21:00",
    "room": "A201",
    "maxStudents": 30,
    "currentStudents": 0,
    "allowSelfJoin": true,
    "coverImageUrl": "https://...",
    "status": "active",
    "createdAt": "2024-12-15T10:00:00Z"
  }
}
```

**Validation**:
- `name`: Required, 3-100 characters
- `level`: Required, one of ['A2', 'B1', 'B2', 'C1']
- `startDate`: Required, >= today
- `endDate`: Optional, > startDate
- `maxStudents`: Optional, 1-100, default 30
- `coverImage`: Optional, JPG/PNG, max 5MB

**Business Logic**:
1. Validate inputs
2. Check user is teacher/admin
3. Generate unique 6-char class code
4. Upload cover image if provided
5. Create class record with teacher_id = current user
6. Create default welcome announcement
7. Return class data with code

---

### 7.2. GET /api/classes (Teacher)

**Mô tả**: Lấy danh sách lớp của giáo viên

**Authentication**: Required (Teacher)

**Request**:
```typescript
GET /api/classes?status=active&sort=created_desc
Authorization: Bearer {token}
```

**Query Parameters**:
- `status`: Optional, filter by status ('active' | 'completed' | 'archived')
- `sort`: Optional, sort by ('created_desc' | 'created_asc' | 'name_asc' | 'students_desc')
- `page`: Optional, page number (default: 1)
- `limit`: Optional, items per page (default: 20)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "classes": [
      {
        "classId": "uuid",
        "name": "VSTEP B2 - Lớp Tối",
        "classCode": "ABC123",
        "level": "B2",
        "status": "active",
        "teacherId": "uuid",
        "teacherName": "Nguyễn Văn A",
        "studentCount": 25,
        "maxStudents": 30,
        "assignmentCount": 10,
        "materialCount": 15,
        "coverImageUrl": "https://...",
        "startDate": "2024-01-15",
        "endDate": "2024-04-15",
        "lastActivity": "2024-12-14T15:30:00Z",
        "createdAt": "2024-12-10T10:00:00Z"
      }
      // ... more classes
    ],
    "stats": {
      "total": 12,
      "active": 8,
      "completed": 3,
      "archived": 1,
      "totalStudents": 245
    },
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 12,
      "pages": 1
    }
  }
}
```

---

### 7.3. GET /api/classes/:id (Teacher/Student)

**Mô tả**: Lấy thông tin chi tiết lớp học

**Authentication**: Required

**Request**:
```typescript
GET /api/classes/uuid-class-id
Authorization: Bearer {token}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "classId": "uuid",
    "name": "VSTEP B2 - Lớp Tối",
    "description": "Lớp học VSTEP B2...",
    "classCode": "ABC123",
    "level": "B2",
    "status": "active",
    
    "teacher": {
      "id": "uuid",
      "fullName": "Nguyễn Văn A",
      "email": "teacher@example.com",
      "avatar": "https://..."
    },
    
    "schedule": {
      "pattern": "Thứ 2, 4, 6 - 19:00-21:00",
      "room": "A201",
      "startDate": "2024-01-15",
      "endDate": "2024-04-15"
    },
    
    "stats": {
      "students": {
        "current": 25,
        "max": 30
      },
      "assignments": {
        "total": 10,
        "active": 3
      },
      "materials": 15,
      "sessions": {
        "total": 30,
        "completed": 15,
        "upcoming": 15
      },
      "attendance": {
        "averageRate": 92.5
      }
    },
    
    "settings": {
      "allowSelfJoin": true,
      "requireApproval": false,
      "allowChat": true
    },
    
    "coverImageUrl": "https://...",
    "createdAt": "2024-12-10T10:00:00Z",
    "updatedAt": "2024-12-14T15:30:00Z"
  }
}
```

**Access Control**:
- Teacher: Can view own classes
- Student: Can view joined classes
- Admin: Can view all classes

---

### 7.4. PUT /api/classes/:id (Teacher)

**Mô tả**: Cập nhật thông tin lớp học

**Authentication**: Required (Teacher of this class or Admin)

**Request**:
```typescript
PUT /api/classes/uuid-class-id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "VSTEP B2 - Lớp Tối (Updated)",
  "description": "New description",
  "schedule": "Thứ 2, 4 - 19:00-21:00",
  "room": "A301",
  "maxStudents": 35,
  "endDate": "2024-05-15"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Cập nhật lớp học thành công",
  "data": {
    // Updated class data
  }
}
```

**Validation**:
- Cannot change `classCode`
- Cannot reduce `maxStudents` below `currentStudents`
- `endDate` must be > `startDate`

**Business Logic**:
1. Check user is teacher of this class
2. Validate inputs
3. Update class record
4. If important changes (schedule, room), create notification for students
5. Return updated data

---

### 7.5. DELETE /api/classes/:id (Teacher)

**Mô tả**: Xóa lớp học (soft delete)

**Authentication**: Required (Teacher of this class or Admin)

**Request**:
```typescript
DELETE /api/classes/uuid-class-id
Authorization: Bearer {token}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Đã xóa lớp học thành công"
}
```

**Business Logic**:
1. Check user is teacher of this class
2. Soft delete: Set `deleted_at = NOW()`
3. Keep all related data (students, materials, assignments)
4. Send notification to all students
5. Log deletion action
6. Return success

---

### 7.6. POST /api/classes/:id/invite (Teacher)

**Mô tả**: Mời học viên vào lớp qua email

**Authentication**: Required (Teacher of this class)

**Request**:
```typescript
POST /api/classes/uuid-class-id/invite
Authorization: Bearer {token}
Content-Type: application/json

{
  "emails": [
    "student1@example.com",
    "student2@example.com"
  ]
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Đã gửi 2 lời mời thành công",
  "data": {
    "invited": 2,
    "failed": 0,
    "details": [
      {
        "email": "student1@example.com",
        "status": "sent",
        "userExists": true
      },
      {
        "email": "student2@example.com",
        "status": "sent",
        "userExists": false,
        "message": "Đã gửi lời mời đăng ký"
      }
    ]
  }
}
```

**Business Logic**:
1. Check user is teacher of this class
2. Parse and validate emails
3. For each email:
   - Check user exists:
     - Yes: Create invitation, send email
     - No: Send invitation to register
4. Create `class_invitations` records
5. Send invitation emails
6. Return summary

---

### 7.7. POST /api/classes/join (Student)

**Mô tả**: Tham gia lớp học bằng class code

**Authentication**: Required (Student)

**Request**:
```typescript
POST /api/classes/join
Authorization: Bearer {token}
Content-Type: application/json

{
  "classCode": "ABC123"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Đã tham gia lớp học thành công!",
  "data": {
    "classId": "uuid",
    "className": "VSTEP B2 - Lớp Tối",
    "level": "B2",
    "teacherName": "Nguyễn Văn A",
    "joinedAt": "2024-12-15T10:30:00Z"
  }
}
```

**Response** (400 - Class not found):
```json
{
  "success": false,
  "error": {
    "code": "CLASS_NOT_FOUND",
    "message": "Mã lớp không tồn tại"
  }
}
```

**Response** (403 - Class full):
```json
{
  "success": false,
  "error": {
    "code": "CLASS_FULL",
    "message": "Lớp đã đầy (30/30 học viên)"
  }
}
```

**Business Logic**:
1. Validate class code format (6 alphanumeric)
2. Find class by code
3. Validate:
   - Class exists
   - Class status = 'active'
   - Student not already joined
   - Class not full (current < max)
4. Add to `class_students` with status='active'
5. Increment `classes.current_students`
6. Send notification to teacher
7. Send welcome notification to student
8. Return success + class info

**Error Codes**:
- `CLASS_NOT_FOUND`: Mã lớp không tồn tại
- `CLASS_CLOSED`: Lớp đã đóng
- `ALREADY_JOINED`: Bạn đã là thành viên
- `CLASS_FULL`: Lớp đã đầy

---

### 7.8. GET /api/student/classes (Student)

**Mô tả**: Lấy danh sách lớp học đã tham gia

**Authentication**: Required (Student)

**Request**:
```typescript
GET /api/student/classes?status=active
Authorization: Bearer {token}
```

**Query Parameters**:
- `status`: Optional ('active' | 'completed' | 'all')

**Response** (200):
```json
{
  "success": true,
  "data": {
    "classes": [
      {
        "classId": "uuid",
        "name": "VSTEP B2 - Lớp Tối",
        "level": "B2",
        "classCode": "ABC123",
        "teacher": {
          "id": "uuid",
          "fullName": "Nguyễn Văn A",
          "avatar": "https://..."
        },
        "schedule": "Thứ 2, 4, 6 - 19:00-21:00",
        "room": "A201",
        "coverImageUrl": "https://...",
        "myProgress": {
          "assignmentsCompleted": 8,
          "totalAssignments": 10,
          "avgScore": 7.5,
          "attendanceRate": 95.0
        },
        "nextSession": {
          "date": "2024-12-16",
          "time": "19:00-21:00",
          "topic": "Reading Strategies"
        },
        "joinedAt": "2024-12-10T10:00:00Z"
      }
    ],
    "stats": {
      "total": 5,
      "active": 3,
      "completed": 2
    }
  }
}
```

---

### 7.9. DELETE /api/classes/:id/students/:studentId (Teacher)

**Mô tả**: Xóa học viên khỏi lớp

**Authentication**: Required (Teacher of this class)

**Request**:
```typescript
DELETE /api/classes/uuid-class-id/students/uuid-student-id
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "Không tham gia học"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Đã xóa học viên khỏi lớp"
}
```

**Business Logic**:
1. Check user is teacher of this class
2. Set `class_students.removed_at = NOW()`
3. Set `removal_reason`
4. Decrement `classes.current_students`
5. Send notification to student
6. Log action
7. Return success

---

### 7.10. POST /api/classes/:id/materials (Teacher)

**Mô tả**: Upload tài liệu lớp học

**Authentication**: Required (Teacher of this class)

**Request**:
```typescript
POST /api/classes/uuid-class-id/materials
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "file": File,
  "title": "Đề thi thử Reading Part 1",
  "description": "Tài liệu luyện tập",
  "category": "reading",
  "tags": ["reading", "part1", "practice"]
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Đã upload tài liệu thành công",
  "data": {
    "materialId": "uuid",
    "classId": "uuid-class-id",
    "title": "Đề thi thử Reading Part 1",
    "fileName": "reading-part1.pdf",
    "fileUrl": "https://cdn.../reading-part1.pdf",
    "fileType": "pdf",
    "fileSize": 1024000,
    "category": "reading",
    "tags": ["reading", "part1", "practice"],
    "uploadedBy": {
      "id": "uuid",
      "fullName": "Nguyễn Văn A"
    },
    "uploadedAt": "2024-12-15T10:30:00Z"
  }
}
```

**Validation**:
- File type: PDF, DOCX, PPT, MP3, MP4, JPG, PNG, ZIP
- File size:
  - Documents: max 50MB
  - Audio: max 100MB
  - Video: max 500MB
  - Images: max 10MB
  - Archives: max 200MB

**Business Logic**:
1. Check user is teacher of this class
2. Validate file type and size
3. Upload to storage (S3)
4. Create `class_materials` record
5. Send notification to all students in class
6. Return material data

---

## 8. Business Rules

### 8.1. Class Code Rules

- **Format**: 6 characters, alphanumeric (A-Z, 0-9)
- **Uniqueness**: Must be unique across all active classes
- **Generation**: Auto-generated on class creation
- **Regeneration**: Teacher can regenerate if needed (old code becomes invalid)
- **Case-insensitive**: ABC123 = abc123
- **Expiry**: No expiry (valid until class deleted)

### 8.2. Student Capacity Rules

- **Default**: 30 students
- **Range**: 1-100 students
- **Enforcement**:
  - Cannot join if `current_students >= max_students`
  - Cannot reduce `max_students` below `current_students`
- **Exceptions**: Admin can override limit

### 8.3. Class Status Rules

**Active**:
- Can accept new students
- Can create assignments
- Can upload materials
- Can take attendance

**Completed**:
- Cannot accept new students
- Cannot create new assignments (can still grade)
- Can view all data
- Students can view but not submit

**Archived**:
- Read-only for all users
- Cannot modify any data
- Can export reports

### 8.4. Access Control Rules

**Teacher**:
- Can only manage own classes
- Cannot delete class with students (must confirm)
- Cannot remove self from class

**Student**:
- Can only view joined classes
- Cannot see other students' scores (only own)
- Can leave class anytime

**Admin**:
- Can view all classes
- Can manage any class
- Can force delete class
- Can reassign teacher

### 8.5. Material Sharing Rules

- **Visibility**: All materials visible to all students in class
- **Download**: No download limit
- **Storage**: Files stored permanently (even if class deleted)
- **Deletion**: Only uploader or admin can delete
- **Modification**: Cannot modify uploaded file (only metadata)

### 8.6. Invitation Rules

**Email Invitation**:
- Expires after 7 days
- One-time use only
- Can be resent
- Automatically accepted if user already in system

**Code Invitation**:
- Never expires (unless teacher disables)
- Unlimited use (until class full)
- Can be disabled by teacher

---

## Kết thúc Module Class Management

Module này cung cấp nền tảng cho việc tổ chức và quản lý lớp học trong VSTEPRO, liên kết chặt chẽ với các module khác:

**Liên kết module**:
- Module 07: Assignment Management (giao bài tập cho lớp)
- Module 08: Materials Management (chia sẻ tài liệu)
- Module 14: Attendance System (điểm danh học viên)
- Module 15: Schedule Management (quản lý lịch học)
- Module 21: Messaging System (tin nhắn lớp học)
- Module 20: Notification System (thông báo lớp học)

# ✅ Module 14: Attendance System

> **Module quản lý điểm danh học viên cho giáo viên**
> 
> File: `14-MODULE-ATTENDANCE.md`  
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
Module Attendance System cho phép:
- **Giáo viên**: Điểm danh học viên trong lớp học theo từng buổi học
- **Theo dõi**: Tỷ lệ tham gia của từng học viên và cả lớp
- **Báo cáo**: Xuất báo cáo điểm danh định kỳ
- **Thống kê**: Phân tích xu hướng tham gia học

### 1.2. Vai trò sử dụng

**Teacher (Giáo viên)**:
- Chọn lớp học để điểm danh
- Chọn ngày điểm danh
- Đánh dấu trạng thái cho từng học viên (Có mặt/Muộn/Vắng)
- Xem thống kê real-time
- Lưu điểm danh
- Xuất báo cáo Excel
- Sửa điểm danh đã lưu (trong 24h)
- Xem lịch sử điểm danh

**Student (Học viên)**:
- Xem lịch sử điểm danh cá nhân
- Xem tỷ lệ tham gia
- Nhận thông báo nếu vắng

**Admin**:
- Xem báo cáo điểm danh tất cả lớp
- Export dữ liệu
- Sửa/Xóa điểm danh

### 1.3. Phạm vi module
- Điểm danh theo buổi học
- 3 trạng thái: Có mặt (Present), Muộn (Late), Vắng (Absent)
- Thống kê real-time trong phiên điểm danh
- Xuất Excel
- Tích hợp với Schedule (Module 15)
- Gửi thông báo cho học viên vắng

---

## 2. Danh sách chức năng

### 2.1. Chức năng chính - Teacher

#### A. Chọn lớp học để điểm danh

**Mô tả**: Giáo viên chọn lớp từ danh sách lớp đang dạy

**Input**:
- None (hiển thị danh sách lớp của teacher)

**Output**:
- Danh sách lớp học
- Thông tin mỗi lớp:
  - Tên lớp
  - Số lượng học viên
  - Số buổi học đã điểm danh
  - Tỷ lệ điểm danh trung bình

**Business Logic**:
1. Fetch tất cả lớp của teacher với status='active'
2. Load stats cho mỗi lớp:
   - Total students
   - Total sessions
   - Average attendance rate
3. Display as grid cards
4. Click card → Navigate to Attendance Page for that class

**UI Component**: Grid of class cards
- Each card clickable
- Show quick stats
- Visual indicator of attendance health (good/warning/bad)

---

#### B. Chọn ngày điểm danh

**Mô tả**: Sau khi chọn lớp, giáo viên chọn ngày để điểm danh

**Input**:
- Date picker (default: today)

**Output**:
- Danh sách học viên của lớp
- Form điểm danh

**Business Logic**:
1. Check if attendance already exists for this date:
   - Yes: Load existing attendance (edit mode)
   - No: Create new attendance session
2. Fetch all active students in class
3. Display attendance form

**Rules**:
- Có thể điểm danh cho quá khứ (max 7 ngày trước)
- Có thể điểm danh cho tương lai (max 7 ngày sau)
- Mặc định là hôm nay

---

#### C. Điểm danh học viên

**Mô tả**: Đánh dấu trạng thái cho từng học viên

**Input**:
- Student ID
- Status: 'present' | 'late' | 'absent'

**Output**:
- Updated attendance state
- Real-time stats update

**Attendance States**:

1. **Present (Có mặt)**:
   - Icon: Green checkmark ✓
   - Color: Green
   - Score: 1.0

2. **Late (Đi muộn)**:
   - Icon: Yellow clock ⏰
   - Color: Yellow/Orange
   - Score: 0.7
   - Optional: Time late (minutes)

3. **Absent (Vắng mặt)**:
   - Icon: Red X ✗
   - Color: Red
   - Score: 0.0
   - Optional: Reason (Có phép/Không phép)

**UI Interaction**:
- Click button to toggle status
- Selected state highlighted
- Can change status anytime before save
- Null state (chưa đánh dấu) = gray

**Business Logic**:
1. Update local state when teacher clicks
2. Show real-time count:
   - Present count
   - Late count
   - Absent count
   - Not marked count
3. Enable save button when > 0 students marked

---

#### D. Thống kê real-time

**Mô tả**: Hiển thị thống kê ngay lập tức khi điểm danh

**Stats Display**:

**1. Tổng số học viên** (Total Students):
- Icon: Users
- Color: Blue
- Number: Total students in class

**2. Có mặt** (Present):
- Icon: CheckCircle
- Color: Green
- Number: Count of present students
- Percentage: (present / total) × 100%

**3. Vắng mặt** (Absent):
- Icon: XCircle
- Color: Red
- Number: Count of absent students
- Percentage: (absent / total) × 100%

**4. Đi muộn** (Late):
- Icon: Clock
- Color: Yellow
- Number: Count of late students
- Percentage: (late / total) × 100%

**Real-time Calculation**:
- Update immediately when status changes
- Progress bar showing attendance rate
- Color coding:
  - ≥ 90%: Green (Excellent)
  - 70-89%: Yellow (Good)
  - < 70%: Red (Poor)

---

#### E. Lưu điểm danh

**Mô tả**: Lưu kết quả điểm danh vào database

**Input**:
- Class ID
- Date
- Attendance records (array of student_id + status)

**Output**:
- Success message
- Confirmation toast
- Updated attendance list

**Business Logic**:
1. Validate all students have been marked
   - Warning if some students not marked
   - Option to mark remaining as absent
2. Save to `attendance_records` table
3. Update `class_students` stats:
   - Increment attendance_count if present/late
   - Update attendance_rate
4. Send notifications to absent students (optional)
5. Log attendance session
6. Return success

**Confirmation Dialog** (if not all marked):
```
Còn X học viên chưa được điểm danh.
- Đánh dấu tất cả là "Vắng"
- Bỏ qua và lưu
- Quay lại điểm danh
```

---

#### F. Xuất báo cáo Excel

**Mô tả**: Export attendance data to Excel file

**Input**:
- Class ID
- Date range (optional)
  - Start date
  - End date
  - Or: This week / This month / All time

**Output**:
- Excel file (.xlsx)
- Filename: `DiemDanh_{ClassName}_{DateRange}.xlsx`

**Excel Structure**:

**Sheet 1: Summary (Tổng hợp)**:
| STT | Họ tên | Mã SV | Tổng buổi | Có mặt | Muộn | Vắng | Tỷ lệ |
|-----|--------|-------|-----------|--------|------|------|-------|
| 1   | Nguyễn A | SV001 | 20 | 18 | 1 | 1 | 95% |
| 2   | Trần B | SV002 | 20 | 16 | 2 | 2 | 90% |

**Sheet 2: Detail (Chi tiết theo ngày)**:
- Rows: Students
- Columns: Dates
- Cells: P (Present) / L (Late) / A (Absent)

**Sheet 3: Statistics (Thống kê)**:
- Attendance rate by date
- Chart (if supported)
- Summary metrics

**Business Logic**:
1. Fetch attendance records for class + date range
2. Calculate statistics
3. Generate Excel using library (e.g., ExcelJS)
4. Download file

---

#### G. Xem lịch sử điểm danh

**Mô tả**: Xem các phiên điểm danh đã thực hiện

**Display**:
- Table/List of attendance sessions
- Columns:
  - Ngày
  - Có mặt
  - Muộn
  - Vắng
  - Tỷ lệ
  - Actions (View, Edit, Delete)

**Actions**:
- **View**: Xem chi tiết phiên điểm danh
- **Edit**: Sửa (chỉ trong 24h)
- **Delete**: Xóa (confirm required)

---

#### H. Sửa điểm danh đã lưu

**Mô tả**: Chỉnh sửa điểm danh đã lưu (trong 24 giờ)

**Constraints**:
- Chỉ được sửa trong 24h sau khi lưu
- Sau 24h: Locked, chỉ admin có thể sửa

**Business Logic**:
1. Check edit permission:
   - Time < 24h from created_at → Allow edit
   - Time >= 24h → Show locked message
2. Load existing attendance
3. Allow changes
4. Save với updated_at

**Locked Message**:
```
Phiên điểm danh này đã bị khóa (quá 24 giờ).
Vui lòng liên hệ admin nếu cần chỉnh sửa.
```

---

### 2.2. Chức năng phụ

#### A. Thao tác nhanh (Quick Actions)

**Điểm danh tất cả**:
- Button: "Điểm danh tất cả"
- Action: Mark all students as "Present"
- Use case: Khi tất cả đều có mặt

**Đánh dấu còn lại là vắng**:
- Button: "Còn lại là vắng"
- Action: Mark unmarked students as "Absent"
- Use case: Khi đã điểm danh những người có mặt

**Sao chép từ buổi trước**:
- Button: "Sao chép buổi trước"
- Action: Copy attendance from previous session
- Use case: Tiết kiệm thời gian

---

#### B. Tìm kiếm học viên

**Search Box**:
- Input: Student name or student code
- Real-time filter
- Highlight matching results

**Use Case**:
- Lớp đông học viên (> 30)
- Tìm nhanh học viên cụ thể

---

#### C. Gửi thông báo vắng học

**Auto Notification**:
- Trigger: When attendance saved with absent students
- Recipients: Absent students
- Channel: In-app notification + Email
- Content:
  ```
  Bạn vắng buổi học ngày {date} của lớp {className}.
  Lý do: {reason if any}
  Vui lòng liên hệ giáo viên nếu có thắc mắc.
  ```

**Settings**:
- Teacher can enable/disable auto notification
- Customize message template

---

### 2.3. Chức năng Student

#### A. Xem lịch sử điểm danh cá nhân

**Display**:
- Calendar view with attendance status
- List view with dates
- Stats:
  - Total sessions
  - Present: X times
  - Late: Y times
  - Absent: Z times
  - Attendance rate: A%

**Access**: 
- From Class Detail Page (Student view)
- From Student Dashboard

---

#### B. Xem chi tiết từng buổi

**Info Display**:
- Date
- Status
- Time (if late)
- Reason (if absent)
- Session topic

---

### 2.4. Quyền sử dụng

| Chức năng | Student | Teacher | Admin |
|-----------|---------|---------|-------|
| **Teacher Actions** | | | |
| Select Class for Attendance | ❌ | ✅ (own) | ✅ (all) |
| Take Attendance | ❌ | ✅ (own) | ✅ (all) |
| Save Attendance | ❌ | ✅ (own) | ✅ (all) |
| Edit Attendance (< 24h) | ❌ | ✅ (own) | ✅ (all) |
| Edit Attendance (> 24h) | ❌ | ❌ | ✅ |
| Delete Attendance | ❌ | ✅ (own, confirm) | ✅ (all) |
| Export Excel | ❌ | ✅ (own) | ✅ (all) |
| View Attendance History | ❌ | ✅ (own) | ✅ (all) |
| **Student Actions** | | | |
| View Personal Attendance | ✅ | ✅ | ✅ |
| View Class Attendance Stats | ❌ | ✅ (own) | ✅ (all) |
| **Admin Actions** | | | |
| View All Attendance Data | ❌ | ❌ | ✅ |
| Generate Reports | ❌ | ✅ (own) | ✅ (all) |

---

## 3. Phân tích màn hình UI

### 3.1. Attendance Page - Class Selection View

**File Component**: `/components/teacher/AttendancePage.tsx`

#### Tên màn hình
**Attendance Page - Class Selection / Chọn lớp để điểm danh**

#### Mục đích
Hiển thị danh sách lớp học để giáo viên chọn lớp điểm danh

#### Các thành phần UI

**Header Section**:
- Back button: "← Quay lại"
- Page title: "Điểm danh" (h1)
- Subtitle: "Chọn lớp học để điểm danh"

**Classes Grid** (3 columns on desktop):
Each class card:
- **Header**:
  - Icon: Users (emerald-600, large)
  - Badge: "X sinh viên" (blue-100)
  
- **Content**:
  - Class name (h3)
  - Class info:
    - Calendar icon + "Y buổi học"
  
- **Hover Effect**:
  - Shadow lift
  - Border color change (emerald-500)
  
- **Click**: Navigate to Attendance Form for this class

**Empty State** (no classes):
- Icon: ClipboardCheck
- Title: "Không có lớp học nào"
- Message: "Bạn chưa tạo lớp học nào để điểm danh"
- Button: "Tạo lớp học đầu tiên"

#### Luồng xử lý chính

```
Teacher navigates to Attendance Page
  ↓
Fetch teacher's active classes
  ↓
Display classes as grid
  ↓
Teacher selects a class
  ↓
Set selectedClass state
  ↓
Change view to "attendance" mode
  ↓
Load attendance form for selected class
```

---

### 3.2. Attendance Page - Attendance Form View

#### Tên màn hình
**Attendance Page - Take Attendance / Điểm danh học viên**

#### Mục đích
Điểm danh từng học viên trong lớp đã chọn

#### Các thành phần UI

**Header Section**:
- Back button: "← Quay lại" (to class selection)
- Class name (h1)
- Subtitle: "Điểm danh ngày {selectedDate}"

**Controls Section** (3 columns):

**Column 1: Date Picker**:
- Label: "Ngày điểm danh"
- Input: Date picker
  - Icon: Calendar (left)
  - Default: Today
  - Can select past (max 7 days) or future (max 7 days)

**Column 2: Search**:
- Label: "Tìm kiếm sinh viên"
- Input: Search box
  - Icon: Search (left)
  - Placeholder: "Tìm theo tên hoặc mã SV..."
  - Real-time filter

**Column 3: Quick Actions**:
- Label: "Thao tác nhanh"
- Button: "Điểm danh tất cả"
  - Icon: CheckCircle
  - Color: Emerald
  - Action: Mark all as present

**Stats Cards Row** (4 cards):

**Card 1: Tổng số**:
- Icon: Users (blue)
- Label: "Tổng số"
- Number: X (total students)

**Card 2: Có mặt**:
- Icon: CheckCircle (green)
- Label: "Có mặt"
- Number: Y (present count)
- Color: Green-600

**Card 3: Vắng mặt**:
- Icon: XCircle (red)
- Label: "Vắng mặt"
- Number: Z (absent count)
- Color: Red-600

**Card 4: Đi muộn**:
- Icon: Clock (yellow)
- Label: "Đi muộn"
- Number: W (late count)
- Color: Yellow-600

**Students Table**:
- **Header Row**:
  - Columns: STT | Mã SV | Họ và tên | Trạng thái
  
- **Data Rows**:
  - STT: Row number
  - Mã SV: Student code (text-gray-600)
  - Họ và tên: Full name (text-gray-900)
  - Trạng thái: 3 buttons
    - **Có mặt** button:
      - Text: "Có mặt"
      - Default: bg-gray-100 text-gray-600
      - Selected: bg-green-600 text-white shadow-md
      - Size: px-4 py-2
      - Border-radius: rounded-lg
      
    - **Muộn** button:
      - Text: "Muộn"
      - Default: bg-gray-100 text-gray-600
      - Selected: bg-yellow-600 text-white shadow-md
      
    - **Vắng** button:
      - Text: "Vắng"
      - Default: bg-gray-100 text-gray-600
      - Selected: bg-red-600 text-white shadow-md

**Actions Footer**:
- Left: Button "Xuất Excel"
  - Icon: Download
  - Style: Secondary (border)
  
- Right: Button "Lưu điểm danh"
  - Icon: CheckCircle
  - Style: Primary (emerald-600)
  - Size: Large (px-8 py-3)
  - Disabled: If no student marked

#### Chức năng

1. **Change Date**:
   - Select date → Check existing attendance
   - Load or create new session
   - Reset attendance state

2. **Search Students**:
   - Type query → Filter table real-time
   - Highlight matching text
   - Show "No results" if no match

3. **Mark Attendance**:
   - Click status button
   - Update local state
   - Highlight selected button
   - Update stats cards real-time

4. **Quick Mark All**:
   - Click "Điểm danh tất cả"
   - Set all to "present"
   - Update stats
   - Enable save button

5. **Save Attendance**:
   - Click "Lưu điểm danh"
   - Validate: Check if all marked
   - If not all marked → Show confirmation dialog
   - Call API
   - Show success toast
   - Optional: Send notifications to absent students

6. **Export Excel**:
   - Click "Xuất Excel"
   - Show date range picker modal
   - Generate Excel
   - Download file

#### Luồng xử lý chính

```
Teacher in Attendance Form View
  ↓
Select date (default: today)
  ↓
Check existing attendance for this date:
  ├─ Exists → Load attendance (edit mode)
  │   ├─ Check if < 24h old
  │   ├─ Yes → Allow edit
  │   └─ No → Show "Locked" message
  │
  └─ Not exists → Create new session
      ↓
      Display students table
      ↓
      All students unmarked (null state)
      ↓
      [Teacher marks attendance]
        ├─ Click "Có mặt" for Student A
        ├─ Click "Muộn" for Student B
        ├─ Click "Vắng" for Student C
        └─ Stats update real-time
      ↓
      [Teacher clicks "Lưu điểm danh"]
        ↓
        Validate all students marked?
          ├─ Yes → Save attendance
          │   ├─ POST /api/attendance
          │   ├─ Update stats
          │   ├─ Send notifications (optional)
          │   └─ Show success toast
          │
          └─ No → Show confirmation dialog
              ├─ "Đánh dấu tất cả là Vắng"
              │   └─ Mark remaining → Save
              │
              ├─ "Bỏ qua và lưu"
              │   └─ Save with current state
              │
              └─ "Quay lại điểm danh"
                  └─ Stay in form
```

#### Input / Output

**Page Load**:
```typescript
// When teacher selects class
const classInfo = {
  id: "uuid",
  name: "VSTEP B2 - Lớp Tối",
  students: [
    {
      id: "s1",
      name: "Nguyễn Văn A",
      studentCode: "SV001"
    }
    // ... more students
  ],
  totalSessions: 20
};
```

**Attendance State**:
```typescript
interface AttendanceState {
  [studentId: string]: 'present' | 'late' | 'absent' | null;
}

// Example:
{
  "s1": "present",
  "s2": "late",
  "s3": "absent",
  "s4": null  // Not marked yet
}
```

**Save Attendance Request**:
```typescript
POST /api/classes/{classId}/attendance

{
  "date": "2024-12-15",
  "records": [
    {
      "studentId": "s1",
      "status": "present"
    },
    {
      "studentId": "s2",
      "status": "late",
      "lateMinutes": 15
    },
    {
      "studentId": "s3",
      "status": "absent",
      "reason": "Không phép"
    }
  ]
}
```

**Save Attendance Response**:
```typescript
{
  "success": true,
  "message": "Đã lưu điểm danh thành công!",
  "data": {
    "sessionId": "uuid",
    "classId": "uuid",
    "date": "2024-12-15",
    "stats": {
      "total": 25,
      "present": 23,
      "late": 1,
      "absent": 1,
      "rate": 96.0
    }
  }
}
```

#### Điều hướng

**Từ màn hình này đến**:
- Back to Class Selection (click back button)
- Export Excel Modal (click "Xuất Excel")

**Đến màn hình này từ**:
- Class Selection View (click class card)
- Teacher Dashboard (quick link "Điểm danh")
- Class Detail Page (click "Điểm danh")

---

## 4. User Flow Diagrams

### 4.1. Complete Attendance Flow

```
[Start] Teacher wants to take attendance
  ↓
Navigate to Attendance Page
  ↓
View: Class Selection
  ↓
Display teacher's active classes
  ↓
Teacher clicks a class card
  ↓
Change view to "Attendance Form"
  ↓
Load class students
  ↓
Select date (default: today)
  ↓
Check existing attendance:
  │
  ├─ Exists:
  │   ├─ Load attendance records
  │   ├─ Check if editable (< 24h)
  │   ├─ Populate form with existing data
  │   └─ Show "Edit mode" indicator
  │
  └─ Not exists:
      ├─ Create new attendance session
      └─ All students unmarked
  ↓
Display students table
  ↓
[Teacher marks attendance]
  ├─ Method 1: Individual marking
  │   ├─ Click status button for each student
  │   └─ Stats update real-time
  │
  ├─ Method 2: Quick mark all
  │   ├─ Click "Điểm danh tất cả"
  │   ├─ All set to "present"
  │   └─ Can adjust individual students
  │
  └─ Method 3: Search & mark
      ├─ Search for specific student
      ├─ Mark status
      └─ Clear search, continue
  ↓
[Teacher clicks "Lưu điểm danh"]
  ↓
Frontend validation:
  ├─ All students marked?
  │   └─ Yes → Continue
  │
  └─ No → Show confirmation dialog
      ├─ Option 1: "Đánh dấu tất cả là Vắng"
      ├─ Option 2: "Bỏ qua và lưu"
      └─ Option 3: "Quay lại điểm danh"
  ↓
Call API: POST /api/attendance
  ↓
Backend processing:
  ├─ Validate data
  ├─ Save attendance records
  ├─ Update student stats
  ├─ Calculate attendance rate
  └─ Send notifications to absent students
  ↓
Return success
  ↓
Frontend:
  ├─ Show success toast
  ├─ Reset form (for next session)
  └─ Update stats
  ↓
[End] Attendance saved successfully
```

---

## 5. Sequence Diagrams

### 5.1. Take Attendance Sequence

```
Teacher       Frontend      API Server      Database      Notification
  |               |              |               |               |
  |--Select class>|              |               |               |
  |               |              |               |               |
  |               |--GET /classes/{id}/students->|               |
  |               |              |               |               |
  |               |              |--Query students------------->|
  |               |              |               |               |
  |               |              |<--Students list               |
  |               |              |               |               |
  |               |<--200 OK-----|               |               |
  |               | + students   |               |               |
  |               |              |               |               |
  |<--Display-----|              |               |               |
  |   form        |              |               |               |
  |               |              |               |               |
  |--Mark student>|              |               |               |
  |   attendance  |              |               |               |
  |               |              |               |               |
  |               |--Update----->|               |               |
  |               |  local state |               |               |
  |               |              |               |               |
  |<--Update stats|              |               |               |
  |   real-time   |              |               |               |
  |               |              |               |               |
  |--Click Save-->|              |               |               |
  |               |              |               |               |
  |               |--Validate--->|               |               |
  |               |              |               |               |
  |               |--POST /attendance            |               |
  |               |              |               |               |
  |               |              |--BEGIN TRANSACTION---------->|
  |               |              |               |               |
  |               |              |--INSERT attendance records-->|
  |               |              |               |               |
  |               |              |<--Records saved               |
  |               |              |               |               |
  |               |              |--UPDATE class_students------>|
  |               |              |(stats)        |               |
  |               |              |               |               |
  |               |              |<--Stats updated               |
  |               |              |               |               |
  |               |              |--COMMIT--------------------->|
  |               |              |               |               |
  |               |              |--Create notifications------->|
  |               |              |(for absent)   |               |
  |               |              |               |               |
  |               |              |               |               |----------->
  |               |              |               |               | Send notif
  |               |              |               |               |<-----------
  |               |              |               |               |
  |               |<--201 Created|               |               |
  |               | + session data               |               |
  |               |              |               |               |
  |<--Success-----|              |               |               |
  |   toast       |              |               |               |
  |               |              |               |               |
```

---

## 6. Database Design

### 6.1. Table: attendance_sessions

**Mô tả**: Lưu thông tin các phiên điểm danh

```sql
CREATE TABLE attendance_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES users(id),
  session_date DATE NOT NULL,
  session_number INTEGER,
    -- Buổi thứ mấy trong lớp
  topic VARCHAR(255),
    -- Chủ đề buổi học
  
  -- Stats
  total_students INTEGER NOT NULL,
  present_count INTEGER DEFAULT 0,
  late_count INTEGER DEFAULT 0,
  absent_count INTEGER DEFAULT 0,
  attendance_rate DECIMAL(5,2),
    -- (present + late*0.7) / total * 100
  
  -- Metadata
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_locked BOOLEAN DEFAULT FALSE,
    -- Auto-lock after 24h
  
  UNIQUE(class_id, session_date)
);

-- Indexes
CREATE INDEX idx_attendance_sessions_class_id ON attendance_sessions(class_id);
CREATE INDEX idx_attendance_sessions_date ON attendance_sessions(session_date DESC);
CREATE INDEX idx_attendance_sessions_teacher_id ON attendance_sessions(teacher_id);

-- Trigger to auto-lock after 24h
CREATE OR REPLACE FUNCTION auto_lock_attendance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.created_at < NOW() - INTERVAL '24 hours' THEN
    NEW.is_locked = TRUE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_lock_attendance
  BEFORE UPDATE ON attendance_sessions
  FOR EACH ROW
  EXECUTE FUNCTION auto_lock_attendance();
```

**Quan hệ**:
- N attendance_sessions → 1 class (n-1)
- N attendance_sessions → 1 teacher (n-1)
- 1 attendance_session → N attendance_records (1-n)

---

### 6.2. Table: attendance_records

**Mô tả**: Lưu chi tiết điểm danh từng học viên

```sql
CREATE TABLE attendance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  status VARCHAR(20) NOT NULL,
    -- 'present' | 'late' | 'absent'
  
  -- Additional info for late
  late_minutes INTEGER,
  
  -- Additional info for absent
  absence_reason VARCHAR(50),
    -- 'excused' | 'unexcused'
  absence_note TEXT,
  
  -- Score for calculation
  score DECIMAL(3,2) DEFAULT 0.0,
    -- present: 1.0, late: 0.7, absent: 0.0
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(session_id, student_id)
);

-- Indexes
CREATE INDEX idx_attendance_records_session_id ON attendance_records(session_id);
CREATE INDEX idx_attendance_records_student_id ON attendance_records(student_id);
CREATE INDEX idx_attendance_records_status ON attendance_records(status);

-- Trigger to set score based on status
CREATE OR REPLACE FUNCTION set_attendance_score()
RETURNS TRIGGER AS $$
BEGIN
  CASE NEW.status
    WHEN 'present' THEN NEW.score = 1.0;
    WHEN 'late' THEN NEW.score = 0.7;
    WHEN 'absent' THEN NEW.score = 0.0;
  END CASE;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_attendance_score
  BEFORE INSERT OR UPDATE ON attendance_records
  FOR EACH ROW
  EXECUTE FUNCTION set_attendance_score();
```

**Quan hệ**:
- N attendance_records → 1 attendance_session (n-1)
- N attendance_records → 1 student (users) (n-1)

---

### 6.3. Table: attendance_stats (Materialized View)

**Mô tả**: View tổng hợp thống kê điểm danh

```sql
CREATE MATERIALIZED VIEW attendance_stats AS
SELECT 
  cs.class_id,
  cs.student_id,
  COUNT(ar.id) AS total_sessions,
  SUM(CASE WHEN ar.status = 'present' THEN 1 ELSE 0 END) AS present_count,
  SUM(CASE WHEN ar.status = 'late' THEN 1 ELSE 0 END) AS late_count,
  SUM(CASE WHEN ar.status = 'absent' THEN 1 ELSE 0 END) AS absent_count,
  ROUND(AVG(ar.score) * 100, 2) AS attendance_rate,
  MAX(ases.session_date) AS last_session_date
FROM class_students cs
LEFT JOIN attendance_records ar ON ar.student_id = cs.student_id
LEFT JOIN attendance_sessions ases ON ases.id = ar.session_id AND ases.class_id = cs.class_id
WHERE cs.status = 'active'
GROUP BY cs.class_id, cs.student_id;

-- Index
CREATE UNIQUE INDEX idx_attendance_stats_class_student 
  ON attendance_stats(class_id, student_id);

-- Refresh function
CREATE OR REPLACE FUNCTION refresh_attendance_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY attendance_stats;
END;
$$ LANGUAGE plpgsql;

-- Auto refresh after attendance save (trigger)
CREATE OR REPLACE FUNCTION trigger_refresh_attendance_stats()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM refresh_attendance_stats();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_attendance_save
  AFTER INSERT OR UPDATE OR DELETE ON attendance_records
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_refresh_attendance_stats();
```

---

## 7. API Endpoints

### 7.1. GET /api/classes/:id/students

**Mô tả**: Lấy danh sách học viên trong lớp để điểm danh

**Request**:
```typescript
GET /api/classes/uuid-class-id/students
Authorization: Bearer {token}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "classId": "uuid",
    "className": "VSTEP B2 - Lớp Tối",
    "totalStudents": 25,
    "students": [
      {
        "id": "s1",
        "fullName": "Nguyễn Văn A",
        "studentCode": "SV001",
        "avatar": "https://...",
        "joinedAt": "2024-01-15",
        "attendanceStats": {
          "totalSessions": 18,
          "presentCount": 16,
          "lateCount": 1,
          "absentCount": 1,
          "attendanceRate": 94.4
        }
      }
      // ... more students
    ]
  }
}
```

---

### 7.2. POST /api/attendance

**Mô tả**: Lưu điểm danh cho một buổi học

**Request**:
```typescript
POST /api/attendance
Authorization: Bearer {token}
Content-Type: application/json

{
  "classId": "uuid",
  "sessionDate": "2024-12-15",
  "sessionNumber": 10,
  "topic": "Reading Strategies",
  "records": [
    {
      "studentId": "s1",
      "status": "present"
    },
    {
      "studentId": "s2",
      "status": "late",
      "lateMinutes": 15
    },
    {
      "studentId": "s3",
      "status": "absent",
      "absenceReason": "unexcused"
    }
  ]
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Đã lưu điểm danh thành công!",
  "data": {
    "sessionId": "uuid",
    "classId": "uuid",
    "sessionDate": "2024-12-15",
    "stats": {
      "total": 25,
      "present": 22,
      "late": 2,
      "absent": 1,
      "attendanceRate": 95.2
    },
    "createdAt": "2024-12-15T10:30:00Z"
  }
}
```

**Business Logic**:
1. Validate teacher owns this class
2. Check duplicate session for this date
   - If exists and not locked: Update
   - If exists and locked: Error
   - If not exists: Create new
3. BEGIN TRANSACTION
4. Create/Update attendance_session
5. Delete old attendance_records if updating
6. Insert attendance_records for each student
7. Calculate stats
8. Update class_students stats
9. COMMIT
10. Send notifications to absent students
11. Return success

---

### 7.3. GET /api/attendance

**Mô tả**: Lấy attendance cho một ngày cụ thể

**Request**:
```typescript
GET /api/attendance?classId=uuid&date=2024-12-15
Authorization: Bearer {token}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "sessionId": "uuid",
    "classId": "uuid",
    "sessionDate": "2024-12-15",
    "sessionNumber": 10,
    "topic": "Reading Strategies",
    "isLocked": false,
    "canEdit": true,
    "records": [
      {
        "studentId": "s1",
        "studentName": "Nguyễn Văn A",
        "studentCode": "SV001",
        "status": "present",
        "score": 1.0
      },
      {
        "studentId": "s2",
        "studentName": "Trần Thị B",
        "studentCode": "SV002",
        "status": "late",
        "lateMinutes": 15,
        "score": 0.7
      }
    ],
    "stats": {
      "total": 25,
      "present": 23,
      "late": 1,
      "absent": 1,
      "attendanceRate": 96.0
    }
  }
}
```

**Response** (404 - No attendance):
```json
{
  "success": false,
  "error": {
    "code": "ATTENDANCE_NOT_FOUND",
    "message": "Chưa có điểm danh cho ngày này"
  }
}
```

---

### 7.4. GET /api/attendance/export

**Mô tả**: Export attendance data to Excel

**Request**:
```typescript
GET /api/attendance/export?classId=uuid&startDate=2024-01-01&endDate=2024-12-15
Authorization: Bearer {token}
```

**Response** (200):
```
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="DiemDanh_VSTEPB2_2024-01-01_2024-12-15.xlsx"

[Binary Excel file]
```

**Query Parameters**:
- `classId`: Required, UUID
- `startDate`: Optional, ISO date, default: class start date
- `endDate`: Optional, ISO date, default: today
- `format`: Optional, 'xlsx' | 'csv', default: 'xlsx'

---

## 8. Business Rules

### 8.1. Attendance Status Rules

**Present (Có mặt)**:
- Score: 1.0
- Counted towards attendance rate
- No additional info required

**Late (Muộn)**:
- Score: 0.7
- Counted towards attendance rate (with penalty)
- Optional: Record late minutes
- Late > 30 minutes → Should be marked absent (recommendation)

**Absent (Vắng)**:
- Score: 0.0
- NOT counted towards attendance rate
- Types:
  - Excused (Có phép): Has valid reason
  - Unexcused (Không phép): No reason

---

### 8.2. Edit Permission Rules

**Teacher**:
- Can edit own class attendance
- Can edit within 24 hours of creation
- After 24h: Locked, cannot edit

**Admin**:
- Can edit any attendance
- Can edit even after 24h
- Can unlock attendance for teacher

---

### 8.3. Notification Rules

**Send to absent students**:
- Trigger: When attendance saved with absent status
- Channel: In-app + Email
- Content: Inform about absence, show date and class
- Frequency: Once per session

**Optional settings**:
- Teacher can enable/disable notifications
- Customize notification template
- Send reminder if absent X consecutive times

---

### 8.4. Stats Calculation Rules

**Attendance Rate Formula**:
```
attendance_rate = (present_count + late_count * 0.7) / total_sessions * 100
```

**Example**:
- Total sessions: 20
- Present: 18 times
- Late: 1 time
- Absent: 1 time
- Rate = (18 + 1 * 0.7) / 20 * 100 = 93.5%

**Color Coding**:
- ≥ 90%: Excellent (Green)
- 70-89%: Good (Yellow)
- < 70%: Poor (Red)

---

### 8.5. Date Range Rules

**Past Attendance**:
- Can mark up to 7 days in the past
- Reason: Allow late marking if teacher forgot

**Future Attendance**:
- Can mark up to 7 days in the future
- Reason: Pre-mark for planned absences

**Current Day**:
- Can mark multiple times (update)
- Auto-save draft every minute

---

## Kết thúc Module Attendance

Module này tích hợp chặt chẽ với:
- Module 06: Class Management (lớp học)
- Module 15: Schedule Management (lịch học)
- Module 20: Notification System (thông báo vắng học)
- Module 19: Statistics (báo cáo điểm danh)

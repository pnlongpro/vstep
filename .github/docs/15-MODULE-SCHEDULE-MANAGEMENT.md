# 📅 Module 15: Schedule Management

> **Module quản lý lịch học cho giáo viên và học viên**
> 
> File: `15-MODULE-SCHEDULE-MANAGEMENT.md`  
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
Module Schedule Management cho phép:
- **Giáo viên**: Quản lý lịch học chi tiết cho từng lớp
- **Học viên**: Xem lịch học và nhận thông báo
- **Tự động hóa**: Tạo lịch lặp lại hàng tuần
- **Linh hoạt**: Chỉnh sửa, hủy, hoặc dời lịch dễ dàng

### 1.2. Vai trò sử dụng

**Teacher (Giáo viên)**:
- Xem lịch học của tất cả lớp (tổng hợp)
- Tạo buổi học mới cho lớp cụ thể
- Chỉnh sửa thông tin buổi học
- Hủy hoặc dời buổi học
- Thêm buổi học lặp lại hàng tuần
- Set thời gian, phòng học, link Zoom
- Thêm ghi chú cho buổi học
- Đánh dấu buổi học đã hoàn thành
- Gửi thông báo về thay đổi lịch

**Student (Học viên)**:
- Xem lịch học của các lớp đã tham gia
- Xem chi tiết buổi học (thời gian, phòng, Zoom link)
- Nhận thông báo về lịch học mới/thay đổi
- Thêm vào calendar cá nhân
- Xem lịch sử buổi học đã qua

**Admin**:
- Xem lịch học của tất cả lớp
- Quản lý lịch học (CRUD)
- Giải quyết xung đột lịch học (overlap detection)

### 1.3. Phạm vi module
- Tạo/Sửa/Xóa buổi học
- Lịch lặp lại hàng tuần (recurring schedule)
- 2 chế độ xem: Danh sách (List) và Lịch tháng (Calendar)
- Set thời gian, phòng học, link Zoom cho mỗi buổi
- Đánh dấu trạng thái buổi học (Scheduled/Completed/Cancelled)
- Tích hợp với Attendance (Module 14)
- Gửi thông báo về lịch học

---

## 2. Danh sách chức năng

### 2.1. Chức năng chính - Teacher

#### A. Xem lịch học của lớp

**Mô tả**: Hiển thị lịch học trong tab Schedule của Class Detail Page

**Chế độ xem**:

**1. List View (Danh sách)**:
- Table format
- Columns:
  - Ngày (Date + Day of week)
  - Thời gian (Start time - End time)
  - Chủ đề (Topic)
  - Địa điểm (Room + Zoom link)
  - Điểm danh (Attendance if completed)
  - Trạng thái (Status)
  - Actions (Edit, Delete)
- Sort by date (asc/desc)
- Filter by status

**2. Calendar View (Lịch tháng)**:
- Grid của tháng (7 columns x 5-6 rows)
- Mỗi ngày hiển thị các buổi học
- Color code by status:
  - Scheduled: Blue
  - Completed: Green
  - Cancelled: Red
- Click vào buổi học → View/Edit modal
- Navigate tháng (Previous/Next)
- Highlight hôm nay

**Output**:
- Display schedule sessions
- Stats: Total sessions, Completed, Upcoming
- Quick access to attendance

**Business Logic**:
1. Fetch schedule sessions for class
2. Group by date
3. Calculate stats
4. Render in selected view mode
5. Allow view toggle

---

#### B. Tạo buổi học mới

**Mô tả**: Thêm buổi học vào lịch của lớp

**Input**:
- **Ngày học** (required)
  - Date picker
  - Min: Today
  - Validation: Not in past (warning only)

- **Thời gian** (required)
  - Format: "HH:MM-HH:MM" (e.g., "19:00-21:00")
  - Or: Separate start time + end time pickers
  - Validation: End time > Start time

- **Chủ đề bài học** (required)
  - Text input
  - Placeholder: "VD: Reading Strategies - Skimming & Scanning"
  - Max 255 characters

- **Phòng học** (optional)
  - Text input
  - Placeholder: "VD: A201, Online"

- **Link Zoom** (optional)
  - URL input
  - Validation: Valid URL format
  - Placeholder: "https://zoom.us/j/..."

- **Ghi chú** (optional)
  - Textarea
  - Max 500 characters
  - Placeholder: "Ghi chú thêm về buổi học..."

- **Lặp lại hàng tuần** (checkbox)
  - If checked: Show "Số tuần lặp lại" input
  - Number input: 1-52 weeks
  - Will create multiple sessions (every 7 days)

**Output**:
- Session(s) created
- Appear in schedule view
- Notification sent to students

**Business Logic**:
1. Validate all inputs
2. Check if repeat weekly:
   - Yes: 
     - Get repeat count (N weeks)
     - Create N sessions
     - Each session date = base_date + (i * 7 days)
     - Same time, topic, room, Zoom for all
   - No:
     - Create single session
3. Insert into database
4. Calculate session number (auto-increment per class)
5. Send notification to all students
6. Return success + created session(s)

**Example** (Repeat weekly):
- Base date: 2024-12-16 (Monday)
- Repeat: 4 weeks
- Result: Create 4 sessions
  - 2024-12-16 (Mon)
  - 2024-12-23 (Mon)
  - 2024-12-30 (Mon)
  - 2025-01-06 (Mon)

---

#### C. Chỉnh sửa buổi học

**Mô tả**: Cập nhật thông tin buổi học đã tạo

**Input**:
- Session ID
- Updated fields (any field from Create Session)

**Output**:
- Session updated
- Notification sent if important changes (time, room)

**Business Logic**:
1. Check teacher owns this class
2. Load existing session data
3. Allow edit all fields except date (warning if change date)
4. Update session
5. If important changes:
   - Send notification to students
   - Show "Updated" badge
6. Return success

**Important Changes** (trigger notification):
- Time change
- Date change
- Room change
- Status change to cancelled

---

#### D. Xóa buổi học

**Mô tả**: Xóa buổi học khỏi lịch

**Input**:
- Session ID
- Confirmation

**Output**:
- Session deleted (soft delete)
- Notification sent

**Business Logic**:
1. Check teacher owns this class
2. Show confirmation dialog:
   ```
   Bạn có chắc muốn xóa buổi học này?
   Ngày: {date}
   Chủ đề: {topic}
   
   [Hủy] [Xác nhận xóa]
   ```
3. If confirmed:
   - Soft delete: Set deleted_at = NOW()
   - Keep attendance data if exists
   - Send notification to students
   - Log action
4. Return success

**Alternative**: Mark as "Cancelled" instead of delete

---

#### E. Tạo lịch lặp lại hàng tuần

**Mô tả**: Tạo nhiều buổi học cùng lúc với pattern lặp lại

**Use Case**:
- Lớp học theo lịch cố định (VD: Thứ 2, 4, 6 hàng tuần)
- Tiết kiệm thời gian so với tạo từng buổi

**Input**:
- Base date (ngày đầu tiên)
- Time pattern
- Topic pattern (optional: can vary)
- Number of weeks to repeat
- Days of week (checkbox: Mon, Tue, Wed, Thu, Fri, Sat, Sun)

**Example Form**:
```
Tạo lịch học lặp lại

□ Thứ 2  □ Thứ 3  ☑ Thứ 4  □ Thứ 5  ☑ Thứ 6  □ Thứ 7  □ CN

Thời gian: 19:00 - 21:00
Phòng học: A201
Link Zoom: https://zoom.us/j/123456

Ngày bắt đầu: 2024-12-16
Số tuần: 12

Sẽ tạo: 24 buổi học (2 buổi/tuần x 12 tuần)

[Hủy] [Tạo lịch]
```

**Business Logic**:
1. Validate inputs
2. Calculate all session dates:
   - For each week from 1 to N:
     - For each selected day of week:
       - Calculate date
       - Create session
3. Show preview before confirm
4. Bulk insert sessions
5. Send summary notification
6. Return success + count

**Preview** before create:
```
Xem trước lịch học

Sẽ tạo 24 buổi học:
- 2024-12-16 (Thứ 4) 19:00-21:00
- 2024-12-18 (Thứ 6) 19:00-21:00
- 2024-12-23 (Thứ 4) 19:00-21:00
- ...
(Xem thêm)

[Quay lại] [Xác nhận tạo]
```

---

#### F. Đánh dấu trạng thái buổi học

**Mô tả**: Cập nhật trạng thái của buổi học

**Statuses**:

1. **Scheduled (Đã lên lịch)** - Default:
   - Color: Blue
   - Icon: Calendar
   - Meaning: Planned, not yet happened

2. **Completed (Đã hoàn thành)**:
   - Color: Green
   - Icon: CheckCircle
   - Meaning: Session finished
   - Can view attendance data
   - Cannot edit (locked)

3. **Cancelled (Đã hủy)**:
   - Color: Red
   - Icon: XCircle
   - Meaning: Session cancelled
   - Reason required
   - Notification sent to students

**Actions**:
- Mark as Completed: After session date
- Mark as Cancelled: Anytime, with reason
- Revert to Scheduled: If marked by mistake (< 24h)

**Business Logic**:
1. Check status transition rules:
   - Scheduled → Completed (OK if date passed)
   - Scheduled → Cancelled (OK anytime)
   - Completed → Scheduled (Only < 24h)
   - Cancelled → Scheduled (OK)
2. Update status
3. If Cancelled: Require reason
4. Send notification if status change affects students
5. Return success

---

#### G. Copy link Zoom

**Mô tả**: Quick action để copy Zoom link

**UI**:
- Button "Copy Zoom" next to Zoom link
- Icon: Video + Copy
- Click → Copy to clipboard
- Show toast: "Đã copy link Zoom"

**Business Logic**:
1. Get Zoom link from session
2. Copy to clipboard using navigator.clipboard
3. Show success feedback
4. Optional: Open Zoom link in new tab

---

### 2.2. Chức năng chính - Student

#### A. Xem lịch học

**Mô tả**: Học viên xem lịch các buổi học

**Access Points**:
1. Class Detail Page → Schedule Tab
2. Student Dashboard → "Lịch học hôm nay"
3. Dedicated Schedule Page (all classes)

**Display**:
- List of upcoming sessions
- Past sessions (last 30 days)
- Group by date
- Show: Date, Time, Class, Topic, Room/Zoom

**Features**:
- Filter by class
- Search by topic
- View details modal
- Add to personal calendar (iCal export)

---

#### B. Xem chi tiết buổi học

**Mô tả**: Click vào buổi học để xem đầy đủ thông tin

**Info Display**:
- Class name
- Date + Day of week
- Time (start - end)
- Topic
- Room (if offline)
- Zoom link (if online)
  - Button: "Join Zoom" (opens link)
  - Button: "Copy link"
- Teacher name
- Status
- Notes (if any)
- Attendance status (if completed)

**Actions** (if upcoming):
- Add to calendar
- Set reminder
- View class materials

---

#### C. Nhận thông báo lịch học

**Triggers**:
1. **New session created**: "Buổi học mới được thêm vào lịch"
2. **Session updated**: "Lịch học đã được cập nhật"
3. **Session cancelled**: "Buổi học đã bị hủy"
4. **Reminder**: "Nhắc nhở: Buổi học bắt đầu sau 1 giờ"

**Channels**:
- In-app notification
- Email (if enabled)
- Push notification (future)

---

### 2.3. Chức năng phụ

#### A. Conflict Detection

**Mô tả**: Phát hiện xung đột lịch học

**Scenarios**:
1. Teacher creates overlapping sessions (same time, same teacher)
2. Room booking conflict (same time, same room)
3. Student has 2 classes at same time

**Warning Display**:
```
⚠️ Cảnh báo xung đột lịch

Bạn đã có lịch vào thời gian này:
- Lớp VSTEP B2: 19:00-21:00 (Phòng A201)

Bạn vẫn muốn tạo lịch mới?

[Hủy] [Vẫn tạo]
```

---

#### B. Session Statistics

**Display Stats**:
- Total sessions planned
- Completed sessions
- Cancelled sessions
- Upcoming sessions
- Completion rate
- Average attendance (link to Module 14)

---

#### C. Export Schedule

**Formats**:
1. **Excel**: Download .xlsx file
2. **PDF**: Printable schedule
3. **iCal**: Import to Google Calendar, Outlook, Apple Calendar

**Content**:
- All sessions in date range
- Class info
- Time, room, topic
- Teacher info

---

### 2.4. Quyền sử dụng

| Chức năng | Student | Teacher | Admin |
|-----------|---------|---------|-------|
| **Teacher Actions** | | | |
| View Schedule | ✅ (joined) | ✅ (own) | ✅ (all) |
| Create Session | ❌ | ✅ (own) | ✅ (all) |
| Edit Session | ❌ | ✅ (own) | ✅ (all) |
| Delete Session | ❌ | ✅ (own) | ✅ (all) |
| Mark Status | ❌ | ✅ (own) | ✅ (all) |
| Create Recurring | ❌ | ✅ (own) | ✅ (all) |
| Copy Zoom Link | ✅ | ✅ | ✅ |
| **Student Actions** | | | |
| View Details | ✅ | ✅ | ✅ |
| Add to Calendar | ✅ | ✅ | ✅ |
| Export Schedule | ✅ (own) | ✅ (own) | ✅ (all) |
| **Admin Actions** | | | |
| View All Schedules | ❌ | ❌ | ✅ |
| Resolve Conflicts | ❌ | ❌ | ✅ |

---

## 3. Phân tích màn hình UI

### 3.1. Schedule Manager Component

**File Component**: `/components/teacher/ScheduleManager.tsx`

#### Tên màn hình
**Schedule Manager / Quản lý lịch học**

#### Mục đích
Component trong tab "Schedule" của Class Detail Page để quản lý lịch học

#### Các thành phần UI

**Stats Cards Row** (3 cards):

**Card 1: Tổng số buổi**:
- Icon: Calendar (purple)
- Label: "Tổng số buổi"
- Number: Total sessions count

**Card 2: Đã hoàn thành**:
- Icon: CheckCircle (green)
- Label: "Đã hoàn thành"
- Number: Completed count
- Color: Green-600

**Card 3: Sắp tới**:
- Icon: Clock (blue)
- Label: "Sắp tới"
- Number: Upcoming count
- Color: Blue-600

**View Toggle & Actions**:
- Left side:
  - Button "Danh sách" (default active)
  - Button "Lịch tháng"
  - Toggle between list and calendar view
  
- Right side:
  - Button "Thêm buổi học" (+ icon, purple-600)
  - Opens Add Session Modal

**List View Section**:
- Table with columns:
  - **Ngày**: Date + Day of week
  - **Thời gian**: Start time - End time (with Clock icon)
  - **Chủ đề**: Topic + Notes (truncated)
  - **Địa điểm**: Room (MapPin icon) + Zoom link button
  - **Điểm danh**: Attendance ratio (if completed)
  - **Trạng thái**: Badge (color coded)
  - **Hành động**: Edit + Delete icons
  
- Each row:
  - Hover: Background gray-50
  - Click: Open details modal
  - Action buttons: Visible on hover

- Empty state:
  ```
  Icon: Calendar
  "Chưa có buổi học nào"
  "Thêm buổi học đầu tiên cho lớp này"
  Button: "Thêm buổi học"
  ```

**Calendar View Section**:
- Month navigation:
  - Header: "{Month} {Year}" (center)
  - Button "Previous" (left, ChevronLeft)
  - Button "Next" (right, ChevronRight)
  - Background: Purple-600
  
- Day names row:
  - 7 columns: CN, T2, T3, T4, T5, T6, T7
  - Background: Gray-50
  - Border bottom
  
- Calendar grid (7 columns):
  - Each cell = 1 day
  - Min height: 120px
  - Day number (top-left)
  - Sessions (below day number):
    - Max 2 sessions shown
    - Each session card:
      - Time (HH:MM format)
      - Topic (truncated)
      - Color by status:
        - Scheduled: Blue-100
        - Completed: Green-100
        - Cancelled: Red-100
      - Click: Open details modal
    - If > 2 sessions: "+X buổi nữa"
  
  - Today highlight: Purple-50 background
  - Empty days: Gray-50 background
  - Other month days: Gray-100 background

#### Modal: Add/Edit Session

**Modal Structure**:
- Header:
  - Title: "Thêm buổi học mới" / "Chỉnh sửa buổi học"
  - Close button (X)
  
- Body (2 columns on desktop):
  
  **Column 1**:
  - **Ngày học** (required)
    - Label + red asterisk
    - Date input
    - Min: today
    
  - **Thời gian** (required)
    - Label + red asterisk
    - Text input
    - Placeholder: "VD: 19:00-21:00"
    - Validation: Format HH:MM-HH:MM
  
  **Column 2**:
  - **Chủ đề bài học** (required)
    - Label + red asterisk
    - Text input
    - Placeholder: "VD: Reading Strategies - Skimming & Scanning"
    
  - **Phòng học** (optional)
    - Text input
    - Placeholder: "VD: A201, Online"
    
  - **Link Zoom** (optional)
    - URL input
    - Placeholder: "https://zoom.us/j/..."
  
  **Full Width**:
  - **Ghi chú** (optional)
    - Textarea, 3 rows
    - Placeholder: "Ghi chú thêm về buổi học..."
    - Max 500 chars
  
  **Repeat Section** (only in Add mode):
  - Border top, padding top
  - Checkbox: "Lặp lại hàng tuần"
  - If checked:
    - Number input: "Số tuần lặp lại"
    - Min: 1, Max: 52
    - Helper text: "Sẽ tạo X buổi học liên tiếp cách nhau 7 ngày"

- Footer:
  - Button "Hủy" (left, secondary)
  - Button "Thêm buổi học" / "Cập nhật" (right, purple-600)
  - Loading state: Spinner + disabled

#### Chức năng

1. **Toggle View**:
   - Click "Danh sách" → Show table
   - Click "Lịch tháng" → Show calendar grid
   - Update URL: ?view=list|calendar
   - Persist preference in localStorage

2. **Navigate Calendar**:
   - Click Previous → Load previous month
   - Click Next → Load next month
   - Update sessions for visible month

3. **Add Session**:
   - Click "Thêm buổi học"
   - Open modal
   - Fill form
   - If repeat weekly:
     - Show preview: "Sẽ tạo X buổi học"
   - Submit → API call
   - Success: Close modal, refresh list
   - Error: Show error message

4. **Edit Session**:
   - Click Edit icon (table) or Click session (calendar)
   - Open modal with pre-filled data
   - Modify fields
   - Submit → API call
   - Success: Update display

5. **Delete Session**:
   - Click Delete icon
   - Confirm dialog:
     ```
     Xác nhận xóa
     
     Bạn có chắc muốn xóa buổi học này?
     Ngày: {date}
     Chủ đề: {topic}
     
     [Hủy] [Xóa]
     ```
   - Confirm → API call
   - Success: Remove from list

6. **Copy Zoom Link**:
   - Click "Copy Zoom" button
   - Copy to clipboard
   - Show toast: "Đã copy link Zoom!"

#### Luồng xử lý chính

```
Teacher navigates to Class Detail → Schedule Tab
  ↓
Load ScheduleManager component
  ↓
Fetch schedule data for class
  ↓
Display in default view (List View)
  ↓
[User Actions]
  │
  ├─ Toggle View
  │   ├─ Click "Lịch tháng"
  │   ├─ Re-render with Calendar View
  │   └─ Update preference
  │
  ├─ Add Session
  │   ├─ Click "Thêm buổi học"
  │   ├─ Open modal
  │   ├─ Fill form:
  │   │   ├─ Date (required)
  │   │   ├─ Time (required)
  │   │   ├─ Topic (required)
  │   │   ├─ Room (optional)
  │   │   ├─ Zoom (optional)
  │   │   ├─ Notes (optional)
  │   │   └─ Repeat weekly? (checkbox)
  │   ├─ If repeat:
  │   │   ├─ Input weeks count
  │   │   └─ Show preview
  │   ├─ Click "Thêm buổi học"
  │   ├─ Validate form
  │   ├─ POST /api/classes/{id}/schedule
  │   ├─ Backend:
  │   │   ├─ Validate data
  │   │   ├─ If repeat: Generate multiple sessions
  │   │   ├─ Insert into database
  │   │   ├─ Send notifications
  │   │   └─ Return created sessions
  │   ├─ Success:
  │   │   ├─ Close modal
  │   │   ├─ Show toast
  │   │   ├─ Add to schedule list
  │   │   └─ Update stats
  │   └─ Error:
  │       └─ Show error message
  │
  ├─ Edit Session
  │   ├─ Click Edit icon
  │   ├─ Open modal with data
  │   ├─ Modify fields
  │   ├─ Submit
  │   ├─ PUT /api/schedule/{sessionId}
  │   ├─ Success: Update display
  │   └─ Error: Show error
  │
  └─ Delete Session
      ├─ Click Delete icon
      ├─ Confirm dialog
      ├─ DELETE /api/schedule/{sessionId}
      ├─ Success: Remove from list
      └─ Error: Show error
```

#### Input / Output

**Component Props**:
```typescript
interface ScheduleManagerProps {
  classInfo: {
    id: string;
    name: string;
    totalStudents: number;
    level: string;
  };
  scheduleData: ScheduleSession[];
}
```

**ScheduleSession Type**:
```typescript
interface ScheduleSession {
  id: number;
  date: string;           // "DD/MM/YYYY"
  day: string;            // "Thứ 2", "Thứ 3", ...
  time: string;           // "19:00-21:00"
  topic: string;
  status: 'completed' | 'upcoming' | 'cancelled';
  attendance?: number;    // Only if completed
  total: number;          // Total students
  zoomLink?: string;
  room?: string;
  notes?: string;
}
```

**Add Session Request**:
```typescript
POST /api/classes/{classId}/schedule

{
  "date": "2024-12-16",
  "time": "19:00-21:00",
  "topic": "Reading Strategies",
  "room": "A201",
  "zoomLink": "https://zoom.us/j/123456",
  "notes": "Mang theo sách giáo khoa",
  "repeatWeekly": true,
  "repeatCount": 4
}
```

**Add Session Response**:
```typescript
{
  "success": true,
  "message": "Đã tạo 4 buổi học thành công",
  "data": {
    "sessions": [
      {
        "id": 1,
        "classId": "uuid",
        "date": "16/12/2024",
        "day": "Thứ 2",
        "time": "19:00-21:00",
        "topic": "Reading Strategies",
        "status": "upcoming",
        "room": "A201",
        "zoomLink": "https://zoom.us/j/123456",
        "notes": "Mang theo sách giáo khoa"
      },
      // ... 3 more sessions
    ]
  }
}
```

---

## 4. User Flow Diagrams

### 4.1. Create Single Session Flow

```
[Start] Teacher wants to add session
  ↓
Navigate to Class Detail → Schedule Tab
  ↓
Click "Thêm buổi học"
  ↓
Open Add Session Modal
  ↓
Fill form:
  ├─ Select date
  ├─ Enter time (19:00-21:00)
  ├─ Enter topic
  ├─ Enter room (optional)
  ├─ Enter Zoom link (optional)
  └─ Enter notes (optional)
  ↓
Repeat weekly? → No
  ↓
Click "Thêm buổi học"
  ↓
Frontend validation
  ↓
  ├─ Invalid → Show errors → Stay in form
  │
  └─ Valid → POST /api/classes/{id}/schedule
      ↓
      Backend validation
      ↓
      Create session:
        ├─ Calculate session number
        ├─ Get day of week name
        ├─ Insert into database
        ├─ Send notification to students
        └─ Return session data
      ↓
      Frontend:
        ├─ Close modal
        ├─ Show success toast
        ├─ Add session to list/calendar
        └─ Update stats
      ↓
      [End] Session created
```

### 4.2. Create Recurring Sessions Flow

```
[Start] Teacher wants to create recurring schedule
  ↓
Navigate to Class Detail → Schedule Tab
  ↓
Click "Thêm buổi học"
  ↓
Open Add Session Modal
  ↓
Fill form:
  ├─ Select date (base date)
  ├─ Enter time
  ├─ Enter topic
  ├─ Enter room
  ├─ Enter Zoom link
  └─ Enter notes
  ↓
Check "Lặp lại hàng tuần" ✓
  ↓
Input "Số tuần lặp lại": 4
  ↓
Show preview:
  "Sẽ tạo 4 buổi học liên tiếp cách nhau 7 ngày"
  ↓
Click "Thêm buổi học"
  ↓
Frontend validation
  ↓
  └─ Valid → POST /api/classes/{id}/schedule
      ↓
      Backend processing:
        ├─ Validate data
        ├─ Calculate dates:
        │   ├─ Session 1: base_date
        │   ├─ Session 2: base_date + 7 days
        │   ├─ Session 3: base_date + 14 days
        │   └─ Session 4: base_date + 21 days
        ├─ Bulk insert 4 sessions
        ├─ Send summary notification
        └─ Return all sessions
      ↓
      Frontend:
        ├─ Close modal
        ├─ Show toast: "Đã tạo 4 buổi học"
        ├─ Add all sessions to list/calendar
        └─ Update stats
      ↓
      [End] 4 sessions created
```

### 4.3. Edit Session Flow

```
[Start] Teacher wants to edit session
  ↓
View Schedule (List or Calendar)
  ↓
Locate session to edit
  ↓
Click Edit icon (List) or Click session card (Calendar)
  ↓
Open Edit Session Modal
  ↓
Modal pre-filled with existing data:
  ├─ Date
  ├─ Time
  ├─ Topic
  ├─ Room
  ├─ Zoom link
  └─ Notes
  ↓
Modify fields (any field)
  ↓
Click "Cập nhật"
  ↓
Frontend validation
  ↓
  └─ Valid → PUT /api/schedule/{sessionId}
      ↓
      Backend:
        ├─ Validate data
        ├─ Check teacher owns class
        ├─ Update session
        ├─ Detect important changes:
        │   ├─ Time changed?
        │   ├─ Date changed?
        │   └─ Room changed?
        ├─ If important change:
        │   └─ Send notification to students
        └─ Return updated session
      ↓
      Frontend:
        ├─ Close modal
        ├─ Show toast: "Đã cập nhật buổi học"
        ├─ Update session in list/calendar
        └─ Refresh if needed
      ↓
      [End] Session updated
```

### 4.4. Delete Session Flow

```
[Start] Teacher wants to delete session
  ↓
View Schedule
  ↓
Locate session to delete
  ↓
Click Delete icon
  ↓
Show confirmation dialog:
  ┌─────────────────────────────────┐
  │  Xác nhận xóa                   │
  │                                  │
  │  Bạn có chắc muốn xóa buổi học? │
  │  Ngày: 16/12/2024               │
  │  Chủ đề: Reading Strategies     │
  │                                  │
  │  [Hủy]  [Xóa]                   │
  └─────────────────────────────────┘
  ↓
User choice:
  ├─ Cancel → Close dialog → [End]
  │
  └─ Confirm → DELETE /api/schedule/{sessionId}
      ↓
      Backend:
        ├─ Validate teacher owns class
        ├─ Soft delete: Set deleted_at = NOW()
        ├─ Keep attendance if exists
        ├─ Send notification to students
        ├─ Log action
        └─ Return success
      ↓
      Frontend:
        ├─ Close dialog
        ├─ Show toast: "Đã xóa buổi học"
        ├─ Remove session from list/calendar
        └─ Update stats (-1)
      ↓
      [End] Session deleted
```

---

## 5. Sequence Diagrams

### 5.1. Create Recurring Sessions Sequence

```
Teacher      Frontend       API Server      Database      Notification
  |              |               |               |               |
  |--Fill form-->|               |               |               |
  | + repeat=4   |               |               |               |
  |              |               |               |               |
  |--Submit----->|               |               |               |
  |              |               |               |               |
  |              |--Validate---->|               |               |
  |              |               |               |               |
  |              |--POST /schedule               |               |
  |              |               |               |               |
  |              |               |--Calculate dates------------>|
  |              |               |(4 sessions)   |               |
  |              |               |               |               |
  |              |               |--BEGIN TRANSACTION---------->|
  |              |               |               |               |
  |              |               |--INSERT session 1----------->|
  |              |               |               |               |
  |              |               |--INSERT session 2----------->|
  |              |               |               |               |
  |              |               |--INSERT session 3----------->|
  |              |               |               |               |
  |              |               |--INSERT session 4----------->|
  |              |               |               |               |
  |              |               |<--4 sessions created---------|
  |              |               |               |               |
  |              |               |--COMMIT--------------------->|
  |              |               |               |               |
  |              |               |--Get class students--------->|
  |              |               |               |               |
  |              |               |<--Students list--------------|
  |              |               |               |               |
  |              |               |--Create notification-------->|
  |              |               |               |               |
  |              |               |               |               |----------->
  |              |               |               |               | Send notif
  |              |               |               |               | to students
  |              |               |               |               |<-----------
  |              |               |               |               |
  |              |<--201 Created-|               |               |
  |              | + 4 sessions  |               |               |
  |              |               |               |               |
  |<--Success----|               |               |               |
  | toast        |               |               |               |
  |              |               |               |               |
  |<--Display----|               |               |               |
  |   sessions   |               |               |               |
  |              |               |               |               |
```

---

## 6. Database Design

### 6.1. Table: class_schedule

**Mô tả**: Lưu lịch học chi tiết của lớp

```sql
CREATE TABLE class_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  
  -- Session info
  session_number INTEGER NOT NULL,
    -- Buổi thứ mấy trong lớp (1, 2, 3, ...)
  session_date DATE NOT NULL,
  day_of_week VARCHAR(20),
    -- "Thứ 2", "Thứ 3", ..., "Chủ nhật"
  
  -- Time
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  
  -- Content
  topic VARCHAR(255),
  description TEXT,
  
  -- Location
  room VARCHAR(100),
  zoom_link VARCHAR(500),
  
  -- Status
  status VARCHAR(20) DEFAULT 'scheduled',
    -- 'scheduled' | 'completed' | 'cancelled'
  cancellation_reason TEXT,
  
  -- Metadata
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  
  -- Attendance link
  attendance_session_id UUID REFERENCES attendance_sessions(id)
);

-- Indexes
CREATE INDEX idx_class_schedule_class_id ON class_schedule(class_id);
CREATE INDEX idx_class_schedule_date ON class_schedule(session_date);
CREATE INDEX idx_class_schedule_status ON class_schedule(status);
CREATE INDEX idx_class_schedule_created_by ON class_schedule(created_by);

-- Unique constraint: One session per class per date
CREATE UNIQUE INDEX idx_class_schedule_class_date 
  ON class_schedule(class_id, session_date) 
  WHERE deleted_at IS NULL;

-- Trigger to update updated_at
CREATE TRIGGER update_class_schedule_updated_at
  BEFORE UPDATE ON class_schedule
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to set day_of_week automatically
CREATE OR REPLACE FUNCTION set_day_of_week()
RETURNS TRIGGER AS $$
BEGIN
  NEW.day_of_week = CASE EXTRACT(DOW FROM NEW.session_date)
    WHEN 0 THEN 'Chủ nhật'
    WHEN 1 THEN 'Thứ 2'
    WHEN 2 THEN 'Thứ 3'
    WHEN 3 THEN 'Thứ 4'
    WHEN 4 THEN 'Thứ 5'
    WHEN 5 THEN 'Thứ 6'
    WHEN 6 THEN 'Thứ 7'
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_day_of_week
  BEFORE INSERT OR UPDATE ON class_schedule
  FOR EACH ROW
  EXECUTE FUNCTION set_day_of_week();
```

**Quan hệ**:
- N class_schedule → 1 class (n-1)
- N class_schedule → 1 creator (users) (n-1)
- 1 class_schedule → 1 attendance_session (1-1, optional)

---

### 6.2. View: upcoming_sessions

**Mô tả**: View để dễ query sessions sắp tới

```sql
CREATE VIEW upcoming_sessions AS
SELECT 
  cs.*,
  c.name AS class_name,
  c.level AS class_level,
  u.full_name AS teacher_name,
  c.current_students,
  EXTRACT(EPOCH FROM (session_date - CURRENT_DATE)) / 86400 AS days_until
FROM class_schedule cs
JOIN classes c ON c.id = cs.class_id
JOIN users u ON u.id = c.teacher_id
WHERE cs.status = 'scheduled'
  AND cs.session_date >= CURRENT_DATE
  AND cs.deleted_at IS NULL
ORDER BY cs.session_date, cs.start_time;
```

---

## 7. API Endpoints

### 7.1. GET /api/classes/:id/schedule

**Mô tả**: Lấy lịch học của lớp

**Request**:
```typescript
GET /api/classes/uuid-class-id/schedule?status=all&sort=date_asc
Authorization: Bearer {token}
```

**Query Parameters**:
- `status`: Optional ('all' | 'scheduled' | 'completed' | 'cancelled')
- `sort`: Optional ('date_asc' | 'date_desc')
- `startDate`: Optional, ISO date
- `endDate`: Optional, ISO date

**Response** (200):
```json
{
  "success": true,
  "data": {
    "classId": "uuid",
    "className": "VSTEP B2 - Lớp Tối",
    "sessions": [
      {
        "id": "uuid",
        "sessionNumber": 10,
        "sessionDate": "16/12/2024",
        "dayOfWeek": "Thứ 2",
        "startTime": "19:00",
        "endTime": "21:00",
        "time": "19:00-21:00",
        "topic": "Reading Strategies - Skimming & Scanning",
        "room": "A201",
        "zoomLink": "https://zoom.us/j/123456",
        "status": "scheduled",
        "notes": "Mang theo sách giáo khoa",
        "attendance": null,
        "totalStudents": 25,
        "createdBy": {
          "id": "uuid",
          "fullName": "Nguyễn Văn A"
        },
        "createdAt": "2024-12-10T10:00:00Z"
      }
      // ... more sessions
    ],
    "stats": {
      "total": 30,
      "completed": 15,
      "scheduled": 14,
      "cancelled": 1
    }
  }
}
```

---

### 7.2. POST /api/classes/:id/schedule

**Mô tả**: Tạo buổi học mới (single hoặc recurring)

**Request** (Single):
```typescript
POST /api/classes/uuid-class-id/schedule
Authorization: Bearer {token}
Content-Type: application/json

{
  "date": "2024-12-16",
  "time": "19:00-21:00",
  "topic": "Reading Strategies",
  "room": "A201",
  "zoomLink": "https://zoom.us/j/123456",
  "notes": "Mang theo sách giáo khoa"
}
```

**Request** (Recurring):
```typescript
{
  "date": "2024-12-16",
  "time": "19:00-21:00",
  "topic": "Reading Strategies",
  "room": "A201",
  "zoomLink": "https://zoom.us/j/123456",
  "notes": "",
  "repeatWeekly": true,
  "repeatCount": 4
}
```

**Response** (201 - Single):
```json
{
  "success": true,
  "message": "Đã tạo buổi học thành công",
  "data": {
    "session": {
      "id": "uuid",
      "classId": "uuid",
      "sessionNumber": 16,
      "sessionDate": "16/12/2024",
      "dayOfWeek": "Thứ 2",
      "time": "19:00-21:00",
      "topic": "Reading Strategies",
      "room": "A201",
      "zoomLink": "https://zoom.us/j/123456",
      "status": "scheduled",
      "notes": "Mang theo sách giáo khoa"
    }
  }
}
```

**Response** (201 - Recurring):
```json
{
  "success": true,
  "message": "Đã tạo 4 buổi học thành công",
  "data": {
    "sessions": [
      {
        "id": "uuid-1",
        "sessionDate": "16/12/2024",
        "dayOfWeek": "Thứ 2",
        ...
      },
      {
        "id": "uuid-2",
        "sessionDate": "23/12/2024",
        "dayOfWeek": "Thứ 2",
        ...
      },
      {
        "id": "uuid-3",
        "sessionDate": "30/12/2024",
        "dayOfWeek": "Thứ 2",
        ...
      },
      {
        "id": "uuid-4",
        "sessionDate": "06/01/2025",
        "dayOfWeek": "Thứ 2",
        ...
      }
    ],
    "count": 4
  }
}
```

**Validation**:
- `date`: Required, ISO date, >= today (warning if past)
- `time`: Required, format "HH:MM-HH:MM"
- `topic`: Required, max 255 chars
- `room`: Optional, max 100 chars
- `zoomLink`: Optional, valid URL
- `notes`: Optional, max 500 chars
- `repeatWeekly`: Optional, boolean
- `repeatCount`: Required if repeatWeekly, 1-52

**Business Logic**:
1. Validate inputs
2. Check teacher owns class
3. Parse time string to start_time and end_time
4. If repeatWeekly:
   - Calculate all dates (base + 7*i days)
   - Bulk create sessions
5. Else:
   - Create single session
6. Auto-increment session_number
7. Send notification to students
8. Return created session(s)

---

### 7.3. PUT /api/schedule/:id

**Mô tả**: Cập nhật buổi học

**Request**:
```typescript
PUT /api/schedule/uuid-session-id
Authorization: Bearer {token}
Content-Type: application/json

{
  "time": "19:30-21:30",
  "topic": "Reading Strategies (Updated)",
  "room": "A301",
  "zoomLink": "https://zoom.us/j/654321",
  "notes": "Updated notes"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Đã cập nhật buổi học thành công",
  "data": {
    "session": {
      // Updated session data
    }
  }
}
```

**Business Logic**:
1. Validate inputs
2. Check teacher owns class
3. Detect important changes:
   - Time changed
   - Date changed
   - Room changed
4. Update session
5. If important change:
   - Send notification to students
6. Return updated session

---

### 7.4. DELETE /api/schedule/:id

**Mô tả**: Xóa buổi học

**Request**:
```typescript
DELETE /api/schedule/uuid-session-id
Authorization: Bearer {token}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Đã xóa buổi học thành công"
}
```

**Business Logic**:
1. Check teacher owns class
2. Soft delete: Set deleted_at = NOW()
3. Keep attendance if exists
4. Send notification to students
5. Log action
6. Return success

---

### 7.5. PATCH /api/schedule/:id/status

**Mô tả**: Cập nhật trạng thái buổi học

**Request**:
```typescript
PATCH /api/schedule/uuid-session-id/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "cancelled",
  "reason": "Giáo viên bận đột xuất"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Đã cập nhật trạng thái buổi học",
  "data": {
    "session": {
      "id": "uuid",
      "status": "cancelled",
      "cancellationReason": "Giáo viên bận đột xuất"
    }
  }
}
```

**Allowed Transitions**:
- scheduled → completed
- scheduled → cancelled
- cancelled → scheduled
- completed → scheduled (only < 24h)

---

## 8. Business Rules

### 8.1. Time Validation Rules

**Time Format**:
- Must be "HH:MM-HH:MM" (24-hour format)
- Example: "19:00-21:00", "08:30-10:30"
- End time must be > Start time
- Minimum duration: 30 minutes
- Maximum duration: 8 hours

**Conflict Detection**:
- Check if teacher has another class at same time
- Warning (not blocking):
  ```
  ⚠️ Bạn đã có lịch dạy lớp khác vào thời gian này.
  Lớp: VSTEP C1 - 19:00-21:00
  ```

---

### 8.2. Recurring Schedule Rules

**Repeat Count**:
- Minimum: 1 week
- Maximum: 52 weeks
- Generates: repeat_count × sessions
- All sessions have same time, room, Zoom

**Date Calculation**:
- Base date + (i × 7 days) for i = 0 to (repeat_count - 1)
- Skip holidays (optional feature)
- Avoid date conflicts (check existing sessions)

---

### 8.3. Status Rules

**Scheduled**:
- Default status
- Can be edited
- Can be cancelled
- Students can see details

**Completed**:
- Auto-set after session_date passes (optional)
- Or manually set by teacher
- Linked to attendance session
- Cannot edit time/date
- Can view attendance

**Cancelled**:
- Requires reason
- Notification sent to students
- Cannot take attendance
- Can revert to scheduled

---

### 8.4. Notification Rules

**Send notifications when**:
1. New session created
2. Session time/date changed
3. Session cancelled
4. Reminder before session (1 day, 1 hour)

**Recipients**:
- All active students in class
- Via in-app notification + email

**Content includes**:
- Class name
- Date & time
- Topic
- Room/Zoom link
- Action needed (if any)

---

### 8.5. Access Control Rules

**Teacher**:
- Can manage schedule of own classes only
- Cannot delete session with attendance
- Can edit session < 24h before start time

**Student**:
- Can view schedule of joined classes
- Cannot edit/delete
- Can export personal schedule

**Admin**:
- Can manage all schedules
- Can delete any session
- Can resolve conflicts

---

## Kết thúc Module Schedule Management

Module này tích hợp chặt chẽ với:
- Module 06: Class Management (lớp học)
- Module 14: Attendance System (điểm danh)
- Module 20: Notification System (thông báo lịch học)
- Module 21: Messaging System (tin nhắn về lịch)

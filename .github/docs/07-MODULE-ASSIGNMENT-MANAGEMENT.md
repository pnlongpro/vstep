# 📝 Module 07: Assignment Management

> **Module quản lý bài tập được giao cho học viên**
> 
> File: `07-MODULE-ASSIGNMENT-MANAGEMENT.md`  
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
Module Assignment Management cho phép:
- **Teacher**: Giao bài tập từ ngân hàng đề cho lớp học hoặc học viên cụ thể
- **Teacher**: Tạo bài tập tùy chỉnh (custom exercises)
- **Teacher**: Theo dõi tiến độ làm bài của học viên
- **Teacher**: Chấm bài và cung cấp feedback
- **Student**: Xem bài tập được giao
- **Student**: Làm bài tập và nộp
- **Student**: Xem kết quả và feedback

### 1.2. Vai trò sử dụng

**Teacher (Giáo viên)**:
- Giao bài tập cho lớp học
- Giao bài tập cho học viên cụ thể
- Chọn từ ngân hàng đề hoặc tạo mới
- Set due date (hạn nộp)
- Set grading method (auto/manual)
- Theo dõi tiến độ làm bài
- Chấm bài và feedback
- Xem báo cáo thống kê

**Student (Học viên)**:
- Xem danh sách bài tập được giao
- Filter theo status (chưa làm/đang làm/đã nộp)
- Làm bài tập
- Nộp bài
- Xem kết quả và feedback
- Redo bài tập (nếu teacher cho phép)

**Admin**:
- Xem tất cả assignments
- Quản lý assignments

### 1.3. Loại bài tập

**From Exercise Bank** (Từ ngân hàng):
- Teacher chọn exercises có sẵn
- Có đáp án và auto-grading
- Tiết kiệm thời gian

**Custom Assignment** (Tự tạo):
- Teacher tự tạo đề bài
- Tự định dạng câu hỏi
- Chấm manual hoặc tự set đáp án

### 1.4. Phạm vi module
- Assignment Creator (tạo bài tập)
- Assignment List (danh sách bài tập)
- Assignment Detail (chi tiết bài tập)
- Student Assignments (bài tập của học viên)
- Grading Interface (chấm bài)
- Progress Tracking (theo dõi tiến độ)

---

## 2. Danh sách chức năng

### 2.1. Chức năng chính - Teacher

#### A. Tạo bài tập mới (Create Assignment)

**Mô tả**: Giáo viên tạo bài tập mới để giao cho lớp/học viên

**Component**: `/components/teacher/AssignmentCreator.tsx`

**Steps**:

**Step 1: Chọn nguồn bài tập**:
- **Option 1**: "Chọn từ ngân hàng đề"
  - Browse exercises có sẵn
  - Filter by skill, level, type
  - Preview exercise
  - Select 1 or multiple exercises
  
- **Option 2**: "Tạo bài tập mới"
  - Tự tạo đề bài custom
  - Định dạng câu hỏi
  - Set đáp án (nếu auto-grading)

**Step 2: Cấu hình bài tập**:
- **Assignment Title**: Tên bài tập (required)
- **Description**: Mô tả, hướng dẫn (optional)
- **Skill**: Reading/Listening/Writing/Speaking (auto nếu chọn từ bank)
- **Assign To**:
  - Option 1: Whole class (toàn lớp)
  - Option 2: Specific students (chọn học viên cụ thể)
- **Due Date**: Hạn nộp (required)
- **Due Time**: Giờ nộp (optional, default: 23:59)
- **Settings**:
  - Allow late submission (cho nộp muộn)
  - Allow multiple attempts (cho làm lại)
  - Max attempts (số lần tối đa)
  - Show answers after submission (hiện đáp án sau nộp)
  - Auto-grading (tự động chấm) hoặc Manual grading (chấm tay)

**Step 3: Review & Publish**:
- Review all settings
- Preview bài tập
- Confirm
- Publish → Send notifications to students

**Business Logic**:
1. Validate inputs
2. If from bank: Link to exercise_id
3. If custom: Create new exercise record
4. Create assignment record
5. Create assignment_students records (1 per student)
6. Send notifications to assigned students
7. Return success

**Error Handling**:
- No students selected → "Vui lòng chọn ít nhất 1 học viên"
- Due date in past → "Hạn nộp phải là thời điểm trong tương lai"
- No class/students → "Bạn chưa có lớp học hoặc học viên nào"

---

#### B. Giao bài tập từ ngân hàng

**Mô tả**: Chọn exercises có sẵn từ ngân hàng để giao

**Flow**:
1. Click "Giao bài tập" → "Chọn từ ngân hàng"
2. Show Exercise Browser:
   - Filter: Skill, Level, Type
   - Search: By title
   - List: Exercise cards
3. Select exercises (checkbox, can select multiple)
4. Click "Tiếp tục" → Go to Step 2 (Configure)
5. Fill settings
6. Publish

**Features**:
- Can select multiple exercises at once
- Each exercise becomes separate assignment
- Or: Combine into 1 assignment với multiple parts

---

#### C. Tạo bài tập tùy chỉnh

**Mô tả**: Tự tạo đề bài custom

**Component**: Custom Exercise Builder

**Form Fields**:

**Basic Info**:
- Title: Tên bài tập
- Skill: Reading/Listening/Writing/Speaking
- Level: A2/B1/B2/C1
- Time limit: Giới hạn thời gian (optional)

**Content** (depends on skill):

**For Reading**:
- Passage text (rich text editor)
- Questions:
  - Question text
  - Type: Multiple choice / True-False / Fill-in-blank
  - Options (if multiple choice)
  - Correct answer
  - Explanation (optional)
- Add multiple questions

**For Listening**:
- Upload audio file
- Provide transcript (optional)
- Questions: Same as Reading

**For Writing**:
- Task prompt
- Task type: Email/Essay
- Min words required
- Grading criteria

**For Speaking**:
- Questions/Prompts
- Time per question
- Grading criteria

**Save Options**:
- Save to bank (public)
- Save as private (chỉ mình dùng)
- Use immediately (assign now)

**Business Logic**:
1. Build exercise structure
2. Validate content
3. If save to bank: Create exercise record (is_public based on choice)
4. If assign now: Continue to assignment config
5. Return exercise_id

---

#### D. Theo dõi tiến độ bài tập

**Mô tả**: Xem tiến độ làm bài của học viên

**Component**: Assignment Progress Dashboard

**Display**:

**Assignment Card**:
- Title
- Due date (with countdown)
- Assigned to: X students
- Status overview:
  - Not started: Y students
  - In progress: Z students
  - Submitted: W students
  - Graded: V students

**Progress Chart**:
- Pie chart: Status distribution
- Bar chart: Scores distribution

**Student List**:
- Table with columns:
  - Student name
  - Status (Not started/In progress/Submitted/Graded)
  - Score (if graded)
  - Submitted at
  - Late? (if past due date)
  - Actions (View submission, Grade)

**Filters**:
- Status: All/Not started/Submitted/Graded
- Late submissions only
- Sort: Name/Score/Submit time

**Actions**:
- View submission (click row)
- Grade submission (if manual grading)
- Send reminder (to students not started)
- Extend due date

---

#### E. Chấm bài tập

**Mô tả**: Chấm bài và cung cấp feedback

**Component**: Grading Interface

**For Auto-graded (Reading/Listening)**:
- Already graded automatically
- Teacher can review
- Can add additional comments
- Can override score (if needed)

**For Manual-graded (Writing/Speaking)**:

**Display**:
- Student info (name, class)
- Assignment info
- Submission:
  - For Writing: Student's text
  - For Speaking: Audio playback + transcript
- Grading form:
  - Score: Input (0-10)
  - Criteria scores (if applicable):
    - Task Achievement
    - Coherence
    - Vocabulary
    - Grammar
    - (Speaking) Pronunciation
  - Feedback: Textarea
    - Strengths
    - Weaknesses
    - Suggestions
- Actions:
  - Save grade
  - Save as draft (come back later)
  - Next submission (navigate to next student)

**Bulk Grading**:
- Option to grade multiple submissions
- Quick score input
- Bulk feedback templates

**Business Logic**:
1. Load submission
2. Display submission content
3. Teacher reviews and enters scores
4. Save grade to database
5. Update submission status = 'graded'
6. Send notification to student
7. Return success

---

#### F. Quản lý bài tập

**Mô tả**: CRUD operations cho assignments

**Actions**:

**View Assignments**:
- List all assignments (cho teacher)
- Filter: Class, Status, Date range
- Sort: Recent, Due date, Title

**Edit Assignment**:
- Can edit before due date
- Can extend due date
- Can change settings
- Cannot change exercise (if published)

**Delete Assignment**:
- Confirm: "Bạn có chắc muốn xóa? Dữ liệu sẽ mất vĩnh viễn"
- Soft delete: Set deleted_at
- Keep submissions for record

**Duplicate Assignment**:
- Copy assignment
- Assign to different class
- Change due date
- Publish

---

### 2.2. Chức năng chính - Student

#### A. Xem danh sách bài tập được giao

**Mô tả**: Học viên xem tất cả bài tập được giao

**Component**: Student Assignments Page

**Display**:

**Tabs**:
- Chưa làm (Not started)
- Đang làm (In progress)
- Đã nộp (Submitted)
- Tất cả (All)

**Assignment Cards** (in each tab):

Each card:
- **Header**:
  - Assignment title
  - Class name
  - Skill badge (Reading/Listening/...)
  
- **Content**:
  - Description (preview)
  - Details:
    - Due date: "15/12/2024 23:59"
    - Status: Badge (Not started/In progress/Submitted/Graded)
    - Score: (if graded) "8.5/10"
  
- **Footer**:
  - Buttons:
    - Not started: "Bắt đầu làm" (primary)
    - In progress: "Tiếp tục làm" (blue)
    - Submitted (not graded): "Đã nộp" (disabled)
    - Graded: "Xem kết quả" (link)
  
**Overdue Indicator**:
- If past due date and not submitted:
  - Red border
  - Label: "Quá hạn" (red badge)
  - Message: "Hạn nộp đã qua X ngày"

**Due Soon Indicator**:
- If due within 24 hours:
  - Yellow border
  - Label: "Sắp hết hạn" (yellow badge)

**Empty States**:
- Chưa làm: "Không có bài tập chưa làm. Tuyệt vời!"
- Đang làm: "Không có bài tập đang làm"
- Đã nộp: "Chưa nộp bài tập nào"

---

#### B. Làm bài tập

**Mô tả**: Học viên làm bài tập được giao

**Flow**:
1. Click "Bắt đầu làm" on assignment card
2. Navigate to Exercise Interface
3. Load exercise based on assignment type:
   - From bank → Use standard Exercise Interface
   - Custom → Use custom layout
4. Do exercise (same as Practice mode)
5. Submit → Submit to assignment (not just practice)

**Key Differences from Practice**:
- Header shows: "Bài tập: {Assignment Title}"
- Due date displayed
- Submit button: "Nộp bài tập" (not "Nộp bài")
- On submit:
  - Mark assignment_student status = 'submitted'
  - Record submitted_at
  - Check if late
  - Send notification to teacher
  - Navigate to confirmation page

**Confirmation Page** (after submit):
- Icon: Success checkmark
- Title: "Đã nộp bài tập thành công!"
- Info:
  - Assignment: {Title}
  - Submitted at: {DateTime}
  - Status: Waiting for grading / Graded (if auto)
  - Score: (if auto-graded) "8.5/10"
- Button: "Về danh sách bài tập"
- Button: "Xem kết quả" (if graded)

---

#### C. Xem kết quả bài tập

**Mô tả**: Xem điểm và feedback sau khi được chấm

**Component**: Assignment Result Page

**Display** (similar to Practice Result, with additions):

**Assignment Info**:
- Assignment title
- Class name
- Due date
- Submitted at
- Late status (if applicable)

**Score Section**:
- Overall score: "8.5/10"
- Auto-graded: Show immediately
- Manual-graded: Show after teacher grades

**Teacher Feedback** (if manual grading):
- Overall comment
- Criteria scores (if applicable)
- Strengths
- Weaknesses
- Suggestions

**Answer Review** (if allowed by teacher):
- Question-by-question review
- Show correct answers
- Explanations

**Actions**:
- Save result
- Redo assignment (if allowed and within attempts limit)
- Back to assignments

---

### 2.3. Chức năng phụ

#### A. Reminders

**Auto Reminders**:
- 24 hours before due: "Nhắc nhở: Bài tập {title} sắp đến hạn"
- Due date passed (not submitted): "Quá hạn: Bài tập {title}"

**Manual Reminders** (Teacher):
- Send reminder to students not started
- Custom message

---

#### B. Extend Due Date

**Teacher Action**:
- Select assignment
- Click "Extend due date"
- Pick new date/time
- Confirm
- Update assignment
- Send notification to students

---

#### C. Allow Redo

**Teacher Setting**:
- Allow multiple attempts: Yes/No
- Max attempts: 1-10
- Show previous score: Yes/No

**Student Experience**:
- If allowed: Button "Làm lại"
- Can redo until max attempts
- Best score counts (or latest, teacher choice)

---

### 2.4. Quyền sử dụng

| Chức năng | Student | Teacher | Admin |
|-----------|---------|---------|-------|
| **Teacher Actions** | | | |
| Create Assignment | ❌ | ✅ (own classes) | ✅ (all) |
| Edit Assignment | ❌ | ✅ (own) | ✅ (all) |
| Delete Assignment | ❌ | ✅ (own) | ✅ (all) |
| View Progress | ❌ | ✅ (own) | ✅ (all) |
| Grade Submissions | ❌ | ✅ (own) | ✅ (all) |
| Send Reminders | ❌ | ✅ (own) | ✅ (all) |
| **Student Actions** | | | |
| View Assignments | ✅ (assigned) | ✅ | ✅ |
| Do Assignment | ✅ | ✅ | ✅ |
| Submit Assignment | ✅ | ✅ | ✅ |
| View Results | ✅ (own) | ✅ (all in class) | ✅ (all) |
| Redo Assignment | ✅ (if allowed) | ✅ | ✅ |
| **Admin Actions** | | | |
| View All Assignments | ❌ | ❌ | ✅ |
| Manage All Assignments | ❌ | ❌ | ✅ |

---

## 3. Phân tích màn hình UI

### 3.1. Teacher - Assignment Creator

**File**: `/components/teacher/AssignmentCreator.tsx`

#### Tên màn hình
**Assignment Creator / Tạo bài tập mới**

#### Mục đích
Giao diện tạo và cấu hình bài tập mới

#### Các thành phần UI

**Multi-step Form**:

**Step Indicator** (top):
- Step 1: Chọn nguồn (blue if current)
- Step 2: Cấu hình (gray)
- Step 3: Xác nhận (gray)

---

**STEP 1: Chọn nguồn bài tập**

**2 Options Cards**:

**Card 1: Từ ngân hàng đề**:
- Icon: Database (large)
- Title: "Chọn từ ngân hàng đề"
- Description: "Chọn bài tập có sẵn, tiết kiệm thời gian"
- Badge: "Recommended"
- Button: "Chọn"

**Card 2: Tạo mới**:
- Icon: Plus (large)
- Title: "Tạo bài tập mới"
- Description: "Tự tạo đề bài tùy chỉnh"
- Button: "Chọn"

**If選 "Từ ngân hàng đề"**:
- Show Exercise Browser modal
- Filter & search exercises
- Select exercises (multi-select với checkboxes)
- Selected count: "Đã chọn: X bài"
- Button: "Tiếp tục" (disabled nếu chưa chọn)

**If chọn "Tạo mới"**:
- Open Custom Exercise Builder
- Fill form (skill, title, content, questions)
- Button: "Lưu và tiếp tục"

---

**STEP 2: Cấu hình bài tập**

**Form Fields**:

**Section 1: Thông tin cơ bản**:
- **Assignment Title** (text input):
  - Label: "Tên bài tập"
  - Placeholder: "VD: Bài tập Reading Week 1"
  - Required
  - Max 200 chars
  
- **Description** (textarea):
  - Label: "Mô tả và hướng dẫn"
  - Placeholder: "Hướng dẫn làm bài cho học viên..."
  - Optional
  - Rich text editor

**Section 2: Phân công**:
- **Select Class** (dropdown):
  - Label: "Lớp học"
  - Options: List of teacher's classes
  - Required
  
- **Assign To** (radio buttons):
  - Option 1: ⚫ "Toàn bộ lớp" (default)
  - Option 2: ⚪ "Chọn học viên cụ thể"
    - If selected: Show student checklist
    - Multi-select students
    - Search box

**Section 3: Thời hạn**:
- **Due Date** (date picker):
  - Label: "Hạn nộp"
  - Min: Today
  - Required
  
- **Due Time** (time picker):
  - Label: "Giờ"
  - Default: 23:59
  - Optional

**Section 4: Cài đặt**:
- **Settings** (checkboxes):
  - [ ] Cho phép nộp muộn
  - [ ] Cho phép làm lại
    - If checked: Show "Số lần tối đa" (number input, 1-10)
  - [ ] Hiện đáp án sau khi nộp
  
- **Grading Method** (radio):
  - If exercise has answer key:
    - ⚫ Tự động chấm
    - ⚪ Chấm thủ công
  - If no answer key (Writing/Speaking/Custom):
    - Only: ⚫ Chấm thủ công (disabled)

**Navigation**:
- Button: "← Quay lại" (to Step 1)
- Button: "Tiếp tục →" (to Step 3, validate form)

---

**STEP 3: Xác nhận và Publish**

**Review Summary**:

**Bài tập** (exercise info):
- If from bank:
  - Exercises: List selected (title, skill, questions count)
- If custom:
  - Title, Skill, Custom content preview

**Phân công**:
- Class: {ClassName}
- Assign to: "Toàn bộ lớp (25 students)" hoặc "5 học viên đã chọn"

**Thời hạn**:
- Due: "15/12/2024 23:59"
- Countdown: "Còn 5 ngày"

**Cài đặt**:
- List enabled settings với checkmarks

**Actions**:
- Button: "← Quay lại" (to Step 2)
- Button: "Publish bài tập" (primary, large)
  - Loading state: "Đang publish..."

**Success Modal** (after publish):
- Icon: Success checkmark
- Title: "Đã giao bài tập thành công!"
- Info:
  - "Đã gửi thông báo đến 25 học viên"
  - "Bài tập sẽ hiển thị trong danh sách của học viên"
- Actions:
  - Button: "Xem bài tập" (link to assignment detail)
  - Button: "Tạo bài tập mới"
  - Button: "Đóng"

#### Chức năng

1. **Multi-step Navigation**:
   - Progress through 3 steps
   - Can go back
   - Validate before next step

2. **Exercise Selection**:
   - Browse exercises
   - Filter and search
   - Multi-select
   - Preview

3. **Custom Exercise Creation**:
   - Build from scratch
   - Define questions and answers
   - Save to bank or use immediately

4. **Form Validation**:
   - Required fields
   - Date validation
   - Student selection validation

5. **Publish**:
   - Create assignment records
   - Create assignment_students records
   - Send notifications
   - Redirect to success

---

### 3.2. Teacher - Assignments Page

**File**: `/components/teacher/TeacherAssignmentsPage.tsx`

#### Tên màn hình
**Assignments Management / Quản lý bài tập**

#### Mục đích
Xem và quản lý tất cả bài tập đã giao

#### Các thành phần UI

**Header**:
- Title: "Quản lý bài tập"
- Button: "Giao bài tập mới" (+ icon, purple)

**Stats Cards** (4 cards):
1. Total Assignments: X bài
2. Active: Y bài (before due date)
3. Pending Grading: Z bài
4. Completed: W bài

**Tabs**:
- Tất cả
- Đang mở (active)
- Đã đóng (past due)
- Cần chấm (pending grading)

**Assignment Cards Grid** (2 columns):

Each card:
- **Header**:
  - Title
  - Class badge
  - Skill badge
  
- **Content**:
  - Due date (with countdown if active)
  - Assigned: X students
  - Progress:
    - Submitted: Y/X
    - Graded: Z/X
    - Progress bar
  
- **Footer**:
  - Button: "Xem chi tiết"
  - Menu (•••):
    - Edit
    - Duplicate
    - Extend due date
    - Send reminder
    - Delete

**Filters**:
- Class (dropdown)
- Status (dropdown)
- Date range (date pickers)

**Sort**:
- Recent first
- Due date (soonest)
- Title A-Z

#### Chức năng

1. Display all assignments
2. Filter and sort
3. Navigate to detail
4. Quick actions (edit, delete, etc.)

---

### 3.3. Teacher - Assignment Detail & Progress

**File**: `/components/teacher/AssignmentDetailView.tsx`

#### Tên màn hình
**Assignment Detail / Chi tiết bài tập**

#### Mục đích
Xem chi tiết bài tập và tiến độ làm bài

#### Các thành phần UI

**Header**:
- Breadcrumb: "Quản lý bài tập > {Title}"
- Assignment title (h1)
- Due date badge
- Actions:
  - Edit button
  - Extend due date
  - Delete

**Tabs**:

**Tab 1: Overview (Tổng quan)**:

**Assignment Info Card**:
- Description
- Class
- Assigned to: X students
- Due date
- Settings (list enabled features)

**Progress Overview**:
- Stats cards:
  - Not started: X (%)
  - In progress: Y (%)
  - Submitted: Z (%)
  - Graded: W (%)
- Pie chart

**Recent Submissions**:
- List last 5 submissions
- Student name + time + score
- Link: "Xem tất cả →"

**Tab 2: Students (Học viên)**:

**Student Table**:
- Columns:
  - STT
  - Student name
  - Status (badge)
  - Submitted at
  - Late? (if yes, red indicator)
  - Score (if graded)
  - Actions
- Filters:
  - Status (dropdown)
  - Late only (checkbox)
- Actions:
  - View submission
  - Grade (if manual)
  - Send reminder (if not started)

**Tab 3: Grading (Chấm bài)**:

**Only show if manual grading**:
- List of submitted assignments
- Filter: Graded / Not graded
- Bulk grading option
- Click to open grading interface

**Tab 4: Statistics (Thống kê)**:

**Charts**:
- Score distribution (histogram)
- Average score
- Completion rate
- Time to complete (average)

**Insights**:
- "80% học viên đã nộp đúng hạn"
- "Điểm trung bình: 7.5"
- "3 học viên chưa nộp"

#### Chức năng

1. Display assignment info
2. Track student progress
3. Navigate to grading
4. View statistics
5. Quick actions

---

### 3.4. Student - Assignments Page

**File**: `/components/AssignmentsPage.tsx`

#### Tên màn hình
**My Assignments / Bài tập của tôi**

#### Mục đích
Học viên xem tất cả bài tập được giao

#### Các thành phần UI

**Header**:
- Title: "Bài tập của tôi"
- Stats (inline):
  - Chưa làm: X
  - Đang làm: Y
  - Đã nộp: Z

**Tabs**:
- Chưa làm (badge: count)
- Đang làm (badge: count)
- Đã nộp
- Tất cả

**Assignment Cards** (list):

Each card (depends on status):

**Overdue Card** (red border):
- Icon: Alert triangle (red)
- Label: "QUÁ HẠN" (red, bold)
- Title
- Class name
- Due date: "15/12/2024" (crossed out)
- Days overdue: "Quá hạn 2 ngày"
- Button: "Làm ngay" (red, urgent)
- Note: "Vẫn có thể nộp" (if late submission allowed)

**Due Soon Card** (yellow border):
- Label: "SẮP HẾT HẠN" (yellow)
- Title
- Class
- Countdown: "Còn 5 giờ 23 phút"
- Button: "Bắt đầu làm" (yellow)

**Normal Card**:
- Title
- Class name
- Skill badge
- Due date
- Status badge
- Button: "Bắt đầu làm" / "Tiếp tục" / "Xem kết quả"

**Empty States**:
- Chưa làm: "Không có bài tập chưa làm 🎉"
- Đang làm: "Không có bài tập đang làm"
- Đã nộp: "Chưa nộp bài tập nào"

#### Chức năng

1. Display assignments by status
2. Tab navigation
3. Visual indicators (overdue, due soon)
4. Navigate to exercise
5. View results

---

## 4. User Flow Diagrams

### 4.1. Teacher Creates Assignment Flow

```
[Start] Teacher wants to assign homework
  ↓
Navigate to Assignments Page
  ↓
Click "Giao bài tập mới"
  ↓
Open Assignment Creator
  ↓
════════════════════════
STEP 1: Chọn nguồn
════════════════════════
  ↓
Choose source:
  │
  ├─ Option 1: Từ ngân hàng đề
  │   ├─ Open Exercise Browser
  │   ├─ Filter: Skill=Reading, Level=B2
  │   ├─ Browse exercises
  │   ├─ Select 2 exercises (checkbox)
  │   └─ Click "Tiếp tục" → STEP 2
  │
  └─ Option 2: Tạo mới
      ├─ Open Custom Builder
      ├─ Fill: Title, Skill, Questions
      ├─ Set answer key (if auto-grade)
      └─ Click "Lưu và tiếp tục" → STEP 2
  ↓
════════════════════════
STEP 2: Cấu hình
════════════════════════
  ↓
Fill configuration:
  ├─ Title: "Bài tập Reading Week 1"
  ├─ Description: "Đọc và trả lời..."
  ├─ Class: "VSTEP B2 - Lớp Tối"
  ├─ Assign to: "Toàn bộ lớp"
  ├─ Due date: "22/12/2024"
  ├─ Due time: "23:59"
  ├─ Settings:
  │   ├─ ☑ Cho phép làm lại (Max: 2 lần)
  │   └─ ☑ Hiện đáp án sau nộp
  └─ Grading: ⚫ Tự động chấm
  ↓
Click "Tiếp tục" → STEP 3
  ↓
════════════════════════
STEP 3: Xác nhận
════════════════════════
  ↓
Review summary:
  ├─ Exercises: 2 bài Reading
  ├─ Class: VSTEP B2 (25 students)
  ├─ Due: 22/12/2024 23:59
  └─ Settings: Listed
  ↓
Click "Publish bài tập"
  ↓
Backend processing:
  ├─ Create assignment record
  ├─ For each student in class:
  │   └─ Create assignment_student record
  ├─ Send notifications to 25 students
  └─ Return success
  ↓
Show success modal
  ↓
Teacher options:
  ├─ "Xem bài tập" → Assignment detail
  ├─ "Tạo bài tập mới" → New assignment
  └─ "Đóng" → Assignments list
  ↓
[End] Assignment created and assigned
```

### 4.2. Student Does Assignment Flow

```
[Start] Student receives assignment notification
  ↓
Navigate to Assignments Page
  ↓
See assignment card: "Bài tập Reading Week 1"
  ├─ Status: "Chưa làm"
  ├─ Due: "22/12/2024 23:59"
  └─ Class: "VSTEP B2 - Lớp Tối"
  ↓
Click "Bắt đầu làm"
  ↓
Navigate to Exercise Interface
  ↓
Load exercise based on assignment:
  ├─ Exercise from bank → Standard interface
  └─ Custom exercise → Custom layout
  ↓
Display exercise với assignment context:
  ├─ Header: "Bài tập: Reading Week 1"
  ├─ Due date displayed
  └─ Timer (if applicable)
  ↓
Student does exercise:
  ├─ Read passage
  ├─ Answer questions
  └─ Auto-save progress
  ↓
Update assignment_student status: 'in_progress'
  ↓
Student clicks "Nộp bài tập"
  ↓
Show confirmation modal:
  "Bạn có chắc muốn nộp bài?"
  "Bạn đã trả lời 38/40 câu"
  "Còn 2 câu chưa trả lời"
  ↓
Student confirms
  ↓
Submit to assignment:
  ├─ Save final answers
  ├─ Update status: 'submitted'
  ├─ Record submitted_at
  ├─ Check if late (past due date)
  ├─ If auto-grading:
  │   ├─ Grade immediately
  │   ├─ Update score
  │   └─ Status: 'graded'
  └─ If manual grading:
      └─ Status: 'submitted' (wait for teacher)
  ↓
Send notification to teacher
  ↓
Navigate to Confirmation Page
  ↓
Show success:
  ├─ "Đã nộp bài tập thành công!"
  ├─ Submitted at: "15/12/2024 10:30"
  ├─ If auto-graded:
  │   └─ Score: "8.5/10"
  └─ If manual:
      └─ "Đang chờ giáo viên chấm"
  ↓
Student options:
  ├─ "Xem kết quả" (if graded)
  └─ "Về danh sách bài tập"
  ↓
[End] Assignment submitted
```

### 4.3. Teacher Grades Assignment Flow

```
[Start] Teacher wants to grade submissions
  ↓
Navigate to Assignments Page
  ↓
See assignment card với "Pending Grading: 5"
  ↓
Click "Xem chi tiết"
  ↓
Navigate to Assignment Detail
  ↓
Go to "Grading" tab
  ↓
See list of submitted assignments:
  ├─ Student A - Submitted 2 days ago - Not graded
  ├─ Student B - Submitted 1 day ago - Not graded
  └─ ...
  ↓
Click on Student A's submission
  ↓
Open Grading Interface
  ↓
Display:
  ├─ Student info (name, class)
  ├─ Assignment info
  └─ Submission content:
      ├─ For Writing: Student's text
      └─ For Speaking: Audio player + transcript
  ↓
Teacher reviews work
  ↓
Teacher grades:
  ├─ Enter overall score: 8.5
  ├─ Enter criteria scores (if applicable):
  │   ├─ Task Achievement: 8
  │   ├─ Coherence: 9
  │   ├─ Vocabulary: 8
  │   └─ Grammar: 8
  ├─ Write feedback:
  │   ├─ Strengths: "Good structure..."
  │   ├─ Weaknesses: "Some grammar errors..."
  │   └─ Suggestions: "Practice more..."
  └─ Click "Lưu điểm"
  ↓
Save grade to database:
  ├─ Update assignment_student:
  │   ├─ score = 8.5
  │   ├─ status = 'graded'
  │   ├─ feedback = {...}
  │   └─ graded_at = NOW()
  └─ Update assignment stats
  ↓
Send notification to student:
  "Bài tập {title} đã được chấm. Điểm: 8.5/10"
  ↓
Show success toast
  ↓
Teacher options:
  ├─ "Next submission" → Grade next student
  ├─ "Back to list" → Grading list
  └─ Continue grading
  ↓
[End] Assignment graded, student notified
```

---

## 5. Sequence Diagrams

### 5.1. Create Assignment Sequence

```
Teacher   Frontend   API Server   Database   Notification
  |           |           |            |            |
  |--Fill---->|           |            |            |
  | form      |           |            |            |
  |           |           |            |            |
  |--Click--->|           |            |            |
  | Publish   |           |            |            |
  |           |           |            |            |
  |           |--POST /assignments     |            |
  |           |           |            |            |
  |           |           |--BEGIN TRANSACTION---->|
  |           |           |            |            |
  |           |           |--INSERT assignment---->|
  |           |           |            |            |
  |           |           |<--Assignment created   |
  |           |           | + assignment_id        |
  |           |           |            |            |
  |           |           |--Get students in class>|
  |           |           |            |            |
  |           |           |<--Students list (25)   |
  |           |           |            |            |
  |           |           |--FOR EACH student:     |
  |           |           |  INSERT assignment_--->|
  |           |           |  student record        |
  |           |           |            |            |
  |           |           |<--25 records created   |
  |           |           |            |            |
  |           |           |--COMMIT--------------->|
  |           |           |            |            |
  |           |           |--Create notifications->|
  |           |           |(25 students)           |
  |           |           |            |            |
  |           |           |            |            |----------->
  |           |           |            |            | Send notif
  |           |           |            |            |<-----------
  |           |           |            |            |
  |           |<--201-----|            |            |
  |           | Created   |            |            |
  |           |           |            |            |
  |<--Success-|           |            |            |
  |  modal    |           |            |            |
  |           |           |            |            |
```

### 5.2. Submit Assignment Sequence

```
Student  Frontend  API Server  Database  Grading  Notification
  |         |          |           |         |          |
  |--Click->|          |           |         |          |
  | Submit  |          |           |         |          |
  |         |          |           |         |          |
  |         |--POST /assignments/{id}/submit |          |
  |         |          |           |         |          |
  |         |          |--Save submission--->|          |
  |         |          |           |         |          |
  |         |          |<--Submission saved  |          |
  |         |          |           |         |          |
  |         |          |--Update assignment_student---->|
  |         |          | status: submitted   |          |
  |         |          | submitted_at: NOW   |          |
  |         |          |           |         |          |
  |         |          |<--Updated-----------|          |
  |         |          |           |         |          |
  |         |          |--Check if auto-grade---------->|
  |         |          |           |         |          |
  |         |          |--IF auto-grade:     |          |
  |         |          |  Call grading------>|          |
  |         |          |           |         |          |
  |         |          |           |         |--Grade-->|
  |         |          |           |         | (instant)|
  |         |          |           |         |<---------|
  |         |          |           |         |          |
  |         |          |<--Score returned    |          |
  |         |          |           |         |          |
  |         |          |--Update score------>|          |
  |         |          | status: graded      |          |
  |         |          |           |         |          |
  |         |          |--Notify teacher-----|--------->|
  |         |          |           |         |          |
  |         |          |           |         |          |---------->
  |         |          |           |         |          | Send notif
  |         |          |           |         |          |<----------
  |         |          |           |         |          |
  |         |<--200 OK-|           |         |          |
  |         | + score  |           |         |          |
  |         |          |           |         |          |
  |<--Show--|          |           |         |          |
  | result  |          |           |         |          |
  |         |          |           |         |          |
```

---

## 6. Database Design

### 6.1. Table: assignments

**Mô tả**: Lưu thông tin bài tập được giao

```sql
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Teacher & Class
  teacher_id UUID NOT NULL REFERENCES users(id),
  class_id UUID NOT NULL REFERENCES classes(id),
  
  -- Assignment info
  title VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Exercise reference
  exercise_id UUID REFERENCES exercises(id),
    -- NULL if custom assignment
  custom_content JSONB,
    -- Custom exercise content if not from bank
  
  -- Timing
  due_date TIMESTAMP NOT NULL,
  
  -- Settings
  allow_late_submission BOOLEAN DEFAULT FALSE,
  allow_multiple_attempts BOOLEAN DEFAULT FALSE,
  max_attempts INTEGER DEFAULT 1,
  show_answers_after_submit BOOLEAN DEFAULT TRUE,
  grading_method VARCHAR(20) DEFAULT 'auto',
    -- 'auto' | 'manual'
  
  -- Stats (cached)
  total_assigned INTEGER DEFAULT 0,
  total_submitted INTEGER DEFAULT 0,
  total_graded INTEGER DEFAULT 0,
  average_score DECIMAL(5,2),
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_assignments_teacher_id ON assignments(teacher_id);
CREATE INDEX idx_assignments_class_id ON assignments(class_id);
CREATE INDEX idx_assignments_exercise_id ON assignments(exercise_id);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);
CREATE INDEX idx_assignments_created_at ON assignments(created_at DESC);
```

**Quan hệ**:
- N assignments → 1 teacher (users) (n-1)
- N assignments → 1 class (n-1)
- N assignments → 1 exercise (optional) (n-1)
- 1 assignment → N assignment_students (1-n)

---

### 6.2. Table: assignment_students

**Mô tả**: Lưu quan hệ assignment và student (submission)

```sql
CREATE TABLE assignment_students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Status
  status VARCHAR(20) DEFAULT 'not_started',
    -- 'not_started' | 'in_progress' | 'submitted' | 'graded'
  
  -- Submission
  submission_id UUID REFERENCES exercise_submissions(id),
    -- Link to submission in exercise_submissions table
  submitted_at TIMESTAMP,
  is_late BOOLEAN DEFAULT FALSE,
  
  -- Grading
  score DECIMAL(5,2),
  feedback JSONB,
    -- { overall, strengths[], weaknesses[], suggestions[] }
  graded_by UUID REFERENCES users(id),
  graded_at TIMESTAMP,
  
  -- Attempts
  attempt_number INTEGER DEFAULT 1,
  total_attempts INTEGER DEFAULT 0,
  
  -- Metadata
  assigned_at TIMESTAMP DEFAULT NOW(),
  started_at TIMESTAMP,
  
  UNIQUE(assignment_id, student_id, attempt_number)
);

-- Indexes
CREATE INDEX idx_assignment_students_assignment_id ON assignment_students(assignment_id);
CREATE INDEX idx_assignment_students_student_id ON assignment_students(student_id);
CREATE INDEX idx_assignment_students_status ON assignment_students(status);
CREATE INDEX idx_assignment_students_submitted_at ON assignment_students(submitted_at DESC);
```

**Quan hệ**:
- N assignment_students → 1 assignment (n-1)
- N assignment_students → 1 student (users) (n-1)
- N assignment_students → 1 submission (exercise_submissions) (n-1)

---

## 7. API Endpoints

### 7.1. POST /api/assignments

**Mô tả**: Tạo bài tập mới

**Request**:
```typescript
POST /api/assignments
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Bài tập Reading Week 1",
  "description": "Đọc và trả lời câu hỏi...",
  "classId": "uuid-class",
  "exerciseId": "uuid-exercise",  // Or null if custom
  "customContent": null,  // Or JSONB if custom
  "dueDate": "2024-12-22T23:59:00Z",
  "assignTo": "all",  // Or array of student IDs
  "settings": {
    "allowLateSubmission": true,
    "allowMultipleAttempts": true,
    "maxAttempts": 2,
    "showAnswersAfterSubmit": true,
    "gradingMethod": "auto"
  }
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "assignmentId": "uuid",
    "title": "Bài tập Reading Week 1",
    "classId": "uuid-class",
    "totalAssigned": 25,
    "dueDate": "2024-12-22T23:59:00Z",
    "createdAt": "2024-12-15T10:00:00Z"
  }
}
```

**Business Logic**:
1. Validate teacher owns class
2. Create assignment record
3. Get students in class (or specified students)
4. Create assignment_students record for each
5. Send notifications
6. Return success

---

### 7.2. GET /api/assignments (Teacher)

**Mô tả**: Lấy danh sách bài tập của giáo viên

**Request**:
```typescript
GET /api/assignments?classId=uuid&status=active&sort=due_date
Authorization: Bearer {token}
```

**Query Parameters**:
- `classId`: Optional (filter by class)
- `status`: Optional ('active'|'closed'|'pending_grading')
- `sort`: Optional ('recent'|'due_date'|'title')
- `page`: Optional (default: 1)
- `limit`: Optional (default: 20)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "assignments": [
      {
        "id": "uuid",
        "title": "Bài tập Reading Week 1",
        "className": "VSTEP B2 - Lớp Tối",
        "dueDate": "2024-12-22T23:59:00Z",
        "totalAssigned": 25,
        "stats": {
          "notStarted": 5,
          "inProgress": 8,
          "submitted": 10,
          "graded": 2
        },
        "averageScore": 7.5,
        "createdAt": "2024-12-15T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 15,
      "pages": 1
    }
  }
}
```

---

### 7.3. GET /api/assignments/student (Student)

**Mô tả**: Lấy danh sách bài tập của học viên

**Request**:
```typescript
GET /api/assignments/student?status=not_started&sort=due_date
Authorization: Bearer {token}
```

**Query Parameters**:
- `status`: Optional ('not_started'|'in_progress'|'submitted'|'graded'|'all')
- `sort`: Optional ('due_date'|'recent')

**Response** (200):
```json
{
  "success": true,
  "data": {
    "assignments": [
      {
        "id": "uuid",
        "title": "Bài tập Reading Week 1",
        "description": "Đọc và trả lời...",
        "className": "VSTEP B2 - Lớp Tối",
        "teacherName": "Nguyễn Văn A",
        "skill": "reading",
        "dueDate": "2024-12-22T23:59:00Z",
        "isOverdue": false,
        "dueSoon": true,
        "daysUntilDue": 2,
        "status": "not_started",
        "score": null,
        "allowMultipleAttempts": true,
        "maxAttempts": 2,
        "currentAttempt": 0
      }
    ],
    "stats": {
      "notStarted": 5,
      "inProgress": 2,
      "submitted": 3,
      "graded": 8
    }
  }
}
```

---

### 7.4. POST /api/assignments/:id/submit

**Mô tả**: Nộp bài tập

**Request**:
```typescript
POST /api/assignments/uuid-assignment/submit
Authorization: Bearer {token}
Content-Type: application/json

{
  "submissionId": "uuid-submission"  // ID of exercise_submission
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "assignmentStudentId": "uuid",
    "status": "graded",  // or "submitted" if manual grading
    "submittedAt": "2024-12-20T10:30:00Z",
    "isLate": false,
    "score": 8.5,  // if auto-graded
    "attemptNumber": 1
  }
}
```

**Business Logic**:
1. Validate student is assigned this assignment
2. Check due date (mark late if past)
3. Check attempts limit
4. Link submission to assignment
5. Update status = 'submitted'
6. If auto-grading:
   - Get score from submission
   - Update status = 'graded'
7. Send notification to teacher
8. Return result

---

### 7.5. PUT /api/assignments/:assignmentId/students/:studentId/grade

**Mô tả**: Chấm bài tập (manual grading)

**Request**:
```typescript
PUT /api/assignments/uuid-assignment/students/uuid-student/grade
Authorization: Bearer {token}
Content-Type: application/json

{
  "score": 8.5,
  "feedback": {
    "overall": "Good work overall...",
    "strengths": [
      "Clear structure",
      "Good vocabulary"
    ],
    "weaknesses": [
      "Some grammar errors",
      "Weak conclusion"
    ],
    "suggestions": [
      "Practice more complex sentences",
      "Work on conclusion paragraph"
    ]
  },
  "criteriaScores": {
    "taskAchievement": 8,
    "coherence": 9,
    "vocabulary": 8,
    "grammar": 8
  }
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Đã chấm bài thành công",
  "data": {
    "assignmentStudentId": "uuid",
    "status": "graded",
    "score": 8.5,
    "gradedAt": "2024-12-21T14:00:00Z"
  }
}
```

**Business Logic**:
1. Validate teacher owns this assignment
2. Validate assignment_student exists và status='submitted'
3. Update assignment_student:
   - score
   - feedback
   - status = 'graded'
   - graded_by = teacher_id
   - graded_at = NOW()
4. Update assignment stats
5. Send notification to student
6. Return success

---

## 8. Business Rules

### 8.1. Assignment Rules

**Due Date**:
- Must be in future when creating
- Can extend after creation
- Past due: Cannot submit (unless late submission allowed)

**Assignment Scope**:
- Can assign to whole class or specific students
- Once assigned, cannot remove students
- Can add more students later

---

### 8.2. Submission Rules

**Attempts**:
- Default: 1 attempt
- If multiple attempts allowed: Up to max_attempts
- Each attempt creates new assignment_student record
- Best score counts (or latest, configurable)

**Late Submission**:
- If not allowed: Cannot submit after due date
- If allowed: Can submit but marked as late
- Late penalty: Optional (teacher can set, e.g., -10%)

---

### 8.3. Grading Rules

**Auto-grading**:
- Only if exercise has answer key
- Instant grading on submit
- Teacher can override score

**Manual grading**:
- Teacher must grade within reasonable time (recommended: 7 days)
- Student can view submission but not score until graded
- Reminder sent to teacher if not graded after 3 days

---

## Kết thúc Module Assignment Management

Module này tích hợp với:
- Module 02: Practice & Learning (sử dụng exercises)
- Module 06: Class Management (giao cho lớp)
- Module 04: Grading System (chấm điểm)
- Module 19: Statistics (theo dõi tiến độ)
- Module 20: Notification (thông báo deadline, kết quả)

# 🏫 CLASS MANAGEMENT - QUẢN LÝ LỚP HỌC

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
Module Class Management cung cấp các chức năng quản lý lớp học, bao gồm tạo lớp, phân công giáo viên, thêm học viên, theo dõi tiến độ, và quản lý lịch học.

### Phạm vi
- Quản lý thông tin lớp học (CRUD)
- Phân công giáo viên và trợ giảng
- Quản lý danh sách học viên trong lớp
- Theo dõi tiến độ học tập của lớp
- Quản lý lịch học và buổi học
- Thống kê và báo cáo lớp học
- Giao bài tập cho lớp

### Vai trò truy cập
- **Admin**: Full access (CRUD tất cả lớp)
- **Teacher**: Quản lý lớp được phân công, xem lớp khác (read-only)
- **Student**: Chỉ xem lớp mình tham gia (read-only)

---

## Chức năng chi tiết

### 1. Danh sách lớp học (Class List)

#### Hiển thị thông tin
Mỗi class card hiển thị:
- **Tên lớp**: "VSTEP B2 - Batch 2024"
- **Level**: A2, B1, B2, C1
- **Giáo viên**: Avatar + tên
- **Số học viên**: 25/30 (enrolled/capacity)
- **Trạng thái**: Active, Upcoming, Completed, Archived
- **Thời gian**: Start date - End date
- **Progress**: 65% (lessons completed)
- **Lịch học**: Mon, Wed, Fri - 19:00-21:00

#### Tính năng
- **Grid/List view**: Toggle giữa card view và table view
- **Search**: Tìm theo tên lớp, giáo viên
- **Filters**:
  - Level (All/A2/B1/B2/C1)
  - Status (All/Active/Upcoming/Completed)
  - Teacher (Dropdown danh sách giáo viên)
  - Time range (This week/This month/Custom)
- **Sort**: 
  - Newest first
  - Oldest first
  - Most students
  - By progress
- **Pagination**: 12 classes per page

#### Actions
- **View Details**: Xem chi tiết lớp (sidebar)
- **Edit**: Chỉnh sửa thông tin lớp
- **Manage Students**: Quản lý học viên
- **View Schedule**: Xem lịch học
- **Archive**: Lưu trữ lớp đã kết thúc
- **Delete**: Xóa lớp (admin only)

#### Stat Cards (trên đầu page)
1. **Tổng số lớp**
   - Value: 48
   - Change: +8 so với tháng trước
   - Icon: School
   - Color: Blue gradient

2. **Lớp đang hoạt động**
   - Value: 32
   - Percentage: 67%
   - Icon: BookOpen
   - Color: Green gradient

3. **Tổng học viên**
   - Value: 856
   - Average: 26.75 students/class
   - Icon: Users
   - Color: Purple gradient

4. **Tỷ lệ hoàn thành**
   - Value: 89%
   - Trend: +5.2%
   - Icon: TrendingUp
   - Color: Orange gradient

---

### 2. Tạo lớp học mới (Create Class)

#### Form Fields
```typescript
interface CreateClassForm {
  // Basic Info
  name: string; // Required, e.g., "VSTEP B2 - Batch 2024"
  code: string; // Auto-generated hoặc custom, e.g., "VST-B2-2024-01"
  description: string; // Optional
  level: 'A2' | 'B1' | 'B2' | 'C1'; // Required
  
  // Capacity
  maxStudents: number; // Required, default: 30
  minStudents: number; // Optional, default: 5
  
  // Schedule
  startDate: Date; // Required
  endDate: Date; // Required
  duration: number; // In weeks, auto-calculated or manual
  
  // Teacher
  teacherId: string; // Required, select from teacher list
  assistantTeacherIds: string[]; // Optional, multiple assistants
  
  // Time
  schedule: {
    dayOfWeek: number[]; // [1, 3, 5] = Mon, Wed, Fri
    startTime: string; // "19:00"
    endTime: string; // "21:00"
  }[];
  
  // Settings
  status: 'upcoming' | 'active'; // Default: upcoming
  isPublic: boolean; // Public = students can self-enroll
  requireApproval: boolean; // Require teacher approval for enrollment
  
  // Materials
  thumbnail: File; // Optional, class image
  syllabus: File; // Optional, PDF syllabus
}
```

#### Validation Rules
```typescript
{
  name: {
    required: true,
    minLength: 5,
    maxLength: 100
  },
  code: {
    required: true,
    unique: true,
    pattern: /^[A-Z0-9-]+$/
  },
  level: {
    required: true,
    enum: ['A2', 'B1', 'B2', 'C1']
  },
  maxStudents: {
    required: true,
    min: 1,
    max: 100
  },
  minStudents: {
    min: 1,
    lessThan: 'maxStudents'
  },
  startDate: {
    required: true,
    futureDate: true
  },
  endDate: {
    required: true,
    afterField: 'startDate'
  },
  teacherId: {
    required: true,
    exists: 'users.id',
    role: 'Teacher'
  },
  schedule: {
    required: true,
    minItems: 1
  }
}
```

#### Auto-generated Fields
- **Class Code**: `VST-{LEVEL}-{YEAR}-{SEQUENCE}`
  - Example: `VST-B2-2024-15`
- **Duration (weeks)**: Calculated from start/end date
- **Total Sessions**: Based on schedule and duration

#### Process
1. Admin/Teacher clicks "Tạo lớp học"
2. Modal/Page mở với form
3. Fill basic info (name, level, description)
4. Select teacher từ dropdown
5. Set capacity (max/min students)
6. Set schedule:
   - Pick start/end date
   - Add session schedules (days + time)
7. Upload thumbnail và syllabus (optional)
8. Set settings (public, require approval)
9. Preview class info
10. Submit form
11. Validation
12. Create class in DB
13. Send notification to assigned teacher
14. Redirect to class detail page

---

### 3. Chi tiết lớp học (Class Detail Sidebar)

#### Layout
Class Detail Sidebar mở từ bên phải khi click vào class card.

#### Sections

##### 3.1. Header
- Class thumbnail (background)
- Class name
- Level badge
- Status badge
- Edit button (icon)
- Close button

##### 3.2. Basic Info
```typescript
interface ClassBasicInfo {
  code: string;
  name: string;
  level: string;
  description: string;
  teacher: {
    id: string;
    name: string;
    avatar: string;
  };
  assistants: Teacher[];
  startDate: Date;
  endDate: Date;
  duration: string; // "12 tuần"
  schedule: string; // "T2, T4, T6 - 19:00-21:00"
  capacity: string; // "25/30"
  status: string;
}
```

Display:
- Giáo viên: Avatar + Name (clickable to teacher profile)
- Trợ giảng: Avatar list (if any)
- Thời gian: DD/MM/YYYY - DD/MM/YYYY (X tuần)
- Lịch học: Days + Time
- Sĩ số: X/Y học viên (progress bar)

##### 3.3. Progress Chart
Line chart hiển thị tiến độ học tập của lớp theo thời gian:
- X-axis: Weeks (Tuần 1, Tuần 2, ...)
- Y-axis: Completion % (0-100%)
- Line: Average class progress
- Data points: Weekly milestones

```typescript
interface ClassProgress {
  week: number;
  completionRate: number; // 0-100
  averageScore: number; // 0-10
  activeStudents: number;
}
```

##### 3.4. Recent Activities
List 10 hoạt động gần nhất của lớp:
```typescript
interface ClassActivity {
  id: string;
  type: 'student_joined' | 'assignment_created' | 'test_completed' | 'material_uploaded';
  description: string;
  actor: {
    name: string;
    avatar: string;
  };
  timestamp: Date;
  icon: LucideIcon;
  color: string;
}
```

Examples:
- "Nguyễn Văn A đã tham gia lớp" - 2 giờ trước
- "Giáo viên đã tạo bài tập Reading Part 1" - 1 ngày trước
- "15 học viên đã hoàn thành bài kiểm tra" - 2 ngày trước

##### 3.5. Student List in Class
Table hiển thị danh sách học viên:

Columns:
- **Học viên**: Avatar + Name
- **Email**: student@example.com
- **Ngày tham gia**: DD/MM/YYYY
- **Tiến độ**: Progress bar (65%)
- **Điểm TB**: 7.5
- **Trạng thái**: Active/Inactive
- **Actions**: View, Remove

Features:
- Search students
- Sort by name, progress, score
- Filter by status
- Add student button (opens modal)
- Bulk actions (Send message, Remove)

Add Student Modal:
- Search existing users
- Select multiple students
- Send invitation email
- Add immediately or pending approval

##### 3.6. Action Buttons
- **Quản lý học viên**: Open student management
- **Xem lịch học**: Navigate to class schedule
- **Tải tài liệu**: Upload/download class materials
- **Gửi thông báo**: Send notification to all students
- **Chỉnh sửa lớp**: Edit class info
- **Lưu trữ**: Archive class (if completed)
- **Xóa lớp**: Delete class (admin only, with confirmation)

---

### 4. Quản lý học viên trong lớp (Manage Students)

#### 4.1. Thêm học viên (Add Students)

**Method 1: Thêm từ danh sách người dùng có sẵn**

Process:
1. Click "Thêm học viên"
2. Modal mở với search interface
3. Search users by name/email
4. Filter by:
   - Not in class yet
   - Role = Student
   - Status = Active
5. Select multiple students (checkboxes)
6. Click "Thêm vào lớp"
7. Options:
   - Send welcome email
   - Notify teacher
8. Confirm
9. Add students to class
10. Update class count

**Method 2: Gửi link mời (Invitation Link)**

Process:
1. Click "Tạo link mời"
2. Generate unique invitation link
3. Set expiry time (7 days, 30 days, no expiry)
4. Set max uses (unlimited or number)
5. Copy link
6. Share link with students
7. Students click link → Auto enroll or pending approval

**Method 3: Import từ file Excel/CSV**

Format:
```csv
Name,Email,Phone
Nguyen Van A,nguyenvana@example.com,0901234567
Tran Thi B,tranthib@example.com,0907654321
```

Process:
1. Click "Import file"
2. Upload CSV/Excel
3. Preview data
4. Validate (check duplicates, invalid emails)
5. Show errors if any
6. Confirm import
7. Create users if not exist
8. Add to class
9. Send welcome emails

#### 4.2. Xóa học viên khỏi lớp (Remove Student)

Process:
1. Click "Remove" icon on student row
2. Confirmation dialog:
   ```
   Bạn có chắc muốn xóa học viên này khỏi lớp?
   
   Tên: Nguyễn Văn A
   Email: nguyenvana@example.com
   
   Lưu ý: Tiến độ và điểm số sẽ được giữ lại.
   
   [Hủy] [Xóa khỏi lớp]
   ```
3. If confirm:
   - Remove from class_students table
   - Keep progress data (soft delete)
   - Send notification to student
   - Update class count
   - Log activity

#### 4.3. Chuyển lớp (Transfer Student)

Process:
1. Select student
2. Click "Chuyển lớp"
3. Modal with class selection:
   - Show available classes
   - Filter by level
   - Show class capacity
4. Select target class
5. Option: Transfer progress data
6. Confirm
7. Remove from current class
8. Add to new class
9. Notify student and teachers

---

### 5. Lịch học (Class Schedule)

#### 5.1. Calendar View
Display:
- Month view calendar
- Class sessions highlighted
- Different colors for different classes
- Hover to see session details

#### 5.2. Session Details
```typescript
interface ClassSession {
  id: string;
  classId: string;
  sessionNumber: number; // Session 1, 2, 3...
  date: Date;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  
  // Content
  topic: string;
  description: string;
  materials: File[];
  
  // Attendance
  totalStudents: number;
  presentStudents: number;
  absentStudents: number;
  
  // Status
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  
  // Teacher
  teacherId: string;
  
  // Location (for hybrid classes)
  location?: string; // "Room 301" or "Zoom link"
  isOnline: boolean;
}
```

#### 5.3. Create Session
Form:
- Session number (auto-increment)
- Date & time
- Topic
- Description
- Upload materials
- Set location (if offline)
- Zoom/Meet link (if online)

#### 5.4. Take Attendance
- List all students
- Mark as Present/Absent/Late
- Add note for absent students
- Save attendance
- Send notification to absent students

---

### 6. Thống kê lớp học (Class Statistics)

#### Overview Stats
```typescript
interface ClassStats {
  // Enrollment
  totalStudents: number;
  activeStudents: number;
  enrollmentRate: number; // enrolled/capacity %
  
  // Attendance
  averageAttendance: number; // %
  totalSessions: number;
  completedSessions: number;
  
  // Performance
  averageScore: number; // 0-10
  passRate: number; // % students passing
  topPerformers: Student[]; // Top 5
  needHelp: Student[]; // Bottom 5
  
  // Progress
  completionRate: number; // % syllabus completed
  assignmentsCompleted: number;
  totalAssignments: number;
  
  // Engagement
  averageStudyTime: number; // minutes per student
  activeDiscussions: number;
  materialDownloads: number;
}
```

#### Charts

**1. Performance Distribution (Bar Chart)**
- X-axis: Score ranges (0-4, 4-5.5, 5.5-7, 7-8.5, 8.5-10)
- Y-axis: Number of students
- Color: Gradient based on performance

**2. Attendance Trend (Line Chart)**
- X-axis: Sessions
- Y-axis: Attendance %
- Line: Trend over time

**3. Skill Comparison (Radar Chart)**
- 4 axes: Reading, Listening, Writing, Speaking
- Show class average vs target

**4. Progress Timeline (Area Chart)**
- X-axis: Weeks
- Y-axis: Completion %
- Area: Cumulative progress

---

### 7. Giao bài tập cho lớp (Assign Homework)

#### Create Assignment
```typescript
interface ClassAssignment {
  id: string;
  classId: string;
  
  // Info
  title: string;
  description: string;
  type: 'reading' | 'listening' | 'writing' | 'speaking' | 'mixed';
  
  // Content
  exercises: Exercise[]; // Link to exercise IDs
  totalPoints: number;
  passingScore: number;
  
  // Timing
  assignedDate: Date;
  dueDate: Date;
  allowLateSubmission: boolean;
  latePenalty: number; // % deduction
  
  // Settings
  timeLimit?: number; // minutes, null = unlimited
  attempts: number; // 1 = one attempt, -1 = unlimited
  showAnswersAfter: 'submission' | 'due_date' | 'manual';
  
  // Status
  status: 'draft' | 'assigned' | 'due' | 'graded';
}
```

#### Assignment Workflow
1. Teacher creates assignment
2. Select exercises from question bank
3. Set due date and rules
4. Assign to class
5. Students receive notification
6. Students complete assignment
7. Auto-grading (for Reading/Listening)
8. Manual grading (for Writing/Speaking)
9. Release scores
10. Students view results

#### Track Assignment Progress
- Total students: 25
- Submitted: 18 (72%)
- Not submitted: 7 (28%)
- Graded: 15 (60%)
- Pending grading: 3 (12%)
- Average score: 7.8

---

## UI Components

### Component: ClassManagementPage.tsx

#### Structure
```tsx
<ClassManagementPage>
  {/* Header */}
  <PageHeader>
    <h1>Quản lý lớp học</h1>
    <Button onClick={createClass}>Tạo lớp học</Button>
  </PageHeader>

  {/* Stats Cards */}
  <StatsGrid>
    <StatCard title="Tổng số lớp" value={48} change="+8" />
    <StatCard title="Đang hoạt động" value={32} percentage="67%" />
    <StatCard title="Tổng học viên" value={856} />
    <StatCard title="Tỷ lệ hoàn thành" value="89%" />
  </StatsGrid>

  {/* Filters */}
  <FilterBar>
    <SearchInput />
    <FilterDropdown label="Level" options={levels} />
    <FilterDropdown label="Status" options={statuses} />
    <FilterDropdown label="Teacher" options={teachers} />
    <ViewToggle /> {/* Grid/List */}
  </FilterBar>

  {/* Class List */}
  {viewMode === 'grid' ? (
    <ClassGrid>
      {classes.map(class => (
        <ClassCard 
          key={class.id}
          class={class}
          onClick={viewDetails}
        />
      ))}
    </ClassGrid>
  ) : (
    <ClassTable>
      <TableHeader />
      <TableBody>
        {classes.map(class => (
          <ClassRow 
            key={class.id}
            class={class}
            onView={viewDetails}
            onEdit={editClass}
          />
        ))}
      </TableBody>
    </ClassTable>
  )}

  {/* Pagination */}
  <Pagination />

  {/* Class Detail Sidebar */}
  {selectedClass && (
    <ClassDetailSidebar
      class={selectedClass}
      onClose={closeSidebar}
    >
      <ClassHeader />
      <ClassBasicInfo />
      <ProgressChart data={progressData} />
      <RecentActivities activities={activities} />
      <StudentList students={students} />
      <ActionButtons />
    </ClassDetailSidebar>
  )}

  {/* Create/Edit Class Modal */}
  {showClassModal && (
    <ClassModal
      mode={modalMode} // 'create' | 'edit'
      class={editingClass}
      onSubmit={handleSubmit}
      onClose={closeModal}
    />
  )}

  {/* Add Students Modal */}
  {showAddStudentsModal && (
    <AddStudentsModal
      classId={selectedClass.id}
      onAdd={handleAddStudents}
      onClose={closeAddModal}
    />
  )}
</ClassManagementPage>
```

#### Props
```typescript
interface ClassManagementPageProps {
  // No props, standalone page
}
```

#### State
```typescript
const [classes, setClasses] = useState<Class[]>([]);
const [selectedClass, setSelectedClass] = useState<Class | null>(null);
const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
const [filters, setFilters] = useState({
  level: 'all',
  status: 'all',
  teacher: 'all'
});
const [searchQuery, setSearchQuery] = useState('');
const [showClassModal, setShowClassModal] = useState(false);
const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
const [showAddStudentsModal, setShowAddStudentsModal] = useState(false);
```

---

### Component: ClassCard.tsx

```tsx
interface ClassCardProps {
  class: Class;
  onClick: (classId: string) => void;
}

<ClassCard>
  {/* Thumbnail */}
  <div className="relative h-32 bg-gradient">
    <img src={class.thumbnail} />
    <Badge status={class.status} />
  </div>

  {/* Content */}
  <div className="p-4">
    {/* Title */}
    <h3>{class.name}</h3>
    <Badge level={class.level} />

    {/* Teacher */}
    <div className="flex items-center">
      <Avatar src={class.teacher.avatar} />
      <span>{class.teacher.name}</span>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 gap-2">
      <Stat icon={Users} label="Học viên" value={`${class.enrolled}/${class.capacity}`} />
      <Stat icon={Calendar} label="Lịch học" value={class.schedule} />
    </div>

    {/* Progress */}
    <div>
      <span>Tiến độ</span>
      <ProgressBar value={class.progress} />
    </div>

    {/* Actions */}
    <div className="flex gap-2">
      <Button onClick={() => onClick(class.id)}>Xem chi tiết</Button>
      <IconButton icon={Edit} />
      <IconButton icon={MoreVertical} />
    </div>
  </div>
</ClassCard>
```

---

## User Flows

### Flow 1: Admin tạo lớp học mới

```
START
  ↓
Admin clicks "Tạo lớp học" button
  ↓
Create Class Modal opens
  ↓
Admin fills form:
  Step 1: Basic Info
    - Name: "VSTEP B2 - Batch 2024"
    - Level: B2
    - Description: "..."
  ↓
  Step 2: Teacher & Capacity
    - Select teacher from dropdown
    - Add assistant teachers (optional)
    - Max students: 30
    - Min students: 10
  ↓
  Step 3: Schedule
    - Start date: 01/01/2025
    - End date: 31/03/2025
    - Days: Mon, Wed, Fri
    - Time: 19:00 - 21:00
  ↓
  Step 4: Settings
    - Public: Yes
    - Require approval: No
    - Upload thumbnail
    - Upload syllabus
  ↓
Admin reviews summary
  ↓
Admin clicks "Tạo lớp học"
  ↓
Frontend validation
  ├─→ If invalid: Show errors, stay on form
  └─→ If valid: Continue
  ↓
Submit to API: POST /api/classes
  ↓
Backend:
  ├─→ Validate data
  ├─→ Generate class code
  ├─→ Create class record
  ├─→ Create initial stats record
  ├─→ Generate schedule sessions
  ├─→ Send notification to teacher
  └─→ Return success
  ↓
Frontend:
  ├─→ Show success notification
  ├─→ Close modal
  ├─→ Refresh class list
  └─→ Navigate to new class detail
  ↓
END
```

### Flow 2: Teacher xem chi tiết lớp và quản lý học viên

```
START
  ↓
Teacher navigates to Class Management
  ↓
System loads classes where teacher is assigned
  ↓
Display class list (grid view)
  ↓
Teacher clicks on a class card
  ↓
Class Detail Sidebar opens from right
  ↓
System fetches:
  ├─→ GET /api/classes/:id
  ├─→ GET /api/classes/:id/students
  ├─→ GET /api/classes/:id/progress
  └─→ GET /api/classes/:id/activities
  ↓
Display:
  ├─→ Basic info (name, level, schedule)
  ├─→ Progress chart
  ├─→ Recent activities
  └─→ Student list (10 students)
  ↓
Teacher scrolls to Student List section
  ↓
Teacher clicks "Thêm học viên"
  ↓
Add Students Modal opens
  ↓
Teacher searches for students:
  - Type "Nguyen"
  - Filter: Not in class
  - Results: 5 students
  ↓
Teacher selects 2 students (checkboxes)
  ↓
Teacher clicks "Thêm vào lớp"
  ↓
Confirmation:
  "Thêm 2 học viên vào lớp?
  - Nguyễn Văn A
  - Nguyễn Thị B
  
  ☑ Gửi email chào mừng
  ☑ Thông báo cho giáo viên
  
  [Hủy] [Xác nhận]"
  ↓
Teacher confirms
  ↓
API call: POST /api/classes/:id/students
  Body: {
    studentIds: ['uuid1', 'uuid2'],
    sendEmail: true,
    notifyTeacher: true
  }
  ↓
Backend:
  ├─→ Check class capacity (not full)
  ├─→ Check students not already in class
  ├─→ Insert into class_students table
  ├─→ Update class enrolled count
  ├─→ Send welcome emails to students
  ├─→ Send notification to teacher
  ├─→ Log activity
  └─→ Return success
  ↓
Frontend:
  ├─→ Close Add Students Modal
  ├─→ Refresh student list
  ├─→ Show success notification: "Đã thêm 2 học viên"
  └─→ Update class count: 27/30
  ↓
Teacher sees updated student list
  ↓
END
```

### Flow 3: Admin xóa học viên khỏi lớp

```
START
  ↓
Admin opens Class Detail Sidebar
  ↓
Admin scrolls to Student List
  ↓
Admin clicks "Remove" icon on student row
  ↓
Confirmation dialog appears:
  "Bạn có chắc muốn xóa học viên này khỏi lớp?
  
  Lớp: VSTEP B2 - Batch 2024
  Học viên: Nguyễn Văn A
  
  Lưu ý:
  - Học viên sẽ không còn quyền truy cập lớp
  - Tiến độ và điểm số sẽ được giữ lại
  - Có thể thêm lại học viên sau
  
  [Hủy] [Xóa khỏi lớp]"
  ↓
Admin clicks "Xóa khỏi lớp"
  ↓
API call: DELETE /api/classes/:classId/students/:studentId
  ↓
Backend:
  ├─→ Check if student in class
  ├─→ Soft delete from class_students (set removed_at)
  ├─→ Keep progress data
  ├─→ Update class enrolled count
  ├─→ Send notification to student
  ├─→ Log activity: "Admin removed Student X from Class Y"
  └─→ Return success
  ↓
Frontend:
  ├─→ Remove student from list
  ├─→ Update class count: 26/30
  ├─→ Show notification: "Đã xóa học viên khỏi lớp"
  └─→ Close confirmation dialog
  ↓
END
```

### Flow 4: Teacher tạo link mời học viên

```
START
  ↓
Teacher opens Class Detail Sidebar
  ↓
Teacher clicks "Tạo link mời"
  ↓
Create Invitation Modal opens
  ↓
Form:
  - Thời hạn: [Dropdown: 7 ngày / 30 ngày / Không giới hạn]
  - Số lần sử dụng: [Input: 10] (blank = unlimited)
  - Tự động chấp nhận: [Toggle: ON/OFF]
  ↓
Teacher selects:
  - Thời hạn: 30 ngày
  - Số lần: 20
  - Tự động: ON
  ↓
Teacher clicks "Tạo link"
  ↓
API call: POST /api/classes/:id/invitations
  Body: {
    expiresIn: 2592000, // 30 days in seconds
    maxUses: 20,
    autoAccept: true
  }
  ↓
Backend:
  ├─→ Generate unique token (UUID)
  ├─→ Calculate expiry date
  ├─→ Insert into class_invitations table
  ├─→ Generate full URL
  └─→ Return invitation data
  ↓
Frontend displays:
  "Link mời đã được tạo!
  
  Link: https://vstepro.com/join/abc123def456
  
  [Copy link] [Share via email] [Generate QR]
  
  Thông tin:
  - Hết hạn: 10/01/2025
  - Còn lại: 20 lần
  - Tự động chấp nhận: Có"
  ↓
Teacher clicks "Copy link"
  ↓
Link copied to clipboard
  ↓
Show toast: "Đã copy link"
  ↓
Teacher shares link with students (outside system)
  ↓
--- Student side ---
Student receives link via email/message
  ↓
Student clicks link
  ↓
System validates token:
  - Check expiry
  - Check max uses
  - Check class capacity
  ↓
If all valid:
  ├─→ If autoAccept = true:
  │     - Add student to class immediately
  │     - Show success: "Bạn đã tham gia lớp!"
  │     - Redirect to class page
  └─→ If autoAccept = false:
        - Create enrollment request
        - Show: "Yêu cầu tham gia đã được gửi"
        - Wait for teacher approval
  ↓
END
```

### Flow 5: Theo dõi tiến độ lớp học

```
START
  ↓
Teacher opens Class Detail Sidebar
  ↓
System fetches class progress data:
  GET /api/classes/:id/progress
  ↓
Backend:
  ├─→ Get all students in class
  ├─→ Get completed assignments per student
  ├─→ Get test scores per student
  ├─→ Calculate weekly averages
  ├─→ Calculate completion rates
  └─→ Return aggregated data
  ↓
Display Progress Chart:
  - X-axis: Tuần 1, 2, 3, 4, 5, 6
  - Y-axis: Completion % (0-100%)
  - Line: [45%, 52%, 68%, 71%, 80%, 85%]
  - Target line: [50%, 60%, 70%, 80%, 90%, 100%]
  ↓
Show Progress Stats:
  - Tiến độ tổng thể: 85%
  - Bài tập đã hoàn thành: 45/60
  - Điểm trung bình: 7.8
  - Tỷ lệ đạt: 92%
  ↓
Show Detailed Breakdown:
  - Reading: 88% (22/25 students excellent)
  - Listening: 84% (20/25 good)
  - Writing: 82% (18/25 good)
  - Speaking: 80% (15/25 needs improvement)
  ↓
Teacher clicks "Xuất báo cáo"
  ↓
API call: GET /api/classes/:id/report?format=pdf
  ↓
Backend generates PDF report:
  - Class overview
  - Student list with individual progress
  - Charts and graphs
  - Recommendations
  ↓
Download PDF: "Class_Report_VSTEPB2_2024.pdf"
  ↓
Teacher opens PDF
  ↓
Teacher reviews report
  ↓
Teacher identifies students needing help
  ↓
Teacher creates intervention plan
  ↓
END
```

---

## Sequence Diagrams

### Diagram 1: Create Class

```
Actor: Admin
UI: ClassManagementPage
Modal: CreateClassModal
API: Backend API
DB: Database
NotifService: Notification Service

Admin -> UI: Click "Tạo lớp học"
UI -> Modal: Open create class modal
Modal -> Admin: Display empty form (Step 1)

Admin -> Modal: Fill basic info
  - Name: "VSTEP B2 - Batch 2024"
  - Level: "B2"
  - Description: "..."
Admin -> Modal: Click "Tiếp theo"
Modal -> Admin: Show Step 2 (Teacher & Capacity)

Admin -> Modal: Select teacher "Nguyễn Văn A"
Admin -> Modal: Set capacity: max=30, min=10
Admin -> Modal: Click "Tiếp theo"
Modal -> Admin: Show Step 3 (Schedule)

Admin -> Modal: Set dates and schedule
  - Start: 01/01/2025
  - End: 31/03/2025
  - Days: Mon, Wed, Fri
  - Time: 19:00-21:00
Admin -> Modal: Click "Tiếp theo"
Modal -> Admin: Show Step 4 (Settings & Review)

Admin -> Modal: Review all info
Admin -> Modal: Upload thumbnail
Admin -> Modal: Click "Tạo lớp học"

Modal -> Modal: Validate all fields
Modal -> API: POST /api/classes
  Body: {
    name: "VSTEP B2 - Batch 2024",
    level: "B2",
    description: "...",
    teacherId: "uuid-teacher",
    maxStudents: 30,
    minStudents: 10,
    startDate: "2025-01-01",
    endDate: "2025-03-31",
    schedule: [...],
    thumbnail: "base64..."
  }

API -> DB: BEGIN TRANSACTION

API -> DB: Generate class code
  SELECT MAX(sequence) FROM classes WHERE level='B2' AND year=2024
DB -> API: sequence = 14
API -> API: code = "VST-B2-2024-15"

API -> DB: INSERT INTO classes (...)
DB -> API: Return classId

API -> DB: INSERT INTO class_stats (class_id, ...)
DB -> API: Success

API -> DB: Generate schedule sessions
  FOR each week FROM startDate TO endDate:
    FOR each day in schedule.days:
      INSERT INTO class_sessions (class_id, date, ...)
DB -> API: Created 36 sessions

API -> DB: INSERT INTO class_teachers (class_id, teacher_id, role='primary')
DB -> API: Success

API -> DB: COMMIT TRANSACTION

API -> NotifService: Send notification to teacher
  userId: teacher_id
  type: "class_assigned"
  message: "Bạn được phân công lớp VSTEP B2 - Batch 2024"
NotifService -> API: Queued

API -> DB: INSERT INTO activity_logs
  (actor_id, action, entity_type, entity_id, details)
  VALUES (admin_id, 'Created class', 'Class', class_id, {...})
DB -> API: Success

API -> Modal: Return success
  {
    success: true,
    data: {
      classId: "uuid",
      code: "VST-B2-2024-15",
      name: "VSTEP B2 - Batch 2024",
      ...
    }
  }

Modal -> Modal: Close modal
Modal -> UI: Trigger refresh
UI -> API: GET /api/classes
API -> DB: SELECT...
DB -> API: Return classes
API -> UI: Return list
UI -> Admin: Display updated list with new class
UI -> Admin: Show toast: "Tạo lớp học thành công"
UI -> Admin: Navigate to class detail page
```

### Diagram 2: Add Students to Class

```
Actor: Teacher
Sidebar: ClassDetailSidebar
Modal: AddStudentsModal
API: Backend API
DB: Database
EmailService: Email Service

Teacher -> Sidebar: Click "Thêm học viên"
Sidebar -> Modal: Open add students modal
Modal -> Modal: Show loading
Modal -> API: GET /api/users?role=Student&notInClass=:classId
API -> DB: SELECT users.* FROM users
  LEFT JOIN class_students ON users.id = class_students.student_id
    AND class_students.class_id = :classId
  WHERE users.role = 'Student'
    AND class_students.id IS NULL
    AND users.status = 'active'
DB -> API: Return available students
API -> Modal: Return student list
Modal -> Teacher: Display searchable student list

Teacher -> Modal: Search "Nguyen"
Modal -> Modal: Filter results locally
Modal -> Teacher: Show 5 matching students

Teacher -> Modal: Select 2 students (checkboxes)
  - Nguyễn Văn A
  - Nguyễn Thị B
Teacher -> Modal: Click "Thêm vào lớp"

Modal -> Modal: Show confirmation dialog
Teacher -> Modal: Confirm

Modal -> API: POST /api/classes/:classId/students
  Body: {
    studentIds: ['uuid1', 'uuid2'],
    sendWelcomeEmail: true,
    notifyTeacher: true
  }

API -> DB: SELECT enrolled, max_students FROM classes WHERE id=:classId
DB -> API: enrolled=25, max_students=30
API -> API: Check capacity: 25 + 2 <= 30 ✓

API -> DB: BEGIN TRANSACTION

API -> DB: Check students not already in class
  SELECT COUNT(*) FROM class_students
  WHERE class_id=:classId AND student_id IN ('uuid1', 'uuid2')
DB -> API: count = 0 ✓

API -> DB: INSERT INTO class_students
  (class_id, student_id, joined_at, status)
  VALUES
  (:classId, 'uuid1', NOW(), 'active'),
  (:classId, 'uuid2', NOW(), 'active')
DB -> API: Success

API -> DB: UPDATE classes SET enrolled = enrolled + 2 WHERE id=:classId
DB -> API: Success

API -> DB: INSERT INTO user_stats (user_id, classes_enrolled, ...)
  ON CONFLICT (user_id) DO UPDATE SET classes_enrolled = classes_enrolled + 1
  FOR each student
DB -> API: Success

API -> DB: COMMIT TRANSACTION

API -> EmailService: Send welcome emails (async)
  FOR each student:
    To: student.email
    Subject: "Chào mừng bạn đến lớp VSTEP B2"
    Body: "Bạn đã được thêm vào lớp..."
EmailService -> API: Queued

API -> DB: SELECT teacher.email FROM users WHERE id=:teacherId
DB -> API: Return teacher email
API -> EmailService: Send notification to teacher
  "2 học viên mới đã tham gia lớp của bạn"
EmailService -> API: Queued

API -> DB: INSERT INTO activity_logs
  FOR each student:
    (action, entity_type, entity_id, details)
    VALUES ('Student joined class', 'Class', :classId, {...})
DB -> API: Success

API -> Modal: Return success
  {
    success: true,
    data: {
      added: 2,
      newEnrollment: 27,
      capacity: 30
    }
  }

Modal -> Modal: Close modal
Modal -> Sidebar: Trigger refresh student list
Sidebar -> API: GET /api/classes/:classId/students
API -> DB: SELECT students with join info
DB -> API: Return students
API -> Sidebar: Return list
Sidebar -> Teacher: Display updated list (27 students)
Sidebar -> Teacher: Show toast: "Đã thêm 2 học viên vào lớp"
```

### Diagram 3: View Class Progress

```
Actor: Teacher
UI: ClassManagementPage
Sidebar: ClassDetailSidebar
API: Backend API
DB: Database

Teacher -> UI: Click class card
UI -> Sidebar: Open class detail sidebar
Sidebar -> Sidebar: Show loading skeleton
Sidebar -> API: GET /api/classes/:id/progress

API -> DB: Get class basic info
  SELECT * FROM classes WHERE id=:classId
DB -> API: Return class data

API -> DB: Get student count and stats
  SELECT 
    COUNT(*) as total_students,
    AVG(cs.progress) as avg_progress,
    AVG(us.average_score) as avg_score
  FROM class_students cs
  JOIN user_stats us ON cs.student_id = us.user_id
  WHERE cs.class_id=:classId AND cs.status='active'
DB -> API: total=25, avg_progress=85%, avg_score=7.8

API -> DB: Get weekly progress
  SELECT 
    WEEK(h.completed_at) as week_number,
    AVG(h.score) as avg_score,
    COUNT(DISTINCT h.user_id) as active_students,
    COUNT(*) as tests_completed
  FROM history h
  JOIN class_students cs ON h.user_id = cs.student_id
  WHERE cs.class_id=:classId
  GROUP BY week_number
  ORDER BY week_number
DB -> API: Return weekly data [
  {week: 1, avg_score: 6.5, active: 20, tests: 45},
  {week: 2, avg_score: 7.0, active: 23, tests: 52},
  {week: 3, avg_score: 7.5, active: 24, tests: 58},
  ...
]

API -> DB: Get skill breakdown
  SELECT 
    skill,
    AVG(score) as avg_score,
    COUNT(*) as total_tests
  FROM history h
  JOIN class_students cs ON h.user_id = cs.student_id
  WHERE cs.class_id=:classId
  GROUP BY skill
DB -> API: Return skill stats

API -> DB: Get recent activities
  SELECT 
    al.*,
    u.name as actor_name,
    u.avatar as actor_avatar
  FROM activity_logs al
  JOIN users u ON al.actor_id = u.id
  WHERE al.entity_id=:classId AND al.entity_type='Class'
  ORDER BY al.created_at DESC
  LIMIT 10
DB -> API: Return activities

API -> DB: Get assignment stats
  SELECT 
    COUNT(*) as total_assignments,
    SUM(CASE WHEN status='completed' THEN 1 ELSE 0 END) as completed
  FROM class_assignments
  WHERE class_id=:classId
DB -> API: total=60, completed=45

API -> API: Aggregate all data
  {
    overview: {...},
    weeklyProgress: [...],
    skills: {...},
    activities: [...],
    assignments: {...}
  }

API -> Sidebar: Return complete progress data

Sidebar -> Sidebar: Process data for charts
Sidebar -> Sidebar: Render progress chart (Line chart)
  - X-axis: Tuần 1-6
  - Y-axis: 0-100%
  - Line data: [45, 52, 68, 71, 80, 85]

Sidebar -> Sidebar: Render skill radar chart
  - Reading: 88%
  - Listening: 84%
  - Writing: 82%
  - Speaking: 80%

Sidebar -> Sidebar: Render recent activities list
Sidebar -> Sidebar: Render stats cards

Sidebar -> Teacher: Display complete progress view

Teacher -> Sidebar: Scroll through data
Teacher -> Sidebar: Hover on chart points
Sidebar -> Teacher: Show tooltip with details

Teacher -> Sidebar: Click "Xuất báo cáo"
Sidebar -> API: GET /api/classes/:id/report?format=pdf
API -> API: Generate PDF report
  - Aggregate all data
  - Render charts as images
  - Format tables
  - Create PDF document
API -> Sidebar: Return PDF file
Sidebar -> Teacher: Download "Class_Report.pdf"
```

---

## Database Design

### Table: classes

```sql
CREATE TABLE classes (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Info
  code VARCHAR(50) NOT NULL UNIQUE, -- VST-B2-2024-15
  name VARCHAR(200) NOT NULL,
  description TEXT,
  level VARCHAR(5) NOT NULL, -- A2, B1, B2, C1
  
  -- Capacity
  max_students INTEGER NOT NULL DEFAULT 30,
  min_students INTEGER DEFAULT 5,
  enrolled INTEGER DEFAULT 0,
  
  -- Schedule
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration_weeks INTEGER, -- Calculated
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'upcoming',
    -- ENUM: 'upcoming', 'active', 'completed', 'archived', 'cancelled'
  
  -- Settings
  is_public BOOLEAN DEFAULT TRUE,
  require_approval BOOLEAN DEFAULT FALSE,
  allow_self_enroll BOOLEAN DEFAULT TRUE,
  
  -- Media
  thumbnail VARCHAR(500),
  syllabus_url VARCHAR(500),
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  archived_at TIMESTAMP,
  
  -- Indexes
  INDEX idx_classes_code (code),
  INDEX idx_classes_level (level),
  INDEX idx_classes_status (status),
  INDEX idx_classes_start_date (start_date),
  INDEX idx_classes_created_at (created_at),
  
  -- Constraints
  CONSTRAINT chk_classes_capacity CHECK (enrolled <= max_students),
  CONSTRAINT chk_classes_dates CHECK (end_date > start_date)
);
```

### Table: class_teachers

```sql
CREATE TABLE class_teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Role
  role VARCHAR(20) NOT NULL DEFAULT 'primary',
    -- ENUM: 'primary', 'assistant', 'substitute'
  
  -- Period
  assigned_at TIMESTAMP NOT NULL DEFAULT NOW(),
  removed_at TIMESTAMP,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_class_teachers_class (class_id),
  INDEX idx_class_teachers_teacher (teacher_id),
  INDEX idx_class_teachers_active (is_active),
  
  -- Constraints
  UNIQUE (class_id, teacher_id, role)
);
```

### Table: class_students

```sql
CREATE TABLE class_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Enrollment
  joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
  enrollment_method VARCHAR(50),
    -- 'admin_added', 'teacher_added', 'self_enrolled', 'invitation'
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'active',
    -- ENUM: 'pending', 'active', 'inactive', 'completed', 'dropped'
  
  -- Progress
  progress DECIMAL(5,2) DEFAULT 0, -- 0-100%
  completed_lessons INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  
  -- Attendance
  attended_sessions INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  attendance_rate DECIMAL(5,2) DEFAULT 0,
  
  -- Performance
  average_score DECIMAL(3,1) DEFAULT 0,
  assignments_completed INTEGER DEFAULT 0,
  total_assignments INTEGER DEFAULT 0,
  
  -- Timestamps
  removed_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_class_students_class (class_id),
  INDEX idx_class_students_student (student_id),
  INDEX idx_class_students_status (status),
  INDEX idx_class_students_progress (progress),
  
  -- Constraints
  UNIQUE (class_id, student_id, removed_at)
);
```

### Table: class_schedules

```sql
CREATE TABLE class_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  
  -- Schedule
  day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday, ..., 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  
  -- Location
  location VARCHAR(200), -- "Room 301", "Zoom", "Online"
  is_online BOOLEAN DEFAULT TRUE,
  meeting_link VARCHAR(500),
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_class_schedules_class (class_id),
  INDEX idx_class_schedules_day (day_of_week),
  
  -- Constraints
  CONSTRAINT chk_schedule_time CHECK (end_time > start_time),
  CONSTRAINT chk_day_of_week CHECK (day_of_week >= 0 AND day_of_week <= 6)
);
```

### Table: class_sessions

```sql
CREATE TABLE class_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  
  -- Session Info
  session_number INTEGER NOT NULL, -- 1, 2, 3...
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration INTEGER, -- in minutes
  
  -- Content
  topic VARCHAR(200),
  description TEXT,
  objectives JSONB, -- ["Objective 1", "Objective 2"]
  materials JSONB, -- [{"name": "Slide.pdf", "url": "..."}]
  
  -- Teacher
  teacher_id UUID REFERENCES users(id),
  
  -- Attendance
  total_students INTEGER DEFAULT 0,
  present_students INTEGER DEFAULT 0,
  absent_students INTEGER DEFAULT 0,
  late_students INTEGER DEFAULT 0,
  
  -- Location
  location VARCHAR(200),
  is_online BOOLEAN DEFAULT TRUE,
  meeting_link VARCHAR(500),
  recording_url VARCHAR(500),
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
    -- ENUM: 'scheduled', 'ongoing', 'completed', 'cancelled', 'postponed'
  
  -- Notes
  notes TEXT,
  cancellation_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP,
  
  -- Indexes
  INDEX idx_class_sessions_class (class_id),
  INDEX idx_class_sessions_date (date),
  INDEX idx_class_sessions_status (status),
  INDEX idx_class_sessions_teacher (teacher_id),
  
  -- Constraints
  UNIQUE (class_id, session_number)
);
```

### Table: session_attendance

```sql
CREATE TABLE session_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES class_sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Attendance
  status VARCHAR(20) NOT NULL,
    -- ENUM: 'present', 'absent', 'late', 'excused'
  arrival_time TIME,
  
  -- Notes
  notes TEXT,
  excuse_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_session_attendance_session (session_id),
  INDEX idx_session_attendance_student (student_id),
  INDEX idx_session_attendance_status (status),
  
  -- Constraints
  UNIQUE (session_id, student_id)
);
```

### Table: class_invitations

```sql
CREATE TABLE class_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  
  -- Token
  token VARCHAR(255) NOT NULL UNIQUE,
  
  -- Settings
  max_uses INTEGER, -- NULL = unlimited
  current_uses INTEGER DEFAULT 0,
  auto_accept BOOLEAN DEFAULT TRUE,
  
  -- Validity
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Creator
  created_by UUID REFERENCES users(id),
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deactivated_at TIMESTAMP,
  
  -- Indexes
  INDEX idx_class_invitations_token (token),
  INDEX idx_class_invitations_class (class_id),
  INDEX idx_class_invitations_expires (expires_at),
  
  -- Constraints
  CONSTRAINT chk_invitation_uses CHECK (
    max_uses IS NULL OR current_uses <= max_uses
  )
);
```

### Table: class_assignments

```sql
CREATE TABLE class_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  
  -- Info
  title VARCHAR(200) NOT NULL,
  description TEXT,
  type VARCHAR(20) NOT NULL,
    -- ENUM: 'reading', 'listening', 'writing', 'speaking', 'mixed'
  
  -- Content
  exercises JSONB, -- Array of exercise IDs
  total_points DECIMAL(5,1) NOT NULL,
  passing_score DECIMAL(5,1) NOT NULL,
  
  -- Timing
  assigned_date TIMESTAMP NOT NULL DEFAULT NOW(),
  due_date TIMESTAMP NOT NULL,
  allow_late BOOLEAN DEFAULT FALSE,
  late_penalty DECIMAL(4,1) DEFAULT 0, -- % deduction
  
  -- Settings
  time_limit INTEGER, -- minutes, NULL = unlimited
  max_attempts INTEGER DEFAULT 1, -- -1 = unlimited
  show_answers_after VARCHAR(20) DEFAULT 'submission',
    -- 'submission', 'due_date', 'manual'
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
    -- ENUM: 'draft', 'assigned', 'due', 'graded', 'archived'
  
  -- Stats
  total_students INTEGER DEFAULT 0,
  submitted INTEGER DEFAULT 0,
  graded INTEGER DEFAULT 0,
  average_score DECIMAL(3,1) DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  published_at TIMESTAMP,
  
  -- Indexes
  INDEX idx_class_assignments_class (class_id),
  INDEX idx_class_assignments_type (type),
  INDEX idx_class_assignments_status (status),
  INDEX idx_class_assignments_due_date (due_date),
  
  -- Constraints
  CONSTRAINT chk_assignment_scores CHECK (passing_score <= total_points),
  CONSTRAINT chk_assignment_dates CHECK (due_date > assigned_date)
);
```

### Table: class_stats

```sql
CREATE TABLE class_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  
  -- Overview
  total_students INTEGER DEFAULT 0,
  active_students INTEGER DEFAULT 0,
  completed_students INTEGER DEFAULT 0,
  dropout_students INTEGER DEFAULT 0,
  
  -- Attendance
  total_sessions INTEGER DEFAULT 0,
  completed_sessions INTEGER DEFAULT 0,
  average_attendance DECIMAL(5,2) DEFAULT 0,
  
  -- Performance
  average_score DECIMAL(3,1) DEFAULT 0,
  pass_rate DECIMAL(5,2) DEFAULT 0,
  
  -- Skills (average scores)
  reading_avg DECIMAL(3,1) DEFAULT 0,
  listening_avg DECIMAL(3,1) DEFAULT 0,
  writing_avg DECIMAL(3,1) DEFAULT 0,
  speaking_avg DECIMAL(3,1) DEFAULT 0,
  
  -- Assignments
  total_assignments INTEGER DEFAULT 0,
  completed_assignments INTEGER DEFAULT 0,
  assignment_completion_rate DECIMAL(5,2) DEFAULT 0,
  
  -- Engagement
  total_study_time INTEGER DEFAULT 0, -- minutes
  average_study_time INTEGER DEFAULT 0,
  materials_downloaded INTEGER DEFAULT 0,
  discussion_posts INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_calculated_at TIMESTAMP,
  
  -- Indexes
  UNIQUE (class_id)
);
```

---

## API Endpoints

### Base URL
```
https://api.vstepro.com/v1
```

---

### 1. Get Class List

**Endpoint**: `GET /api/classes`

**Permission**: `class.view`

**Query Parameters**:
```typescript
interface GetClassesQuery {
  page?: number; // Default: 1
  limit?: number; // Default: 12
  search?: string; // Search in name, code
  level?: 'A2' | 'B1' | 'B2' | 'C1' | 'all'; // Default: 'all'
  status?: 'upcoming' | 'active' | 'completed' | 'all'; // Default: 'all'
  teacherId?: string; // Filter by teacher
  sortBy?: 'created_at' | 'start_date' | 'enrolled'; // Default: 'created_at'
  sortOrder?: 'asc' | 'desc'; // Default: 'desc'
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "classes": [
      {
        "id": "uuid",
        "code": "VST-B2-2024-15",
        "name": "VSTEP B2 - Batch 2024",
        "level": "B2",
        "description": "Lớp luyện thi VSTEP B2...",
        "teacher": {
          "id": "uuid",
          "name": "Nguyễn Văn A",
          "avatar": "https://..."
        },
        "assistants": [],
        "enrolled": 25,
        "maxStudents": 30,
        "progress": 65,
        "status": "active",
        "startDate": "2025-01-01",
        "endDate": "2025-03-31",
        "schedule": "Mon, Wed, Fri - 19:00-21:00",
        "thumbnail": "https://...",
        "isPublic": true,
        "requireApproval": false
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 48,
      "totalPages": 4
    },
    "stats": {
      "total": 48,
      "active": 32,
      "upcoming": 10,
      "completed": 6
    }
  }
}
```

---

### 2. Get Class Detail

**Endpoint**: `GET /api/classes/:id`

**Permission**: `class.view`

**Response**:
```json
{
  "success": true,
  "data": {
    "class": {
      "id": "uuid",
      "code": "VST-B2-2024-15",
      "name": "VSTEP B2 - Batch 2024",
      "level": "B2",
      "description": "...",
      "maxStudents": 30,
      "minStudents": 10,
      "enrolled": 25,
      "startDate": "2025-01-01",
      "endDate": "2025-03-31",
      "durationWeeks": 12,
      "status": "active",
      "isPublic": true,
      "requireApproval": false,
      "thumbnail": "https://...",
      "syllabusUrl": "https://...",
      "createdAt": "2024-12-01T10:00:00Z"
    },
    "teachers": [
      {
        "id": "uuid",
        "name": "Nguyễn Văn A",
        "avatar": "https://...",
        "role": "primary",
        "assignedAt": "2024-12-01T10:00:00Z"
      }
    ],
    "schedules": [
      {
        "dayOfWeek": 1,
        "startTime": "19:00",
        "endTime": "21:00",
        "location": "Online",
        "isOnline": true,
        "meetingLink": "https://zoom.us/..."
      }
    ],
    "stats": {
      "totalSessions": 36,
      "completedSessions": 20,
      "averageAttendance": 92.5,
      "averageScore": 7.8,
      "passRate": 88
    }
  }
}
```

---

### 3. Create Class

**Endpoint**: `POST /api/classes`

**Permission**: `class.create` (Admin, Teacher)

**Request Body**:
```json
{
  "name": "VSTEP B2 - Batch 2024",
  "level": "B2",
  "description": "Lớp luyện thi VSTEP B2 chuyên sâu",
  "teacherId": "uuid-teacher",
  "assistantTeacherIds": [],
  "maxStudents": 30,
  "minStudents": 10,
  "startDate": "2025-01-01",
  "endDate": "2025-03-31",
  "schedules": [
    {
      "dayOfWeek": 1,
      "startTime": "19:00",
      "endTime": "21:00",
      "location": "Online",
      "isOnline": true,
      "meetingLink": "https://zoom.us/..."
    }
  ],
  "isPublic": true,
  "requireApproval": false,
  "thumbnail": "base64...",
  "syllabus": "base64..."
}
```

**Response**:
```json
{
  "success": true,
  "message": "Class created successfully",
  "data": {
    "class": {
      "id": "uuid",
      "code": "VST-B2-2024-15",
      "name": "VSTEP B2 - Batch 2024",
      ...
    }
  }
}
```

---

### 4. Update Class

**Endpoint**: `PATCH /api/classes/:id`

**Permission**: `class.edit`

**Request Body**: (All fields optional)
```json
{
  "name": "VSTEP B2 - Batch 2024 (Updated)",
  "description": "...",
  "maxStudents": 35,
  "status": "active"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Class updated successfully",
  "data": {
    "class": { ... }
  }
}
```

---

### 5. Delete Class

**Endpoint**: `DELETE /api/classes/:id`

**Permission**: `class.delete` (Admin only)

**Response**:
```json
{
  "success": true,
  "message": "Class deleted successfully"
}
```

---

### 6. Get Class Students

**Endpoint**: `GET /api/classes/:id/students`

**Permission**: `class.view`

**Query Parameters**:
```typescript
{
  page?: number;
  limit?: number;
  search?: string;
  status?: 'all' | 'active' | 'inactive';
  sortBy?: 'name' | 'joined_at' | 'progress' | 'score';
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "students": [
      {
        "id": "uuid",
        "name": "Nguyễn Văn A",
        "email": "nguyenvana@example.com",
        "avatar": "https://...",
        "joinedAt": "2025-01-05T10:00:00Z",
        "status": "active",
        "progress": 65,
        "completedLessons": 20,
        "totalLessons": 36,
        "attendanceRate": 95,
        "averageScore": 7.5
      }
    ],
    "pagination": { ... }
  }
}
```

---

### 7. Add Students to Class

**Endpoint**: `POST /api/classes/:id/students`

**Permission**: `class.manage_students`

**Request Body**:
```json
{
  "studentIds": ["uuid1", "uuid2"],
  "sendWelcomeEmail": true,
  "notifyTeacher": true
}
```

**Response**:
```json
{
  "success": true,
  "message": "Added 2 students to class",
  "data": {
    "added": 2,
    "newEnrollment": 27,
    "capacity": 30
  }
}
```

---

### 8. Remove Student from Class

**Endpoint**: `DELETE /api/classes/:classId/students/:studentId`

**Permission**: `class.manage_students`

**Response**:
```json
{
  "success": true,
  "message": "Student removed from class"
}
```

---

### 9. Get Class Progress

**Endpoint**: `GET /api/classes/:id/progress`

**Permission**: `class.view`

**Response**:
```json
{
  "success": true,
  "data": {
    "overview": {
      "completionRate": 85,
      "averageScore": 7.8,
      "assignmentsCompleted": 45,
      "totalAssignments": 60
    },
    "weeklyProgress": [
      {
        "week": 1,
        "completionRate": 45,
        "avgScore": 6.5,
        "activeStudents": 20
      },
      {
        "week": 2,
        "completionRate": 52,
        "avgScore": 7.0,
        "activeStudents": 23
      }
    ],
    "skills": {
      "reading": { "score": 8.0, "testsTaken": 60 },
      "listening": { "score": 7.5, "testsTaken": 55 },
      "writing": { "score": 7.8, "testsTaken": 50 },
      "speaking": { "score": 7.2, "testsTaken": 48 }
    }
  }
}
```

---

### 10. Create Class Invitation

**Endpoint**: `POST /api/classes/:id/invitations`

**Permission**: `class.invite`

**Request Body**:
```json
{
  "expiresIn": 2592000,
  "maxUses": 20,
  "autoAccept": true
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "token": "abc123def456",
    "url": "https://vstepro.com/join/abc123def456",
    "expiresAt": "2025-01-10T10:00:00Z",
    "maxUses": 20,
    "currentUses": 0
  }
}
```

---

## Summary

Module Class Management cung cấp:
- **10 API endpoints** đầy đủ cho quản lý lớp học
- **9 database tables** với quan hệ phức tạp
- **5 user flows** chi tiết
- **3 sequence diagrams** mô tả các quy trình chính
- **Full CRUD operations** cho classes và students
- **Progress tracking** và statistics
- **Invitation system** linh hoạt

**Ngày tạo**: 2024-12-11  
**Phiên bản**: 1.0

# 🎓 STUDENT MANAGEMENT - QUẢN LÝ HỌC VIÊN

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
Module Student Management cung cấp các chức năng quản lý học viên toàn diện, bao gồm thông tin cá nhân, tiến độ học tập, kết quả thi, lịch sử hoạt động, và phân tích học tập.

### Phạm vi
- Quản lý hồ sơ học viên
- Theo dõi tiến độ học tập
- Quản lý enrollment (ghi danh khóa học/lớp học)
- Theo dõi kết quả thi
- Phân tích và báo cáo học viên
- Quản lý badges và achievements
- Theo dõi goals (mục tiêu học tập)
- Student portfolio

### Vai trò truy cập
- **Admin**: Full access (xem tất cả học viên)
- **Teacher**: Xem học viên trong lớp được phân công
- **Student**: Chỉ xem và chỉnh sửa hồ sơ của mình

---

## Chức năng chi tiết

### 1. Hồ sơ học viên (Student Profile)

#### 1.1. Thông tin cơ bản (Basic Info)
```typescript
interface StudentBasicInfo {
  id: string;
  avatar: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  
  // Address
  address: string;
  city: string;
  country: string;
  
  // Academic
  studentCode: string; // SV-2024-00123
  enrollmentDate: Date;
  status: 'active' | 'inactive' | 'graduated' | 'suspended';
  currentLevel: 'A2' | 'B1' | 'B2' | 'C1';
  targetLevel: 'B1' | 'B2' | 'C1';
  
  // Background
  education: string; // "Đại học Bách Khoa"
  occupation: string; // "Sinh viên"
  purpose: string; // "Thi VSTEP để tốt nghiệp"
}
```

#### 1.2. Thông tin học tập (Academic Info)
```typescript
interface StudentAcademicInfo {
  // Current Progress
  level: number; // User level 1-100
  experiencePoints: number;
  totalStudyTime: number; // in minutes
  streakDays: number;
  longestStreak: number;
  
  // Enrollments
  classesEnrolled: number;
  coursesEnrolled: number;
  currentClasses: Class[];
  completedCourses: number;
  
  // Tests
  totalTests: number;
  testsThisMonth: number;
  averageScore: number; // 0-10
  bestScore: number;
  improvementRate: number; // %
  
  // Skills
  skills: {
    reading: { score: number; tests: number; improvement: string };
    listening: { score: number; tests: number; improvement: string };
    writing: { score: number; tests: number; improvement: string };
    speaking: { score: number; tests: number; improvement: string };
  };
  
  // Achievements
  badgesEarned: number;
  goalsCompleted: number;
  certificatesEarned: number;
}
```

#### 1.3. Learning Analytics
```typescript
interface StudentAnalytics {
  // Study Pattern
  mostActiveDay: string; // "Monday"
  mostActiveHour: number; // 20
  averageSessionDuration: number; // minutes
  
  // Performance Trends
  scoreHistory: {
    date: Date;
    skill: string;
    score: number;
  }[];
  
  // Strengths & Weaknesses
  strengths: string[]; // ["Reading", "Vocabulary"]
  weaknesses: string[]; // ["Speaking", "Pronunciation"]
  
  // Recommendations
  suggestedSkills: string[];
  suggestedLevel: string;
  estimatedReadiness: number; // % ready for target exam
  
  // Engagement
  loginFrequency: number; // days per week
  assignmentCompletionRate: number; // %
  classAttendanceRate: number; // %
  participationScore: number; // 0-100
}
```

---

### 2. Danh sách học viên (Student List)

#### Hiển thị thông tin trong table
Columns:
1. **Checkbox**: Bulk selection
2. **Học viên**: Avatar + Name + Student Code
3. **Email**: Contact email
4. **Lớp học**: Current classes (badges)
5. **Level**: Current level badge (A2/B1/B2/C1)
6. **Điểm TB**: Average score with trend icon
7. **Hoạt động**: Last active (relative time)
8. **Trạng thái**: Active/Inactive badge
9. **Actions**: View, Edit, Message, More

#### Tính năng
- **Search**: Tìm theo tên, email, student code
- **Filters**:
  - Level (All/A2/B1/B2/C1)
  - Status (All/Active/Inactive/Graduated)
  - Class (Dropdown: All classes)
  - Performance (All/Excellent/Good/Average/Poor)
  - Activity (All/Active 7 days/Active 30 days/Inactive)
- **Sort**: 
  - Name (A-Z, Z-A)
  - Score (High-Low, Low-High)
  - Last active (Recent-Oldest)
  - Enrollment date (Newest-Oldest)
- **View modes**: Table, Grid cards
- **Pagination**: 20 students per page
- **Export**: CSV, Excel, PDF

#### Stat Cards
1. **Tổng học viên**
   - Value: 8,456
   - Change: +18.3% vs last month
   - Icon: Users

2. **Đang hoạt động**
   - Value: 6,234
   - Percentage: 73.7%
   - Icon: UserCheck

3. **Điểm TB hệ thống**
   - Value: 7.2/10
   - Trend: +0.3
   - Icon: Award

4. **Hoàn thành khóa học**
   - Value: 1,234
   - Rate: 89%
   - Icon: GraduationCap

---

### 3. Chi tiết học viên (Student Detail View)

#### Layout: Sidebar (slide from right)

##### Section 1: Header
- Large avatar
- Student name
- Student code
- Level badge
- Status badge
- Quick actions: Edit, Message, Export

##### Section 2: Overview Stats (Cards)
```
┌─────────────┬─────────────┬─────────────┐
│ Tests: 45   │ Score: 7.5  │ Streak: 15  │
│ +5 this wk  │ ↑ +0.5      │ days        │
└─────────────┴─────────────┴─────────────┘
```

##### Section 3: Skills Radar Chart
- 4 axes: Reading, Listening, Writing, Speaking
- Current scores
- Target scores (dotted line)
- Interactive: Click to see details

##### Section 4: Progress Chart (Line)
- X-axis: Last 6 months
- Y-axis: Average score (0-10)
- 4 lines: Reading, Listening, Writing, Speaking
- Show trend and improvement

##### Section 5: Current Classes
List of classes student is enrolled in:
```
┌──────────────────────────────────────┐
│ VSTEP B2 - Batch 2024                │
│ Teacher: Nguyễn Văn A                 │
│ Progress: 65% ████████░░░░░░         │
│ Next session: Mon 19:00               │
└──────────────────────────────────────┘
```

##### Section 6: Recent Activities
Timeline of last 10 activities:
- Completed Reading test - 2 hours ago
- Joined class "VSTEP B2" - 1 day ago
- Unlocked badge "Early Bird" - 2 days ago

##### Section 7: Goals & Badges
- Current goals with progress
- Recent badges earned
- Achievements showcase

##### Section 8: Action Buttons
- Send message
- Enroll in class
- Assign test
- View full history
- Export report
- Suspend account (admin)

---

### 4. Enrollment Management (Quản lý ghi danh)

#### 4.1. Enroll Student to Class
Process:
1. Open student detail sidebar
2. Click "Enroll in class"
3. Modal opens with class selection
4. Search/Filter classes:
   - By level
   - By status (upcoming/active)
   - By teacher
   - By capacity (has space)
5. Select class
6. Preview enrollment:
   - Class info
   - Schedule
   - Teacher
   - Current students
7. Confirm enrollment
8. Student added to class
9. Welcome email sent
10. Calendar updated

#### 4.2. Withdraw Student from Class
Process:
1. View student detail
2. In "Current Classes" section
3. Click "Withdraw" on a class
4. Confirmation dialog:
   ```
   Rút học viên khỏi lớp?
   
   Lớp: VSTEP B2 - Batch 2024
   Học viên: Nguyễn Văn A
   
   Tiến độ sẽ được lưu lại.
   
   [Cancel] [Withdraw]
   ```
5. If confirmed:
   - Remove from class
   - Keep progress data
   - Notify student
   - Update class count

#### 4.3. Course Enrollment
Similar flow for course enrollment:
- Browse available courses
- Check prerequisites
- Enroll student
- Track course progress
- Issue certificate upon completion

---

### 5. Academic Records (Học bạ)

#### 5.1. Test History
Table showing all tests taken:

Columns:
- **Date**: When test was taken
- **Type**: Reading/Listening/Writing/Speaking
- **Mode**: Part/Full Test
- **Score**: Score achieved (0-10)
- **Status**: Completed/In Progress
- **Actions**: View details, Retake

Features:
- Filter by skill, date range, score range
- Sort by date, score
- Export to PDF
- View detailed results

#### 5.2. Assignment History
- All assignments from classes
- Submission status
- Scores
- Teacher feedback
- Late submissions

#### 5.3. Attendance Record
- All class sessions
- Attendance status (Present/Absent/Late)
- Attendance rate
- Patterns analysis

#### 5.4. Certificates & Achievements
- Completed courses
- Certificates earned
- Badges collection
- Milestones reached

---

### 6. Student Reports (Báo cáo học viên)

#### 6.1. Progress Report
Monthly/Quarterly/Annual report containing:
- Overview stats
- Score trends
- Attendance
- Completed tests/assignments
- Skills improvement
- Goals achieved
- Recommendations

Format: PDF, printable

#### 6.2. Performance Analysis
Deep dive into student performance:
- Skill-by-skill analysis
- Strengths and weaknesses
- Comparison with class average
- Comparison with same-level students
- Improvement suggestions
- Personalized study plan

#### 6.3. Parent Report (if applicable)
Simplified report for parents:
- Study time
- Test scores
- Attendance
- Teacher comments
- Next steps

---

### 7. Bulk Operations

#### 7.1. Bulk Enroll
- Select multiple students
- Enroll all in same class/course
- Send bulk welcome email
- Update calendars

#### 7.2. Bulk Message
- Select students
- Compose message
- Send via email/in-app notification
- Track delivery

#### 7.3. Bulk Export
- Select students
- Choose export format
- Generate report
- Download zip file

#### 7.4. Bulk Status Update
- Select students
- Change status (activate/deactivate)
- Add note
- Log action

---

## UI Components

### Component: StudentManagementPage.tsx

#### Structure
```tsx
<StudentManagementPage>
  {/* Header */}
  <PageHeader>
    <h1>Quản lý học viên</h1>
    <Button onClick={addStudent}>Thêm học viên</Button>
  </PageHeader>

  {/* Stats Cards */}
  <StatsGrid>
    <StatCard title="Tổng học viên" value={8456} change="+18.3%" />
    <StatCard title="Đang hoạt động" value={6234} percentage="73.7%" />
    <StatCard title="Điểm TB" value="7.2/10" trend="+0.3" />
    <StatCard title="Hoàn thành" value={1234} rate="89%" />
  </StatsGrid>

  {/* Filters & Search */}
  <FilterBar>
    <SearchInput 
      placeholder="Tìm kiếm học viên..."
      value={searchQuery}
      onChange={setSearchQuery}
    />
    <FilterDropdown label="Level" options={levels} />
    <FilterDropdown label="Status" options={statuses} />
    <FilterDropdown label="Class" options={classes} />
    <FilterDropdown label="Performance" options={performances} />
    <ViewToggle /> {/* Table/Grid */}
    <ExportButton />
  </FilterBar>

  {/* Bulk Actions Bar */}
  {selectedStudents.length > 0 && (
    <BulkActionsBar>
      <span>{selectedStudents.length} học viên đã chọn</span>
      <Button onClick={bulkEnroll}>Ghi danh</Button>
      <Button onClick={bulkMessage}>Gửi tin nhắn</Button>
      <Button onClick={bulkExport}>Xuất file</Button>
      <Button onClick={bulkDeactivate}>Vô hiệu hóa</Button>
    </BulkActionsBar>
  )}

  {/* Student List/Grid */}
  {viewMode === 'table' ? (
    <StudentTable>
      <TableHeader>
        <Checkbox onChange={toggleSelectAll} />
        <th>Học viên</th>
        <th>Email</th>
        <th>Lớp học</th>
        <th>Level</th>
        <th>Điểm TB</th>
        <th>Hoạt động</th>
        <th>Trạng thái</th>
        <th>Actions</th>
      </TableHeader>
      <TableBody>
        {students.map(student => (
          <StudentRow 
            key={student.id}
            student={student}
            selected={selectedStudents.includes(student.id)}
            onSelect={toggleSelect}
            onView={viewDetail}
          />
        ))}
      </TableBody>
    </StudentTable>
  ) : (
    <StudentGrid>
      {students.map(student => (
        <StudentCard 
          key={student.id}
          student={student}
          onClick={viewDetail}
        />
      ))}
    </StudentGrid>
  )}

  {/* Pagination */}
  <Pagination 
    currentPage={currentPage}
    totalPages={totalPages}
    onPageChange={setCurrentPage}
  />

  {/* Student Detail Sidebar */}
  {selectedStudent && (
    <StudentDetailSidebar
      student={selectedStudent}
      onClose={closeSidebar}
    >
      <StudentHeader />
      <OverviewStats />
      <SkillsRadarChart />
      <ProgressLineChart />
      <CurrentClassesList />
      <RecentActivities />
      <GoalsAndBadges />
      <ActionButtons />
    </StudentDetailSidebar>
  )}
</StudentManagementPage>
```

---

### Component: StudentCard.tsx

```tsx
interface StudentCardProps {
  student: Student;
  onClick: (studentId: string) => void;
}

<StudentCard className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
  {/* Header */}
  <div className="flex items-start gap-4">
    <Avatar size="lg" src={student.avatar} />
    <div className="flex-1">
      <h3 className="text-lg font-semibold">{student.name}</h3>
      <p className="text-sm text-gray-600">{student.studentCode}</p>
      <Badge level={student.currentLevel} />
      <Badge status={student.status} />
    </div>
  </div>

  {/* Stats */}
  <div className="grid grid-cols-3 gap-4 mt-4">
    <Stat icon={BookOpen} label="Tests" value={student.totalTests} />
    <Stat icon={Award} label="Score" value={student.averageScore} />
    <Stat icon={Flame} label="Streak" value={student.streakDays} />
  </div>

  {/* Skills Progress */}
  <div className="mt-4 space-y-2">
    <SkillProgress skill="Reading" value={student.skills.reading.score} />
    <SkillProgress skill="Listening" value={student.skills.listening.score} />
    <SkillProgress skill="Writing" value={student.skills.writing.score} />
    <SkillProgress skill="Speaking" value={student.skills.speaking.score} />
  </div>

  {/* Footer */}
  <div className="mt-4 flex justify-between items-center">
    <span className="text-xs text-gray-500">
      Last active: {formatRelativeTime(student.lastActive)}
    </span>
    <Button size="sm" onClick={() => onClick(student.id)}>
      View Details
    </Button>
  </div>
</StudentCard>
```

---

## User Flows

### Flow 1: Admin xem danh sách và chi tiết học viên

```
START
  ↓
Admin navigates to "Quản lý học viên"
  ↓
System loads StudentManagementPage
  ↓
API call: GET /api/students?page=1&limit=20
  ↓
Display students in table view
  ↓
Display stat cards (Total, Active, Avg Score, Completed)
  ↓
Admin can interact:
  ├─→ Search students
  ├─→ Apply filters
  ├─→ Sort columns
  ├─→ Switch to grid view
  └─→ Click on student row
  ↓
Admin clicks on student "Nguyễn Văn A"
  ↓
Student Detail Sidebar opens from right
  ↓
API calls:
  ├─→ GET /api/students/:id
  ├─→ GET /api/students/:id/stats
  ├─→ GET /api/students/:id/classes
  ├─→ GET /api/students/:id/activities
  └─→ GET /api/students/:id/goals
  ↓
Display:
  ├─→ Basic info (avatar, name, code, level, status)
  ├─→ Overview stats (tests, score, streak)
  ├─→ Skills radar chart
  ├─→ Progress line chart (6 months)
  ├─→ Current classes (2 classes)
  ├─→ Recent activities (10 items)
  ├─→ Goals progress (3 active goals)
  └─→ Badges earned (12 badges)
  ↓
Admin scrolls through data
  ↓
Admin can:
  ├─→ Edit student info
  ├─→ Send message
  ├─→ Enroll in class
  ├─→ Assign test
  ├─→ View full history
  ├─→ Export report
  └─→ Suspend account
  ↓
Admin clicks "Export report"
  ↓
Report generation modal opens
  ↓
Admin selects:
  - Report type: Progress Report
  - Period: Last 3 months
  - Format: PDF
  - Include: Skills, Tests, Attendance
  ↓
Admin clicks "Generate"
  ↓
API call: POST /api/students/:id/reports
  Body: { type, period, format, sections }
  ↓
Backend generates PDF
  ↓
Download starts: "Student_Report_NguyenVanA_2024-12.pdf"
  ↓
Admin opens PDF and reviews
  ↓
END
```

### Flow 2: Teacher ghi danh học viên vào lớp

```
START
  ↓
Teacher opens Student Detail Sidebar for "Nguyễn Văn A"
  ↓
Teacher clicks "Enroll in class" button
  ↓
Enroll in Class Modal opens
  ↓
API call: GET /api/classes?status=active&hasSpace=true
  ↓
Display available classes:
  - Filter by level (B2)
  - Filter by teacher (My classes)
  - Filter by schedule
  ↓
Show 5 available classes matching filters
  ↓
Teacher reviews each class:
  ├─→ Class name
  ├─→ Schedule
  ├─→ Capacity (25/30)
  ├─→ Teacher name
  └─→ Current students
  ↓
Teacher selects "VSTEP B2 - Batch 2024"
  ↓
Preview enrollment shows:
  ```
  Lớp: VSTEP B2 - Batch 2024
  Học viên: Nguyễn Văn A
  Lịch học: Mon, Wed, Fri - 19:00-21:00
  Giáo viên: Nguyễn Văn B
  Bắt đầu: 01/01/2025
  
  ☑ Gửi email chào mừng
  ☑ Thêm vào lịch học
  ☑ Thông báo giáo viên
  ```
  ↓
Teacher clicks "Enroll"
  ↓
API call: POST /api/students/:studentId/enroll
  Body: {
    classId: "uuid",
    sendEmail: true,
    addToCalendar: true,
    notifyTeacher: true
  }
  ↓
Backend:
  ├─→ Check class capacity
  ├─→ Check student not already enrolled
  ├─→ Insert into class_students
  ├─→ Update class enrolled count
  ├─→ Create calendar events for student
  ├─→ Send welcome email to student
  ├─→ Send notification to class teacher
  ├─→ Log activity
  └─→ Return success
  ↓
Frontend:
  ├─→ Close modal
  ├─→ Refresh student's current classes list
  ├─→ Show success toast: "Học viên đã được ghi danh"
  └─→ Update student sidebar with new class
  ↓
Student Detail Sidebar now shows new class in "Current Classes"
  ↓
Teacher sees updated enrollment
  ↓
--- Student side (later) ---
Student receives email notification
  ↓
Student logs in
  ↓
Sees notification: "Bạn đã được thêm vào lớp VSTEP B2"
  ↓
Calendar updated with class schedule
  ↓
END
```

### Flow 3: Admin bulk enroll students to class

```
START
  ↓
Admin on Student Management page (table view)
  ↓
Admin selects multiple students (checkboxes):
  - Nguyễn Văn A
  - Trần Thị B
  - Lê Văn C
  (Total: 3 students)
  ↓
Bulk Actions Bar appears:
  "3 học viên đã chọn"
  [Ghi danh] [Gửi tin nhắn] [Xuất file] [Vô hiệu hóa]
  ↓
Admin clicks "Ghi danh"
  ↓
Bulk Enroll Modal opens
  ↓
Step 1: Select Class
  - Search/Filter classes
  - Show available classes with capacity
  - Admin selects "VSTEP B2 - Advanced"
  - Capacity: 20/30 (10 slots available)
  ↓
Step 2: Review
  ```
  Ghi danh 3 học viên vào lớp:
  
  Lớp: VSTEP B2 - Advanced
  Giáo viên: Nguyễn Văn D
  Lịch: Tue, Thu - 18:00-20:00
  
  Học viên:
  1. Nguyễn Văn A
  2. Trần Thị B
  3. Lê Văn C
  
  Còn trống: 7/10 slots sau khi enroll
  
  ☑ Gửi email chào mừng
  ☑ Thông báo giáo viên
  ```
  ↓
Step 3: Confirm
Admin clicks "Xác nhận ghi danh"
  ↓
API call: POST /api/students/bulk-enroll
  Body: {
    studentIds: ["uuid1", "uuid2", "uuid3"],
    classId: "class-uuid",
    sendEmail: true,
    notifyTeacher: true
  }
  ↓
Backend processes sequentially:
  FOR each student:
    ├─→ Check if already enrolled
    ├─→ Check capacity
    ├─→ Insert into class_students
    ├─→ Update class count
    ├─→ Queue welcome email
    ├─→ Log activity
  ↓
Backend returns summary:
  {
    success: 3,
    failed: 0,
    errors: []
  }
  ↓
Frontend:
  ├─→ Close modal
  ├─→ Deselect all students
  ├─→ Show success notification: "Đã ghi danh 3 học viên"
  ├─→ Refresh student list
  └─→ Send notification to teacher
  ↓
Teacher receives notification:
  "3 học viên mới đã tham gia lớp VSTEP B2 - Advanced"
  ↓
Students receive welcome emails
  ↓
Students see new class in their dashboard
  ↓
END
```

### Flow 4: Generate student progress report

```
START
  ↓
Admin opens Student Detail Sidebar for "Nguyễn Văn A"
  ↓
Admin clicks "Export report" button
  ↓
Generate Report Modal opens
  ↓
Form fields:
  - Report Type: [Dropdown]
    - Progress Report ← selected
    - Performance Analysis
    - Academic Transcript
    - Certificate
  - Period: [Dropdown]
    - Last month
    - Last 3 months ← selected
    - Last 6 months
    - Last year
    - Custom range
  - Format: [Radio]
    - PDF ← selected
    - Excel
    - Word
  - Include sections: [Checkboxes]
    ☑ Overview stats
    ☑ Skills breakdown
    ☑ Test history
    ☑ Attendance
    ☑ Goals & achievements
    ☑ Teacher comments
    ☐ Parent notes
  ↓
Admin reviews selection
  ↓
Admin clicks "Generate Report"
  ↓
API call: POST /api/students/:id/reports/generate
  Body: {
    type: "progress",
    period: "3months",
    format: "pdf",
    sections: [
      "overview",
      "skills",
      "tests",
      "attendance",
      "goals",
      "comments"
    ]
  }
  ↓
Backend process:
  ├─→ Fetch student data
  │    - Basic info
  │    - Stats for period (last 3 months)
  │    - Test results
  │    - Attendance records
  │    - Goals progress
  │    - Teacher comments
  │
  ├─→ Calculate metrics
  │    - Average scores
  │    - Improvement rates
  │    - Attendance percentage
  │    - Goals completion rate
  │
  ├─→ Generate charts as images
  │    - Skills radar chart
  │    - Score trend line chart
  │    - Attendance chart
  │
  ├─→ Format data for PDF template
  │
  ├─→ Render PDF using template engine
  │    ```
  │    VSTEPRO - Progress Report
  │    
  │    Student: Nguyễn Văn A
  │    Student Code: SV-2024-00123
  │    Period: Oct 2024 - Dec 2024
  │    
  │    1. Overview
  │       - Total tests: 15
  │       - Average score: 7.5
  │       - Study time: 45 hours
  │       - Streak: 21 days
  │    
  │    2. Skills Breakdown
  │       [Radar Chart Image]
  │       - Reading: 8.0 (+0.5)
  │       - Listening: 7.5 (+0.3)
  │       - Writing: 7.2 (+0.8)
  │       - Speaking: 7.0 (+0.2)
  │    
  │    3. Progress Trend
  │       [Line Chart Image]
  │       Improvement: +10.5% overall
  │    
  │    4. Test History
  │       [Table with all tests]
  │    
  │    5. Attendance
  │       Rate: 95% (19/20 sessions)
  │       [Attendance Chart]
  │    
  │    6. Goals & Achievements
  │       - Completed goals: 5/6
  │       - Badges earned: 3
  │       - Certificates: 1
  │    
  │    7. Teacher Comments
  │       "Học viên rất chăm chỉ..."
  │    
  │    8. Recommendations
  │       - Focus on Speaking skill
  │       - Practice pronunciation
  │       - Join speaking club
  │    ```
  │
  └─→ Save PDF to storage
       - Generate unique filename
       - Upload to S3/CDN
       - Return download URL
  ↓
Backend returns:
  {
    success: true,
    data: {
      reportId: "uuid",
      filename: "Progress_Report_NguyenVanA_2024-12.pdf",
      downloadUrl: "https://cdn.vstepro.com/reports/...",
      expiresAt: "2024-12-18T00:00:00Z" // 7 days
    }
  }
  ↓
Frontend:
  ├─→ Close modal
  ├─→ Show success toast: "Báo cáo đã được tạo"
  ├─→ Auto-download file
  └─→ Show link: "Download again"
  ↓
Browser downloads PDF
  ↓
Admin opens PDF in viewer
  ↓
Admin reviews report (10 pages)
  ↓
Admin can:
  ├─→ Print report
  ├─→ Save to computer
  ├─→ Email to student/parent
  └─→ Share with teacher
  ↓
END
```

---

## Sequence Diagrams

### Diagram 1: Get Student Detail

```
Actor: Admin/Teacher
UI: StudentDetailSidebar
API: Backend API
DB: Database
Cache: Redis Cache

Admin -> UI: Click on student row
UI -> UI: Open sidebar with loading skeleton
UI -> API: GET /api/students/:id/detail

API -> Cache: Check if student data cached
  Key: "student:detail:{id}"
Cache -> API: MISS (not in cache)

API -> DB: BEGIN TRANSACTION

API -> DB: Get student basic info
  SELECT * FROM users 
  WHERE id=:id AND role='Student'
DB -> API: Return user record

API -> DB: Get student profile
  SELECT * FROM user_profiles WHERE user_id=:id
DB -> API: Return profile

API -> DB: Get student stats
  SELECT * FROM user_stats WHERE user_id=:id
DB -> API: Return stats

API -> DB: Get current classes
  SELECT c.*, ct.name as teacher_name
  FROM class_students cs
  JOIN classes c ON cs.class_id = c.id
  JOIN class_teachers clt ON c.id = clt.class_id
  JOIN users ct ON clt.teacher_id = ct.id
  WHERE cs.student_id=:id 
    AND cs.status='active'
    AND clt.role='primary'
DB -> API: Return 2 classes

API -> DB: Get skills breakdown
  SELECT 
    skill,
    AVG(score) as avg_score,
    COUNT(*) as total_tests,
    MAX(score) as best_score
  FROM history
  WHERE user_id=:id
  GROUP BY skill
DB -> API: Return skills data

API -> DB: Get progress history (last 6 months)
  SELECT 
    DATE_FORMAT(completed_at, '%Y-%m') as month,
    skill,
    AVG(score) as avg_score
  FROM history
  WHERE user_id=:id
    AND completed_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
  GROUP BY month, skill
  ORDER BY month ASC
DB -> API: Return progress data

API -> DB: Get recent activities
  SELECT 
    al.*,
    CASE 
      WHEN al.action LIKE '%test%' THEN 'test'
      WHEN al.action LIKE '%badge%' THEN 'badge'
      ELSE 'general'
    END as activity_type
  FROM activity_logs al
  WHERE al.actor_id=:id
  ORDER BY al.created_at DESC
  LIMIT 10
DB -> API: Return activities

API -> DB: Get active goals
  SELECT * FROM goals
  WHERE user_id=:id 
    AND status IN ('active', 'in_progress')
  ORDER BY created_at DESC
  LIMIT 5
DB -> API: Return goals

API -> DB: Get earned badges
  SELECT b.*, ub.earned_at
  FROM user_badges ub
  JOIN badges b ON ub.badge_id = b.id
  WHERE ub.user_id=:id
  ORDER BY ub.earned_at DESC
  LIMIT 10
DB -> API: Return badges

API -> DB: COMMIT TRANSACTION

API -> API: Aggregate all data
  {
    student: {...},
    profile: {...},
    stats: {...},
    classes: [...],
    skills: {...},
    progressHistory: [...],
    activities: [...],
    goals: [...],
    badges: [...]
  }

API -> Cache: Cache result for 5 minutes
  SET "student:detail:{id}" = JSON.stringify(data)
  EXPIRE 300
Cache -> API: OK

API -> UI: Return complete student detail
  {
    success: true,
    data: { ... }
  }

UI -> UI: Update all sections:
  - Render header with student info
  - Render overview stats cards
  - Render skills radar chart
  - Render progress line chart
  - Render current classes list
  - Render recent activities timeline
  - Render goals progress bars
  - Render badges grid

UI -> Admin: Display complete student detail view
```

### Diagram 2: Enroll Student in Class

```
Actor: Teacher
Sidebar: StudentDetailSidebar
Modal: EnrollModal
API: Backend API
DB: Database
EmailService: Email Service
CalendarService: Calendar Service

Teacher -> Sidebar: Click "Enroll in class"
Sidebar -> Modal: Open enrollment modal
Modal -> Modal: Show loading
Modal -> API: GET /api/classes?status=active&level=:studentLevel&hasSpace=true

API -> DB: Get available classes
  SELECT c.*, 
    u.name as teacher_name,
    (c.max_students - c.enrolled) as available_slots
  FROM classes c
  JOIN class_teachers ct ON c.id = ct.class_id AND ct.role='primary'
  JOIN users u ON ct.teacher_id = u.id
  WHERE c.status IN ('upcoming', 'active')
    AND c.level = :level
    AND c.enrolled < c.max_students
    AND c.allow_self_enroll = true
  ORDER BY c.start_date ASC
DB -> API: Return 8 available classes

API -> Modal: Return class list
Modal -> Teacher: Display classes with filters

Teacher -> Modal: Filter by level "B2"
Modal -> Modal: Filter locally
Modal -> Teacher: Show 5 B2 classes

Teacher -> Modal: Select "VSTEP B2 - Batch 2024"
Modal -> Modal: Show preview:
  - Class details
  - Schedule
  - Teacher
  - Current enrollment: 25/30
  - Options checkboxes

Teacher -> Modal: Review and confirm
  ☑ Send welcome email
  ☑ Add to calendar
  ☑ Notify class teacher

Teacher -> Modal: Click "Enroll"

Modal -> API: POST /api/students/:studentId/enroll
  Body: {
    classId: "class-uuid",
    sendEmail: true,
    addToCalendar: true,
    notifyTeacher: true
  }

API -> DB: BEGIN TRANSACTION

API -> DB: Verify class capacity
  SELECT enrolled, max_students 
  FROM classes 
  WHERE id=:classId
  FOR UPDATE
DB -> API: enrolled=25, max_students=30
API -> API: Check: 25 < 30 ✓

API -> DB: Check if student already enrolled
  SELECT COUNT(*) FROM class_students
  WHERE class_id=:classId 
    AND student_id=:studentId
    AND removed_at IS NULL
DB -> API: count = 0 ✓

API -> DB: Insert enrollment
  INSERT INTO class_students
  (class_id, student_id, joined_at, status, enrollment_method)
  VALUES 
  (:classId, :studentId, NOW(), 'active', 'teacher_added')
DB -> API: Success

API -> DB: Update class enrollment count
  UPDATE classes 
  SET enrolled = enrolled + 1,
      updated_at = NOW()
  WHERE id=:classId
DB -> API: Success (enrolled now = 26)

API -> DB: Update student stats
  UPDATE user_stats
  SET classes_enrolled = classes_enrolled + 1
  WHERE user_id=:studentId
DB -> API: Success

API -> DB: COMMIT TRANSACTION

API -> API: Get full class details for email
API -> DB: SELECT class with schedule
DB -> API: Return class data

API -> EmailService: Send welcome email (async)
  To: student.email
  Subject: "Chào mừng bạn đến lớp VSTEP B2 - Batch 2024"
  Body: HTML template with:
    - Class name
    - Teacher name
    - Schedule
    - Start date
    - Meeting link
    - Next steps
EmailService -> API: Email queued

API -> CalendarService: Create calendar events (async)
  For each scheduled session:
    - Create event
    - Set reminder (30 mins before)
    - Add meeting link
    - Add student as attendee
CalendarService -> API: Events created

API -> EmailService: Notify class teacher
  To: classTeacher.email
  Subject: "Học viên mới tham gia lớp của bạn"
  Body: "Nguyễn Văn A đã tham gia lớp VSTEP B2"
EmailService -> API: Queued

API -> DB: Log activity
  INSERT INTO activity_logs
  (actor_id, action, entity_type, entity_id, details)
  VALUES
  (:teacherId, 'Enrolled student', 'Class', :classId, 
   '{"student": "Nguyễn Văn A", "class": "VSTEP B2"}')
DB -> API: Success

API -> Modal: Return success
  {
    success: true,
    message: "Student enrolled successfully",
    data: {
      enrollmentId: "uuid",
      newEnrollmentCount: 26
    }
  }

Modal -> Modal: Close modal
Modal -> Sidebar: Trigger refresh
Sidebar -> API: GET /api/students/:id/classes (refresh list)
API -> DB: SELECT current classes
DB -> API: Return classes
API -> Sidebar: Return updated list
Sidebar -> Teacher: Display updated classes (now shows new class)
Sidebar -> Teacher: Show success toast
```

---

## Database Design

### Table: students (extends users)
```sql
-- Students are users with role='Student'
-- Additional student-specific info in student_profiles
```

### Table: student_profiles

```sql
CREATE TABLE student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Student Info
  student_code VARCHAR(50) UNIQUE, -- SV-2024-00123
  enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  graduation_date DATE,
  
  -- Academic
  current_level VARCHAR(5) DEFAULT 'A2', -- A2, B1, B2, C1
  target_level VARCHAR(5) DEFAULT 'B2',
  
  -- Background
  education VARCHAR(200), -- "Đại học Bách Khoa"
  major VARCHAR(100),
  occupation VARCHAR(100),
  purpose TEXT, -- Why learning English
  
  -- Emergency Contact
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(20),
  emergency_contact_relation VARCHAR(50),
  
  -- Preferences
  preferred_learning_time VARCHAR(50), -- "Morning", "Evening"
  preferred_class_size VARCHAR(20), -- "Small", "Medium", "Large"
  learning_style VARCHAR(50), -- "Visual", "Auditory", "Kinesthetic"
  
  -- Notes
  special_needs TEXT,
  admin_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  UNIQUE (user_id)
);
```

### Table: enrollments

```sql
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- What enrolled in
  enrollable_type VARCHAR(50) NOT NULL, -- 'Class', 'Course', 'Program'
  enrollable_id UUID NOT NULL,
  
  -- Enrollment Info
  enrolled_at TIMESTAMP NOT NULL DEFAULT NOW(),
  enrollment_method VARCHAR(50),
    -- 'self', 'admin_added', 'teacher_added', 'invitation', 'payment'
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'active',
    -- ENUM: 'pending', 'active', 'completed', 'dropped', 'suspended'
  
  -- Progress
  progress DECIMAL(5,2) DEFAULT 0, -- 0-100%
  completed_at TIMESTAMP,
  dropped_at TIMESTAMP,
  drop_reason TEXT,
  
  -- Payment (if applicable)
  payment_status VARCHAR(20), -- 'pending', 'paid', 'refunded'
  payment_id UUID,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_enrollments_student (student_id),
  INDEX idx_enrollments_type_id (enrollable_type, enrollable_id),
  INDEX idx_enrollments_status (status),
  
  -- Ensure unique enrollment (no duplicates)
  UNIQUE (student_id, enrollable_type, enrollable_id, dropped_at)
);
```

### Table: student_test_results

```sql
CREATE TABLE student_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Test Info
  test_id UUID, -- Reference to test/exam
  test_type VARCHAR(20) NOT NULL,
    -- 'reading', 'listening', 'writing', 'speaking', 'full_test'
  test_mode VARCHAR(20) NOT NULL, -- 'practice', 'exam', 'mock_exam'
  level VARCHAR(5), -- A2, B1, B2, C1
  
  -- Scores
  score DECIMAL(3,1) NOT NULL, -- 0-10
  total_questions INTEGER,
  correct_answers INTEGER,
  percentage DECIMAL(5,2), -- 0-100%
  
  -- Time
  time_taken INTEGER, -- in seconds
  time_limit INTEGER, -- in seconds
  started_at TIMESTAMP NOT NULL,
  submitted_at TIMESTAMP NOT NULL,
  
  -- Detailed Scores (for Writing/Speaking)
  task_achievement DECIMAL(3,1),
  coherence_cohesion DECIMAL(3,1),
  lexical_resource DECIMAL(3,1),
  grammar_accuracy DECIMAL(3,1),
  fluency_coherence DECIMAL(3,1),
  pronunciation DECIMAL(3,1),
  
  -- Answers
  answers JSONB, -- Student answers
  answer_key JSONB, -- Correct answers
  
  -- Feedback
  auto_feedback TEXT,
  ai_feedback TEXT,
  teacher_feedback TEXT,
  graded_by VARCHAR(20), -- 'auto', 'ai', 'teacher'
  graded_at TIMESTAMP,
  
  -- Context
  class_id UUID REFERENCES classes(id),
  assignment_id UUID,
  
  -- Status
  status VARCHAR(20) DEFAULT 'completed',
    -- 'in_progress', 'completed', 'graded', 'reviewed'
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_test_results_student (student_id),
  INDEX idx_test_results_type (test_type),
  INDEX idx_test_results_level (level),
  INDEX idx_test_results_score (score),
  INDEX idx_test_results_submitted (submitted_at),
  INDEX idx_test_results_class (class_id)
);
```

### Table: student_attendance

```sql
CREATE TABLE student_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  session_id UUID REFERENCES class_sessions(id) ON DELETE CASCADE,
  
  -- Attendance
  date DATE NOT NULL,
  status VARCHAR(20) NOT NULL,
    -- ENUM: 'present', 'absent', 'late', 'excused'
  arrival_time TIME,
  departure_time TIME,
  
  -- Notes
  notes TEXT,
  excuse_reason TEXT,
  excuse_approved BOOLEAN DEFAULT FALSE,
  excuse_approved_by UUID REFERENCES users(id),
  
  -- Recorded By
  recorded_by UUID REFERENCES users(id), -- Teacher who took attendance
  recorded_at TIMESTAMP DEFAULT NOW(),
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_attendance_student (student_id),
  INDEX idx_attendance_class (class_id),
  INDEX idx_attendance_session (session_id),
  INDEX idx_attendance_date (date),
  INDEX idx_attendance_status (status),
  
  UNIQUE (student_id, session_id)
);
```

### Table: student_achievements

```sql
CREATE TABLE student_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Achievement
  achievement_type VARCHAR(50) NOT NULL,
    -- 'badge', 'certificate', 'award', 'milestone'
  achievement_id UUID, -- Reference to badge/certificate
  
  -- Details
  title VARCHAR(200) NOT NULL,
  description TEXT,
  icon VARCHAR(200),
  rarity VARCHAR(20), -- 'common', 'rare', 'epic', 'legendary'
  
  -- Progress (for milestone achievements)
  current_value INTEGER,
  target_value INTEGER,
  progress DECIMAL(5,2), -- 0-100%
  
  -- Status
  status VARCHAR(20) DEFAULT 'unlocked',
    -- 'locked', 'in_progress', 'unlocked', 'claimed'
  unlocked_at TIMESTAMP,
  claimed_at TIMESTAMP,
  
  -- Reward
  reward_type VARCHAR(50), -- 'xp', 'badge', 'certificate', 'item'
  reward_value INTEGER,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_achievements_student (student_id),
  INDEX idx_achievements_type (achievement_type),
  INDEX idx_achievements_status (status),
  INDEX idx_achievements_unlocked (unlocked_at)
);
```

### Table: student_notes

```sql
CREATE TABLE student_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Note Info
  title VARCHAR(200),
  content TEXT NOT NULL,
  note_type VARCHAR(50), -- 'personal', 'teacher', 'admin', 'system'
  
  -- Context
  related_to_type VARCHAR(50), -- 'test', 'class', 'lesson', 'exercise'
  related_to_id UUID,
  
  -- Privacy
  is_private BOOLEAN DEFAULT TRUE,
  visible_to VARCHAR(20) DEFAULT 'self', -- 'self', 'teacher', 'all'
  
  -- Author
  created_by UUID REFERENCES users(id),
  
  -- Tags
  tags JSONB, -- ["grammar", "vocabulary"]
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_notes_student (student_id),
  INDEX idx_notes_type (note_type),
  INDEX idx_notes_created_by (created_by),
  INDEX idx_notes_related (related_to_type, related_to_id)
);
```

---

## API Endpoints

### 1. Get Student List

**Endpoint**: `GET /api/students`

**Permission**: `student.view`

**Query Parameters**:
```typescript
{
  page?: number;
  limit?: number;
  search?: string;
  level?: 'A2' | 'B1' | 'B2' | 'C1' | 'all';
  status?: 'active' | 'inactive' | 'graduated' | 'all';
  classId?: string; // Filter by class
  performance?: 'excellent' | 'good' | 'average' | 'poor' | 'all';
  activity?: 'all' | '7days' | '30days' | 'inactive';
  sortBy?: 'name' | 'score' | 'last_active' | 'enrolled_date';
  sortOrder?: 'asc' | 'desc';
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
        "studentCode": "SV-2024-00123",
        "name": "Nguyễn Văn A",
        "email": "nguyenvana@example.com",
        "avatar": "https://...",
        "currentLevel": "B2",
        "targetLevel": "C1",
        "status": "active",
        "classes": [
          {
            "id": "class-uuid",
            "name": "VSTEP B2 - Batch 2024"
          }
        ],
        "stats": {
          "totalTests": 45,
          "averageScore": 7.5,
          "streakDays": 15
        },
        "lastActive": "2024-12-11T14:20:00Z",
        "enrollmentDate": "2024-01-15"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 8456,
      "totalPages": 423
    },
    "stats": {
      "total": 8456,
      "active": 6234,
      "inactive": 2222,
      "averageScore": 7.2
    }
  }
}
```

---

### 2. Get Student Detail

**Endpoint**: `GET /api/students/:id/detail`

**Permission**: `student.view` (Admin, Teacher for their students, Self)

**Response**:
```json
{
  "success": true,
  "data": {
    "student": {
      "id": "uuid",
      "studentCode": "SV-2024-00123",
      "name": "Nguyễn Văn A",
      "email": "nguyenvana@example.com",
      "phone": "0901234567",
      "avatar": "https://...",
      "currentLevel": "B2",
      "targetLevel": "C1",
      "status": "active",
      "enrollmentDate": "2024-01-15",
      "education": "Đại học Bách Khoa",
      "occupation": "Sinh viên",
      "purpose": "Thi VSTEP để tốt nghiệp"
    },
    "stats": {
      "level": 15,
      "experiencePoints": 3450,
      "totalStudyTime": 1250,
      "streakDays": 15,
      "longestStreak": 30,
      "totalTests": 45,
      "averageScore": 7.5,
      "bestScore": 9.0,
      "improvementRate": 12.5,
      "badgesEarned": 12,
      "goalsCompleted": 8
    },
    "skills": {
      "reading": { "score": 8.0, "tests": 12, "improvement": "+0.5" },
      "listening": { "score": 7.5, "tests": 10, "improvement": "+0.3" },
      "writing": { "score": 7.2, "tests": 15, "improvement": "+0.8" },
      "speaking": { "score": 7.0, "tests": 8, "improvement": "+0.2" }
    },
    "classes": [
      {
        "id": "uuid",
        "name": "VSTEP B2 - Batch 2024",
        "teacher": "Nguyễn Văn B",
        "progress": 65,
        "schedule": "Mon, Wed, Fri - 19:00-21:00",
        "nextSession": "2024-12-13T19:00:00Z"
      }
    ],
    "progressHistory": [
      {
        "month": "2024-07",
        "reading": 6.5,
        "listening": 6.0,
        "writing": 5.8,
        "speaking": 5.5
      },
      {
        "month": "2024-08",
        "reading": 7.0,
        "listening": 6.5,
        "writing": 6.2,
        "speaking": 6.0
      }
    ],
    "activities": [
      {
        "id": "uuid",
        "type": "test",
        "description": "Completed Reading test - Score: 8.0",
        "timestamp": "2024-12-11T10:00:00Z",
        "icon": "BookOpen",
        "color": "blue"
      }
    ],
    "goals": [
      {
        "id": "uuid",
        "title": "Complete 10 tests this month",
        "progress": 70,
        "current": 7,
        "target": 10,
        "deadline": "2024-12-31"
      }
    ],
    "badges": [
      {
        "id": "uuid",
        "name": "Early Bird",
        "description": "Complete 10 morning sessions",
        "icon": "https://...",
        "rarity": "rare",
        "earnedAt": "2024-12-01"
      }
    ]
  }
}
```

---

### 3. Enroll Student

**Endpoint**: `POST /api/students/:studentId/enroll`

**Permission**: `student.enroll`

**Request Body**:
```json
{
  "classId": "uuid",
  "sendEmail": true,
  "addToCalendar": true,
  "notifyTeacher": true
}
```

**Response**:
```json
{
  "success": true,
  "message": "Student enrolled successfully",
  "data": {
    "enrollmentId": "uuid",
    "classId": "uuid",
    "studentId": "uuid",
    "status": "active",
    "enrolledAt": "2024-12-11T15:00:00Z"
  }
}
```

---

### 4. Bulk Enroll Students

**Endpoint**: `POST /api/students/bulk-enroll`

**Permission**: `student.bulk_enroll`

**Request Body**:
```json
{
  "studentIds": ["uuid1", "uuid2", "uuid3"],
  "classId": "uuid",
  "sendEmail": true,
  "notifyTeacher": true
}
```

**Response**:
```json
{
  "success": true,
  "message": "Bulk enrollment completed",
  "data": {
    "total": 3,
    "success": 3,
    "failed": 0,
    "errors": []
  }
}
```

---

### 5. Generate Student Report

**Endpoint**: `POST /api/students/:id/reports/generate`

**Permission**: `student.report`

**Request Body**:
```json
{
  "type": "progress",
  "period": "3months",
  "format": "pdf",
  "sections": [
    "overview",
    "skills",
    "tests",
    "attendance",
    "goals",
    "comments"
  ]
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "reportId": "uuid",
    "filename": "Progress_Report_NguyenVanA_2024-12.pdf",
    "downloadUrl": "https://cdn.vstepro.com/reports/...",
    "expiresAt": "2024-12-18T00:00:00Z"
  }
}
```

---

### 6. Get Student Test Results

**Endpoint**: `GET /api/students/:id/test-results`

**Permission**: `student.view`

**Query Parameters**:
```typescript
{
  page?: number;
  limit?: number;
  skill?: 'reading' | 'listening' | 'writing' | 'speaking' | 'all';
  dateFrom?: Date;
  dateTo?: Date;
  minScore?: number;
  maxScore?: number;
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "uuid",
        "testType": "reading",
        "testMode": "practice",
        "level": "B2",
        "score": 8.0,
        "percentage": 80,
        "totalQuestions": 40,
        "correctAnswers": 32,
        "timeTaken": 3600,
        "submittedAt": "2024-12-11T10:00:00Z",
        "status": "graded"
      }
    ],
    "pagination": { ... },
    "summary": {
      "totalTests": 45,
      "averageScore": 7.5,
      "bestScore": 9.0,
      "improvement": "+10.5%"
    }
  }
}
```

---

### 7. Get Student Attendance

**Endpoint**: `GET /api/students/:id/attendance`

**Permission**: `student.view`

**Query Parameters**:
```typescript
{
  classId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  status?: 'all' | 'present' | 'absent' | 'late';
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "attendance": [
      {
        "id": "uuid",
        "classId": "uuid",
        "className": "VSTEP B2 - Batch 2024",
        "sessionId": "uuid",
        "date": "2024-12-09",
        "status": "present",
        "arrivalTime": "19:00:00"
      }
    ],
    "summary": {
      "totalSessions": 20,
      "present": 19,
      "absent": 1,
      "late": 0,
      "rate": 95
    }
  }
}
```

---

## Summary

Module Student Management cung cấp:
- **7 API endpoints** chính cho quản lý học viên
- **7 database tables** bổ sung cho student data
- **4 user flows** chi tiết
- **2 sequence diagrams** phức tạp
- **Comprehensive student profile** với analytics
- **Enrollment management** linh hoạt
- **Progress tracking** và reporting
- **Bulk operations** hiệu quả

**Ngày tạo**: 2024-12-11  
**Phiên bản**: 1.0

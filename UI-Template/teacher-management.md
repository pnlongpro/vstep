# 👨‍🏫 TEACHER MANAGEMENT - QUẢN LÝ GIÁO VIÊN

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
Module Teacher Management cung cấp các chức năng quản lý giáo viên toàn diện, bao gồm thông tin cá nhân, phân công lớp học, theo dõi hiệu quả giảng dạy, và đánh giá từ học viên.

### Phạm vi
- Quản lý hồ sơ giáo viên
- Phân công giáo viên vào lớp học
- Theo dõi lịch giảng dạy
- Quản lý chuyên môn và kỹ năng
- Đánh giá hiệu quả giảng dạy
- Theo dõi số lượng học viên
- Quản lý khóa học do giáo viên tạo
- Teacher performance analytics

### Vai trò truy cập
- **Admin**: Full access (quản lý tất cả giáo viên)
- **Teacher**: Xem và chỉnh sửa profile của mình
- **Student**: Chỉ xem thông tin công khai của giáo viên

---

## Chức năng chi tiết

### 1. Hồ sơ giáo viên (Teacher Profile)

#### 1.1. Thông tin cơ bản (Basic Info)
```typescript
interface TeacherBasicInfo {
  id: string;
  avatar: string;
  name: string;
  title: string; // "TS.", "ThS.", "GV."
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  
  // Professional
  teacherCode: string; // GV-2023-00045
  joinedDate: Date;
  status: 'active' | 'inactive' | 'on_leave' | 'retired';
  employmentType: 'full_time' | 'part_time' | 'contract' | 'visiting';
  
  // Academic Background
  education: string[]; // ["Ph.D. in Linguistics - Harvard", "M.A. in TESOL - UCLA"]
  certifications: string[]; // ["CELTA", "DELTA", "IELTS Examiner"]
  experience: number; // years of teaching
  
  // Specialty
  specialties: string[]; // ["Writing", "Speaking", "IELTS"]
  levelsTaught: string[]; // ["A2", "B1", "B2", "C1"]
  preferredSkills: string[]; // ["Writing", "Speaking"]
  
  // Bio
  bio: string;
  achievements: string[];
  publications: string[];
  
  // Contact
  linkedIn: string;
  website: string;
}
```

#### 1.2. Teaching Statistics
```typescript
interface TeacherStats {
  // Classes
  currentClasses: number;
  totalClasses: number;
  completedClasses: number;
  
  // Students
  currentStudents: number;
  totalStudentsTaught: number;
  
  // Courses
  coursesCreated: number;
  publishedCourses: number;
  
  // Exams
  examsCreated: number;
  questionsAuthored: number;
  
  // Performance
  averageRating: number; // 0-5
  totalReviews: number;
  responseRate: number; // %
  averageResponseTime: number; // hours
  
  // Engagement
  totalTeachingHours: number;
  assignmentsGraded: number;
  feedbackProvided: number;
}
```

#### 1.3. Performance Metrics
```typescript
interface TeacherPerformance {
  // Student Success Rate
  studentPassRate: number; // %
  studentAverageScore: number; // 0-10
  studentImprovement: number; // % average improvement
  
  // Engagement
  classAttendanceRate: number; // %
  assignmentSubmissionRate: number; // %
  studentRetentionRate: number; // %
  
  // Quality
  materialQuality: number; // 0-5
  teachingEffectiveness: number; // 0-5
  communicationSkills: number; // 0-5
  
  // Timeliness
  gradingSpeed: number; // average days
  feedbackQuality: number; // 0-5
  punctuality: number; // % on time
}
```

---

### 2. Danh sách giáo viên (Teacher List)

#### Hiển thị thông tin trong table
Columns:
1. **Checkbox**: Bulk selection
2. **Giáo viên**: Avatar + Title + Name + Teacher Code
3. **Email**: Contact email
4. **Chuyên môn**: Specialty badges
5. **Lớp học**: Number of current classes
6. **Học viên**: Total students teaching
7. **Đánh giá**: Rating (stars) + Review count
8. **Trạng thái**: Active/Inactive badge
9. **Actions**: View, Edit, Assign, More

#### Tính năng
- **Search**: Tìm theo tên, email, teacher code, specialty
- **Filters**:
  - Status (All/Active/Inactive/On Leave)
  - Specialty (All/Writing/Speaking/Reading/Listening/Grammar)
  - Employment Type (All/Full-time/Part-time/Contract)
  - Level (All/A2/B1/B2/C1)
  - Rating (All/5 stars/4+ stars/3+ stars)
- **Sort**: 
  - Name (A-Z, Z-A)
  - Rating (High-Low, Low-High)
  - Classes (Most-Least)
  - Students (Most-Least)
  - Joined date (Newest-Oldest)
- **View modes**: Table, Grid cards
- **Pagination**: 10 teachers per page
- **Export**: CSV, Excel, PDF

#### Stat Cards
1. **Tổng giáo viên**
   - Value: 245
   - Change: +5.2% vs last month
   - Icon: Users
   - Color: Blue gradient

2. **Đang hoạt động**
   - Value: 198
   - Percentage: 80.8%
   - Icon: Award
   - Color: Green gradient

3. **Khóa học đã tạo**
   - Value: 1,234
   - Change: +12.5%
   - Icon: BookOpen
   - Color: Purple gradient

4. **Học viên được dạy**
   - Value: 8,456
   - Average: 42.7 students/teacher
   - Icon: TrendingUp
   - Color: Orange gradient

---

### 3. Chi tiết giáo viên (Teacher Detail View)

#### Layout: Sidebar (slide from right)

##### Section 1: Header
- Large avatar với title (TS., ThS., GV.)
- Teacher name
- Teacher code
- Specialty badges
- Status badge
- Star rating
- Quick actions: Edit, Message, Assign Class

##### Section 2: Overview Stats (Cards)
```
┌─────────────┬─────────────┬─────────────┐
│ Classes: 12 │ Students:456│ Rating: 4.8 │
│ 3 active    │ Current     │ 89 reviews  │
└─────────────┴─────────────┴─────────────┘
```

##### Section 3: Current Classes
List of classes teacher is assigned to:
```
┌──────────────────────────────────────┐
│ VSTEP B2 - Batch 2024   [Primary]    │
│ 25/30 students | Progress: 65%       │
│ Schedule: Mon, Wed, Fri - 19:00      │
└──────────────────────────────────────┘
```

##### Section 4: Performance Chart (Bar/Radar)
- Student pass rate: 88%
- Average student score: 7.8
- Class attendance: 92%
- Assignment submission: 85%
- Grading speed: 1.5 days

##### Section 5: Student Reviews
Recent student reviews with ratings:
```
★★★★★ "Giáo viên dạy rất hay và tận tâm"
- Nguyễn Văn A, VSTEP B2

★★★★☆ "Phương pháp giảng dạy hiệu quả"
- Trần Thị B, Writing Course
```

##### Section 6: Teaching Schedule
Weekly calendar showing all classes

##### Section 7: Courses Created
List of courses authored by teacher:
- Course title
- Students enrolled
- Completion rate
- Rating

##### Section 8: Achievements & Certifications
- Teaching awards
- Certifications
- Publications
- Special achievements

---

### 4. Phân công giáo viên (Teacher Assignment)

#### 4.1. Assign Teacher to Class
Process:
1. Admin opens Class Management
2. Creates new class or edits existing
3. In "Teacher" field, search for teachers
4. Filter by:
   - Specialty matching class level/skill
   - Availability (schedule conflict check)
   - Workload (not overloaded)
   - Rating
5. Select primary teacher
6. Optionally add assistant teachers
7. Confirm assignment
8. Notify teacher via email
9. Add to teacher's schedule

#### 4.2. Reassign Teacher
Process:
1. Open class detail
2. Click "Change teacher"
3. Reason for reassignment (dropdown)
4. Search for replacement teacher
5. Preview new teacher profile
6. Confirm reassignment
7. Notify both teachers
8. Notify students
9. Update class records

#### 4.3. Remove Teacher from Class
Process:
1. Select class
2. Click "Remove teacher"
3. Provide reason
4. Find replacement (if mid-course)
5. Confirm removal
6. Notify teacher
7. Update records

---

### 5. Lịch giảng dạy (Teaching Schedule)

#### 5.1. Weekly Schedule View
Calendar showing:
- All classes for the week
- Time slots
- Classroom/Online location
- Number of students
- Color-coded by level

#### 5.2. Conflicts Detection
System automatically detects:
- Time conflicts (overlapping classes)
- Overloaded schedule (too many hours)
- Back-to-back classes (no break)
- Weekend/holiday assignments

#### 5.3. Availability Management
Teacher can set:
- Available days and time slots
- Preferred teaching hours
- Maximum hours per week
- Time off requests
- Holidays

---

### 6. Đánh giá giáo viên (Teacher Evaluation)

#### 6.1. Student Reviews
Students can review teachers after class completion:
- Overall rating (1-5 stars)
- Criteria ratings:
  - Teaching quality
  - Communication
  - Material quality
  - Responsiveness
  - Professionalism
- Written feedback
- Anonymous option

#### 6.2. Admin Evaluation
Admin conducts periodic evaluations:
- Teaching observation
- Material review
- Student feedback analysis
- Performance metrics review
- Professional development
- Goals setting

#### 6.3. Peer Review
Teachers can review each other:
- Classroom observation
- Material sharing feedback
- Collaboration assessment

---

### 7. Teacher Performance Reports

#### 7.1. Monthly Performance Report
- Classes taught
- Students taught
- Attendance rates
- Assignment grading stats
- Student pass rates
- Average student scores
- Feedback summary
- Goals progress

#### 7.2. Annual Review
Comprehensive report including:
- Year overview
- Classes and students summary
- Performance trends
- Student success stories
- Professional development
- Achievements and awards
- Goals achieved
- Next year plans

---

## UI Components

### Component: TeachersPage.tsx

#### Structure
```tsx
<TeachersPage>
  {/* Header */}
  <PageHeader>
    <h1>Quản lý giáo viên</h1>
    <Button onClick={addTeacher}>Thêm giáo viên</Button>
  </PageHeader>

  {/* Stats Cards */}
  <StatsGrid>
    <StatCard 
      title="Tổng giáo viên" 
      value={245} 
      change="+5.2%" 
      icon={Users}
      color="from-blue-500 to-blue-600"
    />
    <StatCard 
      title="Đang hoạt động" 
      value={198} 
      change="+3.1%" 
      icon={Award}
      color="from-green-500 to-green-600"
    />
    <StatCard 
      title="Khóa học đã tạo" 
      value={1234} 
      change="+12.5%" 
      icon={BookOpen}
      color="from-purple-500 to-purple-600"
    />
    <StatCard 
      title="Học viên được dạy" 
      value={8456} 
      change="+18.3%" 
      icon={TrendingUp}
      color="from-orange-500 to-orange-600"
    />
  </StatsGrid>

  {/* Filters & Search */}
  <FilterBar>
    <SearchInput 
      placeholder="Tìm kiếm giáo viên..."
      value={searchQuery}
      onChange={setSearchQuery}
    />
    <FilterDropdown label="Status" options={statuses} />
    <FilterDropdown label="Specialty" options={specialties} />
    <FilterDropdown label="Employment" options={employmentTypes} />
    <FilterDropdown label="Rating" options={ratings} />
    <ExportButton />
  </FilterBar>

  {/* Teachers Table */}
  <TeachersTable>
    <TableHeader>
      <Checkbox onChange={toggleSelectAll} />
      <th>Giáo viên</th>
      <th>Email</th>
      <th>Chuyên môn</th>
      <th>Lớp học</th>
      <th>Học viên</th>
      <th>Đánh giá</th>
      <th>Trạng thái</th>
      <th>Actions</th>
    </TableHeader>
    <TableBody>
      {teachers.map(teacher => (
        <TeacherRow 
          key={teacher.id}
          teacher={teacher}
          onView={viewDetail}
          onEdit={editTeacher}
          onAssign={assignToClass}
        />
      ))}
    </TableBody>
  </TeachersTable>

  {/* Pagination */}
  <Pagination />

  {/* Teacher Detail Sidebar */}
  {selectedTeacher && (
    <TeacherDetailSidebar
      teacher={selectedTeacher}
      onClose={closeSidebar}
    >
      <TeacherHeader />
      <OverviewStats />
      <CurrentClasses />
      <PerformanceChart />
      <StudentReviews />
      <TeachingSchedule />
      <CoursesCreated />
      <Achievements />
    </TeacherDetailSidebar>
  )}
</TeachersPage>
```

---

### Component: TeacherCard.tsx

```tsx
interface TeacherCardProps {
  teacher: Teacher;
  onClick: (teacherId: string) => void;
}

<TeacherCard className="bg-white rounded-xl p-6 shadow hover:shadow-lg">
  {/* Header */}
  <div className="flex items-start gap-4">
    <Avatar size="lg" src={teacher.avatar} />
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <Badge>{teacher.title}</Badge>
        <h3 className="text-lg font-semibold">{teacher.name}</h3>
      </div>
      <p className="text-sm text-gray-600">{teacher.teacherCode}</p>
      <div className="flex items-center gap-2 mt-1">
        <StarRating rating={teacher.rating} size="sm" />
        <span className="text-xs text-gray-500">
          ({teacher.totalReviews} reviews)
        </span>
      </div>
    </div>
  </div>

  {/* Specialties */}
  <div className="mt-4 flex flex-wrap gap-2">
    {teacher.specialties.map(specialty => (
      <Badge key={specialty} variant="secondary">
        {specialty}
      </Badge>
    ))}
  </div>

  {/* Stats Grid */}
  <div className="grid grid-cols-3 gap-4 mt-4">
    <Stat icon={BookOpen} label="Lớp học" value={teacher.currentClasses} />
    <Stat icon={Users} label="Học viên" value={teacher.currentStudents} />
    <Stat icon={Award} label="Khóa học" value={teacher.coursesCreated} />
  </div>

  {/* Status & Experience */}
  <div className="mt-4 flex justify-between items-center">
    <Badge status={teacher.status}>{teacher.status}</Badge>
    <span className="text-xs text-gray-500">
      {teacher.experience} năm kinh nghiệm
    </span>
  </div>

  {/* Actions */}
  <div className="mt-4 flex gap-2">
    <Button size="sm" onClick={() => onClick(teacher.id)}>
      Xem chi tiết
    </Button>
    <Button size="sm" variant="outline" onClick={() => onAssign(teacher.id)}>
      Phân công
    </Button>
  </div>
</TeacherCard>
```

---

## User Flows

### Flow 1: Admin thêm giáo viên mới

```
START
  ↓
Admin clicks "Thêm giáo viên"
  ↓
Add Teacher Modal opens
  ↓
Form with multiple tabs:

Tab 1: Basic Info
  - Title: [Dropdown: TS., ThS., GV.]
  - Name: [Input]
  - Email: [Input]
  - Phone: [Input]
  - Date of Birth: [Date picker]
  - Gender: [Radio]
  - Avatar: [Upload]
  ↓
Tab 2: Professional Info
  - Teacher Code: [Auto-generated: GV-2024-00046]
  - Employment Type: [Dropdown]
  - Joined Date: [Date picker]
  - Education: [Add multiple]
  - Certifications: [Add multiple]
  - Experience: [Number] years
  ↓
Tab 3: Teaching Info
  - Specialties: [Multi-select checkboxes]
    ☑ Writing
    ☑ Speaking
    ☐ Reading
    ☐ Listening
  - Levels: [Multi-select]
    ☑ B2
    ☑ C1
  - Preferred Skills: [Multi-select]
  - Bio: [Textarea]
  ↓
Tab 4: Contact & Settings
  - LinkedIn: [URL]
  - Website: [URL]
  - Availability: [Configure schedule]
  - Max hours/week: [Number]
  ↓
Admin fills all required fields
  ↓
Admin clicks "Tạo giáo viên"
  ↓
Frontend validation
  ├─→ If invalid: Show errors
  └─→ If valid: Continue
  ↓
API call: POST /api/teachers
  Body: {
    title: "TS.",
    name: "Nguyễn Văn F",
    email: "nguyenvanf@vstepro.com",
    phone: "0901111111",
    employmentType: "full_time",
    specialties: ["Writing", "Speaking"],
    levels: ["B2", "C1"],
    ...
  }
  ↓
Backend:
  ├─→ Validate data
  ├─→ Check email uniqueness
  ├─→ Generate teacher code
  ├─→ Hash password (auto-generated)
  ├─→ Create user record (role=Teacher)
  ├─→ Create teacher_profiles record
  ├─→ Create teacher_stats record
  ├─→ Send welcome email with credentials
  ├─→ Log activity
  └─→ Return success
  ↓
Frontend:
  ├─→ Close modal
  ├─→ Show success notification
  ├─→ Refresh teacher list
  └─→ Optionally navigate to teacher detail
  ↓
Teacher receives welcome email
  ↓
END
```

### Flow 2: Admin phân công giáo viên vào lớp

```
START
  ↓
Admin navigates to Class Management
  ↓
Admin clicks "Edit" on class "VSTEP B2 - Batch 2024"
  ↓
Edit Class Modal opens
  ↓
Admin scrolls to "Teacher Assignment" section
  ↓
Current teacher: Nguyễn Văn A
[Change Teacher] button
  ↓
Admin clicks "Change Teacher"
  ↓
Find Teacher Modal opens
  ↓
Search/Filter interface:
  - Search by name
  - Filter by specialty: Writing ✓
  - Filter by level: B2 ✓
  - Filter by availability
  - Filter by rating: 4+ stars
  ↓
System shows 8 available teachers
  ↓
Admin reviews teacher cards:
  For each teacher, shows:
    - Name, title, rating
    - Current workload
    - Schedule (to check conflicts)
    - Specialties
    - Performance metrics
  ↓
Admin selects "TS. Vũ Thị F"
  - Rating: 4.9
  - Specialty: Writing, Speaking
  - Current classes: 10 (capacity: 15)
  - No schedule conflicts ✓
  ↓
Preview shows:
  ```
  Thay đổi giáo viên cho lớp:
  
  Lớp: VSTEP B2 - Batch 2024
  
  Giáo viên cũ: TS. Nguyễn Văn A
  Giáo viên mới: TS. Vũ Thị F
  
  Lý do: [Dropdown]
  - Nghỉ phép
  - Chuyển công tác
  - Theo yêu cầu
  - Khác...
  
  Ghi chú: [Textarea]
  
  ☑ Thông báo giáo viên cũ
  ☑ Thông báo giáo viên mới
  ☑ Thông báo học viên
  ```
  ↓
Admin selects reason: "Nghỉ phép"
Admin adds note: "GV Nguyễn Văn A xin nghỉ phép 1 tháng"
  ↓
Admin clicks "Xác nhận thay đổi"
  ↓
API call: PATCH /api/classes/:classId/teacher
  Body: {
    oldTeacherId: "uuid-teacher-a",
    newTeacherId: "uuid-teacher-f",
    reason: "on_leave",
    note: "...",
    notifyOldTeacher: true,
    notifyNewTeacher: true,
    notifyStudents: true
  }
  ↓
Backend:
  ├─→ Verify class exists
  ├─→ Verify new teacher availability
  ├─→ Check schedule conflicts
  ├─→ BEGIN TRANSACTION
  │
  ├─→ Update class_teachers:
  │    - Set old teacher: removed_at=NOW(), is_active=false
  │    - Insert new teacher: role='primary', is_active=true
  │
  ├─→ Update class record: updated_at=NOW()
  │
  ├─→ Log activity:
  │    "Changed teacher for class from A to F. Reason: on_leave"
  │
  ├─→ Queue notifications:
  │    - Email to old teacher
  │    - Email to new teacher (with class info)
  │    - Email to all students (25 emails)
  │    - In-app notification to all
  │
  ├─→ Update teacher stats:
  │    - Teacher A: current_classes -= 1
  │    - Teacher F: current_classes += 1
  │
  └─→ COMMIT TRANSACTION
  ↓
Backend returns success
  ↓
Frontend:
  ├─→ Close modal
  ├─→ Show success toast
  ├─→ Refresh class detail
  └─→ Update teacher in class display
  ↓
--- Email notifications sent ---
  ↓
Old Teacher (Nguyễn Văn A) receives:
  "Thông báo thay đổi phân công
  Lớp VSTEP B2 - Batch 2024 đã được phân công cho giáo viên khác.
  Lý do: Nghỉ phép
  Thời gian: 11/12/2024"
  ↓
New Teacher (Vũ Thị F) receives:
  "Bạn được phân công lớp mới
  Lớp: VSTEP B2 - Batch 2024
  Số học viên: 25
  Lịch học: Mon, Wed, Fri - 19:00-21:00
  Bắt đầu từ: 16/12/2024
  
  [View Class Details] [View Schedule]"
  ↓
All Students receive:
  "Thông báo thay đổi giáo viên
  Lớp VSTEP B2 - Batch 2024
  
  Giáo viên mới: TS. Vũ Thị F
  Chuyên môn: Writing, Speaking
  Rating: 4.9/5
  
  Buổi học đầu tiên: 16/12 - 19:00"
  ↓
END
```

### Flow 3: Teacher xem và cập nhật profile của mình

```
START
  ↓
Teacher logs in
  ↓
Navigates to Profile page
  ↓
System loads Teacher Profile
  ↓
API call: GET /api/teachers/me
  ↓
Display profile with tabs:
  1. Tổng quan
  2. Thông tin cá nhân
  3. Lớp học đang dạy
  4. Lịch giảng dạy
  5. Đánh giá
  6. Khóa học
  7. Cài đặt
  ↓
Tab 1: Tổng quan
  - Overview stats
  - Performance chart
  - Recent activities
  - Upcoming classes
  ↓
Tab 2: Thông tin cá nhân
  - Basic info (editable)
  - Professional info
  - Specialties
  - Certifications
  - [Edit] button for each section
  ↓
Teacher clicks "Edit" on Bio section
  ↓
Inline edit mode:
  - Bio: [Textarea - currently 200 chars]
  - Achievements: [Add/Remove list]
  - Publications: [Add/Remove list]
  [Cancel] [Save]
  ↓
Teacher updates bio:
  "Giáo viên VSTEP với 15 năm kinh nghiệm.
  Chuyên sâu về Writing và Speaking.
  Đã giúp hơn 1000 học viên đạt điểm VSTEP mục tiêu."
  ↓
Teacher adds achievement:
  "Best Teacher Award 2023"
  ↓
Teacher clicks "Save"
  ↓
API call: PATCH /api/teachers/me
  Body: {
    bio: "...",
    achievements: ["Best Teacher Award 2023", ...]
  }
  ↓
Backend:
  ├─→ Validate data
  ├─→ Update teacher_profiles
  ├─→ Log activity
  └─→ Return success
  ↓
Frontend:
  ├─→ Exit edit mode
  ├─→ Show updated info
  └─→ Show success toast
  ↓
Tab 3: Lớp học đang dạy
  Shows all current classes:
  
  ┌────────────────────────────────────┐
  │ VSTEP B2 - Batch 2024              │
  │ 25 students | Progress: 65%       │
  │ Mon, Wed, Fri - 19:00-21:00       │
  │ [View Details] [Manage Students]  │
  └────────────────────────────────────┘
  
  Teacher can:
    - View class details
    - Manage students
    - Take attendance
    - Grade assignments
    - Post announcements
  ↓
Tab 4: Lịch giảng dạy
  Weekly calendar view:
    - All classes for the week
    - Color-coded by class
    - Shows time, location, students
  
  Teacher can:
    - Set availability
    - Request time off
    - View upcoming sessions
  ↓
Tab 5: Đánh giá
  Student reviews and ratings:
    - Overall rating: 4.8/5 (89 reviews)
    - Recent reviews (10 latest)
    - Rating breakdown:
      - 5 stars: 75%
      - 4 stars: 20%
      - 3 stars: 5%
    - Criteria ratings:
      - Teaching quality: 4.9
      - Communication: 4.8
      - Material quality: 4.7
  
  Teacher can:
    - Read all reviews
    - Reply to reviews (optional)
    - Flag inappropriate reviews
  ↓
Tab 6: Khóa học
  Courses created by teacher:
    - Published: 12 courses
    - Draft: 3 courses
    - Archived: 2 courses
  
  For each course:
    - Title, description
    - Students enrolled
    - Completion rate
    - Rating
    [Edit] [View Stats] [Duplicate]
  
  Teacher can:
    - Create new course
    - Edit existing courses
    - View course analytics
  ↓
Tab 7: Cài đặt
  - Notification preferences
  - Availability settings
  - Teaching preferences
  - Privacy settings
  ↓
END
```

---

## Sequence Diagrams

### Diagram 1: Get Teacher Detail with Performance Metrics

```
Actor: Admin
UI: TeacherDetailSidebar
API: Backend API
DB: Database

Admin -> UI: Click on teacher row "TS. Nguyễn Văn A"
UI -> UI: Open sidebar with loading
UI -> API: GET /api/teachers/:id/detail

API -> DB: Get teacher basic info
  SELECT u.*, tp.*
  FROM users u
  JOIN teacher_profiles tp ON u.id = tp.user_id
  WHERE u.id = :id AND u.role = 'Teacher'
DB -> API: Return teacher data

API -> DB: Get teacher stats
  SELECT * FROM teacher_stats WHERE teacher_id = :id
DB -> API: Return stats

API -> DB: Get current classes
  SELECT c.*, COUNT(cs.student_id) as student_count
  FROM class_teachers ct
  JOIN classes c ON ct.class_id = c.id
  LEFT JOIN class_students cs ON c.id = cs.class_id 
    AND cs.status = 'active'
  WHERE ct.teacher_id = :id 
    AND ct.is_active = true
  GROUP BY c.id
DB -> API: Return 12 classes

API -> DB: Calculate performance metrics
  -- Student pass rate
  SELECT 
    COUNT(CASE WHEN sr.score >= sr.passing_score THEN 1 END) * 100.0 / COUNT(*) as pass_rate
  FROM student_test_results sr
  JOIN class_students cs ON sr.student_id = cs.student_id
  JOIN class_teachers ct ON cs.class_id = ct.class_id
  WHERE ct.teacher_id = :id
    AND sr.submitted_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
DB -> API: pass_rate = 88%

API -> DB: Get student average score
  SELECT AVG(sr.score) as avg_score
  FROM student_test_results sr
  JOIN class_students cs ON sr.student_id = cs.student_id
  JOIN class_teachers ct ON cs.class_id = ct.class_id
  WHERE ct.teacher_id = :id
DB -> API: avg_score = 7.8

API -> DB: Get reviews
  SELECT tr.*, u.name as reviewer_name, u.avatar
  FROM teacher_reviews tr
  JOIN users u ON tr.student_id = u.id
  WHERE tr.teacher_id = :id
  ORDER BY tr.created_at DESC
  LIMIT 10
DB -> API: Return 10 reviews

API -> DB: Get teaching schedule
  SELECT cs.*, c.name as class_name
  FROM class_schedules cs
  JOIN classes c ON cs.class_id = c.id
  JOIN class_teachers ct ON c.id = ct.class_id
  WHERE ct.teacher_id = :id
    AND ct.is_active = true
DB -> API: Return schedule

API -> DB: Get courses created
  SELECT * FROM courses
  WHERE created_by = :id
  ORDER BY created_at DESC
DB -> API: Return courses

API -> API: Aggregate all data
  {
    teacher: {...},
    stats: {...},
    classes: [...],
    performance: {...},
    reviews: [...],
    schedule: {...},
    courses: [...]
  }

API -> UI: Return complete teacher detail

UI -> UI: Render all sections
  - Header with photo and basic info
  - Overview stats cards
  - Current classes list
  - Performance charts (bar chart, radar chart)
  - Student reviews (with stars)
  - Teaching schedule (calendar)
  - Courses created (grid)
  - Achievements badges

UI -> Admin: Display complete teacher profile
```

---

## Database Design

### Table: teacher_profiles

```sql
CREATE TABLE teacher_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Teacher Info
  teacher_code VARCHAR(50) UNIQUE, -- GV-2023-00045
  title VARCHAR(10), -- TS., ThS., GV.
  joined_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Employment
  employment_type VARCHAR(20) NOT NULL DEFAULT 'full_time',
    -- ENUM: 'full_time', 'part_time', 'contract', 'visiting'
  status VARCHAR(20) DEFAULT 'active',
    -- ENUM: 'active', 'inactive', 'on_leave', 'retired'
  
  -- Academic Background
  education JSONB, -- [{"degree": "Ph.D.", "major": "Linguistics", "school": "Harvard", "year": 2015}]
  certifications JSONB, -- ["CELTA", "DELTA", "IELTS Examiner"]
  experience INTEGER DEFAULT 0, -- years
  
  -- Specialty
  specialties JSONB, -- ["Writing", "Speaking"]
  levels_taught JSONB, -- ["B2", "C1"]
  preferred_skills JSONB, -- ["Writing", "Speaking"]
  
  -- Bio
  bio TEXT,
  achievements JSONB, -- ["Best Teacher 2023"]
  publications JSONB, -- ["Book Title", "Paper Title"]
  
  -- Contact
  linkedin_url VARCHAR(255),
  website_url VARCHAR(255),
  
  -- Availability
  max_hours_per_week INTEGER DEFAULT 40,
  preferred_teaching_time VARCHAR(50), -- "morning", "afternoon", "evening"
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  UNIQUE (user_id)
);
```

### Table: teacher_stats

```sql
CREATE TABLE teacher_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Classes
  current_classes INTEGER DEFAULT 0,
  total_classes INTEGER DEFAULT 0,
  completed_classes INTEGER DEFAULT 0,
  
  -- Students
  current_students INTEGER DEFAULT 0,
  total_students_taught INTEGER DEFAULT 0,
  
  -- Courses
  courses_created INTEGER DEFAULT 0,
  published_courses INTEGER DEFAULT 0,
  
  -- Exams & Questions
  exams_created INTEGER DEFAULT 0,
  questions_authored INTEGER DEFAULT 0,
  
  -- Performance
  average_rating DECIMAL(2,1) DEFAULT 0, -- 0-5
  total_reviews INTEGER DEFAULT 0,
  response_rate DECIMAL(5,2) DEFAULT 0, -- %
  average_response_time INTEGER DEFAULT 0, -- hours
  
  -- Engagement
  total_teaching_hours INTEGER DEFAULT 0,
  assignments_graded INTEGER DEFAULT 0,
  feedback_provided INTEGER DEFAULT 0,
  
  -- Success Metrics
  student_pass_rate DECIMAL(5,2) DEFAULT 0, -- %
  student_average_score DECIMAL(3,1) DEFAULT 0, -- 0-10
  class_attendance_rate DECIMAL(5,2) DEFAULT 0, -- %
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_calculated_at TIMESTAMP,
  
  UNIQUE (teacher_id)
);
```

### Table: teacher_reviews

```sql
CREATE TABLE teacher_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  
  -- Rating
  overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  
  -- Criteria Ratings (1-5)
  teaching_quality INTEGER CHECK (teaching_quality >= 1 AND teaching_quality <= 5),
  communication INTEGER CHECK (communication >= 1 AND communication <= 5),
  material_quality INTEGER CHECK (material_quality >= 1 AND material_quality <= 5),
  responsiveness INTEGER CHECK (responsiveness >= 1 AND responsiveness <= 5),
  professionalism INTEGER CHECK (professionalism >= 1 AND professionalism <= 5),
  
  -- Feedback
  comment TEXT,
  pros TEXT,
  cons TEXT,
  
  -- Settings
  is_anonymous BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE, -- Student actually took class
  
  -- Status
  status VARCHAR(20) DEFAULT 'published',
    -- ENUM: 'draft', 'published', 'flagged', 'removed'
  flagged_reason TEXT,
  
  -- Response
  teacher_response TEXT,
  responded_at TIMESTAMP,
  
  -- Helpful votes
  helpful_count INTEGER DEFAULT 0,
  not_helpful_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_reviews_teacher (teacher_id),
  INDEX idx_reviews_student (student_id),
  INDEX idx_reviews_class (class_id),
  INDEX idx_reviews_rating (overall_rating),
  INDEX idx_reviews_created (created_at),
  
  -- One review per student per class
  UNIQUE (teacher_id, student_id, class_id)
);
```

### Table: teacher_availability

```sql
CREATE TABLE teacher_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Availability
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  
  -- Status
  is_available BOOLEAN DEFAULT TRUE,
  
  -- Recurring
  is_recurring BOOLEAN DEFAULT TRUE,
  effective_from DATE,
  effective_to DATE,
  
  -- Notes
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_availability_teacher (teacher_id),
  INDEX idx_availability_day (day_of_week),
  
  CONSTRAINT chk_time CHECK (end_time > start_time)
);
```

### Table: teacher_time_off

```sql
CREATE TABLE teacher_time_off (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Time Off Period
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  
  -- Type
  type VARCHAR(20) NOT NULL,
    -- ENUM: 'vacation', 'sick_leave', 'personal', 'conference', 'other'
  reason TEXT,
  
  -- Approval
  status VARCHAR(20) DEFAULT 'pending',
    -- ENUM: 'pending', 'approved', 'rejected', 'cancelled'
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP,
  rejection_reason TEXT,
  
  -- Impact
  affected_classes JSONB, -- Array of class IDs
  replacement_teacher_id UUID REFERENCES users(id),
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_time_off_teacher (teacher_id),
  INDEX idx_time_off_dates (start_date, end_date),
  INDEX idx_time_off_status (status),
  
  CONSTRAINT chk_dates CHECK (end_date >= start_date)
);
```

### Table: teacher_evaluations

```sql
CREATE TABLE teacher_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Evaluation Info
  evaluation_type VARCHAR(20) NOT NULL,
    -- ENUM: 'quarterly', 'annual', 'probation', 'performance_review'
  evaluation_period_start DATE NOT NULL,
  evaluation_period_end DATE NOT NULL,
  
  -- Evaluator
  evaluated_by UUID NOT NULL REFERENCES users(id),
  evaluation_date DATE NOT NULL,
  
  -- Scores (1-5 scale)
  teaching_effectiveness DECIMAL(2,1),
  student_engagement DECIMAL(2,1),
  material_quality DECIMAL(2,1),
  professionalism DECIMAL(2,1),
  collaboration DECIMAL(2,1),
  innovation DECIMAL(2,1),
  overall_score DECIMAL(2,1),
  
  -- Feedback
  strengths TEXT,
  areas_for_improvement TEXT,
  goals_set JSONB, -- [{"goal": "...", "deadline": "2025-06-30"}]
  comments TEXT,
  
  -- Recommendations
  recommendation VARCHAR(20),
    -- ENUM: 'promote', 'maintain', 'develop', 'probation', 'terminate'
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft',
    -- ENUM: 'draft', 'completed', 'acknowledged', 'disputed'
  acknowledged_by_teacher BOOLEAN DEFAULT FALSE,
  acknowledged_at TIMESTAMP,
  teacher_comments TEXT,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_evaluations_teacher (teacher_id),
  INDEX idx_evaluations_type (evaluation_type),
  INDEX idx_evaluations_date (evaluation_date),
  INDEX idx_evaluations_evaluator (evaluated_by)
);
```

---

## API Endpoints

### 1. Get Teacher List

**Endpoint**: `GET /api/teachers`

**Permission**: `teacher.view`

**Query Parameters**:
```typescript
{
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'inactive' | 'on_leave' | 'all';
  specialty?: string;
  employmentType?: 'full_time' | 'part_time' | 'contract' | 'all';
  level?: 'A2' | 'B1' | 'B2' | 'C1' | 'all';
  minRating?: number; // 0-5
  sortBy?: 'name' | 'rating' | 'classes' | 'students' | 'joined_date';
  sortOrder?: 'asc' | 'desc';
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "teachers": [
      {
        "id": "uuid",
        "teacherCode": "GV-2023-00045",
        "title": "TS.",
        "name": "Nguyễn Văn A",
        "email": "nguyenvana@vstepro.com",
        "avatar": "https://...",
        "status": "active",
        "employmentType": "full_time",
        "specialties": ["Writing", "Speaking"],
        "levelsTaught": ["B2", "C1"],
        "stats": {
          "currentClasses": 12,
          "currentStudents": 456,
          "coursesCreated": 25,
          "averageRating": 4.8,
          "totalReviews": 89
        },
        "experience": 15,
        "joinedDate": "2023-01-15"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 245,
      "totalPages": 25
    },
    "stats": {
      "total": 245,
      "active": 198,
      "inactive": 30,
      "onLeave": 17
    }
  }
}
```

---

### 2. Get Teacher Detail

**Endpoint**: `GET /api/teachers/:id/detail`

**Permission**: `teacher.view` (Admin for all, Teacher for self)

**Response**: (Includes all teacher info, stats, classes, reviews, performance metrics)

---

### 3. Create Teacher

**Endpoint**: `POST /api/teachers`

**Permission**: `teacher.create` (Admin only)

**Request Body**:
```json
{
  "title": "TS.",
  "name": "Nguyễn Văn F",
  "email": "nguyenvanf@vstepro.com",
  "phone": "0901111111",
  "employmentType": "full_time",
  "specialties": ["Writing", "Speaking"],
  "levelsTaught": ["B2", "C1"],
  "education": [
    {
      "degree": "Ph.D.",
      "major": "Applied Linguistics",
      "school": "University of Cambridge",
      "year": 2018
    }
  ],
  "certifications": ["CELTA", "DELTA"],
  "experience": 12,
  "bio": "Experienced VSTEP teacher...",
  "maxHoursPerWeek": 40
}
```

**Response**:
```json
{
  "success": true,
  "message": "Teacher created successfully",
  "data": {
    "teacher": {
      "id": "uuid",
      "teacherCode": "GV-2024-00046",
      ...
    },
    "credentials": {
      "email": "nguyenvanf@vstepro.com",
      "temporaryPassword": "TempPass123!",
      "changePasswordRequired": true
    }
  }
}
```

---

### 4. Update Teacher

**Endpoint**: `PATCH /api/teachers/:id`

**Permission**: `teacher.edit` (Admin for all, Teacher for self - limited fields)

---

### 5. Assign Teacher to Class

**Endpoint**: `PATCH /api/classes/:classId/teacher`

**Permission**: `class.assign_teacher`

**Request Body**:
```json
{
  "teacherId": "uuid",
  "role": "primary",
  "notifyTeacher": true,
  "notifyStudents": true
}
```

---

### 6. Get Teacher Reviews

**Endpoint**: `GET /api/teachers/:id/reviews`

**Permission**: `teacher.view`

**Response**:
```json
{
  "success": true,
  "data": {
    "summary": {
      "averageRating": 4.8,
      "totalReviews": 89,
      "distribution": {
        "5": 75,
        "4": 20,
        "3": 5,
        "2": 0,
        "1": 0
      },
      "criteriaAverages": {
        "teachingQuality": 4.9,
        "communication": 4.8,
        "materialQuality": 4.7,
        "responsiveness": 4.6,
        "professionalism": 4.9
      }
    },
    "reviews": [
      {
        "id": "uuid",
        "studentName": "Nguyễn Văn A",
        "studentAvatar": "https://...",
        "className": "VSTEP B2 - Batch 2024",
        "overallRating": 5,
        "comment": "Giáo viên dạy rất hay và tận tâm",
        "createdAt": "2024-12-01",
        "isVerified": true
      }
    ]
  }
}
```

---

### 7. Create Teacher Review

**Endpoint**: `POST /api/teachers/:id/reviews`

**Permission**: `teacher.review` (Student who took class)

**Request Body**:
```json
{
  "classId": "uuid",
  "overallRating": 5,
  "teachingQuality": 5,
  "communication": 5,
  "materialQuality": 4,
  "responsiveness": 5,
  "professionalism": 5,
  "comment": "Giáo viên dạy rất hay và tận tâm",
  "pros": "Giảng bài rõ ràng, nhiệt tình",
  "cons": "Không có",
  "isAnonymous": false
}
```

---

### 8. Get Teacher Schedule

**Endpoint**: `GET /api/teachers/:id/schedule`

**Permission**: `teacher.view`

**Query Parameters**:
```typescript
{
  startDate?: Date; // Default: today
  endDate?: Date; // Default: +7 days
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "schedule": [
      {
        "classId": "uuid",
        "className": "VSTEP B2 - Batch 2024",
        "dayOfWeek": 1,
        "date": "2024-12-16",
        "startTime": "19:00",
        "endTime": "21:00",
        "location": "Online",
        "studentsCount": 25,
        "status": "scheduled"
      }
    ],
    "summary": {
      "totalHours": 12,
      "totalSessions": 6,
      "conflicts": []
    }
  }
}
```

---

### 9. Request Time Off

**Endpoint**: `POST /api/teachers/:id/time-off`

**Permission**: `teacher.time_off`

**Request Body**:
```json
{
  "startDate": "2024-12-20",
  "endDate": "2024-12-27",
  "type": "vacation",
  "reason": "Family vacation"
}
```

**Response**: (Returns time off request with affected classes)

---

### 10. Get Teacher Performance Report

**Endpoint**: `GET /api/teachers/:id/performance`

**Permission**: `teacher.view`

**Query Parameters**:
```typescript
{
  period?: 'month' | 'quarter' | 'year';
  year?: number;
  quarter?: number; // 1-4
  month?: number; // 1-12
}
```

**Response**: (Comprehensive performance metrics and analytics)

---

## Summary

Module Teacher Management cung cấp:
- **10 API endpoints** đầy đủ cho quản lý giáo viên
- **6 database tables** chuyên biệt cho teacher data
- **3 user flows** chi tiết
- **1 sequence diagram** phức tạp
- **Complete teacher profile** với professional info
- **Class assignment** và scheduling
- **Performance tracking** và reviews
- **Time management** và availability

**Ngày tạo**: 2024-12-11  
**Phiên bản**: 1.0

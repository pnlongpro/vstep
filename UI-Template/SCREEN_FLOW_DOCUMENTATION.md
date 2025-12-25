# 📱 VSTEPRO - Screen Flow Documentation

## 📋 Mục lục
1. [Kiến trúc tổng quan](#1-kiến-trúc-tổng-quan)
2. [Authentication Flow](#2-authentication-flow)
3. [Navigation Map - Di chuyển giữa các màn hình](#3-navigation-map---di-chuyển-giữa-các-màn-hình)
4. [Student Dashboard Flow](#4-student-dashboard-flow)
5. [Teacher Dashboard Flow](#5-teacher-dashboard-flow)
6. [Admin Dashboard Flow](#6-admin-dashboard-flow)
7. [Uploader Dashboard Flow](#7-uploader-dashboard-flow)
8. [Practice Flow](#8-practice-flow)
9. [Exam Flow](#9-exam-flow)
10. [Shared Components](#10-shared-components)

---

## 1. Kiến trúc tổng quan

### 🎯 Entry Point
- **File:** `/App.tsx`
- **Component:** `App`
- **Mô tả:** Root component quản lý toàn bộ routing, authentication state, và navigation logic

### 🔄 Main Flow Structure
```
App.tsx (Root)
├── Authentication Flow (Login/Register/Forgot Password)
├── Student Dashboard Flow (currentPage === 'dashboard' && userRole === 'student')
├── Teacher Dashboard Flow (currentPage === 'dashboard' && userRole === 'teacher')
├── Admin Dashboard Flow (currentPage === 'admin-dashboard')
├── Uploader Dashboard Flow (currentPage === 'dashboard' && userRole === 'uploader')
├── Practice Flow (PracticeHome → Skills → Practice)
├── Exam Flow (Mock Exam/Virtual Exam/Exam Room)
└── Shared Pages (Profile, Statistics, History, Documents, etc.)
```

### 🎨 Layout Structure
```
┌─────────────────────────────────────────┐
│  Header (Navigation Bar)                │
├─────────┬───────────────────────────────┤
│         │                               │
│ Sidebar │  Main Content Area            │
│ (320px) │  (max-width: 1280px)          │
│         │                               │
│ Fixed   │  Dynamic Content Based on     │
│ Left    │  currentPage State            │
│         │                               │
└─────────┴───────────────────────────────┘
            Footer (Only on Home)
```

---

## 2. Authentication Flow

### 🔐 Login Screen
- **Component:** `LoginPage`
- **File:** `/components/auth/LoginPage.tsx`
- **Route:** `authPage === 'login'`
- **Features:**
  - Email/Password authentication
  - "Quên mật khẩu?" link → ForgotPasswordPage
  - "Đăng ký" link → RegisterPage
  - Tự động redirect về Home sau khi login thành công

**Flow:**
```
LoginPage
├── Success → setAuthState() → Home Page
├── "Đăng ký" → RegisterPage
└── "Quên mật khẩu" → ForgotPasswordPage
```

### 📝 Register Screen
- **Component:** `RegisterPage`
- **File:** `/components/auth/RegisterPage.tsx`
- **Route:** `authPage === 'register'`
- **Features:**
  - Form đăng ký: Họ tên, Email, Mật khẩu, Số điện thoại, Mục tiêu
  - "Đã có tài khoản? Đăng nhập" → LoginPage
  - Tự động show Onboarding Modal sau khi đăng ký thành công

**Flow:**
```
RegisterPage
├── Success → setAuthState() → OnboardingModal → Home Page
└── "Đăng nhập" → LoginPage
```

### 🔑 Forgot Password Screen
- **Component:** `ForgotPasswordPage`
- **File:** `/components/auth/ForgotPasswordPage.tsx`
- **Route:** `authPage === 'forgot-password'`
- **Features:**
  - Nhập email để reset password
  - "Quay lại đăng nhập" → LoginPage

**Flow:**
```
ForgotPasswordPage
├── Submit → Email sent notification
└── "Quay lại" → LoginPage
```

---

## 3. Navigation Map - Di chuyển giữa các màn hình

### 🏠 Home Screen
- **Component:** `PracticeHome`
- **File:** `/components/PracticeHome.tsx`
- **Route:** `currentPage === 'home'`
- **Features:**
  - 4 skill cards: Reading, Listening, Writing, Speaking
  - Exam cards: Thi thử Random, Virtual Exam, Exam Room
  - Quick access to Documents, AI Assistant, Assignments
  - Click skill → Open ModeSelectionModal

**Flow:**
```
PracticeHome
├── Click Skill Card → ModeSelectionModal
│   ├── "Làm theo phần" → PartSelectionModal → PracticeList
│   └── "Làm bộ đề đầy đủ" → PracticeList
├── "Thi thử Random" → MockExam
├── "Virtual Exam" → VirtualExamRoom
├── "Exam Room" → ExamRoom
├── "Tài liệu" → DocumentsPage
├── "AI Assistant" → AIAssistant
└── "Bài tập đã giao" → AssignmentsPage
```

### 🎯 Mode Selection Modal
- **Component:** `ModeSelectionModal`
- **File:** `/components/ModeSelectionModal.tsx`
- **Trigger:** Click skill card from PracticeHome
- **Options:**
  1. **Làm theo phần** → PartSelectionModal
  2. **Làm bộ đề đầy đủ** → PracticeList (fulltest mode)

### 📑 Part Selection Modal
- **Component:** `PartSelectionModal`
- **File:** `/components/PartSelectionModal.tsx`
- **Trigger:** Select "Làm theo phần" from ModeSelectionModal
- **Options:**
  - **Reading:** Part 1, 2, 3
  - **Listening:** Part 1, 2, 3
  - **Writing:** Part 1, 2
  - **Speaking:** Part 1, 2, 3

### 📋 Practice List
- **Component:** `PracticeList`
- **File:** `/components/PracticeList.tsx`
- **Route:** `currentPage === 'practice-list'`
- **Display:** List of exercises based on:
  - `skill`: reading/listening/writing/speaking
  - `mode`: part/fulltest
  - `part`: 1/2/3 (if part mode)

**Flow:**
```
PracticeList
├── Click exercise card → Start Practice
│   ├── Reading → ReadingPractice
│   ├── Listening → ListeningPractice
│   ├── Writing → WritingPractice
│   └── Speaking → SpeakingPractice
└── "Quay lại" → PracticeHome
```

### 📖 Reading Practice
- **Component:** `ReadingPractice`
- **File:** `/components/ReadingPractice.tsx`
- **Route:** `currentPage === 'reading'`

**Sub-components:**
- **ReadingPartPractice:** `/components/ReadingPartPractice.tsx`
- **ReadingFullTest:** `/components/ReadingFullTest.tsx`
- **ReadingExercise:** `/components/reading/ReadingExercise.tsx`
- **ReadingResult:** `/components/reading/ReadingResult.tsx`

**Flow:**
```
ReadingPractice
├── Instructions
├── Exercise (ReadingExercise)
├── Submit → Result (ReadingResult)
│   ├── Score
│   ├── Correct/Wrong answers
│   └── Explanations
└── "Quay lại" → PracticeList
```

### 🎧 Listening Practice
- **Component:** `ListeningPractice`
- **File:** `/components/ListeningPractice.tsx`
- **Route:** `currentPage === 'listening'`

**Sub-components:**
- **ListeningPartPractice:** `/components/ListeningPartPractice.tsx`
- **ListeningFullTest:** `/components/ListeningFullTest.tsx`
- **ListeningExercise:** `/components/listening/ListeningExercise.tsx`
- **ListeningResult:** `/components/listening/ListeningResult.tsx`

**Flow:** Similar to Reading Practice

### ✍️ Writing Practice
- **Component:** `WritingPractice`
- **File:** `/components/WritingPractice.tsx`
- **Route:** `currentPage === 'writing'`

**Sub-components:**
- **WritingPartPractice:** `/components/WritingPartPractice.tsx`
- **WritingFullTest:** `/components/WritingFullTest.tsx`
- **WritingExercise:** `/components/writing/WritingExercise.tsx`
- **WritingResult:** `/components/writing/WritingResult.tsx`

**Features:**
- Rich text editor
- Word count
- Timer
- AI grading (optional)

### 🎤 Speaking Practice
- **Component:** `SpeakingPractice`
- **File:** `/components/SpeakingPractice.tsx`
- **Route:** `currentPage === 'speaking'`

**Sub-components:**
- **SpeakingPartPractice:** `/components/SpeakingPartPractice.tsx`
- **SpeakingFullTest:** `/components/SpeakingFullTest.tsx`
- **SpeakingExercise:** `/components/speaking/SpeakingExercise.tsx`
- **SpeakingResult:** `/components/speaking/SpeakingResult.tsx`

**Features:**
- Audio recording
- Preparation time
- Response time
- AI grading (optional)
- Audio playback

---

## 4. Student Dashboard Flow

### 🏠 Student Dashboard Home
- **Component:** `DashboardNew`
- **File:** `/components/DashboardNew.tsx`
- **Route:** `currentPage === 'dashboard' && userRole === 'student'`
- **Sidebar:** `StudentSidebar`
- **File Sidebar:** `/components/student/StudentSidebar.tsx`

**Menu Structure:**
```
StudentSidebar
├── • TỔNG QUAN
│   └── Dashboard
├── • Học tập & Luyện tập
│   ├── Khóa học của tôi → MyCoursesPage
│   ├── Luyện tập → PracticePage
│   └── Lộ trình học tập → LearningRoadmap
├── • Công cụ hỗ trợ học tập
│   ├── Tài liệu → MaterialsPage
│   ├── Lịch học → SchedulePage
│   └── Thành tích → AchievementsPage
├── • Giao tiếp & Thông báo
│   ├── Thông báo → StudentNotificationsPage
│   └── Tin nhắn lớp học → ClassMessagesPage
└── • Hệ thống
    └── Cài đặt → StudentSettingsPage
```

### 📚 Sub-Pages (Student)

#### 1. Dashboard (Tổng quan)
- **File:** `/components/DashboardNew.tsx`
- **Features:**
  - Overview statistics
  - Recent activities
  - Quick access cards

#### 2. Khóa học của tôi
- **Component:** `MyCoursesPage`
- **File:** `/components/student/MyCoursesPage.tsx`
- **Features:**
  - Danh sách khóa học đã đăng ký
  - Progress tracking
  - Chi tiết khóa học → ClassDetailPage

#### 3. Luyện tập
- **Component:** `PracticePage`
- **File:** `/components/student/PracticePage.tsx`
- **Features:**
  - Similar to PracticeHome
  - Navigate to skill practice

#### 4. Lộ trình học tập
- **Component:** `LearningRoadmap`
- **File:** `/components/student/LearningRoadmap.tsx`
- **Features:**
  - Visual roadmap với milestones
  - Progress tracking
  - Locked/Unlocked lessons

#### 5. Tài liệu
- **Component:** `MaterialsPage`
- **File:** `/components/student/MaterialsPage.tsx`
- **Features:**
  - Study materials library
  - Download/View documents
  - Filter by category

#### 6. Lịch học
- **Component:** `SchedulePage`
- **File:** `/components/student/SchedulePage.tsx`
- **Features:**
  - Calendar view
  - Upcoming classes
  - Assignment deadlines

#### 7. Thành tích
- **Component:** `AchievementsPage`
- **File:** `/components/student/AchievementsPage.tsx`
- **Features:**
  - Badges display
  - Achievements history
  - Progress bars

#### 8. Thông báo
- **Component:** `StudentNotificationsPage`
- **File:** `/components/student/StudentNotificationsPage.tsx`
- **Features:**
  - List of notifications
  - Mark as read/unread
  - Filter by type

#### 9. Tin nhắn lớp học
- **Component:** `ClassMessagesPage`
- **File:** `/components/student/ClassMessagesPage.tsx`
- **Features:**
  - Class chat threads
  - Teacher announcements
  - Reply to messages

#### 10. Cài đặt
- **Component:** `StudentSettingsPage`
- **File:** `/components/student/StudentSettingsPage.tsx`
- **Features:**
  - Profile settings
  - Notification preferences
  - Privacy settings

---

## 5. Teacher Dashboard Flow

### 👨‍🏫 Teacher Dashboard Home
- **Component:** `DashboardNew`
- **File:** `/components/DashboardNew.tsx`
- **Route:** `currentPage === 'dashboard' && userRole === 'teacher'`
- **Sidebar:** `TeacherSidebar`
- **File Sidebar:** `/components/teacher/TeacherSidebar.tsx`

**Menu Structure:**
```
TeacherSidebar
├── • TỔNG QUAN
│   └── Dashboard
├── • Lớp học & Học viên
│   ├── Quản lý lớp học → ClassManagementTeacherPage
│   └── Điểm danh → AttendancePage
├── • Bài tập & Chấm điểm
│   ├── Giao bài tập → TeacherAssignmentsPage
│   └── Chấm bài → GradingPage
├── • Lộ trình & Nội dung giảng dạy
│   ├── Thiết kế lộ trình học tập → CustomRoadmapDesigner
│   ├── Thư viện tài liệu chung → MaterialsPage
│   └── Thư viện bài tập chung → AssignmentLibraryPage
├── • Đóng góp nội dung
│   ├── Đóng góp ngân hàng đề thi → ContributeExamPage
│   ├── Đóng góp tài liệu chung → ContributeMaterialsPage
│   ├── Đóng góp bài tập chung → ContributeAssignmentsPage
│   └── Đóng góp Blog Website → TeacherBlogContribution
├── • Giao tiếp & Thông báo
│   ├── Thông báo → TeacherNotificationsPage
│   └── Tin nhắn → TeacherMessagesPage
└── • Hệ thống
    └── Cài đặt → SettingsPage
```

### 📖 Sub-Pages (Teacher)

#### 1. Dashboard (Tổng quan)
- **File:** `/components/DashboardNew.tsx`
- **Features:**
  - Class overview
  - Student performance summary
  - Pending assignments to grade

#### 2. Quản lý lớp học
- **Component:** `ClassManagementTeacherPage`
- **File:** `/components/teacher/ClassManagementTeacherPage.tsx`
- **Features:**
  - List of classes
  - Add/Edit/Delete class
  - View class details → ClassDetailPageTeacher

**Sub-component:**
- **ClassDetailPageTeacher:** `/components/teacher/ClassDetailPageTeacher.tsx`
  - Student list
  - Class materials
  - Assignments
  - Messages

#### 3. Điểm danh
- **Component:** `AttendancePage`
- **File:** `/components/teacher/AttendancePage.tsx`
- **Features:**
  - Mark attendance by class
  - Attendance history
  - Export reports

#### 4. Giao bài tập
- **Component:** `TeacherAssignmentsPage`
- **File:** `/components/teacher/TeacherAssignmentsPage.tsx`
- **Features:**
  - Create new assignment
  - Assign to class/student
  - View assignment details → AssignmentDetailView
  - Assignment by class → AssignmentByClassPage
  - Assignment by session → AssignmentBySessionPage

**Related Components:**
- **AssignmentCreatorNew:** `/components/teacher/AssignmentCreatorNew.tsx`
- **AssignmentDetailView:** `/components/teacher/AssignmentDetailView.tsx`
- **ClassAssignmentDetailView:** `/components/teacher/ClassAssignmentDetailView.tsx`

#### 5. Chấm bài
- **Component:** `GradingPage`
- **File:** `/components/teacher/GradingPage.tsx`
- **Features:**
  - List of submissions
  - Grade assignments
  - Provide feedback
  - Export grades

#### 6. Thiết kế lộ trình học tập
- **Component:** `CustomRoadmapDesigner`
- **File:** `/components/teacher/CustomRoadmapDesigner.tsx`
- **Features:**
  - Visual roadmap builder
  - Add milestones/sessions
  - Assign materials to sessions
  - Publish roadmap to class

#### 7. Thư viện tài liệu chung
- **Component:** `MaterialsPage`
- **File:** `/components/teacher/MaterialsPage.tsx`
- **Features:**
  - Browse shared materials
  - Download/View documents
  - Use in class

#### 8. Thư viện bài tập chung
- **Component:** `AssignmentLibraryPage`
- **File:** `/components/teacher/AssignmentLibraryPage.tsx`
- **Features:**
  - Browse assignment templates
  - Clone to personal library
  - Assign to class

#### 9. Đóng góp ngân hàng đề thi
- **Component:** `ContributeExamPage`
- **File:** `/components/teacher/ContributeExamPage.tsx`
- **Features:**
  - Upload exam questions
  - Review status (Pending/Approved/Rejected)
  - Edit submitted exams

#### 10. Đóng góp tài liệu chung
- **Component:** `ContributeMaterialsPage`
- **File:** `/components/teacher/ContributeMaterialsPage.tsx`
- **Features:**
  - Upload study materials
  - Add metadata (title, description, tags)
  - Review status

#### 11. Đóng góp bài tập chung
- **Component:** `ContributeAssignmentsPage`
- **File:** `/components/teacher/ContributeAssignmentsPage.tsx`
- **Features:**
  - Create assignment templates
  - Submit for approval
  - Track approval status

#### 12. Đóng góp Blog Website
- **Component:** `TeacherBlogContribution`
- **File:** `/components/teacher/TeacherBlogContribution.tsx`
- **Features:**
  - Write blog articles
  - Rich text editor
  - Submit for approval

#### 13. Thông báo
- **Component:** `TeacherNotificationsPage`
- **File:** `/components/teacher/TeacherNotificationsPage.tsx`

#### 14. Tin nhắn
- **Component:** `TeacherMessagesPage`
- **File:** `/components/teacher/TeacherMessagesPage.tsx`

#### 15. Cài đặt
- **Component:** `SettingsPage`
- **File:** `/components/teacher/SettingsPage.tsx`

---

## 6. Admin Dashboard Flow

### 👑 Admin Dashboard Home
- **Component:** `AdminDashboard`
- **File:** `/components/AdminDashboard.tsx`
- **Route:** `currentPage === 'admin-dashboard'`
- **Sidebar:** `AdminSidebar`
- **File Sidebar:** `/components/admin/AdminSidebar.tsx`

**Menu Structure:**
```
AdminSidebar
├── • TỔNG QUAN
│   └── Tổng quan → AdminDashboardPage
├── • Người dùng & Lớp học
│   ├── Tài khoản miễn phí → FreeAccountManagementPage
│   ├── Quản lý người dùng → UserManagementPage
│   ├── Quản lý giáo viên → TeachersPage
│   ├── Quản lý lớp học → ClassManagementPage
│   └── Điểm danh lớp học → AdminAttendancePage
├── • Khóa học & Giảng dạy
│   ├── Khóa học → CoursesPage
│   ├── Lộ trình học tập → AdminRoadmapManagementPage
│   └── Bài tập của giáo viên → AssignmentManagementAdmin
├── • Ngân hàng nội dung
│   ├── Thư viện tài liệu → DocumentsManagementPage
│   ├── Thư viện bài tập → AdminAssignmentLibraryPage
│   └── Ngân hàng đề thi → ExamManagementPage
├── • AI & Đánh giá
│   └── Nhật ký chấm AI → AILogsPage
├── • Nội dung & Truyền thông
│   ├── Quản lý Blog VSTEP → BlogManagement
│   ├── Quản lý thông báo → NotificationManagementPage
│   └── Tin nhắn hệ thống → AdminMessagesPage
├── • Tài chính
│   └── Giao dịch → TransactionsPage
└── • Hệ thống
    ├── Quản lý cấu hình → ConfigManagementPage
    ├── Cài đặt hệ thống → SettingsPage
    └── Quản lý sao lưu → BackupManagementPage
```

### 🔧 Sub-Pages (Admin)

#### 1. Tổng quan
- **Component:** `AdminDashboardPage`
- **File:** `/components/admin/AdminDashboardPage.tsx`
- **Features:**
  - System statistics
  - Recent activities
  - System health monitoring
  - Quick actions

#### 2. Tài khoản miễn phí
- **Component:** `FreeAccountManagementPage`
- **File:** `/components/admin/FreeAccountManagementPage.tsx`
- **Features:**
  - Generate free trial codes
  - Manage free account limits
  - Track usage

#### 3. Quản lý người dùng
- **Component:** `UserManagementPage`
- **File:** `/components/admin/UserManagementPage.tsx`
- **Features:**
  - User list with filters
  - Add/Edit/Delete users
  - View user details/history
  - Reset password
  - Account expiry management → AccountExpiryModal
  - Device limit settings → DeviceLimitModal
  - Reset login → ResetLoginModal

#### 4. Quản lý giáo viên
- **Component:** `TeachersPage`
- **File:** `/components/admin/TeachersPage.tsx`
- **Features:**
  - Teacher list
  - Approve/Reject teacher applications
  - View teacher performance

#### 5. Quản lý lớp học
- **Component:** `ClassManagementPage`
- **File:** `/components/admin/ClassManagementPage.tsx`
- **Features:**
  - All classes overview
  - Create/Edit/Delete class
  - View class details → ClassDetailPage
  - Assign teachers to classes

**Sub-component:**
- **ClassDetailPage:** `/components/admin/ClassDetailPage.tsx`

#### 6. Điểm danh lớp học
- **Component:** `AdminAttendancePage`
- **File:** `/components/admin/AdminAttendancePage.tsx`
- **Features:**
  - View all attendance records
  - Export reports
  - Analytics

#### 7. Khóa học
- **Component:** `CoursesPage`
- **File:** `/components/admin/CoursesPage.tsx`
- **Features:**
  - Course catalog management
  - Create/Edit course → CourseEditModal
  - Set pricing
  - Manage course content

#### 8. Lộ trình học tập
- **Component:** `AdminRoadmapManagementPage`
- **File:** `/components/admin/AdminRoadmapManagementPage.tsx`
- **Features:**
  - View all roadmaps
  - Approve/Reject teacher roadmaps
  - Create template roadmaps

#### 9. Bài tập của giáo viên
- **Component:** `AssignmentManagementAdmin`
- **File:** `/components/admin/AssignmentManagementAdmin.tsx`
- **Features:**
  - View all assignments
  - Monitor teacher activities
  - Intervention if needed

#### 10. Thư viện tài liệu
- **Component:** `DocumentsManagementPage`
- **File:** `/components/admin/DocumentsManagementPage.tsx`
- **Features:**
  - Upload/Delete documents
  - Organize by categories
  - Approve teacher contributions

#### 11. Thư viện bài tập
- **Component:** `AdminAssignmentLibraryPage`
- **File:** `/components/admin/AdminAssignmentLibraryPage.tsx`
- **Features:**
  - Manage assignment templates
  - Approve teacher contributions
  - Create official assignments

#### 12. Ngân hàng đề thi
- **Component:** `ExamManagementPage`
- **File:** `/components/admin/ExamManagementPage.tsx`
- **Features:**
  - Upload exam → CreateExamModalAdvanced
  - Manage exam questions → QuestionsPage
  - Approve teacher contributions → ExamApprovalTab
  - Skill selection → SkillSelectionModal

#### 13. Nhật ký chấm AI
- **Component:** `AILogsPage`
- **File:** `/components/admin/AILogsPage.tsx`
- **Features:**
  - AI grading history
  - Token usage tracking
  - Cost analysis
  - Error logs

#### 14. Quản lý Blog VSTEP
- **Component:** `BlogManagement`
- **File:** `/components/admin/BlogManagement.tsx`
- **Features:**
  - Publish blog posts
  - Approve teacher contributions
  - Edit/Delete posts
  - SEO settings

#### 15. Quản lý thông báo
- **Component:** `NotificationManagementPage`
- **File:** `/components/admin/NotificationManagementPage.tsx`
- **Features:**
  - Send system notifications
  - Schedule notifications
  - Target specific user groups

#### 16. Tin nhắn hệ thống
- **Component:** `AdminMessagesPage`
- **File:** `/components/admin/AdminMessagesPage.tsx`
- **Features:**
  - View all messages
  - Monitor teacher-student communication
  - Send announcements

#### 17. Giao dịch
- **Component:** `TransactionsPage`
- **File:** `/components/admin/TransactionsPage.tsx`
- **Features:**
  - Payment history
  - Revenue reports
  - Refund management

#### 18. Quản lý cấu hình
- **Component:** `ConfigManagementPage`
- **File:** `/components/admin/ConfigManagementPage.tsx`
- **Features:**
  - System-wide settings
  - Feature toggles
  - Maintenance mode

#### 19. Cài đặt hệ thống
- **Component:** `SettingsPage`
- **File:** `/components/admin/SettingsPage.tsx`
- **Features:**
  - Admin preferences
  - Security settings
  - Footer management → FooterManager

#### 20. Quản lý sao lưu
- **Component:** `BackupManagementPage`
- **File:** `/components/admin/BackupManagementPage.tsx`
- **Features:**
  - Create backups
  - Restore from backup
  - Schedule automatic backups
  - Storage management

---

## 7. Uploader Dashboard Flow

### 📤 Uploader Dashboard
- **Component:** `DashboardNew` (same as Teacher/Student)
- **File:** `/components/DashboardNew.tsx`
- **Route:** `currentPage === 'dashboard' && userRole === 'uploader'`
- **Sidebar:** Teacher Sidebar (có thể tùy chỉnh riêng)

**Main Features:**
- Upload exam questions
- Upload study materials
- View upload history
- Check approval status

**Related Components:**
- **UploaderDashboard:** `/components/uploader/UploaderDashboard.tsx`
- **UploaderExamUploadModal:** `/components/uploader/UploaderExamUploadModal.tsx`
- **UploaderBlogContribution:** `/components/uploader/UploaderBlogContribution.tsx`

---

## 8. Practice Flow

### 🏠 Practice Home
- **Component:** `PracticeHome`
- **File:** `/components/PracticeHome.tsx`
- **Route:** `currentPage === 'home'`

**Features:**
- 4 skill cards: Reading, Listening, Writing, Speaking
- Exam cards: Thi thử Random, Virtual Exam, Exam Room
- Quick access to Documents, AI Assistant, Assignments
- Click skill → Open ModeSelectionModal

**Flow:**
```
PracticeHome
├── Click Skill Card → ModeSelectionModal
│   ├── "Làm theo phần" → PartSelectionModal → PracticeList
│   └── "Làm bộ đề đầy đủ" → PracticeList
├── "Thi thử Random" → MockExam
├── "Virtual Exam" → VirtualExamRoom
├── "Exam Room" → ExamRoom
├── "Tài liệu" → DocumentsPage
├── "AI Assistant" → AIAssistant
└── "Bài tập đã giao" → AssignmentsPage
```

### 🎯 Mode Selection Modal
- **Component:** `ModeSelectionModal`
- **File:** `/components/ModeSelectionModal.tsx`
- **Trigger:** Click skill card from PracticeHome
- **Options:**
  1. **Làm theo phần** → PartSelectionModal
  2. **Làm bộ đề đầy đủ** → PracticeList (fulltest mode)

### 📑 Part Selection Modal
- **Component:** `PartSelectionModal`
- **File:** `/components/PartSelectionModal.tsx`
- **Trigger:** Select "Làm theo phần" from ModeSelectionModal
- **Options:**
  - **Reading:** Part 1, 2, 3
  - **Listening:** Part 1, 2, 3
  - **Writing:** Part 1, 2
  - **Speaking:** Part 1, 2, 3

### 📋 Practice List
- **Component:** `PracticeList`
- **File:** `/components/PracticeList.tsx`
- **Route:** `currentPage === 'practice-list'`
- **Display:** List of exercises based on:
  - `skill`: reading/listening/writing/speaking
  - `mode`: part/fulltest
  - `part`: 1/2/3 (if part mode)

**Flow:**
```
PracticeList
├── Click exercise card → Start Practice
│   ├── Reading → ReadingPractice
│   ├── Listening → ListeningPractice
│   ├── Writing → WritingPractice
│   └── Speaking → SpeakingPractice
└── "Quay lại" → PracticeHome
```

### 📖 Reading Practice
- **Component:** `ReadingPractice`
- **File:** `/components/ReadingPractice.tsx`
- **Route:** `currentPage === 'reading'`

**Sub-components:**
- **ReadingPartPractice:** `/components/ReadingPartPractice.tsx`
- **ReadingFullTest:** `/components/ReadingFullTest.tsx`
- **ReadingExercise:** `/components/reading/ReadingExercise.tsx`
- **ReadingResult:** `/components/reading/ReadingResult.tsx`

**Flow:**
```
ReadingPractice
├── Instructions
├── Exercise (ReadingExercise)
├── Submit → Result (ReadingResult)
│   ├── Score
│   ├── Correct/Wrong answers
│   └── Explanations
└── "Quay lại" → PracticeList
```

### 🎧 Listening Practice
- **Component:** `ListeningPractice`
- **File:** `/components/ListeningPractice.tsx`
- **Route:** `currentPage === 'listening'`

**Sub-components:**
- **ListeningPartPractice:** `/components/ListeningPartPractice.tsx`
- **ListeningFullTest:** `/components/ListeningFullTest.tsx`
- **ListeningExercise:** `/components/listening/ListeningExercise.tsx`
- **ListeningResult:** `/components/listening/ListeningResult.tsx`

**Flow:** Similar to Reading Practice

### ✍️ Writing Practice
- **Component:** `WritingPractice`
- **File:** `/components/WritingPractice.tsx`
- **Route:** `currentPage === 'writing'`

**Sub-components:**
- **WritingPartPractice:** `/components/WritingPartPractice.tsx`
- **WritingFullTest:** `/components/WritingFullTest.tsx`
- **WritingExercise:** `/components/writing/WritingExercise.tsx`
- **WritingResult:** `/components/writing/WritingResult.tsx`

**Features:**
- Rich text editor
- Word count
- Timer
- AI grading (optional)

### 🎤 Speaking Practice
- **Component:** `SpeakingPractice`
- **File:** `/components/SpeakingPractice.tsx`
- **Route:** `currentPage === 'speaking'`

**Sub-components:**
- **SpeakingPartPractice:** `/components/SpeakingPartPractice.tsx`
- **SpeakingFullTest:** `/components/SpeakingFullTest.tsx`
- **SpeakingExercise:** `/components/speaking/SpeakingExercise.tsx`
- **SpeakingResult:** `/components/speaking/SpeakingResult.tsx`

**Features:**
- Audio recording
- Preparation time
- Response time
- AI grading (optional)
- Audio playback

---

## 9. Exam Flow

### 🎓 Mock Exam (Thi thử Random)
- **Component:** `MockExam`
- **File:** `/components/student/MockExam.tsx`
- **Route:** `currentPage === 'mock-exam'`

**Features:**
- Tự động random đề thi từ ngân hàng
- Full 4 skills: Reading → Listening → Writing → Speaking
- Strict timing
- Auto submit when time's up
- Full result report

**Flow:**
```
MockExam
├── Pre-exam Instructions → PreExamInstructions
├── Reading Section (60 mins)
├── Skill Transition → SkillTransitionModal
├── Listening Section (40 mins)
├── Skill Transition → SkillTransitionModal
├── Writing Section (60 mins)
├── Skill Transition → SkillTransitionModal
├── Speaking Section (12 mins)
└── Final Result Report
```

### 🖥️ Virtual Exam Room
- **Component:** `VirtualExamRoom`
- **File:** `/components/VirtualExamRoom.tsx`
- **Route:** `currentPage === 'virtual-exam'`

**Features:**
- Simulated exam environment
- Fullscreen mode
- Camera/Mic monitoring (UI only)
- No pause/exit
- Complete 4-skill exam

### 🏢 Exam Room (Official)
- **Component:** `ExamRoom`
- **File:** `/components/ExamRoom.tsx`
- **Route:** `currentPage === 'exam'`

**Features:**
- Most realistic exam simulation
- Strict proctoring UI
- Identity verification (mock)
- Full result + certificate

**Shared Exam Components:**
- **ExamInterface:** `/components/exam/ExamInterface.tsx`
- **PreExamInstructions:** `/components/exam/PreExamInstructions.tsx`
- **PreparationTimer:** `/components/exam/PreparationTimer.tsx`
- **SkillTransitionModal:** `/components/exam/SkillTransitionModal.tsx`
- **TransitionCountdownModal:** `/components/exam/TransitionCountdownModal.tsx`
- **RecordingCountdownModal:** `/components/exam/RecordingCountdownModal.tsx`
- **IncompletePartModal:** `/components/exam/IncompletePartModal.tsx`
- **SpeakingPreparationModal:** `/components/exam/SpeakingPreparationModal.tsx`
- **AudioLevelMeter:** `/components/exam/AudioLevelMeter.tsx`

---

## 10. Shared Components

### 🧭 Navigation Components

#### Sidebar (Student Home)
- **Component:** `Sidebar`
- **File:** `/components/Sidebar.tsx`
- **Used in:** Home page only
- **Features:**
  - Logo
  - Quick links
  - Progress tracker
  - Footer with stats

#### Admin Sidebar
- **Component:** `AdminSidebar`
- **File:** `/components/admin/AdminSidebar.tsx`
- **Theme:** Navy Academic (#0F2A44)

#### Teacher Sidebar
- **Component:** `TeacherSidebar`
- **File:** `/components/teacher/TeacherSidebar.tsx`
- **Theme:** Navy Academic (#0F2A44)

#### Student Sidebar
- **Component:** `StudentSidebar`
- **File:** `/components/student/StudentSidebar.tsx`
- **Theme:** Navy Academic (#0F2A44)

### 📄 Common Pages

#### 1. Profile
- **Component:** `Profile`
- **File:** `/components/Profile.tsx`
- **Route:** `currentPage === 'profile'`
- **Features:**
  - Personal information
  - Avatar upload
  - Account settings
  - Subscription management
  - Study preferences

#### 2. Statistics
- **Component:** `Statistics`
- **File:** `/components/Statistics.tsx`
- **Route:** `currentPage === 'statistics'`
- **Tabs:**
  - Tổng quan → OverviewTab
  - Lịch sử kiểm tra → TestHistoryTab
  - Hiệu suất bài tập → ExercisePerformanceTab
  - Tiến độ khóa học → CourseProgressTab
  - Thời gian học → StudyTimeTab
  - Gamification → GamificationTab
  - Đề xuất → RecommendationsTab

**Tab Components:**
- `/components/statistics/OverviewTab.tsx`
- `/components/statistics/TestHistoryTab.tsx`
- `/components/statistics/ExercisePerformanceTab.tsx`
- `/components/statistics/CourseProgressTab.tsx`
- `/components/statistics/StudyTimeTab.tsx`
- `/components/statistics/GamificationTab.tsx`
- `/components/statistics/RecommendationsTab.tsx`

#### 3. History
- **Component:** `History` (new version)
- **File:** `/components/History-new.tsx`
- **Route:** `currentPage === 'history'`
- **Features:**
  - Practice history
  - Exam history
  - Performance charts
  - Filter by skill/date

#### 4. Documents
- **Component:** `DocumentsPage`
- **File:** `/components/DocumentsPage.tsx`
- **Route:** `currentPage === 'documents'`
- **Features:**
  - Study materials library
  - Download documents
  - Filter by category
  - Search

#### 5. Assignments
- **Component:** `AssignmentsPage`
- **File:** `/components/AssignmentsPage.tsx`
- **Route:** `currentPage === 'assignments'`
- **Features:**
  - Assigned homework list
  - Submit assignments
  - View grades/feedback
  - Due date reminders

#### 6. Notifications
- **Component:** `NotificationsPage`
- **File:** `/components/NotificationsPage.tsx`
- **Route:** `currentPage === 'notifications'`
- **Features:**
  - All notifications
  - Mark as read
  - Filter by type
  - Delete notifications

#### 7. Blog
- **Component:** `Blog`
- **File:** `/components/Blog.tsx`
- **Route:** `currentPage === 'blog'`
- **Features:**
  - VSTEP tips & tricks
  - Study guides
  - Exam strategies
  - News & updates

#### 8. AI Grading
- **Component:** `AIGrading`
- **File:** `/components/AIGrading.tsx`
- **Route:** `currentPage === 'ai-grading'`
- **Features:**
  - Upload essay/audio
  - AI analysis
  - Detailed feedback
  - Score prediction

#### 9. AI Assistant
- **Component:** `AIAssistant`
- **File:** `/components/AIAssistant.tsx`
- **Route:** `currentPage === 'ai-assistant'`
- **Features:**
  - Chat with AI tutor
  - Ask questions
  - Get study tips
  - Practice suggestions

#### 10. Goals
- **Component:** `Goals`
- **File:** `/components/Goals.tsx`
- **Features:**
  - Set learning goals
  - Track progress
  - Goal achievements

#### 11. Exam Registration Guide
- **Component:** `ExamRegistrationGuide`
- **File:** `/components/ExamRegistrationGuide.tsx`
- **Route:** `currentPage === 'exam-registration'`
- **Features:**
  - Step-by-step guide
  - Required documents
  - Registration links
  - Important dates

### 🎨 Modal Components

#### 1. Onboarding Modal
- **Component:** `OnboardingModal`
- **File:** `/components/OnboardingModal.tsx`
- **Trigger:** First time login after registration
- **Features:**
  - Welcome tour
  - Feature introduction
  - Quick setup

#### 2. Badge Unlock Modal
- **Component:** `BadgeUnlockModal`
- **File:** `/components/BadgeUnlockModal.tsx`
- **Trigger:** When user achieves a milestone
- **Features:**
  - Animated badge reveal
  - Achievement description
  - Share option

#### 3. Goal Setting Modal
- **Component:** `GoalSettingModal`
- **File:** `/components/GoalSettingModal.tsx`
- **Features:**
  - Set target score
  - Set deadline
  - Choose focus areas

#### 4. Goal Achieved Modal
- **Component:** `GoalAchievedModal`
- **File:** `/components/GoalAchievedModal.tsx`
- **Features:**
  - Celebration animation
  - Progress summary
  - Next goal suggestion

#### 5. Chat Panel
- **Component:** `ChatPanel`
- **File:** `/components/ChatPanel.tsx`
- **Trigger:** Click "Tin nhắn" button
- **Features:**
  - Message threads
  - Teacher/Student communication
  - Class announcements

### 🎯 Utility Components

#### 1. Switch Role Button
- **Component:** `SwitchRoleButton`
- **File:** `/components/SwitchRoleButton.tsx`
- **Location:** Floating at bottom center
- **Roles:** Student (Blue), Teacher (Purple), Admin (Red), Uploader (Yellow)

#### 2. Floating Chat Button
- **Component:** `FloatingChatButton`
- **File:** `/components/FloatingChatButton.tsx`
- **Features:**
  - Quick access to AI Assistant
  - Hide/Show toggle
  - Unread count badge

#### 3. Footer
- **Component:** `Footer`
- **File:** `/components/Footer.tsx`
- **Location:** Only on Home page
- **Features:**
  - Contact info
  - Social links
  - Quick links
  - Copyright

#### 4. Toggle Switch
- **Component:** `ToggleSwitch`
- **File:** `/components/ToggleSwitch.tsx`

#### 5. Badge Card
- **Component:** `BadgeCard`
- **File:** `/components/BadgeCard.tsx`

---

## 📊 State Management

### Global State (App.tsx)
```typescript
// Authentication
const [authState, setAuthState] = useState<AuthState>()
const [authPage, setAuthPage] = useState<'login' | 'register' | 'forgot-password' | null>()

// Navigation
const [currentPage, setCurrentPage] = useState<PageType>('home')
const [userRole, setUserRole] = useState<'student' | 'teacher' | 'admin' | 'uploader'>('student')

// Practice State
const [selectedSkill, setSelectedSkill] = useState<SkillType>('reading')
const [currentMode, setCurrentMode] = useState<'part' | 'fulltest'>('part')
const [selectedPart, setSelectedPart] = useState<number | undefined>()
const [selectedExerciseId, setSelectedExerciseId] = useState<number | undefined>()

// Modal State
const [showModeModal, setShowModeModal] = useState(false)
const [showPartModal, setShowPartModal] = useState(false)
const [showOnboarding, setShowOnboarding] = useState(false)
const [showBadgeModal, setShowBadgeModal] = useState(false)
const [showChatPanel, setShowChatPanel] = useState(false)

// UI State
const [isFullscreen, setIsFullscreen] = useState(false)
const [showFloatingChat, setShowFloatingChat] = useState(true)
const [showMobileSidebar, setShowMobileSidebar] = useState(false)
const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0)
```

### LocalStorage Keys
```typescript
// Authentication
'vstep_auth_user'
'vstep_auth_token'

// Settings
'vstep_settings' // Contains all user preferences including AI settings

// Practice Data
'vstep_notifications'
'vstep_practice_history'
'vstep_exam_history'

// Onboarding
'has_seen_onboarding'

// Goals & Badges
'vstep_goals'
'vstep_badges'
```

---

## 🎨 Design System

### Color Palette
- **Primary:** `#3B82F6` (Blue)
- **Secondary:** `#FF6B2C` (Orange)
- **Navy Academic:** `#0F2A44` (Sidebar background)
- **Text Primary:** `#E6F0FF`
- **Text Secondary:** `#8FA9C7`

### Layout Constants
```typescript
// From /constants/layout.ts
SIDEBAR_WIDTH: 320px
MAX_CONTENT_WIDTH: 1280px
HEADER_HEIGHT: 64px
```

### Responsive Breakpoints
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

---

## 🔄 Key Navigation Flows

### 1. Practice Flow (Detailed)
```
Home → Click Skill Card
  ↓
ModeSelectionModal
  ├─→ "Làm theo phần" → PartSelectionModal
  │                        ↓
  │                    Select Part → PracticeList
  │                                      ↓
  │                                  Select Exercise
  │                                      ↓
  │                               Practice Component
  │                                      ↓
  │                                   Result
  │                                      ↓
  │                              [Làm lại / Thoát]
  │
  └─→ "Làm bộ đề đầy đủ" → PracticeList (Fulltest)
                               ↓
                          Select Exercise
                               ↓
                        Practice Component
                               ↓
                            Result
```

### 2. Dashboard Role Switching
```
Switch Role Button (Floating)
  ├─→ Student → DashboardNew (Student Mode)
  ├─→ Teacher → DashboardNew (Teacher Mode)
  ├─→ Admin → AdminDashboard
  └─→ Uploader → DashboardNew (Uploader Mode)
```

### 3. Assignment Flow (Teacher)
```
Teacher Dashboard → Giao bài tập
  ↓
TeacherAssignmentsPage
  ↓
[Tạo bài tập mới]
  ↓
AssignmentCreatorNew
  ├─→ Choose from Library
  ├─→ Create Custom
  └─→ Use Exam Questions
  ↓
Set Details (Title, Deadline, Instructions)
  ↓
Assign to Class/Students
  ↓
Publish
  ↓
Students receive in AssignmentsPage
```

### 4. Exam Result Flow
```
Complete Exam
  ↓
Auto-save to localStorage
  ↓
Show Result Page
  ├─→ Reading/Listening: Auto-graded
  └─→ Writing/Speaking: AI Grading (Optional)
  ↓
Add to History
  ↓
Update Statistics
  ↓
Check for Badge Unlock
  ↓
[Return to Home / Try Again]
```

---

## 📝 Notes

### Important Implementation Details

1. **Authentication Flow:**
   - All auth logic in `/utils/authService.ts`
   - Token stored in localStorage
   - Auto-redirect to login if not authenticated

2. **Practice Data Storage:**
   - Exercise data in `/data/` folder
   - Results saved to localStorage
   - History tracked per skill

3. **AI Grading:**
   - Writing/Speaking only
   - Optional feature (can be disabled)
   - Logs tracked in Admin → AI Logs

4. **Role-Based Access:**
   - Different sidebars per role
   - Some features restricted by role
   - Admin has full access

5. **Responsive Design:**
   - Mobile sidebar as drawer
   - Desktop sidebar fixed
   - All content max-width 1280px

6. **Theme Consistency:**
   - All dashboards use Navy Academic theme
   - Consistent color palette
   - Unified component library

---

## 🚀 Quick Reference

### Most Used Navigation Paths

**Student Journey:**
```
Home → Practice → Skill → Mode → Part → Exercise → Result → History
```

**Teacher Journey:**
```
Dashboard → Classes → Students → Assignments → Grade → Feedback
```

**Admin Journey:**
```
Dashboard → Users → Courses → Content → System Settings
```

### Key Files to Remember

| Feature | Main Component | File Path |
|---------|---------------|-----------|
| Root App | App | `/App.tsx` |
| Login | LoginPage | `/components/auth/LoginPage.tsx` |
| Student Dashboard | DashboardNew | `/components/DashboardNew.tsx` |
| Admin Dashboard | AdminDashboard | `/components/AdminDashboard.tsx` |
| Practice Home | PracticeHome | `/components/PracticeHome.tsx` |
| Reading Practice | ReadingPractice | `/components/ReadingPractice.tsx` |
| Mock Exam | MockExam | `/components/student/MockExam.tsx` |
| AI Grading | AIGrading | `/components/AIGrading.tsx` |
| Statistics | Statistics | `/components/Statistics.tsx` |

---

## 📚 Additional Documentation

- **Assignment Logic:** `/ASSIGNMENT_LOGIC.md`
- **Auth Guide:** `/AUTH_GUIDE.md`
- **Badge System:** `/BADGE_SYSTEM_README.md`
- **Design System:** `/DESIGN_SYSTEM.md`
- **Footer Guide:** `/FOOTER_GUIDE.md`
- **Goal System:** `/GOAL_SYSTEM_README.md`
- **System Flows:** `/system-flows.md`
- **API Specification:** `/api-specification.md`
- **Module Overview:** `/module-overview.md`

---

**Document Version:** 1.0  
**Last Updated:** December 18, 2025  
**Maintained by:** VSTEPRO Development Team
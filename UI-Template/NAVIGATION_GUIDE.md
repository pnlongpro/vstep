# 🧭 VSTEPRO - Navigation Guide (Screen to Screen)

**Tài liệu chi tiết về cách di chuyển giữa các màn hình**

---

## 📋 Mục lục
1. [Navigation System Overview](#navigation-system-overview)
2. [Navigation từ Login/Register](#navigation-từ-loginregister)
3. [Navigation từ Home](#navigation-từ-home)
4. [Modal Navigation](#modal-navigation)
5. [Practice Flow Navigation](#practice-flow-navigation)
6. [Dashboard Navigation](#dashboard-navigation)
7. [Role Switching Navigation](#role-switching-navigation)
8. [Special Navigation Cases](#special-navigation-cases)
9. [Navigation Patterns & Best Practices](#navigation-patterns--best-practices)

---

## Navigation System Overview

### 🎯 Core Navigation Mechanism

**Main State in App.tsx:**
```typescript
const [currentPage, setCurrentPage] = useState<PageType>('home')
```

**All navigation flows through:**
- `setCurrentPage(newPage)` - Changes current page
- Props callbacks: `onNavigate`, `onBack`, `onPageChange`
- Event listeners for programmatic navigation

**Navigation Flow:**
```
User Action → Event Handler → setCurrentPage() → Re-render with new component
```

---

## Navigation từ Login/Register

### 1️⃣ LoginPage → Home
```
📍 From: LoginPage (/components/auth/LoginPage.tsx)
📍 To: PracticeHome (/components/PracticeHome.tsx)

🔘 Action: Click "Đăng nhập" button
📝 Handler: handleLogin(email, password)
⚙️ Process:
   1. authLogin(email, password) - API call
   2. setAuthState({ isAuthenticated: true, user, token })
   3. setAuthPage(null)
   4. setCurrentPage('home')
   5. If user has role → setUserRole(user.role)

✅ Result: Redirect to Home page (PracticeHome)
```

### 2️⃣ LoginPage → RegisterPage
```
📍 From: LoginPage
📍 To: RegisterPage (/components/auth/RegisterPage.tsx)

🔘 Action: Click "Đăng ký" link
📝 Props: onNavigateToRegister={() => setAuthPage('register')}
⚙️ Process: setAuthPage('register')

✅ Result: Show RegisterPage
```

### 3️⃣ LoginPage → ForgotPasswordPage
```
📍 From: LoginPage
📍 To: ForgotPasswordPage (/components/auth/ForgotPasswordPage.tsx)

🔘 Action: Click "Quên mật khẩu?" link
📝 Props: onNavigateToForgotPassword={() => setAuthPage('forgot-password')}
⚙️ Process: setAuthPage('forgot-password')

✅ Result: Show ForgotPasswordPage
```

### 4️⃣ RegisterPage → LoginPage
```
📍 From: RegisterPage
📍 To: LoginPage

🔘 Action: Click "Đã có tài khoản? Đăng nhập"
📝 Props: onNavigateToLogin={() => setAuthPage('login')}
⚙️ Process: setAuthPage('login')

✅ Result: Show LoginPage
```

### 5️⃣ RegisterPage → OnboardingModal → Home
```
📍 From: RegisterPage
📍 To: OnboardingModal → PracticeHome

🔘 Action: Complete registration form and submit
📝 Handler: handleRegister(data)
⚙️ Process:
   1. authRegister(data) - API call
   2. setAuthState({ isAuthenticated: true, user, token })
   3. setAuthPage(null)
   4. setCurrentPage('home')
   5. setUserRole('student') - Default for new users
   6. setShowOnboarding(true) - Auto show onboarding

✅ Result: OnboardingModal appears, then redirect to Home
```

### 6️⃣ ForgotPasswordPage → LoginPage
```
📍 From: ForgotPasswordPage
📍 To: LoginPage

🔘 Action: Click "Quay lại đăng nhập"
📝 Props: onNavigateToLogin={() => setAuthPage('login')}
⚙️ Process: setAuthPage('login')

✅ Result: Show LoginPage
```

---

## Navigation từ Home

### 🏠 PracticeHome Component
**File:** `/components/PracticeHome.tsx`

### 7️⃣ Home → Header Navigation (Top Bar)
```
📍 Location: Header Navigation Bar (App.tsx)
⚙️ All buttons use: onClick={() => setCurrentPage(pageName)}

Available navigation:
┌─────────────────┬──────────────────────────────────┐
│ Button          │ Action                           │
├─────────────────┼──────────────────────────────────┤
│ Trang chủ       │ setCurrentPage('home')           │
│ Tài liệu        │ setCurrentPage('documents')      │
│ Chấm AI         │ setCurrentPage('ai-grading')     │
│ Bài tập đã giao │ setCurrentPage('assignments')    │
│ Lịch sử         │ setCurrentPage('history')        │
│ Thống kê        │ setCurrentPage('statistics')     │
│ Blog            │ setCurrentPage('blog')           │
│ Tin nhắn        │ setShowChatPanel(true)           │
│ Thông báo       │ setCurrentPage('notifications')  │
│ Profile         │ setCurrentPage('profile')        │
└─────────────────┴──────────────────────────────────┘
```

### 8️⃣ Home → Skill Practice
```
📍 From: PracticeHome
📍 To: ModeSelectionModal

🔘 Action: Click skill card (Reading/Listening/Writing/Speaking)
📝 Handler: handleSelectSkill(skill)
⚙️ Process:
   1. User clicks skill card (e.g., Reading)
   2. onSelectSkill('reading') triggered
   3. handleSelectSkill('reading') in App.tsx:
      - setSelectedSkill('reading')
      - setShowModeModal(true)

✅ Result: ModeSelectionModal appears
```

**Code Example:**
```typescript
// In PracticeHome
<SkillCard 
  skill="reading"
  onClick={() => onSelectSkill('reading')}
/>

// Props received from App.tsx
onSelectSkill={handleSelectSkill}

// In App.tsx
const handleSelectSkill = (skill) => {
  if (skill === 'reading' || skill === 'listening' || ...) {
    setSelectedSkill(skill);
    setShowModeModal(true);
  } else if (skill === 'exam' || skill === 'virtual-exam' || ...) {
    setCurrentPage(skill); // Direct navigation for exams
  }
}
```

### 9️⃣ Home → Mock Exam
```
📍 From: PracticeHome
📍 To: MockExam (/components/student/MockExam.tsx)

🔘 Action: Click "Thi thử Random" card
📝 Handler: onSelectSkill('mock-exam')
⚙️ Process: setCurrentPage('mock-exam')

✅ Result: Navigate to MockExam component
```

### 🔟 Home → Virtual Exam
```
📍 From: PracticeHome
📍 To: VirtualExamRoom (/components/VirtualExamRoom.tsx)

🔘 Action: Click "Virtual Exam" card
📝 Handler: onSelectSkill('virtual-exam')
⚙️ Process: setCurrentPage('virtual-exam')

✅ Result: Navigate to VirtualExamRoom
```

### 1️⃣1️⃣ Home → Exam Room
```
📍 From: PracticeHome
📍 To: ExamRoom (/components/ExamRoom.tsx)

🔘 Action: Click "Exam Room" card
📝 Handler: onSelectSkill('exam')
⚙️ Process: setCurrentPage('exam')

✅ Result: Navigate to ExamRoom
```

### 1️⃣2️⃣ Home → Documents
```
📍 From: PracticeHome
📍 To: DocumentsPage (/components/DocumentsPage.tsx)

🔘 Action: Click "Tài liệu" quick access card
📝 Handler: onSelectSkill('documents')
⚙️ Process: setCurrentPage('documents')

✅ Result: Navigate to DocumentsPage
```

### 1️⃣3️⃣ Home → AI Assistant
```
📍 From: PracticeHome
📍 To: AIAssistant (/components/AIAssistant.tsx)

🔘 Action: Click "AI Assistant" quick access card
📝 Handler: onSelectSkill('ai-assistant')
⚙️ Process: setCurrentPage('ai-assistant')

✅ Result: Navigate to AIAssistant
```

### 1️⃣4️⃣ Home → Assignments
```
📍 From: PracticeHome
📍 To: AssignmentsPage (/components/AssignmentsPage.tsx)

🔘 Action: Click "Bài tập đã giao" quick access card
📝 Handler: onSelectSkill('assignments')
⚙️ Process: setCurrentPage('assignments')

✅ Result: Navigate to AssignmentsPage
```

---

## Modal Navigation

### 1️⃣5️⃣ ModeSelectionModal → PartSelectionModal
```
📍 From: ModeSelectionModal (/components/ModeSelectionModal.tsx)
📍 To: PartSelectionModal (/components/PartSelectionModal.tsx)

🔘 Action: Click "Làm theo phần" button
📝 Handler: onSelectMode('part')
⚙️ Process:
   1. User clicks "Làm theo phần"
   2. onSelectMode('part') triggered
   3. handleSelectMode('part') in App.tsx:
      - setCurrentMode('part')
      - setShowModeModal(false)
      - setShowPartModal(true)

✅ Result: ModeSelectionModal closes, PartSelectionModal opens
```

### 1️⃣6️⃣ ModeSelectionModal → PracticeList (Fulltest)
```
📍 From: ModeSelectionModal
📍 To: PracticeList (/components/PracticeList.tsx) in Fulltest mode

🔘 Action: Click "Làm bộ đề đầy đủ" button
📝 Handler: onSelectMode('fulltest')
⚙️ Process:
   1. User clicks "Làm bộ đề đầy đủ"
   2. onSelectMode('fulltest') triggered
   3. handleSelectMode('fulltest') in App.tsx:
      - setCurrentMode('fulltest')
      - setShowModeModal(false)
      - setSelectedPart(undefined)
      - setCurrentPage('practice-list')

✅ Result: ModeSelectionModal closes, navigate to PracticeList with fulltest exercises
```

### 1️⃣7️⃣ PartSelectionModal → PracticeList (Part mode)
```
📍 From: PartSelectionModal
📍 To: PracticeList in Part mode

🔘 Action: Click Part button (e.g., "Part 1")
📝 Handler: onSelectPart(partNumber)
⚙️ Process:
   1. User clicks "Part 1" button
   2. onSelectPart(1) triggered
   3. handleSelectPart(1) in App.tsx:
      - setSelectedPart(1)
      - setCurrentMode('part')
      - setShowPartModal(false)
      - setCurrentPage('practice-list')

✅ Result: PartSelectionModal closes, navigate to PracticeList with Part 1 exercises
```

**Code Example:**
```typescript
// In PartSelectionModal
const parts = selectedSkill === 'reading' ? [1, 2, 3] : ...;

<button onClick={() => onSelectPart(1)}>
  Part 1
</button>

// Props from App.tsx
onSelectPart={handleSelectPart}

// In App.tsx
const handleSelectPart = (part) => {
  setSelectedPart(part);
  setCurrentMode('part');
  setShowPartModal(false);
  setCurrentPage('practice-list');
}
```

### 1️⃣8️⃣ Close Modal (Return to previous screen)
```
📍 Any Modal Component
📍 Return to: Current page (modal just closes)

🔘 Action: Click X button or backdrop
📝 Handler: onClose()
⚙️ Process: 
   - setShowModeModal(false) or
   - setShowPartModal(false) or
   - setShowOnboarding(false) etc.

✅ Result: Modal closes, stay on same page
```

---

## Practice Flow Navigation

### 1️⃣9️⃣ PracticeList → Start Practice
```
📍 From: PracticeList (/components/PracticeList.tsx)
📍 To: ReadingPractice (or Listening/Writing/Speaking)

🔘 Action: Click exercise card to start
📝 Handler: onStartPractice(exerciseId)
⚙️ Process:
   1. User clicks exercise card
   2. onStartPractice(exerciseId) triggered
   3. handleStartPractice(exerciseId) in App.tsx:
      - setSelectedExerciseId(exerciseId)
      - setCurrentPage(selectedSkill) // 'reading', 'listening', etc.

✅ Result: Navigate to practice component for selected skill with exercise loaded
```

**Code Example:**
```typescript
// In PracticeList
<ExerciseCard 
  exercise={exercise}
  onClick={() => onStartPractice(exercise.id)}
/>

// In App.tsx
const handleStartPractice = (exerciseId) => {
  setSelectedExerciseId(exerciseId);
  setCurrentPage(selectedSkill); // Uses current selectedSkill state
}
```

### 2️⃣0️⃣ PracticeList → Back to Home
```
📍 From: PracticeList
📍 To: PracticeHome

🔘 Action: Click "Quay lại" button
📝 Handler: onBack()
📝 Props: onBack={() => setCurrentPage('home')}
⚙️ Process: setCurrentPage('home')

✅ Result: Return to Home page
```

### 2️⃣1️⃣ Practice Component → Back to Practice List
```
📍 From: ReadingPractice (or other skills)
📍 To: PracticeList

🔘 Action: Click "Quay lại" button (usually after viewing result)
📝 Props: onBack={() => setCurrentPage('practice-list')}
⚙️ Process: setCurrentPage('practice-list')

✅ Result: Return to PracticeList with current filters maintained
```

### 2️⃣2️⃣ Practice → Result (Same component)
```
📍 From: ReadingPractice (Exercise view)
📍 To: ReadingPractice (Result view)

🔘 Action: Click "Nộp bài" button
📝 Handler: Internal state management within component
⚙️ Process:
   1. Calculate score
   2. Save result to localStorage
   3. Update internal state to show result view
   4. Update practice history
   5. Check for badge unlock

✅ Result: Show result page within same component (no page navigation)
```

---

## Dashboard Navigation

### Student Dashboard

### 2️⃣3️⃣ StudentSidebar → Dashboard Pages
```
📍 From: Any Student Dashboard page
📍 To: Other Student Dashboard pages

🔘 Location: StudentSidebar (/components/student/StudentSidebar.tsx)
📝 Props: onPageChange={onPageChange}

Available navigation:
┌───────────────────────┬──────────────────────────┐
│ Menu Item             │ Action                   │
├───────────────────────┼──────────────────────────┤
│ Dashboard             │ onPageChange('dashboard')         │
│ Khóa học của tôi      │ onPageChange('my-courses')        │
│ Luyện tập             │ onPageChange('practice')          │
│ Lộ trình học tập      │ onPageChange('learning-roadmap')  │
│ Tài liệu              │ onPageChange('materials')         │
│ Lịch học              │ onPageChange('schedule')          │
│ Thành tích            │ onPageChange('achievements')      │
│ Thông báo             │ onPageChange('notifications')     │
│ Tin nhắn lớp học      │ onPageChange('messages')          │
│ Cài đặt               │ onPageChange('settings')          │
└───────────────────────┴──────────────────────────┘

✅ Result: Change active page within DashboardNew component
```

**Code Flow:**
```typescript
// In DashboardNew
const [activePage, setActivePage] = useState('dashboard');

<StudentSidebar
  activePage={activePage}
  onPageChange={setActivePage}
  ...
/>

// Render different component based on activePage
{activePage === 'my-courses' && <MyCoursesPage />}
{activePage === 'practice' && <PracticePage />}
// ... etc
```

### Teacher Dashboard

### 2️⃣4️⃣ TeacherSidebar → Dashboard Pages
```
📍 From: Any Teacher Dashboard page
📍 To: Other Teacher Dashboard pages

🔘 Location: TeacherSidebar (/components/teacher/TeacherSidebar.tsx)
📝 Props: onPageChange={onPageChange}

Available navigation:
┌──────────────────────────────┬────────────────────────────────┐
│ Menu Item                    │ Action                         │
├──────────────────────────────┼────────────────────────────────┤
│ Dashboard                    │ onPageChange('dashboard')               │
│ Quản lý lớp học              │ onPageChange('my-classes')              │
│ Điểm danh                    │ onPageChange('attendance')              │
│ Giao bài tập                 │ onPageChange('assignments')             │
│ Chấm bài                     │ onPageChange('grading')                 │
│ Thiết kế lộ trình học tập    │ onPageChange('custom-roadmap')          │
│ Thư viện tài liệu chung      │ onPageChange('materials')               │
│ Thư viện bài tập chung       │ onPageChange('assignment-library')      │
│ Đóng góp ngân hàng đề thi    │ onPageChange('contribute-exam')         │
│ Đóng góp tài liệu chung      │ onPageChange('contribute-materials')    │
│ Đóng góp bài tập chung       │ onPageChange('contribute-assignments')  │
│ Đóng góp Blog Website        │ onPageChange('contribute-blog')         │
│ Thông báo                    │ onPageChange('notifications')           │
│ Tin nhắn                     │ onPageChange('messages')                │
│ Cài đặt                      │ onPageChange('settings')                │
└──────────────────────────────┴────────────────────────────────┘

✅ Result: Change active page within DashboardNew component
```

### Admin Dashboard

### 2️⃣5️⃣ AdminSidebar → Dashboard Pages
```
📍 From: Any Admin Dashboard page
📍 To: Other Admin Dashboard pages

🔘 Location: AdminSidebar (/components/admin/AdminSidebar.tsx)
📝 Props: onPageChange={onPageChange}

Available navigation (20+ pages):
┌──────────────────────────┬────────────────────────────────┐
│ Menu Item                │ Action                         │
├──────────────────────────┼────────────────────────────────┤
│ Tổng quan                │ onPageChange('dashboard')               │
│ Tài khoản miễn phí       │ onPageChange('free-accounts')           │
│ Quản lý người dùng       │ onPageChange('users')                   │
│ Quản lý giáo viên        │ onPageChange('teachers')                │
│ Quản lý lớp học          │ onPageChange('classes')                 │
│ Điểm danh lớp học        │ onPageChange('attendance')              │
│ Khóa học                 │ onPageChange('courses')                 │
│ Lộ trình học tập         │ onPageChange('roadmap-management')      │
│ Bài tập của giáo viên    │ onPageChange('assignments')             │
│ Thư viện tài liệu        │ onPageChange('documents')               │
│ Thư viện bài tập         │ onPageChange('assignment-library')      │
│ Ngân hàng đề thi         │ onPageChange('exams')                   │
│ Nhật ký chấm AI          │ onPageChange('ai-logs')                 │
│ Quản lý Blog VSTEP       │ onPageChange('blog-management')         │
│ Quản lý thông báo        │ onPageChange('notifications')           │
│ Tin nhắn hệ thống        │ onPageChange('messages')                │
│ Giao dịch                │ onPageChange('pricing')                 │
│ Quản lý cấu hình         │ onPageChange('config')                  │
│ Cài đặt hệ thống         │ onPageChange('settings')                │
│ Quản lý sao lưu          │ onPageChange('backup')                  │
└──────────────────────────┴────────────────────────────────┘

✅ Result: Change active page within AdminDashboard component
```

### 2️⃣6️⃣ Dashboard → Back to Home
```
📍 From: AdminDashboard or DashboardNew
📍 To: PracticeHome

🔘 Action: Click "Quay lại" button or Logo
📝 Props: onBack={() => setCurrentPage('home')}
⚙️ Process: setCurrentPage('home')

✅ Result: Return to Home page
```

---

## Role Switching Navigation

**Location:** Floating button at bottom center
**Component:** Switch Role Button (in App.tsx, not separate file)

### 2️⃣7️⃣ Switch to Student Dashboard
```
🔘 Action: Click "Student" button (Blue)
📝 Handler: onClick in App.tsx
⚙️ Process:
   1. setUserRole('student')
   2. setCurrentPage('dashboard')

✅ Result: Navigate to DashboardNew with Student role
         Shows StudentSidebar and student-specific pages
```

### 2️⃣8️⃣ Switch to Teacher Dashboard
```
🔘 Action: Click "Teacher" button (Green/Emerald)
📝 Handler: onClick in App.tsx
⚙️ Process:
   1. setUserRole('teacher')
   2. setCurrentPage('dashboard')

✅ Result: Navigate to DashboardNew with Teacher role
         Shows TeacherSidebar and teacher-specific pages
```

### 2️⃣9️⃣ Switch to Admin Dashboard
```
🔘 Action: Click "Admin" button (Orange)
📝 Handler: onClick in App.tsx
⚙️ Process:
   1. setUserRole('admin')
   2. setCurrentPage('admin-dashboard')

✅ Result: Navigate to AdminDashboard component
         Shows AdminSidebar and admin-specific pages
```

### 3️⃣0️⃣ Switch to Uploader Dashboard
```
🔘 Action: Click "📤 Upload" button (Purple)
📝 Handler: onClick in App.tsx
⚙️ Process:
   1. setUserRole('uploader')
   2. setCurrentPage('dashboard')

✅ Result: Navigate to DashboardNew with Uploader role
         Uses Teacher sidebar with upload features
```

**Code Example:**
```typescript
// In App.tsx (Role Switcher Buttons)
<button
  onClick={() => {
    setUserRole('student');
    setCurrentPage('dashboard');
  }}
  className={userRole === 'student' ? 'bg-blue-600 text-white' : '...'}
>
  Student
</button>

<button
  onClick={() => {
    setUserRole('teacher');
    setCurrentPage('dashboard');
  }}
  className={userRole === 'teacher' ? 'bg-emerald-600 text-white' : '...'}
>
  Teacher
</button>

<button
  onClick={() => {
    setUserRole('admin');
    setCurrentPage('admin-dashboard');
  }}
  className={userRole === 'admin' ? 'bg-orange-600 text-white' : '...'}
>
  Admin
</button>
```

---

## Special Navigation Cases

### 3️⃣1️⃣ History → Quick Practice
```
📍 From: History (/components/History-new.tsx)
📍 To: PracticeList (Fulltest mode)

🔘 Action: Click skill card to practice again
📝 Handler: onSelectSkill(skill)
📝 Props: onSelectSkill={handleGoToPracticeList}
⚙️ Process in App.tsx:
   1. handleGoToPracticeList('reading')
   2. setSelectedSkill('reading')
   3. setCurrentMode('fulltest')
   4. setSelectedPart(undefined)
   5. setCurrentPage('practice-list')

✅ Result: Navigate directly to PracticeList for that skill in fulltest mode
         Bypasses ModeSelectionModal
```

### 3️⃣2️⃣ Event-based Navigation (Programmatic)
```
📍 Location: Any component
📍 Method: Custom events

Example 1: Navigate to Statistics
⚙️ Trigger:
   window.dispatchEvent(new Event('navigate-to-statistics'))

⚙️ Listener in App.tsx:
   useEffect(() => {
     window.addEventListener('navigate-to-statistics', handleNavigateToStats);
     return () => window.removeEventListener('navigate-to-statistics', handleNavigateToStats);
   }, []);

   const handleNavigateToStats = () => {
     setCurrentPage('statistics');
   }

✅ Result: Navigate to Statistics page

---

Example 2: Navigate to Roadmap
⚙️ Trigger:
   window.dispatchEvent(new Event('navigate-to-roadmap'))

⚙️ Listener in App.tsx:
   const handleNavigateToRoadmap = () => {
     setCurrentPage('dashboard');
     setUserRole('student');
   }

✅ Result: Navigate to Student Dashboard showing Roadmap
```

### 3️⃣3️⃣ Floating Chat Button → AI Assistant
```
📍 From: Any page (button floats)
📍 To: AIAssistant

🔘 Component: FloatingChatButton (/components/FloatingChatButton.tsx)
🔘 Action: Click floating chat button
📝 Props: onClick={() => setCurrentPage('ai-assistant')}
⚙️ Process: setCurrentPage('ai-assistant')

✅ Result: Navigate to AI Assistant page
```

### 3️⃣4️⃣ Profile → Logout → Login
```
📍 From: Profile (/components/Profile.tsx)
📍 To: LoginPage

🔘 Action: Click "Đăng xuất" button
📝 Props: onLogout={handleLogout}
⚙️ Process in App.tsx:
   1. handleLogout()
   2. authLogout() - Clears localStorage
   3. setAuthState({ isAuthenticated: false, user: null, token: null })
   4. setAuthPage('login')
   5. setCurrentPage('home')

✅ Result: User logged out, LoginPage shown
```

### 3️⃣5️⃣ Sidebar (Home) → Navigate
```
📍 From: Home page
📍 To: Various pages via Sidebar

🔘 Component: Sidebar (/components/Sidebar.tsx)
📝 Props: 
   - currentPage={currentPage}
   - onNavigate={setCurrentPage}
   - onShowPartModal={handleSelectPartMode}
   - onShowFullTestModal={handleSelectFullTest}

Examples:
• Click "Trang chủ" → onNavigate('home')
• Click "Reading" → onShowPartModal('reading') → Opens PartSelectionModal
• Click "Thống kê" → onNavigate('statistics')
• Click "Lịch sử" → onNavigate('history')

✅ Result: Navigate to selected page or open modal
```

### 3️⃣6️⃣ Mobile Sidebar Toggle
```
📍 Location: Mobile devices only
📍 Component: Mobile hamburger menu in Header

🔘 Action: Click hamburger menu icon
📝 Handler: onClick={() => setShowMobileSidebar(true)}
⚙️ Process:
   1. setShowMobileSidebar(true)
   2. Sidebar drawer slides in from left
   3. Click menu item → Navigate + setShowMobileSidebar(false)

✅ Result: Show/hide mobile sidebar drawer
```

---

## Navigation Patterns & Best Practices

### 🎯 Standard Navigation Pattern

```typescript
// Pattern 1: Direct State Change
// Used for: Simple page navigation
<button onClick={() => setCurrentPage('statistics')}>
  Go to Statistics
</button>

// Pattern 2: Callback Props
// Used for: Child components navigating
// In Parent (App.tsx)
<Component onBack={() => setCurrentPage('home')} />

// In Child Component
interface Props {
  onBack: () => void;
}
const Component = ({ onBack }: Props) => (
  <button onClick={onBack}>Back</button>
);

// Pattern 3: Event Handlers
// Used for: Complex navigation logic
const handleSelectSkill = (skill) => {
  if (skill === 'reading') {
    setSelectedSkill('reading');
    setShowModeModal(true);
  } else if (skill === 'exam') {
    setCurrentPage('exam');
  }
}

<Component onSelectSkill={handleSelectSkill} />

// Pattern 4: Event-based
// Used for: Cross-component communication
// Trigger
window.dispatchEvent(new Event('navigate-to-statistics'));

// Listen
useEffect(() => {
  const handler = () => setCurrentPage('statistics');
  window.addEventListener('navigate-to-statistics', handler);
  return () => window.removeEventListener('navigate-to-statistics', handler);
}, []);
```

### 📊 Navigation State Flow

```
┌─────────────────────────────────────────┐
│         App.tsx (Root State)            │
├─────────────────────────────────────────┤
│ • currentPage: 'home' | 'reading' | ... │
│ • userRole: 'student' | 'teacher' | ... │
│ • authPage: 'login' | null              │
│ • Modal states (showModeModal, etc.)    │
│ • Practice states (skill, mode, part)   │
└─────────────────────────────────────────┘
              ↓
    ┌─────────────────────┐
    │  Renders Component  │
    │  based on states    │
    └─────────────────────┘
              ↓
    ┌─────────────────────┐
    │  User Interaction   │
    │  (Click, etc.)      │
    └─────────────────────┘
              ↓
    ┌─────────────────────┐
    │  Callback/Handler   │
    │  triggered          │
    └─────────────────────┘
              ↓
    ┌─────────────────────┐
    │  setState() calls   │
    │  update states      │
    └─────────────────────┘
              ↓
         (Re-render)
```

### 🔑 Key Navigation Props

**Common Props Pattern:**
```typescript
// Most components receive these props from App.tsx:

interface NavigationProps {
  // Go back to previous page
  onBack?: () => void;
  
  // Navigate to any page
  onNavigate?: (page: PageType) => void;
  
  // Change page within dashboard
  onPageChange?: (page: string) => void;
  
  // Current active page (for highlighting)
  currentPage?: string;
  
  // Practice-specific navigation
  onSelectSkill?: (skill: SkillType) => void;
  onSelectMode?: (mode: 'part' | 'fulltest') => void;
  onSelectPart?: (part: number) => void;
  onStartPractice?: (exerciseId: number) => void;
}
```

### ⚠️ Important Notes

1. **All navigation flows through App.tsx state**
   - Never directly manipulate URL or routes
   - Always use state setters provided via props

2. **Modal vs Page Navigation**
   - Modals: Use boolean states (showModeModal, showPartModal)
   - Pages: Use currentPage state
   - Modals don't change currentPage

3. **Navigation History**
   - No browser back/forward (single page app)
   - Must provide explicit "Back" buttons
   - State is preserved during navigation

4. **Role-based Navigation**
   - Different dashboards based on userRole
   - Same component (DashboardNew) for student/teacher/uploader
   - Separate component (AdminDashboard) for admin

5. **Protected Navigation**
   - Authentication required for all pages except login/register
   - Auto-redirect to login if not authenticated
   - Check authState.isAuthenticated before rendering

---

## 📚 Navigation Quick Reference

### Common Navigation Paths

```
Login → Home → Practice Flow → Result
  ↓
  └→ Dashboard (via Role Switch)
     ├─→ Student Dashboard → Various Student Pages
     ├─→ Teacher Dashboard → Various Teacher Pages
     └─→ Admin Dashboard → Various Admin Pages

Home → Header Buttons → Direct Page Access
  ├─→ Documents
  ├─→ AI Grading
  ├─→ Assignments
  ├─→ History
  ├─→ Statistics
  ├─→ Blog
  ├─→ Notifications
  └─→ Profile

Home → Skill Card → Mode Modal → Part Modal → Practice List → Practice → Result
  │
  └→ Exam Cards → Direct to Exam Component
```

### Navigation Methods Summary

| Method | Use Case | Example |
|--------|----------|---------|
| `setCurrentPage(page)` | Direct page change | `setCurrentPage('home')` |
| `onBack()` prop | Return to previous page | `<Component onBack={() => setCurrentPage('home')} />` |
| `onNavigate(page)` prop | Navigate from child | `onNavigate('statistics')` |
| `onPageChange(page)` prop | Dashboard sub-navigation | `onPageChange('my-courses')` |
| Modal state setters | Show/hide modals | `setShowModeModal(true)` |
| Event dispatch | Cross-component nav | `dispatchEvent(new Event('navigate-to-stats'))` |

---

**Document Version:** 1.0  
**Last Updated:** December 18, 2025  
**Maintained by:** VSTEPRO Development Team

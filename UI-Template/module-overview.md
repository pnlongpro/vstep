# 📋 MODULE OVERVIEW - TỔNG QUAN CÁC MODULE HỆ THỐNG VSTEPRO

## Mục lục
1. [Giới thiệu hệ thống](#giới-thiệu-hệ-thống)
2. [Danh sách module](#danh-sách-module)
3. [Mối liên hệ giữa các module](#mối-liên-hệ-giữa-các-module)
4. [Sơ đồ kiến trúc tổng thể](#sơ-đồ-kiến-trúc-tổng-thể)

---

## Giới thiệu hệ thống

### Thông tin chung
- **Tên hệ thống**: VSTEPRO
- **Mô tả**: Nền tảng luyện thi VSTEP chuyên nghiệp
- **Công nghệ**: React + TypeScript, Tailwind CSS, Recharts, LocalStorage
- **Kiến trúc**: Single Page Application (SPA)
- **Đối tượng người dùng**: Student, Teacher, Admin

### Phạm vi hệ thống
VSTEPRO là nền tảng học tập trực tuyến toàn diện với:
- 4 kỹ năng VSTEP: Reading, Listening, Writing, Speaking
- Hệ thống thi thử hoàn chỉnh
- AI Assistant & AI Grading
- Gamification (Badges & Goals)
- Admin Dashboard đầy đủ

---

## Danh sách module

### MODULE 1: Authentication & Authorization
**Mục tiêu**: Quản lý đăng nhập, phân quyền người dùng

**Chức năng chính**:
- Đăng nhập / Đăng ký
- Quên mật khẩu
- Quản lý phiên đăng nhập
- Phân quyền theo vai trò (Student/Teacher/Admin)
- Switch role giữa các vai trò

**Vai trò sử dụng**: All users

**Trạng thái hiện tại**: Chưa triển khai (mock data)

**Mối liên hệ**:
- Kết nối với tất cả module khác
- Cung cấp user context cho toàn bộ hệ thống

---

### MODULE 2: Home & Dashboard
**Mục tiêu**: Trang chủ và dashboard chính cho học viên

**Chức năng chính**:
- Hiển thị tổng quan kỹ năng
- Quick access đến các bài tập
- Hiển thị mục tiêu học tập
- Thống kê nhanh (streak, tests completed)
- Recent activities

**Vai trò sử dụng**: Student (chính), Teacher, Admin

**Components**:
- PracticeHome.tsx
- Dashboard.tsx

**Mối liên hệ**:
- Hiển thị data từ Statistics Module
- Liên kết đến Practice Module
- Hiển thị Goals từ Goal System
- Hiển thị Badges từ Badge System

---

### MODULE 3: Practice System (Hệ thống luyện tập)
**Mục tiêu**: Cung cấp môi trường luyện tập 4 kỹ năng

**Chức năng chính**:

#### 3.1. Reading Practice
- Chọn mode: Part Practice / Full Test
- Part 1: Short texts (10 câu)
- Part 2: Gap-fill (10 câu)
- Part 3: Long passages (20 câu)
- Auto-save mỗi 10 giây
- Hiển thị kết quả và giải thích

#### 3.2. Listening Practice
- Part 1: Short conversations (8 câu)
- Part 2: Extended talks (12 câu)
- Part 3: Academic lectures (15 câu)
- Audio player với controls
- Transcript hiển thị sau khi làm xong
- Auto-save progress

#### 3.3. Writing Practice
- Task 1: Graphs/Charts hoặc Letter (150 words)
- Task 2: Essay (250 words)
- Word counter real-time
- AI grading với 4 tiêu chí
- Sample answers

#### 3.4. Speaking Practice
- Part 1: Interview (5 câu)
- Part 2: Cue Card + Preparation time
- Part 3: Discussion (5 câu)
- Voice recording
- AI grading với 4 tiêu chí
- Playback recordings

**Components**:
- ReadingPractice.tsx, ReadingFullTest.tsx
- ListeningPractice.tsx, ListeningFullTest.tsx
- WritingPractice.tsx, WritingFullTest.tsx
- SpeakingPractice.tsx, SpeakingFullTest.tsx
- PracticeList.tsx
- ModeSelectionModal.tsx
- PartSelectionModal.tsx

**Vai trò sử dụng**: Student (chính)

**Mối liên hệ**:
- Lưu kết quả vào History Module
- Cập nhật Statistics Module
- Trigger Badge unlocks
- Update Goal progress
- Gửi Notifications

---

### MODULE 4: Exam Room (Phòng thi)
**Mục tiêu**: Môi trường thi thử mô phỏng kỳ thi thật

**Chức năng chính**:
- **ExamRoom**: Thi thử 4 kỹ năng liên tiếp
- **VirtualExamRoom**: Môi trường thi ảo với camera giám sát
- Pre-exam instructions
- Countdown timer cho từng phần
- Transition giữa các kỹ năng
- Không cho back lại phần đã làm
- Submit tự động khi hết giờ
- Kết quả chi tiết

**Components**:
- ExamRoom.tsx
- VirtualExamRoom.tsx
- PreExamInstructions.tsx
- SkillTransitionModal.tsx
- TransitionCountdownModal.tsx
- IncompletePartModal.tsx
- PreparationTimer.tsx
- AudioLevelMeter.tsx

**Vai trò sử dụng**: Student

**Mối liên hệ**:
- Sử dụng data từ Practice System
- Lưu kết quả vào History
- Cập nhật Statistics
- Unlock badges

---

### MODULE 5: AI Assistant & AI Grading
**Mục tiêu**: Hỗ trợ học tập bằng AI và chấm điểm tự động

**Chức năng chính**:

#### 5.1. AI Assistant
- Chat interface với AI
- Hỏi đáp về grammar, vocabulary
- Giải thích câu hỏi
- Gợi ý học tập
- Conversation history

#### 5.2. AI Grading
- Chấm Writing theo 4 tiêu chí:
  - Task Achievement
  - Coherence and Cohesion
  - Lexical Resource
  - Grammatical Range and Accuracy
- Chấm Speaking theo 4 tiêu chí:
  - Fluency and Coherence
  - Lexical Resource
  - Grammatical Range and Accuracy
  - Pronunciation
- Feedback chi tiết
- Suggestions for improvement
- Score breakdown

**Components**:
- AIAssistant.tsx
- AIGrading.tsx
- FloatingChatButton.tsx

**Vai trò sử dụng**: Student

**Mối liên hệ**:
- Lấy data từ Practice results
- Lưu feedback vào History
- Gửi Notifications về kết quả chấm

---

### MODULE 6: Statistics & Analytics
**Mục tiêu**: Theo dõi và phân tích tiến độ học tập

**Chức năng chính**:
- **Overview**: Tổng quan tất cả kỹ năng
- **Study Time**: Thời gian học theo ngày/tuần/tháng
- **Test History**: Lịch sử tất cả bài thi
- **Exercise Performance**: Phân tích từng loại bài tập
- **Course Progress**: Tiến độ khóa học
- **Gamification**: Huy hiệu và thành tích
- **Recommendations**: Gợi ý cá nhân hóa

**Components**:
- Statistics.tsx
- OverviewTab.tsx
- StudyTimeTab.tsx
- TestHistoryTab.tsx
- ExercisePerformanceTab.tsx
- CourseProgressTab.tsx
- GamificationTab.tsx
- RecommendationsTab.tsx

**Charts sử dụng**:
- Line Chart (Tiến độ theo thời gian)
- Bar Chart (So sánh các kỹ năng)
- Pie Chart (Phân bổ thời gian)
- Radar Chart (Skill comparison)
- Area Chart (Study time trends)

**Vai trò sử dụng**: Student, Teacher (xem của học viên), Admin

**Mối liên hệ**:
- Lấy data từ History Module
- Hiển thị trên Dashboard
- Cung cấp data cho Recommendations

---

### MODULE 7: History (Lịch sử)
**Mục tiêu**: Lưu trữ và quản lý lịch sử học tập

**Chức năng chính**:
- Xem tất cả bài đã làm
- Filter theo kỹ năng, ngày tháng
- Xem lại kết quả chi tiết
- Redo bài đã làm
- Export lịch sử
- Xóa lịch sử

**Components**:
- History.tsx
- History-new.tsx

**Data structure**:
```typescript
interface HistoryItem {
  id: string;
  skill: 'reading' | 'listening' | 'writing' | 'speaking';
  mode: 'part' | 'fulltest';
  part?: number;
  exerciseId: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  completedAt: Date;
  answers: any[];
  feedback?: string;
}
```

**Vai trò sử dụng**: Student, Teacher (xem của học viên)

**Mối liên hệ**:
- Nhận data từ Practice System
- Cung cấp data cho Statistics
- Link back to Practice để redo

---

### MODULE 8: Goals (Mục tiêu học tập)
**Mục tiêu**: Quản lý mục tiêu cá nhân

**Chức năng chính**:
- Đặt mục tiêu học tập
- Theo dõi progress
- Notifications khi đạt mục tiêu
- Reward khi hoàn thành
- Gợi ý mục tiêu

**Components**:
- Goals.tsx
- GoalCard.tsx
- GoalSettingModal.tsx
- GoalAchievedModal.tsx

**Types of goals**:
- Daily goals (Học X phút/ngày)
- Weekly goals (Hoàn thành X bài tập)
- Monthly goals (Đạt điểm X)
- Custom goals

**Services**:
- goalService.ts

**Vai trò sử dụng**: Student

**Mối liên hệ**:
- Cập nhật từ Practice System
- Hiển thị trên Dashboard
- Trigger Notifications
- Unlock Badges khi đạt goal

---

### MODULE 9: Badge System (Hệ thống huy hiệu)
**Mục tiêu**: Gamification để tăng động lực học

**Chức năng chính**:
- Unlock badges khi đạt thành tích
- Hiển thị danh sách badges
- Badge progress tracking
- Rarity levels (Common, Rare, Epic, Legendary)
- Animated unlock modal

**Components**:
- BadgeCard.tsx
- BadgeUnlockedModal.tsx

**Types of badges**:
- Skill-based (Master các kỹ năng)
- Streak-based (Học liên tục)
- Achievement-based (Hoàn thành milestone)
- Special events

**Services**:
- badgeService.ts
- badgeHelpers.tsx

**Vai trò sử dụng**: Student

**Mối liên hệ**:
- Trigger từ Practice System
- Hiển thị trong Statistics
- Hiển thị trên Profile
- Gửi Notifications khi unlock

---

### MODULE 10: Profile (Hồ sơ cá nhân)
**Mục tiêu**: Quản lý thông tin cá nhân và cài đặt

**Chức năng chính**:

#### Tabs:
1. **Thông tin cơ bản**
   - Avatar
   - Tên, email, số điện thoại
   - Level, điểm tích lũy
   - Bio

2. **Huy hiệu**
   - Danh sách badges đã unlock
   - Progress badges chưa đạt
   - Badge showcase

3. **Thành tích**
   - Total tests completed
   - Study streak
   - Best scores
   - Rankings

4. **Tài liệu đã lưu**
   - Bookmarked exercises
   - Saved materials
   - Notes

5. **Cài đặt**
   - Ngôn ngữ
   - Thông báo
   - AI Assistant (enable/disable)
   - Theme
   - Privacy

**Components**:
- Profile.tsx
- ProfileMaterialsTab.tsx

**Vai trò sử dụng**: Student, Teacher, Admin

**Mối liên hệ**:
- Hiển thị data từ Statistics
- Hiển thị Badges
- Quản lý Settings cho toàn app

---

### MODULE 11: Notifications (Thông báo)
**Mục tiêu**: Hệ thống thông báo thời gian thực

**Chức năng chính**:
- Push notifications
- In-app notifications
- Notification center
- Mark as read/unread
- Filter by type
- Clear all

**Types of notifications**:
- Badge unlocked
- Goal achieved
- New course available
- Assignment due
- Test result ready
- System announcements

**Components**:
- NotificationsPage.tsx
- NotificationsPanel.tsx
- Notifications.tsx

**Vai trò sử dụng**: All users

**Mối liên hệ**:
- Nhận trigger từ tất cả modules
- Hiển thị badge count trên header
- Link đến các trang liên quan

---

### MODULE 12: Blog
**Mục tiêu**: Nội dung học tập và tips

**Chức năng chính**:
- Danh sách bài viết
- Categories (Grammar, Vocabulary, Tips, News)
- Search bài viết
- Read article
- Comments
- Like/Save article

**Components**:
- Blog.tsx

**Vai trò sử dụng**: All users

**Mối liên hệ**:
- Standalone module
- Link từ Dashboard

---

### MODULE 13: Admin Dashboard
**Mục tiêu**: Quản trị toàn bộ hệ thống

#### 13.1. Dashboard Page
**Chức năng**: Tổng quan hệ thống
- Stat cards (Users, Tests, Revenue, AI Logs)
- Revenue chart (6 months)
- User growth chart
- Service distribution pie chart
- Recent activities
- System health monitor

**Components**: AdminDashboardPage.tsx

#### 13.2. User Management
**Chức năng**: Quản lý người dùng
- User list với filters
- User detail sidebar:
  - Profile info
  - Role selector
  - Status switch
  - Learning stats (for students)
  - Skills radar chart
  - Teaching stats (for teachers)
  - Login history
- Add/Edit/Delete users
- Bulk actions (Send email, Deactivate)
- Export user data

**Components**: UserManagementPage.tsx

#### 13.3. Teacher Management
**Chức năng**: Quản lý giáo viên
- Teacher list
- Stats: Classes, Students, Rating
- Specialty filter
- Add/Edit/Delete teachers

**Components**: TeachersPage.tsx

#### 13.4. Class Management
**Chức năng**: Quản lý lớp học
- Class list với filters
- Class detail sidebar:
  - Basic info
  - Progress chart
  - Recent activities
  - Student list in class
  - Add/Remove students
  - Class settings
- Create/Edit/Archive class

**Components**: ClassManagementPage.tsx

#### 13.5. Exam Management
**Chức năng**: Quản lý đề thi
- Exam list với filters
- Upload exam modal:
  - Basic info
  - Skills selection
  - Reading section (text + questions)
  - Listening section (audio upload)
  - Writing section (tasks)
  - Speaking section (prompts)
  - Answer key upload
  - Publish toggle
- Exam preview sidebar
- Edit/Delete exams

**Components**: ExamManagementPage.tsx

#### 13.6. Question Bank
**Chức năng**: Ngân hàng câu hỏi
- Question list với filters
- Add/Edit/Delete questions
- Tags management
- Difficulty levels
- Usage tracking

**Components**: QuestionsPage.tsx

#### 13.7. Course Management
**Chức năng**: Quản lý khóa học
- Course list
- Course stats
- Pricing
- Students enrolled
- Reviews and ratings

**Components**: CoursesPage.tsx

#### 13.8. Transactions
**Chức năng**: Quản lý giao dịch
- Transaction list
- Payment methods
- Revenue analytics
- Refunds

**Components**: TransactionsPage.tsx

#### 13.9. AI Scoring Logs
**Chức năng**: Giám sát AI grading
- AI scoring history
- Performance metrics
- Error logs
- Cost tracking

**Components**: AILogsPage.tsx

#### 13.10. System Settings
**Chức năng**: Cài đặt hệ thống
- **General Settings**: System name, logo, timezone
- **Notifications**: Email, Push, SMS settings
- **Security**: 2FA, password policy, session timeout
- **Database**: Auto backup, backup time
- **Email**: SMTP configuration
- **Payment**: Payment gateways (VNPay, MoMo, ZaloPay)
- **Localization**: Language, region (coming soon)
- **Users**: User management settings (coming soon)

**Components**: SettingsPage.tsx

**Admin Navigation**:
- AdminSidebar.tsx
- Dark theme
- Hamburger menu cho mobile
- Role switcher

**Vai trò sử dụng**: Admin only

**Mối liên hệ**:
- Quản lý tất cả modules khác
- Giám sát toàn bộ hoạt động
- Cung cấp reports và analytics

---

### MODULE 14: Sidebar & Navigation
**Mục tiêu**: Điều hướng chính của ứng dụng

**Chức năng chính**:
- Quick navigation
- Skill shortcuts
- Recently accessed
- Favorites
- Collapse/Expand

**Components**:
- Sidebar.tsx

**Vai trò sử dụng**: All users

---

### MODULE 15: Onboarding
**Mục tiêu**: Hướng dẫn người dùng mới

**Chức năng chính**:
- Welcome screen
- Feature tour
- Quick start guide
- Skip option
- Show only once

**Components**:
- OnboardingModal.tsx

**Vai trò sử dụng**: New users

---

## Mối liên hệ giữa các module

### Core Flow
```
Authentication 
    ↓
Dashboard/Home
    ↓
Practice System ←→ Exam Room
    ↓
History ←→ Statistics
    ↓
Goals & Badges
    ↓
Notifications
```

### Data Flow
```
Practice/Exam (Input)
    ↓
History (Storage)
    ↓
Statistics (Analysis)
    ↓
Dashboard (Display)
    ↓
Recommendations (AI)
```

### Admin Flow
```
Admin Dashboard
    ↓
├── User Management
├── Teacher Management
├── Class Management
├── Exam Management
├── Question Bank
├── Course Management
├── Transactions
├── AI Logs
└── Settings
```

### Dependencies Map

#### Practice System phụ thuộc:
- Authentication (user context)
- History (save results)
- Statistics (update metrics)
- Goals (update progress)
- Badges (check unlocks)
- Notifications (trigger events)

#### Statistics phụ thuộc:
- History (data source)
- Goals (progress data)
- Badges (achievements)

#### Admin Dashboard phụ thuộc:
- All modules (read/write access)

#### AI Assistant phụ thuộc:
- Practice System (context)
- History (learning data)

---

## Sơ đồ kiến trúc tổng thể

### Layer Architecture

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (React Components + Tailwind CSS)      │
├─────────────────────────────────────────┤
│         Business Logic Layer            │
│  (Services, Utilities, Helpers)         │
├─────────────────────────────────────────┤
│         Data Access Layer               │
│  (LocalStorage, API calls)              │
├─────────────────────────────────────────┤
│         External Services               │
│  (AI APIs, Payment Gateways)            │
└─────────────────────────────────────────┘
```

### Module Interaction Diagram

```
                    ┌──────────────┐
                    │     App      │
                    │  (App.tsx)   │
                    └──────┬───────┘
                           │
        ┏━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━┓
        ▼                                    ▼
┌───────────────┐                   ┌───────────────┐
│ Student Pages │                   │  Admin Pages  │
├───────────────┤                   ├───────────────┤
│ • Home        │                   │ • Dashboard   │
│ • Practice    │                   │ • Users       │
│ • Exam        │                   │ • Teachers    │
│ • Statistics  │                   │ • Classes     │
│ • History     │                   │ • Exams       │
│ • Profile     │                   │ • Settings    │
│ • Goals       │                   └───────────────┘
│ • Blog        │
└───────┬───────┘
        │
        ▼
┌───────────────────────────┐
│    Shared Services        │
├───────────────────────────┤
│ • badgeService.ts         │
│ • goalService.ts          │
│ • badgeHelpers.tsx        │
└───────────────────────────┘
        │
        ▼
┌───────────────────────────┐
│    LocalStorage           │
├───────────────────────────┤
│ • vstep_history           │
│ • vstep_settings          │
│ • vstep_notifications     │
│ • vstep_goals             │
│ • vstep_badges            │
│ • has_seen_onboarding     │
└───────────────────────────┘
```

### Technology Stack

#### Frontend
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4.0
- **Charts**: Recharts
- **Icons**: Lucide React
- **UI Components**: Shadcn UI (custom)
- **Routing**: Client-side state management
- **Storage**: LocalStorage (hiện tại)

#### Backend (Đề xuất)
- **API**: RESTful / GraphQL
- **Database**: PostgreSQL
- **Authentication**: JWT
- **File Storage**: AWS S3 / CloudFlare R2
- **AI Service**: OpenAI API / Custom AI
- **Payment**: VNPay, MoMo, ZaloPay SDKs

#### DevOps
- **Hosting**: Vercel / Netlify (Frontend)
- **CDN**: CloudFlare
- **Monitoring**: Sentry
- **Analytics**: Google Analytics / Mixpanel

---

## Tổng kết

### Số liệu hệ thống
- **Tổng số modules**: 15 modules chính
- **Tổng số components**: 80+ components
- **Tổng số màn hình**: 25+ màn hình chính
- **Vai trò người dùng**: 3 (Student, Teacher, Admin)
- **Kỹ năng hỗ trợ**: 4 (Reading, Listening, Writing, Speaking)
- **Cấp độ VSTEP**: 4 (A2, B1, B2, C1)

### Tính năng nổi bật
1. **AI-powered**: AI Assistant + AI Grading
2. **Gamification**: Badges + Goals + Streaks
3. **Comprehensive Analytics**: 7 loại biểu đồ khác nhau
4. **Full Exam Simulation**: Virtual exam room
5. **Admin Dashboard**: 10 modules quản trị
6. **Real-time Notifications**: Push + In-app
7. **Responsive Design**: Mobile-first approach

### Roadmap
- [ ] Triển khai Backend API
- [ ] Tích hợp Database thật
- [ ] Authentication system
- [ ] Payment integration
- [ ] Mobile app (React Native)
- [ ] Teacher dashboard
- [ ] Video lessons
- [ ] Live classes
- [ ] Community forum

---

**Ngày tạo**: 2024-12-11  
**Phiên bản**: 1.0  
**Tác giả**: VSTEPRO Development Team

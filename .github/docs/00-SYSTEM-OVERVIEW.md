# 📊 VSTEPRO - Tổng Quan Hệ Thống

> **Tài liệu phân tích thiết kế hệ thống hoàn chỉnh**
> 
> Phiên bản: 2.0  
> Ngày cập nhật: 15/12/2024  
> Người tạo: System Analyst

---

## 📑 Mục lục

- [1. Giới thiệu tổng quan](#1-giới-thiệu-tổng-quan)
- [2. Kiến trúc hệ thống](#2-kiến-trúc-hệ-thống)
- [3. Công nghệ sử dụng](#3-công-nghệ-sử-dụng)
- [4. Danh sách module](#4-danh-sách-module)
- [5. Vai trò người dùng](#5-vai-trò-người-dùng)
- [6. Tính năng nổi bật](#6-tính-năng-nổi-bật)

---

## 1. Giới thiệu tổng quan

### 1.1. Tên hệ thống
**VSTEPRO** - Vietnamese Standardized Test of English Proficiency Learning Platform

### 1.2. Mục tiêu của sản phẩm

VSTEPRO là nền tảng học trực tuyến toàn diện được thiết kế để:

1. **Hỗ trợ luyện thi VSTEP chuyên nghiệp**
   - Cung cấp đầy đủ 4 kỹ năng: Reading, Listening, Writing, Speaking
   - Hỗ trợ tất cả cấp độ: A2, B1, B2, C1
   - Format chuẩn theo đề thi VSTEP chính thức

2. **Chấm điểm tự động và thông minh**
   - Chấm tự động cho Reading và Listening
   - Chấm AI cho Writing và Speaking với feedback chi tiết
   - Phân tích điểm mạnh/yếu cá nhân

3. **Quản lý lớp học hiện đại**
   - Giáo viên tạo và quản lý lớp học trực tuyến
   - Giao bài tập, theo dõi tiến độ học viên
   - Điểm danh, quản lý lịch học, tin nhắn lớp

4. **Gamification và động lực học tập**
   - Hệ thống huy hiệu (Badge System) với 20+ badges
   - Hệ thống mục tiêu (Goal System) cá nhân hóa
   - Theo dõi tiến độ và thống kê chi tiết

5. **Trải nghiệm học tập toàn diện**
   - Responsive design cho mọi thiết bị
   - Auto-save thông minh
   - Voice recording cho Speaking
   - Thi thử mô phỏng 100% môi trường thi thật

### 1.3. Đối tượng người dùng

#### **Học viên (Students)**
- **Đối tượng**: Học sinh, sinh viên, người đi làm chuẩn bị thi VSTEP
- **Mục tiêu**: Luyện tập, cải thiện điểm số, đạt chứng chỉ VSTEP
- **Nhu cầu**:
  - Luyện tập linh hoạt theo thời gian cá nhân
  - Nhận feedback chi tiết để cải thiện
  - Theo dõi tiến độ học tập
  - Thi thử trước kỳ thi chính thức

#### **Giáo viên (Teachers)**
- **Đối tượng**: Giáo viên tiếng Anh, gia sư, trung tâm ngoại ngữ
- **Mục tiêu**: Quản lý lớp học, theo dõi học viên, tạo bài tập
- **Nhu cầu**:
  - Tạo và quản lý nhiều lớp học
  - Giao bài tập có sẵn hoặc tự tạo
  - Theo dõi tiến độ từng học viên
  - Điểm danh, quản lý lịch học
  - Giao tiếp với học viên qua tin nhắn
  - Đóng góp đề thi vào hệ thống

#### **Quản trị viên (Admins)**
- **Đối tượng**: Quản trị hệ thống, content manager
- **Mục tiêu**: Quản lý toàn bộ hệ thống, nội dung, người dùng
- **Nhu cầu**:
  - Quản lý người dùng (học viên, giáo viên, uploader)
  - Quản lý và duyệt đề thi
  - Quản lý lớp học, khóa học
  - Theo dõi giao dịch, logs AI
  - Cấu hình hệ thống, backup dữ liệu
  - Quản lý tài liệu, tài nguyên học tập

#### **Uploader**
- **Đối tượng**: Content creator, người đóng góp đề thi
- **Mục tiêu**: Upload và quản lý đề thi
- **Nhu cầu**:
  - Upload đề thi mới
  - Xem trạng thái duyệt đề thi
  - Quản lý đề thi đã upload

### 1.4. Bối cảnh sử dụng

#### **Môi trường học tập**
1. **Học tập cá nhân**
   - Học viên tự học tại nhà, quán cà phê, thư viện
   - Thời gian linh hoạt, tự do điều chỉnh tốc độ học

2. **Lớp học trực tuyến**
   - Giáo viên tổ chức lớp học với nhiều học viên
   - Học viên làm bài tập được giao, tham gia lộ trình học

3. **Thi thử**
   - Môi trường thi thử mô phỏng kỳ thi thật
   - Timer 172 phút, full test 4 kỹ năng
   - Không được tạm dừng, submit tự động khi hết giờ

#### **Thiết bị sử dụng**
- **Desktop/Laptop**: Trải nghiệm tốt nhất (target 1440px)
- **Tablet**: Responsive design với sidebar thu gọn
- **Mobile**: UI tối ưu cho màn hình nhỏ

#### **Kết nối mạng**
- **Online**: 
  - Yêu cầu cho AI grading (Writing/Speaking)
  - Đồng bộ dữ liệu, lưu lịch sử
  - Upload file, voice recording
- **Offline**: 
  - Có thể làm bài Reading/Listening với auto-save local
  - Sync khi có mạng trở lại

### 1.5. Quy mô hệ thống

- **Số lượng người dùng dự kiến**: 10,000 - 100,000 users
- **Số lượng đề thi**: 500+ đề thi đầy đủ
- **Số lượng câu hỏi**: 10,000+ câu hỏi
- **Số lượng lớp học**: 1,000+ lớp học đồng thời
- **Storage**: 
  - Voice recordings: ~100GB/tháng
  - Documents/Materials: ~50GB
  - Database: ~10GB

---

## 2. Kiến trúc hệ thống

### 2.1. Kiến trúc tổng quan

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                            │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐              │
│  │  Desktop  │  │  Tablet   │  │  Mobile   │              │
│  │  (1440px) │  │  (768px)  │  │  (375px)  │              │
│  └───────────┘  └───────────┘  └───────────┘              │
│         React + TypeScript + Tailwind CSS                   │
└─────────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Authentication & Authorization (JWT + Role-based)     │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │  Business Logic Layer                                  │ │
│  │  • Practice Management  • Exam Management              │ │
│  │  • Class Management     • Assignment Management        │ │
│  │  • Grading System       • Gamification Engine          │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                     SERVICE LAYER                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   API    │  │   AI     │  │  Media   │  │   Noti   │  │
│  │ Services │  │ Grading  │  │ Storage  │  │  fication│  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  PostgreSQL  │  │  File Store  │  │    Cache     │     │
│  │   (Primary)  │  │   (S3/CDN)   │  │    (Redis)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### 2.2. Frontend Architecture

```
src/
├── App.tsx                          # Main application entry
├── components/
│   ├── student/                     # Student-specific components
│   │   ├── StudentSidebar.tsx
│   │   ├── MockExam.tsx
│   │   ├── MyCoursesPage.tsx
│   │   ├── LearningRoadmap.tsx
│   │   └── ClassDetailPage.tsx
│   ├── teacher/                     # Teacher-specific components
│   │   ├── TeacherSidebar.tsx
│   │   ├── AssignmentCreator.tsx
│   │   ├── AttendancePage.tsx
│   │   ├── ScheduleManager.tsx
│   │   └── GradingPage.tsx
│   ├── admin/                       # Admin-specific components
│   │   ├── AdminSidebar.tsx
│   │   ├── UserManagementPage.tsx
│   │   ├── ExamManagementPage.tsx
│   │   └── DocumentsManagementPage.tsx
│   ├── exam/                        # Exam-related components
│   │   ├── ExamInterface.tsx
│   │   ├── PreExamInstructions.tsx
│   │   └── SkillTransitionModal.tsx
│   ├── reading/                     # Reading practice
│   ├── listening/                   # Listening practice
│   ├── writing/                     # Writing practice
│   ├── speaking/                    # Speaking practice
│   ├── statistics/                  # Statistics & Analytics
│   └── ui/                          # Reusable UI components
├── data/                            # Mock data & configurations
│   ├── readingData.ts
│   ├── listeningData.ts
│   ├── writingData.ts
│   └── speakingData.ts
├── utils/                           # Utility functions
│   ├── badgeHelpers.tsx
│   ├── badgeService.ts
│   └── goalService.ts
└── styles/
    └── globals.css                  # Global styles
```

### 2.3. Component Hierarchy

```
App
├── SwitchRoleButton (floating bottom-left)
├── FloatingChatButton (AI Assistant)
│
├── Student Dashboard
│   ├── StudentSidebar (320px fixed)
│   ├── Dashboard/Home
│   ├── Learning Roadmap
│   ├── My Courses
│   │   └── ClassDetailPage
│   │       ├── Overview Tab
│   │       ├── Materials Tab
│   │       ├── Assignments Tab
│   │       └── Schedule Tab
│   ├── Practice
│   │   ├── PracticeHome
│   │   ├── MockExam (Thi thử Random)
│   │   ├── ReadingPractice
│   │   ├── ListeningPractice
│   │   ├── WritingPractice
│   │   └── SpeakingPractice
│   ├── Achievements (Badges & Goals)
│   ├── Schedule
│   └── Messages
│
├── Teacher Dashboard
│   ├── TeacherSidebar (320px fixed)
│   ├── Dashboard
│   ├── Class Management
│   │   └── ClassDetailPageTeacher
│   │       ├── Overview Tab
│   │       ├── Students Tab
│   │       ├── Materials Tab
│   │       ├── Assignments Tab
│   │       └── Schedule Tab (ScheduleManager)
│   ├── Materials Management
│   ├── Assignment Creator
│   ├── Attendance (AttendancePage)
│   ├── Grading
│   ├── Contribute Exam
│   └── Messages
│
├── Admin Dashboard
│   ├── AdminSidebar (320px fixed)
│   ├── Dashboard (Overview)
│   ├── User Management
│   │   ├── Users
│   │   ├── Free Accounts
│   │   └── Teachers
│   ├── Content Management
│   │   ├── Exam Bank (with Approval Tab)
│   │   ├── Assignments
│   │   ├── Documents
│   │   └── Courses
│   ├── Operations
│   │   ├── Classes
│   │   └── System Messages
│   ├── Finance & Logs
│   │   ├── Transactions
│   │   └── AI Logs
│   └── System Settings
│       ├── Backup Management
│       ├── Config Management
│       └── System Settings
│
└── Uploader Dashboard
    ├── UploaderDashboard
    └── ExamUploadModal
```

---

## 3. Công nghệ sử dụng

### 3.1. Frontend

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| React | 18+ | UI Framework |
| TypeScript | 5+ | Type safety |
| Tailwind CSS | 4.0 | Styling framework |
| Lucide React | Latest | Icon library |
| Recharts | Latest | Charts & graphs |
| React Hook Form | 7.55.0 | Form management |
| Motion/React | Latest | Animations |
| Sonner | 2.0.3 | Toast notifications |
| React Slick | Latest | Carousels |

### 3.2. Backend (Đề xuất)

| Công nghệ | Mục đích |
|-----------|----------|
| Node.js + Express | API Server |
| PostgreSQL | Primary database |
| Redis | Caching & sessions |
| AWS S3 / Cloudflare R2 | File storage |
| OpenAI API | AI grading for Writing/Speaking |
| WebSocket | Real-time features |
| JWT | Authentication |
| Bcrypt | Password hashing |

### 3.3. DevOps & Infrastructure

| Công nghệ | Mục đích |
|-----------|----------|
| Docker | Containerization |
| Nginx | Reverse proxy |
| PM2 | Process manager |
| GitHub Actions | CI/CD |
| Sentry | Error tracking |
| Google Analytics | Analytics |

---

## 4. Danh sách module

Hệ thống VSTEPRO được chia thành **20+ modules** chức năng:

### 4.1. Module cốt lõi (Core Modules)

1. **Authentication & Authorization**
   - File: `01-MODULE-AUTHENTICATION.md`
   - Chức năng: Đăng nhập, đăng ký, quên mật khẩu, phân quyền

2. **Practice & Learning**
   - File: `02-MODULE-PRACTICE-LEARNING.md`
   - Chức năng: Luyện tập 4 kỹ năng, làm bài tập, xem kết quả

3. **Exam System**
   - File: `03-MODULE-EXAM-SYSTEM.md`
   - Chức năng: Thi thử, quản lý đề thi, ngân hàng đề

4. **Grading System**
   - File: `04-MODULE-GRADING-SYSTEM.md`
   - Chức năng: Chấm tự động, chấm AI, feedback

### 4.2. Module quản lý (Management Modules)

5. **User Management**
   - File: `05-MODULE-USER-MANAGEMENT.md`
   - Chức năng: Quản lý học viên, giáo viên, admin

6. **Class Management**
   - File: `06-MODULE-CLASS-MANAGEMENT.md`
   - Chức năng: Tạo lớp, quản lý học viên, điểm danh, lịch học

7. **Assignment Management**
   - File: `07-MODULE-ASSIGNMENT-MANAGEMENT.md`
   - Chức năng: Tạo bài tập, giao bài, theo dõi tiến độ

8. **Materials Management**
   - File: `08-MODULE-MATERIALS-MANAGEMENT.md`
   - Chức năng: Quản lý tài liệu, chia sẻ tài nguyên

### 4.3. Module Student

9. **Student Dashboard**
   - File: `09-MODULE-STUDENT-DASHBOARD.md`
   - Chức năng: Trang chủ học viên, thống kê cá nhân

10. **Learning Roadmap**
    - File: `10-MODULE-LEARNING-ROADMAP.md`
    - Chức năng: Lộ trình học tập được gợi ý

11. **My Courses**
    - File: `11-MODULE-MY-COURSES.md`
    - Chức năng: Khóa học đã đăng ký, chi tiết lớp học

12. **Achievements**
    - File: `12-MODULE-ACHIEVEMENTS.md`
    - Chức năng: Huy hiệu, mục tiêu, thành tích

### 4.4. Module Teacher

13. **Teacher Dashboard**
    - File: `13-MODULE-TEACHER-DASHBOARD.md`
    - Chức năng: Trang chủ giáo viên, overview lớp học

14. **Attendance System**
    - File: `14-MODULE-ATTENDANCE.md`
    - Chức năng: Điểm danh học viên, xuất báo cáo

15. **Schedule Management**
    - File: `15-MODULE-SCHEDULE-MANAGEMENT.md`
    - Chức năng: Quản lý lịch học, lịch tháng, lặp lại

### 4.5. Module Admin

16. **Admin Dashboard**
    - File: `16-MODULE-ADMIN-DASHBOARD.md`
    - Chức năng: Tổng quan hệ thống, thống kê tổng

17. **Exam Approval**
    - File: `17-MODULE-EXAM-APPROVAL.md`
    - Chức năng: Duyệt đề thi do giáo viên/uploader đóng góp

18. **System Configuration**
    - File: `18-MODULE-SYSTEM-CONFIG.md`
    - Chức năng: Cấu hình hệ thống, backup, logs

### 4.6. Module hỗ trợ (Support Modules)

19. **Statistics & Analytics**
    - File: `19-MODULE-STATISTICS.md`
    - Chức năng: Thống kê chi tiết, báo cáo, charts

20. **Notification System**
    - File: `20-MODULE-NOTIFICATION.md`
    - Chức năng: Thông báo real-time, lịch sử thông báo

21. **Messaging System**
    - File: `21-MODULE-MESSAGING.md`
    - Chức năng: Tin nhắn lớp học, tin nhắn hệ thống

22. **Gamification**
    - File: `22-MODULE-GAMIFICATION.md`
    - Chức năng: Badge system, goal system

---

## 5. Vai trò người dùng

### 5.1. Student (Blue Theme)

**Quyền hạn:**
- ✅ Xem và làm bài tập
- ✅ Tham gia lớp học (nếu được mời)
- ✅ Xem tài liệu lớp học
- ✅ Làm bài tập được giao
- ✅ Thi thử random
- ✅ Xem lịch sử và thống kê cá nhân
- ✅ Nhận và xem thông báo
- ✅ Gửi tin nhắn trong lớp học
- ❌ Không tạo lớp học
- ❌ Không tạo bài tập
- ❌ Không upload đề thi

### 5.2. Teacher (Purple Theme)

**Quyền hạn:**
- ✅ Tất cả quyền của Student
- ✅ Tạo và quản lý lớp học
- ✅ Mời học viên vào lớp
- ✅ Giao bài tập cho lớp
- ✅ Điểm danh học viên
- ✅ Quản lý lịch học (thêm/sửa/xóa buổi học)
- ✅ Upload tài liệu lớp học
- ✅ Gửi thông báo cho lớp
- ✅ Xem tiến độ học viên
- ✅ Đóng góp đề thi (cần duyệt)
- ❌ Không quản lý toàn bộ hệ thống
- ❌ Không duyệt đề thi
- ❌ Không quản lý user khác

### 5.3. Admin (Red Theme)

**Quyền hạn:**
- ✅ Tất cả quyền của Teacher
- ✅ Quản lý tất cả người dùng (CRUD)
- ✅ Quản lý tất cả lớp học
- ✅ Duyệt đề thi do Teacher/Uploader đóng góp
- ✅ Quản lý ngân hàng đề thi
- ✅ Quản lý khóa học
- ✅ Quản lý tài liệu hệ thống
- ✅ Xem logs AI grading
- ✅ Quản lý giao dịch
- ✅ Cấu hình hệ thống
- ✅ Backup & restore
- ✅ Gửi thông báo hệ thống
- ✅ Quản lý tài khoản miễn phí

### 5.4. Uploader (Yellow Theme)

**Quyền hạn:**
- ✅ Upload đề thi mới
- ✅ Xem đề thi đã upload
- ✅ Sửa đề thi chưa được duyệt
- ✅ Xem trạng thái duyệt
- ❌ Không duyệt đề thi
- ❌ Không quản lý user
- ❌ Không tạo lớp học
- ❌ Không làm bài tập (chỉ upload)

---

## 6. Tính năng nổi bật

### 6.1. Auto-save thông minh
- Tự động lưu mỗi 10 giây
- Lưu vào localStorage trước
- Sync lên server khi có mạng
- Khôi phục bài làm khi quay lại

### 6.2. AI Grading
- **Writing**: 
  - Chấm theo 4 tiêu chí VSTEP
  - Feedback chi tiết từng tiêu chí
  - Gợi ý cải thiện cụ thể
- **Speaking**: 
  - Voice recording chất lượng cao
  - Phân tích phát âm, ngữ pháp, từ vựng
  - Feedback chi tiết

### 6.3. Thi thử Random
- Random 4 đề từ ngân hàng đề (mỗi level 1 đề)
- Xác nhận trước khi bắt đầu
- Timer 172 phút không tạm dừng
- Full test 4 kỹ năng liên tục
- Submit tự động khi hết giờ
- Xem kết quả chi tiết sau khi thi

### 6.4. Gamification
- **Badge System**: 20+ huy hiệu
  - First Steps (làm bài đầu tiên)
  - Perfect Score (điểm tuyệt đối)
  - Speed Demon (hoàn thành nhanh)
  - Night Owl (học đêm khuya)
  - Early Bird (học sáng sớm)
  - Consistent Learner (học đều đặn)
  - ...và nhiều hơn nữa

- **Goal System**: 
  - Đặt mục tiêu cá nhân
  - Theo dõi tiến độ
  - Nhận thông báo khi đạt mục tiêu
  - Gợi ý mục tiêu mới

### 6.5. Responsive Design
- **Desktop (1440px)**: 
  - Sidebar 320px cố định
  - Content max-width 1280px
  - 3-column layout cho cards
  
- **Tablet (768px)**: 
  - Sidebar ẩn, toggle button
  - 2-column layout
  
- **Mobile (375px)**: 
  - Fullscreen mobile sidebar
  - 1-column layout
  - Touch-optimized buttons (≥44px)

### 6.6. Class Management
- **Giáo viên**:
  - Tạo nhiều lớp học
  - Mời học viên qua code/link
  - Giao bài tập từ ngân hàng hoặc tự tạo
  - Điểm danh với 3 trạng thái (Có mặt/Muộn/Vắng)
  - Quản lý lịch học với 2 chế độ xem (List/Calendar)
  - Thêm buổi học với tính năng lặp lại hàng tuần
  - Upload tài liệu, share với lớp
  - Gửi thông báo cho lớp
  
- **Học viên**:
  - Tham gia lớp qua code
  - Xem lịch học
  - Làm bài tập được giao
  - Xem tài liệu lớp
  - Nhận thông báo từ giáo viên

### 6.7. Learning Roadmap
- Lộ trình học tập cá nhân hóa
- Dựa trên level hiện tại và mục tiêu
- Gợi ý bài tập phù hợp
- Tracking progress theo roadmap

---

## 7. Design Guidelines

### 7.1. Layout Specifications

- **Target screen**: 1440px
- **Max container width**: 1280px (max-w-7xl)
- **Sidebar width**: 320px (fixed)
- **Content padding**: 24px (px-6)
- **Card padding**: 20-24px
- **Spacing**: Bội số của 8 (8, 16, 24, 32, 40, 48...)

### 7.2. Typography

```css
/* Không được override font-size, font-weight, line-height trong Tailwind */
/* Sử dụng default từ globals.css */

h1: 2rem (32px) - font-bold
h2: 1.5rem (24px) - font-semibold
h3: 1.25rem (20px) - font-medium
body: ≥14px
small: 12px
```

### 7.3. Colors by Role

- **Student**: Blue theme
  - Primary: `blue-600`
  - Hover: `blue-700`
  - Background: `blue-50`, `blue-100`
  
- **Teacher**: Purple theme
  - Primary: `purple-600`
  - Hover: `purple-700`
  - Background: `purple-50`, `purple-100`
  
- **Admin**: Red theme
  - Primary: `red-600`
  - Hover: `red-700`
  - Background: `red-50`, `red-100`
  
- **Uploader**: Yellow theme
  - Primary: `yellow-600`
  - Hover: `yellow-700`
  - Background: `yellow-50`, `yellow-100`

### 7.4. Button Specifications

- **Minimum height**: 44px (touch-friendly)
- **Padding**: px-6 py-3 hoặc px-4 py-2
- **Border radius**: rounded-lg (8px)
- **Transition**: transition-colors hoặc transition-all

### 7.5. Card Specifications

- **Border**: border border-gray-200 hoặc border-gray-100
- **Shadow**: shadow-sm hoặc shadow-md
- **Padding**: p-6 (24px)
- **Border radius**: rounded-xl (12px)
- **Hover**: hover:shadow-lg transition-all

---

## 8. Tham khảo file chi tiết

Để xem phân tích chi tiết từng module, vui lòng tham khảo các file sau:

### Module cốt lõi
- `01-MODULE-AUTHENTICATION.md`
- `02-MODULE-PRACTICE-LEARNING.md`
- `03-MODULE-EXAM-SYSTEM.md`
- `04-MODULE-GRADING-SYSTEM.md`

### Module quản lý
- `05-MODULE-USER-MANAGEMENT.md`
- `06-MODULE-CLASS-MANAGEMENT.md`
- `07-MODULE-ASSIGNMENT-MANAGEMENT.md`
- `08-MODULE-MATERIALS-MANAGEMENT.md`

### Module Student
- `09-MODULE-STUDENT-DASHBOARD.md`
- `10-MODULE-LEARNING-ROADMAP.md`
- `11-MODULE-MY-COURSES.md`
- `12-MODULE-ACHIEVEMENTS.md`

### Module Teacher
- `13-MODULE-TEACHER-DASHBOARD.md`
- `14-MODULE-ATTENDANCE.md`
- `15-MODULE-SCHEDULE-MANAGEMENT.md`

### Module Admin
- `16-MODULE-ADMIN-DASHBOARD.md`
- `17-MODULE-EXAM-APPROVAL.md`
- `18-MODULE-SYSTEM-CONFIG.md`

### Module hỗ trợ
- `19-MODULE-STATISTICS.md`
- `20-MODULE-NOTIFICATION.md`
- `21-MODULE-MESSAGING.md`
- `22-MODULE-GAMIFICATION.md`

### Tài liệu kỹ thuật
- `23-DATABASE-DESIGN.md` - Chi tiết database schema
- `24-API-SPECIFICATION.md` - API endpoints đầy đủ
- `25-USER-FLOWS.md` - User flow diagrams
- `26-SEQUENCE-DIAGRAMS.md` - Sequence diagrams chi tiết
- `27-NON-FUNCTIONAL-REQUIREMENTS.md` - Yêu cầu phi chức năng

---

## 9. Lộ trình phát triển

### Phase 1: Core Features ✅ (Đã hoàn thành)
- ✅ Authentication & Authorization
- ✅ Practice System (4 kỹ năng)
- ✅ Student Dashboard
- ✅ Teacher Dashboard
- ✅ Admin Dashboard
- ✅ Basic Class Management
- ✅ Assignment System
- ✅ Mock Exam (Thi thử Random)
- ✅ Attendance System
- ✅ Schedule Management

### Phase 2: Advanced Features (Đang phát triển)
- 🔄 AI Grading Integration
- 🔄 Learning Roadmap Algorithm
- 🔄 Advanced Statistics & Analytics
- 🔄 Badge & Goal System (đã có base)
- 🔄 Messaging System

### Phase 3: Enterprise Features (Kế hoạch)
- ⏳ Payment Integration
- ⏳ Certificate Generation
- ⏳ Advanced Reporting
- ⏳ Mobile App (React Native)
- ⏳ Offline Mode
- ⏳ Video Lessons Integration

---

**Kết thúc tài liệu tổng quan**

> Để xem chi tiết từng module, vui lòng mở các file markdown tương ứng trong thư mục `/docs`.

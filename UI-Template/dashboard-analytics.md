# 📊 DASHBOARD & ANALYTICS - BÁO CÁO VÀ PHÂN TÍCH

## Mục lục
1. [Tổng quan](#tổng-quan)
2. [Student Dashboard](#student-dashboard)
3. [Teacher Dashboard](#teacher-dashboard)
4. [Admin Dashboard](#admin-dashboard)
5. [Analytics & Reports](#analytics--reports)
6. [Database Design](#database-design)
7. [API Endpoints](#api-endpoints)

---

## Tổng quan

### Mục đích
Module Dashboard & Analytics cung cấp các dashboard tùy theo vai trò người dùng và hệ thống phân tích, báo cáo toàn diện về hoạt động học tập và giảng dạy.

### Phạm vi
- Student Dashboard (Tổng quan học tập cá nhân)
- Teacher Dashboard (Quản lý lớp và học viên)
- Admin Dashboard (Giám sát toàn hệ thống)
- Analytics và Reports
- Data visualization với charts
- Export reports

---

## Student Dashboard

### 1. Dashboard Overview (Trang chủ)

#### 1.1. Welcome Section
```typescript
interface StudentDashboard {
  // User Info
  user: {
    name: string;
    avatar: string;
    level: number; // 1-100
    currentLevel: 'A2' | 'B1' | 'B2' | 'C1';
    targetLevel: 'B1' | 'B2' | 'C1';
  };
  
  // Quick Stats
  stats: {
    streakDays: number;
    testsCompleted: number;
    studyTime: number; // minutes
    averageScore: number;
  };
  
  // Progress to Next Level
  levelProgress: {
    current: number; // XP
    required: number; // XP to next level
    percentage: number;
  };
}
```

Display:
```
┌─────────────────────────────────────────┐
│ Welcome back, Nguyễn Văn A! 👋          │
│ Level 15 | B2 → Target: C1              │
│                                         │
│ Progress to Level 16: [████████░░] 80% │
│ 800 / 1000 XP                           │
└─────────────────────────────────────────┘

┌──────────┬──────────┬──────────┬──────────┐
│ 🔥 Streak│ ✅ Tests │ ⏱ Time  │ ⭐ Score │
│ 15 days  │ 45 tests │ 21h 30m │ 7.5/10   │
└──────────┴──────────┴──────────┴──────────┘
```

#### 1.2. Skill Overview (Radar Chart)

```typescript
interface SkillData {
  reading: number; // 0-10
  listening: number;
  writing: number;
  speaking: number;
}
```

Hiển thị radar chart 4 trục showing current scores for each skill.

#### 1.3. Recent Activities

Timeline of last 10 activities:
- ✅ Completed Reading Test B2 - Score: 8.0 - 2 hours ago
- 🏆 Unlocked badge "Early Bird" - 1 day ago
- 📝 Submitted Writing Task 1 - Pending grading
- 🎯 Achieved goal "10 tests this week"

#### 1.4. Current Goals

Display active goals with progress:
```
┌──────────────────────────────────────────┐
│ 🎯 Complete 10 tests this month          │
│ [████████░░░░░░] 7/10 (70%)             │
│ Deadline: 31/12/2024                    │
└──────────────────────────────────────────┘
```

#### 1.5. Upcoming Classes

Next 3 scheduled classes:
```
┌──────────────────────────────────────────┐
│ VSTEP B2 - Batch 2024                    │
│ Mon, 16 Dec - 19:00-21:00               │
│ Teacher: Nguyễn Văn A | Online          │
│ [Join Class]                            │
└──────────────────────────────────────────┘
```

#### 1.6. Recommended Practice

AI-powered recommendations:
- Based on weakest skill
- Based on recent performance
- Based on goals

```
Suggested for you:
- Speaking Part 2 Practice (Your weakest area)
- Listening B2 Full Test
- Writing Task 1: Graphs
```

#### 1.7. Badges & Achievements

Display recently earned badges (last 5):
```
🏆 Early Bird | 🔥 Week Warrior | ⭐ High Scorer
📚 Bookworm  | 🎯 Goal Crusher
```

### 2. Statistics Page (Detailed Analytics)

#### 2.1. Overview Tab
- All-time stats
- Current month stats
- Comparison with previous month
- Progress trends (line chart)

#### 2.2. Study Time Tab
- Daily/Weekly/Monthly study time
- Heatmap calendar
- Most active hours
- Study pattern analysis

#### 2.3. Test History Tab
- List of all tests taken
- Filters: Skill, Date, Score
- Score trends over time
- Improvement graph

#### 2.4. Skills Analysis Tab
- Detailed breakdown per skill
- Strengths and weaknesses
- Question types performance
- Topic-wise analysis

#### 2.5. Goals & Achievements Tab
- All goals (active, completed, failed)
- Badges collection
- Milestones reached
- Streaks history

---

## Teacher Dashboard

### 1. Dashboard Overview

#### 1.1. Quick Stats Cards
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Total        │ Current      │ Students     │ Avg Rating   │
│ Classes      │ Students     │ Taught       │              │
│    12        │    456       │   1,234      │    4.8/5     │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

#### 1.2. Today's Schedule

Calendar view showing today's classes:
```
09:00 - 11:00  VSTEP B2 Morning Class (25 students)
14:00 - 16:00  Writing Workshop (18 students)
19:00 - 21:00  VSTEP C1 Evening Class (22 students)
```

#### 1.3. Current Classes Overview

List of active classes with progress:
```
┌──────────────────────────────────────────────┐
│ VSTEP B2 - Batch 2024                        │
│ 25/30 students | Progress: 65%              │
│ Next: Mon 19:00 | Avg Score: 7.8            │
│ [View] [Attendance] [Assignments]           │
└──────────────────────────────────────────────┘
```

#### 1.4. Pending Tasks
- Assignments to grade: 15
- Attendance to take: 2 classes
- Student questions: 5
- Course materials to upload: 3

#### 1.5. Student Performance Alerts
- Students falling behind (score < 5.5)
- Low attendance alerts
- Missed assignments
- Students need help

#### 1.6. Recent Class Activities
- Student A submitted assignment
- Class B attendance: 24/25 present
- Student C asked a question
- Assignment D: 20/25 submitted

### 2. Class Analytics

For each class:

#### 2.1. Class Overview
- Total students enrolled
- Attendance rate
- Average score
- Completion rate
- Active students (active 7 days)

#### 2.2. Performance Charts
- **Score Distribution** (Bar Chart):
  ```
  0-4:   █ 2
  4-5.5: ███ 4
  5.5-7: ████████ 10
  7-8.5: ██████ 8
  8.5-10:█ 1
  ```

- **Progress Timeline** (Line Chart):
  X-axis: Weeks
  Y-axis: Average class score
  Show improvement trend

- **Skill Comparison** (Radar Chart):
  Compare class average vs target for each skill

#### 2.3. Student Performance Table
| Student Name | Score | Attendance | Tests | Status |
|-------------|-------|------------|-------|---------|
| Nguyễn Văn A| 8.5   | 95%        | 12    | ⭐ Excellent |
| Trần Thị B  | 7.2   | 88%        | 10    | ✅ Good |
| Lê Văn C    | 5.0   | 75%        | 8     | ⚠️ Needs Help |

#### 2.4. Assignment Analytics
For each assignment:
- Submission rate: 20/25 (80%)
- Average score: 7.5
- Time to complete: avg 45 min
- Question difficulty analysis
- Common mistakes

### 3. Grading Queue

Interface for teacher to grade submissions:
- Filter by: Class, Assignment, Status
- Sort by: Submission time, Student name
- Bulk actions: Send feedback, Export

For each submission:
- Student info
- Submission time
- Quick grade button
- View full submission

---

## Admin Dashboard

### 1. Dashboard Overview (AdminDashboardPage.tsx)

#### 1.1. Key Metrics Cards
```typescript
interface AdminStats {
  users: {
    total: number;
    students: number;
    teachers: number;
    activeThisMonth: number;
    growth: string; // "+12.5%"
  };
  
  tests: {
    totalTaken: number;
    thisMonth: number;
    averageScore: number;
    completionRate: number;
  };
  
  revenue: {
    thisMonth: number;
    lastMonth: number;
    growth: string;
    totalAllTime: number;
  };
  
  aiLogs: {
    totalRequests: number;
    thisMonth: number;
    successRate: number;
    totalCost: number;
  };
}
```

Display:
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Total Users │ Tests Taken │ Revenue     │ AI Requests │
│ 15,234      │ 45,678      │ $12,345     │ 8,456       │
│ +12.5%      │ +18.3%      │ +25.2%      │ +15.7%      │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

#### 1.2. Revenue Chart (Last 6 months)
Line chart showing monthly revenue trend

#### 1.3. User Growth Chart
Area chart showing user growth over time:
- Total users
- Students
- Teachers
- Daily active users

#### 1.4. Service Distribution (Pie Chart)
Distribution of services used:
- Reading practice: 30%
- Listening practice: 25%
- Writing practice: 25%
- Speaking practice: 20%

#### 1.5. Recent Activities Log
System-wide activities:
- New user registered
- New class created
- Exam published
- Payment received
- AI grading completed

#### 1.6. System Health Monitor
- Server status: ✅ Healthy
- Database: ✅ Connected
- AI Service: ✅ Operational
- Storage: 45% used
- Response time: 120ms avg

### 2. User Analytics

#### 2.1. User Growth Metrics
- New users per day/week/month
- User retention rate
- Churn rate
- Active users (DAU, WAU, MAU)

#### 2.2. User Segmentation
- By level: A2, B1, B2, C1
- By activity: Active, Inactive, Dormant
- By performance: Excellent, Good, Average, Poor
- By geography (if available)

#### 2.3. Engagement Metrics
- Average session duration
- Sessions per user
- Features usage
- Most popular content

### 3. Content Analytics

#### 3.1. Course Performance
- Most popular courses
- Completion rates
- Average ratings
- Revenue per course

#### 3.2. Exam Analytics
- Most taken exams
- Average scores by level
- Question difficulty analysis
- Time spent per exam

#### 3.3. Material Downloads
- Most downloaded materials
- Download trends
- Popular topics

### 4. Financial Analytics

#### 4.1. Revenue Reports
- Daily/Weekly/Monthly revenue
- Revenue by service type
- Payment methods distribution
- Refunds and chargebacks

#### 4.2. AI Costs Tracking
- Total AI requests
- Cost per request
- Cost by skill (Writing/Speaking)
- Cost trends

#### 4.3. ROI Analysis
- Customer acquisition cost
- Lifetime value
- Revenue per user
- Profitability metrics

### 5. Performance Metrics

#### 5.1. System Performance
- API response times
- Database query performance
- Error rates
- Uptime percentage

#### 5.2. User Experience
- Page load times
- Bounce rates
- Conversion rates
- User satisfaction scores

---

## Analytics & Reports

### 1. Report Types

#### 1.1. Student Progress Report
```typescript
interface StudentProgressReport {
  period: {
    from: Date;
    to: Date;
  };
  
  overview: {
    testsCompleted: number;
    averageScore: number;
    studyTime: number;
    improvement: string;
  };
  
  skills: {
    skill: string;
    currentScore: number;
    previousScore: number;
    improvement: number;
    testsT aken: number;
  }[];
  
  goals: {
    total: number;
    completed: number;
    inProgress: number;
  };
  
  attendance: {
    total: number;
    attended: number;
    rate: number;
  };
  
  recommendations: string[];
}
```

#### 1.2. Class Performance Report
```typescript
interface ClassPerformanceReport {
  class: {
    id: string;
    name: string;
    teacher: string;
  };
  
  period: {
    from: Date;
    to: Date;
  };
  
  overview: {
    totalStudents: number;
    activeStudents: number;
    averageScore: number;
    attendanceRate: number;
  };
  
  performance: {
    scoreDistribution: {range: string; count: number}[];
    passRate: number;
    improvementRate: number;
  };
  
  topPerformers: Student[];
  needsAttention: Student[];
  
  assignments: {
    total: number;
    completed: number;
    averageScore: number;
  };
}
```

#### 1.3. System Analytics Report
Monthly report for admins covering:
- User statistics
- Revenue and finances
- System performance
- Content usage
- AI service usage
- Trends and insights

### 2. Report Generation

Process:
```
User selects report type
  ↓
Configure parameters:
  - Period (date range)
  - Filters (class, student, level)
  - Sections to include
  - Format (PDF, Excel, CSV)
  ↓
Click "Generate"
  ↓
Backend:
  - Query database
  - Aggregate data
  - Calculate metrics
  - Generate charts (as images)
  - Render template
  - Create PDF/Excel
  ↓
Download file
```

### 3. Scheduled Reports

Admins/Teachers can schedule automatic reports:
- Daily: Send at 8:00 AM
- Weekly: Every Monday
- Monthly: First day of month

Recipients:
- Email
- Download link
- Dashboard notification

---

## Database Design

### Table: analytics_events

```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User
  user_id UUID REFERENCES users(id),
  session_id UUID,
  
  -- Event
  event_type VARCHAR(50) NOT NULL,
    -- 'page_view', 'test_started', 'test_completed', 'login', 'logout'
  event_name VARCHAR(100),
  
  -- Data
  properties JSONB, -- Event-specific data
  
  -- Context
  page_url VARCHAR(500),
  referrer VARCHAR(500),
  user_agent TEXT,
  ip_address VARCHAR(45),
  device_type VARCHAR(20), -- 'desktop', 'mobile', 'tablet'
  
  -- Timestamp
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  INDEX idx_events_user (user_id),
  INDEX idx_events_type (event_type),
  INDEX idx_events_created (created_at),
  INDEX idx_events_session (session_id)
);
```

### Table: daily_stats

```sql
CREATE TABLE daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  
  -- Users
  total_users INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  
  -- Tests
  tests_taken INTEGER DEFAULT 0,
  tests_completed INTEGER DEFAULT 0,
  average_score DECIMAL(3,1),
  
  -- Study Time
  total_study_time INTEGER DEFAULT 0, -- minutes
  average_per_user INTEGER DEFAULT 0,
  
  -- Revenue
  revenue DECIMAL(10,2) DEFAULT 0,
  transactions INTEGER DEFAULT 0,
  
  -- AI
  ai_requests INTEGER DEFAULT 0,
  ai_cost DECIMAL(10,4) DEFAULT 0,
  
  -- Engagement
  logins INTEGER DEFAULT 0,
  sessions INTEGER DEFAULT 0,
  page_views INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  INDEX idx_daily_stats_date (date)
);
```

### Table: reports

```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Type
  report_type VARCHAR(50) NOT NULL,
    -- 'student_progress', 'class_performance', 'system_analytics'
  
  -- Parameters
  parameters JSONB, -- {period, filters, sections}
  
  -- Generated For
  user_id UUID REFERENCES users(id),
  class_id UUID REFERENCES classes(id),
  
  -- File
  file_url VARCHAR(500),
  file_format VARCHAR(10), -- pdf, excel, csv
  file_size BIGINT,
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending',
    -- 'pending', 'generating', 'completed', 'failed'
  error_message TEXT,
  
  -- Generated By
  generated_by UUID REFERENCES users(id),
  
  -- Schedule
  is_scheduled BOOLEAN DEFAULT FALSE,
  schedule_frequency VARCHAR(20), -- 'daily', 'weekly', 'monthly'
  next_run_at TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP,
  
  INDEX idx_reports_type (report_type),
  INDEX idx_reports_user (user_id),
  INDEX idx_reports_class (class_id),
  INDEX idx_reports_status (status)
);
```

---

## API Endpoints

### 1. Student Dashboard

**GET /api/dashboard/student** - Get student dashboard data  
**GET /api/dashboard/student/stats** - Get detailed stats  
**GET /api/dashboard/student/activities** - Get recent activities  
**GET /api/dashboard/student/goals** - Get current goals  

### 2. Teacher Dashboard

**GET /api/dashboard/teacher** - Get teacher dashboard  
**GET /api/dashboard/teacher/classes** - Get classes overview  
**GET /api/dashboard/teacher/schedule** - Get today's schedule  
**GET /api/dashboard/teacher/pending-tasks** - Get pending tasks  
**GET /api/classes/:id/analytics** - Get class analytics  

### 3. Admin Dashboard

**GET /api/dashboard/admin** - Get admin dashboard  
**GET /api/dashboard/admin/stats** - Get system stats  
**GET /api/dashboard/admin/users** - Get user analytics  
**GET /api/dashboard/admin/revenue** - Get revenue data  
**GET /api/dashboard/admin/ai-logs** - Get AI usage stats  

### 4. Analytics

**POST /api/analytics/event** - Track event  
**GET /api/analytics/users** - Get user analytics  
**GET /api/analytics/content** - Get content analytics  
**GET /api/analytics/performance** - Get performance metrics  

### 5. Reports

**POST /api/reports/generate** - Generate report  
**GET /api/reports/:id** - Get report  
**GET /api/reports/:id/download** - Download report  
**POST /api/reports/schedule** - Schedule recurring report  
**GET /api/reports** - List all reports  

---

## Summary

Module Dashboard & Analytics cung cấp:
- **3 dashboards** tùy theo role (Student, Teacher, Admin)
- **Real-time statistics** và metrics
- **Data visualization** với charts (Line, Bar, Pie, Radar, Area)
- **Comprehensive analytics** cho users, classes, content
- **Report generation** system với multiple formats
- **Event tracking** cho user behavior analysis
- **3 database tables** cho analytics data
- **15+ API endpoints** đầy đủ

**Ngày tạo**: 2024-12-11  
**Phiên bản**: 1.0

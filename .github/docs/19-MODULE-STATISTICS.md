# 📊 Module 19: Statistics & Analytics

> **Module thống kê và phân tích tiến độ học tập**
> 
> File: `19-MODULE-STATISTICS.md`  
> Version: 1.0  
> Last Updated: 15/12/2024

---

## 📑 Mục lục

- [1. Giới thiệu module](#1-giới-thiệu-module)
- [2. Danh sách chức năng](#2-danh-sách-chức-năng)
- [3. Phân tích màn hình UI](#3-phân-tích-màn-hình-ui)
- [4. Charts & Visualizations](#4-charts--visualizations)
- [5. Database Design](#5-database-design)
- [6. API Endpoints](#6-api-endpoints)
- [7. Analytics Calculations](#7-analytics-calculations)

---

## 1. Giới thiệu module

### 1.1. Mục đích
Module Statistics & Analytics cung cấp:
- **Tổng quan học tập**: Dashboard với key metrics
- **Phân tích chi tiết**: Breakdown theo kỹ năng, level, thời gian
- **Theo dõi tiến độ**: Progress tracking theo mục tiêu
- **Insights thông minh**: AI-powered recommendations
- **Báo cáo xuất**: Export PDF/Excel
- **So sánh**: Compare với peers (optional)

### 1.2. Vai trò sử dụng

**Student (Học viên)**:
- Xem thống kê cá nhân
- Theo dõi tiến độ
- Xem insights và recommendations
- So sánh với trung bình lớp (optional)
- Export báo cáo cá nhân

**Teacher (Giáo viên)**:
- Xem thống kê lớp học
- So sánh học viên
- Phân tích điểm mạnh/yếu của lớp
- Export báo cáo lớp
- Theo dõi engagement

**Admin**:
- Xem thống kê toàn hệ thống
- Phân tích trends
- User growth metrics
- Content performance
- System health

### 1.3. Key Metrics

**Practice Metrics**:
- Total exercises completed
- Total practice time
- Average score by skill
- Accuracy rate
- Progress trend

**Assignment Metrics**:
- Assignments completed
- Average grade
- On-time submission rate
- Improvement rate

**Exam Metrics**:
- Mock exams taken
- Overall band score
- Score progression
- Time management

**Engagement Metrics**:
- Login frequency
- Study streak (days)
- Active time per day
- Last activity

### 1.4. Phạm vi module
- Overview Dashboard (tổng quan)
- Skill-specific Statistics (chi tiết 4 kỹ năng)
- Time-based Analysis (theo thời gian)
- Comparison & Benchmarking (so sánh)
- Goals & Progress Tracking (mục tiêu)
- Recommendations (gợi ý)
- Reports Export (xuất báo cáo)

---

## 2. Danh sách chức năng

### 2.1. Chức năng chính - Student

#### A. Overview Dashboard

**Mô tả**: Dashboard tổng quan với key metrics

**Component**: `/components/statistics/OverviewTab.tsx`

**Sections**:

**1. Key Stats Cards** (4 cards):
- **Total Exercises**:
  - Number: 156 completed
  - Icon: CheckCircle
  - Trend: +12 this week ↗
  
- **Practice Time**:
  - Number: 45.5 hours
  - Icon: Clock
  - Trend: +5.2h this week ↗
  
- **Average Score**:
  - Number: 7.8/10
  - Icon: TrendingUp
  - Trend: +0.3 vs last month ↗
  
- **Current Streak**:
  - Number: 7 days 🔥
  - Icon: Flame
  - Personal best: 15 days

**2. Score Overview** (Chart):
- Line chart: Score progression over time
- X-axis: Time (last 30 days)
- Y-axis: Score (0-10)
- 4 lines: Reading, Listening, Writing, Speaking
- Show trend lines

**3. Recent Activity** (Timeline):
- Last 10 activities
- Each item:
  - Icon (skill badge)
  - Activity: "Completed Reading Full Test - Đề số 5"
  - Score: 8.5/10
  - Time: "2 hours ago"

**4. Skills Breakdown** (Radar/Spider Chart):
- 4 axes: Reading, Listening, Writing, Speaking
- Show current scores
- Show target scores (if set)

**5. Upcoming Goals**:
- List of active goals
- Progress bars
- Deadline countdown

---

#### B. Skill-specific Statistics

**Mô tả**: Thống kê chi tiết cho từng kỹ năng

**Component**: `/components/statistics/ExercisePerformanceTab.tsx`

**Skill Tabs**: Reading | Listening | Writing | Speaking

**For each skill**:

**Summary Cards**:
- Total exercises: X
- Average score: Y/10
- Highest score: Z/10
- Total time: W hours

**Score Distribution** (Histogram):
- X-axis: Score ranges (0-3, 3-5, 5-7, 7-9, 9-10)
- Y-axis: Number of exercises
- Show: Which range most exercises fall into

**Score Trend** (Line Chart):
- X-axis: Time (last 30 days)
- Y-axis: Score
- Show: Improvement or decline

**Part Analysis** (for Reading/Listening):
- Part 1: X% accuracy, Y exercises
- Part 2: X% accuracy, Y exercises
- Part 3: X% accuracy, Y exercises
- Identify weakest part

**Common Mistakes** (Top 5):
- Question type with lowest accuracy
- Specific skill areas
- Recommendations

**Recent Exercises** (Table):
- Columns:
  - Date
  - Exercise title
  - Type (Part/Full)
  - Score
  - Time
  - Actions (Review)

---

#### C. Time-based Analysis

**Mô tả**: Phân tích theo thời gian học tập

**Component**: `/components/statistics/StudyTimeTab.tsx`

**Sections**:

**1. Study Time Overview**:
- Total time: 45.5 hours
- This week: 8.2 hours
- Daily average: 1.2 hours
- Most productive day: Monday

**2. Time Distribution** (Pie Chart):
- By skill:
  - Reading: 35%
  - Listening: 25%
  - Writing: 20%
  - Speaking: 20%

**3. Study Pattern** (Heat Map):
- Days of week (rows)
- Hours of day (columns)
- Color intensity: Amount of study time
- Identify: Peak study times

**4. Weekly Summary** (Bar Chart):
- X-axis: Days of week (Mon-Sun)
- Y-axis: Hours studied
- Show: Consistency

**5. Study Streak**:
- Current streak: 7 days
- Longest streak: 15 days
- Total active days: 45/90 days
- Calendar view with colored days

---

#### D. Goals & Progress Tracking

**Mô tả**: Theo dõi mục tiêu học tập

**Component**: `/components/statistics/GamificationTab.tsx`

**Sections**:

**1. Active Goals**:
- List of goals
- Each goal card:
  - Title: "Complete 20 Reading exercises"
  - Progress: 15/20 (75%)
  - Progress bar
  - Deadline: "5 days left"
  - Status: On track / Behind / Ahead
  - Action: "Continue"

**2. Goal Categories**:
- Exercise Count Goals
- Score Achievement Goals
- Time-based Goals
- Skill Improvement Goals

**3. Completed Goals**:
- Grid of completed goals
- Checkmark badges
- Completion dates

**4. Badges & Achievements**:
- All earned badges
- Progress to next badges
- Badge showcase

---

#### E. Recommendations

**Mô tả**: Gợi ý cá nhân hóa dựa trên data

**Component**: `/components/statistics/RecommendationsTab.tsx`

**Sections**:

**1. Personalized Insights**:
- "Your Reading score improved 15% this month 📈"
- "You're most productive on Monday mornings ⏰"
- "Writing is your weakest skill - focus here 📝"

**2. Recommended Exercises**:
- Based on:
  - Weak areas
  - Target level
  - Recent performance
- List of exercises with reason:
  - "Listening Part 3 practice (your accuracy: 65%)"

**3. Study Plan Suggestions**:
- Optimal study time: "1-2 hours per day"
- Suggested schedule:
  - Mon/Wed/Fri: Reading + Listening
  - Tue/Thu: Writing + Speaking
  - Sat: Full mock exam
  - Sun: Review mistakes

**4. Comparison with Peers** (optional):
- Anonymous comparison
- "You're in top 25% of your class"
- "Your Reading is above average"
- "Your Speaking needs improvement"

---

#### F. Reports Export

**Mô tả**: Xuất báo cáo chi tiết

**Feature**: Export button on dashboard

**Export Options**:

**1. PDF Report**:
- Full statistics report
- Charts and graphs
- Recommendations
- Professional format

**2. Excel/CSV**:
- Raw data export
- All exercises with scores
- Time logs
- For self-analysis

**Report Contents**:
- Cover page (name, date, period)
- Executive summary
- Skill-by-skill analysis
- Score trends
- Time analysis
- Goals progress
- Recommendations

---

### 2.2. Chức năng chính - Teacher

#### A. Class Statistics

**Mô tả**: Thống kê tổng quan lớp học

**Dashboard Sections**:

**1. Class Overview**:
- Total students: X
- Active students: Y (this week)
- Average score: Z/10
- Completion rate: W%

**2. Student Performance Distribution**:
- Histogram: Number of students in each score range
- Identify: Top performers, struggling students

**3. Skill Analysis**:
- Average scores by skill
- Identify: Class strengths and weaknesses
- Compare with other classes (if applicable)

**4. Engagement Metrics**:
- Active students (last 7 days)
- Average study time per student
- Assignment completion rate
- Attendance rate

**5. Top Performers**:
- Leaderboard (top 10)
- Name, average score, exercises completed

**6. Students Needing Help**:
- List of struggling students
- Criteria: Low scores, inactive, missed assignments
- Quick action: Send message, schedule meeting

---

#### B. Individual Student Reports

**Mô tả**: Báo cáo chi tiết từng học viên

**Access**: Click student in class list

**Report Contents**:
- Student info
- All statistics (same as student view)
- Assignment performance
- Attendance record
- Progress over time
- Comparison with class average
- Teacher notes section

**Actions**:
- Export PDF
- Send report to student
- Schedule meeting
- Add notes

---

#### C. Assignment Analytics

**Mô tả**: Phân tích performance của bài tập

**Metrics per Assignment**:
- Submission rate: X/Y submitted
- On-time rate: X% on time
- Average score: Z/10
- Score distribution
- Time to complete (average)
- Common mistakes

**Insights**:
- "Assignment too easy/hard?"
- "Students struggled with Part 3"
- "Average score below expectation"

---

### 2.3. Chức năng chính - Admin

#### A. System-wide Analytics

**Dashboard**:
- Total users: X
- Active users (DAU/MAU)
- New registrations (this month)
- User growth trend
- Revenue metrics (if applicable)

**Content Analytics**:
- Most popular exercises
- Average completion time per exercise
- User satisfaction scores
- Content gaps

**System Health**:
- API response times
- Error rates
- Uptime
- Storage usage

---

### 2.4. Quyền sử dụng

| Chức năng | Student | Teacher | Admin |
|-----------|---------|---------|-------|
| **Student Stats** | | | |
| View Own Stats | ✅ | ✅ | ✅ |
| View Student Stats | ❌ | ✅ (own class) | ✅ (all) |
| Export Own Report | ✅ | ✅ | ✅ |
| Compare with Peers | ✅ (anonymous) | ✅ | ✅ |
| **Teacher Stats** | | | |
| View Class Stats | ❌ | ✅ (own) | ✅ (all) |
| View Student Reports | ❌ | ✅ (own class) | ✅ (all) |
| Export Class Report | ❌ | ✅ (own) | ✅ (all) |
| **Admin Stats** | | | |
| View System Stats | ❌ | ❌ | ✅ |
| View All Analytics | ❌ | ❌ | ✅ |

---

## 3. Phân tích màn hình UI

### 3.1. Student Statistics Page

**File**: `/components/Statistics.tsx`

#### Tên màn hình
**Statistics / Thống kê học tập**

#### Mục đích
Hiển thị tổng quan và chi tiết thống kê học tập

#### Các thành phần UI

**Header**:
- Page title: "Thống kê học tập"
- Date range selector:
  - Last 7 days
  - Last 30 days
  - Last 3 months
  - All time
  - Custom range
- Export button: "Xuất báo cáo" (PDF/Excel options)

**Tabs**:
1. **Overview (Tổng quan)**
2. **Exercise Performance (Hiệu suất bài tập)**
3. **Study Time (Thời gian học)**
4. **Course Progress (Tiến độ khóa học)**
5. **Test History (Lịch sử thi)**
6. **Recommendations (Gợi ý)**
7. **Gamification (Huy hiệu & Mục tiêu)**

---

**TAB 1: Overview**

**Section 1: Key Metrics** (4 cards in row):

**Card 1: Total Exercises**:
- Icon: CheckCircle (large, green)
- Number: "156" (large, bold)
- Label: "Bài tập đã hoàn thành"
- Trend: "+12 this week" (green, ↗)

**Card 2: Practice Time**:
- Icon: Clock (large, blue)
- Number: "45.5h"
- Label: "Tổng thời gian luyện tập"
- Trend: "+5.2h this week" (green, ↗)

**Card 3: Average Score**:
- Icon: TrendingUp (large, purple)
- Number: "7.8/10"
- Label: "Điểm trung bình"
- Trend: "+0.3 vs last month" (green, ↗)

**Card 4: Current Streak**:
- Icon: Flame (animated, orange)
- Number: "7 days 🔥"
- Label: "Chuỗi ngày học"
- Sub: "Personal best: 15 days"

**Section 2: Score Progression** (Large chart):
- Title: "Điểm số theo thời gian"
- Type: Line chart (Recharts)
- X-axis: Dates
- Y-axis: Score (0-10)
- 4 lines:
  - Reading (blue)
  - Listening (purple)
  - Writing (green)
  - Speaking (orange)
- Legend (show/hide lines)
- Tooltip on hover
- Trend lines (dashed)

**Section 3: Skills Breakdown** (2 columns):

**Left: Radar Chart**:
- 4 axes: Reading, Listening, Writing, Speaking
- Current scores (solid line)
- Target scores (dashed line, if set)
- Filled area

**Right: Skill Cards** (4 cards):
Each skill card:
- Skill name + icon
- Current score: 8.5/10
- Progress bar
- Total exercises: 45
- Improvement: +0.5 vs last month
- Status badge: "Tốt" / "Cần cải thiện"

**Section 4: Recent Activity** (Timeline):
- Last 10 activities
- Vertical timeline
- Each item:
  - Time: "2 hours ago"
  - Icon: Skill badge
  - Activity: "Completed Reading Full Test - Đề số 5"
  - Score: 8.5/10 (colored badge)
  - Link: "Xem chi tiết"

---

**TAB 2: Exercise Performance**

**Sub-tabs**: Reading | Listening | Writing | Speaking

**For Reading Tab**:

**Summary Cards** (4 cards):
- Total exercises: 45
- Avg score: 8.5/10
- Highest score: 9.5/10
- Total time: 15.5h

**Score Distribution** (Histogram):
- Title: "Phân bố điểm số"
- X-axis: Score ranges
- Y-axis: Number of exercises
- Bars colored by range

**Score Trend** (Line chart):
- Title: "Xu hướng điểm số"
- X-axis: Time
- Y-axis: Score
- Trend line
- Data points clickable (show exercise)

**Part Analysis** (3 cards):
- Part 1: Gap Fill
  - Accuracy: 85%
  - Exercises: 15
  - Avg time: 12 min
  - Status: "Tốt" ✓
  
- Part 2: Short Passages
  - Accuracy: 75%
  - Exercises: 15
  - Avg time: 18 min
  - Status: "Cần cải thiện" ⚠
  
- Part 3: Long Passages
  - Accuracy: 82%
  - Exercises: 15
  - Avg time: 25 min
  - Status: "Tốt" ✓

**Weakest Areas** (List):
- "Part 2: Main idea questions (68% accuracy)"
- "Part 3: Inference questions (72% accuracy)"
- "Part 1: Vocabulary in context (75% accuracy)"

**Recommendations**:
- "Practice more Part 2 exercises"
- "Focus on main idea identification"
- "Review inference strategies"
- Button: "Luyện tập ngay" (links to recommended exercises)

**Recent Exercises** (Table):
- Columns:
  - Date
  - Title
  - Type
  - Score
  - Time
  - Actions (Review button)
- Sort by date (newest first)
- Pagination

---

**TAB 3: Study Time**

**Summary Cards**:
- Total time: 45.5h
- This week: 8.2h
- Daily avg: 1.2h
- Most productive: Monday

**Time Distribution** (Pie chart):
- By skill
- Percentages
- Legend
- Clickable slices

**Study Pattern** (Heat map):
- Y-axis: Days of week
- X-axis: Hours (0-23)
- Color intensity: Study time
- Tooltip: Exact time
- Identify: Peak hours

**Weekly Activity** (Bar chart):
- X-axis: Days (Mon-Sun)
- Y-axis: Hours
- Bars colored by total time
- Goal line (if set)

**Study Streak Calendar**:
- Month view
- Days colored:
  - Green: Active day
  - Gray: Inactive day
  - Blue: Today
- Stats:
  - Current streak: 7 days
  - Longest streak: 15 days
  - Active days: 45/90

---

**TAB 4: Course Progress**

**Enrolled Courses** (if applicable):
- List of courses
- Each course card:
  - Course name
  - Progress: X/Y lessons completed
  - Progress bar
  - Time spent
  - Last accessed
  - Button: "Continue"

**Class Assignments** (if in classes):
- List of assignments
- Status: Completed / Pending
- Scores
- Deadlines

---

**TAB 5: Test History**

**Mock Exams** (list):
- Each exam card:
  - Date
  - Overall score
  - Breakdown by skill
  - Time taken
  - Certificate (if available)
  - Button: "View detailed results"

**Progress Chart**:
- Line chart: Overall score over time
- Show: Improvement trend

---

**TAB 6: Recommendations**

**Personalized Insights** (cards):
- Icon + Message
- "Your Reading improved 15% this month 📈"
- "You study best on Monday mornings ⏰"
- "Writing is your weakest skill - focus here 📝"
- "You're 2 days away from your longest streak! 🔥"

**Recommended Exercises**:
- List with reasons
- Click to start immediately

**Study Plan**:
- Suggested schedule
- Time allocations
- Skill focus areas

**Peer Comparison** (optional):
- Your rank in class: "Top 25%"
- Skills comparison chart
- Anonymous data

---

**TAB 7: Gamification**

**Active Goals**:
- Goal cards with progress
- Deadline countdowns
- Quick actions

**Badges**:
- Grid of all badges
- Earned (colored) vs Locked (gray)
- Click for details

**Leaderboard** (optional):
- Class ranking
- Points/Score based
- Anonymous or named

---

## 4. Charts & Visualizations

### 4.1. Chart Types Used

**Line Charts** (using Recharts):
```tsx
<LineChart data={scoreData}>
  <XAxis dataKey="date" />
  <YAxis domain={[0, 10]} />
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="reading" stroke="#3b82f6" />
  <Line type="monotone" dataKey="listening" stroke="#8b5cf6" />
  <Line type="monotone" dataKey="writing" stroke="#10b981" />
  <Line type="monotone" dataKey="speaking" stroke="#f59e0b" />
</LineChart>
```

**Bar Charts**:
```tsx
<BarChart data={weeklyData}>
  <XAxis dataKey="day" />
  <YAxis />
  <Tooltip />
  <Bar dataKey="hours" fill="#8b5cf6" />
</BarChart>
```

**Pie Charts**:
```tsx
<PieChart>
  <Pie
    data={skillDistribution}
    dataKey="percentage"
    nameKey="skill"
    cx="50%"
    cy="50%"
    outerRadius={80}
    label
  />
  <Tooltip />
</PieChart>
```

**Radar Charts**:
```tsx
<RadarChart data={skillScores}>
  <PolarGrid />
  <PolarAngleAxis dataKey="skill" />
  <PolarRadiusAxis domain={[0, 10]} />
  <Radar
    name="Current"
    dataKey="current"
    stroke="#3b82f6"
    fill="#3b82f6"
    fillOpacity={0.6}
  />
  <Radar
    name="Target"
    dataKey="target"
    stroke="#10b981"
    fill="none"
    strokeDasharray="5 5"
  />
</RadarChart>
```

---

## 5. Database Design

### 5.1. Table: user_statistics

**Mô tả**: Lưu thống kê tổng hợp của user

```sql
CREATE TABLE user_statistics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Practice stats
  total_exercises INTEGER DEFAULT 0,
  total_practice_time INTEGER DEFAULT 0,  -- Seconds
  average_score DECIMAL(5,2),
  
  -- By skill
  reading_exercises INTEGER DEFAULT 0,
  reading_avg_score DECIMAL(5,2),
  reading_time INTEGER DEFAULT 0,
  
  listening_exercises INTEGER DEFAULT 0,
  listening_avg_score DECIMAL(5,2),
  listening_time INTEGER DEFAULT 0,
  
  writing_exercises INTEGER DEFAULT 0,
  writing_avg_score DECIMAL(5,2),
  writing_time INTEGER DEFAULT 0,
  
  speaking_exercises INTEGER DEFAULT 0,
  speaking_avg_score DECIMAL(5,2),
  speaking_time INTEGER DEFAULT 0,
  
  -- Assignment stats
  total_assignments_completed INTEGER DEFAULT 0,
  avg_assignment_score DECIMAL(5,2),
  ontime_submission_rate DECIMAL(5,2),
  
  -- Exam stats
  total_mock_exams INTEGER DEFAULT 0,
  best_mock_exam_score DECIMAL(5,2),
  latest_mock_exam_score DECIMAL(5,2),
  
  -- Engagement
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_active_days INTEGER DEFAULT 0,
  last_active_at TIMESTAMP,
  
  -- Computed
  estimated_level VARCHAR(10),
    -- Based on performance
  
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Indexes
CREATE INDEX idx_user_statistics_user_id ON user_statistics(user_id);
```

---

### 5.2. Table: daily_activity

**Mô tả**: Lưu hoạt động theo ngày (for streak, calendar)

```sql
CREATE TABLE daily_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  
  -- Activity counts
  exercises_completed INTEGER DEFAULT 0,
  practice_time INTEGER DEFAULT 0,  -- Seconds
  assignments_submitted INTEGER DEFAULT 0,
  
  -- Active status
  is_active BOOLEAN DEFAULT TRUE,
    -- At least 1 activity
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, activity_date)
);

-- Indexes
CREATE INDEX idx_daily_activity_user_id ON daily_activity(user_id);
CREATE INDEX idx_daily_activity_date ON daily_activity(activity_date DESC);
```

---

### 5.3. Table: score_history

**Mô tả**: Lưu lịch sử điểm số theo thời gian

```sql
CREATE TABLE score_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  skill VARCHAR(20) NOT NULL,
    -- 'reading' | 'listening' | 'writing' | 'speaking'
  score DECIMAL(5,2) NOT NULL,
  
  exercise_id UUID REFERENCES exercises(id),
  submission_id UUID REFERENCES exercise_submissions(id),
  
  recorded_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_score_history_user_id ON score_history(user_id);
CREATE INDEX idx_score_history_skill ON score_history(skill);
CREATE INDEX idx_score_history_recorded_at ON score_history(recorded_at DESC);
```

---

## 6. API Endpoints

### 6.1. GET /api/statistics/overview

**Mô tả**: Lấy thống kê tổng quan

**Request**:
```typescript
GET /api/statistics/overview?period=30
Authorization: Bearer {token}
```

**Query Parameters**:
- `period`: Days to analyze (7|30|90|all)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalExercises": 156,
      "totalPracticeTime": 163800,  // Seconds (45.5h)
      "averageScore": 7.8,
      "currentStreak": 7,
      "longestStreak": 15
    },
    "trends": {
      "exercisesTrend": "+12",  // This week
      "timeTrend": "+5.2h",
      "scoreTrend": "+0.3",
      "streakStatus": "active"
    },
    "bySkill": {
      "reading": {
        "exercises": 45,
        "avgScore": 8.5,
        "totalTime": 55800,
        "improvement": "+0.5"
      },
      "listening": { /* ... */ },
      "writing": { /* ... */ },
      "speaking": { /* ... */ }
    },
    "recentActivity": [
      {
        "id": "uuid",
        "type": "exercise",
        "skill": "reading",
        "title": "Reading Full Test - Đề số 5",
        "score": 8.5,
        "timestamp": "2024-12-15T10:30:00Z"
      }
      // ... more activities
    ]
  }
}
```

---

### 6.2. GET /api/statistics/skill/:skill

**Mô tả**: Thống kê chi tiết cho 1 kỹ năng

**Request**:
```typescript
GET /api/statistics/skill/reading?period=30
Authorization: Bearer {token}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalExercises": 45,
      "avgScore": 8.5,
      "highestScore": 9.5,
      "totalTime": 55800
    },
    "scoreDistribution": {
      "0-3": 0,
      "3-5": 2,
      "5-7": 8,
      "7-9": 25,
      "9-10": 10
    },
    "scoreTrend": [
      {
        "date": "2024-12-01",
        "score": 7.8
      },
      {
        "date": "2024-12-08",
        "score": 8.2
      },
      {
        "date": "2024-12-15",
        "score": 8.5
      }
    ],
    "partAnalysis": {
      "part1": {
        "accuracy": 85,
        "exercises": 15,
        "avgTime": 720
      },
      "part2": {
        "accuracy": 75,
        "exercises": 15,
        "avgTime": 1080
      },
      "part3": {
        "accuracy": 82,
        "exercises": 15,
        "avgTime": 1500
      }
    },
    "weakestAreas": [
      {
        "area": "Main idea questions",
        "accuracy": 68,
        "count": 25
      },
      {
        "area": "Inference questions",
        "accuracy": 72,
        "count": 30
      }
    ],
    "recentExercises": [
      {
        "id": "uuid",
        "title": "Reading Full Test - Đề số 5",
        "type": "fulltest",
        "score": 8.5,
        "time": 3245,
        "date": "2024-12-15"
      }
    ]
  }
}
```

---

### 6.3. GET /api/statistics/time

**Mô tả**: Thống kê thời gian học tập

**Request**:
```typescript
GET /api/statistics/time?period=30
Authorization: Bearer {token}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalTime": 163800,
      "thisWeek": 29520,
      "dailyAvg": 4320,
      "mostProductiveDay": "Monday"
    },
    "bySkill": {
      "reading": {
        "time": 57330,
        "percentage": 35
      },
      "listening": { /* ... */ },
      "writing": { /* ... */ },
      "speaking": { /* ... */ }
    },
    "heatmap": [
      {
        "day": "Monday",
        "hour": 9,
        "minutes": 45
      },
      {
        "day": "Monday",
        "hour": 19,
        "minutes": 120
      }
      // ... more data points
    ],
    "weeklyActivity": [
      {
        "day": "Monday",
        "hours": 2.5
      },
      {
        "day": "Tuesday",
        "hours": 1.8
      }
      // ... rest of week
    ],
    "streak": {
      "current": 7,
      "longest": 15,
      "activeDays": 45,
      "totalDays": 90,
      "calendar": [
        {
          "date": "2024-12-01",
          "active": true
        }
        // ... 30 days
      ]
    }
  }
}
```

---

### 6.4. GET /api/statistics/recommendations

**Mô tả**: Lấy gợi ý cá nhân hóa

**Request**:
```typescript
GET /api/statistics/recommendations
Authorization: Bearer {token}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "insights": [
      {
        "type": "improvement",
        "message": "Your Reading score improved 15% this month 📈",
        "icon": "trending-up"
      },
      {
        "type": "productivity",
        "message": "You study best on Monday mornings ⏰",
        "icon": "clock"
      },
      {
        "type": "weakness",
        "message": "Writing is your weakest skill - focus here 📝",
        "icon": "alert"
      }
    ],
    "recommendedExercises": [
      {
        "exerciseId": "uuid",
        "title": "Listening Part 3 Practice",
        "reason": "Your Part 3 accuracy is 65%",
        "skill": "listening",
        "level": "B2"
      }
    ],
    "studyPlan": {
      "dailyGoal": "1-2 hours",
      "schedule": {
        "Monday": ["Reading", "Listening"],
        "Tuesday": ["Writing", "Speaking"],
        "Wednesday": ["Reading", "Listening"],
        "Thursday": ["Writing", "Speaking"],
        "Friday": ["Reading", "Listening"],
        "Saturday": ["Mock Exam"],
        "Sunday": ["Review"]
      },
      "focusAreas": [
        "Listening Part 3",
        "Writing Task 2",
        "Speaking Pronunciation"
      ]
    },
    "peerComparison": {
      "rank": "Top 25%",
      "classSize": 25,
      "yourPosition": 6,
      "skillComparison": {
        "reading": "Above average",
        "listening": "Average",
        "writing": "Below average",
        "speaking": "Average"
      }
    }
  }
}
```

---

## 7. Analytics Calculations

### 7.1. Score Calculations

**Average Score**:
```typescript
avgScore = SUM(scores) / COUNT(exercises)
```

**Weighted Average** (if needed):
```typescript
// Weight by exercise difficulty
weightedAvg = SUM(score * weight) / SUM(weight)
```

**Improvement Rate**:
```typescript
improvement = (currentPeriodAvg - previousPeriodAvg) / previousPeriodAvg * 100
```

---

### 7.2. Streak Calculations

**Current Streak**:
```typescript
// Count consecutive days with activity
let streak = 0;
let currentDate = today;

while (hasActivityOn(currentDate)) {
  streak++;
  currentDate = previousDay(currentDate);
}

return streak;
```

**Longest Streak**:
```typescript
// Find longest sequence of active days
let longest = 0;
let current = 0;

for each day in history {
  if (day.isActive) {
    current++;
    longest = max(longest, current);
  } else {
    current = 0;
  }
}

return longest;
```

---

### 7.3. Trend Analysis

**Simple Moving Average** (7-day):
```typescript
SMA(date) = AVG(scores from date-6 to date)
```

**Trend Direction**:
```typescript
// Linear regression
trend = (recentAvg - oldAvg) / timeSpan

if (trend > 0.1) return "improving";
if (trend < -0.1) return "declining";
return "stable";
```

---

### 7.4. Recommendations Algorithm

**Weak Area Detection**:
```typescript
weakAreas = skills.filter(skill => 
  skill.avgScore < overallAvg - 0.5 ||
  skill.avgScore < 7.0
);

recommendedExercises = findExercises({
  skill: weakAreas[0].name,
  level: user.currentLevel,
  type: weakAreas[0].weakestPart
});
```

**Study Time Recommendation**:
```typescript
// Based on target score and current performance
timeNeeded = (targetScore - currentScore) * 10; // hours per point
dailyTime = timeNeeded / daysUntilExam;

return Math.max(1, Math.min(3, dailyTime)); // 1-3 hours/day
```

---

## Kết thúc Module Statistics & Analytics

Module này tích hợp với:
- Module 02: Practice & Learning (data source: exercises)
- Module 03: Exam System (data source: mock exams)
- Module 07: Assignment Management (data source: assignments)
- Module 12: Achievements (goals & badges)
- Module 20: Notification (insights & reminders)

Module Statistics là nền tảng cho việc theo dõi tiến độ và cung cấp insights giúp học viên cải thiện hiệu quả học tập.

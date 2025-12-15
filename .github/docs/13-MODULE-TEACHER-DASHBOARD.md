# 👨‍🏫 Module 13: Teacher Dashboard

> **Dashboard trang chủ cho giáo viên**
> 
> File: `13-MODULE-TEACHER-DASHBOARD.md`  
> Version: 1.0  
> Last Updated: 15/12/2024

---

## 📑 Mục lục

- [1. Giới thiệu module](#1-giới-thiệu-module)
- [2. Dashboard Components](#2-dashboard-components)
- [3. Phân tích màn hình UI](#3-phân-tích-màn-hình-ui)

---

## 1. Giới thiệu module

### 1.1. Mục đích
Teacher Dashboard cung cấp:
- Tổng quan lớp học
- Pending tasks (grading, attendance)
- Class schedule overview
- Student performance summary
- Quick access to teaching tools

### 1.2. Key Features

**Class Overview**:
- Total students
- Active classes
- Upcoming sessions
- Attendance rate

**Pending Tasks**:
- Assignments to grade
- Attendance to mark
- Materials to upload
- Announcements pending

**Performance Tracking**:
- Class average scores
- Student progress
- Struggling students
- Top performers

**Quick Actions**:
- Create assignment
- Mark attendance
- Upload material
- Schedule class
- Send announcement

---

## 2. Dashboard Components

### 2.1. Welcome Section

```tsx
<WelcomeSection>
  <Greeting>Welcome back, Teacher {name}!</Greeting>
  <Stats>
    <Stat>
      <Icon>👥</Icon>
      <Value>156</Value>
      <Label>Total Students</Label>
    </Stat>
    <Stat>
      <Icon>📚</Icon>
      <Value>5</Value>
      <Label>Active Classes</Label>
    </Stat>
    <Stat>
      <Icon>📝</Icon>
      <Value>12</Value>
      <Label>Pending Grading</Label>
    </Stat>
  </Stats>
</WelcomeSection>
```

---

### 2.2. Classes Overview

```tsx
<ClassesGrid>
  <ClassCard>
    <Header>
      <ClassName>VSTEP B2 - Evening Class</ClassName>
      <Level>B2</Level>
    </Header>
    <Stats>
      <Students>28 students</Students>
      <NextSession>Next: Today 7:00 PM</NextSession>
      <Attendance>Attendance: 92%</Attendance>
    </Stats>
    <QuickActions>
      <Button>View Class</Button>
      <Button>Mark Attendance</Button>
      <Button>Create Assignment</Button>
    </QuickActions>
  </ClassCard>
  {/* More class cards */}
</ClassesGrid>
```

---

### 2.3. Pending Tasks

```tsx
<PendingTasks>
  <Header>
    <Title>📋 Pending Tasks</Title>
    <Badge>{totalPendingCount}</Badge>
  </Header>
  
  <TaskSection>
    <SectionTitle>Assignments to Grade ({12})</SectionTitle>
    <TaskList>
      <TaskItem urgent>
        <Info>
          <Student>Nguyễn Văn A</Student>
          <Assignment>Reading Week 1</Assignment>
          <Submitted>Submitted 2 days ago</Submitted>
        </Info>
        <Action>
          <Button>Grade Now</Button>
        </Action>
      </TaskItem>
      {/* More tasks */}
    </TaskList>
  </TaskSection>
  
  <TaskSection>
    <SectionTitle>Attendance to Mark ({3})</SectionTitle>
    <TaskList>
      <TaskItem>
        <Info>
          <Class>VSTEP B2 - Morning</Class>
          <Date>Dec 14, 2024</Date>
        </Info>
        <Action>
          <Button>Mark Attendance</Button>
        </Action>
      </TaskItem>
    </TaskList>
  </TaskSection>
</PendingTasks>
```

---

### 2.4. Today's Schedule

```tsx
<TodaySchedule>
  <Header>📅 Today's Schedule</Header>
  <SessionList>
    <Session upcoming>
      <Time>7:00 PM - 9:00 PM</Time>
      <Class>VSTEP B2 - Evening Class</Class>
      <Students>28 students</Students>
      <Actions>
        <Button>Join Zoom</Button>
        <Button>View Materials</Button>
      </Actions>
    </Session>
    <Session>
      <Time>9:00 PM - 10:00 PM</Time>
      <Class>Office Hours</Class>
      <Note>Available for student questions</Note>
    </Session>
  </SessionList>
</TodaySchedule>
```

---

### 2.5. Student Performance Overview

```tsx
<PerformanceOverview>
  <Header>📊 Student Performance</Header>
  
  <ClassSelector>
    <Select>
      <Option>All Classes</Option>
      <Option>VSTEP B2 - Evening</Option>
      <Option>VSTEP B2 - Morning</Option>
    </Select>
  </ClassSelector>
  
  <StatsGrid>
    <StatCard>
      <Label>Class Average</Label>
      <Value>7.5/10</Value>
      <Trend up>+0.3 vs last month</Trend>
    </StatCard>
    
    <StatCard>
      <Label>Completion Rate</Label>
      <Value>85%</Value>
      <Trend up>+5% vs last month</Trend>
    </StatCard>
    
    <StatCard>
      <Label>Struggling Students</Label>
      <Value>5</Value>
      <Link>View list →</Link>
    </StatCard>
    
    <StatCard>
      <Label>Top Performers</Label>
      <Value>12</Value>
      <Link>View list →</Link>
    </StatCard>
  </StatsGrid>
  
  <PerformanceChart>
    <LineChart data={classAverageOverTime} />
  </PerformanceChart>
</PerformanceOverview>
```

---

### 2.6. Recent Activity

```tsx
<RecentActivity>
  <Header>🕐 Recent Activity</Header>
  <ActivityList>
    <Activity>
      <Icon>📝</Icon>
      <Content>
        <Student>Nguyễn Văn A</Student>
        <Action>submitted Reading Assignment</Action>
        <Time>5 minutes ago</Time>
      </Content>
    </Activity>
    
    <Activity>
      <Icon>💬</Icon>
      <Content>
        <Student>Trần Thị B</Student>
        <Action>asked a question in Class Forum</Action>
        <Time>30 minutes ago</Time>
      </Content>
    </Activity>
    
    <Activity>
      <Icon>✅</Icon>
      <Content>
        <Student>Lê Văn C</Student>
        <Action>completed Mock Exam with score 8.5</Action>
        <Time>2 hours ago</Time>
      </Content>
    </Activity>
  </ActivityList>
  <ViewAll>View all activity →</ViewAll>
</RecentActivity>
```

---

### 2.7. Quick Actions Panel

```tsx
<QuickActions>
  <Title>Quick Actions</Title>
  <ActionGrid>
    <Action primary>
      <Icon>📝</Icon>
      <Label>Create Assignment</Label>
    </Action>
    
    <Action>
      <Icon>✓</Icon>
      <Label>Mark Attendance</Label>
    </Action>
    
    <Action>
      <Icon>📄</Icon>
      <Label>Upload Material</Label>
    </Action>
    
    <Action>
      <Icon>📅</Icon>
      <Label>Schedule Class</Label>
    </Action>
    
    <Action>
      <Icon>📢</Icon>
      <Label>Send Announcement</Label>
    </Action>
    
    <Action>
      <Icon>📊</Icon>
      <Label>View Reports</Label>
    </Action>
  </ActionGrid>
</QuickActions>
```

---

## 3. Phân tích màn hình UI

### 3.1. Teacher Dashboard Page

**File**: `/components/teacher/DashboardPage.tsx`

**Layout**:
```
┌─────────────────────────────────────────────────┐
│  Welcome back, Teacher John!                     │
│  👥 156 Students | 📚 5 Classes | 📝 12 Pending │
└─────────────────────────────────────────────────┘

┌──────────────────────┬──────────────────────────┐
│  My Classes (Grid)   │  📋 Pending Tasks        │
│  ┌────────────────┐  │  • Grade 12 assignments  │
│  │ VSTEP B2 Eve   │  │  • Mark 3 attendances    │
│  │ 28 students    │  │  • Upload 2 materials    │
│  │ Next: 7:00 PM  │  │                          │
│  └────────────────┘  │                          │
│  ┌────────────────┐  │                          │
│  │ VSTEP B2 Morn  │  │                          │
│  │ 25 students    │  │                          │
│  └────────────────┘  │                          │
└──────────────────────┴──────────────────────────┘

┌──────────────────────┬──────────────────────────┐
│  📅 Today's Schedule │  🕐 Recent Activity      │
│  7:00 PM - Evening   │  • Nguyễn Văn A          │
│  [Join Zoom]         │    submitted assignment  │
│                      │  • Trần Thị B            │
│  9:00 PM - Office    │    asked question        │
│  Hours               │                          │
└──────────────────────┴──────────────────────────┘

┌─────────────────────────────────────────────────┐
│  📊 Student Performance                         │
│  Class Avg: 7.5 | Completion: 85%              │
│  [Performance Chart]                            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Quick Actions                                   │
│  [📝 Assignment] [✓ Attendance] [📄 Material]  │
└─────────────────────────────────────────────────┘
```

---

## API Endpoints

### GET /api/dashboard/teacher

**Request**:
```typescript
GET /api/dashboard/teacher
Authorization: Bearer {token}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "teacher": {
      "id": "uuid",
      "fullName": "John Doe",
      "avatar": "https://..."
    },
    "stats": {
      "totalStudents": 156,
      "activeClasses": 5,
      "pendingGrading": 12,
      "pendingAttendance": 3
    },
    "classes": [
      {
        "id": "uuid",
        "name": "VSTEP B2 - Evening Class",
        "level": "B2",
        "studentCount": 28,
        "nextSession": "2024-12-15T19:00:00Z",
        "attendanceRate": 92,
        "avgScore": 7.5
      }
    ],
    "pendingTasks": {
      "assignmentsToGrade": [
        {
          "id": "uuid",
          "studentName": "Nguyễn Văn A",
          "assignmentTitle": "Reading Week 1",
          "submittedAt": "2024-12-13T10:00:00Z",
          "daysAgo": 2
        }
      ],
      "attendanceToMark": [
        {
          "id": "uuid",
          "className": "VSTEP B2 - Morning",
          "sessionDate": "2024-12-14",
          "studentCount": 25
        }
      ]
    },
    "todaySchedule": [
      {
        "id": "uuid",
        "className": "VSTEP B2 - Evening Class",
        "startTime": "2024-12-15T19:00:00Z",
        "endTime": "2024-12-15T21:00:00Z",
        "studentCount": 28,
        "zoomLink": "https://zoom.us/..."
      }
    ],
    "recentActivity": [
      {
        "type": "assignment_submitted",
        "studentName": "Nguyễn Văn A",
        "action": "submitted Reading Assignment",
        "timestamp": "2024-12-15T10:00:00Z"
      }
    ],
    "performance": {
      "classAverage": 7.5,
      "completionRate": 85,
      "strugglingStudents": 5,
      "topPerformers": 12,
      "trend": {
        "direction": "up",
        "change": 0.3
      }
    }
  }
}
```

---

## Kết thúc Module Teacher Dashboard

Dashboard giúp giáo viên quản lý lớp học hiệu quả, tích hợp với:
- Module 06: Class Management
- Module 07: Assignment Management
- Module 14: Attendance
- Module 15: Schedule Management

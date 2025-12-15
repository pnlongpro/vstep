# 🎓 Module 09: Student Dashboard

> **Dashboard trang chủ cho học viên**
> 
> File: `09-MODULE-STUDENT-DASHBOARD.md`  
> Version: 1.0  
> Last Updated: 15/12/2024

---

## 📑 Mục lục

- [1. Giới thiệu module](#1-giới-thiệu-module)
- [2. Dashboard Components](#2-dashboard-components)
- [3. Phân tích màn hình UI](#3-phân-tích-màn-hình-ui)
- [4. Widget System](#4-widget-system)

---

## 1. Giới thiệu module

### 1.1. Mục đích
Student Dashboard là trang chủ sau khi đăng nhập, hiển thị:
- Tổng quan học tập
- Quick actions
- Recent activities
- Upcoming deadlines
- Progress summary
- Recommended content

### 1.2. Key Features

**Overview Cards**:
- Practice summary
- Assignment status
- Class enrollment
- Study streak
- Achievements

**Quick Access**:
- Start practice
- View assignments
- Join class
- Take mock exam

**Recent Activity**:
- Last exercises
- Recent submissions
- Class updates
- Notifications

**Progress Tracking**:
- Learning goals
- Skill progress
- Time spent
- Score trends

---

## 2. Dashboard Components

### 2.1. Welcome Banner

```tsx
<WelcomeBanner>
  <Greeting>Good morning, {userName}! 👋</Greeting>
  <Subtitle>Ready to continue your VSTEP journey?</Subtitle>
  <QuickStats>
    <Stat icon={Flame}>7 day streak 🔥</Stat>
    <Stat icon={Target}>3 goals active</Stat>
    <Stat icon={Trophy}>12 badges earned</Stat>
  </QuickStats>
</WelcomeBanner>
```

**Display**:
- Time-based greeting (Morning/Afternoon/Evening)
- User name
- Motivational message
- Current streak
- Active goals count
- Total badges

---

### 2.2. Stats Overview Cards

**4 Main Cards**:

**1. Practice Progress**:
- Total exercises: 156
- This week: +12
- Avg score: 7.8/10
- Trend: ↗ +0.3
- Button: "Practice Now"

**2. Assignments**:
- Pending: 3 assignments
- Due soon: 1 (tomorrow)
- Completed: 8/11
- Button: "View All"

**3. Classes**:
- Enrolled: 2 classes
- Next session: Today 7:00 PM
- Attendance: 92%
- Button: "My Classes"

**4. Mock Exams**:
- Completed: 5 exams
- Latest score: 7.5/10
- Next available: Now
- Button: "Take Exam"

---

### 2.3. Upcoming Section

**Assignment Deadlines**:
```tsx
<UpcomingCard>
  <Header>📋 Upcoming Assignments</Header>
  <List>
    <Item urgent>
      <Title>Reading Week 1</Title>
      <DueDate>Due in 5 hours</DueDate>
      <Progress>Not started</Progress>
    </Item>
    <Item warning>
      <Title>Listening Practice</Title>
      <DueDate>Due tomorrow</DueDate>
      <Progress>In progress (50%)</Progress>
    </Item>
  </List>
  <ViewAll>View all assignments →</ViewAll>
</UpcomingCard>
```

**Class Schedule**:
```tsx
<ScheduleCard>
  <Header>📅 Next Class Session</Header>
  <ClassItem>
    <ClassName>VSTEP B2 - Evening Class</ClassName>
    <Time>Today, 7:00 PM - 9:00 PM</Time>
    <Teacher>Teacher: Nguyễn Văn A</Teacher>
    <Location>Zoom Link</Location>
    <Button>Join Class</Button>
  </ClassItem>
</ScheduleCard>
```

---

### 2.4. Recent Activity

```tsx
<RecentActivity>
  <Header>🕐 Recent Activity</Header>
  <Timeline>
    <Event>
      <Icon skill="reading" />
      <Content>
        <Action>Completed Reading Full Test</Action>
        <Score>Score: 8.5/10</Score>
        <Time>2 hours ago</Time>
      </Content>
    </Event>
    <Event>
      <Icon type="assignment" />
      <Content>
        <Action>Submitted Listening Assignment</Action>
        <Status>Waiting for grading</Status>
        <Time>5 hours ago</Time>
      </Content>
    </Event>
    <Event>
      <Icon type="badge" />
      <Content>
        <Action>Unlocked "7 Day Streak" badge!</Action>
        <Time>1 day ago</Time>
      </Content>
    </Event>
  </Timeline>
  <ViewAll>View all activity →</ViewAll>
</RecentActivity>
```

---

### 2.5. Progress Dashboard

**Skill Progress Bars**:
```tsx
<SkillProgress>
  <Header>📊 Your Progress</Header>
  <Skills>
    <Skill>
      <Name>Reading</Name>
      <ProgressBar value={85} color="blue" />
      <Stats>
        <Exercises>45 exercises</Exercises>
        <Score>Avg: 8.5/10</Score>
      </Stats>
    </Skill>
    <Skill>
      <Name>Listening</Name>
      <ProgressBar value={70} color="purple" />
      <Stats>
        <Exercises>35 exercises</Exercises>
        <Score>Avg: 7.0/10</Score>
      </Stats>
    </Skill>
    <Skill>
      <Name>Writing</Name>
      <ProgressBar value={60} color="green" />
      <Stats>
        <Exercises>20 exercises</Exercises>
        <Score>Avg: 7.5/10</Score>
      </Stats>
    </Skill>
    <Skill>
      <Name>Speaking</Name>
      <ProgressBar value={55} color="orange" />
      <Stats>
        <Exercises>18 exercises</Exercises>
        <Score>Avg: 7.0/10</Score>
      </Stats>
    </Skill>
  </Skills>
</SkillProgress>
```

**Study Time Chart**:
```tsx
<StudyTimeChart>
  <Header>⏱️ Study Time This Week</Header>
  <BarChart data={weeklyStudyTime} />
  <Summary>
    <Total>Total: 8.5 hours</Total>
    <Daily>Daily avg: 1.2 hours</Daily>
    <Goal>Goal: 10 hours/week</Goal>
  </Summary>
</StudyTimeChart>
```

---

### 2.6. Recommendations

```tsx
<Recommendations>
  <Header>💡 Recommended for You</Header>
  
  <Section>
    <Title>Practice Suggestions</Title>
    <Card>
      <Icon>📚</Icon>
      <Content>
        <Title>Listening Part 3 Practice</Title>
        <Reason>Your accuracy is 65% - needs improvement</Reason>
        <Button>Start Practice</Button>
      </Content>
    </Card>
  </Section>
  
  <Section>
    <Title>Study Plan</Title>
    <Card>
      <Icon>🎯</Icon>
      <Content>
        <Title>Focus on Writing This Week</Title>
        <Reason>Lowest skill score (7.0/10)</Reason>
        <Button>View Plan</Button>
      </Content>
    </Card>
  </Section>
</Recommendations>
```

---

### 2.7. Quick Actions

```tsx
<QuickActions>
  <ActionButton primary>
    <Icon>📝</Icon>
    <Label>Start Practice</Label>
  </ActionButton>
  
  <ActionButton>
    <Icon>🎯</Icon>
    <Label>Take Mock Exam</Label>
  </ActionButton>
  
  <ActionButton>
    <Icon>📚</Icon>
    <Label>My Assignments</Label>
  </ActionButton>
  
  <ActionButton>
    <Icon>👥</Icon>
    <Label>My Classes</Label>
  </ActionButton>
  
  <ActionButton>
    <Icon>📊</Icon>
    <Label>View Statistics</Label>
  </ActionButton>
</QuickActions>
```

---

## 3. Phân tích màn hình UI

### 3.1. Student Dashboard Page

**File**: `/components/student/DashboardPage.tsx`

**Layout**:
```
┌─────────────────────────────────────────────────┐
│  Welcome Banner                                  │
│  Good morning, John! 👋                         │
│  7 day streak 🔥 | 3 goals | 12 badges         │
└─────────────────────────────────────────────────┘

┌──────────┬──────────┬──────────┬──────────┐
│ Practice │Assignments│ Classes  │Mock Exams│
│   156    │    3     │    2     │    5     │
│   +12    │Due soon:1│Next:Today│Latest:7.5│
└──────────┴──────────┴──────────┴──────────┘

┌─────────────────────┬─────────────────────────┐
│  📋 Upcoming        │  📅 Next Class          │
│  Assignments        │                         │
│  • Reading Week 1   │  VSTEP B2 - Evening     │
│    Due in 5 hours   │  Today, 7:00 PM         │
│  • Listening        │  [Join Class]           │
│    Due tomorrow     │                         │
└─────────────────────┴─────────────────────────┘

┌─────────────────────┬─────────────────────────┐
│  🕐 Recent Activity │  📊 Your Progress       │
│  • Completed        │  Reading    ████████░░  │
│    Reading Test     │  Listening  ███████░░░  │
│    2 hours ago      │  Writing    ██████░░░░  │
│  • Submitted        │  Speaking   █████░░░░░  │
│    Assignment       │                         │
└─────────────────────┴─────────────────────────┘

┌─────────────────────────────────────────────────┐
│  💡 Recommended for You                         │
│  📚 Practice Listening Part 3                   │
│  🎯 Focus on Writing This Week                  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Quick Actions                                   │
│  [📝 Practice] [🎯 Mock Exam] [📚 Assignments] │
└─────────────────────────────────────────────────┘
```

**Responsive**:
- Desktop: 2-3 column grid
- Tablet: 2 column
- Mobile: Single column stack

---

## 4. Widget System

### 4.1. Customizable Dashboard

**Future Feature**: Allow users to customize dashboard

**Widget Types**:
1. Stats Cards
2. Recent Activity
3. Upcoming Deadlines
4. Study Time Chart
5. Skill Progress
6. Goals Tracker
7. Achievements Showcase
8. Leaderboard (optional)

**Customization**:
- Drag & drop to reorder
- Show/hide widgets
- Resize widgets
- Save layout preference

---

## API Endpoints

### GET /api/dashboard/student

**Request**:
```typescript
GET /api/dashboard/student
Authorization: Bearer {token}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "fullName": "John Doe",
      "avatar": "https://...",
      "currentStreak": 7,
      "activeGoals": 3,
      "totalBadges": 12
    },
    "stats": {
      "totalExercises": 156,
      "exercisesThisWeek": 12,
      "avgScore": 7.8,
      "pendingAssignments": 3,
      "enrolledClasses": 2,
      "mockExamsCompleted": 5
    },
    "upcoming": {
      "assignments": [
        {
          "id": "uuid",
          "title": "Reading Week 1",
          "dueDate": "2024-12-16T23:59:00Z",
          "hoursUntilDue": 5,
          "status": "not_started"
        }
      ],
      "nextClass": {
        "id": "uuid",
        "className": "VSTEP B2 - Evening Class",
        "startTime": "2024-12-15T19:00:00Z",
        "teacher": "Nguyễn Văn A",
        "zoomLink": "https://zoom.us/..."
      }
    },
    "recentActivity": [
      {
        "type": "exercise_completed",
        "skill": "reading",
        "title": "Reading Full Test",
        "score": 8.5,
        "timestamp": "2024-12-15T08:00:00Z"
      }
    ],
    "progress": {
      "reading": {
        "exercises": 45,
        "avgScore": 8.5,
        "progress": 85
      },
      "listening": {
        "exercises": 35,
        "avgScore": 7.0,
        "progress": 70
      },
      "writing": {
        "exercises": 20,
        "avgScore": 7.5,
        "progress": 60
      },
      "speaking": {
        "exercises": 18,
        "avgScore": 7.0,
        "progress": 55
      }
    },
    "recommendations": [
      {
        "type": "practice",
        "skill": "listening",
        "part": 3,
        "reason": "Your accuracy is 65% - needs improvement",
        "actionUrl": "/practice/listening?part=3"
      }
    ]
  }
}
```

---

## Kết thúc Module Student Dashboard

Dashboard là điểm bắt đầu cho student journey, tích hợp với:
- Module 02: Practice & Learning
- Module 03: Exam System
- Module 07: Assignment Management
- Module 06: Class Management
- Module 19: Statistics
- Module 12: Achievements

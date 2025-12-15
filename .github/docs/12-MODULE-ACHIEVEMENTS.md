# 🏆 Module 12: Achievements (Badges & Goals)

> **Module hệ thống huy hiệu và mục tiêu**
> 
> File: `12-MODULE-ACHIEVEMENTS.md`  
> Version: 1.0  
> Last Updated: 15/12/2024

---

## 📑 Mục lục

- [1. Badge System](#1-badge-system)
- [2. Goal System](#2-goal-system)
- [3. Database Design](#3-database-design)
- [4. API Endpoints](#4-api-endpoints)

---

## 1. Badge System

### 1.1. Badge Categories

**Practice Badges**:
- First Steps: Hoàn thành bài tập đầu tiên
- Perfect Score: Đạt điểm tuyệt đối (10/10)
- Speed Demon: Hoàn thành nhanh hơn thời gian quy định
- Marathon Runner: Hoàn thành 100 bài tập
- Master: Điểm trung bình >= 9.0 trong 20 bài

**Skill Badges**:
- Reading Master: 50 bài Reading với avg >= 8.0
- Listening Pro: 50 bài Listening với avg >= 8.0
- Writing Expert: 30 bài Writing với avg >= 7.5
- Speaking Champion: 30 bài Speaking với avg >= 7.5

**Streak Badges**:
- Consistent Learner: Học 7 ngày liên tiếp
- Dedicated Student: Học 30 ngày liên tiếp
- Ultimate Learner: Học 100 ngày liên tiếp

**Time Badges**:
- Night Owl: Học sau 22h (10 lần)
- Early Bird: Học trước 6h (10 lần)
- Weekend Warrior: Học cuối tuần (10 lần)

**Achievement Badges**:
- All-Rounder: Hoàn thành ít nhất 20 bài mỗi skill
- Exam Master: Hoàn thành 10 mock exams
- Certificate Collector: Đạt 5 certificates

### 1.2. Badge Structure

```typescript
interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;  // Icon name or image URL
  category: 'practice' | 'skill' | 'streak' | 'time' | 'achievement';
  criteria: BadgeCriteria;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;  // Gamification points
}

interface BadgeCriteria {
  type: 'exercise_count' | 'score_average' | 'streak' | 'time_of_day' | 'custom';
  condition: {
    exerciseCount?: number;
    avgScore?: number;
    streakDays?: number;
    timeRange?: [number, number];  // [startHour, endHour]
    customCheck?: (user: User) => boolean;
  };
}
```

### 1.3. Badge Unlocking Logic

```typescript
async function checkBadgeUnlock(userId: string, activityType: string) {
  const user = await getUser(userId);
  const userStats = await getUserStats(userId);
  
  // Get all badges not yet earned
  const availableBadges = await getAvailableBadges(userId);
  
  for (const badge of availableBadges) {
    if (await meetsC riteria(userStats, badge.criteria)) {
      // Unlock badge
      await unlockBadge(userId, badge.id);
      
      // Send notification
      await createNotification({
        userId,
        type: 'badge_unlocked',
        title: `🎉 Huy hiệu mới: ${badge.name}!`,
        message: badge.description,
        actionUrl: `/achievements`
      });
      
      // Show modal (frontend)
      emitBadgeUnlock(userId, badge);
    }
  }
}
```

---

## 2. Goal System

### 2.1. Goal Types

**Predefined Goals**:
- Complete 20 Reading exercises this month
- Achieve average score 8.0 in Listening
- Study 7 days in a row
- Finish 1 mock exam this week

**Custom Goals**:
- User-defined targets
- Flexible metrics
- Personal deadlines

### 2.2. Goal Structure

```typescript
interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'exercise_count' | 'avg_score' | 'streak' | 'mock_exam' | 'custom';
  
  // Target
  targetValue: number;
  currentValue: number;
  
  // Timeline
  startDate: Date;
  endDate: Date;
  
  // Status
  status: 'active' | 'completed' | 'failed' | 'abandoned';
  completedAt?: Date;
  
  // Progress
  progress: number;  // 0-100%
}
```

### 2.3. Goal Progress Tracking

```typescript
async function updateGoalProgress(userId: string, activity: Activity) {
  const activeGoals = await getActiveGoals(userId);
  
  for (const goal of activeGoals) {
    const newProgress = calculateProgress(goal, activity);
    
    await updateGoal(goal.id, {
      currentValue: newProgress.current,
      progress: newProgress.percentage
    });
    
    // Check completion
    if (newProgress.percentage >= 100) {
      await completeGoal(goal.id);
      
      // Notify user
      await createNotification({
        userId,
        type: 'goal_achieved',
        title: `✅ Hoàn thành mục tiêu: ${goal.title}!`,
        message: goal.description
      });
    }
  }
}
```

---

## 3. Database Design

### 3.1. Table: badges

```sql
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  category VARCHAR(50),
  criteria JSONB NOT NULL,
  rarity VARCHAR(20) DEFAULT 'common',
  points INTEGER DEFAULT 10,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3.2. Table: user_badges

```sql
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id),
  unlocked_at TIMESTAMP DEFAULT NOW(),
  progress JSONB,
  
  UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
```

### 3.3. Table: goals

```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL,
  target_value DECIMAL(10,2) NOT NULL,
  current_value DECIMAL(10,2) DEFAULT 0,
  start_date TIMESTAMP DEFAULT NOW(),
  end_date TIMESTAMP NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_status ON goals(status);
```

---

## 4. API Endpoints

### 4.1. GET /api/badges

**Response**:
```json
{
  "success": true,
  "data": {
    "earned": [
      {
        "id": "badge-1",
        "name": "First Steps",
        "description": "Hoàn thành bài tập đầu tiên",
        "icon": "🎯",
        "unlockedAt": "2024-12-01T10:00:00Z"
      }
    ],
    "available": [
      {
        "id": "badge-2",
        "name": "Perfect Score",
        "description": "Đạt điểm 10/10",
        "icon": "⭐",
        "progress": 0
      }
    ]
  }
}
```

### 4.2. GET /api/goals

**Response**:
```json
{
  "success": true,
  "data": {
    "active": [
      {
        "id": "goal-1",
        "title": "Complete 20 Reading exercises",
        "currentValue": 15,
        "targetValue": 20,
        "progress": 75,
        "endDate": "2024-12-31"
      }
    ],
    "completed": []
  }
}
```

### 4.3. POST /api/goals

**Request**:
```json
{
  "title": "Achieve 8.0 average",
  "type": "avg_score",
  "targetValue": 8.0,
  "endDate": "2024-12-31"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "goalId": "uuid",
    "title": "Achieve 8.0 average",
    "status": "active"
  }
}
```

---

## Kết thúc Module Achievements

Module này tạo động lực học tập thông qua badges và goals, tích hợp với Module 02 (Practice), Module 19 (Statistics).

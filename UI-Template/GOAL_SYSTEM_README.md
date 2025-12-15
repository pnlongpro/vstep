# 🎯 HỆ THỐNG ĐẶT MỤC TIÊU HỌC TẬP (GOALS) - VSTEPRO

## 📋 TỔNG QUAN

Hệ thống đặt mục tiêu học tập giúp học viên tự thiết lập các mục tiêu cá nhân (ngày/tuần/tháng) và theo dõi tiến độ thực hiện. Tính năng này tăng động lực và kỷ luật học tập.

## 🎯 CÁC LOẠI MỤC TIÊU

### 1. Theo kỹ năng (Skill-based Goals)
- **Listening hàng ngày**: 1 bài/ngày
- **Reading đều đặn**: 1 bài/ngày  
- **Writing mỗi tuần**: 2 bài/tuần
- **Speaking mỗi tuần**: 1 buổi/tuần

### 2. Theo số lượng đề (Quantity-based Goals)
- **Hoàn thành đề trong tuần**: 5 đề/tuần
- **Hoàn thành đề trong tháng**: 20 đề/tháng

### 3. Theo thời gian học (Time-based Goals)
- **Học đều đặn mỗi ngày**: 30 phút/ngày
- **Đạt giờ học mỗi tuần**: 2 giờ/tuần

### 4. Chuỗi ngày học (Streak Goals)
- **Giữ nhịp học tập**: Học liên tục 3 ngày
- **Kỷ luật cao**: Học liên tục 7 ngày

### 5. Theo điểm số (Score-based Goals)
- **Nâng cao Listening**: Đạt điểm ≥70%
- **Nâng cao Reading**: Đạt điểm ≥80%

## 🛠️ CÁC COMPONENT

### 1. GoalCard.tsx
Hiển thị từng mục tiêu với tiến độ
- **Props**: goal, onDelete, size
- **Features**:
  - Progress bar động
  - Status completed/active
  - Delete button (hover)
  - Period badge (daily/weekly/monthly)

### 2. GoalSettingModal.tsx
Modal đặt mục tiêu mới (2-step wizard)
- **Step 1**: Chọn loại mục tiêu (5 categories)
- **Step 2**: Chọn template cụ thể
- **Features**:
  - Progress steps indicator
  - Template cards với examples
  - Back navigation
  - Custom goal option (coming soon)

### 3. GoalAchievedModal.tsx
Modal celebration khi đạt mục tiêu
- **Features**:
  - Confetti animation
  - Goal summary
  - Mini stats (mục tiêu đạt, tiến độ 100%, +1 thành tích)
  - CTA button

### 4. Goals.tsx
Trang chính quản lý mục tiêu
- **Features**:
  - Overall progress bar
  - Quick stats dashboard
  - Tabs filter (Tất cả, Hôm nay, Tuần này, Đã hoàn thành)
  - Goals grid
  - Empty states
  - Tips section

## 📂 UTILITY FILES

### `/utils/goalService.ts`
Core service quản lý goals

**Main Functions:**

```typescript
// Create a new goal
createGoal(type, targetValue, period, title, description, skill?, icon?, color?, unit?): Goal

// Update goal progress
updateGoalProgress(goalId, incrementBy?): Goal | null

// Delete a goal
deleteGoal(goalId): void

// Auto-reset goals based on period (daily/weekly/monthly)
resetGoalsIfNeeded(): void

// Auto-update goals when completing exercises
autoUpdateGoals(skill, studyTime?, score?): Goal[]

// Get goals filtered by status/type/period
getUserGoals(): Goal[]
getActiveGoals(): Goal[]
getCompletedGoals(): Goal[]
getTodayGoals(): Goal[]
getWeeklyGoals(): Goal[]
```

**Goal Templates:**
Predefined templates for quick goal creation:
- `GOAL_TEMPLATES.skill` - 4 templates (Listening, Reading, Writing, Speaking)
- `GOAL_TEMPLATES.quantity` - 2 templates (5 đề/tuần, 20 đề/tháng)
- `GOAL_TEMPLATES.time` - 2 templates (30 phút/ngày, 2 giờ/tuần)
- `GOAL_TEMPLATES.streak` - 2 templates (3 ngày, 7 ngày)
- `GOAL_TEMPLATES.score` - 2 templates (≥70%, ≥80%)

## 🔗 CÁCH TÍCH HỢP

### Bước 1: Thêm navigation link
```typescript
// In Sidebar.tsx or Header
<button onClick={() => setCurrentPage('goals')}>
  <Target className="size-4" />
  <span>Đặt mục tiêu</span>
</button>
```

### Bước 2: Auto-update goals khi hoàn thành bài tập
```typescript
import { autoUpdateGoals } from '../utils/goalService';

// In practice completion handler:
const handleFinishExercise = (skill: SkillType, studyTime: number, score?: number) => {
  // Existing logic...
  
  // Update goals
  const updatedGoals = autoUpdateGoals(skill, studyTime, score);
  
  // Check if any goal just completed
  const newlyCompleted = updatedGoals.filter(g => g.isCompleted);
  if (newlyCompleted.length > 0) {
    // Show GoalAchievedModal
    onGoalAchieved(newlyCompleted[0]);
  }
};
```

### Bước 3: Reset goals periodically
Goals auto-reset based on period:
- **Daily goals**: Reset at midnight
- **Weekly goals**: Reset every Monday
- **Monthly goals**: Reset on 1st of month

Reset happens automatically when calling:
```typescript
resetGoalsIfNeeded(); // Called in getUserGoals(), autoUpdateGoals()
```

## 💾 STORAGE STRUCTURE

### LocalStorage Key: `vstep_user_goals`

```json
[
  {
    "id": "goal_1733753200000",
    "type": "skill",
    "skill": "reading",
    "targetValue": 1,
    "currentValue": 0,
    "period": "daily",
    "title": "Luyện Reading đều đặn",
    "description": "1 bài mỗi ngày",
    "icon": "BookOpen",
    "color": "from-blue-500 to-cyan-600",
    "unit": "bài",
    "createdAt": "2024-12-09T10:00:00.000Z",
    "lastReset": "2024-12-09T10:00:00.000Z",
    "isCompleted": false
  },
  {
    "id": "goal_1733753300000",
    "type": "streak",
    "targetValue": 3,
    "currentValue": 2,
    "period": "daily",
    "title": "Giữ nhịp học tập",
    "description": "Học liên tục 3 ngày",
    "icon": "Flame",
    "color": "from-orange-400 to-red-500",
    "unit": "ngày",
    "createdAt": "2024-12-07T08:00:00.000Z",
    "lastReset": "2024-12-09T00:00:00.000Z",
    "isCompleted": false
  }
]
```

## 🎨 DESIGN SYSTEM

### Colors:
- **Skill goals**: Skill-specific colors (Blue, Green, Purple, Orange)
- **Quantity goals**: Yellow-Orange gradient
- **Time goals**: Blue gradient
- **Streak goals**: Orange-Red gradient  
- **Score goals**: Green gradient

### Icons (from lucide-react):
- Headphones, BookOpen, PenTool, Mic (skills)
- Trophy (quantity)
- Clock (time)
- Flame, Calendar (streak)
- TrendingUp (score)

### UI States:
- **Active goal**: White background, colored border on hover
- **Completed goal**: Green background (bg-green-50), green border (border-green-200)
- **Progress bar**: Gradient matching goal color, animated width transition

## 📊 DASHBOARD INTEGRATION

### Quick Stats in Goals Page:
1. **Đang theo đuổi**: Count of active goals
2. **Hôm nay**: Count of today's goals
3. **Đã đạt**: Count of completed goals

### Overall Progress:
- Percentage: `(completedGoals / totalGoals) * 100`
- Visual progress bar with gradient

## 🎮 USER FLOW

### Creating a Goal:
1. Click "Thêm mục tiêu" button
2. **Step 1**: Select goal type (skill, quantity, time, streak, score)
3. **Step 2**: Select from templates or create custom
4. Goal is created and added to dashboard

### Tracking Progress:
1. Goal auto-updates when user completes exercises
2. Progress bar fills up
3. When target reached → `isCompleted = true`
4. GoalAchievedModal pops up (if integrated)
5. Goal appears in "Đã hoàn thành" tab

### Managing Goals:
- **View all**: Default tab shows active goals
- **Filter by period**: Today, Weekly, Completed tabs
- **Delete goal**: Hover → trash icon → confirm
- **Reset**: Automatic based on period

## 📝 BACKEND MIGRATION GUIDE

Hiện tại goals lưu trong **localStorage**. Khi migrate sang backend:

### Database Tables:

**1. `goals` table:**
```sql
CREATE TABLE goals (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  type VARCHAR(20) NOT NULL, -- skill, quantity, time, streak, score
  skill VARCHAR(20), -- listening, reading, writing, speaking (nullable)
  target_value INT NOT NULL,
  current_value INT DEFAULT 0,
  period VARCHAR(10) NOT NULL, -- daily, weekly, monthly
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(100),
  unit VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  last_reset TIMESTAMP DEFAULT NOW(),
  is_completed BOOLEAN DEFAULT FALSE
);
```

### API Endpoints:

**GET `/api/users/:id/goals`** - Get all user goals

**POST `/api/goals`** - Create new goal
```json
{
  "user_id": 123,
  "type": "skill",
  "skill": "reading",
  "target_value": 1,
  "period": "daily",
  "title": "Luyện Reading đều đặn",
  "description": "1 bài mỗi ngày",
  "icon": "BookOpen",
  "color": "from-blue-500 to-cyan-600",
  "unit": "bài"
}
```

**PUT `/api/goals/:id/progress`** - Update goal progress
```json
{
  "increment_by": 1
}
```

**DELETE `/api/goals/:id`** - Delete a goal

**POST `/api/goals/auto-update`** - Auto-update goals after exercise
```json
{
  "user_id": 123,
  "skill": "reading",
  "study_time": 25,
  "score": 85
}
```

**POST `/api/goals/reset`** - Reset goals (cron job)
- Run daily at midnight to reset daily goals
- Run weekly on Monday to reset weekly goals
- Run monthly on 1st to reset monthly goals

## 🚀 DEPLOYMENT CHECKLIST

- [x] GoalCard component
- [x] GoalSettingModal component
- [x] GoalAchievedModal component
- [x] Goals page
- [x] goalService.ts core logic
- [x] Sidebar navigation link
- [x] App.tsx routing
- [ ] Integrate auto-update in practice components
- [ ] Backend API integration
- [ ] Cron jobs for auto-reset

## 💡 TIPS ĐẠT MỤC TIÊU

Hiển thị trong Goals page để hướng dẫn học viên:
- ✅ Chia mục tiêu lớn thành các mục tiêu nhỏ dễ đạt hơn
- ✅ Học đều đặn mỗi ngày tốt hơn học dồn vào cuối tuần
- ✅ Kết hợp nhiều kỹ năng để tiến bộ toàn diện
- ✅ Theo dõi tiến độ thường xuyên để điều chỉnh kịp thời

## 📞 SUPPORT

Liên hệ team Frontend để được hỗ trợ tích hợp hệ thống Goals.

---

**Version:** 1.0.0  
**Last Updated:** 2024-12-09  
**Author:** VSTEPRO Team

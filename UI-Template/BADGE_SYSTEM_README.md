# 🏆 HỆ THỐNG HUY HIỆU (BADGES) - VSTEPRO

## 📋 TỔNG QUAN

Hệ thống huy hiệu gamification giúp tăng động lực học tập cho học viên. Khi hoàn thành các mốc (số lượng đề, điểm cao, chuỗi ngày học...), hệ thống tự động cấp huy hiệu tương ứng.

## 🎯 CÁC LOẠI HUY HIỆU

### A. Theo hành vi học tập
- **New Starter** - Hoàn thành 1 đề thi đầu tiên
- **Chăm chỉ** - Hoàn thành 5 đề thi
- **Bứt tốc** - Hoàn thành 10 đề thi
- **Vô địch luyện đề** - Hoàn thành 20 đề thi

### B. Theo kỹ năng
- **Nghe tốt** - Hoàn thành 3 bài Listening
- **Đọc hiểu vững** - Hoàn thành 3 bài Reading
- **Viết chuẩn** - Hoàn thành 3 bài Writing
- **Tự tin nói** - Hoàn thành 3 bài Speaking

### C. Theo chuỗi ngày học (Streak)
- **Giữ nhịp** - 3 ngày học liên tục
- **Kỷ luật cao** - 7 ngày học liên tục
- **Siêu chăm chỉ** - 14 ngày học liên tục

### D. Theo điểm số
- **Vượt chuẩn** - Đạt điểm >70%
- **Xuất sắc** - Đạt điểm >90%
- **Hoàn hảo** - Đạt 100% trong 1 đề thi

## 🛠️ CÁC COMPONENT

### 1. BadgeCard.tsx
Component hiển thị từng huy hiệu
- Props: name, description, icon, color, isUnlocked, unlockedAt, size
- Hiển thị trạng thái locked/unlocked
- Animation glow effect khi unlocked

### 2. BadgeUnlockedModal.tsx
Modal celebration khi nhận huy hiệu mới
- Animation scale + sparkles
- Hiển thị icon, tên, mô tả badge
- CTA button "Tiếp tục học"

### 3. Profile.tsx
Trang hồ sơ cá nhân hiển thị tất cả badges
- Grouped by category (learning, skill, streak, score)
- Progress bar % hoàn thành
- Call-to-action khi chưa unlock hết

## 📂 UTILITY FILES

### 1. `/utils/badgeService.ts`
Core logic quản lý badges:
```typescript
// Check và unlock badges
checkAndUnlockBadges(stats: UserStats): BadgeDefinition[]

// Increment completed tests và trigger check
incrementCompletedTests(skill, score?): BadgeDefinition[]

// Get user stats từ localStorage
getUserStats(): UserStats

// Update user stats
updateUserStats(updates): void
```

### 2. `/utils/badgeHelpers.tsx`
Helper functions dễ integrate:
```typescript
// Trigger badge check sau khi hoàn thành bài tập
triggerBadgeCheck(skill: SkillType, score?: number): BadgeDefinition[]

// Demo function cho testing
demoCompleteBatch(skill, count, score): BadgeDefinition[]
```

## 🔗 CÁCH TÍCH HỢP VÀO PRACTICE COMPONENTS

### Bước 1: Import helpers
```typescript
import { triggerBadgeCheck } from '../utils/badgeHelpers';
```

### Bước 2: Thêm props callback
```typescript
interface ReadingPracticeProps {
  onBack: () => void;
  onBadgeUnlocked?: (badge: BadgeDefinition) => void; // Thêm prop này
}
```

### Bước 3: Call trigger khi hoàn thành bài tập
```typescript
const handleFinishExercise = (score: number) => {
  // Existing logic...
  
  // Trigger badge check
  const newBadges = triggerBadgeCheck('reading', score);
  if (newBadges.length > 0 && onBadgeUnlocked) {
    onBadgeUnlocked(newBadges[0]); // Show first unlocked badge
  }
};
```

### Bước 4: Update App.tsx
```typescript
// In App.tsx, pass callback to practice components:
<ReadingPractice 
  onBack={...}
  onBadgeUnlocked={handleBadgeUnlock}
/>

// Handler in App.tsx:
const handleBadgeUnlock = (badge: BadgeDefinition) => {
  setUnlockedBadge(badge);
  setShowBadgeModal(true); // Show celebration modal
};
```

## 💾 STORAGE STRUCTURE

### LocalStorage Keys:

1. **`vstep_user_badges`** - Array of unlocked badges
```json
[
  { "id": "new-starter", "unlockedAt": "2024-12-09T10:30:00.000Z" },
  { "id": "doc-hieu-vung", "unlockedAt": "2024-12-09T14:20:00.000Z" }
]
```

2. **`vstep_user_stats`** - User learning stats
```json
{
  "completedTests": 12,
  "completedReading": 5,
  "completedListening": 3,
  "completedWriting": 2,
  "completedSpeaking": 2,
  "currentStreak": 4,
  "highestScore": 92,
  "perfectScoreCount": 1
}
```

3. **`vstep_last_study_date`** - Last study date (for streak calculation)
```
"Mon Dec 09 2024"
```

## 🎨 DESIGN SYSTEM

### Colors:
- Learning badges: Blue-Green gradient
- Skill badges: Skill-specific colors (Blue, Green, Purple, Orange)
- Streak badges: Orange-Red-Pink gradient
- Score badges: Cyan-Yellow-Purple gradient

### Icons (from lucide-react):
- Star, Trophy, Zap, Crown (learning)
- BookOpen, Headphones, PenTool, Mic (skills)
- Flame, Calendar, Medal (streaks)
- TrendingUp, Award, Target (scores)

### Animations:
- Scale + rotate on unlock
- Glow pulse effect (Motion/Framer Motion)
- Sparkles celebration

## 🚀 DEPLOYMENT CHECKLIST

- [x] BadgeCard component
- [x] BadgeUnlockedModal component
- [x] Profile page with badges grid
- [x] badgeService.ts core logic
- [x] badgeHelpers.tsx integration helpers
- [ ] Integrate into ReadingPractice
- [ ] Integrate into ListeningPractice
- [ ] Integrate into WritingPractice
- [ ] Integrate into SpeakingPractice
- [ ] Backend API integration (optional)

## 📝 NOTES FOR BACKEND TEAM

Hiện tại hệ thống lưu trữ trong **localStorage** (frontend only).

Khi cần migrate sang backend:

### Database Tables:

**1. `badges` table:**
```sql
CREATE TABLE badges (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  category VARCHAR(20), -- learning, skill, streak, score
  condition VARCHAR(50), -- complete_3_reading, score_90, etc
  icon VARCHAR(50),
  color VARCHAR(50)
);
```

**2. `user_badges` table:**
```sql
CREATE TABLE user_badges (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  badge_id VARCHAR(50) REFERENCES badges(id),
  unlocked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, badge_id) -- Prevent duplicate
);
```

**3. `user_stats` table:**
```sql
CREATE TABLE user_stats (
  user_id INT PRIMARY KEY REFERENCES users(id),
  completed_tests INT DEFAULT 0,
  completed_reading INT DEFAULT 0,
  completed_listening INT DEFAULT 0,
  completed_writing INT DEFAULT 0,
  completed_speaking INT DEFAULT 0,
  current_streak INT DEFAULT 0,
  highest_score INT DEFAULT 0,
  perfect_score_count INT DEFAULT 0,
  last_study_date DATE,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints:

**GET `/api/badges`** - Get all available badges

**GET `/api/users/:id/badges`** - Get user's unlocked badges

**POST `/api/badges/award`**
```json
{
  "user_id": 123,
  "badge_id": "cham-chi",
  "timestamp": "2024-12-09T10:30:00Z"
}
```
Response:
```json
{
  "success": true,
  "badge": { "id": "cham-chi", "name": "Chăm chỉ", ... },
  "newly_unlocked": true
}
```

**POST `/api/users/:id/stats`** - Update user stats
```json
{
  "completed_tests": 12,
  "completed_reading": 5,
  "current_streak": 4,
  "highest_score": 92
}
```

## 🎮 TESTING

### Manual Testing:
1. Vào Profile page → Check initial state (1 badge unlocked by default)
2. Complete bài Reading → Check badge "Đọc hiểu vững" unlocked sau 3 bài
3. Complete với >70% → Check badge "Vượt chuẩn"
4. Check streak: Học 3 ngày liên tục → Badge "Giữ nhịp"

### Console Testing:
```javascript
// In browser console:
import { demoCompleteBatch } from './utils/badgeHelpers';

// Simulate completing 5 reading exercises with 85% score
const badges = demoCompleteBatch('reading', 5, 85);
console.log('Unlocked badges:', badges);

// Check user stats
import { getUserStats } from './utils/badgeService';
console.log(getUserStats());
```

## 📞 SUPPORT

Nếu có thắc mắc về tích hợp hệ thống badges, liên hệ team Frontend.

---

**Version:** 1.0.0  
**Last Updated:** 2024-12-09  
**Author:** VSTEPRO Team

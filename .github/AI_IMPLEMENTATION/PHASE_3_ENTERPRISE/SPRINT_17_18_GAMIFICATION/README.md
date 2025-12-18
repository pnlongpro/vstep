# Sprint 17-18: Gamification System

## 📋 Sprint Info

| Attribute | Value |
|-----------|-------|
| **Sprint** | 17-18 |
| **Phase** | 3 - Enterprise |
| **Duration** | 2 weeks |
| **Total Tasks** | 10 |
| **Total Hours** | 54h |
| **Focus** | XP, Achievements, Goals, Leaderboard |

---

## 🎯 Sprint Goals

1. **XP System**: Điểm kinh nghiệm tích lũy qua hoạt động
2. **Achievement/Badges**: Huy hiệu mở khóa khi đạt mốc
3. **Goals**: Mục tiêu cá nhân (daily/weekly/monthly)
4. **Leaderboard**: Bảng xếp hạng theo level và thời gian
5. **Streak System**: Chuỗi học liên tục

---

## 📊 Database Schema

### Bảng achievements
```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  badge_image VARCHAR(255),
  xp_reward INT DEFAULT 0,
  category ENUM('learning', 'streak', 'skill', 'social', 'milestone'),
  condition_type ENUM('count', 'streak', 'score', 'time'),
  condition_value INT,
  condition_metadata JSON,
  is_hidden BOOLEAN DEFAULT FALSE,
  rarity ENUM('common', 'rare', 'epic', 'legendary') DEFAULT 'common',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  achievement_id UUID REFERENCES achievements(id),
  unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  progress INT DEFAULT 0,
  UNIQUE(user_id, achievement_id)
);
```

### Bảng goals
```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  goal_type ENUM('daily', 'weekly', 'monthly', 'custom'),
  target_type ENUM('practice_count', 'study_time', 'score', 'xp'),
  target_value INT NOT NULL,
  current_value INT DEFAULT 0,
  start_date DATE,
  end_date DATE,
  status ENUM('active', 'completed', 'failed', 'cancelled') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);
```

### Bảng leaderboard_entries
```sql
CREATE TABLE leaderboard_entries (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  period ENUM('daily', 'weekly', 'monthly', 'all_time'),
  period_key VARCHAR(20), -- e.g., '2024-W01', '2024-01'
  level VARCHAR(10), -- A2, B1, B2, C1
  xp INT DEFAULT 0,
  tests_completed INT DEFAULT 0,
  average_score DECIMAL(5,2),
  rank INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, period, period_key, level)
);
```

### Bảng xp_transactions
```sql
CREATE TABLE xp_transactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  amount INT NOT NULL,
  source_type ENUM('practice', 'exam', 'achievement', 'streak', 'bonus'),
  source_id UUID,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📝 Task List

### Backend Tasks

| Task ID | Title | Priority | Hours | Dependencies |
|---------|-------|----------|-------|--------------|
| BE-059 | Achievement Entity & Service | P0 | 5h | - |
| BE-060 | Goal Entity & Service | P0 | 4h | - |
| BE-061 | XP System & Transactions | P0 | 5h | BE-059 |
| BE-062 | Leaderboard Service | P1 | 5h | BE-061 |
| BE-063 | Streak Calculation | P1 | 4h | BE-061 |

### Frontend Tasks

| Task ID | Title | Priority | Hours | Dependencies |
|---------|-------|----------|-------|--------------|
| FE-062 | Achievement Display | P0 | 5h | BE-059 |
| FE-063 | Goal Setting UI | P0 | 6h | BE-060 |
| FE-064 | XP Progress Widget | P1 | 4h | BE-061 |
| FE-065 | Leaderboard Page | P1 | 6h | BE-062 |
| FE-066 | Streak & Celebration | P1 | 5h | BE-063 |

---

## 🏗️ Architecture

### XP Earning Flow
```
User Action (Practice/Exam)
    │
    ▼
┌─────────────────────┐
│ XpService.addXp()   │
│ - Calculate amount  │
│ - Apply multipliers │
│ - Create transaction│
└─────────────────────┘
    │
    ├──▶ Update user_stats.xp
    │
    ├──▶ Check level up
    │
    ├──▶ Update leaderboard
    │
    └──▶ Check achievements
            │
            ▼
      ┌───────────────┐
      │ Unlock badges │
      │ Send notif    │
      └───────────────┘
```

### XP Values
```typescript
const XP_CONFIG = {
  practice_complete: 10,
  exam_complete: 50,
  perfect_score: 25,   // bonus
  streak_day: 5,       // per day
  streak_week: 50,     // bonus at 7 days
  achievement_common: 20,
  achievement_rare: 50,
  achievement_epic: 100,
  achievement_legendary: 200,
};
```

---

## 🏆 Achievement Categories

### Learning Achievements
| Name | Condition | XP | Rarity |
|------|-----------|-----|--------|
| First Steps | Complete 1 practice | 20 | Common |
| Practice Pro | Complete 50 practices | 100 | Rare |
| Practice Master | Complete 200 practices | 500 | Epic |

### Streak Achievements
| Name | Condition | XP | Rarity |
|------|-----------|-----|--------|
| 7-Day Warrior | 7 day streak | 50 | Common |
| 30-Day Champion | 30 day streak | 200 | Rare |
| 100-Day Legend | 100 day streak | 1000 | Legendary |

### Skill Achievements
| Name | Condition | XP | Rarity |
|------|-----------|-----|--------|
| Reading Hero | Score 9+ in Reading | 50 | Rare |
| Writing Expert | AI score 8+ in Writing | 100 | Epic |
| Polyglot | All skills B2+ | 500 | Legendary |

### Score Achievements
| Name | Condition | XP | Rarity |
|------|-----------|-----|--------|
| Perfect Score | 10/10 on any test | 100 | Rare |
| Consistent | Average 8+ over 10 tests | 200 | Epic |

---

## 📁 File Structure

### Backend
```
src/modules/gamification/
├── gamification.module.ts
├── achievements/
│   ├── achievement.entity.ts
│   ├── user-achievement.entity.ts
│   ├── achievement.service.ts
│   ├── achievement.controller.ts
│   └── dto/
├── goals/
│   ├── goal.entity.ts
│   ├── goal.service.ts
│   ├── goal.controller.ts
│   └── dto/
├── xp/
│   ├── xp-transaction.entity.ts
│   ├── xp.service.ts
│   └── xp.config.ts
├── leaderboard/
│   ├── leaderboard-entry.entity.ts
│   ├── leaderboard.service.ts
│   └── leaderboard.controller.ts
└── streak/
    ├── streak.service.ts
    └── streak.util.ts
```

### Frontend
```
src/features/gamification/
├── hooks/
│   ├── useAchievements.ts
│   ├── useGoals.ts
│   ├── useXp.ts
│   ├── useLeaderboard.ts
│   └── useStreak.ts
├── components/
│   ├── AchievementCard.tsx
│   ├── AchievementGrid.tsx
│   ├── AchievementUnlockedModal.tsx
│   ├── GoalCard.tsx
│   ├── GoalSettingModal.tsx
│   ├── GoalProgress.tsx
│   ├── XpBar.tsx
│   ├── XpGainAnimation.tsx
│   ├── LevelBadge.tsx
│   ├── LeaderboardTable.tsx
│   ├── LeaderboardFilters.tsx
│   ├── StreakCounter.tsx
│   └── StreakCelebration.tsx
└── services/
    └── gamificationService.ts
```

---

## ✅ Sprint Acceptance Criteria

- [ ] Users earn XP from activities
- [ ] XP level calculation works
- [ ] Achievements unlock correctly
- [ ] Achievement notification shows
- [ ] Goals can be created
- [ ] Goal progress updates
- [ ] Leaderboard displays correctly
- [ ] Leaderboard filters work
- [ ] Streak calculates correctly
- [ ] Streak celebration animates

---

## 📈 Success Metrics

- XP transactions logged correctly
- Achievement unlock rate > 30% for common badges
- Goal completion rate tracked
- Leaderboard engagement increases session time
- Streak system improves retention

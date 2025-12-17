# Sprint 07-08: Dashboard Module - Execution Order

## 🎯 Sprint Goal
Implement Student Dashboard với analytics, progress tracking, và gamification elements.

---

## 📊 Sprint Overview

| Metric | Value |
|--------|-------|
| Duration | 2 weeks |
| Total Tasks | 18 |
| Backend Tasks | 8 |
| Frontend Tasks | 10 |
| Estimated Hours | 72h |

---

## 📋 Task List

### Week 7: Backend Analytics

| Priority | Task ID | Task Name | Hours | Dependencies |
|----------|---------|-----------|-------|--------------|
| P0 | BE-028 | User Stats Entity | 4h | - |
| P0 | BE-029 | Analytics Service | 8h | BE-028 |
| P0 | BE-030 | Progress Tracking Service | 6h | BE-029 |
| P0 | BE-031 | Activity Log Service | 4h | - |
| P1 | BE-032 | Achievement Service | 6h | BE-028 |
| P1 | BE-033 | Streak Calculation | 4h | BE-031 |
| P1 | BE-034 | Leaderboard Service | 4h | BE-028 |
| P1 | BE-035 | Learning Roadmap Service | 6h | BE-030 |

### Week 8: Frontend Dashboard

| Priority | Task ID | Task Name | Hours | Dependencies |
|----------|---------|-----------|-------|--------------|
| P0 | FE-028 | Dashboard API Service | 4h | - |
| P0 | FE-029 | Dashboard Layout | 4h | FE-028 |
| P0 | FE-030 | Stats Overview Cards | 4h | FE-029 |
| P0 | FE-031 | Progress Charts | 6h | FE-029 |
| P0 | FE-032 | Activity Calendar | 4h | FE-029 |
| P1 | FE-033 | Achievement Badges | 4h | FE-029 |
| P1 | FE-034 | Streak Display | 2h | FE-029 |
| P1 | FE-035 | Leaderboard Component | 4h | FE-028 |
| P1 | FE-036 | Learning Roadmap | 6h | FE-028 |
| P1 | FE-037 | Recent Activity Feed | 4h | FE-029 |

---

## 🔗 Dependency Graph

```
BE-028 (User Stats) ─┬─> BE-029 (Analytics)
                     │       │
                     │       └─> BE-030 (Progress)
                     │               │
                     │               └─> BE-035 (Roadmap)
                     │
                     ├─> BE-032 (Achievement)
                     │
                     └─> BE-034 (Leaderboard)

BE-031 (Activity Log) ─> BE-033 (Streak)

FE-028 (API) ─┬─> FE-029 (Layout)
              │       │
              │       ├─> FE-030 (Stats Cards)
              │       ├─> FE-031 (Charts)
              │       ├─> FE-032 (Calendar)
              │       ├─> FE-033 (Badges)
              │       ├─> FE-034 (Streak)
              │       └─> FE-037 (Activity)
              │
              ├─> FE-035 (Leaderboard)
              │
              └─> FE-036 (Roadmap)
```

---

## 🎯 Key Features

### Dashboard Overview
1. **Stats Cards**: Tests completed, Hours studied, Current streak, Average score
2. **Progress Charts**: Score trends, Skill breakdown radar, Weekly activity
3. **Activity Calendar**: GitHub-style contribution calendar
4. **Recent Activity**: Latest practice sessions and achievements

### Gamification
1. **Achievements/Badges**: "7-Day Streak", "100 Questions", "Writing Hero", etc.
2. **XP System**: Earn XP from activities, level up
3. **Streaks**: Daily practice streaks with bonuses
4. **Leaderboard**: Weekly/Monthly rankings by level

### Learning Roadmap
1. **Current Level Assessment**: Based on recent scores
2. **Target Level Goal**: User-defined goal (B1 → B2)
3. **Recommended Activities**: AI-suggested practice areas
4. **Milestone Tracking**: Progress towards goal

---

## ✅ Acceptance Criteria

### Backend
- [ ] User stats calculated and cached
- [ ] Progress tracked per skill
- [ ] Activity logging complete
- [ ] Achievement unlocks work
- [ ] Streak calculation accurate
- [ ] Leaderboard rankings correct

### Frontend
- [ ] Dashboard loads in < 2s
- [ ] Charts render correctly
- [ ] Calendar shows activity
- [ ] Badges animate on unlock
- [ ] Streak counter displays
- [ ] Roadmap is interactive

---

## 📁 File Structure

```
BE/src/modules/
├── analytics/
│   ├── entities/
│   │   ├── user-stats.entity.ts
│   │   └── activity-log.entity.ts
│   ├── services/
│   │   ├── analytics.service.ts
│   │   ├── progress.service.ts
│   │   └── streak.service.ts
│   └── controllers/
│       └── analytics.controller.ts
├── gamification/
│   ├── entities/
│   │   ├── achievement.entity.ts
│   │   ├── user-achievement.entity.ts
│   │   └── leaderboard-entry.entity.ts
│   ├── services/
│   │   ├── achievement.service.ts
│   │   └── leaderboard.service.ts
│   └── controllers/
│       └── gamification.controller.ts
└── roadmap/
    ├── services/
    │   └── roadmap.service.ts
    └── controllers/
        └── roadmap.controller.ts

FE/src/app/dashboard/
├── page.tsx
├── components/
│   ├── StatsCards.tsx
│   ├── ProgressCharts.tsx
│   ├── ActivityCalendar.tsx
│   ├── AchievementBadges.tsx
│   ├── StreakDisplay.tsx
│   └── RecentActivity.tsx
├── leaderboard/
│   └── page.tsx
└── roadmap/
    └── page.tsx
```

---

## 📦 Chart Libraries

```json
{
  "recharts": "^2.12.0",
  "react-calendar-heatmap": "^1.9.0"
}
```

---

## ⏭️ Next Phase

**Phase 2: AI Scoring & Teacher Portal**
- Speaking AI scoring
- Teacher dashboard
- Manual feedback
- Class management

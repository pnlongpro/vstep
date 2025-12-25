# Sprint 21-22: Statistics Module

> **7 tabs phân tích chi tiết cho học viên**
>
> Updated: 19/12/2024

---

## 📋 Overview

| Attribute | Value |
|-----------|-------|
| **Sprint** | 21-22 |
| **Phase** | 4 - Polish |
| **Duration** | 2 weeks |
| **Focus** | Statistics & Analytics for Students |
| **Total Tasks** | 14 (7 BE + 7 FE) |
| **Estimated Hours** | ~56h |

---

## 🎯 Sprint Goals

1. **Overview Tab**: Tổng quan thống kê học tập
2. **Course Progress Tab**: Tiến độ theo khóa học
3. **Exercise Performance Tab**: Hiệu suất bài tập theo skill
4. **Gamification Tab**: XP, Level, Badges, Streak
5. **Recommendations Tab**: Gợi ý học tập từ AI
6. **Study Time Tab**: Phân tích thời gian học
7. **Test History Tab**: Lịch sử bài thi chi tiết

---

## 📋 Task List

### Backend Tasks

| Task ID | Title | Est. | Priority | Description |
|---------|-------|------|----------|-------------|
| BE-STAT-001 | Statistics Overview API | 4h | P1 | Aggregated stats endpoint |
| BE-STAT-002 | Course Progress API | 4h | P1 | Progress by course/module |
| BE-STAT-003 | Exercise Analytics API | 4h | P1 | Performance by skill/type |
| BE-STAT-004 | Gamification Stats API | 3h | P1 | XP, level, badges |
| BE-STAT-005 | Recommendations Engine | 6h | P2 | AI-based suggestions |
| BE-STAT-006 | Study Time Tracking API | 4h | P1 | Time analytics |
| BE-STAT-007 | Test History API | 3h | P1 | Detailed test history |

### Frontend Tasks

| Task ID | Title | Est. | Priority | Source |
|---------|-------|------|----------|--------|
| FE-STAT-001 | OverviewTab | 4h | P1 | `statistics/OverviewTab.tsx` |
| FE-STAT-002 | CourseProgressTab | 4h | P1 | `statistics/CourseProgressTab.tsx` |
| FE-STAT-003 | ExercisePerformanceTab | 4h | P1 | `statistics/ExercisePerformanceTab.tsx` |
| FE-STAT-004 | GamificationTab | 4h | P1 | `statistics/GamificationTab.tsx` |
| FE-STAT-005 | RecommendationsTab | 4h | P2 | `statistics/RecommendationsTab.tsx` |
| FE-STAT-006 | StudyTimeTab | 4h | P1 | `statistics/StudyTimeTab.tsx` |
| FE-STAT-007 | TestHistoryTab | 4h | P1 | `statistics/TestHistoryTab.tsx` |

---

## 📝 Task Details

### FE-STAT-001: OverviewTab

```markdown
## 📋 Task Info
- **Priority**: P1
- **Estimated Hours**: 4h
- **Dependencies**: BE-STAT-001

## 🎯 Objective
Tab tổng quan thống kê học tập

## 📝 Requirements
1. Summary cards:
   - Tổng thời gian học
   - Số bài đã hoàn thành
   - Điểm trung bình
   - Current streak
2. Progress chart (weekly/monthly)
3. Skill radar chart
4. Recent achievements

## 💻 Implementation
Source: `UI-Template/components/statistics/OverviewTab.tsx`
Target: `FE/src/components/statistics/OverviewTab.tsx`

## ✅ Acceptance Criteria
- [ ] Summary stat cards
- [ ] Time period filter (week/month/all)
- [ ] Progress trend chart
- [ ] Skill distribution radar
- [ ] Recent badges/achievements
```

---

### FE-STAT-002: CourseProgressTab

```markdown
## 📋 Task Info
- **Priority**: P1
- **Estimated Hours**: 4h
- **Dependencies**: BE-STAT-002

## 🎯 Objective
Xem tiến độ theo từng khóa học

## 📝 Requirements
1. Course list với progress bars
2. Module breakdown per course
3. Completed vs remaining
4. Time spent per course
5. Estimated completion date

## 💻 Implementation
Source: `UI-Template/components/statistics/CourseProgressTab.tsx`
Target: `FE/src/components/statistics/CourseProgressTab.tsx`

## ✅ Acceptance Criteria
- [ ] Course cards với progress
- [ ] Expandable module details
- [ ] Completion stats
- [ ] Time analytics
```

---

### FE-STAT-003: ExercisePerformanceTab

```markdown
## 📋 Task Info
- **Priority**: P1
- **Estimated Hours**: 4h
- **Dependencies**: BE-STAT-003

## 🎯 Objective
Phân tích hiệu suất bài tập theo skill

## 📝 Requirements
1. Performance by skill (Reading/Listening/Writing/Speaking)
2. Accuracy rate charts
3. Time per question analysis
4. Weak areas identification
5. Improvement trends

## 💻 Implementation
Source: `UI-Template/components/statistics/ExercisePerformanceTab.tsx`
Target: `FE/src/components/statistics/ExercisePerformanceTab.tsx`

## ✅ Acceptance Criteria
- [ ] Skill breakdown cards
- [ ] Accuracy charts per skill
- [ ] Time analysis
- [ ] Weak area alerts
- [ ] Trend comparisons
```

---

### FE-STAT-004: GamificationTab

```markdown
## 📋 Task Info
- **Priority**: P1
- **Estimated Hours**: 4h
- **Dependencies**: BE-STAT-004

## 🎯 Objective
Hiển thị XP, Level, Badges, Streak stats

## 📝 Requirements
1. Current XP/Level với progress
2. XP history chart
3. Badge collection (unlocked/locked)
4. Streak calendar
5. Leaderboard position

## 💻 Implementation
Source: `UI-Template/components/statistics/GamificationTab.tsx`
Target: `FE/src/components/statistics/GamificationTab.tsx`

## ✅ Acceptance Criteria
- [ ] XP/Level display với progress bar
- [ ] XP earning history
- [ ] Badge grid với unlock status
- [ ] Streak visualization
- [ ] Rank display
```

---

### FE-STAT-005: RecommendationsTab

```markdown
## 📋 Task Info
- **Priority**: P2
- **Estimated Hours**: 4h
- **Dependencies**: BE-STAT-005

## 🎯 Objective
Gợi ý học tập dựa trên performance

## 📝 Requirements
1. Personalized recommendations
2. Weak area focus
3. Suggested exercises
4. Study plan suggestions
5. Resource recommendations

## 💻 Implementation
Source: `UI-Template/components/statistics/RecommendationsTab.tsx`
Target: `FE/src/components/statistics/RecommendationsTab.tsx`

## ✅ Acceptance Criteria
- [ ] AI-generated recommendations
- [ ] Priority ranking
- [ ] Quick action buttons
- [ ] Resource links
```

---

### FE-STAT-006: StudyTimeTab

```markdown
## 📋 Task Info
- **Priority**: P1
- **Estimated Hours**: 4h
- **Dependencies**: BE-STAT-006

## 🎯 Objective
Phân tích thời gian học tập

## 📝 Requirements
1. Daily/weekly/monthly time charts
2. Time by skill breakdown
3. Peak study hours
4. Session duration analysis
5. Goal vs actual comparison

## 💻 Implementation
Source: `UI-Template/components/statistics/StudyTimeTab.tsx`
Target: `FE/src/components/statistics/StudyTimeTab.tsx`

## ✅ Acceptance Criteria
- [ ] Time heatmap
- [ ] Skill time distribution
- [ ] Trend charts
- [ ] Goal tracking
```

---

### FE-STAT-007: TestHistoryTab

```markdown
## 📋 Task Info
- **Priority**: P1
- **Estimated Hours**: 4h
- **Dependencies**: BE-STAT-007

## 🎯 Objective
Lịch sử bài thi chi tiết

## 📝 Requirements
1. Test history list với filters
2. Score trends
3. Skill breakdown per test
4. Time analysis per test
5. Compare with average

## 💻 Implementation
Source: `UI-Template/components/statistics/TestHistoryTab.tsx`
Target: `FE/src/components/statistics/TestHistoryTab.tsx`

## ✅ Acceptance Criteria
- [ ] Paginated test list
- [ ] Score chart trends
- [ ] Skill breakdown
- [ ] Detail view modal
- [ ] Filter by date/skill/score
```

---

## 📁 Target File Structure

```
FE/src/
├── components/
│   └── statistics/
│       ├── index.ts
│       ├── OverviewTab.tsx
│       ├── CourseProgressTab.tsx
│       ├── ExercisePerformanceTab.tsx
│       ├── GamificationTab.tsx
│       ├── RecommendationsTab.tsx
│       ├── StudyTimeTab.tsx
│       └── TestHistoryTab.tsx
│
├── services/
│   └── statistics.service.ts
│
├── hooks/
│   └── useStatistics.ts
│
└── app/(dashboard)/
    └── statistics/
        └── page.tsx
```

---

## 📊 Summary

| Priority | Tasks | Hours |
|----------|-------|-------|
| P1 | 12 tasks | 46h |
| P2 | 2 tasks | 10h |
| **Total** | **14 tasks** | **~56h** |

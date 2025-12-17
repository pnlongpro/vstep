# FE Component Mapping - Sprint 07-08 Dashboard

## 🎯 Mục đích

File này map các FE tasks với components đã có sẵn trong `FE/src/`.
AI sẽ **KHÔNG tạo mới UI components**, mà chỉ:
1. Tích hợp components có sẵn với API
2. Thêm data fetching logic (TanStack Query)
3. Kết nối với Backend services

---

## 📁 Existing Component Structure

```
FE/src/
├── components/
│   ├── ui/                          # 45+ shadcn/ui base components
│   │   ├── button.tsx, card.tsx, badge.tsx, progress.tsx, ...
│   │   └── chart.tsx                # Recharts wrapper
│   │
│   ├── dashboard/                   # Dashboard-specific components
│   │   ├── dashboard-stats.tsx      # Stats cards (4 metrics)
│   │   ├── learning-progress.tsx    # Skill progress bars
│   │   ├── quick-actions.tsx        # Quick action buttons
│   │   └── recent-activity.tsx      # Activity feed
│   │
│   ├── BadgeCard.tsx                # Badge display with animation
│   ├── GoalCard.tsx                 # Goal card with progress
│   ├── Goals.tsx                    # Goals page/section
│   ├── GoalSettingModal.tsx         # Create/edit goal modal
│   ├── GoalAchievedModal.tsx        # Achievement celebration modal
│   ├── Dashboard.tsx                # Main dashboard layout
│   ├── Profile.tsx                  # User profile page
│   └── Sidebar.tsx                  # Navigation sidebar
│
├── services/
│   ├── gamification.service.ts      # Badges, goals, leaderboard API
│   ├── exams.service.ts             # Exam-related API
│   └── index.ts                     # Service exports
│
├── utils/
│   └── goalService.ts               # Local goal utilities
│
├── hooks/                           # Custom React hooks
├── store/                           # Zustand stores
└── types/                           # TypeScript interfaces
```

---

## 📋 Task-to-Component Mapping

### FE-028: Dashboard API Service
**Approach:** Extend existing services

| Existing | Action |
|----------|--------|
| `services/gamification.service.ts` | Add dashboard endpoints |
| `services/exams.service.ts` | Add stats endpoints |

**New files to create:**
```
services/
├── dashboard.service.ts      # NEW - Dashboard API calls
└── analytics.service.ts      # NEW - Analytics API calls
```

---

### FE-029: Dashboard Layout
**Approach:** Use existing layout

| Existing Component | Status |
|-------------------|--------|
| `components/Dashboard.tsx` | ✅ Already exists |
| `components/Sidebar.tsx` | ✅ Already exists |
| `components/dashboard/*` | ✅ Child components exist |

**Action:** 
- Integrate data fetching với React Query
- Wire up components với real API data

---

### FE-030: Stats Overview Cards
**Approach:** Enhance existing component

| Existing Component | Path |
|-------------------|------|
| `DashboardStats` | `components/dashboard/dashboard-stats.tsx` |

**Current:** Static mock data
**Action:** Replace với API data từ `/api/dashboard/stats`

```typescript
// BEFORE (current)
const stats: Stat[] = [
  { title: "Bài tập đã hoàn thành", value: 156, ... }  // hardcoded
];

// AFTER (integrate API)
const { data: stats } = useQuery({
  queryKey: ['dashboard-stats'],
  queryFn: () => dashboardService.getStats(),
});
```

---

### FE-031: Progress Charts
**Approach:** Enhance existing component

| Existing Component | Path |
|-------------------|------|
| `LearningProgress` | `components/dashboard/learning-progress.tsx` |
| `chart.tsx` | `components/ui/chart.tsx` (Recharts) |

**Action:**
- Add skill radar chart
- Add score trend line chart
- Fetch data từ `/api/analytics/skills`, `/api/analytics/trends`

---

### FE-032: Activity Calendar
**Approach:** Create new component (không có sẵn)

**New file:** `components/dashboard/activity-calendar.tsx`

**Use existing:**
- `components/ui/card.tsx` for container
- date-fns for date handling

---

### FE-033: Achievement Badges
**Approach:** Use existing components

| Existing Component | Path |
|-------------------|------|
| `BadgeCard` | `components/BadgeCard.tsx` |
| `BadgeUnlockedModal` | `UI-Template/components/BadgeUnlockedModal.tsx` |

**API Service:** `services/gamification.service.ts` đã có:
- `getBadges()` 
- `getEarnedBadges()`
- `checkBadgeUnlock()`

**Action:** Wire up với React Query

---

### FE-034: Streak Display
**Approach:** Create small component (không có sẵn)

**New file:** `components/dashboard/streak-display.tsx`

**Use existing:**
- `components/ui/card.tsx`
- `components/ui/progress.tsx`

---

### FE-035: Leaderboard Component
**Approach:** Create new or check UI-Template

**Check:** `UI-Template/components/` có thể có leaderboard design

**API Service:** `services/gamification.service.ts` đã có:
- `getLeaderboard(type, period)`

---

### FE-036: Learning Roadmap
**Approach:** Check UI-Template for design

**Possible existing:**
- `UI-Template/components/PracticeHome.tsx` - có roadmap section?
- `components/dashboard/quick-actions.tsx` - có suggestions?

---

### FE-037: Recent Activity Feed
**Approach:** Use existing component

| Existing Component | Path |
|-------------------|------|
| `RecentActivity` | `components/dashboard/recent-activity.tsx` |

**Current:** Static mock data
**Action:** Replace với API data từ `/api/activity/recent`

---

## 🔧 Implementation Pattern

### Standard Pattern cho tất cả FE tasks:

```typescript
// 1. API Service (services/xxx.service.ts)
export const dashboardService = {
  getStats: () => apiClient.get('/dashboard/stats'),
  // ...
};

// 2. React Query Hook (hooks/useDashboard.ts)
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardService.getStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// 3. Component Integration
// Modify existing component to use hook instead of static data
export function DashboardStats() {
  const { data, isLoading, error } = useDashboardStats();
  
  if (isLoading) return <StatsSkeleton />;
  if (error) return <ErrorCard message={error.message} />;
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {data.stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
```

---

## ✅ Checklist cho AI

Khi implement FE tasks:

- [ ] **CHECK** component đã tồn tại chưa (xem mapping trên)
- [ ] **DON'T** viết lại UI nếu đã có
- [ ] **DO** tạo React Query hooks
- [ ] **DO** tạo/extend API services
- [ ] **DO** replace mock data với real API
- [ ] **DO** thêm loading/error states
- [ ] **PRESERVE** existing styling và animations

---

## 📚 Related Files

| File | Description |
|------|-------------|
| [FE/README.md](../../../../../FE/README.md) | FE project documentation |
| [services/index.ts](../../../../../FE/src/services/index.ts) | Service exports |
| [lib/axios.ts](../../../../../FE/src/lib/axios.ts) | API client config |

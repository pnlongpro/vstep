# 🎨 FE Component Mapping - Global

> **Hướng dẫn cho AI: Sử dụng components đã có sẵn thay vì viết mới**
>
> Updated: 17/12/2024

---

## ⚠️ QUAN TRỌNG

```
❌ KHÔNG viết lại UI components đã có sẵn
✅ CHỈ tích hợp API và data fetching
✅ Extend/modify components hiện có nếu cần
```

---

## 📁 Project Structure Overview

```
FE/src/
├── app/                    # Next.js 14 App Router
│   ├── (auth)/            # Auth pages (login, register, forgot-password)
│   ├── (dashboard)/       # Protected dashboard pages
│   └── (public)/          # Public pages
│
├── components/            # Reusable UI Components
│   ├── ui/               # 45+ shadcn/ui base components
│   ├── dashboard/        # Dashboard-specific
│   ├── reading/          # Reading skill components
│   ├── listening/        # Listening skill components
│   ├── writing/          # Writing skill components
│   ├── speaking/         # Speaking skill components
│   ├── exam/             # Exam interface components
│   ├── admin/            # Admin panel components
│   ├── teacher/          # Teacher portal components
│   ├── student/          # Student-specific components
│   └── layout/           # Layout components
│
├── features/             # Feature-based modules
│   ├── auth/             # Auth logic (api, hooks, store, types)
│   ├── exam/             # Exam logic
│   ├── chat/             # Chat/AI assistant
│   └── payment/          # Payment logic
│
├── services/             # API service classes
├── hooks/                # Custom React hooks
├── store/                # Zustand stores
├── lib/                  # Utilities (axios, utils)
├── types/                # TypeScript types
└── constants/            # App constants
```

---

## 📋 Sprint 01-02: Auth Module

### Existing Components & Features

| Task | Existing Files | Action |
|------|---------------|--------|
| FE-001 | `features/auth/auth.api.ts` | ✅ Extend if needed |
| FE-002 | `app/(auth)/login/page.tsx` | ✅ Already exists |
| FE-003 | `app/(auth)/register/page.tsx` | ✅ Already exists |
| FE-004 | `app/(auth)/forgot-password/page.tsx` | ✅ Already exists |
| FE-005 | `middleware.ts` | ✅ Check existing logic |
| FE-006 | `features/auth/auth.store.ts` | ✅ Already exists |
| FE-007 | Check if OAuth buttons exist | 🔍 Verify |

### Auth Feature Structure
```typescript
// features/auth/
├── auth.api.ts      // API calls (login, register, etc.)
├── auth.hooks.ts    // React hooks (useAuth, useLogin, etc.)
├── auth.store.ts    // Zustand store
└── auth.types.ts    // TypeScript interfaces
```

---

## 📋 Sprint 03-04: Practice Module

### Existing Components

| Component | Path | Status |
|-----------|------|--------|
| ReadingExercise | `components/reading/ReadingExercise.tsx` | ✅ Exists |
| ReadingResult | `components/reading/ReadingResult.tsx` | ✅ Exists |
| ListeningExercise | `components/listening/ListeningExercise.tsx` | ✅ Exists |
| ListeningResult | `components/listening/ListeningResult.tsx` | ✅ Exists |
| WritingExercise | `components/writing/WritingExercise.tsx` | ✅ Exists |
| WritingResult | `components/writing/WritingResult.tsx` | ✅ Exists |
| SpeakingExercise | `components/speaking/SpeakingExercise.tsx` | ✅ Exists |
| SpeakingResult | `components/speaking/SpeakingResult.tsx` | ✅ Exists |
| PracticeHome | `components/PracticeHome.tsx` | ✅ Exists |

### Practice Pages
```
app/(dashboard)/practice/
├── page.tsx              # Practice home
├── reading/
├── listening/
├── writing/
└── speaking/
```

### Task Mapping

| Task | Action |
|------|--------|
| FE-008 | Create `services/practice.service.ts` |
| FE-009 | Enhance existing Exercise components with API |
| FE-010 | Connect `ReadingExercise` với real API |
| FE-011 | Connect `ListeningExercise` với real API |
| FE-013 | Connect `WritingExercise` với real API |
| FE-014 | Connect Result components với API |
| FE-015 | Create practice Zustand store |
| FE-016 | Enhance `PracticeHome` với API data |
| FE-017 | Add level selection logic |
| FE-018 | Create practice history page |

---

## 📋 Sprint 05-06: Exam Module

### Existing Components

| Component | Path | Status |
|-----------|------|--------|
| ExamInterface | `components/exam/ExamInterface.tsx` | ✅ Exists |
| PreExamInstructions | `components/exam/PreExamInstructions.tsx` | ✅ Exists |
| SkillTransitionModal | `components/exam/SkillTransitionModal.tsx` | ✅ Exists |
| exam-room | `components/exam/exam-room.tsx` | ✅ Exists |
| AudioLevelMeter | `components/exam/AudioLevelMeter.tsx` | ✅ Exists |
| PreparationTimer | `components/exam/PreparationTimer.tsx` | ✅ Exists |

### Exam Feature Structure
```typescript
// features/exam/
├── exam.api.ts      // API calls
├── exam.hooks.ts    // React hooks
└── exam.types.ts    // TypeScript interfaces
```

### Exam Pages
```
app/(dashboard)/exams/
├── page.tsx              # Exam list/selection
├── [examId]/
│   ├── page.tsx          # Exam details
│   ├── session/          # Active exam session
│   └── result/           # Exam result
```

### Task Mapping

| Task | Action |
|------|--------|
| FE-020 | Extend `features/exam/exam.api.ts` |
| FE-021 | Connect exam list page với API |
| FE-022 | Enhance `exam-room.tsx` layout |
| FE-023 | Timer logic (check if exists in ExamInterface) |
| FE-024 | Navigation logic trong ExamInterface |
| FE-025 | Submission flow trong exam.hooks.ts |
| FE-026 | Create/enhance result page |
| FE-027 | Certificate download logic |

---

## 📋 Sprint 07-08: Dashboard Module

### Existing Components

| Component | Path | Status |
|-----------|------|--------|
| Dashboard | `components/Dashboard.tsx` | ✅ Exists |
| DashboardStats | `components/dashboard/dashboard-stats.tsx` | ✅ Exists |
| LearningProgress | `components/dashboard/learning-progress.tsx` | ✅ Exists |
| QuickActions | `components/dashboard/quick-actions.tsx` | ✅ Exists |
| RecentActivity | `components/dashboard/recent-activity.tsx` | ✅ Exists |
| BadgeCard | `components/BadgeCard.tsx` | ✅ Exists |
| GoalCard | `components/GoalCard.tsx` | ✅ Exists |
| Goals | `components/Goals.tsx` | ✅ Exists |
| GoalSettingModal | `components/GoalSettingModal.tsx` | ✅ Exists |
| GoalAchievedModal | `components/GoalAchievedModal.tsx` | ✅ Exists |
| Profile | `components/Profile.tsx` | ✅ Exists |
| NotificationsPanel | `components/NotificationsPanel.tsx` | ✅ Exists |

### Dashboard Pages
```
app/(dashboard)/
├── home/page.tsx           # Main dashboard
├── achievements/page.tsx   # Badges & achievements
├── goals/page.tsx          # Goals management
├── profile/page.tsx        # User profile
└── notifications/page.tsx  # Notifications
```

### Services
```typescript
// services/
├── gamification.service.ts  // ✅ Exists - Badges, Goals, Leaderboard
├── exams.service.ts         // ✅ Exists
└── notifications.service.ts // ✅ Exists
```

### Task Mapping

| Task | Existing | Action |
|------|----------|--------|
| FE-028 | `gamification.service.ts` | Extend với dashboard endpoints |
| FE-029 | `Dashboard.tsx` | Wire up với API |
| FE-030 | `dashboard-stats.tsx` | Replace mock data |
| FE-031 | `learning-progress.tsx` | Add charts, API data |
| FE-032 | ❌ None | Create activity-calendar.tsx |
| FE-033 | `BadgeCard.tsx` | Wire up với API |
| FE-034 | ❌ None | Create streak-display.tsx |
| FE-035 | `gamification.service.ts` có | Create leaderboard.tsx |
| FE-036 | Check UI-Template | Create/enhance roadmap |
| FE-037 | `recent-activity.tsx` | Replace mock data |

---

## 🎨 UI Components (shadcn/ui)

### Available Base Components
```
components/ui/
├── accordion.tsx      ├── input.tsx
├── alert-dialog.tsx   ├── label.tsx
├── alert.tsx          ├── navigation-menu.tsx
├── avatar.tsx         ├── pagination.tsx
├── badge.tsx          ├── popover.tsx
├── breadcrumb.tsx     ├── progress.tsx
├── button.tsx         ├── radio-group.tsx
├── calendar.tsx       ├── scroll-area.tsx
├── card.tsx           ├── select.tsx
├── carousel.tsx       ├── separator.tsx
├── chart.tsx          ├── sheet.tsx
├── checkbox.tsx       ├── sidebar.tsx
├── collapsible.tsx    ├── skeleton.tsx
├── command.tsx        ├── slider.tsx
├── context-menu.tsx   ├── sonner.tsx (toast)
├── dialog.tsx         ├── switch.tsx
├── drawer.tsx         ├── table.tsx
├── dropdown-menu.tsx  ├── tabs.tsx
├── form.tsx           ├── textarea.tsx
├── hover-card.tsx     ├── toggle.tsx
├── input-otp.tsx      └── tooltip.tsx
```

### Usage Pattern
```tsx
// Import từ @/components/ui/
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
```

---

## 🔧 Standard Implementation Pattern

### 1. API Service Pattern
```typescript
// services/dashboard.service.ts
import { apiClient } from '@/lib/axios';
import { DashboardStats, UserActivity } from '@/types/dashboard';

export const dashboardService = {
  getStats: () => 
    apiClient.get<DashboardStats>('/dashboard/stats'),
    
  getActivities: (limit = 10) => 
    apiClient.get<UserActivity[]>('/dashboard/activities', { params: { limit } }),
};
```

### 2. React Query Hook Pattern
```typescript
// hooks/useDashboard.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardService.getStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useActivities(limit = 10) {
  return useQuery({
    queryKey: ['dashboard', 'activities', limit],
    queryFn: () => dashboardService.getActivities(limit),
  });
}
```

### 3. Component Integration Pattern
```tsx
// components/dashboard/dashboard-stats.tsx
"use client";

import { useDashboardStats } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardStats() {
  const { data, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorCard message="Không thể tải thống kê" />;
  }

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

## 📚 UI-Template Reference

UI-Template folder chứa các component designs có thể tham khảo:

```
UI-Template/components/
├── AdminDashboard.tsx
├── AIGrading.tsx
├── AssignmentsPage.tsx
├── BadgeUnlockedModal.tsx
├── ExamRoom.tsx
├── History.tsx
├── Leaderboard (check if exists)
├── ListeningFullTest.tsx
├── ReadingFullTest.tsx
├── SpeakingFullTest.tsx
├── Statistics.tsx
├── WritingFullTest.tsx
└── ...
```

**Usage:** Tham khảo design/logic từ UI-Template, nhưng implement trong `FE/src/components/`

---

## ✅ AI Checklist

Khi implement bất kỳ FE task nào:

1. [ ] **Kiểm tra file mapping này** để xem component đã tồn tại chưa
2. [ ] **KHÔNG viết lại** component nếu đã có
3. [ ] **Tạo/extend API service** trong `services/`
4. [ ] **Tạo React Query hook** trong `hooks/`
5. [ ] **Update component** để sử dụng hook thay vì mock data
6. [ ] **Thêm loading state** với Skeleton component
7. [ ] **Thêm error handling** với error boundary/card
8. [ ] **Preserve styling** - không thay đổi TailwindCSS classes
9. [ ] **Preserve animations** - giữ nguyên Framer Motion
10. [ ] **Test với TypeScript** - đảm bảo types đúng

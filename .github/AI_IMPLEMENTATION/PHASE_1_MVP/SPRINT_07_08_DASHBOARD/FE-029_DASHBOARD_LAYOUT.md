# Task: FE-029 - Dashboard Layout

## Task Info

| Field | Value |
|-------|-------|
| **Task ID** | FE-029 |
| **Task Name** | Dashboard Layout |
| **Module** | Dashboard & Analytics |
| **Sprint** | 07-08 |
| **Estimated Hours** | 4h |
| **Priority** | P0 (Critical) |
| **Dependencies** | FE-028 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Existing components:**
> - `FE/src/components/Dashboard.tsx` - ✅ Main dashboard layout
> - `FE/src/components/Sidebar.tsx` - ✅ Navigation sidebar
> - `FE/src/app/(dashboard)/layout.tsx` - ✅ Dashboard route layout
> - `FE/src/app/(dashboard)/home/page.tsx` - Dashboard home page

**Action:** Wire up existing components với API data, KHÔNG viết lại UI.

---

## Description

Integrate dashboard layout với real API:
- Tạo React Query hooks cho dashboard data
- Wire up existing components
- Add loading states với Skeleton
- Add error handling

---

## Acceptance Criteria

- [ ] Dashboard layout sử dụng real API data
- [ ] Loading states với Skeleton components
- [ ] Error boundaries cho từng section
- [ ] Data caching với React Query
- [ ] Auto-refresh data

---

## Implementation

### 1. Dashboard Hooks

```typescript
// src/hooks/useDashboard.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';
import { analyticsService } from '@/services/analytics.service';
import { progressService } from '@/services/progress.service';
import { streakService } from '@/services/streak.service';
import { gamificationService } from '@/services/gamification.service';
import type {
  DashboardStatsResponse,
  UserActivity,
  ActivityCalendarDay,
  SkillBreakdown,
  WeeklySummary,
  UserStreak,
  LeaderboardResponse,
} from '@/types/dashboard.types';

// ==================== Query Keys ====================
export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  activities: (limit?: number) => [...dashboardKeys.all, 'activities', limit] as const,
  calendar: (start: string, end: string) => [...dashboardKeys.all, 'calendar', start, end] as const,
};

export const analyticsKeys = {
  all: ['analytics'] as const,
  trends: (days?: number) => [...analyticsKeys.all, 'trends', days] as const,
  skills: () => [...analyticsKeys.all, 'skills'] as const,
  weekly: () => [...analyticsKeys.all, 'weekly'] as const,
  insights: () => [...analyticsKeys.all, 'insights'] as const,
};

export const progressKeys = {
  all: ['progress'] as const,
  goals: (status?: string) => [...progressKeys.all, 'goals', status] as const,
  roadmap: () => [...progressKeys.all, 'roadmap'] as const,
  recommendations: () => [...progressKeys.all, 'recommendations'] as const,
  snapshot: () => [...progressKeys.all, 'snapshot'] as const,
};

export const streakKeys = {
  all: ['streak'] as const,
  current: () => [...streakKeys.all, 'current'] as const,
  history: () => [...streakKeys.all, 'history'] as const,
  milestones: () => [...streakKeys.all, 'milestones'] as const,
};

export const leaderboardKeys = {
  all: ['leaderboard'] as const,
  list: (period: string, type: string) => [...leaderboardKeys.all, period, type] as const,
  myRank: (period: string, type: string) => [...leaderboardKeys.all, 'myRank', period, type] as const,
};

// ==================== Dashboard Hooks ====================

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: () => dashboardService.getStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useRecentActivities(limit = 10) {
  return useQuery({
    queryKey: dashboardKeys.activities(limit),
    queryFn: () => dashboardService.getRecentActivities(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useActivityCalendar(startDate: string, endDate: string) {
  return useQuery({
    queryKey: dashboardKeys.calendar(startDate, endDate),
    queryFn: () => dashboardService.getActivityCalendar(startDate, endDate),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// ==================== Analytics Hooks ====================

export function useScoreTrends(days = 30) {
  return useQuery({
    queryKey: analyticsKeys.trends(days),
    queryFn: () => analyticsService.getScoreTrends(days),
    staleTime: 10 * 60 * 1000,
  });
}

export function useSkillBreakdown() {
  return useQuery({
    queryKey: analyticsKeys.skills(),
    queryFn: () => analyticsService.getSkillBreakdown(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useWeeklySummary() {
  return useQuery({
    queryKey: analyticsKeys.weekly(),
    queryFn: () => analyticsService.getWeeklySummary(),
    staleTime: 5 * 60 * 1000,
  });
}

export function usePerformanceInsights() {
  return useQuery({
    queryKey: analyticsKeys.insights(),
    queryFn: () => analyticsService.getInsights(),
    staleTime: 10 * 60 * 1000,
  });
}

// ==================== Progress Hooks ====================

export function useGoals(status?: string) {
  return useQuery({
    queryKey: progressKeys.goals(status),
    queryFn: () => progressService.getGoals(status),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRoadmap() {
  return useQuery({
    queryKey: progressKeys.roadmap(),
    queryFn: () => progressService.getRoadmap(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRecommendations(limit = 5) {
  return useQuery({
    queryKey: progressKeys.recommendations(),
    queryFn: () => progressService.getRecommendations(limit),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProgressSnapshot() {
  return useQuery({
    queryKey: progressKeys.snapshot(),
    queryFn: () => progressService.getProgressSnapshot(),
    staleTime: 5 * 60 * 1000,
  });
}

// ==================== Streak Hooks ====================

export function useCurrentStreak() {
  return useQuery({
    queryKey: streakKeys.current(),
    queryFn: () => streakService.getCurrentStreak(),
    staleTime: 1 * 60 * 1000, // 1 minute - streaks need to be fresh
  });
}

export function useStreakHistory(limit = 30) {
  return useQuery({
    queryKey: streakKeys.history(),
    queryFn: () => streakService.getStreakHistory(limit),
    staleTime: 5 * 60 * 1000,
  });
}

export function usePurchaseFreeze() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => streakService.purchaseFreeze(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: streakKeys.current() });
    },
  });
}

export function useRecoverStreak() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => streakService.recoverStreak(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: streakKeys.current() });
    },
  });
}

// ==================== Leaderboard Hooks ====================

export function useLeaderboard(
  period: 'weekly' | 'monthly' | 'all_time' = 'weekly',
  type: 'xp' | 'score' | 'streak' = 'xp',
) {
  return useQuery({
    queryKey: leaderboardKeys.list(period, type),
    queryFn: () => gamificationService.getLeaderboard(period, type),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMyRank(
  period: 'weekly' | 'monthly' | 'all_time' = 'weekly',
  type: 'xp' | 'score' | 'streak' = 'xp',
) {
  return useQuery({
    queryKey: leaderboardKeys.myRank(period, type),
    queryFn: () => gamificationService.getMyRank(period, type),
    staleTime: 5 * 60 * 1000,
  });
}

// ==================== Composite Hook for Dashboard ====================

export function useDashboardData() {
  const stats = useDashboardStats();
  const activities = useRecentActivities(5);
  const skills = useSkillBreakdown();
  const streak = useCurrentStreak();
  const weekly = useWeeklySummary();

  return {
    stats,
    activities,
    skills,
    streak,
    weekly,
    isLoading: stats.isLoading || activities.isLoading || skills.isLoading,
    isError: stats.isError || activities.isError || skills.isError,
  };
}
```

### 2. Dashboard Home Page Update

```tsx
// src/app/(dashboard)/home/page.tsx
// ⚠️ Update existing page to use hooks

"use client";

import { Suspense } from "react";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { LearningProgress } from "@/components/dashboard/learning-progress";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { StreakDisplay } from "@/components/dashboard/streak-display";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export default function DashboardHomePage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Chào mừng trở lại! Đây là tổng quan tiến độ học tập của bạn.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <ErrorBoundary fallback={<StatsErrorCard />}>
        <Suspense fallback={<StatsSkeleton />}>
          <DashboardStats />
        </Suspense>
      </ErrorBoundary>

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Left Column - Charts */}
        <div className="col-span-4 space-y-6">
          <ErrorBoundary fallback={<ChartErrorCard />}>
            <Suspense fallback={<ChartSkeleton />}>
              <LearningProgress />
            </Suspense>
          </ErrorBoundary>
        </div>

        {/* Right Column - Activity & Streak */}
        <div className="col-span-3 space-y-6">
          <ErrorBoundary fallback={<StreakErrorCard />}>
            <Suspense fallback={<StreakSkeleton />}>
              <StreakDisplay />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary fallback={<ActivityErrorCard />}>
            <Suspense fallback={<ActivitySkeleton />}>
              <RecentActivity />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}

// Skeleton components
function StatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return <div className="h-80 rounded-lg bg-muted animate-pulse" />;
}

function StreakSkeleton() {
  return <div className="h-40 rounded-lg bg-muted animate-pulse" />;
}

function ActivitySkeleton() {
  return <div className="h-64 rounded-lg bg-muted animate-pulse" />;
}

// Error cards
function StatsErrorCard() {
  return (
    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
      <p className="text-sm text-destructive">Không thể tải thống kê</p>
    </div>
  );
}

function ChartErrorCard() {
  return (
    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
      <p className="text-sm text-destructive">Không thể tải biểu đồ</p>
    </div>
  );
}

function StreakErrorCard() {
  return (
    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
      <p className="text-sm text-destructive">Không thể tải streak</p>
    </div>
  );
}

function ActivityErrorCard() {
  return (
    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
      <p className="text-sm text-destructive">Không thể tải hoạt động</p>
    </div>
  );
}
```

### 3. Error Boundary Component

```tsx
// src/components/ui/error-boundary.tsx
"use client";

import { Component, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <AlertCircle className="h-10 w-10 text-destructive mb-3" />
            <h3 className="font-semibold text-destructive mb-1">
              Đã xảy ra lỗi
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {this.state.error?.message || "Vui lòng thử lại sau"}
            </p>
            <Button variant="outline" size="sm" onClick={this.handleRetry}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Thử lại
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
```

### 4. Dashboard Skeleton Component

```tsx
// src/components/dashboard/dashboard-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Stats skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main grid skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>

        <div className="col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-36" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
}

export function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  );
}

export function ActivitySkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-36" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
```

---

## File Structure

```
FE/src/
├── hooks/
│   └── useDashboard.ts          # NEW - Dashboard React Query hooks
│
├── components/
│   ├── ui/
│   │   └── error-boundary.tsx   # NEW - Error boundary
│   └── dashboard/
│       └── dashboard-skeleton.tsx # NEW - Skeleton components
│
├── app/(dashboard)/
│   └── home/
│       └── page.tsx             # UPDATE - Wire up with hooks
```

---

## Next Task

Continue with **FE-030: Stats Overview Cards** - Enhance stats cards with real API data.

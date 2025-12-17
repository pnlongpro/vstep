# Task: FE-030 - Stats Overview Cards

## Task Info

| Field | Value |
|-------|-------|
| **Task ID** | FE-030 |
| **Task Name** | Stats Overview Cards |
| **Module** | Dashboard & Analytics |
| **Sprint** | 07-08 |
| **Estimated Hours** | 4h |
| **Priority** | P0 (Critical) |
| **Dependencies** | FE-029 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Existing component:**
> - `FE/src/components/dashboard/dashboard-stats.tsx` - ✅ Đã có UI hoàn chỉnh

**Action:** Replace mock data với real API data, KHÔNG viết lại UI.

---

## Description

Enhance DashboardStats component:
- Thay thế static mock data bằng API data
- Sử dụng React Query hooks
- Add loading skeleton
- Add error state

---

## Acceptance Criteria

- [ ] Stats cards hiển thị real data từ API
- [ ] Loading state với skeleton
- [ ] Error handling
- [ ] Comparison với tuần trước
- [ ] Animated number transitions

---

## Implementation

### 1. Update DashboardStats Component

```tsx
// src/components/dashboard/dashboard-stats.tsx
// ⚠️ UPDATE existing file - replace mock data with API

"use client";

import { TrendingUp, TrendingDown, BookOpen, Target, Trophy, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "@/hooks/useDashboard";
import { cn } from "@/lib/utils";

interface StatCardData {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

export function DashboardStats() {
  const { data, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return <StatsLoadingSkeleton />;
  }

  if (error) {
    return <StatsError message={error.message} />;
  }

  if (!data) {
    return null;
  }

  // Map API data to card format
  const stats: StatCardData[] = [
    {
      title: "Bài tập đã hoàn thành",
      value: data.stats.practiceCompleted + data.stats.testsCompleted,
      change: data.cards?.[0]?.change || 0,
      changeLabel: "so với tuần trước",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Điểm trung bình",
      value: `${data.stats.averageScore.toFixed(1)}/10`,
      change: data.cards?.[1]?.change || 0,
      changeLabel: "so với tuần trước",
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Chuỗi học liên tục",
      value: `${data.stats.currentStreak} ngày`,
      change: data.stats.currentStreak - (data.cards?.[2]?.change || 0),
      changeLabel: "so với kỷ lục",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Thời gian học",
      value: `${data.stats.totalStudyHours}h`,
      change: data.cards?.[3]?.change || 0,
      changeLabel: "so với tuần trước",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}

function StatCard({ title, value, change, changeLabel, icon: Icon, color, bgColor }: StatCardData) {
  const isPositive = change >= 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-lg", bgColor)}>
          <Icon className={cn("h-4 w-4", color)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
          {isPositive ? (
            <TrendingUp className="h-3 w-3 text-green-600" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-600" />
          )}
          <span className={isPositive ? "text-green-600" : "text-red-600"}>
            {isPositive ? "+" : ""}{typeof change === 'number' ? change.toFixed(1) : change}
          </span>
          <span>{changeLabel}</span>
        </p>
      </CardContent>
    </Card>
  );
}

function StatsLoadingSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-20 mb-2" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StatsError({ message }: { message: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="col-span-full border-destructive/50 bg-destructive/10">
        <CardContent className="flex items-center justify-center p-6">
          <p className="text-sm text-destructive">
            Không thể tải thống kê: {message}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 2. Enhanced Stats with Animations

```tsx
// src/components/dashboard/animated-stat-card.tsx
// Optional: Animated number transitions

"use client";

import { useEffect, useRef, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AnimatedStatCardProps {
  title: string;
  value: number;
  suffix?: string;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  decimals?: number;
}

export function AnimatedStatCard({
  title,
  value,
  suffix = "",
  change,
  changeLabel,
  icon: Icon,
  color,
  bgColor,
  decimals = 0,
}: AnimatedStatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const prevValue = useRef(0);
  const isPositive = change >= 0;

  useEffect(() => {
    const start = prevValue.current;
    const end = value;
    const duration = 1000; // 1 second
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = start + (end - start) * easeOutQuart;
      
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        prevValue.current = end;
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-lg", bgColor)}>
          <Icon className={cn("h-4 w-4", color)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tabular-nums">
          {displayValue.toFixed(decimals)}{suffix}
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
          {isPositive ? (
            <TrendingUp className="h-3 w-3 text-green-600" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-600" />
          )}
          <span className={cn(
            "font-medium",
            isPositive ? "text-green-600" : "text-red-600"
          )}>
            {isPositive ? "+" : ""}{change.toFixed(decimals)}
          </span>
          <span>{changeLabel}</span>
        </p>
      </CardContent>
    </Card>
  );
}
```

### 3. XP & Level Progress Card

```tsx
// src/components/dashboard/xp-progress-card.tsx
"use client";

import { Star, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useDashboardStats } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";

export function XpProgressCard() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32 mb-3" />
          <Skeleton className="h-2 w-full mb-2" />
          <Skeleton className="h-4 w-48" />
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const { totalXp, currentLevel, xpToNextLevel } = data.stats;
  const xpForCurrentLevel = calculateXpForLevel(currentLevel);
  const progress = ((totalXp - xpForCurrentLevel) / (xpToNextLevel - xpForCurrentLevel)) * 100;

  return (
    <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Cấp độ</CardTitle>
        <Star className="h-4 w-4 text-yellow-500" />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">Level {currentLevel}</span>
          <span className="text-sm text-muted-foreground">
            {totalXp.toLocaleString()} XP
          </span>
        </div>
        
        <div className="mt-3 space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-yellow-500" />
              {(xpToNextLevel - totalXp).toLocaleString()} XP đến Level {currentLevel + 1}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function - should match backend formula
function calculateXpForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.round(100 * level * Math.pow(1.5, level - 1));
}
```

### 4. Weekly Summary Card

```tsx
// src/components/dashboard/weekly-summary-card.tsx
"use client";

import { Calendar, Clock, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWeeklySummary } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function WeeklySummaryCard() {
  const { data, isLoading } = useWeeklySummary();

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const items = [
    {
      label: "Thời gian học",
      value: `${Math.round(data.studyMinutes / 60)}h ${data.studyMinutes % 60}m`,
      change: data.comparison.studyMinutes,
      icon: Clock,
    },
    {
      label: "Bài thi hoàn thành",
      value: data.testsCompleted,
      change: data.comparison.testsCompleted,
      icon: Target,
    },
    {
      label: "Điểm trung bình",
      value: data.averageScore.toFixed(1),
      change: data.comparison.averageScore,
      icon: TrendingUp,
    },
    {
      label: "XP kiếm được",
      value: data.xpEarned.toLocaleString(),
      change: 0,
      icon: Calendar,
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Tuần này
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => {
          const Icon = item.icon;
          const isPositive = item.change >= 0;
          
          return (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{item.value}</span>
                {item.change !== 0 && (
                  <span className={cn(
                    "text-xs",
                    isPositive ? "text-green-600" : "text-red-600"
                  )}>
                    {isPositive ? "+" : ""}{item.change}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
```

---

## File Structure

```
FE/src/components/dashboard/
├── dashboard-stats.tsx      # UPDATE - Replace mock with API
├── animated-stat-card.tsx   # NEW - Animated numbers
├── xp-progress-card.tsx     # NEW - XP/Level display
└── weekly-summary-card.tsx  # NEW - Weekly stats summary
```

---

## Next Task

Continue with **FE-031: Progress Charts** - Implement skill charts and score trends.

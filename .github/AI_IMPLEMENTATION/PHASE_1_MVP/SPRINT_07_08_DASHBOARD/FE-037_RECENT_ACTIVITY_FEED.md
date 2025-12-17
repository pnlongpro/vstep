# Task: FE-037 - Recent Activity Feed

## Task Info

| Field | Value |
|-------|-------|
| **Task ID** | FE-037 |
| **Task Name** | Recent Activity Feed |
| **Module** | Dashboard & Analytics |
| **Sprint** | 07-08 |
| **Estimated Hours** | 3h |
| **Priority** | P2 (Medium) |
| **Dependencies** | FE-028, FE-029 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Existing components:**
> - `FE/src/components/dashboard/recent-activity.tsx` - ✅ Đã có component, cần wire up API
> - `FE/src/hooks/useDashboard.ts` - ✅ Có `useRecentActivity` hook

**Action:** Update existing `recent-activity.tsx` để sử dụng API thay vì mock data.

---

## Description

Display user's recent activities:
- Practice sessions completed
- Exams taken
- Achievements unlocked
- Streak milestones
- Infinite scroll for older activities

---

## Acceptance Criteria

- [ ] Update existing component với API data
- [ ] Activity type icons và styling
- [ ] Time ago formatting
- [ ] Infinite scroll/load more
- [ ] Empty state
- [ ] Loading skeleton

---

## Implementation

### 1. Activity Types

```typescript
// src/types/activity.types.ts
export type ActivityType = 
  | "practice_completed"
  | "exam_completed"
  | "achievement_unlocked"
  | "streak_milestone"
  | "level_up"
  | "goal_completed"
  | "badge_earned";

export type SkillType = "reading" | "listening" | "writing" | "speaking";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  createdAt: string;
  metadata: ActivityMetadata;
}

export interface ActivityMetadata {
  // For practice/exam
  skill?: SkillType;
  score?: number;
  duration?: number;
  
  // For achievement/badge
  badgeId?: string;
  badgeName?: string;
  xpEarned?: number;
  
  // For streak
  streakDays?: number;
  
  // For level up
  newLevel?: number;
  
  // Link to view details
  link?: string;
}

export interface ActivityResponse {
  activities: ActivityItem[];
  hasMore: boolean;
  nextCursor?: string;
}
```

### 2. Activity Hook

```typescript
// src/hooks/useActivity.ts
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { activityService } from "@/services/activity.service";
import type { ActivityResponse } from "@/types/activity.types";

export const activityKeys = {
  all: ["activity"] as const,
  list: (limit?: number) => [...activityKeys.all, "list", limit] as const,
  infinite: () => [...activityKeys.all, "infinite"] as const,
};

export function useRecentActivity(limit: number = 10) {
  return useQuery<ActivityResponse>({
    queryKey: activityKeys.list(limit),
    queryFn: () => activityService.getRecentActivity(limit),
    staleTime: 2 * 60 * 1000,
  });
}

export function useActivityInfinite() {
  return useInfiniteQuery({
    queryKey: activityKeys.infinite(),
    queryFn: ({ pageParam }) =>
      activityService.getRecentActivity(10, pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    initialPageParam: undefined as string | undefined,
    staleTime: 2 * 60 * 1000,
  });
}
```

### 3. Activity Service

```typescript
// src/services/activity.service.ts
import { apiClient } from "@/lib/api-client";
import type { ActivityResponse } from "@/types/activity.types";

class ActivityService {
  private baseUrl = "/users/me/activity";

  async getRecentActivity(limit: number = 10, cursor?: string): Promise<ActivityResponse> {
    const response = await apiClient.get<ActivityResponse>(this.baseUrl, {
      params: { limit, cursor },
    });
    return response.data;
  }
}

export const activityService = new ActivityService();
```

### 4. Update Recent Activity Component

```tsx
// src/components/dashboard/recent-activity.tsx
"use client";

import { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRecentActivity, useActivityInfinite } from "@/hooks/useActivity";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Activity,
  BookOpen,
  Headphones,
  Pen,
  Mic,
  Trophy,
  Flame,
  Target,
  Star,
  Award,
  TrendingUp,
  Clock,
  ChevronDown,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import type { ActivityType, SkillType, ActivityItem } from "@/types/activity.types";

// Activity type configuration
const activityConfig: Record<ActivityType, {
  icon: React.ElementType;
  color: string;
  bgColor: string;
}> = {
  practice_completed: {
    icon: Target,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  exam_completed: {
    icon: Trophy,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
  },
  achievement_unlocked: {
    icon: Award,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
  },
  streak_milestone: {
    icon: Flame,
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
  },
  level_up: {
    icon: TrendingUp,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  goal_completed: {
    icon: Target,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  badge_earned: {
    icon: Star,
    color: "text-amber-600",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
  },
};

const skillIcons: Record<SkillType, React.ElementType> = {
  reading: BookOpen,
  listening: Headphones,
  writing: Pen,
  speaking: Mic,
};

interface RecentActivityProps {
  variant?: "default" | "compact" | "full";
  limit?: number;
  showLoadMore?: boolean;
  className?: string;
}

export function RecentActivity({
  variant = "default",
  limit = 5,
  showLoadMore = false,
  className,
}: RecentActivityProps) {
  // Use infinite query for full variant, regular query otherwise
  const infiniteQuery = useActivityInfinite();
  const simpleQuery = useRecentActivity(limit);

  const { data, isLoading } = showLoadMore ? infiniteQuery : simpleQuery;

  if (isLoading) {
    return <RecentActivitySkeleton variant={variant} />;
  }

  // Flatten pages for infinite query
  const activities = showLoadMore
    ? infiniteQuery.data?.pages.flatMap((p) => p.activities) || []
    : (simpleQuery.data as any)?.activities || [];

  if (activities.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="py-8 text-center">
          <Activity className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-medium mb-2">Chưa có hoạt động</h3>
          <p className="text-sm text-muted-foreground">
            Bắt đầu luyện tập để xem hoạt động tại đây
          </p>
        </CardContent>
      </Card>
    );
  }

  if (variant === "compact") {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Hoạt động gần đây
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {activities.slice(0, limit).map((activity: ActivityItem) => (
              <ActivityItemCompact key={activity.id} activity={activity} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Hoạt động gần đây
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className={variant === "full" ? "h-[400px]" : ""}>
          <div className="space-y-3">
            {activities.map((activity: ActivityItem) => (
              <ActivityItemRow key={activity.id} activity={activity} />
            ))}
          </div>

          {/* Load more button */}
          {showLoadMore && infiniteQuery.hasNextPage && (
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                onClick={() => infiniteQuery.fetchNextPage()}
                disabled={infiniteQuery.isFetchingNextPage}
              >
                {infiniteQuery.isFetchingNextPage ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang tải...
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-2" />
                    Xem thêm
                  </>
                )}
              </Button>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Full activity row
function ActivityItemRow({ activity }: { activity: ActivityItem }) {
  const config = activityConfig[activity.type];
  const Icon = config.icon;
  const SkillIcon = activity.metadata.skill ? skillIcons[activity.metadata.skill] : null;

  const timeAgo = formatDistanceToNow(parseISO(activity.createdAt), {
    addSuffix: true,
    locale: vi,
  });

  const content = (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg transition-colors",
        activity.metadata.link && "hover:bg-muted/50 cursor-pointer"
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
          config.bgColor
        )}
      >
        <Icon className={cn("w-5 h-5", config.color)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-sm">{activity.title}</p>
            {activity.description && (
              <p className="text-xs text-muted-foreground">
                {activity.description}
              </p>
            )}
          </div>
          <span className="text-xs text-muted-foreground shrink-0">
            {timeAgo}
          </span>
        </div>

        {/* Metadata badges */}
        <div className="flex items-center gap-2 mt-1">
          {SkillIcon && (
            <Badge variant="outline" className="text-xs">
              <SkillIcon className="w-3 h-3 mr-1" />
              {activity.metadata.skill}
            </Badge>
          )}
          {activity.metadata.score !== undefined && (
            <Badge variant="secondary" className="text-xs">
              {activity.metadata.score}/10
            </Badge>
          )}
          {activity.metadata.xpEarned && (
            <Badge variant="secondary" className="text-xs">
              <Star className="w-3 h-3 mr-1 text-yellow-500" />
              +{activity.metadata.xpEarned} XP
            </Badge>
          )}
          {activity.metadata.streakDays && (
            <Badge variant="secondary" className="text-xs">
              <Flame className="w-3 h-3 mr-1 text-orange-500" />
              {activity.metadata.streakDays} ngày
            </Badge>
          )}
          {activity.metadata.duration && (
            <span className="text-xs text-muted-foreground flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {activity.metadata.duration} phút
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (activity.metadata.link) {
    return <Link href={activity.metadata.link}>{content}</Link>;
  }

  return content;
}

// Compact activity item
function ActivityItemCompact({ activity }: { activity: ActivityItem }) {
  const config = activityConfig[activity.type];
  const Icon = config.icon;

  const timeAgo = formatDistanceToNow(parseISO(activity.createdAt), {
    addSuffix: true,
    locale: vi,
  });

  return (
    <div className="flex items-center gap-2 py-1">
      <Icon className={cn("w-4 h-4 shrink-0", config.color)} />
      <span className="text-sm truncate flex-1">{activity.title}</span>
      <span className="text-xs text-muted-foreground shrink-0">{timeAgo}</span>
    </div>
  );
}

// Skeleton
function RecentActivitySkeleton({
  variant,
}: {
  variant: "default" | "compact" | "full";
}) {
  const count = variant === "compact" ? 3 : 5;

  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[...Array(count)].map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Export alias for backward compatibility
export default RecentActivity;
```

### 5. Activity Feed Page (Full View)

```tsx
// src/app/(dashboard)/activity/page.tsx
import { RecentActivity } from "@/components/dashboard/recent-activity";

export default function ActivityPage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Lịch sử hoạt động</h1>
      <RecentActivity variant="full" showLoadMore />
    </div>
  );
}
```

---

## File Structure

```
FE/src/
├── types/
│   └── activity.types.ts           # NEW - Activity types
│
├── services/
│   └── activity.service.ts         # NEW - Activity API
│
├── hooks/
│   └── useActivity.ts              # NEW - Activity hooks
│
├── components/dashboard/
│   └── recent-activity.tsx         # UPDATE - Use API data
│
├── app/(dashboard)/
│   └── activity/
│       └── page.tsx                # NEW - Full activity page
```

---

## Sprint 07-08 Complete! 🎉

**All tasks completed:**

### Backend (8/8)
- ✅ BE-028: User Stats Entity
- ✅ BE-029: Analytics Service
- ✅ BE-030: Progress Tracking Service  
- ✅ BE-031: Activity Log Service
- ✅ BE-032: Achievement Service
- ✅ BE-033: Streak Calculation
- ✅ BE-034: Leaderboard Service
- ✅ BE-035: Learning Roadmap Service

### Frontend (10/10)
- ✅ FE-028: Dashboard API Service
- ✅ FE-029: Dashboard Layout
- ✅ FE-030: Stats Overview Cards
- ✅ FE-031: Progress Charts
- ✅ FE-032: Activity Calendar
- ✅ FE-033: Achievement Badges
- ✅ FE-034: Streak Display
- ✅ FE-035: Leaderboard Component
- ✅ FE-036: Learning Roadmap
- ✅ FE-037: Recent Activity Feed

**Total: 18/18 tasks = 100%**

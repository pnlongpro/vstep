# Task: FE-035 - Leaderboard Component

## Task Info

| Field | Value |
|-------|-------|
| **Task ID** | FE-035 |
| **Task Name** | Leaderboard Component |
| **Module** | Dashboard & Analytics |
| **Sprint** | 07-08 |
| **Estimated Hours** | 4h |
| **Priority** | P1 (High) |
| **Dependencies** | FE-028, BE-034 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Existing:**
> - `FE/src/services/gamification.service.ts` - ✅ Đã có `getLeaderboard()` method
> - `UI-Template/components/Statistics.tsx` - Có thể tham khảo leaderboard UI

**Action:** Tạo leaderboard component mới với tabs, filters, và user highlighting.

---

## Description

Display rankings:
- Multiple leaderboard types (XP, Score, Streak)
- Time period filters (Daily, Weekly, Monthly, All-time)
- Level filters (A2, B1, B2, C1)
- Current user highlighting
- Top 3 showcase with special styling

---

## Acceptance Criteria

- [ ] Leaderboard tabs (XP/Score/Streak)
- [ ] Period filters
- [ ] Level filter
- [ ] Top 3 podium display
- [ ] Current user row highlighted
- [ ] Pagination/infinite scroll
- [ ] Loading states

---

## Implementation

### 1. Leaderboard Types

```typescript
// src/types/leaderboard.types.ts
export type LeaderboardType = "xp" | "score" | "streak";
export type LeaderboardPeriod = "daily" | "weekly" | "monthly" | "all_time";
export type VstepLevel = "A2" | "B1" | "B2" | "C1";

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  avatar: string;
  level: VstepLevel;
  value: number; // XP, score, or streak days
  change: number; // Position change from previous period
  badges: string[]; // Badge icons to display
  isCurrentUser?: boolean;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  currentUserRank?: number;
  totalParticipants: number;
  period: LeaderboardPeriod;
  type: LeaderboardType;
}

export interface LeaderboardFilters {
  type: LeaderboardType;
  period: LeaderboardPeriod;
  level?: VstepLevel;
  page?: number;
  limit?: number;
}
```

### 2. Leaderboard Hook

```typescript
// src/hooks/useLeaderboard.ts
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { gamificationService } from "@/services/gamification.service";
import type { LeaderboardFilters, LeaderboardResponse } from "@/types/leaderboard.types";

export const leaderboardKeys = {
  all: ["leaderboard"] as const,
  list: (filters: LeaderboardFilters) => [...leaderboardKeys.all, filters] as const,
  userRank: (type: string, period: string) => 
    [...leaderboardKeys.all, "userRank", type, period] as const,
};

export function useLeaderboard(filters: LeaderboardFilters) {
  return useQuery<LeaderboardResponse>({
    queryKey: leaderboardKeys.list(filters),
    queryFn: () => gamificationService.getLeaderboard(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes (leaderboard changes often)
    placeholderData: (previousData) => previousData,
  });
}

export function useLeaderboardInfinite(filters: Omit<LeaderboardFilters, "page">) {
  return useInfiniteQuery({
    queryKey: [...leaderboardKeys.all, "infinite", filters],
    queryFn: ({ pageParam = 1 }) =>
      gamificationService.getLeaderboard({ ...filters, page: pageParam, limit: 20 }),
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce((sum, p) => sum + p.entries.length, 0);
      return totalLoaded < lastPage.totalParticipants ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCurrentUserRank(type: string, period: string) {
  return useQuery({
    queryKey: leaderboardKeys.userRank(type, period),
    queryFn: () => gamificationService.getCurrentUserRank(type, period),
    staleTime: 5 * 60 * 1000,
  });
}
```

### 3. Leaderboard Component

```tsx
// src/components/dashboard/leaderboard.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { cn } from "@/lib/utils";
import {
  Trophy,
  Zap,
  Target,
  Flame,
  ChevronUp,
  ChevronDown,
  Minus,
  Crown,
  Medal,
  Award,
} from "lucide-react";
import type { LeaderboardType, LeaderboardPeriod, VstepLevel, LeaderboardEntry } from "@/types/leaderboard.types";

const typeConfig = {
  xp: { label: "XP", icon: Zap, unit: "XP" },
  score: { label: "Điểm", icon: Target, unit: "điểm" },
  streak: { label: "Streak", icon: Flame, unit: "ngày" },
};

const periodConfig = {
  daily: "Hôm nay",
  weekly: "Tuần này",
  monthly: "Tháng này",
  all_time: "Tất cả",
};

export function Leaderboard() {
  const [type, setType] = useState<LeaderboardType>("xp");
  const [period, setPeriod] = useState<LeaderboardPeriod>("weekly");
  const [level, setLevel] = useState<VstepLevel | "all">("all");

  const { data, isLoading } = useLeaderboard({
    type,
    period,
    level: level === "all" ? undefined : level,
    limit: 50,
  });

  const TypeIcon = typeConfig[type].icon;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Bảng xếp hạng
          </CardTitle>

          {/* Filters */}
          <div className="flex gap-2">
            <Select value={period} onValueChange={(v) => setPeriod(v as LeaderboardPeriod)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(periodConfig).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={level} onValueChange={(v) => setLevel(v as VstepLevel | "all")}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="A2">A2</SelectItem>
                <SelectItem value="B1">B1</SelectItem>
                <SelectItem value="B2">B2</SelectItem>
                <SelectItem value="C1">C1</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Type tabs */}
        <Tabs value={type} onValueChange={(v) => setType(v as LeaderboardType)}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            {Object.entries(typeConfig).map(([key, config]) => (
              <TabsTrigger key={key} value={key} className="gap-1">
                <config.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{config.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={type} className="mt-0">
            {isLoading ? (
              <LeaderboardSkeleton />
            ) : data ? (
              <>
                {/* Top 3 Podium */}
                <TopThreePodium entries={data.entries.slice(0, 3)} type={type} />

                {/* Rankings list */}
                <div className="space-y-1 mt-4">
                  {data.entries.slice(3).map((entry) => (
                    <LeaderboardRow key={entry.userId} entry={entry} type={type} />
                  ))}
                </div>

                {/* Current user rank (if not in top 50) */}
                {data.currentUserRank && data.currentUserRank > 50 && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-center text-sm text-muted-foreground mb-2">
                      Thứ hạng của bạn
                    </div>
                    {/* Show current user's row */}
                  </div>
                )}

                {/* Total participants */}
                <div className="text-center text-sm text-muted-foreground mt-4">
                  {data.totalParticipants.toLocaleString()} người tham gia
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Chưa có dữ liệu xếp hạng
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Top 3 Podium Component
function TopThreePodium({
  entries,
  type,
}: {
  entries: LeaderboardEntry[];
  type: LeaderboardType;
}) {
  if (entries.length < 3) return null;

  const podiumOrder = [entries[1], entries[0], entries[2]]; // 2nd, 1st, 3rd
  const heights = ["h-20", "h-28", "h-16"];
  const colors = [
    "bg-gray-300 dark:bg-gray-600", // Silver
    "bg-yellow-400 dark:bg-yellow-500", // Gold
    "bg-orange-400 dark:bg-orange-500", // Bronze
  ];
  const icons = [Medal, Crown, Award];

  return (
    <div className="flex items-end justify-center gap-2 mb-4">
      {podiumOrder.map((entry, index) => {
        const Icon = icons[index];
        const actualRank = index === 1 ? 1 : index === 0 ? 2 : 3;
        
        return (
          <div key={entry.userId} className="flex flex-col items-center">
            {/* Avatar with badge */}
            <div className="relative mb-2">
              <Avatar className={cn(
                "border-4",
                actualRank === 1 && "w-16 h-16 border-yellow-400",
                actualRank === 2 && "w-12 h-12 border-gray-400",
                actualRank === 3 && "w-12 h-12 border-orange-400",
              )}>
                <AvatarImage src={entry.avatar} alt={entry.userName} />
                <AvatarFallback>{entry.userName[0]}</AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full p-1",
                  colors[index]
                )}
              >
                <Icon className={cn(
                  "text-white",
                  actualRank === 1 ? "w-4 h-4" : "w-3 h-3"
                )} />
              </div>
            </div>

            {/* Name */}
            <div className="text-xs font-medium truncate max-w-[80px] text-center">
              {entry.userName}
            </div>

            {/* Value */}
            <div className="text-sm font-bold text-primary">
              {entry.value.toLocaleString()}
            </div>

            {/* Podium */}
            <div
              className={cn(
                "w-20 rounded-t-lg flex items-center justify-center font-bold text-white mt-2",
                heights[index],
                colors[index]
              )}
            >
              {actualRank}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Leaderboard Row Component
function LeaderboardRow({
  entry,
  type,
}: {
  entry: LeaderboardEntry;
  type: LeaderboardType;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg transition-colors",
        entry.isCurrentUser
          ? "bg-primary/10 border border-primary/20"
          : "hover:bg-muted/50"
      )}
    >
      {/* Rank */}
      <div className="w-8 text-center font-bold text-muted-foreground">
        #{entry.rank}
      </div>

      {/* Change indicator */}
      <div className="w-6 flex justify-center">
        {entry.change > 0 && (
          <ChevronUp className="w-4 h-4 text-green-500" />
        )}
        {entry.change < 0 && (
          <ChevronDown className="w-4 h-4 text-red-500" />
        )}
        {entry.change === 0 && (
          <Minus className="w-4 h-4 text-muted-foreground" />
        )}
      </div>

      {/* Avatar */}
      <Avatar className="w-8 h-8">
        <AvatarImage src={entry.avatar} alt={entry.userName} />
        <AvatarFallback>{entry.userName[0]}</AvatarFallback>
      </Avatar>

      {/* Name & Level */}
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{entry.userName}</div>
        <Badge variant="outline" className="text-xs">
          {entry.level}
        </Badge>
      </div>

      {/* Badges preview */}
      {entry.badges.length > 0 && (
        <div className="hidden sm:flex gap-0.5">
          {entry.badges.slice(0, 3).map((badge, i) => (
            <span key={i} className="text-sm">{badge}</span>
          ))}
          {entry.badges.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{entry.badges.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Value */}
      <div className="font-bold text-right">
        {entry.value.toLocaleString()}
        <span className="text-xs text-muted-foreground ml-1">
          {typeConfig[type].unit}
        </span>
      </div>
    </div>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-4">
      {/* Podium skeleton */}
      <div className="flex items-end justify-center gap-2 mb-4">
        <Skeleton className="w-20 h-32" />
        <Skeleton className="w-20 h-40" />
        <Skeleton className="w-20 h-28" />
      </div>
      {/* Rows skeleton */}
      {[...Array(7)].map((_, i) => (
        <Skeleton key={i} className="h-14 rounded-lg" />
      ))}
    </div>
  );
}
```

### 4. Leaderboard Widget (Compact)

```tsx
// src/components/dashboard/leaderboard-widget.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { cn } from "@/lib/utils";
import { Trophy, ChevronRight } from "lucide-react";
import Link from "next/link";

export function LeaderboardWidget() {
  const { data, isLoading } = useLeaderboard({
    type: "xp",
    period: "weekly",
    limit: 5,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-500" />
          Top tuần này
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/leaderboard">
            Xem tất cả
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data?.entries.slice(0, 5).map((entry, index) => (
            <div
              key={entry.userId}
              className={cn(
                "flex items-center gap-3 p-2 rounded-lg",
                entry.isCurrentUser && "bg-primary/10"
              )}
            >
              {/* Medal for top 3 */}
              <div className="w-6 text-center">
                {index === 0 && "🥇"}
                {index === 1 && "🥈"}
                {index === 2 && "🥉"}
                {index > 2 && (
                  <span className="text-sm text-muted-foreground">
                    {index + 1}
                  </span>
                )}
              </div>

              <Avatar className="w-8 h-8">
                <AvatarImage src={entry.avatar} alt={entry.userName} />
                <AvatarFallback>{entry.userName[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1 truncate text-sm">{entry.userName}</div>

              <div className="text-sm font-medium">
                {entry.value.toLocaleString()} XP
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

### 5. Extend Gamification Service

```typescript
// Update: src/services/gamification.service.ts
// Add these methods to existing gamificationService

import type { LeaderboardFilters, LeaderboardResponse } from "@/types/leaderboard.types";

// Add to GamificationService class:
async getLeaderboard(filters: LeaderboardFilters): Promise<LeaderboardResponse> {
  const response = await apiClient.get<LeaderboardResponse>("/leaderboard", {
    params: filters,
  });
  return response.data;
}

async getCurrentUserRank(type: string, period: string): Promise<{ rank: number }> {
  const response = await apiClient.get<{ rank: number }>("/leaderboard/me", {
    params: { type, period },
  });
  return response.data;
}
```

---

## File Structure

```
FE/src/
├── types/
│   └── leaderboard.types.ts        # NEW - Leaderboard types
│
├── hooks/
│   └── useLeaderboard.ts           # NEW - Leaderboard hooks
│
├── components/dashboard/
│   ├── leaderboard.tsx             # NEW - Full leaderboard
│   └── leaderboard-widget.tsx      # NEW - Compact widget
│
├── services/
│   └── gamification.service.ts     # UPDATE - Add methods
```

---

## Next Task

Continue with **FE-036: Learning Roadmap** - User's personalized learning path visualization.

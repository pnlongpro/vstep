# Task: FE-034 - Streak Display

## Task Info

| Field | Value |
|-------|-------|
| **Task ID** | FE-034 |
| **Task Name** | Streak Display |
| **Module** | Dashboard & Analytics |
| **Sprint** | 07-08 |
| **Estimated Hours** | 3h |
| **Priority** | P1 (High) |
| **Dependencies** | FE-028, FE-029 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Existing:**
> - `FE/src/services/gamification.service.ts` - ✅ Có thể mở rộng streak API
> - `FE/src/hooks/useDashboard.ts` - ✅ Có `useStreakInfo` hook

**Action:** Tạo streak display component mới với animations và streak protection UI.

---

## Description

Display streak information prominently:
- Current streak days
- Longest streak record
- Streak calendar visualization
- Streak freeze/protection feature
- Daily goal completion status

---

## Acceptance Criteria

- [ ] Streak count với fire animation
- [ ] Streak history mini calendar
- [ ] Longest streak record
- [ ] Streak at risk warning
- [ ] Streak freeze feature (if available)
- [ ] Responsive design

---

## Implementation

### 1. Streak Types

```typescript
// src/types/streak.types.ts
export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  streakStartDate: string;
  isAtRisk: boolean; // True if no activity today
  freezesAvailable: number;
  freezesUsed: number;
  weeklyActivity: boolean[]; // Last 7 days [Mon...Sun]
}

export interface StreakDay {
  date: string;
  hasActivity: boolean;
  isToday: boolean;
  isFrozen: boolean;
}
```

### 2. Streak Hook

```typescript
// src/hooks/useStreak.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { streakService } from "@/services/streak.service";
import { StreakInfo } from "@/types/streak.types";

export const streakKeys = {
  all: ["streak"] as const,
  info: () => [...streakKeys.all, "info"] as const,
  calendar: () => [...streakKeys.all, "calendar"] as const,
};

export function useStreakInfo() {
  return useQuery<StreakInfo>({
    queryKey: streakKeys.info(),
    queryFn: () => streakService.getStreakInfo(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

export function useStreakCalendar(days: number = 30) {
  return useQuery({
    queryKey: [...streakKeys.calendar(), days],
    queryFn: () => streakService.getStreakCalendar(days),
    staleTime: 10 * 60 * 1000,
  });
}

export function useActivateFreeze() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => streakService.activateFreeze(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: streakKeys.info() });
    },
  });
}

export function useCheckDailyStreak() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => streakService.checkDaily(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: streakKeys.info() });
    },
  });
}
```

### 3. Streak Display Component

```tsx
// src/components/dashboard/streak-display.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useStreakInfo, useActivateFreeze } from "@/hooks/useStreak";
import { cn } from "@/lib/utils";
import {
  Flame,
  Trophy,
  Shield,
  AlertTriangle,
  Check,
  Snowflake,
} from "lucide-react";

export function StreakDisplay() {
  const { data: streak, isLoading } = useStreakInfo();
  const activateFreeze = useActivateFreeze();
  const [showCelebration, setShowCelebration] = useState(false);

  // Celebrate milestones
  useEffect(() => {
    if (streak && [7, 30, 100, 365].includes(streak.currentStreak)) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [streak?.currentStreak]);

  if (isLoading) {
    return <StreakDisplaySkeleton />;
  }

  if (!streak) return null;

  const isCompleted = !streak.isAtRisk;

  return (
    <Card className={cn(
      "overflow-hidden transition-colors",
      streak.isAtRisk && "border-orange-500/50 bg-orange-50/50 dark:bg-orange-950/20"
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Left: Streak count with fire */}
          <div className="flex items-center gap-3">
            <motion.div
              animate={showCelebration ? {
                scale: [1, 1.2, 1],
                rotate: [0, -10, 10, 0],
              } : {}}
              transition={{ duration: 0.5 }}
              className={cn(
                "relative w-14 h-14 rounded-full flex items-center justify-center",
                isCompleted
                  ? "bg-gradient-to-br from-orange-400 to-red-500"
                  : "bg-muted"
              )}
            >
              {isCompleted ? (
                <AnimatedFlame />
              ) : (
                <Flame className="w-7 h-7 text-muted-foreground" />
              )}
              
              {/* Streak count badge */}
              <div className="absolute -bottom-1 -right-1 bg-background rounded-full px-2 py-0.5 text-xs font-bold border shadow-sm">
                {streak.currentStreak}
              </div>
            </motion.div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">
                  {streak.currentStreak} ngày
                </span>
                {streak.isAtRisk && (
                  <Badge variant="destructive" className="text-xs">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Sắp mất
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Trophy className="w-3 h-3" />
                <span>Kỷ lục: {streak.longestStreak} ngày</span>
              </div>
            </div>
          </div>

          {/* Right: Weekly mini calendar + freeze */}
          <div className="flex items-center gap-3">
            {/* Mini week view */}
            <WeekMiniCalendar activity={streak.weeklyActivity} />

            {/* Freeze button */}
            {streak.freezesAvailable > 0 && streak.isAtRisk && (
              <FreezeButton
                freezesAvailable={streak.freezesAvailable}
                onActivate={() => activateFreeze.mutate()}
                isLoading={activateFreeze.isPending}
              />
            )}

            {/* Today's status */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      isCompleted
                        ? "bg-green-100 dark:bg-green-900"
                        : "bg-muted"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <span className="text-lg">📚</span>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {isCompleted
                    ? "Đã hoàn thành mục tiêu hôm nay!"
                    : "Luyện tập để duy trì streak!"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Animated fire component
function AnimatedFlame() {
  return (
    <motion.div
      animate={{
        scale: [1, 1.1, 1],
        y: [0, -2, 0],
      }}
      transition={{
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    >
      <Flame className="w-7 h-7 text-white drop-shadow-lg" />
    </motion.div>
  );
}

// Week mini calendar
function WeekMiniCalendar({ activity }: { activity: boolean[] }) {
  const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  
  return (
    <div className="hidden sm:flex gap-1">
      {days.map((day, i) => (
        <TooltipProvider key={day}>
          <Tooltip>
            <TooltipTrigger>
              <div
                className={cn(
                  "w-6 h-6 rounded text-xs flex items-center justify-center",
                  activity[i]
                    ? "bg-green-500 text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {activity[i] ? "✓" : day}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {activity[i] ? `${day}: Đã luyện tập` : `${day}: Chưa luyện tập`}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}

// Freeze button with dialog
function FreezeButton({
  freezesAvailable,
  onActivate,
  isLoading,
}: {
  freezesAvailable: number;
  onActivate: () => void;
  isLoading: boolean;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Snowflake className="w-4 h-4 text-blue-500" />
          <span className="hidden sm:inline">Đóng băng</span>
          <Badge variant="secondary" className="ml-1">
            {freezesAvailable}
          </Badge>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            Bảo vệ Streak
          </DialogTitle>
          <DialogDescription>
            Sử dụng Streak Freeze để bảo vệ streak của bạn trong 1 ngày không thể
            luyện tập.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Streak Freeze còn lại
              </span>
              <span className="font-bold">{freezesAvailable}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Bạn nhận được 1 Streak Freeze miễn phí mỗi tuần. Premium users nhận
              thêm 2 freeze/tuần.
            </p>
          </div>

          <Button
            className="w-full"
            onClick={onActivate}
            disabled={isLoading}
          >
            {isLoading ? (
              "Đang kích hoạt..."
            ) : (
              <>
                <Snowflake className="w-4 h-4 mr-2" />
                Kích hoạt Freeze cho hôm nay
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StreakDisplaySkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-14 h-14 rounded-full" />
            <div>
              <Skeleton className="h-6 w-24 mb-1" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="flex gap-1">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="w-6 h-6 rounded" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 4. Streak Card (Compact Version)

```tsx
// src/components/dashboard/streak-card.tsx
"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useStreakInfo } from "@/hooks/useStreak";
import { cn } from "@/lib/utils";
import { Flame, Trophy, TrendingUp } from "lucide-react";

interface StreakCardProps {
  variant?: "default" | "compact" | "large";
  className?: string;
}

export function StreakCard({ variant = "default", className }: StreakCardProps) {
  const { data: streak, isLoading } = useStreakInfo();

  if (isLoading) {
    return <Skeleton className={cn("h-24 rounded-xl", className)} />;
  }

  if (!streak) return null;

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
          <Flame className="w-4 h-4 text-white" />
        </div>
        <div>
          <span className="font-bold">{streak.currentStreak}</span>
          <span className="text-xs text-muted-foreground ml-1">ngày</span>
        </div>
      </div>
    );
  }

  if (variant === "large") {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                y: [0, -3, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center mb-4 shadow-lg shadow-orange-500/30"
            >
              <Flame className="w-10 h-10 text-white" />
            </motion.div>

            <div className="text-4xl font-bold mb-1">
              {streak.currentStreak}
            </div>
            <div className="text-muted-foreground mb-4">ngày liên tiếp</div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span>Kỷ lục: {streak.longestStreak}</span>
              </div>
              {streak.currentStreak > streak.longestStreak * 0.8 && (
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>Sắp phá kỷ lục!</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={className}>
      <CardContent className="p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
          <Flame className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="text-2xl font-bold">{streak.currentStreak}</div>
          <div className="text-sm text-muted-foreground">ngày liên tiếp</div>
        </div>
        <div className="ml-auto text-right text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            <span>Kỷ lục: {streak.longestStreak}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 5. Streak Service Extension

```typescript
// src/services/streak.service.ts
import { apiClient } from "@/lib/api-client";
import { StreakInfo, StreakDay } from "@/types/streak.types";

class StreakService {
  private baseUrl = "/users/me/streak";

  async getStreakInfo(): Promise<StreakInfo> {
    const response = await apiClient.get<StreakInfo>(this.baseUrl);
    return response.data;
  }

  async getStreakCalendar(days: number = 30): Promise<StreakDay[]> {
    const response = await apiClient.get<StreakDay[]>(
      `${this.baseUrl}/calendar`,
      { params: { days } }
    );
    return response.data;
  }

  async activateFreeze(): Promise<void> {
    await apiClient.post(`${this.baseUrl}/freeze`);
  }

  async checkDaily(): Promise<{ completed: boolean }> {
    const response = await apiClient.post<{ completed: boolean }>(
      `${this.baseUrl}/check`
    );
    return response.data;
  }
}

export const streakService = new StreakService();
```

---

## File Structure

```
FE/src/
├── types/
│   └── streak.types.ts           # NEW - Streak types
│
├── services/
│   └── streak.service.ts         # NEW - Streak API service
│
├── hooks/
│   └── useStreak.ts              # NEW - Streak hooks
│
├── components/dashboard/
│   ├── streak-display.tsx        # NEW - Full streak display
│   └── streak-card.tsx           # NEW - Compact variants
```

---

## Next Task

Continue with **FE-035: Leaderboard Component** - Rankings display with tabs and periods.

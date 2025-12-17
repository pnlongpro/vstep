# Task: FE-032 - Activity Calendar

## Task Info

| Field | Value |
|-------|-------|
| **Task ID** | FE-032 |
| **Task Name** | Activity Calendar |
| **Module** | Dashboard & Analytics |
| **Sprint** | 07-08 |
| **Estimated Hours** | 4h |
| **Priority** | P0 (Critical) |
| **Dependencies** | FE-029 |

---

## ⚠️ QUAN TRỌNG

> **Existing:** Không có component sẵn cho activity calendar.
>
> **Action:** Tạo mới GitHub-style contribution calendar.

---

## Description

Implement activity calendar hiển thị hoạt động học tập:
- GitHub-style contribution heatmap
- Hiển thị 365 ngày gần nhất
- Color intensity theo số lượng hoạt động
- Tooltip hiển thị chi tiết

---

## Acceptance Criteria

- [ ] Heatmap calendar 365 ngày
- [ ] Color levels (0-4) theo activity count
- [ ] Hover tooltip với chi tiết
- [ ] Responsive design
- [ ] Loading skeleton

---

## Implementation

### 1. Activity Calendar Component

```tsx
// src/components/dashboard/activity-calendar.tsx
"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useActivityCalendar } from "@/hooks/useDashboard";
import { cn } from "@/lib/utils";
import {
  format,
  subDays,
  startOfWeek,
  addDays,
  isSameDay,
  parseISO,
  getDay,
  differenceInWeeks,
} from "date-fns";
import { vi } from "date-fns/locale";

interface ActivityCalendarProps {
  className?: string;
}

export function ActivityCalendar({ className }: ActivityCalendarProps) {
  const today = new Date();
  const startDate = subDays(today, 364); // 365 days including today
  
  const { data, isLoading, error } = useActivityCalendar(
    format(startDate, "yyyy-MM-dd"),
    format(today, "yyyy-MM-dd")
  );

  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    count: number;
    activities: string[];
  } | null>(null);

  // Generate calendar grid
  const calendarData = useMemo(() => {
    if (!data) return [];

    const activityMap = new Map(
      data.map((d) => [d.date, { count: d.count, level: d.level, activities: d.activities }])
    );

    const weeks: Array<Array<{
      date: Date;
      count: number;
      level: 0 | 1 | 2 | 3 | 4;
      activities: string[];
      isToday: boolean;
    } | null>> = [];

    // Start from the first day of the week containing startDate
    let currentDate = startOfWeek(startDate, { weekStartsOn: 1 }); // Monday start
    const endDate = today;

    while (currentDate <= endDate) {
      const week: typeof weeks[0] = [];
      
      for (let i = 0; i < 7; i++) {
        const day = addDays(currentDate, i);
        
        if (day < startDate || day > endDate) {
          week.push(null);
        } else {
          const dateStr = format(day, "yyyy-MM-dd");
          const dayData = activityMap.get(dateStr);
          
          week.push({
            date: day,
            count: dayData?.count || 0,
            level: dayData?.level || 0,
            activities: dayData?.activities || [],
            isToday: isSameDay(day, today),
          });
        }
      }
      
      weeks.push(week);
      currentDate = addDays(currentDate, 7);
    }

    return weeks;
  }, [data, startDate, today]);

  if (isLoading) {
    return <ActivityCalendarSkeleton />;
  }

  if (error) {
    return (
      <Card className={cn("border-destructive/50", className)}>
        <CardContent className="p-6 text-center">
          <p className="text-sm text-destructive">Không thể tải lịch hoạt động</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate total activities
  const totalActivities = data?.reduce((sum, d) => sum + d.count, 0) || 0;
  const activeDays = data?.filter((d) => d.count > 0).length || 0;

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium">Lịch hoạt động</CardTitle>
            <CardDescription>
              {totalActivities} hoạt động trong {activeDays} ngày
            </CardDescription>
          </div>
          <LegendBar />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <TooltipProvider delayDuration={100}>
            <div className="inline-flex gap-0.5">
              {/* Day labels */}
              <div className="flex flex-col gap-0.5 mr-1 text-[10px] text-muted-foreground">
                <span className="h-3">T2</span>
                <span className="h-3"></span>
                <span className="h-3">T4</span>
                <span className="h-3"></span>
                <span className="h-3">T6</span>
                <span className="h-3"></span>
                <span className="h-3">CN</span>
              </div>

              {/* Calendar grid */}
              <div className="flex gap-0.5">
                {calendarData.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-0.5">
                    {week.map((day, dayIndex) => (
                      <Tooltip key={`${weekIndex}-${dayIndex}`}>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "w-3 h-3 rounded-sm transition-all",
                              day === null && "invisible",
                              day !== null && getLevelColor(day.level),
                              day?.isToday && "ring-1 ring-primary ring-offset-1"
                            )}
                            onMouseEnter={() => day && setHoveredDay({
                              date: format(day.date, "yyyy-MM-dd"),
                              count: day.count,
                              activities: day.activities,
                            })}
                            onMouseLeave={() => setHoveredDay(null)}
                          />
                        </TooltipTrigger>
                        {day && (
                          <TooltipContent 
                            side="top" 
                            className="p-2"
                            sideOffset={5}
                          >
                            <div className="text-xs">
                              <p className="font-medium">
                                {format(day.date, "EEEE, d MMMM yyyy", { locale: vi })}
                              </p>
                              <p className="text-muted-foreground">
                                {day.count > 0 
                                  ? `${day.count} hoạt động`
                                  : "Không có hoạt động"
                                }
                              </p>
                              {day.activities.length > 0 && (
                                <ul className="mt-1 space-y-0.5">
                                  {day.activities.slice(0, 3).map((activity, i) => (
                                    <li key={i} className="text-muted-foreground">
                                      • {activity}
                                    </li>
                                  ))}
                                  {day.activities.length > 3 && (
                                    <li className="text-muted-foreground">
                                      +{day.activities.length - 3} hoạt động khác
                                    </li>
                                  )}
                                </ul>
                              )}
                            </div>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </TooltipProvider>

          {/* Month labels */}
          <MonthLabels startDate={startDate} weeks={calendarData.length} />
        </div>
      </CardContent>
    </Card>
  );
}

function getLevelColor(level: 0 | 1 | 2 | 3 | 4): string {
  const colors = {
    0: "bg-muted",
    1: "bg-green-200 dark:bg-green-900",
    2: "bg-green-400 dark:bg-green-700",
    3: "bg-green-600 dark:bg-green-500",
    4: "bg-green-800 dark:bg-green-300",
  };
  return colors[level];
}

function LegendBar() {
  return (
    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
      <span>Ít</span>
      {[0, 1, 2, 3, 4].map((level) => (
        <div
          key={level}
          className={cn("w-3 h-3 rounded-sm", getLevelColor(level as 0 | 1 | 2 | 3 | 4))}
        />
      ))}
      <span>Nhiều</span>
    </div>
  );
}

function MonthLabels({ startDate, weeks }: { startDate: Date; weeks: number }) {
  const months: { label: string; offset: number }[] = [];
  let currentMonth = -1;

  for (let i = 0; i < weeks; i++) {
    const weekStart = addDays(startOfWeek(startDate, { weekStartsOn: 1 }), i * 7);
    const month = weekStart.getMonth();
    
    if (month !== currentMonth) {
      currentMonth = month;
      months.push({
        label: format(weekStart, "MMM", { locale: vi }),
        offset: i,
      });
    }
  }

  return (
    <div className="flex text-[10px] text-muted-foreground mt-1 ml-4">
      {months.map((month, i) => (
        <span
          key={i}
          className="absolute"
          style={{ marginLeft: `${month.offset * 14}px` }}
        >
          {month.label}
        </span>
      ))}
    </div>
  );
}

function ActivityCalendarSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <div className="flex gap-0.5">
          {[...Array(52)].map((_, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-0.5">
              {[...Array(7)].map((_, dayIndex) => (
                <Skeleton key={dayIndex} className="w-3 h-3 rounded-sm" />
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

### 2. Compact Activity Calendar (for sidebar/widgets)

```tsx
// src/components/dashboard/activity-calendar-compact.tsx
"use client";

import { useMemo } from "react";
import { useActivityCalendar } from "@/hooks/useDashboard";
import { cn } from "@/lib/utils";
import { format, subDays, startOfWeek, addDays, isSameDay } from "date-fns";

interface ActivityCalendarCompactProps {
  days?: number;
  className?: string;
}

export function ActivityCalendarCompact({ 
  days = 30,
  className 
}: ActivityCalendarCompactProps) {
  const today = new Date();
  const startDate = subDays(today, days - 1);
  
  const { data, isLoading } = useActivityCalendar(
    format(startDate, "yyyy-MM-dd"),
    format(today, "yyyy-MM-dd")
  );

  const calendarDays = useMemo(() => {
    if (!data) return [];

    const activityMap = new Map(
      data.map((d) => [d.date, d.level])
    );

    const result = [];
    let current = startDate;

    while (current <= today) {
      const dateStr = format(current, "yyyy-MM-dd");
      result.push({
        date: current,
        level: activityMap.get(dateStr) || 0,
        isToday: isSameDay(current, today),
      });
      current = addDays(current, 1);
    }

    return result;
  }, [data, startDate, today]);

  if (isLoading) {
    return (
      <div className={cn("flex flex-wrap gap-1", className)}>
        {[...Array(days)].map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-sm bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {calendarDays.map((day, i) => (
        <div
          key={i}
          className={cn(
            "w-2 h-2 rounded-sm",
            getLevelColorCompact(day.level as 0 | 1 | 2 | 3 | 4),
            day.isToday && "ring-1 ring-primary"
          )}
          title={format(day.date, "dd/MM")}
        />
      ))}
    </div>
  );
}

function getLevelColorCompact(level: 0 | 1 | 2 | 3 | 4): string {
  const colors = {
    0: "bg-muted",
    1: "bg-primary/25",
    2: "bg-primary/50",
    3: "bg-primary/75",
    4: "bg-primary",
  };
  return colors[level];
}
```

### 3. Hook update for calendar

```typescript
// src/hooks/useDashboard.ts
// Thêm vào existing hooks file

import { subDays, format } from "date-fns";

// ... existing code ...

export function useActivityCalendar(startDate?: string, endDate?: string) {
  const today = new Date();
  const defaultStart = format(subDays(today, 364), "yyyy-MM-dd");
  const defaultEnd = format(today, "yyyy-MM-dd");

  return useQuery({
    queryKey: dashboardKeys.calendar(startDate || defaultStart, endDate || defaultEnd),
    queryFn: () => dashboardService.getActivityCalendar(
      startDate || defaultStart,
      endDate || defaultEnd
    ),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Shortcut for last 30 days
export function useRecentActivity30Days() {
  const today = new Date();
  return useActivityCalendar(
    format(subDays(today, 29), "yyyy-MM-dd"),
    format(today, "yyyy-MM-dd")
  );
}
```

### 4. Integration with Dashboard

```tsx
// Usage in dashboard page:

import { ActivityCalendar } from "@/components/dashboard/activity-calendar";
import { ActivityCalendarCompact } from "@/components/dashboard/activity-calendar-compact";

// In main dashboard:
<ActivityCalendar className="mt-6" />

// In sidebar or widget:
<div className="p-4">
  <h4 className="text-sm font-medium mb-2">Hoạt động 30 ngày</h4>
  <ActivityCalendarCompact days={30} />
</div>
```

---

## File Structure

```
FE/src/components/dashboard/
├── activity-calendar.tsx         # NEW - Full calendar
└── activity-calendar-compact.tsx # NEW - Compact version
```

---

## Styling Notes

- Uses Tailwind CSS for responsive design
- Dark mode compatible colors
- Matches GitHub contribution graph style
- Uses shadcn/ui Tooltip for hover info

---

## Next Task

Continue with **FE-033: Achievement Badges** - Display user badges and achievements.

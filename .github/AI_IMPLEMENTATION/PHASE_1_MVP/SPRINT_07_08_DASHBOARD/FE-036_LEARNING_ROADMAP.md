# Task: FE-036 - Learning Roadmap

## Task Info

| Field | Value |
|-------|-------|
| **Task ID** | FE-036 |
| **Task Name** | Learning Roadmap |
| **Module** | Dashboard & Analytics |
| **Sprint** | 07-08 |
| **Estimated Hours** | 5h |
| **Priority** | P1 (High) |
| **Dependencies** | FE-028, BE-035 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Existing:**
> - `FE/src/services/progress.service.ts` - ✅ Có thể mở rộng roadmap API
> - `UI-Template/components/Goals.tsx` - Có thể tham khảo goal cards

**Action:** Tạo learning roadmap component với timeline, milestones và skill recommendations.

---

## Description

Display personalized learning path:
- Current level → Target level visualization
- Milestone timeline with progress
- Weekly study plan
- Skill-specific recommendations
- Estimated completion date

---

## Acceptance Criteria

- [ ] Visual roadmap timeline
- [ ] Milestone progress tracking
- [ ] Skill recommendations với priority
- [ ] Weekly plan overview
- [ ] Progress percentage
- [ ] Estimated completion date
- [ ] Interactive milestones

---

## Implementation

### 1. Roadmap Types

```typescript
// src/types/roadmap.types.ts
export type SkillType = "reading" | "listening" | "writing" | "speaking";
export type MilestoneStatus = "completed" | "in_progress" | "locked";

export interface RoadmapMilestone {
  id: string;
  title: string;
  description: string;
  targetLevel: string; // e.g., "B1.1", "B1.2", "B2"
  status: MilestoneStatus;
  progress: number; // 0-100
  estimatedHours: number;
  completedHours: number;
  tasks: MilestoneTask[];
  unlockDate?: string;
  completedDate?: string;
}

export interface MilestoneTask {
  id: string;
  title: string;
  type: "practice" | "exam" | "review";
  skill?: SkillType;
  isCompleted: boolean;
  xpReward: number;
}

export interface SkillRecommendation {
  skill: SkillType;
  priority: "high" | "medium" | "low";
  currentScore: number;
  targetScore: number;
  gap: number;
  suggestedActions: SuggestedAction[];
}

export interface SuggestedAction {
  id: string;
  title: string;
  type: "practice" | "lesson" | "test";
  duration: number; // minutes
  link: string;
}

export interface WeeklyPlan {
  weekNumber: number;
  startDate: string;
  endDate: string;
  focusSkills: SkillType[];
  dailyGoalMinutes: number;
  totalTargetMinutes: number;
  completedMinutes: number;
  tasks: WeeklyTask[];
}

export interface WeeklyTask {
  id: string;
  day: number; // 0-6 (Mon-Sun)
  title: string;
  skill: SkillType;
  duration: number;
  isCompleted: boolean;
}

export interface LearningRoadmap {
  id: string;
  currentLevel: string;
  targetLevel: string;
  estimatedWeeks: number;
  startDate: string;
  targetDate: string;
  overallProgress: number;
  milestones: RoadmapMilestone[];
  recommendations: SkillRecommendation[];
  currentWeekPlan: WeeklyPlan;
}
```

### 2. Roadmap Hook

```typescript
// src/hooks/useRoadmap.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { progressService } from "@/services/progress.service";
import type { LearningRoadmap, WeeklyPlan } from "@/types/roadmap.types";

export const roadmapKeys = {
  all: ["roadmap"] as const,
  detail: () => [...roadmapKeys.all, "detail"] as const,
  weeklyPlan: (week?: number) => [...roadmapKeys.all, "weekly", week] as const,
  recommendations: () => [...roadmapKeys.all, "recommendations"] as const,
};

export function useRoadmap() {
  return useQuery<LearningRoadmap>({
    queryKey: roadmapKeys.detail(),
    queryFn: () => progressService.getRoadmap(),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

export function useWeeklyPlan(week?: number) {
  return useQuery<WeeklyPlan>({
    queryKey: roadmapKeys.weeklyPlan(week),
    queryFn: () => progressService.getWeeklyPlan(week),
    staleTime: 10 * 60 * 1000,
  });
}

export function useCompleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => progressService.completeRoadmapTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roadmapKeys.all });
    },
  });
}

export function useUpdateRoadmap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { targetLevel: string; targetDate: string }) =>
      progressService.updateRoadmap(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roadmapKeys.all });
    },
  });
}
```

### 3. Roadmap Timeline Component

```tsx
// src/components/dashboard/roadmap-timeline.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRoadmap } from "@/hooks/useRoadmap";
import { cn } from "@/lib/utils";
import { format, parseISO, differenceInDays } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Target,
  CheckCircle2,
  Circle,
  Lock,
  ChevronRight,
  Calendar,
  Clock,
  TrendingUp,
  Flag,
} from "lucide-react";
import type { RoadmapMilestone, MilestoneStatus } from "@/types/roadmap.types";

const statusIcons: Record<MilestoneStatus, React.ElementType> = {
  completed: CheckCircle2,
  in_progress: Circle,
  locked: Lock,
};

const statusColors: Record<MilestoneStatus, string> = {
  completed: "bg-green-500",
  in_progress: "bg-blue-500",
  locked: "bg-gray-300 dark:bg-gray-600",
};

export function RoadmapTimeline() {
  const { data: roadmap, isLoading } = useRoadmap();

  if (isLoading) {
    return <RoadmapTimelineSkeleton />;
  }

  if (!roadmap) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-medium mb-2">Chưa có lộ trình học tập</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Thiết lập mục tiêu để tạo lộ trình cá nhân hóa
          </p>
          <Button>Thiết lập mục tiêu</Button>
        </CardContent>
      </Card>
    );
  }

  const daysRemaining = differenceInDays(parseISO(roadmap.targetDate), new Date());

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Lộ trình học tập
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {roadmap.currentLevel} → {roadmap.targetLevel}
            </Badge>
            <Badge variant="secondary">
              <Clock className="w-3 h-3 mr-1" />
              {daysRemaining} ngày còn lại
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Overall progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Tiến độ tổng thể</span>
            <span className="font-medium">{roadmap.overallProgress}%</span>
          </div>
          <Progress value={roadmap.overallProgress} className="h-3" />
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-muted" />

          {/* Milestones */}
          <div className="space-y-6">
            {roadmap.milestones.map((milestone, index) => (
              <MilestoneCard
                key={milestone.id}
                milestone={milestone}
                isLast={index === roadmap.milestones.length - 1}
              />
            ))}
          </div>

          {/* Target flag */}
          <div className="flex items-center gap-4 mt-6">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center z-10">
              <Flag className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <div className="font-medium">{roadmap.targetLevel}</div>
              <div className="text-sm text-muted-foreground">
                Mục tiêu: {format(parseISO(roadmap.targetDate), "dd/MM/yyyy", { locale: vi })}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MilestoneCard({
  milestone,
  isLast,
}: {
  milestone: RoadmapMilestone;
  isLast: boolean;
}) {
  const StatusIcon = statusIcons[milestone.status];
  const isActive = milestone.status === "in_progress";

  return (
    <div className="flex gap-4">
      {/* Status icon */}
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center z-10 shrink-0",
          statusColors[milestone.status]
        )}
      >
        <StatusIcon className={cn(
          "w-4 h-4",
          milestone.status === "locked" ? "text-muted-foreground" : "text-white"
        )} />
      </div>

      {/* Content */}
      <div
        className={cn(
          "flex-1 p-4 rounded-lg border transition-colors",
          isActive && "border-primary bg-primary/5",
          milestone.status === "locked" && "opacity-60"
        )}
      >
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="font-medium">{milestone.title}</h4>
            <p className="text-sm text-muted-foreground">
              {milestone.description}
            </p>
          </div>
          <Badge
            variant={
              milestone.status === "completed"
                ? "success"
                : milestone.status === "in_progress"
                ? "default"
                : "secondary"
            }
          >
            {milestone.targetLevel}
          </Badge>
        </div>

        {/* Progress for in_progress milestone */}
        {isActive && (
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">
                {milestone.completedHours}/{milestone.estimatedHours} giờ
              </span>
              <span>{milestone.progress}%</span>
            </div>
            <Progress value={milestone.progress} className="h-2" />

            {/* Tasks */}
            {milestone.tasks.length > 0 && (
              <div className="mt-3 space-y-1">
                {milestone.tasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "flex items-center gap-2 text-sm",
                      task.isCompleted && "text-muted-foreground line-through"
                    )}
                  >
                    {task.isCompleted ? (
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                    ) : (
                      <Circle className="w-3 h-3" />
                    )}
                    <span>{task.title}</span>
                  </div>
                ))}
                {milestone.tasks.length > 3 && (
                  <Button variant="ghost" size="sm" className="h-6 text-xs">
                    +{milestone.tasks.length - 3} nhiệm vụ khác
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Completed date */}
        {milestone.status === "completed" && milestone.completedDate && (
          <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Hoàn thành {format(parseISO(milestone.completedDate), "dd/MM/yyyy", { locale: vi })}
          </div>
        )}
      </div>
    </div>
  );
}

function RoadmapTimelineSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-3 w-full mb-6" />
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="w-8 h-8 rounded-full shrink-0" />
              <Skeleton className="flex-1 h-24 rounded-lg" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

### 4. Skill Recommendations Component

```tsx
// src/components/dashboard/skill-recommendations.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useRoadmap } from "@/hooks/useRoadmap";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Headphones,
  Pen,
  Mic,
  ChevronRight,
  AlertCircle,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import type { SkillType, SkillRecommendation } from "@/types/roadmap.types";

const skillConfig: Record<SkillType, {
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}> = {
  reading: {
    label: "Reading",
    icon: BookOpen,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  listening: {
    label: "Listening",
    icon: Headphones,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
  },
  writing: {
    label: "Writing",
    icon: Pen,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  speaking: {
    label: "Speaking",
    icon: Mic,
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
  },
};

const priorityConfig = {
  high: { label: "Ưu tiên cao", color: "bg-red-500" },
  medium: { label: "Trung bình", color: "bg-yellow-500" },
  low: { label: "Ưu tiên thấp", color: "bg-green-500" },
};

export function SkillRecommendations() {
  const { data: roadmap, isLoading } = useRoadmap();

  if (isLoading) {
    return <SkillRecommendationsSkeleton />;
  }

  if (!roadmap?.recommendations.length) {
    return null;
  }

  // Sort by priority
  const sortedRecommendations = [...roadmap.recommendations].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="w-5 h-5 text-yellow-500" />
          Gợi ý luyện tập
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {sortedRecommendations.map((rec) => (
          <RecommendationCard key={rec.skill} recommendation={rec} />
        ))}
      </CardContent>
    </Card>
  );
}

function RecommendationCard({
  recommendation,
}: {
  recommendation: SkillRecommendation;
}) {
  const config = skillConfig[recommendation.skill];
  const Icon = config.icon;

  return (
    <div className={cn("p-4 rounded-lg", config.bgColor)}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            "bg-background shadow-sm"
          )}
        >
          <Icon className={cn("w-5 h-5", config.color)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium">{config.label}</h4>
            <Badge
              className={cn(
                "text-xs text-white",
                priorityConfig[recommendation.priority].color
              )}
            >
              {recommendation.priority === "high" && (
                <AlertCircle className="w-3 h-3 mr-1" />
              )}
              {priorityConfig[recommendation.priority].label}
            </Badge>
          </div>

          {/* Score progress */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">
              {recommendation.currentScore}/10 → {recommendation.targetScore}/10
            </span>
            <Badge variant="outline" className="text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{recommendation.gap} cần cải thiện
            </Badge>
          </div>

          {/* Suggested actions */}
          <div className="space-y-1">
            {recommendation.suggestedActions.slice(0, 2).map((action) => (
              <Link
                key={action.id}
                href={action.link}
                className="flex items-center justify-between text-sm hover:underline"
              >
                <span className="truncate">{action.title}</span>
                <span className="text-muted-foreground shrink-0 ml-2">
                  {action.duration} phút
                </span>
              </Link>
            ))}
          </div>

          {recommendation.suggestedActions.length > 2 && (
            <Button variant="ghost" size="sm" className="h-6 px-0 mt-1 text-xs">
              Xem tất cả gợi ý
              <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function SkillRecommendationsSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <Skeleton className="h-6 w-36" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </CardContent>
    </Card>
  );
}
```

### 5. Weekly Plan Component

```tsx
// src/components/dashboard/weekly-plan.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useWeeklyPlan, useCompleteTask } from "@/hooks/useRoadmap";
import { cn } from "@/lib/utils";
import { format, parseISO, isToday, addDays, startOfWeek } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Calendar,
  BookOpen,
  Headphones,
  Pen,
  Mic,
  Clock,
  Target,
} from "lucide-react";
import type { SkillType, WeeklyTask } from "@/types/roadmap.types";

const skillIcons: Record<SkillType, React.ElementType> = {
  reading: BookOpen,
  listening: Headphones,
  writing: Pen,
  speaking: Mic,
};

const dayNames = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export function WeeklyPlan() {
  const { data: plan, isLoading } = useWeeklyPlan();
  const completeTask = useCompleteTask();

  if (isLoading) {
    return <WeeklyPlanSkeleton />;
  }

  if (!plan) return null;

  const progressPercent = Math.round(
    (plan.completedMinutes / plan.totalTargetMinutes) * 100
  );

  // Group tasks by day
  const tasksByDay: Record<number, WeeklyTask[]> = {};
  for (let i = 0; i < 7; i++) {
    tasksByDay[i] = plan.tasks.filter((t) => t.day === i);
  }

  const weekStart = parseISO(plan.startDate);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="w-5 h-5 text-primary" />
            Kế hoạch tuần {plan.weekNumber}
          </CardTitle>
          <Badge variant="outline">
            {format(weekStart, "dd/MM")} -{" "}
            {format(addDays(weekStart, 6), "dd/MM")}
          </Badge>
        </div>

        {/* Weekly progress */}
        <div className="mt-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">
              <Clock className="w-3 h-3 inline mr-1" />
              {plan.completedMinutes}/{plan.totalTargetMinutes} phút
            </span>
            <span className="font-medium">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      </CardHeader>

      <CardContent>
        {/* Focus skills */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-muted-foreground">Tập trung:</span>
          {plan.focusSkills.map((skill) => {
            const Icon = skillIcons[skill];
            return (
              <Badge key={skill} variant="secondary" className="gap-1">
                <Icon className="w-3 h-3" />
                {skill}
              </Badge>
            );
          })}
        </div>

        {/* Day columns */}
        <div className="grid grid-cols-7 gap-2">
          {dayNames.map((dayName, dayIndex) => {
            const dayDate = addDays(weekStart, dayIndex);
            const tasks = tasksByDay[dayIndex] || [];
            const isCurrentDay = isToday(dayDate);
            const dayCompleted = tasks.length > 0 && tasks.every((t) => t.isCompleted);

            return (
              <div
                key={dayIndex}
                className={cn(
                  "p-2 rounded-lg text-center",
                  isCurrentDay && "ring-2 ring-primary",
                  dayCompleted && "bg-green-100 dark:bg-green-900/30"
                )}
              >
                {/* Day header */}
                <div className="text-xs font-medium mb-1">{dayName}</div>
                <div className="text-xs text-muted-foreground mb-2">
                  {format(dayDate, "dd")}
                </div>

                {/* Tasks */}
                <div className="space-y-1">
                  {tasks.map((task) => {
                    const Icon = skillIcons[task.skill];
                    return (
                      <div
                        key={task.id}
                        className={cn(
                          "p-1 rounded text-xs cursor-pointer transition-colors",
                          task.isCompleted
                            ? "bg-green-500 text-white"
                            : "bg-muted hover:bg-muted/80"
                        )}
                        onClick={() => {
                          if (!task.isCompleted) {
                            completeTask.mutate(task.id);
                          }
                        }}
                        title={task.title}
                      >
                        <Icon className="w-3 h-3 mx-auto" />
                      </div>
                    );
                  })}

                  {tasks.length === 0 && (
                    <div className="text-xs text-muted-foreground">-</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Today's tasks detail */}
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
            <Target className="w-4 h-4" />
            Nhiệm vụ hôm nay
          </h4>
          <TodayTasks
            tasks={plan.tasks.filter((t) => {
              const taskDate = addDays(weekStart, t.day);
              return isToday(taskDate);
            })}
            onComplete={(id) => completeTask.mutate(id)}
            isCompleting={completeTask.isPending}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function TodayTasks({
  tasks,
  onComplete,
  isCompleting,
}: {
  tasks: WeeklyTask[];
  onComplete: (id: string) => void;
  isCompleting: boolean;
}) {
  if (tasks.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        🎉 Không có nhiệm vụ cho hôm nay!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => {
        const Icon = skillIcons[task.skill];
        return (
          <div
            key={task.id}
            className={cn(
              "flex items-center gap-3 p-2 rounded-lg",
              task.isCompleted ? "bg-green-100 dark:bg-green-900/30" : "bg-muted"
            )}
          >
            <Checkbox
              checked={task.isCompleted}
              disabled={task.isCompleted || isCompleting}
              onCheckedChange={() => onComplete(task.id)}
            />
            <Icon className="w-4 h-4 text-muted-foreground" />
            <span
              className={cn(
                "flex-1 text-sm",
                task.isCompleted && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </span>
            <span className="text-xs text-muted-foreground">
              {task.duration} phút
            </span>
          </div>
        );
      })}
    </div>
  );
}

function WeeklyPlanSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-2 w-full mt-3" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-full mb-4" />
        <div className="grid grid-cols-7 gap-2">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

### 6. Progress Service Extension

```typescript
// Update: src/services/progress.service.ts
import type { LearningRoadmap, WeeklyPlan } from "@/types/roadmap.types";

// Add to ProgressService class:
async getRoadmap(): Promise<LearningRoadmap> {
  const response = await apiClient.get<LearningRoadmap>("/users/me/roadmap");
  return response.data;
}

async getWeeklyPlan(week?: number): Promise<WeeklyPlan> {
  const response = await apiClient.get<WeeklyPlan>("/users/me/roadmap/weekly", {
    params: { week },
  });
  return response.data;
}

async completeRoadmapTask(taskId: string): Promise<void> {
  await apiClient.post(`/users/me/roadmap/tasks/${taskId}/complete`);
}

async updateRoadmap(data: { targetLevel: string; targetDate: string }): Promise<LearningRoadmap> {
  const response = await apiClient.put<LearningRoadmap>("/users/me/roadmap", data);
  return response.data;
}
```

---

## File Structure

```
FE/src/
├── types/
│   └── roadmap.types.ts            # NEW - Roadmap types
│
├── hooks/
│   └── useRoadmap.ts               # NEW - Roadmap hooks
│
├── components/dashboard/
│   ├── roadmap-timeline.tsx        # NEW - Timeline visualization
│   ├── skill-recommendations.tsx   # NEW - Skill suggestions
│   └── weekly-plan.tsx             # NEW - Weekly schedule
│
├── services/
│   └── progress.service.ts         # UPDATE - Add methods
```

---

## Next Task

Continue with **FE-037: Recent Activity Feed** - Display user's recent activities.

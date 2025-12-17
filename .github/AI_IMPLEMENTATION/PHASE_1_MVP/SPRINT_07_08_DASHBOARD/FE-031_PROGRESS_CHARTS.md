# Task: FE-031 - Progress Charts

## Task Info

| Field | Value |
|-------|-------|
| **Task ID** | FE-031 |
| **Task Name** | Progress Charts |
| **Module** | Dashboard & Analytics |
| **Sprint** | 07-08 |
| **Estimated Hours** | 6h |
| **Priority** | P0 (Critical) |
| **Dependencies** | FE-029 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Existing components:**
> - `FE/src/components/dashboard/learning-progress.tsx` - ✅ Đã có progress bars
> - `FE/src/components/ui/chart.tsx` - ✅ Recharts wrapper đã config

**Action:** Enhance với charts (radar, line), wire up với API data.

---

## Description

Implement progress visualization:
- Skill radar chart (Reading, Listening, Writing, Speaking)
- Score trend line chart
- Skill progress bars với API data
- Performance comparison

---

## Acceptance Criteria

- [ ] Radar chart cho skill breakdown
- [ ] Line chart cho score trends
- [ ] Animated progress bars
- [ ] Responsive charts
- [ ] Loading/error states

---

## Implementation

### 1. Update Learning Progress Component

```tsx
// src/components/dashboard/learning-progress.tsx
// ⚠️ UPDATE existing file - add charts and API integration

"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useSkillBreakdown, useScoreTrends } from "@/hooks/useDashboard";
import { SkillRadarChart } from "./skill-radar-chart";
import { ScoreTrendChart } from "./score-trend-chart";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function LearningProgress() {
  const { data: skillData, isLoading: skillsLoading } = useSkillBreakdown();
  const { data: trendsData, isLoading: trendsLoading } = useScoreTrends(30);

  if (skillsLoading || trendsLoading) {
    return <LearningProgressSkeleton />;
  }

  if (!skillData) return null;

  const skills = [
    { 
      name: "Reading", 
      nameVi: "Đọc hiểu",
      ...skillData.reading,
      color: "bg-blue-600",
      bgColor: "bg-blue-100",
    },
    { 
      name: "Listening", 
      nameVi: "Nghe hiểu",
      ...skillData.listening,
      color: "bg-green-600",
      bgColor: "bg-green-100",
    },
    { 
      name: "Writing", 
      nameVi: "Viết",
      ...skillData.writing,
      color: "bg-orange-600",
      bgColor: "bg-orange-100",
    },
    { 
      name: "Speaking", 
      nameVi: "Nói",
      ...skillData.speaking,
      color: "bg-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tiến độ học tập</CardTitle>
        <CardDescription>
          Điểm trung bình và xu hướng theo từng kỹ năng
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="radar">Biểu đồ</TabsTrigger>
            <TabsTrigger value="trends">Xu hướng</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {skills.map((skill) => (
              <SkillProgressBar key={skill.name} skill={skill} />
            ))}

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <h4 className="text-sm font-medium text-green-700 mb-1">
                  Điểm mạnh
                </h4>
                <p className="text-sm text-green-600">
                  {skillData.strengths.join(", ") || "Chưa xác định"}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                <h4 className="text-sm font-medium text-orange-700 mb-1">
                  Cần cải thiện
                </h4>
                <p className="text-sm text-orange-600">
                  {skillData.weaknesses.join(", ") || "Chưa xác định"}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="radar">
            <div className="h-80">
              <SkillRadarChart data={skillData} />
            </div>
          </TabsContent>

          <TabsContent value="trends">
            <div className="h-80">
              {trendsData && <ScoreTrendChart data={trendsData.trends} />}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface SkillProgressBarProps {
  skill: {
    name: string;
    nameVi: string;
    averageScore: number;
    improvement: number;
    trend: 'up' | 'down' | 'stable';
    totalAttempts: number;
    color: string;
    bgColor: string;
  };
}

function SkillProgressBar({ skill }: SkillProgressBarProps) {
  const progress = (skill.averageScore / 10) * 100;

  const TrendIcon = {
    up: TrendingUp,
    down: TrendingDown,
    stable: Minus,
  }[skill.trend];

  const trendColor = {
    up: "text-green-600",
    down: "text-red-600",
    stable: "text-gray-400",
  }[skill.trend];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn("w-3 h-3 rounded-full", skill.color)} />
          <span className="text-sm font-medium">{skill.nameVi}</span>
          <span className="text-xs text-muted-foreground">
            ({skill.totalAttempts} bài)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">
            {skill.averageScore.toFixed(1)}/10
          </span>
          <TrendIcon className={cn("h-4 w-4", trendColor)} />
          {skill.improvement !== 0 && (
            <span className={cn("text-xs", trendColor)}>
              {skill.improvement > 0 ? "+" : ""}{skill.improvement.toFixed(1)}
            </span>
          )}
        </div>
      </div>
      <Progress 
        value={progress} 
        className="h-2"
        // Custom color via CSS variable or className
      />
    </div>
  );
}

function LearningProgressSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
```

### 2. Skill Radar Chart

```tsx
// src/components/dashboard/skill-radar-chart.tsx
"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { SkillBreakdown } from "@/types/dashboard.types";

interface SkillRadarChartProps {
  data: SkillBreakdown;
  targetScore?: number;
}

export function SkillRadarChart({ data, targetScore = 7.5 }: SkillRadarChartProps) {
  const chartData = [
    {
      skill: "Reading",
      score: data.reading.averageScore,
      target: targetScore,
      fullMark: 10,
    },
    {
      skill: "Listening",
      score: data.listening.averageScore,
      target: targetScore,
      fullMark: 10,
    },
    {
      skill: "Writing",
      score: data.writing.averageScore,
      target: targetScore,
      fullMark: 10,
    },
    {
      skill: "Speaking",
      score: data.speaking.averageScore,
      target: targetScore,
      fullMark: 10,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
        <PolarGrid gridType="polygon" />
        <PolarAngleAxis 
          dataKey="skill" 
          tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
        />
        <PolarRadiusAxis 
          angle={30} 
          domain={[0, 10]} 
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
        />
        <Radar
          name="Mục tiêu"
          dataKey="target"
          stroke="hsl(var(--muted-foreground))"
          fill="hsl(var(--muted))"
          fillOpacity={0.3}
          strokeDasharray="5 5"
        />
        <Radar
          name="Điểm hiện tại"
          dataKey="score"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.5}
        />
        <Legend />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-background border rounded-lg shadow-lg p-3">
                  <p className="font-medium">{payload[0].payload.skill}</p>
                  <p className="text-sm text-muted-foreground">
                    Điểm: <span className="font-medium text-primary">
                      {payload[0].payload.score.toFixed(1)}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Mục tiêu: {payload[0].payload.target}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
```

### 3. Score Trend Chart

```tsx
// src/components/dashboard/score-trend-chart.tsx
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ScoreTrend } from "@/types/dashboard.types";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

interface ScoreTrendChartProps {
  data: ScoreTrend[];
}

export function ScoreTrendChart({ data }: ScoreTrendChartProps) {
  const formattedData = data.map((item) => ({
    ...item,
    dateLabel: format(parseISO(item.date), "dd/MM", { locale: vi }),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={formattedData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="dateLabel" 
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
        />
        <YAxis 
          domain={[0, 10]} 
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-background border rounded-lg shadow-lg p-3">
                  <p className="font-medium mb-2">{label}</p>
                  {payload.map((entry, index) => (
                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                      {entry.name}: {Number(entry.value).toFixed(1)}
                    </p>
                  ))}
                </div>
              );
            }
            return null;
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="reading"
          name="Reading"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="listening"
          name="Listening"
          stroke="#22c55e"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="writing"
          name="Writing"
          stroke="#f97316"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="speaking"
          name="Speaking"
          stroke="#a855f7"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="average"
          name="Trung bình"
          stroke="hsl(var(--primary))"
          strokeWidth={3}
          strokeDasharray="5 5"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

### 4. Mini Skill Card

```tsx
// src/components/dashboard/skill-mini-card.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkillMiniCardProps {
  skill: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
  onClick?: () => void;
}

export function SkillMiniCard({ 
  skill, 
  score, 
  trend, 
  color,
  onClick 
}: SkillMiniCardProps) {
  const TrendIcon = {
    up: TrendingUp,
    down: TrendingDown,
    stable: Minus,
  }[trend];

  const trendColor = {
    up: "text-green-500",
    down: "text-red-500",
    stable: "text-gray-400",
  }[trend];

  return (
    <Card 
      className={cn(
        "cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5",
        onClick && "hover:ring-2 ring-primary/20"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", color)} />
            <span className="text-sm font-medium">{skill}</span>
          </div>
          <TrendIcon className={cn("h-4 w-4", trendColor)} />
        </div>
        <div className="text-2xl font-bold mb-2">{score.toFixed(1)}</div>
        <Progress value={(score / 10) * 100} className="h-1.5" />
      </CardContent>
    </Card>
  );
}
```

### 5. Weekly Activity Chart

```tsx
// src/components/dashboard/weekly-activity-chart.tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WeeklyActivityData {
  day: string;
  minutes: number;
  practices: number;
}

interface WeeklyActivityChartProps {
  data: WeeklyActivityData[];
}

export function WeeklyActivityChart({ data }: WeeklyActivityChartProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Hoạt động trong tuần</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="day" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border rounded-lg shadow-lg p-2">
                        <p className="text-sm">
                          {payload[0].payload.minutes} phút học
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {payload[0].payload.practices} bài tập
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="minutes"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## File Structure

```
FE/src/components/dashboard/
├── learning-progress.tsx      # UPDATE - Add tabs, charts
├── skill-radar-chart.tsx      # NEW - Radar chart
├── score-trend-chart.tsx      # NEW - Line chart
├── skill-mini-card.tsx        # NEW - Compact skill card
└── weekly-activity-chart.tsx  # NEW - Bar chart
```

---

## Dependencies

```bash
# Recharts đã được cài sẵn qua shadcn/ui chart
# Nếu chưa có:
npm install recharts
```

---

## Next Task

Continue with **FE-032: Activity Calendar** - GitHub-style contribution calendar.

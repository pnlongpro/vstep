# FE-050: Class Analytics Dashboard

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-050 |
| **Phase** | 2 - AI Grading |
| **Sprint** | 11-12 |
| **Priority** | P2 (Medium) |
| **Estimated Hours** | 6h |
| **Dependencies** | BE-049, FE-047 |

---

## 🎯 Objective

Implement analytics dashboard for teachers:
- Class overview statistics cards
- Skill breakdown radar chart
- Student progress table with trends
- Time series charts (line, bar)
- Date range picker

---

## ⚠️ QUAN TRỌNG: Existing Files Warning

### Các file UI Template đã tồn tại (CHỈ THAM KHẢO):
```
UI-Template/
├── components/
│   ├── Statistics.tsx              # Student statistics page
│   └── AdminDashboard.tsx          # Admin analytics charts
├── data/
│   └── learningData.ts             # Mock chart data
```

### Hướng dẫn:
- **THAM KHẢO** `Statistics.tsx` và `AdminDashboard.tsx` cho chart layouts
- **TẠO MỚI** tất cả components trong `FE/src/features/teacher/`
- **SỬ DỤNG** Recharts cho tất cả biểu đồ
- **KHÔNG** import trực tiếp từ UI-Template

---

## 📝 Implementation

### 1. hooks/useClassAnalytics.ts

```typescript
import { useQuery } from '@tanstack/react-query';
import { classService } from '@/services/classService';

export interface ClassOverview {
  totalStudents: number;
  activeStudents: number;
  averageScore: number;
  averageProgress: number;
  totalPracticeHours: number;
  skillBreakdown: {
    reading: number;
    listening: number;
    writing: number;
    speaking: number;
  };
}

export interface StudentProgress {
  studentId: string;
  studentName: string;
  avatar?: string;
  overallProgress: number;
  currentScore: number;
  scoreChange: number;
  practiceCount: number;
  lastActiveAt: string;
}

export interface TimeSeriesData {
  date: string;
  averageScore: number;
  practiceCount: number;
  activeStudents: number;
}

export const useClassOverview = (classId: string) => {
  return useQuery({
    queryKey: ['class-overview', classId],
    queryFn: () => classService.getAnalyticsOverview(classId),
    enabled: !!classId,
  });
};

export const useStudentProgress = (classId: string) => {
  return useQuery({
    queryKey: ['student-progress', classId],
    queryFn: () => classService.getStudentProgress(classId),
    enabled: !!classId,
  });
};

export const useTimeSeriesData = (
  classId: string,
  startDate: Date,
  endDate: Date,
  granularity: 'day' | 'week' | 'month' = 'day'
) => {
  return useQuery({
    queryKey: ['timeseries', classId, startDate.toISOString(), endDate.toISOString(), granularity],
    queryFn: () => classService.getTimeSeriesData(classId, startDate, endDate, granularity),
    enabled: !!classId && !!startDate && !!endDate,
  });
};
```

### 2. components/ClassAnalyticsDashboard.tsx

```tsx
'use client';

import { useState } from 'react';
import { format, subDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useClassOverview, useTimeSeriesData } from '../hooks/useClassAnalytics';
import { OverviewCards } from './analytics/OverviewCards';
import { SkillRadarChart } from './analytics/SkillRadarChart';
import { TimeSeriesChart } from './analytics/TimeSeriesChart';
import { StudentProgressTable } from './analytics/StudentProgressTable';

interface Props {
  classId: string;
}

export function ClassAnalyticsDashboard({ classId }: Props) {
  const [dateRange, setDateRange] = useState({
    start: subDays(new Date(), 30),
    end: new Date(),
  });
  const [granularity, setGranularity] = useState<'day' | 'week' | 'month'>('day');

  const { data: overview, isLoading: loadingOverview } = useClassOverview(classId);
  const { data: timeSeries, isLoading: loadingTimeSeries } = useTimeSeriesData(
    classId,
    dateRange.start,
    dateRange.end,
    granularity
  );

  return (
    <div className="space-y-6">
      {/* Date Range Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Thống kê lớp học</h2>
        
        <div className="flex items-center gap-4">
          <Select value={granularity} onValueChange={(v) => setGranularity(v as any)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Theo ngày</SelectItem>
              <SelectItem value="week">Theo tuần</SelectItem>
              <SelectItem value="month">Theo tháng</SelectItem>
            </SelectContent>
          </Select>

          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
        </div>
      </div>

      {/* Overview Cards */}
      <OverviewCards data={overview} loading={loadingOverview} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Time Series Chart - 2 columns */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Điểm trung bình theo thời gian</CardTitle>
          </CardHeader>
          <CardContent>
            <TimeSeriesChart 
              data={timeSeries || []} 
              loading={loadingTimeSeries} 
            />
          </CardContent>
        </Card>

        {/* Skill Radar Chart - 1 column */}
        <Card>
          <CardHeader>
            <CardTitle>Phân bố kỹ năng</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillRadarChart 
              data={overview?.skillBreakdown} 
              loading={loadingOverview} 
            />
          </CardContent>
        </Card>
      </div>

      {/* Student Progress Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tiến độ học viên</CardTitle>
        </CardHeader>
        <CardContent>
          <StudentProgressTable classId={classId} />
        </CardContent>
      </Card>
    </div>
  );
}

function DateRangePicker({ 
  value, 
  onChange 
}: { 
  value: { start: Date; end: Date };
  onChange: (range: { start: Date; end: Date }) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Calendar className="w-4 h-4" />
          <span>
            {format(value.start, 'dd/MM/yyyy', { locale: vi })} - {format(value.end, 'dd/MM/yyyy', { locale: vi })}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <CalendarPicker
          mode="range"
          selected={{ from: value.start, to: value.end }}
          onSelect={(range) => {
            if (range?.from && range?.to) {
              onChange({ start: range.from, end: range.to });
            }
          }}
          numberOfMonths={2}
          locale={vi}
        />
      </PopoverContent>
    </Popover>
  );
}
```

### 3. components/analytics/OverviewCards.tsx

```tsx
'use client';

import { 
  Users, 
  Clock, 
  TrendingUp, 
  BookOpen 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { ClassOverview } from '../../hooks/useClassAnalytics';

interface Props {
  data?: ClassOverview;
  loading: boolean;
}

export function OverviewCards({ data, loading }: Props) {
  const cards = [
    {
      title: 'Tổng học viên',
      value: data?.totalStudents || 0,
      subtitle: `${data?.activeStudents || 0} đang hoạt động`,
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      title: 'Điểm trung bình',
      value: data?.averageScore?.toFixed(1) || '0.0',
      subtitle: '/10 điểm',
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      title: 'Tiến độ TB',
      value: `${data?.averageProgress || 0}%`,
      subtitle: 'hoàn thành',
      icon: BookOpen,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      title: 'Giờ luyện tập',
      value: data?.totalPracticeHours?.toFixed(0) || '0',
      subtitle: 'giờ',
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {card.value}
                </p>
                <p className="text-xs text-gray-400 mt-1">{card.subtitle}</p>
              </div>
              <div className={`p-3 rounded-lg ${card.bg}`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

### 4. components/analytics/SkillRadarChart.tsx

```tsx
'use client';

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface SkillBreakdown {
  reading: number;
  listening: number;
  writing: number;
  speaking: number;
}

interface Props {
  data?: SkillBreakdown;
  loading: boolean;
}

const skillLabels = {
  reading: 'Đọc',
  listening: 'Nghe',
  writing: 'Viết',
  speaking: 'Nói',
};

export function SkillRadarChart({ data, loading }: Props) {
  if (loading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  const chartData = data
    ? [
        { skill: 'Đọc', score: data.reading, fullMark: 10 },
        { skill: 'Nghe', score: data.listening, fullMark: 10 },
        { skill: 'Viết', score: data.writing, fullMark: 10 },
        { skill: 'Nói', score: data.speaking, fullMark: 10 },
      ]
    : [];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
        <PolarGrid strokeDasharray="3 3" />
        <PolarAngleAxis 
          dataKey="skill" 
          tick={{ fill: '#6B7280', fontSize: 14 }} 
        />
        <PolarRadiusAxis 
          angle={30} 
          domain={[0, 10]} 
          tick={{ fill: '#9CA3AF', fontSize: 12 }}
        />
        <Radar
          name="Điểm TB"
          dataKey="score"
          stroke="#7C3AED"
          fill="#7C3AED"
          fillOpacity={0.4}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
```

### 5. components/analytics/TimeSeriesChart.tsx

```tsx
'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { TimeSeriesData } from '../../hooks/useClassAnalytics';

interface Props {
  data: TimeSeriesData[];
  loading: boolean;
}

export function TimeSeriesChart({ data, loading }: Props) {
  if (loading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-gray-500">
        Chưa có dữ liệu trong khoảng thời gian này
      </div>
    );
  }

  const formattedData = data.map((item) => ({
    ...item,
    displayDate: format(parseISO(item.date), 'dd/MM', { locale: vi }),
  }));

  return (
    <Tabs defaultValue="score" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="score">Điểm số</TabsTrigger>
        <TabsTrigger value="activity">Hoạt động</TabsTrigger>
      </TabsList>

      <TabsContent value="score" className="mt-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="displayDate" 
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis 
              domain={[0, 10]} 
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: 'none',
              }}
              formatter={(value: number) => [`${value.toFixed(1)} điểm`, 'Điểm TB']}
            />
            <Line
              type="monotone"
              dataKey="averageScore"
              stroke="#7C3AED"
              strokeWidth={2}
              dot={{ fill: '#7C3AED', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </TabsContent>

      <TabsContent value="activity" className="mt-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="displayDate" 
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: 'none',
              }}
            />
            <Legend />
            <Bar 
              dataKey="practiceCount" 
              fill="#7C3AED" 
              name="Bài làm"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="activeStudents" 
              fill="#10B981" 
              name="HV hoạt động"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </TabsContent>
    </Tabs>
  );
}
```

### 6. components/analytics/StudentProgressTable.tsx

```tsx
'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ArrowUpRight, ArrowDownRight, Minus, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useStudentProgress } from '../../hooks/useClassAnalytics';

interface Props {
  classId: string;
}

export function StudentProgressTable({ classId }: Props) {
  const [search, setSearch] = useState('');
  const { data: students, isLoading } = useStudentProgress(classId);

  const filteredStudents = students?.filter((s) =>
    s.studentName.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Tìm học viên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Học viên</TableHead>
            <TableHead className="text-center">Điểm hiện tại</TableHead>
            <TableHead className="text-center">Xu hướng</TableHead>
            <TableHead className="text-center">Số bài làm</TableHead>
            <TableHead className="text-right">Hoạt động gần đây</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStudents?.map((student) => (
            <TableRow key={student.studentId}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={student.avatar} />
                    <AvatarFallback className="bg-purple-100 text-purple-700">
                      {student.studentName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">
                      {student.studentName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Tiến độ: {student.overallProgress}%
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell className="text-center">
                <span className="text-lg font-semibold text-gray-900">
                  {student.currentScore.toFixed(1)}
                </span>
                <span className="text-gray-400">/10</span>
              </TableCell>

              <TableCell className="text-center">
                <TrendIndicator change={student.scoreChange} />
              </TableCell>

              <TableCell className="text-center">
                <Badge variant="secondary">
                  {student.practiceCount} bài
                </Badge>
              </TableCell>

              <TableCell className="text-right text-sm text-gray-500">
                {formatDistanceToNow(new Date(student.lastActiveAt), {
                  addSuffix: true,
                  locale: vi,
                })}
              </TableCell>
            </TableRow>
          ))}

          {filteredStudents?.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                Không tìm thấy học viên
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function TrendIndicator({ change }: { change: number }) {
  if (change > 0) {
    return (
      <div className="inline-flex items-center gap-1 text-green-600">
        <ArrowUpRight className="w-4 h-4" />
        <span className="text-sm font-medium">+{change.toFixed(1)}</span>
      </div>
    );
  }

  if (change < 0) {
    return (
      <div className="inline-flex items-center gap-1 text-red-600">
        <ArrowDownRight className="w-4 h-4" />
        <span className="text-sm font-medium">{change.toFixed(1)}</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1 text-gray-400">
      <Minus className="w-4 h-4" />
      <span className="text-sm">0</span>
    </div>
  );
}
```

---

## 📦 Dependencies

```bash
npm install recharts date-fns
npm install -D @types/recharts
```

---

## ✅ Acceptance Criteria

- [ ] Overview cards hiển thị chính xác
- [ ] Radar chart cho skill breakdown
- [ ] Line chart điểm theo thời gian
- [ ] Bar chart hoạt động
- [ ] Date range picker hoạt động
- [ ] Granularity selector (day/week/month)
- [ ] Student table với search
- [ ] Trend indicators (+/-)
- [ ] Loading skeletons
- [ ] Empty states
- [ ] Responsive trên mobile

---

## 🧪 Test Cases

```typescript
describe('ClassAnalyticsDashboard', () => {
  it('renders overview cards with correct data', () => {
    // Mock overview data
    // Check card values
  });

  it('switches between chart tabs', () => {
    // Click activity tab
    // Verify bar chart visible
  });

  it('filters students by search', () => {
    // Type in search input
    // Verify filtered results
  });

  it('changes date range', () => {
    // Open date picker
    // Select range
    // Verify API call with new dates
  });
});
```

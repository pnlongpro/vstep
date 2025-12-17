# FE-060: Analytics Dashboard UI

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-060 |
| **Phase** | 3 - Enterprise |
| **Sprint** | 15-16 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 5h |
| **Dependencies** | BE-057, FE-057 |

---

## 🎯 Objective

Implement admin analytics dashboard:
- Overview metrics cards
- User growth chart
- Exam completion chart
- Revenue chart (placeholder)
- Date range picker
- Export data functionality

---

## ⚠️ QUAN TRỌNG: Existing Files Warning

### Các file UI Template đã tồn tại (CHỈ THAM KHẢO):
```
UI-Template/
├── components/
│   ├── AdminDashboard.tsx         # Contains basic charts
│   └── Statistics.tsx              # Statistics components
```

### Hướng dẫn:
- **TẠO MỚI** trong `FE/src/features/admin/analytics/`
- Use Recharts library for charts
- Follow admin color scheme (red-600 primary)

---

## 📝 Implementation

### 1. hooks/useAdminAnalytics.ts

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { adminAnalyticsService } from '@/services/adminAnalyticsService';

export interface AnalyticsParams {
  startDate?: string;
  endDate?: string;
  granularity?: 'day' | 'week' | 'month';
}

export const useOverviewAnalytics = () => {
  return useQuery({
    queryKey: ['admin-analytics-overview'],
    queryFn: () => adminAnalyticsService.getOverview(),
  });
};

export const useUserAnalytics = (params: AnalyticsParams) => {
  return useQuery({
    queryKey: ['admin-analytics-users', params],
    queryFn: () => adminAnalyticsService.getUserAnalytics(params),
    enabled: !!params.startDate && !!params.endDate,
  });
};

export const useExamAnalytics = (params: AnalyticsParams) => {
  return useQuery({
    queryKey: ['admin-analytics-exams', params],
    queryFn: () => adminAnalyticsService.getExamAnalytics(params),
    enabled: !!params.startDate && !!params.endDate,
  });
};

export const useRevenueAnalytics = (params: AnalyticsParams) => {
  return useQuery({
    queryKey: ['admin-analytics-revenue', params],
    queryFn: () => adminAnalyticsService.getRevenueAnalytics(params),
    enabled: !!params.startDate && !!params.endDate,
  });
};

export const useExportAnalytics = () => {
  return useMutation({
    mutationFn: (params: AnalyticsParams & { type: string }) =>
      adminAnalyticsService.exportData(params),
  });
};
```

### 2. components/AnalyticsDashboard.tsx

```tsx
'use client';

import { useState } from 'react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import {
  useOverviewAnalytics,
  useUserAnalytics,
  useExamAnalytics,
  useRevenueAnalytics,
  useExportAnalytics,
  AnalyticsParams,
} from '../hooks/useAdminAnalytics';
import { UserGrowthChart } from './UserGrowthChart';
import { ExamCompletionChart } from './ExamCompletionChart';
import { RevenueChart } from './RevenueChart';
import { SkillDistributionChart } from './SkillDistributionChart';
import { toast } from 'sonner';

type DateRange = { from: Date; to: Date };
type Granularity = 'day' | 'week' | 'month';

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [granularity, setGranularity] = useState<Granularity>('day');

  const params: AnalyticsParams = {
    startDate: format(dateRange.from, 'yyyy-MM-dd'),
    endDate: format(dateRange.to, 'yyyy-MM-dd'),
    granularity,
  };

  const { data: overview, isLoading: overviewLoading, refetch } = useOverviewAnalytics();
  const { data: userAnalytics, isLoading: userLoading } = useUserAnalytics(params);
  const { data: examAnalytics, isLoading: examLoading } = useExamAnalytics(params);
  const { data: revenueAnalytics, isLoading: revenueLoading } = useRevenueAnalytics(params);

  const exportMutation = useExportAnalytics();

  const handleExport = async (type: string) => {
    try {
      const blob = await exportMutation.mutateAsync({ ...params, type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${type}-${format(new Date(), 'yyyyMMdd')}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Xuất dữ liệu thành công');
    } catch (error: any) {
      toast.error(error.message || 'Không thể xuất dữ liệu');
    }
  };

  const handleQuickSelect = (preset: string) => {
    const today = new Date();
    switch (preset) {
      case '7days':
        setDateRange({ from: subDays(today, 7), to: today });
        break;
      case '30days':
        setDateRange({ from: subDays(today, 30), to: today });
        break;
      case 'thisMonth':
        setDateRange({ from: startOfMonth(today), to: endOfMonth(today) });
        break;
      case '90days':
        setDateRange({ from: subDays(today, 90), to: today });
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Phân tích hệ thống</h1>
          <p className="text-gray-500">
            Dữ liệu từ {format(dateRange.from, 'dd/MM/yyyy', { locale: vi })} đến{' '}
            {format(dateRange.to, 'dd/MM/yyyy', { locale: vi })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Làm mới
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('all')}
            disabled={exportMutation.isPending}
          >
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Date filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickSelect('7days')}
              >
                7 ngày
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickSelect('30days')}
              >
                30 ngày
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickSelect('thisMonth')}
              >
                Tháng này
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickSelect('90days')}
              >
                90 ngày
              </Button>
            </div>

            <DatePickerWithRange
              value={dateRange}
              onChange={(range) => range && setDateRange(range as DateRange)}
            />

            <Select
              value={granularity}
              onValueChange={(v) => setGranularity(v as Granularity)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Theo ngày</SelectItem>
                <SelectItem value="week">Theo tuần</SelectItem>
                <SelectItem value="month">Theo tháng</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Overview Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {overviewLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </>
        ) : (
          <>
            <MetricCard
              icon={Users}
              label="Tổng người dùng"
              value={overview?.totalUsers || 0}
              growth={overview?.userGrowth || 0}
              color="blue"
            />
            <MetricCard
              icon={FileText}
              label="Bài thi hoàn thành"
              value={overview?.totalAttempts || 0}
              growth={overview?.attemptGrowth || 0}
              color="green"
            />
            <MetricCard
              icon={DollarSign}
              label="Doanh thu"
              value={formatCurrency(overview?.totalRevenue || 0)}
              growth={overview?.revenueGrowth || 0}
              color="purple"
              isCurrency
            />
            <MetricCard
              icon={TrendingUp}
              label="Điểm trung bình"
              value={overview?.averageScore?.toFixed(1) || '0'}
              subtext="trên thang 10"
              color="orange"
            />
          </>
        )}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tăng trưởng người dùng</CardTitle>
          </CardHeader>
          <CardContent>
            {userLoading ? (
              <Skeleton className="h-64" />
            ) : (
              <UserGrowthChart data={userAnalytics?.timeSeries || []} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bài thi hoàn thành</CardTitle>
          </CardHeader>
          <CardContent>
            {examLoading ? (
              <Skeleton className="h-64" />
            ) : (
              <ExamCompletionChart data={examAnalytics?.timeSeries || []} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu</CardTitle>
          </CardHeader>
          <CardContent>
            {revenueLoading ? (
              <Skeleton className="h-64" />
            ) : (
              <RevenueChart data={revenueAnalytics?.timeSeries || []} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phân bố theo kỹ năng</CardTitle>
          </CardHeader>
          <CardContent>
            {examLoading ? (
              <Skeleton className="h-64" />
            ) : (
              <SkillDistributionChart data={examAnalytics?.bySkill || []} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top đề thi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {examAnalytics?.topExams?.map((exam: any, index: number) => (
                <div key={exam.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500">
                      #{index + 1}
                    </span>
                    <span className="font-medium truncate max-w-[150px]">
                      {exam.title}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {exam.attemptCount} lượt
                  </span>
                </div>
              )) || <p className="text-gray-500">Không có dữ liệu</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phân bố level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overview?.levelDistribution?.map((item: any) => (
                <div key={item.level} className="flex items-center gap-3">
                  <span className="font-medium w-8">{item.level}</span>
                  <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-12 text-right">
                    {item.percentage}%
                  </span>
                </div>
              )) || <p className="text-gray-500">Không có dữ liệu</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overview?.recentActivity?.slice(0, 5).map((activity: any) => (
                <div key={activity.id} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm truncate">{activity.description}</span>
                </div>
              )) || <p className="text-gray-500">Không có hoạt động</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper components
function MetricCard({
  icon: Icon,
  label,
  value,
  growth,
  subtext,
  color,
  isCurrency,
}: {
  icon: any;
  label: string;
  value: string | number;
  growth?: number;
  subtext?: string;
  color: string;
  isCurrency?: boolean;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          {growth !== undefined && (
            <div
              className={`flex items-center text-sm ${
                growth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {growth >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {Math.abs(growth)}%
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="text-2xl font-bold">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          <p className="text-sm text-gray-500">{subtext || label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}
```

### 3. components/UserGrowthChart.tsx

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
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

interface DataPoint {
  date: string;
  newUsers: number;
  totalUsers: number;
}

interface Props {
  data: DataPoint[];
}

export function UserGrowthChart({ data }: Props) {
  if (!data.length) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        Không có dữ liệu
      </div>
    );
  }

  const formattedData = data.map((item) => ({
    ...item,
    formattedDate: format(parseISO(item.date), 'dd/MM', { locale: vi }),
  }));

  return (
    <ResponsiveContainer width="100%" height={256}>
      <LineChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="formattedDate" fontSize={12} tickLine={false} />
        <YAxis fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
          labelFormatter={(label) => `Ngày: ${label}`}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="newUsers"
          name="Người dùng mới"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="totalUsers"
          name="Tổng cộng"
          stroke="#10b981"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

### 4. components/ExamCompletionChart.tsx

```tsx
'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

interface DataPoint {
  date: string;
  completed: number;
  inProgress: number;
}

interface Props {
  data: DataPoint[];
}

export function ExamCompletionChart({ data }: Props) {
  if (!data.length) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        Không có dữ liệu
      </div>
    );
  }

  const formattedData = data.map((item) => ({
    ...item,
    formattedDate: format(parseISO(item.date), 'dd/MM', { locale: vi }),
  }));

  return (
    <ResponsiveContainer width="100%" height={256}>
      <BarChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="formattedDate" fontSize={12} tickLine={false} />
        <YAxis fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
        />
        <Legend />
        <Bar
          dataKey="completed"
          name="Hoàn thành"
          fill="#10b981"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="inProgress"
          name="Đang làm"
          fill="#f59e0b"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
```

### 5. components/RevenueChart.tsx

```tsx
'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

interface DataPoint {
  date: string;
  revenue: number;
}

interface Props {
  data: DataPoint[];
}

export function RevenueChart({ data }: Props) {
  if (!data.length) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        Chưa có dữ liệu doanh thu
      </div>
    );
  }

  const formattedData = data.map((item) => ({
    ...item,
    formattedDate: format(parseISO(item.date), 'dd/MM', { locale: vi }),
    formattedRevenue: new Intl.NumberFormat('vi-VN').format(item.revenue),
  }));

  return (
    <ResponsiveContainer width="100%" height={256}>
      <AreaChart data={formattedData}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="formattedDate" fontSize={12} tickLine={false} />
        <YAxis
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) =>
            new Intl.NumberFormat('vi-VN', {
              notation: 'compact',
            }).format(value)
          }
        />
        <Tooltip
          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
          formatter={(value: number) =>
            new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(value)
          }
        />
        <Area
          type="monotone"
          dataKey="revenue"
          name="Doanh thu"
          stroke="#8b5cf6"
          fill="url(#revenueGradient)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
```

### 6. components/SkillDistributionChart.tsx

```tsx
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DataPoint {
  skill: string;
  count: number;
}

interface Props {
  data: DataPoint[];
}

const COLORS = {
  reading: '#3b82f6',
  listening: '#10b981',
  writing: '#f59e0b',
  speaking: '#ef4444',
};

const SKILL_LABELS: Record<string, string> = {
  reading: 'Reading',
  listening: 'Listening',
  writing: 'Writing',
  speaking: 'Speaking',
};

export function SkillDistributionChart({ data }: Props) {
  if (!data.length) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        Không có dữ liệu
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: SKILL_LABELS[item.skill] || item.skill,
    value: item.count,
    color: COLORS[item.skill as keyof typeof COLORS] || '#6b7280',
  }));

  return (
    <ResponsiveContainer width="100%" height={256}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
          formatter={(value: number) => [`${value} bài`, 'Số lượng']}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
```

---

## ✅ Acceptance Criteria

- [ ] Overview metrics display correctly
- [ ] Date range picker works
- [ ] Quick date presets work
- [ ] Granularity selector works
- [ ] User growth chart renders
- [ ] Exam completion chart renders
- [ ] Revenue chart renders
- [ ] Skill distribution chart renders
- [ ] Export to CSV works
- [ ] Refresh button works
- [ ] Loading states shown

---

## 🧪 Test Cases

```typescript
describe('AnalyticsDashboard', () => {
  it('loads overview metrics', async () => {
    // Render dashboard
    // Verify metrics cards displayed
  });

  it('changes date range', async () => {
    // Select 7 days preset
    // Verify charts reload
  });

  it('changes granularity', async () => {
    // Select week granularity
    // Verify data aggregated by week
  });

  it('exports data', async () => {
    // Click export
    // Verify file downloaded
  });
});
```

# FE-063: Goal Setting UI

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-063 |
| **Phase** | 3 - Enterprise |
| **Sprint** | 17-18 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 5h |
| **Dependencies** | BE-060 |

---

## 🎯 Objective

Implement goal management UI:
- Goal dashboard with active goals
- Goal setting modal (daily/weekly/monthly)
- Goal card with progress tracking
- Goal completion celebration
- Goal history view

---

## ⚠️ QUAN TRỌNG: Existing Files Warning

### Các file UI Template đã tồn tại (CHỈ THAM KHẢO):
```
UI-Template/
├── components/
│   ├── Goals.tsx                  # Goals page
│   ├── GoalCard.tsx               # Goal card component
│   ├── GoalSettingModal.tsx       # Goal creation modal
│   └── GoalAchievedModal.tsx      # Completion celebration
├── data/
│   └── goals.ts                   # Sample goal data
├── GOAL_SYSTEM_README.md          # Goal system docs
```

### Hướng dẫn:
- **THAM KHẢO** UI-Template để lấy ý tưởng thiết kế
- **TẠO MỚI** trong `FE/src/features/gamification/goals/`

---

## 📝 Implementation

### 1. hooks/useGoals.ts

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goalService, CreateGoalDto, UpdateProgressDto } from '@/services/goalService';

export interface Goal {
  id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  targetType: 'practice_minutes' | 'tests_completed' | 'xp_earned' | 'streak_days' | 'custom';
  targetValue: number;
  currentValue: number;
  title: string;
  description?: string;
  status: 'active' | 'completed' | 'failed' | 'cancelled';
  startDate: Date;
  endDate: Date;
  xpReward: number;
  createdAt: Date;
}

export const useActiveGoals = () => {
  return useQuery({
    queryKey: ['goals', 'active'],
    queryFn: () => goalService.getActiveGoals(),
  });
};

export const useGoalHistory = (params?: { status?: string; page?: number }) => {
  return useQuery({
    queryKey: ['goals', 'history', params],
    queryFn: () => goalService.getHistory(params),
  });
};

export const useCreateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGoalDto) => goalService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
};

export const useUpdateGoalProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProgressDto }) =>
      goalService.updateProgress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
};

export const useCancelGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => goalService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
};
```

### 2. components/GoalsDashboard.tsx

```tsx
'use client';

import { useState } from 'react';
import { Plus, Target, Calendar, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useActiveGoals, useGoalHistory, Goal } from '../hooks/useGoals';
import { GoalCard } from './GoalCard';
import { GoalSettingModal } from './GoalSettingModal';
import { GoalAchievedModal } from './GoalAchievedModal';
import { GoalHistoryList } from './GoalHistoryList';

export function GoalsDashboard() {
  const { data: activeGoals, isLoading } = useActiveGoals();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [achievedGoal, setAchievedGoal] = useState<Goal | null>(null);

  const dailyGoals = activeGoals?.filter((g) => g.type === 'daily') || [];
  const weeklyGoals = activeGoals?.filter((g) => g.type === 'weekly') || [];
  const monthlyGoals = activeGoals?.filter((g) => g.type === 'monthly') || [];

  const handleGoalComplete = (goal: Goal) => {
    setAchievedGoal(goal);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-500" />
            Mục tiêu của tôi
          </h2>
          <p className="text-gray-500">
            Thiết lập và theo dõi mục tiêu học tập
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Tạo mục tiêu
        </Button>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active" className="gap-2">
            <Calendar className="w-4 h-4" />
            Đang hoạt động
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="w-4 h-4" />
            Lịch sử
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6 space-y-6">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          ) : (
            <>
              {/* Daily Goals */}
              <GoalSection
                title="Mục tiêu hôm nay"
                icon="🌅"
                goals={dailyGoals}
                onComplete={handleGoalComplete}
              />

              {/* Weekly Goals */}
              <GoalSection
                title="Mục tiêu tuần này"
                icon="📅"
                goals={weeklyGoals}
                onComplete={handleGoalComplete}
              />

              {/* Monthly Goals */}
              <GoalSection
                title="Mục tiêu tháng này"
                icon="🗓️"
                goals={monthlyGoals}
                onComplete={handleGoalComplete}
              />

              {activeGoals?.length === 0 && (
                <Card className="bg-gray-50 border-dashed">
                  <CardContent className="py-12 text-center">
                    <Target className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Chưa có mục tiêu nào
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Tạo mục tiêu để theo dõi tiến độ học tập
                    </p>
                    <Button variant="outline" onClick={() => setIsCreateOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Tạo mục tiêu đầu tiên
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <GoalHistoryList />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <GoalSettingModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <GoalAchievedModal goal={achievedGoal} onClose={() => setAchievedGoal(null)} />
    </div>
  );
}

interface GoalSectionProps {
  title: string;
  icon: string;
  goals: Goal[];
  onComplete: (goal: Goal) => void;
}

function GoalSection({ title, icon, goals, onComplete }: GoalSectionProps) {
  if (goals.length === 0) return null;

  return (
    <div>
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} onComplete={() => onComplete(goal)} />
        ))}
      </div>
    </div>
  );
}
```

### 3. components/GoalCard.tsx

```tsx
'use client';

import { useState, useEffect } from 'react';
import { format, differenceInHours, differenceInDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Clock, Gift, MoreVertical, X, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Goal, useCancelGoal } from '../hooks/useGoals';

interface Props {
  goal: Goal;
  onComplete?: () => void;
}

const GOAL_TYPE_ICONS = {
  practice_minutes: '⏱️',
  tests_completed: '📝',
  xp_earned: '⭐',
  streak_days: '🔥',
  custom: '🎯',
};

const GOAL_TYPE_UNITS = {
  practice_minutes: 'phút',
  tests_completed: 'bài',
  xp_earned: 'XP',
  streak_days: 'ngày',
  custom: '',
};

export function GoalCard({ goal, onComplete }: Props) {
  const { mutate: cancel, isPending } = useCancelGoal();
  const progress = Math.min(Math.round((goal.currentValue / goal.targetValue) * 100), 100);
  const isComplete = goal.status === 'completed';
  const isNearlyComplete = progress >= 80 && !isComplete;

  // Check if just completed
  useEffect(() => {
    if (progress >= 100 && goal.status === 'active' && onComplete) {
      onComplete();
    }
  }, [progress, goal.status, onComplete]);

  const getTimeRemaining = () => {
    const now = new Date();
    const end = new Date(goal.endDate);
    const hours = differenceInHours(end, now);
    const days = differenceInDays(end, now);

    if (days > 0) return `${days} ngày`;
    if (hours > 0) return `${hours} giờ`;
    return 'Sắp hết hạn';
  };

  return (
    <Card
      className={cn(
        'relative transition-all',
        isComplete && 'bg-green-50 border-green-200',
        isNearlyComplete && 'border-yellow-300 shadow-yellow-100 shadow-md',
      )}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              {GOAL_TYPE_ICONS[goal.targetType] || '🎯'}
            </span>
            <div>
              <h4 className="font-semibold line-clamp-1">{goal.title}</h4>
              <span className="text-xs text-gray-500 capitalize">
                {goal.type === 'daily' && 'Hàng ngày'}
                {goal.type === 'weekly' && 'Hàng tuần'}
                {goal.type === 'monthly' && 'Hàng tháng'}
                {goal.type === 'custom' && 'Tùy chỉnh'}
              </span>
            </div>
          </div>

          {!isComplete && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => cancel(goal.id)}
                  disabled={isPending}
                  className="text-red-600"
                >
                  <X className="w-4 h-4 mr-2" />
                  Hủy mục tiêu
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {isComplete && (
            <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full">
              <Check className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">
              {goal.currentValue} / {goal.targetValue}{' '}
              {GOAL_TYPE_UNITS[goal.targetType]}
            </span>
            <span className={cn('font-medium', isComplete ? 'text-green-600' : 'text-blue-600')}>
              {progress}%
            </span>
          </div>
          <Progress
            value={progress}
            className={cn('h-2', isComplete && '[&>div]:bg-green-500')}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm">
          {!isComplete && (
            <div className="flex items-center gap-1 text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{getTimeRemaining()}</span>
            </div>
          )}

          {isComplete && (
            <span className="text-green-600 font-medium">Hoàn thành!</span>
          )}

          <div className="flex items-center gap-1 text-yellow-600">
            <Gift className="w-4 h-4" />
            <span>+{goal.xpReward} XP</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 4. components/GoalSettingModal.tsx

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar } from 'lucide-react';
import { addDays, addWeeks, addMonths, format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCreateGoal } from '../hooks/useGoals';

const goalSchema = z.object({
  type: z.enum(['daily', 'weekly', 'monthly']),
  targetType: z.enum(['practice_minutes', 'tests_completed', 'xp_earned', 'streak_days']),
  targetValue: z.number().min(1, 'Giá trị phải lớn hơn 0'),
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  description: z.string().optional(),
});

type GoalFormData = z.infer<typeof goalSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

const TARGET_OPTIONS = [
  { value: 'practice_minutes', label: 'Thời gian luyện tập', unit: 'phút', icon: '⏱️' },
  { value: 'tests_completed', label: 'Bài test hoàn thành', unit: 'bài', icon: '📝' },
  { value: 'xp_earned', label: 'XP kiếm được', unit: 'XP', icon: '⭐' },
  { value: 'streak_days', label: 'Duy trì streak', unit: 'ngày', icon: '🔥' },
];

const SUGGESTED_VALUES = {
  practice_minutes: { daily: 30, weekly: 180, monthly: 600 },
  tests_completed: { daily: 2, weekly: 10, monthly: 30 },
  xp_earned: { daily: 100, weekly: 500, monthly: 1500 },
  streak_days: { daily: 1, weekly: 7, monthly: 30 },
};

export function GoalSettingModal({ open, onClose }: Props) {
  const { mutate: create, isPending } = useCreateGoal();

  const form = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      type: 'daily',
      targetType: 'practice_minutes',
      targetValue: 30,
      title: '',
    },
  });

  const watchType = form.watch('type');
  const watchTargetType = form.watch('targetType');

  const getEndDate = (type: string) => {
    const now = new Date();
    switch (type) {
      case 'daily':
        return addDays(now, 1);
      case 'weekly':
        return addWeeks(now, 1);
      case 'monthly':
        return addMonths(now, 1);
      default:
        return addDays(now, 1);
    }
  };

  const getXpReward = (type: string) => {
    switch (type) {
      case 'daily':
        return 50;
      case 'weekly':
        return 200;
      case 'monthly':
        return 500;
      default:
        return 50;
    }
  };

  const handleTargetTypeChange = (value: string) => {
    form.setValue('targetType', value as any);
    const suggested = SUGGESTED_VALUES[value]?.[watchType];
    if (suggested) {
      form.setValue('targetValue', suggested);
    }
  };

  const handleTypeChange = (value: string) => {
    form.setValue('type', value as any);
    const suggested = SUGGESTED_VALUES[watchTargetType]?.[value];
    if (suggested) {
      form.setValue('targetValue', suggested);
    }
  };

  const onSubmit = (data: GoalFormData) => {
    create(
      {
        ...data,
        endDate: getEndDate(data.type),
        xpReward: getXpReward(data.type),
      },
      {
        onSuccess: () => {
          form.reset();
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Tạo mục tiêu mới</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Goal Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại mục tiêu</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={(value) => handleTypeChange(value)}
                      className="grid grid-cols-3 gap-4"
                    >
                      <label
                        className={`cursor-pointer border rounded-lg p-4 text-center transition-all ${
                          field.value === 'daily'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <RadioGroupItem value="daily" className="sr-only" />
                        <div className="text-2xl mb-1">🌅</div>
                        <div className="font-medium">Hàng ngày</div>
                        <div className="text-xs text-gray-500">+50 XP</div>
                      </label>

                      <label
                        className={`cursor-pointer border rounded-lg p-4 text-center transition-all ${
                          field.value === 'weekly'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <RadioGroupItem value="weekly" className="sr-only" />
                        <div className="text-2xl mb-1">📅</div>
                        <div className="font-medium">Hàng tuần</div>
                        <div className="text-xs text-gray-500">+200 XP</div>
                      </label>

                      <label
                        className={`cursor-pointer border rounded-lg p-4 text-center transition-all ${
                          field.value === 'monthly'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <RadioGroupItem value="monthly" className="sr-only" />
                        <div className="text-2xl mb-1">🗓️</div>
                        <div className="font-medium">Hàng tháng</div>
                        <div className="text-xs text-gray-500">+500 XP</div>
                      </label>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Target Type */}
            <FormField
              control={form.control}
              name="targetType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại chỉ tiêu</FormLabel>
                  <Select value={field.value} onValueChange={handleTargetTypeChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại chỉ tiêu" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TARGET_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <span className="flex items-center gap-2">
                            <span>{option.icon}</span>
                            {option.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Target Value */}
            <FormField
              control={form.control}
              name="targetValue"
              render={({ field }) => {
                const unit = TARGET_OPTIONS.find((o) => o.value === watchTargetType)?.unit || '';
                return (
                  <FormItem>
                    <FormLabel>Giá trị mục tiêu ({unit})</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: Luyện nghe 30 phút mỗi ngày"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả (tùy chọn)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Thêm ghi chú cho mục tiêu..."
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Summary */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>
                  Hạn chót: {format(getEndDate(watchType), 'dd/MM/yyyy HH:mm')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm mt-1">
                <span className="text-yellow-600">⭐</span>
                <span>Phần thưởng: +{getXpReward(watchType)} XP</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Hủy
              </Button>
              <Button type="submit" disabled={isPending} className="flex-1">
                {isPending ? 'Đang tạo...' : 'Tạo mục tiêu'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

### 5. components/GoalAchievedModal.tsx

```tsx
'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Gift, Target } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Goal } from '../hooks/useGoals';

interface Props {
  goal: Goal | null;
  onClose: () => void;
}

export function GoalAchievedModal({ goal, onClose }: Props) {
  useEffect(() => {
    if (goal) {
      // Celebration confetti
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#22c55e', '#16a34a', '#4ade80'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#22c55e', '#16a34a', '#4ade80'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [goal]);

  if (!goal) return null;

  return (
    <Dialog open={!!goal} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md overflow-hidden p-0 bg-gradient-to-b from-green-50 to-emerald-50">
        <div className="text-center py-10 px-6">
          {/* Trophy animation */}
          <AnimatePresence>
            <motion.div
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="relative inline-block mb-6"
            >
              {/* Glow */}
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 w-28 h-28 rounded-full bg-green-400 blur-2xl"
              />

              {/* Trophy */}
              <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                <Trophy className="w-14 h-14 text-white" />
              </div>

              {/* Checkmark */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center"
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-sm font-medium text-green-600 mb-2">
              🎉 MỤC TIÊU HOÀN THÀNH!
            </h2>
            <h3 className="text-2xl font-bold mb-2">{goal.title}</h3>
            <p className="text-gray-600 mb-4">
              Bạn đã đạt được{' '}
              <span className="font-semibold">{goal.targetValue}</span>{' '}
              {getTargetUnit(goal.targetType)}!
            </p>

            {/* XP Reward */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-white font-bold shadow-lg"
            >
              <Gift className="w-5 h-5" />
              +{goal.xpReward} XP
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <Button
              onClick={onClose}
              className="bg-green-600 hover:bg-green-700 px-8"
            >
              Tiếp tục
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getTargetUnit(targetType: string): string {
  switch (targetType) {
    case 'practice_minutes':
      return 'phút luyện tập';
    case 'tests_completed':
      return 'bài test';
    case 'xp_earned':
      return 'XP';
    case 'streak_days':
      return 'ngày streak';
    default:
      return '';
  }
}
```

### 6. components/GoalHistoryList.tsx

```tsx
'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Check, X, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useGoalHistory } from '../hooks/useGoals';

const STATUS_MAP = {
  completed: { label: 'Hoàn thành', icon: Check, color: 'bg-green-100 text-green-700' },
  failed: { label: 'Thất bại', icon: X, color: 'bg-red-100 text-red-700' },
  cancelled: { label: 'Đã hủy', icon: Clock, color: 'bg-gray-100 text-gray-700' },
};

export function GoalHistoryList() {
  const [filter, setFilter] = useState<string>('all');
  const { data, isLoading } = useGoalHistory({
    status: filter === 'all' ? undefined : filter,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex justify-end">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="completed">Hoàn thành</SelectItem>
            <SelectItem value="failed">Thất bại</SelectItem>
            <SelectItem value="cancelled">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {data?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            Không có lịch sử mục tiêu
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {data?.map((goal) => {
            const status = STATUS_MAP[goal.status as keyof typeof STATUS_MAP];
            const Icon = status?.icon || Clock;

            return (
              <Card key={goal.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${status?.color || 'bg-gray-100'}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">{goal.title}</h4>
                      <p className="text-sm text-gray-500">
                        {goal.currentValue}/{goal.targetValue} •{' '}
                        {format(new Date(goal.endDate), 'dd/MM/yyyy', { locale: vi })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {goal.status === 'completed' && (
                      <span className="text-sm text-green-600 font-medium">
                        +{goal.xpReward} XP
                      </span>
                    )}
                    <Badge variant="outline" className={status?.color}>
                      {status?.label}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

### 7. services/goalService.ts

```typescript
import { apiClient } from '@/lib/apiClient';
import { Goal } from '../features/gamification/hooks/useGoals';

export interface CreateGoalDto {
  type: 'daily' | 'weekly' | 'monthly';
  targetType: string;
  targetValue: number;
  title: string;
  description?: string;
  endDate: Date;
  xpReward: number;
}

export interface UpdateProgressDto {
  currentValue: number;
}

export const goalService = {
  async getActiveGoals(): Promise<Goal[]> {
    const { data } = await apiClient.get('/goals/active');
    return data;
  },

  async getHistory(params?: { status?: string; page?: number }): Promise<Goal[]> {
    const { data } = await apiClient.get('/goals/history', { params });
    return data;
  },

  async create(dto: CreateGoalDto): Promise<Goal> {
    const { data } = await apiClient.post('/goals', dto);
    return data;
  },

  async updateProgress(id: string, dto: UpdateProgressDto): Promise<Goal> {
    const { data } = await apiClient.patch(`/goals/${id}/progress`, dto);
    return data;
  },

  async cancel(id: string): Promise<void> {
    await apiClient.delete(`/goals/${id}`);
  },
};
```

---

## ✅ Acceptance Criteria

- [ ] Goal dashboard shows active goals by type
- [ ] Create modal with type selection
- [ ] Target type and value inputs
- [ ] Progress bar updates in real-time
- [ ] Time remaining countdown
- [ ] Completion celebration modal
- [ ] Goal history with filtering
- [ ] Cancel goal functionality

---

## 🧪 Test Cases

```typescript
describe('GoalsDashboard', () => {
  it('groups goals by type', async () => {
    // Render with mixed goal types
    // Verify daily, weekly, monthly sections
  });

  it('opens create modal', async () => {
    // Click create button
    // Verify modal opens with form
  });
});

describe('GoalCard', () => {
  it('shows progress correctly', async () => {
    // Render goal with 50% progress
    // Verify progress bar at 50%
  });

  it('highlights near completion', async () => {
    // Render goal at 80% progress
    // Verify yellow highlight
  });
});

describe('GoalSettingModal', () => {
  it('suggests values based on type', async () => {
    // Select weekly type
    // Verify target value updates
  });

  it('creates goal with correct data', async () => {
    // Fill form and submit
    // Verify API called with data
  });
});
```

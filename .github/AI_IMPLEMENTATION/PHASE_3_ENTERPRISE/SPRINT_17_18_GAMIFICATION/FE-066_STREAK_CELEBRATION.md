# FE-066: Streak Celebration

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-066 |
| **Phase** | 3 - Enterprise |
| **Sprint** | 17-18 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 5h |
| **Dependencies** | BE-063 |

---

## 🎯 Objective

Implement streak display and celebration:
- Streak counter widget
- Weekly activity calendar
- Streak milestone celebrations
- Streak freeze indicator
- Activity logging visualization

---

## 📝 Implementation

### 1. hooks/useStreak.ts

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { streakService } from '@/services/streakService';

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  weeklyProgress: boolean[]; // 7 days, Mon-Sun
  lastActivityDate: Date | null;
  freezesRemaining: number;
  freezesUsedThisMonth: number;
  isFrozenToday: boolean;
  streakWillBreakAt?: Date;
}

export interface ActivityLog {
  id: string;
  type: 'practice' | 'exam' | 'login' | 'lesson';
  title: string;
  duration?: number;
  xpEarned: number;
  createdAt: Date;
}

export const useStreakInfo = () => {
  return useQuery({
    queryKey: ['streak-info'],
    queryFn: () => streakService.getInfo(),
  });
};

export const useWeeklyActivity = () => {
  return useQuery({
    queryKey: ['weekly-activity'],
    queryFn: () => streakService.getWeeklyActivity(),
  });
};

export const useUseStreakFreeze = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => streakService.useFreeze(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['streak-info'] });
    },
  });
};

export const useActivityHistory = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['activity-history', params],
    queryFn: () => streakService.getHistory(params),
  });
};
```

### 2. components/StreakCounter.tsx

```tsx
'use client';

import { useState } from 'react';
import { Flame, Shield, Calendar, Trophy, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useStreakInfo, useUseStreakFreeze } from '../hooks/useStreak';
import { StreakCalendar } from './StreakCalendar';
import { StreakFreezeModal } from './StreakFreezeModal';

interface Props {
  variant?: 'full' | 'compact' | 'minimal';
}

export function StreakCounter({ variant = 'full' }: Props) {
  const { data: streakInfo, isLoading } = useStreakInfo();
  const [showFreezeModal, setShowFreezeModal] = useState(false);

  if (isLoading || !streakInfo) {
    return null;
  }

  const { currentStreak, longestStreak, weeklyProgress, freezesRemaining, isFrozenToday } =
    streakInfo;

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 rounded-full">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="font-bold text-orange-600">{currentStreak}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Streak {currentStreak} ngày liên tục!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Streak hiện tại</p>
                <p className="text-2xl font-bold text-orange-600">{currentStreak} ngày</p>
              </div>
            </div>
            <StreakCalendar weeklyProgress={weeklyProgress} />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full variant
  return (
    <>
      <Card>
        <CardContent className="p-6">
          {/* Main Streak Display */}
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              {/* Flame Icon */}
              <div
                className={cn(
                  'w-20 h-20 rounded-full flex items-center justify-center',
                  currentStreak > 0
                    ? 'bg-gradient-to-br from-orange-400 to-red-500'
                    : 'bg-gray-200',
                )}
              >
                <Flame
                  className={cn(
                    'w-10 h-10',
                    currentStreak > 0 ? 'text-white' : 'text-gray-400',
                  )}
                />
              </div>

              {/* Freeze indicator */}
              {isFrozenToday && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-bold text-orange-600">
                  {currentStreak}
                </span>
                <span className="text-lg text-gray-500">ngày streak</span>
              </div>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Trophy className="w-4 h-4 text-yellow-500" />
                Kỷ lục: {longestStreak} ngày
              </p>
            </div>
          </div>

          {/* Weekly Calendar */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Hoạt động tuần này
            </h4>
            <StreakCalendar weeklyProgress={weeklyProgress} size="lg" />
          </div>

          {/* Freeze Section */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium text-blue-700">Streak Freeze</p>
                  <p className="text-sm text-blue-600">
                    Còn {freezesRemaining} lượt/tháng
                  </p>
                </div>
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFreezeModal(true)}
                      disabled={freezesRemaining === 0 || isFrozenToday}
                      className="border-blue-300"
                    >
                      <Shield className="w-4 h-4 mr-1" />
                      {isFrozenToday ? 'Đã dùng' : 'Dùng Freeze'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Bảo vệ streak khi không thể học</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>

      <StreakFreezeModal
        open={showFreezeModal}
        onClose={() => setShowFreezeModal(false)}
        freezesRemaining={freezesRemaining}
      />
    </>
  );
}
```

### 3. components/StreakCalendar.tsx

```tsx
'use client';

import { cn } from '@/lib/utils';
import { Check, X, Flame } from 'lucide-react';

interface Props {
  weeklyProgress: boolean[];
  size?: 'sm' | 'lg';
}

const DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export function StreakCalendar({ weeklyProgress, size = 'sm' }: Props) {
  const today = new Date().getDay();
  // Convert to Monday-based (0 = Monday, 6 = Sunday)
  const todayIndex = today === 0 ? 6 : today - 1;

  return (
    <div className="flex gap-2">
      {weeklyProgress.map((completed, index) => {
        const isToday = index === todayIndex;
        const isPast = index < todayIndex;

        return (
          <div key={index} className="flex flex-col items-center gap-1">
            <span
              className={cn(
                'text-xs',
                isToday ? 'font-bold text-orange-600' : 'text-gray-500',
              )}
            >
              {DAYS[index]}
            </span>
            <div
              className={cn(
                'rounded-full flex items-center justify-center transition-all',
                size === 'sm' ? 'w-8 h-8' : 'w-10 h-10',
                completed
                  ? 'bg-gradient-to-br from-orange-400 to-red-500'
                  : isPast
                    ? 'bg-gray-200'
                    : 'bg-gray-100 border-2 border-dashed border-gray-300',
                isToday && !completed && 'border-orange-400 border-2',
              )}
            >
              {completed ? (
                <Flame
                  className={cn(
                    'text-white',
                    size === 'sm' ? 'w-4 h-4' : 'w-5 h-5',
                  )}
                />
              ) : isPast ? (
                <X
                  className={cn(
                    'text-gray-400',
                    size === 'sm' ? 'w-4 h-4' : 'w-5 h-5',
                  )}
                />
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

### 4. components/StreakMilestoneModal.tsx

```tsx
'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Flame, Star, Gift } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Props {
  milestone: number;
  open: boolean;
  onClose: () => void;
}

const MILESTONE_REWARDS = {
  7: { xp: 100, badge: '🔥 1 tuần streak' },
  14: { xp: 200, badge: '🔥🔥 2 tuần streak' },
  30: { xp: 500, badge: '🌟 1 tháng streak' },
  60: { xp: 1000, badge: '💎 2 tháng streak' },
  100: { xp: 2000, badge: '🏆 100 ngày streak' },
  365: { xp: 10000, badge: '👑 1 năm streak' },
};

export function StreakMilestoneModal({ milestone, open, onClose }: Props) {
  const reward = MILESTONE_REWARDS[milestone as keyof typeof MILESTONE_REWARDS];

  useEffect(() => {
    if (open) {
      // Fire confetti from both sides
      const fire = (particleRatio: number, opts: any) => {
        confetti({
          ...opts,
          particleCount: Math.floor(200 * particleRatio),
          colors: ['#ff6b35', '#f7931a', '#ffd700'],
        });
      };

      fire(0.25, { spread: 26, startVelocity: 55, origin: { x: 0.2, y: 0.5 } });
      fire(0.25, { spread: 26, startVelocity: 55, origin: { x: 0.8, y: 0.5 } });
      fire(0.35, { spread: 60, origin: { x: 0.5, y: 0.5 } });
      fire(0.1, { spread: 120, startVelocity: 45, origin: { x: 0.5, y: 0.5 } });
    }
  }, [open]);

  if (!reward) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md overflow-hidden p-0 bg-gradient-to-b from-orange-50 via-white to-red-50">
        <div className="text-center py-10 px-6">
          {/* Animated fire */}
          <AnimatePresence>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="relative inline-block mb-6"
            >
              {/* Glow */}
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 w-32 h-32 rounded-full bg-orange-400 blur-2xl"
              />

              {/* Fire icon */}
              <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 via-red-500 to-yellow-500 flex items-center justify-center shadow-2xl">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <Flame className="w-16 h-16 text-white" />
                </motion.div>
              </div>

              {/* Milestone number */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full shadow-lg"
              >
                <span className="text-2xl font-bold text-orange-600">
                  {milestone}
                </span>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-sm font-medium text-orange-600 mb-2">
              🎉 CỘT MỐC MỚI!
            </h2>
            <h3 className="text-2xl font-bold mb-2">
              {milestone} ngày Streak!
            </h3>
            <p className="text-4xl mb-4">{reward.badge}</p>
          </motion.div>

          {/* XP Reward */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white font-bold shadow-lg"
          >
            <Star className="w-5 h-5" />
            +{reward.xp} XP
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <Button
              onClick={onClose}
              className="bg-orange-500 hover:bg-orange-600 px-8"
            >
              Tiếp tục chuỗi!
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook to listen for streak milestones
export function useStreakMilestoneListener() {
  const [milestone, setMilestone] = useState<number | null>(null);

  useEffect(() => {
    const handleMilestone = (event: CustomEvent<{ streak: number }>) => {
      const streak = event.detail.streak;
      if (MILESTONE_REWARDS[streak as keyof typeof MILESTONE_REWARDS]) {
        setMilestone(streak);
      }
    };

    window.addEventListener('streak-milestone', handleMilestone as EventListener);

    return () => {
      window.removeEventListener('streak-milestone', handleMilestone as EventListener);
    };
  }, []);

  return {
    milestone,
    clearMilestone: () => setMilestone(null),
  };
}
```

### 5. components/StreakFreezeModal.tsx

```tsx
'use client';

import { Shield, AlertTriangle, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useUseStreakFreeze } from '../hooks/useStreak';

interface Props {
  open: boolean;
  onClose: () => void;
  freezesRemaining: number;
}

export function StreakFreezeModal({ open, onClose, freezesRemaining }: Props) {
  const { mutate: useFreeze, isPending, isSuccess } = useUseStreakFreeze();

  const handleUseFreeze = () => {
    useFreeze(undefined, {
      onSuccess: () => {
        // Keep modal open to show success
        setTimeout(() => {
          onClose();
        }, 2000);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            Sử dụng Streak Freeze
          </DialogTitle>
          <DialogDescription>
            Bảo vệ streak của bạn khi không thể học hôm nay
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Đã kích hoạt Freeze!</h3>
            <p className="text-gray-500">
              Streak của bạn được bảo vệ trong hôm nay
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="font-semibold text-blue-700">Streak Freeze</p>
                  <p className="text-sm text-blue-600">
                    Còn {freezesRemaining} lượt sử dụng tháng này
                  </p>
                </div>
              </div>
              <p className="text-sm text-blue-700">
                Sử dụng Freeze để bảo vệ streak khi bạn không thể học. Streak sẽ
                không bị reset nếu bạn bỏ lỡ 1 ngày.
              </p>
            </div>

            <Alert>
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                Bạn chỉ có thể dùng tối đa <strong>2 Freeze mỗi tháng</strong>.
                Hãy sử dụng cẩn thận!
              </AlertDescription>
            </Alert>

            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Hủy
              </Button>
              <Button
                onClick={handleUseFreeze}
                disabled={isPending || freezesRemaining === 0}
                className="flex-1 bg-blue-500 hover:bg-blue-600"
              >
                <Shield className="w-4 h-4 mr-2" />
                {isPending ? 'Đang xử lý...' : 'Dùng Freeze'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
```

### 6. components/ActivityTimeline.tsx

```tsx
'use client';

import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { BookOpen, FileText, LogIn, PlayCircle, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useActivityHistory, ActivityLog } from '../hooks/useStreak';

const ACTIVITY_ICONS = {
  practice: PlayCircle,
  exam: FileText,
  login: LogIn,
  lesson: BookOpen,
};

const ACTIVITY_COLORS = {
  practice: 'text-blue-500 bg-blue-100',
  exam: 'text-green-500 bg-green-100',
  login: 'text-gray-500 bg-gray-100',
  lesson: 'text-purple-500 bg-purple-100',
};

export function ActivityTimeline() {
  const { data: activities, isLoading } = useActivityHistory({ limit: 20 });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group by date
  const groupedByDate = activities?.reduce(
    (acc, activity) => {
      const date = format(new Date(activity.createdAt), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(activity);
      return acc;
    },
    {} as Record<string, ActivityLog[]>,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hoạt động gần đây</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {Object.entries(groupedByDate || {}).map(([date, logs]) => (
            <div key={date} className="mb-6">
              {/* Date header */}
              <h4 className="text-sm font-medium text-gray-500 mb-3 sticky top-0 bg-white">
                {format(new Date(date), 'EEEE, dd/MM/yyyy', { locale: vi })}
              </h4>

              {/* Activities */}
              <div className="relative pl-6 border-l-2 border-gray-200 space-y-4">
                {logs.map((log) => {
                  const Icon = ACTIVITY_ICONS[log.type] || PlayCircle;
                  const colors = ACTIVITY_COLORS[log.type] || 'text-gray-500 bg-gray-100';

                  return (
                    <div key={log.id} className="relative">
                      {/* Timeline dot */}
                      <div
                        className={`absolute -left-[25px] w-4 h-4 rounded-full border-2 border-white ${colors.split(' ')[1]}`}
                      />

                      {/* Activity card */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${colors}`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{log.title}</p>
                              <p className="text-xs text-gray-500">
                                {format(new Date(log.createdAt), 'HH:mm')}
                                {log.duration && ` • ${log.duration} phút`}
                              </p>
                            </div>
                          </div>

                          {log.xpEarned > 0 && (
                            <div className="flex items-center gap-1 text-yellow-600">
                              <Star className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                +{log.xpEarned}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {(!activities || activities.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              Chưa có hoạt động nào
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
```

### 7. services/streakService.ts

```typescript
import { apiClient } from '@/lib/apiClient';
import { StreakInfo, ActivityLog } from '../features/gamification/hooks/useStreak';

export const streakService = {
  async getInfo(): Promise<StreakInfo> {
    const { data } = await apiClient.get('/streak/info');
    return data;
  },

  async getWeeklyActivity(): Promise<boolean[]> {
    const { data } = await apiClient.get('/streak/weekly');
    return data;
  },

  async useFreeze(): Promise<void> {
    await apiClient.post('/streak/freeze');
  },

  async getHistory(params?: { page?: number; limit?: number }): Promise<ActivityLog[]> {
    const { data } = await apiClient.get('/streak/history', { params });
    return data;
  },
};
```

---

## ✅ Acceptance Criteria

- [ ] Streak counter with fire icon
- [ ] Weekly calendar showing activity
- [ ] Today highlighted in calendar
- [ ] Milestone celebration at 7, 14, 30, 100 days
- [ ] Streak freeze button works
- [ ] Freeze usage indicator
- [ ] Activity timeline grouped by date
- [ ] XP earned per activity shown

---

## 🧪 Test Cases

```typescript
describe('StreakCounter', () => {
  it('shows current streak', async () => {
    // Render with streak=15
    // Verify "15 ngày streak" shown
  });

  it('shows frozen indicator', async () => {
    // Render with isFrozenToday=true
    // Verify shield icon on flame
  });
});

describe('StreakCalendar', () => {
  it('highlights today', async () => {
    // Render on Wednesday
    // Verify T4 is highlighted
  });

  it('shows completed days', async () => {
    // Render with [true, true, false, ...]
    // Verify first 2 have flame, 3rd has X
  });
});

describe('StreakMilestoneModal', () => {
  it('shows correct reward', async () => {
    // Open with milestone=30
    // Verify 500 XP reward shown
  });
});

describe('StreakFreezeModal', () => {
  it('uses freeze successfully', async () => {
    // Click use freeze
    // Verify success state shown
  });
});
```

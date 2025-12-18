# FE-064: XP Progress Widget

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-064 |
| **Phase** | 3 - Enterprise |
| **Sprint** | 17-18 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 5h |
| **Dependencies** | BE-061 |

---

## 🎯 Objective

Implement XP and level display components:
- XP progress bar widget
- Level badge component
- XP gain animation
- Level up celebration
- Daily XP cap indicator
- XP transaction history

---

## 📝 Implementation

### 1. hooks/useXp.ts

```typescript
import { useQuery } from '@tanstack/react-query';
import { xpService } from '@/services/xpService';

export interface XpInfo {
  currentXp: number;
  level: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  dailyXpEarned: number;
  dailyXpCap: number;
  weeklyXp: number;
  monthlyXp: number;
}

export interface XpTransaction {
  id: string;
  amount: number;
  source: 'practice' | 'exam' | 'achievement' | 'goal' | 'streak' | 'bonus';
  description: string;
  multiplier?: number;
  createdAt: Date;
}

export const useXpInfo = () => {
  return useQuery({
    queryKey: ['xp-info'],
    queryFn: () => xpService.getInfo(),
    refetchInterval: 60000, // Refresh every minute
  });
};

export const useXpHistory = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['xp-history', params],
    queryFn: () => xpService.getHistory(params),
  });
};

export const useXpLeaderboard = () => {
  return useQuery({
    queryKey: ['xp-leaderboard'],
    queryFn: () => xpService.getWeeklyLeaderboard(),
  });
};
```

### 2. components/XpProgressWidget.tsx

```tsx
'use client';

import { useState } from 'react';
import { Star, Zap, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useXpInfo } from '../hooks/useXp';
import { LevelBadge } from './LevelBadge';
import { XpHistoryModal } from './XpHistoryModal';

interface Props {
  variant?: 'full' | 'compact' | 'minimal';
}

export function XpProgressWidget({ variant = 'full' }: Props) {
  const { data: xpInfo, isLoading } = useXpInfo();
  const [showHistory, setShowHistory] = useState(false);

  if (isLoading) {
    return <Skeleton className={cn('w-full', variant === 'full' ? 'h-48' : 'h-16')} />;
  }

  if (!xpInfo) return null;

  const progressPercent =
    ((xpInfo.currentXp - xpInfo.xpForCurrentLevel) /
      (xpInfo.xpForNextLevel - xpInfo.xpForCurrentLevel)) *
    100;

  const dailyCapPercent = (xpInfo.dailyXpEarned / xpInfo.dailyXpCap) * 100;
  const xpToNextLevel = xpInfo.xpForNextLevel - xpInfo.currentXp;

  if (variant === 'minimal') {
    return (
      <div className="flex items-center gap-3">
        <LevelBadge level={xpInfo.level} size="sm" />
        <div className="flex-1">
          <Progress value={progressPercent} className="h-2" />
        </div>
        <span className="text-sm font-medium text-gray-600">
          {xpInfo.currentXp.toLocaleString()} XP
        </span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <LevelBadge level={xpInfo.level} size="md" />
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Level {xpInfo.level}</span>
                <span className="text-gray-500">
                  {xpInfo.currentXp.toLocaleString()} / {xpInfo.xpForNextLevel.toLocaleString()} XP
                </span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Điểm kinh nghiệm
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Level & Progress */}
          <div className="flex items-center gap-4">
            <LevelBadge level={xpInfo.level} size="lg" showLabel />
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-lg">
                  {xpInfo.currentXp.toLocaleString()} XP
                </span>
                <span className="text-gray-500">
                  Còn {xpToNextLevel.toLocaleString()} XP để lên level
                </span>
              </div>
              <Progress value={progressPercent} className="h-3" />
              <p className="text-xs text-gray-500 mt-1">
                {xpInfo.xpForCurrentLevel.toLocaleString()} → {xpInfo.xpForNextLevel.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Daily Cap */}
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <Clock className="w-4 h-4" />
                <span>XP hôm nay</span>
              </div>
              <span className="text-sm font-medium text-blue-700">
                {xpInfo.dailyXpEarned} / {xpInfo.dailyXpCap}
              </span>
            </div>
            <Progress
              value={dailyCapPercent}
              className="h-2 [&>div]:bg-blue-500"
            />
            {dailyCapPercent >= 100 && (
              <p className="text-xs text-blue-600 mt-1">
                ✓ Đã đạt giới hạn XP hàng ngày
              </p>
            )}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Zap className="w-5 h-5 mx-auto text-yellow-500 mb-1" />
              <p className="text-lg font-bold">{xpInfo.weeklyXp.toLocaleString()}</p>
              <p className="text-xs text-gray-500">XP tuần này</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <TrendingUp className="w-5 h-5 mx-auto text-green-500 mb-1" />
              <p className="text-lg font-bold">{xpInfo.monthlyXp.toLocaleString()}</p>
              <p className="text-xs text-gray-500">XP tháng này</p>
            </div>
          </div>

          {/* History Button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowHistory(true)}
          >
            Xem lịch sử XP
          </Button>
        </CardContent>
      </Card>

      <XpHistoryModal open={showHistory} onClose={() => setShowHistory(false)} />
    </>
  );
}
```

### 3. components/LevelBadge.tsx

```tsx
'use client';

import { cn } from '@/lib/utils';

interface Props {
  level: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
}

const LEVEL_TIERS = [
  { min: 1, max: 5, name: 'Bronze', color: 'from-amber-600 to-amber-700', textColor: 'text-amber-100' },
  { min: 6, max: 10, name: 'Silver', color: 'from-gray-400 to-gray-500', textColor: 'text-gray-100' },
  { min: 11, max: 15, name: 'Gold', color: 'from-yellow-400 to-yellow-500', textColor: 'text-yellow-900' },
  { min: 16, max: 20, name: 'Platinum', color: 'from-cyan-400 to-cyan-500', textColor: 'text-cyan-900' },
  { min: 21, max: Infinity, name: 'Diamond', color: 'from-purple-400 to-pink-400', textColor: 'text-white' },
];

const SIZE_CLASSES = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl',
};

export function LevelBadge({ level, size = 'md', showLabel }: Props) {
  const tier = LEVEL_TIERS.find((t) => level >= t.min && level <= t.max) || LEVEL_TIERS[0];

  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          'rounded-full flex items-center justify-center font-bold shadow-lg bg-gradient-to-br',
          tier.color,
          tier.textColor,
          SIZE_CLASSES[size],
        )}
      >
        {level}
      </div>
      {showLabel && (
        <span className="text-xs text-gray-500 mt-1">{tier.name}</span>
      )}
    </div>
  );
}
```

### 4. components/XpGainAnimation.tsx

```tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

interface XpGain {
  id: string;
  amount: number;
  source: string;
  multiplier?: number;
}

// Global event for XP gains
export const xpGainEvent = new EventTarget();

export function XpGainAnimation() {
  const [gains, setGains] = useState<XpGain[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleXpGain = (event: CustomEvent<XpGain>) => {
      const gain = event.detail;
      setGains((prev) => [...prev, gain]);

      // Refresh XP data
      queryClient.invalidateQueries({ queryKey: ['xp-info'] });

      // Remove after animation
      setTimeout(() => {
        setGains((prev) => prev.filter((g) => g.id !== gain.id));
      }, 2000);
    };

    xpGainEvent.addEventListener('xp-gain', handleXpGain as EventListener);

    return () => {
      xpGainEvent.removeEventListener('xp-gain', handleXpGain as EventListener);
    };
  }, [queryClient]);

  return (
    <div className="fixed top-20 right-4 z-50 pointer-events-none">
      <AnimatePresence>
        {gains.map((gain, index) => (
          <motion.div
            key={gain.id}
            initial={{ opacity: 0, y: 50, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="mb-2"
            style={{ marginTop: index * 8 }}
          >
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 font-bold">
              <Star className="w-5 h-5" />
              <span>+{gain.amount} XP</span>
              {gain.multiplier && gain.multiplier > 1 && (
                <span className="text-xs bg-yellow-900 text-yellow-100 px-1.5 py-0.5 rounded">
                  x{gain.multiplier}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Helper function to trigger XP gain animation
export function showXpGain(amount: number, source: string, multiplier?: number) {
  const event = new CustomEvent('xp-gain', {
    detail: {
      id: `${Date.now()}-${Math.random()}`,
      amount,
      source,
      multiplier,
    },
  });
  xpGainEvent.dispatchEvent(event);
}
```

### 5. components/LevelUpModal.tsx

```tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Gift, ChevronUp } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LevelBadge } from './LevelBadge';

interface Props {
  newLevel: number;
  open: boolean;
  onClose: () => void;
}

const LEVEL_REWARDS = {
  5: { name: 'Bronze Pack', description: '3 practice tests miễn phí' },
  10: { name: 'Silver Pack', description: '1 tuần Premium miễn phí' },
  15: { name: 'Gold Pack', description: '1 tháng Premium giảm 50%' },
  20: { name: 'Platinum Pack', description: 'Badge đặc biệt + Avatar frame' },
};

export function LevelUpModal({ newLevel, open, onClose }: Props) {
  const reward = LEVEL_REWARDS[newLevel as keyof typeof LEVEL_REWARDS];

  useEffect(() => {
    if (open) {
      // Gold confetti burst
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#fbbf24', '#f59e0b', '#d97706', '#fef3c7'],
      });
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md overflow-hidden p-0 bg-gradient-to-b from-yellow-50 via-white to-orange-50">
        <div className="text-center py-10 px-6">
          {/* Animation */}
          <AnimatePresence>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="relative inline-block mb-6"
            >
              {/* Rays */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-24 bg-gradient-to-t from-yellow-400 to-transparent opacity-40"
                    style={{ transform: `rotate(${i * 45}deg) translateY(-50%)` }}
                  />
                ))}
              </motion.div>

              {/* Badge */}
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <LevelBadge level={newLevel} size="xl" />
              </motion.div>

              {/* Sparkles */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles className="w-8 h-8 text-yellow-400" />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-sm font-medium text-yellow-600 mb-2 flex items-center justify-center gap-1">
              <ChevronUp className="w-4 h-4" />
              LEVEL UP!
            </h2>
            <h3 className="text-3xl font-bold mb-2">Level {newLevel}</h3>
            <p className="text-gray-600">Chúc mừng! Bạn đã lên level mới!</p>
          </motion.div>

          {/* Reward */}
          {reward && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow">
                  <Gift className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-yellow-800">{reward.name}</p>
                  <p className="text-sm text-yellow-700">{reward.description}</p>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8"
          >
            <Button
              onClick={onClose}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 px-8"
            >
              Tuyệt vời!
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook to listen for level ups
export function useLevelUpListener() {
  const [levelUp, setLevelUp] = useState<number | null>(null);

  useEffect(() => {
    const handleLevelUp = (event: CustomEvent<{ level: number }>) => {
      setLevelUp(event.detail.level);
    };

    window.addEventListener('level-up', handleLevelUp as EventListener);

    return () => {
      window.removeEventListener('level-up', handleLevelUp as EventListener);
    };
  }, []);

  return {
    levelUp,
    clearLevelUp: () => setLevelUp(null),
  };
}
```

### 6. components/XpHistoryModal.tsx

```tsx
'use client';

import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Star, Trophy, Target, Flame, Gift, Zap } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useXpHistory, XpTransaction } from '../hooks/useXp';

interface Props {
  open: boolean;
  onClose: () => void;
}

const SOURCE_ICONS = {
  practice: Zap,
  exam: Target,
  achievement: Trophy,
  goal: Target,
  streak: Flame,
  bonus: Gift,
};

const SOURCE_COLORS = {
  practice: 'text-blue-500 bg-blue-100',
  exam: 'text-green-500 bg-green-100',
  achievement: 'text-yellow-500 bg-yellow-100',
  goal: 'text-purple-500 bg-purple-100',
  streak: 'text-orange-500 bg-orange-100',
  bonus: 'text-pink-500 bg-pink-100',
};

export function XpHistoryModal({ open, onClose }: Props) {
  const { data: transactions, isLoading } = useXpHistory({ limit: 50 });

  // Group by date
  const groupedByDate = transactions?.reduce(
    (acc, tx) => {
      const date = format(new Date(tx.createdAt), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = { transactions: [], total: 0 };
      }
      acc[date].transactions.push(tx);
      acc[date].total += tx.amount;
      return acc;
    },
    {} as Record<string, { transactions: XpTransaction[]; total: number }>,
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Lịch sử XP
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedByDate || {}).map(([date, { transactions, total }]) => (
                <div key={date}>
                  {/* Date header */}
                  <div className="flex items-center justify-between mb-3 sticky top-0 bg-white py-1">
                    <span className="text-sm font-medium text-gray-500">
                      {format(new Date(date), 'EEEE, dd/MM', { locale: vi })}
                    </span>
                    <span className="text-sm font-bold text-yellow-600">
                      +{total} XP
                    </span>
                  </div>

                  {/* Transactions */}
                  <div className="space-y-2">
                    {transactions.map((tx) => {
                      const Icon = SOURCE_ICONS[tx.source] || Star;
                      const colors = SOURCE_COLORS[tx.source] || 'text-gray-500 bg-gray-100';

                      return (
                        <div
                          key={tx.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${colors}`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">
                                {tx.description}
                              </p>
                              <p className="text-xs text-gray-500">
                                {format(new Date(tx.createdAt), 'HH:mm')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-yellow-600">
                              +{tx.amount}
                            </span>
                            {tx.multiplier && tx.multiplier > 1 && (
                              <p className="text-xs text-orange-500">
                                x{tx.multiplier} bonus
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {(!transactions || transactions.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  Chưa có lịch sử XP
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
```

### 7. services/xpService.ts

```typescript
import { apiClient } from '@/lib/apiClient';
import { XpInfo, XpTransaction } from '../features/gamification/hooks/useXp';

export const xpService = {
  async getInfo(): Promise<XpInfo> {
    const { data } = await apiClient.get('/xp/info');
    return data;
  },

  async getHistory(params?: { page?: number; limit?: number }): Promise<XpTransaction[]> {
    const { data } = await apiClient.get('/xp/history', { params });
    return data;
  },

  async getWeeklyLeaderboard(): Promise<
    Array<{ userId: string; name: string; xp: number; rank: number }>
  > {
    const { data } = await apiClient.get('/xp/leaderboard/weekly');
    return data;
  },
};
```

---

## ✅ Acceptance Criteria

- [ ] XP progress bar shows level progress
- [ ] Level badge with tier colors
- [ ] Daily XP cap indicator
- [ ] XP gain animation floats in
- [ ] Level up celebration modal
- [ ] XP history grouped by date
- [ ] Multiplier indicators visible
- [ ] Different variants (full/compact/minimal)

---

## 🧪 Test Cases

```typescript
describe('XpProgressWidget', () => {
  it('shows correct progress', async () => {
    // Render with 500/1000 XP
    // Verify progress bar at 50%
  });

  it('shows daily cap', async () => {
    // Render with 800/1000 daily XP
    // Verify cap indicator
  });
});

describe('LevelBadge', () => {
  it('shows correct tier color', async () => {
    // Render level 12 (Gold)
    // Verify gold gradient
  });
});

describe('XpGainAnimation', () => {
  it('shows animation on event', async () => {
    // Trigger showXpGain(100, 'practice')
    // Verify animation appears
    // Verify disappears after 2s
  });
});

describe('LevelUpModal', () => {
  it('shows level reward if applicable', async () => {
    // Open modal with level 10
    // Verify Silver Pack reward shown
  });
});
```

# FE-065: Leaderboard Page

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-065 |
| **Phase** | 3 - Enterprise |
| **Sprint** | 17-18 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 5h |
| **Dependencies** | BE-062 |

---

## 🎯 Objective

Implement leaderboard display:
- Leaderboard table with rankings
- Period filters (daily/weekly/monthly/all-time)
- Level filters (A2/B1/B2/C1/all)
- Top 3 podium display
- Current user highlight
- Pagination

---

## 📝 Implementation

### 1. hooks/useLeaderboard.ts

```typescript
import { useQuery } from '@tanstack/react-query';
import { leaderboardService } from '@/services/leaderboardService';

export type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly' | 'all_time';
export type VstepLevel = 'A2' | 'B1' | 'B2' | 'C1' | 'all';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  level: number;
  xp: number;
  vstepLevel: string;
  badgesCount: number;
  streak: number;
  isCurrentUser?: boolean;
}

export interface LeaderboardData {
  entries: LeaderboardEntry[];
  total: number;
  currentUserRank?: {
    rank: number;
    xp: number;
    percentile: number;
  };
}

export const useLeaderboard = (params: {
  period: LeaderboardPeriod;
  level?: VstepLevel;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['leaderboard', params],
    queryFn: () => leaderboardService.getLeaderboard(params),
    staleTime: 60000, // 1 minute
  });
};

export const useMyRank = (period: LeaderboardPeriod) => {
  return useQuery({
    queryKey: ['my-rank', period],
    queryFn: () => leaderboardService.getMyRank(period),
  });
};
```

### 2. pages/LeaderboardPage.tsx

```tsx
'use client';

import { useState } from 'react';
import { Trophy, Medal, Crown, Users, Flame, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useLeaderboard,
  LeaderboardPeriod,
  VstepLevel,
} from '../hooks/useLeaderboard';
import { TopThreePodium } from '../components/TopThreePodium';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { CurrentUserRankCard } from '../components/CurrentUserRankCard';

const PERIODS = [
  { value: 'daily', label: 'Hôm nay' },
  { value: 'weekly', label: 'Tuần này' },
  { value: 'monthly', label: 'Tháng này' },
  { value: 'all_time', label: 'Toàn thời gian' },
];

const LEVELS = [
  { value: 'all', label: 'Tất cả level' },
  { value: 'A2', label: 'A2' },
  { value: 'B1', label: 'B1' },
  { value: 'B2', label: 'B2' },
  { value: 'C1', label: 'C1' },
];

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<LeaderboardPeriod>('weekly');
  const [level, setLevel] = useState<VstepLevel>('all');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useLeaderboard({
    period,
    level: level === 'all' ? undefined : level,
    page,
    limit: 20,
  });

  const topThree = data?.entries.slice(0, 3) || [];
  const restEntries = data?.entries.slice(3) || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-7 h-7 text-yellow-500" />
            Bảng xếp hạng
          </h1>
          <p className="text-gray-500">
            Thi đua cùng các học viên khác
          </p>
        </div>

        {/* Level Filter */}
        <Select
          value={level}
          onValueChange={(v) => {
            setLevel(v as VstepLevel);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LEVELS.map((l) => (
              <SelectItem key={l.value} value={l.value}>
                {l.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Period Tabs */}
      <Tabs
        value={period}
        onValueChange={(v) => {
          setPeriod(v as LeaderboardPeriod);
          setPage(1);
        }}
      >
        <TabsList className="grid grid-cols-4 w-full max-w-lg">
          {PERIODS.map((p) => (
            <TabsTrigger key={p.value} value={p.value}>
              {p.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Current User Rank */}
      {data?.currentUserRank && (
        <CurrentUserRankCard
          rank={data.currentUserRank.rank}
          xp={data.currentUserRank.xp}
          percentile={data.currentUserRank.percentile}
          period={period}
        />
      )}

      {isLoading ? (
        <div className="space-y-4">
          <div className="flex justify-center gap-4">
            <Skeleton className="w-32 h-40" />
            <Skeleton className="w-40 h-48" />
            <Skeleton className="w-32 h-40" />
          </div>
          <Skeleton className="h-64" />
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {page === 1 && topThree.length > 0 && (
            <TopThreePodium entries={topThree} />
          )}

          {/* Leaderboard Table */}
          <LeaderboardTable
            entries={page === 1 ? restEntries : data?.entries || []}
            startRank={page === 1 ? 4 : (page - 1) * 20 + 1}
          />

          {/* Pagination */}
          {data && data.total > 20 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Trước
              </button>
              <span className="px-4 py-2">
                Trang {page} / {Math.ceil(data.total / 20)}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil(data.total / 20)}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
```

### 3. components/TopThreePodium.tsx

```tsx
'use client';

import { motion } from 'framer-motion';
import { Crown, Medal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LeaderboardEntry } from '../hooks/useLeaderboard';
import { LevelBadge } from './LevelBadge';

interface Props {
  entries: LeaderboardEntry[];
}

const PODIUM_CONFIG = [
  {
    rank: 2,
    height: 'h-28',
    delay: 0.2,
    medal: '🥈',
    bgColor: 'from-gray-200 to-gray-300',
    borderColor: 'border-gray-400',
  },
  {
    rank: 1,
    height: 'h-36',
    delay: 0,
    medal: '🥇',
    bgColor: 'from-yellow-300 to-yellow-400',
    borderColor: 'border-yellow-500',
    crown: true,
  },
  {
    rank: 3,
    height: 'h-24',
    delay: 0.4,
    medal: '🥉',
    bgColor: 'from-orange-200 to-orange-300',
    borderColor: 'border-orange-400',
  },
];

export function TopThreePodium({ entries }: Props) {
  // Reorder: 2nd, 1st, 3rd for display
  const orderedEntries = [entries[1], entries[0], entries[2]].filter(Boolean);

  return (
    <div className="flex justify-center items-end gap-4 py-8">
      {PODIUM_CONFIG.map((config, index) => {
        const entry = orderedEntries[index];
        if (!entry) return null;

        return (
          <motion.div
            key={entry.userId}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: config.delay, duration: 0.5 }}
            className="flex flex-col items-center"
          >
            {/* User Info */}
            <div className="relative mb-4">
              {/* Crown for #1 */}
              {config.crown && (
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-6 left-1/2 -translate-x-1/2"
                >
                  <Crown className="w-8 h-8 text-yellow-500" />
                </motion.div>
              )}

              {/* Avatar */}
              <div
                className={cn(
                  'relative w-20 h-20 rounded-full overflow-hidden border-4',
                  config.borderColor,
                )}
              >
                {entry.avatar ? (
                  <img
                    src={entry.avatar}
                    alt={entry.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                    {entry.name.charAt(0)}
                  </div>
                )}

                {/* Medal */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-2xl">
                  {config.medal}
                </div>
              </div>
            </div>

            {/* Name */}
            <p
              className={cn(
                'font-semibold text-center mb-1',
                entry.isCurrentUser && 'text-blue-600',
              )}
            >
              {entry.name}
              {entry.isCurrentUser && ' (Bạn)'}
            </p>

            {/* XP */}
            <p className="text-sm text-gray-600 mb-3">
              {entry.xp.toLocaleString()} XP
            </p>

            {/* Podium */}
            <div
              className={cn(
                'w-28 rounded-t-lg flex flex-col items-center justify-start pt-4 bg-gradient-to-b',
                config.height,
                config.bgColor,
              )}
            >
              <span className="text-3xl font-bold text-gray-800">
                #{config.rank}
              </span>
              <LevelBadge level={entry.level} size="sm" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
```

### 4. components/LeaderboardTable.tsx

```tsx
'use client';

import { Flame, Award, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LeaderboardEntry } from '../hooks/useLeaderboard';
import { LevelBadge } from './LevelBadge';

interface Props {
  entries: LeaderboardEntry[];
  startRank?: number;
}

export function LeaderboardTable({ entries, startRank = 4 }: Props) {
  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-gray-500">
          Không có dữ liệu xếp hạng
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 w-16">
                Hạng
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                Học viên
              </th>
              <th className="py-3 px-4 text-center text-sm font-medium text-gray-500 w-20">
                Level
              </th>
              <th className="py-3 px-4 text-center text-sm font-medium text-gray-500 w-20">
                Streak
              </th>
              <th className="py-3 px-4 text-center text-sm font-medium text-gray-500 w-24">
                Huy hiệu
              </th>
              <th className="py-3 px-4 text-right text-sm font-medium text-gray-500 w-28">
                XP
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => {
              const rank = startRank + index;

              return (
                <tr
                  key={entry.userId}
                  className={cn(
                    'border-b hover:bg-gray-50 transition-colors',
                    entry.isCurrentUser && 'bg-blue-50 hover:bg-blue-100',
                  )}
                >
                  {/* Rank */}
                  <td className="py-4 px-4">
                    <span
                      className={cn(
                        'font-bold text-lg',
                        rank <= 10 && 'text-yellow-600',
                        rank > 10 && rank <= 50 && 'text-gray-600',
                        rank > 50 && 'text-gray-400',
                      )}
                    >
                      #{rank}
                    </span>
                  </td>

                  {/* User */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={entry.avatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {entry.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p
                          className={cn(
                            'font-medium',
                            entry.isCurrentUser && 'text-blue-600',
                          )}
                        >
                          {entry.name}
                          {entry.isCurrentUser && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              Bạn
                            </Badge>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          {entry.vstepLevel}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Level */}
                  <td className="py-4 px-4 text-center">
                    <LevelBadge level={entry.level} size="sm" />
                  </td>

                  {/* Streak */}
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-1 text-orange-500">
                      <Flame className="w-4 h-4" />
                      <span className="font-medium">{entry.streak}</span>
                    </div>
                  </td>

                  {/* Badges */}
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-1 text-yellow-500">
                      <Award className="w-4 h-4" />
                      <span className="font-medium">{entry.badgesCount}</span>
                    </div>
                  </td>

                  {/* XP */}
                  <td className="py-4 px-4 text-right">
                    <span className="font-bold text-lg">
                      {entry.xp.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">XP</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
```

### 5. components/CurrentUserRankCard.tsx

```tsx
'use client';

import { Trophy, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { LeaderboardPeriod } from '../hooks/useLeaderboard';

interface Props {
  rank: number;
  xp: number;
  percentile: number;
  period: LeaderboardPeriod;
}

const PERIOD_LABELS = {
  daily: 'hôm nay',
  weekly: 'tuần này',
  monthly: 'tháng này',
  all_time: 'toàn thời gian',
};

export function CurrentUserRankCard({ rank, xp, percentile, period }: Props) {
  return (
    <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <p className="text-blue-100 text-sm">
                Xếp hạng của bạn {PERIOD_LABELS[period]}
              </p>
              <p className="text-3xl font-bold">#{rank}</p>
            </div>
          </div>

          <div className="flex gap-8">
            <div className="text-center">
              <div className="flex items-center gap-1 text-blue-100 text-sm mb-1">
                <TrendingUp className="w-4 h-4" />
                XP
              </div>
              <p className="text-xl font-bold">{xp.toLocaleString()}</p>
            </div>

            <div className="text-center">
              <div className="flex items-center gap-1 text-blue-100 text-sm mb-1">
                <Users className="w-4 h-4" />
                Top
              </div>
              <p className="text-xl font-bold">{percentile}%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 6. services/leaderboardService.ts

```typescript
import { apiClient } from '@/lib/apiClient';
import {
  LeaderboardData,
  LeaderboardPeriod,
  VstepLevel,
} from '../features/gamification/hooks/useLeaderboard';

export const leaderboardService = {
  async getLeaderboard(params: {
    period: LeaderboardPeriod;
    level?: VstepLevel;
    page?: number;
    limit?: number;
  }): Promise<LeaderboardData> {
    const { data } = await apiClient.get('/leaderboard', { params });
    return data;
  },

  async getMyRank(period: LeaderboardPeriod): Promise<{
    rank: number;
    xp: number;
    percentile: number;
  }> {
    const { data } = await apiClient.get(`/leaderboard/my-rank`, {
      params: { period },
    });
    return data;
  },
};
```

---

## ✅ Acceptance Criteria

- [ ] Period tabs (daily/weekly/monthly/all-time)
- [ ] Level filter dropdown
- [ ] Top 3 podium with medals
- [ ] Leaderboard table with rankings
- [ ] Current user highlighted
- [ ] User stats (streak, badges, level)
- [ ] Pagination for large lists
- [ ] Current user rank card

---

## 🧪 Test Cases

```typescript
describe('LeaderboardPage', () => {
  it('filters by period', async () => {
    // Click weekly tab
    // Verify API called with period=weekly
  });

  it('filters by level', async () => {
    // Select B1 from dropdown
    // Verify API called with level=B1
  });
});

describe('TopThreePodium', () => {
  it('displays in correct order', async () => {
    // Render with 3 entries
    // Verify 2nd, 1st, 3rd order
    // Verify crown on 1st place
  });
});

describe('LeaderboardTable', () => {
  it('highlights current user', async () => {
    // Render with isCurrentUser=true entry
    // Verify blue background
    // Verify "Bạn" badge
  });
});
```

# FE-062: Achievement Display Components

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-062 |
| **Phase** | 3 - Enterprise |
| **Sprint** | 17-18 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 5h |
| **Dependencies** | BE-059 |

---

## 🎯 Objective

Implement achievement/badge display UI:
- Achievement grid by category
- Achievement card with progress
- Unlocked animation modal
- Rarity indicators
- Achievement detail view

---

## ⚠️ QUAN TRỌNG: Existing Files Warning

### Các file UI Template đã tồn tại (CHỈ THAM KHẢO):
```
UI-Template/
├── components/
│   ├── BadgeCard.tsx              # Badge card component
│   └── BadgeUnlockedModal.tsx     # Unlock celebration
├── data/
│   └── badges.ts                  # Sample badge data
├── BADGE_SYSTEM_README.md         # Badge system docs
```

### Hướng dẫn:
- **THAM KHẢO** UI-Template để lấy ý tưởng thiết kế
- **TẠO MỚI** trong `FE/src/features/gamification/achievements/`

---

## 📝 Implementation

### 1. hooks/useAchievements.ts

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { achievementService } from '@/services/achievementService';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  badgeImage: string;
  xpReward: number;
  category: 'learning' | 'streak' | 'skill' | 'social' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  progressMax: number;
}

export const useMyAchievements = () => {
  return useQuery({
    queryKey: ['my-achievements'],
    queryFn: () => achievementService.getMyAchievements(),
  });
};

export const useAchievementsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['achievements', category],
    queryFn: () => achievementService.getByCategory(category),
    enabled: !!category,
  });
};

export const useAchievementStats = () => {
  return useQuery({
    queryKey: ['achievement-stats'],
    queryFn: () => achievementService.getStats(),
  });
};

// Hook to listen for new unlocks via WebSocket/SSE
export const useAchievementNotifications = (
  onUnlock: (achievement: Achievement) => void,
) => {
  // Implementation would connect to real-time notifications
  // For now, this is a placeholder
};
```

### 2. components/AchievementGrid.tsx

```tsx
'use client';

import { useState } from 'react';
import { Award, Trophy, Flame, Star, Users, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useMyAchievements, Achievement } from '../hooks/useAchievements';
import { AchievementCard } from './AchievementCard';
import { AchievementDetailModal } from './AchievementDetailModal';

const CATEGORIES = [
  { value: 'all', label: 'Tất cả', icon: Trophy },
  { value: 'learning', label: 'Học tập', icon: Award },
  { value: 'streak', label: 'Streak', icon: Flame },
  { value: 'skill', label: 'Kỹ năng', icon: Star },
  { value: 'milestone', label: 'Cột mốc', icon: Target },
];

export function AchievementGrid() {
  const { data: achievements, isLoading } = useMyAchievements();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const filteredAchievements =
    selectedCategory === 'all'
      ? achievements
      : achievements?.filter((a) => a.category === selectedCategory);

  const unlockedCount = achievements?.filter((a) => a.isUnlocked).length || 0;
  const totalCount = achievements?.length || 0;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Thành tựu</h2>
          <p className="text-gray-500">
            Đã mở khóa {unlockedCount}/{totalCount} thành tựu
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-48 h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
              style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium">
            {Math.round((unlockedCount / totalCount) * 100)}%
          </span>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="flex-wrap">
          {CATEGORIES.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value} className="gap-2">
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredAchievements?.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  onClick={() => setSelectedAchievement(achievement)}
                />
              ))}
            </div>
          )}

          {!isLoading && filteredAchievements?.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              Không có thành tựu trong danh mục này
            </p>
          )}
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <AchievementDetailModal
        achievement={selectedAchievement}
        open={!!selectedAchievement}
        onClose={() => setSelectedAchievement(null)}
      />
    </div>
  );
}
```

### 3. components/AchievementCard.tsx

```tsx
'use client';

import { Lock, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Achievement } from '../hooks/useAchievements';

interface Props {
  achievement: Achievement;
  onClick?: () => void;
}

const RARITY_STYLES = {
  common: {
    border: 'border-gray-300',
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    glow: '',
  },
  rare: {
    border: 'border-blue-400',
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    glow: 'shadow-blue-200',
  },
  epic: {
    border: 'border-purple-400',
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    glow: 'shadow-purple-200',
  },
  legendary: {
    border: 'border-yellow-400',
    bg: 'bg-gradient-to-br from-yellow-100 to-orange-100',
    text: 'text-yellow-600',
    glow: 'shadow-yellow-200 shadow-lg',
  },
};

const RARITY_LABELS = {
  common: 'Phổ biến',
  rare: 'Hiếm',
  epic: 'Sử thi',
  legendary: 'Huyền thoại',
};

export function AchievementCard({ achievement, onClick }: Props) {
  const styles = RARITY_STYLES[achievement.rarity];
  const progress = Math.round((achievement.progress / achievement.progressMax) * 100);

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:scale-105',
        styles.border,
        styles.glow,
        !achievement.isUnlocked && 'opacity-60 grayscale',
      )}
      onClick={onClick}
    >
      <CardContent className="p-4 text-center">
        {/* Badge Image */}
        <div className="relative inline-block mb-3">
          <div
            className={cn(
              'w-16 h-16 mx-auto rounded-full flex items-center justify-center',
              styles.bg,
            )}
          >
            {achievement.badgeImage ? (
              <img
                src={achievement.badgeImage}
                alt={achievement.name}
                className="w-12 h-12 object-contain"
              />
            ) : (
              <span className="text-3xl">{achievement.icon || '🏆'}</span>
            )}
          </div>

          {/* Status indicator */}
          {achievement.isUnlocked ? (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          ) : (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
              <Lock className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className="font-semibold text-sm mb-1 line-clamp-1">
          {achievement.name}
        </h3>

        {/* Rarity */}
        <span className={cn('text-xs font-medium', styles.text)}>
          {RARITY_LABELS[achievement.rarity]}
        </span>

        {/* Progress or XP */}
        {achievement.isUnlocked ? (
          <div className="mt-2 text-xs text-green-600 font-medium">
            +{achievement.xpReward} XP
          </div>
        ) : (
          <div className="mt-2">
            <Progress value={progress} className="h-1.5" />
            <p className="text-xs text-gray-500 mt-1">
              {achievement.progress}/{achievement.progressMax}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

### 4. components/AchievementDetailModal.tsx

```tsx
'use client';

import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Lock, Check, Gift } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Achievement } from '../hooks/useAchievements';

interface Props {
  achievement: Achievement | null;
  open: boolean;
  onClose: () => void;
}

const RARITY_COLORS = {
  common: 'bg-gray-100 text-gray-700',
  rare: 'bg-blue-100 text-blue-700',
  epic: 'bg-purple-100 text-purple-700',
  legendary: 'bg-gradient-to-r from-yellow-200 to-orange-200 text-yellow-800',
};

export function AchievementDetailModal({ achievement, open, onClose }: Props) {
  if (!achievement) return null;

  const progress = Math.round(
    (achievement.progress / achievement.progressMax) * 100,
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chi tiết thành tựu</DialogTitle>
        </DialogHeader>

        <div className="text-center py-4">
          {/* Large Badge */}
          <div
            className={cn(
              'w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4',
              achievement.isUnlocked
                ? 'bg-gradient-to-br from-yellow-100 to-orange-100'
                : 'bg-gray-100',
            )}
          >
            {achievement.badgeImage ? (
              <img
                src={achievement.badgeImage}
                alt={achievement.name}
                className={cn(
                  'w-16 h-16 object-contain',
                  !achievement.isUnlocked && 'grayscale opacity-50',
                )}
              />
            ) : (
              <span className="text-5xl">
                {achievement.isUnlocked ? achievement.icon || '🏆' : '🔒'}
              </span>
            )}
          </div>

          {/* Name & Rarity */}
          <h3 className="text-xl font-bold mb-2">{achievement.name}</h3>
          <Badge className={RARITY_COLORS[achievement.rarity]}>
            {achievement.rarity.toUpperCase()}
          </Badge>

          {/* Description */}
          <p className="text-gray-600 mt-4">{achievement.description}</p>

          {/* Status */}
          {achievement.isUnlocked ? (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                <Check className="w-5 h-5" />
                <span className="font-semibold">Đã mở khóa!</span>
              </div>
              <p className="text-sm text-gray-500">
                {format(new Date(achievement.unlockedAt!), 'dd/MM/yyyy HH:mm', {
                  locale: vi,
                })}
              </p>
              <div className="flex items-center justify-center gap-2 mt-3 text-yellow-600">
                <Gift className="w-4 h-4" />
                <span className="font-medium">+{achievement.xpReward} XP</span>
              </div>
            </div>
          ) : (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-gray-500 mb-3">
                <Lock className="w-5 h-5" />
                <span className="font-semibold">Chưa mở khóa</span>
              </div>
              <Progress value={progress} className="h-2 mb-2" />
              <p className="text-sm text-gray-500">
                Tiến độ: {achievement.progress}/{achievement.progressMax}
              </p>
              <p className="text-sm text-yellow-600 mt-2">
                Phần thưởng: +{achievement.xpReward} XP
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### 5. components/AchievementUnlockedModal.tsx

```tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Gift, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Achievement } from '../hooks/useAchievements';

interface Props {
  achievement: Achievement | null;
  open: boolean;
  onClose: () => void;
}

export function AchievementUnlockedModal({ achievement, open, onClose }: Props) {
  useEffect(() => {
    if (open && achievement) {
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: getRarityColors(achievement.rarity),
      });
    }
  }, [open, achievement]);

  if (!achievement) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md overflow-hidden p-0 bg-gradient-to-b from-yellow-50 to-orange-50">
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="text-center py-8 px-6">
          {/* Animated badge */}
          <AnimatePresence>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
              }}
              className="relative inline-block mb-6"
            >
              {/* Glow effect */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="absolute inset-0 w-32 h-32 rounded-full bg-yellow-400 blur-xl"
              />

              {/* Badge */}
              <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-yellow-200 to-orange-300 flex items-center justify-center shadow-lg">
                {achievement.badgeImage ? (
                  <img
                    src={achievement.badgeImage}
                    alt={achievement.name}
                    className="w-20 h-20 object-contain"
                  />
                ) : (
                  <span className="text-6xl">{achievement.icon || '🏆'}</span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-sm font-medium text-orange-600 mb-2">
              🎉 THÀNH TỰU MỚI!
            </h2>
            <h3 className="text-2xl font-bold mb-2">{achievement.name}</h3>
            <p className="text-gray-600 mb-4">{achievement.description}</p>

            {/* XP Reward */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 rounded-full text-yellow-900 font-bold"
            >
              <Gift className="w-5 h-5" />
              +{achievement.xpReward} XP
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6"
          >
            <Button onClick={onClose} className="bg-orange-500 hover:bg-orange-600">
              Tuyệt vời!
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getRarityColors(rarity: string): string[] {
  switch (rarity) {
    case 'legendary':
      return ['#fbbf24', '#f97316', '#facc15'];
    case 'epic':
      return ['#a855f7', '#8b5cf6', '#c084fc'];
    case 'rare':
      return ['#3b82f6', '#60a5fa', '#2563eb'];
    default:
      return ['#9ca3af', '#6b7280', '#d1d5db'];
  }
}
```

### 6. services/achievementService.ts

```typescript
import { apiClient } from '@/lib/apiClient';
import { Achievement } from '../features/gamification/hooks/useAchievements';

export const achievementService = {
  async getMyAchievements(): Promise<Achievement[]> {
    const { data } = await apiClient.get('/achievements');
    return data;
  },

  async getByCategory(category: string): Promise<Achievement[]> {
    const { data } = await apiClient.get(`/achievements/category/${category}`);
    return data;
  },

  async getStats(): Promise<{
    total: number;
    unlocked: number;
    totalXp: number;
  }> {
    const achievements = await this.getMyAchievements();
    const unlocked = achievements.filter((a) => a.isUnlocked);
    
    return {
      total: achievements.length,
      unlocked: unlocked.length,
      totalXp: unlocked.reduce((sum, a) => sum + a.xpReward, 0),
    };
  },
};
```

---

## ✅ Acceptance Criteria

- [ ] Achievement grid displays all achievements
- [ ] Category filtering works
- [ ] Locked/unlocked states visible
- [ ] Progress bar for incomplete
- [ ] Rarity indicators (color, glow)
- [ ] Detail modal shows full info
- [ ] Unlock animation plays
- [ ] Confetti on unlock

---

## 🧪 Test Cases

```typescript
describe('AchievementGrid', () => {
  it('filters by category', async () => {
    // Click Streak tab
    // Verify only streak achievements shown
  });

  it('shows progress for locked', async () => {
    // Find locked achievement
    // Verify progress bar visible
  });
});

describe('AchievementUnlockedModal', () => {
  it('plays animation on open', async () => {
    // Open modal with achievement
    // Verify animation plays
    // Verify confetti triggered
  });
});
```

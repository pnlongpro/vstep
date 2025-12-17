# Task: FE-033 - Achievement Badges

## Task Info

| Field | Value |
|-------|-------|
| **Task ID** | FE-033 |
| **Task Name** | Achievement Badges |
| **Module** | Dashboard & Analytics |
| **Sprint** | 07-08 |
| **Estimated Hours** | 4h |
| **Priority** | P1 (High) |
| **Dependencies** | FE-029 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Existing components:**
> - `FE/src/components/BadgeCard.tsx` - ✅ Badge display với animations
> - `FE/src/services/gamification.service.ts` - ✅ Badges API đã có
> - `UI-Template/components/BadgeUnlockedModal.tsx` - Có thể tham khảo

**Action:** Wire up existing BadgeCard với API, tạo badges grid và unlock modal.

---

## Description

Integrate badge system:
- Display all available badges
- Show unlocked vs locked badges
- Badge unlock celebration modal
- Badges showcase on profile

---

## Acceptance Criteria

- [ ] Badges grid với unlocked/locked states
- [ ] Badge unlock animation và modal
- [ ] Filter badges by category
- [ ] Showcase feature (pin favorite badges)
- [ ] API integration

---

## Implementation

### 1. Badges Hook

```typescript
// src/hooks/useBadges.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gamificationService } from "@/services/gamification.service";

export const badgeKeys = {
  all: ["badges"] as const,
  list: () => [...badgeKeys.all, "list"] as const,
  earned: () => [...badgeKeys.all, "earned"] as const,
  showcase: () => [...badgeKeys.all, "showcase"] as const,
};

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  xpReward: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress?: number; // 0-100 for partial progress
  requirement?: string;
}

export function useAllBadges() {
  return useQuery({
    queryKey: badgeKeys.list(),
    queryFn: () => gamificationService.getBadges(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useEarnedBadges() {
  return useQuery({
    queryKey: badgeKeys.earned(),
    queryFn: () => gamificationService.getEarnedBadges(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCheckBadgeUnlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => gamificationService.checkBadgeUnlock(),
    onSuccess: (newBadges) => {
      if (newBadges && newBadges.length > 0) {
        queryClient.invalidateQueries({ queryKey: badgeKeys.all });
      }
      return newBadges;
    },
  });
}

export function useBadgeShowcase() {
  return useQuery({
    queryKey: badgeKeys.showcase(),
    queryFn: async () => {
      // Get showcased badges (user's pinned favorites)
      const response = await gamificationService.getBadgeShowcase();
      return response;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateShowcase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (badgeIds: string[]) => 
      gamificationService.updateBadgeShowcase(badgeIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: badgeKeys.showcase() });
    },
  });
}
```

### 2. Badges Grid Component

```tsx
// src/components/dashboard/badges-grid.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BadgeCard } from "@/components/BadgeCard";
import { BadgeDetailModal } from "./badge-detail-modal";
import { useAllBadges, type Badge as BadgeType } from "@/hooks/useBadges";
import { cn } from "@/lib/utils";
import {
  Award,
  Flame,
  Target,
  BookOpen,
  Star,
  Trophy,
  Zap,
  Crown,
} from "lucide-react";

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  award: Award,
  flame: Flame,
  target: Target,
  book: BookOpen,
  star: Star,
  trophy: Trophy,
  zap: Zap,
  crown: Crown,
};

// Rarity colors
const rarityColors: Record<string, string> = {
  common: "from-gray-400 to-gray-500",
  uncommon: "from-green-400 to-green-600",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-yellow-400 to-orange-500",
};

const categories = [
  { id: "all", label: "Tất cả" },
  { id: "streak", label: "Streak" },
  { id: "practice", label: "Luyện tập" },
  { id: "exam", label: "Thi thử" },
  { id: "skill", label: "Kỹ năng" },
  { id: "special", label: "Đặc biệt" },
];

export function BadgesGrid() {
  const { data: badges, isLoading } = useAllBadges();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBadge, setSelectedBadge] = useState<BadgeType | null>(null);

  if (isLoading) {
    return <BadgesGridSkeleton />;
  }

  const filteredBadges = badges?.filter(
    (badge: BadgeType) => selectedCategory === "all" || badge.category === selectedCategory
  ) || [];

  const unlockedCount = badges?.filter((b: BadgeType) => b.isUnlocked).length || 0;
  const totalCount = badges?.length || 0;

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Huy hiệu</CardTitle>
            <Badge variant="secondary">
              {unlockedCount}/{totalCount}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Category tabs */}
          <Tabs
            defaultValue="all"
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <TabsList className="w-full justify-start overflow-x-auto">
              {categories.map((cat) => (
                <TabsTrigger key={cat.id} value={cat.id} className="text-xs">
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-4">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {filteredBadges.map((badge: BadgeType) => {
                  const Icon = iconMap[badge.icon] || Award;
                  
                  return (
                    <div
                      key={badge.id}
                      onClick={() => setSelectedBadge(badge)}
                      className="cursor-pointer"
                    >
                      <BadgeCard
                        id={badge.id}
                        name={badge.name}
                        description={badge.description}
                        icon={Icon}
                        color={rarityColors[badge.rarity]}
                        isUnlocked={badge.isUnlocked}
                        unlockedAt={badge.unlockedAt}
                        size="small"
                      />
                    </div>
                  );
                })}
              </div>

              {filteredBadges.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Không có huy hiệu trong danh mục này
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Badge detail modal */}
      <BadgeDetailModal
        badge={selectedBadge}
        open={!!selectedBadge}
        onClose={() => setSelectedBadge(null)}
      />
    </>
  );
}

function BadgesGridSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <Skeleton className="h-6 w-24" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-full mb-4" />
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {[...Array(12)].map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

### 3. Badge Detail Modal

```tsx
// src/components/dashboard/badge-detail-modal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { Award, Calendar, Star, Lock, Pin } from "lucide-react";
import type { Badge as BadgeType } from "@/hooks/useBadges";

interface BadgeDetailModalProps {
  badge: BadgeType | null;
  open: boolean;
  onClose: () => void;
  onPin?: (badgeId: string) => void;
}

const rarityLabels: Record<string, string> = {
  common: "Phổ thông",
  uncommon: "Không phổ biến",
  rare: "Hiếm",
  epic: "Sử thi",
  legendary: "Huyền thoại",
};

const rarityColors: Record<string, string> = {
  common: "bg-gray-500",
  uncommon: "bg-green-500",
  rare: "bg-blue-500",
  epic: "bg-purple-500",
  legendary: "bg-gradient-to-r from-yellow-400 to-orange-500",
};

export function BadgeDetailModal({
  badge,
  open,
  onClose,
  onPin,
}: BadgeDetailModalProps) {
  if (!badge) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">Chi tiết huy hiệu</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center text-center">
          {/* Badge icon */}
          <div
            className={cn(
              "w-24 h-24 rounded-2xl flex items-center justify-center mb-4",
              badge.isUnlocked
                ? `bg-gradient-to-br ${rarityColors[badge.rarity]}`
                : "bg-muted"
            )}
          >
            {badge.isUnlocked ? (
              <Award className="w-12 h-12 text-white" />
            ) : (
              <Lock className="w-12 h-12 text-muted-foreground" />
            )}
          </div>

          {/* Badge name */}
          <h3 className="text-xl font-bold mb-1">{badge.name}</h3>

          {/* Rarity badge */}
          <Badge
            className={cn(
              "mb-3",
              rarityColors[badge.rarity],
              "text-white border-0"
            )}
          >
            {rarityLabels[badge.rarity]}
          </Badge>

          {/* Description */}
          <p className="text-muted-foreground mb-4">{badge.description}</p>

          {/* Unlock status */}
          {badge.isUnlocked ? (
            <div className="flex items-center gap-2 text-sm text-green-600 mb-4">
              <Calendar className="w-4 h-4" />
              <span>
                Mở khóa {format(parseISO(badge.unlockedAt!), "dd/MM/yyyy", { locale: vi })}
              </span>
            </div>
          ) : (
            <div className="w-full mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Tiến độ</span>
                <span className="font-medium">{badge.progress || 0}%</span>
              </div>
              <Progress value={badge.progress || 0} className="h-2" />
              {badge.requirement && (
                <p className="text-xs text-muted-foreground mt-2">
                  {badge.requirement}
                </p>
              )}
            </div>
          )}

          {/* XP reward */}
          <div className="flex items-center gap-1 text-sm mb-4">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>+{badge.xpReward} XP</span>
          </div>

          {/* Actions */}
          {badge.isUnlocked && onPin && (
            <Button variant="outline" onClick={() => onPin(badge.id)}>
              <Pin className="w-4 h-4 mr-2" />
              Ghim vào hồ sơ
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### 4. Badge Unlock Modal (Celebration)

```tsx
// src/components/dashboard/badge-unlocked-modal.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import confetti from "canvas-confetti";
import { Award, Star, X } from "lucide-react";
import type { Badge as BadgeType } from "@/hooks/useBadges";

interface BadgeUnlockedModalProps {
  badge: BadgeType | null;
  open: boolean;
  onClose: () => void;
}

export function BadgeUnlockedModal({
  badge,
  open,
  onClose,
}: BadgeUnlockedModalProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (open && badge) {
      // Delay content for animation
      const timer = setTimeout(() => setShowContent(true), 300);
      
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FFD700", "#FFA500", "#FF6347"],
      });

      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [open, badge]);

  if (!badge) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-0 bg-gradient-to-b from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="flex flex-col items-center text-center py-6"
            >
              {/* Celebration text */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-4"
              >
                🎉 Chúc mừng! 🎉
              </motion.div>

              {/* Badge icon with glow */}
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="relative mb-4"
              >
                <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-50 rounded-full" />
                <div className="relative w-32 h-32 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-xl">
                  <Award className="w-16 h-16 text-white" />
                </div>
              </motion.div>

              {/* Badge name */}
              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl font-bold mb-2"
              >
                {badge.name}
              </motion.h3>

              {/* Description */}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-muted-foreground mb-4"
              >
                {badge.description}
              </motion.p>

              {/* XP reward */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="flex items-center gap-2 text-lg font-bold text-yellow-600 mb-6"
              >
                <Star className="w-5 h-5" />
                <span>+{badge.xpReward} XP</span>
              </motion.div>

              {/* Close button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Button onClick={onClose}>Tuyệt vời!</Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
```

### 5. Badges Showcase (Profile)

```tsx
// src/components/dashboard/badges-showcase.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BadgeCard } from "@/components/BadgeCard";
import { useBadgeShowcase } from "@/hooks/useBadges";
import { Award, Plus } from "lucide-react";
import Link from "next/link";

export function BadgesShowcase() {
  const { data: showcaseBadges, isLoading } = useBadgeShowcase();

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="w-14 h-14 rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">Huy hiệu nổi bật</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/achievements">Xem tất cả</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          {showcaseBadges && showcaseBadges.length > 0 ? (
            showcaseBadges.slice(0, 5).map((badge: any) => (
              <div
                key={badge.id}
                className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center"
                title={badge.name}
              >
                <Award className="w-7 h-7 text-white" />
              </div>
            ))
          ) : (
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-14 h-14 rounded-xl border-2 border-dashed flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-sm">Chưa có huy hiệu nào được ghim</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## File Structure

```
FE/src/
├── hooks/
│   └── useBadges.ts              # NEW - Badge hooks
│
├── components/dashboard/
│   ├── badges-grid.tsx           # NEW - Badges grid
│   ├── badge-detail-modal.tsx    # NEW - Badge details
│   ├── badge-unlocked-modal.tsx  # NEW - Celebration modal
│   └── badges-showcase.tsx       # NEW - Profile showcase
```

---

## Dependencies

```bash
# For confetti effect
npm install canvas-confetti
npm install -D @types/canvas-confetti
```

---

## Next Task

Continue with **FE-034: Streak Display** - Display streak information and controls.

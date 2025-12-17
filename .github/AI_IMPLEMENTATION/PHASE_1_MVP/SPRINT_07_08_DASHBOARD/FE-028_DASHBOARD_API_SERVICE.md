# Task: FE-028 - Dashboard API Service

## Task Info

| Field | Value |
|-------|-------|
| **Task ID** | FE-028 |
| **Task Name** | Dashboard API Service |
| **Module** | Dashboard & Analytics |
| **Sprint** | 07-08 |
| **Estimated Hours** | 4h |
| **Priority** | P0 (Critical) |
| **Dependencies** | BE-028, BE-029, BE-030 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Tham khảo:** `02_FE_COMPONENT_MAPPING.md`
>
> **Existing code:**
> - `FE/src/services/gamification.service.ts` - Đã có badges, goals, leaderboard API
> - `FE/src/lib/axios.ts` - API client đã config sẵn

---

## Description

Tạo và extend API services cho Dashboard module:
- Stats service cho user statistics
- Analytics service cho score trends, skill breakdown
- Progress service cho learning progress
- Activity service cho recent activities

---

## Acceptance Criteria

- [ ] Extend existing services hoặc tạo mới nếu cần
- [ ] TypeScript types đầy đủ
- [ ] Error handling
- [ ] Response types match backend DTOs

---

## Implementation

### 1. Dashboard Types

```typescript
// src/types/dashboard.types.ts

// ==================== Stats Types ====================
export interface UserStats {
  testsCompleted: number;
  practiceCompleted: number;
  totalStudyMinutes: number;
  totalStudyHours: number;
  currentStreak: number;
  longestStreak: number;
  averageScore: number;
  totalXp: number;
  currentLevel: number;
  xpToNextLevel: number;
  totalBadges: number;
}

export interface StatCard {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: string; // Icon name
  color: string;
}

export interface DashboardStatsResponse {
  stats: UserStats;
  cards: StatCard[];
  comparisonPeriod: string;
}

// ==================== Analytics Types ====================
export interface ScoreTrend {
  date: string;
  reading: number;
  listening: number;
  writing: number;
  speaking: number;
  average: number;
}

export interface SkillData {
  skill: string;
  averageScore: number;
  totalAttempts: number;
  improvement: number;
  lastScore: number;
  trend: 'up' | 'down' | 'stable';
}

export interface SkillBreakdown {
  reading: SkillData;
  listening: SkillData;
  writing: SkillData;
  speaking: SkillData;
  strengths: string[];
  weaknesses: string[];
}

export interface WeeklySummary {
  weekStart: string;
  weekEnd: string;
  studyMinutes: number;
  testsCompleted: number;
  practicesCompleted: number;
  averageScore: number;
  xpEarned: number;
  streakDays: number;
  comparison: {
    studyMinutes: number;
    testsCompleted: number;
    averageScore: number;
  };
}

export interface PerformanceInsight {
  type: 'improvement' | 'decline' | 'achievement' | 'recommendation';
  title: string;
  description: string;
  skill?: string;
  value?: number;
}

// ==================== Activity Types ====================
export interface UserActivity {
  id: string;
  type: 'practice' | 'exam' | 'achievement' | 'assignment' | 'streak' | 'level_up';
  title: string;
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
  skill?: string;
  score?: number;
}

export interface ActivityCalendarDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4; // Activity intensity
  activities: string[];
}

// ==================== Progress Types ====================
export interface UserGoal {
  id: string;
  type: 'vstep_level' | 'weekly_hours' | 'daily_streak' | 'skill_score';
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  progress: number;
  startDate: string;
  targetDate: string;
  status: 'active' | 'completed' | 'failed';
}

export interface ProgressMilestone {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  completedAt?: string;
  progress: number;
}

// ==================== Roadmap Types ====================
export interface LearningRoadmap {
  id: string;
  currentLevel: string;
  targetLevel: string;
  targetDate: string;
  overallProgress: number;
  estimatedWeeks: number;
  weeklyHours: number;
  readingScore: number;
  listeningScore: number;
  writingScore: number;
  speakingScore: number;
  status: 'active' | 'paused' | 'completed';
}

export interface WeeklyPlan {
  reading: number;
  listening: number;
  writing: number;
  speaking: number;
  mockTests: number;
}

export interface SkillRecommendation {
  id: string;
  type: 'practice' | 'review' | 'mock_test' | 'focus_area';
  priority: 'low' | 'medium' | 'high' | 'critical';
  skill: string;
  title: string;
  description: string;
  reason?: string;
  actionUrl?: string;
  estimatedMinutes?: number;
}

export interface RoadmapSummary {
  roadmap: LearningRoadmap;
  milestones: ProgressMilestone[];
  recommendations: SkillRecommendation[];
  weeklyPlan: WeeklyPlan;
  insights: {
    type: 'strength' | 'weakness' | 'suggestion' | 'warning';
    message: string;
    skill?: string;
  }[];
}

// ==================== Streak Types ====================
export interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  freezeCount: number;
  isFrozenToday: boolean;
  canRecover: boolean;
  nextMilestone: number;
  milestoneProgress: number;
}

// ==================== Leaderboard Types ====================
export interface LeaderboardEntry {
  rank: number;
  previousRank?: number;
  rankChange?: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  userLevel: number;
  badgesCount: number;
  value: number;
  isCurrentUser: boolean;
}

export interface LeaderboardResponse {
  period: 'daily' | 'weekly' | 'monthly' | 'all_time';
  type: 'xp' | 'score' | 'streak';
  entries: LeaderboardEntry[];
  totalParticipants: number;
  currentUserRank?: number;
  lastUpdated: string;
}
```

### 2. Dashboard Service

```typescript
// src/services/dashboard.service.ts
import { apiClient } from '@/lib/axios';
import type {
  DashboardStatsResponse,
  UserStats,
  UserActivity,
  ActivityCalendarDay,
} from '@/types/dashboard.types';

class DashboardService {
  private baseUrl = '/dashboard';

  /**
   * Lấy thống kê tổng quan
   */
  async getStats(): Promise<DashboardStatsResponse> {
    const response = await apiClient.get<DashboardStatsResponse>(`${this.baseUrl}/stats`);
    return response.data;
  }

  /**
   * Lấy user stats chi tiết
   */
  async getUserStats(): Promise<UserStats> {
    const response = await apiClient.get<UserStats>(`${this.baseUrl}/user-stats`);
    return response.data;
  }

  /**
   * Lấy hoạt động gần đây
   */
  async getRecentActivities(limit = 10): Promise<UserActivity[]> {
    const response = await apiClient.get<UserActivity[]>(`${this.baseUrl}/activities`, {
      params: { limit },
    });
    return response.data;
  }

  /**
   * Lấy activity calendar data (GitHub-style)
   */
  async getActivityCalendar(
    startDate: string,
    endDate: string,
  ): Promise<ActivityCalendarDay[]> {
    const response = await apiClient.get<ActivityCalendarDay[]>(`${this.baseUrl}/calendar`, {
      params: { startDate, endDate },
    });
    return response.data;
  }

  /**
   * Lấy daily stats
   */
  async getDailyStats(date?: string): Promise<{
    studyMinutes: number;
    practicesCompleted: number;
    xpEarned: number;
  }> {
    const response = await apiClient.get(`${this.baseUrl}/daily`, {
      params: { date },
    });
    return response.data;
  }
}

export const dashboardService = new DashboardService();
```

### 3. Analytics Service

```typescript
// src/services/analytics.service.ts
import { apiClient } from '@/lib/axios';
import type {
  ScoreTrend,
  SkillBreakdown,
  WeeklySummary,
  PerformanceInsight,
} from '@/types/dashboard.types';

class AnalyticsService {
  private baseUrl = '/analytics';

  /**
   * Lấy xu hướng điểm số
   */
  async getScoreTrends(days = 30): Promise<{
    trends: ScoreTrend[];
    overallTrend: 'up' | 'down' | 'stable';
    averageImprovement: number;
  }> {
    const response = await apiClient.get(`${this.baseUrl}/trends`, {
      params: { days },
    });
    return response.data;
  }

  /**
   * Lấy phân tích kỹ năng
   */
  async getSkillBreakdown(): Promise<SkillBreakdown> {
    const response = await apiClient.get<SkillBreakdown>(`${this.baseUrl}/skills`);
    return response.data;
  }

  /**
   * Lấy tóm tắt tuần
   */
  async getWeeklySummary(): Promise<WeeklySummary> {
    const response = await apiClient.get<WeeklySummary>(`${this.baseUrl}/weekly-summary`);
    return response.data;
  }

  /**
   * Lấy performance insights
   */
  async getInsights(): Promise<PerformanceInsight[]> {
    const response = await apiClient.get<PerformanceInsight[]>(`${this.baseUrl}/insights`);
    return response.data;
  }

  /**
   * Lấy skill radar data cho chart
   */
  async getSkillRadarData(): Promise<{
    labels: string[];
    data: number[];
    targetData: number[];
  }> {
    const breakdown = await this.getSkillBreakdown();
    return {
      labels: ['Reading', 'Listening', 'Writing', 'Speaking'],
      data: [
        breakdown.reading.averageScore,
        breakdown.listening.averageScore,
        breakdown.writing.averageScore,
        breakdown.speaking.averageScore,
      ],
      targetData: [7.5, 7.5, 7.5, 7.5], // Target scores for B2
    };
  }
}

export const analyticsService = new AnalyticsService();
```

### 4. Progress Service

```typescript
// src/services/progress.service.ts
import { apiClient } from '@/lib/axios';
import type {
  UserGoal,
  ProgressMilestone,
  LearningRoadmap,
  RoadmapSummary,
  SkillRecommendation,
} from '@/types/dashboard.types';

interface CreateGoalDto {
  type: 'vstep_level' | 'weekly_hours' | 'daily_streak' | 'skill_score';
  title: string;
  description?: string;
  targetValue: number;
  targetDate: string;
  skill?: string;
}

interface CreateRoadmapDto {
  targetLevel: 'A2' | 'B1' | 'B2' | 'C1';
  targetDate?: string;
  weeklyHours?: number;
  preferredSkills?: string[];
}

class ProgressService {
  private baseUrl = '/progress';

  // ==================== Goals ====================
  
  async getGoals(status?: string): Promise<UserGoal[]> {
    const response = await apiClient.get<UserGoal[]>(`${this.baseUrl}/goals`, {
      params: { status },
    });
    return response.data;
  }

  async createGoal(data: CreateGoalDto): Promise<UserGoal> {
    const response = await apiClient.post<UserGoal>(`${this.baseUrl}/goals`, data);
    return response.data;
  }

  async updateGoal(goalId: string, data: Partial<CreateGoalDto>): Promise<UserGoal> {
    const response = await apiClient.put<UserGoal>(`${this.baseUrl}/goals/${goalId}`, data);
    return response.data;
  }

  async deleteGoal(goalId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/goals/${goalId}`);
  }

  // ==================== Milestones ====================

  async getMilestones(): Promise<ProgressMilestone[]> {
    const response = await apiClient.get<ProgressMilestone[]>(`${this.baseUrl}/milestones`);
    return response.data;
  }

  // ==================== Roadmap ====================

  async getRoadmap(): Promise<RoadmapSummary | null> {
    try {
      const response = await apiClient.get<RoadmapSummary>('/roadmap');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async createRoadmap(data: CreateRoadmapDto): Promise<LearningRoadmap> {
    const response = await apiClient.post<LearningRoadmap>('/roadmap', data);
    return response.data;
  }

  async getRecommendations(limit = 5): Promise<SkillRecommendation[]> {
    const response = await apiClient.get<SkillRecommendation[]>('/roadmap/recommendations', {
      params: { limit },
    });
    return response.data;
  }

  async completeRecommendation(recommendationId: string): Promise<void> {
    await apiClient.post(`/roadmap/recommendations/${recommendationId}/complete`);
  }

  async refreshRoadmapProgress(): Promise<void> {
    await apiClient.post('/roadmap/refresh');
  }

  // ==================== Snapshot ====================

  async getProgressSnapshot(): Promise<{
    currentLevel: string;
    targetLevel: string;
    progress: number;
    daysRemaining: number;
    activeGoals: number;
    completedMilestones: number;
  }> {
    const response = await apiClient.get(`${this.baseUrl}/snapshot`);
    return response.data;
  }
}

export const progressService = new ProgressService();
```

### 5. Streak Service

```typescript
// src/services/streak.service.ts
import { apiClient } from '@/lib/axios';
import type { UserStreak } from '@/types/dashboard.types';

interface StreakHistoryEntry {
  date: string;
  event: 'started' | 'continued' | 'frozen' | 'lost' | 'recovered' | 'milestone';
  streakCount: number;
  description?: string;
}

class StreakService {
  private baseUrl = '/streaks';

  /**
   * Lấy thông tin streak hiện tại
   */
  async getCurrentStreak(): Promise<UserStreak> {
    const response = await apiClient.get<UserStreak>(`${this.baseUrl}/current`);
    return response.data;
  }

  /**
   * Lấy lịch sử streak
   */
  async getStreakHistory(limit = 30): Promise<StreakHistoryEntry[]> {
    const response = await apiClient.get<StreakHistoryEntry[]>(`${this.baseUrl}/history`, {
      params: { limit },
    });
    return response.data;
  }

  /**
   * Mua freeze streak (sử dụng XP)
   */
  async purchaseFreeze(): Promise<{
    success: boolean;
    freezeCount: number;
    xpSpent: number;
    remainingXp: number;
  }> {
    const response = await apiClient.post(`${this.baseUrl}/freeze/purchase`);
    return response.data;
  }

  /**
   * Sử dụng freeze
   */
  async useFreeze(): Promise<{
    success: boolean;
    isFrozenToday: boolean;
    freezeRemaining: number;
  }> {
    const response = await apiClient.post(`${this.baseUrl}/freeze/use`);
    return response.data;
  }

  /**
   * Khôi phục streak
   */
  async recoverStreak(): Promise<{
    success: boolean;
    currentStreak: number;
    xpSpent: number;
  }> {
    const response = await apiClient.post(`${this.baseUrl}/recover`);
    return response.data;
  }

  /**
   * Lấy streak milestones
   */
  async getStreakMilestones(): Promise<{
    milestones: { days: number; reward: string; achieved: boolean }[];
    nextMilestone: number;
  }> {
    const response = await apiClient.get(`${this.baseUrl}/milestones`);
    return response.data;
  }
}

export const streakService = new StreakService();
```

### 6. Extend Gamification Service

```typescript
// src/services/gamification.service.ts
// ⚠️ File này đã tồn tại - CHỈ THÊM methods mới, KHÔNG viết lại

import { apiClient } from '@/lib/axios';
import type { LeaderboardResponse, LeaderboardEntry } from '@/types/dashboard.types';

// Thêm vào class GamificationService hiện có:

class GamificationService {
  // ... existing methods ...

  // ==================== Leaderboard (NEW) ====================

  /**
   * Lấy leaderboard
   */
  async getLeaderboard(
    period: 'daily' | 'weekly' | 'monthly' | 'all_time' = 'weekly',
    type: 'xp' | 'score' | 'streak' = 'xp',
    options?: {
      vstepLevel?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<LeaderboardResponse> {
    const response = await apiClient.get<LeaderboardResponse>('/leaderboard', {
      params: { period, type, ...options },
    });
    return response.data;
  }

  /**
   * Lấy rank của user hiện tại
   */
  async getMyRank(
    period: 'weekly' | 'monthly' | 'all_time' = 'weekly',
    type: 'xp' | 'score' | 'streak' = 'xp',
  ): Promise<{
    userEntry: LeaderboardEntry | null;
    surrounding: LeaderboardEntry[];
  }> {
    const response = await apiClient.get('/leaderboard/my-rank', {
      params: { period, type },
    });
    return response.data;
  }

  /**
   * Lấy top users nhanh
   */
  async getTopUsers(
    type: 'xp' | 'score' | 'streak' = 'xp',
    limit = 10,
  ): Promise<LeaderboardEntry[]> {
    const response = await apiClient.get<LeaderboardEntry[]>(`/leaderboard/top/${type}`, {
      params: { limit },
    });
    return response.data;
  }

  /**
   * Lấy weekly top
   */
  async getWeeklyTop(limit = 10): Promise<LeaderboardEntry[]> {
    const response = await apiClient.get<LeaderboardEntry[]>('/leaderboard/weekly-top', {
      params: { limit },
    });
    return response.data;
  }
}

export const gamificationService = new GamificationService();
```

### 7. Export all services

```typescript
// src/services/index.ts
// ⚠️ Thêm exports mới vào file hiện có

export * from './dashboard.service';
export * from './analytics.service';
export * from './progress.service';
export * from './streak.service';
export * from './gamification.service';
export * from './exams.service';
export * from './notifications.service';
// ... other existing exports
```

---

## File Structure

```
FE/src/
├── types/
│   └── dashboard.types.ts       # NEW - Dashboard TypeScript types
│
├── services/
│   ├── dashboard.service.ts     # NEW - Dashboard API
│   ├── analytics.service.ts     # NEW - Analytics API
│   ├── progress.service.ts      # NEW - Progress/Roadmap API
│   ├── streak.service.ts        # NEW - Streak API
│   ├── gamification.service.ts  # EXTEND - Add leaderboard methods
│   └── index.ts                 # UPDATE - Add exports
```

---

## Next Task

Continue with **FE-029: Dashboard Layout** - Wire up dashboard layout with API data.

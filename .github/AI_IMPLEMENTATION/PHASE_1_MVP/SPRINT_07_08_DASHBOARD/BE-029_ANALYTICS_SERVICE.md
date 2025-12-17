# Task: BE-029 - Analytics Service

## Task Info

| Field | Value |
|-------|-------|
| **Task ID** | BE-029 |
| **Task Name** | Analytics Service |
| **Module** | Dashboard & Analytics |
| **Sprint** | 07-08 |
| **Estimated Hours** | 8h |
| **Priority** | P0 (Critical) |
| **Dependencies** | BE-028 |

---

## Description

Implement comprehensive analytics service for calculating:
- Aggregate statistics (weekly, monthly, all-time)
- Score trends and improvements
- Skill breakdown analysis
- Comparative analytics (percentiles)
- Performance predictions

---

## Acceptance Criteria

- [ ] Analytics Service với các phương thức tính toán
- [ ] Score trend analysis (improvement over time)
- [ ] Skill breakdown với strengths/weaknesses detection
- [ ] Percentile ranking calculations
- [ ] Weekly/Monthly summary generation
- [ ] Performance insights và recommendations
- [ ] Caching layer cho analytics heavy

---

## Implementation

### 1. Analytics Service

```typescript
// src/modules/dashboard/services/analytics.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { 
  UserStats, 
  UserDailyStats, 
  XpTransaction 
} from '../entities';
import { 
  UserStatsRepository, 
  UserDailyStatsRepository 
} from '../repositories/user-stats.repository';
import { ExamAttempt } from '../../exams/entities/exam-attempt.entity';
import { PracticeSession } from '../../practice/entities/practice-session.entity';
import { 
  subDays, 
  subWeeks, 
  subMonths, 
  startOfWeek, 
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format,
  differenceInDays,
  eachDayOfInterval,
} from 'date-fns';

export interface AnalyticsTimeframe {
  startDate: Date;
  endDate: Date;
  label: string;
}

export interface ScoreTrend {
  dates: string[];
  scores: number[];
  average: number;
  trend: 'improving' | 'declining' | 'stable';
  changePercent: number;
}

export interface SkillBreakdown {
  skill: 'reading' | 'listening' | 'writing' | 'speaking';
  currentScore: number;
  previousScore: number;
  change: number;
  isStrength: boolean;
  isWeakness: boolean;
  percentile: number;
  recommendation?: string;
}

export interface PerformanceInsight {
  type: 'strength' | 'weakness' | 'improvement' | 'decline' | 'recommendation';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  action?: string;
}

export interface WeeklySummary {
  weekStart: Date;
  weekEnd: Date;
  totalStudyMinutes: number;
  testsCompleted: number;
  practiceSessions: number;
  averageScore: number;
  xpEarned: number;
  streakDays: number;
  goalProgress: number;
  comparedToLastWeek: {
    studyMinutes: number;
    score: number;
    xp: number;
  };
}

@Injectable()
export class AnalyticsService {
  private readonly CACHE_TTL = 300; // 5 minutes

  constructor(
    private readonly userStatsRepo: UserStatsRepository,
    private readonly dailyStatsRepo: UserDailyStatsRepository,
    @InjectRepository(ExamAttempt)
    private readonly examAttemptRepo: Repository<ExamAttempt>,
    @InjectRepository(PracticeSession)
    private readonly practiceSessionRepo: Repository<PracticeSession>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  // ==================== Score Trends ====================

  async getScoreTrend(
    userId: string,
    days: number = 30,
    skill?: 'reading' | 'listening' | 'writing' | 'speaking',
  ): Promise<ScoreTrend> {
    const cacheKey = `score_trend:${userId}:${days}:${skill || 'all'}`;
    const cached = await this.cacheManager.get<ScoreTrend>(cacheKey);
    if (cached) return cached;

    const endDate = new Date();
    const startDate = subDays(endDate, days);

    // Get exam attempts with scores
    const attempts = await this.examAttemptRepo.find({
      where: {
        userId,
        status: 'completed',
        endTime: Between(startDate, endDate),
      },
      order: { endTime: 'ASC' },
      relations: ['result'],
    });

    // Extract scores
    const dataPoints: { date: string; score: number }[] = [];
    
    for (const attempt of attempts) {
      if (attempt.result) {
        let score: number;
        if (skill) {
          score = attempt.result.skillScores?.[skill] || 0;
        } else {
          score = attempt.result.overallScore;
        }
        
        dataPoints.push({
          date: format(attempt.endTime, 'yyyy-MM-dd'),
          score,
        });
      }
    }

    // Calculate trend
    const dates = dataPoints.map(d => d.date);
    const scores = dataPoints.map(d => d.score);
    const average = scores.length > 0 
      ? scores.reduce((a, b) => a + b, 0) / scores.length 
      : 0;

    // Calculate trend direction
    let trend: 'improving' | 'declining' | 'stable' = 'stable';
    let changePercent = 0;

    if (scores.length >= 2) {
      const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
      const secondHalf = scores.slice(Math.floor(scores.length / 2));
      
      const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
      
      changePercent = firstAvg > 0 
        ? ((secondAvg - firstAvg) / firstAvg) * 100 
        : 0;
      
      if (changePercent > 5) {
        trend = 'improving';
      } else if (changePercent < -5) {
        trend = 'declining';
      }
    }

    const result: ScoreTrend = {
      dates,
      scores,
      average: Math.round(average * 100) / 100,
      trend,
      changePercent: Math.round(changePercent * 100) / 100,
    };

    await this.cacheManager.set(cacheKey, result, this.CACHE_TTL);
    return result;
  }

  // ==================== Skill Analysis ====================

  async getSkillBreakdown(userId: string): Promise<SkillBreakdown[]> {
    const cacheKey = `skill_breakdown:${userId}`;
    const cached = await this.cacheManager.get<SkillBreakdown[]>(cacheKey);
    if (cached) return cached;

    const stats = await this.userStatsRepo.findByUserId(userId);
    if (!stats) {
      return [];
    }

    // Get previous scores (30 days ago)
    const previousStats = await this.getPreviousPeriodStats(userId, 30);

    const skills = ['reading', 'listening', 'writing', 'speaking'] as const;
    const breakdown: SkillBreakdown[] = [];

    // Calculate percentiles for each skill
    const percentiles = await this.calculateSkillPercentiles(userId);

    for (const skill of skills) {
      const currentScore = stats[`${skill}Average`] || 0;
      const previousScore = previousStats?.[`${skill}Average`] || 0;
      const change = currentScore - previousScore;
      const percentile = percentiles[skill] || 50;

      breakdown.push({
        skill,
        currentScore: Math.round(currentScore * 100) / 100,
        previousScore: Math.round(previousScore * 100) / 100,
        change: Math.round(change * 100) / 100,
        isStrength: percentile >= 70,
        isWeakness: percentile <= 30,
        percentile,
        recommendation: this.getSkillRecommendation(skill, currentScore, percentile),
      });
    }

    // Sort by weakness first (for priority focus)
    breakdown.sort((a, b) => a.percentile - b.percentile);

    await this.cacheManager.set(cacheKey, breakdown, this.CACHE_TTL);
    return breakdown;
  }

  private async calculateSkillPercentiles(
    userId: string,
  ): Promise<Record<string, number>> {
    const userStats = await this.userStatsRepo.findByUserId(userId);
    if (!userStats) {
      return { reading: 50, listening: 50, writing: 50, speaking: 50 };
    }

    const skills = ['reading', 'listening', 'writing', 'speaking'] as const;
    const percentiles: Record<string, number> = {};

    for (const skill of skills) {
      const userScore = userStats[`${skill}Average`] || 0;
      
      // Count users with lower scores
      const lowerCount = await this.userStatsRepo.count({
        where: {
          [`${skill}Average`]: LessThanOrEqual(userScore),
        },
      });
      
      const totalCount = await this.userStatsRepo.count();
      
      percentiles[skill] = totalCount > 0 
        ? Math.round((lowerCount / totalCount) * 100) 
        : 50;
    }

    return percentiles;
  }

  private getSkillRecommendation(
    skill: string,
    score: number,
    percentile: number,
  ): string {
    if (score < 4) {
      return `Tập trung luyện ${skill} với các bài tập cơ bản để xây dựng nền tảng.`;
    }
    
    if (percentile <= 30) {
      return `${skill.charAt(0).toUpperCase() + skill.slice(1)} là kỹ năng yếu nhất. Ưu tiên luyện tập hàng ngày.`;
    }
    
    if (percentile >= 70) {
      return `Duy trì phong độ ${skill} tốt! Thử thách với đề thi khó hơn.`;
    }
    
    return `Tiếp tục luyện ${skill} để cải thiện thêm.`;
  }

  // ==================== Weekly Summary ====================

  async getWeeklySummary(userId: string, weekOffset: number = 0): Promise<WeeklySummary> {
    const cacheKey = `weekly_summary:${userId}:${weekOffset}`;
    const cached = await this.cacheManager.get<WeeklySummary>(cacheKey);
    if (cached) return cached;

    const today = new Date();
    const weekStart = startOfWeek(subWeeks(today, weekOffset), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(subWeeks(today, weekOffset), { weekStartsOn: 1 });

    // Current week data
    const dailyStats = await this.dailyStatsRepo.getDateRange(userId, weekStart, weekEnd);
    
    const totalStudyMinutes = dailyStats.reduce((sum, d) => sum + d.studyMinutes, 0);
    const testsCompleted = dailyStats.reduce((sum, d) => sum + d.testsCompleted, 0);
    const practiceSessions = dailyStats.reduce((sum, d) => sum + d.practiceSessions, 0);
    const xpEarned = dailyStats.reduce((sum, d) => sum + d.xpEarned, 0);
    
    const scoresData = dailyStats.filter(d => d.averageScore !== null);
    const averageScore = scoresData.length > 0
      ? scoresData.reduce((sum, d) => sum + (d.averageScore || 0), 0) / scoresData.length
      : 0;

    const streakDays = dailyStats.filter(d => d.studyMinutes > 0).length;

    // Get user's weekly goal
    const userStats = await this.userStatsRepo.findByUserId(userId);
    const weeklyGoal = userStats?.weeklyGoalMinutes || 300;
    const goalProgress = Math.min(100, Math.round((totalStudyMinutes / weeklyGoal) * 100));

    // Last week comparison
    const lastWeekStart = startOfWeek(subWeeks(today, weekOffset + 1), { weekStartsOn: 1 });
    const lastWeekEnd = endOfWeek(subWeeks(today, weekOffset + 1), { weekStartsOn: 1 });
    const lastWeekStats = await this.dailyStatsRepo.getDateRange(userId, lastWeekStart, lastWeekEnd);
    
    const lastWeekMinutes = lastWeekStats.reduce((sum, d) => sum + d.studyMinutes, 0);
    const lastWeekScores = lastWeekStats.filter(d => d.averageScore !== null);
    const lastWeekAvgScore = lastWeekScores.length > 0
      ? lastWeekScores.reduce((sum, d) => sum + (d.averageScore || 0), 0) / lastWeekScores.length
      : 0;
    const lastWeekXp = lastWeekStats.reduce((sum, d) => sum + d.xpEarned, 0);

    const result: WeeklySummary = {
      weekStart,
      weekEnd,
      totalStudyMinutes,
      testsCompleted,
      practiceSessions,
      averageScore: Math.round(averageScore * 100) / 100,
      xpEarned,
      streakDays,
      goalProgress,
      comparedToLastWeek: {
        studyMinutes: lastWeekMinutes > 0 
          ? Math.round(((totalStudyMinutes - lastWeekMinutes) / lastWeekMinutes) * 100) 
          : 0,
        score: lastWeekAvgScore > 0 
          ? Math.round((averageScore - lastWeekAvgScore) * 100) / 100 
          : 0,
        xp: lastWeekXp > 0 
          ? Math.round(((xpEarned - lastWeekXp) / lastWeekXp) * 100) 
          : 0,
      },
    };

    await this.cacheManager.set(cacheKey, result, this.CACHE_TTL);
    return result;
  }

  // ==================== Performance Insights ====================

  async getPerformanceInsights(userId: string): Promise<PerformanceInsight[]> {
    const cacheKey = `insights:${userId}`;
    const cached = await this.cacheManager.get<PerformanceInsight[]>(cacheKey);
    if (cached) return cached;

    const insights: PerformanceInsight[] = [];

    // Get various data for analysis
    const stats = await this.userStatsRepo.findByUserId(userId);
    const skillBreakdown = await this.getSkillBreakdown(userId);
    const scoreTrend = await this.getScoreTrend(userId, 30);
    const weeklySummary = await this.getWeeklySummary(userId);

    if (!stats) {
      insights.push({
        type: 'recommendation',
        title: 'Bắt đầu hành trình học tập',
        description: 'Hoàn thành bài thi đầu tiên để nhận phân tích cá nhân.',
        priority: 'high',
        actionable: true,
        action: 'Làm bài thi thử',
      });
      return insights;
    }

    // 1. Streak insights
    if (stats.currentStreak >= 7) {
      insights.push({
        type: 'strength',
        title: `Streak ${stats.currentStreak} ngày! 🔥`,
        description: `Bạn đã duy trì học tập liên tục ${stats.currentStreak} ngày. Tiếp tục phát huy!`,
        priority: 'low',
        actionable: false,
      });
    } else if (stats.currentStreak === 0) {
      insights.push({
        type: 'recommendation',
        title: 'Khởi động lại streak',
        description: 'Hoàn thành 1 bài luyện tập hôm nay để bắt đầu streak mới.',
        priority: 'medium',
        actionable: true,
        action: 'Luyện tập ngay',
      });
    }

    // 2. Score trend insights
    if (scoreTrend.trend === 'improving') {
      insights.push({
        type: 'improvement',
        title: 'Điểm số đang tăng! 📈',
        description: `Điểm trung bình tăng ${scoreTrend.changePercent}% trong 30 ngày qua.`,
        priority: 'low',
        actionable: false,
      });
    } else if (scoreTrend.trend === 'declining') {
      insights.push({
        type: 'decline',
        title: 'Điểm số đang giảm ⚠️',
        description: `Điểm trung bình giảm ${Math.abs(scoreTrend.changePercent)}% trong 30 ngày qua. Hãy tập trung hơn!`,
        priority: 'high',
        actionable: true,
        action: 'Xem gợi ý cải thiện',
      });
    }

    // 3. Skill weakness insights
    const weakestSkill = skillBreakdown.find(s => s.isWeakness);
    if (weakestSkill) {
      insights.push({
        type: 'weakness',
        title: `${weakestSkill.skill.charAt(0).toUpperCase() + weakestSkill.skill.slice(1)} cần cải thiện`,
        description: weakestSkill.recommendation || 'Tập trung luyện tập kỹ năng này.',
        priority: 'high',
        actionable: true,
        action: `Luyện ${weakestSkill.skill}`,
      });
    }

    // 4. Strongest skill
    const strongestSkill = skillBreakdown.find(s => s.isStrength);
    if (strongestSkill) {
      insights.push({
        type: 'strength',
        title: `${strongestSkill.skill.charAt(0).toUpperCase() + strongestSkill.skill.slice(1)} là thế mạnh 💪`,
        description: `Bạn thuộc top ${100 - strongestSkill.percentile}% người dùng ở kỹ năng này.`,
        priority: 'low',
        actionable: false,
      });
    }

    // 5. Weekly goal insights
    if (weeklySummary.goalProgress < 50) {
      insights.push({
        type: 'recommendation',
        title: 'Mục tiêu tuần chưa đạt',
        description: `Bạn mới hoàn thành ${weeklySummary.goalProgress}% mục tiêu tuần này.`,
        priority: 'medium',
        actionable: true,
        action: 'Học ngay',
      });
    } else if (weeklySummary.goalProgress >= 100) {
      insights.push({
        type: 'improvement',
        title: 'Đã đạt mục tiêu tuần! 🎯',
        description: `Tuyệt vời! Bạn đã học ${weeklySummary.totalStudyMinutes} phút tuần này.`,
        priority: 'low',
        actionable: false,
      });
    }

    // 6. Level progress
    const levelProgress = stats.levelProgress;
    if (levelProgress >= 80) {
      insights.push({
        type: 'improvement',
        title: 'Sắp lên level! 🚀',
        description: `Chỉ còn ${100 - levelProgress}% nữa để đạt level ${stats.currentLevel + 1}.`,
        priority: 'medium',
        actionable: true,
        action: 'Kiếm thêm XP',
      });
    }

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    insights.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    await this.cacheManager.set(cacheKey, insights, this.CACHE_TTL);
    return insights;
  }

  // ==================== Comparison Analytics ====================

  async getComparisonStats(userId: string): Promise<{
    vsLastMonth: Record<string, number>;
    vsAllUsers: Record<string, number>;
    rank: number;
    totalUsers: number;
  }> {
    const stats = await this.userStatsRepo.findByUserId(userId);
    if (!stats) {
      return {
        vsLastMonth: {},
        vsAllUsers: {},
        rank: 0,
        totalUsers: 0,
      };
    }

    // Get last month stats
    const lastMonthStats = await this.getPreviousPeriodStats(userId, 30);

    // Calculate comparison to last month
    const vsLastMonth: Record<string, number> = {
      score: lastMonthStats 
        ? Math.round((stats.averageScore - lastMonthStats.averageScore) * 100) / 100
        : 0,
      studyHours: lastMonthStats 
        ? Math.round((stats.totalStudyMinutes - lastMonthStats.totalStudyMinutes) / 60)
        : 0,
      tests: lastMonthStats 
        ? stats.totalTestsCompleted - lastMonthStats.totalTestsCompleted
        : 0,
    };

    // Get rank among all users
    const rank = await this.userStatsRepo.count({
      where: {
        totalXp: MoreThanOrEqual(stats.totalXp),
      },
    });

    const totalUsers = await this.userStatsRepo.count();

    // Calculate percentiles vs all users
    const vsAllUsers: Record<string, number> = {
      score: await this.getPercentile('averageScore', stats.averageScore),
      xp: await this.getPercentile('totalXp', stats.totalXp),
      studyTime: await this.getPercentile('totalStudyMinutes', stats.totalStudyMinutes),
    };

    return {
      vsLastMonth,
      vsAllUsers,
      rank,
      totalUsers,
    };
  }

  private async getPercentile(field: string, value: number): Promise<number> {
    const lowerCount = await this.userStatsRepo
      .createQueryBuilder('stats')
      .where(`stats.${field} <= :value`, { value })
      .getCount();
    
    const totalCount = await this.userStatsRepo.count();
    
    return totalCount > 0 ? Math.round((lowerCount / totalCount) * 100) : 50;
  }

  // ==================== Activity Calendar ====================

  async getActivityCalendar(
    userId: string,
    year: number = new Date().getFullYear(),
  ): Promise<{
    data: { date: string; intensity: number; minutes: number }[];
    totalDays: number;
    activeDays: number;
    longestStreak: number;
  }> {
    const cacheKey = `calendar:${userId}:${year}`;
    const cached = await this.cacheManager.get<any>(cacheKey);
    if (cached) return cached;

    const dailyStats = await this.dailyStatsRepo.getCalendarData(userId, year);
    
    // Create map for quick lookup
    const statsMap = new Map<string, UserDailyStats>();
    dailyStats.forEach(stat => {
      statsMap.set(format(stat.date, 'yyyy-MM-dd'), stat);
    });

    // Generate all dates in year
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    const allDates = eachDayOfInterval({ start: startDate, end: endDate });

    const data = allDates.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const stat = statsMap.get(dateStr);
      
      let intensity = 0;
      if (stat) {
        if (stat.studyMinutes >= 90) intensity = 4;
        else if (stat.studyMinutes >= 45) intensity = 3;
        else if (stat.studyMinutes >= 15) intensity = 2;
        else if (stat.studyMinutes > 0) intensity = 1;
      }

      return {
        date: dateStr,
        intensity,
        minutes: stat?.studyMinutes || 0,
      };
    });

    // Calculate stats
    const activeDays = data.filter(d => d.intensity > 0).length;
    
    // Calculate longest streak
    let currentStreak = 0;
    let longestStreak = 0;
    for (const day of data) {
      if (day.intensity > 0) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    const result = {
      data,
      totalDays: allDates.length,
      activeDays,
      longestStreak,
    };

    await this.cacheManager.set(cacheKey, result, this.CACHE_TTL * 12); // Cache longer
    return result;
  }

  // ==================== Helper Methods ====================

  private async getPreviousPeriodStats(
    userId: string,
    daysAgo: number,
  ): Promise<UserStats | null> {
    // This would ideally use historical snapshots
    // For now, we'll approximate from daily stats
    const endDate = subDays(new Date(), daysAgo);
    const startDate = subDays(endDate, 30);
    
    const dailyStats = await this.dailyStatsRepo.getDateRange(userId, startDate, endDate);
    
    if (dailyStats.length === 0) return null;

    // Aggregate to create pseudo-historical stats
    const aggregated = {
      averageScore: 0,
      totalStudyMinutes: 0,
      totalTestsCompleted: 0,
      readingAverage: 0,
      listeningAverage: 0,
      writingAverage: 0,
      speakingAverage: 0,
    };

    let scoreCount = 0;
    for (const stat of dailyStats) {
      aggregated.totalStudyMinutes += stat.studyMinutes;
      aggregated.totalTestsCompleted += stat.testsCompleted;
      if (stat.averageScore) {
        aggregated.averageScore += stat.averageScore;
        scoreCount++;
      }
    }

    if (scoreCount > 0) {
      aggregated.averageScore /= scoreCount;
    }

    return aggregated as any;
  }

  // ==================== Clear Cache ====================

  async invalidateUserCache(userId: string): Promise<void> {
    const keys = [
      `score_trend:${userId}:*`,
      `skill_breakdown:${userId}`,
      `weekly_summary:${userId}:*`,
      `insights:${userId}`,
      `calendar:${userId}:*`,
    ];

    for (const pattern of keys) {
      await this.cacheManager.del(pattern);
    }
  }
}
```

### 2. Analytics Controller

```typescript
// src/modules/dashboard/controllers/analytics.controller.ts
import {
  Controller,
  Get,
  Query,
  UseGuards,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AnalyticsService } from '../services/analytics.service';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('score-trend')
  @ApiOperation({ summary: 'Get score trend over time' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  @ApiQuery({ 
    name: 'skill', 
    required: false, 
    enum: ['reading', 'listening', 'writing', 'speaking'] 
  })
  @ApiResponse({ status: 200, description: 'Score trend data' })
  async getScoreTrend(
    @CurrentUser('id') userId: string,
    @Query('days') days?: number,
    @Query('skill') skill?: 'reading' | 'listening' | 'writing' | 'speaking',
  ) {
    return this.analyticsService.getScoreTrend(userId, days || 30, skill);
  }

  @Get('skills')
  @ApiOperation({ summary: 'Get skill breakdown analysis' })
  @ApiResponse({ status: 200, description: 'Skill breakdown with strengths/weaknesses' })
  async getSkillBreakdown(@CurrentUser('id') userId: string) {
    return this.analyticsService.getSkillBreakdown(userId);
  }

  @Get('weekly-summary')
  @ApiOperation({ summary: 'Get weekly summary' })
  @ApiQuery({ name: 'weekOffset', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Weekly summary data' })
  async getWeeklySummary(
    @CurrentUser('id') userId: string,
    @Query('weekOffset') weekOffset?: number,
  ) {
    return this.analyticsService.getWeeklySummary(userId, weekOffset || 0);
  }

  @Get('insights')
  @ApiOperation({ summary: 'Get personalized performance insights' })
  @ApiResponse({ status: 200, description: 'Performance insights and recommendations' })
  async getInsights(@CurrentUser('id') userId: string) {
    return this.analyticsService.getPerformanceInsights(userId);
  }

  @Get('comparison')
  @ApiOperation({ summary: 'Get comparison stats vs other users' })
  @ApiResponse({ status: 200, description: 'Comparison analytics' })
  async getComparison(@CurrentUser('id') userId: string) {
    return this.analyticsService.getComparisonStats(userId);
  }

  @Get('calendar')
  @ApiOperation({ summary: 'Get activity calendar data' })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Calendar heatmap data' })
  async getCalendar(
    @CurrentUser('id') userId: string,
    @Query('year') year?: number,
  ) {
    return this.analyticsService.getActivityCalendar(
      userId,
      year || new Date().getFullYear(),
    );
  }
}
```

### 3. Analytics DTOs

```typescript
// src/modules/dashboard/dto/analytics.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ScoreTrendResponseDto {
  @ApiProperty({ type: [String] })
  dates: string[];

  @ApiProperty({ type: [Number] })
  scores: number[];

  @ApiProperty()
  average: number;

  @ApiProperty({ enum: ['improving', 'declining', 'stable'] })
  trend: string;

  @ApiProperty()
  changePercent: number;
}

export class SkillBreakdownResponseDto {
  @ApiProperty({ enum: ['reading', 'listening', 'writing', 'speaking'] })
  skill: string;

  @ApiProperty()
  currentScore: number;

  @ApiProperty()
  previousScore: number;

  @ApiProperty()
  change: number;

  @ApiProperty()
  isStrength: boolean;

  @ApiProperty()
  isWeakness: boolean;

  @ApiProperty()
  percentile: number;

  @ApiPropertyOptional()
  recommendation?: string;
}

export class WeeklySummaryResponseDto {
  @ApiProperty()
  weekStart: Date;

  @ApiProperty()
  weekEnd: Date;

  @ApiProperty()
  totalStudyMinutes: number;

  @ApiProperty()
  testsCompleted: number;

  @ApiProperty()
  practiceSessions: number;

  @ApiProperty()
  averageScore: number;

  @ApiProperty()
  xpEarned: number;

  @ApiProperty()
  streakDays: number;

  @ApiProperty()
  goalProgress: number;

  @ApiProperty()
  comparedToLastWeek: {
    studyMinutes: number;
    score: number;
    xp: number;
  };
}

export class PerformanceInsightResponseDto {
  @ApiProperty({ enum: ['strength', 'weakness', 'improvement', 'decline', 'recommendation'] })
  type: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: ['high', 'medium', 'low'] })
  priority: string;

  @ApiProperty()
  actionable: boolean;

  @ApiPropertyOptional()
  action?: string;
}

export class ComparisonStatsResponseDto {
  @ApiProperty()
  vsLastMonth: Record<string, number>;

  @ApiProperty()
  vsAllUsers: Record<string, number>;

  @ApiProperty()
  rank: number;

  @ApiProperty()
  totalUsers: number;
}

export class CalendarDataItemDto {
  @ApiProperty()
  date: string;

  @ApiProperty()
  intensity: number;

  @ApiProperty()
  minutes: number;
}

export class CalendarResponseDto {
  @ApiProperty({ type: [CalendarDataItemDto] })
  data: CalendarDataItemDto[];

  @ApiProperty()
  totalDays: number;

  @ApiProperty()
  activeDays: number;

  @ApiProperty()
  longestStreak: number;
}
```

### 4. Update Dashboard Module

```typescript
// src/modules/dashboard/dashboard.module.ts (updated)
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';

// Entities
import { UserStats } from './entities/user-stats.entity';
import { UserDailyStats } from './entities/user-daily-stats.entity';
import { XpTransaction } from './entities/xp-transaction.entity';

// External entities needed for analytics
import { ExamAttempt } from '../exams/entities/exam-attempt.entity';
import { PracticeSession } from '../practice/entities/practice-session.entity';

// Repositories
import { 
  UserStatsRepository, 
  UserDailyStatsRepository,
  XpTransactionRepository 
} from './repositories/user-stats.repository';

// Services
import { AnalyticsService } from './services/analytics.service';

// Controllers
import { AnalyticsController } from './controllers/analytics.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserStats, 
      UserDailyStats, 
      XpTransaction,
      ExamAttempt,
      PracticeSession,
    ]),
    CacheModule.register({
      ttl: 300, // 5 minutes default
      max: 1000,
    }),
  ],
  controllers: [AnalyticsController],
  providers: [
    UserStatsRepository,
    UserDailyStatsRepository,
    XpTransactionRepository,
    AnalyticsService,
  ],
  exports: [
    UserStatsRepository,
    UserDailyStatsRepository,
    XpTransactionRepository,
    AnalyticsService,
    TypeOrmModule,
  ],
})
export class DashboardModule {}
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analytics/score-trend` | Get score trend over time |
| GET | `/analytics/skills` | Get skill breakdown analysis |
| GET | `/analytics/weekly-summary` | Get weekly summary |
| GET | `/analytics/insights` | Get performance insights |
| GET | `/analytics/comparison` | Get comparison vs others |
| GET | `/analytics/calendar` | Get activity calendar data |

---

## Next Task

Continue with **BE-030: Progress Tracking Service** - Implement progress tracking and goal management.

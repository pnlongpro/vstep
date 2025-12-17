# Task: BE-031 - Activity Log Service

## Task Info

| Field | Value |
|-------|-------|
| **Task ID** | BE-031 |
| **Task Name** | Activity Log Service |
| **Module** | Dashboard & Analytics |
| **Sprint** | 07-08 |
| **Estimated Hours** | 4h |
| **Priority** | P0 (Critical) |
| **Dependencies** | None |

---

## Description

Implement activity logging service để:
- Ghi lại tất cả hoạt động học tập của user
- Hiển thị recent activity feed
- Hỗ trợ activity timeline
- Aggregate activities cho analytics

---

## Acceptance Criteria

- [ ] ActivityLog entity với các loại activity
- [ ] Log activities từ practice, exam, achievements
- [ ] Recent activity query với pagination
- [ ] Activity aggregation cho dashboard widgets
- [ ] Activity timeline cho profile page
- [ ] Cleanup old logs (retention policy)

---

## Implementation

### 1. Activity Log Entity

```typescript
// src/modules/dashboard/entities/activity-log.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ActivityType {
  // Practice activities
  PRACTICE_STARTED = 'practice_started',
  PRACTICE_COMPLETED = 'practice_completed',
  PRACTICE_ABANDONED = 'practice_abandoned',

  // Exam activities
  EXAM_STARTED = 'exam_started',
  EXAM_COMPLETED = 'exam_completed',
  EXAM_ABANDONED = 'exam_abandoned',

  // Score activities
  SCORE_IMPROVED = 'score_improved',
  NEW_HIGH_SCORE = 'new_high_score',
  SKILL_IMPROVED = 'skill_improved',

  // Achievement activities
  BADGE_EARNED = 'badge_earned',
  MILESTONE_REACHED = 'milestone_reached',
  LEVEL_UP = 'level_up',
  XP_EARNED = 'xp_earned',

  // Streak activities
  STREAK_STARTED = 'streak_started',
  STREAK_CONTINUED = 'streak_continued',
  STREAK_LOST = 'streak_lost',
  STREAK_MILESTONE = 'streak_milestone',

  // Goal activities
  GOAL_CREATED = 'goal_created',
  GOAL_PROGRESS = 'goal_progress',
  GOAL_COMPLETED = 'goal_completed',

  // Social activities
  CERTIFICATE_EARNED = 'certificate_earned',
  SHARED_RESULT = 'shared_result',

  // Learning activities
  FIRST_OF_DAY = 'first_of_day',
  DAILY_GOAL_MET = 'daily_goal_met',
  WEEKLY_GOAL_MET = 'weekly_goal_met',
}

export enum ActivityCategory {
  PRACTICE = 'practice',
  EXAM = 'exam',
  ACHIEVEMENT = 'achievement',
  STREAK = 'streak',
  GOAL = 'goal',
  SOCIAL = 'social',
  LEARNING = 'learning',
}

@Entity('activity_logs')
@Index(['userId', 'createdAt'])
@Index(['type', 'createdAt'])
@Index(['category', 'userId', 'createdAt'])
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  @Index()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: ActivityType })
  type: ActivityType;

  @Column({ type: 'enum', enum: ActivityCategory })
  category: ActivityCategory;

  // Display info
  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  icon: string;

  // Reference to related entity
  @Column({ name: 'reference_type', type: 'varchar', length: 50, nullable: true })
  referenceType: string; // 'practice_session', 'exam_attempt', 'achievement', etc.

  @Column({ name: 'reference_id', type: 'uuid', nullable: true })
  referenceId: string;

  // Skill context
  @Column({ type: 'varchar', length: 20, nullable: true })
  skill: string; // 'reading', 'listening', 'writing', 'speaking'

  // Score context
  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  score: number;

  // XP earned
  @Column({ name: 'xp_earned', type: 'int', default: 0 })
  xpEarned: number;

  // Duration in minutes
  @Column({ type: 'int', nullable: true })
  duration: number;

  // Additional metadata
  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  // Visibility
  @Column({ name: 'is_public', type: 'boolean', default: false })
  isPublic: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Computed
  get formattedDuration(): string | null {
    if (!this.duration) return null;
    const hours = Math.floor(this.duration / 60);
    const minutes = this.duration % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }
}
```

### 2. Activity Log Service

```typescript
// src/modules/dashboard/services/activity-log.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual, In } from 'typeorm';
import { ActivityLog, ActivityType, ActivityCategory } from '../entities/activity-log.entity';
import { 
  startOfDay, 
  endOfDay, 
  subDays, 
  format, 
  startOfWeek, 
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
} from 'date-fns';

export interface ActivitySummary {
  totalActivities: number;
  byCategory: Record<string, number>;
  byType: Record<string, number>;
  totalXpEarned: number;
  totalDuration: number;
}

export interface DailyActivitySummary {
  date: string;
  activities: number;
  xpEarned: number;
  duration: number;
  highlights: ActivityLog[];
}

export interface ActivityFeedItem {
  id: string;
  type: ActivityType;
  category: ActivityCategory;
  title: string;
  description: string | null;
  icon: string | null;
  skill: string | null;
  score: number | null;
  xpEarned: number;
  duration: string | null;
  timestamp: Date;
  relativeTime: string;
}

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityRepo: Repository<ActivityLog>,
  ) {}

  // ==================== Create Activity ====================

  async logActivity(data: {
    userId: string;
    type: ActivityType;
    title: string;
    description?: string;
    icon?: string;
    referenceType?: string;
    referenceId?: string;
    skill?: string;
    score?: number;
    xpEarned?: number;
    duration?: number;
    metadata?: Record<string, any>;
    isPublic?: boolean;
  }): Promise<ActivityLog> {
    const category = this.getCategoryForType(data.type);
    const icon = data.icon || this.getDefaultIcon(data.type);

    const activity = this.activityRepo.create({
      userId: data.userId,
      type: data.type,
      category,
      title: data.title,
      description: data.description,
      icon,
      referenceType: data.referenceType,
      referenceId: data.referenceId,
      skill: data.skill,
      score: data.score,
      xpEarned: data.xpEarned || 0,
      duration: data.duration,
      metadata: data.metadata,
      isPublic: data.isPublic || false,
    });

    return this.activityRepo.save(activity);
  }

  // ==================== Query Activities ====================

  async getRecentActivities(
    userId: string,
    options?: {
      limit?: number;
      offset?: number;
      category?: ActivityCategory;
      skill?: string;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<{ activities: ActivityLog[]; total: number }> {
    const limit = options?.limit || 20;
    const offset = options?.offset || 0;

    const query = this.activityRepo
      .createQueryBuilder('activity')
      .where('activity.userId = :userId', { userId })
      .orderBy('activity.createdAt', 'DESC')
      .skip(offset)
      .take(limit);

    if (options?.category) {
      query.andWhere('activity.category = :category', { category: options.category });
    }

    if (options?.skill) {
      query.andWhere('activity.skill = :skill', { skill: options.skill });
    }

    if (options?.startDate) {
      query.andWhere('activity.createdAt >= :startDate', { startDate: options.startDate });
    }

    if (options?.endDate) {
      query.andWhere('activity.createdAt <= :endDate', { endDate: options.endDate });
    }

    const [activities, total] = await query.getManyAndCount();
    return { activities, total };
  }

  async getActivityFeed(
    userId: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<ActivityFeedItem[]> {
    const { activities } = await this.getRecentActivities(userId, { limit, offset });
    
    return activities.map(activity => ({
      id: activity.id,
      type: activity.type,
      category: activity.category,
      title: activity.title,
      description: activity.description,
      icon: activity.icon,
      skill: activity.skill,
      score: activity.score,
      xpEarned: activity.xpEarned,
      duration: activity.formattedDuration,
      timestamp: activity.createdAt,
      relativeTime: this.getRelativeTime(activity.createdAt),
    }));
  }

  async getTodayActivities(userId: string): Promise<ActivityLog[]> {
    const today = new Date();
    return this.activityRepo.find({
      where: {
        userId,
        createdAt: Between(startOfDay(today), endOfDay(today)),
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getActivityTimeline(
    userId: string,
    days: number = 7,
  ): Promise<DailyActivitySummary[]> {
    const endDate = new Date();
    const startDate = subDays(endDate, days - 1);

    const activities = await this.activityRepo.find({
      where: {
        userId,
        createdAt: Between(startOfDay(startDate), endOfDay(endDate)),
      },
      order: { createdAt: 'DESC' },
    });

    // Generate all dates in range
    const dates = eachDayOfInterval({ start: startDate, end: endDate });
    
    const timeline: DailyActivitySummary[] = dates.map(date => {
      const dayActivities = activities.filter(a => 
        isSameDay(new Date(a.createdAt), date)
      );

      return {
        date: format(date, 'yyyy-MM-dd'),
        activities: dayActivities.length,
        xpEarned: dayActivities.reduce((sum, a) => sum + a.xpEarned, 0),
        duration: dayActivities.reduce((sum, a) => sum + (a.duration || 0), 0),
        highlights: dayActivities.slice(0, 3), // Top 3 activities
      };
    });

    return timeline.reverse();
  }

  // ==================== Summary & Analytics ====================

  async getActivitySummary(
    userId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<ActivitySummary> {
    const query = this.activityRepo
      .createQueryBuilder('activity')
      .where('activity.userId = :userId', { userId });

    if (startDate) {
      query.andWhere('activity.createdAt >= :startDate', { startDate });
    }
    if (endDate) {
      query.andWhere('activity.createdAt <= :endDate', { endDate });
    }

    const activities = await query.getMany();

    const byCategory: Record<string, number> = {};
    const byType: Record<string, number> = {};
    let totalXpEarned = 0;
    let totalDuration = 0;

    for (const activity of activities) {
      // Count by category
      byCategory[activity.category] = (byCategory[activity.category] || 0) + 1;
      
      // Count by type
      byType[activity.type] = (byType[activity.type] || 0) + 1;
      
      // Sum XP and duration
      totalXpEarned += activity.xpEarned;
      totalDuration += activity.duration || 0;
    }

    return {
      totalActivities: activities.length,
      byCategory,
      byType,
      totalXpEarned,
      totalDuration,
    };
  }

  async getWeeklySummary(userId: string): Promise<{
    thisWeek: ActivitySummary;
    lastWeek: ActivitySummary;
    comparison: Record<string, number>;
  }> {
    const now = new Date();
    
    const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
    const thisWeekEnd = endOfWeek(now, { weekStartsOn: 1 });
    
    const lastWeekStart = subDays(thisWeekStart, 7);
    const lastWeekEnd = subDays(thisWeekEnd, 7);

    const thisWeek = await this.getActivitySummary(userId, thisWeekStart, thisWeekEnd);
    const lastWeek = await this.getActivitySummary(userId, lastWeekStart, lastWeekEnd);

    const comparison = {
      activities: this.calculateChange(lastWeek.totalActivities, thisWeek.totalActivities),
      xp: this.calculateChange(lastWeek.totalXpEarned, thisWeek.totalXpEarned),
      duration: this.calculateChange(lastWeek.totalDuration, thisWeek.totalDuration),
    };

    return { thisWeek, lastWeek, comparison };
  }

  async getSkillDistribution(userId: string, days: number = 30): Promise<Record<string, number>> {
    const startDate = subDays(new Date(), days);
    
    const result = await this.activityRepo
      .createQueryBuilder('activity')
      .select('activity.skill', 'skill')
      .addSelect('SUM(activity.duration)', 'totalDuration')
      .where('activity.userId = :userId', { userId })
      .andWhere('activity.createdAt >= :startDate', { startDate })
      .andWhere('activity.skill IS NOT NULL')
      .groupBy('activity.skill')
      .getRawMany();

    const distribution: Record<string, number> = {
      reading: 0,
      listening: 0,
      writing: 0,
      speaking: 0,
    };

    for (const row of result) {
      if (row.skill && distribution.hasOwnProperty(row.skill)) {
        distribution[row.skill] = parseInt(row.totalDuration) || 0;
      }
    }

    return distribution;
  }

  // ==================== Cleanup ====================

  async cleanupOldActivities(daysToKeep: number = 365): Promise<number> {
    const cutoffDate = subDays(new Date(), daysToKeep);
    
    const result = await this.activityRepo
      .createQueryBuilder()
      .delete()
      .where('created_at < :cutoffDate', { cutoffDate })
      .execute();

    return result.affected || 0;
  }

  // ==================== Helpers ====================

  private getCategoryForType(type: ActivityType): ActivityCategory {
    const categoryMap: Record<ActivityType, ActivityCategory> = {
      [ActivityType.PRACTICE_STARTED]: ActivityCategory.PRACTICE,
      [ActivityType.PRACTICE_COMPLETED]: ActivityCategory.PRACTICE,
      [ActivityType.PRACTICE_ABANDONED]: ActivityCategory.PRACTICE,
      [ActivityType.EXAM_STARTED]: ActivityCategory.EXAM,
      [ActivityType.EXAM_COMPLETED]: ActivityCategory.EXAM,
      [ActivityType.EXAM_ABANDONED]: ActivityCategory.EXAM,
      [ActivityType.SCORE_IMPROVED]: ActivityCategory.ACHIEVEMENT,
      [ActivityType.NEW_HIGH_SCORE]: ActivityCategory.ACHIEVEMENT,
      [ActivityType.SKILL_IMPROVED]: ActivityCategory.ACHIEVEMENT,
      [ActivityType.BADGE_EARNED]: ActivityCategory.ACHIEVEMENT,
      [ActivityType.MILESTONE_REACHED]: ActivityCategory.ACHIEVEMENT,
      [ActivityType.LEVEL_UP]: ActivityCategory.ACHIEVEMENT,
      [ActivityType.XP_EARNED]: ActivityCategory.ACHIEVEMENT,
      [ActivityType.STREAK_STARTED]: ActivityCategory.STREAK,
      [ActivityType.STREAK_CONTINUED]: ActivityCategory.STREAK,
      [ActivityType.STREAK_LOST]: ActivityCategory.STREAK,
      [ActivityType.STREAK_MILESTONE]: ActivityCategory.STREAK,
      [ActivityType.GOAL_CREATED]: ActivityCategory.GOAL,
      [ActivityType.GOAL_PROGRESS]: ActivityCategory.GOAL,
      [ActivityType.GOAL_COMPLETED]: ActivityCategory.GOAL,
      [ActivityType.CERTIFICATE_EARNED]: ActivityCategory.SOCIAL,
      [ActivityType.SHARED_RESULT]: ActivityCategory.SOCIAL,
      [ActivityType.FIRST_OF_DAY]: ActivityCategory.LEARNING,
      [ActivityType.DAILY_GOAL_MET]: ActivityCategory.LEARNING,
      [ActivityType.WEEKLY_GOAL_MET]: ActivityCategory.LEARNING,
    };
    return categoryMap[type] || ActivityCategory.LEARNING;
  }

  private getDefaultIcon(type: ActivityType): string {
    const iconMap: Partial<Record<ActivityType, string>> = {
      [ActivityType.PRACTICE_COMPLETED]: '📝',
      [ActivityType.EXAM_COMPLETED]: '📋',
      [ActivityType.SCORE_IMPROVED]: '📈',
      [ActivityType.NEW_HIGH_SCORE]: '🏆',
      [ActivityType.BADGE_EARNED]: '🏅',
      [ActivityType.LEVEL_UP]: '⬆️',
      [ActivityType.XP_EARNED]: '✨',
      [ActivityType.STREAK_CONTINUED]: '🔥',
      [ActivityType.STREAK_MILESTONE]: '🔥',
      [ActivityType.GOAL_COMPLETED]: '🎯',
      [ActivityType.CERTIFICATE_EARNED]: '📜',
      [ActivityType.FIRST_OF_DAY]: '🌅',
      [ActivityType.DAILY_GOAL_MET]: '✅',
      [ActivityType.WEEKLY_GOAL_MET]: '🎉',
    };
    return iconMap[type] || '📌';
  }

  private getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    return format(date, 'dd/MM/yyyy');
  }

  private calculateChange(oldValue: number, newValue: number): number {
    if (oldValue === 0) return newValue > 0 ? 100 : 0;
    return Math.round(((newValue - oldValue) / oldValue) * 100);
  }
}
```

### 3. Activity Log Controller

```typescript
// src/modules/dashboard/controllers/activity.controller.ts
import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
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
import { ActivityLogService } from '../services/activity-log.service';
import { ActivityCategory } from '../entities/activity-log.entity';

@ApiTags('Activities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityLogService) {}

  @Get()
  @ApiOperation({ summary: 'Get recent activities' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'category', required: false, enum: ActivityCategory })
  @ApiQuery({ name: 'skill', required: false })
  async getActivities(
    @CurrentUser('id') userId: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('category') category?: ActivityCategory,
    @Query('skill') skill?: string,
  ) {
    return this.activityService.getRecentActivities(userId, {
      limit,
      offset,
      category,
      skill,
    });
  }

  @Get('feed')
  @ApiOperation({ summary: 'Get activity feed for display' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  async getFeed(
    @CurrentUser('id') userId: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    return this.activityService.getActivityFeed(userId, limit, offset);
  }

  @Get('today')
  @ApiOperation({ summary: 'Get today\'s activities' })
  async getTodayActivities(@CurrentUser('id') userId: string) {
    return this.activityService.getTodayActivities(userId);
  }

  @Get('timeline')
  @ApiOperation({ summary: 'Get activity timeline' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  async getTimeline(
    @CurrentUser('id') userId: string,
    @Query('days', new DefaultValuePipe(7), ParseIntPipe) days: number,
  ) {
    return this.activityService.getActivityTimeline(userId, days);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get activity summary' })
  async getSummary(@CurrentUser('id') userId: string) {
    return this.activityService.getActivitySummary(userId);
  }

  @Get('weekly')
  @ApiOperation({ summary: 'Get weekly comparison' })
  async getWeekly(@CurrentUser('id') userId: string) {
    return this.activityService.getWeeklySummary(userId);
  }

  @Get('skill-distribution')
  @ApiOperation({ summary: 'Get time distribution by skill' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  async getSkillDistribution(
    @CurrentUser('id') userId: string,
    @Query('days', new DefaultValuePipe(30), ParseIntPipe) days: number,
  ) {
    return this.activityService.getSkillDistribution(userId, days);
  }
}
```

### 4. Activity Event Listener

```typescript
// src/modules/dashboard/listeners/activity.listener.ts
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ActivityLogService } from '../services/activity-log.service';
import { ActivityType } from '../entities/activity-log.entity';

// Event interfaces
interface PracticeCompletedEvent {
  userId: string;
  sessionId: string;
  skill: string;
  score: number;
  duration: number;
  xpEarned: number;
}

interface ExamCompletedEvent {
  userId: string;
  attemptId: string;
  score: number;
  duration: number;
  xpEarned: number;
  isHighScore: boolean;
}

interface AchievementUnlockedEvent {
  userId: string;
  achievementId: string;
  name: string;
  xpReward: number;
}

interface LevelUpEvent {
  userId: string;
  oldLevel: number;
  newLevel: number;
  xpTotal: number;
}

interface StreakEvent {
  userId: string;
  streakDays: number;
  type: 'started' | 'continued' | 'lost' | 'milestone';
}

@Injectable()
export class ActivityListener {
  constructor(private readonly activityService: ActivityLogService) {}

  @OnEvent('practice.completed')
  async handlePracticeCompleted(event: PracticeCompletedEvent): Promise<void> {
    await this.activityService.logActivity({
      userId: event.userId,
      type: ActivityType.PRACTICE_COMPLETED,
      title: `Hoàn thành luyện tập ${this.capitalizeSkill(event.skill)}`,
      description: `Đạt ${event.score}/10 điểm trong ${Math.round(event.duration / 60)} phút`,
      referenceType: 'practice_session',
      referenceId: event.sessionId,
      skill: event.skill,
      score: event.score,
      xpEarned: event.xpEarned,
      duration: event.duration,
    });
  }

  @OnEvent('exam.completed')
  async handleExamCompleted(event: ExamCompletedEvent): Promise<void> {
    await this.activityService.logActivity({
      userId: event.userId,
      type: ActivityType.EXAM_COMPLETED,
      title: 'Hoàn thành bài thi Mock Test',
      description: `Đạt ${event.score}/10 điểm`,
      referenceType: 'exam_attempt',
      referenceId: event.attemptId,
      score: event.score,
      xpEarned: event.xpEarned,
      duration: event.duration,
    });

    // Log high score if applicable
    if (event.isHighScore) {
      await this.activityService.logActivity({
        userId: event.userId,
        type: ActivityType.NEW_HIGH_SCORE,
        title: 'Điểm cao mới! 🎉',
        description: `Kỷ lục mới: ${event.score}/10 điểm`,
        referenceType: 'exam_attempt',
        referenceId: event.attemptId,
        score: event.score,
      });
    }
  }

  @OnEvent('achievement.unlocked')
  async handleAchievementUnlocked(event: AchievementUnlockedEvent): Promise<void> {
    await this.activityService.logActivity({
      userId: event.userId,
      type: ActivityType.BADGE_EARNED,
      title: `Đạt huy hiệu: ${event.name}`,
      referenceType: 'achievement',
      referenceId: event.achievementId,
      xpEarned: event.xpReward,
      isPublic: true,
    });
  }

  @OnEvent('user.levelUp')
  async handleLevelUp(event: LevelUpEvent): Promise<void> {
    await this.activityService.logActivity({
      userId: event.userId,
      type: ActivityType.LEVEL_UP,
      title: `Lên Level ${event.newLevel}! 🚀`,
      description: `Tổng XP: ${event.xpTotal}`,
      metadata: {
        oldLevel: event.oldLevel,
        newLevel: event.newLevel,
      },
      isPublic: true,
    });
  }

  @OnEvent('streak.update')
  async handleStreakUpdate(event: StreakEvent): Promise<void> {
    let type: ActivityType;
    let title: string;
    let description = '';

    switch (event.type) {
      case 'started':
        type = ActivityType.STREAK_STARTED;
        title = 'Bắt đầu streak mới! 🔥';
        break;
      case 'continued':
        type = ActivityType.STREAK_CONTINUED;
        title = `Streak ${event.streakDays} ngày! 🔥`;
        description = 'Tiếp tục duy trì nào!';
        break;
      case 'lost':
        type = ActivityType.STREAK_LOST;
        title = 'Streak đã reset 😢';
        description = 'Đừng nản, bắt đầu lại thôi!';
        break;
      case 'milestone':
        type = ActivityType.STREAK_MILESTONE;
        title = `Streak ${event.streakDays} ngày! 🔥🔥🔥`;
        description = 'Thành tích đáng ngưỡng mộ!';
        break;
    }

    await this.activityService.logActivity({
      userId: event.userId,
      type,
      title,
      description,
      metadata: { streakDays: event.streakDays },
      isPublic: event.type === 'milestone',
    });
  }

  @OnEvent('goal.completed')
  async handleGoalCompleted(event: { userId: string; goalId: string; goalTitle: string }): Promise<void> {
    await this.activityService.logActivity({
      userId: event.userId,
      type: ActivityType.GOAL_COMPLETED,
      title: `Hoàn thành mục tiêu: ${event.goalTitle}`,
      referenceType: 'goal',
      referenceId: event.goalId,
      isPublic: true,
    });
  }

  @OnEvent('certificate.earned')
  async handleCertificateEarned(event: { userId: string; certificateId: string; level: string }): Promise<void> {
    await this.activityService.logActivity({
      userId: event.userId,
      type: ActivityType.CERTIFICATE_EARNED,
      title: `Nhận chứng chỉ VSTEP ${event.level}! 📜`,
      referenceType: 'certificate',
      referenceId: event.certificateId,
      isPublic: true,
    });
  }

  @OnEvent('daily.firstActivity')
  async handleFirstOfDay(event: { userId: string }): Promise<void> {
    await this.activityService.logActivity({
      userId: event.userId,
      type: ActivityType.FIRST_OF_DAY,
      title: 'Hoạt động đầu tiên hôm nay! 🌅',
      description: 'Chúc bạn học tập hiệu quả!',
    });
  }

  private capitalizeSkill(skill: string): string {
    return skill.charAt(0).toUpperCase() + skill.slice(1);
  }
}
```

### 5. Activity DTOs

```typescript
// src/modules/dashboard/dto/activity.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ActivityType, ActivityCategory } from '../entities/activity-log.entity';

export class ActivityLogResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: ActivityType })
  type: ActivityType;

  @ApiProperty({ enum: ActivityCategory })
  category: ActivityCategory;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  icon?: string;

  @ApiPropertyOptional()
  skill?: string;

  @ApiPropertyOptional()
  score?: number;

  @ApiProperty()
  xpEarned: number;

  @ApiPropertyOptional()
  duration?: number;

  @ApiProperty()
  createdAt: Date;
}

export class ActivityFeedResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  icon?: string;

  @ApiPropertyOptional()
  skill?: string;

  @ApiPropertyOptional()
  score?: number;

  @ApiProperty()
  xpEarned: number;

  @ApiPropertyOptional()
  duration?: string;

  @ApiProperty()
  timestamp: Date;

  @ApiProperty()
  relativeTime: string;
}

export class ActivitySummaryResponseDto {
  @ApiProperty()
  totalActivities: number;

  @ApiProperty()
  byCategory: Record<string, number>;

  @ApiProperty()
  byType: Record<string, number>;

  @ApiProperty()
  totalXpEarned: number;

  @ApiProperty()
  totalDuration: number;
}

export class DailyActivitySummaryDto {
  @ApiProperty()
  date: string;

  @ApiProperty()
  activities: number;

  @ApiProperty()
  xpEarned: number;

  @ApiProperty()
  duration: number;

  @ApiProperty({ type: [ActivityLogResponseDto] })
  highlights: ActivityLogResponseDto[];
}

export class WeeklyComparisonDto {
  @ApiProperty()
  thisWeek: ActivitySummaryResponseDto;

  @ApiProperty()
  lastWeek: ActivitySummaryResponseDto;

  @ApiProperty()
  comparison: {
    activities: number;
    xp: number;
    duration: number;
  };
}
```

### 6. Migration

```typescript
// src/migrations/XXXXXX-CreateActivityLogsTable.ts
import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateActivityLogsTable1700000008000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'activity_logs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'user_id', type: 'uuid' },
          { 
            name: 'type', 
            type: 'enum',
            enum: [
              'practice_started', 'practice_completed', 'practice_abandoned',
              'exam_started', 'exam_completed', 'exam_abandoned',
              'score_improved', 'new_high_score', 'skill_improved',
              'badge_earned', 'milestone_reached', 'level_up', 'xp_earned',
              'streak_started', 'streak_continued', 'streak_lost', 'streak_milestone',
              'goal_created', 'goal_progress', 'goal_completed',
              'certificate_earned', 'shared_result',
              'first_of_day', 'daily_goal_met', 'weekly_goal_met',
            ],
          },
          {
            name: 'category',
            type: 'enum',
            enum: ['practice', 'exam', 'achievement', 'streak', 'goal', 'social', 'learning'],
          },
          { name: 'title', type: 'varchar', length: '200' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'icon', type: 'varchar', length: '100', isNullable: true },
          { name: 'reference_type', type: 'varchar', length: '50', isNullable: true },
          { name: 'reference_id', type: 'uuid', isNullable: true },
          { name: 'skill', type: 'varchar', length: '20', isNullable: true },
          { name: 'score', type: 'decimal', precision: 4, scale: 2, isNullable: true },
          { name: 'xp_earned', type: 'int', default: 0 },
          { name: 'duration', type: 'int', isNullable: true },
          { name: 'metadata', type: 'json', isNullable: true },
          { name: 'is_public', type: 'boolean', default: false },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'activity_logs',
      new TableIndex({
        name: 'IDX_activity_logs_user_created',
        columnNames: ['user_id', 'created_at'],
      }),
    );

    await queryRunner.createIndex(
      'activity_logs',
      new TableIndex({
        name: 'IDX_activity_logs_type_created',
        columnNames: ['type', 'created_at'],
      }),
    );

    await queryRunner.createIndex(
      'activity_logs',
      new TableIndex({
        name: 'IDX_activity_logs_category_user_created',
        columnNames: ['category', 'user_id', 'created_at'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('activity_logs');
  }
}
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/activities` | Get recent activities |
| GET | `/activities/feed` | Get activity feed for display |
| GET | `/activities/today` | Get today's activities |
| GET | `/activities/timeline` | Get activity timeline |
| GET | `/activities/summary` | Get activity summary |
| GET | `/activities/weekly` | Get weekly comparison |
| GET | `/activities/skill-distribution` | Get time by skill |

---

## Next Task

Continue with **BE-032: Achievement Service** - Implement achievements and badges system.

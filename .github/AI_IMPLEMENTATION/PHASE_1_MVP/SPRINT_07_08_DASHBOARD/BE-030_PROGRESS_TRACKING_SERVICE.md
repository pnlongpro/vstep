# Task: BE-030 - Progress Tracking Service

## Task Info

| Field | Value |
|-------|-------|
| **Task ID** | BE-030 |
| **Task Name** | Progress Tracking Service |
| **Module** | Dashboard & Analytics |
| **Sprint** | 07-08 |
| **Estimated Hours** | 6h |
| **Priority** | P0 (Critical) |
| **Dependencies** | BE-029 |

---

## Description

Implement progress tracking service để:
- Track học tập theo thời gian thực
- Quản lý goals (mục tiêu học tập)
- Tính toán progress theo level VSTEP
- Estimated time to reach target level

---

## Acceptance Criteria

- [ ] Progress tracking cho từng skill và overall
- [ ] Goal management (set, update, track)
- [ ] Level progression calculation
- [ ] Estimated time to target calculation
- [ ] Progress milestones và celebrations
- [ ] Auto-update khi hoàn thành activities

---

## Implementation

### 1. User Goals Entity

```typescript
// src/modules/dashboard/entities/user-goal.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum GoalType {
  VSTEP_LEVEL = 'vstep_level',
  WEEKLY_HOURS = 'weekly_hours',
  DAILY_STREAK = 'daily_streak',
  SKILL_SCORE = 'skill_score',
  TESTS_COMPLETE = 'tests_complete',
  CUSTOM = 'custom',
}

export enum GoalStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

@Entity('user_goals')
@Index(['userId', 'status'])
@Index(['type', 'status'])
export class UserGoal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  @Index()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: GoalType })
  type: GoalType;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Target values
  @Column({ name: 'target_value', type: 'decimal', precision: 10, scale: 2 })
  targetValue: number;

  @Column({ name: 'current_value', type: 'decimal', precision: 10, scale: 2, default: 0 })
  currentValue: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  unit: string; // 'hours', 'score', 'days', 'tests'

  // For skill-specific goals
  @Column({ type: 'varchar', length: 20, nullable: true })
  skill: string; // 'reading', 'listening', 'writing', 'speaking'

  // Timeline
  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'target_date', type: 'date', nullable: true })
  targetDate: Date;

  @Column({ name: 'completed_date', type: 'date', nullable: true })
  completedDate: Date;

  @Column({ type: 'enum', enum: GoalStatus, default: GoalStatus.ACTIVE })
  status: GoalStatus;

  // Progress tracking
  @Column({ name: 'progress_percent', type: 'int', default: 0 })
  progressPercent: number;

  @Column({ name: 'last_updated', type: 'timestamp', nullable: true })
  lastUpdated: Date;

  // Reminders & notifications
  @Column({ name: 'reminder_enabled', type: 'boolean', default: true })
  reminderEnabled: boolean;

  @Column({ name: 'reminder_time', type: 'time', nullable: true })
  reminderTime: string;

  // Metadata
  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Computed
  get isCompleted(): boolean {
    return this.currentValue >= this.targetValue;
  }

  get daysRemaining(): number | null {
    if (!this.targetDate) return null;
    const now = new Date();
    const target = new Date(this.targetDate);
    const diff = target.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}
```

### 2. Progress Milestone Entity

```typescript
// src/modules/dashboard/entities/progress-milestone.entity.ts
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

export enum MilestoneType {
  // VSTEP Level milestones
  REACHED_A2 = 'reached_a2',
  REACHED_B1 = 'reached_b1',
  REACHED_B2 = 'reached_b2',
  REACHED_C1 = 'reached_c1',

  // Study milestones
  FIRST_TEST = 'first_test',
  FIRST_100_QUESTIONS = 'first_100_questions',
  FIRST_1000_QUESTIONS = 'first_1000_questions',
  FIRST_10_HOURS = 'first_10_hours',
  FIRST_50_HOURS = 'first_50_hours',
  FIRST_100_HOURS = 'first_100_hours',

  // Streak milestones
  STREAK_7_DAYS = 'streak_7_days',
  STREAK_30_DAYS = 'streak_30_days',
  STREAK_100_DAYS = 'streak_100_days',

  // Score milestones
  SCORE_6_OVERALL = 'score_6_overall',
  SCORE_7_OVERALL = 'score_7_overall',
  SCORE_8_OVERALL = 'score_8_overall',
  PERFECT_READING = 'perfect_reading',
  PERFECT_LISTENING = 'perfect_listening',

  // Skill improvement
  IMPROVED_1_POINT = 'improved_1_point',
  IMPROVED_2_POINTS = 'improved_2_points',

  // Goal milestones
  GOAL_COMPLETED = 'goal_completed',
  WEEKLY_GOAL_MET = 'weekly_goal_met',
}

@Entity('progress_milestones')
@Index(['userId', 'type'], { unique: true })
@Index(['achievedAt'])
export class ProgressMilestone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  @Index()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: MilestoneType })
  type: MilestoneType;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  icon: string;

  @Column({ name: 'xp_reward', type: 'int', default: 0 })
  xpReward: number;

  @Column({ name: 'achieved_at', type: 'timestamp' })
  achievedAt: Date;

  // Related data at time of achievement
  @Column({ type: 'json', nullable: true })
  snapshot: Record<string, any>;

  @Column({ name: 'celebration_shown', type: 'boolean', default: false })
  celebrationShown: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
```

### 3. Progress Tracking Service

```typescript
// src/modules/dashboard/services/progress-tracking.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { UserGoal, GoalType, GoalStatus } from '../entities/user-goal.entity';
import { ProgressMilestone, MilestoneType } from '../entities/progress-milestone.entity';
import { UserStatsRepository, UserDailyStatsRepository } from '../repositories/user-stats.repository';
import { UserStats } from '../entities/user-stats.entity';
import { XpService } from './xp.service';
import { differenceInDays, addDays, format, startOfDay } from 'date-fns';

export interface ProgressSnapshot {
  overall: SkillProgress;
  reading: SkillProgress;
  listening: SkillProgress;
  writing: SkillProgress;
  speaking: SkillProgress;
}

export interface SkillProgress {
  currentLevel: string;
  currentScore: number;
  targetLevel: string;
  targetScore: number;
  progress: number; // 0-100
  estimatedDaysToTarget: number | null;
  trend: 'up' | 'down' | 'stable';
}

export interface GoalProgress {
  goal: UserGoal;
  progressPercent: number;
  remainingValue: number;
  estimatedCompletion: Date | null;
  onTrack: boolean;
  message: string;
}

@Injectable()
export class ProgressTrackingService {
  // VSTEP level thresholds
  private readonly LEVEL_THRESHOLDS: Record<string, number> = {
    A1: 0,
    A2: 3.0,
    B1: 4.5,
    B2: 6.5,
    C1: 8.5,
  };

  // Average score improvement per study hour (based on data)
  private readonly SCORE_IMPROVEMENT_RATE = 0.01; // 0.01 points per hour

  constructor(
    @InjectRepository(UserGoal)
    private readonly goalRepo: Repository<UserGoal>,
    @InjectRepository(ProgressMilestone)
    private readonly milestoneRepo: Repository<ProgressMilestone>,
    private readonly userStatsRepo: UserStatsRepository,
    private readonly dailyStatsRepo: UserDailyStatsRepository,
    private readonly xpService: XpService,
  ) {}

  // ==================== Progress Overview ====================

  async getProgressSnapshot(userId: string): Promise<ProgressSnapshot> {
    const stats = await this.userStatsRepo.findByUserId(userId);
    
    if (!stats) {
      return this.getEmptyProgressSnapshot();
    }

    const targetLevel = stats.targetVstepLevel || this.getNextLevel(stats.currentVstepLevel);

    return {
      overall: await this.calculateSkillProgress(
        userId,
        stats.averageScore,
        stats.currentVstepLevel,
        targetLevel,
        'overall',
      ),
      reading: await this.calculateSkillProgress(
        userId,
        stats.readingAverage,
        this.getScoreLevel(stats.readingAverage),
        targetLevel,
        'reading',
      ),
      listening: await this.calculateSkillProgress(
        userId,
        stats.listeningAverage,
        this.getScoreLevel(stats.listeningAverage),
        targetLevel,
        'listening',
      ),
      writing: await this.calculateSkillProgress(
        userId,
        stats.writingAverage,
        this.getScoreLevel(stats.writingAverage),
        targetLevel,
        'writing',
      ),
      speaking: await this.calculateSkillProgress(
        userId,
        stats.speakingAverage,
        this.getScoreLevel(stats.speakingAverage),
        targetLevel,
        'speaking',
      ),
    };
  }

  private async calculateSkillProgress(
    userId: string,
    currentScore: number,
    currentLevel: string,
    targetLevel: string,
    skill: string,
  ): Promise<SkillProgress> {
    const targetScore = this.LEVEL_THRESHOLDS[targetLevel] || 6.5;
    const startScore = this.LEVEL_THRESHOLDS[currentLevel] || 0;
    
    // Calculate progress percentage
    const totalRange = targetScore - startScore;
    const achieved = currentScore - startScore;
    const progress = totalRange > 0 ? Math.min(100, Math.max(0, (achieved / totalRange) * 100)) : 0;

    // Calculate estimated days to target
    const estimatedDays = await this.estimateDaysToTarget(userId, currentScore, targetScore);

    // Calculate trend
    const trend = await this.calculateTrend(userId, skill);

    return {
      currentLevel: currentLevel || 'A1',
      currentScore: Math.round(currentScore * 100) / 100,
      targetLevel,
      targetScore,
      progress: Math.round(progress),
      estimatedDaysToTarget: estimatedDays,
      trend,
    };
  }

  private async estimateDaysToTarget(
    userId: string,
    currentScore: number,
    targetScore: number,
  ): Promise<number | null> {
    if (currentScore >= targetScore) return 0;

    // Get average daily study time
    const recentStats = await this.dailyStatsRepo.getRecentDays(userId, 30);
    
    if (recentStats.length === 0) return null;

    const avgDailyMinutes = recentStats.reduce((sum, s) => sum + s.studyMinutes, 0) / recentStats.length;
    
    if (avgDailyMinutes === 0) return null;

    // Calculate score gap
    const scoreGap = targetScore - currentScore;
    
    // Estimate hours needed
    const hoursNeeded = scoreGap / this.SCORE_IMPROVEMENT_RATE;
    
    // Calculate days based on current study rate
    const daysNeeded = (hoursNeeded * 60) / avgDailyMinutes;
    
    return Math.ceil(daysNeeded);
  }

  private async calculateTrend(
    userId: string,
    skill: string,
  ): Promise<'up' | 'down' | 'stable'> {
    const recentStats = await this.dailyStatsRepo.getRecentDays(userId, 14);
    
    if (recentStats.length < 7) return 'stable';

    const firstHalf = recentStats.slice(0, 7);
    const secondHalf = recentStats.slice(7);

    const firstAvg = firstHalf.reduce((sum, s) => sum + (s.averageScore || 0), 0) / 7;
    const secondAvg = secondHalf.reduce((sum, s) => sum + (s.averageScore || 0), 0) / Math.min(7, secondHalf.length);

    const diff = secondAvg - firstAvg;
    
    if (diff > 0.2) return 'up';
    if (diff < -0.2) return 'down';
    return 'stable';
  }

  // ==================== Goal Management ====================

  async createGoal(
    userId: string,
    data: {
      type: GoalType;
      title: string;
      description?: string;
      targetValue: number;
      unit?: string;
      skill?: string;
      targetDate?: Date;
      reminderEnabled?: boolean;
      reminderTime?: string;
    },
  ): Promise<UserGoal> {
    // Check for duplicate active goals of same type
    const existing = await this.goalRepo.findOne({
      where: {
        userId,
        type: data.type,
        status: GoalStatus.ACTIVE,
        skill: data.skill || null,
      },
    });

    if (existing) {
      throw new BadRequestException('Active goal of this type already exists');
    }

    const goal = this.goalRepo.create({
      userId,
      type: data.type,
      title: data.title,
      description: data.description,
      targetValue: data.targetValue,
      currentValue: await this.getCurrentValueForGoal(userId, data.type, data.skill),
      unit: data.unit || this.getDefaultUnit(data.type),
      skill: data.skill,
      startDate: new Date(),
      targetDate: data.targetDate,
      reminderEnabled: data.reminderEnabled ?? true,
      reminderTime: data.reminderTime,
    });

    await this.goalRepo.save(goal);
    await this.updateGoalProgress(goal);

    return goal;
  }

  async updateGoal(
    userId: string,
    goalId: string,
    data: Partial<{
      title: string;
      description: string;
      targetValue: number;
      targetDate: Date;
      reminderEnabled: boolean;
      reminderTime: string;
    }>,
  ): Promise<UserGoal> {
    const goal = await this.goalRepo.findOne({
      where: { id: goalId, userId },
    });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    if (goal.status !== GoalStatus.ACTIVE) {
      throw new BadRequestException('Cannot update completed or cancelled goal');
    }

    Object.assign(goal, data);
    await this.goalRepo.save(goal);
    await this.updateGoalProgress(goal);

    return goal;
  }

  async cancelGoal(userId: string, goalId: string): Promise<void> {
    const goal = await this.goalRepo.findOne({
      where: { id: goalId, userId },
    });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    goal.status = GoalStatus.CANCELLED;
    await this.goalRepo.save(goal);
  }

  async getActiveGoals(userId: string): Promise<GoalProgress[]> {
    const goals = await this.goalRepo.find({
      where: { userId, status: GoalStatus.ACTIVE },
      order: { targetDate: 'ASC' },
    });

    const progressList: GoalProgress[] = [];

    for (const goal of goals) {
      await this.updateGoalProgress(goal);
      
      const progressPercent = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
      const remainingValue = Math.max(0, goal.targetValue - goal.currentValue);
      
      // Estimate completion
      let estimatedCompletion: Date | null = null;
      let onTrack = true;
      let message = '';

      if (goal.targetDate) {
        const daysRemaining = goal.daysRemaining!;
        const dailyRequired = remainingValue / Math.max(1, daysRemaining);
        
        // Get average daily progress
        const avgDaily = await this.getAverageDailyProgress(userId, goal.type, goal.skill);
        
        if (avgDaily >= dailyRequired) {
          estimatedCompletion = goal.targetDate;
          message = 'Bạn đang đúng tiến độ!';
        } else if (avgDaily > 0) {
          const daysNeeded = remainingValue / avgDaily;
          estimatedCompletion = addDays(new Date(), Math.ceil(daysNeeded));
          onTrack = false;
          message = `Cần tăng tốc! Dự kiến hoàn thành: ${format(estimatedCompletion, 'dd/MM/yyyy')}`;
        } else {
          onTrack = false;
          message = 'Hãy bắt đầu ngay hôm nay!';
        }
      } else {
        message = `Còn ${remainingValue} ${goal.unit} để đạt mục tiêu`;
      }

      progressList.push({
        goal,
        progressPercent,
        remainingValue,
        estimatedCompletion,
        onTrack,
        message,
      });
    }

    return progressList;
  }

  async getCompletedGoals(userId: string, limit: number = 10): Promise<UserGoal[]> {
    return this.goalRepo.find({
      where: { userId, status: GoalStatus.COMPLETED },
      order: { completedDate: 'DESC' },
      take: limit,
    });
  }

  private async updateGoalProgress(goal: UserGoal): Promise<void> {
    const currentValue = await this.getCurrentValueForGoal(goal.userId, goal.type, goal.skill);
    goal.currentValue = currentValue;
    goal.progressPercent = Math.min(100, Math.round((currentValue / goal.targetValue) * 100));
    goal.lastUpdated = new Date();

    // Check if completed
    if (currentValue >= goal.targetValue && goal.status === GoalStatus.ACTIVE) {
      goal.status = GoalStatus.COMPLETED;
      goal.completedDate = new Date();
      
      // Award XP for completing goal
      await this.xpService.awardXp(goal.userId, 50, 'goal_completed', {
        referenceType: 'goal',
        referenceId: goal.id,
        description: `Hoàn thành mục tiêu: ${goal.title}`,
      });

      // Create milestone
      await this.createMilestone(goal.userId, MilestoneType.GOAL_COMPLETED, {
        title: `Hoàn thành: ${goal.title}`,
        description: `Đã đạt ${goal.targetValue} ${goal.unit}`,
        xpReward: 50,
        snapshot: { goal },
      });
    }

    // Check if expired
    if (goal.targetDate && new Date() > goal.targetDate && goal.status === GoalStatus.ACTIVE) {
      goal.status = GoalStatus.EXPIRED;
    }

    await this.goalRepo.save(goal);
  }

  private async getCurrentValueForGoal(
    userId: string,
    type: GoalType,
    skill?: string,
  ): Promise<number> {
    const stats = await this.userStatsRepo.findByUserId(userId);
    if (!stats) return 0;

    switch (type) {
      case GoalType.VSTEP_LEVEL:
        const levelScores: Record<string, number> = {
          A1: 1, A2: 2, B1: 3, B2: 4, C1: 5,
        };
        return levelScores[stats.currentVstepLevel] || 0;

      case GoalType.WEEKLY_HOURS:
        const weeklyStats = await this.dailyStatsRepo.getRecentDays(userId, 7);
        return weeklyStats.reduce((sum, s) => sum + s.studyMinutes, 0) / 60;

      case GoalType.DAILY_STREAK:
        return stats.currentStreak;

      case GoalType.SKILL_SCORE:
        if (skill) {
          return stats[`${skill}Average`] || 0;
        }
        return stats.averageScore;

      case GoalType.TESTS_COMPLETE:
        return stats.totalTestsCompleted;

      default:
        return 0;
    }
  }

  private async getAverageDailyProgress(
    userId: string,
    type: GoalType,
    skill?: string,
  ): Promise<number> {
    const recentStats = await this.dailyStatsRepo.getRecentDays(userId, 7);
    if (recentStats.length === 0) return 0;

    switch (type) {
      case GoalType.WEEKLY_HOURS:
        return recentStats.reduce((sum, s) => sum + s.studyMinutes, 0) / (7 * 60);

      case GoalType.TESTS_COMPLETE:
        return recentStats.reduce((sum, s) => sum + s.testsCompleted, 0) / 7;

      case GoalType.SKILL_SCORE:
        const scores = recentStats.filter(s => s.averageScore).map(s => s.averageScore!);
        if (scores.length < 2) return 0;
        return (scores[scores.length - 1] - scores[0]) / scores.length;

      default:
        return 0;
    }
  }

  private getDefaultUnit(type: GoalType): string {
    switch (type) {
      case GoalType.WEEKLY_HOURS:
        return 'giờ';
      case GoalType.DAILY_STREAK:
        return 'ngày';
      case GoalType.SKILL_SCORE:
      case GoalType.VSTEP_LEVEL:
        return 'điểm';
      case GoalType.TESTS_COMPLETE:
        return 'bài';
      default:
        return '';
    }
  }

  // ==================== Milestone Management ====================

  async createMilestone(
    userId: string,
    type: MilestoneType,
    data: {
      title: string;
      description?: string;
      icon?: string;
      xpReward?: number;
      snapshot?: Record<string, any>;
    },
  ): Promise<ProgressMilestone | null> {
    // Check if already achieved
    const existing = await this.milestoneRepo.findOne({
      where: { userId, type },
    });

    if (existing) return null;

    const milestone = this.milestoneRepo.create({
      userId,
      type,
      title: data.title,
      description: data.description,
      icon: data.icon || this.getMilestoneIcon(type),
      xpReward: data.xpReward || this.getMilestoneXp(type),
      achievedAt: new Date(),
      snapshot: data.snapshot,
    });

    await this.milestoneRepo.save(milestone);

    // Award XP if specified
    if (milestone.xpReward > 0) {
      await this.xpService.awardXp(userId, milestone.xpReward, 'achievement_unlock', {
        referenceType: 'milestone',
        referenceId: milestone.id,
        description: milestone.title,
      });
    }

    return milestone;
  }

  async getMilestones(userId: string): Promise<ProgressMilestone[]> {
    return this.milestoneRepo.find({
      where: { userId },
      order: { achievedAt: 'DESC' },
    });
  }

  async getUnseenMilestones(userId: string): Promise<ProgressMilestone[]> {
    return this.milestoneRepo.find({
      where: { userId, celebrationShown: false },
      order: { achievedAt: 'DESC' },
    });
  }

  async markMilestoneSeen(userId: string, milestoneId: string): Promise<void> {
    await this.milestoneRepo.update(
      { id: milestoneId, userId },
      { celebrationShown: true },
    );
  }

  async checkAndAwardMilestones(userId: string): Promise<ProgressMilestone[]> {
    const stats = await this.userStatsRepo.findByUserId(userId);
    if (!stats) return [];

    const awarded: ProgressMilestone[] = [];

    // Check various milestone conditions
    const checks: Array<{ type: MilestoneType; condition: boolean; title: string; description: string }> = [
      // Study time milestones
      {
        type: MilestoneType.FIRST_10_HOURS,
        condition: stats.totalStudyMinutes >= 600,
        title: '10 giờ học tập đầu tiên',
        description: 'Bạn đã dành 10 giờ để học tập!',
      },
      {
        type: MilestoneType.FIRST_50_HOURS,
        condition: stats.totalStudyMinutes >= 3000,
        title: '50 giờ học tập',
        description: 'Kiên trì đáng ngưỡng mộ - 50 giờ!',
      },
      {
        type: MilestoneType.FIRST_100_HOURS,
        condition: stats.totalStudyMinutes >= 6000,
        title: '100 giờ học tập',
        description: 'Bạn là chiến binh thực sự với 100 giờ học!',
      },

      // Streak milestones
      {
        type: MilestoneType.STREAK_7_DAYS,
        condition: stats.longestStreak >= 7,
        title: 'Streak 7 ngày',
        description: 'Một tuần kiên trì không ngừng!',
      },
      {
        type: MilestoneType.STREAK_30_DAYS,
        condition: stats.longestStreak >= 30,
        title: 'Streak 30 ngày',
        description: 'Một tháng học tập liên tục!',
      },
      {
        type: MilestoneType.STREAK_100_DAYS,
        condition: stats.longestStreak >= 100,
        title: 'Streak 100 ngày',
        description: 'Huyền thoại 100 ngày!',
      },

      // Level milestones
      {
        type: MilestoneType.REACHED_B1,
        condition: stats.averageScore >= 4.5,
        title: 'Đạt trình độ B1',
        description: 'Chúc mừng bạn đã đạt B1!',
      },
      {
        type: MilestoneType.REACHED_B2,
        condition: stats.averageScore >= 6.5,
        title: 'Đạt trình độ B2',
        description: 'Xuất sắc! Bạn đã đạt B2!',
      },
      {
        type: MilestoneType.REACHED_C1,
        condition: stats.averageScore >= 8.5,
        title: 'Đạt trình độ C1',
        description: 'Tuyệt vời! Trình độ C1!',
      },

      // Score milestones
      {
        type: MilestoneType.SCORE_6_OVERALL,
        condition: stats.highestScore >= 6.0,
        title: 'Điểm 6 Overall',
        description: 'Lần đầu đạt 6 điểm!',
      },
      {
        type: MilestoneType.SCORE_7_OVERALL,
        condition: stats.highestScore >= 7.0,
        title: 'Điểm 7 Overall',
        description: 'Lần đầu đạt 7 điểm!',
      },
      {
        type: MilestoneType.SCORE_8_OVERALL,
        condition: stats.highestScore >= 8.0,
        title: 'Điểm 8 Overall',
        description: 'Lần đầu đạt 8 điểm!',
      },

      // Questions milestones
      {
        type: MilestoneType.FIRST_100_QUESTIONS,
        condition: stats.totalQuestionsAnswered >= 100,
        title: '100 câu hỏi đầu tiên',
        description: 'Đã trả lời 100 câu hỏi!',
      },
      {
        type: MilestoneType.FIRST_1000_QUESTIONS,
        condition: stats.totalQuestionsAnswered >= 1000,
        title: '1000 câu hỏi',
        description: 'Đã trả lời 1000 câu hỏi!',
      },
    ];

    for (const check of checks) {
      if (check.condition) {
        const milestone = await this.createMilestone(userId, check.type, {
          title: check.title,
          description: check.description,
        });
        if (milestone) {
          awarded.push(milestone);
        }
      }
    }

    return awarded;
  }

  private getMilestoneIcon(type: MilestoneType): string {
    const icons: Partial<Record<MilestoneType, string>> = {
      [MilestoneType.STREAK_7_DAYS]: '🔥',
      [MilestoneType.STREAK_30_DAYS]: '🔥🔥',
      [MilestoneType.STREAK_100_DAYS]: '🔥🔥🔥',
      [MilestoneType.REACHED_B1]: '🎯',
      [MilestoneType.REACHED_B2]: '🏆',
      [MilestoneType.REACHED_C1]: '👑',
      [MilestoneType.FIRST_10_HOURS]: '⏱️',
      [MilestoneType.FIRST_50_HOURS]: '⏰',
      [MilestoneType.FIRST_100_HOURS]: '🕐',
      [MilestoneType.GOAL_COMPLETED]: '✅',
    };
    return icons[type] || '🏅';
  }

  private getMilestoneXp(type: MilestoneType): number {
    const xpValues: Partial<Record<MilestoneType, number>> = {
      [MilestoneType.STREAK_7_DAYS]: 50,
      [MilestoneType.STREAK_30_DAYS]: 150,
      [MilestoneType.STREAK_100_DAYS]: 500,
      [MilestoneType.REACHED_B1]: 200,
      [MilestoneType.REACHED_B2]: 400,
      [MilestoneType.REACHED_C1]: 600,
      [MilestoneType.FIRST_10_HOURS]: 30,
      [MilestoneType.FIRST_50_HOURS]: 100,
      [MilestoneType.FIRST_100_HOURS]: 200,
      [MilestoneType.GOAL_COMPLETED]: 50,
    };
    return xpValues[type] || 25;
  }

  // ==================== Helper Methods ====================

  private getScoreLevel(score: number): string {
    if (score >= 8.5) return 'C1';
    if (score >= 6.5) return 'B2';
    if (score >= 4.5) return 'B1';
    if (score >= 3.0) return 'A2';
    return 'A1';
  }

  private getNextLevel(currentLevel: string): string {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];
    const currentIndex = levels.indexOf(currentLevel || 'A1');
    return levels[Math.min(currentIndex + 1, levels.length - 1)];
  }

  private getEmptyProgressSnapshot(): ProgressSnapshot {
    const emptySkill: SkillProgress = {
      currentLevel: 'A1',
      currentScore: 0,
      targetLevel: 'B1',
      targetScore: 4.5,
      progress: 0,
      estimatedDaysToTarget: null,
      trend: 'stable',
    };

    return {
      overall: emptySkill,
      reading: emptySkill,
      listening: emptySkill,
      writing: emptySkill,
      speaking: emptySkill,
    };
  }
}
```

### 4. Progress Controller

```typescript
// src/modules/dashboard/controllers/progress.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ProgressTrackingService } from '../services/progress-tracking.service';
import { CreateGoalDto, UpdateGoalDto } from '../dto/goal.dto';

@ApiTags('Progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressTrackingService) {}

  @Get('snapshot')
  @ApiOperation({ summary: 'Get progress snapshot for all skills' })
  async getSnapshot(@CurrentUser('id') userId: string) {
    return this.progressService.getProgressSnapshot(userId);
  }

  @Get('goals')
  @ApiOperation({ summary: 'Get active goals with progress' })
  async getGoals(@CurrentUser('id') userId: string) {
    return this.progressService.getActiveGoals(userId);
  }

  @Get('goals/completed')
  @ApiOperation({ summary: 'Get completed goals history' })
  async getCompletedGoals(
    @CurrentUser('id') userId: string,
    @Query('limit') limit?: number,
  ) {
    return this.progressService.getCompletedGoals(userId, limit);
  }

  @Post('goals')
  @ApiOperation({ summary: 'Create a new goal' })
  async createGoal(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateGoalDto,
  ) {
    return this.progressService.createGoal(userId, dto);
  }

  @Put('goals/:goalId')
  @ApiOperation({ summary: 'Update a goal' })
  async updateGoal(
    @CurrentUser('id') userId: string,
    @Param('goalId', ParseUUIDPipe) goalId: string,
    @Body() dto: UpdateGoalDto,
  ) {
    return this.progressService.updateGoal(userId, goalId, dto);
  }

  @Delete('goals/:goalId')
  @ApiOperation({ summary: 'Cancel a goal' })
  async cancelGoal(
    @CurrentUser('id') userId: string,
    @Param('goalId', ParseUUIDPipe) goalId: string,
  ) {
    return this.progressService.cancelGoal(userId, goalId);
  }

  @Get('milestones')
  @ApiOperation({ summary: 'Get all achieved milestones' })
  async getMilestones(@CurrentUser('id') userId: string) {
    return this.progressService.getMilestones(userId);
  }

  @Get('milestones/unseen')
  @ApiOperation({ summary: 'Get unseen milestones for celebration' })
  async getUnseenMilestones(@CurrentUser('id') userId: string) {
    return this.progressService.getUnseenMilestones(userId);
  }

  @Post('milestones/:milestoneId/seen')
  @ApiOperation({ summary: 'Mark milestone as seen' })
  async markSeen(
    @CurrentUser('id') userId: string,
    @Param('milestoneId', ParseUUIDPipe) milestoneId: string,
  ) {
    await this.progressService.markMilestoneSeen(userId, milestoneId);
    return { success: true };
  }

  @Post('check-milestones')
  @ApiOperation({ summary: 'Check and award new milestones' })
  async checkMilestones(@CurrentUser('id') userId: string) {
    return this.progressService.checkAndAwardMilestones(userId);
  }
}
```

### 5. Goal DTOs

```typescript
// src/modules/dashboard/dto/goal.dto.ts
import { 
  IsString, 
  IsEnum, 
  IsNumber, 
  IsOptional, 
  IsDate, 
  IsBoolean,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GoalType } from '../entities/user-goal.entity';

export class CreateGoalDto {
  @ApiProperty({ enum: GoalType })
  @IsEnum(GoalType)
  type: GoalType;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  targetValue: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ enum: ['reading', 'listening', 'writing', 'speaking'] })
  @IsOptional()
  @IsString()
  skill?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  targetDate?: Date;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  reminderEnabled?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reminderTime?: string;
}

export class UpdateGoalDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  targetValue?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  targetDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  reminderEnabled?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reminderTime?: string;
}
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/progress/snapshot` | Get progress for all skills |
| GET | `/progress/goals` | Get active goals with progress |
| GET | `/progress/goals/completed` | Get completed goals |
| POST | `/progress/goals` | Create a new goal |
| PUT | `/progress/goals/:id` | Update a goal |
| DELETE | `/progress/goals/:id` | Cancel a goal |
| GET | `/progress/milestones` | Get achieved milestones |
| GET | `/progress/milestones/unseen` | Get new milestones |
| POST | `/progress/milestones/:id/seen` | Mark as seen |
| POST | `/progress/check-milestones` | Check for new milestones |

---

## Next Task

Continue with **BE-031: Activity Log Service** - Implement activity logging and history.

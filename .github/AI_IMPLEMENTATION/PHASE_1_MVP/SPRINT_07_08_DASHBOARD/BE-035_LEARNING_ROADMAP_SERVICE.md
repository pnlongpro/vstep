# Task: BE-035 - Learning Roadmap Service

## Task Info

| Field | Value |
|-------|-------|
| **Task ID** | BE-035 |
| **Task Name** | Learning Roadmap Service |
| **Module** | Dashboard & Analytics |
| **Sprint** | 07-08 |
| **Estimated Hours** | 6h |
| **Priority** | P1 (High) |
| **Dependencies** | BE-030 |

---

## Description

Implement learning roadmap service để:
- Đánh giá level hiện tại của user
- Tạo lộ trình học tập cá nhân hóa
- Recommend practice activities
- Track progress towards target level
- Suggest next steps based on performance

---

## Acceptance Criteria

- [ ] Current level assessment từ scores
- [ ] Target level goal setting
- [ ] Personalized learning path generation
- [ ] Skill-based recommendations
- [ ] Progress milestones
- [ ] Estimated time to reach goal
- [ ] Weekly study plan suggestions

---

## Implementation

### 1. Learning Roadmap Entity

```typescript
// src/modules/dashboard/entities/learning-roadmap.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum VstepLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
}

export enum RoadmapStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}

@Entity('learning_roadmaps')
@Index(['userId', 'status'])
export class LearningRoadmap {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  @Index()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'current_level', type: 'enum', enum: VstepLevel })
  currentLevel: VstepLevel;

  @Column({ name: 'target_level', type: 'enum', enum: VstepLevel })
  targetLevel: VstepLevel;

  @Column({ name: 'target_date', type: 'date', nullable: true })
  targetDate: Date;

  @Column({ type: 'enum', enum: RoadmapStatus, default: RoadmapStatus.ACTIVE })
  status: RoadmapStatus;

  // Skill assessments (0-10 scale)
  @Column({ name: 'reading_score', type: 'decimal', precision: 4, scale: 2, default: 0 })
  readingScore: number;

  @Column({ name: 'listening_score', type: 'decimal', precision: 4, scale: 2, default: 0 })
  listeningScore: number;

  @Column({ name: 'writing_score', type: 'decimal', precision: 4, scale: 2, default: 0 })
  writingScore: number;

  @Column({ name: 'speaking_score', type: 'decimal', precision: 4, scale: 2, default: 0 })
  speakingScore: number;

  // Settings
  @Column({ name: 'weekly_hours', type: 'int', default: 10 })
  weeklyHours: number;

  @Column({ name: 'preferred_skills', type: 'simple-array', nullable: true })
  preferredSkills: string[]; // ['reading', 'listening']

  // Progress
  @Column({ name: 'overall_progress', type: 'int', default: 0 })
  overallProgress: number; // 0-100%

  @Column({ name: 'estimated_weeks', type: 'int', nullable: true })
  estimatedWeeks: number;

  @OneToMany(() => RoadmapMilestone, milestone => milestone.roadmap)
  milestones: RoadmapMilestone[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Computed
  get averageScore(): number {
    return (
      (Number(this.readingScore) +
        Number(this.listeningScore) +
        Number(this.writingScore) +
        Number(this.speakingScore)) /
      4
    );
  }

  get weakestSkill(): string {
    const skills = [
      { name: 'reading', score: Number(this.readingScore) },
      { name: 'listening', score: Number(this.listeningScore) },
      { name: 'writing', score: Number(this.writingScore) },
      { name: 'speaking', score: Number(this.speakingScore) },
    ];
    return skills.sort((a, b) => a.score - b.score)[0].name;
  }

  get strongestSkill(): string {
    const skills = [
      { name: 'reading', score: Number(this.readingScore) },
      { name: 'listening', score: Number(this.listeningScore) },
      { name: 'writing', score: Number(this.writingScore) },
      { name: 'speaking', score: Number(this.speakingScore) },
    ];
    return skills.sort((a, b) => b.score - a.score)[0].name;
  }
}
```

### 2. Roadmap Milestone Entity

```typescript
// src/modules/dashboard/entities/roadmap-milestone.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { LearningRoadmap } from './learning-roadmap.entity';

export enum MilestoneType {
  SKILL_IMPROVEMENT = 'skill_improvement',
  LEVEL_UP = 'level_up',
  PRACTICE_COUNT = 'practice_count',
  MOCK_TEST = 'mock_test',
  STREAK_GOAL = 'streak_goal',
}

@Entity('roadmap_milestones')
@Index(['roadmapId', 'order'])
export class RoadmapMilestone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'roadmap_id', type: 'uuid' })
  roadmapId: string;

  @ManyToOne(() => LearningRoadmap, roadmap => roadmap.milestones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roadmap_id' })
  roadmap: LearningRoadmap;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: MilestoneType })
  type: MilestoneType;

  @Column({ type: 'int' })
  order: number;

  // Target criteria
  @Column({ type: 'varchar', length: 50, nullable: true })
  skill: string; // 'reading', 'listening', etc.

  @Column({ name: 'target_value', type: 'decimal', precision: 4, scale: 2, nullable: true })
  targetValue: number;

  @Column({ name: 'current_value', type: 'decimal', precision: 4, scale: 2, default: 0 })
  currentValue: number;

  // Status
  @Column({ name: 'is_completed', type: 'boolean', default: false })
  isCompleted: boolean;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ name: 'estimated_days', type: 'int', nullable: true })
  estimatedDays: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  get progress(): number {
    if (!this.targetValue) return this.isCompleted ? 100 : 0;
    return Math.min(100, Math.round((Number(this.currentValue) / Number(this.targetValue)) * 100));
  }
}
```

### 3. Skill Recommendation Entity

```typescript
// src/modules/dashboard/entities/skill-recommendation.entity.ts
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

export enum RecommendationType {
  PRACTICE = 'practice',
  REVIEW = 'review',
  MOCK_TEST = 'mock_test',
  FOCUS_AREA = 'focus_area',
}

export enum RecommendationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

@Entity('skill_recommendations')
@Index(['userId', 'isActive'])
export class SkillRecommendation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: RecommendationType })
  type: RecommendationType;

  @Column({ type: 'enum', enum: RecommendationPriority, default: RecommendationPriority.MEDIUM })
  priority: RecommendationPriority;

  @Column({ type: 'varchar', length: 50 })
  skill: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  reason: string; // Why this recommendation

  @Column({ name: 'action_url', type: 'varchar', length: 500, nullable: true })
  actionUrl: string;

  @Column({ name: 'estimated_minutes', type: 'int', nullable: true })
  estimatedMinutes: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'is_completed', type: 'boolean', default: false })
  isCompleted: boolean;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
```

### 4. Learning Roadmap Service

```typescript
// src/modules/dashboard/services/learning-roadmap.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LearningRoadmap, VstepLevel, RoadmapStatus } from '../entities/learning-roadmap.entity';
import { RoadmapMilestone, MilestoneType } from '../entities/roadmap-milestone.entity';
import { SkillRecommendation, RecommendationType, RecommendationPriority } from '../entities/skill-recommendation.entity';
import { UserStatsRepository } from '../repositories/user-stats.repository';
import { AnalyticsService } from './analytics.service';
import { addWeeks, differenceInWeeks, differenceInDays } from 'date-fns';

export interface CreateRoadmapDto {
  targetLevel: VstepLevel;
  targetDate?: Date;
  weeklyHours?: number;
  preferredSkills?: string[];
}

export interface RoadmapSummary {
  roadmap: LearningRoadmap;
  milestones: RoadmapMilestone[];
  recommendations: SkillRecommendation[];
  weeklyPlan: WeeklyPlan;
  insights: RoadmapInsight[];
}

export interface WeeklyPlan {
  reading: number; // hours
  listening: number;
  writing: number;
  speaking: number;
  mockTests: number;
}

export interface RoadmapInsight {
  type: 'strength' | 'weakness' | 'suggestion' | 'warning';
  message: string;
  skill?: string;
}

@Injectable()
export class LearningRoadmapService {
  // Level score thresholds
  private readonly LEVEL_THRESHOLDS: Record<VstepLevel, number> = {
    [VstepLevel.A1]: 3.0,
    [VstepLevel.A2]: 4.5,
    [VstepLevel.B1]: 6.0,
    [VstepLevel.B2]: 7.5,
    [VstepLevel.C1]: 9.0,
  };

  // Estimated weeks per level jump
  private readonly WEEKS_PER_LEVEL: Record<string, number> = {
    'A1_A2': 8,
    'A2_B1': 12,
    'B1_B2': 16,
    'B2_C1': 20,
  };

  constructor(
    @InjectRepository(LearningRoadmap)
    private readonly roadmapRepo: Repository<LearningRoadmap>,
    @InjectRepository(RoadmapMilestone)
    private readonly milestoneRepo: Repository<RoadmapMilestone>,
    @InjectRepository(SkillRecommendation)
    private readonly recommendationRepo: Repository<SkillRecommendation>,
    private readonly userStatsRepo: UserStatsRepository,
    private readonly analyticsService: AnalyticsService,
  ) {}

  // ==================== Create Roadmap ====================

  async createRoadmap(userId: string, dto: CreateRoadmapDto): Promise<LearningRoadmap> {
    // Check existing active roadmap
    const existing = await this.roadmapRepo.findOne({
      where: { userId, status: RoadmapStatus.ACTIVE },
    });

    if (existing) {
      throw new BadRequestException('User already has an active roadmap. Please complete or abandon it first.');
    }

    // Assess current level from user stats
    const userStats = await this.userStatsRepo.findByUserId(userId);
    const currentLevel = this.assessCurrentLevel(userStats);

    // Validate target level
    if (this.getLevelOrder(dto.targetLevel) <= this.getLevelOrder(currentLevel)) {
      throw new BadRequestException('Target level must be higher than current level');
    }

    // Calculate estimated weeks
    const estimatedWeeks = this.calculateEstimatedWeeks(
      currentLevel,
      dto.targetLevel,
      dto.weeklyHours || 10,
    );

    // Create roadmap
    const roadmap = this.roadmapRepo.create({
      userId,
      currentLevel,
      targetLevel: dto.targetLevel,
      targetDate: dto.targetDate || addWeeks(new Date(), estimatedWeeks),
      weeklyHours: dto.weeklyHours || 10,
      preferredSkills: dto.preferredSkills || [],
      estimatedWeeks,
      readingScore: userStats?.averageReadingScore || 0,
      listeningScore: userStats?.averageListeningScore || 0,
      writingScore: userStats?.averageWritingScore || 0,
      speakingScore: userStats?.averageSpeakingScore || 0,
    });

    const savedRoadmap = await this.roadmapRepo.save(roadmap);

    // Generate milestones
    await this.generateMilestones(savedRoadmap);

    // Generate initial recommendations
    await this.generateRecommendations(userId, savedRoadmap);

    return savedRoadmap;
  }

  // ==================== Get Roadmap ====================

  async getRoadmapSummary(userId: string): Promise<RoadmapSummary | null> {
    const roadmap = await this.roadmapRepo.findOne({
      where: { userId, status: RoadmapStatus.ACTIVE },
      relations: ['milestones'],
    });

    if (!roadmap) {
      return null;
    }

    const recommendations = await this.recommendationRepo.find({
      where: { userId, isActive: true },
      order: { priority: 'DESC', createdAt: 'DESC' },
      take: 5,
    });

    const weeklyPlan = this.generateWeeklyPlan(roadmap);
    const insights = await this.generateInsights(userId, roadmap);

    return {
      roadmap,
      milestones: roadmap.milestones.sort((a, b) => a.order - b.order),
      recommendations,
      weeklyPlan,
      insights,
    };
  }

  async getActiveRoadmap(userId: string): Promise<LearningRoadmap | null> {
    return this.roadmapRepo.findOne({
      where: { userId, status: RoadmapStatus.ACTIVE },
      relations: ['milestones'],
    });
  }

  // ==================== Update Progress ====================

  async updateRoadmapProgress(userId: string): Promise<void> {
    const roadmap = await this.getActiveRoadmap(userId);
    if (!roadmap) return;

    // Get latest scores from analytics
    const skillBreakdown = await this.analyticsService.getSkillBreakdown(userId);

    // Update scores
    roadmap.readingScore = skillBreakdown.reading.averageScore;
    roadmap.listeningScore = skillBreakdown.listening.averageScore;
    roadmap.writingScore = skillBreakdown.writing.averageScore;
    roadmap.speakingScore = skillBreakdown.speaking.averageScore;

    // Calculate overall progress
    const targetScore = this.LEVEL_THRESHOLDS[roadmap.targetLevel];
    const currentScore = roadmap.averageScore;
    const startScore = this.LEVEL_THRESHOLDS[roadmap.currentLevel];
    
    const progress = Math.min(100, Math.round(
      ((currentScore - startScore) / (targetScore - startScore)) * 100
    ));
    roadmap.overallProgress = Math.max(0, progress);

    // Check if target reached
    if (currentScore >= targetScore) {
      roadmap.status = RoadmapStatus.COMPLETED;
    }

    await this.roadmapRepo.save(roadmap);

    // Update milestone progress
    await this.updateMilestoneProgress(roadmap);

    // Refresh recommendations
    await this.generateRecommendations(userId, roadmap);
  }

  // ==================== Milestones ====================

  private async generateMilestones(roadmap: LearningRoadmap): Promise<void> {
    const milestones: Partial<RoadmapMilestone>[] = [];
    let order = 1;

    // Skill improvement milestones for each skill
    const skills = ['reading', 'listening', 'writing', 'speaking'];
    const targetScore = this.LEVEL_THRESHOLDS[roadmap.targetLevel];

    for (const skill of skills) {
      const currentScore = Number(roadmap[`${skill}Score`]);
      if (currentScore < targetScore) {
        milestones.push({
          roadmapId: roadmap.id,
          title: `Đạt ${targetScore} điểm ${this.getSkillName(skill)}`,
          description: `Nâng điểm ${this.getSkillName(skill)} từ ${currentScore.toFixed(1)} lên ${targetScore}`,
          type: MilestoneType.SKILL_IMPROVEMENT,
          skill,
          targetValue: targetScore,
          currentValue: currentScore,
          order: order++,
          estimatedDays: Math.round((targetScore - currentScore) * 7), // Rough estimate
        });
      }
    }

    // Practice count milestones
    milestones.push({
      roadmapId: roadmap.id,
      title: 'Hoàn thành 50 bài luyện tập',
      description: 'Luyện tập đều đặn để cải thiện kỹ năng',
      type: MilestoneType.PRACTICE_COUNT,
      targetValue: 50,
      currentValue: 0,
      order: order++,
      estimatedDays: 14,
    });

    // Mock test milestone
    milestones.push({
      roadmapId: roadmap.id,
      title: 'Hoàn thành 5 Mock Tests',
      description: 'Làm bài thi thử để đánh giá trình độ',
      type: MilestoneType.MOCK_TEST,
      targetValue: 5,
      currentValue: 0,
      order: order++,
      estimatedDays: 21,
    });

    // Streak milestone
    milestones.push({
      roadmapId: roadmap.id,
      title: 'Streak 14 ngày liên tục',
      description: 'Duy trì việc học hàng ngày',
      type: MilestoneType.STREAK_GOAL,
      targetValue: 14,
      currentValue: 0,
      order: order++,
      estimatedDays: 14,
    });

    // Level up milestone (final)
    milestones.push({
      roadmapId: roadmap.id,
      title: `Đạt trình độ ${roadmap.targetLevel}`,
      description: `Hoàn thành mục tiêu lên level ${roadmap.targetLevel}`,
      type: MilestoneType.LEVEL_UP,
      targetValue: this.LEVEL_THRESHOLDS[roadmap.targetLevel],
      currentValue: roadmap.averageScore,
      order: order++,
      estimatedDays: roadmap.estimatedWeeks * 7,
    });

    await this.milestoneRepo.save(milestones);
  }

  private async updateMilestoneProgress(roadmap: LearningRoadmap): Promise<void> {
    const milestones = await this.milestoneRepo.find({
      where: { roadmapId: roadmap.id, isCompleted: false },
    });

    for (const milestone of milestones) {
      switch (milestone.type) {
        case MilestoneType.SKILL_IMPROVEMENT:
          if (milestone.skill) {
            milestone.currentValue = Number(roadmap[`${milestone.skill}Score`]);
          }
          break;
        case MilestoneType.LEVEL_UP:
          milestone.currentValue = roadmap.averageScore;
          break;
        // PRACTICE_COUNT, MOCK_TEST, STREAK_GOAL are updated elsewhere
      }

      // Check completion
      if (milestone.targetValue && Number(milestone.currentValue) >= Number(milestone.targetValue)) {
        milestone.isCompleted = true;
        milestone.completedAt = new Date();
      }
    }

    await this.milestoneRepo.save(milestones);
  }

  async incrementMilestoneProgress(
    userId: string,
    type: MilestoneType,
    increment: number = 1,
  ): Promise<void> {
    const roadmap = await this.getActiveRoadmap(userId);
    if (!roadmap) return;

    const milestone = await this.milestoneRepo.findOne({
      where: { roadmapId: roadmap.id, type, isCompleted: false },
    });

    if (milestone) {
      milestone.currentValue = Number(milestone.currentValue) + increment;
      
      if (milestone.targetValue && Number(milestone.currentValue) >= Number(milestone.targetValue)) {
        milestone.isCompleted = true;
        milestone.completedAt = new Date();
      }
      
      await this.milestoneRepo.save(milestone);
    }
  }

  // ==================== Recommendations ====================

  private async generateRecommendations(userId: string, roadmap: LearningRoadmap): Promise<void> {
    // Deactivate old recommendations
    await this.recommendationRepo.update(
      { userId, isActive: true },
      { isActive: false },
    );

    const recommendations: Partial<SkillRecommendation>[] = [];

    // Prioritize weakest skill
    const weakestSkill = roadmap.weakestSkill;
    recommendations.push({
      userId,
      type: RecommendationType.FOCUS_AREA,
      priority: RecommendationPriority.HIGH,
      skill: weakestSkill,
      title: `Tập trung cải thiện ${this.getSkillName(weakestSkill)}`,
      description: `Điểm ${this.getSkillName(weakestSkill)} của bạn đang thấp nhất (${roadmap[`${weakestSkill}Score`]}). Hãy dành thêm thời gian luyện tập kỹ năng này.`,
      reason: `Điểm thấp nhất trong 4 kỹ năng`,
      actionUrl: `/practice/${weakestSkill}`,
      estimatedMinutes: 30,
    });

    // Practice recommendations based on scores
    const skills = ['reading', 'listening', 'writing', 'speaking'];
    const targetScore = this.LEVEL_THRESHOLDS[roadmap.targetLevel];

    for (const skill of skills) {
      const score = Number(roadmap[`${skill}Score`]);
      const gap = targetScore - score;

      if (gap > 2) {
        recommendations.push({
          userId,
          type: RecommendationType.PRACTICE,
          priority: gap > 3 ? RecommendationPriority.HIGH : RecommendationPriority.MEDIUM,
          skill,
          title: `Luyện tập ${this.getSkillName(skill)} - Level ${roadmap.targetLevel}`,
          description: `Cần tăng ${gap.toFixed(1)} điểm để đạt mục tiêu`,
          actionUrl: `/practice/${skill}?level=${roadmap.targetLevel}`,
          estimatedMinutes: 20,
        });
      }
    }

    // Mock test recommendation
    recommendations.push({
      userId,
      type: RecommendationType.MOCK_TEST,
      priority: RecommendationPriority.MEDIUM,
      skill: 'all',
      title: 'Làm bài thi thử VSTEP',
      description: 'Đánh giá trình độ tổng quan với bài thi thử đầy đủ',
      actionUrl: `/exams?level=${roadmap.targetLevel}`,
      estimatedMinutes: 150,
    });

    // Review weak areas
    const recentTrends = await this.analyticsService.getScoreTrends(userId, 7);
    const decliningSkills = recentTrends.skills.filter(s => s.trend < 0);
    
    for (const skill of decliningSkills) {
      recommendations.push({
        userId,
        type: RecommendationType.REVIEW,
        priority: RecommendationPriority.HIGH,
        skill: skill.skill,
        title: `Ôn tập lại ${this.getSkillName(skill.skill)}`,
        description: `Điểm ${this.getSkillName(skill.skill)} đang giảm. Hãy ôn lại các bài đã học.`,
        reason: 'Điểm số giảm trong 7 ngày gần đây',
        actionUrl: `/practice/${skill.skill}/review`,
        estimatedMinutes: 25,
      });
    }

    await this.recommendationRepo.save(recommendations);
  }

  async getRecommendations(userId: string, limit: number = 5): Promise<SkillRecommendation[]> {
    return this.recommendationRepo.find({
      where: { userId, isActive: true, isCompleted: false },
      order: { priority: 'DESC', createdAt: 'DESC' },
      take: limit,
    });
  }

  async completeRecommendation(userId: string, recommendationId: string): Promise<void> {
    await this.recommendationRepo.update(
      { id: recommendationId, userId },
      { isCompleted: true, completedAt: new Date() },
    );
  }

  // ==================== Weekly Plan ====================

  private generateWeeklyPlan(roadmap: LearningRoadmap): WeeklyPlan {
    const totalHours = roadmap.weeklyHours;
    const targetScore = this.LEVEL_THRESHOLDS[roadmap.targetLevel];

    // Calculate weights based on skill gaps
    const skillGaps = {
      reading: Math.max(0, targetScore - Number(roadmap.readingScore)),
      listening: Math.max(0, targetScore - Number(roadmap.listeningScore)),
      writing: Math.max(0, targetScore - Number(roadmap.writingScore)),
      speaking: Math.max(0, targetScore - Number(roadmap.speakingScore)),
    };

    const totalGap = Object.values(skillGaps).reduce((a, b) => a + b, 0);
    
    if (totalGap === 0) {
      // Already at or above target for all skills
      return {
        reading: totalHours * 0.25,
        listening: totalHours * 0.25,
        writing: totalHours * 0.25,
        speaking: totalHours * 0.25,
        mockTests: 1,
      };
    }

    // Allocate time based on gaps (higher gap = more time)
    // Reserve 1.5 hours for mock tests
    const practiceHours = totalHours - 1.5;

    return {
      reading: Number(((skillGaps.reading / totalGap) * practiceHours).toFixed(1)),
      listening: Number(((skillGaps.listening / totalGap) * practiceHours).toFixed(1)),
      writing: Number(((skillGaps.writing / totalGap) * practiceHours).toFixed(1)),
      speaking: Number(((skillGaps.speaking / totalGap) * practiceHours).toFixed(1)),
      mockTests: 1,
    };
  }

  // ==================== Insights ====================

  private async generateInsights(userId: string, roadmap: LearningRoadmap): Promise<RoadmapInsight[]> {
    const insights: RoadmapInsight[] = [];

    // Strength
    insights.push({
      type: 'strength',
      message: `${this.getSkillName(roadmap.strongestSkill)} là kỹ năng mạnh nhất của bạn (${roadmap[`${roadmap.strongestSkill}Score`]} điểm)`,
      skill: roadmap.strongestSkill,
    });

    // Weakness
    insights.push({
      type: 'weakness',
      message: `Cần cải thiện ${this.getSkillName(roadmap.weakestSkill)} (${roadmap[`${roadmap.weakestSkill}Score`]} điểm)`,
      skill: roadmap.weakestSkill,
    });

    // Progress insight
    if (roadmap.overallProgress > 50) {
      insights.push({
        type: 'suggestion',
        message: `Bạn đã hoàn thành ${roadmap.overallProgress}% lộ trình. Tiếp tục phát huy!`,
      });
    }

    // Timeline warning
    if (roadmap.targetDate) {
      const daysLeft = differenceInDays(roadmap.targetDate, new Date());
      if (daysLeft < 30 && roadmap.overallProgress < 70) {
        insights.push({
          type: 'warning',
          message: `Còn ${daysLeft} ngày để đạt mục tiêu. Hãy tăng cường luyện tập!`,
        });
      }
    }

    return insights;
  }

  // ==================== Helpers ====================

  private assessCurrentLevel(userStats: any): VstepLevel {
    if (!userStats) return VstepLevel.A2;

    const avgScore = (
      (userStats.averageReadingScore || 0) +
      (userStats.averageListeningScore || 0) +
      (userStats.averageWritingScore || 0) +
      (userStats.averageSpeakingScore || 0)
    ) / 4;

    if (avgScore >= 9.0) return VstepLevel.C1;
    if (avgScore >= 7.5) return VstepLevel.B2;
    if (avgScore >= 6.0) return VstepLevel.B1;
    if (avgScore >= 4.5) return VstepLevel.A2;
    return VstepLevel.A1;
  }

  private getLevelOrder(level: VstepLevel): number {
    const order = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5 };
    return order[level] || 0;
  }

  private calculateEstimatedWeeks(
    currentLevel: VstepLevel,
    targetLevel: VstepLevel,
    weeklyHours: number,
  ): number {
    const levelJump = `${currentLevel}_${targetLevel}`;
    const baseWeeks = this.WEEKS_PER_LEVEL[levelJump] || 16;
    
    // Adjust based on study hours (10 hours/week is baseline)
    const hoursMultiplier = 10 / weeklyHours;
    
    return Math.round(baseWeeks * hoursMultiplier);
  }

  private getSkillName(skill: string): string {
    const names: Record<string, string> = {
      reading: 'Reading',
      listening: 'Listening',
      writing: 'Writing',
      speaking: 'Speaking',
    };
    return names[skill] || skill;
  }
}
```

### 5. Roadmap Controller

```typescript
// src/modules/dashboard/controllers/roadmap.controller.ts
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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { LearningRoadmapService, CreateRoadmapDto } from '../services/learning-roadmap.service';
import { VstepLevel } from '../entities/learning-roadmap.entity';

@ApiTags('Learning Roadmap')
@Controller('roadmap')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RoadmapController {
  constructor(private readonly roadmapService: LearningRoadmapService) {}

  @Post()
  @ApiOperation({ summary: 'Create learning roadmap' })
  async createRoadmap(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateRoadmapDto,
  ) {
    return this.roadmapService.createRoadmap(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get current roadmap summary' })
  async getRoadmapSummary(@CurrentUser('id') userId: string) {
    return this.roadmapService.getRoadmapSummary(userId);
  }

  @Get('recommendations')
  @ApiOperation({ summary: 'Get learning recommendations' })
  async getRecommendations(
    @CurrentUser('id') userId: string,
    @Query('limit') limit: number = 5,
  ) {
    return this.roadmapService.getRecommendations(userId, limit);
  }

  @Post('recommendations/:id/complete')
  @ApiOperation({ summary: 'Mark recommendation as completed' })
  async completeRecommendation(
    @CurrentUser('id') userId: string,
    @Param('id') recommendationId: string,
  ) {
    await this.roadmapService.completeRecommendation(userId, recommendationId);
    return { success: true };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh roadmap progress' })
  async refreshProgress(@CurrentUser('id') userId: string) {
    await this.roadmapService.updateRoadmapProgress(userId);
    return { success: true };
  }
}
```

### 6. DTOs

```typescript
// src/modules/dashboard/dto/roadmap.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsDate, IsInt, Min, Max, IsArray, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { VstepLevel } from '../entities/learning-roadmap.entity';

export class CreateRoadmapDto {
  @ApiProperty({ enum: VstepLevel })
  @IsEnum(VstepLevel)
  targetLevel: VstepLevel;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  targetDate?: Date;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(40)
  weeklyHours?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredSkills?: string[];
}

export class WeeklyPlanDto {
  @ApiProperty()
  reading: number;

  @ApiProperty()
  listening: number;

  @ApiProperty()
  writing: number;

  @ApiProperty()
  speaking: number;

  @ApiProperty()
  mockTests: number;
}
```

### 7. Migration

```typescript
// src/migrations/XXXXXX-CreateRoadmapTables.ts
import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateRoadmapTables1700000011000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Learning Roadmaps table
    await queryRunner.createTable(
      new Table({
        name: 'learning_roadmaps',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'user_id', type: 'uuid' },
          { name: 'current_level', type: 'enum', enum: ['A1', 'A2', 'B1', 'B2', 'C1'] },
          { name: 'target_level', type: 'enum', enum: ['A1', 'A2', 'B1', 'B2', 'C1'] },
          { name: 'target_date', type: 'date', isNullable: true },
          { name: 'status', type: 'enum', enum: ['active', 'paused', 'completed', 'abandoned'], default: "'active'" },
          { name: 'reading_score', type: 'decimal', precision: 4, scale: 2, default: 0 },
          { name: 'listening_score', type: 'decimal', precision: 4, scale: 2, default: 0 },
          { name: 'writing_score', type: 'decimal', precision: 4, scale: 2, default: 0 },
          { name: 'speaking_score', type: 'decimal', precision: 4, scale: 2, default: 0 },
          { name: 'weekly_hours', type: 'int', default: 10 },
          { name: 'preferred_skills', type: 'text', isNullable: true },
          { name: 'overall_progress', type: 'int', default: 0 },
          { name: 'estimated_weeks', type: 'int', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
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

    await queryRunner.createIndex('learning_roadmaps', new TableIndex({
      name: 'IDX_roadmap_user_status',
      columnNames: ['user_id', 'status'],
    }));

    // Roadmap Milestones table
    await queryRunner.createTable(
      new Table({
        name: 'roadmap_milestones',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'roadmap_id', type: 'uuid' },
          { name: 'title', type: 'varchar', length: '200' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'type', type: 'enum', enum: ['skill_improvement', 'level_up', 'practice_count', 'mock_test', 'streak_goal'] },
          { name: 'order', type: 'int' },
          { name: 'skill', type: 'varchar', length: '50', isNullable: true },
          { name: 'target_value', type: 'decimal', precision: 4, scale: 2, isNullable: true },
          { name: 'current_value', type: 'decimal', precision: 4, scale: 2, default: 0 },
          { name: 'is_completed', type: 'boolean', default: false },
          { name: 'completed_at', type: 'timestamp', isNullable: true },
          { name: 'estimated_days', type: 'int', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
        foreignKeys: [
          {
            columnNames: ['roadmap_id'],
            referencedTableName: 'learning_roadmaps',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.createIndex('roadmap_milestones', new TableIndex({
      name: 'IDX_milestone_roadmap_order',
      columnNames: ['roadmap_id', 'order'],
    }));

    // Skill Recommendations table
    await queryRunner.createTable(
      new Table({
        name: 'skill_recommendations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'user_id', type: 'uuid' },
          { name: 'type', type: 'enum', enum: ['practice', 'review', 'mock_test', 'focus_area'] },
          { name: 'priority', type: 'enum', enum: ['low', 'medium', 'high', 'critical'], default: "'medium'" },
          { name: 'skill', type: 'varchar', length: '50' },
          { name: 'title', type: 'varchar', length: '200' },
          { name: 'description', type: 'text' },
          { name: 'reason', type: 'text', isNullable: true },
          { name: 'action_url', type: 'varchar', length: '500', isNullable: true },
          { name: 'estimated_minutes', type: 'int', isNullable: true },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'is_completed', type: 'boolean', default: false },
          { name: 'completed_at', type: 'timestamp', isNullable: true },
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

    await queryRunner.createIndex('skill_recommendations', new TableIndex({
      name: 'IDX_recommendation_user_active',
      columnNames: ['user_id', 'is_active'],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('skill_recommendations');
    await queryRunner.dropTable('roadmap_milestones');
    await queryRunner.dropTable('learning_roadmaps');
  }
}
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/roadmap` | Create learning roadmap |
| GET | `/roadmap` | Get roadmap summary |
| GET | `/roadmap/recommendations` | Get recommendations |
| POST | `/roadmap/recommendations/:id/complete` | Complete recommendation |
| POST | `/roadmap/refresh` | Refresh progress |

---

## Next Task

Continue with **FE-028: Dashboard API Service** - Create API service layer for dashboard data.

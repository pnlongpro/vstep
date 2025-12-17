# BE-024: Exam Analytics Service

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-024 |
| **Phase** | 1 - MVP |
| **Sprint** | 5-6 |
| **Priority** | P2 (Medium) |
| **Estimated Hours** | 6h |
| **Dependencies** | BE-023 |

---

## 🎯 Objective

Implement Exam Analytics Service với:
- Performance analytics by skill/section
- Time analysis
- Question difficulty analysis
- Error pattern detection

---

## 💻 Implementation

### Step 1: Analytics DTOs

```typescript
// src/modules/exams/dto/exam-analytics.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SkillPerformanceDto {
  @ApiProperty()
  skill: string;

  @ApiProperty()
  averageScore: number;

  @ApiProperty()
  bestScore: number;

  @ApiProperty()
  worstScore: number;

  @ApiProperty()
  attemptCount: number;

  @ApiProperty()
  trend: 'improving' | 'stable' | 'declining';

  @ApiProperty()
  trendPercentage: number;

  @ApiProperty({ type: [Number] })
  recentScores: number[];
}

export class TimeAnalyticsDto {
  @ApiProperty()
  averageCompletionTime: number;

  @ApiProperty()
  fastestCompletionTime: number;

  @ApiProperty()
  slowestCompletionTime: number;

  @ApiProperty()
  timePerSkill: {
    skill: string;
    averageTime: number;
    allocatedTime: number;
    efficiency: number;
  }[];

  @ApiProperty()
  timeDistribution: {
    percentile: number;
    time: number;
  }[];
}

export class QuestionDifficultyDto {
  @ApiProperty()
  questionId: string;

  @ApiProperty()
  questionText: string;

  @ApiProperty()
  correctRate: number;

  @ApiProperty()
  averageTimeSpent: number;

  @ApiProperty()
  difficulty: 'easy' | 'medium' | 'hard';

  @ApiProperty()
  userCorrect: boolean;

  @ApiProperty()
  userTimeSpent: number;
}

export class ErrorPatternDto {
  @ApiProperty()
  patternType: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  frequency: number;

  @ApiProperty({ type: [String] })
  affectedQuestions: string[];

  @ApiProperty()
  recommendation: string;
}

export class ExamAnalyticsDto {
  @ApiProperty()
  attemptId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ type: [SkillPerformanceDto] })
  skillPerformance: SkillPerformanceDto[];

  @ApiProperty()
  timeAnalytics: TimeAnalyticsDto;

  @ApiProperty({ type: [QuestionDifficultyDto] })
  questionDifficulty: QuestionDifficultyDto[];

  @ApiProperty({ type: [ErrorPatternDto] })
  errorPatterns: ErrorPatternDto[];

  @ApiProperty()
  overallStats: {
    totalAttempts: number;
    averageScore: number;
    highestScore: number;
    currentRank: number;
    percentile: number;
  };
}

export class UserExamHistoryDto {
  @ApiProperty()
  totalExams: number;

  @ApiProperty()
  completedExams: number;

  @ApiProperty()
  abandonedExams: number;

  @ApiProperty()
  averageScore: number;

  @ApiProperty()
  averageVstepScore: number;

  @ApiProperty()
  currentStreak: number;

  @ApiProperty()
  skillProgress: {
    skill: string;
    firstScore: number;
    lastScore: number;
    improvement: number;
    examCount: number;
  }[];

  @ApiProperty()
  recentAttempts: {
    attemptId: string;
    examTitle: string;
    completedAt: Date;
    vstepScore: number;
    duration: number;
  }[];

  @ApiProperty()
  monthlyActivity: {
    month: string;
    examCount: number;
    averageScore: number;
  }[];
}

export class AnalyticsFilterDto {
  startDate?: Date;
  endDate?: Date;
  skill?: string;
  examSetId?: string;
  level?: string;
}
```

### Step 2: Analytics Repository

```typescript
// src/modules/exams/repositories/exam-analytics.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In, MoreThanOrEqual } from 'typeorm';
import { ExamAttempt, AttemptStatus } from '../entities/exam-attempt.entity';
import { ExamAnswer } from '../entities/exam-answer.entity';
import { Question } from '../entities/question.entity';
import { AnalyticsFilterDto } from '../dto/exam-analytics.dto';

@Injectable()
export class ExamAnalyticsRepository {
  constructor(
    @InjectRepository(ExamAttempt)
    private readonly attemptRepository: Repository<ExamAttempt>,
    @InjectRepository(ExamAnswer)
    private readonly answerRepository: Repository<ExamAnswer>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  /**
   * Get user's exam attempts with filtering
   */
  async getUserAttempts(
    userId: string,
    filters: AnalyticsFilterDto,
  ): Promise<ExamAttempt[]> {
    const query = this.attemptRepository
      .createQueryBuilder('attempt')
      .leftJoinAndSelect('attempt.examSet', 'examSet')
      .where('attempt.userId = :userId', { userId })
      .andWhere('attempt.status = :status', { status: AttemptStatus.COMPLETED });

    if (filters.startDate) {
      query.andWhere('attempt.createdAt >= :startDate', { startDate: filters.startDate });
    }

    if (filters.endDate) {
      query.andWhere('attempt.createdAt <= :endDate', { endDate: filters.endDate });
    }

    if (filters.examSetId) {
      query.andWhere('attempt.examSetId = :examSetId', { examSetId: filters.examSetId });
    }

    if (filters.level) {
      query.andWhere('examSet.level = :level', { level: filters.level });
    }

    return query.orderBy('attempt.createdAt', 'DESC').getMany();
  }

  /**
   * Get skill performance over time
   */
  async getSkillPerformanceHistory(
    userId: string,
    skill: string,
    limit: number = 10,
  ): Promise<{ date: Date; score: number }[]> {
    const results = await this.attemptRepository
      .createQueryBuilder('attempt')
      .select([
        'attempt.createdAt as date',
        `JSON_EXTRACT(attempt.sectionScores, '$."${skill}".score') as score`,
      ])
      .where('attempt.userId = :userId', { userId })
      .andWhere('attempt.status = :status', { status: AttemptStatus.COMPLETED })
      .andWhere(`JSON_EXTRACT(attempt.sectionScores, '$."${skill}"') IS NOT NULL`)
      .orderBy('attempt.createdAt', 'DESC')
      .limit(limit)
      .getRawMany();

    return results.map(r => ({
      date: new Date(r.date),
      score: parseFloat(r.score) || 0,
    }));
  }

  /**
   * Get question difficulty stats
   */
  async getQuestionDifficultyStats(
    questionIds: string[],
  ): Promise<Map<string, { correctRate: number; avgTime: number; totalAttempts: number }>> {
    const stats = await this.answerRepository
      .createQueryBuilder('answer')
      .select([
        'answer.questionId as questionId',
        'COUNT(*) as totalAttempts',
        'SUM(CASE WHEN answer.isCorrect = true THEN 1 ELSE 0 END) as correctCount',
        'AVG(answer.timeSpent) as avgTime',
      ])
      .where('answer.questionId IN (:...questionIds)', { questionIds })
      .groupBy('answer.questionId')
      .getRawMany();

    const result = new Map();
    for (const stat of stats) {
      result.set(stat.questionId, {
        correctRate: stat.totalAttempts > 0 ? (stat.correctCount / stat.totalAttempts) * 100 : 0,
        avgTime: parseFloat(stat.avgTime) || 0,
        totalAttempts: parseInt(stat.totalAttempts) || 0,
      });
    }

    return result;
  }

  /**
   * Get time distribution for an exam
   */
  async getTimeDistribution(examSetId: string): Promise<number[]> {
    const times = await this.attemptRepository
      .createQueryBuilder('attempt')
      .select('TIMESTAMPDIFF(SECOND, attempt.startedAt, attempt.endedAt) - attempt.totalPausedTime as duration')
      .where('attempt.examSetId = :examSetId', { examSetId })
      .andWhere('attempt.status = :status', { status: AttemptStatus.COMPLETED })
      .orderBy('duration', 'ASC')
      .getRawMany();

    return times.map(t => parseInt(t.duration) || 0);
  }

  /**
   * Get user's rank percentile
   */
  async getUserPercentile(userId: string, examSetId: string): Promise<number> {
    // Get user's best score for this exam
    const userBest = await this.attemptRepository
      .createQueryBuilder('attempt')
      .select('MAX(attempt.vstepScore) as score')
      .where('attempt.userId = :userId', { userId })
      .andWhere('attempt.examSetId = :examSetId', { examSetId })
      .andWhere('attempt.status = :status', { status: AttemptStatus.COMPLETED })
      .getRawOne();

    if (!userBest?.score) return 0;

    // Count how many users have lower scores
    const lowerCount = await this.attemptRepository
      .createQueryBuilder('attempt')
      .select('COUNT(DISTINCT attempt.userId) as count')
      .where('attempt.examSetId = :examSetId', { examSetId })
      .andWhere('attempt.status = :status', { status: AttemptStatus.COMPLETED })
      .andWhere('attempt.vstepScore < :score', { score: userBest.score })
      .getRawOne();

    // Total unique users
    const totalUsers = await this.attemptRepository
      .createQueryBuilder('attempt')
      .select('COUNT(DISTINCT attempt.userId) as count')
      .where('attempt.examSetId = :examSetId', { examSetId })
      .andWhere('attempt.status = :status', { status: AttemptStatus.COMPLETED })
      .getRawOne();

    const total = parseInt(totalUsers?.count) || 1;
    const lower = parseInt(lowerCount?.count) || 0;

    return Math.round((lower / total) * 100);
  }

  /**
   * Get monthly activity
   */
  async getMonthlyActivity(
    userId: string,
    months: number = 6,
  ): Promise<{ month: string; examCount: number; averageScore: number }[]> {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const results = await this.attemptRepository
      .createQueryBuilder('attempt')
      .select([
        "DATE_FORMAT(attempt.createdAt, '%Y-%m') as month",
        'COUNT(*) as examCount',
        'AVG(attempt.vstepScore) as averageScore',
      ])
      .where('attempt.userId = :userId', { userId })
      .andWhere('attempt.status = :status', { status: AttemptStatus.COMPLETED })
      .andWhere('attempt.createdAt >= :startDate', { startDate })
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    return results.map(r => ({
      month: r.month,
      examCount: parseInt(r.examCount) || 0,
      averageScore: parseFloat(r.averageScore) || 0,
    }));
  }

  /**
   * Get current streak
   */
  async getCurrentStreak(userId: string): Promise<number> {
    // Get unique exam days in descending order
    const days = await this.attemptRepository
      .createQueryBuilder('attempt')
      .select('DATE(attempt.createdAt) as examDate')
      .where('attempt.userId = :userId', { userId })
      .andWhere('attempt.status = :status', { status: AttemptStatus.COMPLETED })
      .groupBy('examDate')
      .orderBy('examDate', 'DESC')
      .getRawMany();

    if (days.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let expectedDate = today;

    for (const day of days) {
      const examDate = new Date(day.examDate);
      examDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((expectedDate.getTime() - examDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 0 || diffDays === 1) {
        streak++;
        expectedDate = examDate;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }
}
```

### Step 3: Analytics Service

```typescript
// src/modules/exams/services/exam-analytics.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamAttempt } from '../entities/exam-attempt.entity';
import { ExamAnswer } from '../entities/exam-answer.entity';
import { Question } from '../entities/question.entity';
import { ExamAnalyticsRepository } from '../repositories/exam-analytics.repository';
import {
  ExamAnalyticsDto,
  UserExamHistoryDto,
  SkillPerformanceDto,
  TimeAnalyticsDto,
  QuestionDifficultyDto,
  ErrorPatternDto,
  AnalyticsFilterDto,
} from '../dto/exam-analytics.dto';

@Injectable()
export class ExamAnalyticsService {
  private readonly logger = new Logger(ExamAnalyticsService.name);

  constructor(
    @InjectRepository(ExamAttempt)
    private readonly attemptRepository: Repository<ExamAttempt>,
    @InjectRepository(ExamAnswer)
    private readonly answerRepository: Repository<ExamAnswer>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    private readonly analyticsRepository: ExamAnalyticsRepository,
  ) {}

  /**
   * Get comprehensive analytics for an attempt
   */
  async getAttemptAnalytics(
    attemptId: string,
    userId: string,
  ): Promise<ExamAnalyticsDto> {
    const attempt = await this.attemptRepository.findOne({
      where: { id: attemptId, userId },
      relations: ['examSet', 'answers', 'answers.question'],
    });

    if (!attempt) {
      throw new Error('Attempt not found');
    }

    const [
      skillPerformance,
      timeAnalytics,
      questionDifficulty,
      errorPatterns,
      overallStats,
    ] = await Promise.all([
      this.getSkillPerformance(userId),
      this.getTimeAnalytics(attempt),
      this.getQuestionDifficulty(attempt.answers),
      this.detectErrorPatterns(attempt.answers),
      this.getOverallStats(userId, attempt.examSetId),
    ]);

    return {
      attemptId,
      userId,
      skillPerformance,
      timeAnalytics,
      questionDifficulty,
      errorPatterns,
      overallStats,
    };
  }

  /**
   * Get user's exam history
   */
  async getUserExamHistory(userId: string): Promise<UserExamHistoryDto> {
    const attempts = await this.analyticsRepository.getUserAttempts(userId, {});

    // Calculate basic stats
    const completedExams = attempts.length;
    const abandonedExams = await this.attemptRepository.count({
      where: { userId, status: 'abandoned' as any },
    });

    const averageScore = attempts.length > 0
      ? attempts.reduce((sum, a) => sum + (a.score || 0), 0) / attempts.length
      : 0;

    const averageVstepScore = attempts.length > 0
      ? attempts.reduce((sum, a) => sum + (a.vstepScore || 0), 0) / attempts.length
      : 0;

    // Get skill progress
    const skillProgress = await this.getSkillProgressHistory(userId);

    // Get current streak
    const currentStreak = await this.analyticsRepository.getCurrentStreak(userId);

    // Get recent attempts
    const recentAttempts = attempts.slice(0, 10).map(a => ({
      attemptId: a.id,
      examTitle: a.examSet?.title || 'Unknown',
      completedAt: a.endedAt,
      vstepScore: a.vstepScore,
      duration: a.elapsedTime,
    }));

    // Get monthly activity
    const monthlyActivity = await this.analyticsRepository.getMonthlyActivity(userId);

    return {
      totalExams: completedExams + abandonedExams,
      completedExams,
      abandonedExams,
      averageScore,
      averageVstepScore,
      currentStreak,
      skillProgress,
      recentAttempts,
      monthlyActivity,
    };
  }

  /**
   * Get skill performance with trends
   */
  private async getSkillPerformance(userId: string): Promise<SkillPerformanceDto[]> {
    const skills = ['reading', 'listening', 'writing', 'speaking'];
    const performances: SkillPerformanceDto[] = [];

    for (const skill of skills) {
      const history = await this.analyticsRepository.getSkillPerformanceHistory(userId, skill);
      
      if (history.length === 0) {
        performances.push({
          skill,
          averageScore: 0,
          bestScore: 0,
          worstScore: 0,
          attemptCount: 0,
          trend: 'stable',
          trendPercentage: 0,
          recentScores: [],
        });
        continue;
      }

      const scores = history.map(h => h.score);
      const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      const bestScore = Math.max(...scores);
      const worstScore = Math.min(...scores);

      // Calculate trend (compare first half vs second half)
      const midpoint = Math.floor(scores.length / 2);
      const firstHalf = scores.slice(midpoint);
      const secondHalf = scores.slice(0, midpoint);
      
      const firstAvg = firstHalf.length > 0 ? firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length : 0;
      const secondAvg = secondHalf.length > 0 ? secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length : 0;
      
      const trendPercentage = firstAvg > 0 ? ((secondAvg - firstAvg) / firstAvg) * 100 : 0;
      const trend = trendPercentage > 5 ? 'improving' : trendPercentage < -5 ? 'declining' : 'stable';

      performances.push({
        skill,
        averageScore,
        bestScore,
        worstScore,
        attemptCount: history.length,
        trend,
        trendPercentage,
        recentScores: scores.slice(0, 5),
      });
    }

    return performances;
  }

  /**
   * Get time analytics for an attempt
   */
  private async getTimeAnalytics(attempt: ExamAttempt): Promise<TimeAnalyticsDto> {
    // Get all times for this exam set
    const allTimes = await this.analyticsRepository.getTimeDistribution(attempt.examSetId);

    const averageCompletionTime = allTimes.length > 0
      ? allTimes.reduce((a, b) => a + b, 0) / allTimes.length
      : 0;

    const fastestCompletionTime = allTimes.length > 0 ? Math.min(...allTimes) : 0;
    const slowestCompletionTime = allTimes.length > 0 ? Math.max(...allTimes) : 0;

    // Calculate time per skill from section times
    const timePerSkill: TimeAnalyticsDto['timePerSkill'] = [];
    if (attempt.sectionTimes) {
      for (const [sectionId, timing] of Object.entries(attempt.sectionTimes)) {
        const skill = attempt.sectionScores?.[sectionId]?.skill || 'unknown';
        const existingSkill = timePerSkill.find(t => t.skill === skill);
        
        if (existingSkill) {
          existingSkill.averageTime += timing.timeSpent;
          existingSkill.allocatedTime += timing.timeLimit;
        } else {
          timePerSkill.push({
            skill,
            averageTime: timing.timeSpent,
            allocatedTime: timing.timeLimit,
            efficiency: timing.timeLimit > 0 ? (timing.timeSpent / timing.timeLimit) * 100 : 0,
          });
        }
      }
    }

    // Calculate time distribution percentiles
    const timeDistribution: TimeAnalyticsDto['timeDistribution'] = [];
    const percentiles = [10, 25, 50, 75, 90];
    for (const p of percentiles) {
      const index = Math.floor(allTimes.length * (p / 100));
      timeDistribution.push({
        percentile: p,
        time: allTimes[index] || 0,
      });
    }

    return {
      averageCompletionTime,
      fastestCompletionTime,
      slowestCompletionTime,
      timePerSkill,
      timeDistribution,
    };
  }

  /**
   * Analyze question difficulty
   */
  private async getQuestionDifficulty(
    answers: ExamAnswer[],
  ): Promise<QuestionDifficultyDto[]> {
    const questionIds = answers.map(a => a.questionId);
    const difficultyStats = await this.analyticsRepository.getQuestionDifficultyStats(questionIds);

    return answers.map(answer => {
      const stats = difficultyStats.get(answer.questionId) || {
        correctRate: 50,
        avgTime: 60,
        totalAttempts: 0,
      };

      let difficulty: 'easy' | 'medium' | 'hard';
      if (stats.correctRate >= 70) {
        difficulty = 'easy';
      } else if (stats.correctRate >= 40) {
        difficulty = 'medium';
      } else {
        difficulty = 'hard';
      }

      return {
        questionId: answer.questionId,
        questionText: answer.question?.text?.substring(0, 100) || '',
        correctRate: stats.correctRate,
        averageTimeSpent: stats.avgTime,
        difficulty,
        userCorrect: answer.isCorrect || false,
        userTimeSpent: answer.timeSpent || 0,
      };
    });
  }

  /**
   * Detect error patterns
   */
  private async detectErrorPatterns(
    answers: ExamAnswer[],
  ): Promise<ErrorPatternDto[]> {
    const patterns: ErrorPatternDto[] = [];
    const incorrectAnswers = answers.filter(a => a.isCorrect === false);

    if (incorrectAnswers.length === 0) {
      return [{
        patternType: 'perfect',
        description: 'No errors detected - excellent performance!',
        frequency: 0,
        affectedQuestions: [],
        recommendation: 'Keep up the great work!',
      }];
    }

    // Analyze by question type
    const typeErrors: { [type: string]: ExamAnswer[] } = {};
    for (const answer of incorrectAnswers) {
      const type = answer.question?.type || 'unknown';
      if (!typeErrors[type]) {
        typeErrors[type] = [];
      }
      typeErrors[type].push(answer);
    }

    for (const [type, answers] of Object.entries(typeErrors)) {
      if (answers.length >= 2) {
        patterns.push({
          patternType: 'question_type',
          description: `Struggles with ${type.replace('_', ' ')} questions`,
          frequency: answers.length,
          affectedQuestions: answers.map(a => a.questionId),
          recommendation: this.getRecommendationForType(type),
        });
      }
    }

    // Analyze time-related errors
    const rushErrors = incorrectAnswers.filter(a => a.timeSpent < 30);
    if (rushErrors.length >= 2) {
      patterns.push({
        patternType: 'rushing',
        description: 'Rushing through questions (under 30 seconds each)',
        frequency: rushErrors.length,
        affectedQuestions: rushErrors.map(a => a.questionId),
        recommendation: 'Take more time to carefully read and analyze each question.',
      });
    }

    const slowErrors = incorrectAnswers.filter(a => a.timeSpent > 180);
    if (slowErrors.length >= 2) {
      patterns.push({
        patternType: 'overthinking',
        description: 'Spending too much time on questions (over 3 minutes)',
        frequency: slowErrors.length,
        affectedQuestions: slowErrors.map(a => a.questionId),
        recommendation: 'Practice time management. If unsure after 2 minutes, make your best guess and move on.',
      });
    }

    return patterns;
  }

  /**
   * Get overall stats
   */
  private async getOverallStats(
    userId: string,
    examSetId: string,
  ): Promise<ExamAnalyticsDto['overallStats']> {
    const attempts = await this.analyticsRepository.getUserAttempts(userId, { examSetId });
    
    const totalAttempts = attempts.length;
    const averageScore = totalAttempts > 0
      ? attempts.reduce((sum, a) => sum + (a.vstepScore || 0), 0) / totalAttempts
      : 0;
    const highestScore = totalAttempts > 0
      ? Math.max(...attempts.map(a => a.vstepScore || 0))
      : 0;

    const percentile = await this.analyticsRepository.getUserPercentile(userId, examSetId);
    const currentRank = Math.ceil((100 - percentile) / 10);

    return {
      totalAttempts,
      averageScore,
      highestScore,
      currentRank,
      percentile,
    };
  }

  /**
   * Get skill progress history
   */
  private async getSkillProgressHistory(userId: string) {
    const skills = ['reading', 'listening', 'writing', 'speaking'];
    const progress: UserExamHistoryDto['skillProgress'] = [];

    for (const skill of skills) {
      const history = await this.analyticsRepository.getSkillPerformanceHistory(userId, skill, 100);
      
      if (history.length === 0) continue;

      const scores = history.map(h => h.score);
      const firstScore = scores[scores.length - 1];
      const lastScore = scores[0];
      const improvement = lastScore - firstScore;

      progress.push({
        skill,
        firstScore,
        lastScore,
        improvement,
        examCount: history.length,
      });
    }

    return progress;
  }

  /**
   * Get recommendation for question type
   */
  private getRecommendationForType(type: string): string {
    const recommendations: { [key: string]: string } = {
      multiple_choice: 'Practice elimination technique - rule out wrong answers first.',
      true_false: 'Look for absolute words (always, never) which often indicate false statements.',
      fill_blank: 'Focus on grammar patterns and vocabulary building.',
      matching: 'Read all options first before matching.',
      essay: 'Practice structuring your essays with clear introduction, body, and conclusion.',
      speaking_task: 'Record yourself practicing and review for pronunciation and fluency.',
    };

    return recommendations[type] || 'Continue practicing to improve in this area.';
  }
}
```

### Step 4: Analytics Controller

```typescript
// src/modules/exams/controllers/exam-analytics.controller.ts
import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { ExamAnalyticsService } from '../services/exam-analytics.service';
import { ExamAnalyticsDto, UserExamHistoryDto, AnalyticsFilterDto } from '../dto/exam-analytics.dto';

@ApiTags('Exam Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('exams/analytics')
export class ExamAnalyticsController {
  constructor(private readonly analyticsService: ExamAnalyticsService) {}

  @Get('attempt/:attemptId')
  @ApiOperation({ summary: 'Get analytics for a specific attempt' })
  async getAttemptAnalytics(
    @Request() req,
    @Param('attemptId') attemptId: string,
  ): Promise<ExamAnalyticsDto> {
    return this.analyticsService.getAttemptAnalytics(attemptId, req.user.id);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get user exam history' })
  async getUserHistory(@Request() req): Promise<UserExamHistoryDto> {
    return this.analyticsService.getUserExamHistory(req.user.id);
  }
}
```

---

## ✅ Acceptance Criteria

- [ ] Skill performance tracks trends over time
- [ ] Time analytics shows efficiency
- [ ] Question difficulty calculated from global stats
- [ ] Error patterns detected and recommendations generated
- [ ] User percentile ranking works
- [ ] Monthly activity tracked
- [ ] Streak calculation accurate

---

## ⏭️ Next Task

→ `BE-025_EXAM_SESSION_MANAGEMENT.md` - Exam Session Management

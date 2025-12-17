# BE-013: Auto Scoring Service

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-013 |
| **Phase** | 1 - MVP |
| **Sprint** | 3-4 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 8h |
| **Dependencies** | BE-011, BE-012 |

---

## 🎯 Objective

Implement Auto Scoring Service cho Reading/Listening:
- Chấm điểm tự động cho trắc nghiệm
- Tính điểm theo thang VSTEP
- Thống kê kết quả chi tiết
- Integration với AI Service queue cho Writing

---

## 💻 Implementation

### Step 1: Scoring Interfaces

```typescript
// src/modules/scoring/interfaces/scoring.interface.ts
import { VstepLevel, Skill, QuestionType } from '@/shared/enums/practice.enums';

export interface AnswerSubmission {
  questionId: string;
  answer: string | string[];
  timeSpent: number; // seconds
}

export interface QuestionResult {
  questionId: string;
  isCorrect: boolean;
  pointsEarned: number;
  maxPoints: number;
  userAnswer: string | string[];
  correctAnswer: string;
  explanation?: string;
  timeSpent: number;
}

export interface SectionResult {
  sectionId?: string;
  skill: Skill;
  partNumber?: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  totalPoints: number;
  earnedPoints: number;
  percentage: number;
  questionResults: QuestionResult[];
}

export interface SessionScoreResult {
  sessionId: string;
  userId: string;
  skill: Skill;
  level: VstepLevel;
  overallScore: number;       // 0-10 scale
  vstepScore?: number;        // VSTEP score if applicable
  percentage: number;         // 0-100
  totalQuestions: number;
  correctCount: number;
  totalTimeSpent: number;
  averageTimePerQuestion: number;
  sectionResults: SectionResult[];
  completedAt: Date;
  suggestions: string[];
}

export interface VstepScoreMapping {
  level: VstepLevel;
  skill: Skill;
  minCorrect: number;
  maxCorrect: number;
  vstepScore: number;
}
```

### Step 2: VSTEP Score Calculator

```typescript
// src/modules/scoring/helpers/vstep-calculator.ts
import { VstepLevel, Skill } from '@/shared/enums/practice.enums';

/**
 * VSTEP Score Mapping Tables
 * Based on official VSTEP scoring guidelines
 */
export const VSTEP_SCORE_TABLES = {
  // Reading: 40 questions total
  reading: {
    A2: [
      { minCorrect: 0, maxCorrect: 10, score: 1 },
      { minCorrect: 11, maxCorrect: 15, score: 2 },
      { minCorrect: 16, maxCorrect: 20, score: 3 },
      { minCorrect: 21, maxCorrect: 25, score: 4 },
      { minCorrect: 26, maxCorrect: 30, score: 5 },
      { minCorrect: 31, maxCorrect: 35, score: 6 },
      { minCorrect: 36, maxCorrect: 40, score: 7 },
    ],
    B1: [
      { minCorrect: 0, maxCorrect: 12, score: 2 },
      { minCorrect: 13, maxCorrect: 18, score: 3 },
      { minCorrect: 19, maxCorrect: 24, score: 4 },
      { minCorrect: 25, maxCorrect: 30, score: 5 },
      { minCorrect: 31, maxCorrect: 35, score: 6 },
      { minCorrect: 36, maxCorrect: 38, score: 7 },
      { minCorrect: 39, maxCorrect: 40, score: 8 },
    ],
    B2: [
      { minCorrect: 0, maxCorrect: 15, score: 3 },
      { minCorrect: 16, maxCorrect: 22, score: 4 },
      { minCorrect: 23, maxCorrect: 28, score: 5 },
      { minCorrect: 29, maxCorrect: 33, score: 6 },
      { minCorrect: 34, maxCorrect: 37, score: 7 },
      { minCorrect: 38, maxCorrect: 39, score: 8 },
      { minCorrect: 40, maxCorrect: 40, score: 9 },
    ],
    C1: [
      { minCorrect: 0, maxCorrect: 18, score: 4 },
      { minCorrect: 19, maxCorrect: 25, score: 5 },
      { minCorrect: 26, maxCorrect: 31, score: 6 },
      { minCorrect: 32, maxCorrect: 36, score: 7 },
      { minCorrect: 37, maxCorrect: 39, score: 8 },
      { minCorrect: 40, maxCorrect: 40, score: 9 },
    ],
  },
  // Listening: 35 questions total
  listening: {
    A2: [
      { minCorrect: 0, maxCorrect: 8, score: 1 },
      { minCorrect: 9, maxCorrect: 12, score: 2 },
      { minCorrect: 13, maxCorrect: 17, score: 3 },
      { minCorrect: 18, maxCorrect: 22, score: 4 },
      { minCorrect: 23, maxCorrect: 27, score: 5 },
      { minCorrect: 28, maxCorrect: 32, score: 6 },
      { minCorrect: 33, maxCorrect: 35, score: 7 },
    ],
    B1: [
      { minCorrect: 0, maxCorrect: 10, score: 2 },
      { minCorrect: 11, maxCorrect: 15, score: 3 },
      { minCorrect: 16, maxCorrect: 20, score: 4 },
      { minCorrect: 21, maxCorrect: 25, score: 5 },
      { minCorrect: 26, maxCorrect: 30, score: 6 },
      { minCorrect: 31, maxCorrect: 33, score: 7 },
      { minCorrect: 34, maxCorrect: 35, score: 8 },
    ],
    B2: [
      { minCorrect: 0, maxCorrect: 12, score: 3 },
      { minCorrect: 13, maxCorrect: 18, score: 4 },
      { minCorrect: 19, maxCorrect: 23, score: 5 },
      { minCorrect: 24, maxCorrect: 28, score: 6 },
      { minCorrect: 29, maxCorrect: 32, score: 7 },
      { minCorrect: 33, maxCorrect: 34, score: 8 },
      { minCorrect: 35, maxCorrect: 35, score: 9 },
    ],
    C1: [
      { minCorrect: 0, maxCorrect: 15, score: 4 },
      { minCorrect: 16, maxCorrect: 21, score: 5 },
      { minCorrect: 22, maxCorrect: 26, score: 6 },
      { minCorrect: 27, maxCorrect: 31, score: 7 },
      { minCorrect: 32, maxCorrect: 34, score: 8 },
      { minCorrect: 35, maxCorrect: 35, score: 9 },
    ],
  },
};

export class VstepScoreCalculator {
  /**
   * Calculate VSTEP score from correct answers
   */
  static calculateVstepScore(
    skill: Skill,
    level: VstepLevel,
    correctCount: number,
  ): number {
    const skillKey = skill.toLowerCase() as keyof typeof VSTEP_SCORE_TABLES;
    const scoreTable = VSTEP_SCORE_TABLES[skillKey]?.[level];
    
    if (!scoreTable) {
      // For writing/speaking, return 0 - handled by AI scoring
      return 0;
    }

    for (const range of scoreTable) {
      if (correctCount >= range.minCorrect && correctCount <= range.maxCorrect) {
        return range.score;
      }
    }

    // Default to lowest score if no match
    return scoreTable[0]?.score || 0;
  }

  /**
   * Calculate percentage score
   */
  static calculatePercentage(correct: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
  }

  /**
   * Convert percentage to 10-point scale
   */
  static percentageToScore(percentage: number): number {
    return Math.round(percentage / 10 * 10) / 10; // Round to 1 decimal
  }

  /**
   * Get performance level based on percentage
   */
  static getPerformanceLevel(percentage: number): string {
    if (percentage >= 90) return 'excellent';
    if (percentage >= 80) return 'good';
    if (percentage >= 70) return 'average';
    if (percentage >= 60) return 'below_average';
    return 'needs_improvement';
  }

  /**
   * Generate suggestions based on results
   */
  static generateSuggestions(
    skill: Skill,
    level: VstepLevel,
    percentage: number,
    sectionResults: { partNumber?: number; percentage: number }[],
  ): string[] {
    const suggestions: string[] = [];
    const perfLevel = this.getPerformanceLevel(percentage);

    // Overall suggestions
    if (perfLevel === 'needs_improvement') {
      suggestions.push(`Bạn cần luyện tập thêm kỹ năng ${skill}. Hãy bắt đầu với các bài tập cơ bản.`);
    } else if (perfLevel === 'below_average') {
      suggestions.push(`Kết quả của bạn ở mức dưới trung bình. Hãy tập trung vào các dạng câu hỏi hay sai.`);
    } else if (perfLevel === 'average') {
      suggestions.push(`Bạn đang tiến bộ tốt! Tiếp tục luyện tập để cải thiện thêm.`);
    } else if (perfLevel === 'good') {
      suggestions.push(`Kết quả tốt! Hãy thử thách bản thân với các bài tập khó hơn.`);
    } else {
      suggestions.push(`Xuất sắc! Bạn đã sẵn sàng cho bài thi thật.`);
    }

    // Part-specific suggestions
    const weakParts = sectionResults
      .filter(s => s.percentage < 60 && s.partNumber)
      .sort((a, b) => a.percentage - b.percentage);

    for (const part of weakParts.slice(0, 2)) {
      suggestions.push(
        `Part ${part.partNumber} cần cải thiện (${part.percentage}%). Hãy luyện tập thêm dạng bài này.`
      );
    }

    // Level-specific suggestions
    if (percentage >= 80 && level !== 'C1') {
      const nextLevel = this.getNextLevel(level);
      suggestions.push(
        `Bạn có thể thử thách bản thân với cấp độ ${nextLevel}.`
      );
    }

    return suggestions;
  }

  private static getNextLevel(current: VstepLevel): VstepLevel {
    const levels: VstepLevel[] = ['A2', 'B1', 'B2', 'C1'];
    const index = levels.indexOf(current);
    return levels[Math.min(index + 1, levels.length - 1)];
  }
}
```

### Step 3: Scoring Service

```typescript
// src/modules/scoring/services/scoring.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PracticeSession } from '@/modules/practice/entities/practice-session.entity';
import { PracticeAnswer } from '@/modules/practice/entities/practice-answer.entity';
import { Question } from '@/modules/questions/entities/question.entity';
import { QuestionService } from '@/modules/questions/services/question.service';
import { AiScoringQueueService } from './ai-scoring-queue.service';
import { VstepScoreCalculator } from '../helpers/vstep-calculator';
import {
  AnswerSubmission,
  QuestionResult,
  SectionResult,
  SessionScoreResult,
} from '../interfaces/scoring.interface';
import { Skill } from '@/shared/enums/practice.enums';

@Injectable()
export class ScoringService {
  private readonly logger = new Logger(ScoringService.name);

  constructor(
    @InjectRepository(PracticeSession)
    private readonly sessionRepository: Repository<PracticeSession>,
    @InjectRepository(PracticeAnswer)
    private readonly answerRepository: Repository<PracticeAnswer>,
    private readonly questionService: QuestionService,
    private readonly aiQueueService: AiScoringQueueService,
  ) {}

  /**
   * Score a single answer (real-time feedback)
   */
  async scoreAnswer(
    questionId: string,
    answer: string | string[],
  ): Promise<QuestionResult> {
    const question = await this.questionService.findById(questionId);
    const validation = await this.questionService.validateAnswer(questionId, answer);

    return {
      questionId,
      isCorrect: validation.isCorrect,
      pointsEarned: validation.isCorrect ? question.points : 0,
      maxPoints: question.points,
      userAnswer: answer,
      correctAnswer: validation.correctAnswer || '',
      explanation: validation.explanation,
      timeSpent: 0, // Will be set by caller
    };
  }

  /**
   * Score entire practice session
   */
  async scoreSession(sessionId: string): Promise<SessionScoreResult> {
    this.logger.log(`Scoring session: ${sessionId}`);

    // Get session with answers
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['answers', 'answers.question', 'answers.question.options'],
    });

    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    // Get all questions for this session
    const questionIds = session.answers.map(a => a.questionId);
    const questions = await this.questionService.findAll(
      { search: '' },
      { page: 1, limit: questionIds.length }
    ).then(r => r.items.filter(q => questionIds.includes(q.id)));

    // Score each answer
    const questionResults: QuestionResult[] = [];
    let correctCount = 0;
    let totalPoints = 0;
    let earnedPoints = 0;
    let totalTimeSpent = 0;

    // Group by part for section results
    const partResults: Map<number, QuestionResult[]> = new Map();

    for (const answer of session.answers) {
      const question = questions.find(q => q.id === answer.questionId);
      if (!question) continue;

      const isCorrect = answer.isCorrect ?? false;
      const points = question.points || 1;

      const result: QuestionResult = {
        questionId: question.id,
        isCorrect,
        pointsEarned: isCorrect ? points : 0,
        maxPoints: points,
        userAnswer: answer.answer || answer.selectedOptionId || '',
        correctAnswer: question.correctAnswer || '',
        explanation: question.explanation,
        timeSpent: answer.timeSpent || 0,
      };

      questionResults.push(result);
      totalPoints += points;
      earnedPoints += result.pointsEarned;
      totalTimeSpent += result.timeSpent;
      
      if (isCorrect) correctCount++;

      // Group by part
      const partNum = question.partNumber || 0;
      if (!partResults.has(partNum)) {
        partResults.set(partNum, []);
      }
      partResults.get(partNum)!.push(result);
    }

    // Build section results
    const sectionResults: SectionResult[] = [];
    for (const [partNumber, results] of partResults) {
      const partCorrect = results.filter(r => r.isCorrect).length;
      const partSkipped = results.filter(r => !r.userAnswer).length;
      const partPoints = results.reduce((sum, r) => sum + r.maxPoints, 0);
      const partEarned = results.reduce((sum, r) => sum + r.pointsEarned, 0);

      sectionResults.push({
        skill: session.skill,
        partNumber: partNumber || undefined,
        totalQuestions: results.length,
        correctCount: partCorrect,
        incorrectCount: results.length - partCorrect - partSkipped,
        skippedCount: partSkipped,
        totalPoints: partPoints,
        earnedPoints: partEarned,
        percentage: VstepScoreCalculator.calculatePercentage(partCorrect, results.length),
        questionResults: results,
      });
    }

    // Sort section results by part number
    sectionResults.sort((a, b) => (a.partNumber || 0) - (b.partNumber || 0));

    // Calculate overall scores
    const percentage = VstepScoreCalculator.calculatePercentage(
      correctCount,
      questionResults.length
    );

    const overallScore = VstepScoreCalculator.percentageToScore(percentage);

    const vstepScore = VstepScoreCalculator.calculateVstepScore(
      session.skill,
      session.level,
      correctCount
    );

    // Generate suggestions
    const suggestions = VstepScoreCalculator.generateSuggestions(
      session.skill,
      session.level,
      percentage,
      sectionResults.map(s => ({ partNumber: s.partNumber, percentage: s.percentage }))
    );

    // Build final result
    const result: SessionScoreResult = {
      sessionId,
      userId: session.userId,
      skill: session.skill,
      level: session.level,
      overallScore,
      vstepScore: vstepScore > 0 ? vstepScore : undefined,
      percentage,
      totalQuestions: questionResults.length,
      correctCount,
      totalTimeSpent,
      averageTimePerQuestion: questionResults.length > 0 
        ? Math.round(totalTimeSpent / questionResults.length) 
        : 0,
      sectionResults,
      completedAt: new Date(),
      suggestions,
    };

    // Update session with score
    session.score = overallScore;
    session.correctCount = correctCount;
    session.totalTimeSpent = totalTimeSpent;
    session.completedAt = new Date();
    await this.sessionRepository.save(session);

    this.logger.log(`Session ${sessionId} scored: ${overallScore}/10 (${percentage}%)`);

    return result;
  }

  /**
   * Queue writing answer for AI scoring
   */
  async queueWritingForAiScoring(
    sessionId: string,
    questionId: string,
    answer: string,
  ): Promise<{ jobId: string; estimatedTime: number }> {
    const job = await this.aiQueueService.addWritingJob({
      sessionId,
      questionId,
      answer,
      submittedAt: new Date(),
    });

    return {
      jobId: job.id,
      estimatedTime: 5, // seconds
    };
  }

  /**
   * Get scoring result for a session
   */
  async getSessionResult(sessionId: string): Promise<SessionScoreResult | null> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    });

    if (!session || session.status !== 'completed') {
      return null;
    }

    // Re-calculate and return
    return this.scoreSession(sessionId);
  }

  /**
   * Batch score multiple answers (for auto-grading on submit)
   */
  async batchScoreAnswers(
    answers: AnswerSubmission[],
  ): Promise<QuestionResult[]> {
    const results: QuestionResult[] = [];

    for (const submission of answers) {
      try {
        const result = await this.scoreAnswer(
          submission.questionId,
          submission.answer
        );
        result.timeSpent = submission.timeSpent;
        results.push(result);
      } catch (error) {
        this.logger.error(`Error scoring question ${submission.questionId}:`, error);
        // Skip failed questions
      }
    }

    return results;
  }
}
```

### Step 4: AI Scoring Queue Service

```typescript
// src/modules/scoring/services/ai-scoring-queue.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue, Job } from 'bull';
import { AiScoringJob } from '../entities/ai-scoring-job.entity';

export interface WritingJobPayload {
  sessionId: string;
  questionId: string;
  answer: string;
  submittedAt: Date;
}

export interface SpeakingJobPayload {
  sessionId: string;
  questionId: string;
  audioUrl: string;
  submittedAt: Date;
}

@Injectable()
export class AiScoringQueueService implements OnModuleInit {
  private readonly logger = new Logger(AiScoringQueueService.name);

  constructor(
    @InjectQueue('ai-scoring')
    private readonly scoringQueue: Queue,
    @InjectRepository(AiScoringJob)
    private readonly jobRepository: Repository<AiScoringJob>,
  ) {}

  async onModuleInit() {
    // Set up queue event listeners
    this.scoringQueue.on('completed', this.handleCompleted.bind(this));
    this.scoringQueue.on('failed', this.handleFailed.bind(this));
    this.scoringQueue.on('progress', this.handleProgress.bind(this));
  }

  /**
   * Add writing scoring job to queue
   */
  async addWritingJob(payload: WritingJobPayload): Promise<AiScoringJob> {
    // Create job record in DB
    const job = this.jobRepository.create({
      type: 'writing',
      sessionId: payload.sessionId,
      questionId: payload.questionId,
      payload: JSON.stringify(payload),
      status: 'pending',
    });
    await this.jobRepository.save(job);

    // Add to Bull queue
    const queueJob = await this.scoringQueue.add('score-writing', {
      jobId: job.id,
      ...payload,
    }, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    });

    this.logger.log(`Writing job ${job.id} added to queue (Bull job: ${queueJob.id})`);
    return job;
  }

  /**
   * Add speaking scoring job to queue
   */
  async addSpeakingJob(payload: SpeakingJobPayload): Promise<AiScoringJob> {
    const job = this.jobRepository.create({
      type: 'speaking',
      sessionId: payload.sessionId,
      questionId: payload.questionId,
      payload: JSON.stringify(payload),
      status: 'pending',
    });
    await this.jobRepository.save(job);

    const queueJob = await this.scoringQueue.add('score-speaking', {
      jobId: job.id,
      ...payload,
    }, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });

    this.logger.log(`Speaking job ${job.id} added to queue (Bull job: ${queueJob.id})`);
    return job;
  }

  /**
   * Get job status
   */
  async getJobStatus(jobId: string): Promise<AiScoringJob | null> {
    return this.jobRepository.findOne({ where: { id: jobId } });
  }

  /**
   * Get pending jobs count
   */
  async getPendingCount(): Promise<number> {
    return this.jobRepository.count({ where: { status: 'pending' } });
  }

  private async handleCompleted(job: Job, result: any) {
    this.logger.log(`Job ${job.data.jobId} completed`);
    
    await this.jobRepository.update(job.data.jobId, {
      status: 'completed',
      result: JSON.stringify(result),
      completedAt: new Date(),
      processingTime: Date.now() - job.timestamp,
    });
  }

  private async handleFailed(job: Job, error: Error) {
    this.logger.error(`Job ${job.data.jobId} failed: ${error.message}`);
    
    await this.jobRepository.update(job.data.jobId, {
      status: 'failed',
      errorMessage: error.message,
      completedAt: new Date(),
    });
  }

  private async handleProgress(job: Job, progress: number) {
    await this.jobRepository.update(job.data.jobId, {
      status: 'processing',
    });
  }
}
```

### Step 5: Scoring Controller

```typescript
// src/modules/scoring/controllers/scoring.controller.ts
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { ScoringService } from '../services/scoring.service';
import { AiScoringQueueService } from '../services/ai-scoring-queue.service';

@ApiTags('Scoring')
@Controller('scoring')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ScoringController {
  constructor(
    private readonly scoringService: ScoringService,
    private readonly aiQueueService: AiScoringQueueService,
  ) {}

  @Post('sessions/:sessionId/score')
  @ApiOperation({ summary: 'Score a practice session' })
  @ApiResponse({ status: 200, description: 'Session scored successfully' })
  async scoreSession(@Param('sessionId', ParseUUIDPipe) sessionId: string) {
    return this.scoringService.scoreSession(sessionId);
  }

  @Get('sessions/:sessionId/result')
  @ApiOperation({ summary: 'Get scoring result for a session' })
  async getSessionResult(@Param('sessionId', ParseUUIDPipe) sessionId: string) {
    return this.scoringService.getSessionResult(sessionId);
  }

  @Post('questions/:questionId/validate')
  @ApiOperation({ summary: 'Validate a single answer' })
  async validateAnswer(
    @Param('questionId', ParseUUIDPipe) questionId: string,
    @Body('answer') answer: string | string[],
  ) {
    return this.scoringService.scoreAnswer(questionId, answer);
  }

  @Post('writing/queue')
  @ApiOperation({ summary: 'Queue writing answer for AI scoring' })
  async queueWritingForScoring(
    @Body() body: { sessionId: string; questionId: string; answer: string },
  ) {
    return this.scoringService.queueWritingForAiScoring(
      body.sessionId,
      body.questionId,
      body.answer,
    );
  }

  @Get('jobs/:jobId/status')
  @ApiOperation({ summary: 'Get AI scoring job status' })
  async getJobStatus(@Param('jobId', ParseUUIDPipe) jobId: string) {
    return this.aiQueueService.getJobStatus(jobId);
  }

  @Get('queue/stats')
  @ApiOperation({ summary: 'Get scoring queue statistics' })
  async getQueueStats() {
    const pendingCount = await this.aiQueueService.getPendingCount();
    return { pendingJobs: pendingCount };
  }
}
```

### Step 6: Scoring Module

```typescript
// src/modules/scoring/scoring.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { PracticeSession } from '@/modules/practice/entities/practice-session.entity';
import { PracticeAnswer } from '@/modules/practice/entities/practice-answer.entity';
import { AiScoringJob } from './entities/ai-scoring-job.entity';
import { ScoringService } from './services/scoring.service';
import { AiScoringQueueService } from './services/ai-scoring-queue.service';
import { ScoringController } from './controllers/scoring.controller';
import { QuestionModule } from '@/modules/questions/question.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PracticeSession, PracticeAnswer, AiScoringJob]),
    BullModule.registerQueue({
      name: 'ai-scoring',
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    QuestionModule,
  ],
  controllers: [ScoringController],
  providers: [ScoringService, AiScoringQueueService],
  exports: [ScoringService, AiScoringQueueService],
})
export class ScoringModule {}
```

---

## ✅ Acceptance Criteria

- [ ] Real-time answer validation works
- [ ] Session scoring calculates correctly
- [ ] VSTEP score mapping accurate
- [ ] AI job queue functional
- [ ] Section-level statistics correct
- [ ] Suggestions generated based on performance
- [ ] Queue handles retries on failure

---

## ⏭️ Next Task

→ `BE-014_EXAM_SET_SERVICE.md` - Exam Set CRUD Service

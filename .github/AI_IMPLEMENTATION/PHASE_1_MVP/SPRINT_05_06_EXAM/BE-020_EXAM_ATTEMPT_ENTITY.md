# BE-020: Exam Attempt Entity & Management

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-020 |
| **Phase** | 1 - MVP |
| **Sprint** | 5-6 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 6h |
| **Dependencies** | BE-010, BE-014 |

---

## 🎯 Objective

Implement Exam Attempt Entity và service với:
- Full exam attempt lifecycle
- Auto-save mỗi 10 giây
- Section tracking
- Time management

---

## 💻 Implementation

### Step 1: Exam Attempt Entity

```typescript
// src/modules/exams/entities/exam-attempt.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from '@/modules/users/entities/user.entity';
import { ExamSet } from './exam-set.entity';
import { ExamSection } from './exam-section.entity';
import { ExamAnswer } from './exam-answer.entity';

export enum AttemptStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
  TIMED_OUT = 'timed_out',
}

@Entity('exam_attempts')
@Index(['userId', 'examSetId'])
@Index(['userId', 'status'])
@Index(['createdAt'])
export class ExamAttempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'exam_set_id' })
  examSetId: string;

  @ManyToOne(() => ExamSet)
  @JoinColumn({ name: 'exam_set_id' })
  examSet: ExamSet;

  @Column({
    type: 'enum',
    enum: AttemptStatus,
    default: AttemptStatus.NOT_STARTED,
  })
  status: AttemptStatus;

  // Current section being attempted
  @Column({ name: 'current_section_id', nullable: true })
  currentSectionId: string;

  @ManyToOne(() => ExamSection, { nullable: true })
  @JoinColumn({ name: 'current_section_id' })
  currentSection: ExamSection;

  @Column({ name: 'current_question_index', default: 0 })
  currentQuestionIndex: number;

  // Timing
  @Column({ name: 'started_at', type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ name: 'ended_at', type: 'timestamp', nullable: true })
  endedAt: Date;

  @Column({ name: 'paused_at', type: 'timestamp', nullable: true })
  pausedAt: Date;

  @Column({ name: 'total_paused_time', type: 'int', default: 0 })
  totalPausedTime: number; // seconds

  @Column({ name: 'time_limit', type: 'int', nullable: true })
  timeLimit: number; // seconds

  @Column({ name: 'time_remaining', type: 'int', nullable: true })
  timeRemaining: number; // seconds

  // Section-level timing
  @Column({ name: 'section_times', type: 'json', nullable: true })
  sectionTimes: {
    [sectionId: string]: {
      startedAt: string;
      endedAt?: string;
      timeSpent: number;
      timeLimit: number;
    };
  };

  // Scoring
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  score: number;

  @Column({ name: 'section_scores', type: 'json', nullable: true })
  sectionScores: {
    [sectionId: string]: {
      score: number;
      correctCount: number;
      totalCount: number;
      skill: string;
    };
  };

  @Column({ name: 'vstep_score', type: 'decimal', precision: 3, scale: 1, nullable: true })
  vstepScore: number; // 0-10 scale

  // Auto-save
  @Column({ name: 'auto_save_version', type: 'int', default: 0 })
  autoSaveVersion: number;

  @Column({ name: 'last_auto_save', type: 'timestamp', nullable: true })
  lastAutoSave: Date;

  // Browser/session info for recovery
  @Column({ name: 'session_fingerprint', nullable: true })
  sessionFingerprint: string;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress: string;

  // Answers relation
  @OneToMany(() => ExamAnswer, (answer) => answer.attempt, { cascade: true })
  answers: ExamAnswer[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Computed properties
  get isCompleted(): boolean {
    return this.status === AttemptStatus.COMPLETED;
  }

  get isInProgress(): boolean {
    return this.status === AttemptStatus.IN_PROGRESS;
  }

  get elapsedTime(): number {
    if (!this.startedAt) return 0;
    const end = this.endedAt || new Date();
    return Math.floor((end.getTime() - this.startedAt.getTime()) / 1000) - this.totalPausedTime;
  }
}
```

### Step 2: Exam Answer Entity

```typescript
// src/modules/exams/entities/exam-answer.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ExamAttempt } from './exam-attempt.entity';
import { Question } from './question.entity';
import { ExamSection } from './exam-section.entity';

@Entity('exam_answers')
@Index(['attemptId', 'questionId'], { unique: true })
@Index(['attemptId', 'sectionId'])
export class ExamAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'attempt_id' })
  attemptId: string;

  @ManyToOne(() => ExamAttempt, (attempt) => attempt.answers)
  @JoinColumn({ name: 'attempt_id' })
  attempt: ExamAttempt;

  @Column({ name: 'question_id' })
  questionId: string;

  @ManyToOne(() => Question)
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @Column({ name: 'section_id' })
  sectionId: string;

  @ManyToOne(() => ExamSection)
  @JoinColumn({ name: 'section_id' })
  section: ExamSection;

  // Answer content
  @Column({ type: 'text', nullable: true })
  answer: string;

  @Column({ name: 'selected_option_id', nullable: true })
  selectedOptionId: string;

  // For Writing/Speaking - rich content
  @Column({ name: 'rich_content', type: 'text', nullable: true })
  richContent: string;

  @Column({ name: 'audio_url', nullable: true })
  audioUrl: string;

  // Scoring
  @Column({ name: 'is_correct', nullable: true })
  isCorrect: boolean;

  @Column({ name: 'points_earned', type: 'decimal', precision: 5, scale: 2, nullable: true })
  pointsEarned: number;

  @Column({ name: 'max_points', type: 'decimal', precision: 5, scale: 2, default: 1 })
  maxPoints: number;

  // AI Scoring for Writing/Speaking
  @Column({ name: 'ai_score', type: 'json', nullable: true })
  aiScore: {
    overall: number;
    criteria: { [key: string]: number };
    feedback?: string;
    suggestions?: string[];
    grammarErrors?: any[];
  };

  @Column({ name: 'ai_scored_at', type: 'timestamp', nullable: true })
  aiScoredAt: Date;

  // Time tracking
  @Column({ name: 'time_spent', type: 'int', default: 0 })
  timeSpent: number; // seconds

  @Column({ name: 'first_answered_at', type: 'timestamp', nullable: true })
  firstAnsweredAt: Date;

  @Column({ name: 'last_modified_at', type: 'timestamp', nullable: true })
  lastModifiedAt: Date;

  // Flags
  @Column({ name: 'is_flagged', default: false })
  isFlagged: boolean;

  @Column({ name: 'is_skipped', default: false })
  isSkipped: boolean;

  @Column({ name: 'answer_count', type: 'int', default: 0 })
  answerCount: number; // How many times changed

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### Step 3: DTOs

```typescript
// src/modules/exams/dto/exam-attempt.dto.ts
import {
  IsString,
  IsUUID,
  IsEnum,
  IsOptional,
  IsInt,
  IsBoolean,
  ValidateNested,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StartExamDto {
  @ApiProperty()
  @IsUUID()
  examSetId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sessionFingerprint?: string;
}

export class SubmitAnswerDto {
  @ApiProperty()
  @IsUUID()
  questionId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  answer?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  selectedOptionId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  richContent?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  timeSpent?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isFlagged?: boolean;
}

export class BulkSubmitAnswersDto {
  @ApiProperty({ type: [SubmitAnswerDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubmitAnswerDto)
  answers: SubmitAnswerDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  autoSaveVersion?: number;
}

export class NavigateSectionDto {
  @ApiProperty()
  @IsUUID()
  sectionId: string;
}

export class UpdateProgressDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  currentQuestionIndex?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  timeRemaining?: number;
}

// Response DTOs
export class ExamAttemptResponseDto {
  id: string;
  examSetId: string;
  status: string;
  currentSectionId: string;
  currentQuestionIndex: number;
  startedAt: Date;
  timeRemaining: number;
  autoSaveVersion: number;
  progress: {
    totalQuestions: number;
    answeredQuestions: number;
    flaggedQuestions: number;
    sectionProgress: { [sectionId: string]: number };
  };
}

export class ExamResultDto {
  attemptId: string;
  examSetId: string;
  completedAt: Date;
  totalTime: number;
  overallScore: number;
  vstepScore: number;
  sectionScores: {
    skill: string;
    score: number;
    correctCount: number;
    totalCount: number;
    vstepScore: number;
  }[];
  answers: {
    questionId: string;
    isCorrect: boolean;
    pointsEarned: number;
    aiScore?: any;
  }[];
}
```

### Step 4: Exam Attempt Service

```typescript
// src/modules/exams/services/exam-attempt.service.ts
import { 
  Injectable, 
  NotFoundException, 
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ExamAttempt, AttemptStatus } from '../entities/exam-attempt.entity';
import { ExamAnswer } from '../entities/exam-answer.entity';
import { ExamSet } from '../entities/exam-set.entity';
import { ExamSection } from '../entities/exam-section.entity';
import { Question } from '../entities/question.entity';
import {
  StartExamDto,
  SubmitAnswerDto,
  BulkSubmitAnswersDto,
  ExamAttemptResponseDto,
  ExamResultDto,
} from '../dto/exam-attempt.dto';
import { ScoringService } from '@/modules/practice/services/scoring.service';
import { CacheService } from '@/core/cache/cache.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ExamAttemptService {
  constructor(
    @InjectRepository(ExamAttempt)
    private readonly attemptRepository: Repository<ExamAttempt>,
    @InjectRepository(ExamAnswer)
    private readonly answerRepository: Repository<ExamAnswer>,
    @InjectRepository(ExamSet)
    private readonly examSetRepository: Repository<ExamSet>,
    @InjectRepository(ExamSection)
    private readonly sectionRepository: Repository<ExamSection>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    private readonly dataSource: DataSource,
    private readonly scoringService: ScoringService,
    private readonly cacheService: CacheService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Start a new exam attempt
   */
  async startExam(
    userId: string,
    dto: StartExamDto,
    requestInfo: { userAgent: string; ipAddress: string },
  ): Promise<ExamAttemptResponseDto> {
    // Check if exam set exists and is active
    const examSet = await this.examSetRepository.findOne({
      where: { id: dto.examSetId, isActive: true },
      relations: ['sections'],
    });

    if (!examSet) {
      throw new NotFoundException('Exam set not found or not available');
    }

    // Check for existing in-progress attempt
    const existingAttempt = await this.attemptRepository.findOne({
      where: { 
        userId, 
        examSetId: dto.examSetId, 
        status: AttemptStatus.IN_PROGRESS 
      },
    });

    if (existingAttempt) {
      // Return existing attempt for resume
      return this.formatAttemptResponse(existingAttempt);
    }

    // Check daily attempt limit (optional)
    const todayAttempts = await this.getTodayAttemptCount(userId);
    const dailyLimit = 5; // Configure via settings
    if (todayAttempts >= dailyLimit) {
      throw new BadRequestException('Daily exam limit reached');
    }

    // Get first section
    const firstSection = examSet.sections.sort((a, b) => a.orderIndex - b.orderIndex)[0];
    if (!firstSection) {
      throw new BadRequestException('Exam has no sections');
    }

    // Calculate total time limit
    const totalTimeLimit = examSet.sections.reduce((sum, s) => sum + (s.duration * 60), 0);

    // Create attempt
    const attempt = this.attemptRepository.create({
      userId,
      examSetId: dto.examSetId,
      status: AttemptStatus.IN_PROGRESS,
      currentSectionId: firstSection.id,
      currentQuestionIndex: 0,
      startedAt: new Date(),
      timeLimit: totalTimeLimit,
      timeRemaining: totalTimeLimit,
      sectionTimes: this.initializeSectionTimes(examSet.sections),
      sessionFingerprint: dto.sessionFingerprint,
      userAgent: requestInfo.userAgent,
      ipAddress: requestInfo.ipAddress,
    });

    await this.attemptRepository.save(attempt);

    // Emit event
    this.eventEmitter.emit('exam.started', { userId, attemptId: attempt.id });

    return this.formatAttemptResponse(attempt);
  }

  /**
   * Submit an answer
   */
  async submitAnswer(
    attemptId: string,
    userId: string,
    dto: SubmitAnswerDto,
  ): Promise<ExamAnswer> {
    const attempt = await this.getValidAttempt(attemptId, userId);

    // Get or create answer
    let answer = await this.answerRepository.findOne({
      where: { attemptId, questionId: dto.questionId },
    });

    const now = new Date();

    if (answer) {
      // Update existing answer
      answer.answer = dto.answer ?? answer.answer;
      answer.selectedOptionId = dto.selectedOptionId ?? answer.selectedOptionId;
      answer.richContent = dto.richContent ?? answer.richContent;
      answer.timeSpent = (answer.timeSpent || 0) + (dto.timeSpent || 0);
      answer.lastModifiedAt = now;
      answer.answerCount += 1;
      if (dto.isFlagged !== undefined) {
        answer.isFlagged = dto.isFlagged;
      }
    } else {
      // Get question to determine section
      const question = await this.questionRepository.findOne({
        where: { id: dto.questionId },
        relations: ['passage'],
      });

      if (!question) {
        throw new NotFoundException('Question not found');
      }

      // Create new answer
      answer = this.answerRepository.create({
        attemptId,
        questionId: dto.questionId,
        sectionId: attempt.currentSectionId,
        answer: dto.answer,
        selectedOptionId: dto.selectedOptionId,
        richContent: dto.richContent,
        timeSpent: dto.timeSpent || 0,
        firstAnsweredAt: now,
        lastModifiedAt: now,
        isFlagged: dto.isFlagged || false,
        answerCount: 1,
      });
    }

    await this.answerRepository.save(answer);

    // Update attempt auto-save
    attempt.autoSaveVersion += 1;
    attempt.lastAutoSave = now;
    await this.attemptRepository.save(attempt);

    return answer;
  }

  /**
   * Bulk submit answers (for auto-save)
   */
  async bulkSubmitAnswers(
    attemptId: string,
    userId: string,
    dto: BulkSubmitAnswersDto,
  ): Promise<{ savedCount: number; version: number }> {
    const attempt = await this.getValidAttempt(attemptId, userId);

    // Skip if version is older
    if (dto.autoSaveVersion && dto.autoSaveVersion <= attempt.autoSaveVersion) {
      return { savedCount: 0, version: attempt.autoSaveVersion };
    }

    let savedCount = 0;

    for (const answerDto of dto.answers) {
      try {
        await this.submitAnswer(attemptId, userId, answerDto);
        savedCount++;
      } catch (error) {
        console.error(`Failed to save answer for question ${answerDto.questionId}:`, error);
      }
    }

    return { savedCount, version: attempt.autoSaveVersion };
  }

  /**
   * Navigate to a section
   */
  async navigateToSection(
    attemptId: string,
    userId: string,
    sectionId: string,
  ): Promise<ExamAttemptResponseDto> {
    const attempt = await this.getValidAttempt(attemptId, userId);

    // Update section times for previous section
    if (attempt.currentSectionId && attempt.sectionTimes) {
      const prevSection = attempt.sectionTimes[attempt.currentSectionId];
      if (prevSection && !prevSection.endedAt) {
        prevSection.endedAt = new Date().toISOString();
        prevSection.timeSpent = Math.floor(
          (new Date(prevSection.endedAt).getTime() - new Date(prevSection.startedAt).getTime()) / 1000
        );
      }
    }

    // Start timing for new section
    if (!attempt.sectionTimes) {
      attempt.sectionTimes = {};
    }
    if (!attempt.sectionTimes[sectionId]) {
      const section = await this.sectionRepository.findOne({ where: { id: sectionId } });
      attempt.sectionTimes[sectionId] = {
        startedAt: new Date().toISOString(),
        timeSpent: 0,
        timeLimit: (section?.duration || 60) * 60,
      };
    }

    attempt.currentSectionId = sectionId;
    attempt.currentQuestionIndex = 0;
    await this.attemptRepository.save(attempt);

    return this.formatAttemptResponse(attempt);
  }

  /**
   * Pause exam
   */
  async pauseExam(attemptId: string, userId: string): Promise<void> {
    const attempt = await this.getValidAttempt(attemptId, userId);

    attempt.status = AttemptStatus.PAUSED;
    attempt.pausedAt = new Date();
    await this.attemptRepository.save(attempt);
  }

  /**
   * Resume exam
   */
  async resumeExam(attemptId: string, userId: string): Promise<ExamAttemptResponseDto> {
    const attempt = await this.attemptRepository.findOne({
      where: { id: attemptId, userId },
    });

    if (!attempt) {
      throw new NotFoundException('Exam attempt not found');
    }

    if (attempt.status !== AttemptStatus.PAUSED) {
      throw new BadRequestException('Exam is not paused');
    }

    // Calculate paused duration
    if (attempt.pausedAt) {
      const pauseDuration = Math.floor((Date.now() - attempt.pausedAt.getTime()) / 1000);
      attempt.totalPausedTime += pauseDuration;
    }

    attempt.status = AttemptStatus.IN_PROGRESS;
    attempt.pausedAt = null;
    await this.attemptRepository.save(attempt);

    return this.formatAttemptResponse(attempt);
  }

  /**
   * Submit exam (complete)
   */
  async submitExam(attemptId: string, userId: string): Promise<ExamResultDto> {
    const attempt = await this.getValidAttempt(attemptId, userId);

    attempt.status = AttemptStatus.COMPLETED;
    attempt.endedAt = new Date();

    // Score all answers
    const answers = await this.answerRepository.find({
      where: { attemptId },
      relations: ['question', 'question.options'],
    });

    const sectionScores: { [key: string]: any } = {};

    for (const answer of answers) {
      // Score the answer
      const { isCorrect, points } = await this.scoringService.scoreAnswer(
        answer.question,
        answer.answer || answer.selectedOptionId,
      );

      answer.isCorrect = isCorrect;
      answer.pointsEarned = points;
      await this.answerRepository.save(answer);

      // Aggregate section scores
      const sectionId = answer.sectionId;
      if (!sectionScores[sectionId]) {
        const section = await this.sectionRepository.findOne({ where: { id: sectionId } });
        sectionScores[sectionId] = {
          skill: section?.skill || 'unknown',
          correct: 0,
          total: 0,
          points: 0,
          maxPoints: 0,
        };
      }
      sectionScores[sectionId].total++;
      sectionScores[sectionId].maxPoints += answer.maxPoints;
      if (isCorrect) {
        sectionScores[sectionId].correct++;
        sectionScores[sectionId].points += points;
      }
    }

    // Calculate overall score
    const totalPoints = Object.values(sectionScores).reduce((sum: number, s: any) => sum + s.points, 0);
    const maxPoints = Object.values(sectionScores).reduce((sum: number, s: any) => sum + s.maxPoints, 0);
    attempt.score = maxPoints > 0 ? (totalPoints / maxPoints) * 100 : 0;

    // Calculate VSTEP score
    attempt.vstepScore = this.scoringService.calculateVstepScore(
      attempt.score,
      answers[0]?.question?.level || 'B1',
    );

    // Format and save section scores
    attempt.sectionScores = {};
    for (const [sectionId, scores] of Object.entries(sectionScores)) {
      attempt.sectionScores[sectionId] = {
        score: scores.maxPoints > 0 ? (scores.points / scores.maxPoints) * 100 : 0,
        correctCount: scores.correct,
        totalCount: scores.total,
        skill: scores.skill,
      };
    }

    await this.attemptRepository.save(attempt);

    // Emit completion event
    this.eventEmitter.emit('exam.completed', { 
      userId, 
      attemptId: attempt.id,
      score: attempt.score,
      vstepScore: attempt.vstepScore,
    });

    return this.formatResultResponse(attempt, answers);
  }

  /**
   * Handle timeout
   */
  async handleTimeout(attemptId: string, userId: string): Promise<ExamResultDto> {
    const attempt = await this.attemptRepository.findOne({
      where: { id: attemptId, userId },
    });

    if (!attempt || attempt.status === AttemptStatus.COMPLETED) {
      throw new BadRequestException('Cannot timeout this exam');
    }

    attempt.status = AttemptStatus.TIMED_OUT;
    attempt.endedAt = new Date();
    await this.attemptRepository.save(attempt);

    // Score what was answered
    return this.submitExam(attemptId, userId);
  }

  /**
   * Get attempt by ID
   */
  async getAttempt(attemptId: string, userId: string): Promise<ExamAttemptResponseDto> {
    const attempt = await this.attemptRepository.findOne({
      where: { id: attemptId, userId },
      relations: ['examSet', 'currentSection', 'answers'],
    });

    if (!attempt) {
      throw new NotFoundException('Exam attempt not found');
    }

    return this.formatAttemptResponse(attempt);
  }

  /**
   * Get result
   */
  async getResult(attemptId: string, userId: string): Promise<ExamResultDto> {
    const attempt = await this.attemptRepository.findOne({
      where: { id: attemptId, userId, status: AttemptStatus.COMPLETED },
      relations: ['answers', 'answers.question'],
    });

    if (!attempt) {
      throw new NotFoundException('Exam result not found');
    }

    return this.formatResultResponse(attempt, attempt.answers);
  }

  // Helper methods
  private async getValidAttempt(attemptId: string, userId: string): Promise<ExamAttempt> {
    const attempt = await this.attemptRepository.findOne({
      where: { id: attemptId, userId },
    });

    if (!attempt) {
      throw new NotFoundException('Exam attempt not found');
    }

    if (attempt.status === AttemptStatus.COMPLETED) {
      throw new BadRequestException('Exam is already completed');
    }

    if (attempt.status === AttemptStatus.PAUSED) {
      throw new BadRequestException('Exam is paused. Please resume first.');
    }

    return attempt;
  }

  private async getTodayAttemptCount(userId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.attemptRepository.count({
      where: {
        userId,
        createdAt: { $gte: today } as any,
      },
    });
  }

  private initializeSectionTimes(sections: ExamSection[]): any {
    const times: any = {};
    for (const section of sections) {
      times[section.id] = {
        startedAt: null,
        endedAt: null,
        timeSpent: 0,
        timeLimit: section.duration * 60,
      };
    }
    return times;
  }

  private formatAttemptResponse(attempt: ExamAttempt): ExamAttemptResponseDto {
    return {
      id: attempt.id,
      examSetId: attempt.examSetId,
      status: attempt.status,
      currentSectionId: attempt.currentSectionId,
      currentQuestionIndex: attempt.currentQuestionIndex,
      startedAt: attempt.startedAt,
      timeRemaining: attempt.timeRemaining,
      autoSaveVersion: attempt.autoSaveVersion,
      progress: {
        totalQuestions: 0, // Calculate from answers
        answeredQuestions: 0,
        flaggedQuestions: 0,
        sectionProgress: {},
      },
    };
  }

  private formatResultResponse(attempt: ExamAttempt, answers: ExamAnswer[]): ExamResultDto {
    return {
      attemptId: attempt.id,
      examSetId: attempt.examSetId,
      completedAt: attempt.endedAt,
      totalTime: attempt.elapsedTime,
      overallScore: attempt.score,
      vstepScore: attempt.vstepScore,
      sectionScores: Object.entries(attempt.sectionScores || {}).map(([id, score]) => ({
        skill: score.skill,
        score: score.score,
        correctCount: score.correctCount,
        totalCount: score.totalCount,
        vstepScore: this.scoringService.calculateVstepScore(score.score, 'B1'),
      })),
      answers: answers.map(a => ({
        questionId: a.questionId,
        isCorrect: a.isCorrect,
        pointsEarned: a.pointsEarned,
        aiScore: a.aiScore,
      })),
    };
  }
}
```

---

## ✅ Acceptance Criteria

- [ ] Exam attempt entity stores all required data
- [ ] Start exam creates attempt with timing
- [ ] Submit answer saves and increments version
- [ ] Bulk submit works for auto-save
- [ ] Section navigation tracks timing
- [ ] Submit exam calculates scores
- [ ] Timeout handling works

---

## ⏭️ Next Task

→ `BE-021_EXAM_TIMER_SERVICE.md` - Exam Timer Service

# BE-022: Exam Submission Service

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-022 |
| **Phase** | 1 - MVP |
| **Sprint** | 5-6 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 6h |
| **Dependencies** | BE-020, BE-021 |

---

## 🎯 Objective

Implement Exam Submission Service với:
- Manual và auto submission
- Answer validation
- Score calculation trigger
- AI scoring queue integration

---

## 💻 Implementation

### Step 1: Submission DTOs

```typescript
// src/modules/exams/dto/submission.dto.ts
import {
  IsUUID,
  IsOptional,
  IsEnum,
  ValidateNested,
  IsArray,
  IsInt,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum SubmissionType {
  MANUAL = 'manual',
  AUTO_TIMEOUT = 'auto_timeout',
  FORCE_SUBMIT = 'force_submit',
}

export class AnswerSubmissionDto {
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

  @ApiPropertyOptional({ description: 'For writing tasks' })
  @IsOptional()
  @IsString()
  essayContent?: string;

  @ApiPropertyOptional({ description: 'For speaking tasks - audio file URL' })
  @IsOptional()
  @IsString()
  audioUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  timeSpent?: number;
}

export class SubmitExamDto {
  @ApiProperty()
  @IsUUID()
  attemptId: string;

  @ApiPropertyOptional({ enum: SubmissionType })
  @IsOptional()
  @IsEnum(SubmissionType)
  submissionType?: SubmissionType;

  @ApiPropertyOptional({ type: [AnswerSubmissionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerSubmissionDto)
  finalAnswers?: AnswerSubmissionDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  clientTimestamp?: number;
}

export class SubmissionResultDto {
  attemptId: string;
  submittedAt: Date;
  status: string;
  processingStatus: {
    reading: string;
    listening: string;
    writing: string;
    speaking: string;
  };
  estimatedCompletionTime?: Date;
  preliminaryScore?: {
    reading: number;
    listening: number;
  };
}

export class SubmissionProgressDto {
  attemptId: string;
  totalAnswers: number;
  scoredAnswers: number;
  pendingAiScoring: number;
  status: string;
  scores?: {
    [skill: string]: {
      score: number;
      status: 'pending' | 'scored' | 'error';
    };
  };
}
```

### Step 2: Submission Validation

```typescript
// src/modules/exams/validators/submission.validator.ts
import { Injectable } from '@nestjs/common';
import { ExamAnswer } from '../entities/exam-answer.entity';
import { ExamAttempt } from '../entities/exam-attempt.entity';
import { Question, QuestionType } from '../entities/question.entity';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  unansweredCount: number;
  answeredCount: number;
}

@Injectable()
export class SubmissionValidator {
  validateSubmission(
    attempt: ExamAttempt,
    answers: ExamAnswer[],
    questions: Question[],
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check attempt status
    if (attempt.status !== 'in_progress' && attempt.status !== 'paused') {
      errors.push(`Invalid attempt status: ${attempt.status}`);
    }

    // Check answers
    const answeredIds = new Set(answers.filter(a => a.answer || a.selectedOptionId).map(a => a.questionId));
    const unansweredQuestions = questions.filter(q => !answeredIds.has(q.id));
    
    if (unansweredQuestions.length > 0) {
      warnings.push(`${unansweredQuestions.length} questions unanswered`);
    }

    // Validate each answer
    for (const answer of answers) {
      const question = questions.find(q => q.id === answer.questionId);
      if (!question) continue;

      const answerValidation = this.validateAnswer(answer, question);
      if (!answerValidation.isValid) {
        errors.push(...answerValidation.errors);
      }
      if (answerValidation.warnings.length > 0) {
        warnings.push(...answerValidation.warnings);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      unansweredCount: unansweredQuestions.length,
      answeredCount: answeredIds.size,
    };
  }

  private validateAnswer(
    answer: ExamAnswer,
    question: Question,
  ): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    switch (question.type) {
      case QuestionType.MULTIPLE_CHOICE:
        if (answer.selectedOptionId) {
          const validOptions = question.options?.map(o => o.id) || [];
          if (!validOptions.includes(answer.selectedOptionId)) {
            errors.push(`Invalid option selected for question ${question.id}`);
          }
        }
        break;

      case QuestionType.ESSAY:
        if (answer.richContent) {
          const wordCount = this.countWords(answer.richContent);
          const minWords = question.metadata?.minWords || 150;
          const maxWords = question.metadata?.maxWords || 300;
          
          if (wordCount < minWords) {
            warnings.push(`Essay for question ${question.id} is under minimum word count (${wordCount}/${minWords})`);
          }
          if (wordCount > maxWords * 1.5) {
            warnings.push(`Essay for question ${question.id} exceeds recommended length`);
          }
        }
        break;

      case QuestionType.SPEAKING_TASK:
        if (!answer.audioUrl) {
          warnings.push(`No audio recorded for speaking question ${question.id}`);
        }
        break;

      case QuestionType.FILL_BLANK:
        // No specific validation needed
        break;
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  private countWords(text: string): number {
    if (!text) return 0;
    const plainText = text.replace(/<[^>]*>/g, '').trim();
    return plainText.split(/\s+/).filter(Boolean).length;
  }
}
```

### Step 3: Submission Service

```typescript
// src/modules/exams/services/exam-submission.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ExamAttempt, AttemptStatus } from '../entities/exam-attempt.entity';
import { ExamAnswer } from '../entities/exam-answer.entity';
import { Question, QuestionType } from '../entities/question.entity';
import { ExamSection } from '../entities/exam-section.entity';
import {
  SubmitExamDto,
  SubmissionType,
  SubmissionResultDto,
  SubmissionProgressDto,
  AnswerSubmissionDto,
} from '../dto/submission.dto';
import { SubmissionValidator } from '../validators/submission.validator';
import { ScoringService } from '@/modules/practice/services/scoring.service';
import { ExamTimerService } from './exam-timer.service';
import { CacheService } from '@/core/cache/cache.service';

@Injectable()
export class ExamSubmissionService {
  private readonly logger = new Logger(ExamSubmissionService.name);

  constructor(
    @InjectRepository(ExamAttempt)
    private readonly attemptRepository: Repository<ExamAttempt>,
    @InjectRepository(ExamAnswer)
    private readonly answerRepository: Repository<ExamAnswer>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(ExamSection)
    private readonly sectionRepository: Repository<ExamSection>,
    @InjectQueue('ai-scoring')
    private readonly aiScoringQueue: Queue,
    private readonly dataSource: DataSource,
    private readonly scoringService: ScoringService,
    private readonly timerService: ExamTimerService,
    private readonly validator: SubmissionValidator,
    private readonly cacheService: CacheService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Submit exam (main entry point)
   */
  async submitExam(
    userId: string,
    dto: SubmitExamDto,
  ): Promise<SubmissionResultDto> {
    const attempt = await this.attemptRepository.findOne({
      where: { id: dto.attemptId, userId },
      relations: ['examSet'],
    });

    if (!attempt) {
      throw new NotFoundException('Exam attempt not found');
    }

    if (attempt.status === AttemptStatus.COMPLETED) {
      throw new BadRequestException('Exam already submitted');
    }

    // Use transaction for atomicity
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Save any final answers
      if (dto.finalAnswers?.length > 0) {
        await this.saveFinalAnswers(attempt.id, dto.finalAnswers, queryRunner);
      }

      // Get all answers and questions
      const answers = await queryRunner.manager.find(ExamAnswer, {
        where: { attemptId: attempt.id },
        relations: ['question', 'question.options'],
      });

      const questionIds = answers.map(a => a.questionId);
      const questions = await queryRunner.manager.find(Question, {
        where: { id: In(questionIds) },
        relations: ['options'],
      });

      // Validate submission
      const validation = this.validator.validateSubmission(attempt, answers, questions);
      
      if (!validation.isValid) {
        this.logger.warn(`Submission validation failed: ${validation.errors.join(', ')}`);
        // Log but don't block - allow submission with warnings
      }

      // Score Reading/Listening immediately
      const scoringResults = await this.scoreObjectiveAnswers(answers, questions, queryRunner);

      // Update attempt status
      attempt.status = AttemptStatus.COMPLETED;
      attempt.endedAt = new Date();
      
      // Calculate preliminary scores
      const sectionScores = await this.calculateSectionScores(answers, queryRunner);
      attempt.sectionScores = sectionScores;
      
      // Calculate overall score (Reading + Listening only for now)
      const objectiveScore = this.calculateObjectiveScore(sectionScores);
      attempt.score = objectiveScore;

      await queryRunner.manager.save(attempt);

      // Queue AI scoring for Writing/Speaking
      const aiJobIds = await this.queueAiScoring(answers, questions, attempt);

      await queryRunner.commitTransaction();

      // Cleanup timer
      await this.timerService.cleanupTiming(attempt.id);

      // Emit completion event
      this.eventEmitter.emit('exam.submitted', {
        userId,
        attemptId: attempt.id,
        submissionType: dto.submissionType || SubmissionType.MANUAL,
      });

      return this.formatSubmissionResult(attempt, aiJobIds);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Submission failed:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Auto-submit on timeout
   */
  async autoSubmit(attemptId: string, userId: string): Promise<SubmissionResultDto> {
    return this.submitExam(userId, {
      attemptId,
      submissionType: SubmissionType.AUTO_TIMEOUT,
    });
  }

  /**
   * Force submit (admin)
   */
  async forceSubmit(attemptId: string): Promise<SubmissionResultDto> {
    const attempt = await this.attemptRepository.findOne({
      where: { id: attemptId },
    });

    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }

    return this.submitExam(attempt.userId, {
      attemptId,
      submissionType: SubmissionType.FORCE_SUBMIT,
    });
  }

  /**
   * Get submission progress (for polling)
   */
  async getSubmissionProgress(
    attemptId: string,
    userId: string,
  ): Promise<SubmissionProgressDto> {
    const attempt = await this.attemptRepository.findOne({
      where: { id: attemptId, userId },
    });

    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }

    const answers = await this.answerRepository.find({
      where: { attemptId },
    });

    const scoredCount = answers.filter(a => 
      a.isCorrect !== null || a.aiScore !== null
    ).length;

    const pendingAi = answers.filter(a =>
      a.aiScore === null && (a.richContent || a.audioUrl)
    ).length;

    // Build scores by skill
    const scores: SubmissionProgressDto['scores'] = {};
    
    if (attempt.sectionScores) {
      for (const [sectionId, score] of Object.entries(attempt.sectionScores)) {
        const skill = score.skill;
        scores[skill] = {
          score: score.score,
          status: 'scored',
        };
      }
    }

    // Check for pending AI scores
    const pendingAnswers = answers.filter(a => 
      (a.richContent || a.audioUrl) && !a.aiScore
    );
    
    for (const answer of pendingAnswers) {
      const question = await this.questionRepository.findOne({
        where: { id: answer.questionId },
        relations: ['passage', 'passage.section'],
      });
      
      if (question?.passage?.section) {
        const skill = question.passage.section.skill;
        if (!scores[skill]) {
          scores[skill] = { score: 0, status: 'pending' };
        } else if (scores[skill].status !== 'error') {
          scores[skill].status = 'pending';
        }
      }
    }

    return {
      attemptId,
      totalAnswers: answers.length,
      scoredAnswers: scoredCount,
      pendingAiScoring: pendingAi,
      status: pendingAi > 0 ? 'processing' : 'completed',
      scores,
    };
  }

  /**
   * Handle AI scoring completion
   */
  async handleAiScoringComplete(
    answerId: string,
    result: {
      overall: number;
      criteria: { [key: string]: number };
      feedback?: string;
      suggestions?: string[];
    },
  ): Promise<void> {
    const answer = await this.answerRepository.findOne({
      where: { id: answerId },
    });

    if (!answer) {
      this.logger.warn(`Answer ${answerId} not found for AI scoring update`);
      return;
    }

    answer.aiScore = result;
    answer.aiScoredAt = new Date();
    answer.pointsEarned = result.overall;
    await this.answerRepository.save(answer);

    // Check if all AI scoring is complete
    await this.checkAllScoringComplete(answer.attemptId);
  }

  // Private helper methods
  private async saveFinalAnswers(
    attemptId: string,
    answers: AnswerSubmissionDto[],
    queryRunner: any,
  ): Promise<void> {
    for (const answerDto of answers) {
      let answer = await queryRunner.manager.findOne(ExamAnswer, {
        where: { attemptId, questionId: answerDto.questionId },
      });

      if (answer) {
        answer.answer = answerDto.answer ?? answer.answer;
        answer.selectedOptionId = answerDto.selectedOptionId ?? answer.selectedOptionId;
        answer.richContent = answerDto.essayContent ?? answer.richContent;
        answer.audioUrl = answerDto.audioUrl ?? answer.audioUrl;
        answer.timeSpent = (answer.timeSpent || 0) + (answerDto.timeSpent || 0);
        answer.lastModifiedAt = new Date();
      } else {
        // Get question for section info
        const question = await queryRunner.manager.findOne(Question, {
          where: { id: answerDto.questionId },
          relations: ['passage'],
        });

        answer = queryRunner.manager.create(ExamAnswer, {
          attemptId,
          questionId: answerDto.questionId,
          sectionId: question?.passage?.sectionId,
          answer: answerDto.answer,
          selectedOptionId: answerDto.selectedOptionId,
          richContent: answerDto.essayContent,
          audioUrl: answerDto.audioUrl,
          timeSpent: answerDto.timeSpent || 0,
          firstAnsweredAt: new Date(),
          lastModifiedAt: new Date(),
        });
      }

      await queryRunner.manager.save(answer);
    }
  }

  private async scoreObjectiveAnswers(
    answers: ExamAnswer[],
    questions: Question[],
    queryRunner: any,
  ): Promise<Map<string, { isCorrect: boolean; points: number }>> {
    const results = new Map();

    for (const answer of answers) {
      const question = questions.find(q => q.id === answer.questionId);
      if (!question) continue;

      // Only score objective questions
      if (
        question.type === QuestionType.ESSAY ||
        question.type === QuestionType.SPEAKING_TASK
      ) {
        continue;
      }

      const { isCorrect, points } = await this.scoringService.scoreAnswer(
        question,
        answer.answer || answer.selectedOptionId,
      );

      answer.isCorrect = isCorrect;
      answer.pointsEarned = points;
      await queryRunner.manager.save(answer);

      results.set(answer.id, { isCorrect, points });
    }

    return results;
  }

  private async calculateSectionScores(
    answers: ExamAnswer[],
    queryRunner: any,
  ): Promise<ExamAttempt['sectionScores']> {
    const sectionScores: ExamAttempt['sectionScores'] = {};

    // Group answers by section
    const answersBySection = new Map<string, ExamAnswer[]>();
    for (const answer of answers) {
      if (!answersBySection.has(answer.sectionId)) {
        answersBySection.set(answer.sectionId, []);
      }
      answersBySection.get(answer.sectionId).push(answer);
    }

    for (const [sectionId, sectionAnswers] of answersBySection) {
      const section = await queryRunner.manager.findOne(ExamSection, {
        where: { id: sectionId },
      });

      const scoredAnswers = sectionAnswers.filter(a => a.isCorrect !== null);
      const correctCount = scoredAnswers.filter(a => a.isCorrect).length;
      const totalPoints = sectionAnswers.reduce((sum, a) => sum + (a.pointsEarned || 0), 0);
      const maxPoints = sectionAnswers.reduce((sum, a) => sum + (a.maxPoints || 1), 0);

      sectionScores[sectionId] = {
        score: maxPoints > 0 ? (totalPoints / maxPoints) * 100 : 0,
        correctCount,
        totalCount: sectionAnswers.length,
        skill: section?.skill || 'unknown',
      };
    }

    return sectionScores;
  }

  private calculateObjectiveScore(sectionScores: ExamAttempt['sectionScores']): number {
    const objectiveSkills = ['reading', 'listening'];
    let totalScore = 0;
    let count = 0;

    for (const score of Object.values(sectionScores)) {
      if (objectiveSkills.includes(score.skill.toLowerCase())) {
        totalScore += score.score;
        count++;
      }
    }

    return count > 0 ? totalScore / count : 0;
  }

  private async queueAiScoring(
    answers: ExamAnswer[],
    questions: Question[],
    attempt: ExamAttempt,
  ): Promise<string[]> {
    const jobIds: string[] = [];

    for (const answer of answers) {
      const question = questions.find(q => q.id === answer.questionId);
      if (!question) continue;

      if (question.type === QuestionType.ESSAY && answer.richContent) {
        const job = await this.aiScoringQueue.add('writing', {
          answerId: answer.id,
          attemptId: attempt.id,
          questionId: question.id,
          content: answer.richContent,
          level: question.level,
          taskType: question.metadata?.taskType,
        }, {
          attempts: 3,
          backoff: { type: 'exponential', delay: 5000 },
        });
        jobIds.push(job.id.toString());
      }

      if (question.type === QuestionType.SPEAKING_TASK && answer.audioUrl) {
        const job = await this.aiScoringQueue.add('speaking', {
          answerId: answer.id,
          attemptId: attempt.id,
          questionId: question.id,
          audioUrl: answer.audioUrl,
          level: question.level,
          taskType: question.metadata?.taskType,
        }, {
          attempts: 3,
          backoff: { type: 'exponential', delay: 5000 },
        });
        jobIds.push(job.id.toString());
      }
    }

    return jobIds;
  }

  private async checkAllScoringComplete(attemptId: string): Promise<void> {
    const pendingAnswers = await this.answerRepository.count({
      where: {
        attemptId,
        aiScore: null,
      },
    });

    // Only check answers that need AI scoring
    const aiAnswers = await this.answerRepository.find({
      where: { attemptId },
    });

    const needsAiScoring = aiAnswers.filter(a => a.richContent || a.audioUrl);
    const scoredAi = needsAiScoring.filter(a => a.aiScore !== null);

    if (needsAiScoring.length === scoredAi.length) {
      // All AI scoring complete - recalculate final scores
      await this.recalculateFinalScores(attemptId);
      
      this.eventEmitter.emit('exam.allScoresComplete', { attemptId });
    }
  }

  private async recalculateFinalScores(attemptId: string): Promise<void> {
    const attempt = await this.attemptRepository.findOne({
      where: { id: attemptId },
    });

    if (!attempt) return;

    const answers = await this.answerRepository.find({
      where: { attemptId },
    });

    // Recalculate with AI scores included
    const totalPoints = answers.reduce((sum, a) => sum + (a.pointsEarned || 0), 0);
    const maxPoints = answers.reduce((sum, a) => sum + (a.maxPoints || 1), 0);

    attempt.score = maxPoints > 0 ? (totalPoints / maxPoints) * 100 : 0;
    attempt.vstepScore = this.scoringService.calculateVstepScore(attempt.score, 'B1');

    await this.attemptRepository.save(attempt);
  }

  private formatSubmissionResult(
    attempt: ExamAttempt,
    aiJobIds: string[],
  ): SubmissionResultDto {
    const hasWritingPending = aiJobIds.some(id => id.includes('writing'));
    const hasSpeakingPending = aiJobIds.some(id => id.includes('speaking'));

    return {
      attemptId: attempt.id,
      submittedAt: attempt.endedAt,
      status: aiJobIds.length > 0 ? 'processing' : 'completed',
      processingStatus: {
        reading: 'completed',
        listening: 'completed',
        writing: hasWritingPending ? 'pending' : 'completed',
        speaking: hasSpeakingPending ? 'pending' : 'completed',
      },
      estimatedCompletionTime: aiJobIds.length > 0
        ? new Date(Date.now() + aiJobIds.length * 5000)
        : undefined,
      preliminaryScore: {
        reading: attempt.sectionScores?.['reading']?.score || 0,
        listening: attempt.sectionScores?.['listening']?.score || 0,
      },
    };
  }
}
```

### Step 4: Submission Controller

```typescript
// src/modules/exams/controllers/exam-submission.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { ExamSubmissionService } from '../services/exam-submission.service';
import {
  SubmitExamDto,
  SubmissionResultDto,
  SubmissionProgressDto,
} from '../dto/submission.dto';

@ApiTags('Exam Submission')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('exams/submit')
export class ExamSubmissionController {
  constructor(private readonly submissionService: ExamSubmissionService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit completed exam' })
  @ApiResponse({ status: 200, type: SubmissionResultDto })
  async submitExam(
    @Request() req,
    @Body() dto: SubmitExamDto,
  ): Promise<SubmissionResultDto> {
    return this.submissionService.submitExam(req.user.id, dto);
  }

  @Get(':attemptId/progress')
  @ApiOperation({ summary: 'Get submission processing progress' })
  @ApiResponse({ status: 200, type: SubmissionProgressDto })
  async getProgress(
    @Request() req,
    @Param('attemptId') attemptId: string,
  ): Promise<SubmissionProgressDto> {
    return this.submissionService.getSubmissionProgress(attemptId, req.user.id);
  }
}
```

---

## ✅ Acceptance Criteria

- [ ] Manual submission works correctly
- [ ] Auto-submit on timeout functions
- [ ] Validation runs without blocking
- [ ] Reading/Listening scored immediately
- [ ] Writing/Speaking queued for AI
- [ ] Progress polling works
- [ ] Final scores recalculated after AI

---

## ⏭️ Next Task

→ `BE-023_VSTEP_FULL_SCORING.md` - VSTEP Full Scoring System

# BE-026: Exam Result Generation

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-026 |
| **Phase** | 1 - MVP |
| **Sprint** | 5-6 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 6h |
| **Dependencies** | BE-022, BE-023, BE-024 |

---

## 🎯 Objective

Implement Exam Result Generation với:
- Comprehensive result report
- Answer review with explanations
- Export to PDF
- Result sharing

---

## 💻 Implementation

### Step 1: Result DTOs

```typescript
// src/modules/exams/dto/exam-result.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class QuestionResultDto {
  @ApiProperty()
  questionId: string;

  @ApiProperty()
  questionNumber: number;

  @ApiProperty()
  questionText: string;

  @ApiProperty()
  questionType: string;

  @ApiProperty()
  skill: string;

  @ApiProperty()
  userAnswer: string | null;

  @ApiProperty()
  correctAnswer: string;

  @ApiProperty()
  isCorrect: boolean;

  @ApiProperty()
  pointsEarned: number;

  @ApiProperty()
  maxPoints: number;

  @ApiProperty()
  timeSpent: number;

  @ApiPropertyOptional()
  explanation?: string;

  @ApiPropertyOptional()
  options?: {
    id: string;
    text: string;
    isSelected: boolean;
    isCorrect: boolean;
  }[];

  @ApiPropertyOptional({ description: 'AI scoring details for Writing/Speaking' })
  aiScore?: {
    overall: number;
    criteria: { [key: string]: { score: number; feedback: string } };
    suggestions?: string[];
    grammarErrors?: { text: string; correction: string; position: number }[];
  };
}

export class SectionResultDto {
  @ApiProperty()
  sectionId: string;

  @ApiProperty()
  sectionName: string;

  @ApiProperty()
  skill: string;

  @ApiProperty()
  score: number;

  @ApiProperty()
  vstepScore: number;

  @ApiProperty()
  correctCount: number;

  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  timeSpent: number;

  @ApiProperty()
  timeAllocated: number;

  @ApiProperty({ type: [QuestionResultDto] })
  questions: QuestionResultDto[];
}

export class ExamResultDetailDto {
  @ApiProperty()
  attemptId: string;

  @ApiProperty()
  examSetId: string;

  @ApiProperty()
  examTitle: string;

  @ApiProperty()
  level: string;

  @ApiProperty()
  completedAt: Date;

  @ApiProperty()
  totalDuration: number;

  @ApiProperty()
  overallScore: number;

  @ApiProperty()
  vstepScore: number;

  @ApiProperty()
  band: string;

  @ApiProperty()
  bandLabel: string;

  @ApiProperty({ type: [SectionResultDto] })
  sections: SectionResultDto[];

  @ApiProperty()
  summary: {
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    skippedAnswers: number;
    averageTimePerQuestion: number;
  };

  @ApiProperty()
  skillAnalysis: {
    skill: string;
    score: number;
    vstepScore: number;
    performance: 'excellent' | 'good' | 'fair' | 'needs_improvement';
    strengths: string[];
    weaknesses: string[];
  }[];

  @ApiProperty()
  recommendations: string[];

  @ApiPropertyOptional()
  comparison?: {
    previousScore: number;
    improvement: number;
    percentile: number;
    rank: number;
  };
}

export class ExamResultSummaryDto {
  @ApiProperty()
  attemptId: string;

  @ApiProperty()
  examTitle: string;

  @ApiProperty()
  completedAt: Date;

  @ApiProperty()
  vstepScore: number;

  @ApiProperty()
  band: string;

  @ApiProperty()
  skillScores: { skill: string; score: number }[];

  @ApiProperty()
  duration: number;
}

export class ResultExportOptionsDto {
  format: 'pdf' | 'json' | 'csv';
  includeAnswers: boolean;
  includeExplanations: boolean;
  includeAiFeedback: boolean;
  language: 'en' | 'vi';
}

export class ShareResultDto {
  @ApiProperty()
  shareToken: string;

  @ApiProperty()
  shareUrl: string;

  @ApiProperty()
  expiresAt: Date;
}
```

### Step 2: Result Entity

```typescript
// src/modules/exams/entities/exam-result.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from '@/modules/users/entities/user.entity';
import { ExamAttempt } from './exam-attempt.entity';

@Entity('exam_results')
@Index(['userId', 'createdAt'])
@Index(['shareToken'], { unique: true, where: 'share_token IS NOT NULL' })
export class ExamResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'attempt_id' })
  attemptId: string;

  @ManyToOne(() => ExamAttempt)
  @JoinColumn({ name: 'attempt_id' })
  attempt: ExamAttempt;

  // Cached scores for quick access
  @Column({ name: 'overall_score', type: 'decimal', precision: 5, scale: 2 })
  overallScore: number;

  @Column({ name: 'vstep_score', type: 'decimal', precision: 3, scale: 1 })
  vstepScore: number;

  @Column()
  band: string;

  // Full result data
  @Column({ name: 'result_data', type: 'json' })
  resultData: ExamResultDetailDto;

  // Sharing
  @Column({ name: 'share_token', nullable: true })
  shareToken: string;

  @Column({ name: 'share_expires_at', type: 'timestamp', nullable: true })
  shareExpiresAt: Date;

  @Column({ name: 'is_public', default: false })
  isPublic: boolean;

  // Certificate
  @Column({ name: 'certificate_id', nullable: true })
  certificateId: string;

  @Column({ name: 'certificate_generated_at', type: 'timestamp', nullable: true })
  certificateGeneratedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
```

### Step 3: Result Service

```typescript
// src/modules/exams/services/exam-result.service.ts
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ExamResult } from '../entities/exam-result.entity';
import { ExamAttempt, AttemptStatus } from '../entities/exam-attempt.entity';
import { ExamAnswer } from '../entities/exam-answer.entity';
import { ExamSection } from '../entities/exam-section.entity';
import { Question } from '../entities/question.entity';
import { QuestionOption } from '../entities/question-option.entity';
import { VstepScoringService } from './vstep-scoring.service';
import { ExamAnalyticsService } from './exam-analytics.service';
import { CacheService } from '@/core/cache/cache.service';
import {
  ExamResultDetailDto,
  ExamResultSummaryDto,
  SectionResultDto,
  QuestionResultDto,
  ShareResultDto,
  ResultExportOptionsDto,
} from '../dto/exam-result.dto';
import { VSTEP_BANDS, BAND_DESCRIPTORS } from '../constants/vstep-scoring.constants';

@Injectable()
export class ExamResultService {
  private readonly logger = new Logger(ExamResultService.name);

  constructor(
    @InjectRepository(ExamResult)
    private readonly resultRepository: Repository<ExamResult>,
    @InjectRepository(ExamAttempt)
    private readonly attemptRepository: Repository<ExamAttempt>,
    @InjectRepository(ExamAnswer)
    private readonly answerRepository: Repository<ExamAnswer>,
    @InjectRepository(ExamSection)
    private readonly sectionRepository: Repository<ExamSection>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    private readonly scoringService: VstepScoringService,
    private readonly analyticsService: ExamAnalyticsService,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * Generate full result for an attempt
   */
  async generateResult(attemptId: string): Promise<ExamResultDetailDto> {
    const attempt = await this.attemptRepository.findOne({
      where: { id: attemptId },
      relations: ['examSet', 'examSet.sections', 'answers', 'answers.question', 'answers.question.options'],
    });

    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }

    if (attempt.status !== AttemptStatus.COMPLETED && attempt.status !== AttemptStatus.TIMED_OUT) {
      throw new Error('Attempt is not completed');
    }

    // Check if result already exists
    let existingResult = await this.resultRepository.findOne({
      where: { attemptId },
    });

    if (existingResult) {
      return existingResult.resultData;
    }

    // Calculate VSTEP scores
    const scores = await this.scoringService.calculateFullScore(attemptId);

    // Build section results
    const sections: SectionResultDto[] = [];
    for (const section of attempt.examSet.sections) {
      const sectionAnswers = attempt.answers.filter(a => a.sectionId === section.id);
      const sectionResult = await this.buildSectionResult(section, sectionAnswers);
      sections.push(sectionResult);
    }

    // Build summary
    const allQuestionResults = sections.flatMap(s => s.questions);
    const summary = {
      totalQuestions: allQuestionResults.length,
      correctAnswers: allQuestionResults.filter(q => q.isCorrect).length,
      incorrectAnswers: allQuestionResults.filter(q => !q.isCorrect && q.userAnswer !== null).length,
      skippedAnswers: allQuestionResults.filter(q => q.userAnswer === null).length,
      averageTimePerQuestion: allQuestionResults.reduce((sum, q) => sum + q.timeSpent, 0) / allQuestionResults.length || 0,
    };

    // Build skill analysis
    const skillAnalysis = scores.skillScores.map(score => ({
      skill: score.skill,
      score: score.rawScore,
      vstepScore: score.vstepScore,
      performance: this.getPerformanceLevel(score.vstepScore),
      strengths: this.identifyStrengths(score.skill, score.vstepScore, allQuestionResults),
      weaknesses: this.identifyWeaknesses(score.skill, score.vstepScore, allQuestionResults),
    }));

    // Get comparison data
    const comparison = await this.getComparisonData(attempt.userId, attempt.examSetId, scores.overallScore);

    // Build full result
    const result: ExamResultDetailDto = {
      attemptId,
      examSetId: attempt.examSetId,
      examTitle: attempt.examSet.title,
      level: attempt.examSet.level,
      completedAt: attempt.endedAt,
      totalDuration: attempt.elapsedTime,
      overallScore: scores.overallScore * 10, // Percentage
      vstepScore: scores.overallScore,
      band: scores.overallBand,
      bandLabel: scores.overallBandLabel,
      sections,
      summary,
      skillAnalysis,
      recommendations: scores.recommendations || [],
      comparison,
    };

    // Save result
    const examResult = this.resultRepository.create({
      userId: attempt.userId,
      attemptId,
      overallScore: result.overallScore,
      vstepScore: result.vstepScore,
      band: result.band,
      resultData: result,
    });

    await this.resultRepository.save(examResult);

    // Cache for quick access
    await this.cacheService.set(`exam:result:${attemptId}`, result, 3600);

    return result;
  }

  /**
   * Get result by attempt ID
   */
  async getResult(attemptId: string, userId: string): Promise<ExamResultDetailDto> {
    // Check cache
    const cached = await this.cacheService.get<ExamResultDetailDto>(`exam:result:${attemptId}`);
    if (cached) return cached;

    const result = await this.resultRepository.findOne({
      where: { attemptId, userId },
    });

    if (!result) {
      // Try to generate
      return this.generateResult(attemptId);
    }

    // Cache for future requests
    await this.cacheService.set(`exam:result:${attemptId}`, result.resultData, 3600);

    return result.resultData;
  }

  /**
   * Get result summaries for user
   */
  async getUserResultSummaries(
    userId: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<ExamResultSummaryDto[]> {
    const results = await this.resultRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });

    return results.map(r => ({
      attemptId: r.attemptId,
      examTitle: r.resultData.examTitle,
      completedAt: r.resultData.completedAt,
      vstepScore: r.vstepScore,
      band: r.band,
      skillScores: r.resultData.skillAnalysis.map(s => ({
        skill: s.skill,
        score: s.vstepScore,
      })),
      duration: r.resultData.totalDuration,
    }));
  }

  /**
   * Create shareable link
   */
  async createShareLink(
    attemptId: string,
    userId: string,
    expiresInDays: number = 7,
  ): Promise<ShareResultDto> {
    const result = await this.resultRepository.findOne({
      where: { attemptId, userId },
    });

    if (!result) {
      throw new NotFoundException('Result not found');
    }

    const shareToken = uuidv4().replace(/-/g, '').substring(0, 20);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    result.shareToken = shareToken;
    result.shareExpiresAt = expiresAt;
    await this.resultRepository.save(result);

    return {
      shareToken,
      shareUrl: `${process.env.APP_URL}/results/shared/${shareToken}`,
      expiresAt,
    };
  }

  /**
   * Get shared result
   */
  async getSharedResult(shareToken: string): Promise<ExamResultDetailDto> {
    const result = await this.resultRepository.findOne({
      where: { shareToken },
    });

    if (!result) {
      throw new NotFoundException('Shared result not found');
    }

    if (result.shareExpiresAt && result.shareExpiresAt < new Date()) {
      throw new NotFoundException('Share link has expired');
    }

    return result.resultData;
  }

  /**
   * Export result
   */
  async exportResult(
    attemptId: string,
    userId: string,
    options: ResultExportOptionsDto,
  ): Promise<{ data: any; mimeType: string; filename: string }> {
    const result = await this.getResult(attemptId, userId);

    switch (options.format) {
      case 'json':
        return this.exportAsJson(result, options);
      case 'csv':
        return this.exportAsCsv(result, options);
      case 'pdf':
        return this.exportAsPdf(result, options);
      default:
        throw new Error('Unsupported export format');
    }
  }

  // Private helper methods
  private async buildSectionResult(
    section: ExamSection,
    answers: ExamAnswer[],
  ): Promise<SectionResultDto> {
    const questions: QuestionResultDto[] = [];
    let questionNumber = 1;

    // Sort answers by question order
    const sortedAnswers = [...answers].sort((a, b) => {
      return (a.question?.orderIndex || 0) - (b.question?.orderIndex || 0);
    });

    for (const answer of sortedAnswers) {
      const question = answer.question;
      if (!question) continue;

      const correctOption = question.options?.find(o => o.isCorrect);
      const correctAnswer = correctOption?.text || question.correctAnswer || '';

      const questionResult: QuestionResultDto = {
        questionId: question.id,
        questionNumber: questionNumber++,
        questionText: question.text,
        questionType: question.type,
        skill: section.skill,
        userAnswer: answer.answer || answer.selectedOptionId || null,
        correctAnswer,
        isCorrect: answer.isCorrect || false,
        pointsEarned: answer.pointsEarned || 0,
        maxPoints: answer.maxPoints || 1,
        timeSpent: answer.timeSpent || 0,
        explanation: question.explanation,
        options: question.options?.map(opt => ({
          id: opt.id,
          text: opt.text,
          isSelected: opt.id === answer.selectedOptionId,
          isCorrect: opt.isCorrect,
        })),
      };

      // Add AI score for Writing/Speaking
      if (answer.aiScore) {
        questionResult.aiScore = {
          overall: answer.aiScore.overall,
          criteria: {},
          suggestions: answer.aiScore.suggestions,
          grammarErrors: answer.aiScore.grammarErrors,
        };

        if (answer.aiScore.criteria) {
          for (const [key, value] of Object.entries(answer.aiScore.criteria)) {
            questionResult.aiScore.criteria[key] = {
              score: value as number,
              feedback: answer.aiScore.feedback || '',
            };
          }
        }
      }

      questions.push(questionResult);
    }

    const correctCount = questions.filter(q => q.isCorrect).length;
    const score = questions.length > 0 ? (correctCount / questions.length) * 100 : 0;
    const vstepScore = this.convertToVstepScore(score);

    return {
      sectionId: section.id,
      sectionName: section.title,
      skill: section.skill,
      score,
      vstepScore,
      correctCount,
      totalCount: questions.length,
      timeSpent: questions.reduce((sum, q) => sum + q.timeSpent, 0),
      timeAllocated: section.duration * 60,
      questions,
    };
  }

  private convertToVstepScore(percentage: number): number {
    // Simple linear conversion for now
    return Math.round((percentage / 10) * 2) / 2;
  }

  private getPerformanceLevel(vstepScore: number): 'excellent' | 'good' | 'fair' | 'needs_improvement' {
    if (vstepScore >= 8) return 'excellent';
    if (vstepScore >= 6) return 'good';
    if (vstepScore >= 4.5) return 'fair';
    return 'needs_improvement';
  }

  private identifyStrengths(skill: string, score: number, questions: QuestionResultDto[]): string[] {
    const strengths: string[] = [];
    const skillQuestions = questions.filter(q => q.skill === skill);

    // Fast answering with correct results
    const fastCorrect = skillQuestions.filter(q => q.isCorrect && q.timeSpent < 60);
    if (fastCorrect.length >= skillQuestions.length * 0.3) {
      strengths.push('Quick and accurate responses');
    }

    // High accuracy
    const accuracy = skillQuestions.filter(q => q.isCorrect).length / skillQuestions.length;
    if (accuracy >= 0.8) {
      strengths.push(`Strong ${skill} comprehension`);
    }

    return strengths.slice(0, 3);
  }

  private identifyWeaknesses(skill: string, score: number, questions: QuestionResultDto[]): string[] {
    const weaknesses: string[] = [];
    const skillQuestions = questions.filter(q => q.skill === skill);
    const incorrectQuestions = skillQuestions.filter(q => !q.isCorrect);

    // Time management issues
    const slowIncorrect = incorrectQuestions.filter(q => q.timeSpent > 120);
    if (slowIncorrect.length >= incorrectQuestions.length * 0.3) {
      weaknesses.push('Spending too much time on difficult questions');
    }

    // Rushing
    const fastIncorrect = incorrectQuestions.filter(q => q.timeSpent < 30);
    if (fastIncorrect.length >= incorrectQuestions.length * 0.3) {
      weaknesses.push('Rushing through questions');
    }

    // Low accuracy
    const accuracy = skillQuestions.filter(q => q.isCorrect).length / skillQuestions.length;
    if (accuracy < 0.5) {
      weaknesses.push(`Need to improve ${skill} fundamentals`);
    }

    return weaknesses.slice(0, 3);
  }

  private async getComparisonData(
    userId: string,
    examSetId: string,
    currentScore: number,
  ): Promise<ExamResultDetailDto['comparison'] | undefined> {
    try {
      // Get previous attempt
      const previousAttempt = await this.attemptRepository.findOne({
        where: {
          userId,
          examSetId,
          status: AttemptStatus.COMPLETED,
        },
        order: { createdAt: 'DESC' },
        skip: 1, // Skip current
      });

      if (!previousAttempt) return undefined;

      // Get analytics for percentile
      const analytics = await this.analyticsService.getAttemptAnalytics(
        previousAttempt.id,
        userId,
      );

      return {
        previousScore: previousAttempt.vstepScore || 0,
        improvement: currentScore - (previousAttempt.vstepScore || 0),
        percentile: analytics.overallStats.percentile,
        rank: analytics.overallStats.currentRank,
      };
    } catch (e) {
      return undefined;
    }
  }

  private exportAsJson(
    result: ExamResultDetailDto,
    options: ResultExportOptionsDto,
  ): { data: any; mimeType: string; filename: string } {
    let data = { ...result };

    if (!options.includeAnswers) {
      data.sections = data.sections.map(s => ({
        ...s,
        questions: s.questions.map(q => ({
          questionId: q.questionId,
          isCorrect: q.isCorrect,
          pointsEarned: q.pointsEarned,
        })) as any,
      }));
    }

    if (!options.includeExplanations) {
      data.sections = data.sections.map(s => ({
        ...s,
        questions: s.questions.map(({ explanation, ...q }) => q),
      }));
    }

    return {
      data: JSON.stringify(data, null, 2),
      mimeType: 'application/json',
      filename: `exam-result-${result.attemptId}.json`,
    };
  }

  private exportAsCsv(
    result: ExamResultDetailDto,
    options: ResultExportOptionsDto,
  ): { data: any; mimeType: string; filename: string } {
    const rows: string[] = [];
    
    // Header
    rows.push('Section,Question,Your Answer,Correct Answer,Result,Points');

    for (const section of result.sections) {
      for (const q of section.questions) {
        rows.push([
          section.sectionName,
          q.questionNumber,
          q.userAnswer || 'Skipped',
          q.correctAnswer,
          q.isCorrect ? 'Correct' : 'Incorrect',
          `${q.pointsEarned}/${q.maxPoints}`,
        ].join(','));
      }
    }

    return {
      data: rows.join('\n'),
      mimeType: 'text/csv',
      filename: `exam-result-${result.attemptId}.csv`,
    };
  }

  private async exportAsPdf(
    result: ExamResultDetailDto,
    options: ResultExportOptionsDto,
  ): Promise<{ data: any; mimeType: string; filename: string }> {
    // PDF generation would use a library like PDFKit or puppeteer
    // For now, return placeholder
    throw new Error('PDF export not implemented yet');
  }
}
```

### Step 4: Result Controller

```typescript
// src/modules/exams/controllers/exam-result.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { Public } from '@/common/decorators/public.decorator';
import { ExamResultService } from '../services/exam-result.service';
import {
  ExamResultDetailDto,
  ExamResultSummaryDto,
  ShareResultDto,
  ResultExportOptionsDto,
} from '../dto/exam-result.dto';

@ApiTags('Exam Results')
@Controller('exams/results')
export class ExamResultController {
  constructor(private readonly resultService: ExamResultService) {}

  @Get(':attemptId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get exam result details' })
  async getResult(
    @Request() req,
    @Param('attemptId') attemptId: string,
  ): Promise<ExamResultDetailDto> {
    return this.resultService.getResult(attemptId, req.user.id);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get result summaries' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  async getResultSummaries(
    @Request() req,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ): Promise<ExamResultSummaryDto[]> {
    return this.resultService.getUserResultSummaries(req.user.id, limit, offset);
  }

  @Post(':attemptId/share')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create share link' })
  async createShareLink(
    @Request() req,
    @Param('attemptId') attemptId: string,
    @Body('expiresInDays') expiresInDays: number = 7,
  ): Promise<ShareResultDto> {
    return this.resultService.createShareLink(attemptId, req.user.id, expiresInDays);
  }

  @Get('shared/:shareToken')
  @Public()
  @ApiOperation({ summary: 'Get shared result (public)' })
  async getSharedResult(
    @Param('shareToken') shareToken: string,
  ): Promise<ExamResultDetailDto> {
    return this.resultService.getSharedResult(shareToken);
  }

  @Get(':attemptId/export')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Export result' })
  async exportResult(
    @Request() req,
    @Param('attemptId') attemptId: string,
    @Query('format') format: 'pdf' | 'json' | 'csv' = 'json',
    @Query('includeAnswers') includeAnswers: boolean = true,
    @Res() res: Response,
  ) {
    const options: ResultExportOptionsDto = {
      format,
      includeAnswers,
      includeExplanations: true,
      includeAiFeedback: true,
      language: 'en',
    };

    const { data, mimeType, filename } = await this.resultService.exportResult(
      attemptId,
      req.user.id,
      options,
    );

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(data);
  }
}
```

---

## ✅ Acceptance Criteria

- [ ] Full result with all details generated
- [ ] Answer review shows correct answers and explanations
- [ ] AI feedback included for Writing/Speaking
- [ ] Skill analysis with strengths/weaknesses
- [ ] Share link creation works
- [ ] Export to JSON/CSV functional
- [ ] Result caching for performance

---

## ⏭️ Next Task

→ `BE-027_EXAM_CERTIFICATE.md` - Exam Certificate Generation

# BE-052: Assignment Submission System

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-052 |
| **Phase** | 2 - AI Grading |
| **Sprint** | 13-14 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 6h |
| **Dependencies** | BE-050, BE-051 |

---

## 🎯 Objective

Implement student submission workflow:
- Start assignment attempt
- Save answers (auto-save)
- Submit final answers
- Auto-grade objective questions
- Trigger AI scoring for writing/speaking
- Grade manually by teacher

---

## 📝 Implementation

### 1. dto/submission.dto.ts

```typescript
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AnswerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @ApiPropertyOptional({ description: 'Text answer for essay/fill-blank' })
  @IsOptional()
  @IsString()
  @MaxLength(10000)
  answer?: string;

  @ApiPropertyOptional({ description: 'Selected option ID for multiple choice' })
  @IsOptional()
  @IsString()
  selectedOptionId?: string;

  @ApiPropertyOptional({ description: 'Audio URL for speaking answers' })
  @IsOptional()
  @IsString()
  audioUrl?: string;

  @ApiPropertyOptional({ description: 'Audio duration in seconds' })
  @IsOptional()
  @IsNumber()
  audioDuration?: number;

  @ApiPropertyOptional({ description: 'Time spent on this question (seconds)' })
  @IsOptional()
  @IsNumber()
  timeSpent?: number;
}

export class SaveAnswersDto {
  @ApiProperty({ type: [AnswerDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}

export class GradeAnswerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  answerId: string;

  @ApiProperty({ minimum: 0, maximum: 10 })
  @IsNumber()
  @Min(0)
  @Max(10)
  score: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  comment?: string;
}

export class GradeSubmissionDto {
  @ApiPropertyOptional({ type: [GradeAnswerDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GradeAnswerDto)
  answers?: GradeAnswerDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  feedback?: string;
}
```

### 2. submissions.service.ts

```typescript
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { AssignmentEntity, AssignmentStatus } from './entities/assignment.entity';
import { AssignmentSubmissionEntity, SubmissionStatus } from './entities/assignment-submission.entity';
import { SubmissionAnswerEntity } from './entities/submission-answer.entity';
import { QuestionEntity } from '../questions/entities/question.entity';
import { QuestionOptionEntity } from '../questions/entities/question-option.entity';
import { SaveAnswersDto, GradeSubmissionDto } from './dto/submission.dto';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(AssignmentEntity)
    private readonly assignmentRepo: Repository<AssignmentEntity>,
    @InjectRepository(AssignmentSubmissionEntity)
    private readonly submissionRepo: Repository<AssignmentSubmissionEntity>,
    @InjectRepository(SubmissionAnswerEntity)
    private readonly answerRepo: Repository<SubmissionAnswerEntity>,
    @InjectRepository(QuestionEntity)
    private readonly questionRepo: Repository<QuestionEntity>,
    @InjectRepository(QuestionOptionEntity)
    private readonly optionRepo: Repository<QuestionOptionEntity>,
    @InjectQueue('ai-scoring')
    private readonly aiQueue: Queue,
  ) {}

  async startAttempt(assignmentId: string, studentId: string): Promise<AssignmentSubmissionEntity> {
    const assignment = await this.assignmentRepo.findOne({
      where: { id: assignmentId },
      relations: ['questions'],
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    if (assignment.status !== AssignmentStatus.PUBLISHED) {
      throw new BadRequestException('Assignment is not available');
    }

    // Check due date
    const now = new Date();
    if (now > assignment.dueDate && !assignment.allowLateSubmission) {
      throw new BadRequestException('Assignment due date has passed');
    }

    // Check max attempts
    const existingAttempts = await this.submissionRepo.count({
      where: { assignmentId, studentId },
    });

    if (existingAttempts >= assignment.maxAttempts) {
      throw new BadRequestException(
        `Maximum attempts (${assignment.maxAttempts}) reached`
      );
    }

    // Check for in-progress attempt
    const inProgress = await this.submissionRepo.findOne({
      where: {
        assignmentId,
        studentId,
        status: SubmissionStatus.IN_PROGRESS,
      },
    });

    if (inProgress) {
      // Return existing in-progress attempt
      return this.getSubmission(inProgress.id, studentId);
    }

    // Create new submission
    const submission = this.submissionRepo.create({
      assignmentId,
      studentId,
      status: SubmissionStatus.IN_PROGRESS,
      attemptNumber: existingAttempts + 1,
      startedAt: now,
      isLate: now > assignment.dueDate,
      totalCount: assignment.questions.length,
    });

    await this.submissionRepo.save(submission);

    // Pre-create answer slots
    const answerEntities = assignment.questions.map((q) =>
      this.answerRepo.create({
        submissionId: submission.id,
        questionId: q.questionId,
        maxScore: q.points,
      })
    );

    await this.answerRepo.save(answerEntities);

    return this.getSubmission(submission.id, studentId);
  }

  async getSubmission(submissionId: string, studentId: string): Promise<AssignmentSubmissionEntity> {
    const submission = await this.submissionRepo.findOne({
      where: { id: submissionId },
      relations: [
        'assignment',
        'assignment.questions',
        'assignment.questions.question',
        'assignment.questions.question.options',
        'answers',
      ],
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    if (submission.studentId !== studentId) {
      throw new ForbiddenException('Access denied');
    }

    return submission;
  }

  async saveAnswers(
    submissionId: string,
    studentId: string,
    dto: SaveAnswersDto,
  ): Promise<AssignmentSubmissionEntity> {
    const submission = await this.getSubmission(submissionId, studentId);

    if (submission.status !== SubmissionStatus.IN_PROGRESS) {
      throw new BadRequestException('Cannot modify submitted assignment');
    }

    // Check time limit
    if (submission.assignment.timeLimit) {
      const elapsed = (Date.now() - submission.startedAt.getTime()) / 1000 / 60;
      if (elapsed > submission.assignment.timeLimit) {
        // Auto-submit if time exceeded
        return this.submit(submissionId, studentId);
      }
    }

    // Update answers
    for (const answerDto of dto.answers) {
      const existingAnswer = submission.answers.find(
        (a) => a.questionId === answerDto.questionId
      );

      if (existingAnswer) {
        Object.assign(existingAnswer, {
          answer: answerDto.answer,
          selectedOptionId: answerDto.selectedOptionId,
          audioUrl: answerDto.audioUrl,
          audioDuration: answerDto.audioDuration,
          timeSpent: (existingAnswer.timeSpent || 0) + (answerDto.timeSpent || 0),
        });
      }
    }

    await this.answerRepo.save(submission.answers);

    return this.getSubmission(submissionId, studentId);
  }

  async submit(submissionId: string, studentId: string): Promise<AssignmentSubmissionEntity> {
    const submission = await this.getSubmission(submissionId, studentId);

    if (submission.status !== SubmissionStatus.IN_PROGRESS) {
      throw new BadRequestException('Already submitted');
    }

    const now = new Date();
    
    // Calculate time spent
    submission.timeSpent = Math.floor(
      (now.getTime() - submission.startedAt.getTime()) / 1000
    );

    // Calculate late penalty if applicable
    if (submission.isLate && submission.assignment.latePenalty > 0) {
      const daysLate = Math.ceil(
        (now.getTime() - submission.assignment.dueDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      submission.latePenaltyApplied = Math.min(
        daysLate * submission.assignment.latePenalty,
        100 // Cap at 100%
      );
    }

    submission.submittedAt = now;
    submission.status = SubmissionStatus.SUBMITTED;

    await this.submissionRepo.save(submission);

    // Auto-grade objective questions
    await this.autoGradeObjective(submission);

    // Queue AI scoring for writing/speaking
    await this.queueAIScoring(submission);

    return this.getSubmission(submissionId, studentId);
  }

  async gradeSubmission(
    submissionId: string,
    teacherId: string,
    dto: GradeSubmissionDto,
  ): Promise<AssignmentSubmissionEntity> {
    const submission = await this.submissionRepo.findOne({
      where: { id: submissionId },
      relations: ['assignment', 'answers'],
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    // Verify teacher owns the class
    // TODO: Add class ownership check

    // Update individual answer scores
    if (dto.answers) {
      for (const gradeDto of dto.answers) {
        const answer = submission.answers.find((a) => a.id === gradeDto.answerId);
        if (answer) {
          answer.teacherScore = gradeDto.score;
          answer.teacherComment = gradeDto.comment;
        }
      }
      await this.answerRepo.save(submission.answers);
    }

    // Recalculate total score
    await this.calculateFinalScore(submission);

    // Update feedback and status
    if (dto.feedback) {
      submission.teacherFeedback = dto.feedback;
    }

    submission.status = SubmissionStatus.GRADED;
    submission.gradedById = teacherId;
    submission.gradedAt = new Date();

    await this.submissionRepo.save(submission);

    return submission;
  }

  async getStudentAssignments(studentId: string, classId?: string) {
    const qb = this.submissionRepo
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.assignment', 'a')
      .leftJoinAndSelect('a.class', 'c')
      .where('s.studentId = :studentId', { studentId });

    if (classId) {
      qb.andWhere('a.classId = :classId', { classId });
    }

    qb.orderBy('a.dueDate', 'ASC');

    return qb.getMany();
  }

  async getSubmissionsList(assignmentId: string) {
    return this.submissionRepo.find({
      where: { assignmentId },
      relations: ['student'],
      order: { submittedAt: 'DESC' },
    });
  }

  private async autoGradeObjective(submission: AssignmentSubmissionEntity): Promise<void> {
    let correctCount = 0;

    for (const answer of submission.answers) {
      const question = await this.questionRepo.findOne({
        where: { id: answer.questionId },
        relations: ['options'],
      });

      if (!question) continue;

      // Multiple choice / True-False
      if (['multiple_choice', 'true_false'].includes(question.type)) {
        if (answer.selectedOptionId) {
          const selectedOption = question.options.find(
            (o) => o.id === answer.selectedOptionId
          );
          answer.isCorrect = selectedOption?.isCorrect || false;
          answer.score = answer.isCorrect ? answer.maxScore : 0;
          if (answer.isCorrect) correctCount++;
        }
      }

      // Fill in blank - exact match
      if (question.type === 'fill_blank') {
        const correctOption = question.options.find((o) => o.isCorrect);
        if (correctOption && answer.answer) {
          answer.isCorrect = answer.answer.trim().toLowerCase() === 
            correctOption.text.trim().toLowerCase();
          answer.score = answer.isCorrect ? answer.maxScore : 0;
          if (answer.isCorrect) correctCount++;
        }
      }
    }

    await this.answerRepo.save(submission.answers);

    submission.correctCount = correctCount;
    await this.submissionRepo.save(submission);
  }

  private async queueAIScoring(submission: AssignmentSubmissionEntity): Promise<void> {
    for (const answer of submission.answers) {
      const question = await this.questionRepo.findOne({
        where: { id: answer.questionId },
      });

      if (!question) continue;

      // Writing questions
      if (question.type === 'essay' && answer.answer) {
        await this.aiQueue.add('writing-score', {
          answerId: answer.id,
          submissionId: submission.id,
          text: answer.answer,
          questionPrompt: question.text,
          level: submission.assignment.level,
        });
      }

      // Speaking questions
      if (question.type === 'speaking_task' && answer.audioUrl) {
        await this.aiQueue.add('speaking-score', {
          answerId: answer.id,
          submissionId: submission.id,
          audioUrl: answer.audioUrl,
          questionPrompt: question.text,
          level: submission.assignment.level,
        });
      }
    }
  }

  private async calculateFinalScore(submission: AssignmentSubmissionEntity): Promise<void> {
    let totalScore = 0;
    let totalMaxScore = 0;

    for (const answer of submission.answers) {
      const finalScore = answer.teacherScore ?? answer.aiScore ?? answer.score ?? 0;
      totalScore += finalScore;
      totalMaxScore += answer.maxScore;
    }

    // Apply late penalty
    if (submission.latePenaltyApplied > 0) {
      totalScore *= (1 - submission.latePenaltyApplied / 100);
    }

    submission.score = Math.round(totalScore * 100) / 100;
    submission.percentage = totalMaxScore > 0
      ? Math.round((totalScore / totalMaxScore) * 100 * 100) / 100
      : 0;
  }
}
```

### 3. submissions.controller.ts

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { SubmissionsService } from './submissions.service';
import { SaveAnswersDto, GradeSubmissionDto } from './dto/submission.dto';

@ApiTags('Submissions')
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  // Student endpoints
  @Post('assignments/:assignmentId/start')
  @Roles('student')
  @ApiOperation({ summary: 'Start assignment attempt' })
  async startAttempt(
    @Param('assignmentId') assignmentId: string,
    @CurrentUser('id') studentId: string,
  ) {
    return this.submissionsService.startAttempt(assignmentId, studentId);
  }

  @Get('submissions/:id')
  @Roles('student', 'teacher', 'admin')
  @ApiOperation({ summary: 'Get submission details' })
  async getSubmission(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.submissionsService.getSubmission(id, userId);
  }

  @Put('submissions/:id/save')
  @Roles('student')
  @ApiOperation({ summary: 'Save answers (auto-save)' })
  async saveAnswers(
    @Param('id') id: string,
    @Body() dto: SaveAnswersDto,
    @CurrentUser('id') studentId: string,
  ) {
    return this.submissionsService.saveAnswers(id, studentId, dto);
  }

  @Post('submissions/:id/submit')
  @Roles('student')
  @ApiOperation({ summary: 'Submit assignment' })
  async submit(
    @Param('id') id: string,
    @CurrentUser('id') studentId: string,
  ) {
    return this.submissionsService.submit(id, studentId);
  }

  @Get('students/assignments')
  @Roles('student')
  @ApiOperation({ summary: 'Get my assignments across all classes' })
  async getMyAssignments(
    @CurrentUser('id') studentId: string,
    @Query('classId') classId?: string,
  ) {
    return this.submissionsService.getStudentAssignments(studentId, classId);
  }

  // Teacher endpoints
  @Get('assignments/:assignmentId/submissions')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'List all submissions for an assignment' })
  async getSubmissionsList(@Param('assignmentId') assignmentId: string) {
    return this.submissionsService.getSubmissionsList(assignmentId);
  }

  @Put('submissions/:id/grade')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Grade a submission' })
  async gradeSubmission(
    @Param('id') id: string,
    @Body() dto: GradeSubmissionDto,
    @CurrentUser('id') teacherId: string,
  ) {
    return this.submissionsService.gradeSubmission(id, teacherId, dto);
  }
}
```

---

## ✅ Acceptance Criteria

- [ ] Start attempt creates submission + answer slots
- [ ] Max attempts enforced
- [ ] In-progress attempt returned if exists
- [ ] Save answers updates correctly
- [ ] Time limit auto-submits
- [ ] Submit calculates time spent
- [ ] Late penalty applied correctly
- [ ] Auto-grade MCQ/TF/Fill-blank
- [ ] AI scoring queued for essay/speaking
- [ ] Teacher can grade manually
- [ ] Final score calculated with overrides

---

## 🧪 Test Cases

```typescript
describe('SubmissionsService', () => {
  it('starts new attempt', async () => {
    const result = await service.startAttempt(assignmentId, studentId);
    expect(result.status).toBe('in_progress');
    expect(result.attemptNumber).toBe(1);
  });

  it('blocks over max attempts', async () => {
    // Already 2 attempts, max is 2
    await expect(
      service.startAttempt(assignmentId, studentId)
    ).rejects.toThrow('Maximum attempts');
  });

  it('auto-grades multiple choice', async () => {
    await service.saveAnswers(submissionId, studentId, {
      answers: [{ questionId: 'q1', selectedOptionId: 'correct-option' }],
    });
    await service.submit(submissionId, studentId);
    
    const result = await service.getSubmission(submissionId, studentId);
    const answer = result.answers.find(a => a.questionId === 'q1');
    expect(answer.isCorrect).toBe(true);
  });

  it('applies late penalty', async () => {
    // Assignment due yesterday, 10% per day penalty
    await service.submit(submissionId, studentId);
    
    const result = await service.getSubmission(submissionId, studentId);
    expect(result.isLate).toBe(true);
    expect(result.latePenaltyApplied).toBe(10);
  });
});
```

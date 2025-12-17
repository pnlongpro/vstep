# BE-011: Practice Session Service

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-011 |
| **Phase** | 1 - MVP |
| **Sprint** | 3-4 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 6h |
| **Dependencies** | BE-010 |

---

## 🎯 Objective

Implement Practice Session service:
- Create và manage practice sessions
- Track session progress
- Handle pause/resume
- Support draft saving
- Calculate time spent

---

## 📝 Requirements

### Features

1. **Session Management**:
   - Start new practice session
   - Pause/resume session
   - Complete/abandon session
   - Get session status

2. **Progress Tracking**:
   - Current question index
   - Answered questions count
   - Time tracking per question

---

## 💻 Implementation

### Step 1: Session Enums

```typescript
// src/shared/enums/practice.enum.ts

export enum PracticeMode {
  PRACTICE = 'practice',
  MOCK_TEST = 'mock_test',
  REVIEW = 'review',
}

export enum SessionStatus {
  IN_PROGRESS = 'in_progress',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
  EXPIRED = 'expired',
}
```

### Step 2: PracticeSession Entity

```typescript
// src/modules/practice/entities/practice-session.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '@/modules/users/entities/user.entity';
import { ExamSection } from '@/modules/exams/entities/exam-section.entity';
import { PracticeAnswer } from './practice-answer.entity';
import { Skill, VstepLevel } from '@/shared/enums/exam.enum';
import { PracticeMode, SessionStatus } from '@/shared/enums/practice.enum';

@Entity('practice_sessions')
export class PracticeSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'section_id', type: 'uuid', nullable: true })
  sectionId: string;

  @ManyToOne(() => ExamSection, { nullable: true })
  @JoinColumn({ name: 'section_id' })
  section: ExamSection;

  @Column({ type: 'enum', enum: Skill })
  skill: Skill;

  @Column({ type: 'enum', enum: VstepLevel })
  level: VstepLevel;

  @Column({ type: 'enum', enum: PracticeMode, default: PracticeMode.PRACTICE })
  mode: PracticeMode;

  @Column({ type: 'enum', enum: SessionStatus, default: SessionStatus.IN_PROGRESS })
  status: SessionStatus;

  @Column({ name: 'total_questions', type: 'int', default: 0 })
  totalQuestions: number;

  @Column({ name: 'answered_count', type: 'int', default: 0 })
  answeredCount: number;

  @Column({ name: 'correct_count', type: 'int', default: 0 })
  correctCount: number;

  @Column({ name: 'current_question_index', type: 'int', default: 0 })
  currentQuestionIndex: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  score: number;

  @Column({ name: 'max_score', type: 'decimal', precision: 5, scale: 2, nullable: true })
  maxScore: number;

  @Column({ name: 'time_limit', type: 'int', nullable: true, comment: 'Time limit in seconds' })
  timeLimit: number;

  @Column({ name: 'time_spent', type: 'int', default: 0, comment: 'Time spent in seconds' })
  timeSpent: number;

  @Column({ name: 'started_at', type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ name: 'paused_at', type: 'timestamp', nullable: true })
  pausedAt: Date;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt: Date;

  @Column({ type: 'json', nullable: true, comment: 'Question IDs in order' })
  questionOrder: string[];

  @Column({ type: 'json', nullable: true, comment: 'Additional settings' })
  settings: Record<string, any>;

  @OneToMany(() => PracticeAnswer, (answer) => answer.session, { cascade: true })
  answers: PracticeAnswer[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### Step 3: PracticeAnswer Entity

```typescript
// src/modules/practice/entities/practice-answer.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PracticeSession } from './practice-session.entity';
import { Question } from '@/modules/questions/entities/question.entity';

@Entity('practice_answers')
export class PracticeAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'session_id', type: 'uuid' })
  sessionId: string;

  @ManyToOne(() => PracticeSession, (session) => session.answers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  session: PracticeSession;

  @Column({ name: 'question_id', type: 'uuid' })
  questionId: string;

  @ManyToOne(() => Question)
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @Column({ type: 'text', nullable: true })
  answer: string;

  @Column({ name: 'selected_option_id', type: 'uuid', nullable: true })
  selectedOptionId: string;

  @Column({ name: 'is_correct', type: 'boolean', nullable: true })
  isCorrect: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  score: number;

  @Column({ name: 'max_score', type: 'decimal', precision: 5, scale: 2, default: 1 })
  maxScore: number;

  @Column({ name: 'time_spent', type: 'int', default: 0, comment: 'Seconds spent on this question' })
  timeSpent: number;

  @Column({ name: 'is_flagged', type: 'boolean', default: false })
  isFlagged: boolean;

  @Column({ name: 'answered_at', type: 'timestamp', nullable: true })
  answeredAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### Step 4: DTOs

```typescript
// src/modules/practice/dto/create-session.dto.ts
import { IsEnum, IsUUID, IsOptional, IsInt, IsObject } from 'class-validator';
import { Skill, VstepLevel } from '@/shared/enums/exam.enum';
import { PracticeMode } from '@/shared/enums/practice.enum';

export class CreateSessionDto {
  @IsEnum(Skill)
  skill: Skill;

  @IsEnum(VstepLevel)
  level: VstepLevel;

  @IsEnum(PracticeMode)
  @IsOptional()
  mode?: PracticeMode = PracticeMode.PRACTICE;

  @IsUUID()
  @IsOptional()
  sectionId?: string;

  @IsInt()
  @IsOptional()
  questionCount?: number;

  @IsInt()
  @IsOptional()
  timeLimit?: number; // seconds

  @IsObject()
  @IsOptional()
  settings?: Record<string, any>;
}

// src/modules/practice/dto/submit-answer.dto.ts
import { IsUUID, IsString, IsOptional, IsInt, IsBoolean } from 'class-validator';

export class SubmitAnswerDto {
  @IsUUID()
  questionId: string;

  @IsString()
  @IsOptional()
  answer?: string;

  @IsUUID()
  @IsOptional()
  selectedOptionId?: string;

  @IsInt()
  @IsOptional()
  timeSpent?: number;

  @IsBoolean()
  @IsOptional()
  isFlagged?: boolean;
}

// src/modules/practice/dto/update-session.dto.ts
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { SessionStatus } from '@/shared/enums/practice.enum';

export class UpdateSessionDto {
  @IsEnum(SessionStatus)
  @IsOptional()
  status?: SessionStatus;

  @IsInt()
  @IsOptional()
  currentQuestionIndex?: number;

  @IsInt()
  @IsOptional()
  timeSpent?: number;
}

// src/modules/practice/dto/session-response.dto.ts
export class SessionResponseDto {
  id: string;
  skill: string;
  level: string;
  mode: string;
  status: string;
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  currentQuestionIndex: number;
  score: number | null;
  maxScore: number | null;
  timeLimit: number | null;
  timeSpent: number;
  startedAt: Date | null;
  completedAt: Date | null;
  questionOrder: string[];
}
```

### Step 5: Practice Session Service

```typescript
// src/modules/practice/practice-session.service.ts
import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { PracticeSession } from './entities/practice-session.entity';
import { PracticeAnswer } from './entities/practice-answer.entity';
import { Question } from '@/modules/questions/entities/question.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionStatus, PracticeMode } from '@/shared/enums/practice.enum';

@Injectable()
export class PracticeSessionService {
  constructor(
    @InjectRepository(PracticeSession)
    private sessionRepo: Repository<PracticeSession>,
    @InjectRepository(PracticeAnswer)
    private answerRepo: Repository<PracticeAnswer>,
    @InjectRepository(Question)
    private questionRepo: Repository<Question>,
  ) {}

  async createSession(userId: string, dto: CreateSessionDto): Promise<PracticeSession> {
    // Get questions based on skill, level
    const questions = await this.getQuestionsForSession(dto);
    
    if (questions.length === 0) {
      throw new BadRequestException('Không tìm thấy câu hỏi phù hợp');
    }

    const questionOrder = questions.map(q => q.id);
    const totalQuestions = questionOrder.length;

    // Calculate max score
    const maxScore = questions.reduce((sum, q) => sum + q.points, 0);

    const session = this.sessionRepo.create({
      userId,
      skill: dto.skill,
      level: dto.level,
      mode: dto.mode || PracticeMode.PRACTICE,
      sectionId: dto.sectionId,
      totalQuestions,
      questionOrder,
      maxScore,
      timeLimit: dto.timeLimit,
      settings: dto.settings,
      startedAt: new Date(),
      expiresAt: dto.timeLimit 
        ? new Date(Date.now() + dto.timeLimit * 1000)
        : null,
    });

    return this.sessionRepo.save(session);
  }

  async getSession(sessionId: string, userId: string): Promise<PracticeSession> {
    const session = await this.sessionRepo.findOne({
      where: { id: sessionId },
      relations: ['answers', 'section'],
    });

    if (!session) {
      throw new NotFoundException('Không tìm thấy phiên luyện tập');
    }

    if (session.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền truy cập phiên này');
    }

    // Check if expired
    if (session.expiresAt && new Date() > session.expiresAt) {
      if (session.status === SessionStatus.IN_PROGRESS) {
        session.status = SessionStatus.EXPIRED;
        await this.sessionRepo.save(session);
      }
    }

    return session;
  }

  async getSessionWithQuestions(sessionId: string, userId: string) {
    const session = await this.getSession(sessionId, userId);
    
    // Get questions in order
    const questions = await this.questionRepo.find({
      where: { id: In(session.questionOrder) },
      relations: ['options'],
    });

    // Sort by order
    const orderedQuestions = session.questionOrder.map(id => 
      questions.find(q => q.id === id)
    ).filter(Boolean);

    return {
      session,
      questions: orderedQuestions,
    };
  }

  async submitAnswer(
    sessionId: string, 
    userId: string, 
    dto: SubmitAnswerDto
  ): Promise<PracticeAnswer> {
    const session = await this.getSession(sessionId, userId);

    if (session.status !== SessionStatus.IN_PROGRESS) {
      throw new BadRequestException('Phiên luyện tập đã kết thúc');
    }

    // Get question to validate answer
    const question = await this.questionRepo.findOne({
      where: { id: dto.questionId },
      relations: ['options'],
    });

    if (!question) {
      throw new NotFoundException('Không tìm thấy câu hỏi');
    }

    // Check if already answered
    let answer = await this.answerRepo.findOne({
      where: { sessionId, questionId: dto.questionId },
    });

    // Calculate correctness and score
    const { isCorrect, score } = this.evaluateAnswer(question, dto);

    if (answer) {
      // Update existing answer
      answer.answer = dto.answer;
      answer.selectedOptionId = dto.selectedOptionId;
      answer.isCorrect = isCorrect;
      answer.score = score;
      answer.timeSpent = (answer.timeSpent || 0) + (dto.timeSpent || 0);
      answer.isFlagged = dto.isFlagged ?? answer.isFlagged;
      answer.answeredAt = new Date();
    } else {
      // Create new answer
      answer = this.answerRepo.create({
        sessionId,
        questionId: dto.questionId,
        answer: dto.answer,
        selectedOptionId: dto.selectedOptionId,
        isCorrect,
        score,
        maxScore: question.points,
        timeSpent: dto.timeSpent || 0,
        isFlagged: dto.isFlagged || false,
        answeredAt: new Date(),
      });

      // Update session counts
      session.answeredCount += 1;
      if (isCorrect) {
        session.correctCount += 1;
      }
    }

    await this.answerRepo.save(answer);
    await this.sessionRepo.save(session);

    return answer;
  }

  async updateSession(
    sessionId: string,
    userId: string,
    dto: UpdateSessionDto
  ): Promise<PracticeSession> {
    const session = await this.getSession(sessionId, userId);

    if (dto.currentQuestionIndex !== undefined) {
      session.currentQuestionIndex = dto.currentQuestionIndex;
    }

    if (dto.timeSpent !== undefined) {
      session.timeSpent = dto.timeSpent;
    }

    if (dto.status) {
      await this.updateSessionStatus(session, dto.status);
    }

    return this.sessionRepo.save(session);
  }

  async pauseSession(sessionId: string, userId: string): Promise<PracticeSession> {
    const session = await this.getSession(sessionId, userId);
    
    if (session.status !== SessionStatus.IN_PROGRESS) {
      throw new BadRequestException('Chỉ có thể tạm dừng phiên đang diễn ra');
    }

    session.status = SessionStatus.PAUSED;
    session.pausedAt = new Date();

    return this.sessionRepo.save(session);
  }

  async resumeSession(sessionId: string, userId: string): Promise<PracticeSession> {
    const session = await this.getSession(sessionId, userId);
    
    if (session.status !== SessionStatus.PAUSED) {
      throw new BadRequestException('Phiên không ở trạng thái tạm dừng');
    }

    // Adjust expiry time if there was a time limit
    if (session.expiresAt && session.pausedAt) {
      const pauseDuration = Date.now() - session.pausedAt.getTime();
      session.expiresAt = new Date(session.expiresAt.getTime() + pauseDuration);
    }

    session.status = SessionStatus.IN_PROGRESS;
    session.pausedAt = null;

    return this.sessionRepo.save(session);
  }

  async completeSession(sessionId: string, userId: string): Promise<PracticeSession> {
    const session = await this.getSession(sessionId, userId);
    
    if (session.status === SessionStatus.COMPLETED) {
      return session;
    }

    // Calculate final score
    const answers = await this.answerRepo.find({
      where: { sessionId },
    });

    const totalScore = answers.reduce((sum, a) => sum + Number(a.score), 0);
    
    session.score = totalScore;
    session.status = SessionStatus.COMPLETED;
    session.completedAt = new Date();
    session.answeredCount = answers.length;
    session.correctCount = answers.filter(a => a.isCorrect).length;

    return this.sessionRepo.save(session);
  }

  async abandonSession(sessionId: string, userId: string): Promise<PracticeSession> {
    const session = await this.getSession(sessionId, userId);
    
    session.status = SessionStatus.ABANDONED;
    session.completedAt = new Date();

    return this.sessionRepo.save(session);
  }

  async getUserSessions(
    userId: string,
    options: {
      skill?: string;
      status?: SessionStatus;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<{ sessions: PracticeSession[]; total: number }> {
    const query = this.sessionRepo.createQueryBuilder('session')
      .where('session.userId = :userId', { userId })
      .orderBy('session.createdAt', 'DESC');

    if (options.skill) {
      query.andWhere('session.skill = :skill', { skill: options.skill });
    }

    if (options.status) {
      query.andWhere('session.status = :status', { status: options.status });
    }

    const total = await query.getCount();
    
    if (options.limit) {
      query.take(options.limit);
    }
    if (options.offset) {
      query.skip(options.offset);
    }

    const sessions = await query.getMany();

    return { sessions, total };
  }

  // Private helper methods

  private async getQuestionsForSession(dto: CreateSessionDto): Promise<Question[]> {
    const query = this.questionRepo.createQueryBuilder('q')
      .where('q.skill = :skill', { skill: dto.skill })
      .andWhere('q.level = :level', { level: dto.level })
      .andWhere('q.isActive = :isActive', { isActive: true });

    if (dto.sectionId) {
      query.innerJoin('q.passage', 'p')
        .andWhere('p.sectionId = :sectionId', { sectionId: dto.sectionId });
    }

    // Randomize and limit
    query.orderBy('RAND()');
    
    if (dto.questionCount) {
      query.take(dto.questionCount);
    } else {
      query.take(20); // Default 20 questions
    }

    return query.getMany();
  }

  private evaluateAnswer(
    question: Question, 
    dto: SubmitAnswerDto
  ): { isCorrect: boolean; score: number } {
    // For multiple choice
    if (dto.selectedOptionId) {
      const correctOption = question.options?.find(o => o.isCorrect);
      const isCorrect = correctOption?.id === dto.selectedOptionId;
      return {
        isCorrect,
        score: isCorrect ? question.points : 0,
      };
    }

    // For fill-in-blank, short answer
    if (dto.answer && question.correctAnswer) {
      const isCorrect = this.compareAnswers(dto.answer, question.correctAnswer);
      return {
        isCorrect,
        score: isCorrect ? question.points : 0,
      };
    }

    // For essay, speaking - requires AI scoring (return null)
    return {
      isCorrect: null,
      score: 0,
    };
  }

  private compareAnswers(userAnswer: string, correctAnswer: string): boolean {
    // Normalize and compare
    const normalize = (s: string) => s.toLowerCase().trim().replace(/\s+/g, ' ');
    return normalize(userAnswer) === normalize(correctAnswer);
  }

  private async updateSessionStatus(session: PracticeSession, status: SessionStatus): Promise<void> {
    switch (status) {
      case SessionStatus.COMPLETED:
        session.status = SessionStatus.COMPLETED;
        session.completedAt = new Date();
        break;
      case SessionStatus.ABANDONED:
        session.status = SessionStatus.ABANDONED;
        session.completedAt = new Date();
        break;
      case SessionStatus.PAUSED:
        session.status = SessionStatus.PAUSED;
        session.pausedAt = new Date();
        break;
      default:
        session.status = status;
    }
  }
}
```

### Step 6: Controller

```typescript
// src/modules/practice/practice-session.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { PracticeSessionService } from './practice-session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@ApiTags('Practice Sessions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('practice/sessions')
export class PracticeSessionController {
  constructor(private readonly sessionService: PracticeSessionService) {}

  @Post()
  @ApiOperation({ summary: 'Start a new practice session' })
  async createSession(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateSessionDto,
  ) {
    return this.sessionService.createSession(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user practice sessions' })
  async getSessions(
    @CurrentUser('id') userId: string,
    @Query('skill') skill?: string,
    @Query('status') status?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.sessionService.getUserSessions(userId, {
      skill,
      status: status as any,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get practice session details' })
  async getSession(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) sessionId: string,
  ) {
    return this.sessionService.getSession(sessionId, userId);
  }

  @Get(':id/questions')
  @ApiOperation({ summary: 'Get session with questions' })
  async getSessionWithQuestions(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) sessionId: string,
  ) {
    return this.sessionService.getSessionWithQuestions(sessionId, userId);
  }

  @Post(':id/answers')
  @ApiOperation({ summary: 'Submit answer for a question' })
  async submitAnswer(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) sessionId: string,
    @Body() dto: SubmitAnswerDto,
  ) {
    return this.sessionService.submitAnswer(sessionId, userId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update session (progress, status)' })
  async updateSession(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) sessionId: string,
    @Body() dto: UpdateSessionDto,
  ) {
    return this.sessionService.updateSession(sessionId, userId, dto);
  }

  @Post(':id/pause')
  @ApiOperation({ summary: 'Pause the session' })
  async pauseSession(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) sessionId: string,
  ) {
    return this.sessionService.pauseSession(sessionId, userId);
  }

  @Post(':id/resume')
  @ApiOperation({ summary: 'Resume a paused session' })
  async resumeSession(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) sessionId: string,
  ) {
    return this.sessionService.resumeSession(sessionId, userId);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete the session' })
  async completeSession(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) sessionId: string,
  ) {
    return this.sessionService.completeSession(sessionId, userId);
  }

  @Post(':id/abandon')
  @ApiOperation({ summary: 'Abandon the session' })
  async abandonSession(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) sessionId: string,
  ) {
    return this.sessionService.abandonSession(sessionId, userId);
  }
}
```

---

## ✅ Acceptance Criteria

- [ ] Create practice session with random questions
- [ ] Submit answers và auto-score (R/L)
- [ ] Track session progress
- [ ] Pause/resume session
- [ ] Complete/abandon session
- [ ] Get user session history
- [ ] Time tracking works correctly

---

## 🧪 Testing

```bash
# Create session
POST /practice/sessions
{ "skill": "reading", "level": "B1", "questionCount": 10 }

# Submit answer
POST /practice/sessions/:id/answers
{ "questionId": "...", "selectedOptionId": "..." }

# Complete session
POST /practice/sessions/:id/complete
```

---

## ⏭️ Next Task

→ `BE-012_READING_API.md` - Reading Questions API

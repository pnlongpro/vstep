# BE-017: Draft Saving Service

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-017 |
| **Phase** | 1 - MVP |
| **Sprint** | 3-4 |
| **Priority** | P2 (Medium) |
| **Estimated Hours** | 4h |
| **Dependencies** | BE-011 |

---

## 🎯 Objective

Implement Draft Saving Service với:
- Auto-save drafts mỗi 30 giây (Writing)
- Manual save drafts
- Draft recovery khi user quay lại
- Cleanup expired drafts

---

## 💻 Implementation

### Step 1: Draft Entity

```typescript
// src/modules/practice/entities/draft-answer.entity.ts
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
import { User } from '@/modules/users/entities/user.entity';
import { PracticeSession } from './practice-session.entity';
import { Question } from '@/modules/exams/entities/question.entity';

@Entity('draft_answers')
@Index(['userId', 'sessionId'])
@Index(['userId', 'questionId'])
export class DraftAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'session_id', nullable: true })
  sessionId: string;

  @ManyToOne(() => PracticeSession, { nullable: true })
  @JoinColumn({ name: 'session_id' })
  session: PracticeSession;

  @Column({ name: 'question_id', nullable: true })
  questionId: string;

  @ManyToOne(() => Question, { nullable: true })
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'json', nullable: true })
  metadata: {
    wordCount?: number;
    characterCount?: number;
    timeSpent?: number;
    lastCursorPosition?: number;
  };

  @Column({ type: 'int', default: 1 })
  version: number;

  @Column({ name: 'is_auto_save', default: true })
  isAutoSave: boolean;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### Step 2: Draft DTOs

```typescript
// src/modules/practice/dto/save-draft.dto.ts
import {
  IsString,
  IsOptional,
  IsUUID,
  IsNumber,
  IsBoolean,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class DraftMetadataDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  wordCount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  characterCount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  timeSpent?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  lastCursorPosition?: number;
}

export class SaveDraftDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  sessionId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  questionId?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(50000)
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => DraftMetadataDto)
  metadata?: DraftMetadataDto;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isAutoSave?: boolean;
}

// src/modules/practice/dto/draft-response.dto.ts
export class DraftResponseDto {
  id: string;
  content: string;
  metadata: any;
  version: number;
  isAutoSave: boolean;
  updatedAt: Date;
  expiresAt: Date;
}
```

### Step 3: Draft Service

```typescript
// src/modules/practice/services/draft.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DraftAnswer } from '../entities/draft-answer.entity';
import { SaveDraftDto, DraftResponseDto } from '../dto';
import { CacheService } from '@/core/cache/cache.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DraftService {
  private readonly draftExpiryHours: number;

  constructor(
    @InjectRepository(DraftAnswer)
    private readonly draftRepository: Repository<DraftAnswer>,
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
  ) {
    this.draftExpiryHours = this.configService.get('DRAFT_EXPIRY_HOURS', 72);
  }

  /**
   * Save or update a draft
   */
  async saveDraft(userId: string, dto: SaveDraftDto): Promise<DraftResponseDto> {
    const cacheKey = this.getCacheKey(userId, dto.sessionId, dto.questionId);

    // Check for existing draft
    let draft = await this.findExistingDraft(userId, dto.sessionId, dto.questionId);

    if (draft) {
      // Update existing draft
      draft.content = dto.content;
      draft.metadata = {
        ...draft.metadata,
        ...dto.metadata,
      };
      draft.version += 1;
      draft.isAutoSave = dto.isAutoSave ?? true;
      draft.expiresAt = this.calculateExpiryDate();
    } else {
      // Create new draft
      draft = this.draftRepository.create({
        userId,
        sessionId: dto.sessionId,
        questionId: dto.questionId,
        content: dto.content,
        metadata: dto.metadata,
        isAutoSave: dto.isAutoSave ?? true,
        version: 1,
        expiresAt: this.calculateExpiryDate(),
      });
    }

    const saved = await this.draftRepository.save(draft);

    // Update cache
    await this.cacheService.set(cacheKey, this.toResponseDto(saved), 3600);

    return this.toResponseDto(saved);
  }

  /**
   * Get draft by session or question
   */
  async getDraft(
    userId: string,
    sessionId?: string,
    questionId?: string,
  ): Promise<DraftResponseDto | null> {
    const cacheKey = this.getCacheKey(userId, sessionId, questionId);

    // Check cache first
    const cached = await this.cacheService.get<DraftResponseDto>(cacheKey);
    if (cached) return cached;

    const draft = await this.findExistingDraft(userId, sessionId, questionId);
    if (!draft) return null;

    // Check if expired
    if (draft.expiresAt < new Date()) {
      await this.deleteDraft(draft.id);
      return null;
    }

    const response = this.toResponseDto(draft);
    await this.cacheService.set(cacheKey, response, 3600);

    return response;
  }

  /**
   * Get all drafts for a user
   */
  async getUserDrafts(userId: string): Promise<DraftResponseDto[]> {
    const drafts = await this.draftRepository.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
      relations: ['session', 'question'],
    });

    return drafts
      .filter(d => d.expiresAt > new Date())
      .map(d => this.toResponseDto(d));
  }

  /**
   * Get drafts for a session
   */
  async getSessionDrafts(
    userId: string,
    sessionId: string,
  ): Promise<DraftResponseDto[]> {
    const drafts = await this.draftRepository.find({
      where: { userId, sessionId },
      order: { updatedAt: 'DESC' },
    });

    return drafts.map(d => this.toResponseDto(d));
  }

  /**
   * Delete a draft
   */
  async deleteDraft(draftId: string): Promise<void> {
    const draft = await this.draftRepository.findOne({
      where: { id: draftId },
    });

    if (draft) {
      const cacheKey = this.getCacheKey(
        draft.userId,
        draft.sessionId,
        draft.questionId,
      );
      await this.cacheService.delete(cacheKey);
      await this.draftRepository.remove(draft);
    }
  }

  /**
   * Delete all drafts for a session (when session is submitted)
   */
  async deleteSessionDrafts(userId: string, sessionId: string): Promise<void> {
    await this.draftRepository.delete({ userId, sessionId });
    await this.cacheService.deleteByPattern(`draft:${userId}:${sessionId}:*`);
  }

  /**
   * Convert draft to submitted answer
   * Called when user submits a practice session
   */
  async convertDraftToAnswer(draftId: string): Promise<{
    content: string;
    metadata: any;
  }> {
    const draft = await this.draftRepository.findOne({
      where: { id: draftId },
    });

    if (!draft) {
      throw new NotFoundException(`Draft ${draftId} not found`);
    }

    const result = {
      content: draft.content,
      metadata: draft.metadata,
    };

    // Delete the draft after conversion
    await this.deleteDraft(draftId);

    return result;
  }

  /**
   * Cleanup expired drafts (runs daily at 3 AM)
   */
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async cleanupExpiredDrafts(): Promise<void> {
    const result = await this.draftRepository.delete({
      expiresAt: LessThan(new Date()),
    });

    console.log(`Cleaned up ${result.affected} expired drafts`);
  }

  /**
   * Find existing draft
   */
  private async findExistingDraft(
    userId: string,
    sessionId?: string,
    questionId?: string,
  ): Promise<DraftAnswer | null> {
    const whereCondition: any = { userId };

    if (sessionId) {
      whereCondition.sessionId = sessionId;
    }
    if (questionId) {
      whereCondition.questionId = questionId;
    }

    return this.draftRepository.findOne({
      where: whereCondition,
      order: { updatedAt: 'DESC' },
    });
  }

  /**
   * Calculate expiry date
   */
  private calculateExpiryDate(): Date {
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + this.draftExpiryHours);
    return expiry;
  }

  /**
   * Get cache key
   */
  private getCacheKey(
    userId: string,
    sessionId?: string,
    questionId?: string,
  ): string {
    return `draft:${userId}:${sessionId || 'none'}:${questionId || 'none'}`;
  }

  /**
   * Convert entity to response DTO
   */
  private toResponseDto(draft: DraftAnswer): DraftResponseDto {
    return {
      id: draft.id,
      content: draft.content,
      metadata: draft.metadata,
      version: draft.version,
      isAutoSave: draft.isAutoSave,
      updatedAt: draft.updatedAt,
      expiresAt: draft.expiresAt,
    };
  }
}
```

### Step 4: Draft Controller

```typescript
// src/modules/practice/controllers/draft.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from '@/modules/users/entities/user.entity';
import { Throttle } from '@nestjs/throttler';
import { DraftService } from '../services/draft.service';
import { SaveDraftDto } from '../dto';

@ApiTags('Practice Drafts')
@Controller('practice/drafts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DraftController {
  constructor(private readonly draftService: DraftService) {}

  @Post()
  @Throttle({ default: { limit: 60, ttl: 60000 } }) // 60 saves per minute (for auto-save)
  @ApiOperation({ summary: 'Save or update a draft' })
  @ApiResponse({ status: 200, description: 'Draft saved successfully' })
  async saveDraft(
    @CurrentUser() user: User,
    @Body() dto: SaveDraftDto,
  ) {
    return this.draftService.saveDraft(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all drafts for current user' })
  async getUserDrafts(@CurrentUser() user: User) {
    return this.draftService.getUserDrafts(user.id);
  }

  @Get('session/:sessionId')
  @ApiOperation({ summary: 'Get drafts for a session' })
  async getSessionDrafts(
    @CurrentUser() user: User,
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
  ) {
    return this.draftService.getSessionDrafts(user.id, sessionId);
  }

  @Get('recover')
  @ApiOperation({ summary: 'Recover draft by session or question ID' })
  async recoverDraft(
    @CurrentUser() user: User,
    @Query('sessionId') sessionId?: string,
    @Query('questionId') questionId?: string,
  ) {
    return this.draftService.getDraft(user.id, sessionId, questionId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a draft' })
  async deleteDraft(@Param('id', ParseUUIDPipe) id: string) {
    return this.draftService.deleteDraft(id);
  }

  @Delete('session/:sessionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete all drafts for a session' })
  async deleteSessionDrafts(
    @CurrentUser() user: User,
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
  ) {
    return this.draftService.deleteSessionDrafts(user.id, sessionId);
  }
}
```

### Step 5: Integration with Practice Session

```typescript
// Additions to practice-session.service.ts

/**
 * Submit session with draft conversion
 */
async submitSessionWithDrafts(
  sessionId: string,
  userId: string,
): Promise<PracticeSession> {
  const session = await this.findById(sessionId, userId);

  // Get all drafts for this session
  const drafts = await this.draftService.getSessionDrafts(userId, sessionId);

  // Convert drafts to answers
  for (const draft of drafts) {
    if (draft.content) {
      // Create answer from draft
      await this.answerService.submitFromDraft(
        sessionId,
        draft.questionId, // Assuming draft has questionId in metadata
        draft.content,
        draft.metadata,
      );
    }
  }

  // Delete all drafts
  await this.draftService.deleteSessionDrafts(userId, sessionId);

  // Complete session
  return this.completeSession(sessionId, userId);
}

/**
 * Resume session with drafts
 */
async resumeSession(
  sessionId: string,
  userId: string,
): Promise<{
  session: PracticeSession;
  drafts: DraftResponseDto[];
}> {
  const session = await this.findById(sessionId, userId);
  
  if (session.status !== 'in_progress' && session.status !== 'paused') {
    throw new BadRequestException('Cannot resume a completed session');
  }

  // Update status to in_progress
  session.status = 'in_progress';
  session.lastActiveAt = new Date();
  await this.sessionRepository.save(session);

  // Get drafts for this session
  const drafts = await this.draftService.getSessionDrafts(userId, sessionId);

  return { session, drafts };
}
```

---

## ✅ Acceptance Criteria

- [ ] Auto-save works every 30 seconds
- [ ] Manual save creates new version
- [ ] Draft recovery loads latest content
- [ ] Expired drafts cleaned up automatically
- [ ] Drafts converted to answers on submit
- [ ] Rate limiting prevents abuse

---

## ⏭️ Next Task

→ `BE-018_QUESTION_IMPORT_EXPORT.md` - Question Import/Export

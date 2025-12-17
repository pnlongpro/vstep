# BE-021: Exam Timer Service

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-021 |
| **Phase** | 1 - MVP |
| **Sprint** | 5-6 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 5h |
| **Dependencies** | BE-020 |

---

## 🎯 Objective

Implement Timer Service với:
- Server-side time tracking (anti-cheat)
- Section-level timing
- Auto-timeout trigger
- Time sync với client

---

## 💻 Implementation

### Step 1: Timer Configuration

```typescript
// src/modules/exams/config/timer.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('timer', () => ({
  syncIntervalSeconds: 10,
  warningThresholds: [300, 180, 60, 30], // seconds before end
  autoSubmitGracePeriod: 5, // seconds after timeout
  maxPauseDuration: 3600, // 1 hour max pause
  antiCheatEnabled: true,
  toleranceSeconds: 5, // Client-server time tolerance
}));

export interface TimerConfig {
  syncIntervalSeconds: number;
  warningThresholds: number[];
  autoSubmitGracePeriod: number;
  maxPauseDuration: number;
  antiCheatEnabled: boolean;
  toleranceSeconds: number;
}
```

### Step 2: Timer DTOs

```typescript
// src/modules/exams/dto/timer.dto.ts
import { IsUUID, IsInt, IsOptional, Min, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TimeSyncRequestDto {
  @ApiProperty()
  @IsUUID()
  attemptId: string;

  @ApiProperty({ description: 'Client timestamp in milliseconds' })
  @IsInt()
  clientTimestamp: number;

  @ApiPropertyOptional({ description: 'Client-calculated remaining time in seconds' })
  @IsOptional()
  @IsInt()
  @Min(0)
  clientTimeRemaining?: number;

  @ApiPropertyOptional({ description: 'Current section ID' })
  @IsOptional()
  @IsUUID()
  sectionId?: string;
}

export class TimeSyncResponseDto {
  serverTimestamp: number;
  totalTimeRemaining: number;
  sectionTimeRemaining: number;
  currentSectionId: string;
  isExpired: boolean;
  shouldSubmit: boolean;
  warnings: string[];
  drift: number; // Difference between client and server time
}

export class SectionTimingDto {
  sectionId: string;
  skill: string;
  timeLimit: number;
  timeSpent: number;
  timeRemaining: number;
  isCompleted: boolean;
}

export class ExamTimingDto {
  attemptId: string;
  status: string;
  startedAt: Date;
  totalTimeLimit: number;
  totalTimeRemaining: number;
  totalTimeSpent: number;
  currentSectionId: string;
  sections: SectionTimingDto[];
  isPaused: boolean;
  pausedAt?: Date;
}
```

### Step 3: Timer Service

```typescript
// src/modules/exams/services/exam-timer.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, In } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ExamAttempt, AttemptStatus } from '../entities/exam-attempt.entity';
import { ExamSection } from '../entities/exam-section.entity';
import { CacheService } from '@/core/cache/cache.service';
import {
  TimeSyncRequestDto,
  TimeSyncResponseDto,
  ExamTimingDto,
  SectionTimingDto,
} from '../dto/timer.dto';
import { TimerConfig } from '../config/timer.config';

interface CachedTiming {
  attemptId: string;
  startedAt: number;
  timeLimit: number;
  lastSyncAt: number;
  sectionTimes: { [sectionId: string]: { started: number; spent: number; limit: number } };
  pausedAt?: number;
  totalPausedTime: number;
}

@Injectable()
export class ExamTimerService {
  private readonly config: TimerConfig;

  constructor(
    @InjectRepository(ExamAttempt)
    private readonly attemptRepository: Repository<ExamAttempt>,
    @InjectRepository(ExamSection)
    private readonly sectionRepository: Repository<ExamSection>,
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.config = this.configService.get<TimerConfig>('timer');
  }

  /**
   * Initialize timing for a new exam attempt
   */
  async initializeTiming(attemptId: string): Promise<ExamTimingDto> {
    const attempt = await this.attemptRepository.findOne({
      where: { id: attemptId },
      relations: ['examSet', 'examSet.sections'],
    });

    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }

    const now = Date.now();
    const sections = attempt.examSet.sections;

    // Build section timing map
    const sectionTimes: CachedTiming['sectionTimes'] = {};
    for (const section of sections) {
      sectionTimes[section.id] = {
        started: 0,
        spent: 0,
        limit: section.duration * 60,
      };
    }

    // Cache timing data
    const timing: CachedTiming = {
      attemptId,
      startedAt: now,
      timeLimit: attempt.timeLimit,
      lastSyncAt: now,
      sectionTimes,
      totalPausedTime: 0,
    };

    await this.cacheService.set(`exam:timer:${attemptId}`, timing, 7200); // 2 hours TTL

    return this.formatTimingResponse(attempt, timing);
  }

  /**
   * Sync time between client and server
   */
  async syncTime(
    userId: string,
    dto: TimeSyncRequestDto,
  ): Promise<TimeSyncResponseDto> {
    const attempt = await this.attemptRepository.findOne({
      where: { id: dto.attemptId, userId },
    });

    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }

    // Get cached timing
    let timing = await this.cacheService.get<CachedTiming>(`exam:timer:${dto.attemptId}`);
    
    if (!timing) {
      // Rebuild from database
      timing = await this.rebuildTimingFromDb(attempt);
    }

    const now = Date.now();
    
    // Calculate time drift
    const drift = now - dto.clientTimestamp;

    // Calculate actual time remaining
    const elapsedMs = now - timing.startedAt - (timing.totalPausedTime * 1000);
    const elapsedSeconds = Math.floor(elapsedMs / 1000);
    const totalTimeRemaining = Math.max(0, timing.timeLimit - elapsedSeconds);

    // Calculate section time remaining
    let sectionTimeRemaining = 0;
    if (dto.sectionId && timing.sectionTimes[dto.sectionId]) {
      const sectionTiming = timing.sectionTimes[dto.sectionId];
      if (sectionTiming.started > 0) {
        const sectionElapsed = Math.floor((now - sectionTiming.started) / 1000) + sectionTiming.spent;
        sectionTimeRemaining = Math.max(0, sectionTiming.limit - sectionElapsed);
      } else {
        sectionTimeRemaining = sectionTiming.limit;
      }
    }

    // Check for expiry
    const isExpired = totalTimeRemaining <= 0;
    const shouldSubmit = isExpired || (dto.sectionId && sectionTimeRemaining <= 0);

    // Generate warnings
    const warnings: string[] = [];
    for (const threshold of this.config.warningThresholds) {
      if (totalTimeRemaining <= threshold && totalTimeRemaining > threshold - this.config.syncIntervalSeconds) {
        warnings.push(`${threshold} seconds remaining`);
      }
    }

    // Anti-cheat: Check if client time differs too much
    if (this.config.antiCheatEnabled && dto.clientTimeRemaining !== undefined) {
      const clientServerDiff = Math.abs(dto.clientTimeRemaining - totalTimeRemaining);
      if (clientServerDiff > this.config.toleranceSeconds) {
        warnings.push('Time discrepancy detected');
        // Log for review
        this.eventEmitter.emit('exam.timeAnomaly', {
          attemptId: dto.attemptId,
          userId,
          serverTime: totalTimeRemaining,
          clientTime: dto.clientTimeRemaining,
          diff: clientServerDiff,
        });
      }
    }

    // Update cache
    timing.lastSyncAt = now;
    await this.cacheService.set(`exam:timer:${dto.attemptId}`, timing, 7200);

    // Update database periodically (every 30 seconds)
    if (now - timing.lastSyncAt > 30000) {
      await this.updateAttemptTiming(attempt, totalTimeRemaining);
    }

    // Trigger auto-submit if expired
    if (shouldSubmit) {
      this.eventEmitter.emit('exam.timeExpired', {
        attemptId: dto.attemptId,
        userId,
      });
    }

    return {
      serverTimestamp: now,
      totalTimeRemaining,
      sectionTimeRemaining,
      currentSectionId: attempt.currentSectionId,
      isExpired,
      shouldSubmit,
      warnings,
      drift,
    };
  }

  /**
   * Start section timing
   */
  async startSectionTiming(attemptId: string, sectionId: string): Promise<SectionTimingDto> {
    const timing = await this.cacheService.get<CachedTiming>(`exam:timer:${attemptId}`);
    
    if (!timing) {
      throw new NotFoundException('Timing data not found');
    }

    const now = Date.now();
    
    // End previous section if any
    for (const [id, section] of Object.entries(timing.sectionTimes)) {
      if (id !== sectionId && section.started > 0 && section.spent === 0) {
        section.spent = Math.floor((now - section.started) / 1000);
      }
    }

    // Start new section
    if (!timing.sectionTimes[sectionId]) {
      const section = await this.sectionRepository.findOne({ where: { id: sectionId } });
      timing.sectionTimes[sectionId] = {
        started: now,
        spent: 0,
        limit: (section?.duration || 60) * 60,
      };
    } else {
      timing.sectionTimes[sectionId].started = now;
    }

    await this.cacheService.set(`exam:timer:${attemptId}`, timing, 7200);

    const sectionTiming = timing.sectionTimes[sectionId];
    const section = await this.sectionRepository.findOne({ where: { id: sectionId } });

    return {
      sectionId,
      skill: section?.skill || 'unknown',
      timeLimit: sectionTiming.limit,
      timeSpent: sectionTiming.spent,
      timeRemaining: sectionTiming.limit - sectionTiming.spent,
      isCompleted: false,
    };
  }

  /**
   * End section timing
   */
  async endSectionTiming(attemptId: string, sectionId: string): Promise<SectionTimingDto> {
    const timing = await this.cacheService.get<CachedTiming>(`exam:timer:${attemptId}`);
    
    if (!timing || !timing.sectionTimes[sectionId]) {
      throw new NotFoundException('Section timing not found');
    }

    const now = Date.now();
    const sectionTiming = timing.sectionTimes[sectionId];
    
    if (sectionTiming.started > 0) {
      sectionTiming.spent += Math.floor((now - sectionTiming.started) / 1000);
      sectionTiming.started = 0;
    }

    await this.cacheService.set(`exam:timer:${attemptId}`, timing, 7200);

    const section = await this.sectionRepository.findOne({ where: { id: sectionId } });

    return {
      sectionId,
      skill: section?.skill || 'unknown',
      timeLimit: sectionTiming.limit,
      timeSpent: sectionTiming.spent,
      timeRemaining: Math.max(0, sectionTiming.limit - sectionTiming.spent),
      isCompleted: true,
    };
  }

  /**
   * Pause timing
   */
  async pauseTiming(attemptId: string): Promise<void> {
    const timing = await this.cacheService.get<CachedTiming>(`exam:timer:${attemptId}`);
    
    if (!timing) {
      throw new NotFoundException('Timing data not found');
    }

    timing.pausedAt = Date.now();
    await this.cacheService.set(`exam:timer:${attemptId}`, timing, 7200);
  }

  /**
   * Resume timing
   */
  async resumeTiming(attemptId: string): Promise<void> {
    const timing = await this.cacheService.get<CachedTiming>(`exam:timer:${attemptId}`);
    
    if (!timing) {
      throw new NotFoundException('Timing data not found');
    }

    if (timing.pausedAt) {
      const pauseDuration = Math.floor((Date.now() - timing.pausedAt) / 1000);
      timing.totalPausedTime += pauseDuration;
      timing.pausedAt = undefined;
    }

    await this.cacheService.set(`exam:timer:${attemptId}`, timing, 7200);
  }

  /**
   * Get full timing info
   */
  async getTiming(attemptId: string, userId: string): Promise<ExamTimingDto> {
    const attempt = await this.attemptRepository.findOne({
      where: { id: attemptId, userId },
      relations: ['examSet', 'examSet.sections'],
    });

    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }

    let timing = await this.cacheService.get<CachedTiming>(`exam:timer:${attemptId}`);
    
    if (!timing) {
      timing = await this.rebuildTimingFromDb(attempt);
    }

    return this.formatTimingResponse(attempt, timing);
  }

  /**
   * Add bonus time (for accommodations)
   */
  async addBonusTime(attemptId: string, bonusSeconds: number): Promise<void> {
    const timing = await this.cacheService.get<CachedTiming>(`exam:timer:${attemptId}`);
    
    if (!timing) {
      throw new NotFoundException('Timing data not found');
    }

    timing.timeLimit += bonusSeconds;
    await this.cacheService.set(`exam:timer:${attemptId}`, timing, 7200);

    // Update database
    await this.attemptRepository.update(attemptId, {
      timeLimit: timing.timeLimit,
      timeRemaining: timing.timeLimit - this.calculateElapsed(timing),
    });
  }

  /**
   * Cleanup expired timing cache
   */
  async cleanupTiming(attemptId: string): Promise<void> {
    await this.cacheService.delete(`exam:timer:${attemptId}`);
  }

  /**
   * Cron job: Check for expired exams
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async checkExpiredExams(): Promise<void> {
    const cutoffTime = new Date(Date.now() - 3600000); // 1 hour ago

    const expiredAttempts = await this.attemptRepository.find({
      where: {
        status: In([AttemptStatus.IN_PROGRESS, AttemptStatus.PAUSED]),
        startedAt: LessThan(cutoffTime),
      },
      select: ['id', 'userId', 'timeLimit', 'startedAt', 'totalPausedTime'],
    });

    for (const attempt of expiredAttempts) {
      const elapsed = Math.floor((Date.now() - attempt.startedAt.getTime()) / 1000) - attempt.totalPausedTime;
      
      if (elapsed >= attempt.timeLimit) {
        this.eventEmitter.emit('exam.timeExpired', {
          attemptId: attempt.id,
          userId: attempt.userId,
        });
      }
    }
  }

  // Helper methods
  private async rebuildTimingFromDb(attempt: ExamAttempt): Promise<CachedTiming> {
    const sections = await this.sectionRepository.find({
      where: { examSetId: attempt.examSetId },
    });

    const sectionTimes: CachedTiming['sectionTimes'] = {};
    for (const section of sections) {
      const saved = attempt.sectionTimes?.[section.id];
      sectionTimes[section.id] = {
        started: saved?.startedAt ? new Date(saved.startedAt).getTime() : 0,
        spent: saved?.timeSpent || 0,
        limit: saved?.timeLimit || section.duration * 60,
      };
    }

    const timing: CachedTiming = {
      attemptId: attempt.id,
      startedAt: attempt.startedAt.getTime(),
      timeLimit: attempt.timeLimit,
      lastSyncAt: Date.now(),
      sectionTimes,
      pausedAt: attempt.pausedAt?.getTime(),
      totalPausedTime: attempt.totalPausedTime || 0,
    };

    await this.cacheService.set(`exam:timer:${attempt.id}`, timing, 7200);
    return timing;
  }

  private calculateElapsed(timing: CachedTiming): number {
    const now = Date.now();
    return Math.floor((now - timing.startedAt - timing.totalPausedTime * 1000) / 1000);
  }

  private async updateAttemptTiming(attempt: ExamAttempt, timeRemaining: number): Promise<void> {
    await this.attemptRepository.update(attempt.id, {
      timeRemaining,
      lastAutoSave: new Date(),
    });
  }

  private formatTimingResponse(attempt: ExamAttempt, timing: CachedTiming): ExamTimingDto {
    const elapsed = this.calculateElapsed(timing);
    
    const sections: SectionTimingDto[] = [];
    for (const [sectionId, sectionTiming] of Object.entries(timing.sectionTimes)) {
      sections.push({
        sectionId,
        skill: 'unknown', // Would need section data
        timeLimit: sectionTiming.limit,
        timeSpent: sectionTiming.spent + (sectionTiming.started > 0 
          ? Math.floor((Date.now() - sectionTiming.started) / 1000) 
          : 0),
        timeRemaining: Math.max(0, sectionTiming.limit - sectionTiming.spent),
        isCompleted: sectionTiming.spent >= sectionTiming.limit,
      });
    }

    return {
      attemptId: attempt.id,
      status: attempt.status,
      startedAt: attempt.startedAt,
      totalTimeLimit: timing.timeLimit,
      totalTimeRemaining: Math.max(0, timing.timeLimit - elapsed),
      totalTimeSpent: elapsed,
      currentSectionId: attempt.currentSectionId,
      sections,
      isPaused: !!timing.pausedAt,
      pausedAt: timing.pausedAt ? new Date(timing.pausedAt) : undefined,
    };
  }
}
```

### Step 4: Timer Controller

```typescript
// src/modules/exams/controllers/exam-timer.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { ExamTimerService } from '../services/exam-timer.service';
import { TimeSyncRequestDto, TimeSyncResponseDto, ExamTimingDto } from '../dto/timer.dto';

@ApiTags('Exam Timer')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('exams/timer')
export class ExamTimerController {
  constructor(private readonly timerService: ExamTimerService) {}

  @Post('sync')
  @ApiOperation({ summary: 'Sync exam timer with server' })
  async syncTime(
    @Request() req,
    @Body() dto: TimeSyncRequestDto,
  ): Promise<TimeSyncResponseDto> {
    return this.timerService.syncTime(req.user.id, dto);
  }

  @Get(':attemptId')
  @ApiOperation({ summary: 'Get exam timing info' })
  async getTiming(
    @Request() req,
    @Param('attemptId') attemptId: string,
  ): Promise<ExamTimingDto> {
    return this.timerService.getTiming(attemptId, req.user.id);
  }

  @Post(':attemptId/sections/:sectionId/start')
  @ApiOperation({ summary: 'Start section timing' })
  async startSection(
    @Param('attemptId') attemptId: string,
    @Param('sectionId') sectionId: string,
  ) {
    return this.timerService.startSectionTiming(attemptId, sectionId);
  }

  @Post(':attemptId/sections/:sectionId/end')
  @ApiOperation({ summary: 'End section timing' })
  async endSection(
    @Param('attemptId') attemptId: string,
    @Param('sectionId') sectionId: string,
  ) {
    return this.timerService.endSectionTiming(attemptId, sectionId);
  }

  @Post(':attemptId/pause')
  @ApiOperation({ summary: 'Pause exam timing' })
  async pause(@Param('attemptId') attemptId: string) {
    return this.timerService.pauseTiming(attemptId);
  }

  @Post(':attemptId/resume')
  @ApiOperation({ summary: 'Resume exam timing' })
  async resume(@Param('attemptId') attemptId: string) {
    return this.timerService.resumeTiming(attemptId);
  }
}
```

### Step 5: Time Expired Event Listener

```typescript
// src/modules/exams/listeners/timer.listener.ts
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ExamAttemptService } from '../services/exam-attempt.service';
import { ExamTimerService } from '../services/exam-timer.service';

@Injectable()
export class TimerEventListener {
  constructor(
    private readonly attemptService: ExamAttemptService,
    private readonly timerService: ExamTimerService,
  ) {}

  @OnEvent('exam.timeExpired')
  async handleTimeExpired(payload: { attemptId: string; userId: string }) {
    try {
      // Auto-submit the exam
      await this.attemptService.handleTimeout(payload.attemptId, payload.userId);
      
      // Cleanup timer cache
      await this.timerService.cleanupTiming(payload.attemptId);
    } catch (error) {
      console.error('Failed to handle time expiry:', error);
    }
  }

  @OnEvent('exam.timeAnomaly')
  async handleTimeAnomaly(payload: {
    attemptId: string;
    userId: string;
    serverTime: number;
    clientTime: number;
    diff: number;
  }) {
    // Log anomaly for review
    console.warn('Time anomaly detected:', payload);
    
    // Could flag the attempt for review or take other actions
  }

  @OnEvent('exam.completed')
  async handleExamCompleted(payload: { attemptId: string }) {
    // Cleanup timer cache
    await this.timerService.cleanupTiming(payload.attemptId);
  }
}
```

---

## ✅ Acceptance Criteria

- [ ] Timer tracks server-side time accurately
- [ ] Time sync detects client-server drift
- [ ] Section timing starts/stops correctly
- [ ] Pause/resume adjusts total time
- [ ] Expired exams trigger auto-submit
- [ ] Anti-cheat logs anomalies
- [ ] Cron job catches stale attempts

---

## ⏭️ Next Task

→ `BE-022_EXAM_SUBMISSION_SERVICE.md` - Exam Submission Service

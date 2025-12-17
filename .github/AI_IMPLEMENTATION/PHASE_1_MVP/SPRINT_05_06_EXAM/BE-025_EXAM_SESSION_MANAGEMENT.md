# BE-025: Exam Session Management

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-025 |
| **Phase** | 1 - MVP |
| **Sprint** | 5-6 |
| **Priority** | P2 (Medium) |
| **Estimated Hours** | 5h |
| **Dependencies** | BE-020, BE-021 |

---

## 🎯 Objective

Implement Exam Session Management với:
- Active session tracking
- Session recovery (browser crash, disconnect)
- Multi-device prevention
- Session locking mechanism

---

## 💻 Implementation

### Step 1: Session DTOs

```typescript
// src/modules/exams/dto/exam-session.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class StartSessionDto {
  @ApiProperty()
  @IsUUID()
  examSetId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deviceFingerprint?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  browserInfo?: string;
}

export class SessionInfoDto {
  @ApiProperty()
  sessionId: string;

  @ApiProperty()
  attemptId: string;

  @ApiProperty()
  examSetId: string;

  @ApiProperty()
  status: 'active' | 'paused' | 'expired' | 'completed';

  @ApiProperty()
  startedAt: Date;

  @ApiProperty()
  lastActivityAt: Date;

  @ApiProperty()
  deviceInfo: {
    fingerprint: string;
    browser: string;
    ip: string;
  };

  @ApiProperty()
  timeRemaining: number;

  @ApiProperty()
  canResume: boolean;

  @ApiProperty()
  isLocked: boolean;
}

export class SessionRecoveryDto {
  @ApiProperty()
  attemptId: string;

  @ApiProperty()
  recoveryToken: string;

  @ApiProperty()
  answersRestored: number;

  @ApiProperty()
  lastSaveTime: Date;

  @ApiProperty()
  timeRemaining: number;
}

export class ActiveSessionsDto {
  @ApiProperty()
  hasActiveSession: boolean;

  @ApiPropertyOptional()
  activeSession?: SessionInfoDto;

  @ApiProperty({ type: [SessionInfoDto] })
  pausedSessions: SessionInfoDto[];

  @ApiProperty()
  canStartNew: boolean;

  @ApiPropertyOptional()
  blockReason?: string;
}

export class SessionHeartbeatDto {
  @ApiProperty()
  @IsUUID()
  attemptId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deviceFingerprint?: string;
}

export class HeartbeatResponseDto {
  @ApiProperty()
  sessionValid: boolean;

  @ApiProperty()
  timeRemaining: number;

  @ApiProperty()
  serverTime: number;

  @ApiPropertyOptional()
  warning?: string;

  @ApiProperty()
  shouldForceRefresh: boolean;
}
```

### Step 2: Session Entity

```typescript
// src/modules/exams/entities/exam-session.entity.ts
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
import { ExamAttempt } from './exam-attempt.entity';

@Entity('exam_sessions')
@Index(['userId', 'status'])
@Index(['attemptId'], { unique: true })
export class ExamSession {
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

  @Column({ default: 'active' })
  status: 'active' | 'paused' | 'expired' | 'completed' | 'terminated';

  // Device tracking
  @Column({ name: 'device_fingerprint', nullable: true })
  deviceFingerprint: string;

  @Column({ name: 'browser_info', type: 'text', nullable: true })
  browserInfo: string;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress: string;

  // Session locking
  @Column({ name: 'is_locked', default: false })
  isLocked: boolean;

  @Column({ name: 'lock_reason', nullable: true })
  lockReason: string;

  @Column({ name: 'locked_at', type: 'timestamp', nullable: true })
  lockedAt: Date;

  // Activity tracking
  @Column({ name: 'last_heartbeat', type: 'timestamp', nullable: true })
  lastHeartbeat: Date;

  @Column({ name: 'heartbeat_count', type: 'int', default: 0 })
  heartbeatCount: number;

  @Column({ name: 'missed_heartbeats', type: 'int', default: 0 })
  missedHeartbeats: number;

  // Recovery
  @Column({ name: 'recovery_token', nullable: true })
  recoveryToken: string;

  @Column({ name: 'recovery_attempts', type: 'int', default: 0 })
  recoveryAttempts: number;

  @Column({ name: 'last_recovery_at', type: 'timestamp', nullable: true })
  lastRecoveryAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'expired_at', type: 'timestamp', nullable: true })
  expiredAt: Date;
}
```

### Step 3: Session Service

```typescript
// src/modules/exams/services/exam-session.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, In, Not } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { v4 as uuidv4 } from 'uuid';
import { ExamSession } from '../entities/exam-session.entity';
import { ExamAttempt, AttemptStatus } from '../entities/exam-attempt.entity';
import { ExamAnswer } from '../entities/exam-answer.entity';
import { CacheService } from '@/core/cache/cache.service';
import { ExamAttemptService } from './exam-attempt.service';
import { ExamTimerService } from './exam-timer.service';
import {
  StartSessionDto,
  SessionInfoDto,
  SessionRecoveryDto,
  ActiveSessionsDto,
  SessionHeartbeatDto,
  HeartbeatResponseDto,
} from '../dto/exam-session.dto';

const HEARTBEAT_INTERVAL = 10; // seconds
const MAX_MISSED_HEARTBEATS = 3;
const SESSION_LOCK_DURATION = 300; // 5 minutes
const MAX_RECOVERY_ATTEMPTS = 3;

@Injectable()
export class ExamSessionService {
  private readonly logger = new Logger(ExamSessionService.name);

  constructor(
    @InjectRepository(ExamSession)
    private readonly sessionRepository: Repository<ExamSession>,
    @InjectRepository(ExamAttempt)
    private readonly attemptRepository: Repository<ExamAttempt>,
    @InjectRepository(ExamAnswer)
    private readonly answerRepository: Repository<ExamAnswer>,
    private readonly attemptService: ExamAttemptService,
    private readonly timerService: ExamTimerService,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * Start a new exam session
   */
  async startSession(
    userId: string,
    dto: StartSessionDto,
    requestInfo: { userAgent: string; ipAddress: string },
  ): Promise<SessionInfoDto> {
    // Check for existing active session
    const existingSession = await this.getActiveSession(userId);
    if (existingSession) {
      throw new ConflictException('You already have an active exam session. Please complete or abandon it first.');
    }

    // Start the exam attempt
    const attempt = await this.attemptService.startExam(userId, dto, requestInfo);

    // Create session
    const session = this.sessionRepository.create({
      userId,
      attemptId: attempt.id,
      status: 'active',
      deviceFingerprint: dto.deviceFingerprint,
      browserInfo: dto.browserInfo || requestInfo.userAgent,
      ipAddress: requestInfo.ipAddress,
      lastHeartbeat: new Date(),
      recoveryToken: this.generateRecoveryToken(),
    });

    await this.sessionRepository.save(session);

    // Cache active session for quick lookup
    await this.cacheService.set(`exam:session:${userId}`, session.id, 7200);

    return this.formatSessionInfo(session, attempt.timeRemaining);
  }

  /**
   * Get active sessions for user
   */
  async getActiveSessions(userId: string): Promise<ActiveSessionsDto> {
    const sessions = await this.sessionRepository.find({
      where: {
        userId,
        status: In(['active', 'paused']),
      },
      relations: ['attempt'],
      order: { createdAt: 'DESC' },
    });

    const activeSessions = sessions.filter(s => s.status === 'active');
    const pausedSessions = sessions.filter(s => s.status === 'paused');

    let activeSession: SessionInfoDto | undefined;
    if (activeSessions.length > 0) {
      const session = activeSessions[0];
      activeSession = await this.formatSessionInfoWithTiming(session);
    }

    return {
      hasActiveSession: activeSessions.length > 0,
      activeSession,
      pausedSessions: await Promise.all(
        pausedSessions.map(s => this.formatSessionInfoWithTiming(s))
      ),
      canStartNew: activeSessions.length === 0 && pausedSessions.length < 3,
      blockReason: activeSessions.length > 0
        ? 'You have an active exam session'
        : pausedSessions.length >= 3
        ? 'You have too many paused sessions'
        : undefined,
    };
  }

  /**
   * Handle heartbeat
   */
  async handleHeartbeat(
    userId: string,
    dto: SessionHeartbeatDto,
  ): Promise<HeartbeatResponseDto> {
    const session = await this.sessionRepository.findOne({
      where: { attemptId: dto.attemptId, userId },
      relations: ['attempt'],
    });

    if (!session) {
      return {
        sessionValid: false,
        timeRemaining: 0,
        serverTime: Date.now(),
        warning: 'Session not found',
        shouldForceRefresh: true,
      };
    }

    // Check device fingerprint
    let warning: string | undefined;
    if (dto.deviceFingerprint && session.deviceFingerprint !== dto.deviceFingerprint) {
      warning = 'Device mismatch detected';
      this.logger.warn(`Device mismatch for session ${session.id}`);
    }

    // Check if session is locked
    if (session.isLocked) {
      return {
        sessionValid: false,
        timeRemaining: 0,
        serverTime: Date.now(),
        warning: `Session locked: ${session.lockReason}`,
        shouldForceRefresh: true,
      };
    }

    // Update heartbeat
    session.lastHeartbeat = new Date();
    session.heartbeatCount += 1;
    session.missedHeartbeats = 0;
    await this.sessionRepository.save(session);

    // Get timing
    const timing = await this.timerService.getTiming(dto.attemptId, userId);

    return {
      sessionValid: true,
      timeRemaining: timing.totalTimeRemaining,
      serverTime: Date.now(),
      warning,
      shouldForceRefresh: false,
    };
  }

  /**
   * Pause session
   */
  async pauseSession(userId: string, attemptId: string): Promise<SessionInfoDto> {
    const session = await this.sessionRepository.findOne({
      where: { attemptId, userId, status: 'active' },
    });

    if (!session) {
      throw new NotFoundException('Active session not found');
    }

    session.status = 'paused';
    await this.sessionRepository.save(session);

    await this.attemptService.pauseExam(attemptId, userId);
    await this.timerService.pauseTiming(attemptId);

    // Remove from active cache
    await this.cacheService.delete(`exam:session:${userId}`);

    const timing = await this.timerService.getTiming(attemptId, userId);
    return this.formatSessionInfo(session, timing.totalTimeRemaining);
  }

  /**
   * Resume session
   */
  async resumeSession(userId: string, attemptId: string): Promise<SessionInfoDto> {
    // Check for other active sessions
    const activeSession = await this.getActiveSession(userId);
    if (activeSession && activeSession.attemptId !== attemptId) {
      throw new ConflictException('You have another active session. Please complete or pause it first.');
    }

    const session = await this.sessionRepository.findOne({
      where: { attemptId, userId, status: 'paused' },
    });

    if (!session) {
      throw new NotFoundException('Paused session not found');
    }

    session.status = 'active';
    session.lastHeartbeat = new Date();
    await this.sessionRepository.save(session);

    await this.attemptService.resumeExam(attemptId, userId);
    await this.timerService.resumeTiming(attemptId);

    // Cache as active
    await this.cacheService.set(`exam:session:${userId}`, session.id, 7200);

    const timing = await this.timerService.getTiming(attemptId, userId);
    return this.formatSessionInfo(session, timing.totalTimeRemaining);
  }

  /**
   * Recover session after disconnect
   */
  async recoverSession(
    userId: string,
    attemptId: string,
    recoveryToken: string,
  ): Promise<SessionRecoveryDto> {
    const session = await this.sessionRepository.findOne({
      where: { attemptId, userId },
      relations: ['attempt'],
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // Validate recovery token
    if (session.recoveryToken !== recoveryToken) {
      session.recoveryAttempts += 1;
      await this.sessionRepository.save(session);

      if (session.recoveryAttempts >= MAX_RECOVERY_ATTEMPTS) {
        await this.lockSession(session, 'Too many recovery attempts');
        throw new BadRequestException('Too many failed recovery attempts. Session locked.');
      }

      throw new BadRequestException('Invalid recovery token');
    }

    // Check if session can be recovered
    if (session.status === 'completed' || session.status === 'expired') {
      throw new BadRequestException(`Session is ${session.status} and cannot be recovered`);
    }

    if (session.isLocked) {
      throw new BadRequestException(`Session is locked: ${session.lockReason}`);
    }

    // Reactivate session
    session.status = 'active';
    session.lastHeartbeat = new Date();
    session.lastRecoveryAt = new Date();
    session.recoveryToken = this.generateRecoveryToken(); // Regenerate for security
    await this.sessionRepository.save(session);

    // Get restored answers count
    const answersCount = await this.answerRepository.count({
      where: { attemptId },
    });

    // Get timing
    const timing = await this.timerService.getTiming(attemptId, userId);

    return {
      attemptId,
      recoveryToken: session.recoveryToken,
      answersRestored: answersCount,
      lastSaveTime: session.attempt?.lastAutoSave || session.updatedAt,
      timeRemaining: timing.totalTimeRemaining,
    };
  }

  /**
   * Terminate session (abandon)
   */
  async terminateSession(userId: string, attemptId: string): Promise<void> {
    const session = await this.sessionRepository.findOne({
      where: { attemptId, userId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    session.status = 'terminated';
    session.expiredAt = new Date();
    await this.sessionRepository.save(session);

    // Update attempt status
    await this.attemptRepository.update(attemptId, {
      status: AttemptStatus.ABANDONED,
      endedAt: new Date(),
    });

    // Cleanup
    await this.cacheService.delete(`exam:session:${userId}`);
    await this.timerService.cleanupTiming(attemptId);
  }

  /**
   * Lock session
   */
  async lockSession(session: ExamSession, reason: string): Promise<void> {
    session.isLocked = true;
    session.lockReason = reason;
    session.lockedAt = new Date();
    await this.sessionRepository.save(session);
  }

  /**
   * Check for multi-device access
   */
  async checkMultiDeviceAccess(
    userId: string,
    attemptId: string,
    deviceFingerprint: string,
  ): Promise<boolean> {
    const session = await this.sessionRepository.findOne({
      where: { attemptId, userId },
    });

    if (!session || !session.deviceFingerprint) {
      return false;
    }

    return session.deviceFingerprint !== deviceFingerprint;
  }

  /**
   * Cron: Check for stale sessions
   */
  @Cron(CronExpression.EVERY_30_SECONDS)
  async checkStaleSessions(): Promise<void> {
    const cutoffTime = new Date(Date.now() - HEARTBEAT_INTERVAL * MAX_MISSED_HEARTBEATS * 1000);

    // Find sessions with missed heartbeats
    const staleSessions = await this.sessionRepository.find({
      where: {
        status: 'active',
        lastHeartbeat: LessThan(cutoffTime),
      },
    });

    for (const session of staleSessions) {
      session.missedHeartbeats += 1;

      if (session.missedHeartbeats >= MAX_MISSED_HEARTBEATS) {
        // Auto-pause the session
        session.status = 'paused';
        this.logger.warn(`Session ${session.id} auto-paused due to missed heartbeats`);
        
        await this.timerService.pauseTiming(session.attemptId);
      }

      await this.sessionRepository.save(session);
    }
  }

  /**
   * Cron: Expire old paused sessions
   */
  @Cron(CronExpression.EVERY_HOUR)
  async expireOldSessions(): Promise<void> {
    const expirationTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours

    const expiredSessions = await this.sessionRepository.find({
      where: {
        status: 'paused',
        updatedAt: LessThan(expirationTime),
      },
    });

    for (const session of expiredSessions) {
      session.status = 'expired';
      session.expiredAt = new Date();
      await this.sessionRepository.save(session);

      // Also expire the attempt
      await this.attemptRepository.update(session.attemptId, {
        status: AttemptStatus.ABANDONED,
        endedAt: new Date(),
      });

      this.logger.info(`Session ${session.id} expired`);
    }
  }

  // Helper methods
  private async getActiveSession(userId: string): Promise<ExamSession | null> {
    return this.sessionRepository.findOne({
      where: { userId, status: 'active' },
    });
  }

  private generateRecoveryToken(): string {
    return uuidv4().replace(/-/g, '').substring(0, 16);
  }

  private formatSessionInfo(session: ExamSession, timeRemaining: number): SessionInfoDto {
    return {
      sessionId: session.id,
      attemptId: session.attemptId,
      examSetId: session.attempt?.examSetId || '',
      status: session.status as any,
      startedAt: session.createdAt,
      lastActivityAt: session.lastHeartbeat || session.updatedAt,
      deviceInfo: {
        fingerprint: session.deviceFingerprint || '',
        browser: session.browserInfo || '',
        ip: session.ipAddress || '',
      },
      timeRemaining,
      canResume: session.status === 'paused' && !session.isLocked,
      isLocked: session.isLocked,
    };
  }

  private async formatSessionInfoWithTiming(session: ExamSession): Promise<SessionInfoDto> {
    let timeRemaining = 0;
    try {
      const timing = await this.timerService.getTiming(session.attemptId, session.userId);
      timeRemaining = timing.totalTimeRemaining;
    } catch (e) {
      // Timing might not be available for expired sessions
    }

    return this.formatSessionInfo(session, timeRemaining);
  }
}
```

### Step 4: Session Controller

```typescript
// src/modules/exams/controllers/exam-session.controller.ts
import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Headers,
  Ip,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { ExamSessionService } from '../services/exam-session.service';
import {
  StartSessionDto,
  SessionInfoDto,
  SessionRecoveryDto,
  ActiveSessionsDto,
  SessionHeartbeatDto,
  HeartbeatResponseDto,
} from '../dto/exam-session.dto';

@ApiTags('Exam Sessions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('exams/sessions')
export class ExamSessionController {
  constructor(private readonly sessionService: ExamSessionService) {}

  @Post('start')
  @ApiOperation({ summary: 'Start a new exam session' })
  async startSession(
    @Request() req,
    @Body() dto: StartSessionDto,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
  ): Promise<SessionInfoDto> {
    return this.sessionService.startSession(
      req.user.id,
      dto,
      { userAgent, ipAddress: ip },
    );
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active sessions' })
  async getActiveSessions(@Request() req): Promise<ActiveSessionsDto> {
    return this.sessionService.getActiveSessions(req.user.id);
  }

  @Post('heartbeat')
  @ApiOperation({ summary: 'Send session heartbeat' })
  async heartbeat(
    @Request() req,
    @Body() dto: SessionHeartbeatDto,
  ): Promise<HeartbeatResponseDto> {
    return this.sessionService.handleHeartbeat(req.user.id, dto);
  }

  @Post(':attemptId/pause')
  @ApiOperation({ summary: 'Pause exam session' })
  async pauseSession(
    @Request() req,
    @Param('attemptId') attemptId: string,
  ): Promise<SessionInfoDto> {
    return this.sessionService.pauseSession(req.user.id, attemptId);
  }

  @Post(':attemptId/resume')
  @ApiOperation({ summary: 'Resume paused session' })
  async resumeSession(
    @Request() req,
    @Param('attemptId') attemptId: string,
  ): Promise<SessionInfoDto> {
    return this.sessionService.resumeSession(req.user.id, attemptId);
  }

  @Post(':attemptId/recover')
  @ApiOperation({ summary: 'Recover session after disconnect' })
  async recoverSession(
    @Request() req,
    @Param('attemptId') attemptId: string,
    @Body('recoveryToken') recoveryToken: string,
  ): Promise<SessionRecoveryDto> {
    return this.sessionService.recoverSession(req.user.id, attemptId, recoveryToken);
  }

  @Delete(':attemptId')
  @ApiOperation({ summary: 'Terminate/abandon session' })
  async terminateSession(
    @Request() req,
    @Param('attemptId') attemptId: string,
  ): Promise<void> {
    return this.sessionService.terminateSession(req.user.id, attemptId);
  }
}
```

---

## ✅ Acceptance Criteria

- [ ] Only one active session per user
- [ ] Heartbeat system detects disconnects
- [ ] Session recovery works with token
- [ ] Multi-device access detected
- [ ] Stale sessions auto-pause
- [ ] Expired sessions cleaned up
- [ ] Session locking prevents abuse

---

## ⏭️ Next Task

→ `BE-026_EXAM_RESULT_GENERATION.md` - Exam Result Generation

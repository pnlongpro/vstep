# BE-036: AI Writing Submit Endpoint

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-036 |
| **Phase** | 2 - AI Grading |
| **Sprint** | 9-10 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 4h |
| **Dependencies** | AI-001, AI-002 |

---

## 🎯 Objective

Create NestJS endpoint để submit Writing cho AI grading:
- Validate submission data
- Create AI job record
- Publish to RabbitMQ queue
- Return job ID for tracking

---

## 📝 Implementation

### 1. src/modules/ai/ai.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AiJobEntity } from './entities/ai-job.entity';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AiJobEntity]),
    QueueModule,
  ],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
```

### 2. src/modules/ai/entities/ai-job.entity.ts

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum AiJobType {
  WRITING = 'writing',
  SPEAKING = 'speaking',
}

export enum AiJobStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('ai_jobs')
export class AiJobEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: AiJobType })
  @Index()
  type: AiJobType;

  @Column({ type: 'enum', enum: AiJobStatus, default: AiJobStatus.PENDING })
  @Index()
  status: AiJobStatus;

  @Column()
  @Index()
  userId: number;

  @Column()
  attemptId: number;

  @Column()
  questionId: number;

  @Column({ type: 'json' })
  payload: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  result: Record<string, any> | null;

  @Column({ type: 'text', nullable: true })
  error: string | null;

  @Column({ type: 'float', nullable: true })
  processingTime: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  completedAt: Date | null;
}
```

### 3. src/modules/ai/dto/submit-writing.dto.ts

```typescript
import { IsString, IsNumber, IsEnum, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TaskType {
  TASK1 = 'task1',
  TASK2 = 'task2',
}

export enum TargetLevel {
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
}

export class SubmitWritingDto {
  @ApiProperty({ description: 'Exam attempt ID' })
  @IsNumber()
  attemptId: number;

  @ApiProperty({ description: 'Question ID' })
  @IsNumber()
  questionId: number;

  @ApiProperty({ enum: TaskType, description: 'Writing task type' })
  @IsEnum(TaskType)
  taskType: TaskType;

  @ApiProperty({ description: 'Writing prompt/question' })
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @ApiProperty({ description: 'Student answer text' })
  @IsString()
  @MinLength(50, { message: 'Answer must be at least 50 characters' })
  @MaxLength(5000, { message: 'Answer cannot exceed 5000 characters' })
  studentAnswer: string;

  @ApiProperty({ enum: TargetLevel, description: 'Target VSTEP level' })
  @IsEnum(TargetLevel)
  targetLevel: TargetLevel;
}


export class SubmitWritingResponseDto {
  @ApiProperty({ description: 'AI job ID for tracking' })
  jobId: string;

  @ApiProperty({ description: 'Job status' })
  status: string;

  @ApiProperty({ description: 'Estimated processing time in seconds' })
  estimatedTime: number;
}
```

### 4. src/modules/ai/ai.controller.ts

```typescript
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { AiService } from './ai.service';
import { SubmitWritingDto, SubmitWritingResponseDto } from './dto/submit-writing.dto';

@ApiTags('AI Grading')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('writing/submit')
  @ApiOperation({ summary: 'Submit writing for AI grading' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Writing submitted for grading',
    type: SubmitWritingResponseDto,
  })
  async submitWriting(
    @Body() dto: SubmitWritingDto,
    @CurrentUser() user: { id: number },
  ): Promise<SubmitWritingResponseDto> {
    return this.aiService.submitWriting(user.id, dto);
  }

  @Get('job/:jobId/status')
  @ApiOperation({ summary: 'Get AI job status' })
  async getJobStatus(@Param('jobId') jobId: string) {
    return this.aiService.getJobStatus(jobId);
  }

  @Get('job/:jobId/result')
  @ApiOperation({ summary: 'Get AI grading result' })
  async getJobResult(@Param('jobId') jobId: string) {
    return this.aiService.getJobResult(jobId);
  }
}
```

### 5. src/modules/ai/ai.service.ts

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AiJobEntity, AiJobType, AiJobStatus } from './entities/ai-job.entity';
import { SubmitWritingDto, SubmitWritingResponseDto } from './dto/submit-writing.dto';
import { QueueService } from './queue/queue.service';

@Injectable()
export class AiService {
  constructor(
    @InjectRepository(AiJobEntity)
    private readonly aiJobRepository: Repository<AiJobEntity>,
    private readonly queueService: QueueService,
    private readonly configService: ConfigService,
  ) {}

  async submitWriting(
    userId: number,
    dto: SubmitWritingDto,
  ): Promise<SubmitWritingResponseDto> {
    // 1. Create AI job record
    const job = this.aiJobRepository.create({
      type: AiJobType.WRITING,
      status: AiJobStatus.PENDING,
      userId,
      attemptId: dto.attemptId,
      questionId: dto.questionId,
      payload: {
        taskType: dto.taskType,
        prompt: dto.prompt,
        studentAnswer: dto.studentAnswer,
        targetLevel: dto.targetLevel,
      },
    });

    await this.aiJobRepository.save(job);

    // 2. Build callback URL
    const backendUrl = this.configService.get('BACKEND_URL', 'http://localhost:3000');
    const callbackUrl = `${backendUrl}/api/ai/callback/writing`;

    // 3. Publish to RabbitMQ
    await this.queueService.publishWritingJob({
      jobId: job.id,
      userId,
      attemptId: dto.attemptId,
      questionId: dto.questionId,
      taskType: dto.taskType,
      prompt: dto.prompt,
      studentAnswer: dto.studentAnswer,
      targetLevel: dto.targetLevel,
      callbackUrl,
    });

    // 4. Update status to processing
    job.status = AiJobStatus.PROCESSING;
    await this.aiJobRepository.save(job);

    return {
      jobId: job.id,
      status: job.status,
      estimatedTime: 5, // seconds
    };
  }

  async getJobStatus(jobId: string) {
    const job = await this.aiJobRepository.findOne({
      where: { id: jobId },
      select: ['id', 'status', 'createdAt', 'completedAt', 'processingTime'],
    });

    if (!job) {
      throw new NotFoundException(`Job ${jobId} not found`);
    }

    return {
      jobId: job.id,
      status: job.status,
      createdAt: job.createdAt,
      completedAt: job.completedAt,
      processingTime: job.processingTime,
    };
  }

  async getJobResult(jobId: string) {
    const job = await this.aiJobRepository.findOne({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException(`Job ${jobId} not found`);
    }

    if (job.status === AiJobStatus.PENDING || job.status === AiJobStatus.PROCESSING) {
      return {
        jobId: job.id,
        status: job.status,
        message: 'Job is still processing',
      };
    }

    if (job.status === AiJobStatus.FAILED) {
      return {
        jobId: job.id,
        status: job.status,
        error: job.error,
      };
    }

    return {
      jobId: job.id,
      status: job.status,
      result: job.result,
      processingTime: job.processingTime,
    };
  }

  async handleWritingCallback(jobId: string, result: any) {
    const job = await this.aiJobRepository.findOne({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException(`Job ${jobId} not found`);
    }

    if (result.status === 'completed') {
      job.status = AiJobStatus.COMPLETED;
      job.result = result.result;
      job.processingTime = result.result?.processingTime;
      job.completedAt = new Date();
    } else {
      job.status = AiJobStatus.FAILED;
      job.error = result.error;
      job.completedAt = new Date();
    }

    await this.aiJobRepository.save(job);
  }
}
```

### 6. src/modules/ai/ai-callback.controller.ts

```typescript
import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AiService } from './ai.service';

interface WritingCallbackDto {
  jobId: string;
  status: 'completed' | 'failed';
  result?: any;
  error?: string;
}

@ApiTags('AI Callbacks')
@Controller('ai/callback')
export class AiCallbackController {
  constructor(
    private readonly aiService: AiService,
    private readonly configService: ConfigService,
  ) {}

  @Post('writing')
  @HttpCode(HttpStatus.OK)
  @ApiExcludeEndpoint() // Hide from Swagger
  async writingCallback(
    @Body() dto: WritingCallbackDto,
    @Headers('x-callback-secret') secret: string,
  ) {
    // Validate callback secret
    const expectedSecret = this.configService.get('CALLBACK_SECRET');
    if (secret !== expectedSecret) {
      throw new UnauthorizedException('Invalid callback secret');
    }

    await this.aiService.handleWritingCallback(dto.jobId, dto);

    return { received: true };
  }
}
```

### 7. Migration

```typescript
// src/migrations/XXXXXX-create-ai-jobs.ts
import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateAiJobs1703000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'ai_jobs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['writing', 'speaking'],
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['pending', 'processing', 'completed', 'failed'],
            default: "'pending'",
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'attemptId',
            type: 'int',
          },
          {
            name: 'questionId',
            type: 'int',
          },
          {
            name: 'payload',
            type: 'json',
          },
          {
            name: 'result',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'error',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'processingTime',
            type: 'float',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'completedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'ai_jobs',
      new TableIndex({ columnNames: ['type'] }),
    );
    await queryRunner.createIndex(
      'ai_jobs',
      new TableIndex({ columnNames: ['status'] }),
    );
    await queryRunner.createIndex(
      'ai_jobs',
      new TableIndex({ columnNames: ['userId'] }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('ai_jobs');
  }
}
```

---

## ✅ Acceptance Criteria

- [ ] POST /api/ai/writing/submit accepts DTO
- [ ] AI job created in database
- [ ] Message published to RabbitMQ
- [ ] Job ID returned for tracking
- [ ] GET /api/ai/job/:id/status works
- [ ] GET /api/ai/job/:id/result works
- [ ] Callback endpoint validates secret
- [ ] Callback updates job status

---

## 🧪 Test

```typescript
// test/ai/submit-writing.e2e-spec.ts
describe('AI Writing Submit', () => {
  it('should submit writing for grading', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/ai/writing/submit')
      .set('Authorization', `Bearer ${token}`)
      .send({
        attemptId: 1,
        questionId: 1,
        taskType: 'task2',
        prompt: 'Write about education',
        studentAnswer: 'Education is very important...',
        targetLevel: 'B1',
      })
      .expect(202);

    expect(response.body.jobId).toBeDefined();
    expect(response.body.status).toBe('processing');
  });
});
```

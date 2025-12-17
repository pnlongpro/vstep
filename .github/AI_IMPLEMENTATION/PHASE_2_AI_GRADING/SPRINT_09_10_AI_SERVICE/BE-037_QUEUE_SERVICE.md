# BE-037: RabbitMQ Queue Service (NestJS)

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-037 |
| **Phase** | 2 - AI Grading |
| **Sprint** | 9-10 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 4h |
| **Dependencies** | BE-036 |

---

## 🎯 Objective

Implement RabbitMQ integration cho NestJS:
- Connection management
- Writing job producer
- Speaking job producer
- Result consumer

---

## 📝 Implementation

### 1. Install Dependencies

```bash
npm install @nestjs/microservices amqplib amqp-connection-manager
npm install -D @types/amqplib
```

### 2. src/modules/ai/queue/queue.module.ts

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { QueueService } from './queue.service';

@Module({
  imports: [ConfigModule],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
```

### 3. src/modules/ai/queue/queue.service.ts

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqp-connection-manager';
import { ChannelWrapper } from 'amqp-connection-manager';
import { Channel, ConsumeMessage } from 'amqplib';

export interface WritingJobPayload {
  jobId: string;
  userId: number;
  attemptId: number;
  questionId: number;
  taskType: string;
  prompt: string;
  studentAnswer: string;
  targetLevel: string;
  callbackUrl: string;
}

export interface SpeakingJobPayload {
  jobId: string;
  userId: number;
  attemptId: number;
  questionId: number;
  partNumber: number;
  audioUrl: string;
  targetLevel: string;
  callbackUrl: string;
}

@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(QueueService.name);
  private connection: amqp.AmqpConnectionManager;
  private channelWrapper: ChannelWrapper;

  // Queue names
  private readonly EXCHANGE = 'ai_grading';
  private readonly WRITING_QUEUE = 'ai.writing.jobs';
  private readonly SPEAKING_QUEUE = 'ai.speaking.jobs';
  private readonly RESULT_QUEUE = 'ai.results';

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect() {
    const rabbitmqUrl = this.configService.get<string>(
      'RABBITMQ_URL',
      'amqp://localhost:5672',
    );

    this.logger.log(`Connecting to RabbitMQ: ${rabbitmqUrl}`);

    this.connection = amqp.connect([rabbitmqUrl]);

    this.connection.on('connect', () => {
      this.logger.log('RabbitMQ connected');
    });

    this.connection.on('disconnect', (err) => {
      this.logger.error('RabbitMQ disconnected', err?.message);
    });

    this.channelWrapper = this.connection.createChannel({
      json: true,
      setup: async (channel: Channel) => {
        // Declare exchange
        await channel.assertExchange(this.EXCHANGE, 'direct', {
          durable: true,
        });

        // Declare queues
        await channel.assertQueue(this.WRITING_QUEUE, { durable: true });
        await channel.assertQueue(this.SPEAKING_QUEUE, { durable: true });
        await channel.assertQueue(this.RESULT_QUEUE, { durable: true });

        // Bind queues to exchange
        await channel.bindQueue(this.WRITING_QUEUE, this.EXCHANGE, 'writing');
        await channel.bindQueue(this.SPEAKING_QUEUE, this.EXCHANGE, 'speaking');
        await channel.bindQueue(this.RESULT_QUEUE, this.EXCHANGE, 'result');

        this.logger.log('RabbitMQ queues setup complete');
      },
    });

    await this.channelWrapper.waitForConnect();
  }

  private async disconnect() {
    if (this.channelWrapper) {
      await this.channelWrapper.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }

  /**
   * Publish writing job to queue
   */
  async publishWritingJob(payload: WritingJobPayload): Promise<void> {
    try {
      await this.channelWrapper.publish(
        this.EXCHANGE,
        'writing',
        payload,
        {
          persistent: true,
          contentType: 'application/json',
        },
      );

      this.logger.log(`Writing job published: ${payload.jobId}`);
    } catch (error) {
      this.logger.error(`Failed to publish writing job: ${error.message}`);
      throw error;
    }
  }

  /**
   * Publish speaking job to queue
   */
  async publishSpeakingJob(payload: SpeakingJobPayload): Promise<void> {
    try {
      await this.channelWrapper.publish(
        this.EXCHANGE,
        'speaking',
        payload,
        {
          persistent: true,
          contentType: 'application/json',
        },
      );

      this.logger.log(`Speaking job published: ${payload.jobId}`);
    } catch (error) {
      this.logger.error(`Failed to publish speaking job: ${error.message}`);
      throw error;
    }
  }

  /**
   * Check if queue service is healthy
   */
  async isHealthy(): Promise<boolean> {
    try {
      return this.connection.isConnected();
    } catch {
      return false;
    }
  }
}
```

### 4. Update src/modules/ai/ai.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AiController } from './ai.controller';
import { AiCallbackController } from './ai-callback.controller';
import { AiService } from './ai.service';
import { AiJobEntity } from './entities/ai-job.entity';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AiJobEntity]),
    ConfigModule,
    QueueModule,
  ],
  controllers: [AiController, AiCallbackController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
```

### 5. Health Check Integration

```typescript
// src/modules/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { QueueService } from '@/modules/ai/queue/queue.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly queueService: QueueService) {}

  @Get()
  @ApiOperation({ summary: 'Health check' })
  async check() {
    const rabbitHealthy = await this.queueService.isHealthy();

    return {
      status: rabbitHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        api: 'healthy',
        rabbitmq: rabbitHealthy ? 'healthy' : 'unhealthy',
      },
    };
  }
}
```

### 6. Environment Variables

```env
# .env
RABBITMQ_URL=amqp://localhost:5672
CALLBACK_SECRET=your-secret-key-here
BACKEND_URL=http://localhost:3000
```

---

## ✅ Acceptance Criteria

- [ ] RabbitMQ connection established on startup
- [ ] Exchange declared (ai_grading)
- [ ] Writing queue declared and bound
- [ ] Speaking queue declared and bound
- [ ] Result queue declared and bound
- [ ] Publishing writing jobs works
- [ ] Publishing speaking jobs works
- [ ] Health check reports queue status
- [ ] Graceful disconnect on shutdown
- [ ] Automatic reconnection on failure

---

## 🧪 Test

```typescript
// test/queue.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { QueueService } from './queue.service';

describe('QueueService', () => {
  let service: QueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('amqp://localhost:5672'),
          },
        },
      ],
    }).compile();

    service = module.get<QueueService>(QueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('publishWritingJob', () => {
    it('should publish job with correct payload', async () => {
      const payload = {
        jobId: 'test-123',
        userId: 1,
        attemptId: 1,
        questionId: 1,
        taskType: 'task2',
        prompt: 'Write about...',
        studentAnswer: 'My essay...',
        targetLevel: 'B1',
        callbackUrl: 'http://localhost:3000/callback',
      };

      // Mock the channel wrapper
      // In real test, use testcontainers or mock
      await expect(service.publishWritingJob(payload)).resolves.not.toThrow();
    });
  });
});
```

---

## 📚 References

- amqp-connection-manager: https://github.com/jwalton/node-amqp-connection-manager
- NestJS Microservices: https://docs.nestjs.com/microservices/basics

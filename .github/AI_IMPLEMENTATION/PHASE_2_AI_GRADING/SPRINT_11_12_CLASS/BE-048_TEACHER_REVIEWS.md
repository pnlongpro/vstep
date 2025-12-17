# BE-048: Teacher Reviews Service

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-048 |
| **Phase** | 2 - AI Grading |
| **Sprint** | 11-12 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 5h |
| **Dependencies** | BE-044, BE-045, BE-046 |

---

## 🎯 Objective

Implement Teacher manual review system:
- Review student submissions (Writing/Speaking)
- Override AI scores
- Add text and audio feedback
- Track review history

---

## 📁 Files to Create

```
src/modules/teacher-reviews/
├── teacher-reviews.controller.ts
├── teacher-reviews.service.ts
├── teacher-reviews.module.ts
├── dto/
│   ├── create-review.dto.ts
│   ├── update-review.dto.ts
│   └── review-response.dto.ts
└── entities/
    └── teacher-review.entity.ts
```

---

## 📝 Implementation

### 1. entities/teacher-review.entity.ts

```typescript
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
import { UserEntity } from '../../users/entities/user.entity';

export enum ReviewType {
  WRITING = 'writing',
  SPEAKING = 'speaking',
}

export enum ReviewStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

@Entity('teacher_reviews')
@Index(['teacherId', 'status'])
@Index(['submissionId', 'submissionType'])
export class TeacherReviewEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Reference to the submission (either exam_answer or practice_session)
  @Column()
  submissionId: string;

  @Column({
    type: 'enum',
    enum: ReviewType,
  })
  submissionType: ReviewType;

  @Column()
  @Index()
  studentId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'studentId' })
  student: UserEntity;

  @Column()
  @Index()
  teacherId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'teacherId' })
  teacher: UserEntity;

  @Column({ nullable: true })
  classId: string;

  @Column({
    type: 'enum',
    enum: ReviewStatus,
    default: ReviewStatus.PENDING,
  })
  status: ReviewStatus;

  // AI Scores (original)
  @Column({ type: 'json', nullable: true })
  aiScores: {
    overall: number;
    criteria: Record<string, number>;
    feedback: string;
  };

  // Teacher Override Scores
  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  overrideOverallScore: number;

  @Column({ type: 'json', nullable: true })
  overrideCriteriaScores: Record<string, number>;

  // Feedback
  @Column({ type: 'text', nullable: true })
  textFeedback: string;

  @Column({ length: 500, nullable: true })
  audioFeedbackUrl: string;

  @Column({ type: 'int', nullable: true })
  audioFeedbackDuration: number; // seconds

  // Annotations (for inline feedback)
  @Column({ type: 'json', nullable: true })
  annotations: Array<{
    position: { start: number; end: number };
    type: 'error' | 'suggestion' | 'praise';
    comment: string;
    correction?: string;
  }>;

  // Original content for reference
  @Column({ type: 'text', nullable: true })
  originalContent: string;

  @Column({ length: 500, nullable: true })
  originalAudioUrl: string;

  @Column({ type: 'text', nullable: true })
  transcription: string;

  @Column({ nullable: true })
  startedAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 2. Migration

```typescript
// src/migrations/XXXXXX-create-teacher-reviews.ts
import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateTeacherReviews1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'teacher_reviews',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'submissionId',
            type: 'uuid',
          },
          {
            name: 'submissionType',
            type: 'enum',
            enum: ['writing', 'speaking'],
          },
          {
            name: 'studentId',
            type: 'uuid',
          },
          {
            name: 'teacherId',
            type: 'uuid',
          },
          {
            name: 'classId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['pending', 'in_progress', 'completed'],
            default: "'pending'",
          },
          {
            name: 'aiScores',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'overrideOverallScore',
            type: 'decimal',
            precision: 3,
            scale: 1,
            isNullable: true,
          },
          {
            name: 'overrideCriteriaScores',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'textFeedback',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'audioFeedbackUrl',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'audioFeedbackDuration',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'annotations',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'originalContent',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'originalAudioUrl',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'transcription',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'startedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'completedAt',
            type: 'timestamp',
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
        ],
      }),
      true,
    );

    // Indexes
    await queryRunner.createIndex(
      'teacher_reviews',
      new TableIndex({
        name: 'IDX_teacher_reviews_teacher_status',
        columnNames: ['teacherId', 'status'],
      }),
    );

    await queryRunner.createIndex(
      'teacher_reviews',
      new TableIndex({
        name: 'IDX_teacher_reviews_submission',
        columnNames: ['submissionId', 'submissionType'],
      }),
    );

    // Foreign keys
    await queryRunner.createForeignKey(
      'teacher_reviews',
      new TableForeignKey({
        columnNames: ['studentId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'teacher_reviews',
      new TableForeignKey({
        columnNames: ['teacherId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('teacher_reviews');
  }
}
```

### 3. DTOs

#### create-review.dto.ts

```typescript
import { IsString, IsUUID, IsEnum, IsOptional, IsNumber, Min, Max, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ReviewType } from '../entities/teacher-review.entity';

class AnnotationDto {
  @ApiProperty()
  @IsNumber()
  start: number;

  @ApiProperty()
  @IsNumber()
  end: number;

  @ApiProperty({ enum: ['error', 'suggestion', 'praise'] })
  @IsEnum(['error', 'suggestion', 'praise'])
  type: 'error' | 'suggestion' | 'praise';

  @ApiProperty()
  @IsString()
  comment: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  correction?: string;
}

export class CreateReviewDto {
  @ApiProperty({ description: 'Submission ID (exam_answer or practice_session)' })
  @IsUUID()
  submissionId: string;

  @ApiProperty({ enum: ReviewType })
  @IsEnum(ReviewType)
  submissionType: ReviewType;

  @ApiProperty()
  @IsUUID()
  studentId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  classId?: string;
}

export class SubmitReviewDto {
  @ApiPropertyOptional({ description: 'Override overall score (0-10)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  overrideOverallScore?: number;

  @ApiPropertyOptional({ description: 'Override criteria scores' })
  @IsOptional()
  overrideCriteriaScores?: Record<string, number>;

  @ApiProperty({ description: 'Text feedback from teacher' })
  @IsString()
  textFeedback: string;

  @ApiPropertyOptional({ description: 'Audio feedback URL (if uploaded)' })
  @IsOptional()
  @IsString()
  audioFeedbackUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  audioFeedbackDuration?: number;

  @ApiPropertyOptional({ type: [AnnotationDto], description: 'Inline annotations' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnnotationDto)
  annotations?: AnnotationDto[];
}
```

### 4. teacher-reviews.service.ts

```typescript
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { TeacherReviewEntity, ReviewStatus, ReviewType } from './entities/teacher-review.entity';
import { ClassStudentEntity } from '../classes/entities/class-student.entity';
import { CreateReviewDto, SubmitReviewDto } from './dto/create-review.dto';
import { NotificationService } from '../notifications/notification.service';

export interface ReviewQueueItem {
  id: string;
  submissionId: string;
  submissionType: ReviewType;
  student: {
    id: string;
    name: string;
    avatar?: string;
  };
  className?: string;
  aiScore?: number;
  content: string;
  submittedAt: Date;
  status: ReviewStatus;
}

@Injectable()
export class TeacherReviewsService {
  constructor(
    @InjectRepository(TeacherReviewEntity)
    private readonly reviewRepo: Repository<TeacherReviewEntity>,
    @InjectRepository(ClassStudentEntity)
    private readonly classStudentRepo: Repository<ClassStudentEntity>,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * Get pending reviews for a teacher
   */
  async getReviewQueue(
    teacherId: string,
    filters: {
      status?: ReviewStatus;
      type?: ReviewType;
      classId?: string;
    },
  ): Promise<{ items: ReviewQueueItem[]; total: number }> {
    const qb = this.reviewRepo
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.student', 'student')
      .where('review.teacherId = :teacherId', { teacherId });

    if (filters.status) {
      qb.andWhere('review.status = :status', { status: filters.status });
    }

    if (filters.type) {
      qb.andWhere('review.submissionType = :type', { type: filters.type });
    }

    if (filters.classId) {
      qb.andWhere('review.classId = :classId', { classId: filters.classId });
    }

    qb.orderBy('review.createdAt', 'ASC'); // FIFO queue

    const [items, total] = await qb.getManyAndCount();

    return {
      items: items.map((item) => ({
        id: item.id,
        submissionId: item.submissionId,
        submissionType: item.submissionType,
        student: {
          id: item.student.id,
          name: item.student.name,
          avatar: item.student.avatar,
        },
        aiScore: item.aiScores?.overall,
        content: item.originalContent?.substring(0, 200) + '...',
        submittedAt: item.createdAt,
        status: item.status,
      })),
      total,
    };
  }

  /**
   * Get single review for detailed view
   */
  async getReviewDetail(reviewId: string, teacherId: string): Promise<TeacherReviewEntity> {
    const review = await this.reviewRepo.findOne({
      where: { id: reviewId },
      relations: ['student', 'teacher'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.teacherId !== teacherId) {
      throw new ForbiddenException('You can only access your own reviews');
    }

    // Mark as in progress if pending
    if (review.status === ReviewStatus.PENDING) {
      review.status = ReviewStatus.IN_PROGRESS;
      review.startedAt = new Date();
      await this.reviewRepo.save(review);
    }

    return review;
  }

  /**
   * Submit teacher review
   */
  async submitReview(
    reviewId: string,
    teacherId: string,
    dto: SubmitReviewDto,
  ): Promise<TeacherReviewEntity> {
    const review = await this.reviewRepo.findOne({
      where: { id: reviewId },
      relations: ['student'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.teacherId !== teacherId) {
      throw new ForbiddenException('You can only submit your own reviews');
    }

    if (review.status === ReviewStatus.COMPLETED) {
      throw new BadRequestException('This review has already been submitted');
    }

    // Validate override scores if provided
    if (dto.overrideCriteriaScores) {
      for (const [key, value] of Object.entries(dto.overrideCriteriaScores)) {
        if (value < 0 || value > 10) {
          throw new BadRequestException(`Score for ${key} must be between 0 and 10`);
        }
      }
    }

    // Update review
    review.overrideOverallScore = dto.overrideOverallScore;
    review.overrideCriteriaScores = dto.overrideCriteriaScores;
    review.textFeedback = dto.textFeedback;
    review.audioFeedbackUrl = dto.audioFeedbackUrl;
    review.audioFeedbackDuration = dto.audioFeedbackDuration;
    review.annotations = dto.annotations;
    review.status = ReviewStatus.COMPLETED;
    review.completedAt = new Date();

    await this.reviewRepo.save(review);

    // Notify student
    await this.notificationService.sendToUser(review.studentId, {
      type: 'review_completed',
      title: 'Giáo viên đã chấm bài',
      message: `Bài ${review.submissionType === ReviewType.WRITING ? 'Writing' : 'Speaking'} của bạn đã được chấm`,
      data: {
        reviewId: review.id,
        submissionId: review.submissionId,
        finalScore: review.overrideOverallScore || review.aiScores?.overall,
      },
    });

    return review;
  }

  /**
   * Create review request (called when student submits writing/speaking)
   */
  async createReviewRequest(dto: CreateReviewDto, teacherId: string): Promise<TeacherReviewEntity> {
    const review = this.reviewRepo.create({
      ...dto,
      teacherId,
      status: ReviewStatus.PENDING,
    });

    return this.reviewRepo.save(review);
  }

  /**
   * Auto-assign reviews to teachers based on class
   */
  async autoAssignReview(
    submissionId: string,
    submissionType: ReviewType,
    studentId: string,
    originalContent: string,
    aiScores: any,
    audioUrl?: string,
    transcription?: string,
  ): Promise<TeacherReviewEntity | null> {
    // Find classes the student is enrolled in
    const enrollments = await this.classStudentRepo.find({
      where: { studentId, status: 'active' },
      relations: ['class'],
    });

    if (enrollments.length === 0) {
      return null; // Student not in any class, no manual review
    }

    // Assign to teacher of first active class
    const classEntity = enrollments[0].class;

    const review = this.reviewRepo.create({
      submissionId,
      submissionType,
      studentId,
      teacherId: classEntity.teacherId,
      classId: classEntity.id,
      status: ReviewStatus.PENDING,
      aiScores,
      originalContent,
      originalAudioUrl: audioUrl,
      transcription,
    });

    return this.reviewRepo.save(review);
  }

  /**
   * Get review statistics for teacher
   */
  async getReviewStats(teacherId: string): Promise<{
    pending: number;
    inProgress: number;
    completedToday: number;
    completedThisWeek: number;
    averageReviewTime: number;
  }> {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

    const [pending, inProgress, completedToday, completedThisWeek] = await Promise.all([
      this.reviewRepo.count({
        where: { teacherId, status: ReviewStatus.PENDING },
      }),
      this.reviewRepo.count({
        where: { teacherId, status: ReviewStatus.IN_PROGRESS },
      }),
      this.reviewRepo
        .createQueryBuilder('r')
        .where('r.teacherId = :teacherId', { teacherId })
        .andWhere('r.status = :status', { status: ReviewStatus.COMPLETED })
        .andWhere('r.completedAt >= :startOfDay', { startOfDay })
        .getCount(),
      this.reviewRepo
        .createQueryBuilder('r')
        .where('r.teacherId = :teacherId', { teacherId })
        .andWhere('r.status = :status', { status: ReviewStatus.COMPLETED })
        .andWhere('r.completedAt >= :startOfWeek', { startOfWeek })
        .getCount(),
    ]);

    // Calculate average review time
    const avgResult = await this.reviewRepo
      .createQueryBuilder('r')
      .select('AVG(TIMESTAMPDIFF(MINUTE, r.startedAt, r.completedAt))', 'avgMinutes')
      .where('r.teacherId = :teacherId', { teacherId })
      .andWhere('r.status = :status', { status: ReviewStatus.COMPLETED })
      .andWhere('r.startedAt IS NOT NULL')
      .andWhere('r.completedAt IS NOT NULL')
      .getRawOne();

    return {
      pending,
      inProgress,
      completedToday,
      completedThisWeek,
      averageReviewTime: parseFloat(avgResult?.avgMinutes) || 0,
    };
  }
}
```

### 5. teacher-reviews.controller.ts

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { TeacherReviewsService } from './teacher-reviews.service';
import { SubmitReviewDto } from './dto/create-review.dto';
import { StorageService } from '@/core/storage/storage.service';
import { UserPayload } from '@/shared/types/user-payload.type';
import { ReviewStatus, ReviewType } from './entities/teacher-review.entity';

@ApiTags('Teacher Reviews')
@Controller('teacher/reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('teacher', 'admin')
@ApiBearerAuth()
export class TeacherReviewsController {
  constructor(
    private readonly reviewsService: TeacherReviewsService,
    private readonly storageService: StorageService,
  ) {}

  @Get('queue')
  @ApiOperation({ summary: 'Get review queue' })
  async getQueue(
    @CurrentUser() user: UserPayload,
    @Query('status') status?: ReviewStatus,
    @Query('type') type?: ReviewType,
    @Query('classId') classId?: string,
  ) {
    return this.reviewsService.getReviewQueue(user.id, { status, type, classId });
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get review statistics' })
  async getStats(@CurrentUser() user: UserPayload) {
    return this.reviewsService.getReviewStats(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get review detail' })
  async getDetail(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
  ) {
    return this.reviewsService.getReviewDetail(id, user.id);
  }

  @Put(':id/submit')
  @ApiOperation({ summary: 'Submit review' })
  async submitReview(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
    @Body() dto: SubmitReviewDto,
  ) {
    return this.reviewsService.submitReview(id, user.id, dto);
  }

  @Post(':id/audio-feedback')
  @UseInterceptors(FileInterceptor('audio'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload audio feedback' })
  async uploadAudioFeedback(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Validate review ownership
    await this.reviewsService.getReviewDetail(id, user.id);

    // Upload audio file
    const path = await this.storageService.uploadFile(
      file.buffer,
      `reviews/${id}/feedback_${Date.now()}.webm`,
      file.mimetype,
    );

    const url = await this.storageService.getSignedUrl(path, 86400 * 7); // 7 days

    return {
      audioFeedbackUrl: url,
      audioFeedbackDuration: 0, // TODO: Extract from file
    };
  }
}
```

---

## ✅ Acceptance Criteria

- [ ] Review queue displays pending submissions
- [ ] Teacher can view submission details
- [ ] Teacher can override AI scores
- [ ] Teacher can add text feedback
- [ ] Teacher can record/upload audio feedback
- [ ] Inline annotations work
- [ ] Student receives notification
- [ ] Review statistics display
- [ ] FIFO queue order

---

## 🧪 Test Cases

```typescript
describe('TeacherReviewsService', () => {
  describe('getReviewQueue', () => {
    it('should return pending reviews for teacher');
    it('should filter by type');
    it('should filter by class');
  });

  describe('submitReview', () => {
    it('should submit review with feedback');
    it('should validate score range');
    it('should notify student');
    it('should reject already completed');
  });
});
```

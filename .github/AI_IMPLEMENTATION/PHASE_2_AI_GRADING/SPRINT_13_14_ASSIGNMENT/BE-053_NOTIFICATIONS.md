# BE-053: Assignment Notifications

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-053 |
| **Phase** | 2 - AI Grading |
| **Sprint** | 13-14 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 4h |
| **Dependencies** | BE-051, BE-052 |

---

## 🎯 Objective

Implement notification system for assignments:
- New assignment published → notify students
- Assignment due soon → reminder
- Submission graded → notify student
- Late submission warning

---

## 📝 Implementation

### 1. entities/notification.entity.ts

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

export enum NotificationType {
  ASSIGNMENT_PUBLISHED = 'assignment_published',
  ASSIGNMENT_DUE_SOON = 'assignment_due_soon',
  ASSIGNMENT_OVERDUE = 'assignment_overdue',
  SUBMISSION_GRADED = 'submission_graded',
  CLASS_INVITE = 'class_invite',
  MATERIAL_UPLOADED = 'material_uploaded',
  TEACHER_FEEDBACK = 'teacher_feedback',
  ACHIEVEMENT_UNLOCKED = 'achievement_unlocked',
  SYSTEM = 'system',
}

@Entity('notifications')
@Index(['userId', 'isRead'])
@Index(['userId', 'createdAt'])
export class NotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'json', nullable: true })
  data: {
    assignmentId?: string;
    assignmentTitle?: string;
    classId?: string;
    className?: string;
    submissionId?: string;
    score?: number;
    dueDate?: string;
    link?: string;
  };

  @Column({ name: 'is_read', type: 'boolean', default: false })
  isRead: boolean;

  @Column({ name: 'read_at', type: 'datetime', nullable: true })
  readAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
```

### 2. notifications.service.ts

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationEntity, NotificationType } from './entities/notification.entity';
import { AssignmentEntity } from '../assignments/entities/assignment.entity';
import { ClassStudentEntity } from '../classes/entities/class-student.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepo: Repository<NotificationEntity>,
    @InjectRepository(AssignmentEntity)
    private readonly assignmentRepo: Repository<AssignmentEntity>,
    @InjectRepository(ClassStudentEntity)
    private readonly classStudentRepo: Repository<ClassStudentEntity>,
  ) {}

  // ─────────────────────────────────────────────────────────────
  // CRUD Operations
  // ─────────────────────────────────────────────────────────────

  async getUserNotifications(
    userId: string,
    options: { limit?: number; unreadOnly?: boolean } = {},
  ) {
    const qb = this.notificationRepo
      .createQueryBuilder('n')
      .where('n.userId = :userId', { userId })
      .orderBy('n.createdAt', 'DESC');

    if (options.unreadOnly) {
      qb.andWhere('n.isRead = :isRead', { isRead: false });
    }

    if (options.limit) {
      qb.take(options.limit);
    }

    const [items, total] = await qb.getManyAndCount();
    const unreadCount = await this.notificationRepo.count({
      where: { userId, isRead: false },
    });

    return { items, total, unreadCount };
  }

  async markAsRead(userId: string, notificationId: string): Promise<void> {
    await this.notificationRepo.update(
      { id: notificationId, userId },
      { isRead: true, readAt: new Date() },
    );
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepo.update(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() },
    );
  }

  async deleteNotification(userId: string, notificationId: string): Promise<void> {
    await this.notificationRepo.delete({ id: notificationId, userId });
  }

  async deleteOldNotifications(daysOld: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await this.notificationRepo.delete({
      createdAt: LessThan(cutoffDate),
      isRead: true,
    });

    return result.affected || 0;
  }

  // ─────────────────────────────────────────────────────────────
  // Assignment Notifications
  // ─────────────────────────────────────────────────────────────

  async notifyAssignmentPublished(assignment: AssignmentEntity): Promise<void> {
    // Get all students in the class
    const students = await this.classStudentRepo.find({
      where: { classId: assignment.classId, status: 'active' },
      relations: ['class'],
    });

    const notifications = students.map((student) =>
      this.notificationRepo.create({
        userId: student.studentId,
        type: NotificationType.ASSIGNMENT_PUBLISHED,
        title: 'Bài tập mới',
        message: `Giáo viên vừa giao bài tập "${assignment.title}" cho lớp ${student.class?.name}`,
        data: {
          assignmentId: assignment.id,
          assignmentTitle: assignment.title,
          classId: assignment.classId,
          className: student.class?.name,
          dueDate: assignment.dueDate.toISOString(),
          link: `/student/assignments/${assignment.id}`,
        },
      })
    );

    await this.notificationRepo.save(notifications);

    // TODO: Send push notifications / emails
  }

  async notifySubmissionGraded(
    submissionId: string,
    studentId: string,
    assignmentTitle: string,
    score: number,
  ): Promise<void> {
    const notification = this.notificationRepo.create({
      userId: studentId,
      type: NotificationType.SUBMISSION_GRADED,
      title: 'Bài tập đã được chấm',
      message: `Bài tập "${assignmentTitle}" đã được chấm. Điểm: ${score.toFixed(1)}`,
      data: {
        submissionId,
        assignmentTitle,
        score,
        link: `/student/submissions/${submissionId}`,
      },
    });

    await this.notificationRepo.save(notification);
  }

  // ─────────────────────────────────────────────────────────────
  // Scheduled Jobs
  // ─────────────────────────────────────────────────────────────

  @Cron(CronExpression.EVERY_HOUR)
  async sendDueSoonReminders(): Promise<void> {
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Find assignments due within 24 hours
    const assignments = await this.assignmentRepo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.class', 'c')
      .where('a.status = :status', { status: 'published' })
      .andWhere('a.dueDate BETWEEN :now AND :soon', { now, soon: in24Hours })
      .getMany();

    for (const assignment of assignments) {
      // Check if we already sent reminder today
      const existingReminder = await this.notificationRepo.findOne({
        where: {
          type: NotificationType.ASSIGNMENT_DUE_SOON,
          data: { assignmentId: assignment.id } as any,
        },
      });

      if (existingReminder) continue;

      // Get students who haven't submitted
      const students = await this.classStudentRepo.find({
        where: { classId: assignment.classId, status: 'active' },
      });

      // TODO: Filter out students who already submitted

      const notifications = students.map((student) =>
        this.notificationRepo.create({
          userId: student.studentId,
          type: NotificationType.ASSIGNMENT_DUE_SOON,
          title: 'Bài tập sắp hết hạn',
          message: `Bài tập "${assignment.title}" sẽ hết hạn trong 24 giờ nữa!`,
          data: {
            assignmentId: assignment.id,
            assignmentTitle: assignment.title,
            classId: assignment.classId,
            className: assignment.class?.name,
            dueDate: assignment.dueDate.toISOString(),
            link: `/student/assignments/${assignment.id}`,
          },
        })
      );

      await this.notificationRepo.save(notifications);
    }
  }

  @Cron('0 9 * * *') // Every day at 9 AM
  async sendOverdueReminders(): Promise<void> {
    // Find assignments that became overdue yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const assignments = await this.assignmentRepo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.class', 'c')
      .where('a.status = :status', { status: 'published' })
      .andWhere('a.dueDate BETWEEN :yesterday AND :today', { yesterday, today })
      .andWhere('a.allowLateSubmission = :allow', { allow: true })
      .getMany();

    for (const assignment of assignments) {
      // Get students who haven't submitted
      // TODO: Filter properly
      const students = await this.classStudentRepo.find({
        where: { classId: assignment.classId, status: 'active' },
      });

      const notifications = students.map((student) =>
        this.notificationRepo.create({
          userId: student.studentId,
          type: NotificationType.ASSIGNMENT_OVERDUE,
          title: 'Bài tập quá hạn',
          message: `Bài tập "${assignment.title}" đã quá hạn nhưng vẫn nhận bài trễ (có trừ điểm)`,
          data: {
            assignmentId: assignment.id,
            assignmentTitle: assignment.title,
            classId: assignment.classId,
            dueDate: assignment.dueDate.toISOString(),
            link: `/student/assignments/${assignment.id}`,
          },
        })
      );

      await this.notificationRepo.save(notifications);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async cleanupOldNotifications(): Promise<void> {
    const deleted = await this.deleteOldNotifications(60);
    console.log(`Cleaned up ${deleted} old notifications`);
  }
}
```

### 3. notifications.controller.ts

```typescript
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user notifications' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'unreadOnly', required: false, type: Boolean })
  async getNotifications(
    @CurrentUser('id') userId: string,
    @Query('limit') limit?: string,
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    return this.notificationsService.getUserNotifications(userId, {
      limit: limit ? parseInt(limit) : undefined,
      unreadOnly: unreadOnly === 'true',
    });
  }

  @Post(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  async markAsRead(
    @CurrentUser('id') userId: string,
    @Param('id') notificationId: string,
  ) {
    await this.notificationsService.markAsRead(userId, notificationId);
    return { success: true };
  }

  @Post('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllAsRead(@CurrentUser('id') userId: string) {
    await this.notificationsService.markAllAsRead(userId);
    return { success: true };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification' })
  async deleteNotification(
    @CurrentUser('id') userId: string,
    @Param('id') notificationId: string,
  ) {
    await this.notificationsService.deleteNotification(userId, notificationId);
    return { success: true };
  }
}
```

### 4. notifications.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationEntity } from './entities/notification.entity';
import { AssignmentEntity } from '../assignments/entities/assignment.entity';
import { ClassStudentEntity } from '../classes/entities/class-student.entity';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NotificationEntity,
      AssignmentEntity,
      ClassStudentEntity,
    ]),
    ScheduleModule.forRoot(),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
```

### 5. Migration

```typescript
// src/migrations/1704700000000-CreateNotificationsTable.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNotificationsTable1704700000000 implements MigrationInterface {
  name = 'CreateNotificationsTable1704700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`notifications\` (
        \`id\` varchar(36) NOT NULL,
        \`user_id\` varchar(36) NOT NULL,
        \`type\` enum(
          'assignment_published',
          'assignment_due_soon',
          'assignment_overdue',
          'submission_graded',
          'class_invite',
          'material_uploaded',
          'teacher_feedback',
          'achievement_unlocked',
          'system'
        ) NOT NULL,
        \`title\` varchar(255) NOT NULL,
        \`message\` text NOT NULL,
        \`data\` json NULL,
        \`is_read\` tinyint NOT NULL DEFAULT 0,
        \`read_at\` datetime NULL,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_notifications_user_read\` (\`user_id\`, \`is_read\`),
        INDEX \`IDX_notifications_user_created\` (\`user_id\`, \`created_at\`),
        CONSTRAINT \`FK_notifications_user\` FOREIGN KEY (\`user_id\`) 
          REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`notifications\``);
  }
}
```

---

## 🔗 Integration Points

### In AssignmentsService.publish()

```typescript
// After publishing assignment
await this.notificationsService.notifyAssignmentPublished(assignment);
```

### In SubmissionsService.gradeSubmission()

```typescript
// After grading
await this.notificationsService.notifySubmissionGraded(
  submission.id,
  submission.studentId,
  submission.assignment.title,
  submission.score,
);
```

---

## ✅ Acceptance Criteria

- [ ] Notification entity created with migration
- [ ] Get notifications with pagination
- [ ] Mark single/all as read
- [ ] Delete notification
- [ ] Notify on assignment publish
- [ ] Notify on submission graded
- [ ] Cron: Due soon reminder (24h)
- [ ] Cron: Overdue reminder (if late allowed)
- [ ] Cron: Cleanup old notifications (60 days)
- [ ] Unread count returned with list

---

## 🧪 Test Cases

```typescript
describe('NotificationsService', () => {
  it('creates notification for all students on publish', async () => {
    // 3 students in class
    await notificationsService.notifyAssignmentPublished(assignment);
    
    const notifications = await notificationRepo.find({
      where: { type: NotificationType.ASSIGNMENT_PUBLISHED },
    });
    expect(notifications).toHaveLength(3);
  });

  it('marks notification as read', async () => {
    await service.markAsRead(userId, notificationId);
    
    const notification = await notificationRepo.findOne({ 
      where: { id: notificationId } 
    });
    expect(notification.isRead).toBe(true);
    expect(notification.readAt).toBeDefined();
  });

  it('returns unread count', async () => {
    const result = await service.getUserNotifications(userId);
    expect(result.unreadCount).toBe(5);
  });
});
```

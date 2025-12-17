# BE-050: Assignment Entity & Migration

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-050 |
| **Phase** | 2 - AI Grading |
| **Sprint** | 13-14 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 4h |
| **Dependencies** | BE-044 (Class Entity) |

---

## 🎯 Objective

Create database entities for Assignment system:
- AssignmentEntity - The homework/task definition
- AssignmentQuestionEntity - Questions linked to assignment
- AssignmentSubmissionEntity - Student attempts
- SubmissionAnswerEntity - Individual answers

---

## 📝 Implementation

### 1. entities/assignment.entity.ts

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { ClassEntity } from '../../classes/entities/class.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { AssignmentQuestionEntity } from './assignment-question.entity';
import { AssignmentSubmissionEntity } from './assignment-submission.entity';

export enum AssignmentSkill {
  READING = 'reading',
  LISTENING = 'listening',
  WRITING = 'writing',
  SPEAKING = 'speaking',
  MIXED = 'mixed', // Multiple skills
}

export enum AssignmentLevel {
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
}

export enum AssignmentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CLOSED = 'closed',
}

export enum ScoreCalculation {
  BEST = 'best',     // Highest score among attempts
  LAST = 'last',     // Last attempt score
  AVERAGE = 'average', // Average of all attempts
}

@Entity('assignments')
@Index(['classId', 'status'])
@Index(['classId', 'dueDate'])
@Index(['createdById'])
export class AssignmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'class_id', type: 'uuid' })
  classId: string;

  @ManyToOne(() => ClassEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'class_id' })
  class: ClassEntity;

  @Column({ name: 'created_by', type: 'uuid' })
  createdById: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'created_by' })
  createdBy: UserEntity;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @Column({
    type: 'enum',
    enum: AssignmentSkill,
    default: AssignmentSkill.MIXED,
  })
  skill: AssignmentSkill;

  @Column({
    type: 'enum',
    enum: AssignmentLevel,
    default: AssignmentLevel.B1,
  })
  level: AssignmentLevel;

  @Column({ name: 'due_date', type: 'datetime' })
  dueDate: Date;

  @Column({ name: 'time_limit', type: 'int', nullable: true })
  timeLimit: number; // Minutes, null = unlimited

  @Column({ name: 'max_attempts', type: 'int', default: 1 })
  maxAttempts: number;

  @Column({
    name: 'score_calculation',
    type: 'enum',
    enum: ScoreCalculation,
    default: ScoreCalculation.BEST,
  })
  scoreCalculation: ScoreCalculation;

  @Column({
    type: 'enum',
    enum: AssignmentStatus,
    default: AssignmentStatus.DRAFT,
  })
  status: AssignmentStatus;

  @Column({ name: 'allow_late_submission', type: 'boolean', default: false })
  allowLateSubmission: boolean;

  @Column({ name: 'late_penalty', type: 'decimal', precision: 4, scale: 2, default: 0 })
  latePenalty: number; // Percentage deduction per day

  @Column({ name: 'total_points', type: 'decimal', precision: 6, scale: 2, default: 10 })
  totalPoints: number;

  @Column({ name: 'passing_score', type: 'decimal', precision: 4, scale: 2, nullable: true })
  passingScore: number;

  @Column({ name: 'show_answers_after', type: 'boolean', default: true })
  showAnswersAfter: boolean; // Show correct answers after submission

  @Column({ name: 'published_at', type: 'datetime', nullable: true })
  publishedAt: Date;

  @Column({ name: 'closed_at', type: 'datetime', nullable: true })
  closedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => AssignmentQuestionEntity, (q) => q.assignment, { cascade: true })
  questions: AssignmentQuestionEntity[];

  @OneToMany(() => AssignmentSubmissionEntity, (s) => s.assignment)
  submissions: AssignmentSubmissionEntity[];

  // Computed
  get questionCount(): number {
    return this.questions?.length || 0;
  }

  get isOverdue(): boolean {
    return new Date() > this.dueDate;
  }
}
```

### 2. entities/assignment-question.entity.ts

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { AssignmentEntity } from './assignment.entity';
import { QuestionEntity } from '../../questions/entities/question.entity';

@Entity('assignment_questions')
@Index(['assignmentId', 'orderIndex'])
export class AssignmentQuestionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'assignment_id', type: 'uuid' })
  assignmentId: string;

  @ManyToOne(() => AssignmentEntity, (a) => a.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assignment_id' })
  assignment: AssignmentEntity;

  @Column({ name: 'question_id', type: 'uuid' })
  questionId: string;

  @ManyToOne(() => QuestionEntity)
  @JoinColumn({ name: 'question_id' })
  question: QuestionEntity;

  @Column({ name: 'order_index', type: 'int', default: 0 })
  orderIndex: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, default: 1 })
  points: number; // Points for this question

  @Column({ type: 'boolean', default: true })
  required: boolean;
}
```

### 3. entities/assignment-submission.entity.ts

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { AssignmentEntity } from './assignment.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { SubmissionAnswerEntity } from './submission-answer.entity';

export enum SubmissionStatus {
  IN_PROGRESS = 'in_progress',
  SUBMITTED = 'submitted',
  GRADED = 'graded',
}

@Entity('assignment_submissions')
@Index(['assignmentId', 'studentId'])
@Index(['assignmentId', 'status'])
@Index(['studentId', 'status'])
export class AssignmentSubmissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'assignment_id', type: 'uuid' })
  assignmentId: string;

  @ManyToOne(() => AssignmentEntity, (a) => a.submissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assignment_id' })
  assignment: AssignmentEntity;

  @Column({ name: 'student_id', type: 'uuid' })
  studentId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'student_id' })
  student: UserEntity;

  @Column({
    type: 'enum',
    enum: SubmissionStatus,
    default: SubmissionStatus.IN_PROGRESS,
  })
  status: SubmissionStatus;

  @Column({ name: 'attempt_number', type: 'int', default: 1 })
  attemptNumber: number;

  @Column({ name: 'started_at', type: 'datetime' })
  startedAt: Date;

  @Column({ name: 'submitted_at', type: 'datetime', nullable: true })
  submittedAt: Date;

  @Column({ name: 'time_spent', type: 'int', nullable: true })
  timeSpent: number; // Seconds

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  score: number;

  @Column({ name: 'percentage', type: 'decimal', precision: 5, scale: 2, nullable: true })
  percentage: number;

  @Column({ name: 'is_late', type: 'boolean', default: false })
  isLate: boolean;

  @Column({ name: 'late_penalty_applied', type: 'decimal', precision: 4, scale: 2, default: 0 })
  latePenaltyApplied: number;

  @Column({ name: 'correct_count', type: 'int', default: 0 })
  correctCount: number;

  @Column({ name: 'total_count', type: 'int', default: 0 })
  totalCount: number;

  @Column({ name: 'teacher_feedback', type: 'text', nullable: true })
  teacherFeedback: string;

  @Column({ name: 'graded_by', type: 'uuid', nullable: true })
  gradedById: string;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'graded_by' })
  gradedBy: UserEntity;

  @Column({ name: 'graded_at', type: 'datetime', nullable: true })
  gradedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => SubmissionAnswerEntity, (a) => a.submission, { cascade: true })
  answers: SubmissionAnswerEntity[];

  // Computed
  get isPassed(): boolean {
    if (!this.assignment?.passingScore) return true;
    return (this.percentage || 0) >= this.assignment.passingScore;
  }
}
```

### 4. entities/submission-answer.entity.ts

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { AssignmentSubmissionEntity } from './assignment-submission.entity';
import { QuestionEntity } from '../../questions/entities/question.entity';

@Entity('submission_answers')
@Index(['submissionId', 'questionId'])
export class SubmissionAnswerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'submission_id', type: 'uuid' })
  submissionId: string;

  @ManyToOne(() => AssignmentSubmissionEntity, (s) => s.answers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'submission_id' })
  submission: AssignmentSubmissionEntity;

  @Column({ name: 'question_id', type: 'uuid' })
  questionId: string;

  @ManyToOne(() => QuestionEntity)
  @JoinColumn({ name: 'question_id' })
  question: QuestionEntity;

  @Column({ type: 'text', nullable: true })
  answer: string;

  @Column({ name: 'selected_option_id', type: 'uuid', nullable: true })
  selectedOptionId: string; // For multiple choice

  @Column({ name: 'is_correct', type: 'boolean', nullable: true })
  isCorrect: boolean;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  score: number;

  @Column({ name: 'max_score', type: 'decimal', precision: 4, scale: 2, default: 1 })
  maxScore: number;

  @Column({ name: 'ai_score', type: 'decimal', precision: 4, scale: 2, nullable: true })
  aiScore: number;

  @Column({ name: 'ai_feedback', type: 'json', nullable: true })
  aiFeedback: {
    overallScore?: number;
    criteria?: { name: string; score: number; feedback: string }[];
    suggestions?: string[];
    grammarErrors?: { text: string; correction: string; position: number }[];
  };

  @Column({ name: 'teacher_score', type: 'decimal', precision: 4, scale: 2, nullable: true })
  teacherScore: number;

  @Column({ name: 'teacher_comment', type: 'text', nullable: true })
  teacherComment: string;

  @Column({ name: 'audio_url', type: 'varchar', length: 500, nullable: true })
  audioUrl: string; // For speaking answers

  @Column({ name: 'audio_duration', type: 'int', nullable: true })
  audioDuration: number; // Seconds

  @Column({ name: 'time_spent', type: 'int', nullable: true })
  timeSpent: number; // Seconds on this question

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Computed: Final score is teacher override or AI score
  get finalScore(): number {
    return this.teacherScore ?? this.aiScore ?? this.score ?? 0;
  }
}
```

### 5. Migration File

```typescript
// src/migrations/1704600000000-CreateAssignmentTables.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAssignmentTables1704600000000 implements MigrationInterface {
  name = 'CreateAssignmentTables1704600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Assignments table
    await queryRunner.query(`
      CREATE TABLE \`assignments\` (
        \`id\` varchar(36) NOT NULL,
        \`class_id\` varchar(36) NOT NULL,
        \`created_by\` varchar(36) NOT NULL,
        \`title\` varchar(255) NOT NULL,
        \`description\` text NULL,
        \`instructions\` text NULL,
        \`skill\` enum('reading', 'listening', 'writing', 'speaking', 'mixed') NOT NULL DEFAULT 'mixed',
        \`level\` enum('A2', 'B1', 'B2', 'C1') NOT NULL DEFAULT 'B1',
        \`due_date\` datetime NOT NULL,
        \`time_limit\` int NULL,
        \`max_attempts\` int NOT NULL DEFAULT 1,
        \`score_calculation\` enum('best', 'last', 'average') NOT NULL DEFAULT 'best',
        \`status\` enum('draft', 'published', 'closed') NOT NULL DEFAULT 'draft',
        \`allow_late_submission\` tinyint NOT NULL DEFAULT 0,
        \`late_penalty\` decimal(4,2) NOT NULL DEFAULT 0,
        \`total_points\` decimal(6,2) NOT NULL DEFAULT 10,
        \`passing_score\` decimal(4,2) NULL,
        \`show_answers_after\` tinyint NOT NULL DEFAULT 1,
        \`published_at\` datetime NULL,
        \`closed_at\` datetime NULL,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_assignments_class_status\` (\`class_id\`, \`status\`),
        INDEX \`IDX_assignments_class_due\` (\`class_id\`, \`due_date\`),
        INDEX \`IDX_assignments_created_by\` (\`created_by\`),
        CONSTRAINT \`FK_assignments_class\` FOREIGN KEY (\`class_id\`) REFERENCES \`classes\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_assignments_teacher\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Assignment questions (pivot table)
    await queryRunner.query(`
      CREATE TABLE \`assignment_questions\` (
        \`id\` varchar(36) NOT NULL,
        \`assignment_id\` varchar(36) NOT NULL,
        \`question_id\` varchar(36) NOT NULL,
        \`order_index\` int NOT NULL DEFAULT 0,
        \`points\` decimal(4,2) NOT NULL DEFAULT 1,
        \`required\` tinyint NOT NULL DEFAULT 1,
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_aq_assignment_order\` (\`assignment_id\`, \`order_index\`),
        CONSTRAINT \`FK_aq_assignment\` FOREIGN KEY (\`assignment_id\`) REFERENCES \`assignments\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_aq_question\` FOREIGN KEY (\`question_id\`) REFERENCES \`questions\`(\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Assignment submissions
    await queryRunner.query(`
      CREATE TABLE \`assignment_submissions\` (
        \`id\` varchar(36) NOT NULL,
        \`assignment_id\` varchar(36) NOT NULL,
        \`student_id\` varchar(36) NOT NULL,
        \`status\` enum('in_progress', 'submitted', 'graded') NOT NULL DEFAULT 'in_progress',
        \`attempt_number\` int NOT NULL DEFAULT 1,
        \`started_at\` datetime NOT NULL,
        \`submitted_at\` datetime NULL,
        \`time_spent\` int NULL,
        \`score\` decimal(6,2) NULL,
        \`percentage\` decimal(5,2) NULL,
        \`is_late\` tinyint NOT NULL DEFAULT 0,
        \`late_penalty_applied\` decimal(4,2) NOT NULL DEFAULT 0,
        \`correct_count\` int NOT NULL DEFAULT 0,
        \`total_count\` int NOT NULL DEFAULT 0,
        \`teacher_feedback\` text NULL,
        \`graded_by\` varchar(36) NULL,
        \`graded_at\` datetime NULL,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_sub_assignment_student\` (\`assignment_id\`, \`student_id\`),
        INDEX \`IDX_sub_assignment_status\` (\`assignment_id\`, \`status\`),
        INDEX \`IDX_sub_student_status\` (\`student_id\`, \`status\`),
        CONSTRAINT \`FK_sub_assignment\` FOREIGN KEY (\`assignment_id\`) REFERENCES \`assignments\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_sub_student\` FOREIGN KEY (\`student_id\`) REFERENCES \`users\`(\`id\`),
        CONSTRAINT \`FK_sub_grader\` FOREIGN KEY (\`graded_by\`) REFERENCES \`users\`(\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Submission answers
    await queryRunner.query(`
      CREATE TABLE \`submission_answers\` (
        \`id\` varchar(36) NOT NULL,
        \`submission_id\` varchar(36) NOT NULL,
        \`question_id\` varchar(36) NOT NULL,
        \`answer\` text NULL,
        \`selected_option_id\` varchar(36) NULL,
        \`is_correct\` tinyint NULL,
        \`score\` decimal(4,2) NULL,
        \`max_score\` decimal(4,2) NOT NULL DEFAULT 1,
        \`ai_score\` decimal(4,2) NULL,
        \`ai_feedback\` json NULL,
        \`teacher_score\` decimal(4,2) NULL,
        \`teacher_comment\` text NULL,
        \`audio_url\` varchar(500) NULL,
        \`audio_duration\` int NULL,
        \`time_spent\` int NULL,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_sa_submission_question\` (\`submission_id\`, \`question_id\`),
        CONSTRAINT \`FK_sa_submission\` FOREIGN KEY (\`submission_id\`) REFERENCES \`assignment_submissions\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_sa_question\` FOREIGN KEY (\`question_id\`) REFERENCES \`questions\`(\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`submission_answers\``);
    await queryRunner.query(`DROP TABLE \`assignment_submissions\``);
    await queryRunner.query(`DROP TABLE \`assignment_questions\``);
    await queryRunner.query(`DROP TABLE \`assignments\``);
  }
}
```

### 6. assignments.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentEntity } from './entities/assignment.entity';
import { AssignmentQuestionEntity } from './entities/assignment-question.entity';
import { AssignmentSubmissionEntity } from './entities/assignment-submission.entity';
import { SubmissionAnswerEntity } from './entities/submission-answer.entity';
import { AssignmentsService } from './assignments.service';
import { SubmissionsService } from './submissions.service';
import { AssignmentsController } from './assignments.controller';
import { SubmissionsController } from './submissions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AssignmentEntity,
      AssignmentQuestionEntity,
      AssignmentSubmissionEntity,
      SubmissionAnswerEntity,
    ]),
  ],
  controllers: [AssignmentsController, SubmissionsController],
  providers: [AssignmentsService, SubmissionsService],
  exports: [AssignmentsService, SubmissionsService],
})
export class AssignmentsModule {}
```

---

## ✅ Acceptance Criteria

- [ ] All 4 entities created with correct relations
- [ ] Migration creates tables successfully
- [ ] Indexes on frequently queried columns
- [ ] Foreign key constraints work (CASCADE delete)
- [ ] Enums match business requirements
- [ ] Module exports services correctly

---

## 🧪 Test Cases

```typescript
describe('Assignment Entities', () => {
  it('creates assignment with questions', async () => {
    const assignment = await assignmentRepo.save({
      classId: 'class-uuid',
      createdById: 'teacher-uuid',
      title: 'Reading Practice Week 1',
      skill: AssignmentSkill.READING,
      dueDate: new Date('2024-01-30'),
    });

    await assignmentQuestionRepo.save({
      assignmentId: assignment.id,
      questionId: 'question-uuid',
      orderIndex: 1,
      points: 2,
    });

    const loaded = await assignmentRepo.findOne({
      where: { id: assignment.id },
      relations: ['questions'],
    });

    expect(loaded.questions).toHaveLength(1);
  });

  it('cascades delete to questions and submissions', async () => {
    // Delete assignment
    await assignmentRepo.delete(assignmentId);
    
    // Verify questions deleted
    const questions = await assignmentQuestionRepo.find({
      where: { assignmentId },
    });
    expect(questions).toHaveLength(0);
  });

  it('computes isOverdue correctly', () => {
    const assignment = new AssignmentEntity();
    assignment.dueDate = new Date('2024-01-01');
    expect(assignment.isOverdue).toBe(true);
  });
});
```

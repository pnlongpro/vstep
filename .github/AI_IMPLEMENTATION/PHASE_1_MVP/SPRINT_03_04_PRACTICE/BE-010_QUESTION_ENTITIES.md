# BE-010: Question Bank Entities

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-010 |
| **Phase** | 1 - MVP |
| **Sprint** | 3-4 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 8h |
| **Dependencies** | BE-001 |

---

## 🎯 Objective

Tạo TypeORM entities cho Question Bank system:
- Exam Sets và Sections
- Questions với multiple types
- Question Options
- Skill-based categorization
- Level tagging (A2-C1)

---

## 📝 Requirements

### Database Tables

1. **exam_sets**: Bộ đề thi hoàn chỉnh
2. **exam_sections**: Reading/Listening/Writing/Speaking sections
3. **section_passages**: Bài đọc hoặc audio cho mỗi section
4. **questions**: Câu hỏi các loại
5. **question_options**: Đáp án cho câu hỏi trắc nghiệm
6. **question_tags**: Tags cho categorization

---

## 💻 Implementation

### Step 1: Enums

```typescript
// src/shared/enums/exam.enum.ts

export enum VstepLevel {
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
}

export enum Skill {
  READING = 'reading',
  LISTENING = 'listening',
  WRITING = 'writing',
  SPEAKING = 'speaking',
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE_NG = 'true_false_ng',
  MATCHING = 'matching',
  FILL_BLANK = 'fill_blank',
  SHORT_ANSWER = 'short_answer',
  ESSAY = 'essay',
  SPEAKING_TASK = 'speaking_task',
}

export enum ExamSetStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}
```

### Step 2: ExamSet Entity

```typescript
// src/modules/exams/entities/exam-set.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ExamSection } from './exam-section.entity';
import { User } from '@/modules/users/entities/user.entity';
import { VstepLevel, ExamSetStatus } from '@/shared/enums/exam.enum';

@Entity('exam_sets')
export class ExamSet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: VstepLevel })
  level: VstepLevel;

  @Column({ name: 'total_duration', type: 'int', comment: 'Total duration in minutes' })
  totalDuration: number;

  @Column({ name: 'total_questions', type: 'int', default: 0 })
  totalQuestions: number;

  @Column({ type: 'enum', enum: ExamSetStatus, default: ExamSetStatus.DRAFT })
  status: ExamSetStatus;

  @Column({ name: 'is_mock_test', type: 'boolean', default: false })
  isMockTest: boolean;

  @Column({ name: 'is_free', type: 'boolean', default: false })
  isFree: boolean;

  @Column({ name: 'attempt_count', type: 'int', default: 0 })
  attemptCount: number;

  @Column({ name: 'average_score', type: 'decimal', precision: 4, scale: 2, nullable: true })
  averageScore: number;

  @Column({ name: 'thumbnail_url', length: 500, nullable: true })
  thumbnailUrl: string;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdById: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @OneToMany(() => ExamSection, (section) => section.examSet, { cascade: true })
  sections: ExamSection[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### Step 3: ExamSection Entity

```typescript
// src/modules/exams/entities/exam-section.entity.ts
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
import { ExamSet } from './exam-set.entity';
import { SectionPassage } from './section-passage.entity';
import { Skill } from '@/shared/enums/exam.enum';

@Entity('exam_sections')
export class ExamSection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'exam_set_id', type: 'uuid' })
  examSetId: string;

  @ManyToOne(() => ExamSet, (examSet) => examSet.sections, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exam_set_id' })
  examSet: ExamSet;

  @Column({ type: 'enum', enum: Skill })
  skill: Skill;

  @Column({ length: 255, nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @Column({ type: 'int', comment: 'Duration in minutes' })
  duration: number;

  @Column({ name: 'question_count', type: 'int', default: 0 })
  questionCount: number;

  @Column({ name: 'order_index', type: 'int', default: 0 })
  orderIndex: number;

  @OneToMany(() => SectionPassage, (passage) => passage.section, { cascade: true })
  passages: SectionPassage[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### Step 4: SectionPassage Entity

```typescript
// src/modules/exams/entities/section-passage.entity.ts
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
import { ExamSection } from './exam-section.entity';
import { Question } from './question.entity';

@Entity('section_passages')
export class SectionPassage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'section_id', type: 'uuid' })
  sectionId: string;

  @ManyToOne(() => ExamSection, (section) => section.passages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'section_id' })
  section: ExamSection;

  @Column({ length: 255, nullable: true })
  title: string;

  @Column({ type: 'longtext', nullable: true, comment: 'Reading passage text' })
  content: string;

  @Column({ name: 'audio_url', length: 500, nullable: true })
  audioUrl: string;

  @Column({ name: 'audio_duration', type: 'int', nullable: true, comment: 'Duration in seconds' })
  audioDuration: number;

  @Column({ name: 'audio_transcript', type: 'longtext', nullable: true })
  audioTranscript: string;

  @Column({ name: 'image_url', length: 500, nullable: true })
  imageUrl: string;

  @Column({ name: 'order_index', type: 'int', default: 0 })
  orderIndex: number;

  @OneToMany(() => Question, (question) => question.passage, { cascade: true })
  questions: Question[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### Step 5: Question Entity

```typescript
// src/modules/questions/entities/question.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { SectionPassage } from '@/modules/exams/entities/section-passage.entity';
import { QuestionOption } from './question-option.entity';
import { QuestionTag } from './question-tag.entity';
import { QuestionType, VstepLevel, DifficultyLevel, Skill } from '@/shared/enums/exam.enum';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'passage_id', type: 'uuid', nullable: true })
  passageId: string;

  @ManyToOne(() => SectionPassage, (passage) => passage.questions, { 
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'passage_id' })
  passage: SectionPassage;

  @Column({ type: 'enum', enum: QuestionType })
  type: QuestionType;

  @Column({ type: 'enum', enum: Skill })
  skill: Skill;

  @Column({ type: 'enum', enum: VstepLevel })
  level: VstepLevel;

  @Column({ type: 'enum', enum: DifficultyLevel, default: DifficultyLevel.MEDIUM })
  difficulty: DifficultyLevel;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true, comment: 'Additional context or instructions' })
  context: string;

  @Column({ name: 'correct_answer', type: 'text', nullable: true })
  correctAnswer: string;

  @Column({ type: 'text', nullable: true, comment: 'Explanation for the answer' })
  explanation: string;

  @Column({ type: 'int', default: 1 })
  points: number;

  @Column({ name: 'order_index', type: 'int', default: 0 })
  orderIndex: number;

  @Column({ name: 'audio_url', length: 500, nullable: true })
  audioUrl: string;

  @Column({ name: 'image_url', length: 500, nullable: true })
  imageUrl: string;

  @Column({ name: 'word_limit', type: 'int', nullable: true, comment: 'For essay questions' })
  wordLimit: number;

  @Column({ name: 'time_limit', type: 'int', nullable: true, comment: 'Time limit in seconds for speaking' })
  timeLimit: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => QuestionOption, (option) => option.question, { cascade: true })
  options: QuestionOption[];

  @ManyToMany(() => QuestionTag)
  @JoinTable({
    name: 'question_tag_mapping',
    joinColumn: { name: 'question_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: QuestionTag[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### Step 6: QuestionOption Entity

```typescript
// src/modules/questions/entities/question-option.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Question } from './question.entity';

@Entity('question_options')
export class QuestionOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'question_id', type: 'uuid' })
  questionId: string;

  @ManyToOne(() => Question, (question) => question.options, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @Column({ length: 10 })
  label: string; // A, B, C, D or 1, 2, 3...

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'is_correct', type: 'boolean', default: false })
  isCorrect: boolean;

  @Column({ name: 'order_index', type: 'int', default: 0 })
  orderIndex: number;

  @Column({ name: 'image_url', length: 500, nullable: true })
  imageUrl: string;
}
```

### Step 7: QuestionTag Entity

```typescript
// src/modules/questions/entities/question-tag.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('question_tags')
export class QuestionTag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ length: 255, nullable: true })
  description: string;

  @Column({ length: 50, nullable: true, comment: 'Tag category: topic, grammar, etc.' })
  category: string;

  @Column({ length: 7, nullable: true, comment: 'Hex color code' })
  color: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
```

### Step 8: Migration

```typescript
// src/migrations/1704400000000-CreateQuestionBankTables.ts
import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateQuestionBankTables1704400000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // exam_sets table
    await queryRunner.createTable(
      new Table({
        name: 'exam_sets',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'UUID()' },
          { name: 'title', type: 'varchar', length: '255' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'level', type: 'enum', enum: ['A2', 'B1', 'B2', 'C1'] },
          { name: 'total_duration', type: 'int' },
          { name: 'total_questions', type: 'int', default: 0 },
          { name: 'status', type: 'enum', enum: ['draft', 'published', 'archived'], default: "'draft'" },
          { name: 'is_mock_test', type: 'boolean', default: false },
          { name: 'is_free', type: 'boolean', default: false },
          { name: 'attempt_count', type: 'int', default: 0 },
          { name: 'average_score', type: 'decimal', precision: 4, scale: 2, isNullable: true },
          { name: 'thumbnail_url', type: 'varchar', length: '500', isNullable: true },
          { name: 'created_by', type: 'uuid', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true,
    );

    // exam_sections table
    await queryRunner.createTable(
      new Table({
        name: 'exam_sections',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'UUID()' },
          { name: 'exam_set_id', type: 'uuid' },
          { name: 'skill', type: 'enum', enum: ['reading', 'listening', 'writing', 'speaking'] },
          { name: 'title', type: 'varchar', length: '255', isNullable: true },
          { name: 'instructions', type: 'text', isNullable: true },
          { name: 'duration', type: 'int' },
          { name: 'question_count', type: 'int', default: 0 },
          { name: 'order_index', type: 'int', default: 0 },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true,
    );

    // section_passages table
    await queryRunner.createTable(
      new Table({
        name: 'section_passages',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'UUID()' },
          { name: 'section_id', type: 'uuid' },
          { name: 'title', type: 'varchar', length: '255', isNullable: true },
          { name: 'content', type: 'longtext', isNullable: true },
          { name: 'audio_url', type: 'varchar', length: '500', isNullable: true },
          { name: 'audio_duration', type: 'int', isNullable: true },
          { name: 'audio_transcript', type: 'longtext', isNullable: true },
          { name: 'image_url', type: 'varchar', length: '500', isNullable: true },
          { name: 'order_index', type: 'int', default: 0 },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true,
    );

    // question_tags table
    await queryRunner.createTable(
      new Table({
        name: 'question_tags',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'UUID()' },
          { name: 'name', type: 'varchar', length: '100', isUnique: true },
          { name: 'description', type: 'varchar', length: '255', isNullable: true },
          { name: 'category', type: 'varchar', length: '50', isNullable: true },
          { name: 'color', type: 'varchar', length: '7', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true,
    );

    // questions table
    await queryRunner.createTable(
      new Table({
        name: 'questions',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'UUID()' },
          { name: 'passage_id', type: 'uuid', isNullable: true },
          { name: 'type', type: 'enum', enum: ['multiple_choice', 'true_false_ng', 'matching', 'fill_blank', 'short_answer', 'essay', 'speaking_task'] },
          { name: 'skill', type: 'enum', enum: ['reading', 'listening', 'writing', 'speaking'] },
          { name: 'level', type: 'enum', enum: ['A2', 'B1', 'B2', 'C1'] },
          { name: 'difficulty', type: 'enum', enum: ['easy', 'medium', 'hard'], default: "'medium'" },
          { name: 'content', type: 'text' },
          { name: 'context', type: 'text', isNullable: true },
          { name: 'correct_answer', type: 'text', isNullable: true },
          { name: 'explanation', type: 'text', isNullable: true },
          { name: 'points', type: 'int', default: 1 },
          { name: 'order_index', type: 'int', default: 0 },
          { name: 'audio_url', type: 'varchar', length: '500', isNullable: true },
          { name: 'image_url', type: 'varchar', length: '500', isNullable: true },
          { name: 'word_limit', type: 'int', isNullable: true },
          { name: 'time_limit', type: 'int', isNullable: true },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true,
    );

    // question_options table
    await queryRunner.createTable(
      new Table({
        name: 'question_options',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'UUID()' },
          { name: 'question_id', type: 'uuid' },
          { name: 'label', type: 'varchar', length: '10' },
          { name: 'content', type: 'text' },
          { name: 'is_correct', type: 'boolean', default: false },
          { name: 'order_index', type: 'int', default: 0 },
          { name: 'image_url', type: 'varchar', length: '500', isNullable: true },
        ],
      }),
      true,
    );

    // question_tag_mapping table
    await queryRunner.createTable(
      new Table({
        name: 'question_tag_mapping',
        columns: [
          { name: 'question_id', type: 'uuid' },
          { name: 'tag_id', type: 'uuid' },
        ],
      }),
      true,
    );

    await queryRunner.createPrimaryKey('question_tag_mapping', ['question_id', 'tag_id']);

    // Foreign keys
    await queryRunner.createForeignKey('exam_sections', new TableForeignKey({
      columnNames: ['exam_set_id'],
      referencedTableName: 'exam_sets',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE',
    }));

    await queryRunner.createForeignKey('section_passages', new TableForeignKey({
      columnNames: ['section_id'],
      referencedTableName: 'exam_sections',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE',
    }));

    await queryRunner.createForeignKey('questions', new TableForeignKey({
      columnNames: ['passage_id'],
      referencedTableName: 'section_passages',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE',
    }));

    await queryRunner.createForeignKey('question_options', new TableForeignKey({
      columnNames: ['question_id'],
      referencedTableName: 'questions',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE',
    }));

    // Indexes
    await queryRunner.createIndex('exam_sets', new TableIndex({ columnNames: ['level', 'status'] }));
    await queryRunner.createIndex('questions', new TableIndex({ columnNames: ['skill', 'level', 'type'] }));
    await queryRunner.createIndex('questions', new TableIndex({ columnNames: ['is_active'] }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('question_tag_mapping');
    await queryRunner.dropTable('question_options');
    await queryRunner.dropTable('questions');
    await queryRunner.dropTable('question_tags');
    await queryRunner.dropTable('section_passages');
    await queryRunner.dropTable('exam_sections');
    await queryRunner.dropTable('exam_sets');
  }
}
```

### Step 9: Module Registration

```typescript
// src/modules/questions/questions.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { QuestionOption } from './entities/question-option.entity';
import { QuestionTag } from './entities/question-tag.entity';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, QuestionOption, QuestionTag]),
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsService, TypeOrmModule],
})
export class QuestionsModule {}
```

---

## ✅ Acceptance Criteria

- [ ] All entities created with correct relations
- [ ] Migration runs without errors
- [ ] Foreign keys properly configured
- [ ] Indexes created for common queries
- [ ] Enums defined for type safety
- [ ] Entities exported from modules

---

## 🧪 Testing

```bash
# Run migration
npm run migration:run

# Verify tables created
npm run typeorm schema:log
```

---

## ⏭️ Next Task

→ `BE-011_PRACTICE_SESSION.md` - Practice Session Service

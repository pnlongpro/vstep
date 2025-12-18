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
import { SectionPassage } from '../../exams/entities/section-passage.entity';
import { QuestionOption } from './question-option.entity';
import { QuestionTag } from './question-tag.entity';
import { QuestionType, VstepLevel, DifficultyLevel, Skill } from '../../../shared/enums/exam.enum';

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

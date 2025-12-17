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
import { User } from '../../users/entities/user.entity';
import { ExamSection } from '../../exams/entities/exam-section.entity';
import { PracticeAnswer } from './practice-answer.entity';
import { Skill, VstepLevel } from '../../../shared/enums/exam.enum';
import { PracticeMode, SessionStatus } from '../../../shared/enums/practice.enum';

@Entity('practice_sessions')
export class PracticeSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'section_id', type: 'uuid', nullable: true })
  sectionId: string;

  @ManyToOne(() => ExamSection, { nullable: true })
  @JoinColumn({ name: 'section_id' })
  section: ExamSection;

  @Column({ type: 'enum', enum: Skill })
  skill: Skill;

  @Column({ type: 'enum', enum: VstepLevel })
  level: VstepLevel;

  @Column({ type: 'enum', enum: PracticeMode, default: PracticeMode.PRACTICE })
  mode: PracticeMode;

  @Column({ type: 'enum', enum: SessionStatus, default: SessionStatus.IN_PROGRESS })
  status: SessionStatus;

  @Column({ name: 'total_questions', type: 'int', default: 0 })
  totalQuestions: number;

  @Column({ name: 'answered_count', type: 'int', default: 0 })
  answeredCount: number;

  @Column({ name: 'correct_count', type: 'int', default: 0 })
  correctCount: number;

  @Column({ name: 'current_question_index', type: 'int', default: 0 })
  currentQuestionIndex: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  score: number;

  @Column({ name: 'max_score', type: 'decimal', precision: 5, scale: 2, nullable: true })
  maxScore: number;

  @Column({ name: 'time_limit', type: 'int', nullable: true, comment: 'Time limit in seconds' })
  timeLimit: number;

  @Column({ name: 'time_spent', type: 'int', default: 0, comment: 'Time spent in seconds' })
  timeSpent: number;

  @Column({ name: 'started_at', type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ name: 'paused_at', type: 'timestamp', nullable: true })
  pausedAt: Date;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt: Date;

  @Column({ type: 'json', nullable: true, comment: 'Question IDs in order' })
  questionOrder: string[];

  @Column({ type: 'json', nullable: true, comment: 'Additional settings' })
  settings: Record<string, unknown>;

  @OneToMany(() => PracticeAnswer, (answer) => answer.session, { cascade: true })
  answers: PracticeAnswer[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

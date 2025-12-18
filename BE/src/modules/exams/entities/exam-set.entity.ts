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
import { User } from '../../users/entities/user.entity';
import { VstepLevel, ExamSetStatus } from '../../../shared/enums/exam.enum';

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

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

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

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClassAssignment } from './class-assignment.entity';
import { User } from '../../users/entities/user.entity';

export enum SubmissionStatus {
  PENDING = 'pending',
  GRADING = 'grading',
  GRADED = 'graded',
}

@Entity('class_assignment_submissions')
export class ClassAssignmentSubmission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'assignment_id' })
  assignmentId: string;

  @ManyToOne(() => ClassAssignment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assignment_id' })
  assignment: ClassAssignment;

  @Column({ name: 'student_id' })
  studentId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: User;

  @Column({ type: 'enum', enum: SubmissionStatus, default: SubmissionStatus.PENDING })
  status: SubmissionStatus;

  @Column({ name: 'submitted_at', type: 'datetime', nullable: true })
  submittedAt: Date;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ name: 'file_url', length: 500, nullable: true })
  fileUrl: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  score: number;

  @Column({ type: 'text', nullable: true })
  feedback: string;

  @Column({ name: 'grader_id', nullable: true })
  graderId: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'grader_id' })
  grader: User;

  @Column({ name: 'graded_at', type: 'datetime', nullable: true })
  gradedAt: Date;

  @Column({ name: 'word_count', nullable: true })
  wordCount: number;

  @Column({ name: 'duration', length: 20, nullable: true })
  duration: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

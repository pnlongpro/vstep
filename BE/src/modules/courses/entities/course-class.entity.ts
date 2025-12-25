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
import { Course } from './course.entity';

export enum CourseClassStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('course_classes')
@Index(['courseId', 'status'])
export class CourseClass {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'course_id' })
  courseId: string;

  @ManyToOne(() => Course, (course) => course.classes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, nullable: true })
  instructor: string | null;

  @Column({ default: 0 })
  students: number;

  @Column({ name: 'max_students', type: 'int' })
  maxStudents: number;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: Date | null;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date | null;

  @Column({ type: 'enum', enum: CourseClassStatus, default: CourseClassStatus.ACTIVE })
  status: CourseClassStatus;

  @Column({ type: 'text', nullable: true })
  schedule: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

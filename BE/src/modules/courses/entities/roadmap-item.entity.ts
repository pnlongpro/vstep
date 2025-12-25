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

export enum RoadmapStatus {
  LOCKED = 'locked',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
}

@Entity('roadmap_items')
@Index(['courseId', 'orderIndex'])
export class RoadmapItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'course_id' })
  courseId: string;

  @ManyToOne(() => Course, (course) => course.roadmapItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({ type: 'int' })
  week: number;

  @Column({ length: 255 })
  title: string;

  @Column({ default: 0 })
  lessons: number;

  @Column({ length: 50, nullable: true })
  duration: string | null;

  @Column({ type: 'enum', enum: RoadmapStatus, default: RoadmapStatus.LOCKED })
  status: RoadmapStatus;

  @Column({ name: 'order_index', type: 'int' })
  orderIndex: number;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

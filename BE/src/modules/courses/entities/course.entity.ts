import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Document } from './document.entity';
import { RoadmapItem } from './roadmap-item.entity';
import { CourseClass } from './course-class.entity';
import { User } from '../../users/entities/user.entity';

export enum CourseStatus {
  ACTIVE = 'active',
  DRAFT = 'draft',
  INACTIVE = 'inactive',
}

@Entity('courses')
@Index(['status', 'createdAt'])
@Index(['category'])
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 100 })
  category: string;

  @Column({ name: 'instructor_id', nullable: true })
  instructorId: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'instructor_id' })
  instructor: User | null;

  @Column({ default: 0 })
  lessons: number;

  @Column({ length: 50, nullable: true })
  duration: string | null;

  @Column({ length: 50, nullable: true })
  price: string | null;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 0 })
  rating: number;

  @Column({ default: 0 })
  reviews: number;

  @Column({ type: 'enum', enum: CourseStatus, default: CourseStatus.DRAFT })
  status: CourseStatus;

  @Column({ name: 'device_limit', default: 2 })
  deviceLimit: number;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Document, (doc) => doc.course)
  documents: Document[];

  @OneToMany(() => RoadmapItem, (item) => item.course)
  roadmapItems: RoadmapItem[];

  @OneToMany(() => CourseClass, (courseClass) => courseClass.course)
  classes: CourseClass[];

  // Virtual field - computed from classes
  students?: number;
}

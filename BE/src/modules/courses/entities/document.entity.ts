import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Course } from './course.entity';
import { User } from '../../users/entities/user.entity';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'course_id' })
  courseId: string;

  @ManyToOne(() => Course, (course) => course.documents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 50 })
  type: string;

  @Column({ length: 50, nullable: true })
  size: string;

  @Column({ length: 500, nullable: true })
  url: string;

  @Column({ default: 0 })
  downloads: number;

  @Column({ name: 'upload_date', type: 'date', nullable: true })
  uploadDate: Date | null;

  @Column({ name: 'uploaded_by', nullable: true })
  uploadedById: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'uploaded_by' })
  uploadedBy: User | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

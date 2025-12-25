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
import { User } from '../../users/entities/user.entity';
import { Media } from '../../media/entities/media.entity';

export enum DocumentStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PUBLISHED = 'published',
  REJECTED = 'rejected',
}

export enum DocumentVisibility {
  PUBLIC = 'public',
  STUDENT = 'student',
  TEACHER = 'teacher',
}

export enum DocumentCategory {
  READING = 'reading',
  LISTENING = 'listening',
  WRITING = 'writing',
  SPEAKING = 'speaking',
  GRAMMAR = 'grammar',
  VOCABULARY = 'vocabulary',
  TIPS = 'tips',
  EXAMS = 'exams',
  GENERAL = 'general',
}

export enum DocumentType {
  PDF = 'pdf',
  DOC = 'doc',
  DOCX = 'docx',
  PPT = 'ppt',
  PPTX = 'pptx',
  VIDEO = 'video',
  AUDIO = 'audio',
  QUIZ = 'quiz',
}

/**
 * Study Material Entity
 * System-wide learning materials for VSTEP practice
 * Accessible by all students based on visibility settings
 */
@Entity('study_materials')
export class StudyMaterial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Index()
  @Column({
    type: 'enum',
    enum: DocumentCategory,
    default: DocumentCategory.GENERAL,
  })
  category: DocumentCategory;

  @Column({ length: 10, nullable: true })
  level: string; // A2, B1, B2, C1

  @Column({
    type: 'enum',
    enum: DocumentType,
    default: DocumentType.PDF,
  })
  type: DocumentType;

  @Column({ length: 50, nullable: true })
  size: string; // e.g., "2.5 MB"

  @Column({ type: 'bigint', nullable: true, name: 'size_bytes' })
  sizeBytes: number;

  @Column({ length: 500, nullable: true })
  url: string;

  @Column({ length: 255, nullable: true, name: 'file_name' })
  fileName: string;

  @Column({ length: 100, nullable: true, name: 'mime_type' })
  mimeType: string;

  @Column({ type: 'int', nullable: true })
  pages: number; // For PDF

  @Column({ length: 20, nullable: true })
  duration: string; // For video/audio "15:30"

  @Column({ length: 500, nullable: true })
  thumbnail: string;

  @Column('simple-array', { nullable: true })
  tags: string[];

  // Media relation
  @Column({ name: 'media_id', nullable: true })
  mediaId: string;

  @ManyToOne(() => Media, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'media_id' })
  media: Media;

  @Index()
  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.DRAFT,
  })
  status: DocumentStatus;

  @Column({
    type: 'enum',
    enum: DocumentVisibility,
    default: DocumentVisibility.PUBLIC,
  })
  visibility: DocumentVisibility;

  @Column({ default: 0 })
  downloads: number;

  @Column({ default: 0 })
  views: number;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  rating: number;

  @Column({ name: 'rating_count', default: 0 })
  ratingCount: number;

  @Column({ length: 255, nullable: true })
  author: string;

  @Column({ name: 'uploaded_by_id', nullable: true })
  uploadedById: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'uploaded_by_id' })
  uploadedBy: User;

  @Column({ name: 'approved_by_id', nullable: true })
  approvedById: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'approved_by_id' })
  approvedBy: User;

  @Column({ type: 'timestamp', nullable: true, name: 'approved_at' })
  approvedAt: Date;

  @Column({ type: 'text', nullable: true, name: 'rejection_reason' })
  rejectionReason: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

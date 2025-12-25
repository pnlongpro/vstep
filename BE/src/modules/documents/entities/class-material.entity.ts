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
import { DocumentStatus } from './study-material.entity';

export enum ClassMaterialCategory {
  TEXTBOOK = 'textbook',
  MEDIA = 'media',
}

export enum ClassMaterialType {
  PDF = 'pdf',
  DOCX = 'docx',
  PPTX = 'pptx',
  XLSX = 'xlsx',
  VIDEO = 'video',
  AUDIO = 'audio',
}

export enum CourseType {
  VSTEP_COMPLETE = 'VSTEP Complete',
  VSTEP_FOUNDATION = 'VSTEP Foundation',
  VSTEP_STARTER = 'VSTEP Starter',
  VSTEP_BUILDER = 'VSTEP Builder',
  VSTEP_DEVELOPER = 'VSTEP Developer',
  VSTEP_BOOSTER = 'VSTEP Booster',
  VSTEP_INTENSIVE = 'VSTEP Intensive',
  VSTEP_PRACTICE = 'VSTEP Practice',
  VSTEP_PREMIUM = 'VSTEP Premium',
  VSTEP_MASTER = 'VSTEP Master',
}

export enum SkillType {
  READING = 'Reading',
  LISTENING = 'Listening',
  WRITING = 'Writing',
  SPEAKING = 'Speaking',
}

/**
 * Class Material Entity
 * Course-specific materials (textbooks, media)
 * Organized by course and unit
 */
@Entity('class_materials_v2')
export class ClassMaterialV2 {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Index()
  @Column({ length: 100 })
  course: string; // VSTEP Complete, Foundation, etc.

  @Column({ length: 50, nullable: true })
  unit: string; // Unit 1, Unit 2, etc.

  @Column({ length: 50, nullable: true })
  skill: string; // Reading, Listening, Writing, Speaking

  @Index()
  @Column({
    type: 'enum',
    enum: ClassMaterialCategory,
    default: ClassMaterialCategory.TEXTBOOK,
  })
  category: ClassMaterialCategory;

  @Column({
    type: 'enum',
    enum: ClassMaterialType,
    default: ClassMaterialType.PDF,
  })
  type: ClassMaterialType;

  @Column({ length: 50, nullable: true })
  size: string;

  @Column({ type: 'bigint', nullable: true, name: 'size_bytes' })
  sizeBytes: number;

  @Column({ length: 20, nullable: true })
  duration: string; // For video/audio

  @Column({ length: 500, nullable: true })
  url: string;

  @Column({ length: 255, nullable: true, name: 'file_name' })
  fileName: string;

  @Column({ length: 100, nullable: true, name: 'mime_type' })
  mimeType: string;

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

  @Column({ default: 0 })
  downloads: number;

  @Column({ default: 0 })
  views: number;

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

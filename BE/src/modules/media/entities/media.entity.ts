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

export enum MediaCategory {
  DOCUMENT = 'document',
  AUDIO = 'audio',
  VIDEO = 'video',
  IMAGE = 'image',
}

export enum MediaStatus {
  ACTIVE = 'active',
  ORPHANED = 'orphaned', // No references, can be cleaned up
  DELETED = 'deleted',
}

/**
 * Media Entity
 * Centralized file storage management for all uploaded files
 * Supports: documents (PDF, DOC, PPT), audio, video, images
 */
@Entity('media')
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'original_name', length: 255 })
  originalName: string;

  @Column({ name: 'stored_name', length: 255, unique: true })
  storedName: string;

  @Column({ length: 500 })
  path: string;

  @Column({ length: 500 })
  url: string;

  @Column({ name: 'mime_type', length: 100 })
  mimeType: string;

  @Column({ type: 'bigint' })
  size: number;

  @Column({ name: 'size_human', length: 50, nullable: true })
  sizeHuman: string;

  @Index()
  @Column({
    type: 'enum',
    enum: MediaCategory,
    default: MediaCategory.DOCUMENT,
  })
  category: MediaCategory;

  @Index()
  @Column({
    type: 'enum',
    enum: MediaStatus,
    default: MediaStatus.ACTIVE,
  })
  status: MediaStatus;

  @Column({ name: 'reference_count', default: 0 })
  referenceCount: number;

  @Column({ name: 'uploaded_by_id', nullable: true })
  uploadedById: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'uploaded_by_id' })
  uploadedBy: User;

  @Column({ type: 'int', nullable: true })
  width: number;

  @Column({ type: 'int', nullable: true })
  height: number;

  @Column({ type: 'int', nullable: true })
  duration: number;

  @Column({ length: 64, nullable: true })
  checksum: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

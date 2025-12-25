import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { StudyMaterial } from './study-material.entity';
import { ClassMaterialV2 } from './class-material.entity';

/**
 * Document Rating Entity
 * Tracks user ratings for study materials
 */
@Entity('document_ratings')
export class DocumentRating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'document_id', nullable: true })
  documentId: string;

  @ManyToOne(() => StudyMaterial, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'document_id' })
  document: StudyMaterial;

  @Column({ type: 'tinyint' })
  rating: number; // 1-5

  @Column({ type: 'text', nullable: true })
  review: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

/**
 * Document Bookmark Entity
 * User's favorite/bookmarked documents
 */
@Entity('document_bookmarks')
export class DocumentBookmark {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'document_id', nullable: true })
  documentId: string;

  @ManyToOne(() => StudyMaterial, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'document_id' })
  document: StudyMaterial;

  @Column({ name: 'material_id', nullable: true })
  materialId: string;

  @ManyToOne(() => ClassMaterialV2, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'material_id' })
  material: ClassMaterialV2;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

/**
 * Document View History
 * Tracks document views for analytics
 */
@Entity('document_views')
export class DocumentView {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'document_id', nullable: true })
  documentId: string;

  @Column({ name: 'material_id', nullable: true })
  materialId: string;

  @Column({ name: 'document_type', length: 20 })
  documentType: 'study' | 'class';

  @Column({ length: 50, nullable: true, name: 'ip_address' })
  ipAddress: string;

  @Column({ type: 'text', nullable: true, name: 'user_agent' })
  userAgent: string;

  @CreateDateColumn({ name: 'viewed_at' })
  viewedAt: Date;
}

/**
 * Document Download History
 * Tracks document downloads
 */
@Entity('document_downloads')
export class DocumentDownload {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'document_id', nullable: true })
  documentId: string;

  @Column({ name: 'material_id', nullable: true })
  materialId: string;

  @Column({ name: 'document_type', length: 20 })
  documentType: 'study' | 'class';

  @Column({ length: 50, nullable: true, name: 'ip_address' })
  ipAddress: string;

  @CreateDateColumn({ name: 'downloaded_at' })
  downloadedAt: Date;
}

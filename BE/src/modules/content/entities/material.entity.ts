import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('materials')
export class Material {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50 })
  file_type: string; // pdf, doc, ppt, video, audio

  @Column({ type: 'varchar', length: 500 })
  file_url: string;

  @Column({ type: 'bigint', nullable: true, comment: 'in bytes' })
  file_size: number;

  @Column({ type: 'uuid', nullable: true })
  folder_id: string;

  @Column({ type: 'uuid' })
  uploaded_by: string;

  @Column({ type: 'varchar', length: 5, nullable: true })
  level: string;

  @Column({ type: 'jsonb', nullable: true })
  tags: string[];

  @Column({ type: 'integer', default: 0 })
  download_count: number;

  @Column({ type: 'boolean', default: true })
  is_public: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploaded_by' })
  uploader: User;
}

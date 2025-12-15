import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CourseModule } from './course-module.entity';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  module_id: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'integer' })
  order_number: number;

  @Column({ type: 'varchar', length: 20 })
  content_type: string; // video, text, quiz, exercise

  @Column({ type: 'varchar', length: 500, nullable: true })
  video_url: string;

  @Column({ type: 'integer', nullable: true, comment: 'in seconds' })
  video_duration: number;

  @Column({ type: 'text', nullable: true })
  text_content: string;

  @Column({ type: 'jsonb', nullable: true })
  questions: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  attachments: Record<string, any>[];

  @Column({ type: 'boolean', default: false })
  is_preview: boolean;

  @Column({ type: 'boolean', default: true })
  is_required: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => CourseModule, module => module.lessons)
  @JoinColumn({ name: 'module_id' })
  module: CourseModule;
}

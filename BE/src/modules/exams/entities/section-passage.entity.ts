import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ExamSection } from './exam-section.entity';
import { Question } from '../../questions/entities/question.entity';

@Entity('section_passages')
export class SectionPassage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'section_id', type: 'uuid' })
  sectionId: string;

  @ManyToOne(() => ExamSection, (section) => section.passages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'section_id' })
  section: ExamSection;

  @Column({ length: 255, nullable: true })
  title: string;

  @Column({ type: 'longtext', nullable: true, comment: 'Reading passage text' })
  content: string;

  @Column({ name: 'audio_url', length: 500, nullable: true })
  audioUrl: string;

  @Column({ name: 'audio_duration', type: 'int', nullable: true, comment: 'Duration in seconds' })
  audioDuration: number;

  @Column({ name: 'audio_transcript', type: 'longtext', nullable: true })
  audioTranscript: string;

  @Column({ name: 'image_url', length: 500, nullable: true })
  imageUrl: string;

  @Column({ name: 'order_index', type: 'int', default: 0 })
  orderIndex: number;

  @OneToMany(() => Question, (question) => question.passage, { cascade: true })
  questions: Question[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

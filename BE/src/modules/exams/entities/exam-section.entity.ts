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
import { ExamSet } from './exam-set.entity';
import { SectionPassage } from './section-passage.entity';
import { Skill } from '../../../shared/enums/exam.enum';

@Entity('exam_sections')
export class ExamSection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'exam_set_id', type: 'uuid' })
  examSetId: string;

  @ManyToOne(() => ExamSet, (examSet) => examSet.sections, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exam_set_id' })
  examSet: ExamSet;

  @Column({ type: 'enum', enum: Skill })
  skill: Skill;

  @Column({ length: 255, nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @Column({ type: 'int', comment: 'Duration in minutes' })
  duration: number;

  @Column({ name: 'question_count', type: 'int', default: 0 })
  questionCount: number;

  @Column({ name: 'order_index', type: 'int', default: 0 })
  orderIndex: number;

  @OneToMany(() => SectionPassage, (passage) => passage.section, { cascade: true })
  passages: SectionPassage[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

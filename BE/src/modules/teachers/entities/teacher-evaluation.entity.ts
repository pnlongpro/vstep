import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('teacher_evaluations')
export class TeacherEvaluation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  teacher_id: string;

  @Column({ type: 'uuid' })
  evaluator_id: string;

  @Column({ type: 'varchar', length: 20 })
  evaluation_type: string; // quarterly, annual, performance

  @Column({ type: 'date' })
  evaluation_date: Date;

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  overall_score: number;

  @Column({ type: 'jsonb', nullable: true })
  criteria_scores: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  strengths: string;

  @Column({ type: 'text', nullable: true })
  areas_for_improvement: string;

  @Column({ type: 'text', nullable: true })
  action_plan: string;

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status: string; // draft, submitted, reviewed

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'evaluator_id' })
  evaluator: User;
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { LearningRoadmap } from './learning-roadmap.entity';

export enum MilestoneStatus {
  LOCKED = 'locked',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

@Entity('roadmap_milestones')
@Index(['roadmapId', 'order'])
export class RoadmapMilestone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'roadmap_id' })
  roadmapId: string;

  @ManyToOne(() => LearningRoadmap, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roadmap_id' })
  roadmap: LearningRoadmap;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 50 })
  skill: string;

  @Column({ name: 'target_score', type: 'decimal', precision: 4, scale: 2 })
  targetScore: number;

  @Column({ name: 'current_score', type: 'decimal', precision: 4, scale: 2, default: 0 })
  currentScore: number;

  @Column({ default: 0 })
  order: number;

  @Column({ type: 'enum', enum: MilestoneStatus, default: MilestoneStatus.LOCKED })
  status: MilestoneStatus;

  @Column({ name: 'completed_at', nullable: true })
  completedAt: Date;

  @Column({ name: 'xp_reward', default: 100 })
  xpReward: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

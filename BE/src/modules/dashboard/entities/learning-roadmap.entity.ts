import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum VstepLevel {
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
}

export enum RoadmapStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  PAUSED = 'paused',
}

@Entity('learning_roadmaps')
export class LearningRoadmap {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', unique: true })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'current_level', type: 'enum', enum: VstepLevel, default: VstepLevel.A2 })
  currentLevel: VstepLevel;

  @Column({ name: 'target_level', type: 'enum', enum: VstepLevel, default: VstepLevel.B1 })
  targetLevel: VstepLevel;

  @Column({ name: 'target_date', type: 'date', nullable: true })
  targetDate: Date;

  @Column({ name: 'daily_goal_minutes', default: 30 })
  dailyGoalMinutes: number;

  @Column({ name: 'weekly_goal_tests', default: 3 })
  weeklyGoalTests: number;

  @Column({ name: 'focus_skills', type: 'json', nullable: true })
  focusSkills: string[];

  @Column({ type: 'enum', enum: RoadmapStatus, default: RoadmapStatus.ACTIVE })
  status: RoadmapStatus;

  @Column({ name: 'estimated_weeks', nullable: true })
  estimatedWeeks: number;

  @Column({ name: 'progress_percent', default: 0 })
  progressPercent: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_stats')
export class UserStats {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 36, unique: true })
  userId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalHours: number;

  @Column({ type: 'int', default: 0 })
  testsCompleted: number;

  @Column({ type: 'int', default: 0 })
  currentStreak: number;

  @Column({ type: 'int', default: 0 })
  longestStreak: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  averageScore: number;

  @Column({ type: 'int', default: 0 })
  xp: number;

  @Column({ type: 'int', default: 1 })
  level: number;

  @Column({ type: 'int', default: 0 })
  readingScore: number;

  @Column({ type: 'int', default: 0 })
  listeningScore: number;

  @Column({ type: 'int', default: 0 })
  writingScore: number;

  @Column({ type: 'int', default: 0 })
  speakingScore: number;

  @Column({ type: 'date', nullable: true })
  lastStudyDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => User, (user) => user.stats)
  @JoinColumn({ name: 'userId' })
  user: User;
}

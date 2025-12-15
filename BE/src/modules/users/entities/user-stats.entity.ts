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
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.stats)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'int', default: 0, name: 'total_hours' })
  totalHours: number;

  @Column({ type: 'int', default: 0, name: 'tests_completed' })
  testsCompleted: number;

  @Column({ type: 'int', default: 0, name: 'current_streak' })
  currentStreak: number;

  @Column({ type: 'int', default: 0, name: 'longest_streak' })
  longestStreak: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true, name: 'average_score' })
  averageScore: number;

  @Column({ type: 'int', default: 0 })
  xp: number;

  @Column({ type: 'int', default: 1 })
  level: number;

  // Practice-specific stats
  @Column({ type: 'int', default: 0, name: 'practice_reading_count' })
  practiceReadingCount: number;

  @Column({ type: 'int', default: 0, name: 'practice_listening_count' })
  practiceListeningCount: number;

  @Column({ type: 'int', default: 0, name: 'practice_writing_count' })
  practiceWritingCount: number;

  @Column({ type: 'int', default: 0, name: 'practice_speaking_count' })
  practiceSpeakingCount: number;

  // Time spent per skill (minutes)
  @Column({ type: 'int', default: 0, name: 'time_reading' })
  timeReading: number;

  @Column({ type: 'int', default: 0, name: 'time_listening' })
  timeListening: number;

  @Column({ type: 'int', default: 0, name: 'time_writing' })
  timeWriting: number;

  @Column({ type: 'int', default: 0, name: 'time_speaking' })
  timeSpeaking: number;

  // Average scores per skill
  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true, name: 'avg_reading_score' })
  avgReadingScore: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true, name: 'avg_listening_score' })
  avgListeningScore: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true, name: 'avg_writing_score' })
  avgWritingScore: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true, name: 'avg_speaking_score' })
  avgSpeakingScore: number;

  @Column({ type: 'date', nullable: true, name: 'last_practice_date' })
  lastPracticeDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

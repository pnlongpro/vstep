import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('user_daily_stats')
@Unique(['userId', 'date'])
export class UserDailyStats {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'date' })
  date: Date;

  @Column({ name: 'study_minutes', default: 0 })
  studyMinutes: number;

  @Column({ name: 'practice_count', default: 0 })
  practiceCount: number;

  @Column({ name: 'exam_count', default: 0 })
  examCount: number;

  @Column({ name: 'questions_answered', default: 0 })
  questionsAnswered: number;

  @Column({ name: 'correct_answers', default: 0 })
  correctAnswers: number;

  @Column({ name: 'xp_earned', default: 0 })
  xpEarned: number;

  @Column({ name: 'reading_score', type: 'decimal', precision: 4, scale: 2, nullable: true })
  readingScore: number;

  @Column({ name: 'listening_score', type: 'decimal', precision: 4, scale: 2, nullable: true })
  listeningScore: number;

  @Column({ name: 'writing_score', type: 'decimal', precision: 4, scale: 2, nullable: true })
  writingScore: number;

  @Column({ name: 'speaking_score', type: 'decimal', precision: 4, scale: 2, nullable: true })
  speakingScore: number;

  @Column({ name: 'has_activity', default: false })
  hasActivity: boolean;
}

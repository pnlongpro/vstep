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

@Entity('user_settings')
export class UserSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 36, unique: true })
  userId: string;

  // Notification Settings
  @Column({ default: true })
  emailNotifications: boolean;

  @Column({ default: true })
  pushNotifications: boolean;

  @Column({ default: true })
  studyReminders: boolean;

  @Column({ default: true })
  weeklyReport: boolean;

  @Column({ default: true })
  achievementAlerts: boolean;

  // Privacy Settings
  @Column({ default: true })
  profilePublic: boolean;

  @Column({ default: true })
  showProgress: boolean;

  @Column({ default: true })
  showOnLeaderboard: boolean;

  // Study Preferences
  @Column({ type: 'int', default: 30 })
  dailyGoalMinutes: number;

  @Column({ default: false })
  autoPlayAudio: boolean;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 1.0 })
  playbackSpeed: number;

  @Column({ length: 10, default: 'vi' })
  language: string;

  @Column({ length: 20, default: 'system' })
  theme: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => User, (user) => user.settings)
  @JoinColumn({ name: 'userId' })
  user: User;
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum EmailFrequency {
  INSTANT = 'instant',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  NEVER = 'never',
}

@Entity('notification_preferences')
export class NotificationPreference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', unique: true })
  userId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Email preferences
  @Column({ name: 'email_assignments', default: true })
  emailAssignments: boolean;

  @Column({ name: 'email_classes', default: true })
  emailClasses: boolean;

  @Column({ name: 'email_exams', default: true })
  emailExams: boolean;

  @Column({ name: 'email_system', default: true })
  emailSystem: boolean;

  @Column({ name: 'email_marketing', default: false })
  emailMarketing: boolean;

  @Column({
    name: 'email_frequency',
    type: 'enum',
    enum: EmailFrequency,
    default: EmailFrequency.INSTANT,
  })
  emailFrequency: EmailFrequency;

  // In-app preferences
  @Column({ name: 'inapp_enabled', default: true })
  inappEnabled: boolean;

  @Column({ name: 'inapp_sound', default: true })
  inappSound: boolean;

  @Column({ name: 'desktop_notifications', default: false })
  desktopNotifications: boolean;

  @Column({ name: 'show_badge_count', default: true })
  showBadgeCount: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

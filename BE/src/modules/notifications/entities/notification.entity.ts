import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum NotificationType {
  // Assignment notifications
  ASSIGNMENT_NEW = 'assignment_new',
  ASSIGNMENT_DUE_SOON = 'assignment_due_soon',
  ASSIGNMENT_OVERDUE = 'assignment_overdue',
  ASSIGNMENT_GRADED = 'assignment_graded',
  ASSIGNMENT_SUBMITTED = 'assignment_submitted',

  // Class notifications
  CLASS_JOINED = 'class_joined',
  CLASS_ADDED = 'class_added',
  CLASS_NEW_MATERIAL = 'class_new_material',
  CLASS_CANCELED = 'class_canceled',
  CLASS_ANNOUNCEMENT = 'class_announcement',
  STUDENT_JOINED = 'student_joined',
  STUDENT_LEFT = 'student_left',

  // Exam notifications
  EXAM_READY = 'exam_ready',
  EXAM_RESULT = 'exam_result',
  CERTIFICATE_AVAILABLE = 'certificate_available',

  // System notifications
  SYSTEM_WELCOME = 'system_welcome',
  SYSTEM_EMAIL_VERIFIED = 'system_email_verified',
  SYSTEM_PASSWORD_CHANGED = 'system_password_changed',
  SYSTEM_ACCOUNT_SUSPENDED = 'system_account_suspended',
  SYSTEM_PREMIUM_EXPIRES = 'system_premium_expires',
  SYSTEM_ANNOUNCEMENT = 'system_announcement',

  // Achievement notifications
  BADGE_UNLOCKED = 'badge_unlocked',
  GOAL_ACHIEVED = 'goal_achieved',
  STREAK_MILESTONE = 'streak_milestone',
  XP_EARNED = 'xp_earned',
  LEVEL_UP = 'level_up',
}

export enum ActionType {
  NAVIGATE = 'navigate',
  MODAL = 'modal',
  EXTERNAL = 'external',
}

export enum RelatedEntityType {
  ASSIGNMENT = 'assignment',
  CLASS = 'class',
  EXAM = 'exam',
  BADGE = 'badge',
  GOAL = 'goal',
  USER = 'user',
  MATERIAL = 'material',
}

@Entity('notifications')
@Index(['userId', 'isRead'])
@Index(['userId', 'createdAt'])
@Index(['type'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  @Index()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Content
  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ length: 50, nullable: true })
  icon: string;

  // Link/Action
  @Column({ name: 'action_url', length: 500, nullable: true })
  actionUrl: string;

  @Column({
    name: 'action_type',
    type: 'enum',
    enum: ActionType,
    default: ActionType.NAVIGATE,
  })
  actionType: ActionType;

  // Related entities
  @Column({
    name: 'related_entity_type',
    type: 'enum',
    enum: RelatedEntityType,
    nullable: true,
  })
  relatedEntityType: RelatedEntityType;

  @Column({ name: 'related_entity_id', type: 'uuid', nullable: true })
  relatedEntityId: string;

  // Status
  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  @Column({ name: 'read_at', type: 'timestamp', nullable: true })
  readAt: Date;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  // Channels
  @Column({ name: 'sent_in_app', default: true })
  sentInApp: boolean;

  @Column({ name: 'sent_email', default: false })
  sentEmail: boolean;

  @Column({ name: 'email_sent_at', type: 'timestamp', nullable: true })
  emailSentAt: Date;

  // Metadata (for extra data)
  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  @Index()
  createdAt: Date;
}

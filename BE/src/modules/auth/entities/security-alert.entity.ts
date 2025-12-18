import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum AlertType {
  NEW_DEVICE = 'new_device',
  NEW_LOCATION = 'new_location',
  FAILED_ATTEMPTS = 'failed_attempts',
  PASSWORD_CHANGED = 'password_changed',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
}

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

@Entity('security_alerts')
@Index(['userId', 'isDismissed', 'createdAt'])
export class SecurityAlert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 36 })
  userId: string;

  @Column({ type: 'enum', enum: AlertType })
  type: AlertType;

  @Column({ type: 'enum', enum: AlertSeverity, default: AlertSeverity.MEDIUM })
  severity: AlertSeverity;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @Column({ default: false })
  isDismissed: boolean;

  @Column({ type: 'datetime', nullable: true })
  dismissedAt: Date;

  @Column({ default: false })
  isRead: boolean;

  @Column({ type: 'datetime', nullable: true })
  readAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}

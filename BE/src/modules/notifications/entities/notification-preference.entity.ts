import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('notification_preferences')
export class NotificationPreference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  user_id: string;

  @Column({ type: 'boolean', default: true })
  email_enabled: boolean;

  @Column({ type: 'boolean', default: true })
  push_enabled: boolean;

  @Column({ type: 'boolean', default: true })
  sms_enabled: boolean;

  @Column({ type: 'jsonb', nullable: true })
  email_types: string[]; // ['class', 'exam', 'assignment']

  @Column({ type: 'jsonb', nullable: true })
  push_types: string[];

  @Column({ type: 'jsonb', nullable: true })
  sms_types: string[];

  @Column({ type: 'boolean', default: false })
  quiet_hours_enabled: boolean;

  @Column({ type: 'time', nullable: true })
  quiet_hours_start: string;

  @Column({ type: 'time', nullable: true })
  quiet_hours_end: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

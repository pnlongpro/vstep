import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('notification_templates')
export class NotificationTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string; // class_started, exam_due, achievement_unlocked

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  type: string; // system, class, exam, assignment, achievement

  @Column({ type: 'varchar', length: 200 })
  title_template: string;

  @Column({ type: 'text' })
  message_template: string;

  @Column({ type: 'text', nullable: true })
  email_subject_template: string;

  @Column({ type: 'text', nullable: true })
  email_body_template: string;

  @Column({ type: 'jsonb', nullable: true })
  variables: string[]; // ['user_name', 'class_name', 'start_date']

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

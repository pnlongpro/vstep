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

export enum LoginStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  BLOCKED = 'blocked',
}

export enum LoginMethod {
  EMAIL_PASSWORD = 'email_password',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  APPLE = 'apple',
  REFRESH_TOKEN = 'refresh_token',
}

@Entity('login_history')
@Index(['userId', 'createdAt'])
@Index(['ipAddress'])
@Index(['email', 'createdAt'])
export class LoginHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 36, nullable: true })
  userId: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ type: 'enum', enum: LoginStatus })
  status: LoginStatus;

  @Column({ type: 'enum', enum: LoginMethod, default: LoginMethod.EMAIL_PASSWORD })
  method: LoginMethod;

  @Column({ length: 255, nullable: true })
  failureReason: string;

  @Column({ length: 45, nullable: true })
  ipAddress: string;

  @Column({ length: 100, nullable: true })
  location: string;

  @Column({ length: 100, nullable: true })
  country: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 50, nullable: true })
  deviceType: string;

  @Column({ length: 100, nullable: true })
  deviceName: string;

  @Column({ length: 100, nullable: true })
  browser: string;

  @Column({ length: 100, nullable: true })
  os: string;

  @Column({ type: 'text', nullable: true })
  userAgent: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;
}

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

@Entity('sessions')
@Index(['token'])
@Index(['userId', 'isActive'])
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 36 })
  userId: string;

  @Column({ length: 500 })
  token: string;

  @Column({ length: 500, nullable: true })
  refreshToken: string;

  @Column({ length: 50, nullable: true })
  deviceType: string;

  @Column({ length: 100, nullable: true })
  deviceName: string;

  @Column({ length: 100, nullable: true })
  browser: string;

  @Column({ length: 100, nullable: true })
  os: string;

  @Column({ length: 45, nullable: true })
  ipAddress: string;

  @Column({ length: 100, nullable: true })
  location: string;

  @Column({ type: 'text', nullable: true })
  userAgent: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'datetime' })
  expiresAt: Date;

  @Column({ type: 'datetime', nullable: true })
  lastActiveAt: Date;

  @Column({ type: 'datetime', nullable: true })
  revokedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}

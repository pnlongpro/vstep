import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum XpSource {
  PRACTICE = 'practice',
  EXAM = 'exam',
  ACHIEVEMENT = 'achievement',
  GOAL = 'goal',
  STREAK = 'streak',
  BONUS = 'bonus',
}

@Entity('xp_transactions')
@Index(['userId', 'createdAt'])
@Index(['source'])
export class XpTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  amount: number;

  @Column({
    type: 'enum',
    enum: XpSource,
  })
  source: XpSource;

  @Column({ name: 'source_id', nullable: true })
  sourceId: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

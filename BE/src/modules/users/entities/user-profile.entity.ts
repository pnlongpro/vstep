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

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ nullable: true, length: 500 })
  avatar: string;

  @Column({ nullable: true, length: 20 })
  phone: string;

  @Column({ nullable: true, length: 100 })
  location: string;

  @Column({
    type: 'enum',
    enum: ['A2', 'B1', 'B2', 'C1'],
    nullable: true,
    name: 'current_level',
  })
  currentLevel: string;

  @Column({
    type: 'enum',
    enum: ['A2', 'B1', 'B2', 'C1'],
    nullable: true,
    name: 'target_level',
  })
  targetLevel: string;

  @Column({ type: 'date', nullable: true, name: 'target_date' })
  targetDate: Date;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'date', nullable: true, name: 'join_date' })
  joinDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

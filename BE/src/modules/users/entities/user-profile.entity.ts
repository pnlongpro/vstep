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

export type VstepLevel = 'A2' | 'B1' | 'B2' | 'C1';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 36, unique: true })
  userId: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ length: 100, nullable: true })
  location: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({
    type: 'enum',
    enum: ['A2', 'B1', 'B2', 'C1'],
    nullable: true,
  })
  currentLevel: VstepLevel;

  @Column({
    type: 'enum',
    enum: ['A2', 'B1', 'B2', 'C1'],
    nullable: true,
  })
  targetLevel: VstepLevel;

  @Column({ type: 'date', nullable: true })
  targetDate: Date;

  @Column({ type: 'int', default: 30 })
  studyGoalMinutes: number;

  // Teacher-specific fields (optional)
  @Column({ length: 255, nullable: true })
  specialization: string;

  @Column({ length: 100, nullable: true })
  degree: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0, nullable: true })
  rating: number;

  @Column({ type: 'text', nullable: true })
  certifications: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'userId' })
  user: User;
}

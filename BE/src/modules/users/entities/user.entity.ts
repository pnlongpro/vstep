import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Role } from './role.entity';
import { UserProfile } from './user-profile.entity';
import { UserStats } from './user-stats.entity';
import { ExamAttempt } from '../../exams/entities/exam-attempt.entity';
import { PracticeSession } from '../../practice/entities/practice-session.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'enum', enum: ['active', 'inactive', 'banned'], default: 'active' })
  status: string;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @OneToOne(() => UserProfile, (profile) => profile.user)
  profile: UserProfile;

  @OneToOne(() => UserStats, (stats) => stats.user)
  stats: UserStats;

  @OneToMany(() => ExamAttempt, (attempt) => attempt.user)
  examAttempts: ExamAttempt[];

  @OneToMany(() => PracticeSession, (session) => session.user)
  practiceSessions: PracticeSession[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('teacher_profiles')
export class TeacherProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  user_id: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  teacher_code: string; // GV-2023-00045

  @Column({ type: 'varchar', length: 10, nullable: true })
  title: string; // TS., ThS., GV.

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  joined_date: Date;

  @Column({ type: 'varchar', length: 20, default: 'full_time' })
  employment_type: string; // full_time, part_time, contract

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string;

  @Column({ type: 'jsonb', nullable: true })
  education: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  certifications: Record<string, any>;

  @Column({ type: 'integer', default: 0 })
  experience: number; // years

  @Column({ type: 'jsonb', nullable: true })
  specialties: string[]; // ['Writing', 'Speaking', 'IELTS']

  @Column({ type: 'jsonb', nullable: true })
  levels_taught: string[]; // ['A2', 'B1', 'B2']

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'jsonb', nullable: true })
  achievements: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  publications: Record<string, any>;

  @Column({ type: 'varchar', length: 255, nullable: true })
  linkedin_url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website_url: string;

  @Column({ type: 'integer', default: 40 })
  max_hours_per_week: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

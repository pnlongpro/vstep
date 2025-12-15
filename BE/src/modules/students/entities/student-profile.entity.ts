import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('student_profiles')
export class StudentProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  user_id: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  student_code: string; // SV-2024-00123

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  enrollment_date: Date;

  @Column({ type: 'date', nullable: true })
  graduation_date: Date;

  @Column({ type: 'varchar', length: 5, default: 'A2' })
  current_level: string; // A2, B1, B2, C1

  @Column({ type: 'varchar', length: 5, default: 'B2' })
  target_level: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  education: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  major: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  occupation: string;

  @Column({ type: 'text', nullable: true })
  purpose: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  emergency_contact_name: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  emergency_contact_phone: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  preferred_learning_time: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  learning_style: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

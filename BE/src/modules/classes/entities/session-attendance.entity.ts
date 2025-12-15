import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ClassSession } from './class-session.entity';
import { User } from '../../users/entities/user.entity';

@Entity('session_attendance')
export class SessionAttendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  session_id: string;

  @Column({ type: 'uuid' })
  student_id: string;

  @Column({ type: 'varchar', length: 20 })
  status: string; // present, absent, late, excused

  @Column({ type: 'timestamp', nullable: true })
  check_in_time: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @ManyToOne(() => ClassSession)
  @JoinColumn({ name: 'session_id' })
  session: ClassSession;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'student_id' })
  student: User;
}

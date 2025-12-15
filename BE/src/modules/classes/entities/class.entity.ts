import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { ClassTeacher } from './class-teacher.entity';
import { ClassStudent } from './class-student.entity';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string; // VST-B2-2024-15

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 5 })
  level: string; // A2, B1, B2, C1

  @Column({ type: 'integer', default: 30 })
  max_students: number;

  @Column({ type: 'integer', default: 5 })
  min_students: number;

  @Column({ type: 'integer', default: 0 })
  enrolled: number;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date' })
  end_date: Date;

  @Column({ type: 'integer', nullable: true })
  duration_weeks: number;

  @Column({ type: 'varchar', length: 20, default: 'upcoming' })
  status: string; // upcoming, active, completed, cancelled

  @Column({ type: 'boolean', default: true })
  is_public: boolean;

  @Column({ type: 'boolean', default: false })
  require_approval: boolean;

  @Column({ type: 'varchar', length: 500, nullable: true })
  thumbnail: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  syllabus_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  archived_at: Date;

  // Relations
  @OneToMany(() => ClassTeacher, classTeacher => classTeacher.class)
  teachers: ClassTeacher[];

  @OneToMany(() => ClassStudent, classStudent => classStudent.class)
  students: ClassStudent[];
}

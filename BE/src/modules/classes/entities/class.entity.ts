import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ClassStudent } from './class-student.entity';
import { ClassMaterial } from './class-material.entity';

export enum VstepLevel {
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
}

export enum ClassStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  COMPLETED = 'completed',
}

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'teacher_id' })
  teacherId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: VstepLevel, default: VstepLevel.B1 })
  level: VstepLevel;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date;

  @Column({ name: 'max_students', default: 30 })
  maxStudents: number;

  @Column({ name: 'invite_code', length: 10, unique: true, nullable: true })
  inviteCode: string;

  @Column({ type: 'enum', enum: ClassStatus, default: ClassStatus.DRAFT })
  status: ClassStatus;

  @Column({ name: 'cover_image', length: 500, nullable: true })
  coverImage: string;

  @Column({ type: 'json', nullable: true })
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
  }[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => ClassStudent, (cs) => cs.class)
  students: ClassStudent[];

  @OneToMany(() => ClassMaterial, (cm) => cm.class)
  materials: ClassMaterial[];
}

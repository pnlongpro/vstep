import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CourseModule } from './course-module.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'varchar', length: 250, unique: true, nullable: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 5 })
  level: string; // A2, B1, B2, C1

  @Column({ type: 'jsonb', nullable: true })
  skills: string[]; // ['reading', 'listening', 'writing', 'speaking']

  @Column({ type: 'varchar', length: 500, nullable: true })
  thumbnail: string;

  @Column({ type: 'integer', default: 0 })
  total_modules: number;

  @Column({ type: 'integer', default: 0 })
  total_lessons: number;

  @Column({ type: 'integer', default: 0, comment: 'in minutes' })
  total_duration: number;

  @Column({ type: 'uuid' })
  created_by: string;

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status: string; // draft, published, archived

  @Column({ type: 'timestamp', nullable: true })
  published_at: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ type: 'boolean', default: true })
  is_free: boolean;

  @Column({ type: 'integer', default: 0 })
  enrolled_count: number;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  average_rating: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @OneToMany(() => CourseModule, module => module.course)
  modules: CourseModule[];
}

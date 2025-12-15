import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Course } from './course.entity';
import { Lesson } from './lesson.entity';

@Entity('course_modules')
export class CourseModule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  course_id: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'integer' })
  order_number: number;

  @Column({ type: 'integer', default: 0 })
  total_lessons: number;

  @Column({ type: 'integer', default: 0, comment: 'in minutes' })
  duration: number;

  @Column({ type: 'boolean', default: false })
  is_locked: boolean;

  @Column({ type: 'uuid', nullable: true })
  unlock_after_module: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => Course, course => course.modules)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @OneToMany(() => Lesson, lesson => lesson.module)
  lessons: Lesson[];

  @ManyToOne(() => CourseModule, { nullable: true })
  @JoinColumn({ name: 'unlock_after_module' })
  prerequisiteModule: CourseModule;
}

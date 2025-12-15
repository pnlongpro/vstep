import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('daily_stats')
export class DailyStats {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date', unique: true })
  date: Date;

  @Column({ type: 'integer', default: 0 })
  total_users: number;

  @Column({ type: 'integer', default: 0 })
  new_users: number;

  @Column({ type: 'integer', default: 0 })
  active_users: number;

  @Column({ type: 'integer', default: 0 })
  tests_taken: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  average_score: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  revenue: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

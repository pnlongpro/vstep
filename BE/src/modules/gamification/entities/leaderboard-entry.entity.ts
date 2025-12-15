import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('leaderboard_entries')
export class LeaderboardEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'varchar', length: 20 })
  period: string; // weekly, monthly, all_time

  @Column({ type: 'varchar', length: 5, nullable: true })
  level: string; // A2, B1, B2, C1

  @Column({ type: 'integer' })
  rank: number;

  @Column({ type: 'integer', default: 0 })
  xp: number;

  @Column({ type: 'integer', default: 0 })
  badges_count: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  average_score: number;

  @Column({ type: 'date', nullable: true })
  period_start: Date;

  @Column({ type: 'date', nullable: true })
  period_end: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

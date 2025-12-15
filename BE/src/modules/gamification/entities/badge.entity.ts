import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('badges')
export class Badge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  code: string; // 7_day_streak, 100_tests, writing_hero

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  icon_url: string;

  @Column({ type: 'integer', default: 0 })
  xp_reward: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  category: string; // streak, skill, milestone

  @Column({ type: 'jsonb', nullable: true })
  requirements: Record<string, any>; // { streak_days: 7 }

  @Column({ type: 'varchar', length: 20, default: 'bronze' })
  tier: string; // bronze, silver, gold, platinum

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

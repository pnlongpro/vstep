import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('ai_job_queue')
export class AIJobQueue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  job_id: string;

  @Column({ type: 'varchar', length: 20 })
  type: string; // writing, speaking

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string; // pending, processing, completed, failed

  @Column({ type: 'jsonb' })
  payload: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  result: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  error_message: string;

  @Column({ type: 'integer', nullable: true, comment: 'in milliseconds' })
  processing_time: number;

  @Column({ type: 'integer', default: 0 })
  retry_count: number;

  @Column({ type: 'integer', default: 3 })
  max_retries: number;

  @Column({ type: 'timestamp', nullable: true })
  started_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  completed_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('audio_storage')
export class AudioStorage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid', nullable: true })
  submission_id: string;

  @Column({ type: 'varchar', length: 500 })
  file_path: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  encryption_key: string;

  @Column({ type: 'integer', comment: 'in seconds' })
  duration: number;

  @Column({ type: 'bigint', comment: 'in bytes' })
  file_size: number;

  @Column({ type: 'varchar', length: 50 })
  mime_type: string;

  @Column({ type: 'varchar', length: 20, default: 'stored' })
  status: string; // stored, processing, transcribed, deleted

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

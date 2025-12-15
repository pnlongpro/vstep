import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('passages')
export class Passage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 5 })
  level: string; // A2, B1, B2, C1

  @Column({ type: 'varchar', length: 100, nullable: true })
  source: string;

  @Column({ type: 'integer', nullable: true })
  word_count: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  topic: string;

  @Column({ type: 'jsonb', nullable: true })
  tags: string[];

  @Column({ type: 'uuid' })
  created_by: string;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;
}

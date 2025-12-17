import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('question_tags')
export class QuestionTag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ length: 255, nullable: true })
  description: string;

  @Column({ length: 50, nullable: true, comment: 'Tag category: topic, grammar, etc.' })
  category: string;

  @Column({ length: 7, nullable: true, comment: 'Hex color code' })
  color: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

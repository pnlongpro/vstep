import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum OAuthProvider {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  APPLE = 'apple',
}

@Entity('oauth_accounts')
@Index(['provider', 'providerId'], { unique: true })
@Index(['userId'])
export class OAuthAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 36 })
  userId: string;

  @Column({
    type: 'enum',
    enum: OAuthProvider,
  })
  provider: OAuthProvider;

  @Column({ length: 255 })
  providerId: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ length: 255, nullable: true })
  name: string;

  @Column({ length: 500, nullable: true })
  avatar: string;

  @Column({ type: 'text', nullable: true })
  accessToken: string;

  @Column({ type: 'text', nullable: true })
  refreshToken: string;

  @Column({ type: 'datetime', nullable: true })
  tokenExpiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}

# BE-002: User Entity

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-002 |
| **Phase** | 1 - MVP |
| **Sprint** | 1-2 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 8h |
| **Dependencies** | BE-001 |

---

## 🎯 Objective

Tạo User Entity với TypeORM, bao gồm relations với Profile, Stats, Settings, và Role.

---

## 📝 Requirements

### Entities to Create

1. **User** - Entity chính
2. **UserProfile** - One-to-One với User
3. **UserStats** - One-to-One với User  
4. **UserSettings** - One-to-One với User
5. **Role** - Many-to-One với User

### Features

- UUID primary key
- Soft delete support
- Password không được return trong response
- Relations lazy loading

---

## 💻 Implementation

### File Structure

```
src/modules/users/
├── users.module.ts
├── users.controller.ts
├── users.service.ts
├── entities/
│   ├── user.entity.ts
│   ├── user-profile.entity.ts
│   ├── user-stats.entity.ts
│   ├── user-settings.entity.ts
│   └── role.entity.ts
├── dto/
│   ├── create-user.dto.ts
│   ├── update-user.dto.ts
│   └── user-response.dto.ts
└── interfaces/
    └── user.interface.ts
```

### Step 1: Role Entity

```typescript
// src/modules/users/entities/role.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  name: string;

  @Column({ length: 100 })
  displayName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
```

### Step 2: User Entity

```typescript
// src/modules/users/entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from './role.entity';
import { UserProfile } from './user-profile.entity';
import { UserStats } from './user-stats.entity';
import { UserSettings } from './user-settings.entity';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
}

@Entity('users')
@Index(['email'])
@Index(['status', 'createdAt'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 255 })
  @Exclude() // Không trả về trong response
  password: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 36 })
  roleId: string;

  @Column({ length: 500, nullable: true })
  avatar: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING,
  })
  status: UserStatus;

  @Column({ type: 'datetime', nullable: true })
  emailVerifiedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // Relations
  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @OneToOne(() => UserProfile, (profile) => profile.user, { cascade: true })
  profile: UserProfile;

  @OneToOne(() => UserStats, (stats) => stats.user, { cascade: true })
  stats: UserStats;

  @OneToOne(() => UserSettings, (settings) => settings.user, { cascade: true })
  settings: UserSettings;

  // Virtual properties
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get isEmailVerified(): boolean {
    return !!this.emailVerifiedAt;
  }
}
```

### Step 3: UserProfile Entity

```typescript
// src/modules/users/entities/user-profile.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum EnglishLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2',
}

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 36, unique: true })
  userId: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 100, default: 'Vietnam' })
  country: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'enum', enum: EnglishLevel, nullable: true })
  currentLevel: EnglishLevel;

  @Column({ type: 'enum', enum: EnglishLevel, nullable: true })
  targetLevel: EnglishLevel;

  @Column({ type: 'date', nullable: true })
  targetDate: Date;

  @Column({ length: 50, default: 'Asia/Ho_Chi_Minh' })
  timezone: string;

  @Column({ length: 10, default: 'vi' })
  language: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'userId' })
  user: User;
}
```

### Step 4: UserStats Entity

```typescript
// src/modules/users/entities/user-stats.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_stats')
export class UserStats {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 36, unique: true })
  userId: string;

  @Column({ default: 0, comment: 'Total study time in minutes' })
  totalStudyTime: number;

  @Column({ default: 0 })
  totalExercises: number;

  @Column({ default: 0 })
  totalMockExams: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  averageScore: number;

  @Column({ default: 0 })
  currentStreak: number;

  @Column({ default: 0 })
  longestStreak: number;

  @Column({ default: 0 })
  totalPoints: number;

  @Column({ default: 1 })
  level: number;

  @Column({ type: 'datetime', nullable: true })
  lastActiveAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => User, (user) => user.stats)
  @JoinColumn({ name: 'userId' })
  user: User;
}
```

### Step 5: UserSettings Entity

```typescript
// src/modules/users/entities/user-settings.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

@Entity('user_settings')
export class UserSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 36, unique: true })
  userId: string;

  @Column({ default: true })
  emailNotifications: boolean;

  @Column({ default: true })
  pushNotifications: boolean;

  @Column({ default: true })
  reminderEnabled: boolean;

  @Column({ type: 'time', default: '09:00:00' })
  reminderTime: string;

  @Column({ default: 30, comment: 'Daily study goal in minutes' })
  dailyGoal: number;

  @Column({ default: true })
  autoPlayAudio: boolean;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 1.0 })
  playbackSpeed: number;

  @Column({ type: 'enum', enum: Theme, default: Theme.SYSTEM })
  theme: Theme;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => User, (user) => user.settings)
  @JoinColumn({ name: 'userId' })
  user: User;
}
```

### Step 6: DTOs

```typescript
// src/modules/users/dto/create-user.dto.ts
import { 
  IsEmail, 
  IsString, 
  MinLength, 
  MaxLength, 
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  lastName: string;

  @IsOptional()
  @IsUUID()
  roleId?: string;
}
```

```typescript
// src/modules/users/dto/update-user.dto.ts
import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['email', 'password'] as const),
) {}
```

```typescript
// src/modules/users/dto/user-response.dto.ts
import { Exclude, Expose, Type } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @Expose()
  avatar: string;

  @Expose()
  status: string;

  @Expose()
  emailVerifiedAt: Date;

  @Expose()
  createdAt: Date;

  @Exclude()
  password: string;

  @Exclude()
  deletedAt: Date;
}
```

### Step 7: Users Service

```typescript
// src/modules/users/users.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserStatus } from './entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';
import { UserStats } from './entities/user-stats.entity';
import { UserSettings } from './entities/user-settings.entity';
import { Role } from './entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,
    @InjectRepository(UserStats)
    private readonly statsRepository: Repository<UserStats>,
    @InjectRepository(UserSettings)
    private readonly settingsRepository: Repository<UserSettings>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    // Check if email exists
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Get default role (student)
    const role = await this.roleRepository.findOne({
      where: { name: dto.roleId ? undefined : 'student', id: dto.roleId },
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user
    const user = this.userRepository.create({
      ...dto,
      password: hashedPassword,
      roleId: role.id,
    });

    const savedUser = await this.userRepository.save(user);

    // Create related entities
    await this.profileRepository.save({ userId: savedUser.id });
    await this.statsRepository.save({ userId: savedUser.id });
    await this.settingsRepository.save({ userId: savedUser.id });

    return this.findById(savedUser.id);
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role', 'profile', 'stats', 'settings'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, dto);
    await this.userRepository.save(user);
    return this.findById(id);
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(id, { password: hashedPassword });
  }

  async verifyEmail(id: string): Promise<void> {
    await this.userRepository.update(id, {
      emailVerifiedAt: new Date(),
      status: UserStatus.ACTIVE,
    });
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userRepository.update(id, { lastLoginAt: new Date() });
  }

  async softDelete(id: string): Promise<void> {
    await this.userRepository.softDelete(id);
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}
```

### Step 8: Users Module

```typescript
// src/modules/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';
import { UserStats } from './entities/user-stats.entity';
import { UserSettings } from './entities/user-settings.entity';
import { Role } from './entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserProfile,
      UserStats,
      UserSettings,
      Role,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

### Step 9: Index Exports

```typescript
// src/modules/users/entities/index.ts
export * from './user.entity';
export * from './user-profile.entity';
export * from './user-stats.entity';
export * from './user-settings.entity';
export * from './role.entity';
```

```typescript
// src/modules/users/dto/index.ts
export * from './create-user.dto';
export * from './update-user.dto';
export * from './user-response.dto';
```

```typescript
// src/modules/users/index.ts
export * from './users.module';
export * from './users.service';
export * from './entities';
export * from './dto';
```

---

## ✅ Acceptance Criteria

- [ ] All 5 entities created with correct decorators
- [ ] Relations working (One-to-One, Many-to-One)
- [ ] Password excluded from responses
- [ ] Soft delete working
- [ ] UsersService with basic CRUD
- [ ] DTOs with validation
- [ ] Module exports correctly

---

## 🧪 Testing

```typescript
// src/modules/users/users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        // ... other repositories
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const dto = {
        email: 'test@example.com',
        password: '12345678',
        firstName: 'Test',
        lastName: 'User',
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(dto);
      mockUserRepository.save.mockResolvedValue({ id: '1', ...dto });

      const result = await service.create(dto);

      expect(result.email).toBe(dto.email);
      expect(mockUserRepository.save).toHaveBeenCalled();
    });
  });
});
```

---

## 📚 References

- [TypeORM Entity Docs](https://typeorm.io/entities)
- [NestJS TypeORM Integration](https://docs.nestjs.com/techniques/database)
- [Class Transformer](https://github.com/typestack/class-transformer)

---

## ⏭️ Next Task

→ `BE-003_AUTH_SERVICE.md` - Implement Auth Service

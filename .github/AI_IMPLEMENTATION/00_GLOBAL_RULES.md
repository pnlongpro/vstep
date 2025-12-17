# 📜 Global Rules - Quy tắc dành cho AI

> **Đọc file này TRƯỚC KHI implement bất kỳ task nào**
- AI không được tạo file ngoài phạm vi task
- AI không được đổi DB schema nếu không được yêu cầu
- Thiếu thông tin → TODO comment, KHÔNG suy đoán
- Không refactor code cũ nếu task không yêu cầu
---

## � FE Components - QUAN TRỌNG

> **⚠️ UI Components đã được code sẵn trong `FE/src/`**

### Quy tắc bắt buộc cho FE tasks:

```
❌ KHÔNG viết lại UI components đã có sẵn
✅ CHỈ tích hợp API và data fetching  
✅ Extend/modify components hiện có nếu cần
✅ Tham khảo 02_FE_COMPONENT_MAPPING.md trước khi code
```

### Trước khi implement FE task:

1. **ĐỌC** `02_FE_COMPONENT_MAPPING.md` để xem component nào đã tồn tại
2. **KIỂM TRA** `FE/src/components/` và `FE/src/features/`
3. **KHÔNG** viết lại component nếu đã có - chỉ integrate API
4. **TẠO** React Query hooks trong `FE/src/hooks/`
5. **EXTEND** services trong `FE/src/services/`

### Implementation Pattern:

```typescript
// 1. Tạo API service (services/dashboard.service.ts)
export const dashboardService = {
  getStats: () => apiClient.get('/dashboard/stats'),
};

// 2. Tạo React Query hook (hooks/useDashboard.ts)
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardService.getStats,
  });
}

// 3. Update existing component để dùng hook
// KHÔNG viết lại UI, chỉ replace mock data với real data
```

---

## �🎯 Golden Rules

### 1. Code Quality

```typescript
// ✅ GOOD - Clean, typed, documented
export async function createUser(dto: CreateUserDto): Promise<User> {
  // Validate input
  await this.validateUniqueEmail(dto.email);
  
  // Hash password
  const hashedPassword = await bcrypt.hash(dto.password, 10);
  
  // Create user
  const user = this.userRepository.create({
    ...dto,
    password: hashedPassword,
  });
  
  return this.userRepository.save(user);
}

// ❌ BAD - No types, no validation, no error handling
async function createUser(data) {
  return db.query('INSERT INTO users...');
}
```

### 2. Error Handling

```typescript
// ✅ GOOD - Proper exception with meaningful message
if (!user) {
  throw new NotFoundException(`User with ID ${id} not found`);
}

// ❌ BAD - Generic error
if (!user) {
  throw new Error('Not found');
}
```

### 3. Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `user-profile.service.ts` |
| Classes | PascalCase | `UserProfileService` |
| Functions | camelCase | `getUserById` |
| Constants | UPPER_SNAKE | `MAX_LOGIN_ATTEMPTS` |
| DB Tables | snake_case | `user_profiles` |
| DB Columns | camelCase | `createdAt`, `userId` |

---

## 🏗️ Architecture Rules

### Backend (NestJS)

```
src/modules/{module}/
├── {module}.module.ts        # Module definition
├── {module}.controller.ts    # HTTP endpoints only
├── {module}.service.ts       # Business logic
├── entities/
│   └── {entity}.entity.ts    # TypeORM entity
├── dto/
│   ├── create-{entity}.dto.ts
│   └── update-{entity}.dto.ts
├── interfaces/
│   └── {interface}.interface.ts
└── guards/                   # Module-specific guards
```

### Frontend (Next.js)

```
src/
├── app/                      # App Router pages
│   └── (dashboard)/
│       └── {page}/
│           ├── page.tsx      # Page component
│           └── loading.tsx   # Loading state
├── components/
│   └── {feature}/           # Feature-specific components
├── features/
│   └── {feature}/
│       ├── api.ts           # API calls
│       ├── hooks.ts         # Custom hooks
│       └── types.ts         # TypeScript types
└── services/
    └── api.ts               # Axios instance
```

---

## 📝 Coding Standards

### TypeScript

```typescript
// ✅ Always use explicit types
interface User {
  id: string;
  email: string;
  createdAt: Date;
}

// ✅ Use enums for fixed values
enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}

// ✅ Use const assertions
const ROLES = ['student', 'teacher', 'admin'] as const;
type Role = typeof ROLES[number];
```

### DTOs (Data Transfer Objects)

```typescript
// ✅ GOOD - With class-validator decorators
import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}
```

### Entities (TypeORM)

```typescript
// ✅ GOOD - Complete entity with all decorators
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date; // Soft delete

  // Relations
  @OneToOne(() => UserProfile, profile => profile.user)
  profile: UserProfile;
}
```

---

## 🔐 Security Rules

### Authentication

```typescript
// ✅ Always hash passwords
const hashedPassword = await bcrypt.hash(password, 10);

// ✅ Never return password in response
const { password, ...userWithoutPassword } = user;
return userWithoutPassword;

// ✅ Use guards on protected routes
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Get('admin/users')
async getUsers() { ... }
```

### Input Validation

```typescript
// ✅ Validate all inputs via DTOs
@Post()
async create(@Body() dto: CreateUserDto) {
  // dto is already validated by ValidationPipe
}

// ✅ Sanitize user input
import { sanitize } from 'class-sanitizer';
```

### SQL Injection Prevention

```typescript
// ✅ GOOD - Parameterized queries
const user = await this.userRepository.findOne({
  where: { email },
});

// ❌ BAD - String concatenation
const user = await this.query(`SELECT * FROM users WHERE email = '${email}'`);
```

---

## 🧪 Testing Rules

### Unit Tests

```typescript
describe('UserService', () => {
  let service: UserService;
  let repository: MockType<Repository<User>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get(UserService);
    repository = module.get(getRepositoryToken(User));
  });

  it('should create user', async () => {
    const dto = { email: 'test@example.com', password: '12345678' };
    repository.create.mockReturnValue(dto);
    repository.save.mockResolvedValue({ id: '1', ...dto });

    const result = await service.create(dto);

    expect(result.email).toBe(dto.email);
    expect(repository.save).toHaveBeenCalled();
  });
});
```

### E2E Tests

```typescript
describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: '12345678' })
      .expect(200)
      .expect((res) => {
        expect(res.body.accessToken).toBeDefined();
      });
  });
});
```

---

## 📊 Database Rules

### Migrations

```typescript
// ✅ Always create migrations for schema changes
// npm run migration:generate -- src/migrations/CreateUsersTable

// ✅ Migration file example
export class CreateUsersTable1702800000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          // ... more columns
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
```

### Indexing

```typescript
// ✅ Add indexes for frequently queried columns
@Entity('users')
@Index(['email'])
@Index(['status', 'createdAt'])
export class User { ... }
```

### Transactions

```typescript
// ✅ Use transactions for multi-table operations
async createUserWithProfile(dto: CreateUserDto) {
  return this.dataSource.transaction(async (manager) => {
    const user = await manager.save(User, { ... });
    const profile = await manager.save(UserProfile, { userId: user.id, ... });
    return { user, profile };
  });
}
```

---

## 📁 File Patterns

### Import Order

```typescript
// 1. Node modules
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// 2. Third-party modules
import * as bcrypt from 'bcrypt';

// 3. Local modules (absolute paths)
import { User } from '@/modules/users/entities/user.entity';

// 4. Relative imports
import { CreateUserDto } from './dto/create-user.dto';
```

### Export Pattern

```typescript
// ✅ Use index.ts for barrel exports
// modules/users/index.ts
export * from './users.module';
export * from './users.service';
export * from './entities/user.entity';
export * from './dto';
```

---

## ⚠️ Common Mistakes to Avoid

| ❌ Don't | ✅ Do |
|----------|-------|
| `any` type | Explicit types |
| Console.log in production | Logger service |
| Hardcoded secrets | Environment variables |
| Sync database operations | Async/await |
| Direct SQL queries | TypeORM repository methods |
| Business logic in controllers | Logic in services |
| Missing error handling | Try-catch with proper exceptions |
| No input validation | DTOs with class-validator |

---

## 🔄 Git Commit Rules

```bash
# Format: <type>(<scope>): <description>

# Types:
feat: New feature
fix: Bug fix
docs: Documentation
refactor: Code refactoring
test: Adding tests
chore: Maintenance

# Examples:
feat(auth): add JWT refresh token
fix(users): handle duplicate email error
docs(readme): update installation steps
```

---

**⚡ Remember**: Đọc lại file này mỗi khi bắt đầu session mới!

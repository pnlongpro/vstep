# BE-001: Database Core Tables

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-001 |
| **Phase** | 1 - MVP |
| **Sprint** | 1-2 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 16h |
| **Dependencies** | None |

---

## 🎯 Objective

Tạo database schema cho các bảng core của hệ thống: users, profiles, roles, permissions, sessions.

---

## 📝 Requirements

### Tables to Create

1. **users** - Bảng người dùng chính
2. **user_profiles** - Thông tin mở rộng
3. **user_stats** - Thống kê học tập
4. **user_settings** - Cài đặt cá nhân
5. **roles** - Vai trò (student, teacher, admin)
6. **permissions** - Quyền hạn
7. **sessions** - Phiên đăng nhập
8. **login_history** - Lịch sử đăng nhập
9. **password_reset_tokens** - Token reset mật khẩu

### Database Conventions

- Primary Key: UUID (varchar 36)
- Timestamps: `createdAt`, `updatedAt` (datetime)
- Soft Delete: `deletedAt` (datetime, nullable)
- Character Set: `utf8mb4`
- Collation: `utf8mb4_unicode_ci`
- Engine: InnoDB

---

## 💻 Implementation

### Step 1: Create Migration File

```bash
cd BE
npm run migration:create -- src/migrations/CreateCoreTables
```

### Step 2: Migration Code

```typescript
// src/migrations/TIMESTAMP-CreateCoreTables.ts
import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateCoreTables1702800000000 implements MigrationInterface {
  name = 'CreateCoreTables1702800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create roles table
    await queryRunner.createTable(
      new Table({
        name: 'roles',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '50',
            isUnique: true,
          },
          {
            name: 'displayName',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // 2. Create users table
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'firstName',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'lastName',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'roleId',
            type: 'varchar',
            length: '36',
          },
          {
            name: 'avatar',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['active', 'inactive', 'pending', 'suspended'],
            default: "'pending'",
          },
          {
            name: 'emailVerifiedAt',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'lastLoginAt',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deletedAt',
            type: 'datetime',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // 3. Create user_profiles table
    await queryRunner.createTable(
      new Table({
        name: 'user_profiles',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'userId',
            type: 'varchar',
            length: '36',
            isUnique: true,
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'dateOfBirth',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'gender',
            type: 'enum',
            enum: ['male', 'female', 'other'],
            isNullable: true,
          },
          {
            name: 'address',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'city',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'country',
            type: 'varchar',
            length: '100',
            default: "'Vietnam'",
          },
          {
            name: 'bio',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'currentLevel',
            type: 'enum',
            enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
            isNullable: true,
          },
          {
            name: 'targetLevel',
            type: 'enum',
            enum: ['A2', 'B1', 'B2', 'C1', 'C2'],
            isNullable: true,
          },
          {
            name: 'targetDate',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'timezone',
            type: 'varchar',
            length: '50',
            default: "'Asia/Ho_Chi_Minh'",
          },
          {
            name: 'language',
            type: 'varchar',
            length: '10',
            default: "'vi'",
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // 4. Create user_stats table
    await queryRunner.createTable(
      new Table({
        name: 'user_stats',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'userId',
            type: 'varchar',
            length: '36',
            isUnique: true,
          },
          {
            name: 'totalStudyTime',
            type: 'int',
            default: 0,
            comment: 'Total study time in minutes',
          },
          {
            name: 'totalExercises',
            type: 'int',
            default: 0,
          },
          {
            name: 'totalMockExams',
            type: 'int',
            default: 0,
          },
          {
            name: 'averageScore',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'currentStreak',
            type: 'int',
            default: 0,
          },
          {
            name: 'longestStreak',
            type: 'int',
            default: 0,
          },
          {
            name: 'totalPoints',
            type: 'int',
            default: 0,
          },
          {
            name: 'level',
            type: 'int',
            default: 1,
          },
          {
            name: 'lastActiveAt',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'updatedAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // 5. Create user_settings table
    await queryRunner.createTable(
      new Table({
        name: 'user_settings',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'userId',
            type: 'varchar',
            length: '36',
            isUnique: true,
          },
          {
            name: 'emailNotifications',
            type: 'boolean',
            default: true,
          },
          {
            name: 'pushNotifications',
            type: 'boolean',
            default: true,
          },
          {
            name: 'reminderEnabled',
            type: 'boolean',
            default: true,
          },
          {
            name: 'reminderTime',
            type: 'time',
            default: "'09:00:00'",
          },
          {
            name: 'dailyGoal',
            type: 'int',
            default: 30,
            comment: 'Daily study goal in minutes',
          },
          {
            name: 'autoPlayAudio',
            type: 'boolean',
            default: true,
          },
          {
            name: 'playbackSpeed',
            type: 'decimal',
            precision: 2,
            scale: 1,
            default: 1.0,
          },
          {
            name: 'theme',
            type: 'enum',
            enum: ['light', 'dark', 'system'],
            default: "'system'",
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // 6. Create permissions table
    await queryRunner.createTable(
      new Table({
        name: 'permissions',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'roleId',
            type: 'varchar',
            length: '36',
          },
          {
            name: 'resource',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'action',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'conditions',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // 7. Create sessions table
    await queryRunner.createTable(
      new Table({
        name: 'sessions',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'userId',
            type: 'varchar',
            length: '36',
          },
          {
            name: 'token',
            type: 'varchar',
            length: '500',
          },
          {
            name: 'refreshToken',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'deviceType',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'deviceName',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'ipAddress',
            type: 'varchar',
            length: '45',
            isNullable: true,
          },
          {
            name: 'userAgent',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'expiresAt',
            type: 'datetime',
          },
          {
            name: 'lastActiveAt',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // 8. Create login_history table
    await queryRunner.createTable(
      new Table({
        name: 'login_history',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'userId',
            type: 'varchar',
            length: '36',
          },
          {
            name: 'ipAddress',
            type: 'varchar',
            length: '45',
            isNullable: true,
          },
          {
            name: 'userAgent',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'location',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['success', 'failed', 'blocked'],
          },
          {
            name: 'failureReason',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'loginAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // 9. Create password_reset_tokens table
    await queryRunner.createTable(
      new Table({
        name: 'password_reset_tokens',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'userId',
            type: 'varchar',
            length: '36',
          },
          {
            name: 'token',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          {
            name: 'expiresAt',
            type: 'datetime',
          },
          {
            name: 'usedAt',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create Foreign Keys
    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['roleId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles',
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createForeignKey(
      'user_profiles',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'user_stats',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'user_settings',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'permissions',
      new TableForeignKey({
        columnNames: ['roleId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'sessions',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'login_history',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'password_reset_tokens',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // Create Indexes
    await queryRunner.createIndex(
      'users',
      new TableIndex({ name: 'IDX_users_email', columnNames: ['email'] }),
    );
    await queryRunner.createIndex(
      'users',
      new TableIndex({ name: 'IDX_users_status', columnNames: ['status'] }),
    );
    await queryRunner.createIndex(
      'sessions',
      new TableIndex({ name: 'IDX_sessions_token', columnNames: ['token'] }),
    );
    await queryRunner.createIndex(
      'sessions',
      new TableIndex({ name: 'IDX_sessions_userId', columnNames: ['userId'] }),
    );
    await queryRunner.createIndex(
      'login_history',
      new TableIndex({ name: 'IDX_login_history_userId_loginAt', columnNames: ['userId', 'loginAt'] }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop in reverse order
    await queryRunner.dropTable('password_reset_tokens', true);
    await queryRunner.dropTable('login_history', true);
    await queryRunner.dropTable('sessions', true);
    await queryRunner.dropTable('permissions', true);
    await queryRunner.dropTable('user_settings', true);
    await queryRunner.dropTable('user_stats', true);
    await queryRunner.dropTable('user_profiles', true);
    await queryRunner.dropTable('users', true);
    await queryRunner.dropTable('roles', true);
  }
}
```

### Step 3: Seed Default Roles

```typescript
// src/seeds/roles.seed.ts
import { DataSource } from 'typeorm';

export async function seedRoles(dataSource: DataSource) {
  const roleRepository = dataSource.getRepository('roles');

  const roles = [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'student',
      displayName: 'Học viên',
      description: 'Người dùng học tập trên hệ thống',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'teacher',
      displayName: 'Giáo viên',
      description: 'Quản lý lớp học và học viên',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'admin',
      displayName: 'Quản trị viên',
      description: 'Quản trị toàn bộ hệ thống',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      name: 'uploader',
      displayName: 'Người upload',
      description: 'Upload và quản lý đề thi',
    },
  ];

  for (const role of roles) {
    const exists = await roleRepository.findOne({ where: { name: role.name } });
    if (!exists) {
      await roleRepository.save(role);
    }
  }

  console.log('✅ Roles seeded successfully');
}
```

---

## ✅ Acceptance Criteria

- [ ] Migration runs without errors
- [ ] All 9 tables created with correct columns
- [ ] Foreign keys established correctly
- [ ] Indexes created for performance
- [ ] Default roles seeded (student, teacher, admin, uploader)
- [ ] Migration can be reverted (down)

---

## 🧪 Testing

```bash
# Run migration
npm run migration:run

# Verify tables
mysql -u root -p vstepro -e "SHOW TABLES;"

# Verify columns
mysql -u root -p vstepro -e "DESCRIBE users;"

# Run seed
npm run seed:roles

# Rollback (test)
npm run migration:revert
```

---

## 📚 References

- [Database Design Doc](../../../docs/23-DATABASE-DESIGN_NEW.md)
- [TypeORM Migration Guide](https://typeorm.io/migrations)
- [Module Auth Doc](../../../docs/01-MODULE-AUTHENTICATION.md)

---

## ⏭️ Next Task

→ `BE-002_USER_ENTITY.md` - Create User Entity với TypeORM

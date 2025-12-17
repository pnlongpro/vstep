# BE-054: Admin Entity & RBAC

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-054 |
| **Phase** | 3 - Enterprise |
| **Sprint** | 15-16 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 4h |
| **Dependencies** | Phase 2 complete |

---

## 🎯 Objective

Implement admin authorization infrastructure:
- AdminLog entity for audit trail
- SystemSetting entity for configurations
- AdminGuard for role-based access
- Permission decorators

---

## 📝 Implementation

### 1. entities/admin-log.entity.ts

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('admin_logs')
@Index(['entityType', 'entityId'])
@Index(['createdAt'])
export class AdminLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'admin_id' })
  adminId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'admin_id' })
  admin: UserEntity;

  @Column({ length: 100 })
  action: string; // e.g., 'user.update', 'exam.delete', 'setting.change'

  @Column({ name: 'entity_type', length: 50, nullable: true })
  entityType?: string; // 'user', 'exam_set', 'question', 'setting'

  @Column({ name: 'entity_id', type: 'uuid', nullable: true })
  entityId?: string;

  @Column({ name: 'old_data', type: 'jsonb', nullable: true })
  oldData?: Record<string, any>;

  @Column({ name: 'new_data', type: 'jsonb', nullable: true })
  newData?: Record<string, any>;

  @Column({ name: 'ip_address', length: 45, nullable: true })
  ipAddress?: string;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
```

### 2. entities/system-setting.entity.ts

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

export enum SettingCategory {
  GENERAL = 'general',
  LIMITS = 'limits',
  FEATURES = 'features',
  PAYMENT = 'payment',
  NOTIFICATIONS = 'notifications',
}

export enum SettingDataType {
  BOOLEAN = 'boolean',
  NUMBER = 'number',
  STRING = 'string',
  JSON = 'json',
}

@Entity('system_settings')
export class SystemSettingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  key: string;

  @Column({ type: 'jsonb' })
  value: any;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: SettingCategory,
    default: SettingCategory.GENERAL,
  })
  category: SettingCategory;

  @Column({
    name: 'data_type',
    type: 'enum',
    enum: SettingDataType,
    default: SettingDataType.STRING,
  })
  dataType: SettingDataType;

  @Column({ name: 'is_public', default: false })
  isPublic: boolean;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy?: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'updated_by' })
  updatedByUser?: UserEntity;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
```

### 3. enums/admin-permissions.enum.ts

```typescript
export enum AdminPermission {
  // User Management
  VIEW_USERS = 'users.view',
  EDIT_USERS = 'users.edit',
  DELETE_USERS = 'users.delete',
  BAN_USERS = 'users.ban',
  MANAGE_ROLES = 'users.roles',

  // Exam Management
  VIEW_EXAMS = 'exams.view',
  CREATE_EXAMS = 'exams.create',
  EDIT_EXAMS = 'exams.edit',
  DELETE_EXAMS = 'exams.delete',
  PUBLISH_EXAMS = 'exams.publish',
  IMPORT_QUESTIONS = 'exams.import',

  // Analytics
  VIEW_ANALYTICS = 'analytics.view',
  EXPORT_DATA = 'analytics.export',

  // Settings
  VIEW_SETTINGS = 'settings.view',
  EDIT_SETTINGS = 'settings.edit',

  // Logs
  VIEW_LOGS = 'logs.view',
  EXPORT_LOGS = 'logs.export',
}

export const ROLE_PERMISSIONS: Record<string, AdminPermission[]> = {
  super_admin: Object.values(AdminPermission), // All permissions
  admin: [
    AdminPermission.VIEW_USERS,
    AdminPermission.EDIT_USERS,
    AdminPermission.BAN_USERS,
    AdminPermission.VIEW_EXAMS,
    AdminPermission.CREATE_EXAMS,
    AdminPermission.EDIT_EXAMS,
    AdminPermission.PUBLISH_EXAMS,
    AdminPermission.IMPORT_QUESTIONS,
    AdminPermission.VIEW_ANALYTICS,
    AdminPermission.VIEW_LOGS,
  ],
};
```

### 4. guards/admin.guard.ts

```typescript
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_PERMISSIONS, AdminPermission } from '../enums/admin-permissions.enum';

export const ADMIN_ROLES = ['super_admin', 'admin'];

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Unauthorized');
    }

    // Check if user has admin role
    const userRoles = user.roles?.map((r: any) => r.name || r) || [];
    const isAdmin = userRoles.some((role: string) => ADMIN_ROLES.includes(role));

    if (!isAdmin) {
      throw new ForbiddenException('Admin access required');
    }

    // Check specific permissions if required
    const requiredPermissions = this.reflector.get<AdminPermission[]>(
      'permissions',
      context.getHandler()
    );

    if (requiredPermissions?.length) {
      const userPermissions = this.getUserPermissions(userRoles);
      const hasPermission = requiredPermissions.every((p) =>
        userPermissions.includes(p)
      );

      if (!hasPermission) {
        throw new ForbiddenException('Insufficient permissions');
      }
    }

    return true;
  }

  private getUserPermissions(roles: string[]): AdminPermission[] {
    const permissions: Set<AdminPermission> = new Set();

    roles.forEach((role) => {
      const rolePermissions = ROLE_PERMISSIONS[role] || [];
      rolePermissions.forEach((p) => permissions.add(p));
    });

    return Array.from(permissions);
  }
}
```

### 5. decorators/permissions.decorator.ts

```typescript
import { SetMetadata } from '@nestjs/common';
import { AdminPermission } from '../enums/admin-permissions.enum';

export const RequirePermissions = (...permissions: AdminPermission[]) =>
  SetMetadata('permissions', permissions);
```

### 6. decorators/audit-log.decorator.ts

```typescript
import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { AuditLogInterceptor } from '../interceptors/audit-log.interceptor';

export const AuditLog = (action: string, entityType?: string) => {
  return applyDecorators(
    UseInterceptors(new AuditLogInterceptor(action, entityType))
  );
};
```

### 7. interceptors/audit-log.interceptor.ts

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AdminLogService } from '../services/admin-logs.service';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(
    private readonly action: string,
    private readonly entityType?: string,
    private adminLogService?: AdminLogService
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const entityId = request.params?.id;
    const oldData = request.body?._oldData; // Set by service before update

    return next.handle().pipe(
      tap(async (result) => {
        if (this.adminLogService && user) {
          await this.adminLogService.log({
            adminId: user.id,
            action: this.action,
            entityType: this.entityType,
            entityId,
            oldData,
            newData: result,
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'],
          });
        }
      })
    );
  }
}
```

### 8. services/admin-logs.service.ts

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { AdminLogEntity } from '../entities/admin-log.entity';

export interface CreateLogDto {
  adminId: string;
  action: string;
  entityType?: string;
  entityId?: string;
  oldData?: Record<string, any>;
  newData?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface LogQueryDto {
  adminId?: string;
  action?: string;
  entityType?: string;
  entityId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

@Injectable()
export class AdminLogService {
  constructor(
    @InjectRepository(AdminLogEntity)
    private readonly logRepository: Repository<AdminLogEntity>
  ) {}

  async log(dto: CreateLogDto): Promise<AdminLogEntity> {
    const log = this.logRepository.create(dto);
    return this.logRepository.save(log);
  }

  async findAll(query: LogQueryDto) {
    const {
      adminId,
      action,
      entityType,
      entityId,
      startDate,
      endDate,
      page = 1,
      limit = 50,
    } = query;

    const qb = this.logRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.admin', 'admin')
      .orderBy('log.createdAt', 'DESC');

    if (adminId) {
      qb.andWhere('log.adminId = :adminId', { adminId });
    }

    if (action) {
      qb.andWhere('log.action LIKE :action', { action: `%${action}%` });
    }

    if (entityType) {
      qb.andWhere('log.entityType = :entityType', { entityType });
    }

    if (entityId) {
      qb.andWhere('log.entityId = :entityId', { entityId });
    }

    if (startDate && endDate) {
      qb.andWhere('log.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const [items, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getLogsByEntity(
    entityType: string,
    entityId: string
  ): Promise<AdminLogEntity[]> {
    return this.logRepository.find({
      where: { entityType, entityId },
      relations: ['admin'],
      order: { createdAt: 'DESC' },
    });
  }
}
```

### 9. admin.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminLogEntity } from './entities/admin-log.entity';
import { SystemSettingEntity } from './entities/system-setting.entity';
import { AdminLogService } from './services/admin-logs.service';
import { AdminGuard } from './guards/admin.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminLogEntity, SystemSettingEntity]),
  ],
  providers: [AdminLogService, AdminGuard],
  exports: [AdminLogService, AdminGuard],
})
export class AdminModule {}
```

### 10. Migration

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdminTables1700000000000 implements MigrationInterface {
  name = 'CreateAdminTables1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Admin logs table
    await queryRunner.query(`
      CREATE TABLE "admin_logs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "admin_id" uuid NOT NULL,
        "action" varchar(100) NOT NULL,
        "entity_type" varchar(50),
        "entity_id" uuid,
        "old_data" jsonb,
        "new_data" jsonb,
        "ip_address" varchar(45),
        "user_agent" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_admin_logs" PRIMARY KEY ("id"),
        CONSTRAINT "FK_admin_logs_admin" FOREIGN KEY ("admin_id")
          REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_admin_logs_entity" ON "admin_logs" ("entity_type", "entity_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_admin_logs_created" ON "admin_logs" ("created_at" DESC)
    `);

    // System settings table
    await queryRunner.query(`
      CREATE TYPE "system_settings_category_enum" AS ENUM (
        'general', 'limits', 'features', 'payment', 'notifications'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "system_settings_data_type_enum" AS ENUM (
        'boolean', 'number', 'string', 'json'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "system_settings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "key" varchar(100) NOT NULL,
        "value" jsonb NOT NULL,
        "description" text,
        "category" "system_settings_category_enum" DEFAULT 'general',
        "data_type" "system_settings_data_type_enum" DEFAULT 'string',
        "is_public" boolean DEFAULT false,
        "updated_by" uuid,
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_system_settings" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_system_settings_key" UNIQUE ("key"),
        CONSTRAINT "FK_system_settings_updated_by" FOREIGN KEY ("updated_by")
          REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);

    // Seed default settings
    await queryRunner.query(`
      INSERT INTO "system_settings" ("key", "value", "description", "category", "data_type", "is_public")
      VALUES
        ('maintenance_mode', 'false', 'Enable maintenance mode', 'general', 'boolean', true),
        ('max_mock_tests_per_day', '5', 'Maximum mock tests per day for free users', 'limits', 'number', true),
        ('ai_grading_enabled', 'true', 'Enable AI grading feature', 'features', 'boolean', true),
        ('registration_enabled', 'true', 'Allow new user registration', 'general', 'boolean', true),
        ('default_user_role', '"student"', 'Default role for new users', 'general', 'string', false)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "system_settings"`);
    await queryRunner.query(`DROP TYPE "system_settings_data_type_enum"`);
    await queryRunner.query(`DROP TYPE "system_settings_category_enum"`);
    await queryRunner.query(`DROP INDEX "IDX_admin_logs_created"`);
    await queryRunner.query(`DROP INDEX "IDX_admin_logs_entity"`);
    await queryRunner.query(`DROP TABLE "admin_logs"`);
  }
}
```

---

## ✅ Acceptance Criteria

- [ ] AdminLog entity created with all fields
- [ ] SystemSetting entity with categories
- [ ] AdminGuard checks admin role
- [ ] Permission decorator works
- [ ] AdminLogService.log() creates entries
- [ ] AdminLogService.findAll() supports filters
- [ ] Migration runs successfully
- [ ] Default settings seeded

---

## 🧪 Test Cases

```typescript
describe('AdminGuard', () => {
  it('allows super_admin access', () => {
    // Set user with super_admin role
    // Verify guard returns true
  });

  it('allows admin access', () => {
    // Set user with admin role
    // Verify guard returns true
  });

  it('denies non-admin access', () => {
    // Set user with student role
    // Verify ForbiddenException thrown
  });

  it('checks specific permissions', () => {
    // Set required permission
    // Set user without that permission
    // Verify denied
  });
});

describe('AdminLogService', () => {
  it('creates audit log entry', async () => {
    // Call log()
    // Verify entry created
  });

  it('filters logs by entity', async () => {
    // Create logs for different entities
    // Filter by entityType
    // Verify correct logs returned
  });
});
```

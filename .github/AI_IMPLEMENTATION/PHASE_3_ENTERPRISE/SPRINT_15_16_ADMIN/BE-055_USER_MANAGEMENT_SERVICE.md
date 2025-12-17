# BE-055: User Management Service

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-055 |
| **Phase** | 3 - Enterprise |
| **Sprint** | 15-16 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 6h |
| **Dependencies** | BE-054 |

---

## 🎯 Objective

Implement admin user management capabilities:
- List users with advanced filters
- View user details with activity
- Update user information
- Ban/unban users
- Manage user roles
- Soft delete users

---

## 📝 Implementation

### 1. dto/user-query.dto.ts

```typescript
import { IsOptional, IsString, IsEnum, IsBoolean, IsInt, Min, Max, IsDateString } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum UserStatus {
  ACTIVE = 'active',
  BANNED = 'banned',
  DELETED = 'deleted',
}

export enum UserSortField {
  CREATED_AT = 'createdAt',
  NAME = 'name',
  EMAIL = 'email',
  LAST_LOGIN = 'lastLoginAt',
}

export class UserQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string; // Search in name, email

  @ApiPropertyOptional({ enum: UserStatus })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  createdFrom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  createdTo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  lastLoginFrom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  lastLoginTo?: string;

  @ApiPropertyOptional({ enum: UserSortField })
  @IsOptional()
  @IsEnum(UserSortField)
  sortBy?: UserSortField = UserSortField.CREATED_AT;

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
```

### 2. dto/update-user.dto.ts

```typescript
import { IsOptional, IsString, IsBoolean, IsArray, IsEmail, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AdminUpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  currentLevel?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  targetLevel?: string;
}

export class BanUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({ description: 'Duration in days, null for permanent' })
  @IsOptional()
  duration?: number;
}

export class UpdateUserRolesDto {
  @IsArray()
  @IsString({ each: true })
  roles: string[]; // ['student', 'teacher']
}
```

### 3. services/admin-users.service.ts

```typescript
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Between, In } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { RoleEntity } from '../../auth/entities/role.entity';
import { UserProfileEntity } from '../../users/entities/user-profile.entity';
import { AdminLogService } from './admin-logs.service';
import {
  UserQueryDto,
  UserStatus,
  UserSortField,
} from '../dto/user-query.dto';
import {
  AdminUpdateUserDto,
  BanUserDto,
  UpdateUserRolesDto,
} from '../dto/update-user.dto';

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly profileRepository: Repository<UserProfileEntity>,
    private readonly adminLogService: AdminLogService
  ) {}

  async findAll(query: UserQueryDto) {
    const {
      search,
      status,
      role,
      createdFrom,
      createdTo,
      lastLoginFrom,
      lastLoginTo,
      sortBy,
      sortOrder,
      page,
      limit,
    } = query;

    const qb = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.stats', 'stats');

    // Search
    if (search) {
      qb.andWhere(
        '(user.name ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Status filter
    if (status === UserStatus.BANNED) {
      qb.andWhere('user.isBanned = :isBanned', { isBanned: true });
    } else if (status === UserStatus.DELETED) {
      qb.withDeleted().andWhere('user.deletedAt IS NOT NULL');
    } else if (status === UserStatus.ACTIVE) {
      qb.andWhere('user.isBanned = :isBanned', { isBanned: false });
    }

    // Role filter
    if (role) {
      qb.andWhere('role.name = :role', { role });
    }

    // Date filters
    if (createdFrom && createdTo) {
      qb.andWhere('user.createdAt BETWEEN :createdFrom AND :createdTo', {
        createdFrom: new Date(createdFrom),
        createdTo: new Date(createdTo),
      });
    }

    if (lastLoginFrom && lastLoginTo) {
      qb.andWhere('user.lastLoginAt BETWEEN :lastLoginFrom AND :lastLoginTo', {
        lastLoginFrom: new Date(lastLoginFrom),
        lastLoginTo: new Date(lastLoginTo),
      });
    }

    // Sorting
    const sortField = `user.${sortBy || 'createdAt'}`;
    qb.orderBy(sortField, sortOrder || 'DESC');

    // Pagination
    const [items, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items: items.map(this.sanitizeUser),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'profile', 'stats', 'packages'],
      withDeleted: true,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.sanitizeUser(user);
  }

  async update(id: string, dto: AdminUpdateUserDto, adminId: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const oldData = { ...user, ...user.profile };

    // Update user fields
    if (dto.name) user.name = dto.name;
    if (dto.email) {
      // Check email uniqueness
      const existing = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('Email already in use');
      }
      user.email = dto.email;
    }
    if (dto.emailVerified !== undefined) {
      user.emailVerified = dto.emailVerified;
    }

    await this.userRepository.save(user);

    // Update profile fields
    if (user.profile && (dto.phone || dto.currentLevel || dto.targetLevel)) {
      if (dto.phone) user.profile.phone = dto.phone;
      if (dto.currentLevel) user.profile.currentLevel = dto.currentLevel;
      if (dto.targetLevel) user.profile.targetLevel = dto.targetLevel;
      await this.profileRepository.save(user.profile);
    }

    // Log action
    await this.adminLogService.log({
      adminId,
      action: 'user.update',
      entityType: 'user',
      entityId: id,
      oldData,
      newData: dto,
    });

    return this.findOne(id);
  }

  async ban(id: string, dto: BanUserDto, adminId: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isBanned) {
      throw new BadRequestException('User is already banned');
    }

    user.isBanned = true;
    user.banReason = dto.reason;
    user.bannedAt = new Date();
    
    if (dto.duration) {
      user.banExpiresAt = new Date(
        Date.now() + dto.duration * 24 * 60 * 60 * 1000
      );
    }

    await this.userRepository.save(user);

    await this.adminLogService.log({
      adminId,
      action: 'user.ban',
      entityType: 'user',
      entityId: id,
      newData: { reason: dto.reason, duration: dto.duration },
    });

    return { success: true, message: 'User banned successfully' };
  }

  async unban(id: string, adminId: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.isBanned) {
      throw new BadRequestException('User is not banned');
    }

    const oldData = {
      isBanned: user.isBanned,
      banReason: user.banReason,
      bannedAt: user.bannedAt,
    };

    user.isBanned = false;
    user.banReason = null;
    user.bannedAt = null;
    user.banExpiresAt = null;

    await this.userRepository.save(user);

    await this.adminLogService.log({
      adminId,
      action: 'user.unban',
      entityType: 'user',
      entityId: id,
      oldData,
    });

    return { success: true, message: 'User unbanned successfully' };
  }

  async updateRoles(id: string, dto: UpdateUserRolesDto, adminId: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const oldRoles = user.roles.map((r) => r.name);

    // Find roles
    const roles = await this.roleRepository.find({
      where: { name: In(dto.roles) },
    });

    if (roles.length !== dto.roles.length) {
      throw new BadRequestException('Some roles not found');
    }

    user.roles = roles;
    await this.userRepository.save(user);

    await this.adminLogService.log({
      adminId,
      action: 'user.roles.update',
      entityType: 'user',
      entityId: id,
      oldData: { roles: oldRoles },
      newData: { roles: dto.roles },
    });

    return this.findOne(id);
  }

  async softDelete(id: string, adminId: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.softDelete(id);

    await this.adminLogService.log({
      adminId,
      action: 'user.delete',
      entityType: 'user',
      entityId: id,
      oldData: { name: user.name, email: user.email },
    });

    return { success: true, message: 'User deleted successfully' };
  }

  async getActivity(id: string, page = 1, limit = 20) {
    // Get user's exam attempts, practice sessions, etc.
    // This would aggregate from multiple tables
    return {
      items: [],
      total: 0,
      page,
      limit,
    };
  }

  async getStats() {
    const total = await this.userRepository.count();
    const active = await this.userRepository.count({
      where: { isBanned: false },
    });
    const banned = await this.userRepository.count({
      where: { isBanned: true },
    });

    // Users created this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newThisMonth = await this.userRepository
      .createQueryBuilder('user')
      .where('user.createdAt >= :start', { start: startOfMonth })
      .getCount();

    return {
      total,
      active,
      banned,
      newThisMonth,
    };
  }

  private sanitizeUser(user: UserEntity) {
    // Remove sensitive fields
    const { password, refreshToken, ...rest } = user as any;
    return rest;
  }
}
```

### 4. controllers/admin-users.controller.ts

```typescript
import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { RequirePermissions } from '../decorators/permissions.decorator';
import { AdminPermission } from '../enums/admin-permissions.enum';
import { AdminUsersService } from '../services/admin-users.service';
import { UserQueryDto } from '../dto/user-query.dto';
import {
  AdminUpdateUserDto,
  BanUserDto,
  UpdateUserRolesDto,
} from '../dto/update-user.dto';

@ApiTags('Admin - Users')
@ApiBearerAuth()
@Controller('admin/users')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminUsersController {
  constructor(private readonly usersService: AdminUsersService) {}

  @Get()
  @ApiOperation({ summary: 'List users with filters' })
  @RequirePermissions(AdminPermission.VIEW_USERS)
  findAll(@Query() query: UserQueryDto) {
    return this.usersService.findAll(query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get user statistics' })
  @RequirePermissions(AdminPermission.VIEW_USERS)
  getStats() {
    return this.usersService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user details' })
  @RequirePermissions(AdminPermission.VIEW_USERS)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @RequirePermissions(AdminPermission.EDIT_USERS)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AdminUpdateUserDto,
    @Req() req: any
  ) {
    return this.usersService.update(id, dto, req.user.id);
  }

  @Post(':id/ban')
  @ApiOperation({ summary: 'Ban user' })
  @RequirePermissions(AdminPermission.BAN_USERS)
  ban(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: BanUserDto,
    @Req() req: any
  ) {
    return this.usersService.ban(id, dto, req.user.id);
  }

  @Post(':id/unban')
  @ApiOperation({ summary: 'Unban user' })
  @RequirePermissions(AdminPermission.BAN_USERS)
  unban(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.usersService.unban(id, req.user.id);
  }

  @Post(':id/roles')
  @ApiOperation({ summary: 'Update user roles' })
  @RequirePermissions(AdminPermission.MANAGE_ROLES)
  updateRoles(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserRolesDto,
    @Req() req: any
  ) {
    return this.usersService.updateRoles(id, dto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete user' })
  @RequirePermissions(AdminPermission.DELETE_USERS)
  delete(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.usersService.softDelete(id, req.user.id);
  }

  @Get(':id/activity')
  @ApiOperation({ summary: 'Get user activity' })
  @RequirePermissions(AdminPermission.VIEW_USERS)
  getActivity(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    return this.usersService.getActivity(id, page, limit);
  }
}
```

---

## ✅ Acceptance Criteria

- [ ] List users with pagination
- [ ] Search by name/email works
- [ ] Filter by status (active/banned/deleted)
- [ ] Filter by role works
- [ ] Sort by multiple fields
- [ ] View user details with relations
- [ ] Update user info works
- [ ] Ban user with reason & duration
- [ ] Unban user works
- [ ] Update roles works
- [ ] Soft delete works
- [ ] All actions logged to admin_logs
- [ ] Permissions checked for each action

---

## 🧪 Test Cases

```typescript
describe('AdminUsersController', () => {
  it('lists users with pagination', async () => {
    // Call GET /admin/users?page=1&limit=10
    // Verify paginated response
  });

  it('searches users by name', async () => {
    // Call GET /admin/users?search=John
    // Verify matching users returned
  });

  it('bans user successfully', async () => {
    // Call POST /admin/users/:id/ban
    // Verify user.isBanned = true
    // Verify admin log created
  });

  it('prevents non-admin access', async () => {
    // Set user without admin role
    // Call any endpoint
    // Verify 403 Forbidden
  });

  it('requires correct permission', async () => {
    // Set admin without DELETE_USERS permission
    // Call DELETE /admin/users/:id
    // Verify 403 Forbidden
  });
});
```

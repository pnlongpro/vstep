# BE-058: System Settings Service

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-058 |
| **Phase** | 3 - Enterprise |
| **Sprint** | 15-16 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 4h |
| **Dependencies** | BE-054 |

---

## 🎯 Objective

Implement system settings management:
- CRUD for key-value settings
- Settings by category
- Public settings for FE
- Setting validation
- Settings cache

---

## 📝 Implementation

### 1. dto/setting.dto.ts

```typescript
import { IsString, IsOptional, IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SettingCategory, SettingDataType } from '../entities/system-setting.entity';

export class CreateSettingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty()
  @IsNotEmpty()
  value: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: SettingCategory })
  @IsOptional()
  @IsEnum(SettingCategory)
  category?: SettingCategory;

  @ApiPropertyOptional({ enum: SettingDataType })
  @IsOptional()
  @IsEnum(SettingDataType)
  dataType?: SettingDataType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

export class UpdateSettingDto {
  @ApiProperty()
  @IsNotEmpty()
  value: any;
}
```

### 2. services/admin-settings.service.ts

```typescript
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import {
  SystemSettingEntity,
  SettingCategory,
  SettingDataType,
} from '../entities/system-setting.entity';
import { AdminLogService } from './admin-logs.service';
import { CreateSettingDto, UpdateSettingDto } from '../dto/setting.dto';

const SETTINGS_CACHE_KEY = 'system_settings';
const SETTINGS_CACHE_TTL = 3600; // 1 hour

@Injectable()
export class AdminSettingsService implements OnModuleInit {
  private settingsCache: Map<string, any> = new Map();

  constructor(
    @InjectRepository(SystemSettingEntity)
    private readonly settingRepo: Repository<SystemSettingEntity>,
    private readonly adminLogService: AdminLogService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async onModuleInit() {
    // Load settings into memory on startup
    await this.refreshCache();
  }

  async findAll(category?: SettingCategory) {
    const qb = this.settingRepo.createQueryBuilder('s');

    if (category) {
      qb.where('s.category = :category', { category });
    }

    qb.orderBy('s.category', 'ASC').addOrderBy('s.key', 'ASC');

    return qb.getMany();
  }

  async findPublic() {
    return this.settingRepo.find({
      where: { isPublic: true },
      select: ['key', 'value', 'dataType'],
    });
  }

  async findByKey(key: string) {
    // Check cache first
    if (this.settingsCache.has(key)) {
      return this.settingsCache.get(key);
    }

    const setting = await this.settingRepo.findOne({ where: { key } });
    if (!setting) {
      throw new NotFoundException(`Setting "${key}" not found`);
    }

    return setting;
  }

  async getValue(key: string, defaultValue?: any): Promise<any> {
    try {
      const setting = await this.findByKey(key);
      return this.parseValue(setting.value, setting.dataType);
    } catch (error) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      throw error;
    }
  }

  async create(dto: CreateSettingDto, adminId: string) {
    // Check if key already exists
    const existing = await this.settingRepo.findOne({
      where: { key: dto.key },
    });

    if (existing) {
      throw new BadRequestException(`Setting "${dto.key}" already exists`);
    }

    // Validate value based on data type
    this.validateValue(dto.value, dto.dataType || SettingDataType.STRING);

    const setting = this.settingRepo.create({
      ...dto,
      value: this.serializeValue(dto.value),
      updatedBy: adminId,
    });

    const saved = await this.settingRepo.save(setting);

    // Invalidate cache
    await this.refreshCache();

    await this.adminLogService.log({
      adminId,
      action: 'setting.create',
      entityType: 'setting',
      entityId: saved.id,
      newData: { key: dto.key, value: dto.value },
    });

    return saved;
  }

  async update(key: string, dto: UpdateSettingDto, adminId: string) {
    const setting = await this.settingRepo.findOne({ where: { key } });

    if (!setting) {
      throw new NotFoundException(`Setting "${key}" not found`);
    }

    const oldValue = setting.value;

    // Validate value based on data type
    this.validateValue(dto.value, setting.dataType);

    setting.value = this.serializeValue(dto.value);
    setting.updatedBy = adminId;

    await this.settingRepo.save(setting);

    // Invalidate cache
    await this.refreshCache();

    await this.adminLogService.log({
      adminId,
      action: 'setting.update',
      entityType: 'setting',
      entityId: setting.id,
      oldData: { key, value: oldValue },
      newData: { key, value: dto.value },
    });

    return setting;
  }

  async delete(key: string, adminId: string) {
    const setting = await this.settingRepo.findOne({ where: { key } });

    if (!setting) {
      throw new NotFoundException(`Setting "${key}" not found`);
    }

    await this.settingRepo.delete({ key });

    // Invalidate cache
    await this.refreshCache();

    await this.adminLogService.log({
      adminId,
      action: 'setting.delete',
      entityType: 'setting',
      entityId: setting.id,
      oldData: { key, value: setting.value },
    });

    return { success: true };
  }

  async bulkUpdate(
    settings: { key: string; value: any }[],
    adminId: string
  ) {
    const results: { key: string; success: boolean; error?: string }[] = [];

    for (const { key, value } of settings) {
      try {
        await this.update(key, { value }, adminId);
        results.push({ key, success: true });
      } catch (error: any) {
        results.push({ key, success: false, error: error.message });
      }
    }

    return results;
  }

  // ========== DEFAULT SETTINGS ==========

  async seedDefaultSettings() {
    const defaults: CreateSettingDto[] = [
      {
        key: 'maintenance_mode',
        value: false,
        description: 'Enable maintenance mode (blocks all user access)',
        category: SettingCategory.GENERAL,
        dataType: SettingDataType.BOOLEAN,
        isPublic: true,
      },
      {
        key: 'registration_enabled',
        value: true,
        description: 'Allow new user registration',
        category: SettingCategory.GENERAL,
        dataType: SettingDataType.BOOLEAN,
        isPublic: true,
      },
      {
        key: 'max_mock_tests_per_day_free',
        value: 3,
        description: 'Maximum mock tests per day for free users',
        category: SettingCategory.LIMITS,
        dataType: SettingDataType.NUMBER,
        isPublic: false,
      },
      {
        key: 'max_mock_tests_per_day_premium',
        value: 10,
        description: 'Maximum mock tests per day for premium users',
        category: SettingCategory.LIMITS,
        dataType: SettingDataType.NUMBER,
        isPublic: false,
      },
      {
        key: 'ai_grading_enabled',
        value: true,
        description: 'Enable AI grading for writing and speaking',
        category: SettingCategory.FEATURES,
        dataType: SettingDataType.BOOLEAN,
        isPublic: true,
      },
      {
        key: 'gamification_enabled',
        value: true,
        description: 'Enable XP, badges, and leaderboard',
        category: SettingCategory.FEATURES,
        dataType: SettingDataType.BOOLEAN,
        isPublic: true,
      },
      {
        key: 'payment_enabled',
        value: true,
        description: 'Enable payment processing',
        category: SettingCategory.PAYMENT,
        dataType: SettingDataType.BOOLEAN,
        isPublic: false,
      },
      {
        key: 'email_notifications_enabled',
        value: true,
        description: 'Send email notifications',
        category: SettingCategory.NOTIFICATIONS,
        dataType: SettingDataType.BOOLEAN,
        isPublic: false,
      },
      {
        key: 'site_name',
        value: 'VSTEPRO',
        description: 'Website name',
        category: SettingCategory.GENERAL,
        dataType: SettingDataType.STRING,
        isPublic: true,
      },
      {
        key: 'contact_email',
        value: 'support@vstepro.vn',
        description: 'Support email address',
        category: SettingCategory.GENERAL,
        dataType: SettingDataType.STRING,
        isPublic: true,
      },
    ];

    for (const setting of defaults) {
      const existing = await this.settingRepo.findOne({
        where: { key: setting.key },
      });

      if (!existing) {
        await this.settingRepo.save(
          this.settingRepo.create({
            ...setting,
            value: this.serializeValue(setting.value),
          })
        );
      }
    }

    await this.refreshCache();
  }

  // ========== HELPERS ==========

  private async refreshCache() {
    const settings = await this.settingRepo.find();
    this.settingsCache.clear();

    for (const setting of settings) {
      this.settingsCache.set(setting.key, setting);
    }

    // Also update Redis cache
    const cacheData = Object.fromEntries(this.settingsCache);
    await this.cacheManager.set(
      SETTINGS_CACHE_KEY,
      cacheData,
      SETTINGS_CACHE_TTL
    );
  }

  private validateValue(value: any, dataType: SettingDataType): void {
    switch (dataType) {
      case SettingDataType.BOOLEAN:
        if (typeof value !== 'boolean') {
          throw new BadRequestException('Value must be a boolean');
        }
        break;
      case SettingDataType.NUMBER:
        if (typeof value !== 'number' || isNaN(value)) {
          throw new BadRequestException('Value must be a number');
        }
        break;
      case SettingDataType.STRING:
        if (typeof value !== 'string') {
          throw new BadRequestException('Value must be a string');
        }
        break;
      case SettingDataType.JSON:
        if (typeof value !== 'object') {
          throw new BadRequestException('Value must be a JSON object');
        }
        break;
    }
  }

  private serializeValue(value: any): any {
    // For JSONB column, the value is already handled by TypeORM
    return value;
  }

  private parseValue(value: any, dataType: SettingDataType): any {
    // Value is already parsed from JSONB
    return value;
  }
}
```

### 3. controllers/admin-settings.controller.ts

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { RequirePermissions } from '../decorators/permissions.decorator';
import { AdminPermission } from '../enums/admin-permissions.enum';
import { AdminSettingsService } from '../services/admin-settings.service';
import { CreateSettingDto, UpdateSettingDto } from '../dto/setting.dto';
import { SettingCategory } from '../entities/system-setting.entity';

@ApiTags('Admin - Settings')
@ApiBearerAuth()
@Controller('admin/settings')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminSettingsController {
  constructor(private readonly settingsService: AdminSettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all settings' })
  @RequirePermissions(AdminPermission.VIEW_SETTINGS)
  findAll(@Query('category') category?: SettingCategory) {
    return this.settingsService.findAll(category);
  }

  @Get('public')
  @ApiOperation({ summary: 'Get public settings (no auth required)' })
  findPublic() {
    return this.settingsService.findPublic();
  }

  @Get(':key')
  @ApiOperation({ summary: 'Get setting by key' })
  @RequirePermissions(AdminPermission.VIEW_SETTINGS)
  findByKey(@Param('key') key: string) {
    return this.settingsService.findByKey(key);
  }

  @Post()
  @ApiOperation({ summary: 'Create new setting' })
  @RequirePermissions(AdminPermission.EDIT_SETTINGS)
  create(@Body() dto: CreateSettingDto, @Req() req: any) {
    return this.settingsService.create(dto, req.user.id);
  }

  @Put(':key')
  @ApiOperation({ summary: 'Update setting' })
  @RequirePermissions(AdminPermission.EDIT_SETTINGS)
  update(
    @Param('key') key: string,
    @Body() dto: UpdateSettingDto,
    @Req() req: any
  ) {
    return this.settingsService.update(key, dto, req.user.id);
  }

  @Delete(':key')
  @ApiOperation({ summary: 'Delete setting' })
  @RequirePermissions(AdminPermission.EDIT_SETTINGS)
  delete(@Param('key') key: string, @Req() req: any) {
    return this.settingsService.delete(key, req.user.id);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Bulk update settings' })
  @RequirePermissions(AdminPermission.EDIT_SETTINGS)
  bulkUpdate(
    @Body() dto: { settings: { key: string; value: any }[] },
    @Req() req: any
  ) {
    return this.settingsService.bulkUpdate(dto.settings, req.user.id);
  }

  @Post('seed')
  @ApiOperation({ summary: 'Seed default settings' })
  @RequirePermissions(AdminPermission.EDIT_SETTINGS)
  seed() {
    return this.settingsService.seedDefaultSettings();
  }
}
```

### 4. Public Settings Endpoint (No Auth)

```typescript
// In a public controller or add to existing settings controller
@Controller('settings')
export class PublicSettingsController {
  constructor(private readonly settingsService: AdminSettingsService) {}

  @Get('public')
  @ApiOperation({ summary: 'Get public settings' })
  getPublicSettings() {
    return this.settingsService.findPublic();
  }
}
```

---

## ✅ Acceptance Criteria

- [ ] List all settings with category filter
- [ ] Get single setting by key
- [ ] Create new setting with validation
- [ ] Update setting value
- [ ] Delete setting
- [ ] Bulk update settings
- [ ] Public settings endpoint (no auth)
- [ ] Settings cached in memory
- [ ] Settings changes logged
- [ ] Default settings seeded

---

## 🧪 Test Cases

```typescript
describe('AdminSettingsService', () => {
  it('creates setting with correct data type', async () => {
    // Create boolean setting
    // Verify value stored correctly
  });

  it('validates value against data type', async () => {
    // Try to set string for number type
    // Verify error thrown
  });

  it('caches settings on startup', async () => {
    // Verify cache populated
    // Check getValue returns from cache
  });

  it('invalidates cache on update', async () => {
    // Update setting
    // Verify cache refreshed
  });

  it('returns only public settings for public endpoint', async () => {
    // Create public and private settings
    // Call findPublic()
    // Verify only public returned
  });
});
```

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemSetting, SettingCategory } from '../entities/system-setting.entity';
import { CreateSystemSettingDto, UpdateSystemSettingDto } from '../dto/system-setting.dto';

@Injectable()
export class SystemSettingService {
  private cache: Map<string, any> = new Map();

  constructor(
    @InjectRepository(SystemSetting)
    private readonly settingRepository: Repository<SystemSetting>,
  ) {
    this.loadCache();
  }

  private async loadCache() {
    const settings = await this.settingRepository.find();
    settings.forEach((s) => this.cache.set(s.key, s.value));
  }

  async create(dto: CreateSystemSettingDto, userId: string): Promise<SystemSetting> {
    const existing = await this.settingRepository.findOne({ where: { key: dto.key } });
    if (existing) {
      throw new ConflictException(`Setting with key "${dto.key}" already exists`);
    }

    const setting = this.settingRepository.create({
      ...dto,
      updatedBy: userId,
    });
    const saved = await this.settingRepository.save(setting);
    this.cache.set(saved.key, saved.value);
    return saved;
  }

  async findAll(category?: SettingCategory, publicOnly = false) {
    const where: any = {};
    if (category) where.category = category;
    if (publicOnly) where.isPublic = true;

    return this.settingRepository.find({
      where,
      order: { category: 'ASC', key: 'ASC' },
    });
  }

  async findByKey(key: string): Promise<SystemSetting> {
    const setting = await this.settingRepository.findOne({ where: { key } });
    if (!setting) {
      throw new NotFoundException(`Setting "${key}" not found`);
    }
    return setting;
  }

  async getValue<T = any>(key: string, defaultValue?: T): Promise<T> {
    if (this.cache.has(key)) {
      return this.cache.get(key) as T;
    }

    try {
      const setting = await this.findByKey(key);
      this.cache.set(key, setting.value);
      return setting.value as T;
    } catch {
      return defaultValue as T;
    }
  }

  async update(key: string, dto: UpdateSystemSettingDto, userId: string): Promise<SystemSetting> {
    const setting = await this.findByKey(key);
    
    Object.assign(setting, dto, { updatedBy: userId });
    const saved = await this.settingRepository.save(setting);
    this.cache.set(key, saved.value);
    return saved;
  }

  async delete(key: string): Promise<void> {
    const setting = await this.findByKey(key);
    await this.settingRepository.remove(setting);
    this.cache.delete(key);
  }

  async getPublicSettings(): Promise<Record<string, any>> {
    const settings = await this.settingRepository.find({ where: { isPublic: true } });
    return settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {});
  }

  refreshCache(): void {
    this.loadCache();
  }
}

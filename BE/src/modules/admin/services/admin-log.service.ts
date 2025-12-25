import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { AdminLog } from '../entities/admin-log.entity';
import { CreateAdminLogDto, AdminLogFilterDto } from '../dto/admin-log.dto';

@Injectable()
export class AdminLogService {
  constructor(
    @InjectRepository(AdminLog)
    private readonly adminLogRepository: Repository<AdminLog>,
  ) {}

  async create(
    adminId: string,
    dto: CreateAdminLogDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AdminLog> {
    const log = this.adminLogRepository.create({
      adminId,
      ...dto,
      ipAddress,
      userAgent,
    });
    return this.adminLogRepository.save(log);
  }

  async findAll(filter: AdminLogFilterDto, page = 1, limit = 20) {
    const where: any = {};

    if (filter.action) {
      where.action = Like(`%${filter.action}%`);
    }
    if (filter.entityType) {
      where.entityType = filter.entityType;
    }
    if (filter.adminId) {
      where.adminId = filter.adminId;
    }
    if (filter.startDate && filter.endDate) {
      where.createdAt = Between(new Date(filter.startDate), new Date(filter.endDate));
    }

    const [items, total] = await this.adminLogRepository.findAndCount({
      where,
      relations: ['admin'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByEntity(entityType: string, entityId: string): Promise<AdminLog[]> {
    return this.adminLogRepository.find({
      where: { entityType, entityId },
      relations: ['admin'],
      order: { createdAt: 'DESC' },
    });
  }

  async getActionSummary(startDate: Date, endDate: Date) {
    const result = await this.adminLogRepository
      .createQueryBuilder('log')
      .select('log.action', 'action')
      .addSelect('COUNT(*)', 'count')
      .where('log.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('log.action')
      .getRawMany();

    return result;
  }
}

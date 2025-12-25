import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getDashboardStats() {
    const totalUsers = await this.userRepository.count();
    const activeUsers = await this.userRepository.count({ where: { status: 'active' as any } });
    
    const newUsersToday = await this.userRepository
      .createQueryBuilder('user')
      .where('DATE(user.createdAt) = CURDATE()')
      .getCount();

    const newUsersThisWeek = await this.userRepository
      .createQueryBuilder('user')
      .where('user.createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)')
      .getCount();

    const newUsersThisMonth = await this.userRepository
      .createQueryBuilder('user')
      .where('user.createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)')
      .getCount();

    return {
      totalUsers,
      activeUsers,
      newUsersToday,
      newUsersThisWeek,
      newUsersThisMonth,
    };
  }

  async getUserGrowth(days = 30) {
    const result = await this.userRepository
      .createQueryBuilder('user')
      .select("DATE(user.createdAt)", 'date')
      .addSelect('COUNT(*)', 'count')
      .where(`user.createdAt >= DATE_SUB(NOW(), INTERVAL ${days} DAY)`)
      .groupBy("DATE(user.createdAt)")
      .orderBy("DATE(user.createdAt)", 'ASC')
      .getRawMany();

    return result;
  }

  async getActivityMetrics(startDate: Date, endDate: Date) {
    // Placeholder for activity metrics - will be implemented with exam/practice data
    return {
      totalSessions: 0,
      avgSessionDuration: 0,
      peakHours: [],
    };
  }
}

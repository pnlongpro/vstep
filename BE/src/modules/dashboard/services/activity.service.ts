import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ActivityLog, ActivityType, ActivityCategory } from '../entities/activity-log.entity';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogRepo: Repository<ActivityLog>,
  ) {}

  async logActivity(data: {
    userId: string;
    type: ActivityType;
    category: ActivityCategory;
    title: string;
    description?: string;
    icon?: string;
    referenceType?: string;
    referenceId?: string;
    skill?: string;
    metadata?: Record<string, any>;
    xpEarned?: number;
  }): Promise<ActivityLog> {
    const activity = this.activityLogRepo.create(data);
    return this.activityLogRepo.save(activity);
  }

  async getRecentActivities(userId: string, page = 1, limit = 20, category?: string) {
    const where: any = { userId };
    if (category) {
      where.category = category;
    }

    const [items, total] = await this.activityLogRepo.findAndCount({
      where,
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

  async getActivityTimeline(userId: string, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const activities = await this.activityLogRepo
      .createQueryBuilder('activity')
      .where('activity.userId = :userId', { userId })
      .andWhere('activity.createdAt >= :startDate', { startDate })
      .orderBy('activity.createdAt', 'DESC')
      .getMany();

    const grouped: Record<string, ActivityLog[]> = {};
    activities.forEach(activity => {
      const date = activity.createdAt.toISOString().split('T')[0];
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(activity);
    });

    return grouped;
  }

  async getActivitySummary(userId: string, days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await this.activityLogRepo
      .createQueryBuilder('activity')
      .select('activity.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .where('activity.userId = :userId', { userId })
      .andWhere('activity.createdAt >= :startDate', { startDate })
      .groupBy('activity.category')
      .getRawMany();

    return result.reduce((acc, r) => {
      acc[r.category] = parseInt(r.count, 10);
      return acc;
    }, {} as Record<string, number>);
  }

  async logPracticeCompleted(userId: string, data: {
    sessionId: string;
    skill: string;
    score: number;
    xpEarned: number;
  }) {
    return this.logActivity({
      userId,
      type: ActivityType.PRACTICE_COMPLETED,
      category: ActivityCategory.PRACTICE,
      title: `Completed ${data.skill} practice`,
      description: `Score: ${data.score}`,
      skill: data.skill,
      referenceType: 'practice_session',
      referenceId: data.sessionId,
      xpEarned: data.xpEarned,
      icon: 'check-circle',
    });
  }

  async logExamCompleted(userId: string, data: {
    attemptId: string;
    score: number;
    xpEarned: number;
  }) {
    return this.logActivity({
      userId,
      type: ActivityType.EXAM_COMPLETED,
      category: ActivityCategory.EXAM,
      title: 'Completed mock exam',
      description: `Score: ${data.score}`,
      referenceType: 'exam_attempt',
      referenceId: data.attemptId,
      xpEarned: data.xpEarned,
      icon: 'award',
    });
  }

  async logBadgeEarned(userId: string, data: {
    badgeId: string;
    badgeName: string;
    xpEarned: number;
  }) {
    return this.logActivity({
      userId,
      type: ActivityType.BADGE_EARNED,
      category: ActivityCategory.ACHIEVEMENT,
      title: `Earned badge: ${data.badgeName}`,
      referenceType: 'achievement',
      referenceId: data.badgeId,
      xpEarned: data.xpEarned,
      icon: 'trophy',
    });
  }

  async logLevelUp(userId: string, newLevel: number, xpEarned: number) {
    return this.logActivity({
      userId,
      type: ActivityType.LEVEL_UP,
      category: ActivityCategory.ACHIEVEMENT,
      title: `Reached level ${newLevel}!`,
      description: 'Keep up the great work!',
      xpEarned,
      icon: 'star',
    });
  }
}

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Badge } from './entities/badge.entity';
import { UserBadge } from './entities/user-badge.entity';
import { Goal } from './entities/goal.entity';
import { LeaderboardEntry } from './entities/leaderboard-entry.entity';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GamificationService {
  constructor(
    @InjectRepository(Badge)
    private badgeRepository: Repository<Badge>,
    @InjectRepository(UserBadge)
    private userBadgeRepository: Repository<UserBadge>,
    @InjectRepository(Goal)
    private goalRepository: Repository<Goal>,
    @InjectRepository(LeaderboardEntry)
    private leaderboardRepository: Repository<LeaderboardEntry>,
  ) {}

  /**
   * Get all badges with unlock status
   */
  async getBadges(userId: string) {
    const allBadges = await this.badgeRepository.find({
      order: { category: 'ASC', rarity: 'ASC' },
    });

    const earnedBadges = await this.userBadgeRepository.find({
      where: { user_id: userId },
    });

    const earnedBadgeIds = new Set(earnedBadges.map(ub => ub.badge_id));

    const earned = allBadges
      .filter(b => earnedBadgeIds.has(b.id))
      .map(b => ({
        ...b,
        unlockedAt: earnedBadges.find(ub => ub.badge_id === b.id)?.unlocked_at,
      }));

    const available = allBadges.filter(b => !earnedBadgeIds.has(b.id));

    return {
      success: true,
      data: {
        earned,
        available,
        totalEarned: earned.length,
        totalAvailable: allBadges.length,
      },
    };
  }

  /**
   * Get earned badges only
   */
  async getEarnedBadges(userId: string) {
    const earnedBadges = await this.userBadgeRepository.find({
      where: { user_id: userId },
      relations: ['badge'],
      order: { unlocked_at: 'DESC' },
    });

    return {
      success: true,
      data: {
        badges: earnedBadges.map(ub => ({
          ...ub.badge,
          unlockedAt: ub.unlocked_at,
          progress: ub.progress,
        })),
      },
    };
  }

  /**
   * Check and unlock badges based on user stats
   */
  async checkBadgeUnlock(userId: string) {
    // TODO: Implement comprehensive badge checking logic
    // This would check user stats against all badge criteria
    // For now, return empty array
    
    const newlyUnlocked = [];
    
    return {
      success: true,
      data: {
        newlyUnlocked,
      },
    };
  }

  /**
   * Unlock a specific badge for user
   */
  async unlockBadge(userId: string, badgeId: string) {
    const badge = await this.badgeRepository.findOne({ where: { id: badgeId } });
    
    if (!badge) {
      throw new NotFoundException('Badge not found');
    }

    // Check if already unlocked
    const existing = await this.userBadgeRepository.findOne({
      where: { user_id: userId, badge_id: badgeId },
    });

    if (existing) {
      return {
        success: false,
        message: 'Badge already unlocked',
      };
    }

    const userBadge = this.userBadgeRepository.create({
      user_id: userId,
      badge_id: badgeId,
      unlocked_at: new Date(),
    });

    await this.userBadgeRepository.save(userBadge);

    // TODO: Create notification
    // TODO: Award points

    return {
      success: true,
      data: {
        badge,
        unlockedAt: userBadge.unlocked_at,
      },
    };
  }

  /**
   * Get user goals
   */
  async getGoals(userId: string, status?: string) {
    const query = this.goalRepository
      .createQueryBuilder('goal')
      .where('goal.user_id = :userId', { userId });

    if (status) {
      query.andWhere('goal.status = :status', { status });
    }

    const goals = await query
      .orderBy('goal.created_at', 'DESC')
      .getMany();

    // Calculate progress for each goal
    const goalsWithProgress = goals.map(g => {
      const progress = g.target_value > 0
        ? Math.min(100, (g.current_value / g.target_value) * 100)
        : 0;
      
      return {
        ...g,
        progress: Math.round(progress),
      };
    });

    return {
      success: true,
      data: {
        goals: goalsWithProgress,
      },
    };
  }

  /**
   * Create a new goal
   */
  async createGoal(userId: string, dto: CreateGoalDto) {
    const goal = this.goalRepository.create({
      user_id: userId,
      title: dto.title,
      description: dto.description,
      type: dto.type,
      target_value: dto.targetValue,
      current_value: 0,
      start_date: dto.startDate || new Date(),
      end_date: dto.endDate,
      status: 'active',
    });

    const saved = await this.goalRepository.save(goal);

    return {
      success: true,
      data: {
        goalId: saved.id,
        title: saved.title,
      },
    };
  }

  /**
   * Update goal
   */
  async updateGoal(goalId: string, userId: string, dto: UpdateGoalDto) {
    const goal = await this.goalRepository.findOne({
      where: { id: goalId, user_id: userId },
    });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    Object.assign(goal, dto);

    await this.goalRepository.save(goal);

    return {
      success: true,
      message: 'Goal updated successfully',
    };
  }

  /**
   * Delete goal
   */
  async deleteGoal(goalId: string, userId: string) {
    const goal = await this.goalRepository.findOne({
      where: { id: goalId, user_id: userId },
    });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    await this.goalRepository.remove(goal);

    return {
      success: true,
      message: 'Goal deleted successfully',
    };
  }

  /**
   * Abandon goal
   */
  async abandonGoal(goalId: string, userId: string) {
    const goal = await this.goalRepository.findOne({
      where: { id: goalId, user_id: userId },
    });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    goal.status = 'abandoned';
    await this.goalRepository.save(goal);

    return {
      success: true,
      message: 'Goal abandoned',
    };
  }

  /**
   * Get leaderboard
   */
  async getLeaderboard(
    userId: string,
    filters: { scope?: string; period?: string },
  ) {
    const period = filters.period || 'monthly';
    const scope = filters.scope || 'global';

    const query = this.leaderboardRepository
      .createQueryBuilder('entry')
      .leftJoinAndSelect('entry.user', 'user')
      .where('entry.period = :period', { period });

    // TODO: Apply scope filters (global, class, friends)

    const entries = await query
      .orderBy('entry.rank', 'ASC')
      .limit(100)
      .getMany();

    // Find user's rank
    const userEntry = entries.find(e => e.user_id === userId);
    const myRank = userEntry ? {
      rank: userEntry.rank,
      points: userEntry.points,
    } : null;

    return {
      success: true,
      data: {
        leaderboard: entries.map(e => ({
          rank: e.rank,
          userId: e.user.id,
          name: e.user.full_name,
          points: e.points,
          badgesCount: e.badges_count,
          avatar: e.user.avatar,
        })),
        myRank,
      },
    };
  }

  /**
   * Get user points
   */
  async getPoints(userId: string) {
    // TODO: Get from user_points table
    
    return {
      success: true,
      data: {
        totalPoints: 0,
        lifetimePoints: 0,
        currentMultiplier: 1.0,
      },
    };
  }

  /**
   * Update goal progress
   */
  async updateGoalProgress(userId: string, goalId: string, increment: number) {
    const goal = await this.goalRepository.findOne({
      where: { id: goalId, user_id: userId, status: 'active' },
    });

    if (!goal) {
      return;
    }

    goal.current_value += increment;

    // Check if goal completed
    if (goal.current_value >= goal.target_value) {
      goal.status = 'completed';
      goal.completed_at = new Date();
      
      // TODO: Create notification
      // TODO: Award bonus points
    }

    await this.goalRepository.save(goal);
  }
}

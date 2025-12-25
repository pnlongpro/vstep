import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserStreak } from '../entities/streak.entity';
import { XpService } from './xp.service';
import { XpSource } from '../entities/xp-transaction.entity';
import { AchievementService } from './achievement.service';
import { AchievementCategory } from '../entities/achievement.entity';

const STREAK_BONUS_XP = [0, 5, 10, 15, 25, 35, 50, 75, 100, 150];

@Injectable()
export class StreakService {
  constructor(
    @InjectRepository(UserStreak)
    private readonly streakRepo: Repository<UserStreak>,
    private readonly xpService: XpService,
    private readonly achievementService: AchievementService,
  ) {}

  async getOrCreate(userId: string): Promise<UserStreak> {
    let streak = await this.streakRepo.findOne({ where: { userId } });
    if (!streak) {
      streak = this.streakRepo.create({ userId });
      streak = await this.streakRepo.save(streak);
    }
    return streak;
  }

  async recordActivity(userId: string): Promise<{ streak: UserStreak; xpEarned: number }> {
    const streak = await this.getOrCreate(userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastDate = streak.lastActivityDate ? new Date(streak.lastActivityDate) : null;
    lastDate?.setHours(0, 0, 0, 0);

    if (lastDate && lastDate.getTime() === today.getTime()) {
      return { streak, xpEarned: 0 };
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastDate && lastDate.getTime() === yesterday.getTime()) {
      streak.currentStreak += 1;
    } else if (!lastDate || lastDate.getTime() < yesterday.getTime()) {
      if (!streak.freezeUsedToday && streak.streakFreezeCount > 0) {
        streak.freezeUsedToday = true;
        streak.streakFreezeCount -= 1;
      } else {
        streak.currentStreak = 1;
      }
    }

    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }

    streak.lastActivityDate = today;
    streak.freezeUsedToday = false;

    await this.streakRepo.save(streak);

    const bonusIndex = Math.min(streak.currentStreak - 1, STREAK_BONUS_XP.length - 1);
    const xpEarned = STREAK_BONUS_XP[bonusIndex] || 0;

    if (xpEarned > 0) {
      await this.xpService.addXp(userId, xpEarned, XpSource.STREAK, null, `${streak.currentStreak}-day streak bonus`);
    }

    await this.achievementService.checkAndUnlock(userId, AchievementCategory.STREAK, streak.currentStreak);

    return { streak, xpEarned };
  }

  async addStreakFreeze(userId: string, count = 1): Promise<UserStreak> {
    const streak = await this.getOrCreate(userId);
    streak.streakFreezeCount += count;
    return this.streakRepo.save(streak);
  }

  async getLeaderboard(limit = 10): Promise<UserStreak[]> {
    return this.streakRepo.find({
      relations: ['user'],
      order: { currentStreak: 'DESC' },
      take: limit,
    });
  }
}

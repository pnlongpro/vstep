import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaderboardEntry, LeaderboardPeriod } from '../entities/leaderboard.entity';
import { format, startOfWeek, startOfMonth } from 'date-fns';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(LeaderboardEntry)
    private readonly leaderboardRepo: Repository<LeaderboardEntry>,
  ) {}

  private getPeriodKey(period: LeaderboardPeriod, date = new Date()): string {
    switch (period) {
      case LeaderboardPeriod.DAILY:
        return format(date, 'yyyy-MM-dd');
      case LeaderboardPeriod.WEEKLY:
        return format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-'W'ww");
      case LeaderboardPeriod.MONTHLY:
        return format(startOfMonth(date), 'yyyy-MM');
      case LeaderboardPeriod.ALL_TIME:
        return 'all';
    }
  }

  async updateScore(
    userId: string,
    scoreIncrement: number,
    period: LeaderboardPeriod,
    isPractice = true,
  ): Promise<LeaderboardEntry> {
    const periodKey = this.getPeriodKey(period);

    let entry = await this.leaderboardRepo.findOne({
      where: { userId, period, periodKey },
    });

    if (!entry) {
      entry = this.leaderboardRepo.create({
        userId,
        period,
        periodKey,
        score: 0,
        practiceCount: 0,
        examCount: 0,
      });
    }

    entry.score += scoreIncrement;
    if (isPractice) {
      entry.practiceCount += 1;
    } else {
      entry.examCount += 1;
    }

    return this.leaderboardRepo.save(entry);
  }

  async getLeaderboard(
    period: LeaderboardPeriod,
    limit = 50,
    offset = 0,
  ): Promise<{ entries: LeaderboardEntry[]; total: number }> {
    const periodKey = this.getPeriodKey(period);

    const [entries, total] = await this.leaderboardRepo.findAndCount({
      where: { period, periodKey },
      relations: ['user'],
      order: { score: 'DESC' },
      take: limit,
      skip: offset,
    });

    return { entries, total };
  }

  async getUserRank(userId: string, period: LeaderboardPeriod): Promise<number | null> {
    const periodKey = this.getPeriodKey(period);

    const entry = await this.leaderboardRepo.findOne({
      where: { userId, period, periodKey },
    });

    if (!entry) return null;

    const rank = await this.leaderboardRepo
      .createQueryBuilder('lb')
      .where('lb.period = :period', { period })
      .andWhere('lb.periodKey = :periodKey', { periodKey })
      .andWhere('lb.score > :score', { score: entry.score })
      .getCount();

    return rank + 1;
  }

  async getUserStats(userId: string, period: LeaderboardPeriod) {
    const periodKey = this.getPeriodKey(period);

    const entry = await this.leaderboardRepo.findOne({
      where: { userId, period, periodKey },
    });

    const rank = await this.getUserRank(userId, period);

    return {
      score: entry?.score || 0,
      practiceCount: entry?.practiceCount || 0,
      examCount: entry?.examCount || 0,
      rank,
    };
  }
}

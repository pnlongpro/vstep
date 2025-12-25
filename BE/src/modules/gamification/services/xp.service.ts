import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { XpTransaction, XpSource } from '../entities/xp-transaction.entity';
import { UserStats } from '../../users/entities/user-stats.entity';

const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 1000, 2000, 4000, 7000, 11000, 16000,
  22000, 30000, 40000, 55000, 75000, 100000, 150000, 225000, 350000, 500000,
];

@Injectable()
export class XpService {
  constructor(
    @InjectRepository(XpTransaction)
    private readonly xpTransactionRepo: Repository<XpTransaction>,
    @InjectRepository(UserStats)
    private readonly userStatsRepo: Repository<UserStats>,
  ) {}

  async addXp(
    userId: string,
    amount: number,
    source: XpSource,
    sourceId?: string,
    description?: string,
  ): Promise<XpTransaction> {
    const transaction = this.xpTransactionRepo.create({
      userId,
      amount,
      source,
      sourceId,
      description,
    });
    await this.xpTransactionRepo.save(transaction);

    await this.updateUserTotalXp(userId);

    return transaction;
  }

  private async updateUserTotalXp(userId: string): Promise<void> {
    const totalXp = await this.getTotalXp(userId);
    const level = this.calculateLevel(totalXp);

    await this.userStatsRepo.update({ userId }, { xp: totalXp, level });
  }

  async getTotalXp(userId: string): Promise<number> {
    const result = await this.xpTransactionRepo
      .createQueryBuilder('xp')
      .select('SUM(xp.amount)', 'total')
      .where('xp.userId = :userId', { userId })
      .getRawOne();

    return parseInt(result?.total || '0', 10);
  }

  calculateLevel(xp: number): number {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (xp >= LEVEL_THRESHOLDS[i]) {
        return i + 1;
      }
    }
    return 1;
  }

  getXpForNextLevel(currentXp: number): { current: number; next: number; progress: number } {
    const level = this.calculateLevel(currentXp);
    const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
    const nextThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];

    return {
      current: currentXp - currentThreshold,
      next: nextThreshold - currentThreshold,
      progress: ((currentXp - currentThreshold) / (nextThreshold - currentThreshold)) * 100,
    };
  }

  async getXpHistory(userId: string, days = 30): Promise<XpTransaction[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.xpTransactionRepo.find({
      where: {
        userId,
        createdAt: Between(startDate, new Date()),
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getXpBySource(userId: string): Promise<Record<XpSource, number>> {
    const result = await this.xpTransactionRepo
      .createQueryBuilder('xp')
      .select('xp.source', 'source')
      .addSelect('SUM(xp.amount)', 'total')
      .where('xp.userId = :userId', { userId })
      .groupBy('xp.source')
      .getRawMany();

    const bySource: Partial<Record<XpSource, number>> = {};
    result.forEach((r) => {
      bySource[r.source as XpSource] = parseInt(r.total, 10);
    });

    return bySource as Record<XpSource, number>;
  }
}

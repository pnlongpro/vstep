import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement, AchievementCategory } from '../entities/achievement.entity';
import { UserAchievement } from '../entities/user-achievement.entity';
import { CreateAchievementDto, UpdateAchievementDto } from '../dto/achievement.dto';
import { XpService } from './xp.service';
import { XpSource } from '../entities/xp-transaction.entity';

@Injectable()
export class AchievementService {
  constructor(
    @InjectRepository(Achievement)
    private readonly achievementRepo: Repository<Achievement>,
    @InjectRepository(UserAchievement)
    private readonly userAchievementRepo: Repository<UserAchievement>,
    private readonly xpService: XpService,
  ) {}

  async create(dto: CreateAchievementDto): Promise<Achievement> {
    const achievement = this.achievementRepo.create(dto);
    return this.achievementRepo.save(achievement);
  }

  async findAll(category?: AchievementCategory): Promise<Achievement[]> {
    const where: any = {};
    if (category) where.category = category;
    return this.achievementRepo.find({
      where,
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  async findById(id: string): Promise<Achievement> {
    const achievement = await this.achievementRepo.findOne({ where: { id } });
    if (!achievement) throw new NotFoundException('Achievement not found');
    return achievement;
  }

  async update(id: string, dto: UpdateAchievementDto): Promise<Achievement> {
    const achievement = await this.findById(id);
    Object.assign(achievement, dto);
    return this.achievementRepo.save(achievement);
  }

  async delete(id: string): Promise<void> {
    const achievement = await this.findById(id);
    await this.achievementRepo.remove(achievement);
  }

  async getUserAchievements(userId: string) {
    const all = await this.achievementRepo.find({
      where: { isHidden: false },
      order: { sortOrder: 'ASC' },
    });

    const userAchievements = await this.userAchievementRepo.find({
      where: { userId },
      relations: ['achievement'],
    });

    const userMap = new Map(userAchievements.map((ua) => [ua.achievementId, ua]));

    return all.map((a) => ({
      ...a,
      progress: userMap.get(a.id)?.progress || 0,
      isUnlocked: userMap.get(a.id)?.isUnlocked || false,
      unlockedAt: userMap.get(a.id)?.unlockedAt,
    }));
  }

  async updateProgress(userId: string, achievementId: string, progress: number) {
    let userAchievement = await this.userAchievementRepo.findOne({
      where: { userId, achievementId },
    });

    if (!userAchievement) {
      userAchievement = this.userAchievementRepo.create({
        userId,
        achievementId,
        progress: 0,
      });
    }

    userAchievement.progress = progress;

    const achievement = await this.findById(achievementId);
    if (progress >= achievement.conditionValue && !userAchievement.isUnlocked) {
      userAchievement.isUnlocked = true;
      userAchievement.unlockedAt = new Date();

      if (achievement.xpReward > 0) {
        await this.xpService.addXp(userId, achievement.xpReward, XpSource.ACHIEVEMENT, achievementId, `Achievement: ${achievement.name}`);
      }
    }

    return this.userAchievementRepo.save(userAchievement);
  }

  async checkAndUnlock(userId: string, category: AchievementCategory, value: number) {
    const achievements = await this.achievementRepo.find({ where: { category } });

    for (const achievement of achievements) {
      if (value >= achievement.conditionValue) {
        await this.updateProgress(userId, achievement.id, value);
      }
    }
  }

  async getUnnotifiedAchievements(userId: string): Promise<UserAchievement[]> {
    const unnotified = await this.userAchievementRepo.find({
      where: { userId, isUnlocked: true, isNotified: false },
      relations: ['achievement'],
    });

    if (unnotified.length > 0) {
      await this.userAchievementRepo.update(
        { userId, isUnlocked: true, isNotified: false },
        { isNotified: true },
      );
    }

    return unnotified;
  }
}

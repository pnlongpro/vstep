import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Goal, GoalStatus, GoalType } from '../entities/goal.entity';
import { CreateGoalDto, UpdateGoalProgressDto } from '../dto/goal.dto';
import { XpService } from './xp.service';
import { XpSource } from '../entities/xp-transaction.entity';

@Injectable()
export class GoalService {
  constructor(
    @InjectRepository(Goal)
    private readonly goalRepo: Repository<Goal>,
    private readonly xpService: XpService,
  ) {}

  async create(userId: string, dto: CreateGoalDto): Promise<Goal> {
    const goal = this.goalRepo.create({
      userId,
      ...dto,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
    });
    return this.goalRepo.save(goal);
  }

  async findUserGoals(userId: string, status?: GoalStatus): Promise<Goal[]> {
    const where: any = { userId };
    if (status) where.status = status;
    return this.goalRepo.find({
      where,
      order: { endDate: 'ASC' },
    });
  }

  async findById(id: string): Promise<Goal> {
    const goal = await this.goalRepo.findOne({ where: { id } });
    if (!goal) throw new NotFoundException('Goal not found');
    return goal;
  }

  async updateProgress(id: string, dto: UpdateGoalProgressDto): Promise<Goal> {
    const goal = await this.findById(id);

    if (goal.status !== GoalStatus.ACTIVE) {
      throw new BadRequestException('Can only update active goals');
    }

    goal.currentValue = dto.progress;

    if (goal.currentValue >= goal.targetValue) {
      goal.status = GoalStatus.COMPLETED;
      if (goal.xpReward > 0) {
        await this.xpService.addXp(goal.userId, goal.xpReward, XpSource.GOAL, id, `Goal completed: ${goal.title}`);
      }
    }

    return this.goalRepo.save(goal);
  }

  async deleteGoal(id: string, userId: string): Promise<void> {
    const goal = await this.goalRepo.findOne({ where: { id, userId } });
    if (!goal) throw new NotFoundException('Goal not found');
    await this.goalRepo.remove(goal);
  }

  async checkExpiredGoals(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await this.goalRepo.update(
      {
        status: GoalStatus.ACTIVE,
        endDate: LessThanOrEqual(today),
      },
      { status: GoalStatus.FAILED },
    );

    return result.affected || 0;
  }

  async getActiveGoalsCount(userId: string): Promise<number> {
    return this.goalRepo.count({
      where: { userId, status: GoalStatus.ACTIVE },
    });
  }
}

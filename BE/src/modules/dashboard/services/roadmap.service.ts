import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LearningRoadmap, VstepLevel, RoadmapStatus } from '../entities/learning-roadmap.entity';
import { RoadmapMilestone, MilestoneStatus } from '../entities/roadmap-milestone.entity';
import { CreateRoadmapDto, UpdateRoadmapDto } from '../dto/dashboard.dto';
import { differenceInWeeks } from 'date-fns';

const LEVEL_ORDER = [VstepLevel.A2, VstepLevel.B1, VstepLevel.B2, VstepLevel.C1];
const LEVEL_SCORES = {
  [VstepLevel.A2]: 3.5,
  [VstepLevel.B1]: 5.0,
  [VstepLevel.B2]: 7.0,
  [VstepLevel.C1]: 8.5,
};

@Injectable()
export class RoadmapService {
  constructor(
    @InjectRepository(LearningRoadmap)
    private readonly roadmapRepo: Repository<LearningRoadmap>,
    @InjectRepository(RoadmapMilestone)
    private readonly milestoneRepo: Repository<RoadmapMilestone>,
  ) {}

  async create(userId: string, dto: CreateRoadmapDto): Promise<LearningRoadmap> {
    const existing = await this.roadmapRepo.findOne({ where: { userId } });
    if (existing) {
      throw new ConflictException('User already has a learning roadmap');
    }

    const roadmap = this.roadmapRepo.create({
      userId,
      currentLevel: dto.currentLevel,
      targetLevel: dto.targetLevel,
      targetDate: dto.targetDate ? new Date(dto.targetDate) : null,
      dailyGoalMinutes: dto.dailyGoalMinutes || 30,
      focusSkills: dto.focusSkills || ['reading', 'listening', 'writing', 'speaking'],
    });

    if (roadmap.targetDate) {
      roadmap.estimatedWeeks = differenceInWeeks(roadmap.targetDate, new Date());
    }

    const saved = await this.roadmapRepo.save(roadmap);
    await this.generateMilestones(saved);
    return saved;
  }

  async findByUserId(userId: string): Promise<LearningRoadmap> {
    const roadmap = await this.roadmapRepo.findOne({
      where: { userId },
    });
    if (!roadmap) {
      throw new NotFoundException('Learning roadmap not found');
    }
    return roadmap;
  }

  async findByUserIdWithMilestones(userId: string) {
    const roadmap = await this.findByUserId(userId);
    const milestones = await this.milestoneRepo.find({
      where: { roadmapId: roadmap.id },
      order: { order: 'ASC' },
    });
    return { ...roadmap, milestones };
  }

  async update(userId: string, dto: UpdateRoadmapDto): Promise<LearningRoadmap> {
    const roadmap = await this.findByUserId(userId);

    if (dto.targetLevel) roadmap.targetLevel = dto.targetLevel;
    if (dto.targetDate) roadmap.targetDate = new Date(dto.targetDate);
    if (dto.dailyGoalMinutes) roadmap.dailyGoalMinutes = dto.dailyGoalMinutes;
    if (dto.weeklyGoalTests) roadmap.weeklyGoalTests = dto.weeklyGoalTests;
    if (dto.focusSkills) roadmap.focusSkills = dto.focusSkills;

    if (roadmap.targetDate) {
      roadmap.estimatedWeeks = differenceInWeeks(roadmap.targetDate, new Date());
    }

    return this.roadmapRepo.save(roadmap);
  }

  async getWeeklyPlan(userId: string) {
    const roadmap = await this.findByUserId(userId);
    const milestones = await this.milestoneRepo.find({
      where: { roadmapId: roadmap.id, status: MilestoneStatus.IN_PROGRESS },
      order: { order: 'ASC' },
      take: 3,
    });

    const focusSkills = roadmap.focusSkills || ['reading', 'listening'];
    
    const weeklyTasks = [];
    
    focusSkills.forEach((skill, index) => {
      weeklyTasks.push({
        day: index + 1,
        skill,
        type: 'practice',
        title: `${skill.charAt(0).toUpperCase() + skill.slice(1)} Practice`,
        duration: roadmap.dailyGoalMinutes,
        completed: false,
      });
    });

    for (let i = 0; i < roadmap.weeklyGoalTests; i++) {
      weeklyTasks.push({
        day: focusSkills.length + i + 1,
        type: 'mock_test',
        title: 'Mock Test',
        duration: 120,
        completed: false,
      });
    }

    return {
      roadmap,
      currentMilestones: milestones,
      weeklyTasks: weeklyTasks.slice(0, 7),
      dailyGoalMinutes: roadmap.dailyGoalMinutes,
      weeklyGoalTests: roadmap.weeklyGoalTests,
    };
  }

  async updateProgress(userId: string, skillScores: Record<string, number>) {
    const roadmap = await this.findByUserId(userId);
    const milestones = await this.milestoneRepo.find({
      where: { roadmapId: roadmap.id },
      order: { order: 'ASC' },
    });

    let completedCount = 0;

    for (const milestone of milestones) {
      const score = skillScores[milestone.skill.toLowerCase()];
      if (score !== undefined) {
        milestone.currentScore = score;
        
        if (score >= milestone.targetScore && milestone.status !== MilestoneStatus.COMPLETED) {
          milestone.status = MilestoneStatus.COMPLETED;
          milestone.completedAt = new Date();
          completedCount++;
        } else if (milestone.status === MilestoneStatus.LOCKED && score > 0) {
          milestone.status = MilestoneStatus.IN_PROGRESS;
        }
      }
    }

    await this.milestoneRepo.save(milestones);

    roadmap.progressPercent = Math.round((milestones.filter(m => m.status === MilestoneStatus.COMPLETED).length / milestones.length) * 100);
    
    if (roadmap.progressPercent >= 100) {
      roadmap.status = RoadmapStatus.COMPLETED;
    }

    await this.roadmapRepo.save(roadmap);

    return { roadmap, completedMilestones: completedCount };
  }

  private async generateMilestones(roadmap: LearningRoadmap) {
    const skills = roadmap.focusSkills || ['reading', 'listening', 'writing', 'speaking'];
    const currentIndex = LEVEL_ORDER.indexOf(roadmap.currentLevel);
    const targetIndex = LEVEL_ORDER.indexOf(roadmap.targetLevel);
    
    const milestones: Partial<RoadmapMilestone>[] = [];
    let order = 0;

    for (let levelIdx = currentIndex; levelIdx <= targetIndex; levelIdx++) {
      const level = LEVEL_ORDER[levelIdx];
      const targetScore = LEVEL_SCORES[level];

      for (const skill of skills) {
        milestones.push({
          roadmapId: roadmap.id,
          title: `${level} ${skill.charAt(0).toUpperCase() + skill.slice(1)}`,
          description: `Achieve ${level} level in ${skill}`,
          skill,
          targetScore,
          order: order++,
          status: order === 1 ? MilestoneStatus.IN_PROGRESS : MilestoneStatus.LOCKED,
          xpReward: 100 + (levelIdx * 50),
        });
      }
    }

    await this.milestoneRepo.save(milestones);
  }
}

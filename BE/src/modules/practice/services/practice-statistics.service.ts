import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PracticeSession } from '../entities/practice-session.entity';
import { PracticeAnswer } from '../entities/practice-answer.entity';
import { SessionStatus } from '../../../shared/enums/practice.enum';
import { Skill, VstepLevel } from '../../../shared/enums/exam.enum';

export interface UserStatistics {
  totalSessions: number;
  completedSessions: number;
  totalTimeSpent: number; // seconds
  averageScore: number;
  bySkill: SkillStatistics[];
  recentActivity: RecentActivity[];
  streakDays: number;
}

export interface SkillStatistics {
  skill: Skill;
  sessionsCount: number;
  averageScore: number;
  bestScore: number;
  totalTimeSpent: number;
  lastPracticed: Date | null;
}

export interface RecentActivity {
  sessionId: string;
  skill: Skill;
  level: VstepLevel;
  score: number;
  completedAt: Date;
}

@Injectable()
export class PracticeStatisticsService {
  constructor(
    @InjectRepository(PracticeSession)
    private readonly sessionRepository: Repository<PracticeSession>,
    @InjectRepository(PracticeAnswer)
    private readonly answerRepository: Repository<PracticeAnswer>,
  ) {}

  async getUserStatistics(userId: string): Promise<UserStatistics> {
    // Get total sessions
    const totalSessions = await this.sessionRepository.count({
      where: { userId },
    });

    // Get completed sessions
    const completedSessions = await this.sessionRepository.count({
      where: { userId, status: SessionStatus.COMPLETED },
    });

    // Get aggregate stats
    const aggregateResult = await this.sessionRepository
      .createQueryBuilder('session')
      .select('SUM(session.timeSpent)', 'totalTime')
      .addSelect('AVG(session.score)', 'avgScore')
      .where('session.userId = :userId', { userId })
      .andWhere('session.status = :status', { status: SessionStatus.COMPLETED })
      .getRawOne();

    // Get stats by skill
    const bySkill = await this.getStatsBySkill(userId);

    // Get recent activity
    const recentActivity = await this.getRecentActivity(userId, 10);

    // Calculate streak (simplified)
    const streakDays = await this.calculateStreak(userId);

    return {
      totalSessions,
      completedSessions,
      totalTimeSpent: Number(aggregateResult?.totalTime) || 0,
      averageScore: Number(aggregateResult?.avgScore) || 0,
      bySkill,
      recentActivity,
      streakDays,
    };
  }

  async getStatsBySkill(userId: string): Promise<SkillStatistics[]> {
    const skills = Object.values(Skill);
    const results: SkillStatistics[] = [];

    for (const skill of skills) {
      const stats = await this.sessionRepository
        .createQueryBuilder('session')
        .select('COUNT(*)', 'count')
        .addSelect('AVG(session.score)', 'avgScore')
        .addSelect('MAX(session.score)', 'bestScore')
        .addSelect('SUM(session.timeSpent)', 'totalTime')
        .addSelect('MAX(session.completedAt)', 'lastPracticed')
        .where('session.userId = :userId', { userId })
        .andWhere('session.skill = :skill', { skill })
        .andWhere('session.status = :status', { status: SessionStatus.COMPLETED })
        .getRawOne();

      results.push({
        skill,
        sessionsCount: Number(stats?.count) || 0,
        averageScore: Number(stats?.avgScore) || 0,
        bestScore: Number(stats?.bestScore) || 0,
        totalTimeSpent: Number(stats?.totalTime) || 0,
        lastPracticed: stats?.lastPracticed || null,
      });
    }

    return results;
  }

  async getRecentActivity(userId: string, limit: number = 10): Promise<RecentActivity[]> {
    const sessions = await this.sessionRepository.find({
      where: { userId, status: SessionStatus.COMPLETED },
      order: { completedAt: 'DESC' },
      take: limit,
    });

    return sessions.map((s) => ({
      sessionId: s.id,
      skill: s.skill,
      level: s.level,
      score: Number(s.score) || 0,
      completedAt: s.completedAt,
    }));
  }

  async calculateStreak(userId: string): Promise<number> {
    // Get sessions completed in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sessions = await this.sessionRepository
      .createQueryBuilder('session')
      .select('DATE(session.completedAt)', 'date')
      .where('session.userId = :userId', { userId })
      .andWhere('session.status = :status', { status: SessionStatus.COMPLETED })
      .andWhere('session.completedAt >= :since', { since: thirtyDaysAgo })
      .groupBy('DATE(session.completedAt)')
      .orderBy('date', 'DESC')
      .getRawMany();

    if (sessions.length === 0) return 0;

    // Count consecutive days
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sessions.length; i++) {
      const sessionDate = new Date(sessions[i].date);
      sessionDate.setHours(0, 0, 0, 0);

      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);

      if (sessionDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  async getProgressOverTime(userId: string, days: number = 30): Promise<{ date: string; score: number }[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const results = await this.sessionRepository
      .createQueryBuilder('session')
      .select('DATE(session.completedAt)', 'date')
      .addSelect('AVG(session.score)', 'avgScore')
      .where('session.userId = :userId', { userId })
      .andWhere('session.status = :status', { status: SessionStatus.COMPLETED })
      .andWhere('session.completedAt >= :since', { since })
      .groupBy('DATE(session.completedAt)')
      .orderBy('date', 'ASC')
      .getRawMany();

    return results.map((r) => ({
      date: r.date,
      score: Number(r.avgScore) || 0,
    }));
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { UserStats } from '../../users/entities/user-stats.entity';
import { UserDailyStats } from '../entities/user-daily-stats.entity';
import { subDays, format, startOfDay, endOfDay } from 'date-fns';

export interface DashboardOverview {
  totalStudyMinutes: number;
  testsCompleted: number;
  practiceSessions: number;
  averageScore: number;
  currentStreak: number;
  longestStreak: number;
  xp: number;
  level: number;
  skillScores: {
    reading: number;
    listening: number;
    writing: number;
    speaking: number;
  };
  todayProgress: {
    studyMinutes: number;
    questionsAnswered: number;
    goalPercent: number;
  };
}

export interface WeeklySummary {
  totalStudyMinutes: number;
  testsCompleted: number;
  practiceSessions: number;
  xpEarned: number;
  averageScore: number;
  comparedToLastWeek: {
    studyMinutes: number;
    score: number;
  };
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(UserStats)
    private readonly userStatsRepo: Repository<UserStats>,
    @InjectRepository(UserDailyStats)
    private readonly dailyStatsRepo: Repository<UserDailyStats>,
  ) {}

  async getOverview(userId: string): Promise<DashboardOverview> {
    const stats = await this.userStatsRepo.findOne({ where: { userId } });
    const today = new Date();
    const todayStats = await this.dailyStatsRepo.findOne({
      where: { userId, date: format(today, 'yyyy-MM-dd') as any },
    });

    const dailyGoalMinutes = 30;

    return {
      totalStudyMinutes: stats?.totalHours ? Math.round(stats.totalHours * 60) : 0,
      testsCompleted: stats?.testsCompleted || 0,
      practiceSessions: 0,
      averageScore: stats?.averageScore || 0,
      currentStreak: stats?.currentStreak || 0,
      longestStreak: stats?.longestStreak || 0,
      xp: stats?.xp || 0,
      level: stats?.level || 1,
      skillScores: {
        reading: stats?.readingScore || 0,
        listening: stats?.listeningScore || 0,
        writing: stats?.writingScore || 0,
        speaking: stats?.speakingScore || 0,
      },
      todayProgress: {
        studyMinutes: todayStats?.studyMinutes || 0,
        questionsAnswered: todayStats?.questionsAnswered || 0,
        goalPercent: Math.min(100, Math.round(((todayStats?.studyMinutes || 0) / dailyGoalMinutes) * 100)),
      },
    };
  }

  async getWeeklySummary(userId: string): Promise<WeeklySummary> {
    const today = new Date();
    const weekStart = subDays(today, 7);
    const lastWeekStart = subDays(today, 14);

    const thisWeek = await this.dailyStatsRepo.find({
      where: {
        userId,
        date: Between(format(weekStart, 'yyyy-MM-dd'), format(today, 'yyyy-MM-dd')) as any,
      },
    });

    const lastWeek = await this.dailyStatsRepo.find({
      where: {
        userId,
        date: Between(format(lastWeekStart, 'yyyy-MM-dd'), format(weekStart, 'yyyy-MM-dd')) as any,
      },
    });

    const thisWeekStudy = thisWeek.reduce((sum, d) => sum + (d.studyMinutes || 0), 0);
    const lastWeekStudy = lastWeek.reduce((sum, d) => sum + (d.studyMinutes || 0), 0);

    const thisWeekScores = thisWeek.filter(d => d.readingScore || d.listeningScore);
    const avgThisWeek = thisWeekScores.length > 0
      ? thisWeekScores.reduce((sum, d) => sum + ((d.readingScore || 0) + (d.listeningScore || 0)) / 2, 0) / thisWeekScores.length
      : 0;

    const lastWeekScores = lastWeek.filter(d => d.readingScore || d.listeningScore);
    const avgLastWeek = lastWeekScores.length > 0
      ? lastWeekScores.reduce((sum, d) => sum + ((d.readingScore || 0) + (d.listeningScore || 0)) / 2, 0) / lastWeekScores.length
      : 0;

    return {
      totalStudyMinutes: thisWeekStudy,
      testsCompleted: thisWeek.reduce((sum, d) => sum + (d.examCount || 0), 0),
      practiceSessions: thisWeek.reduce((sum, d) => sum + (d.practiceCount || 0), 0),
      xpEarned: thisWeek.reduce((sum, d) => sum + (d.xpEarned || 0), 0),
      averageScore: avgThisWeek,
      comparedToLastWeek: {
        studyMinutes: lastWeekStudy > 0 ? Math.round(((thisWeekStudy - lastWeekStudy) / lastWeekStudy) * 100) : 0,
        score: avgLastWeek > 0 ? Math.round(((avgThisWeek - avgLastWeek) / avgLastWeek) * 100) : 0,
      },
    };
  }

  async getCalendarData(userId: string, startDate: Date, endDate: Date) {
    const dailyStats = await this.dailyStatsRepo.find({
      where: {
        userId,
        date: Between(format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')) as any,
      },
      order: { date: 'ASC' },
    });

    return dailyStats.map(d => ({
      date: format(d.date, 'yyyy-MM-dd'),
      studyMinutes: d.studyMinutes,
      hasActivity: d.hasActivity,
      practiceCount: d.practiceCount,
      examCount: d.examCount,
      xpEarned: d.xpEarned,
    }));
  }

  async getSkillProgress(userId: string, days = 30) {
    const today = new Date();
    const startDate = subDays(today, days);

    const dailyStats = await this.dailyStatsRepo.find({
      where: {
        userId,
        date: Between(format(startDate, 'yyyy-MM-dd'), format(today, 'yyyy-MM-dd')) as any,
      },
      order: { date: 'ASC' },
    });

    return {
      reading: dailyStats.filter(d => d.readingScore).map(d => ({ date: format(d.date, 'yyyy-MM-dd'), score: d.readingScore })),
      listening: dailyStats.filter(d => d.listeningScore).map(d => ({ date: format(d.date, 'yyyy-MM-dd'), score: d.listeningScore })),
      writing: dailyStats.filter(d => d.writingScore).map(d => ({ date: format(d.date, 'yyyy-MM-dd'), score: d.writingScore })),
      speaking: dailyStats.filter(d => d.speakingScore).map(d => ({ date: format(d.date, 'yyyy-MM-dd'), score: d.speakingScore })),
    };
  }

  async recordDailyActivity(userId: string, data: Partial<UserDailyStats>): Promise<UserDailyStats> {
    const today = format(new Date(), 'yyyy-MM-dd');
    
    let dailyStat = await this.dailyStatsRepo.findOne({
      where: { userId, date: today as any },
    });

    if (!dailyStat) {
      dailyStat = this.dailyStatsRepo.create({
        userId,
        date: today as any,
      });
    }

    if (data.studyMinutes) dailyStat.studyMinutes += data.studyMinutes;
    if (data.practiceCount) dailyStat.practiceCount += data.practiceCount;
    if (data.examCount) dailyStat.examCount += data.examCount;
    if (data.questionsAnswered) dailyStat.questionsAnswered += data.questionsAnswered;
    if (data.correctAnswers) dailyStat.correctAnswers += data.correctAnswers;
    if (data.xpEarned) dailyStat.xpEarned += data.xpEarned;
    if (data.readingScore) dailyStat.readingScore = data.readingScore;
    if (data.listeningScore) dailyStat.listeningScore = data.listeningScore;
    if (data.writingScore) dailyStat.writingScore = data.writingScore;
    if (data.speakingScore) dailyStat.speakingScore = data.speakingScore;
    dailyStat.hasActivity = true;

    return this.dailyStatsRepo.save(dailyStat);
  }
}

import { apiClient } from '@/lib/axios';

// Dashboard Overview Types
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

// Activity Types
export interface Activity {
  id: string;
  type: string;
  category: string;
  title: string;
  description?: string;
  icon?: string;
  skill?: string;
  xpEarned: number;
  createdAt: string;
  referenceType?: string;
  referenceId?: string;
}

export interface ActivityResponse {
  items: Activity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Calendar Types
export interface CalendarDay {
  date: string;
  studyMinutes: number;
  hasActivity: boolean;
  practiceCount: number;
  examCount: number;
  xpEarned: number;
}

// Skill Progress Types
export interface SkillDataPoint {
  date: string;
  score: number;
}

export interface SkillProgress {
  reading: SkillDataPoint[];
  listening: SkillDataPoint[];
  writing: SkillDataPoint[];
  speaking: SkillDataPoint[];
}

// Roadmap Types
export type VstepLevel = 'A2' | 'B1' | 'B2' | 'C1';
export type MilestoneStatus = 'locked' | 'in_progress' | 'completed';

export interface RoadmapMilestone {
  id: string;
  title: string;
  description?: string;
  skill: string;
  targetScore: number;
  currentScore: number;
  order: number;
  status: MilestoneStatus;
  completedAt?: string;
  xpReward: number;
}

export interface LearningRoadmap {
  id: string;
  userId: string;
  currentLevel: VstepLevel;
  targetLevel: VstepLevel;
  targetDate?: string;
  dailyGoalMinutes: number;
  weeklyGoalTests: number;
  focusSkills: string[];
  status: 'active' | 'completed' | 'paused';
  estimatedWeeks?: number;
  progressPercent: number;
  milestones?: RoadmapMilestone[];
}

export interface WeeklyTask {
  day: number;
  skill?: string;
  type: 'practice' | 'mock_test';
  title: string;
  duration: number;
  completed: boolean;
}

export interface WeeklyPlan {
  roadmap: LearningRoadmap;
  currentMilestones: RoadmapMilestone[];
  weeklyTasks: WeeklyTask[];
  dailyGoalMinutes: number;
  weeklyGoalTests: number;
}

export interface CreateRoadmapRequest {
  currentLevel: VstepLevel;
  targetLevel: VstepLevel;
  targetDate?: string;
  dailyGoalMinutes?: number;
  focusSkills?: string[];
}

export interface UpdateRoadmapRequest {
  targetLevel?: VstepLevel;
  targetDate?: string;
  dailyGoalMinutes?: number;
  weeklyGoalTests?: number;
  focusSkills?: string[];
}

class DashboardService {
  // ==================== Dashboard Overview ====================

  /**
   * Get dashboard overview with all key stats
   */
  async getOverview(): Promise<DashboardOverview> {
    const response = await apiClient.get('/dashboard/overview');
    return response.data;
  }

  /**
   * Get weekly summary with comparison to last week
   */
  async getWeeklySummary(): Promise<WeeklySummary> {
    const response = await apiClient.get('/dashboard/weekly-summary');
    return response.data;
  }

  // ==================== Calendar & Progress ====================

  /**
   * Get activity calendar data
   */
  async getCalendar(startDate?: string, endDate?: string): Promise<CalendarDay[]> {
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await apiClient.get('/dashboard/calendar', { params });
    return response.data;
  }

  /**
   * Get skill progress over time
   */
  async getSkillProgress(days = 30): Promise<SkillProgress> {
    const response = await apiClient.get('/dashboard/skill-progress', {
      params: { days },
    });
    return response.data;
  }

  // ==================== Activity Feed ====================

  /**
   * Get recent activities with pagination
   */
  async getActivities(page = 1, limit = 20, category?: string): Promise<ActivityResponse> {
    const params: Record<string, any> = { page, limit };
    if (category) params.category = category;
    const response = await apiClient.get('/activity', { params });
    return response.data;
  }

  /**
   * Get activity timeline grouped by date
   */
  async getActivityTimeline(days = 30): Promise<Record<string, Activity[]>> {
    const response = await apiClient.get('/activity/timeline', {
      params: { days },
    });
    return response.data;
  }

  /**
   * Get activity summary by category
   */
  async getActivitySummary(days = 7): Promise<Record<string, number>> {
    const response = await apiClient.get('/activity/summary', {
      params: { days },
    });
    return response.data;
  }

  // ==================== Learning Roadmap ====================

  /**
   * Get user's learning roadmap with milestones
   */
  async getRoadmap(): Promise<LearningRoadmap> {
    const response = await apiClient.get('/roadmap');
    return response.data;
  }

  /**
   * Create a new learning roadmap
   */
  async createRoadmap(data: CreateRoadmapRequest): Promise<LearningRoadmap> {
    const response = await apiClient.post('/roadmap', data);
    return response.data;
  }

  /**
   * Update learning roadmap
   */
  async updateRoadmap(data: UpdateRoadmapRequest): Promise<LearningRoadmap> {
    const response = await apiClient.put('/roadmap', data);
    return response.data;
  }

  /**
   * Get weekly study plan based on roadmap
   */
  async getWeeklyPlan(): Promise<WeeklyPlan> {
    const response = await apiClient.get('/roadmap/weekly-plan');
    return response.data;
  }
}

export const dashboardService = new DashboardService();

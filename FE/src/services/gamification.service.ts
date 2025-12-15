import { apiClient } from '@/lib/axios';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  criteria: any;
  rarity: string;
  points: number;
  unlockedAt?: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  type: string;
  targetValue: number;
  currentValue: number;
  startDate: string;
  endDate: string;
  status: string;
  completedAt?: string;
  progress: number;
}

export interface CreateGoalRequest {
  title: string;
  description?: string;
  type: string;
  targetValue: number;
  startDate?: string;
  endDate: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  points: number;
  badgesCount: number;
  avatar?: string;
}

class GamificationService {
  /**
   * Lấy danh sách badges
   */
  async getBadges() {
    const response = await apiClient.get('/gamification/badges');
    return response.data;
  }

  /**
   * Lấy badges đã unlock
   */
  async getEarnedBadges() {
    const response = await apiClient.get('/gamification/badges/earned');
    return response.data;
  }

  /**
   * Kiểm tra badges mới unlock
   */
  async checkBadgeUnlock() {
    const response = await apiClient.post('/gamification/badges/check');
    return response.data;
  }

  /**
   * Lấy danh sách goals
   */
  async getGoals(status?: string) {
    const params = status ? { status } : {};
    const response = await apiClient.get('/gamification/goals', { params });
    return response.data;
  }

  /**
   * Tạo goal mới
   */
  async createGoal(data: CreateGoalRequest) {
    const response = await apiClient.post('/gamification/goals', data);
    return response.data;
  }

  /**
   * Cập nhật goal
   */
  async updateGoal(goalId: string, data: Partial<CreateGoalRequest>) {
    const response = await apiClient.put(`/gamification/goals/${goalId}`, data);
    return response.data;
  }

  /**
   * Xóa goal
   */
  async deleteGoal(goalId: string) {
    const response = await apiClient.delete(`/gamification/goals/${goalId}`);
    return response.data;
  }

  /**
   * Bỏ goal (abandon)
   */
  async abandonGoal(goalId: string) {
    const response = await apiClient.post(
      `/gamification/goals/${goalId}/abandon`
    );
    return response.data;
  }

  /**
   * Xem bảng xếp hạng
   */
  async getLeaderboard(params?: { scope?: string; period?: string }) {
    const response = await apiClient.get('/gamification/leaderboards', {
      params,
    });
    return response.data;
  }

  /**
   * Lấy điểm gamification
   */
  async getPoints() {
    const response = await apiClient.get('/gamification/points');
    return response.data;
  }
}

export const gamificationService = new GamificationService();
export default gamificationService;

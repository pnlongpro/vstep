import { BookOpen, Headphones, PenTool, Mic, Trophy, Target, Clock, Calendar, TrendingUp, Flame } from 'lucide-react';

export type GoalType = 'skill' | 'quantity' | 'time' | 'tests' | 'streak' | 'score';
export type GoalPeriod = 'daily' | 'weekly' | 'monthly';
export type SkillType = 'listening' | 'reading' | 'writing' | 'speaking' | 'all';

export type IconName = 'BookOpen' | 'Headphones' | 'PenTool' | 'Mic' | 'Trophy' | 'Target' | 'Clock' | 'Calendar' | 'TrendingUp' | 'Flame';

// Icon mapping
export const ICON_MAP: Record<IconName, any> = {
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Trophy,
  Target,
  Clock,
  Calendar,
  TrendingUp,
  Flame,
};

export interface Goal {
  id: string;
  type: GoalType;
  skill?: SkillType;
  targetValue: number;
  currentValue: number;
  period: GoalPeriod;
  title: string;
  description: string;
  icon: IconName;
  color: string;
  unit: string;
  createdAt: string;
  lastReset: string;
  isCompleted: boolean;
}

export const GOAL_TEMPLATES = {
  skill: [
    {
      skill: 'listening' as SkillType,
      title: 'Luyện Listening hàng ngày',
      description: '1 bài mỗi ngày',
      targetValue: 1,
      period: 'daily' as GoalPeriod,
      icon: 'Headphones' as IconName,
      color: 'from-green-500 to-emerald-600',
      unit: 'bài',
    },
    {
      skill: 'reading' as SkillType,
      title: 'Luyện Reading đều đặn',
      description: '1 bài mỗi ngày',
      targetValue: 1,
      period: 'daily' as GoalPeriod,
      icon: 'BookOpen' as IconName,
      color: 'from-blue-500 to-cyan-600',
      unit: 'bài',
    },
    {
      skill: 'writing' as SkillType,
      title: 'Luyện Writing mỗi tuần',
      description: '2 bài mỗi tuần',
      targetValue: 2,
      period: 'weekly' as GoalPeriod,
      icon: 'PenTool' as IconName,
      color: 'from-purple-500 to-pink-600',
      unit: 'bài',
    },
    {
      skill: 'speaking' as SkillType,
      title: 'Luyện Speaking mỗi tuần',
      description: '1 buổi mỗi tuần',
      targetValue: 1,
      period: 'weekly' as GoalPeriod,
      icon: 'Mic' as IconName,
      color: 'from-orange-500 to-red-600',
      unit: 'buổi',
    },
  ],
  quantity: [
    {
      title: 'Hoàn thành đề trong tuần',
      description: '5 đề mỗi tuần',
      targetValue: 5,
      period: 'weekly' as GoalPeriod,
      icon: 'Trophy' as IconName,
      color: 'from-yellow-500 to-orange-600',
      unit: 'đề',
    },
    {
      title: 'Hoàn thành đề trong tháng',
      description: '20 đề mỗi tháng',
      targetValue: 20,
      period: 'monthly' as GoalPeriod,
      icon: 'Trophy' as IconName,
      color: 'from-purple-500 to-indigo-600',
      unit: 'đề',
    },
  ],
  time: [
    {
      title: 'Học đều đặn mỗi ngày',
      description: '30 phút mỗi ngày',
      targetValue: 30,
      period: 'daily' as GoalPeriod,
      icon: 'Clock' as IconName,
      color: 'from-blue-400 to-blue-600',
      unit: 'phút',
    },
    {
      title: 'Đạt giờ học mỗi tuần',
      description: '2 giờ mỗi tuần',
      targetValue: 120,
      period: 'weekly' as GoalPeriod,
      icon: 'Clock' as IconName,
      color: 'from-cyan-500 to-blue-600',
      unit: 'phút',
    },
  ],
  streak: [
    {
      title: 'Giữ nhịp học tập',
      description: 'Học liên tục 3 ngày',
      targetValue: 3,
      period: 'daily' as GoalPeriod,
      icon: 'Flame' as IconName,
      color: 'from-orange-400 to-red-500',
      unit: 'ngày',
    },
    {
      title: 'Kỷ luật cao',
      description: 'Học liên tục 7 ngày',
      targetValue: 7,
      period: 'daily' as GoalPeriod,
      icon: 'Calendar' as IconName,
      color: 'from-red-500 to-pink-600',
      unit: 'ngày',
    },
  ],
  score: [
    {
      skill: 'listening' as SkillType,
      title: 'Nâng cao Listening',
      description: 'Đạt điểm ≥ 70%',
      targetValue: 70,
      period: 'weekly' as GoalPeriod,
      icon: 'TrendingUp' as IconName,
      color: 'from-green-400 to-emerald-600',
      unit: '%',
    },
    {
      skill: 'reading' as SkillType,
      title: 'Nâng cao Reading',
      description: 'Đạt điểm ≥ 80%',
      targetValue: 80,
      period: 'weekly' as GoalPeriod,
      icon: 'TrendingUp' as IconName,
      color: 'from-blue-400 to-cyan-600',
      unit: '%',
    },
  ],
};

// Get user's goals from localStorage
export function getUserGoals(): Goal[] {
  const saved = localStorage.getItem('vstep_user_goals');
  return saved ? JSON.parse(saved) : [];
}

// Save goals to localStorage
function saveGoals(goals: Goal[]): void {
  localStorage.setItem('vstep_user_goals', JSON.stringify(goals));
}

// Create a new goal
export function createGoal(
  type: GoalType,
  targetValue: number,
  period: GoalPeriod,
  title: string,
  description: string,
  skill?: SkillType,
  icon: IconName = 'Target',
  color: string = 'from-blue-500 to-purple-600',
  unit: string = 'bài'
): Goal {
  const goals = getUserGoals();
  
  const newGoal: Goal = {
    id: `goal_${Date.now()}`,
    type,
    skill,
    targetValue,
    currentValue: 0,
    period,
    title,
    description,
    icon,
    color,
    unit,
    createdAt: new Date().toISOString(),
    lastReset: new Date().toISOString(),
    isCompleted: false,
  };

  goals.push(newGoal);
  saveGoals(goals);
  
  return newGoal;
}

// Update goal progress
export function updateGoalProgress(goalId: string, incrementBy: number = 1): Goal | null {
  const goals = getUserGoals();
  const goalIndex = goals.findIndex(g => g.id === goalId);
  
  if (goalIndex === -1) return null;

  goals[goalIndex].currentValue += incrementBy;
  
  // Check if completed
  if (goals[goalIndex].currentValue >= goals[goalIndex].targetValue) {
    goals[goalIndex].isCompleted = true;
  }

  saveGoals(goals);
  return goals[goalIndex];
}

// Delete a goal
export function deleteGoal(goalId: string): void {
  const goals = getUserGoals();
  const filtered = goals.filter(g => g.id !== goalId);
  saveGoals(filtered);
}

// Reset goals based on period
export function resetGoalsIfNeeded(): void {
  const goals = getUserGoals();
  const now = new Date();
  let updated = false;

  goals.forEach(goal => {
    const lastReset = new Date(goal.lastReset);
    let shouldReset = false;

    if (goal.period === 'daily') {
      // Reset if it's a new day
      shouldReset = now.toDateString() !== lastReset.toDateString();
    } else if (goal.period === 'weekly') {
      // Reset if it's a new week (Monday)
      const daysSinceReset = Math.floor((now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24));
      const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday
      const lastResetDay = lastReset.getDay();
      
      shouldReset = daysSinceReset >= 7 || (currentDay === 1 && lastResetDay !== 1);
    } else if (goal.period === 'monthly') {
      // Reset if it's a new month
      shouldReset = now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear();
    }

    if (shouldReset) {
      goal.currentValue = 0;
      goal.isCompleted = false;
      goal.lastReset = now.toISOString();
      updated = true;
    }
  });

  if (updated) {
    saveGoals(goals);
  }
}

// Auto-update goals when user completes an exercise
export function autoUpdateGoals(
  skill: SkillType,
  studyTime: number = 0, // in minutes
  score?: number
): Goal[] {
  resetGoalsIfNeeded();
  
  const goals = getUserGoals();
  const updatedGoals: Goal[] = [];

  goals.forEach(goal => {
    if (goal.isCompleted) return; // Skip completed goals

    let shouldUpdate = false;
    let incrementValue = 1;

    // Update skill-based goals
    if (goal.type === 'skill' && goal.skill === skill) {
      shouldUpdate = true;
    }

    // Update quantity-based goals (tests completed)
    if (goal.type === 'quantity') {
      shouldUpdate = true;
    }

    // Update time-based goals
    if (goal.type === 'time' && studyTime > 0) {
      shouldUpdate = true;
      incrementValue = studyTime;
    }

    // Update streak goals (handled separately in badge system)
    // We'll just increment if user studied today
    if (goal.type === 'streak') {
      const today = new Date().toDateString();
      const lastStudy = localStorage.getItem('vstep_last_study_date');
      
      if (lastStudy !== today) {
        shouldUpdate = true;
      }
    }

    // Update score-based goals
    if (goal.type === 'score' && score !== undefined) {
      if (goal.skill === skill || goal.skill === 'all') {
        // Update with highest score achieved
        if (score > goal.currentValue) {
          goal.currentValue = score;
          if (score >= goal.targetValue) {
            goal.isCompleted = true;
          }
          updatedGoals.push(goal);
        }
        return; // Don't use normal increment logic
      }
    }

    if (shouldUpdate) {
      goal.currentValue = Math.min(goal.currentValue + incrementValue, goal.targetValue);
      
      if (goal.currentValue >= goal.targetValue) {
        goal.isCompleted = true;
      }
      
      updatedGoals.push(goal);
    }
  });

  saveGoals(goals);
  return updatedGoals;
}

// Get goals by status
export function getActiveGoals(): Goal[] {
  resetGoalsIfNeeded();
  return getUserGoals().filter(g => !g.isCompleted);
}

export function getCompletedGoals(): Goal[] {
  return getUserGoals().filter(g => g.isCompleted);
}

// Get goals by type
export function getGoalsByType(type: GoalType): Goal[] {
  return getUserGoals().filter(g => g.type === type);
}

// Get today's goals
export function getTodayGoals(): Goal[] {
  resetGoalsIfNeeded();
  return getUserGoals().filter(g => g.period === 'daily' && !g.isCompleted);
}

// Get weekly goals
export function getWeeklyGoals(): Goal[] {
  resetGoalsIfNeeded();
  return getUserGoals().filter(g => g.period === 'weekly' && !g.isCompleted);
}

// Calculate overall progress
export function getOverallProgress(): number {
  const goals = getUserGoals();
  if (goals.length === 0) return 0;
  
  const completedCount = goals.filter(g => g.isCompleted).length;
  return Math.round((completedCount / goals.length) * 100);
}
import { Award, Trophy, Target, Star, Zap, Crown, Medal, BookOpen, Headphones, PenTool, Mic, TrendingUp, Calendar, Flame } from 'lucide-react';

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  category: 'learning' | 'skill' | 'streak' | 'score';
  condition: string;
}

export const ALL_BADGES: BadgeDefinition[] = [
  // A. Theo hành vi học tập
  {
    id: 'new-starter',
    name: 'New Starter',
    description: 'Hoàn thành đề thi đầu tiên',
    icon: Star,
    color: 'from-blue-400 to-blue-600',
    category: 'learning',
    condition: 'complete_1_test',
  },
  {
    id: 'cham-chi',
    name: 'Chăm chỉ',
    description: 'Hoàn thành 5 đề thi',
    icon: Trophy,
    color: 'from-green-400 to-green-600',
    category: 'learning',
    condition: 'complete_5_tests',
  },
  {
    id: 'but-toc',
    name: 'Bứt tốc',
    description: 'Hoàn thành 10 đề thi',
    icon: Zap,
    color: 'from-yellow-400 to-yellow-600',
    category: 'learning',
    condition: 'complete_10_tests',
  },
  {
    id: 'vo-dich',
    name: 'Vô địch luyện đề',
    description: 'Hoàn thành 20 đề thi',
    icon: Crown,
    color: 'from-purple-400 to-purple-600',
    category: 'learning',
    condition: 'complete_20_tests',
  },

  // B. Theo kỹ năng
  {
    id: 'nghe-tot',
    name: 'Nghe tốt',
    description: 'Hoàn thành 3 bài Listening',
    icon: Headphones,
    color: 'from-green-500 to-emerald-600',
    category: 'skill',
    condition: 'complete_3_listening',
  },
  {
    id: 'doc-hieu-vung',
    name: 'Đọc hiểu vững',
    description: 'Hoàn thành 3 bài Reading',
    icon: BookOpen,
    color: 'from-blue-500 to-cyan-600',
    category: 'skill',
    condition: 'complete_3_reading',
  },
  {
    id: 'viet-chuan',
    name: 'Viết chuẩn',
    description: 'Hoàn thành 3 bài Writing',
    icon: PenTool,
    color: 'from-purple-500 to-pink-600',
    category: 'skill',
    condition: 'complete_3_writing',
  },
  {
    id: 'tu-tin-noi',
    name: 'Tự tin nói',
    description: 'Hoàn thành 3 bài Speaking',
    icon: Mic,
    color: 'from-orange-500 to-red-600',
    category: 'skill',
    condition: 'complete_3_speaking',
  },

  // C. Theo chuỗi ngày học
  {
    id: 'giu-nhip',
    name: 'Giữ nhịp',
    description: '3 ngày học liên tục',
    icon: Flame,
    color: 'from-orange-400 to-red-500',
    category: 'streak',
    condition: 'streak_3_days',
  },
  {
    id: 'ky-luat-cao',
    name: 'Kỷ luật cao',
    description: '7 ngày học liên tục',
    icon: Calendar,
    color: 'from-red-500 to-pink-600',
    category: 'streak',
    condition: 'streak_7_days',
  },
  {
    id: 'sieu-cham-chi',
    name: 'Siêu chăm chỉ',
    description: '14 ngày học liên tục',
    icon: Medal,
    color: 'from-pink-500 to-purple-600',
    category: 'streak',
    condition: 'streak_14_days',
  },

  // D. Theo điểm số
  {
    id: 'vuot-chuan',
    name: 'Vượt chuẩn',
    description: 'Đạt điểm trên 70%',
    icon: TrendingUp,
    color: 'from-cyan-500 to-blue-600',
    category: 'score',
    condition: 'score_70',
  },
  {
    id: 'xuat-sac',
    name: 'Xuất sắc',
    description: 'Đạt điểm trên 90%',
    icon: Award,
    color: 'from-yellow-400 to-orange-500',
    category: 'score',
    condition: 'score_90',
  },
  {
    id: 'hoan-hao',
    name: 'Hoàn hảo',
    description: 'Đạt 100% trong 1 đề thi',
    icon: Target,
    color: 'from-purple-600 to-pink-600',
    category: 'score',
    condition: 'score_100',
  },
];

interface UserBadge {
  id: string;
  unlockedAt: string;
}

// Get user's unlocked badges
export function getUserBadges(): UserBadge[] {
  const saved = localStorage.getItem('vstep_user_badges');
  return saved ? JSON.parse(saved) : [];
}

// Check if badge is already unlocked
export function isBadgeUnlocked(badgeId: string): boolean {
  const userBadges = getUserBadges();
  return userBadges.some(b => b.id === badgeId);
}

// Unlock a badge (returns true if newly unlocked, false if already unlocked)
export function unlockBadge(badgeId: string): boolean {
  if (isBadgeUnlocked(badgeId)) {
    return false; // Already unlocked
  }

  const userBadges = getUserBadges();
  const newBadge: UserBadge = {
    id: badgeId,
    unlockedAt: new Date().toISOString(),
  };

  userBadges.push(newBadge);
  localStorage.setItem('vstep_user_badges', JSON.stringify(userBadges));

  return true; // Newly unlocked
}

// Get badge definition by ID
export function getBadgeById(badgeId: string): BadgeDefinition | null {
  return ALL_BADGES.find(b => b.id === badgeId) || null;
}

// Check and unlock badges based on user stats
export interface UserStats {
  completedTests: number;
  completedReading: number;
  completedListening: number;
  completedWriting: number;
  completedSpeaking: number;
  currentStreak: number;
  highestScore: number;
  perfectScoreCount: number;
}

export function checkAndUnlockBadges(stats: UserStats): BadgeDefinition[] {
  const newlyUnlocked: BadgeDefinition[] = [];

  // Check learning badges
  if (stats.completedTests >= 1 && unlockBadge('new-starter')) {
    newlyUnlocked.push(getBadgeById('new-starter')!);
  }
  if (stats.completedTests >= 5 && unlockBadge('cham-chi')) {
    newlyUnlocked.push(getBadgeById('cham-chi')!);
  }
  if (stats.completedTests >= 10 && unlockBadge('but-toc')) {
    newlyUnlocked.push(getBadgeById('but-toc')!);
  }
  if (stats.completedTests >= 20 && unlockBadge('vo-dich')) {
    newlyUnlocked.push(getBadgeById('vo-dich')!);
  }

  // Check skill badges
  if (stats.completedListening >= 3 && unlockBadge('nghe-tot')) {
    newlyUnlocked.push(getBadgeById('nghe-tot')!);
  }
  if (stats.completedReading >= 3 && unlockBadge('doc-hieu-vung')) {
    newlyUnlocked.push(getBadgeById('doc-hieu-vung')!);
  }
  if (stats.completedWriting >= 3 && unlockBadge('viet-chuan')) {
    newlyUnlocked.push(getBadgeById('viet-chuan')!);
  }
  if (stats.completedSpeaking >= 3 && unlockBadge('tu-tin-noi')) {
    newlyUnlocked.push(getBadgeById('tu-tin-noi')!);
  }

  // Check streak badges
  if (stats.currentStreak >= 3 && unlockBadge('giu-nhip')) {
    newlyUnlocked.push(getBadgeById('giu-nhip')!);
  }
  if (stats.currentStreak >= 7 && unlockBadge('ky-luat-cao')) {
    newlyUnlocked.push(getBadgeById('ky-luat-cao')!);
  }
  if (stats.currentStreak >= 14 && unlockBadge('sieu-cham-chi')) {
    newlyUnlocked.push(getBadgeById('sieu-cham-chi')!);
  }

  // Check score badges
  if (stats.highestScore >= 70 && unlockBadge('vuot-chuan')) {
    newlyUnlocked.push(getBadgeById('vuot-chuan')!);
  }
  if (stats.highestScore >= 90 && unlockBadge('xuat-sac')) {
    newlyUnlocked.push(getBadgeById('xuat-sac')!);
  }
  if (stats.perfectScoreCount >= 1 && unlockBadge('hoan-hao')) {
    newlyUnlocked.push(getBadgeById('hoan-hao')!);
  }

  return newlyUnlocked;
}

// Get user stats from localStorage
export function getUserStats(): UserStats {
  const saved = localStorage.getItem('vstep_user_stats');
  if (saved) {
    return JSON.parse(saved);
  }

  // Default stats
  return {
    completedTests: 0,
    completedReading: 0,
    completedListening: 0,
    completedWriting: 0,
    completedSpeaking: 0,
    currentStreak: 0,
    highestScore: 0,
    perfectScoreCount: 0,
  };
}

// Update user stats
export function updateUserStats(updates: Partial<UserStats>): void {
  const currentStats = getUserStats();
  const newStats = { ...currentStats, ...updates };
  localStorage.setItem('vstep_user_stats', JSON.stringify(newStats));
}

// Increment completed test count
export function incrementCompletedTests(skill: 'reading' | 'listening' | 'writing' | 'speaking', score?: number): BadgeDefinition[] {
  const stats = getUserStats();
  stats.completedTests += 1;

  // Increment skill-specific count
  if (skill === 'reading') stats.completedReading += 1;
  if (skill === 'listening') stats.completedListening += 1;
  if (skill === 'writing') stats.completedWriting += 1;
  if (skill === 'speaking') stats.completedSpeaking += 1;

  // Update high score
  if (score !== undefined) {
    if (score > stats.highestScore) {
      stats.highestScore = score;
    }
    if (score === 100) {
      stats.perfectScoreCount += 1;
    }
  }

  // Update streak (simplified - just check if user studied today)
  const today = new Date().toDateString();
  const lastStudy = localStorage.getItem('vstep_last_study_date');
  
  if (lastStudy !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastStudy === yesterday.toDateString()) {
      stats.currentStreak += 1;
    } else {
      stats.currentStreak = 1;
    }
    
    localStorage.setItem('vstep_last_study_date', today);
  }

  updateUserStats(stats);

  // Check for new badges
  return checkAndUnlockBadges(stats);
}

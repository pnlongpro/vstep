import { useState, useEffect } from 'react';
import {
  BarChart3,
  BookOpen,
  Clock,
  Trophy,
  Lightbulb,
  Target,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// Import tab components
import { OverviewTab } from './statistics/OverviewTab';
import { CourseProgressTab } from './statistics/CourseProgressTab';
import { StudyTimeTab } from './statistics/StudyTimeTab';
import { ExercisePerformanceTab } from './statistics/ExercisePerformanceTab';
import { TestHistoryTab } from './statistics/TestHistoryTab';
import { RecommendationsTab } from './statistics/RecommendationsTab';
import { GamificationTab } from './statistics/GamificationTab';

interface StatisticsProps {
  onBack: () => void;
}

type TabType = 'overview' | 'courses' | 'time' | 'performance' | 'tests' | 'recommendations' | 'gamification';

interface TabConfig {
  type: TabType;
  title: string;
  icon: typeof BarChart3;
  color: string;
  bgColor: string;
  borderColor: string;
}

export function Statistics({ onBack }: StatisticsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // Load statistics from localStorage and generate comprehensive mock data
    const examHistory = JSON.parse(localStorage.getItem('exam_history') || '[]');
    const generatedStats = generateStatistics(examHistory);
    setStats(generatedStats);
  }, []);

  const tabs: TabConfig[] = [
    {
      type: 'overview',
      title: 'Tổng quan',
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      type: 'courses',
      title: 'Tiến độ khóa học',
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      type: 'time',
      title: 'Thời gian học',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      type: 'performance',
      title: 'Hiệu suất bài tập',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      type: 'tests',
      title: 'Lịch sử test',
      icon: Trophy,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    {
      type: 'recommendations',
      title: 'Gợi ý học tập',
      icon: Lightbulb,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
    },
    {
      type: 'gamification',
      title: 'Huy hiệu & KPI',
      icon: Target,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
    },
  ];

  const generateStatistics = (examHistory: any[]) => {
    return {
      // Overview Tab Data
      overview: {
        gpa: 7.5,
        completionRate: 85,
        totalCourses: 12,
        completedCourses: 10,
        activeCourses: 2,
        totalStudyHours: 45,
        avgDailyMinutes: 65,
        currentStreak: 12,
        longestStreak: 25,
        totalPractices: 127,
        weeklyPractices: 15,
        recentAchievements: [
          {
            title: '7 ngày liên tiếp',
            description: 'Hoàn thành streak 7 ngày',
            date: '2 ngày trước',
            color: 'orange',
          },
          {
            title: '100 bài luyện tập',
            description: 'Đạt mốc 100 bài tập hoàn thành',
            date: '5 ngày trước',
            color: 'blue',
          },
          {
            title: 'GPA 7.5+',
            description: 'Đạt mức GPA trên 7.5',
            date: '1 tuần trước',
            color: 'purple',
          },
        ],
      },
      gpaHistory: [
        { month: 'T9', gpa: 6.8 },
        { month: 'T10', gpa: 7.0 },
        { month: 'T11', gpa: 7.3 },
        { month: 'T12', gpa: 7.5 },
      ],

      // Course Progress Tab Data
      courses: [
        {
          id: 1,
          title: 'VSTEP Reading B2',
          skill: 'Reading',
          level: 'B2',
          progress: 85,
          completedLessons: 17,
          totalLessons: 20,
          currentScore: 7.8,
          totalTime: 12,
          attempts: 45,
          lastAccess: '2 giờ trước',
          targetScore: 8.0,
          recentActivity: [
            { lesson: 'Multiple Choice - Advanced', score: 8.5, date: 'Hôm nay' },
            { lesson: 'True/False/Not Given', score: 7.5, date: 'Hôm qua' },
            { lesson: 'Matching Headings', score: 8.0, date: '2 ngày trước' },
          ],
        },
        {
          id: 2,
          title: 'VSTEP Listening B2',
          skill: 'Listening',
          level: 'B2',
          progress: 70,
          completedLessons: 14,
          totalLessons: 20,
          currentScore: 7.2,
          totalTime: 10,
          attempts: 38,
          lastAccess: '1 ngày trước',
          targetScore: 7.5,
          recentActivity: [
            { lesson: 'Long Conversation', score: 7.5, date: '1 ngày trước' },
            { lesson: 'Short Talk', score: 7.0, date: '3 ngày trước' },
            { lesson: 'Academic Lecture', score: 7.2, date: '4 ngày trước' },
          ],
        },
        {
          id: 3,
          title: 'VSTEP Writing B1',
          skill: 'Writing',
          level: 'B1',
          progress: 60,
          completedLessons: 12,
          totalLessons: 20,
          currentScore: 6.8,
          totalTime: 15,
          attempts: 24,
          lastAccess: '3 ngày trước',
          targetScore: 7.0,
          recentActivity: [
            { lesson: 'Opinion Essay', score: 7.0, date: '3 ngày trước' },
            { lesson: 'Formal Letter', score: 6.5, date: '5 ngày trước' },
            { lesson: 'Argumentative Essay', score: 6.8, date: '1 tuần trước' },
          ],
        },
        {
          id: 4,
          title: 'VSTEP Speaking B2',
          skill: 'Speaking',
          level: 'B2',
          progress: 75,
          completedLessons: 15,
          totalLessons: 20,
          currentScore: 7.5,
          totalTime: 8,
          attempts: 20,
          lastAccess: '1 ngày trước',
          targetScore: 8.0,
          recentActivity: [
            { lesson: 'Part 2 - Long Turn', score: 7.8, date: '1 ngày trước' },
            { lesson: 'Part 3 - Discussion', score: 7.5, date: '2 ngày trước' },
            { lesson: 'Part 1 - Interview', score: 7.3, date: '4 ngày trước' },
          ],
        },
      ],

      // Study Time Tab Data
      studyTime: {
        summary: {
          today: 85,
          thisWeek: 420,
          avgDaily: 65,
          thisMonth: 45,
        },
        daily: [
          { label: '4/12', minutes: 45 },
          { label: '5/12', minutes: 80 },
          { label: '6/12', minutes: 30 },
          { label: '7/12', minutes: 95 },
          { label: '8/12', minutes: 60 },
          { label: '9/12', minutes: 75 },
          { label: '10/12', minutes: 85 },
        ],
        weekly: [
          { label: 'Tuần 1', minutes: 350 },
          { label: 'Tuần 2', minutes: 420 },
          { label: 'Tuần 3', minutes: 380 },
          { label: 'Tuần 4', minutes: 450 },
        ],
        monthly: [
          { label: 'T9', minutes: 1200 },
          { label: 'T10', minutes: 1450 },
          { label: 'T11', minutes: 1350 },
          { label: 'T12', minutes: 1500 },
        ],
        bySkill: [
          { skill: 'Reading', hours: 12 },
          { skill: 'Listening', hours: 10 },
          { skill: 'Writing', hours: 15 },
          { skill: 'Speaking', hours: 8 },
        ],
        peakHours: [
          { time: '6-9h', sessions: 15, percentage: 25 },
          { time: '9-12h', sessions: 8, percentage: 13 },
          { time: '12-15h', sessions: 5, percentage: 8 },
          { time: '15-18h', sessions: 12, percentage: 20 },
          { time: '18-21h', sessions: 18, percentage: 30 },
          { time: '21-24h', sessions: 2, percentage: 4 },
        ],
        consistency: {
          score: 85,
          label: 'Rất tốt - Bạn học đều đặn!',
          weekPattern: [
            { label: 'T2', studied: true, minutes: 65 },
            { label: 'T3', studied: true, minutes: 80 },
            { label: 'T4', studied: true, minutes: 45 },
            { label: 'T5', studied: true, minutes: 90 },
            { label: 'T6', studied: true, minutes: 75 },
            { label: 'T7', studied: false, minutes: 0 },
            { label: 'CN', studied: true, minutes: 65 },
          ],
          insight:
            'Bạn học đều đặn 6/7 ngày trong tuần. Hãy cố gắng duy trì thói quen này!',
        },
        recentSessions: [
          {
            activity: 'Reading Practice',
            course: 'VSTEP Reading B2',
            duration: '45 phút',
            date: 'Hôm nay, 14:30',
          },
          {
            activity: 'Listening Test',
            course: 'VSTEP Listening B2',
            duration: '30 phút',
            date: 'Hôm qua, 16:00',
          },
          {
            activity: 'Writing Essay',
            course: 'VSTEP Writing B1',
            duration: '60 phút',
            date: '2 ngày trước, 10:00',
          },
        ],
        cumulative: [
          { date: '1/12', totalHours: 10 },
          { date: '8/12', totalHours: 20 },
          { date: '15/12', totalHours: 32 },
          { date: '22/12', totalHours: 40 },
          { date: '29/12', totalHours: 45 },
        ],
      },

      // Exercise Performance Tab Data
      exercises: {
        summary: {
          correctRate: 78,
          incorrectRate: 18,
          totalCorrect: 390,
          totalIncorrect: 90,
          totalQuestions: 500,
          avgScore: 7.5,
          avgTime: '45s',
          totalExercises: 127,
        },
        distribution: [
          { name: 'Đúng', value: 390 },
          { name: 'Sai', value: 90 },
          { name: 'Bỏ qua', value: 20 },
        ],
        bySkill: [
          {
            name: 'Reading',
            correct: 120,
            incorrect: 25,
            total: 145,
            correctRate: 83,
            incorrectRate: 17,
            avgScore: 7.8,
          },
          {
            name: 'Listening',
            correct: 105,
            incorrect: 30,
            total: 135,
            correctRate: 78,
            incorrectRate: 22,
            avgScore: 7.2,
          },
          {
            name: 'Writing',
            correct: 85,
            incorrect: 20,
            total: 105,
            correctRate: 81,
            incorrectRate: 19,
            avgScore: 7.0,
          },
          {
            name: 'Speaking',
            correct: 80,
            incorrect: 15,
            total: 95,
            correctRate: 84,
            incorrectRate: 16,
            avgScore: 7.5,
          },
        ],
        scoreTrend: [
          { date: '1/12', score: 6.8, average: 6.5 },
          { date: '8/12', score: 7.2, average: 6.8 },
          { date: '15/12', score: 7.5, average: 7.0 },
          { date: '22/12', score: 7.8, average: 7.2 },
          { date: '29/12', score: 8.0, average: 7.5 },
        ],
        details: [
          {
            title: 'Multiple Choice - Environment',
            skill: 'Reading',
            level: 'B2',
            score: 8.5,
            correct: 17,
            total: 20,
            accuracy: 85,
            duration: '25 phút',
            date: '10/12/2024',
          },
          {
            title: 'Long Conversation',
            skill: 'Listening',
            level: 'B2',
            score: 7.5,
            correct: 15,
            total: 20,
            accuracy: 75,
            duration: '30 phút',
            date: '09/12/2024',
          },
          {
            title: 'Opinion Essay',
            skill: 'Writing',
            level: 'B1',
            score: 7.0,
            correct: 7,
            total: 10,
            accuracy: 70,
            duration: '45 phút',
            date: '08/12/2024',
          },
          {
            title: 'Part 2 - Long Turn',
            skill: 'Speaking',
            level: 'B2',
            score: 7.8,
            correct: 8,
            total: 10,
            accuracy: 80,
            duration: '15 phút',
            date: '07/12/2024',
          },
        ],
        weakAreas: [
          {
            topic: 'Matching Headings',
            skill: 'Reading',
            accuracy: 65,
            mistakes: 7,
            attempts: 20,
          },
          {
            topic: 'Gap Fill',
            skill: 'Listening',
            accuracy: 60,
            mistakes: 8,
            attempts: 20,
          },
          {
            topic: 'Coherence & Cohesion',
            skill: 'Writing',
            accuracy: 68,
            mistakes: 6,
            attempts: 19,
          },
        ],
        timeAnalysis: [
          { skill: 'Reading', avgTime: 42, targetTime: 45 },
          { skill: 'Listening', avgTime: 38, targetTime: 40 },
          { skill: 'Writing', avgTime: 55, targetTime: 50 },
          { skill: 'Speaking', avgTime: 48, targetTime: 45 },
        ],
      },

      // Test History Tab Data
      tests: {
        summary: {
          totalTests: 8,
          avgScore: 7.3,
          highestScore: 8.2,
          highestTest: 'Test 06',
          improvement: 1.5,
        },
        scoreHistory: [
          {
            test: 'Test 01',
            overall: 6.5,
            reading: 6.8,
            listening: 6.2,
            writing: 6.0,
            speaking: 7.0,
          },
          {
            test: 'Test 02',
            overall: 6.8,
            reading: 7.0,
            listening: 6.5,
            writing: 6.3,
            speaking: 7.3,
          },
          {
            test: 'Test 03',
            overall: 7.0,
            reading: 7.2,
            listening: 6.8,
            writing: 6.5,
            speaking: 7.5,
          },
          {
            test: 'Test 04',
            overall: 7.2,
            reading: 7.5,
            listening: 7.0,
            writing: 6.8,
            speaking: 7.5,
          },
          {
            test: 'Test 05',
            overall: 7.5,
            reading: 7.8,
            listening: 7.2,
            writing: 7.0,
            speaking: 8.0,
          },
        ],
        history: [
          {
            id: 1,
            title: 'VSTEP B2 - Full Test 05',
            level: 'B2',
            overall: 7.5,
            reading: 7.8,
            listening: 7.2,
            writing: 7.0,
            speaking: 8.0,
            date: '08/12/2024',
            duration: 145,
            attempt: 1,
            isPassed: true,
          },
          {
            id: 2,
            title: 'VSTEP B2 - Full Test 04',
            level: 'B2',
            overall: 7.2,
            reading: 7.5,
            listening: 7.0,
            writing: 6.8,
            speaking: 7.5,
            date: '01/12/2024',
            duration: 150,
            attempt: 1,
            isPassed: true,
          },
          {
            id: 3,
            title: 'VSTEP B1 - Full Test 03',
            level: 'B1',
            overall: 7.0,
            reading: 7.2,
            listening: 6.8,
            writing: 6.5,
            speaking: 7.5,
            date: '25/11/2024',
            duration: 140,
            attempt: 2,
            isPassed: true,
          },
        ],
        latestSkillBreakdown: [
          { skill: 'Reading', score: 7.8 },
          { skill: 'Listening', score: 7.2 },
          { skill: 'Writing', score: 7.0 },
          { skill: 'Speaking', score: 8.0 },
        ],
        scoreByLevel: [
          { level: 'A2', avgScore: 6.5, tests: 2 },
          { level: 'B1', avgScore: 7.0, tests: 3 },
          { level: 'B2', avgScore: 7.5, tests: 3 },
        ],
        improvement: [
          { skill: 'Reading', change: 1.0, trend: 'up' },
          { skill: 'Listening', change: 1.0, trend: 'up' },
          { skill: 'Writing', change: 1.0, trend: 'up' },
          { skill: 'Speaking', change: 1.0, trend: 'up' },
        ],
        insights: [
          {
            type: 'positive',
            title: 'Tiến bộ vượt trội',
            message: 'Speaking của bạn đã cải thiện +1.0 điểm so với 3 test trước!',
          },
          {
            type: 'info',
            title: 'Điểm số ổn định',
            message: 'Reading và Listening đang duy trì ở mức tốt.',
          },
          {
            type: 'warning',
            title: 'Cần chú ý Writing',
            message: 'Writing là kỹ năng điểm thấp nhất. Hãy luyện tập thêm!',
          },
        ],
      },

      // Recommendations Tab Data
      recommendations: {
        summary: {
          totalPractices: 127,
          totalTests: 8,
          strongestSkill: 'Reading (7.8)',
          weakestSkill: 'Writing (6.8)',
          expectedImprovement: '0.5',
        },
        priority: [
          {
            priority: 'high',
            title: 'Cải thiện Writing - Coherence & Cohesion',
            description:
              'Writing của bạn đang ở mức 6.8, thấp hơn các kỹ năng khác. Đặc biệt cần cải thiện về tính mạch lạc và liên kết.',
            actions: [
              'Luyện tập viết Essay với từ nối và linking words',
              'Đọc các bài mẫu band 8.0+ để học cấu trúc',
              'Practice 30 phút mỗi ngày với các đề Opinion Essay',
            ],
            estimatedTime: '2-3 tuần',
            improvement: '+0.5 - 1.0 điểm',
          },
          {
            priority: 'medium',
            title: 'Nâng cao Listening - Gap Fill',
            description:
              'Listening đang ở mức tốt (7.2) nhưng Gap Fill là điểm yếu với 60% chính xác.',
            actions: [
              'Luyện nghe và điền từ với podcast/TED talks',
              'Practice dictation exercises hàng ngày',
              'Tập trung vào spelling và số từ',
            ],
            estimatedTime: '1-2 tuần',
            improvement: '+0.3 - 0.5 điểm',
          },
          {
            priority: 'low',
            title: 'Duy trì Reading - Matching Headings',
            description:
              'Reading đã rất tốt (7.8) nhưng có thể cải thiện thêm ở dạng Matching Headings.',
            actions: [
              'Practice 10 bài Matching Headings',
              'Học cách scan và skim hiệu quả',
              'Tập đọc nhanh và tìm main idea',
            ],
            estimatedTime: '1 tuần',
            improvement: '+0.2 điểm',
          },
        ],
        bySkill: [
          {
            skill: 'Reading',
            currentScore: 7.8,
            targetScore: 8.0,
            weakPoints: [
              { topic: 'Matching Headings', accuracy: 65 },
              { topic: 'True/False/Not Given', accuracy: 72 },
            ],
            recommendedExercises: [
              'Matching Headings - Advanced (B2)',
              'Academic Reading - Science',
              'TFNG Practice Set 5',
            ],
          },
          {
            skill: 'Listening',
            currentScore: 7.2,
            targetScore: 7.5,
            weakPoints: [
              { topic: 'Gap Fill', accuracy: 60 },
              { topic: 'Multiple Choice', accuracy: 68 },
            ],
            recommendedExercises: [
              'Gap Fill - Academic Lectures',
              'Long Conversation Practice',
              'Note Completion Exercises',
            ],
          },
          {
            skill: 'Writing',
            currentScore: 6.8,
            targetScore: 7.5,
            weakPoints: [
              { topic: 'Coherence & Cohesion', accuracy: 68 },
              { topic: 'Grammar Range', accuracy: 65 },
            ],
            recommendedExercises: [
              'Opinion Essay - Band 8.0 Samples',
              'Linking Words Practice',
              'Grammar for Writing (Complex Sentences)',
            ],
          },
          {
            skill: 'Speaking',
            currentScore: 7.5,
            targetScore: 8.0,
            weakPoints: [
              { topic: 'Vocabulary Range', accuracy: 70 },
              { topic: 'Grammatical Accuracy', accuracy: 72 },
            ],
            recommendedExercises: [
              'Part 2 - Topic Cards (Advanced)',
              'Part 3 - Discussion Practice',
              'Vocabulary Building - Academic Topics',
            ],
          },
        ],
        studyPlan: [
          {
            week: 1,
            totalHours: 10,
            goal: 'Cải thiện Writing Coherence & Cohesion lên 7.5+',
            days: [
              {
                day: 'Thứ 2',
                activities: [
                  'Writing Essay 1 (Opinion)',
                  'Học 20 linking words',
                ],
              },
              {
                day: 'Thứ 4',
                activities: [
                  'Writing Essay 2 (Argument)',
                  'Review & rewrite Essay 1',
                ],
              },
              {
                day: 'Thứ 6',
                activities: [
                  'Writing Essay 3 (Discussion)',
                  'Analyze band 8.0 samples',
                ],
              },
              {
                day: 'Chủ nhật',
                activities: [
                  'Writing Test (Full)',
                  'Review all 3 essays',
                ],
              },
            ],
          },
          {
            week: 2,
            totalHours: 12,
            goal: 'Nâng Listening lên 7.5+ và ôn tập Reading',
            days: [
              {
                day: 'Thứ 2',
                activities: [
                  'Listening - Gap Fill x3',
                  'Reading - Matching Headings',
                ],
              },
              {
                day: 'Thứ 3',
                activities: [
                  'Listening - Long Conversation',
                  'Dictation practice 20 phút',
                ],
              },
              {
                day: 'Thứ 5',
                activities: [
                  'Listening Full Test',
                  'Reading - TFNG practice',
                ],
              },
              {
                day: 'Chủ nhật',
                activities: [
                  'Full Mock Test (4 skills)',
                  'Review & analyze mistakes',
                ],
              },
            ],
          },
        ],
        tips: [
          {
            category: 'Study Habits',
            tip: 'Học đều 60-90 phút mỗi ngày tốt hơn học dồn 5 giờ cuối tuần.',
            impact: 'Cải thiện retention +40%',
          },
          {
            category: 'Test Strategy',
            tip: 'Luôn đọc câu hỏi trước khi đọc passage trong Reading.',
            impact: 'Tiết kiệm 5-7 phút/bài',
          },
          {
            category: 'Writing Tips',
            tip: 'Dành 5 phút để plan outline trước khi viết essay.',
            impact: 'Coherence score +0.5-1.0',
          },
        ],
        motivation: {
          quote: 'Success is the sum of small efforts repeated day in and day out.',
          author: 'Robert Collier',
        },
      },

      // Gamification Tab Data
      gamification: {
        playerName: 'VSTEP Learner',
        level: {
          current: 15,
          title: 'Elite Scholar',
          currentXP: 3750,
          nextLevelXP: 5000,
        },
        totalPoints: 12850,
        kpi: {
          streakDays: 12,
          streakBonus: 50,
          badgesEarned: 14,
          totalBadges: 25,
          goalsCompleted: 8,
          goalBonus: 200,
          perfectScores: 5,
          perfectBonus: 300,
        },
        badges: [
          {
            name: 'First Steps',
            description: 'Hoàn thành bài tập đầu tiên',
            iconType: 'star',
            color: 'from-blue-400 to-blue-600',
            unlocked: true,
            unlockedDate: '15/11/2024',
            xpReward: 100,
            isNew: false,
            progress: 100,
            current: 1,
            target: 1,
          },
          {
            name: 'Week Warrior',
            description: '7 ngày streak',
            iconType: 'flame',
            color: 'from-orange-400 to-red-600',
            unlocked: true,
            unlockedDate: '01/12/2024',
            xpReward: 200,
            isNew: true,
            progress: 100,
            current: 7,
            target: 7,
          },
          {
            name: 'Century Club',
            description: '100 bài luyện tập',
            iconType: 'trophy',
            color: 'from-yellow-400 to-yellow-600',
            unlocked: true,
            unlockedDate: '05/12/2024',
            xpReward: 500,
            isNew: true,
            progress: 100,
            current: 100,
            target: 100,
          },
          {
            name: 'Perfect Score',
            description: 'Đạt điểm 10 lần đầu',
            iconType: 'star',
            color: 'from-purple-400 to-purple-600',
            unlocked: true,
            unlockedDate: '08/12/2024',
            xpReward: 300,
            isNew: false,
            progress: 100,
            current: 1,
            target: 1,
          },
          {
            name: 'Reading Master',
            description: 'Đạt 8.0+ Reading',
            iconType: 'medal',
            color: 'from-blue-400 to-blue-600',
            unlocked: false,
            xpReward: 400,
            isNew: false,
            progress: 95,
            current: 7.8,
            target: 8.0,
          },
          {
            name: 'Marathon',
            description: '50 giờ học',
            iconType: 'trophy',
            color: 'from-green-400 to-green-600',
            unlocked: false,
            xpReward: 600,
            isNew: false,
            progress: 90,
            current: 45,
            target: 50,
          },
          {
            name: 'Speaking Pro',
            description: 'Đạt 8.5+ Speaking',
            iconType: 'crown',
            color: 'from-orange-400 to-orange-600',
            unlocked: false,
            xpReward: 500,
            isNew: false,
            progress: 88,
            current: 7.5,
            target: 8.5,
          },
          {
            name: 'Full Test Champion',
            description: 'Hoàn thành 10 Full Tests',
            iconType: 'trophy',
            color: 'from-red-400 to-red-600',
            unlocked: false,
            xpReward: 800,
            isNew: false,
            progress: 80,
            current: 8,
            target: 10,
          },
        ],
        leaderboard: [
          {
            name: 'Sarah Johnson',
            level: 18,
            points: 15200,
            badges: 18,
            isCurrentUser: false,
          },
          {
            name: 'VSTEP Learner',
            level: 15,
            points: 12850,
            badges: 14,
            isCurrentUser: true,
          },
          {
            name: 'Mike Chen',
            level: 14,
            points: 11500,
            badges: 12,
            isCurrentUser: false,
          },
          {
            name: 'Emma Wilson',
            level: 13,
            points: 10200,
            badges: 11,
            isCurrentUser: false,
          },
          {
            name: 'David Lee',
            level: 12,
            points: 9800,
            badges: 10,
            isCurrentUser: false,
          },
        ],
        skillRadar: [
          { skill: 'Reading', score: 78 },
          { skill: 'Listening', score: 72 },
          { skill: 'Writing', score: 68 },
          { skill: 'Speaking', score: 75 },
          { skill: 'Grammar', score: 70 },
          { skill: 'Vocabulary', score: 73 },
        ],
        recentAchievements: [
          {
            title: 'Week Warrior',
            description: '7 ngày streak hoàn thành',
            xp: 200,
            date: '2 ngày trước',
          },
          {
            title: 'Century Club',
            description: '100 bài luyện tập',
            xp: 500,
            date: '5 ngày trước',
          },
          {
            title: 'Perfect Score',
            description: 'Điểm 10 đầu tiên',
            xp: 300,
            date: '1 tuần trước',
          },
        ],
        milestones: [
          {
            title: 'Reading Master',
            description: 'Đạt 8.0+ trong Reading',
            achieved: false,
            current: 7.8,
            target: 8.0,
            xpReward: 400,
            reward: '1 Free Full Test',
          },
          {
            title: 'Marathon Runner',
            description: 'Hoàn thành 50 giờ học',
            achieved: false,
            current: 45,
            target: 50,
            xpReward: 600,
            reward: 'Premium Badge',
          },
          {
            title: 'Full Test Champion',
            description: 'Hoàn thành 10 Full Tests',
            achieved: false,
            current: 8,
            target: 10,
            xpReward: 800,
            reward: 'Certificate of Excellence',
          },
          {
            title: 'Perfect Month',
            description: '30 ngày streak',
            achieved: false,
            current: 12,
            target: 30,
            xpReward: 1000,
            reward: 'Gold Crown Badge',
          },
        ],
        dailyQuests: [
          {
            title: 'Complete 3 exercises',
            current: 2,
            target: 3,
            unit: 'bài',
            xpReward: 50,
            completed: false,
            timeLeft: '8 giờ',
          },
          {
            title: 'Study 30 minutes',
            current: 30,
            target: 30,
            unit: 'phút',
            xpReward: 30,
            completed: true,
            timeLeft: '8 giờ',
          },
          {
            title: 'Score 8.0+ on any test',
            current: 0,
            target: 1,
            unit: 'test',
            xpReward: 100,
            completed: false,
            timeLeft: '8 giờ',
          },
        ],
      },
    };
  };

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thống kê...</p>
        </div>
      </div>
    );
  }

  const currentTabConfig = tabs.find((t) => t.type === activeTab)!;
  const CurrentTabIcon = currentTabConfig.icon;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Tabs */}
      <div
        className={`bg-white border-r border-gray-200 flex-shrink-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <BarChart3 className="size-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg">Thống kê học tập</h2>
                  <p className="text-xs text-gray-500">Phân tích toàn diện</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title={isSidebarCollapsed ? 'Mở rộng' : 'Thu gọn'}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="size-5 text-gray-600" />
              ) : (
                <ChevronLeft className="size-5 text-gray-600" />
              )}
            </button>
          </div>

          {/* Quick Stats */}
          {!isSidebarCollapsed && (
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-xl text-blue-600">{stats.overview.gpa}</div>
                <div className="text-xs text-blue-600/70">GPA</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <div className="text-xl text-purple-600">{stats.overview.currentStreak}</div>
                <div className="text-xs text-purple-600/70">Streak</div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="py-3 overflow-y-auto max-h-[calc(100vh-200px)]">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.type;

            return (
              <button
                key={tab.type}
                onClick={() => setActiveTab(tab.type)}
                className={`w-full px-6 py-3.5 flex items-center gap-3 transition-all relative ${
                  isActive
                    ? `${tab.bgColor} ${tab.color} border-r-4 ${tab.borderColor}`
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                title={isSidebarCollapsed ? tab.title : ''}
              >
                <div className={`p-2 rounded-lg ${isActive ? tab.bgColor : 'bg-gray-100'}`}>
                  <TabIcon className={`size-5 ${isActive ? tab.color : 'text-gray-600'}`} />
                </div>

                {!isSidebarCollapsed && (
                  <div className="flex-1 text-left">
                    <div className="text-sm">{tab.title}</div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Content Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${currentTabConfig.bgColor}`}>
                <CurrentTabIcon className={`size-6 ${currentTabConfig.color}`} />
              </div>
              <div>
                <h1 className="text-2xl mb-1">{currentTabConfig.title}</h1>
                <p className="text-sm text-gray-500">
                  {activeTab === 'overview' && 'GPA, hoàn thành, thời gian học, streak'}
                  {activeTab === 'courses' && '% hoàn thành, điểm, lịch sử truy cập'}
                  {activeTab === 'time' && 'Biểu đồ theo ngày/tuần/tháng'}
                  {activeTab === 'performance' && 'Tỷ lệ đúng/sai, thời gian làm bài'}
                  {activeTab === 'tests' && 'Danh sách test & so sánh điểm'}
                  {activeTab === 'recommendations' && 'Dựa trên tiến độ và điểm yếu'}
                  {activeTab === 'gamification' && 'Huy hiệu, KPI, leaderboard'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body - Scrollable */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {activeTab === 'overview' && <OverviewTab stats={stats} />}
          {activeTab === 'courses' && <CourseProgressTab stats={stats} />}
          {activeTab === 'time' && <StudyTimeTab stats={stats} />}
          {activeTab === 'performance' && <ExercisePerformanceTab stats={stats} />}
          {activeTab === 'tests' && <TestHistoryTab stats={stats} />}
          {activeTab === 'recommendations' && <RecommendationsTab stats={stats} />}
          {activeTab === 'gamification' && <GamificationTab stats={stats} />}
        </div>
      </div>
    </div>
  );
}

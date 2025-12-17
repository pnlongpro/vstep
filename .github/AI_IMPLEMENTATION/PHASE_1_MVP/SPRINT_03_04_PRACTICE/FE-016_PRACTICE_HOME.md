# FE-016: Practice Home Page

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-016 |
| **Phase** | 1 - MVP |
| **Sprint** | 3-4 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 2h |
| **Dependencies** | FE-008 |

---

## 🚨 QUAN TRỌNG - ĐỌc NGAY!

> **⚠️ COMPONENT RẤT LỚN ĐÃ CÓ SẴN:**
> - `components/PracticeHome.tsx` - ✅ **~788 LINES - RẤT HOÀN CHỈNH!**
>
> **Đã có trong component:**
> - ✅ Skill selection cards (Reading/Listening/Writing/Speaking)
> - ✅ Level selection UI
> - ✅ Stats display
> - ✅ Quick actions
> - ✅ Recent practice history
> - ✅ Progress indicators

**Action:**
- 🚫 **KHÔNG VIẾT LẠI UI** - Component đã hoàn chỉnh!
- ✅ CREATE page route wrapper
- ✅ ADD React Query hooks để fetch real data
- ✅ REPLACE mock data với API data

---

## 🎯 Objective

INTEGRATE Practice Home với API (không tạo lại UI):
- Skill selection cards (Reading, Listening, Writing, Speaking)
- Recent practice sessions
- Quick stats overview
- Recommended practice

---

## 💻 Implementation

### Step 1: Page Route

```typescript
// src/app/practice/page.tsx
import { Metadata } from 'next';
import { PracticeHome } from '@/features/practice/components/PracticeHome';

export const metadata: Metadata = {
  title: 'Practice | VSTEPRO',
  description: 'Practice your English skills with VSTEP format exercises',
};

export default function PracticePage() {
  return <PracticeHome />;
}
```

### Step 2: Practice Home Component

```tsx
// src/features/practice/components/PracticeHome.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BookOpenIcon, 
  HeadphonesIcon, 
  PencilIcon, 
  MicrophoneIcon,
  ClockIcon,
  FireIcon,
  TrophyIcon,
  ArrowRightIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import { SkillCard } from './SkillCard';
import { RecentSessions } from './RecentSessions';
import { QuickStats } from './QuickStats';
import { RecommendedPractice } from './RecommendedPractice';
import { LevelSelectionModal } from './LevelSelectionModal';
import { usePracticeStore } from '../store/practiceStore';
import { practiceService } from '@/services/practice.service';
import { SkillType, VstepLevel } from '@/types/practice';

const SKILLS = [
  {
    id: 'reading',
    name: 'Reading',
    description: 'Improve reading comprehension with passages and questions',
    icon: BookOpenIcon,
    color: 'blue',
    gradient: 'from-blue-500 to-blue-600',
    bgLight: 'bg-blue-50',
    duration: '~60 min',
    questionCount: '40 questions',
  },
  {
    id: 'listening',
    name: 'Listening',
    description: 'Practice listening with audio conversations and lectures',
    icon: HeadphonesIcon,
    color: 'purple',
    gradient: 'from-purple-500 to-purple-600',
    bgLight: 'bg-purple-50',
    duration: '~40 min',
    questionCount: '35 questions',
  },
  {
    id: 'writing',
    name: 'Writing',
    description: 'Develop writing skills with essay and letter tasks',
    icon: PencilIcon,
    color: 'green',
    gradient: 'from-green-500 to-green-600',
    bgLight: 'bg-green-50',
    duration: '~60 min',
    questionCount: '2 tasks',
  },
  {
    id: 'speaking',
    name: 'Speaking',
    description: 'Enhance speaking through interactive practice',
    icon: MicrophoneIcon,
    color: 'orange',
    gradient: 'from-orange-500 to-orange-600',
    bgLight: 'bg-orange-50',
    duration: '~12 min',
    questionCount: '3 parts',
  },
] as const;

export function PracticeHome() {
  const router = useRouter();
  const [selectedSkill, setSelectedSkill] = useState<SkillType | null>(null);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, sessionsData] = await Promise.all([
        practiceService.getQuickStats(),
        practiceService.getRecentSessions(5),
      ]);
      setStats(statsData);
      setRecentSessions(sessionsData);
    } catch (error) {
      console.error('Failed to load practice data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkillClick = (skill: SkillType) => {
    setSelectedSkill(skill);
    setShowLevelModal(true);
  };

  const handleLevelSelect = (level: VstepLevel) => {
    setShowLevelModal(false);
    router.push(`/practice/${selectedSkill}?level=${level}`);
  };

  const handleContinueSession = (sessionId: string) => {
    router.push(`/practice/session/${sessionId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Practice</h1>
          <p className="mt-2 text-gray-600">
            Choose a skill to practice and improve your VSTEP score
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <QuickStats stats={stats} loading={loading} />

        {/* Skill Cards Grid */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Select a Skill
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SKILLS.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onClick={() => handleSkillClick(skill.id as SkillType)}
                stats={stats?.bySkill?.[skill.id]}
              />
            ))}
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Sessions - Takes 2 columns */}
          <div className="lg:col-span-2">
            <RecentSessions 
              sessions={recentSessions} 
              loading={loading}
              onContinue={handleContinueSession}
            />
          </div>

          {/* Recommended Practice - Takes 1 column */}
          <div>
            <RecommendedPractice />
          </div>
        </div>
      </div>

      {/* Level Selection Modal */}
      {showLevelModal && selectedSkill && (
        <LevelSelectionModal
          skill={selectedSkill}
          onSelect={handleLevelSelect}
          onClose={() => setShowLevelModal(false)}
        />
      )}
    </div>
  );
}
```

### Step 3: Skill Card Component

```tsx
// src/features/practice/components/SkillCard.tsx
'use client';

import { FC } from 'react';
import { ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface SkillCardProps {
  skill: {
    id: string;
    name: string;
    description: string;
    icon: any;
    color: string;
    gradient: string;
    bgLight: string;
    duration: string;
    questionCount: string;
  };
  stats?: {
    totalSessions: number;
    averageScore: number;
    lastPracticed?: string;
  };
  onClick: () => void;
}

export const SkillCard: FC<SkillCardProps> = ({ skill, stats, onClick }) => {
  const Icon = skill.icon;

  return (
    <button
      onClick={onClick}
      className={`
        relative group p-6 rounded-2xl bg-white border border-gray-200
        hover:border-${skill.color}-300 hover:shadow-lg
        transition-all duration-200 text-left w-full
        focus:outline-none focus:ring-2 focus:ring-${skill.color}-500 focus:ring-offset-2
      `}
    >
      {/* Icon */}
      <div className={`
        w-14 h-14 rounded-xl ${skill.bgLight} 
        flex items-center justify-center mb-4
        group-hover:scale-110 transition-transform duration-200
      `}>
        <Icon className={`w-7 h-7 text-${skill.color}-600`} />
      </div>

      {/* Title & Description */}
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        {skill.name}
      </h3>
      <p className="text-sm text-gray-500 line-clamp-2 mb-4">
        {skill.description}
      </p>

      {/* Meta Info */}
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <ClockIcon className="w-4 h-4" />
          {skill.duration}
        </span>
        <span>{skill.questionCount}</span>
      </div>

      {/* Stats Badge */}
      {stats && stats.totalSessions > 0 && (
        <div className="absolute top-4 right-4">
          <div className={`
            px-2 py-1 rounded-full text-xs font-medium
            bg-${skill.color}-100 text-${skill.color}-700
          `}>
            {Math.round(stats.averageScore)}% avg
          </div>
        </div>
      )}

      {/* Hover Arrow */}
      <div className={`
        absolute bottom-4 right-4 opacity-0 group-hover:opacity-100
        transition-opacity duration-200
      `}>
        <div className={`
          w-8 h-8 rounded-full bg-gradient-to-r ${skill.gradient}
          flex items-center justify-center text-white
        `}>
          →
        </div>
      </div>
    </button>
  );
};
```

### Step 4: Quick Stats Component

```tsx
// src/features/practice/components/QuickStats.tsx
'use client';

import { FC } from 'react';
import { 
  FireIcon, 
  ClockIcon, 
  TrophyIcon, 
  CheckCircleIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

interface QuickStatsProps {
  stats: {
    currentStreak: number;
    totalTimeSpent: number;
    completedSessions: number;
    averageScore: number;
    todayPracticed: boolean;
  } | null;
  loading: boolean;
}

export const QuickStats: FC<QuickStatsProps> = ({ stats, loading }) => {
  const statItems = [
    {
      label: 'Current Streak',
      value: stats?.currentStreak || 0,
      suffix: 'days',
      icon: FireIcon,
      color: 'orange',
    },
    {
      label: 'Total Practice Time',
      value: stats ? Math.round(stats.totalTimeSpent / 60) : 0,
      suffix: 'hours',
      icon: ClockIcon,
      color: 'blue',
    },
    {
      label: 'Sessions Completed',
      value: stats?.completedSessions || 0,
      suffix: '',
      icon: CheckCircleIcon,
      color: 'green',
    },
    {
      label: 'Average Score',
      value: stats?.averageScore || 0,
      suffix: '%',
      icon: TrophyIcon,
      color: 'yellow',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="bg-white rounded-xl p-4 border border-gray-200"
          >
            {loading ? (
              <div className="animate-pulse">
                <div className="h-8 w-8 bg-gray-200 rounded-lg mb-2" />
                <div className="h-6 w-16 bg-gray-200 rounded mb-1" />
                <div className="h-4 w-24 bg-gray-100 rounded" />
              </div>
            ) : (
              <>
                <div className={`
                  w-10 h-10 rounded-lg bg-${item.color}-100 
                  flex items-center justify-center mb-2
                `}>
                  <Icon className={`w-5 h-5 text-${item.color}-600`} />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {item.value}
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    {item.suffix}
                  </span>
                </div>
                <div className="text-sm text-gray-500">{item.label}</div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
```

### Step 5: Recent Sessions Component

```tsx
// src/features/practice/components/RecentSessions.tsx
'use client';

import { FC } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { 
  PlayIcon, 
  CheckCircleIcon, 
  ClockIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { PracticeSession } from '@/types/practice';

interface RecentSessionsProps {
  sessions: PracticeSession[];
  loading: boolean;
  onContinue: (sessionId: string) => void;
}

const SKILL_COLORS: Record<string, string> = {
  reading: 'blue',
  listening: 'purple',
  writing: 'green',
  speaking: 'orange',
};

export const RecentSessions: FC<RecentSessionsProps> = ({ 
  sessions, 
  loading,
  onContinue,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="h-6 w-40 bg-gray-200 rounded mb-6 animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Recent Sessions</h2>
        <Link 
          href="/practice/history"
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          View all
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ClockIcon className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">No practice sessions yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Start practicing to see your progress here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const color = SKILL_COLORS[session.skill] || 'gray';
            const isCompleted = session.status === 'completed';

            return (
              <div
                key={session.id}
                className={`
                  flex items-center gap-4 p-4 rounded-lg border
                  ${isCompleted 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-yellow-50 border-yellow-200'
                  }
                `}
              >
                {/* Skill Badge */}
                <div className={`
                  w-12 h-12 rounded-lg bg-${color}-100
                  flex items-center justify-center shrink-0
                `}>
                  <span className={`text-${color}-600 font-semibold text-sm`}>
                    {session.skill.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Session Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 capitalize">
                      {session.skill}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-gray-200 rounded-full text-gray-600">
                      {session.level}
                    </span>
                    {!isCompleted && (
                      <span className="text-xs px-2 py-0.5 bg-yellow-200 rounded-full text-yellow-700">
                        In Progress
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span>
                      {formatDistanceToNow(new Date(session.createdAt), { 
                        addSuffix: true 
                      })}
                    </span>
                    {isCompleted && session.score !== null && (
                      <span className="flex items-center gap-1">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        {Math.round(session.score)}%
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <ClockIcon className="w-4 h-4" />
                      {Math.round((session.timeSpent || 0) / 60)} min
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                {isCompleted ? (
                  <Link
                    href={`/practice/result/${session.id}`}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 
                             border border-gray-200 rounded-lg hover:bg-gray-100"
                  >
                    Review
                  </Link>
                ) : (
                  <button
                    onClick={() => onContinue(session.id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm 
                             bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <PlayIcon className="w-4 h-4" />
                    Continue
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
```

### Step 6: Recommended Practice Component

```tsx
// src/features/practice/components/RecommendedPractice.tsx
'use client';

import { FC } from 'react';
import Link from 'next/link';
import { 
  LightBulbIcon, 
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

export const RecommendedPractice: FC = () => {
  // In production, this would come from API based on user's weak areas
  const recommendations = [
    {
      title: 'Reading: Main Idea Questions',
      reason: 'Based on your recent performance',
      type: 'weak_area',
      link: '/practice/reading?focus=main-idea',
    },
    {
      title: 'Listening: Note Taking',
      reason: 'Improve your note-taking skills',
      type: 'suggestion',
      link: '/practice/listening?focus=note-taking',
    },
    {
      title: 'Writing: Task 2 Essays',
      reason: 'Practice argumentative writing',
      type: 'improvement',
      link: '/practice/writing?task=2',
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'weak_area':
        return <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />;
      case 'improvement':
        return <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />;
      default:
        return <LightBulbIcon className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <LightBulbIcon className="w-5 h-5 text-yellow-500" />
        <h2 className="text-lg font-semibold text-gray-900">
          Recommended for You
        </h2>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <Link
            key={index}
            href={rec.link}
            className="block p-4 rounded-lg border border-gray-200 
                     hover:border-blue-200 hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">
                {getIcon(rec.type)}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{rec.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{rec.reason}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Daily Goal */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white">
        <h3 className="font-medium mb-2">Daily Goal</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm opacity-90">2 of 3 sessions completed</span>
          <span className="text-lg font-bold">67%</span>
        </div>
        <div className="mt-2 h-2 bg-white/30 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-white rounded-full" />
        </div>
      </div>
    </div>
  );
};
```

---

## ✅ Acceptance Criteria

- [ ] All 4 skills displayed with cards
- [ ] Click opens level selection modal
- [ ] Recent sessions show with continue option
- [ ] Quick stats display correctly
- [ ] Responsive on all screen sizes
- [ ] Loading states implemented

---

## ⏭️ Next Task

→ `FE-017_LEVEL_SELECTION.md` - Level Selection Modal

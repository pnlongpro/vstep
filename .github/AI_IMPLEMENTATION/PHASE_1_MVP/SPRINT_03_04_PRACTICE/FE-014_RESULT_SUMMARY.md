# FE-014: Result Summary Page

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-014 |
| **Phase** | 1 - MVP |
| **Sprint** | 3-4 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 4h |
| **Dependencies** | FE-008, FE-009 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Existing files ĐÃ CÓ SẴN:**
> - `components/reading/ReadingResult.tsx` - ✅ Đã có
> - `components/listening/ListeningResult.tsx` - ✅ Đã có
> - `components/writing/WritingResult.tsx` - ✅ Đã có
> - `components/speaking/SpeakingResult.tsx` - ✅ Đã có

**Action:**
- ✅ REFACTOR to create shared `ResultSummary` component
- ✅ INTEGRATE existing Result components với API
- ❌ KHÔNG viết lại từ đầu

---

## 🎯 Objective

REFACTOR Result Summary (dùng components có sẵn):
- Score overview với animation
- Part breakdown chart
- Question review với filter
- Time analytics
- Share và retry actions

---

## 💻 Implementation

### Step 1: Score Display Component

```tsx
// src/components/practice/result/ScoreDisplay.tsx
'use client';

import { useEffect, useState } from 'react';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScoreDisplayProps {
  score: number;
  maxScore?: number;
  previousScore?: number;
  vstepScore?: number;
  level?: string;
  animationDuration?: number;
}

export default function ScoreDisplay({
  score,
  maxScore = 10,
  previousScore,
  vstepScore,
  level,
  animationDuration = 1500,
}: ScoreDisplayProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Animate score counting up
  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(score * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setAnimationComplete(true);
      }
    };
    
    requestAnimationFrame(animate);
  }, [score, animationDuration]);

  const percentage = (score / maxScore) * 100;
  
  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getGradient = () => {
    if (percentage >= 80) return 'from-green-400 to-green-600';
    if (percentage >= 60) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  const getTrend = () => {
    if (!previousScore) return null;
    if (score > previousScore) return { icon: TrendingUp, color: 'text-green-500', text: 'Tiến bộ' };
    if (score < previousScore) return { icon: TrendingDown, color: 'text-red-500', text: 'Giảm' };
    return { icon: Minus, color: 'text-gray-500', text: 'Giữ nguyên' };
  };

  const trend = getTrend();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
      {/* Circular Progress */}
      <div className="relative inline-block">
        <svg className="w-48 h-48 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress circle */}
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="url(#scoreGradient)"
            strokeWidth="12"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 88}`}
            strokeDashoffset={`${2 * Math.PI * 88 * (1 - displayScore / maxScore)}`}
            className="transition-all duration-100"
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" className={cn('stop-color', getScoreColor())} />
              <stop offset="100%" className={cn('stop-color', getScoreColor())} />
            </linearGradient>
          </defs>
        </svg>

        {/* Score Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('text-5xl font-bold', getScoreColor())}>
            {displayScore.toFixed(1)}
          </span>
          <span className="text-gray-400 text-lg">/ {maxScore}</span>
        </div>
      </div>

      {/* VSTEP Score Badge */}
      {vstepScore && level && (
        <div className="mt-6 inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
          <Trophy className="w-5 h-5 text-blue-600 mr-2" />
          <span className="font-semibold text-blue-700 dark:text-blue-400">
            VSTEP {level}: {vstepScore}/10
          </span>
        </div>
      )}

      {/* Trend Indicator */}
      {trend && animationComplete && (
        <div className={cn('mt-4 flex items-center justify-center', trend.color)}>
          <trend.icon className="w-5 h-5 mr-1" />
          <span className="text-sm font-medium">
            {trend.text}
            {previousScore && (
              <span className="text-gray-400 ml-1">
                (lần trước: {previousScore.toFixed(1)})
              </span>
            )}
          </span>
        </div>
      )}

      {/* Performance Label */}
      <div className="mt-6">
        <span className={cn(
          'inline-block px-6 py-2 rounded-full text-white font-medium bg-gradient-to-r',
          getGradient()
        )}>
          {percentage >= 80 && 'Xuất sắc! 🎉'}
          {percentage >= 60 && percentage < 80 && 'Tốt lắm! 👍'}
          {percentage >= 40 && percentage < 60 && 'Cần cố gắng thêm 💪'}
          {percentage < 40 && 'Luyện tập thêm nhé! 📚'}
        </span>
      </div>
    </div>
  );
}
```

### Step 2: Part Breakdown Chart

```tsx
// src/components/practice/result/PartBreakdown.tsx
'use client';

import { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { cn } from '@/lib/utils';

interface PartResult {
  partNumber: number;
  name: string;
  correct: number;
  incorrect: number;
  skipped: number;
  total: number;
  percentage: number;
}

interface PartBreakdownProps {
  parts: PartResult[];
}

export default function PartBreakdown({ parts }: PartBreakdownProps) {
  const chartData = useMemo(() => {
    return parts.map(part => ({
      name: part.name || `Part ${part.partNumber}`,
      'Đúng': part.correct,
      'Sai': part.incorrect,
      'Bỏ qua': part.skipped,
      percentage: part.percentage,
    }));
  }, [parts]);

  const getBarColor = (percentage: number) => {
    if (percentage >= 80) return '#22c55e'; // green
    if (percentage >= 60) return '#eab308'; // yellow
    return '#ef4444'; // red
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Kết quả theo phần
      </h3>

      {/* Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis type="number" domain={[0, 'dataMax']} />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={80}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255,255,255,0.95)', 
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              }}
            />
            <Bar dataKey="Đúng" stackId="a" fill="#22c55e" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Sai" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Bỏ qua" stackId="a" fill="#9ca3af" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed List */}
      <div className="space-y-3">
        {parts.map((part) => (
          <div
            key={part.partNumber}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
          >
            <div className="flex items-center">
              <div 
                className="w-1 h-10 rounded-full mr-3"
                style={{ backgroundColor: getBarColor(part.percentage) }}
              />
              <div>
                <span className="font-medium text-gray-800 dark:text-white">
                  {part.name || `Part ${part.partNumber}`}
                </span>
                <div className="text-xs text-gray-500 mt-0.5">
                  {part.correct}/{part.total} câu đúng
                </div>
              </div>
            </div>
            <div className="text-right">
              <span 
                className="text-xl font-bold"
                style={{ color: getBarColor(part.percentage) }}
              >
                {part.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Step 3: Question Review List

```tsx
// src/components/practice/result/QuestionReview.tsx
'use client';

import { useState, useMemo } from 'react';
import { Check, X, Minus, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionResult {
  id: string;
  questionNumber: number;
  content: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  isSkipped: boolean;
  explanation?: string;
  timeSpent: number;
  partNumber?: number;
}

interface QuestionReviewProps {
  questions: QuestionResult[];
  onQuestionClick?: (questionId: string) => void;
}

type FilterType = 'all' | 'correct' | 'incorrect' | 'skipped';

export default function QuestionReview({
  questions,
  onQuestionClick,
}: QuestionReviewProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredQuestions = useMemo(() => {
    switch (filter) {
      case 'correct':
        return questions.filter(q => q.isCorrect);
      case 'incorrect':
        return questions.filter(q => !q.isCorrect && !q.isSkipped);
      case 'skipped':
        return questions.filter(q => q.isSkipped);
      default:
        return questions;
    }
  }, [questions, filter]);

  const counts = useMemo(() => ({
    all: questions.length,
    correct: questions.filter(q => q.isCorrect).length,
    incorrect: questions.filter(q => !q.isCorrect && !q.isSkipped).length,
    skipped: questions.filter(q => q.isSkipped).length,
  }), [questions]);

  const filterButtons: { key: FilterType; label: string; color: string }[] = [
    { key: 'all', label: 'Tất cả', color: 'bg-gray-100 text-gray-700' },
    { key: 'correct', label: 'Đúng', color: 'bg-green-100 text-green-700' },
    { key: 'incorrect', label: 'Sai', color: 'bg-red-100 text-red-700' },
    { key: 'skipped', label: 'Bỏ qua', color: 'bg-gray-100 text-gray-500' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Header with Filters */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Xem lại bài làm
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {filterButtons.map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                filter === key
                  ? cn(color, 'ring-2 ring-offset-2 ring-blue-500')
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100'
              )}
            >
              {label} ({counts[key]})
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[500px] overflow-y-auto">
        {filteredQuestions.map((question) => (
          <div
            key={question.id}
            className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            {/* Question Header */}
            <div
              onClick={() => setExpandedId(
                expandedId === question.id ? null : question.id
              )}
              className="flex items-center px-6 py-4 cursor-pointer"
            >
              {/* Status Icon */}
              <div className={cn(
                'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3',
                question.isCorrect && 'bg-green-100 dark:bg-green-900/30',
                !question.isCorrect && !question.isSkipped && 'bg-red-100 dark:bg-red-900/30',
                question.isSkipped && 'bg-gray-100 dark:bg-gray-700',
              )}>
                {question.isCorrect && <Check className="w-4 h-4 text-green-600" />}
                {!question.isCorrect && !question.isSkipped && <X className="w-4 h-4 text-red-600" />}
                {question.isSkipped && <Minus className="w-4 h-4 text-gray-400" />}
              </div>

              {/* Question Number & Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  <span className="font-medium text-gray-800 dark:text-white">
                    Câu {question.questionNumber}
                  </span>
                  {question.partNumber && (
                    <span className="ml-2 text-xs text-gray-500">
                      Part {question.partNumber}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate mt-0.5">
                  {question.content.replace(/<[^>]+>/g, '').slice(0, 80)}...
                </p>
              </div>

              {/* Time Spent */}
              <div className="flex-shrink-0 text-sm text-gray-400 mr-3">
                {Math.floor(question.timeSpent / 60)}:{(question.timeSpent % 60).toString().padStart(2, '0')}
              </div>

              {/* Expand Icon */}
              {expandedId === question.id ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>

            {/* Expanded Content */}
            {expandedId === question.id && (
              <div className="px-6 pb-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="pt-4 space-y-3">
                  {/* User Answer */}
                  <div className="flex items-start">
                    <span className="flex-shrink-0 w-24 text-sm text-gray-500">
                      Bạn chọn:
                    </span>
                    <span className={cn(
                      'font-medium',
                      question.isCorrect ? 'text-green-600' : 'text-red-600'
                    )}>
                      {question.userAnswer || '(Không trả lời)'}
                    </span>
                  </div>

                  {/* Correct Answer */}
                  {!question.isCorrect && (
                    <div className="flex items-start">
                      <span className="flex-shrink-0 w-24 text-sm text-gray-500">
                        Đáp án:
                      </span>
                      <span className="font-medium text-green-600">
                        {question.correctAnswer}
                      </span>
                    </div>
                  )}

                  {/* Explanation */}
                  {question.explanation && (
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                        Giải thích:
                      </span>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredQuestions.length === 0 && (
          <div className="px-6 py-12 text-center text-gray-500">
            Không có câu hỏi nào trong bộ lọc này
          </div>
        )}
      </div>
    </div>
  );
}
```

### Step 4: Time Analytics

```tsx
// src/components/practice/result/TimeAnalytics.tsx
'use client';

import { Clock, Zap, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimeAnalyticsProps {
  totalTime: number; // seconds
  averageTime: number; // seconds per question
  timeLimit?: number; // seconds
  fastestQuestion?: { number: number; time: number };
  slowestQuestion?: { number: number; time: number };
}

export default function TimeAnalytics({
  totalTime,
  averageTime,
  timeLimit,
  fastestQuestion,
  slowestQuestion,
}: TimeAnalyticsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 
      ? `${mins}:${secs.toString().padStart(2, '0')}` 
      : `${secs}s`;
  };

  const formatFullTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m ${secs}s`;
  };

  const timeUsedPercent = timeLimit ? (totalTime / timeLimit) * 100 : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
        <Clock className="w-5 h-5 mr-2" />
        Phân tích thời gian
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Total Time */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Tổng thời gian</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {formatFullTime(totalTime)}
          </div>
          {timeLimit && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{Math.round(timeUsedPercent)}% thời gian</span>
                <span>{formatFullTime(timeLimit)}</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full',
                    timeUsedPercent <= 80 ? 'bg-green-500' : 'bg-yellow-500'
                  )}
                  style={{ width: `${Math.min(timeUsedPercent, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Average Time */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Trung bình/câu</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {formatTime(Math.round(averageTime))}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {averageTime < 60 
              ? 'Tốc độ nhanh 🚀' 
              : averageTime < 120 
                ? 'Tốc độ vừa phải' 
                : 'Nên cải thiện tốc độ'}
          </div>
        </div>

        {/* Fastest Question */}
        {fastestQuestion && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center text-sm text-green-600 mb-1">
              <Zap className="w-4 h-4 mr-1" />
              Nhanh nhất
            </div>
            <div className="text-lg font-bold text-green-700 dark:text-green-400">
              Câu {fastestQuestion.number}
            </div>
            <div className="text-sm text-green-600">
              {formatTime(fastestQuestion.time)}
            </div>
          </div>
        )}

        {/* Slowest Question */}
        {slowestQuestion && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-center text-sm text-yellow-600 mb-1">
              <AlertTriangle className="w-4 h-4 mr-1" />
              Chậm nhất
            </div>
            <div className="text-lg font-bold text-yellow-700 dark:text-yellow-400">
              Câu {slowestQuestion.number}
            </div>
            <div className="text-sm text-yellow-600">
              {formatTime(slowestQuestion.time)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

### Step 5: Result Summary Page

```tsx
// src/app/practice/[skill]/[sessionId]/result/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { practiceService } from '@/services/practiceService';
import ScoreDisplay from '@/components/practice/result/ScoreDisplay';
import PartBreakdown from '@/components/practice/result/PartBreakdown';
import QuestionReview from '@/components/practice/result/QuestionReview';
import TimeAnalytics from '@/components/practice/result/TimeAnalytics';
import { 
  ArrowLeft, 
  RotateCcw, 
  Share2, 
  Download, 
  BookOpen,
  Loader2 
} from 'lucide-react';

export default function ResultSummaryPage() {
  const { skill, sessionId } = useParams<{ skill: string; sessionId: string }>();
  const router = useRouter();
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      loadResult();
    }
  }, [sessionId]);

  const loadResult = async () => {
    try {
      const data = await practiceService.getSessionResult(sessionId);
      setResult(data);
    } catch (error) {
      console.error('Failed to load result:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = async () => {
    // Create new session with same config
    try {
      const newSession = await practiceService.createSession({
        skill: result.skill,
        level: result.level,
        mode: 'practice',
      });
      router.push(`/practice/${skill}/${newSession.id}`);
    } catch (error) {
      console.error('Failed to create new session:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Kết quả luyện tập VSTEP',
        text: `Tôi đạt ${result.overallScore}/10 điểm trong bài luyện ${skill}!`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      alert('Đã copy link vào clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Không tìm thấy kết quả</p>
          <button
            onClick={() => router.push('/practice')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  // Transform data for components
  const partResults = result.sectionResults?.map((section: any) => ({
    partNumber: section.partNumber || 0,
    name: section.partNumber ? `Part ${section.partNumber}` : 'Tổng',
    correct: section.correctCount,
    incorrect: section.incorrectCount,
    skipped: section.skippedCount,
    total: section.totalQuestions,
    percentage: section.percentage,
  })) || [];

  const questionResults = result.sectionResults?.flatMap((section: any, sectionIndex: number) =>
    section.questionResults?.map((q: any, index: number) => ({
      id: q.questionId,
      questionNumber: index + 1 + (sectionIndex * 10), // Approximate
      content: 'Question content', // Would need to fetch
      userAnswer: q.userAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect: q.isCorrect,
      isSkipped: !q.userAnswer,
      explanation: q.explanation,
      timeSpent: q.timeSpent,
      partNumber: section.partNumber,
    }))
  ) || [];

  // Find fastest/slowest
  const sortedByTime = [...questionResults].sort((a, b) => a.timeSpent - b.timeSpent);
  const fastestQuestion = sortedByTime[0];
  const slowestQuestion = sortedByTime[sortedByTime.length - 1];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/practice')}
            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </button>

          <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
            Kết quả luyện tập {skill.charAt(0).toUpperCase() + skill.slice(1)}
          </h1>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Chia sẻ"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => window.print()}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Tải xuống"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Score & Actions */}
          <div className="space-y-6">
            <ScoreDisplay
              score={result.overallScore}
              maxScore={10}
              vstepScore={result.vstepScore}
              level={result.level}
            />

            {/* Suggestions */}
            {result.suggestions?.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Gợi ý học tập
                </h3>
                <ul className="space-y-3">
                  {result.suggestions.map((suggestion: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-start text-gray-700 dark:text-gray-300"
                    >
                      <span className="text-blue-500 mr-2">💡</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleRetry}
                className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Làm lại bài mới
              </button>
              <button
                onClick={() => router.push('/practice')}
                className="flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Chọn bài khác
              </button>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Part Breakdown */}
            {partResults.length > 0 && (
              <PartBreakdown parts={partResults} />
            )}

            {/* Time Analytics */}
            <TimeAnalytics
              totalTime={result.totalTimeSpent}
              averageTime={result.averageTimePerQuestion}
              fastestQuestion={fastestQuestion ? {
                number: fastestQuestion.questionNumber,
                time: fastestQuestion.timeSpent,
              } : undefined}
              slowestQuestion={slowestQuestion ? {
                number: slowestQuestion.questionNumber,
                time: slowestQuestion.timeSpent,
              } : undefined}
            />

            {/* Question Review */}
            <QuestionReview questions={questionResults} />
          </div>
        </div>
      </main>
    </div>
  );
}
```

---

## ✅ Acceptance Criteria

- [ ] Score animates on load
- [ ] VSTEP score badge displayed
- [ ] Part breakdown chart renders
- [ ] Question filter works
- [ ] Expandable question details
- [ ] Time analytics accurate
- [ ] Share functionality works
- [ ] Retry creates new session
- [ ] Responsive on mobile

---

## 📦 Dependencies

```bash
npm install recharts
```

---

## ⏭️ Next Task

→ `FE-015_PRACTICE_STORE.md` - Zustand Practice Store

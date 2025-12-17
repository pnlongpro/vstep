# FE-026: Exam Result Page

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-026 |
| **Phase** | 1 - MVP |
| **Sprint** | 5-6 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 5h |
| **Dependencies** | FE-025 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Existing files cần check:**
> - `components/reading/ReadingResult.tsx` - ✅ Đã có
> - `components/listening/ListeningResult.tsx` - ✅ Đã có
> - `components/writing/WritingResult.tsx` - ✅ Đã có
> - `components/speaking/SpeakingResult.tsx` - ✅ Đã có
> - `components/exam/` - Check nếu có ExamResult

**Action:**
- ✅ CHECK existing result components
- ✅ COMPOSE: Tạo ExamResultPage sử dụng các Result components có sẵn
- ✅ ADD overall VSTEP score display
- ✅ INTEGRATE với BE-026 Result API
- ❌ KHÔNG tạo lại skill-specific result UI

---

## 🎯 Objective

Implement Exam Result Page (sử dụng existing components):
- VSTEP score display with band
- Skill breakdown (4 skills)
- Question-by-question review
- AI feedback for Writing/Speaking
- Score comparison with previous
- Export and share options

---

## 💻 Implementation

### Step 1: Result Page Layout

```tsx
// src/app/(main)/exams/[attemptId]/result/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { examService } from '@/services/examService';
import { ResultHeader } from '@/features/exam-result/ResultHeader';
import { ScoreOverview } from '@/features/exam-result/ScoreOverview';
import { SkillBreakdown } from '@/features/exam-result/SkillBreakdown';
import { QuestionReview } from '@/features/exam-result/QuestionReview';
import { Recommendations } from '@/features/exam-result/Recommendations';
import { ResultActions } from '@/features/exam-result/ResultActions';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';

export default function ExamResultPage() {
  const params = useParams();
  const attemptId = params.attemptId as string;

  const {
    data: result,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['exam-result', attemptId],
    queryFn: () => examService.results.getResult(attemptId),
    retry: 3,
  });

  if (isLoading) {
    return <ResultPageSkeleton />;
  }

  if (error || !result) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load exam results. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with basic info */}
      <ResultHeader result={result} />

      <main className="container mx-auto px-4 py-8">
        {/* Score Overview */}
        <section className="mb-8">
          <ScoreOverview result={result} />
        </section>

        {/* Tabs for detailed view */}
        <Tabs defaultValue="breakdown" className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="breakdown">Skill Breakdown</TabsTrigger>
            <TabsTrigger value="review">Answer Review</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="breakdown">
            <SkillBreakdown result={result} />
          </TabsContent>

          <TabsContent value="review">
            <QuestionReview result={result} />
          </TabsContent>

          <TabsContent value="recommendations">
            <Recommendations result={result} />
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <section className="mt-8">
          <ResultActions attemptId={attemptId} result={result} />
        </section>
      </main>
    </div>
  );
}

function ResultPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b py-8">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-64 w-full rounded-xl mb-8" />
        <div className="grid md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
```

### Step 2: Result Header Component

```tsx
// src/features/exam-result/ResultHeader.tsx
'use client';

import { ExamResult } from '@/types/exam';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/date';
import { Clock, Calendar, Award } from 'lucide-react';
import { formatDuration } from '@/utils/time';

interface ResultHeaderProps {
  result: ExamResult;
}

const bandColors: Record<string, string> = {
  C1: 'bg-purple-500',
  B2: 'bg-blue-500',
  B1: 'bg-green-500',
  A2: 'bg-yellow-500',
  A1: 'bg-orange-500',
};

export function ResultHeader({ result }: ResultHeaderProps) {
  return (
    <header className="bg-white border-b py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{result.examTitle}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(result.completedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(result.totalDuration)}</span>
              </div>
              <Badge variant="outline">{result.level}</Badge>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">VSTEP Score</p>
              <p className="text-4xl font-bold text-blue-600">
                {result.vstepScore.toFixed(1)}
              </p>
            </div>
            <div
              className={`px-6 py-3 rounded-xl text-white ${
                bandColors[result.band] || 'bg-gray-500'
              }`}
            >
              <Award className="w-6 h-6 mx-auto mb-1" />
              <p className="font-bold text-lg">{result.band}</p>
              <p className="text-xs opacity-90">{result.bandLabel}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
```

### Step 3: Score Overview Component

```tsx
// src/features/exam-result/ScoreOverview.tsx
'use client';

import { ExamResult } from '@/types/exam';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';

interface ScoreOverviewProps {
  result: ExamResult;
}

const skillConfig = {
  reading: {
    icon: BookOpen,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    progressColor: 'bg-blue-500',
  },
  listening: {
    icon: Headphones,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    progressColor: 'bg-green-500',
  },
  writing: {
    icon: PenTool,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    progressColor: 'bg-purple-500',
  },
  speaking: {
    icon: Mic,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    progressColor: 'bg-orange-500',
  },
};

export function ScoreOverview({ result }: ScoreOverviewProps) {
  const { comparison } = result;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white text-xl">Score Overview</CardTitle>
            <p className="text-blue-100 mt-1">
              {result.summary.correctAnswers} of {result.summary.totalQuestions}{' '}
              questions correct
            </p>
          </div>

          {comparison && (
            <div className="text-right">
              <div className="flex items-center gap-2">
                {comparison.improvement > 0 ? (
                  <>
                    <TrendingUp className="w-5 h-5 text-green-300" />
                    <span className="text-green-300 font-medium">
                      +{comparison.improvement.toFixed(1)}
                    </span>
                  </>
                ) : comparison.improvement < 0 ? (
                  <>
                    <TrendingDown className="w-5 h-5 text-red-300" />
                    <span className="text-red-300 font-medium">
                      {comparison.improvement.toFixed(1)}
                    </span>
                  </>
                ) : (
                  <>
                    <Minus className="w-5 h-5 text-gray-300" />
                    <span className="text-gray-300">No change</span>
                  </>
                )}
              </div>
              <p className="text-xs text-blue-200 mt-1">
                vs previous: {comparison.previousScore.toFixed(1)}
              </p>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid md:grid-cols-4 gap-6">
          {result.sections.map((section) => {
            const skill = section.skill as keyof typeof skillConfig;
            const config = skillConfig[skill];
            const Icon = config?.icon || BookOpen;
            const scorePercent = (section.vstepScore / 10) * 100;

            return (
              <div
                key={section.sectionId}
                className={cn(
                  'p-4 rounded-xl border-2 transition-all hover:shadow-md',
                  config?.bgColor
                )}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn('p-2 rounded-lg bg-white', config?.color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold capitalize">{skill}</h3>
                    <p className="text-xs text-gray-500">
                      {section.correctCount}/{section.totalCount} correct
                    </p>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Score</span>
                    <span className={cn('font-bold', config?.color)}>
                      {section.vstepScore.toFixed(1)}/10
                    </span>
                  </div>
                  <Progress
                    value={scorePercent}
                    className={cn('h-2', config?.progressColor)}
                  />
                </div>

                <p className="text-xs text-gray-500">
                  Time: {Math.round(section.timeSpent / 60)} min
                </p>
              </div>
            );
          })}
        </div>

        {/* Percentile Info */}
        {comparison && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-sm text-gray-600">
              You scored better than{' '}
              <span className="font-bold text-blue-600">
                {comparison.percentile}%
              </span>{' '}
              of all test takers at this level
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

### Step 4: Skill Breakdown Component

```tsx
// src/features/exam-result/SkillBreakdown.tsx
'use client';

import { useState } from 'react';
import { ExamResult, SkillAnalysis } from '@/types/exam';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  ThumbsUp,
  AlertTriangle,
} from 'lucide-react';

interface SkillBreakdownProps {
  result: ExamResult;
}

const skillIcons: Record<string, any> = {
  reading: BookOpen,
  listening: Headphones,
  writing: PenTool,
  speaking: Mic,
};

const performanceColors: Record<string, string> = {
  excellent: 'bg-green-100 text-green-800 border-green-200',
  good: 'bg-blue-100 text-blue-800 border-blue-200',
  fair: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  needs_improvement: 'bg-red-100 text-red-800 border-red-200',
};

export function SkillBreakdown({ result }: SkillBreakdownProps) {
  const [activeSkill, setActiveSkill] = useState<string>(
    result.skillAnalysis[0]?.skill || 'reading'
  );

  const activeAnalysis = result.skillAnalysis.find((a) => a.skill === activeSkill);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Skill Analysis</CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs value={activeSkill} onValueChange={setActiveSkill}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            {result.skillAnalysis.map((analysis) => {
              const Icon = skillIcons[analysis.skill] || BookOpen;
              return (
                <TabsTrigger
                  key={analysis.skill}
                  value={analysis.skill}
                  className="gap-2"
                >
                  <Icon className="w-4 h-4" />
                  <span className="capitalize hidden sm:inline">
                    {analysis.skill}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {result.skillAnalysis.map((analysis) => (
            <TabsContent key={analysis.skill} value={analysis.skill}>
              <SkillDetail analysis={analysis} />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

function SkillDetail({ analysis }: { analysis: SkillAnalysis }) {
  const Icon = skillIcons[analysis.skill] || BookOpen;

  return (
    <div className="space-y-6">
      {/* Score and Performance */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm">
            <Icon className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">
              {analysis.vstepScore.toFixed(1)}
              <span className="text-lg text-gray-400">/10</span>
            </h3>
            <p className="text-sm text-gray-500 capitalize">{analysis.skill}</p>
          </div>
        </div>

        <Badge
          className={cn('text-sm px-4 py-1', performanceColors[analysis.performance])}
        >
          {analysis.performance.replace('_', ' ')}
        </Badge>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Score Progress</span>
          <span>{Math.round(analysis.vstepScore * 10)}%</span>
        </div>
        <Progress value={analysis.vstepScore * 10} className="h-3" />
      </div>

      {/* Strengths and Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
          <h4 className="font-medium text-green-800 flex items-center gap-2 mb-3">
            <ThumbsUp className="w-4 h-4" />
            Strengths
          </h4>
          {analysis.strengths.length > 0 ? (
            <ul className="space-y-2">
              {analysis.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-green-700">
                  <span className="text-green-500 mt-1">✓</span>
                  {strength}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-green-600 italic">
              Keep practicing to identify your strengths
            </p>
          )}
        </div>

        {/* Weaknesses */}
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
          <h4 className="font-medium text-amber-800 flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4" />
            Areas to Improve
          </h4>
          {analysis.weaknesses.length > 0 ? (
            <ul className="space-y-2">
              {analysis.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-amber-700">
                  <span className="text-amber-500 mt-1">!</span>
                  {weakness}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-amber-600 italic">
              Great job! No major weaknesses identified
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
```

### Step 5: Question Review Component

```tsx
// src/features/exam-result/QuestionReview.tsx
'use client';

import { useState } from 'react';
import { ExamResult, QuestionResult, SectionResult } from '@/types/exam';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import {
  Check,
  X,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  MessageSquare,
} from 'lucide-react';

interface QuestionReviewProps {
  result: ExamResult;
}

const skillIcons: Record<string, any> = {
  reading: BookOpen,
  listening: Headphones,
  writing: PenTool,
  speaking: Mic,
};

export function QuestionReview({ result }: QuestionReviewProps) {
  const [filter, setFilter] = useState<'all' | 'correct' | 'incorrect'>('all');
  const [activeSection, setActiveSection] = useState<string>(
    result.sections[0]?.sectionId || ''
  );

  const activeResult = result.sections.find((s) => s.sectionId === activeSection);

  const filteredQuestions = activeResult?.questions.filter((q) => {
    if (filter === 'correct') return q.isCorrect;
    if (filter === 'incorrect') return !q.isCorrect;
    return true;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Answer Review</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'correct' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('correct')}
              className="gap-1"
            >
              <Check className="w-3 h-3" />
              Correct
            </Button>
            <Button
              variant={filter === 'incorrect' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('incorrect')}
              className="gap-1"
            >
              <X className="w-3 h-3" />
              Incorrect
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeSection} onValueChange={setActiveSection}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            {result.sections.map((section) => {
              const Icon = skillIcons[section.skill] || BookOpen;
              const incorrectCount = section.questions.filter((q) => !q.isCorrect).length;
              return (
                <TabsTrigger
                  key={section.sectionId}
                  value={section.sectionId}
                  className="gap-2 relative"
                >
                  <Icon className="w-4 h-4" />
                  <span className="capitalize hidden sm:inline">
                    {section.skill}
                  </span>
                  {incorrectCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center"
                    >
                      {incorrectCount}
                    </Badge>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {result.sections.map((section) => (
            <TabsContent key={section.sectionId} value={section.sectionId}>
              <div className="space-y-4">
                {filteredQuestions?.map((question) => (
                  <QuestionCard key={question.questionId} question={question} />
                ))}

                {filteredQuestions?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No questions match the selected filter
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

function QuestionCard({ question }: { question: QuestionResult }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div
        className={cn(
          'rounded-lg border-2 overflow-hidden',
          question.isCorrect ? 'border-green-200' : 'border-red-200'
        )}
      >
        <CollapsibleTrigger className="w-full">
          <div
            className={cn(
              'flex items-center justify-between p-4',
              question.isCorrect ? 'bg-green-50' : 'bg-red-50'
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  question.isCorrect ? 'bg-green-500' : 'bg-red-500',
                  'text-white'
                )}
              >
                {question.isCorrect ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4" />
                )}
              </div>
              <div className="text-left">
                <p className="font-medium">Question {question.questionNumber}</p>
                <p className="text-sm text-gray-500 line-clamp-1">
                  {question.questionText}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">
                {question.pointsEarned}/{question.maxPoints} pts
              </span>
              {isOpen ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="p-4 bg-white space-y-4">
            {/* Question Text */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Question</p>
              <p>{question.questionText}</p>
            </div>

            {/* Options (for MCQ) */}
            {question.options && (
              <div className="space-y-2">
                {question.options.map((option) => (
                  <div
                    key={option.id}
                    className={cn(
                      'p-3 rounded-lg border text-sm',
                      option.isCorrect && 'bg-green-50 border-green-300',
                      option.isSelected && !option.isCorrect && 'bg-red-50 border-red-300'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option.text}</span>
                      <div className="flex items-center gap-2">
                        {option.isSelected && (
                          <Badge variant="outline">Your answer</Badge>
                        )}
                        {option.isCorrect && (
                          <Badge className="bg-green-500">Correct</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* User Answer vs Correct (for non-MCQ) */}
            {!question.options && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">Your Answer</p>
                  <p className={cn(!question.userAnswer && 'italic text-gray-400')}>
                    {question.userAnswer || 'No answer provided'}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700 mb-2">Correct Answer</p>
                  <p className="text-green-800">{question.correctAnswer}</p>
                </div>
              </div>
            )}

            {/* AI Feedback (for Writing/Speaking) */}
            {question.aiScore && (
              <div className="bg-blue-50 rounded-lg p-4 mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  <h4 className="font-medium text-blue-800">AI Feedback</h4>
                </div>

                <div className="space-y-3">
                  {Object.entries(question.aiScore.criteria).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize text-blue-700">
                          {key.replace(/_/g, ' ')}
                        </span>
                        <span className="font-medium">{value.score}/10</span>
                      </div>
                      <p className="text-sm text-blue-600">{value.feedback}</p>
                    </div>
                  ))}
                </div>

                {question.aiScore.suggestions && (
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <h5 className="text-sm font-medium text-blue-800 mb-2">
                      Suggestions for Improvement
                    </h5>
                    <ul className="space-y-1">
                      {question.aiScore.suggestions.map((suggestion, i) => (
                        <li key={i} className="text-sm text-blue-700 flex items-start gap-2">
                          <span>•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Explanation */}
            {question.explanation && (
              <div className="p-4 bg-amber-50 rounded-lg">
                <p className="text-sm text-amber-800 font-medium mb-1">
                  Explanation
                </p>
                <p className="text-sm text-amber-700">{question.explanation}</p>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
```

### Step 6: Result Actions Component

```tsx
// src/features/exam-result/ResultActions.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExamResult } from '@/types/exam';
import { examService } from '@/services/examService';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Download,
  Share2,
  RotateCcw,
  Award,
  Copy,
  FileJson,
  FileText,
  FileSpreadsheet,
  Check,
} from 'lucide-react';

interface ResultActionsProps {
  attemptId: string;
  result: ExamResult;
}

export function ResultActions({ attemptId, result }: ResultActionsProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isGeneratingShare, setIsGeneratingShare] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleExport = async (format: 'json' | 'csv' | 'pdf') => {
    try {
      const data = await examService.results.exportResult(attemptId, format);

      // Create download link
      const blob = format === 'json' ? new Blob([JSON.stringify(data, null, 2)]) : data;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `exam-result-${attemptId}.${format}`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: 'Export Successful',
        description: `Your results have been exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Could not export results. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCreateShare = async () => {
    setIsGeneratingShare(true);
    try {
      const { shareUrl: url } = await examService.results.createShareLink(attemptId, 7);
      setShareUrl(url);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not create share link',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingShare(false);
    }
  };

  const handleCopyShare = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const canGenerateCertificate = result.vstepScore >= 4.0;

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {/* Retake */}
      <Button
        variant="outline"
        onClick={() => router.push('/exams')}
        className="gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        Take Another Test
      </Button>

      {/* Export */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Results
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleExport('pdf')} className="gap-2">
            <FileText className="w-4 h-4" />
            PDF Report
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('json')} className="gap-2">
            <FileJson className="w-4 h-4" />
            JSON Data
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('csv')} className="gap-2">
            <FileSpreadsheet className="w-4 h-4" />
            CSV Spreadsheet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Share */}
      <Button
        variant="outline"
        onClick={() => {
          setIsShareModalOpen(true);
          handleCreateShare();
        }}
        className="gap-2"
      >
        <Share2 className="w-4 h-4" />
        Share Results
      </Button>

      {/* Certificate */}
      <Button
        onClick={() => router.push(`/exams/${attemptId}/certificate`)}
        disabled={!canGenerateCertificate}
        className="gap-2"
      >
        <Award className="w-4 h-4" />
        {canGenerateCertificate ? 'Get Certificate' : 'Certificate (Score ≥ 4.0)'}
      </Button>

      {/* Share Modal */}
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Results</DialogTitle>
            <DialogDescription>
              Share your exam results with others using this link. The link will
              expire in 7 days.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {isGeneratingShare ? (
              <div className="animate-pulse h-10 bg-gray-100 rounded" />
            ) : shareUrl ? (
              <div className="flex gap-2">
                <Input value={shareUrl} readOnly className="flex-1" />
                <Button onClick={handleCopyShare} className="gap-2">
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            ) : null}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsShareModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

---

## ✅ Acceptance Criteria

- [ ] VSTEP score displayed prominently
- [ ] Band label shown (A1-C1)
- [ ] Skill scores with progress bars
- [ ] Score comparison with previous
- [ ] Question review with correct/incorrect filter
- [ ] AI feedback for Writing/Speaking displayed
- [ ] Export options (PDF, JSON, CSV)
- [ ] Share link generation works
- [ ] Certificate button enabled when score ≥ 4.0

---

## ⏭️ Next Task

→ `FE-027_CERTIFICATE_DOWNLOAD.md` - Certificate Download Page

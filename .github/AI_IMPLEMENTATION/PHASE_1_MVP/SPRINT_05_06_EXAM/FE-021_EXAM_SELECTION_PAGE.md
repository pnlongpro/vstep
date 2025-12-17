# FE-021: Exam Selection Page

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-021 |
| **Phase** | 1 - MVP |
| **Sprint** | 5-6 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 3h |
| **Dependencies** | FE-020 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Existing files:**
> - `components/exam/exam-room.tsx` - ✅ Đã có, có thể chứa exam selection
> - Check trước khi tạo mới

**Action:**
- ✅ CHECK `exam-room.tsx` và `ExamInterface.tsx` xem có selection chưa
- ✅ CREATE page route `app/(dashboard)/exam/page.tsx` nếu cần
- ✅ ADD React Query hooks cho exam listing
- ❌ KHÔNG tạo lại UI nếu đã có

---

## 🎯 Objective

Implement Exam Selection Page với:
- Exam set listing by level
- Level filter (A2/B1/B2/C1)
- Active session detection
- Confirmation modal before start
- Resume paused exam prompt

---

## 💻 Implementation

### Step 1: Exam Selection Store

```typescript
// src/store/examStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ExamSet,
  ExamAttempt,
  ExamAnswer,
  SessionInfo,
  ExamResult,
} from '@/types/exam';

interface ExamState {
  // Exam sets
  examSets: ExamSet[];
  selectedExamSet: ExamSet | null;
  selectedLevel: string | null;

  // Current attempt
  currentAttempt: ExamAttempt | null;
  currentAnswers: Map<string, ExamAnswer>;
  currentSectionId: string | null;
  currentQuestionIndex: number;

  // Session
  activeSession: SessionInfo | null;
  hasActiveSession: boolean;

  // Results
  lastResult: ExamResult | null;

  // Actions
  setExamSets: (sets: ExamSet[]) => void;
  setSelectedExamSet: (set: ExamSet | null) => void;
  setSelectedLevel: (level: string | null) => void;
  setCurrentAttempt: (attempt: ExamAttempt | null) => void;
  setAnswer: (questionId: string, answer: ExamAnswer) => void;
  setCurrentSection: (sectionId: string | null) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setActiveSession: (session: SessionInfo | null) => void;
  setLastResult: (result: ExamResult | null) => void;
  clearExamState: () => void;
  loadAnswers: (answers: ExamAnswer[]) => void;
}

export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      examSets: [],
      selectedExamSet: null,
      selectedLevel: null,
      currentAttempt: null,
      currentAnswers: new Map(),
      currentSectionId: null,
      currentQuestionIndex: 0,
      activeSession: null,
      hasActiveSession: false,
      lastResult: null,

      setExamSets: (sets) => set({ examSets: sets }),
      setSelectedExamSet: (examSet) => set({ selectedExamSet: examSet }),
      setSelectedLevel: (level) => set({ selectedLevel: level }),
      setCurrentAttempt: (attempt) =>
        set({
          currentAttempt: attempt,
          currentSectionId: attempt?.currentSectionId || null,
          currentQuestionIndex: attempt?.currentQuestionIndex || 0,
        }),
      setAnswer: (questionId, answer) =>
        set((state) => {
          const newAnswers = new Map(state.currentAnswers);
          newAnswers.set(questionId, answer);
          return { currentAnswers: newAnswers };
        }),
      setCurrentSection: (sectionId) => set({ currentSectionId: sectionId }),
      setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
      setActiveSession: (session) =>
        set({ activeSession: session, hasActiveSession: !!session }),
      setLastResult: (result) => set({ lastResult: result }),
      clearExamState: () =>
        set({
          currentAttempt: null,
          currentAnswers: new Map(),
          currentSectionId: null,
          currentQuestionIndex: 0,
          activeSession: null,
          hasActiveSession: false,
        }),
      loadAnswers: (answers) =>
        set({
          currentAnswers: new Map(answers.map((a) => [a.questionId, a])),
        }),
    }),
    {
      name: 'exam-storage',
      partialize: (state) => ({
        selectedLevel: state.selectedLevel,
      }),
    }
  )
);
```

### Step 2: Exam Card Component

```tsx
// src/components/exam/ExamCard.tsx
'use client';

import { ExamSet } from '@/types/exam';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, BookOpen, Headphones, PenTool, Mic } from 'lucide-react';
import { formatDuration } from '@/utils/time';
import { cn } from '@/lib/utils';

interface ExamCardProps {
  examSet: ExamSet;
  onSelect: (examSet: ExamSet) => void;
  isPreviouslyAttempted?: boolean;
  bestScore?: number;
}

const levelColors: Record<string, string> = {
  A2: 'bg-green-100 text-green-800 border-green-200',
  B1: 'bg-blue-100 text-blue-800 border-blue-200',
  B2: 'bg-purple-100 text-purple-800 border-purple-200',
  C1: 'bg-orange-100 text-orange-800 border-orange-200',
};

const skillIcons: Record<string, React.ReactNode> = {
  reading: <BookOpen className="w-4 h-4" />,
  listening: <Headphones className="w-4 h-4" />,
  writing: <PenTool className="w-4 h-4" />,
  speaking: <Mic className="w-4 h-4" />,
};

export function ExamCard({
  examSet,
  onSelect,
  isPreviouslyAttempted,
  bestScore,
}: ExamCardProps) {
  const totalQuestions = examSet.sections.reduce(
    (acc, section) =>
      acc + section.passages.reduce((sum, p) => sum + p.questions.length, 0),
    0
  );

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 relative overflow-hidden">
      {isPreviouslyAttempted && (
        <div className="absolute top-2 right-2">
          <Badge variant="outline" className="bg-white">
            Best: {bestScore?.toFixed(1)}/10
          </Badge>
        </div>
      )}

      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <Badge className={cn('mb-2', levelColors[examSet.level])}>
              Level {examSet.level}
            </Badge>
            <h3 className="text-xl font-semibold">{examSet.title}</h3>
          </div>
        </div>
        <p className="text-gray-600 text-sm mt-2">{examSet.description}</p>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(examSet.duration * 60)}</span>
          </div>
          <span>•</span>
          <span>{totalQuestions} questions</span>
          <span>•</span>
          <span>{examSet.sections.length} sections</span>
        </div>

        <div className="flex gap-2 flex-wrap">
          {examSet.sections.map((section) => (
            <div
              key={section.id}
              className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-xs"
            >
              {skillIcons[section.skill]}
              <span className="capitalize">{section.skill}</span>
              <span className="text-gray-400">({section.duration}m)</span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={() => onSelect(examSet)} className="w-full">
          {isPreviouslyAttempted ? 'Retake Exam' : 'Start Exam'}
        </Button>
      </CardFooter>
    </Card>
  );
}
```

### Step 3: Resume Exam Modal

```tsx
// src/components/exam/ResumeExamModal.tsx
'use client';

import { SessionInfo } from '@/types/exam';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, AlertTriangle, Play, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { formatDuration } from '@/utils/time';

interface ResumeExamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: SessionInfo | null;
  onResume: () => void;
  onAbandon: () => void;
  isLoading?: boolean;
}

export function ResumeExamModal({
  open,
  onOpenChange,
  session,
  onResume,
  onAbandon,
  isLoading,
}: ResumeExamModalProps) {
  if (!session) return null;

  const lastActivity = formatDistanceToNow(new Date(session.lastActivityAt), {
    addSuffix: true,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="w-5 h-5 text-blue-500" />
            Resume Paused Exam?
          </DialogTitle>
          <DialogDescription>
            You have an unfinished exam session. Would you like to continue?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Last activity:</span>
              <span className="font-medium">{lastActivity}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Time remaining:</span>
              <span className="font-medium text-blue-600">
                {formatDuration(session.timeRemaining)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status:</span>
              <span className="font-medium capitalize">{session.status}</span>
            </div>
          </div>

          {!session.canResume && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This session can no longer be resumed. It may have expired or
                been accessed from another device.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onAbandon}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Start Fresh
          </Button>
          <Button
            onClick={onResume}
            disabled={!session.canResume || isLoading}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Resume Exam
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### Step 4: Start Exam Confirmation Modal

```tsx
// src/components/exam/StartExamModal.tsx
'use client';

import { ExamSet } from '@/types/exam';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { formatDuration } from '@/utils/time';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface StartExamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  examSet: ExamSet | null;
  onStart: () => void;
  isLoading?: boolean;
}

const skillIcons: Record<string, React.ReactNode> = {
  reading: <BookOpen className="w-5 h-5 text-blue-500" />,
  listening: <Headphones className="w-5 h-5 text-green-500" />,
  writing: <PenTool className="w-5 h-5 text-purple-500" />,
  speaking: <Mic className="w-5 h-5 text-orange-500" />,
};

const rules = [
  'Once started, the timer cannot be paused or reset',
  'Ensure stable internet connection throughout the exam',
  'Keep your browser window active - switching tabs may be detected',
  'Auto-save will preserve your answers every 10 seconds',
  'You can flag questions and return to them later',
  'Submit before time runs out to avoid automatic submission',
];

export function StartExamModal({
  open,
  onOpenChange,
  examSet,
  onStart,
  isLoading,
}: StartExamModalProps) {
  const [acceptedRules, setAcceptedRules] = useState(false);

  if (!examSet) return null;

  const totalQuestions = examSet.sections.reduce(
    (acc, section) =>
      acc + section.passages.reduce((sum, p) => sum + p.questions.length, 0),
    0
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Ready to Start?</DialogTitle>
          <DialogDescription>
            Review the exam details and rules before starting
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Exam Info */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-lg">{examSet.title}</h3>
              <Badge className="bg-blue-500">{examSet.level}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Duration: {formatDuration(examSet.duration * 60)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <CheckCircle className="w-4 h-4" />
                <span>{totalQuestions} questions</span>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div>
            <h4 className="font-medium mb-3">Exam Sections</h4>
            <div className="space-y-2">
              {examSet.sections
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((section, index) => {
                  const questionCount = section.passages.reduce(
                    (sum, p) => sum + p.questions.length,
                    0
                  );
                  return (
                    <div
                      key={section.id}
                      className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        {skillIcons[section.skill]}
                        <span className="font-medium capitalize">
                          {section.title || section.skill}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{questionCount} Q</span>
                        <span>{section.duration} min</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Rules */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Important Rules
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {rules.map((rule, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-gray-400">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Acceptance */}
          <div className="flex items-start gap-3 bg-amber-50 rounded-lg p-4">
            <Checkbox
              id="accept-rules"
              checked={acceptedRules}
              onCheckedChange={(checked) => setAcceptedRules(!!checked)}
            />
            <label
              htmlFor="accept-rules"
              className="text-sm text-amber-800 cursor-pointer"
            >
              I understand the rules and confirm that I am ready to begin the
              exam. I acknowledge that my progress will be timed and answers
              auto-saved.
            </label>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={onStart}
            disabled={!acceptedRules || isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? 'Starting...' : 'Start Exam'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### Step 5: Exam Selection Page

```tsx
// src/app/(main)/exams/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { examService } from '@/services/examService';
import { useExamStore } from '@/store/examStore';
import { ExamSet, ActiveSessions } from '@/types/exam';
import { ExamCard } from '@/components/exam/ExamCard';
import { StartExamModal } from '@/components/exam/StartExamModal';
import { ResumeExamModal } from '@/components/exam/ResumeExamModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Search, Filter, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { getDeviceFingerprint } from '@/utils/fingerprint';

const levels = ['ALL', 'A2', 'B1', 'B2', 'C1'] as const;

export default function ExamsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExamSet, setSelectedExamSet] = useState<ExamSet | null>(null);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  const {
    setExamSets,
    setSelectedExamSet: setStoreExamSet,
    setCurrentAttempt,
    setActiveSession,
    activeSession,
  } = useExamStore();

  // Fetch exam sets
  const {
    data: examSetsResponse,
    isLoading: loadingExams,
    error: examsError,
  } = useQuery({
    queryKey: ['exam-sets', selectedLevel],
    queryFn: () =>
      examService.sets.getAll({
        level: selectedLevel === 'ALL' ? undefined : selectedLevel,
        isActive: true,
      }),
  });

  // Check for active sessions
  const { data: activeSessions, isLoading: loadingSessions } = useQuery({
    queryKey: ['active-sessions'],
    queryFn: () => examService.sessions.getActive(),
  });

  // Start exam mutation
  const startExamMutation = useMutation({
    mutationFn: async (examSetId: string) => {
      const fingerprint = await getDeviceFingerprint();
      return examService.attempts.start(examSetId, fingerprint);
    },
    onSuccess: (attempt) => {
      setCurrentAttempt(attempt);
      router.push(`/exams/${attempt.id}`);
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to Start Exam',
        description: error.message || 'Could not start the exam. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Resume exam mutation
  const resumeExamMutation = useMutation({
    mutationFn: (attemptId: string) => examService.attempts.resume(attemptId),
    onSuccess: (attempt) => {
      setCurrentAttempt(attempt);
      router.push(`/exams/${attempt.id}`);
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to Resume Exam',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Abandon session mutation
  const abandonMutation = useMutation({
    mutationFn: (attemptId: string) => examService.sessions.terminate(attemptId),
    onSuccess: () => {
      setActiveSession(null);
      setShowResumeModal(false);
      // Now start new exam
      if (selectedExamSet) {
        startExamMutation.mutate(selectedExamSet.id);
      }
    },
  });

  useEffect(() => {
    if (examSetsResponse?.data) {
      setExamSets(examSetsResponse.data);
    }
  }, [examSetsResponse, setExamSets]);

  // Check for paused sessions on mount
  useEffect(() => {
    if (activeSessions?.hasActiveSession && activeSessions.activeSession) {
      setActiveSession(activeSessions.activeSession);
      setShowResumeModal(true);
    }
  }, [activeSessions, setActiveSession]);

  const handleExamSelect = (examSet: ExamSet) => {
    setSelectedExamSet(examSet);
    setStoreExamSet(examSet);

    // Check if there's an active session for this exam
    if (
      activeSessions?.hasActiveSession &&
      activeSessions.activeSession?.examSetId === examSet.id
    ) {
      setShowResumeModal(true);
    } else {
      setShowStartModal(true);
    }
  };

  const handleStartExam = () => {
    if (!selectedExamSet) return;
    setShowStartModal(false);
    startExamMutation.mutate(selectedExamSet.id);
  };

  const handleResumeExam = () => {
    if (!activeSessions?.activeSession) return;
    setShowResumeModal(false);
    resumeExamMutation.mutate(activeSessions.activeSession.attemptId);
  };

  const handleAbandonSession = () => {
    if (!activeSessions?.activeSession) return;
    abandonMutation.mutate(activeSessions.activeSession.attemptId);
  };

  // Filter exam sets
  const filteredExamSets = (examSetsResponse?.data || []).filter((exam) => {
    const matchesSearch =
      !searchQuery ||
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const isLoading = loadingExams || loadingSessions;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">VSTEP Mock Tests</h1>
        <p className="text-gray-600">
          Challenge yourself with full-length mock tests and get instant AI feedback
        </p>
      </div>

      {/* Active Session Alert */}
      {activeSessions?.hasActiveSession && (
        <Alert className="mb-6 border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Unfinished Exam</AlertTitle>
          <AlertDescription className="text-amber-700">
            You have an unfinished exam session. Would you like to continue where
            you left off?
            <Button
              variant="link"
              className="ml-2 text-amber-800 underline p-0 h-auto"
              onClick={() => setShowResumeModal(true)}
            >
              Resume Now
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search exams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs
          value={selectedLevel}
          onValueChange={setSelectedLevel}
          className="w-full sm:w-auto"
        >
          <TabsList>
            {levels.map((level) => (
              <TabsTrigger key={level} value={level}>
                {level}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-72 rounded-lg" />
          ))}
        </div>
      )}

      {/* Error State */}
      {examsError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load exam sets. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      {/* Exam Grid */}
      {!isLoading && !examsError && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExamSets.map((examSet) => (
            <ExamCard
              key={examSet.id}
              examSet={examSet}
              onSelect={handleExamSelect}
              isPreviouslyAttempted={false} // TODO: Fetch from history
              bestScore={undefined}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredExamSets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No exams found for the selected criteria.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedLevel('ALL');
              setSearchQuery('');
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Modals */}
      <StartExamModal
        open={showStartModal}
        onOpenChange={setShowStartModal}
        examSet={selectedExamSet}
        onStart={handleStartExam}
        isLoading={startExamMutation.isPending}
      />

      <ResumeExamModal
        open={showResumeModal}
        onOpenChange={setShowResumeModal}
        session={activeSessions?.activeSession || null}
        onResume={handleResumeExam}
        onAbandon={handleAbandonSession}
        isLoading={resumeExamMutation.isPending || abandonMutation.isPending}
      />
    </div>
  );
}
```

---

## ✅ Acceptance Criteria

- [ ] Exam sets load with level filtering
- [ ] Search functionality works
- [ ] Active session detection on page load
- [ ] Resume modal shows for paused exams
- [ ] Start confirmation modal with rules
- [ ] Navigation to exam room after start/resume

---

## ⏭️ Next Task

→ `FE-022_EXAM_SESSION_LAYOUT.md` - Exam Session Layout

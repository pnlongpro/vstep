# FE-022: Exam Session Layout

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-022 |
| **Phase** | 1 - MVP |
| **Sprint** | 5-6 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 2h |
| **Dependencies** | FE-020, FE-021 |

---

## 🚨🚨🚨 CỰC KỲ QUAN TRỌNG - ĐỌC NGAY!

> **🚨 COMPONENT CỰC LỚN ĐÃ CÓ SẴN:**
> - `components/exam/ExamInterface.tsx` - ✅ **~1379 LINES - RẤT HOÀN CHỈNH!**
>
> **Đã có trong ExamInterface.tsx:**
> - ✅ Full-screen exam interface
> - ✅ Section-based content display
> - ✅ Question renderer for ALL types
> - ✅ Audio player for Listening
> - ✅ Text editor for Writing
> - ✅ Audio recorder for Speaking
> - ✅ Timer component
> - ✅ Navigation grid
> - ✅ Flagged questions
> - ✅ Pre-submit review

**Action:**
- 🚫 **TUYEDT ĐỐI KHÔNG VIẾT LẠI!**
- ✅ CREATE page route wrapper
- ✅ INTEGRATE với FE-020 API service
- ✅ ADD React Query hooks
- ✅ CONNECT to Zustand store

---

## 🎯 Objective

INTEGRATE Exam Session với API (không tạo lại UI):
- Full-screen exam interface
- Section-based content display
- Question renderer for all types
- Audio player for Listening
- Text editor for Writing
- Audio recorder for Speaking

---

## 💻 Implementation

### Step 1: Exam Session Provider

```tsx
// src/features/exam/ExamSessionProvider.tsx
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { useExamStore } from '@/store/examStore';
import { examService } from '@/services/examService';
import {
  ExamAttempt,
  ExamSet,
  ExamSection,
  Question,
  ExamAnswer,
} from '@/types/exam';
import { useExamTimer, useExamAutoSave, useExamSession } from '@/hooks/useExam';
import { useToast } from '@/hooks/useToast';

interface ExamSessionContextType {
  // Data
  attempt: ExamAttempt | null;
  examSet: ExamSet | null;
  currentSection: ExamSection | null;
  currentQuestion: Question | null;
  answers: Map<string, ExamAnswer>;

  // Timer
  totalTimeRemaining: number;
  sectionTimeRemaining: number;
  isExpired: boolean;

  // Navigation
  questionIndex: number;
  sectionIndex: number;
  totalQuestions: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  navigateToQuestion: (index: number) => void;
  navigateToSection: (sectionId: string) => void;
  goNext: () => void;
  goPrevious: () => void;

  // Answers
  submitAnswer: (answer: Partial<ExamAnswer>) => void;
  getAnswer: (questionId: string) => ExamAnswer | undefined;
  toggleFlag: (questionId: string) => void;

  // State
  isLoading: boolean;
  isSubmitting: boolean;
  isPaused: boolean;

  // Actions
  pauseExam: () => void;
  resumeExam: () => void;
  submitExam: () => void;
}

const ExamSessionContext = createContext<ExamSessionContextType | null>(null);

interface ExamSessionProviderProps {
  attemptId: string;
  children: ReactNode;
}

export function ExamSessionProvider({
  attemptId,
  children,
}: ExamSessionProviderProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [examSet, setExamSet] = useState<ExamSet | null>(null);
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);

  const {
    currentAnswers: answers,
    setAnswer,
    currentSectionId,
    setCurrentSection,
    loadAnswers,
    clearExamState,
  } = useExamStore();

  // Hooks
  const { totalTimeRemaining, sectionTimeRemaining, isExpired, syncTime } =
    useExamTimer(attemptId);
  const { addAnswer, forceSave } = useExamAutoSave(attemptId);
  const { sendHeartbeat } = useExamSession(attemptId);

  // Derived state
  const currentSection = examSet?.sections.find((s) => s.id === currentSectionId) || null;
  const allQuestions = currentSection
    ? currentSection.passages.flatMap((p) => p.questions)
    : [];
  const currentQuestion = allQuestions[questionIndex] || null;
  const totalQuestions = allQuestions.length;

  const sectionIndex = examSet?.sections.findIndex((s) => s.id === currentSectionId) ?? 0;

  const canGoNext = questionIndex < totalQuestions - 1;
  const canGoPrevious = questionIndex > 0;

  // Initialize exam session
  useEffect(() => {
    const initSession = async () => {
      try {
        setIsLoading(true);

        // Fetch attempt
        const attemptData = await examService.attempts.getAttempt(attemptId);
        setAttempt(attemptData);
        setCurrentSection(attemptData.currentSectionId);
        setQuestionIndex(attemptData.currentQuestionIndex);

        // Fetch full exam set
        const examSetData = await examService.sets.getWithQuestions(
          attemptData.examSetId
        );
        setExamSet(examSetData);

        // Load existing answers
        const existingAnswers = await examService.attempts.getAnswers(attemptId);
        loadAnswers(existingAnswers);

        setIsPaused(attemptData.status === 'paused');
      } catch (error) {
        console.error('Failed to initialize exam session:', error);
        toast({
          title: 'Error Loading Exam',
          description: 'Could not load exam data. Please try again.',
          variant: 'destructive',
        });
        router.push('/exams');
      } finally {
        setIsLoading(false);
      }
    };

    initSession();
  }, [attemptId]);

  // Handle timeout
  useEffect(() => {
    const handleTimeout = (e: CustomEvent) => {
      if (e.detail.attemptId === attemptId) {
        submitExam();
      }
    };

    window.addEventListener('exam:timeout', handleTimeout as EventListener);
    return () => {
      window.removeEventListener('exam:timeout', handleTimeout as EventListener);
    };
  }, [attemptId]);

  // Navigation functions
  const navigateToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < totalQuestions) {
      setQuestionIndex(index);
    }
  }, [totalQuestions]);

  const navigateToSection = useCallback(
    async (sectionId: string) => {
      try {
        await examService.attempts.navigateToSection(attemptId, sectionId);
        setCurrentSection(sectionId);
        setQuestionIndex(0);
      } catch (error) {
        toast({
          title: 'Navigation Error',
          description: 'Could not switch sections.',
          variant: 'destructive',
        });
      }
    },
    [attemptId, setCurrentSection, toast]
  );

  const goNext = useCallback(() => {
    if (canGoNext) {
      navigateToQuestion(questionIndex + 1);
    } else if (examSet) {
      // Check if there's a next section
      const nextSectionIndex = sectionIndex + 1;
      if (nextSectionIndex < examSet.sections.length) {
        navigateToSection(examSet.sections[nextSectionIndex].id);
      }
    }
  }, [canGoNext, questionIndex, navigateToQuestion, examSet, sectionIndex, navigateToSection]);

  const goPrevious = useCallback(() => {
    if (canGoPrevious) {
      navigateToQuestion(questionIndex - 1);
    }
  }, [canGoPrevious, questionIndex, navigateToQuestion]);

  // Answer functions
  const submitAnswer = useCallback(
    (answerData: Partial<ExamAnswer>) => {
      if (!currentQuestion) return;

      const answer: ExamAnswer = {
        questionId: currentQuestion.id,
        answer: answerData.answer,
        selectedOptionId: answerData.selectedOptionId,
        richContent: answerData.richContent,
        audioUrl: answerData.audioUrl,
        timeSpent: answerData.timeSpent || 0,
        isFlagged: answers.get(currentQuestion.id)?.isFlagged || false,
      };

      setAnswer(currentQuestion.id, answer);
      addAnswer(answer);
    },
    [currentQuestion, setAnswer, addAnswer, answers]
  );

  const getAnswer = useCallback(
    (questionId: string) => answers.get(questionId),
    [answers]
  );

  const toggleFlag = useCallback(
    (questionId: string) => {
      const existing = answers.get(questionId);
      const updated: ExamAnswer = {
        questionId,
        answer: existing?.answer,
        selectedOptionId: existing?.selectedOptionId,
        richContent: existing?.richContent,
        audioUrl: existing?.audioUrl,
        timeSpent: existing?.timeSpent || 0,
        isFlagged: !existing?.isFlagged,
      };
      setAnswer(questionId, updated);
      addAnswer(updated);
    },
    [answers, setAnswer, addAnswer]
  );

  // Pause/Resume
  const pauseExam = useCallback(async () => {
    try {
      await forceSave();
      await examService.attempts.pause(attemptId);
      setIsPaused(true);
      toast({ title: 'Exam Paused', description: 'Your progress has been saved.' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not pause exam.',
        variant: 'destructive',
      });
    }
  }, [attemptId, forceSave, toast]);

  const resumeExam = useCallback(async () => {
    try {
      const updated = await examService.attempts.resume(attemptId);
      setAttempt(updated);
      setIsPaused(false);
      syncTime();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not resume exam.',
        variant: 'destructive',
      });
    }
  }, [attemptId, syncTime, toast]);

  // Submit
  const submitExam = useCallback(async () => {
    try {
      setIsSubmitting(true);
      await forceSave();

      const result = await examService.submission.submit(attemptId, {
        submissionType: isExpired ? 'auto_timeout' : 'manual',
        clientTimestamp: Date.now(),
      });

      clearExamState();
      router.push(`/exams/${attemptId}/result`);
    } catch (error) {
      toast({
        title: 'Submission Error',
        description: 'Failed to submit exam. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [attemptId, forceSave, isExpired, clearExamState, router, toast]);

  const value: ExamSessionContextType = {
    attempt,
    examSet,
    currentSection,
    currentQuestion,
    answers,
    totalTimeRemaining,
    sectionTimeRemaining,
    isExpired,
    questionIndex,
    sectionIndex,
    totalQuestions,
    canGoNext,
    canGoPrevious,
    navigateToQuestion,
    navigateToSection,
    goNext,
    goPrevious,
    submitAnswer,
    getAnswer,
    toggleFlag,
    isLoading,
    isSubmitting,
    isPaused,
    pauseExam,
    resumeExam,
    submitExam,
  };

  return (
    <ExamSessionContext.Provider value={value}>
      {children}
    </ExamSessionContext.Provider>
  );
}

export function useExamContext() {
  const context = useContext(ExamSessionContext);
  if (!context) {
    throw new Error('useExamContext must be used within ExamSessionProvider');
  }
  return context;
}
```

### Step 2: Exam Layout Component

```tsx
// src/features/exam/ExamLayout.tsx
'use client';

import { useExamContext } from './ExamSessionProvider';
import { ExamHeader } from './ExamHeader';
import { ExamSidebar } from './ExamSidebar';
import { ExamContent } from './ExamContent';
import { ExamPausedOverlay } from './ExamPausedOverlay';
import { ExamLoadingState } from './ExamLoadingState';
import { ExamSubmitModal } from './ExamSubmitModal';
import { useState } from 'react';

export function ExamLayout() {
  const { isLoading, isPaused, resumeExam } = useExamContext();
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  if (isLoading) {
    return <ExamLoadingState />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header with Timer */}
      <ExamHeader onSubmit={() => setShowSubmitModal(true)} />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Question Navigator */}
        <ExamSidebar />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <ExamContent />
        </main>
      </div>

      {/* Overlays & Modals */}
      {isPaused && <ExamPausedOverlay onResume={resumeExam} />}
      <ExamSubmitModal
        open={showSubmitModal}
        onOpenChange={setShowSubmitModal}
      />
    </div>
  );
}
```

### Step 3: Exam Header

```tsx
// src/features/exam/ExamHeader.tsx
'use client';

import { useExamContext } from './ExamSessionProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Pause, Send, AlertTriangle } from 'lucide-react';
import { formatDuration } from '@/utils/time';
import { cn } from '@/lib/utils';

interface ExamHeaderProps {
  onSubmit: () => void;
}

export function ExamHeader({ onSubmit }: ExamHeaderProps) {
  const {
    examSet,
    currentSection,
    totalTimeRemaining,
    sectionTimeRemaining,
    isExpired,
    questionIndex,
    totalQuestions,
    answers,
    pauseExam,
    isSubmitting,
  } = useExamContext();

  const answeredCount = Array.from(answers.values()).filter(
    (a) => a.answer || a.selectedOptionId || a.richContent || a.audioUrl
  ).length;

  const progressPercent = (answeredCount / totalQuestions) * 100;

  const isLowTime = totalTimeRemaining < 300; // Less than 5 minutes
  const isCriticalTime = totalTimeRemaining < 60; // Less than 1 minute

  return (
    <header className="bg-white border-b shadow-sm px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left - Exam Info */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="font-semibold text-lg">{examSet?.title}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Badge variant="outline" className="capitalize">
                {currentSection?.skill}
              </Badge>
              <span>•</span>
              <span>
                Question {questionIndex + 1} of {totalQuestions}
              </span>
            </div>
          </div>
        </div>

        {/* Center - Timer */}
        <div className="flex items-center gap-6">
          {/* Total Time */}
          <div
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg',
              isCriticalTime
                ? 'bg-red-100 text-red-700 animate-pulse'
                : isLowTime
                ? 'bg-amber-100 text-amber-700'
                : 'bg-blue-50 text-blue-700'
            )}
          >
            <Clock className="w-5 h-5" />
            <div>
              <p className="text-xs opacity-70">Total Time</p>
              <p className="font-mono font-bold text-lg">
                {formatDuration(totalTimeRemaining)}
              </p>
            </div>
          </div>

          {/* Section Time */}
          {currentSection && sectionTimeRemaining > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100">
              <div>
                <p className="text-xs text-gray-500">Section Time</p>
                <p className="font-mono font-medium">
                  {formatDuration(sectionTimeRemaining)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-3">
          {/* Progress */}
          <div className="w-32">
            <div className="text-xs text-gray-500 mb-1">
              {answeredCount}/{totalQuestions} answered
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          <Button variant="outline" onClick={pauseExam} className="gap-2">
            <Pause className="w-4 h-4" />
            Pause
          </Button>

          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            <Send className="w-4 h-4" />
            Submit
          </Button>
        </div>
      </div>

      {/* Time Warning */}
      {isLowTime && !isExpired && (
        <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 flex items-center gap-2 text-amber-800">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm font-medium">
            {isCriticalTime
              ? 'Less than 1 minute remaining! Your exam will auto-submit.'
              : 'Less than 5 minutes remaining. Please review and submit.'}
          </span>
        </div>
      )}
    </header>
  );
}
```

### Step 4: Question Renderer

```tsx
// src/features/exam/QuestionRenderer.tsx
'use client';

import { Question, ExamAnswer } from '@/types/exam';
import { useExamContext } from './ExamSessionProvider';
import { MultipleChoiceQuestion } from './questions/MultipleChoiceQuestion';
import { TrueFalseQuestion } from './questions/TrueFalseQuestion';
import { FillBlankQuestion } from './questions/FillBlankQuestion';
import { MatchingQuestion } from './questions/MatchingQuestion';
import { EssayQuestion } from './questions/EssayQuestion';
import { SpeakingQuestion } from './questions/SpeakingQuestion';
import { Button } from '@/components/ui/button';
import { Flag, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionRendererProps {
  question: Question;
  questionNumber: number;
}

export function QuestionRenderer({
  question,
  questionNumber,
}: QuestionRendererProps) {
  const {
    submitAnswer,
    getAnswer,
    toggleFlag,
    goNext,
    goPrevious,
    canGoNext,
    canGoPrevious,
  } = useExamContext();

  const currentAnswer = getAnswer(question.id);
  const isFlagged = currentAnswer?.isFlagged || false;

  const handleAnswerChange = (answer: Partial<ExamAnswer>) => {
    submitAnswer({
      ...answer,
      questionId: question.id,
      timeSpent: (currentAnswer?.timeSpent || 0) + 1, // Increment time
    });
  };

  const renderQuestion = () => {
    switch (question.type) {
      case 'multiple_choice':
        return (
          <MultipleChoiceQuestion
            question={question}
            selectedOptionId={currentAnswer?.selectedOptionId}
            onChange={(optionId) =>
              handleAnswerChange({ selectedOptionId: optionId })
            }
          />
        );

      case 'true_false':
        return (
          <TrueFalseQuestion
            question={question}
            selectedValue={currentAnswer?.answer}
            onChange={(value) => handleAnswerChange({ answer: value })}
          />
        );

      case 'fill_blank':
        return (
          <FillBlankQuestion
            question={question}
            value={currentAnswer?.answer || ''}
            onChange={(value) => handleAnswerChange({ answer: value })}
          />
        );

      case 'matching':
        return (
          <MatchingQuestion
            question={question}
            value={currentAnswer?.answer || ''}
            onChange={(value) => handleAnswerChange({ answer: value })}
          />
        );

      case 'essay':
        return (
          <EssayQuestion
            question={question}
            value={currentAnswer?.richContent || ''}
            onChange={(content) =>
              handleAnswerChange({ richContent: content })
            }
          />
        );

      case 'speaking_task':
        return (
          <SpeakingQuestion
            question={question}
            audioUrl={currentAnswer?.audioUrl}
            onRecordingComplete={(url) =>
              handleAnswerChange({ audioUrl: url })
            }
          />
        );

      default:
        return <div>Unknown question type: {question.type}</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Question Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold">
            {questionNumber}
          </span>
          <div className="text-sm text-gray-500">
            {question.points} point{question.points > 1 ? 's' : ''}
          </div>
        </div>

        <Button
          variant={isFlagged ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleFlag(question.id)}
          className={cn(
            'gap-2',
            isFlagged && 'bg-amber-500 hover:bg-amber-600'
          )}
        >
          <Flag className="w-4 h-4" />
          {isFlagged ? 'Flagged' : 'Flag for Review'}
        </Button>
      </div>

      {/* Question Text */}
      <div className="mb-8">
        <p className="text-lg leading-relaxed">{question.text}</p>
      </div>

      {/* Question Content */}
      <div className="mb-8">{renderQuestion()}</div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <Button
          variant="outline"
          onClick={goPrevious}
          disabled={!canGoPrevious}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <Button onClick={goNext} disabled={!canGoNext} className="gap-2">
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
```

### Step 5: Multiple Choice Question Component

```tsx
// src/features/exam/questions/MultipleChoiceQuestion.tsx
'use client';

import { Question } from '@/types/exam';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface MultipleChoiceQuestionProps {
  question: Question;
  selectedOptionId: string | undefined;
  onChange: (optionId: string) => void;
}

export function MultipleChoiceQuestion({
  question,
  selectedOptionId,
  onChange,
}: MultipleChoiceQuestionProps) {
  const options = question.options || [];

  return (
    <RadioGroup value={selectedOptionId} onValueChange={onChange}>
      <div className="space-y-3">
        {options.map((option) => (
          <div
            key={option.id}
            className={cn(
              'flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all',
              selectedOptionId === option.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            )}
            onClick={() => onChange(option.id)}
          >
            <RadioGroupItem value={option.id} id={option.id} />
            <Label
              htmlFor={option.id}
              className="flex-1 cursor-pointer text-base"
            >
              <span className="font-semibold mr-3 text-gray-500">
                {option.label}.
              </span>
              {option.text}
            </Label>
          </div>
        ))}
      </div>
    </RadioGroup>
  );
}
```

### Step 6: Essay Question Component

```tsx
// src/features/exam/questions/EssayQuestion.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Question } from '@/types/exam';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EssayQuestionProps {
  question: Question;
  value: string;
  onChange: (content: string) => void;
}

const MIN_WORDS = 150;
const MAX_WORDS = 350;

export function EssayQuestion({
  question,
  value,
  onChange,
}: EssayQuestionProps) {
  const [wordCount, setWordCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const words = value.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
  }, [value]);

  const getWordCountStatus = () => {
    if (wordCount < MIN_WORDS) return 'insufficient';
    if (wordCount > MAX_WORDS) return 'excessive';
    return 'good';
  };

  const status = getWordCountStatus();

  return (
    <div className="space-y-4">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your essay here..."
          className="min-h-[400px] text-base leading-relaxed resize-y"
        />
      </div>

      {/* Word Count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge
            variant={
              status === 'good'
                ? 'default'
                : status === 'insufficient'
                ? 'secondary'
                : 'destructive'
            }
            className={cn(
              status === 'good' && 'bg-green-500',
              status === 'insufficient' && 'bg-amber-500'
            )}
          >
            {wordCount} words
          </Badge>
          <span className="text-sm text-gray-500">
            Recommended: {MIN_WORDS} - {MAX_WORDS} words
          </span>
        </div>

        {status === 'insufficient' && (
          <span className="text-sm text-amber-600">
            {MIN_WORDS - wordCount} more words needed
          </span>
        )}
        {status === 'excessive' && (
          <span className="text-sm text-red-600">
            {wordCount - MAX_WORDS} words over limit
          </span>
        )}
      </div>

      {/* Writing Tips */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Writing Tips:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Address all parts of the question</li>
          <li>• Organize your ideas clearly with paragraphs</li>
          <li>• Use a variety of vocabulary and sentence structures</li>
          <li>• Check your grammar and spelling before submitting</li>
        </ul>
      </div>
    </div>
  );
}
```

### Step 7: Speaking Question Component

```tsx
// src/features/exam/questions/SpeakingQuestion.tsx
'use client';

import { useState, useRef, useCallback } from 'react';
import { Question } from '@/types/exam';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mic, Square, Play, Pause, RotateCcw, Upload, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';

interface SpeakingQuestionProps {
  question: Question;
  audioUrl: string | undefined;
  onRecordingComplete: (url: string) => void;
}

const MAX_RECORDING_TIME = 120; // 2 minutes

export function SpeakingQuestion({
  question,
  audioUrl,
  onRecordingComplete,
}: SpeakingQuestionProps) {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= MAX_RECORDING_TIME - 1) {
            stopRecording();
            return MAX_RECORDING_TIME;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      toast({
        title: 'Microphone Error',
        description: 'Could not access microphone. Please check permissions.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [isRecording]);

  const playRecording = useCallback(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      audioRef.current = new Audio(url);
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [audioBlob]);

  const pausePlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const resetRecording = useCallback(() => {
    setAudioBlob(null);
    setRecordingTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, []);

  const uploadRecording = useCallback(async () => {
    if (!audioBlob) return;

    try {
      setIsUploading(true);

      // Create form data
      const formData = new FormData();
      formData.append('audio', audioBlob, `speaking_${question.id}.webm`);
      formData.append('questionId', question.id);

      // Upload to server
      const response = await fetch('/api/upload/audio', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const { url } = await response.json();
      onRecordingComplete(url);

      toast({
        title: 'Recording Saved',
        description: 'Your answer has been saved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'Could not save recording. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  }, [audioBlob, question.id, onRecordingComplete, toast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = (recordingTime / MAX_RECORDING_TIME) * 100;

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Alert>
        <AlertDescription>
          Press the microphone button to start recording. You have up to 2
          minutes to answer. You can re-record if needed before saving.
        </AlertDescription>
      </Alert>

      {/* Recording Area */}
      <div className="bg-gray-50 rounded-xl p-8">
        <div className="flex flex-col items-center gap-6">
          {/* Record Button */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isUploading || !!audioUrl}
            className={cn(
              'w-24 h-24 rounded-full flex items-center justify-center transition-all',
              isRecording
                ? 'bg-red-500 animate-pulse'
                : audioUrl
                ? 'bg-green-500 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600',
              'disabled:opacity-50'
            )}
          >
            {audioUrl ? (
              <Check className="w-10 h-10 text-white" />
            ) : isRecording ? (
              <Square className="w-10 h-10 text-white" />
            ) : (
              <Mic className="w-10 h-10 text-white" />
            )}
          </button>

          {/* Status Text */}
          <p className="text-lg font-medium">
            {audioUrl
              ? 'Recording Saved'
              : isRecording
              ? 'Recording...'
              : audioBlob
              ? 'Recording Ready'
              : 'Click to Start Recording'}
          </p>

          {/* Timer & Progress */}
          {(isRecording || audioBlob) && !audioUrl && (
            <div className="w-full max-w-xs">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>{formatTime(recordingTime)}</span>
                <span>{formatTime(MAX_RECORDING_TIME)}</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          )}

          {/* Playback Controls */}
          {audioBlob && !isRecording && !audioUrl && (
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={isPlaying ? pausePlayback : playRecording}
                className="gap-2"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Play
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={resetRecording}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Re-record
              </Button>

              <Button
                onClick={uploadRecording}
                disabled={isUploading}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                {isUploading ? 'Saving...' : 'Save Answer'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## ✅ Acceptance Criteria

- [ ] Exam session context provides all needed state
- [ ] Full-screen layout works on desktop
- [ ] Timer displays prominently with warnings
- [ ] All question types render correctly
- [ ] Auto-save triggers every 10 seconds
- [ ] Flag questions for review works
- [ ] Navigation between questions smooth
- [ ] Pause/Resume functionality works
- [ ] Audio recording works for Speaking

---

## ⏭️ Next Task

→ `FE-023_EXAM_TIMER_COMPONENT.md` - Exam Timer Component

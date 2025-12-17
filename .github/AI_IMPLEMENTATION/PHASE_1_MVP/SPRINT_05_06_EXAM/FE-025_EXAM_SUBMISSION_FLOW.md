# FE-025: Exam Submission Flow

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-025 |
| **Phase** | 1 - MVP |
| **Sprint** | 5-6 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 3h |
| **Dependencies** | FE-022, FE-024 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Existing components:**
> - `components/exam/ExamInterface.tsx` - ✅ Đã có submission logic
> - `components/exam/IncompletePartModal.tsx` - ✅ Đã có
>
> **Đã có trong ExamInterface:**
> - ✅ Pre-submit review modal
> - ✅ Warning for incomplete questions
> - ✅ Confirmation dialog

**Action:**
- 🚫 **KHÔNG TẠO LẠI UI**
- ✅ INTEGRATE với BE-022 Submission API
- ✅ ADD AI scoring progress tracking
- ✅ ADD redirect to results page
- ✅ HANDLE loading/error states

---

## 🎯 Objective

INTEGRATE Exam Submission với API:
- Pre-submit review with warnings
- Confirmation dialog
- Loading state during submission
- AI scoring progress tracking
- Redirect to results page

---

## 💻 Implementation

### Step 1: Exam Submit Modal

```tsx
// src/features/exam/ExamSubmitModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { useExamContext } from './ExamSessionProvider';
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
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import {
  Send,
  AlertTriangle,
  CheckCircle,
  Flag,
  Circle,
  Loader2,
} from 'lucide-react';

interface ExamSubmitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExamSubmitModal({ open, onOpenChange }: ExamSubmitModalProps) {
  const {
    examSet,
    answers,
    totalTimeRemaining,
    submitExam,
    isSubmitting,
  } = useExamContext();

  const [confirmed, setConfirmed] = useState(false);

  // Reset confirmation when modal opens
  useEffect(() => {
    if (open) {
      setConfirmed(false);
    }
  }, [open]);

  if (!examSet) return null;

  // Calculate statistics
  const allQuestions = examSet.sections.flatMap((s) =>
    s.passages.flatMap((p) => p.questions)
  );
  const totalQuestions = allQuestions.length;

  const answeredCount = allQuestions.filter((q) => {
    const answer = answers.get(q.id);
    return answer && (answer.answer || answer.selectedOptionId || answer.richContent || answer.audioUrl);
  }).length;

  const flaggedCount = allQuestions.filter((q) => {
    const answer = answers.get(q.id);
    return answer?.isFlagged;
  }).length;

  const unansweredCount = totalQuestions - answeredCount;
  const progressPercent = (answeredCount / totalQuestions) * 100;

  const hasWarnings = unansweredCount > 0 || flaggedCount > 0;

  const handleSubmit = () => {
    submitExam();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-500" />
            Submit Exam
          </DialogTitle>
          <DialogDescription>
            Review your progress before submitting
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progress Overview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Completion</span>
              <span className="font-medium">{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-3" />
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
              <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold text-green-700">{answeredCount}</p>
              <p className="text-xs text-green-600">Answered</p>
            </div>

            <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-100">
              <Flag className="w-6 h-6 mx-auto mb-2 text-amber-500" />
              <p className="text-2xl font-bold text-amber-700">{flaggedCount}</p>
              <p className="text-xs text-amber-600">Flagged</p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Circle className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <p className="text-2xl font-bold text-gray-700">{unansweredCount}</p>
              <p className="text-xs text-gray-600">Unanswered</p>
            </div>
          </div>

          {/* Warnings */}
          {hasWarnings && (
            <Alert className="bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <ul className="list-disc pl-4 space-y-1 text-sm">
                  {unansweredCount > 0 && (
                    <li>
                      You have {unansweredCount} unanswered question
                      {unansweredCount > 1 ? 's' : ''}
                    </li>
                  )}
                  {flaggedCount > 0 && (
                    <li>
                      You have {flaggedCount} flagged question
                      {flaggedCount > 1 ? 's' : ''} to review
                    </li>
                  )}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Section Breakdown */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Section Breakdown
            </h4>
            <div className="space-y-2">
              {examSet.sections.map((section) => {
                const sectionQuestions = section.passages.flatMap((p) => p.questions);
                const sectionAnswered = sectionQuestions.filter((q) => {
                  const answer = answers.get(q.id);
                  return answer && (answer.answer || answer.selectedOptionId || answer.richContent || answer.audioUrl);
                }).length;
                const sectionTotal = sectionQuestions.length;
                const sectionPercent = (sectionAnswered / sectionTotal) * 100;

                return (
                  <div
                    key={section.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="capitalize text-gray-600">
                      {section.skill}
                    </span>
                    <div className="flex items-center gap-2">
                      <Progress value={sectionPercent} className="w-24 h-2" />
                      <span className="text-gray-500 w-16 text-right">
                        {sectionAnswered}/{sectionTotal}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Confirmation */}
          <div className="flex items-start gap-3 bg-blue-50 rounded-lg p-4 border border-blue-100">
            <Checkbox
              id="confirm-submit"
              checked={confirmed}
              onCheckedChange={(checked) => setConfirmed(!!checked)}
              className="mt-0.5"
            />
            <label
              htmlFor="confirm-submit"
              className="text-sm text-blue-800 cursor-pointer leading-relaxed"
            >
              I understand that after submission, I cannot make any changes to my
              answers. My exam will be graded automatically for Reading and
              Listening, and by AI for Writing and Speaking.
            </label>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Continue Exam
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!confirmed || isSubmitting}
            className="gap-2 min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Exam
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### Step 2: Submission Progress Page

```tsx
// src/app/(main)/exams/[attemptId]/submitting/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { examService } from '@/services/examService';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  Loader2,
  CheckCircle,
  Clock,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
} from 'lucide-react';

type ScoringStatus = 'pending' | 'processing' | 'completed' | 'error';

interface SkillProgress {
  skill: string;
  status: ScoringStatus;
  icon: React.ReactNode;
  label: string;
}

export default function SubmittingPage() {
  const router = useRouter();
  const params = useParams();
  const attemptId = params.attemptId as string;

  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);

  // Poll for scoring progress
  const { data: progress, isError } = useQuery({
    queryKey: ['submission-progress', attemptId],
    queryFn: () => examService.submission.getProgress(attemptId),
    refetchInterval: 2000, // Poll every 2 seconds
    retry: 5,
  });

  // Build skill progress from API response
  const getSkillProgress = (): SkillProgress[] => {
    const defaultSkills: SkillProgress[] = [
      { skill: 'reading', status: 'pending', icon: <BookOpen className="w-5 h-5" />, label: 'Reading' },
      { skill: 'listening', status: 'pending', icon: <Headphones className="w-5 h-5" />, label: 'Listening' },
      { skill: 'writing', status: 'pending', icon: <PenTool className="w-5 h-5" />, label: 'Writing' },
      { skill: 'speaking', status: 'pending', icon: <Mic className="w-5 h-5" />, label: 'Speaking' },
    ];

    if (progress?.scores) {
      return defaultSkills.map((skill) => ({
        ...skill,
        status: (progress.scores[skill.skill]?.status || 'pending') as ScoringStatus,
      }));
    }

    return defaultSkills;
  };

  const skillProgress = getSkillProgress();

  const completedCount = skillProgress.filter((s) => s.status === 'completed').length;
  const overallProgress = (completedCount / skillProgress.length) * 100;
  const isAllCompleted = completedCount === skillProgress.length;

  // Handle redirect when completed
  useEffect(() => {
    if (isAllCompleted && redirectCountdown === null) {
      setRedirectCountdown(3);
    }
  }, [isAllCompleted, redirectCountdown]);

  useEffect(() => {
    if (redirectCountdown !== null && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (redirectCountdown === 0) {
      router.push(`/exams/${attemptId}/result`);
    }
  }, [redirectCountdown, router, attemptId]);

  const getStatusIcon = (status: ScoringStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'error':
        return <span className="w-5 h-5 text-red-500">⚠️</span>;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: ScoringStatus) => {
    switch (status) {
      case 'completed':
        return 'Scored';
      case 'processing':
        return 'Scoring...';
      case 'error':
        return 'Error';
      default:
        return 'Waiting';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        {/* Header */}
        <div className="text-center mb-8">
          {isAllCompleted ? (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Scoring Complete!
              </h1>
              <p className="text-gray-600">
                Redirecting to results in {redirectCountdown}...
              </p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Grading Your Exam
              </h1>
              <p className="text-gray-600">
                Please wait while we score your answers...
              </p>
            </>
          )}
        </div>

        {/* Overall Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Overall Progress</span>
            <span className="font-medium">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </div>

        {/* Skill Progress */}
        <div className="space-y-3">
          {skillProgress.map((skill) => (
            <div
              key={skill.skill}
              className={cn(
                'flex items-center justify-between p-4 rounded-lg border transition-all',
                skill.status === 'completed' && 'bg-green-50 border-green-200',
                skill.status === 'processing' && 'bg-blue-50 border-blue-200',
                skill.status === 'pending' && 'bg-gray-50 border-gray-200',
                skill.status === 'error' && 'bg-red-50 border-red-200'
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'p-2 rounded-lg',
                    skill.status === 'completed' && 'bg-green-100 text-green-600',
                    skill.status === 'processing' && 'bg-blue-100 text-blue-600',
                    skill.status === 'pending' && 'bg-gray-100 text-gray-500',
                    skill.status === 'error' && 'bg-red-100 text-red-600'
                  )}
                >
                  {skill.icon}
                </div>
                <span className="font-medium">{skill.label}</span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'text-sm',
                    skill.status === 'completed' && 'text-green-600',
                    skill.status === 'processing' && 'text-blue-600',
                    skill.status === 'pending' && 'text-gray-500',
                    skill.status === 'error' && 'text-red-600'
                  )}
                >
                  {getStatusText(skill.status)}
                </span>
                {getStatusIcon(skill.status)}
              </div>
            </div>
          ))}
        </div>

        {/* Info Note */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg text-center">
          <p className="text-sm text-blue-700">
            Writing and Speaking sections use AI-powered grading which may take
            a few moments longer.
          </p>
        </div>

        {/* Error State */}
        {isError && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-red-700 text-center">
              There was an error checking the scoring status. Please refresh the
              page or check your results later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

### Step 3: Auto-Submit Handler

```tsx
// src/features/exam/AutoSubmitHandler.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useExamContext } from './ExamSessionProvider';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Clock } from 'lucide-react';

const AUTO_SUBMIT_COUNTDOWN = 10; // seconds

export function AutoSubmitHandler() {
  const { isExpired, submitExam, totalTimeRemaining } = useExamContext();
  const [showDialog, setShowDialog] = useState(false);
  const [countdown, setCountdown] = useState(AUTO_SUBMIT_COUNTDOWN);

  // Trigger when time expires
  useEffect(() => {
    if (isExpired && !showDialog) {
      setShowDialog(true);
      setCountdown(AUTO_SUBMIT_COUNTDOWN);
    }
  }, [isExpired, showDialog]);

  // Countdown logic
  useEffect(() => {
    if (!showDialog) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Auto-submit
      handleForceSubmit();
    }
  }, [showDialog, countdown]);

  const handleForceSubmit = useCallback(() => {
    setShowDialog(false);
    submitExam();
  }, [submitExam]);

  return (
    <AlertDialog open={showDialog}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-6 h-6" />
            Time's Up!
          </AlertDialogTitle>
          <AlertDialogDescription>
            Your exam time has expired. Your exam will be automatically
            submitted.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-6">
          <div className="text-center mb-4">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-red-600">{countdown}</p>
            <p className="text-sm text-gray-500">seconds until auto-submit</p>
          </div>

          <Progress
            value={(countdown / AUTO_SUBMIT_COUNTDOWN) * 100}
            className="h-2"
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
          <p>
            All your answered questions will be saved and submitted for grading.
            Any unanswered questions will be marked as skipped.
          </p>
        </div>

        <AlertDialogFooter>
          <Button onClick={handleForceSubmit} className="w-full">
            Submit Now
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

### Step 4: Submission Service Hook

```typescript
// src/hooks/useExamSubmission.ts
import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { examService } from '@/services/examService';
import { ExamAnswer } from '@/types/exam';
import { useToast } from '@/hooks/useToast';

interface UseExamSubmissionOptions {
  attemptId: string;
  onSubmitStart?: () => void;
  onSubmitSuccess?: (result: any) => void;
  onSubmitError?: (error: Error) => void;
}

export function useExamSubmission({
  attemptId,
  onSubmitStart,
  onSubmitSuccess,
  onSubmitError,
}: UseExamSubmissionOptions) {
  const router = useRouter();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<Error | null>(null);
  const hasSubmittedRef = useRef(false);

  const submit = useCallback(
    async (
      finalAnswers?: Partial<ExamAnswer>[],
      submissionType: 'manual' | 'auto_timeout' | 'force_submit' = 'manual'
    ) => {
      // Prevent double submission
      if (hasSubmittedRef.current || isSubmitting) {
        console.warn('Submission already in progress');
        return;
      }

      hasSubmittedRef.current = true;
      setIsSubmitting(true);
      setSubmissionError(null);
      onSubmitStart?.();

      try {
        const result = await examService.submission.submit(attemptId, {
          submissionType,
          finalAnswers,
          clientTimestamp: Date.now(),
        });

        onSubmitSuccess?.(result);

        toast({
          title: 'Exam Submitted',
          description: 'Your exam is being graded. Please wait...',
        });

        // Navigate to submitting/loading page
        router.push(`/exams/${attemptId}/submitting`);
      } catch (error) {
        const err = error as Error;
        setSubmissionError(err);
        hasSubmittedRef.current = false; // Allow retry on error

        onSubmitError?.(err);

        toast({
          title: 'Submission Failed',
          description:
            err.message || 'Failed to submit exam. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [attemptId, isSubmitting, onSubmitStart, onSubmitSuccess, onSubmitError, router, toast]
  );

  const retrySubmit = useCallback(
    (finalAnswers?: Partial<ExamAnswer>[]) => {
      hasSubmittedRef.current = false;
      submit(finalAnswers, 'force_submit');
    },
    [submit]
  );

  return {
    submit,
    retrySubmit,
    isSubmitting,
    submissionError,
  };
}
```

### Step 5: Submission Error Handler

```tsx
// src/features/exam/SubmissionErrorModal.tsx
'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, HelpCircle } from 'lucide-react';

interface SubmissionErrorModalProps {
  open: boolean;
  error: Error | null;
  onRetry: () => void;
  onClose: () => void;
  retryCount: number;
}

export function SubmissionErrorModal({
  open,
  error,
  onRetry,
  onClose,
  retryCount,
}: SubmissionErrorModalProps) {
  const maxRetries = 3;
  const canRetry = retryCount < maxRetries;

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-6 h-6" />
            Submission Failed
          </AlertDialogTitle>
          <AlertDialogDescription>
            {error?.message ||
              'There was a problem submitting your exam. Please try again.'}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4 space-y-4">
          <div className="bg-amber-50 rounded-lg p-4">
            <h4 className="font-medium text-amber-800 mb-2">Don't worry!</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Your answers have been saved locally</li>
              <li>• You can retry the submission</li>
              <li>• If the problem persists, contact support</li>
            </ul>
          </div>

          {!canRetry && (
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-medium text-red-800 mb-2">
                Maximum retries reached
              </h4>
              <p className="text-sm text-red-700">
                Please contact support with your attempt ID for assistance.
              </p>
            </div>
          )}
        </div>

        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="gap-2 w-full sm:w-auto"
          >
            <HelpCircle className="w-4 h-4" />
            Contact Support
          </Button>
          {canRetry && (
            <Button
              onClick={onRetry}
              className="gap-2 w-full sm:w-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Retry ({maxRetries - retryCount} left)
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

---

## ✅ Acceptance Criteria

- [ ] Submit modal shows completion statistics
- [ ] Warnings for unanswered/flagged questions
- [ ] Confirmation checkbox required
- [ ] Loading state during submission
- [ ] Progress page shows scoring status
- [ ] Auto-redirect to results when done
- [ ] Auto-submit triggers on timeout
- [ ] Error handling with retry option
- [ ] Prevents double submission

---

## ⏭️ Next Task

→ `FE-026_EXAM_RESULT_PAGE.md` - Exam Result Page

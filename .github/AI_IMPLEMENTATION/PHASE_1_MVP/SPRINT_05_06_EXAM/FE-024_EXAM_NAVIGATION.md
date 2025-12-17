# FE-024: Exam Navigation Component

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-024 |
| **Phase** | 1 - MVP |
| **Sprint** | 5-6 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 1h |
| **Dependencies** | FE-022 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Existing components:**
> - `components/exam/ExamInterface.tsx` - ✅ Đã có Navigation logic
> - Đã có: Section tabs, Question grid, Flagged questions, Progress
>
> **Đã có trong ExamInterface:**
> - ✅ Section tabs navigation
> - ✅ Question grid với status indicators
> - ✅ Flagged question highlighting
> - ✅ Progress visualization
> - ✅ Quick jump to any question

**Action:**
- 🚫 **KHÔNG TẠO MỚI**
- ✅ EXTRACT navigation logic to `useExamNavigation` hook nếu cần reuse
- ✅ ENSURE keyboard navigation works

---

## 🎯 Objective

ENHANCE Exam Navigation (không tạo lại):
- Section tabs navigation
- Question grid with status indicators
- Flagged question highlighting
- Progress visualization
- Quick jump to any question

---

## 💻 Implementation

### Step 1: Exam Sidebar Navigation

```tsx
// src/features/exam/ExamSidebar.tsx
'use client';

import { useExamContext } from './ExamSessionProvider';
import { SectionTabs } from './navigation/SectionTabs';
import { QuestionGrid } from './navigation/QuestionGrid';
import { NavigationSummary } from './navigation/NavigationSummary';
import { ScrollArea } from '@/components/ui/scroll-area';

export function ExamSidebar() {
  const {
    examSet,
    currentSection,
    sectionIndex,
    navigateToSection,
    navigateToQuestion,
    questionIndex,
    answers,
  } = useExamContext();

  if (!examSet) return null;

  const sections = examSet.sections.sort((a, b) => a.orderIndex - b.orderIndex);

  // Get questions for current section
  const currentQuestions = currentSection
    ? currentSection.passages.flatMap((p) => p.questions)
    : [];

  return (
    <aside className="w-72 bg-white border-r flex flex-col h-full">
      {/* Section Tabs */}
      <SectionTabs
        sections={sections}
        currentSectionId={currentSection?.id}
        onSectionChange={navigateToSection}
        answers={answers}
      />

      {/* Question Grid */}
      <ScrollArea className="flex-1 p-4">
        <QuestionGrid
          questions={currentQuestions}
          currentIndex={questionIndex}
          answers={answers}
          onQuestionClick={navigateToQuestion}
        />
      </ScrollArea>

      {/* Navigation Summary */}
      <NavigationSummary
        examSet={examSet}
        answers={answers}
      />
    </aside>
  );
}
```

### Step 2: Section Tabs Component

```tsx
// src/features/exam/navigation/SectionTabs.tsx
'use client';

import { ExamSection, ExamAnswer } from '@/types/exam';
import { cn } from '@/lib/utils';
import { BookOpen, Headphones, PenTool, Mic, Check } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SectionTabsProps {
  sections: ExamSection[];
  currentSectionId?: string;
  onSectionChange: (sectionId: string) => void;
  answers: Map<string, ExamAnswer>;
}

const skillIcons: Record<string, React.ReactNode> = {
  reading: <BookOpen className="w-4 h-4" />,
  listening: <Headphones className="w-4 h-4" />,
  writing: <PenTool className="w-4 h-4" />,
  speaking: <Mic className="w-4 h-4" />,
};

export function SectionTabs({
  sections,
  currentSectionId,
  onSectionChange,
  answers,
}: SectionTabsProps) {
  // Calculate completion for each section
  const getSectionProgress = (section: ExamSection) => {
    const questions = section.passages.flatMap((p) => p.questions);
    const answered = questions.filter((q) => {
      const answer = answers.get(q.id);
      return answer && (answer.answer || answer.selectedOptionId || answer.richContent || answer.audioUrl);
    }).length;
    return { answered, total: questions.length };
  };

  return (
    <TooltipProvider>
      <div className="border-b p-2">
        <div className="flex gap-1">
          {sections.map((section, index) => {
            const progress = getSectionProgress(section);
            const isComplete = progress.answered === progress.total;
            const isCurrent = section.id === currentSectionId;

            return (
              <Tooltip key={section.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onSectionChange(section.id)}
                    className={cn(
                      'flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg transition-all flex-1',
                      isCurrent
                        ? 'bg-blue-500 text-white'
                        : isComplete
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    )}
                  >
                    {skillIcons[section.skill]}
                    <span className="hidden lg:inline capitalize text-xs font-medium">
                      {section.skill}
                    </span>
                    {isComplete && !isCurrent && (
                      <Check className="w-3 h-3 text-green-500" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="capitalize font-medium">{section.skill}</p>
                  <p className="text-xs text-gray-400">
                    {progress.answered}/{progress.total} answered
                  </p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
```

### Step 3: Question Grid Component

```tsx
// src/features/exam/navigation/QuestionGrid.tsx
'use client';

import { Question, ExamAnswer } from '@/types/exam';
import { cn } from '@/lib/utils';
import { Flag } from 'lucide-react';

interface QuestionGridProps {
  questions: Question[];
  currentIndex: number;
  answers: Map<string, ExamAnswer>;
  onQuestionClick: (index: number) => void;
}

type QuestionStatus = 'current' | 'answered' | 'flagged' | 'unanswered';

export function QuestionGrid({
  questions,
  currentIndex,
  answers,
  onQuestionClick,
}: QuestionGridProps) {
  const getQuestionStatus = (question: Question, index: number): QuestionStatus => {
    if (index === currentIndex) return 'current';

    const answer = answers.get(question.id);
    if (answer?.isFlagged) return 'flagged';
    if (answer && (answer.answer || answer.selectedOptionId || answer.richContent || answer.audioUrl)) {
      return 'answered';
    }
    return 'unanswered';
  };

  const statusStyles: Record<QuestionStatus, string> = {
    current: 'bg-blue-500 text-white ring-2 ring-blue-300',
    answered: 'bg-green-500 text-white',
    flagged: 'bg-amber-500 text-white',
    unanswered: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500 mb-3">Questions</h3>
      <div className="grid grid-cols-5 gap-2">
        {questions.map((question, index) => {
          const status = getQuestionStatus(question, index);
          const answer = answers.get(question.id);

          return (
            <button
              key={question.id}
              onClick={() => onQuestionClick(index)}
              className={cn(
                'relative w-10 h-10 rounded-lg font-medium text-sm transition-all',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                statusStyles[status]
              )}
            >
              {index + 1}
              {answer?.isFlagged && (
                <Flag className="absolute -top-1 -right-1 w-3 h-3 text-amber-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 space-y-2">
        <h4 className="text-xs font-medium text-gray-400 uppercase">Legend</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500" />
            <span className="text-gray-600">Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500" />
            <span className="text-gray-600">Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-500" />
            <span className="text-gray-600">Flagged</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-100 border" />
            <span className="text-gray-600">Not answered</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Step 4: Navigation Summary Component

```tsx
// src/features/exam/navigation/NavigationSummary.tsx
'use client';

import { ExamSet, ExamAnswer } from '@/types/exam';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { CheckCircle, Flag, Circle } from 'lucide-react';

interface NavigationSummaryProps {
  examSet: ExamSet;
  answers: Map<string, ExamAnswer>;
}

export function NavigationSummary({
  examSet,
  answers,
}: NavigationSummaryProps) {
  // Calculate totals
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

  return (
    <div className="border-t p-4 bg-gray-50">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Progress</h3>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{answeredCount} of {totalQuestions}</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white rounded-lg p-2 border">
          <div className="flex items-center justify-center gap-1 mb-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
          </div>
          <p className="text-lg font-bold text-green-600">{answeredCount}</p>
          <p className="text-[10px] text-gray-500">Answered</p>
        </div>

        <div className="bg-white rounded-lg p-2 border">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Flag className="w-3 h-3 text-amber-500" />
          </div>
          <p className="text-lg font-bold text-amber-600">{flaggedCount}</p>
          <p className="text-[10px] text-gray-500">Flagged</p>
        </div>

        <div className="bg-white rounded-lg p-2 border">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Circle className="w-3 h-3 text-gray-400" />
          </div>
          <p className="text-lg font-bold text-gray-600">{unansweredCount}</p>
          <p className="text-[10px] text-gray-500">Skipped</p>
        </div>
      </div>

      {/* Warnings */}
      {flaggedCount > 0 && (
        <p className="text-xs text-amber-600 mt-3 bg-amber-50 p-2 rounded">
          ⚠️ You have {flaggedCount} flagged question{flaggedCount > 1 ? 's' : ''} to review
        </p>
      )}

      {unansweredCount > 0 && (
        <p className="text-xs text-gray-500 mt-2">
          Don't forget to answer all questions before submitting!
        </p>
      )}
    </div>
  );
}
```

### Step 5: Passage Navigator (for Reading/Listening)

```tsx
// src/features/exam/navigation/PassageNavigator.tsx
'use client';

import { Passage, ExamAnswer } from '@/types/exam';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronDown, Check } from 'lucide-react';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface PassageNavigatorProps {
  passages: Passage[];
  answers: Map<string, ExamAnswer>;
  currentQuestionId?: string;
  onQuestionSelect: (passageIndex: number, questionIndex: number) => void;
}

export function PassageNavigator({
  passages,
  answers,
  currentQuestionId,
  onQuestionSelect,
}: PassageNavigatorProps) {
  const [openPassages, setOpenPassages] = useState<Set<number>>(new Set([0]));

  const togglePassage = (index: number) => {
    setOpenPassages((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const isQuestionAnswered = (questionId: string) => {
    const answer = answers.get(questionId);
    return answer && (answer.answer || answer.selectedOptionId);
  };

  const getPassageProgress = (passage: Passage) => {
    const answered = passage.questions.filter((q) => isQuestionAnswered(q.id)).length;
    return { answered, total: passage.questions.length };
  };

  let globalQuestionIndex = 0;

  return (
    <div className="space-y-2">
      {passages.map((passage, passageIndex) => {
        const progress = getPassageProgress(passage);
        const isComplete = progress.answered === progress.total;
        const isOpen = openPassages.has(passageIndex);

        return (
          <Collapsible
            key={passage.id}
            open={isOpen}
            onOpenChange={() => togglePassage(passageIndex)}
          >
            <CollapsibleTrigger className="w-full">
              <div
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg transition-colors',
                  'hover:bg-gray-100',
                  isComplete && 'bg-green-50'
                )}
              >
                <div className="flex items-center gap-2">
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="font-medium text-sm">
                    Passage {passageIndex + 1}
                  </span>
                  {isComplete && <Check className="w-4 h-4 text-green-500" />}
                </div>
                <span className="text-xs text-gray-500">
                  {progress.answered}/{progress.total}
                </span>
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="pl-8 pr-3 pb-2 space-y-1">
                {passage.questions.map((question, questionIndex) => {
                  const overallIndex = globalQuestionIndex;
                  globalQuestionIndex++;

                  const isAnswered = isQuestionAnswered(question.id);
                  const isCurrent = question.id === currentQuestionId;
                  const answer = answers.get(question.id);

                  return (
                    <button
                      key={question.id}
                      onClick={() => onQuestionSelect(passageIndex, questionIndex)}
                      className={cn(
                        'w-full flex items-center justify-between p-2 rounded text-sm transition-colors',
                        isCurrent
                          ? 'bg-blue-100 text-blue-700'
                          : isAnswered
                          ? 'text-green-700 hover:bg-green-50'
                          : 'text-gray-600 hover:bg-gray-50'
                      )}
                    >
                      <span>Q{overallIndex + 1}</span>
                      <div className="flex items-center gap-2">
                        {answer?.isFlagged && (
                          <span className="text-amber-500">🚩</span>
                        )}
                        {isAnswered && (
                          <Check className="w-3 h-3 text-green-500" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
}
```

### Step 6: Quick Navigation Modal

```tsx
// src/features/exam/navigation/QuickNavigationModal.tsx
'use client';

import { ExamSet, ExamAnswer } from '@/types/exam';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Flag, Check, AlertCircle } from 'lucide-react';

interface QuickNavigationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  examSet: ExamSet;
  answers: Map<string, ExamAnswer>;
  onNavigate: (sectionId: string, questionIndex: number) => void;
}

export function QuickNavigationModal({
  open,
  onOpenChange,
  examSet,
  answers,
  onNavigate,
}: QuickNavigationModalProps) {
  const handleNavigate = (sectionId: string, questionIndex: number) => {
    onNavigate(sectionId, questionIndex);
    onOpenChange(false);
  };

  // Get all flagged questions
  const flaggedQuestions: Array<{ sectionId: string; index: number; question: any }> = [];
  const unansweredQuestions: Array<{ sectionId: string; index: number; question: any }> = [];

  examSet.sections.forEach((section) => {
    let localIndex = 0;
    section.passages.forEach((passage) => {
      passage.questions.forEach((question) => {
        const answer = answers.get(question.id);
        const isAnswered = answer && (answer.answer || answer.selectedOptionId || answer.richContent || answer.audioUrl);

        if (answer?.isFlagged) {
          flaggedQuestions.push({ sectionId: section.id, index: localIndex, question });
        }

        if (!isAnswered) {
          unansweredQuestions.push({ sectionId: section.id, index: localIndex, question });
        }

        localIndex++;
      });
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quick Navigation</DialogTitle>
          <DialogDescription>
            Jump to flagged or unanswered questions
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="flagged" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="flagged" className="gap-2">
              <Flag className="w-4 h-4" />
              Flagged ({flaggedQuestions.length})
            </TabsTrigger>
            <TabsTrigger value="unanswered" className="gap-2">
              <AlertCircle className="w-4 h-4" />
              Unanswered ({unansweredQuestions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="flagged" className="mt-4">
            {flaggedQuestions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Flag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No flagged questions</p>
              </div>
            ) : (
              <div className="space-y-2">
                {flaggedQuestions.map(({ sectionId, index, question }) => (
                  <button
                    key={question.id}
                    onClick={() => handleNavigate(sectionId, index)}
                    className="w-full p-4 text-left rounded-lg border hover:bg-amber-50 hover:border-amber-200 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Question {index + 1}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {question.text}
                        </p>
                      </div>
                      <Flag className="w-4 h-4 text-amber-500" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="unanswered" className="mt-4">
            {unansweredQuestions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Check className="w-12 h-12 mx-auto mb-3 opacity-30 text-green-500" />
                <p>All questions answered!</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {unansweredQuestions.map(({ sectionId, index, question }) => (
                  <button
                    key={question.id}
                    onClick={() => handleNavigate(sectionId, index)}
                    className="w-full p-4 text-left rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Question {index + 1}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {question.text}
                        </p>
                      </div>
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
```

---

## ✅ Acceptance Criteria

- [ ] Section tabs show all 4 skills
- [ ] Section completion status visible
- [ ] Question grid displays all questions
- [ ] Status colors correct (current/answered/flagged/unanswered)
- [ ] Click on question navigates correctly
- [ ] Progress summary updates in real-time
- [ ] Quick navigation modal works
- [ ] Passage navigator collapses/expands

---

## ⏭️ Next Task

→ `FE-025_EXAM_SUBMISSION_FLOW.md` - Exam Submission Flow

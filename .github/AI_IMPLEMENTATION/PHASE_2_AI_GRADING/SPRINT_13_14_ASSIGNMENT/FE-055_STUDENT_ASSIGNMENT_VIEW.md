# FE-055: Student Assignment View

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-055 |
| **Phase** | 2 - AI Grading |
| **Sprint** | 13-14 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 6h |
| **Dependencies** | BE-052, Phase 1 Exam UI |

---

## 🎯 Objective

Implement student-facing assignment features:
- My assignments list (across all classes)
- Assignment detail & start
- Test-taking interface
- Auto-save functionality
- Submit & view results

---

## ⚠️ QUAN TRỌNG: Existing Files Warning

### Các file UI Template đã tồn tại (CHỈ THAM KHẢO):
```
UI-Template/
├── components/
│   ├── AssignmentsPage.tsx        # Student assignments list
│   ├── ExamRoom.tsx               # Test-taking interface
│   └── ReadingPractice.tsx        # Question rendering
```

### Các file FE đã tồn tại (EXTEND):
```
FE/src/
├── features/exam/
│   └── components/
│       ├── ExamContainer.tsx      # Exam-taking UI
│       └── QuestionRenderer.tsx   # Question display
```

### Hướng dẫn:
- **THAM KHẢO** `ExamRoom.tsx` cho test-taking UX
- **EXTEND** existing exam components nếu phù hợp
- **TẠO MỚI** trong `FE/src/features/student/assignments/`

---

## 📝 Implementation

### 1. types.ts

```typescript
export interface StudentAssignment {
  id: string;
  title: string;
  description?: string;
  skill: string;
  level: string;
  dueDate: string;
  timeLimit?: number;
  maxAttempts: number;
  status: 'draft' | 'published' | 'closed';
  class: {
    id: string;
    name: string;
  };
  mySubmission?: {
    id: string;
    status: 'in_progress' | 'submitted' | 'graded';
    attemptNumber: number;
    score?: number;
    percentage?: number;
    submittedAt?: string;
  };
  attemptsUsed: number;
  canStart: boolean;
  isOverdue: boolean;
}
```

### 2. hooks/useStudentAssignments.ts

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentAssignmentService } from '@/services/studentAssignmentService';

export const useMyAssignments = (classId?: string) => {
  return useQuery({
    queryKey: ['my-assignments', classId],
    queryFn: () => studentAssignmentService.getMyAssignments(classId),
  });
};

export const useAssignmentDetail = (id: string) => {
  return useQuery({
    queryKey: ['assignment-detail', id],
    queryFn: () => studentAssignmentService.getAssignment(id),
    enabled: !!id,
  });
};

export const useStartAssignment = () => {
  return useMutation({
    mutationFn: (assignmentId: string) =>
      studentAssignmentService.startAttempt(assignmentId),
  });
};

export const useSubmission = (submissionId: string) => {
  return useQuery({
    queryKey: ['submission', submissionId],
    queryFn: () => studentAssignmentService.getSubmission(submissionId),
    enabled: !!submissionId,
  });
};

export const useSaveAnswers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      submissionId,
      answers,
    }: {
      submissionId: string;
      answers: any[];
    }) => studentAssignmentService.saveAnswers(submissionId, answers),
    onSuccess: (_, { submissionId }) => {
      queryClient.invalidateQueries({ queryKey: ['submission', submissionId] });
    },
  });
};

export const useSubmitAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (submissionId: string) =>
      studentAssignmentService.submit(submissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-assignments'] });
    },
  });
};
```

### 3. components/StudentAssignmentList.tsx

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  Eye,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { useMyAssignments } from '../hooks/useStudentAssignments';
import type { StudentAssignment } from '../types';

const skillIcons: Record<string, React.ElementType> = {
  reading: BookOpen,
  listening: FileText,
  writing: FileText,
  speaking: FileText,
  mixed: FileText,
};

export function StudentAssignmentList() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const { data: assignments, isLoading } = useMyAssignments();

  const filteredAssignments = assignments?.filter((a: StudentAssignment) => {
    if (filter === 'pending') {
      return !a.mySubmission || a.mySubmission.status !== 'graded';
    }
    if (filter === 'completed') {
      return a.mySubmission?.status === 'graded';
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bài tập của tôi</h1>
          <p className="text-gray-500 mt-1">
            {assignments?.length || 0} bài tập từ tất cả các lớp
          </p>
        </div>

        <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="pending">Chưa hoàn thành</SelectItem>
            <SelectItem value="completed">Đã hoàn thành</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredAssignments?.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Không có bài tập</h3>
          <p className="text-gray-500">
            {filter === 'pending'
              ? 'Bạn đã hoàn thành tất cả bài tập!'
              : 'Chưa có bài tập nào được giao'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAssignments?.map((assignment: StudentAssignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onClick={() => router.push(`/student/assignments/${assignment.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CardProps {
  assignment: StudentAssignment;
  onClick: () => void;
}

function AssignmentCard({ assignment, onClick }: CardProps) {
  const isOverdue = isPast(new Date(assignment.dueDate));
  const hasSubmission = !!assignment.mySubmission;
  const isGraded = assignment.mySubmission?.status === 'graded';
  const isInProgress = assignment.mySubmission?.status === 'in_progress';

  const SkillIcon = skillIcons[assignment.skill] || FileText;

  return (
    <Card
      className={`cursor-pointer hover:shadow-md transition ${
        isOverdue && !hasSubmission ? 'border-red-200 bg-red-50/30' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-lg ${
              isGraded
                ? 'bg-green-100'
                : isOverdue
                ? 'bg-red-100'
                : 'bg-blue-100'
            }`}
          >
            <SkillIcon
              className={`w-6 h-6 ${
                isGraded
                  ? 'text-green-600'
                  : isOverdue
                  ? 'text-red-600'
                  : 'text-blue-600'
              }`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {assignment.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {assignment.class.name}
                </p>
              </div>

              <div className="text-right">
                {isGraded ? (
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {assignment.mySubmission?.score?.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-500">điểm</p>
                  </div>
                ) : (
                  <Badge
                    variant={isOverdue ? 'destructive' : 'secondary'}
                    className="whitespace-nowrap"
                  >
                    {isOverdue ? 'Quá hạn' : 'Đang mở'}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {format(new Date(assignment.dueDate), 'dd/MM/yyyy HH:mm', { locale: vi })}
              </span>
              <span>•</span>
              <span>{assignment.skill.toUpperCase()}</span>
              <span>•</span>
              <span>{assignment.level}</span>
              {assignment.timeLimit && (
                <>
                  <span>•</span>
                  <span>{assignment.timeLimit} phút</span>
                </>
              )}
            </div>

            {/* Progress indicator */}
            {hasSubmission && !isGraded && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-500">
                    {isInProgress ? 'Đang làm...' : 'Đã nộp - chờ chấm'}
                  </span>
                  <span className="font-medium">
                    Lần {assignment.mySubmission?.attemptNumber}/{assignment.maxAttempts}
                  </span>
                </div>
                <Progress value={isInProgress ? 50 : 100} className="h-2" />
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-6 py-3 bg-gray-50 border-t">
        <div className="flex items-center justify-between w-full">
          <span className="text-sm text-gray-500">
            {assignment.attemptsUsed}/{assignment.maxAttempts} lượt đã dùng
          </span>

          {isGraded ? (
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Xem kết quả
            </Button>
          ) : isInProgress ? (
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <PlayCircle className="w-4 h-4 mr-2" />
              Tiếp tục làm
            </Button>
          ) : assignment.canStart ? (
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <PlayCircle className="w-4 h-4 mr-2" />
              Bắt đầu
            </Button>
          ) : (
            <span className="text-sm text-gray-400">Không thể làm</span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
```

### 4. components/DoAssignmentContainer.tsx

```tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Clock, Save, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  useSubmission,
  useSaveAnswers,
  useSubmitAssignment,
} from '../hooks/useStudentAssignments';
import { QuestionRenderer } from './QuestionRenderer';
import { toast } from 'sonner';

interface Props {
  submissionId: string;
}

const AUTO_SAVE_INTERVAL = 10000; // 10 seconds

export function DoAssignmentContainer({ submissionId }: Props) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const lastSaveRef = useRef<number>(Date.now());

  const { data: submission, isLoading } = useSubmission(submissionId);
  const saveMutation = useSaveAnswers();
  const submitMutation = useSubmitAssignment();

  const questions = submission?.assignment?.questions || [];
  const currentQuestion = questions[currentIndex];

  // Initialize answers from existing submission
  useEffect(() => {
    if (submission?.answers) {
      const existingAnswers: Record<string, any> = {};
      submission.answers.forEach((a: any) => {
        existingAnswers[a.questionId] = {
          answer: a.answer,
          selectedOptionId: a.selectedOptionId,
          audioUrl: a.audioUrl,
        };
      });
      setAnswers(existingAnswers);
    }
  }, [submission?.answers]);

  // Timer
  useEffect(() => {
    if (!submission || !submission.assignment.timeLimit) return;

    const startTime = new Date(submission.startedAt).getTime();
    const endTime = startTime + submission.assignment.timeLimit * 60 * 1000;

    const updateTimer = () => {
      const remaining = Math.max(0, endTime - Date.now());
      setTimeRemaining(remaining);

      if (remaining === 0) {
        handleSubmit();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [submission]);

  // Auto-save
  useEffect(() => {
    const interval = setInterval(() => {
      if (Object.keys(answers).length > 0) {
        handleAutoSave();
      }
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [answers]);

  const handleAutoSave = useCallback(async () => {
    if (Date.now() - lastSaveRef.current < 5000) return;

    setIsSaving(true);
    try {
      const answerPayload = Object.entries(answers).map(([questionId, data]) => ({
        questionId,
        ...data,
      }));

      await saveMutation.mutateAsync({
        submissionId,
        answers: answerPayload,
      });

      lastSaveRef.current = Date.now();
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, [answers, submissionId, saveMutation]);

  const handleAnswerChange = (questionId: string, data: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: data,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Save first
      await handleAutoSave();

      // Then submit
      await submitMutation.mutateAsync(submissionId);
      toast.success('Đã nộp bài thành công!');
      router.push(`/student/assignments/${submission.assignment.id}/result`);
    } catch (error: any) {
      toast.error(error.message || 'Không thể nộp bài');
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  if (isLoading) {
    return <div className="p-6">Đang tải...</div>;
  }

  if (!submission) {
    return <div className="p-6">Không tìm thấy bài làm</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {submission.assignment.title}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <Badge variant="outline">
                Câu {currentIndex + 1}/{questions.length}
              </Badge>
              <span className="text-sm text-gray-500">
                Đã làm: {answeredCount}/{questions.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Timer */}
            {timeRemaining !== null && (
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  timeRemaining < 60000
                    ? 'bg-red-100 text-red-700'
                    : timeRemaining < 300000
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <Clock className="w-5 h-5" />
                <span className="font-mono text-lg font-bold">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}

            {/* Save indicator */}
            {isSaving && (
              <span className="text-sm text-gray-400 flex items-center gap-1">
                <Save className="w-4 h-4 animate-pulse" />
                Đang lưu...
              </span>
            )}

            {/* Submit button */}
            <Button
              onClick={() => setShowSubmitDialog(true)}
              disabled={submitMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Nộp bài
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <Progress value={progress} className="mt-4 h-2" />
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden flex">
        {/* Question panel */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentQuestion && (
            <QuestionRenderer
              question={currentQuestion.question}
              answer={answers[currentQuestion.questionId]}
              onChange={(data) =>
                handleAnswerChange(currentQuestion.questionId, data)
              }
            />
          )}
        </div>

        {/* Question navigator */}
        <aside className="w-64 bg-white border-l p-4 overflow-y-auto">
          <h3 className="font-medium text-gray-900 mb-4">Danh sách câu hỏi</h3>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q: any, idx: number) => {
              const isAnswered = !!answers[q.questionId];
              const isCurrent = idx === currentIndex;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`
                    w-10 h-10 rounded-lg text-sm font-medium transition
                    ${
                      isCurrent
                        ? 'bg-blue-600 text-white'
                        : isAnswered
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </aside>
      </main>

      {/* Navigation footer */}
      <footer className="bg-white border-t px-6 py-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
          >
            Câu trước
          </Button>

          <Button
            onClick={() =>
              setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))
            }
            disabled={currentIndex === questions.length - 1}
          >
            Câu tiếp
          </Button>
        </div>
      </footer>

      {/* Submit confirmation dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Xác nhận nộp bài?
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-2">
                <p>Bạn đã hoàn thành {answeredCount}/{questions.length} câu hỏi.</p>
                {answeredCount < questions.length && (
                  <p className="text-orange-600">
                    ⚠️ Còn {questions.length - answeredCount} câu chưa trả lời!
                  </p>
                )}
                <p>Sau khi nộp, bạn không thể chỉnh sửa câu trả lời.</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Tiếp tục làm</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700"
            >
              Nộp bài
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
```

### 5. components/QuestionRenderer.tsx

```tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Props {
  question: any;
  answer: any;
  onChange: (data: any) => void;
}

export function QuestionRenderer({ question, answer, onChange }: Props) {
  const renderContent = () => {
    switch (question.type) {
      case 'multiple_choice':
      case 'true_false':
        return (
          <RadioGroup
            value={answer?.selectedOptionId || ''}
            onValueChange={(value) => onChange({ selectedOptionId: value })}
            className="space-y-3"
          >
            {question.options?.map((option: any) => (
              <div
                key={option.id}
                className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                  <span className="font-medium mr-2">{option.label}.</span>
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'fill_blank':
      case 'essay':
        return (
          <Textarea
            value={answer?.answer || ''}
            onChange={(e) => onChange({ answer: e.target.value })}
            placeholder={
              question.type === 'essay'
                ? 'Viết câu trả lời của bạn...'
                : 'Nhập câu trả lời...'
            }
            rows={question.type === 'essay' ? 10 : 3}
            className="resize-none"
          />
        );

      case 'speaking_task':
        return (
          <div className="text-center py-8">
            {/* TODO: Audio recorder component */}
            <p className="text-gray-500">
              Chức năng ghi âm sẽ được cập nhật sau
            </p>
          </div>
        );

      default:
        return (
          <p className="text-gray-500">
            Loại câu hỏi không được hỗ trợ: {question.type}
          </p>
        );
    }
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        {/* Passage if exists */}
        {question.passage && (
          <div className="p-4 bg-gray-50 rounded-lg max-h-60 overflow-y-auto">
            <p className="text-gray-700 whitespace-pre-wrap">{question.passage}</p>
          </div>
        )}

        {/* Question text */}
        <div>
          <h2 className="text-lg font-medium text-gray-900">{question.text}</h2>
        </div>

        {/* Answer area */}
        <div>{renderContent()}</div>
      </CardContent>
    </Card>
  );
}
```

---

## ✅ Acceptance Criteria

- [ ] My assignments list displays all classes
- [ ] Filter by status (pending/completed)
- [ ] Start new attempt works
- [ ] Continue in-progress works
- [ ] Timer counts down correctly
- [ ] Auto-submit when time expires
- [ ] Auto-save every 10 seconds
- [ ] Question navigation works
- [ ] Answer changes saved
- [ ] Submit confirmation shows stats
- [ ] View result after graded

---

## 🧪 Test Cases

```typescript
describe('DoAssignmentContainer', () => {
  it('auto-saves every 10 seconds', async () => {
    // Wait 10 seconds
    // Verify API called
  });

  it('counts down timer correctly', () => {
    // Verify timer decrements
  });

  it('auto-submits when time expires', async () => {
    // Set timer to 0
    // Verify submit called
  });

  it('navigates between questions', async () => {
    // Click next
    // Verify question changes
  });

  it('shows unanswered warning on submit', async () => {
    // Don't answer some questions
    // Click submit
    // Verify warning shown
  });
});
```

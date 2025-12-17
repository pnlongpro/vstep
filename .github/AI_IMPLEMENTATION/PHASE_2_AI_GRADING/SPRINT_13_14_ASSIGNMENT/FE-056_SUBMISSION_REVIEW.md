# FE-056: Submission Review (Teacher Grading Interface)

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-056 |
| **Phase** | 2 - AI Grading |
| **Sprint** | 13-14 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 8h |
| **Dependencies** | BE-052, BE-053, FE-054 |

---

## 🎯 Objective

Implement teacher grading interface for assignment submissions:
- View student's submission with all answers
- Compare with correct answers
- Override AI scores for subjective questions
- Provide text feedback per question
- Mark as graded and notify student

---

## ⚠️ QUAN TRỌNG: Existing Files Warning

### Các file UI Template đã tồn tại (CHỈ THAM KHẢO):
```
UI-Template/
├── components/
│   ├── AIGrading.tsx              # AI scoring results display
│   └── TeacherReviewPanel.tsx     # Teacher feedback UI
```

### Các file FE đã tồn tại (EXTEND):
```
FE/src/
├── features/exam/
│   └── components/
│       └── ResultReview.tsx       # Exam result display
├── features/teacher/
│   └── components/
│       └── ...
```

### Hướng dẫn:
- **THAM KHẢO** `AIGrading.tsx` cho hiển thị AI feedback
- **TẠO MỚI** trong `FE/src/features/teacher/assignments/`

---

## 📝 Implementation

### 1. types.ts (extend)

```typescript
export interface SubmissionDetail {
  id: string;
  attemptNumber: number;
  status: 'in_progress' | 'submitted' | 'graded';
  startedAt: string;
  submittedAt?: string;
  gradedAt?: string;
  gradedBy?: { id: string; name: string };
  score?: number;
  maxScore: number;
  percentage?: number;
  isLate: boolean;
  latePenaltyApplied?: number;
  student: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  assignment: {
    id: string;
    title: string;
    skill: string;
    level: string;
    timeLimit?: number;
  };
  answers: SubmissionAnswer[];
}

export interface SubmissionAnswer {
  id: string;
  questionId: string;
  question: {
    id: string;
    type: string;
    text: string;
    passage?: string;
    options?: {
      id: string;
      label: string;
      text: string;
      isCorrect: boolean;
    }[];
    correctAnswer?: string;
    sampleAnswer?: string;
    points: number;
  };
  answer?: string;
  selectedOptionId?: string;
  selectedOption?: {
    id: string;
    label: string;
    text: string;
    isCorrect: boolean;
  };
  audioUrl?: string;
  isCorrect?: boolean;
  aiScore?: number;
  aiFeedback?: {
    scores: Record<string, number>;
    feedback: string;
    suggestions: string[];
    grammarErrors?: any[];
  };
  teacherScore?: number;
  teacherFeedback?: string;
  finalScore: number;
}

export interface GradeSubmissionPayload {
  submissionId: string;
  answers: {
    answerId: string;
    teacherScore?: number;
    teacherFeedback?: string;
  }[];
  overallFeedback?: string;
}
```

### 2. hooks/useGrading.ts

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teacherAssignmentService } from '@/services/teacherAssignmentService';
import { GradeSubmissionPayload } from '../types';

export const useSubmissionDetail = (submissionId: string) => {
  return useQuery({
    queryKey: ['submission-detail', submissionId],
    queryFn: () => teacherAssignmentService.getSubmission(submissionId),
    enabled: !!submissionId,
  });
};

export const useGradeSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: GradeSubmissionPayload) =>
      teacherAssignmentService.gradeSubmission(payload),
    onSuccess: (_, { submissionId }) => {
      queryClient.invalidateQueries({
        queryKey: ['submission-detail', submissionId],
      });
      queryClient.invalidateQueries({ queryKey: ['assignment-submissions'] });
    },
  });
};

export const useNavSubmissions = (assignmentId: string, currentSubmissionId: string) => {
  return useQuery({
    queryKey: ['nav-submissions', assignmentId, currentSubmissionId],
    queryFn: () =>
      teacherAssignmentService.getNavigationInfo(assignmentId, currentSubmissionId),
    enabled: !!assignmentId && !!currentSubmissionId,
  });
};
```

### 3. components/SubmissionReviewContainer.tsx

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  User,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Save,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useSubmissionDetail, useGradeSubmission, useNavSubmissions } from '../hooks/useGrading';
import { AnswerReviewCard } from './AnswerReviewCard';
import { GradingSummary } from './GradingSummary';
import type { SubmissionAnswer } from '../types';

interface Props {
  submissionId: string;
}

export function SubmissionReviewContainer({ submissionId }: Props) {
  const router = useRouter();
  const [pendingGrades, setPendingGrades] = useState<
    Record<string, { teacherScore?: number; teacherFeedback?: string }>
  >({});
  const [overallFeedback, setOverallFeedback] = useState('');

  const { data: submission, isLoading } = useSubmissionDetail(submissionId);
  const gradeMutation = useGradeSubmission();
  const { data: navInfo } = useNavSubmissions(
    submission?.assignment.id || '',
    submissionId
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Không tìm thấy bài làm</p>
      </div>
    );
  }

  const handleGradeChange = (
    answerId: string,
    data: { teacherScore?: number; teacherFeedback?: string }
  ) => {
    setPendingGrades((prev) => ({
      ...prev,
      [answerId]: { ...prev[answerId], ...data },
    }));
  };

  const handleSave = async (markAsGraded = false) => {
    try {
      const answers = Object.entries(pendingGrades).map(([answerId, data]) => ({
        answerId,
        ...data,
      }));

      await gradeMutation.mutateAsync({
        submissionId,
        answers,
        overallFeedback: markAsGraded ? overallFeedback : undefined,
      });

      toast.success(markAsGraded ? 'Đã chấm điểm xong!' : 'Đã lưu điểm');

      if (markAsGraded && navInfo?.next) {
        router.push(`/teacher/assignments/submissions/${navInfo.next.id}`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Không thể lưu điểm');
    }
  };

  const isGraded = submission.status === 'graded';
  const hasSubjectiveQuestions = submission.answers.some(
    (a) => ['essay', 'speaking_task'].includes(a.question.type)
  );

  // Calculate current total
  const currentTotal = submission.answers.reduce((sum, a) => {
    const grade = pendingGrades[a.id];
    if (grade?.teacherScore !== undefined) return sum + grade.teacherScore;
    if (a.teacherScore !== undefined) return sum + a.teacherScore;
    if (a.aiScore !== undefined) return sum + a.aiScore;
    if (a.isCorrect) return sum + a.question.points;
    return sum;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  router.push(
                    `/teacher/assignments/${submission.assignment.id}?tab=submissions`
                  )
                }
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại
              </Button>

              <Separator orientation="vertical" className="h-6" />

              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Chấm bài: {submission.assignment.title}
                </h1>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {submission.student.name}
                  </span>
                  <span>•</span>
                  <span>Lần {submission.attemptNumber}</span>
                  {submission.isLate && (
                    <>
                      <span>•</span>
                      <Badge variant="destructive">
                        Nộp muộn (-{submission.latePenaltyApplied}%)
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Navigation */}
              {navInfo && (
                <div className="flex items-center gap-1 mr-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!navInfo.prev}
                    onClick={() =>
                      navInfo.prev &&
                      router.push(
                        `/teacher/assignments/submissions/${navInfo.prev.id}`
                      )
                    }
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-gray-500 min-w-[60px] text-center">
                    {navInfo.currentIndex + 1} / {navInfo.total}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!navInfo.next}
                    onClick={() =>
                      navInfo.next &&
                      router.push(
                        `/teacher/assignments/submissions/${navInfo.next.id}`
                      )
                    }
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Score display */}
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-600">
                  {currentTotal.toFixed(1)} / {submission.maxScore}
                </p>
                <p className="text-xs text-gray-500">điểm</p>
              </div>

              {/* Actions */}
              {!isGraded && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleSave(false)}
                    disabled={gradeMutation.isPending}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Lưu nháp
                  </Button>
                  <Button
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => handleSave(true)}
                    disabled={gradeMutation.isPending}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Hoàn tất chấm
                  </Button>
                </>
              )}

              {isGraded && (
                <Badge variant="secondary" className="text-green-600">
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Đã chấm
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Submission info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  {submission.student.avatarUrl ? (
                    <img
                      src={submission.student.avatarUrl}
                      alt=""
                      className="w-full h-full rounded-full"
                    />
                  ) : (
                    <User className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {submission.student.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {submission.student.email}
                  </p>
                </div>
              </div>

              <div className="text-right text-sm text-gray-500">
                <p>
                  Bắt đầu:{' '}
                  {format(new Date(submission.startedAt), 'dd/MM/yyyy HH:mm', {
                    locale: vi,
                  })}
                </p>
                {submission.submittedAt && (
                  <p>
                    Nộp bài:{' '}
                    {format(
                      new Date(submission.submittedAt),
                      'dd/MM/yyyy HH:mm',
                      { locale: vi }
                    )}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answers list */}
        <div className="space-y-4">
          {submission.answers.map((answer: SubmissionAnswer, index: number) => (
            <AnswerReviewCard
              key={answer.id}
              answer={answer}
              index={index}
              pendingGrade={pendingGrades[answer.id]}
              onGradeChange={(data) => handleGradeChange(answer.id, data)}
              readOnly={isGraded}
            />
          ))}
        </div>

        {/* Summary / Overall feedback */}
        {hasSubjectiveQuestions && !isGraded && (
          <GradingSummary
            value={overallFeedback}
            onChange={setOverallFeedback}
          />
        )}
      </main>
    </div>
  );
}
```

### 4. components/AnswerReviewCard.tsx

```tsx
'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Bot,
  ChevronDown,
  ChevronUp,
  MessageSquare,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { SubmissionAnswer } from '../types';

interface Props {
  answer: SubmissionAnswer;
  index: number;
  pendingGrade?: { teacherScore?: number; teacherFeedback?: string };
  onGradeChange: (data: { teacherScore?: number; teacherFeedback?: string }) => void;
  readOnly: boolean;
}

export function AnswerReviewCard({
  answer,
  index,
  pendingGrade,
  onGradeChange,
  readOnly,
}: Props) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const question = answer.question;
  const isObjective = ['multiple_choice', 'true_false', 'fill_blank'].includes(
    question.type
  );
  const hasAIScore = answer.aiScore !== undefined;
  const teacherScore = pendingGrade?.teacherScore ?? answer.teacherScore;
  const teacherFeedback = pendingGrade?.teacherFeedback ?? answer.teacherFeedback;

  const getFinalScore = () => {
    if (teacherScore !== undefined) return teacherScore;
    if (answer.aiScore !== undefined) return answer.aiScore;
    if (answer.isCorrect) return question.points;
    return 0;
  };

  const getStatusColor = () => {
    if (answer.isCorrect) return 'text-green-600 bg-green-50';
    if (answer.isCorrect === false) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <Card>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${getStatusColor()}`}
              >
                {index + 1}
              </div>
              <div>
                <Badge variant="outline" className="text-xs">
                  {question.type === 'multiple_choice' && 'Trắc nghiệm'}
                  {question.type === 'true_false' && 'Đúng/Sai'}
                  {question.type === 'fill_blank' && 'Điền khuyết'}
                  {question.type === 'essay' && 'Tự luận'}
                  {question.type === 'speaking_task' && 'Nói'}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  {getFinalScore().toFixed(1)} / {question.points}
                </p>
                <p className="text-xs text-gray-500">điểm</p>
              </div>

              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Question text */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-900 font-medium">{question.text}</p>
            </div>

            {/* Student answer */}
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">
                Câu trả lời của học sinh:
              </p>

              {isObjective ? (
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  {answer.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span>
                    {answer.selectedOption ? (
                      <>
                        <strong>{answer.selectedOption.label}.</strong>{' '}
                        {answer.selectedOption.text}
                      </>
                    ) : answer.answer ? (
                      answer.answer
                    ) : (
                      <span className="text-gray-400 italic">Không trả lời</span>
                    )}
                  </span>
                </div>
              ) : (
                <div className="p-3 border rounded-lg bg-white">
                  {answer.answer ? (
                    <p className="whitespace-pre-wrap">{answer.answer}</p>
                  ) : answer.audioUrl ? (
                    <audio controls src={answer.audioUrl} className="w-full" />
                  ) : (
                    <p className="text-gray-400 italic">Không trả lời</p>
                  )}
                </div>
              )}
            </div>

            {/* Correct answer for objective questions */}
            {isObjective && !answer.isCorrect && question.correctAnswer && (
              <div>
                <p className="text-sm font-medium text-green-600 mb-2">
                  Đáp án đúng:
                </p>
                <div className="p-3 border border-green-200 bg-green-50 rounded-lg">
                  {question.options?.find((o) => o.isCorrect) ? (
                    <>
                      <strong>
                        {question.options.find((o) => o.isCorrect)?.label}.
                      </strong>{' '}
                      {question.options.find((o) => o.isCorrect)?.text}
                    </>
                  ) : (
                    question.correctAnswer
                  )}
                </div>
              </div>
            )}

            {/* AI Feedback (for subjective) */}
            {hasAIScore && answer.aiFeedback && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">
                    Chấm điểm AI: {answer.aiScore?.toFixed(1)}/{question.points}
                  </span>
                </div>

                {/* AI Scores breakdown */}
                {answer.aiFeedback.scores && (
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {Object.entries(answer.aiFeedback.scores).map(
                      ([key, value]) => (
                        <div key={key} className="text-center p-2 bg-white rounded">
                          <p className="text-xs text-gray-500">{key}</p>
                          <p className="font-bold text-blue-600">
                            {(value as number).toFixed(1)}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                )}

                <p className="text-sm text-gray-700">{answer.aiFeedback.feedback}</p>

                {answer.aiFeedback.suggestions?.length > 0 && (
                  <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                    {answer.aiFeedback.suggestions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Teacher grading (for subjective) */}
            {!isObjective && !readOnly && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg space-y-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-purple-900">
                    Chấm điểm thủ công
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">
                    Điểm:
                  </label>
                  <Input
                    type="number"
                    min={0}
                    max={question.points}
                    step={0.5}
                    value={teacherScore ?? ''}
                    onChange={(e) =>
                      onGradeChange({
                        teacherScore: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      })
                    }
                    className="w-24"
                    placeholder={hasAIScore ? `AI: ${answer.aiScore}` : '0'}
                  />
                  <span className="text-gray-500">/ {question.points}</span>
                </div>

                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFeedback(!showFeedback)}
                  >
                    {showFeedback ? 'Ẩn nhận xét' : 'Thêm nhận xét'}
                  </Button>

                  {showFeedback && (
                    <Textarea
                      placeholder="Nhận xét cho học sinh..."
                      value={teacherFeedback ?? ''}
                      onChange={(e) =>
                        onGradeChange({ teacherFeedback: e.target.value })
                      }
                      rows={3}
                      className="mt-2"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Read-only teacher feedback */}
            {!isObjective && readOnly && teacherFeedback && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-purple-900">
                    Nhận xét của giáo viên (Điểm: {teacherScore}/{question.points})
                  </span>
                </div>
                <p className="text-gray-700">{teacherFeedback}</p>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
```

### 5. components/GradingSummary.tsx

```tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function GradingSummary({ value, onChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="w-5 h-5 text-purple-600" />
          Nhận xét tổng thể
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Viết nhận xét chung cho bài làm của học sinh..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
        />
        <p className="text-sm text-gray-500 mt-2">
          Nhận xét này sẽ được gửi kèm khi hoàn tất chấm bài.
        </p>
      </CardContent>
    </Card>
  );
}
```

### 6. Page Route: app/(teacher)/teacher/assignments/submissions/[submissionId]/page.tsx

```tsx
import { SubmissionReviewContainer } from '@/features/teacher/assignments/components/SubmissionReviewContainer';

interface PageProps {
  params: { submissionId: string };
}

export default function SubmissionReviewPage({ params }: PageProps) {
  return <SubmissionReviewContainer submissionId={params.submissionId} />;
}
```

---

## ✅ Acceptance Criteria

- [ ] Display student info and submission metadata
- [ ] Show all answers with correct/incorrect indicators
- [ ] Show AI scores and feedback for subjective questions
- [ ] Allow teacher to override scores
- [ ] Allow teacher to add feedback per question
- [ ] Overall feedback text area works
- [ ] Save draft preserves pending grades
- [ ] Complete grading marks submission as graded
- [ ] Navigation between submissions works
- [ ] Late penalty displayed correctly
- [ ] Notification sent to student after grading

---

## 🧪 Test Cases

```typescript
describe('SubmissionReviewContainer', () => {
  it('displays correct answers for MCQ', async () => {
    // Verify correct option highlighted
    // Verify wrong student answer shown
  });

  it('shows AI feedback for essay questions', async () => {
    // Verify AI score displayed
    // Verify feedback text visible
    // Verify score breakdown
  });

  it('allows teacher to override AI score', async () => {
    // Change score input
    // Verify total updates
  });

  it('saves draft without completing', async () => {
    // Enter some scores
    // Click save draft
    // Refresh
    // Verify scores persisted
  });

  it('completes grading and notifies student', async () => {
    // Grade all questions
    // Click complete
    // Verify status changed
    // Verify notification sent
  });

  it('navigates to next ungraded submission', async () => {
    // Click next
    // Verify URL changes
    // Verify new submission loaded
  });
});
```

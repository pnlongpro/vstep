# FE-038: Writing AI Progress UI

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-038 |
| **Phase** | 2 - AI Grading |
| **Sprint** | 9-10 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 4h |
| **Dependencies** | FE-013, BE-036 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Existing files:**
> - `components/writing/WritingExercise.tsx` - ✅ Đã có text editor
> - `components/writing/WritingResult.tsx` - ✅ Đã có result display

**Action:**
- ✅ EXTEND `WritingExercise.tsx` để add submit to AI button
- ✅ CREATE `WritingAIProgress.tsx` component mới
- ✅ EXTEND `WritingResult.tsx` để hiển thị AI feedback
- ❌ KHÔNG viết lại text editor

---

## 🎯 Objective

Add AI scoring progress UI cho Writing:
- Submit button gọi AI grading
- Progress indicator khi AI đang chấm
- Real-time status polling
- Smooth transition to result

---

## 📝 Implementation

### 1. features/ai/ai.api.ts

```typescript
import { apiClient } from '@/lib/axios';

export interface SubmitWritingParams {
  attemptId: number;
  questionId: number;
  taskType: 'task1' | 'task2';
  prompt: string;
  studentAnswer: string;
  targetLevel: 'A2' | 'B1' | 'B2' | 'C1';
}

export interface SubmitWritingResponse {
  jobId: string;
  status: string;
  estimatedTime: number;
}

export interface JobStatusResponse {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  processingTime?: number;
}

export interface WritingResultData {
  overallScore: number;
  taskAchievement: number;
  coherenceCohesion: number;
  lexicalResource: number;
  grammaticalRange: number;
  feedback: string;
  suggestions: string[];
  grammarErrors: Array<{
    text: string;
    position: [number, number];
    correction: string;
    explanation: string;
  }>;
  wordCount: number;
  processingTime: number;
}

export interface JobResultResponse {
  jobId: string;
  status: string;
  result?: WritingResultData;
  error?: string;
}

export const aiApi = {
  submitWriting: (params: SubmitWritingParams) =>
    apiClient.post<SubmitWritingResponse>('/ai/writing/submit', params),

  getJobStatus: (jobId: string) =>
    apiClient.get<JobStatusResponse>(`/ai/job/${jobId}/status`),

  getJobResult: (jobId: string) =>
    apiClient.get<JobResultResponse>(`/ai/job/${jobId}/result`),
};
```

### 2. features/ai/ai.hooks.ts

```typescript
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import { aiApi, SubmitWritingParams, JobResultResponse } from './ai.api';

export function useSubmitWriting() {
  return useMutation({
    mutationFn: aiApi.submitWriting,
  });
}

export function useJobStatus(jobId: string | null, enabled = true) {
  return useQuery({
    queryKey: ['ai-job-status', jobId],
    queryFn: () => aiApi.getJobStatus(jobId!),
    enabled: enabled && !!jobId,
    refetchInterval: (data) => {
      // Poll every 1s until completed/failed
      if (data?.status === 'completed' || data?.status === 'failed') {
        return false;
      }
      return 1000;
    },
  });
}

export function useJobResult(jobId: string | null, enabled = true) {
  return useQuery({
    queryKey: ['ai-job-result', jobId],
    queryFn: () => aiApi.getJobResult(jobId!),
    enabled: enabled && !!jobId,
  });
}

/**
 * Combined hook for AI writing submission workflow
 */
export function useWritingAIGrading() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [stage, setStage] = useState<
    'idle' | 'submitting' | 'processing' | 'completed' | 'failed'
  >('idle');

  const submitMutation = useSubmitWriting();
  const { data: statusData } = useJobStatus(jobId, stage === 'processing');
  const { data: resultData } = useJobResult(
    jobId,
    stage === 'completed',
  );

  // Watch status changes
  useEffect(() => {
    if (statusData?.status === 'completed') {
      setStage('completed');
    } else if (statusData?.status === 'failed') {
      setStage('failed');
    }
  }, [statusData?.status]);

  const submit = useCallback(async (params: SubmitWritingParams) => {
    setStage('submitting');
    try {
      const response = await submitMutation.mutateAsync(params);
      setJobId(response.jobId);
      setStage('processing');
      return response;
    } catch (error) {
      setStage('failed');
      throw error;
    }
  }, [submitMutation]);

  const reset = useCallback(() => {
    setJobId(null);
    setStage('idle');
  }, []);

  return {
    submit,
    reset,
    jobId,
    stage,
    statusData,
    resultData,
    isSubmitting: stage === 'submitting',
    isProcessing: stage === 'processing',
    isCompleted: stage === 'completed',
    isFailed: stage === 'failed',
  };
}
```

### 3. components/writing/WritingAIProgress.tsx

```tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface WritingAIProgressProps {
  stage: 'submitting' | 'processing' | 'completed' | 'failed';
  estimatedTime?: number;
  processingTime?: number;
  error?: string;
}

const stages = [
  { id: 'submit', label: 'Đang gửi bài...' },
  { id: 'analyze', label: 'AI đang phân tích nội dung...' },
  { id: 'score', label: 'Đang chấm điểm theo tiêu chí VSTEP...' },
  { id: 'feedback', label: 'Đang tạo nhận xét chi tiết...' },
  { id: 'complete', label: 'Hoàn thành!' },
];

export function WritingAIProgress({
  stage,
  estimatedTime = 5,
  processingTime,
  error,
}: WritingAIProgressProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Animate through stages
  useEffect(() => {
    if (stage === 'submitting') {
      setCurrentStageIndex(0);
      setProgress(10);
    } else if (stage === 'processing') {
      // Progress through stages
      const interval = setInterval(() => {
        setCurrentStageIndex((prev) => {
          if (prev < 3) return prev + 1;
          return prev;
        });
        setProgress((prev) => {
          if (prev < 85) return prev + 15;
          return prev;
        });
      }, estimatedTime * 200);

      return () => clearInterval(interval);
    } else if (stage === 'completed') {
      setCurrentStageIndex(4);
      setProgress(100);
    }
  }, [stage, estimatedTime]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-6">
          {/* Icon */}
          <AnimatePresence mode="wait">
            {stage === 'failed' ? (
              <motion.div
                key="failed"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-red-500"
              >
                <XCircle className="w-16 h-16" />
              </motion.div>
            ) : stage === 'completed' ? (
              <motion.div
                key="completed"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-green-500"
              >
                <CheckCircle className="w-16 h-16" />
              </motion.div>
            ) : (
              <motion.div
                key="processing"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                className="relative"
              >
                <Sparkles className="w-16 h-16 text-blue-500" />
                <Loader2 className="w-8 h-8 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stage Label */}
          <motion.p
            key={currentStageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg font-medium text-center"
          >
            {stage === 'failed' 
              ? error || 'Có lỗi xảy ra'
              : stages[currentStageIndex]?.label}
          </motion.p>

          {/* Progress Bar */}
          {stage !== 'failed' && (
            <div className="w-full space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground text-center">
                {stage === 'completed' && processingTime
                  ? `Hoàn thành trong ${processingTime.toFixed(1)}s`
                  : `Ước tính: ${estimatedTime}s`}
              </p>
            </div>
          )}

          {/* Stage Dots */}
          <div className="flex space-x-2">
            {stages.slice(0, 4).map((s, i) => (
              <motion.div
                key={s.id}
                className={`w-2 h-2 rounded-full ${
                  i <= currentStageIndex
                    ? 'bg-blue-500'
                    : 'bg-gray-200'
                }`}
                animate={
                  i === currentStageIndex
                    ? { scale: [1, 1.3, 1] }
                    : {}
                }
                transition={{ repeat: Infinity, duration: 1 }}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 4. Extend WritingExercise.tsx

```tsx
// Add to existing WritingExercise.tsx

import { useWritingAIGrading } from '@/features/ai/ai.hooks';
import { WritingAIProgress } from './WritingAIProgress';
import { WritingAIResult } from './WritingAIResult';

// Inside component:
const {
  submit: submitToAI,
  stage: aiStage,
  resultData,
  isProcessing,
  isCompleted,
  reset: resetAI,
} = useWritingAIGrading();

// Handler for AI grading
const handleAIGrading = async () => {
  if (!answer || answer.trim().length < 50) {
    toast.error('Bài viết cần ít nhất 50 ký tự');
    return;
  }

  await submitToAI({
    attemptId: attemptId,
    questionId: question.id,
    taskType: question.taskType,
    prompt: question.prompt,
    studentAnswer: answer,
    targetLevel: level,
  });
};

// In render:
{isProcessing && (
  <WritingAIProgress
    stage={aiStage}
    estimatedTime={5}
  />
)}

{isCompleted && resultData?.result && (
  <WritingAIResult
    result={resultData.result}
    studentAnswer={answer}
    onClose={resetAI}
  />
)}

// Submit button
<Button
  onClick={handleAIGrading}
  disabled={isProcessing}
>
  {isProcessing ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Đang chấm...
    </>
  ) : (
    <>
      <Sparkles className="mr-2 h-4 w-4" />
      Chấm bài với AI
    </>
  )}
</Button>
```

### 5. components/writing/WritingAIResult.tsx

```tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WritingResultData } from '@/features/ai/ai.api';

interface WritingAIResultProps {
  result: WritingResultData;
  studentAnswer: string;
  onClose: () => void;
}

const criteriaLabels = {
  taskAchievement: 'Task Achievement',
  coherenceCohesion: 'Coherence & Cohesion',
  lexicalResource: 'Lexical Resource',
  grammaticalRange: 'Grammatical Range & Accuracy',
};

export function WritingAIResult({
  result,
  studentAnswer,
  onClose,
}: WritingAIResultProps) {
  const [showErrors, setShowErrors] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-blue-600';
    if (score >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBandLevel = (score: number) => {
    if (score >= 9) return 'C1';
    if (score >= 7) return 'B2';
    if (score >= 5) return 'B1';
    if (score >= 3) return 'A2';
    return 'A1';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-4"
    >
      {/* Overall Score */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Điểm tổng</p>
              <p className={`text-4xl font-bold ${getScoreColor(result.overallScore)}`}>
                {result.overallScore.toFixed(1)}/10
              </p>
              <Badge variant="secondary" className="mt-1">
                {getBandLevel(result.overallScore)} Level
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Số từ</p>
              <p className="text-2xl font-semibold">{result.wordCount}</p>
              <p className="text-xs text-muted-foreground">
                Xử lý trong {result.processingTime.toFixed(1)}s
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Criteria Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Chi tiết điểm số</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(criteriaLabels).map(([key, label]) => {
            const score = result[key as keyof typeof criteriaLabels];
            return (
              <div key={key} className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{label}</span>
                  <span className={`font-semibold ${getScoreColor(score)}`}>
                    {score.toFixed(1)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score * 10}%` }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className={`h-2 rounded-full ${
                      score >= 8 ? 'bg-green-500' :
                      score >= 6 ? 'bg-blue-500' :
                      score >= 4 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-500" />
            Nhận xét
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{result.feedback}</p>
        </CardContent>
      </Card>

      {/* Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Gợi ý cải thiện
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {result.suggestions.map((suggestion, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-blue-500 font-medium">{i + 1}.</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Grammar Errors */}
      {result.grammarErrors.length > 0 && (
        <Card>
          <CardHeader>
            <button
              onClick={() => setShowErrors(!showErrors)}
              className="flex items-center justify-between w-full"
            >
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Lỗi ngữ pháp ({result.grammarErrors.length})
              </CardTitle>
              {showErrors ? <ChevronUp /> : <ChevronDown />}
            </button>
          </CardHeader>
          {showErrors && (
            <CardContent className="space-y-3">
              {result.grammarErrors.map((error, i) => (
                <div key={i} className="p-3 bg-orange-50 rounded-lg text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="line-through text-red-600">
                      {error.text}
                    </span>
                    <span>→</span>
                    <span className="text-green-600 font-medium">
                      {error.correction}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {error.explanation}
                  </p>
                </div>
              ))}
            </CardContent>
          )}
        </Card>
      )}

      <Button onClick={onClose} className="w-full">
        Đóng
      </Button>
    </motion.div>
  );
}
```

---

## ✅ Acceptance Criteria

- [ ] Submit to AI button works
- [ ] Progress indicator animates through stages
- [ ] Polling updates status in real-time
- [ ] Result displays all 4 criteria scores
- [ ] Feedback shown in Vietnamese
- [ ] Grammar errors highlighted with corrections
- [ ] Suggestions displayed
- [ ] Loading states smooth
- [ ] Error handling works

---

## 🧪 Test

```typescript
// Test AI progress states
describe('WritingAIProgress', () => {
  it('shows submitting state', () => {
    render(<WritingAIProgress stage="submitting" />);
    expect(screen.getByText('Đang gửi bài...')).toBeInTheDocument();
  });

  it('shows completed state', () => {
    render(<WritingAIProgress stage="completed" processingTime={3.5} />);
    expect(screen.getByText('Hoàn thành!')).toBeInTheDocument();
    expect(screen.getByText(/3.5s/)).toBeInTheDocument();
  });
});
```

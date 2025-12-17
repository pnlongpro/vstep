# FE-049: Teacher Review Interface

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-049 |
| **Phase** | 2 - AI Grading |
| **Sprint** | 11-12 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 8h |
| **Dependencies** | FE-044, BE-048 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Existing UI Template files:**
> - `UI-Template/components/AIGrading.tsx` - ✅ Có UI chấm AI
> - `UI-Template/components/TeacherDashboard.tsx` - ✅ Có review queue UI

**Action:**
- ✅ CREATE `app/(teacher)/reviews/` - Review pages
- ✅ CREATE `features/teacher/reviews/` - Hooks & services  
- ✅ REFER UI-Template để lấy design pattern
- ❌ KHÔNG copy nguyên file, chỉ tham khảo layout

---

## 🎯 Objective

Create comprehensive Teacher Review interface:
- Review queue with filters
- Detailed review page
- Score override controls
- Text & audio feedback
- Inline annotations
- Split view (original + feedback)

---

## 📝 Implementation

### 1. app/(teacher)/reviews/page.tsx

```tsx
import { Metadata } from 'next';
import { ReviewQueueContainer } from '@/features/teacher/reviews/ReviewQueueContainer';

export const metadata: Metadata = {
  title: 'Chấm bài | VSTEPRO Teacher',
};

export default function ReviewsPage() {
  return <ReviewQueueContainer />;
}
```

### 2. features/teacher/reviews/ReviewQueueContainer.tsx

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Mic, 
  Clock, 
  Filter,
  Search,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useReviewQueue, useReviewStats, ReviewType, ReviewStatus } from './useReviews';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export function ReviewQueueContainer() {
  const [type, setType] = useState<ReviewType | 'all'>('all');
  const [status, setStatus] = useState<ReviewStatus | 'all'>('pending');

  const { data: queue, isLoading } = useReviewQueue({
    type: type === 'all' ? undefined : type,
    status: status === 'all' ? undefined : status,
  });

  const { data: stats } = useReviewStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Chấm bài</h1>
        <p className="text-muted-foreground">
          Xem xét và chấm điểm bài làm của học viên
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Chờ chấm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats?.pending || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đang chấm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats?.inProgress || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Hoàn thành hôm nay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats?.completedToday || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Thời gian TB
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.averageReviewTime?.toFixed(0) || 0} phút
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Tabs value={status} onValueChange={(v) => setStatus(v as any)} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="pending">Chờ chấm</TabsTrigger>
            <TabsTrigger value="in_progress">Đang chấm</TabsTrigger>
            <TabsTrigger value="completed">Đã hoàn thành</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2 ml-auto">
          <Select value={type} onValueChange={(v) => setType(v as any)}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Loại bài" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="writing">Writing</SelectItem>
              <SelectItem value="speaking">Speaking</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Queue List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : !queue?.items.length ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium mb-2">Không có bài cần chấm</h3>
          <p className="text-muted-foreground text-sm">
            Các bài nộp mới sẽ xuất hiện ở đây
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {queue.items.map((item) => (
            <Link
              key={item.id}
              href={`/teacher/reviews/${item.id}`}
              className="block"
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Type Icon */}
                    <div
                      className={cn(
                        'p-3 rounded-lg',
                        item.submissionType === 'writing'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-purple-100 text-purple-600'
                      )}
                    >
                      {item.submissionType === 'writing' ? (
                        <FileText className="h-5 w-5" />
                      ) : (
                        <Mic className="h-5 w-5" />
                      )}
                    </div>

                    {/* Student Info */}
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={item.student.avatar} />
                        <AvatarFallback>
                          {item.student.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{item.student.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {item.submissionType === 'writing' ? 'Writing' : 'Speaking'}
                          </Badge>
                          {item.className && (
                            <span>{item.className}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="flex-1 hidden md:block">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.content}
                      </p>
                    </div>

                    {/* AI Score & Time */}
                    <div className="text-right">
                      {item.aiScore !== undefined && (
                        <div className="text-sm">
                          AI: <span className="font-medium">{item.aiScore.toFixed(1)}</span>
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(item.submittedAt), {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </div>
                    </div>

                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Total count */}
      {queue && queue.total > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Hiển thị {queue.items.length} / {queue.total} bài
        </p>
      )}
    </div>
  );
}
```

### 3. app/(teacher)/reviews/[id]/page.tsx

```tsx
import { Metadata } from 'next';
import { ReviewDetailContainer } from '@/features/teacher/reviews/ReviewDetailContainer';

export const metadata: Metadata = {
  title: 'Chi tiết chấm bài | VSTEPRO Teacher',
};

interface PageProps {
  params: { id: string };
}

export default function ReviewDetailPage({ params }: PageProps) {
  return <ReviewDetailContainer reviewId={params.id} />;
}
```

### 4. features/teacher/reviews/ReviewDetailContainer.tsx

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  Mic, 
  Square,
  Play,
  Pause,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useReviewDetail, useSubmitReview } from './useReviews';
import { ScoreOverridePanel } from '@/components/teacher/reviews/ScoreOverridePanel';
import { AudioRecorder } from '@/components/teacher/reviews/AudioRecorder';
import { AnnotatedText } from '@/components/teacher/reviews/AnnotatedText';
import { cn } from '@/lib/utils';

interface ReviewDetailContainerProps {
  reviewId: string;
}

export function ReviewDetailContainer({ reviewId }: ReviewDetailContainerProps) {
  const { data: review, isLoading } = useReviewDetail(reviewId);
  const submitReview = useSubmitReview();

  const [overrideScores, setOverrideScores] = useState<Record<string, number>>({});
  const [overrideOverall, setOverrideOverall] = useState<number | null>(null);
  const [textFeedback, setTextFeedback] = useState('');
  const [audioFeedbackUrl, setAudioFeedbackUrl] = useState<string | null>(null);
  const [annotations, setAnnotations] = useState<any[]>([]);

  // Initialize state when review loads
  useState(() => {
    if (review) {
      setOverrideScores(review.overrideCriteriaScores || {});
      setOverrideOverall(review.overrideOverallScore);
      setTextFeedback(review.textFeedback || '');
      setAudioFeedbackUrl(review.audioFeedbackUrl);
      setAnnotations(review.annotations || []);
    }
  });

  const handleSubmit = async () => {
    try {
      await submitReview.mutateAsync({
        reviewId,
        overrideOverallScore: overrideOverall || undefined,
        overrideCriteriaScores: Object.keys(overrideScores).length > 0 ? overrideScores : undefined,
        textFeedback,
        audioFeedbackUrl: audioFeedbackUrl || undefined,
        annotations: annotations.length > 0 ? annotations : undefined,
      });

      toast.success('Đã gửi nhận xét thành công!');
      // Redirect back to queue
      window.location.href = '/teacher/reviews';
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-[600px]" />
          <Skeleton className="h-[600px]" />
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Không tìm thấy bài chấm</h2>
        <Link href="/teacher/reviews">
          <Button variant="outline">Quay lại</Button>
        </Link>
      </div>
    );
  }

  const isWriting = review.submissionType === 'writing';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link
            href="/teacher/reviews"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách
          </Link>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            Chấm bài {isWriting ? 'Writing' : 'Speaking'}
            <Badge variant="outline">
              {review.student?.name}
            </Badge>
          </h1>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={submitReview.isPending || !textFeedback}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {submitReview.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Gửi nhận xét
        </Button>
      </div>

      {/* Main Content - Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Original Content */}
        <Card className="lg:sticky lg:top-6 lg:h-[calc(100vh-120px)] overflow-auto">
          <CardHeader>
            <CardTitle className="text-lg">Bài làm của học viên</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* AI Scores */}
            {review.aiScores && (
              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <div className="font-medium text-blue-800">Điểm AI</div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">
                    {review.aiScores.overall.toFixed(1)}
                  </span>
                  <span className="text-sm text-blue-600">/10</span>
                </div>
                {review.aiScores.criteria && (
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(review.aiScores.criteria).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-blue-700">{key}:</span>
                        <span className="font-medium">{(value as number).toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Original Content */}
            {isWriting ? (
              <div className="prose prose-sm max-w-none">
                <AnnotatedText
                  text={review.originalContent || ''}
                  annotations={annotations}
                  onAnnotationAdd={(annotation) => {
                    setAnnotations([...annotations, annotation]);
                  }}
                  onAnnotationRemove={(index) => {
                    setAnnotations(annotations.filter((_, i) => i !== index));
                  }}
                />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Audio Player */}
                {review.originalAudioUrl && (
                  <div className="bg-gray-100 rounded-lg p-4">
                    <audio
                      src={review.originalAudioUrl}
                      controls
                      className="w-full"
                    />
                  </div>
                )}

                {/* Transcription */}
                {review.transcription && (
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Transcript
                    </Label>
                    <div className="mt-2 bg-gray-50 rounded-lg p-4 text-sm">
                      {review.transcription}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* AI Feedback */}
            {review.aiScores?.feedback && (
              <div className="bg-gray-50 rounded-lg p-4">
                <Label className="text-sm text-muted-foreground">
                  Nhận xét AI
                </Label>
                <p className="mt-2 text-sm">{review.aiScores.feedback}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right: Teacher Feedback */}
        <div className="space-y-6">
          {/* Score Override */}
          <ScoreOverridePanel
            aiScores={review.aiScores}
            overrideOverall={overrideOverall}
            overrideCriteria={overrideScores}
            onOverallChange={setOverrideOverall}
            onCriteriaChange={(key, value) => {
              setOverrideScores({ ...overrideScores, [key]: value });
            }}
            submissionType={review.submissionType}
          />

          {/* Text Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nhận xét văn bản</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Nhập nhận xét cho học viên..."
                rows={6}
                value={textFeedback}
                onChange={(e) => setTextFeedback(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-2">
                {textFeedback.length} ký tự
              </p>
            </CardContent>
          </Card>

          {/* Audio Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nhận xét bằng giọng nói</CardTitle>
            </CardHeader>
            <CardContent>
              <AudioRecorder
                reviewId={reviewId}
                existingUrl={audioFeedbackUrl}
                onRecorded={(url) => setAudioFeedbackUrl(url)}
              />
            </CardContent>
          </Card>

          {/* Submit Button (Mobile) */}
          <div className="lg:hidden">
            <Button
              onClick={handleSubmit}
              disabled={submitReview.isPending || !textFeedback}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {submitReview.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Gửi nhận xét
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 5. components/teacher/reviews/ScoreOverridePanel.tsx

```tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const WRITING_CRITERIA = [
  { key: 'task_achievement', label: 'Task Achievement' },
  { key: 'coherence_cohesion', label: 'Coherence & Cohesion' },
  { key: 'lexical_resource', label: 'Lexical Resource' },
  { key: 'grammatical_range', label: 'Grammatical Range' },
];

const SPEAKING_CRITERIA = [
  { key: 'pronunciation', label: 'Pronunciation' },
  { key: 'fluency', label: 'Fluency' },
  { key: 'grammar', label: 'Grammar' },
  { key: 'vocabulary', label: 'Vocabulary' },
];

interface ScoreOverridePanelProps {
  aiScores?: {
    overall: number;
    criteria: Record<string, number>;
  };
  overrideOverall: number | null;
  overrideCriteria: Record<string, number>;
  onOverallChange: (value: number | null) => void;
  onCriteriaChange: (key: string, value: number) => void;
  submissionType: 'writing' | 'speaking';
}

export function ScoreOverridePanel({
  aiScores,
  overrideOverall,
  overrideCriteria,
  onOverallChange,
  onCriteriaChange,
  submissionType,
}: ScoreOverridePanelProps) {
  const [showOverride, setShowOverride] = useState(
    overrideOverall !== null || Object.keys(overrideCriteria).length > 0
  );

  const criteria = submissionType === 'writing' ? WRITING_CRITERIA : SPEAKING_CRITERIA;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Điểm số</CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="override-toggle" className="text-sm">
              Ghi đè điểm AI
            </Label>
            <Switch
              id="override-toggle"
              checked={showOverride}
              onCheckedChange={(checked) => {
                setShowOverride(checked);
                if (!checked) {
                  onOverallChange(null);
                }
              }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Điểm tổng</Label>
            <div className="flex items-center gap-2">
              {showOverride && overrideOverall !== null ? (
                <>
                  <span className="text-muted-foreground line-through">
                    {aiScores?.overall.toFixed(1)}
                  </span>
                  <span className="text-2xl font-bold text-purple-600">
                    {overrideOverall.toFixed(1)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold">
                  {aiScores?.overall.toFixed(1) || '-'}
                </span>
              )}
            </div>
          </div>
          
          {showOverride && (
            <Slider
              value={[overrideOverall ?? aiScores?.overall ?? 5]}
              onValueChange={([value]) => onOverallChange(value)}
              min={0}
              max={10}
              step={0.5}
              className="py-2"
            />
          )}
        </div>

        {/* Criteria Scores */}
        <div className="space-y-4">
          <Label className="text-sm text-muted-foreground">Điểm theo tiêu chí</Label>
          
          {criteria.map(({ key, label }) => {
            const aiScore = aiScores?.criteria?.[key] ?? 0;
            const overrideScore = overrideCriteria[key];
            const displayScore = showOverride && overrideScore !== undefined ? overrideScore : aiScore;

            return (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{label}</span>
                  <div className="flex items-center gap-2">
                    {showOverride && overrideScore !== undefined && (
                      <span className="text-muted-foreground line-through text-xs">
                        {aiScore.toFixed(1)}
                      </span>
                    )}
                    <span
                      className={cn(
                        'font-medium',
                        showOverride && overrideScore !== undefined && 'text-purple-600'
                      )}
                    >
                      {displayScore.toFixed(1)}
                    </span>
                  </div>
                </div>
                
                {showOverride && (
                  <Slider
                    value={[overrideScore ?? aiScore]}
                    onValueChange={([value]) => onCriteriaChange(key, value)}
                    min={0}
                    max={10}
                    step={0.5}
                    className="py-1"
                  />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
```

### 6. features/teacher/reviews/useReviews.ts

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teacherApi } from '@/services/teacher.api';

export type ReviewType = 'writing' | 'speaking';
export type ReviewStatus = 'pending' | 'in_progress' | 'completed';

export interface ReviewQueueItem {
  id: string;
  submissionId: string;
  submissionType: ReviewType;
  student: {
    id: string;
    name: string;
    avatar?: string;
  };
  className?: string;
  aiScore?: number;
  content: string;
  submittedAt: Date;
  status: ReviewStatus;
}

export interface ReviewDetail {
  id: string;
  submissionId: string;
  submissionType: ReviewType;
  student: { id: string; name: string; avatar?: string };
  status: ReviewStatus;
  aiScores?: {
    overall: number;
    criteria: Record<string, number>;
    feedback: string;
  };
  overrideOverallScore?: number;
  overrideCriteriaScores?: Record<string, number>;
  textFeedback?: string;
  audioFeedbackUrl?: string;
  annotations?: any[];
  originalContent?: string;
  originalAudioUrl?: string;
  transcription?: string;
}

export interface ReviewStats {
  pending: number;
  inProgress: number;
  completedToday: number;
  completedThisWeek: number;
  averageReviewTime: number;
}

export function useReviewQueue(filters: {
  status?: ReviewStatus;
  type?: ReviewType;
  classId?: string;
}) {
  return useQuery<{ items: ReviewQueueItem[]; total: number }>({
    queryKey: ['review-queue', filters],
    queryFn: () => teacherApi.getReviewQueue(filters),
  });
}

export function useReviewDetail(reviewId: string) {
  return useQuery<ReviewDetail>({
    queryKey: ['review-detail', reviewId],
    queryFn: () => teacherApi.getReviewDetail(reviewId),
    enabled: !!reviewId,
  });
}

export function useReviewStats() {
  return useQuery<ReviewStats>({
    queryKey: ['review-stats'],
    queryFn: () => teacherApi.getReviewStats(),
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: {
      reviewId: string;
      overrideOverallScore?: number;
      overrideCriteriaScores?: Record<string, number>;
      textFeedback: string;
      audioFeedbackUrl?: string;
      annotations?: any[];
    }) => teacherApi.submitReview(dto.reviewId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review-queue'] });
      queryClient.invalidateQueries({ queryKey: ['review-stats'] });
    },
  });
}
```

---

## ✅ Acceptance Criteria

- [ ] Review queue displays with filters
- [ ] Queue shows student info, preview, AI score
- [ ] Detail page loads with split view
- [ ] Original content displayed (text or audio)
- [ ] Score override sliders work
- [ ] Text feedback textarea works
- [ ] Audio recorder component works
- [ ] Submit sends data to API
- [ ] Success notification shows
- [ ] Redirects back to queue

---

## 🎨 Design Notes

- Split view: Left (original) / Right (feedback)
- Purple accent for override scores
- Slider controls for score adjustment
- Audio waveform visualization
- Inline annotation markers (for writing)

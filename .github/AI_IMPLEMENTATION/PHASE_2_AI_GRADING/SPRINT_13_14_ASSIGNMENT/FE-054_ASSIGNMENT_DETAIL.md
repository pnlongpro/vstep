# FE-054: Assignment Detail Page

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-054 |
| **Phase** | 2 - AI Grading |
| **Sprint** | 13-14 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 6h |
| **Dependencies** | BE-051, BE-052, FE-051 |

---

## 🎯 Objective

Implement assignment detail page for teachers:
- Assignment overview with stats
- Submissions list with status
- Quick grade access
- Edit/publish/close actions

---

## ⚠️ QUAN TRỌNG: Existing Files Warning

### Hướng dẫn:
- **TẠO MỚI** trong `FE/src/features/teacher/assignments/`
- **SỬ DỤNG** Teacher layout với purple theme
- **TÍCH HỢP** với submission review page

---

## 📝 Implementation

### 1. app/(teacher)/teacher/assignments/[id]/page.tsx

```tsx
import { Metadata } from 'next';
import { AssignmentDetailContainer } from '@/features/teacher/assignments/components/AssignmentDetailContainer';

interface Props {
  params: { id: string };
}

export const metadata: Metadata = {
  title: 'Chi tiết bài tập - Teacher Portal',
};

export default function AssignmentDetailPage({ params }: Props) {
  return <AssignmentDetailContainer assignmentId={params.id} />;
}
```

### 2. components/AssignmentDetailContainer.tsx

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  ArrowLeft,
  Edit,
  PlayCircle,
  XCircle,
  Clock,
  Users,
  FileText,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useAssignment,
  usePublishAssignment,
  useCloseAssignment,
} from '../hooks/useAssignments';
import { SubmissionsTab } from './SubmissionsTab';
import { QuestionsTab } from './QuestionsTab';
import { AssignmentStatus } from '../types';
import { toast } from 'sonner';

interface Props {
  assignmentId: string;
}

const statusConfig: Record<AssignmentStatus, { label: string; color: string }> = {
  [AssignmentStatus.DRAFT]: { label: 'Nháp', color: 'bg-gray-100 text-gray-700' },
  [AssignmentStatus.PUBLISHED]: { label: 'Đang mở', color: 'bg-green-100 text-green-700' },
  [AssignmentStatus.CLOSED]: { label: 'Đã đóng', color: 'bg-red-100 text-red-700' },
};

const skillLabels: Record<string, string> = {
  reading: 'Reading',
  listening: 'Listening',
  writing: 'Writing',
  speaking: 'Speaking',
  mixed: 'Tổng hợp',
};

export function AssignmentDetailContainer({ assignmentId }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('submissions');

  const { data: assignment, isLoading } = useAssignment(assignmentId);
  const publishMutation = usePublishAssignment();
  const closeMutation = useCloseAssignment();

  const handlePublish = async () => {
    try {
      await publishMutation.mutateAsync(assignmentId);
      toast.success('Đã phát hành bài tập');
    } catch (error: any) {
      toast.error(error.message || 'Không thể phát hành');
    }
  };

  const handleClose = async () => {
    try {
      await closeMutation.mutateAsync(assignmentId);
      toast.success('Đã đóng bài tập');
    } catch (error: any) {
      toast.error(error.message || 'Không thể đóng');
    }
  };

  if (isLoading) {
    return <AssignmentDetailSkeleton />;
  }

  if (!assignment) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Không tìm thấy bài tập</p>
      </div>
    );
  }

  const isOverdue = new Date(assignment.dueDate) < new Date();
  const config = statusConfig[assignment.status];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {assignment.title}
              </h1>
              <Badge className={config.color}>{config.label}</Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {skillLabels[assignment.skill]} • {assignment.level}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {assignment.timeLimit
                  ? `${assignment.timeLimit} phút`
                  : 'Không giới hạn'}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {assignment.class?.name}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {assignment.status === 'draft' && (
            <>
              <Button
                variant="outline"
                onClick={() => router.push(`/teacher/assignments/${assignmentId}/edit`)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </Button>
              <Button
                onClick={handlePublish}
                disabled={publishMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Phát hành
              </Button>
            </>
          )}

          {assignment.status === 'published' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MoreHorizontal className="w-4 h-4 mr-2" />
                  Thao tác
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => router.push(`/teacher/assignments/${assignmentId}/edit`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Gia hạn
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleClose}
                  className="text-red-600"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Đóng bài tập
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Hạn nộp"
          value={format(new Date(assignment.dueDate), 'dd/MM/yyyy HH:mm', { locale: vi })}
          icon={Clock}
          alert={isOverdue && assignment.status === 'published'}
        />
        <StatCard
          title="Số câu hỏi"
          value={assignment.questionCount?.toString() || '0'}
          icon={FileText}
        />
        <StatCard
          title="Đã nộp"
          value={`${assignment.submissionCount || 0}`}
          icon={CheckCircle2}
        />
        <StatCard
          title="Chờ chấm"
          value={`${assignment.pendingGradeCount || 0}`}
          icon={AlertCircle}
          alert={(assignment.pendingGradeCount || 0) > 0}
        />
      </div>

      {/* Description */}
      {assignment.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mô tả</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{assignment.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="submissions">
            Bài nộp ({assignment.submissionCount || 0})
          </TabsTrigger>
          <TabsTrigger value="questions">
            Câu hỏi ({assignment.questionCount || 0})
          </TabsTrigger>
          <TabsTrigger value="settings">Cài đặt</TabsTrigger>
        </TabsList>

        <TabsContent value="submissions" className="mt-6">
          <SubmissionsTab assignmentId={assignmentId} />
        </TabsContent>

        <TabsContent value="questions" className="mt-6">
          <QuestionsTab questions={assignment.questions || []} />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <SettingsTab assignment={assignment} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  alert?: boolean;
}

function StatCard({ title, value, icon: Icon, alert }: StatCardProps) {
  return (
    <Card className={alert ? 'border-red-200 bg-red-50' : ''}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className={`text-xl font-bold mt-1 ${alert ? 'text-red-600' : 'text-gray-900'}`}>
              {value}
            </p>
          </div>
          <div className={`p-2 rounded-lg ${alert ? 'bg-red-100' : 'bg-purple-100'}`}>
            <Icon className={`w-5 h-5 ${alert ? 'text-red-600' : 'text-purple-600'}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SettingsTab({ assignment }: { assignment: any }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Số lần làm tối đa</p>
            <p className="font-medium">{assignment.maxAttempts} lần</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cách tính điểm</p>
            <p className="font-medium">
              {assignment.scoreCalculation === 'best'
                ? 'Điểm cao nhất'
                : assignment.scoreCalculation === 'last'
                ? 'Lần cuối'
                : 'Trung bình'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Nộp muộn</p>
            <p className="font-medium">
              {assignment.allowLateSubmission
                ? `Cho phép (trừ ${assignment.latePenalty}%/ngày)`
                : 'Không cho phép'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Hiện đáp án</p>
            <p className="font-medium">
              {assignment.showAnswersAfter ? 'Có' : 'Không'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AssignmentDetailSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start gap-4">
        <Skeleton className="h-10 w-10" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}
```

### 3. components/SubmissionsTab.tsx

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format, formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Search, Eye, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useSubmissions } from '../hooks/useSubmissions';

interface Props {
  assignmentId: string;
}

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  in_progress: { label: 'Đang làm', icon: Clock, color: 'text-blue-600' },
  submitted: { label: 'Đã nộp', icon: AlertTriangle, color: 'text-orange-600' },
  graded: { label: 'Đã chấm', icon: CheckCircle, color: 'text-green-600' },
};

export function SubmissionsTab({ assignmentId }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: submissions, isLoading } = useSubmissions(assignmentId);

  const filteredSubmissions = submissions?.filter((sub: any) => {
    const matchesSearch = sub.student?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Tìm học viên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="in_progress">Đang làm</SelectItem>
            <SelectItem value="submitted">Chờ chấm</SelectItem>
            <SelectItem value="graded">Đã chấm</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {filteredSubmissions?.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>Chưa có bài nộp nào</p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Học viên</TableHead>
                <TableHead>Lần làm</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Điểm</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions?.map((submission: any) => {
                const config = statusConfig[submission.status];
                const StatusIcon = config.icon;

                return (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={submission.student?.avatar} />
                          <AvatarFallback className="bg-purple-100 text-purple-700">
                            {submission.student?.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{submission.student?.name}</p>
                          <p className="text-xs text-gray-500">
                            {submission.student?.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        Lần {submission.attemptNumber}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-1 ${config.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        <span className="text-sm">{config.label}</span>
                      </div>
                      {submission.isLate && (
                        <Badge variant="destructive" className="mt-1 text-xs">
                          Trễ hạn
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {submission.submittedAt ? (
                        <div className="text-sm">
                          <p>{format(new Date(submission.submittedAt), 'dd/MM HH:mm')}</p>
                          <p className="text-gray-400 text-xs">
                            {submission.timeSpent
                              ? `${Math.floor(submission.timeSpent / 60)} phút`
                              : '-'}
                          </p>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {submission.status === 'graded' ? (
                        <span className="text-lg font-bold text-green-600">
                          {submission.score?.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {submission.status !== 'in_progress' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(`/teacher/submissions/${submission.id}`)
                          }
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          {submission.status === 'submitted' ? 'Chấm' : 'Xem'}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
```

### 4. components/QuestionsTab.tsx

```tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  questions: any[];
}

const questionTypes: Record<string, string> = {
  multiple_choice: 'Trắc nghiệm',
  true_false: 'Đúng/Sai',
  fill_blank: 'Điền khuyết',
  essay: 'Tự luận',
  speaking_task: 'Nói',
};

export function QuestionsTab({ questions }: Props) {
  if (questions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Không có câu hỏi</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {questions.map((item, index) => (
        <Card key={item.id}>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <span className="text-gray-400 font-medium">
                {index + 1}.
              </span>
              <div className="flex-1">
                <p className="text-gray-900">{item.question?.text}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">
                    {questionTypes[item.question?.type] || item.question?.type}
                  </Badge>
                  <Badge variant="secondary">
                    {item.points} điểm
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

---

## ✅ Acceptance Criteria

- [ ] Assignment info hiển thị đầy đủ
- [ ] Stats cards accurate
- [ ] Submissions list với filters
- [ ] Click để đi tới grade page
- [ ] Questions tab hiển thị đúng
- [ ] Settings tab hiển thị config
- [ ] Publish button cho draft
- [ ] Close button cho published
- [ ] Edit button cho draft
- [ ] Loading skeleton
- [ ] 404 handling

---

## 🧪 Test Cases

```typescript
describe('AssignmentDetailContainer', () => {
  it('displays assignment info correctly', () => {
    // Verify title, skill, level, class name
  });

  it('shows correct submission stats', () => {
    // Verify counts
  });

  it('filters submissions by status', async () => {
    // Select submitted
    // Verify filtered list
  });

  it('navigates to grade page', async () => {
    // Click view/grade button
    // Verify navigation
  });
});
```

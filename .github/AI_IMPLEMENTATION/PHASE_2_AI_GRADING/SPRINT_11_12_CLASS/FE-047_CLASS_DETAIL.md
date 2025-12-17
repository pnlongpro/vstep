# FE-047: Class Detail Page

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-047 |
| **Phase** | 2 - AI Grading |
| **Sprint** | 11-12 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 6h |
| **Dependencies** | FE-045, BE-045, BE-046 |

---

## 🎯 Objective

Create Class Detail page with tabs:
- Overview (stats, invite code)
- Students list with management
- Materials list with upload
- Assignments preview
- Analytics charts

---

## 📝 Implementation

### 1. app/(teacher)/classes/[id]/page.tsx

```tsx
import { Metadata } from 'next';
import { ClassDetailContainer } from '@/features/teacher/classes/ClassDetailContainer';

export const metadata: Metadata = {
  title: 'Chi tiết lớp học | VSTEPRO Teacher',
};

interface PageProps {
  params: { id: string };
}

export default function ClassDetailPage({ params }: PageProps) {
  return <ClassDetailContainer classId={params.id} />;
}
```

### 2. features/teacher/classes/ClassDetailContainer.tsx

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Settings, 
  Users, 
  FileText, 
  BarChart3,
  Copy,
  RefreshCw,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useClass, useRegenerateInviteCode } from './useClasses';
import { ClassStudentsTab } from '@/components/teacher/classes/ClassStudentsTab';
import { ClassMaterialsTab } from '@/components/teacher/classes/ClassMaterialsTab';
import { ClassAnalyticsTab } from '@/components/teacher/classes/ClassAnalyticsTab';
import { EditClassModal } from '@/components/teacher/classes/EditClassModal';
import { cn } from '@/lib/utils';

interface ClassDetailContainerProps {
  classId: string;
}

const levelColors: Record<string, string> = {
  A2: 'bg-green-100 text-green-800',
  B1: 'bg-blue-100 text-blue-800',
  B2: 'bg-purple-100 text-purple-800',
  C1: 'bg-orange-100 text-orange-800',
};

const statusLabels: Record<string, string> = {
  draft: 'Bản nháp',
  active: 'Đang hoạt động',
  completed: 'Đã kết thúc',
  archived: 'Đã lưu trữ',
};

export function ClassDetailContainer({ classId }: ClassDetailContainerProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false);
  
  const { data: classData, isLoading, refetch } = useClass(classId);
  const regenerateCode = useRegenerateInviteCode();

  const handleCopyInviteCode = async () => {
    if (!classData) return;
    await navigator.clipboard.writeText(classData.inviteCode);
    toast.success('Đã sao chép mã mời!');
  };

  const handleCopyInviteLink = async () => {
    if (!classData) return;
    const link = `${window.location.origin}/join-class?code=${classData.inviteCode}`;
    await navigator.clipboard.writeText(link);
    toast.success('Đã sao chép link mời!');
  };

  const handleRegenerateCode = async () => {
    try {
      await regenerateCode.mutateAsync(classId);
      toast.success('Đã tạo mã mời mới!');
      refetch();
    } catch (error) {
      toast.error('Không thể tạo mã mời mới');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[200px]" />
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Không tìm thấy lớp học</h2>
        <Link href="/teacher/classes">
          <Button variant="outline">Quay lại danh sách</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Link
              href="/teacher/classes"
              className="flex items-center gap-1 hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Lớp học
            </Link>
            <span>/</span>
            <span>{classData.name}</span>
          </div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            {classData.name}
            <Badge className={cn('text-sm', levelColors[classData.level])}>
              {classData.level}
            </Badge>
            <Badge variant="outline">{statusLabels[classData.status]}</Badge>
          </h1>
          {classData.description && (
            <p className="text-muted-foreground max-w-2xl">
              {classData.description}
            </p>
          )}
        </div>

        <Button
          variant="outline"
          onClick={() => setShowEditModal(true)}
        >
          <Settings className="h-4 w-4 mr-2" />
          Chỉnh sửa
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Học viên
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {classData.stats?.totalStudents || 0}
              <span className="text-muted-foreground text-sm font-normal">
                /{classData.maxStudents || '∞'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bài tập
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {classData.stats?.totalAssignments || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Điểm trung bình
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {classData.stats?.averageScore?.toFixed(1) || '-'}
            </div>
          </CardContent>
        </Card>

        {/* Invite Code Card */}
        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center justify-between">
              Mã mời học viên
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-purple-600"
                onClick={handleRegenerateCode}
                disabled={regenerateCode.isPending}
              >
                <RefreshCw className={cn("h-4 w-4", regenerateCode.isPending && "animate-spin")} />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-mono font-bold text-purple-900">
                {classData.inviteCode}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-purple-600"
                onClick={handleCopyInviteCode}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-purple-600"
                onClick={handleCopyInviteLink}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Tổng quan
          </TabsTrigger>
          <TabsTrigger value="students" className="gap-2">
            <Users className="h-4 w-4" />
            Học viên ({classData.stats?.totalStudents || 0})
          </TabsTrigger>
          <TabsTrigger value="materials" className="gap-2">
            <FileText className="h-4 w-4" />
            Tài liệu
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <ClassAnalyticsTab classId={classId} />
        </TabsContent>

        <TabsContent value="students" className="mt-6">
          <ClassStudentsTab classId={classId} />
        </TabsContent>

        <TabsContent value="materials" className="mt-6">
          <ClassMaterialsTab classId={classId} />
        </TabsContent>
      </Tabs>

      {/* Edit Modal */}
      <EditClassModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        classData={classData}
        onSuccess={refetch}
      />
    </div>
  );
}
```

### 3. components/teacher/classes/ClassStudentsTab.tsx

```tsx
'use client';

import { useState } from 'react';
import { UserPlus, Search, MoreVertical, Mail, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { AddStudentsModal } from './AddStudentsModal';
import { useClassStudents, useRemoveStudent } from '@/features/teacher/classes/useClassStudents';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ClassStudentsTabProps {
  classId: string;
}

export function ClassStudentsTab({ classId }: ClassStudentsTabProps) {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const { data, isLoading, refetch } = useClassStudents(classId);
  const removeStudent = useRemoveStudent();

  const filteredStudents = data?.students.filter((s) =>
    s.studentName.toLowerCase().includes(search.toLowerCase()) ||
    s.studentEmail.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleRemoveStudent = async (studentId: string, studentName: string) => {
    if (!confirm(`Bạn có chắc muốn xóa ${studentName} khỏi lớp?`)) return;

    try {
      await removeStudent.mutateAsync({ classId, studentId });
      toast.success('Đã xóa học viên khỏi lớp');
      refetch();
    } catch (error) {
      toast.error('Không thể xóa học viên');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-sm" />
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm học viên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Thêm học viên
        </Button>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>{data?.total || 0} học viên</span>
        <span>•</span>
        <span>{data?.activeCount || 0} đang hoạt động</span>
      </div>

      {/* Table */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium mb-2">
            {search ? 'Không tìm thấy học viên' : 'Chưa có học viên nào'}
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            {search
              ? 'Thử tìm kiếm với từ khóa khác'
              : 'Thêm học viên hoặc chia sẻ mã mời để họ tham gia lớp'}
          </p>
          {!search && (
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Thêm học viên
            </Button>
          )}
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Học viên</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tham gia</TableHead>
                <TableHead>Hoạt động gần nhất</TableHead>
                <TableHead className="text-right">Điểm TB</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={student.studentAvatar} />
                        <AvatarFallback>
                          {student.studentName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{student.studentName}</div>
                        <div className="text-sm text-muted-foreground">
                          {student.studentEmail}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={student.status === 'active' ? 'default' : 'secondary'}
                    >
                      {student.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(student.enrolledAt), {
                      addSuffix: true,
                      locale: vi,
                    })}
                  </TableCell>
                  <TableCell>
                    {student.progress?.lastActivityAt
                      ? formatDistanceToNow(new Date(student.progress.lastActivityAt), {
                          addSuffix: true,
                          locale: vi,
                        })
                      : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {student.progress?.averageScore?.toFixed(1) || '-'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          Gửi email
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() =>
                            handleRemoveStudent(student.studentId, student.studentName)
                          }
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Xóa khỏi lớp
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Modal */}
      <AddStudentsModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        classId={classId}
        onSuccess={refetch}
      />
    </div>
  );
}
```

### 4. features/teacher/classes/useClassStudents.ts

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teacherApi } from '@/services/teacher.api';

export interface StudentProgress {
  totalAssignments: number;
  completedAssignments: number;
  averageScore: number;
  lastActivityAt: Date | null;
}

export interface ClassStudent {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  studentEmail: string;
  status: 'active' | 'inactive' | 'removed';
  enrolledAt: Date;
  progress?: StudentProgress;
}

export interface ClassStudentsResponse {
  students: ClassStudent[];
  total: number;
  activeCount: number;
}

export function useClassStudents(classId: string) {
  return useQuery<ClassStudentsResponse>({
    queryKey: ['class-students', classId],
    queryFn: () => teacherApi.getClassStudents(classId),
    enabled: !!classId,
  });
}

export function useAddStudents() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classId,
      studentIds,
      welcomeMessage,
    }: {
      classId: string;
      studentIds: string[];
      welcomeMessage?: string;
    }) => teacherApi.addStudents(classId, studentIds, welcomeMessage),
    onSuccess: (_, { classId }) => {
      queryClient.invalidateQueries({ queryKey: ['class-students', classId] });
      queryClient.invalidateQueries({ queryKey: ['teacher-class', classId] });
    },
  });
}

export function useRemoveStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classId,
      studentId,
      reason,
    }: {
      classId: string;
      studentId: string;
      reason?: string;
    }) => teacherApi.removeStudent(classId, studentId, reason),
    onSuccess: (_, { classId }) => {
      queryClient.invalidateQueries({ queryKey: ['class-students', classId] });
      queryClient.invalidateQueries({ queryKey: ['teacher-class', classId] });
    },
  });
}
```

---

## ✅ Acceptance Criteria

- [ ] Class detail page loads with data
- [ ] Breadcrumb navigation works
- [ ] Quick stats display correctly
- [ ] Invite code copy/share works
- [ ] Regenerate invite code works
- [ ] Tabs switch correctly
- [ ] Students list with search
- [ ] Add students modal
- [ ] Remove student with confirmation
- [ ] Materials tab shows files
- [ ] Analytics tab shows charts
- [ ] Edit modal pre-fills data

---

## 🎨 Design Notes

- Header with back navigation and badges
- 4-column stats grid
- Purple accent for invite code section
- Table with avatar, status badges
- Empty state with icon and CTA

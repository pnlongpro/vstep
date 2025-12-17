# FE-051: Assignment List Page

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-051 |
| **Phase** | 2 - AI Grading |
| **Sprint** | 13-14 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 5h |
| **Dependencies** | BE-051, FE-044 |

---

## 🎯 Objective

Implement assignment list page for teachers:
- Display assignments in table/grid view
- Filters by skill, level, status
- Search by title
- Quick actions (edit, publish, delete)
- Create button opens modal

---

## ⚠️ QUAN TRỌNG: Existing Files Warning

### Các file UI Template đã tồn tại (CHỈ THAM KHẢO):
```
UI-Template/
├── components/
│   ├── AssignmentsPage.tsx        # Student assignments page
│   └── TeacherAssignments.tsx     # Teacher assignments (if exists)
├── data/
│   └── assignmentsData.ts         # Mock data
```

### Hướng dẫn:
- **THAM KHẢO** `AssignmentsPage.tsx` cho data structure
- **TẠO MỚI** tất cả components trong `FE/src/features/teacher/assignments/`
- **KHÔNG** import trực tiếp từ UI-Template
- **SỬ DỤNG** Teacher theme (purple)

---

## 📝 Implementation

### 1. types.ts

```typescript
export enum AssignmentSkill {
  READING = 'reading',
  LISTENING = 'listening',
  WRITING = 'writing',
  SPEAKING = 'speaking',
  MIXED = 'mixed',
}

export enum AssignmentLevel {
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
}

export enum AssignmentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CLOSED = 'closed',
}

export interface Assignment {
  id: string;
  classId: string;
  title: string;
  description?: string;
  skill: AssignmentSkill;
  level: AssignmentLevel;
  dueDate: string;
  timeLimit?: number;
  maxAttempts: number;
  status: AssignmentStatus;
  questionCount: number;
  submissionCount: number;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
  };
  class: {
    id: string;
    name: string;
  };
}

export interface AssignmentQuery {
  page?: number;
  limit?: number;
  skill?: AssignmentSkill;
  level?: AssignmentLevel;
  status?: AssignmentStatus;
  search?: string;
  sortBy?: 'dueDate' | 'createdAt' | 'title';
  sortOrder?: 'ASC' | 'DESC';
}
```

### 2. hooks/useAssignments.ts

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assignmentService } from '@/services/assignmentService';
import { Assignment, AssignmentQuery } from '../types';

export const useAssignments = (classId: string, query: AssignmentQuery) => {
  return useQuery({
    queryKey: ['assignments', classId, query],
    queryFn: () => assignmentService.getAssignments(classId, query),
    enabled: !!classId,
  });
};

export const useAssignment = (id: string) => {
  return useQuery({
    queryKey: ['assignment', id],
    queryFn: () => assignmentService.getAssignment(id),
    enabled: !!id,
  });
};

export const useCreateAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, data }: { classId: string; data: any }) =>
      assignmentService.createAssignment(classId, data),
    onSuccess: (_, { classId }) => {
      queryClient.invalidateQueries({ queryKey: ['assignments', classId] });
    },
  });
};

export const useUpdateAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      assignmentService.updateAssignment(id, data),
    onSuccess: (assignment) => {
      queryClient.invalidateQueries({ 
        queryKey: ['assignments', assignment.classId] 
      });
      queryClient.invalidateQueries({ queryKey: ['assignment', assignment.id] });
    },
  });
};

export const usePublishAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assignmentService.publishAssignment(id),
    onSuccess: (assignment) => {
      queryClient.invalidateQueries({ 
        queryKey: ['assignments', assignment.classId] 
      });
    },
  });
};

export const useCloseAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assignmentService.closeAssignment(id),
    onSuccess: (assignment) => {
      queryClient.invalidateQueries({ 
        queryKey: ['assignments', assignment.classId] 
      });
    },
  });
};

export const useDeleteAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assignmentService.deleteAssignment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });
};
```

### 3. components/AssignmentListContainer.tsx

```tsx
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Plus, FileText, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAssignments } from '../hooks/useAssignments';
import { AssignmentTable } from './AssignmentTable';
import { CreateAssignmentModal } from './CreateAssignmentModal';
import { AssignmentSkill, AssignmentLevel, AssignmentStatus, AssignmentQuery } from '../types';

export function AssignmentListContainer() {
  const params = useParams();
  const classId = params.classId as string;

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [query, setQuery] = useState<AssignmentQuery>({
    page: 1,
    limit: 10,
    sortBy: 'dueDate',
    sortOrder: 'ASC',
  });

  const { data, isLoading } = useAssignments(classId, query);

  const handleFilterChange = (key: keyof AssignmentQuery, value: string) => {
    setQuery((prev) => ({
      ...prev,
      [key]: value === 'all' ? undefined : value,
      page: 1,
    }));
  };

  const handleSearch = (search: string) => {
    setQuery((prev) => ({ ...prev, search, page: 1 }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bài tập</h1>
          <p className="text-gray-500 mt-1">
            Quản lý bài tập giao cho học viên
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tạo bài tập
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Input
            placeholder="Tìm kiếm bài tập..."
            value={query.search || ''}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>

        {/* Skill Filter */}
        <Select
          value={query.skill || 'all'}
          onValueChange={(v) => handleFilterChange('skill', v)}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Kỹ năng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value={AssignmentSkill.READING}>Reading</SelectItem>
            <SelectItem value={AssignmentSkill.LISTENING}>Listening</SelectItem>
            <SelectItem value={AssignmentSkill.WRITING}>Writing</SelectItem>
            <SelectItem value={AssignmentSkill.SPEAKING}>Speaking</SelectItem>
            <SelectItem value={AssignmentSkill.MIXED}>Tổng hợp</SelectItem>
          </SelectContent>
        </Select>

        {/* Level Filter */}
        <Select
          value={query.level || 'all'}
          onValueChange={(v) => handleFilterChange('level', v)}
        >
          <SelectTrigger className="w-28">
            <SelectValue placeholder="Trình độ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value={AssignmentLevel.A2}>A2</SelectItem>
            <SelectItem value={AssignmentLevel.B1}>B1</SelectItem>
            <SelectItem value={AssignmentLevel.B2}>B2</SelectItem>
            <SelectItem value={AssignmentLevel.C1}>C1</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={query.status || 'all'}
          onValueChange={(v) => handleFilterChange('status', v)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value={AssignmentStatus.DRAFT}>Nháp</SelectItem>
            <SelectItem value={AssignmentStatus.PUBLISHED}>Đang mở</SelectItem>
            <SelectItem value={AssignmentStatus.CLOSED}>Đã đóng</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <AssignmentTable
        data={data?.items || []}
        isLoading={isLoading}
        pagination={{
          page: query.page || 1,
          limit: query.limit || 10,
          total: data?.total || 0,
          totalPages: data?.totalPages || 0,
        }}
        onPageChange={(page) => setQuery((prev) => ({ ...prev, page }))}
        onSort={(sortBy, sortOrder) =>
          setQuery((prev) => ({ ...prev, sortBy, sortOrder }))
        }
      />

      {/* Create Modal */}
      <CreateAssignmentModal
        classId={classId}
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}
```

### 4. components/AssignmentTable.tsx

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  PlayCircle,
  XCircle,
  FileCheck,
} from 'lucide-react';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
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
import { usePublishAssignment, useCloseAssignment, useDeleteAssignment } from '../hooks/useAssignments';
import { Assignment, AssignmentStatus } from '../types';
import { toast } from 'sonner';

interface Props {
  data: Assignment[];
  isLoading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onSort: (sortBy: string, sortOrder: 'ASC' | 'DESC') => void;
}

const skillLabels: Record<string, string> = {
  reading: 'Reading',
  listening: 'Listening',
  writing: 'Writing',
  speaking: 'Speaking',
  mixed: 'Tổng hợp',
};

const statusConfig: Record<AssignmentStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
  [AssignmentStatus.DRAFT]: { label: 'Nháp', variant: 'secondary' },
  [AssignmentStatus.PUBLISHED]: { label: 'Đang mở', variant: 'default' },
  [AssignmentStatus.CLOSED]: { label: 'Đã đóng', variant: 'destructive' },
};

export function AssignmentTable({ data, isLoading, pagination, onPageChange }: Props) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const publishMutation = usePublishAssignment();
  const closeMutation = useCloseAssignment();
  const deleteMutation = useDeleteAssignment();

  const handlePublish = async (id: string) => {
    try {
      await publishMutation.mutateAsync(id);
      toast.success('Đã phát hành bài tập');
    } catch (error: any) {
      toast.error(error.message || 'Không thể phát hành');
    }
  };

  const handleClose = async (id: string) => {
    try {
      await closeMutation.mutateAsync(id);
      toast.success('Đã đóng bài tập');
    } catch (error: any) {
      toast.error(error.message || 'Không thể đóng');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success('Đã xóa bài tập');
      setDeleteId(null);
    } catch (error: any) {
      toast.error(error.message || 'Không thể xóa');
    }
  };

  if (isLoading) {
    return (
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Kỹ năng</TableHead>
              <TableHead>Trình độ</TableHead>
              <TableHead>Hạn nộp</TableHead>
              <TableHead>Nộp bài</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-8 w-8" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="border rounded-lg p-12 text-center">
        <FileCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Chưa có bài tập</h3>
        <p className="text-gray-500 mt-1">
          Tạo bài tập đầu tiên để giao cho học viên
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">Tiêu đề</TableHead>
              <TableHead>Kỹ năng</TableHead>
              <TableHead>Trình độ</TableHead>
              <TableHead>Hạn nộp</TableHead>
              <TableHead>Nộp bài</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((assignment) => {
              const isOverdue = new Date(assignment.dueDate) < new Date();
              const config = statusConfig[assignment.status];

              return (
                <TableRow
                  key={assignment.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => router.push(`/teacher/assignments/${assignment.id}`)}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{assignment.title}</p>
                      <p className="text-sm text-gray-500">
                        {assignment.questionCount} câu hỏi
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {skillLabels[assignment.skill]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{assignment.level}</span>
                  </TableCell>
                  <TableCell>
                    <div className={isOverdue && assignment.status === 'published' ? 'text-red-600' : ''}>
                      {format(new Date(assignment.dueDate), 'dd/MM/yyyy HH:mm', { locale: vi })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{assignment.submissionCount}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={config.variant}>
                      {config.label}
                    </Badge>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/teacher/assignments/${assignment.id}`)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Xem chi tiết
                        </DropdownMenuItem>

                        {assignment.status === 'draft' && (
                          <>
                            <DropdownMenuItem
                              onClick={() => router.push(`/teacher/assignments/${assignment.id}/edit`)}
                            >
                              <Pencil className="w-4 h-4 mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handlePublish(assignment.id)}
                              className="text-green-600"
                            >
                              <PlayCircle className="w-4 h-4 mr-2" />
                              Phát hành
                            </DropdownMenuItem>
                          </>
                        )}

                        {assignment.status === 'published' && (
                          <DropdownMenuItem
                            onClick={() => handleClose(assignment.id)}
                            className="text-orange-600"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Đóng bài tập
                          </DropdownMenuItem>
                        )}

                        {assignment.status === 'draft' && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteId(assignment.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Xóa
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
                className={pagination.page <= 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => onPageChange(page)}
                  isActive={page === pagination.page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(Math.min(pagination.totalPages, pagination.page + 1))}
                className={pagination.page >= pagination.totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa bài tập?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Bài tập sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
```

---

## ✅ Acceptance Criteria

- [ ] Table hiển thị assignments với đầy đủ thông tin
- [ ] Filter theo skill, level, status hoạt động
- [ ] Search by title hoạt động
- [ ] Pagination hoạt động
- [ ] Quick actions: View, Edit, Publish, Close, Delete
- [ ] Publish confirmation hoạt động
- [ ] Delete confirmation dialog
- [ ] Loading skeleton
- [ ] Empty state
- [ ] Overdue indicator (đỏ)

---

## 🧪 Test Cases

```typescript
describe('AssignmentListContainer', () => {
  it('renders table with assignments', () => {
    // Mock data
    // Verify rows rendered
  });

  it('filters by skill', async () => {
    // Select reading
    // Verify API called with skill=reading
  });

  it('publishes draft assignment', async () => {
    // Click publish
    // Verify API called
    // Verify toast success
  });

  it('confirms before delete', async () => {
    // Click delete
    // Verify dialog shown
    // Confirm
    // Verify deleted
  });
});
```

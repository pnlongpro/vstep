# FE-045: Class List Page

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-045 |
| **Phase** | 2 - AI Grading |
| **Sprint** | 11-12 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 5h |
| **Dependencies** | FE-044, BE-045 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Existing UI Template files:**
> - `UI-Template/components/TeacherDashboard.tsx` - ✅ Có UI mẫu
> - `UI-Template/data/classManagementData.ts` - ✅ Có mock data

**Action:**
- ✅ CREATE `app/(teacher)/classes/page.tsx`
- ✅ CREATE `components/teacher/classes/ClassCard.tsx`
- ✅ CREATE `features/teacher/classes/` - hooks & services
- ✅ REFER UI-Template để lấy design pattern
- ❌ KHÔNG import trực tiếp từ UI-Template

---

## 🎯 Objective

Create Class List page for teachers:
- Display all classes as cards or table
- Filter by level, status
- Search by name
- Create new class modal
- Pagination

---

## 📝 Implementation

### 1. app/(teacher)/classes/page.tsx

```tsx
import { Metadata } from 'next';
import { ClassListContainer } from '@/features/teacher/classes/ClassListContainer';

export const metadata: Metadata = {
  title: 'Quản lý lớp học | VSTEPRO Teacher',
};

export default function ClassesPage() {
  return <ClassListContainer />;
}
```

### 2. features/teacher/classes/ClassListContainer.tsx

```tsx
'use client';

import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ClassCard } from '@/components/teacher/classes/ClassCard';
import { CreateClassModal } from '@/components/teacher/classes/CreateClassModal';
import { useClasses, ClassLevel, ClassStatus } from './useClasses';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export function ClassListContainer() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState<ClassLevel | 'all'>('all');
  const [status, setStatus] = useState<ClassStatus | 'all'>('all');
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useClasses({
    search: search || undefined,
    level: level === 'all' ? undefined : level,
    status: status === 'all' ? undefined : status,
    page,
    limit: 9,
  });

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    refetch();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Lớp học của tôi</h1>
          <p className="text-muted-foreground">
            Quản lý các lớp học và học viên
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tạo lớp mới
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm lớp học..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={level} onValueChange={(v) => setLevel(v as any)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Cấp độ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả level</SelectItem>
            <SelectItem value="A2">A2</SelectItem>
            <SelectItem value="B1">B1</SelectItem>
            <SelectItem value="B2">B2</SelectItem>
            <SelectItem value="C1">C1</SelectItem>
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={(v) => setStatus(v as any)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="draft">Bản nháp</SelectItem>
            <SelectItem value="active">Đang hoạt động</SelectItem>
            <SelectItem value="completed">Đã kết thúc</SelectItem>
            <SelectItem value="archived">Đã lưu trữ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      {data && (
        <div className="text-sm text-muted-foreground">
          Hiển thị {data.items.length} / {data.total} lớp học
        </div>
      )}

      {/* Class Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[200px] rounded-lg" />
          ))}
        </div>
      ) : data?.items.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium mb-2">Chưa có lớp học nào</h3>
          <p className="text-muted-foreground mb-4">
            Tạo lớp học đầu tiên để bắt đầu quản lý học viên
          </p>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tạo lớp mới
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.items.map((classItem) => (
              <ClassCard
                key={classItem.id}
                classData={classItem}
                onUpdate={refetch}
              />
            ))}
          </div>

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      onClick={() => setPage(p)}
                      isActive={page === p}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                    className={page === data.totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

      {/* Create Modal */}
      <CreateClassModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
```

### 3. components/teacher/classes/ClassCard.tsx

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Calendar, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Copy,
  Eye,
  Archive,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { ClassResponse, ClassStatus } from '@/features/teacher/classes/useClasses';
import { cn } from '@/lib/utils';

interface ClassCardProps {
  classData: ClassResponse;
  onUpdate: () => void;
}

const statusConfig: Record<ClassStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  draft: { label: 'Bản nháp', variant: 'secondary' },
  active: { label: 'Đang hoạt động', variant: 'default' },
  completed: { label: 'Đã kết thúc', variant: 'outline' },
  archived: { label: 'Đã lưu trữ', variant: 'destructive' },
};

const levelColors: Record<string, string> = {
  A2: 'bg-green-100 text-green-800',
  B1: 'bg-blue-100 text-blue-800',
  B2: 'bg-purple-100 text-purple-800',
  C1: 'bg-orange-100 text-orange-800',
};

export function ClassCard({ classData, onUpdate }: ClassCardProps) {
  const copyInviteCode = async () => {
    await navigator.clipboard.writeText(classData.inviteCode);
    toast.success('Đã sao chép mã mời!');
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Chưa đặt';
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const status = statusConfig[classData.status];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <Link
              href={`/teacher/classes/${classData.id}`}
              className="font-semibold hover:text-purple-600 transition-colors line-clamp-1"
            >
              {classData.name}
            </Link>
            <div className="flex items-center gap-2">
              <Badge className={cn('text-xs', levelColors[classData.level])}>
                {classData.level}
              </Badge>
              <Badge variant={status.variant} className="text-xs">
                {status.label}
              </Badge>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/teacher/classes/${classData.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Xem chi tiết
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/teacher/classes/${classData.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={copyInviteCode}>
                <Copy className="h-4 w-4 mr-2" />
                Sao chép mã mời
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-orange-600">
                <Archive className="h-4 w-4 mr-2" />
                Lưu trữ
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa lớp
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {classData.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {classData.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {classData.stats?.totalStudents || 0}/{classData.maxStudents || '∞'} học viên
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(classData.startDate)}</span>
          </div>
        </div>

        {/* Invite Code */}
        <div className="flex items-center justify-between bg-purple-50 rounded-lg px-3 py-2">
          <div>
            <div className="text-xs text-purple-600 font-medium">Mã mời</div>
            <div className="font-mono font-bold text-purple-900">
              {classData.inviteCode}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyInviteCode}
            className="h-8 w-8 text-purple-600 hover:text-purple-700"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick Stats */}
        {classData.stats && (
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="font-semibold text-gray-900">
                {classData.stats.totalAssignments}
              </div>
              <div className="text-muted-foreground">Bài tập</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="font-semibold text-gray-900">
                {classData.stats.activeStudents}
              </div>
              <div className="text-muted-foreground">Hoạt động</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="font-semibold text-gray-900">
                {classData.stats.averageScore.toFixed(1)}
              </div>
              <div className="text-muted-foreground">Điểm TB</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

### 4. features/teacher/classes/useClasses.ts

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teacherApi } from '@/services/teacher.api';

export type ClassLevel = 'A2' | 'B1' | 'B2' | 'C1';
export type ClassStatus = 'draft' | 'active' | 'completed' | 'archived';

export interface ClassStats {
  totalStudents: number;
  activeStudents: number;
  totalAssignments: number;
  completedAssignments: number;
  averageScore: number;
}

export interface ClassResponse {
  id: string;
  name: string;
  description?: string;
  level: ClassLevel;
  status: ClassStatus;
  startDate: Date | null;
  endDate: Date | null;
  maxStudents: number;
  inviteCode: string;
  teacher: {
    id: string;
    name: string;
    avatar?: string;
  };
  stats?: ClassStats;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClassListResponse {
  items: ClassResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ClassQueryParams {
  level?: ClassLevel;
  status?: ClassStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateClassDto {
  name: string;
  description?: string;
  level: ClassLevel;
  startDate?: string;
  endDate?: string;
  maxStudents?: number;
}

// Query hook
export function useClasses(params: ClassQueryParams = {}) {
  return useQuery<ClassListResponse>({
    queryKey: ['teacher-classes', params],
    queryFn: () => teacherApi.getClasses(params),
  });
}

// Single class query
export function useClass(classId: string) {
  return useQuery<ClassResponse>({
    queryKey: ['teacher-class', classId],
    queryFn: () => teacherApi.getClass(classId),
    enabled: !!classId,
  });
}

// Create mutation
export function useCreateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateClassDto) => teacherApi.createClass(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-classes'] });
    },
  });
}

// Update mutation
export function useUpdateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<CreateClassDto> }) =>
      teacherApi.updateClass(id, dto),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['teacher-classes'] });
      queryClient.invalidateQueries({ queryKey: ['teacher-class', id] });
    },
  });
}

// Delete mutation
export function useDeleteClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => teacherApi.deleteClass(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-classes'] });
    },
  });
}

// Regenerate invite code
export function useRegenerateInviteCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (classId: string) => teacherApi.regenerateInviteCode(classId),
    onSuccess: (_, classId) => {
      queryClient.invalidateQueries({ queryKey: ['teacher-class', classId] });
    },
  });
}
```

### 5. services/teacher.api.ts

```typescript
import { apiClient } from '@/lib/api-client';
import type {
  ClassResponse,
  ClassListResponse,
  ClassQueryParams,
  CreateClassDto,
} from '@/features/teacher/classes/useClasses';

export const teacherApi = {
  // Classes
  getClasses: async (params: ClassQueryParams): Promise<ClassListResponse> => {
    const { data } = await apiClient.get('/classes', { params });
    return data;
  },

  getClass: async (id: string): Promise<ClassResponse> => {
    const { data } = await apiClient.get(`/classes/${id}`);
    return data;
  },

  createClass: async (dto: CreateClassDto): Promise<ClassResponse> => {
    const { data } = await apiClient.post('/classes', dto);
    return data;
  },

  updateClass: async (id: string, dto: Partial<CreateClassDto>): Promise<ClassResponse> => {
    const { data } = await apiClient.put(`/classes/${id}`, dto);
    return data;
  },

  deleteClass: async (id: string): Promise<void> => {
    await apiClient.delete(`/classes/${id}`);
  },

  regenerateInviteCode: async (classId: string): Promise<{ inviteCode: string }> => {
    const { data } = await apiClient.post(`/classes/${classId}/regenerate-code`);
    return data;
  },
};
```

---

## ✅ Acceptance Criteria

- [ ] Display classes in grid layout
- [ ] Filter by level (A2/B1/B2/C1)
- [ ] Filter by status (draft/active/completed/archived)
- [ ] Search by name
- [ ] Pagination works correctly
- [ ] Create class modal opens/closes
- [ ] Class card shows all info
- [ ] Copy invite code works
- [ ] Dropdown menu actions work
- [ ] Empty state displays correctly
- [ ] Loading skeleton shows

---

## 🎨 Design Reference

![Class List Layout](reference-class-list.png)

- Use purple accent colors for teacher theme
- Card hover effect with shadow
- Level badge with color coding
- Status badge with appropriate variant
- Invite code highlighted section

# FE-059: Exam Management UI

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-059 |
| **Phase** | 3 - Enterprise |
| **Sprint** | 15-16 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 6h |
| **Dependencies** | BE-056, FE-057 |

---

## 🎯 Objective

Implement admin exam management interface:
- Exam set list with filters
- Create/Edit exam set form
- Section management
- Question bank browser
- Bulk import questions
- Publish/Unpublish actions

---

## ⚠️ QUAN TRỌNG: Existing Files Warning

### Các file UI Template đã tồn tại (CHỈ THAM KHẢO):
```
UI-Template/
├── components/
│   └── AdminDashboard.tsx         # Contains exam stats
├── data/
│   └── exams.ts                   # Sample exam data
```

### Hướng dẫn:
- **TẠO MỚI** trong `FE/src/features/admin/exams/`
- Follow admin color scheme (red-600 primary)

---

## 📝 Implementation

### 1. hooks/useAdminExams.ts

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminExamService } from '@/services/adminExamService';

export interface ExamQueryParams {
  search?: string;
  level?: 'A2' | 'B1' | 'B2' | 'C1';
  isPublished?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export const useAdminExamSets = (params: ExamQueryParams) => {
  return useQuery({
    queryKey: ['admin-exam-sets', params],
    queryFn: () => adminExamService.getExamSets(params),
    keepPreviousData: true,
  });
};

export const useAdminExamSet = (id: string) => {
  return useQuery({
    queryKey: ['admin-exam-set', id],
    queryFn: () => adminExamService.getExamSet(id),
    enabled: !!id,
  });
};

export const useExamStats = () => {
  return useQuery({
    queryKey: ['admin-exam-stats'],
    queryFn: () => adminExamService.getStats(),
  });
};

export const useCreateExamSet = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => adminExamService.createExamSet(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-exam-sets'] });
    },
  });
};

export const useUpdateExamSet = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminExamService.updateExamSet(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-exam-sets'] });
      queryClient.invalidateQueries({ queryKey: ['admin-exam-set', id] });
    },
  });
};

export const usePublishExamSet = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => adminExamService.publishExamSet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-exam-sets'] });
    },
  });
};

export const useUnpublishExamSet = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => adminExamService.unpublishExamSet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-exam-sets'] });
    },
  });
};

export const useCloneExamSet = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => adminExamService.cloneExamSet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-exam-sets'] });
    },
  });
};

export const useDeleteExamSet = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => adminExamService.deleteExamSet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-exam-sets'] });
    },
  });
};

// Question hooks
export const useAdminQuestions = (params: any) => {
  return useQuery({
    queryKey: ['admin-questions', params],
    queryFn: () => adminExamService.getQuestions(params),
    keepPreviousData: true,
  });
};

export const useBulkImportQuestions = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => adminExamService.bulkImportQuestions(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-questions'] });
    },
  });
};
```

### 2. components/ExamListContainer.tsx

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit2,
  Copy,
  Upload,
  Download,
  Trash2,
  Globe,
  GlobeLock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useAdminExamSets,
  useExamStats,
  usePublishExamSet,
  useUnpublishExamSet,
  useCloneExamSet,
  useDeleteExamSet,
  ExamQueryParams,
} from '../hooks/useAdminExams';
import { formatDate } from '@/utils/date';
import { toast } from 'sonner';

const LEVELS = ['A2', 'B1', 'B2', 'C1'];

export function ExamListContainer() {
  const router = useRouter();
  const [params, setParams] = useState<ExamQueryParams>({
    page: 1,
    limit: 20,
  });
  const [searchInput, setSearchInput] = useState('');

  const { data: examSets, isLoading } = useAdminExamSets(params);
  const { data: stats } = useExamStats();

  const publishMutation = usePublishExamSet();
  const unpublishMutation = useUnpublishExamSet();
  const cloneMutation = useCloneExamSet();
  const deleteMutation = useDeleteExamSet();

  const handleSearch = () => {
    setParams((prev) => ({ ...prev, search: searchInput, page: 1 }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setParams((prev) => ({
      ...prev,
      [key]: value === 'all' ? undefined : value,
      page: 1,
    }));
  };

  const handlePublish = async (id: string) => {
    try {
      await publishMutation.mutateAsync(id);
      toast.success('Đã xuất bản đề thi');
    } catch (error: any) {
      toast.error(error.message || 'Không thể xuất bản');
    }
  };

  const handleUnpublish = async (id: string) => {
    try {
      await unpublishMutation.mutateAsync(id);
      toast.success('Đã ẩn đề thi');
    } catch (error: any) {
      toast.error(error.message || 'Không thể ẩn');
    }
  };

  const handleClone = async (id: string) => {
    try {
      await cloneMutation.mutateAsync(id);
      toast.success('Đã nhân bản đề thi');
    } catch (error: any) {
      toast.error(error.message || 'Không thể nhân bản');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa đề thi này?')) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Đã xóa đề thi');
    } catch (error: any) {
      toast.error(error.message || 'Không thể xóa');
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          icon={FileText}
          label="Tổng đề thi"
          value={stats?.total || 0}
          color="blue"
        />
        <StatCard
          icon={CheckCircle}
          label="Đã xuất bản"
          value={stats?.published || 0}
          color="green"
        />
        <StatCard
          icon={AlertCircle}
          label="Bản nháp"
          value={stats?.draft || 0}
          color="yellow"
        />
        <StatCard
          icon={BookOpen}
          label="Tổng câu hỏi"
          value={stats?.totalQuestions || 0}
          color="purple"
        />
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Quản lý đề thi</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => router.push('/admin/exams/new')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Tạo đề mới
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm theo tên đề thi..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>

            <Select
              value={params.level || 'all'}
              onValueChange={(v) => handleFilterChange('level', v)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={
                params.isPublished === undefined
                  ? 'all'
                  : params.isPublished
                  ? 'published'
                  : 'draft'
              }
              onValueChange={(v) =>
                handleFilterChange(
                  'isPublished',
                  v === 'all' ? 'all' : v === 'published' ? 'true' : 'false'
                )
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="published">Đã xuất bản</SelectItem>
                <SelectItem value="draft">Bản nháp</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleSearch}>
              <Filter className="w-4 h-4 mr-2" />
              Lọc
            </Button>
          </div>

          {/* Table */}
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên đề thi</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Sections</TableHead>
                  <TableHead>Câu hỏi</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Cập nhật</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {examSets?.items.map((exam: any) => (
                  <TableRow key={exam.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{exam.title}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {exam.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getLevelColor(exam.level)}>
                        {exam.level}
                      </Badge>
                    </TableCell>
                    <TableCell>{exam.sections?.length || 0}</TableCell>
                    <TableCell>{exam.questionCount || 0}</TableCell>
                    <TableCell>
                      <Badge
                        variant={exam.isPublished ? 'secondary' : 'outline'}
                        className={
                          exam.isPublished
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }
                      >
                        {exam.isPublished ? 'Đã xuất bản' : 'Bản nháp'}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(exam.updatedAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/admin/exams/${exam.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push(`/admin/exams/${exam.id}/edit`)}
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleClone(exam.id)}>
                            <Copy className="w-4 h-4 mr-2" />
                            Nhân bản
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {exam.isPublished ? (
                            <DropdownMenuItem
                              className="text-yellow-600"
                              onClick={() => handleUnpublish(exam.id)}
                            >
                              <GlobeLock className="w-4 h-4 mr-2" />
                              Ẩn đề thi
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="text-green-600"
                              onClick={() => handlePublish(exam.id)}
                            >
                              <Globe className="w-4 h-4 mr-2" />
                              Xuất bản
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(exam.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">
              Hiển thị {examSets?.items.length || 0} / {examSets?.total || 0} đề thi
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={params.page === 1}
                onClick={() => setParams((prev) => ({ ...prev, page: prev.page! - 1 }))}
              >
                Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={params.page === examSets?.totalPages}
                onClick={() => setParams((prev) => ({ ...prev, page: prev.page! + 1 }))}
              >
                Sau
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper components
function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: number;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold">{value.toLocaleString()}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getLevelColor(level: string) {
  const colors: Record<string, string> = {
    A2: 'border-green-300 text-green-600',
    B1: 'border-blue-300 text-blue-600',
    B2: 'border-purple-300 text-purple-600',
    C1: 'border-red-300 text-red-600',
  };
  return colors[level] || 'border-gray-300 text-gray-600';
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-16" />
      ))}
    </div>
  );
}
```

### 3. components/ExamFormContainer.tsx

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Save,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { toast } from 'sonner';
import {
  useAdminExamSet,
  useCreateExamSet,
  useUpdateExamSet,
} from '../hooks/useAdminExams';
import { SectionForm } from './SectionForm';

const SKILL_TYPES = ['reading', 'listening', 'writing', 'speaking'] as const;
const LEVELS = ['A2', 'B1', 'B2', 'C1'] as const;

const examSchema = z.object({
  title: z.string().min(1, 'Vui lòng nhập tên đề thi'),
  description: z.string().optional(),
  level: z.enum(LEVELS),
  duration: z.number().min(1, 'Thời gian phải > 0'),
  sections: z.array(
    z.object({
      skill: z.enum(SKILL_TYPES),
      title: z.string().min(1, 'Vui lòng nhập tên section'),
      duration: z.number().min(1),
      orderIndex: z.number(),
      passage: z.string().optional(),
      audioUrl: z.string().optional(),
    })
  ),
});

type ExamFormData = z.infer<typeof examSchema>;

export function ExamFormContainer() {
  const router = useRouter();
  const params = useParams();
  const isEdit = !!params.id;

  const { data: existingExam } = useAdminExamSet(params.id as string);
  const createMutation = useCreateExamSet();
  const updateMutation = useUpdateExamSet();

  const [expandedSections, setExpandedSections] = useState<number[]>([0]);

  const form = useForm<ExamFormData>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      title: '',
      description: '',
      level: 'B1',
      duration: 120,
      sections: [
        { skill: 'reading', title: 'Reading Section', duration: 30, orderIndex: 0 },
        { skill: 'listening', title: 'Listening Section', duration: 30, orderIndex: 1 },
        { skill: 'writing', title: 'Writing Section', duration: 30, orderIndex: 2 },
        { skill: 'speaking', title: 'Speaking Section', duration: 30, orderIndex: 3 },
      ],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'sections',
  });

  // Load existing data
  useEffect(() => {
    if (existingExam) {
      form.reset({
        title: existingExam.title,
        description: existingExam.description,
        level: existingExam.level,
        duration: existingExam.duration,
        sections: existingExam.sections?.map((s: any, i: number) => ({
          skill: s.skill,
          title: s.title,
          duration: s.duration,
          orderIndex: i,
          passage: s.passage,
          audioUrl: s.audioUrl,
        })),
      });
    }
  }, [existingExam, form]);

  const onSubmit = async (data: ExamFormData) => {
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: params.id as string, data });
        toast.success('Đã cập nhật đề thi');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Đã tạo đề thi mới');
      }
      router.push('/admin/exams');
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra');
    }
  };

  const toggleSection = (index: number) => {
    setExpandedSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Tên đề thi *</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: VSTEP Mock Test 01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả ngắn về đề thi..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Level *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thời gian tổng (phút) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Sections */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Các Section</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    skill: 'reading',
                    title: '',
                    duration: 30,
                    orderIndex: fields.length,
                  })
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm section
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <Collapsible
                key={field.id}
                open={expandedSections.includes(index)}
              >
                <div className="border rounded-lg">
                  <CollapsibleTrigger asChild>
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleSection(index)}
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">
                          Section {index + 1}: {form.watch(`sections.${index}.title`) || 'Chưa đặt tên'}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({form.watch(`sections.${index}.skill`)})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            remove(index);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                        {expandedSections.includes(index) ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-4 pt-0 border-t">
                      <SectionForm form={form} index={index} />
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Hủy
          </Button>
          <Button
            type="submit"
            className="bg-red-600 hover:bg-red-700"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            <Save className="w-4 h-4 mr-2" />
            {isEdit ? 'Cập nhật' : 'Tạo đề thi'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

### 4. components/SectionForm.tsx

```tsx
'use client';

import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const SKILL_TYPES = ['reading', 'listening', 'writing', 'speaking'];

interface Props {
  form: UseFormReturn<any>;
  index: number;
}

export function SectionForm({ form, index }: Props) {
  const skill = form.watch(`sections.${index}.skill`);

  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name={`sections.${index}.title`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tên section *</FormLabel>
            <FormControl>
              <Input placeholder="VD: Reading Passage 1" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`sections.${index}.skill`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Kỹ năng *</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {SKILL_TYPES.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill.charAt(0).toUpperCase() + skill.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`sections.${index}.duration`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Thời gian (phút) *</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Conditional fields based on skill */}
      {(skill === 'reading' || skill === 'writing') && (
        <FormField
          control={form.control}
          name={`sections.${index}.passage`}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>
                {skill === 'reading' ? 'Bài đọc' : 'Đề bài'}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={
                    skill === 'reading'
                      ? 'Nhập nội dung bài đọc...'
                      : 'Nhập yêu cầu đề bài...'
                  }
                  rows={6}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {skill === 'listening' && (
        <FormField
          control={form.control}
          name={`sections.${index}.audioUrl`}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Audio URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
```

---

## ✅ Acceptance Criteria

- [ ] Exam list displays correctly
- [ ] Search and filter work
- [ ] Create new exam set
- [ ] Edit existing exam set
- [ ] Add/remove sections
- [ ] Publish/Unpublish exam
- [ ] Clone exam set
- [ ] Delete exam with confirmation
- [ ] Form validation works
- [ ] Success/error toasts

---

## 🧪 Test Cases

```typescript
describe('ExamListContainer', () => {
  it('filters by level', async () => {
    // Select B2 level
    // Verify filtered results
  });

  it('publishes exam', async () => {
    // Click publish on draft exam
    // Verify status changes
  });

  it('clones exam', async () => {
    // Click clone
    // Verify new exam created
  });
});

describe('ExamFormContainer', () => {
  it('creates new exam', async () => {
    // Fill form
    // Submit
    // Verify created
  });

  it('adds section', async () => {
    // Click add section
    // Verify new section added
  });
});
```

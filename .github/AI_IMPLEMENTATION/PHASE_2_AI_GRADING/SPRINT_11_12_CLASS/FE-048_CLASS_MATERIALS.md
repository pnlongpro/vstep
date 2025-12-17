# FE-048: Class Materials Tab

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-048 |
| **Phase** | 2 - AI Grading |
| **Sprint** | 11-12 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 5h |
| **Dependencies** | FE-047, BE-047 |

---

## 🎯 Objective

Implement Materials management tab in Class Detail:
- Upload materials (drag & drop)
- List materials by category
- Download/preview files
- Delete materials
- Reorder materials

---

## 📝 Implementation

### 1. components/teacher/classes/ClassMaterialsTab.tsx

```tsx
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  FileText,
  Image,
  Music,
  Video,
  MoreVertical,
  Download,
  Trash2,
  Eye,
  Filter,
  Search,
  File,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { UploadMaterialModal } from './UploadMaterialModal';
import { 
  useClassMaterials, 
  useDeleteMaterial,
  MaterialCategory,
} from '@/features/teacher/classes/useClassMaterials';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ClassMaterialsTabProps {
  classId: string;
}

const categoryIcons: Record<MaterialCategory, React.ReactNode> = {
  document: <FileText className="h-5 w-5 text-blue-500" />,
  audio: <Music className="h-5 w-5 text-purple-500" />,
  video: <Video className="h-5 w-5 text-red-500" />,
  image: <Image className="h-5 w-5 text-green-500" />,
  exercise: <File className="h-5 w-5 text-orange-500" />,
  answer_key: <FileText className="h-5 w-5 text-yellow-600" />,
  other: <File className="h-5 w-5 text-gray-500" />,
};

const categoryLabels: Record<MaterialCategory, string> = {
  document: 'Tài liệu',
  audio: 'Audio',
  video: 'Video',
  image: 'Hình ảnh',
  exercise: 'Bài tập',
  answer_key: 'Đáp án',
  other: 'Khác',
};

export function ClassMaterialsTab({ classId }: ClassMaterialsTabProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<MaterialCategory | 'all'>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragFiles, setDragFiles] = useState<File[]>([]);

  const { data, isLoading, refetch } = useClassMaterials(classId, {
    category: category === 'all' ? undefined : category,
    search: search || undefined,
  });

  const deleteMaterial = useDeleteMaterial();

  // Dropzone for drag & drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setDragFiles(acceptedFiles);
      setShowUploadModal(true);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'audio/*': ['.mp3', '.wav', '.ogg'],
      'video/*': ['.mp4', '.webm'],
    },
  });

  const handleDelete = async (materialId: string, title: string) => {
    if (!confirm(`Bạn có chắc muốn xóa "${title}"?`)) return;

    try {
      await deleteMaterial.mutateAsync({ classId, materialId });
      toast.success('Đã xóa tài liệu');
      refetch();
    } catch (error) {
      toast.error('Không thể xóa tài liệu');
    }
  };

  const handleDownload = (downloadUrl: string) => {
    window.open(downloadUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1 max-w-sm" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-[300px]" />
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        'space-y-4 min-h-[400px] relative',
        isDragActive && 'ring-2 ring-purple-500 ring-dashed rounded-lg'
      )}
    >
      <input {...getInputProps()} />

      {/* Drag Overlay */}
      {isDragActive && (
        <div className="absolute inset-0 bg-purple-50/90 rounded-lg z-10 flex items-center justify-center">
          <div className="text-center">
            <Upload className="h-12 w-12 mx-auto text-purple-500 mb-2" />
            <p className="text-lg font-medium text-purple-700">
              Thả file vào đây để upload
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm tài liệu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={category} onValueChange={(v) => setCategory(v as any)}>
          <SelectTrigger className="w-[160px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={() => setShowUploadModal(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload tài liệu
        </Button>
      </div>

      {/* Stats */}
      {data && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{data.total} tài liệu</span>
          <span>•</span>
          <span>Tổng dung lượng: {data.totalSizeFormatted}</span>
        </div>
      )}

      {/* Materials List */}
      {!data?.items.length ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium mb-2">Chưa có tài liệu nào</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Kéo thả file vào đây hoặc click để upload
          </p>
          <Button
            onClick={() => setShowUploadModal(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload tài liệu
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.items.map((material) => (
            <div
              key={material.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {categoryIcons[material.category]}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate" title={material.title}>
                    {material.title}
                  </h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {material.originalFileName}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {categoryLabels[material.category]}
                    </Badge>
                    <span>{material.fileSizeFormatted}</span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDownload(material.downloadUrl)}>
                      <Download className="h-4 w-4 mr-2" />
                      Tải xuống
                    </DropdownMenuItem>
                    {material.mimeType.startsWith('image/') && (
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        Xem trước
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDelete(material.id, material.title)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Download stats */}
              <div className="mt-3 pt-3 border-t text-xs text-muted-foreground flex items-center justify-between">
                <span>{material.downloadCount} lượt tải</span>
                <span>
                  {!material.isVisible && (
                    <Badge variant="secondary" className="text-xs">
                      Ẩn
                    </Badge>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <UploadMaterialModal
        open={showUploadModal}
        onOpenChange={(open) => {
          setShowUploadModal(open);
          if (!open) setDragFiles([]);
        }}
        classId={classId}
        initialFiles={dragFiles}
        onSuccess={() => {
          setDragFiles([]);
          refetch();
        }}
      />
    </div>
  );
}
```

### 2. components/teacher/classes/UploadMaterialModal.tsx

```tsx
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, X, FileText, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { useUploadMaterial, MaterialCategory } from '@/features/teacher/classes/useClassMaterials';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  title: z.string().min(1, 'Vui lòng nhập tiêu đề'),
  description: z.string().optional(),
  category: z.enum(['document', 'audio', 'video', 'image', 'exercise', 'answer_key', 'other']),
  isVisible: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

interface UploadMaterialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: string;
  initialFiles?: File[];
  onSuccess: () => void;
}

export function UploadMaterialModal({
  open,
  onOpenChange,
  classId,
  initialFiles = [],
  onSuccess,
}: UploadMaterialModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadMaterial = useUploadMaterial();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'document',
      isVisible: true,
    },
  });

  // Handle initial files from drag & drop
  useEffect(() => {
    if (initialFiles.length > 0) {
      const firstFile = initialFiles[0];
      setFile(firstFile);
      
      // Auto-detect category from MIME type
      let category: MaterialCategory = 'document';
      if (firstFile.type.startsWith('image/')) category = 'image';
      else if (firstFile.type.startsWith('audio/')) category = 'audio';
      else if (firstFile.type.startsWith('video/')) category = 'video';

      form.setValue('category', category);
      
      // Use filename as default title
      const nameWithoutExt = firstFile.name.replace(/\.[^/.]+$/, '');
      form.setValue('title', nameWithoutExt);
    }
  }, [initialFiles, form]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);

      // Auto-fill title from filename
      const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, '');
      if (!form.getValues('title')) {
        form.setValue('title', nameWithoutExt);
      }

      // Auto-detect category
      let category: MaterialCategory = 'document';
      if (selectedFile.type.startsWith('image/')) category = 'image';
      else if (selectedFile.type.startsWith('audio/')) category = 'audio';
      else if (selectedFile.type.startsWith('video/')) category = 'video';
      form.setValue('category', category);
    }
  }, [form]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024, // 100MB
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'audio/*': ['.mp3', '.wav', '.ogg'],
      'video/*': ['.mp4', '.webm'],
    },
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const onSubmit = async (data: FormData) => {
    if (!file) {
      toast.error('Vui lòng chọn file để upload');
      return;
    }

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('isVisible', String(data.isVisible));

      await uploadMaterial.mutateAsync({
        classId,
        formData,
        onProgress: (progress) => setUploadProgress(progress),
      });

      toast.success('Upload thành công!');
      form.reset();
      setFile(null);
      setUploadProgress(0);
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Upload thất bại');
    }
  };

  const handleClose = () => {
    if (!uploadMaterial.isPending) {
      form.reset();
      setFile(null);
      setUploadProgress(0);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload tài liệu</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Dropzone */}
            {!file ? (
              <div
                {...getRootProps()}
                className={cn(
                  'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                  isDragActive
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-300 hover:border-purple-400'
                )}
              >
                <input {...getInputProps()} />
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium">
                  {isDragActive ? 'Thả file vào đây' : 'Kéo thả hoặc click để chọn file'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, DOC, DOCX, hình ảnh, audio, video (max 100MB)
                </p>
              </div>
            ) : (
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setFile(null)}
                    disabled={uploadMaterial.isPending}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {uploadMaterial.isPending && (
                  <Progress value={uploadProgress} className="mt-3" />
                )}
              </div>
            )}

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề *</FormLabel>
                  <FormControl>
                    <Input placeholder="Tên tài liệu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả ngắn về tài liệu..."
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category & Visibility */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Danh mục</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="document">Tài liệu</SelectItem>
                        <SelectItem value="audio">Audio</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="image">Hình ảnh</SelectItem>
                        <SelectItem value="exercise">Bài tập</SelectItem>
                        <SelectItem value="answer_key">Đáp án</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isVisible"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hiển thị với học viên</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2 pt-2">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <span className="text-sm">
                          {field.value ? 'Hiển thị' : 'Ẩn'}
                        </span>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={uploadMaterial.isPending}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={!file || uploadMaterial.isPending}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {uploadMaterial.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Upload
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

### 3. features/teacher/classes/useClassMaterials.ts

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teacherApi } from '@/services/teacher.api';

export type MaterialCategory = 
  | 'document' 
  | 'audio' 
  | 'video' 
  | 'image' 
  | 'exercise' 
  | 'answer_key' 
  | 'other';

export interface Material {
  id: string;
  title: string;
  description?: string;
  originalFileName: string;
  mimeType: string;
  fileSize: number;
  fileSizeFormatted: string;
  category: MaterialCategory;
  downloadCount: number;
  isVisible: boolean;
  downloadUrl: string;
  uploadedBy: {
    id: string;
    name: string;
  };
  createdAt: Date;
}

export interface MaterialsResponse {
  items: Material[];
  total: number;
  totalSize: number;
  totalSizeFormatted: string;
}

export interface MaterialQueryParams {
  category?: MaterialCategory;
  search?: string;
}

export function useClassMaterials(classId: string, params: MaterialQueryParams = {}) {
  return useQuery<MaterialsResponse>({
    queryKey: ['class-materials', classId, params],
    queryFn: () => teacherApi.getClassMaterials(classId, params),
    enabled: !!classId,
  });
}

export function useUploadMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classId,
      formData,
      onProgress,
    }: {
      classId: string;
      formData: FormData;
      onProgress?: (progress: number) => void;
    }) => {
      return teacherApi.uploadMaterial(classId, formData, onProgress);
    },
    onSuccess: (_, { classId }) => {
      queryClient.invalidateQueries({ queryKey: ['class-materials', classId] });
    },
  });
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, materialId }: { classId: string; materialId: string }) =>
      teacherApi.deleteMaterial(classId, materialId),
    onSuccess: (_, { classId }) => {
      queryClient.invalidateQueries({ queryKey: ['class-materials', classId] });
    },
  });
}
```

---

## ✅ Acceptance Criteria

- [ ] Drag & drop upload works
- [ ] Click to select file works
- [ ] Auto-detect category from MIME type
- [ ] Upload progress indicator
- [ ] List materials with icons by category
- [ ] Filter by category
- [ ] Search by title
- [ ] Download materials
- [ ] Delete with confirmation
- [ ] Show/hide visibility badge
- [ ] Empty state with CTA
- [ ] Total size display
- [ ] File size validation (max 100MB)

---

## 🔧 Dependencies

```bash
npm install react-dropzone
```

---

## 🎨 Design Notes

- Dropzone with dashed border
- Category-specific icons with colors
- Grid layout for materials cards
- Progress bar during upload
- Visibility toggle switch

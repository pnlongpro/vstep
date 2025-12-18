# FE-061: System Settings UI

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-061 |
| **Phase** | 3 - Enterprise |
| **Sprint** | 15-16 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 4h |
| **Dependencies** | BE-058, FE-057 |

---

## 🎯 Objective

Implement admin system settings interface:
- Settings grouped by category
- Toggle switches for boolean settings
- Input fields for string/number settings
- JSON editor for complex settings
- Save with validation
- Seed defaults button

---

## ⚠️ QUAN TRỌNG: Existing Files Warning

### Hướng dẫn:
- **TẠO MỚI** trong `FE/src/features/admin/settings/`
- Follow admin color scheme (red-600 primary)
- Use @monaco-editor/react for JSON editing

---

## 📝 Implementation

### 1. hooks/useAdminSettings.ts

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminSettingsService } from '@/services/adminSettingsService';

export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  dataType: 'string' | 'number' | 'boolean' | 'json';
  category: 'general' | 'limits' | 'features' | 'payment' | 'notifications';
  description?: string;
  isPublic: boolean;
  updatedAt: string;
}

export const useSystemSettings = (category?: string) => {
  return useQuery({
    queryKey: ['admin-settings', category],
    queryFn: () => adminSettingsService.getSettings(category),
  });
};

export const useSetting = (key: string) => {
  return useQuery({
    queryKey: ['admin-setting', key],
    queryFn: () => adminSettingsService.getSetting(key),
    enabled: !!key,
  });
};

export const useUpdateSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: any }) =>
      adminSettingsService.updateSetting(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
    },
  });
};

export const useBulkUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: { key: string; value: any }[]) =>
      adminSettingsService.bulkUpdateSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
    },
  });
};

export const useSeedDefaults = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => adminSettingsService.seedDefaults(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
    },
  });
};

export const useCreateSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SystemSetting>) =>
      adminSettingsService.createSetting(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
    },
  });
};

export const useDeleteSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (key: string) => adminSettingsService.deleteSetting(key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
    },
  });
};
```

### 2. components/SettingsContainer.tsx

```tsx
'use client';

import { useState } from 'react';
import {
  Settings,
  Shield,
  Zap,
  CreditCard,
  Bell,
  RefreshCw,
  Plus,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useSystemSettings,
  useBulkUpdateSettings,
  useSeedDefaults,
  SystemSetting,
} from '../hooks/useAdminSettings';
import { SettingItem } from './SettingItem';
import { CreateSettingModal } from './CreateSettingModal';
import { toast } from 'sonner';

const CATEGORIES = [
  { value: 'general', label: 'Chung', icon: Settings },
  { value: 'limits', label: 'Giới hạn', icon: Shield },
  { value: 'features', label: 'Tính năng', icon: Zap },
  { value: 'payment', label: 'Thanh toán', icon: CreditCard },
  { value: 'notifications', label: 'Thông báo', icon: Bell },
];

export function SettingsContainer() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Map<string, any>>(new Map());

  const { data: settings, isLoading } = useSystemSettings(activeCategory);
  const bulkUpdateMutation = useBulkUpdateSettings();
  const seedDefaultsMutation = useSeedDefaults();

  const handleSettingChange = (key: string, value: any) => {
    setPendingChanges((prev) => {
      const next = new Map(prev);
      next.set(key, value);
      return next;
    });
  };

  const handleSaveAll = async () => {
    if (pendingChanges.size === 0) {
      toast.info('Không có thay đổi');
      return;
    }

    try {
      const updates = Array.from(pendingChanges.entries()).map(([key, value]) => ({
        key,
        value,
      }));
      await bulkUpdateMutation.mutateAsync(updates);
      setPendingChanges(new Map());
      toast.success('Đã lưu cài đặt');
    } catch (error: any) {
      toast.error(error.message || 'Không thể lưu cài đặt');
    }
  };

  const handleSeedDefaults = async () => {
    if (!confirm('Điều này sẽ tạo lại các cài đặt mặc định. Tiếp tục?')) return;

    try {
      await seedDefaultsMutation.mutateAsync();
      toast.success('Đã khôi phục cài đặt mặc định');
    } catch (error: any) {
      toast.error(error.message || 'Không thể khôi phục');
    }
  };

  const hasChanges = pendingChanges.size > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cài đặt hệ thống</h1>
          <p className="text-gray-500">Quản lý cấu hình và thiết lập hệ thống</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSeedDefaults}
            disabled={seedDefaultsMutation.isPending}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Khôi phục mặc định
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm cài đặt
          </Button>
          <Button
            size="sm"
            className="bg-red-600 hover:bg-red-700"
            onClick={handleSaveAll}
            disabled={!hasChanges || bulkUpdateMutation.isPending}
          >
            <Save className="w-4 h-4 mr-2" />
            Lưu thay đổi
            {hasChanges && (
              <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {pendingChanges.size}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          {CATEGORIES.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value} className="gap-2">
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {CATEGORIES.map((cat) => (
          <TabsContent key={cat.value} value={cat.value}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <cat.icon className="w-5 h-5" />
                  {cat.label}
                </CardTitle>
                <CardDescription>
                  {getCategoryDescription(cat.value)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1 divide-y">
                    {settings?.map((setting: SystemSetting) => (
                      <SettingItem
                        key={setting.key}
                        setting={setting}
                        pendingValue={pendingChanges.get(setting.key)}
                        onChange={(value) => handleSettingChange(setting.key, value)}
                      />
                    ))}
                    {(!settings || settings.length === 0) && (
                      <p className="text-gray-500 py-8 text-center">
                        Không có cài đặt trong danh mục này
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Create Modal */}
      <CreateSettingModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}

function getCategoryDescription(category: string): string {
  switch (category) {
    case 'general':
      return 'Các cài đặt chung của hệ thống như tên site, email liên hệ';
    case 'limits':
      return 'Giới hạn số lượng bài thi, file upload, thời gian...';
    case 'features':
      return 'Bật/tắt các tính năng của hệ thống';
    case 'payment':
      return 'Cấu hình thanh toán và gói dịch vụ';
    case 'notifications':
      return 'Cài đặt email và thông báo';
    default:
      return '';
  }
}
```

### 3. components/SettingItem.tsx

```tsx
'use client';

import { useState } from 'react';
import { Trash2, Info } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { SystemSetting, useDeleteSetting } from '../hooks/useAdminSettings';
import { JsonEditorModal } from './JsonEditorModal';
import { toast } from 'sonner';

interface Props {
  setting: SystemSetting;
  pendingValue?: any;
  onChange: (value: any) => void;
}

export function SettingItem({ setting, pendingValue, onChange }: Props) {
  const [showJsonEditor, setShowJsonEditor] = useState(false);
  const deleteMutation = useDeleteSetting();

  const currentValue = pendingValue !== undefined ? pendingValue : setting.value;
  const hasChange = pendingValue !== undefined;

  const handleDelete = async () => {
    if (!confirm(`Xóa cài đặt "${setting.key}"?`)) return;

    try {
      await deleteMutation.mutateAsync(setting.key);
      toast.success('Đã xóa cài đặt');
    } catch (error: any) {
      toast.error(error.message || 'Không thể xóa');
    }
  };

  const renderInput = () => {
    switch (setting.dataType) {
      case 'boolean':
        return (
          <Switch
            checked={currentValue === 'true' || currentValue === true}
            onCheckedChange={(checked) => onChange(checked)}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={currentValue}
            onChange={(e) => onChange(e.target.value)}
            className="w-32"
          />
        );

      case 'json':
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowJsonEditor(true)}
          >
            Chỉnh sửa JSON
          </Button>
        );

      default:
        return (
          <Input
            value={currentValue}
            onChange={(e) => onChange(e.target.value)}
            className="w-64"
          />
        );
    }
  };

  return (
    <>
      <div
        className={`flex items-center justify-between py-4 ${
          hasChange ? 'bg-yellow-50 -mx-4 px-4' : ''
        }`}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
              {setting.key}
            </code>
            {setting.isPublic && (
              <Badge variant="outline" className="text-xs">
                Public
              </Badge>
            )}
            {hasChange && (
              <Badge className="bg-yellow-500 text-xs">Đã thay đổi</Badge>
            )}
          </div>
          {setting.description && (
            <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {renderInput()}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-red-500"
                  onClick={handleDelete}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Xóa cài đặt</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* JSON Editor Modal */}
      {setting.dataType === 'json' && (
        <JsonEditorModal
          open={showJsonEditor}
          onClose={() => setShowJsonEditor(false)}
          value={currentValue}
          onSave={(value) => {
            onChange(value);
            setShowJsonEditor(false);
          }}
          title={setting.key}
        />
      )}
    </>
  );
}
```

### 4. components/JsonEditorModal.tsx

```tsx
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Dynamic import for Monaco Editor (client-side only)
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
      Đang tải editor...
    </div>
  ),
});

interface Props {
  open: boolean;
  onClose: () => void;
  value: string;
  onSave: (value: string) => void;
  title: string;
}

export function JsonEditorModal({ open, onClose, value, onSave, title }: Props) {
  const [editorValue, setEditorValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      try {
        // Format JSON for display
        const parsed = JSON.parse(value || '{}');
        setEditorValue(JSON.stringify(parsed, null, 2));
        setError(null);
      } catch {
        setEditorValue(value || '{}');
      }
    }
  }, [open, value]);

  const handleSave = () => {
    try {
      // Validate JSON
      JSON.parse(editorValue);
      setError(null);
      onSave(editorValue);
    } catch (e: any) {
      setError('JSON không hợp lệ: ' + e.message);
      toast.error('JSON không hợp lệ');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa JSON: {title}</DialogTitle>
        </DialogHeader>

        <div className="border rounded-lg overflow-hidden">
          <MonacoEditor
            height="400px"
            language="json"
            theme="vs-dark"
            value={editorValue}
            onChange={(value) => setEditorValue(value || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              formatOnPaste: true,
              automaticLayout: true,
            }}
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 p-2 rounded">{error}</p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700">
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### 5. components/CreateSettingModal.tsx

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
import { useCreateSetting } from '../hooks/useAdminSettings';
import { toast } from 'sonner';

const schema = z.object({
  key: z.string().min(1, 'Key là bắt buộc').regex(/^[a-z_]+$/, 'Key chỉ chứa chữ thường và _'),
  value: z.string().min(1, 'Giá trị là bắt buộc'),
  dataType: z.enum(['string', 'number', 'boolean', 'json']),
  category: z.enum(['general', 'limits', 'features', 'payment', 'notifications']),
  description: z.string().optional(),
  isPublic: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CreateSettingModal({ open, onClose }: Props) {
  const createMutation = useCreateSetting();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      key: '',
      value: '',
      dataType: 'string',
      category: 'general',
      description: '',
      isPublic: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('Đã tạo cài đặt mới');
      form.reset();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Không thể tạo cài đặt');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm cài đặt mới</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key *</FormLabel>
                  <FormControl>
                    <Input placeholder="setting_key" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dataType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kiểu dữ liệu</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="string">String</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="boolean">Boolean</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Danh mục</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general">Chung</SelectItem>
                        <SelectItem value="limits">Giới hạn</SelectItem>
                        <SelectItem value="features">Tính năng</SelectItem>
                        <SelectItem value="payment">Thanh toán</SelectItem>
                        <SelectItem value="notifications">Thông báo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá trị *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Giá trị..." rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Input placeholder="Mô tả cài đặt..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Công khai (có thể truy cập không cần auth)</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700"
                disabled={createMutation.isPending}
              >
                Tạo mới
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

---

## ✅ Acceptance Criteria

- [ ] Settings load by category
- [ ] Toggle switches work for boolean
- [ ] Input fields work for string/number
- [ ] JSON editor opens for JSON type
- [ ] Pending changes highlighted
- [ ] Save all changes works
- [ ] Seed defaults works
- [ ] Create new setting works
- [ ] Delete setting works
- [ ] Validation errors displayed

---

## 🧪 Test Cases

```typescript
describe('SettingsContainer', () => {
  it('loads settings by category', async () => {
    // Click on Features tab
    // Verify features settings displayed
  });

  it('tracks pending changes', async () => {
    // Toggle a boolean setting
    // Verify yellow highlight
    // Verify save button shows count
  });

  it('saves changes', async () => {
    // Make changes
    // Click save
    // Verify success toast
  });
});

describe('CreateSettingModal', () => {
  it('creates new setting', async () => {
    // Fill form
    // Submit
    // Verify setting created
  });

  it('validates key format', async () => {
    // Enter invalid key
    // Verify error message
  });
});
```

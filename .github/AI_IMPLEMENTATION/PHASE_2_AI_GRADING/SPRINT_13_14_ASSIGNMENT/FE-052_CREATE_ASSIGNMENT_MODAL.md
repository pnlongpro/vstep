# FE-052: Create Assignment Modal

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-052 |
| **Phase** | 2 - AI Grading |
| **Sprint** | 13-14 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 8h |
| **Dependencies** | BE-051, FE-051 |

---

## 🎯 Objective

Implement assignment creation modal with:
- Multi-step form (Basic info → Questions → Settings)
- Question selector integration
- Date/time picker for due date
- Time limit configuration
- Preview before publish

---

## ⚠️ QUAN TRỌNG: Existing Files Warning

### Các file UI Template đã tồn tại (CHỈ THAM KHẢO):
```
UI-Template/
├── components/
│   ├── ExamRoom.tsx              # Test settings pattern
│   └── AssignmentsPage.tsx       # Assignment structure
```

### Hướng dẫn:
- **THAM KHẢO** patterns từ existing components
- **TẠO MỚI** trong `FE/src/features/teacher/assignments/`
- **SỬ DỤNG** Dialog/Sheet từ shadcn/ui
- **TÍCH HỢP** với QuestionSelector (FE-053)

---

## 📝 Implementation

### 1. schemas/assignment.schema.ts

```typescript
import { z } from 'zod';
import { AssignmentSkill, AssignmentLevel } from '../types';

export const assignmentSchema = z.object({
  // Step 1: Basic Info
  title: z
    .string()
    .min(3, 'Tiêu đề phải có ít nhất 3 ký tự')
    .max(255, 'Tiêu đề không được quá 255 ký tự'),
  description: z.string().max(2000).optional(),
  instructions: z.string().max(5000).optional(),
  skill: z.nativeEnum(AssignmentSkill),
  level: z.nativeEnum(AssignmentLevel),

  // Step 2: Questions (validated separately)

  // Step 3: Settings
  dueDate: z.date().refine((date) => date > new Date(), {
    message: 'Hạn nộp phải trong tương lai',
  }),
  timeLimit: z.number().min(5).max(300).optional().nullable(),
  maxAttempts: z.number().min(1).max(10).default(1),
  scoreCalculation: z.enum(['best', 'last', 'average']).default('best'),
  allowLateSubmission: z.boolean().default(false),
  latePenalty: z.number().min(0).max(100).default(0),
  totalPoints: z.number().min(1).max(1000).default(10),
  passingScore: z.number().min(0).max(100).optional().nullable(),
  showAnswersAfter: z.boolean().default(true),
});

export type AssignmentFormData = z.infer<typeof assignmentSchema>;

export const questionSelectionSchema = z.object({
  questions: z
    .array(
      z.object({
        questionId: z.string(),
        orderIndex: z.number(),
        points: z.number().min(0.1).max(100).default(1),
        required: z.boolean().default(true),
      })
    )
    .min(1, 'Phải chọn ít nhất 1 câu hỏi'),
});
```

### 2. components/CreateAssignmentModal.tsx

```tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useCreateAssignment } from '../hooks/useAssignments';
import { assignmentSchema, AssignmentFormData } from '../schemas/assignment.schema';
import { StepBasicInfo } from './steps/StepBasicInfo';
import { StepQuestions } from './steps/StepQuestions';
import { StepSettings } from './steps/StepSettings';
import { StepPreview } from './steps/StepPreview';
import { toast } from 'sonner';

interface Props {
  classId: string;
  open: boolean;
  onClose: () => void;
}

type Step = 'basic' | 'questions' | 'settings' | 'preview';

const steps: { key: Step; title: string }[] = [
  { key: 'basic', title: 'Thông tin cơ bản' },
  { key: 'questions', title: 'Chọn câu hỏi' },
  { key: 'settings', title: 'Cài đặt' },
  { key: 'preview', title: 'Xem trước' },
];

export function CreateAssignmentModal({ classId, open, onClose }: Props) {
  const [currentStep, setCurrentStep] = useState<Step>('basic');
  const [selectedQuestions, setSelectedQuestions] = useState<any[]>([]);

  const createMutation = useCreateAssignment();

  const form = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      skill: 'mixed',
      level: 'B1',
      maxAttempts: 1,
      scoreCalculation: 'best',
      allowLateSubmission: false,
      latePenalty: 0,
      totalPoints: 10,
      showAnswersAfter: true,
    },
  });

  const stepIndex = steps.findIndex((s) => s.key === currentStep);
  const progress = ((stepIndex + 1) / steps.length) * 100;

  const handleNext = async () => {
    // Validate current step
    if (currentStep === 'basic') {
      const isValid = await form.trigger(['title', 'skill', 'level']);
      if (!isValid) return;
      setCurrentStep('questions');
    } else if (currentStep === 'questions') {
      if (selectedQuestions.length === 0) {
        toast.error('Vui lòng chọn ít nhất 1 câu hỏi');
        return;
      }
      setCurrentStep('settings');
    } else if (currentStep === 'settings') {
      const isValid = await form.trigger(['dueDate', 'maxAttempts']);
      if (!isValid) return;
      setCurrentStep('preview');
    }
  };

  const handleBack = () => {
    const prevStepIndex = stepIndex - 1;
    if (prevStepIndex >= 0) {
      setCurrentStep(steps[prevStepIndex].key);
    }
  };

  const handleSubmit = async (saveAsDraft = false) => {
    const isValid = await form.trigger();
    if (!isValid && !saveAsDraft) return;

    try {
      const formData = form.getValues();
      await createMutation.mutateAsync({
        classId,
        data: {
          ...formData,
          dueDate: formData.dueDate.toISOString(),
          questions: selectedQuestions.map((q, idx) => ({
            questionId: q.id,
            orderIndex: idx,
            points: q.points || 1,
            required: true,
          })),
        },
      });

      toast.success(
        saveAsDraft
          ? 'Đã lưu bài tập nháp'
          : 'Đã tạo bài tập thành công'
      );
      handleClose();
    } catch (error: any) {
      toast.error(error.message || 'Không thể tạo bài tập');
    }
  };

  const handleClose = () => {
    setCurrentStep('basic');
    setSelectedQuestions([]);
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Tạo bài tập mới</DialogTitle>
        </DialogHeader>

        {/* Progress */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm">
            {steps.map((step, idx) => (
              <span
                key={step.key}
                className={
                  idx <= stepIndex ? 'text-purple-600 font-medium' : 'text-gray-400'
                }
              >
                {step.title}
              </span>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto py-4">
          {currentStep === 'basic' && (
            <StepBasicInfo form={form} />
          )}
          {currentStep === 'questions' && (
            <StepQuestions
              skill={form.watch('skill')}
              level={form.watch('level')}
              selected={selectedQuestions}
              onSelect={setSelectedQuestions}
            />
          )}
          {currentStep === 'settings' && (
            <StepSettings form={form} />
          )}
          {currentStep === 'preview' && (
            <StepPreview
              data={form.getValues()}
              questions={selectedQuestions}
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t">
          <div>
            {currentStep !== 'basic' && (
              <Button variant="outline" onClick={handleBack}>
                Quay lại
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            {currentStep === 'preview' ? (
              <>
                <Button
                  variant="secondary"
                  onClick={() => handleSubmit(true)}
                  disabled={createMutation.isPending}
                >
                  Lưu nháp
                </Button>
                <Button
                  onClick={() => handleSubmit(false)}
                  disabled={createMutation.isPending}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Tạo & Phát hành
                </Button>
              </>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Tiếp theo
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### 3. components/steps/StepBasicInfo.tsx

```tsx
'use client';

import { UseFormReturn } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
import { AssignmentFormData } from '../../schemas/assignment.schema';
import { AssignmentSkill, AssignmentLevel } from '../../types';

interface Props {
  form: UseFormReturn<AssignmentFormData>;
}

export function StepBasicInfo({ form }: Props) {
  return (
    <Form {...form}>
      <form className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề bài tập *</FormLabel>
              <FormControl>
                <Input
                  placeholder="VD: Reading Practice - Week 1"
                  {...field}
                />
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
                <Textarea
                  placeholder="Mô tả ngắn về bài tập..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Mô tả sẽ hiển thị cho học viên trước khi bắt đầu
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hướng dẫn làm bài</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập hướng dẫn chi tiết..."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="skill"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kỹ năng *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn kỹ năng" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={AssignmentSkill.READING}>Reading</SelectItem>
                    <SelectItem value={AssignmentSkill.LISTENING}>Listening</SelectItem>
                    <SelectItem value={AssignmentSkill.WRITING}>Writing</SelectItem>
                    <SelectItem value={AssignmentSkill.SPEAKING}>Speaking</SelectItem>
                    <SelectItem value={AssignmentSkill.MIXED}>Tổng hợp</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trình độ *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trình độ" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={AssignmentLevel.A2}>A2</SelectItem>
                    <SelectItem value={AssignmentLevel.B1}>B1</SelectItem>
                    <SelectItem value={AssignmentLevel.B2}>B2</SelectItem>
                    <SelectItem value={AssignmentLevel.C1}>C1</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
```

### 4. components/steps/StepSettings.tsx

```tsx
'use client';

import { UseFormReturn } from 'react-hook-form';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { AssignmentFormData } from '../../schemas/assignment.schema';
import { cn } from '@/lib/utils';

interface Props {
  form: UseFormReturn<AssignmentFormData>;
}

export function StepSettings({ form }: Props) {
  return (
    <Form {...form}>
      <form className="space-y-6">
        {/* Due Date */}
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Hạn nộp bài *</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP HH:mm', { locale: vi })
                      ) : (
                        <span>Chọn ngày giờ</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    locale={vi}
                    initialFocus
                  />
                  <div className="p-3 border-t">
                    <Input
                      type="time"
                      value={field.value ? format(field.value, 'HH:mm') : '23:59'}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value.split(':');
                        const newDate = field.value || new Date();
                        newDate.setHours(parseInt(hours), parseInt(minutes));
                        field.onChange(newDate);
                      }}
                    />
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Time Limit */}
        <FormField
          control={form.control}
          name="timeLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giới hạn thời gian (phút)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Để trống = không giới hạn"
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) =>
                    field.onChange(e.target.value ? parseInt(e.target.value) : null)
                  }
                />
              </FormControl>
              <FormDescription>
                Học viên sẽ tự động nộp bài khi hết giờ
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Max Attempts */}
          <FormField
            control={form.control}
            name="maxAttempts"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số lần làm tối đa</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Score Calculation */}
          <FormField
            control={form.control}
            name="scoreCalculation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cách tính điểm</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="best">Điểm cao nhất</SelectItem>
                    <SelectItem value="last">Lần cuối</SelectItem>
                    <SelectItem value="average">Trung bình</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Late Submission */}
        <div className="space-y-4 rounded-lg border p-4">
          <FormField
            control={form.control}
            name="allowLateSubmission"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div>
                  <FormLabel>Cho phép nộp muộn</FormLabel>
                  <FormDescription>
                    Học viên vẫn có thể nộp bài sau hạn
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {form.watch('allowLateSubmission') && (
            <FormField
              control={form.control}
              name="latePenalty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trừ điểm mỗi ngày muộn (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Show Answers */}
        <FormField
          control={form.control}
          name="showAnswersAfter"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <div>
                <FormLabel>Hiện đáp án sau khi nộp</FormLabel>
                <FormDescription>
                  Học viên xem được đáp án đúng sau khi hoàn thành
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
```

### 5. components/steps/StepPreview.tsx

```tsx
'use client';

import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AssignmentFormData } from '../../schemas/assignment.schema';

interface Props {
  data: AssignmentFormData;
  questions: any[];
}

const skillLabels: Record<string, string> = {
  reading: 'Reading',
  listening: 'Listening',
  writing: 'Writing',
  speaking: 'Speaking',
  mixed: 'Tổng hợp',
};

export function StepPreview({ data, questions }: Props) {
  const totalPoints = questions.reduce((sum, q) => sum + (q.points || 1), 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Thông tin bài tập</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Tiêu đề</p>
              <p className="font-medium">{data.title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Kỹ năng / Trình độ</p>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline">{skillLabels[data.skill]}</Badge>
                <Badge variant="secondary">{data.level}</Badge>
              </div>
            </div>
          </div>

          {data.description && (
            <div>
              <p className="text-sm text-gray-500">Mô tả</p>
              <p className="text-gray-700">{data.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Câu hỏi ({questions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {questions.slice(0, 5).map((q, idx) => (
              <div
                key={q.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm">{idx + 1}.</span>
                  <span className="text-gray-700">{q.text?.substring(0, 50)}...</span>
                </div>
                <Badge variant="secondary">{q.points || 1} điểm</Badge>
              </div>
            ))}
            {questions.length > 5 && (
              <p className="text-sm text-gray-500 text-center py-2">
                và {questions.length - 5} câu hỏi khác...
              </p>
            )}
          </div>

          <Separator className="my-4" />

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Tổng điểm</span>
            <span className="font-medium">{totalPoints} điểm</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cài đặt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Hạn nộp bài</p>
              <p className="font-medium">
                {data.dueDate
                  ? format(data.dueDate, 'PPP HH:mm', { locale: vi })
                  : 'Chưa đặt'}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Giới hạn thời gian</p>
              <p className="font-medium">
                {data.timeLimit ? `${data.timeLimit} phút` : 'Không giới hạn'}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Số lần làm tối đa</p>
              <p className="font-medium">{data.maxAttempts} lần</p>
            </div>
            <div>
              <p className="text-gray-500">Cách tính điểm</p>
              <p className="font-medium">
                {data.scoreCalculation === 'best'
                  ? 'Điểm cao nhất'
                  : data.scoreCalculation === 'last'
                  ? 'Lần cuối'
                  : 'Trung bình'}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Nộp muộn</p>
              <p className="font-medium">
                {data.allowLateSubmission
                  ? `Cho phép (trừ ${data.latePenalty}%/ngày)`
                  : 'Không cho phép'}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Hiện đáp án</p>
              <p className="font-medium">
                {data.showAnswersAfter ? 'Có' : 'Không'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## ✅ Acceptance Criteria

- [ ] Multi-step form navigation works
- [ ] Step 1: Basic info validates
- [ ] Step 2: Question selector integration
- [ ] Step 3: Date/time picker works
- [ ] Step 4: Preview shows all info
- [ ] Save as draft works
- [ ] Create & publish works
- [ ] Form resets on close
- [ ] Validation errors displayed
- [ ] Loading states

---

## 🧪 Test Cases

```typescript
describe('CreateAssignmentModal', () => {
  it('navigates through steps', async () => {
    // Fill step 1
    // Click next
    // Verify step 2 visible
  });

  it('validates before next step', async () => {
    // Leave title empty
    // Click next
    // Verify still on step 1
    // Verify error shown
  });

  it('requires at least 1 question', async () => {
    // Go to step 2
    // Don't select any
    // Click next
    // Verify error toast
  });

  it('creates assignment successfully', async () => {
    // Complete all steps
    // Click create
    // Verify API called
    // Verify modal closed
  });
});
```

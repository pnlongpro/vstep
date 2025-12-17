# FE-053: Question Selector Component

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-053 |
| **Phase** | 2 - AI Grading |
| **Sprint** | 13-14 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 6h |
| **Dependencies** | Phase 1 Question Bank |

---

## 🎯 Objective

Implement reusable question selector component:
- Browse question bank with filters
- Search by text/tags
- Preview question before selecting
- Drag-and-drop reordering
- Bulk select/deselect
- Points assignment per question

---

## ⚠️ QUAN TRỌNG: Existing Files Warning

### Các service/type đã tồn tại (SỬ DỤNG):
```
FE/src/
├── services/
│   └── questionService.ts         # Question API
├── types/
│   └── question.ts                # Question types
```

### Hướng dẫn:
- **SỬ DỤNG** existing question service nếu có
- **TẠO MỚI** component trong `FE/src/features/teacher/assignments/`
- **TÍCH HỢP** dnd-kit cho drag-drop

---

## 📝 Implementation

### 1. hooks/useQuestions.ts

```typescript
import { useQuery } from '@tanstack/react-query';
import { questionService } from '@/services/questionService';

export interface QuestionQuery {
  skill?: string;
  level?: string;
  type?: string;
  search?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}

export const useQuestions = (query: QuestionQuery) => {
  return useQuery({
    queryKey: ['questions', query],
    queryFn: () => questionService.getQuestions(query),
  });
};

export const useQuestionPreview = (id: string | null) => {
  return useQuery({
    queryKey: ['question', id],
    queryFn: () => questionService.getQuestion(id!),
    enabled: !!id,
  });
};
```

### 2. components/steps/StepQuestions.tsx

```tsx
'use client';

import { useState } from 'react';
import { QuestionBrowser } from '../QuestionBrowser';
import { SelectedQuestionsList } from '../SelectedQuestionsList';
import { QuestionPreviewModal } from '../QuestionPreviewModal';

interface Props {
  skill: string;
  level: string;
  selected: any[];
  onSelect: (questions: any[]) => void;
}

export function StepQuestions({ skill, level, selected, onSelect }: Props) {
  const [previewId, setPreviewId] = useState<string | null>(null);

  const handleAddQuestion = (question: any) => {
    if (selected.find((q) => q.id === question.id)) return;
    onSelect([...selected, { ...question, points: 1 }]);
  };

  const handleRemoveQuestion = (questionId: string) => {
    onSelect(selected.filter((q) => q.id !== questionId));
  };

  const handleReorder = (newOrder: any[]) => {
    onSelect(newOrder);
  };

  const handlePointsChange = (questionId: string, points: number) => {
    onSelect(
      selected.map((q) => (q.id === questionId ? { ...q, points } : q))
    );
  };

  return (
    <div className="grid grid-cols-2 gap-6 h-[500px]">
      {/* Left: Question Browser */}
      <div className="border rounded-lg overflow-hidden flex flex-col">
        <div className="p-3 bg-gray-50 border-b">
          <h3 className="font-medium text-gray-900">Ngân hàng câu hỏi</h3>
        </div>
        <QuestionBrowser
          defaultSkill={skill}
          defaultLevel={level}
          selectedIds={selected.map((q) => q.id)}
          onAdd={handleAddQuestion}
          onPreview={setPreviewId}
        />
      </div>

      {/* Right: Selected Questions */}
      <div className="border rounded-lg overflow-hidden flex flex-col">
        <div className="p-3 bg-gray-50 border-b flex items-center justify-between">
          <h3 className="font-medium text-gray-900">
            Câu hỏi đã chọn ({selected.length})
          </h3>
          {selected.length > 0 && (
            <span className="text-sm text-gray-500">
              Tổng: {selected.reduce((sum, q) => sum + q.points, 0)} điểm
            </span>
          )}
        </div>
        <SelectedQuestionsList
          questions={selected}
          onRemove={handleRemoveQuestion}
          onReorder={handleReorder}
          onPointsChange={handlePointsChange}
          onPreview={setPreviewId}
        />
      </div>

      {/* Preview Modal */}
      <QuestionPreviewModal
        questionId={previewId}
        open={!!previewId}
        onClose={() => setPreviewId(null)}
      />
    </div>
  );
}
```

### 3. components/QuestionBrowser.tsx

```tsx
'use client';

import { useState, useMemo } from 'react';
import { Search, Plus, Eye, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuestions, QuestionQuery } from '../hooks/useQuestions';
import { useDebounce } from '@/hooks/useDebounce';

interface Props {
  defaultSkill?: string;
  defaultLevel?: string;
  selectedIds: string[];
  onAdd: (question: any) => void;
  onPreview: (id: string) => void;
}

const questionTypes: Record<string, string> = {
  multiple_choice: 'Trắc nghiệm',
  true_false: 'Đúng/Sai',
  fill_blank: 'Điền khuyết',
  matching: 'Nối câu',
  essay: 'Tự luận',
  speaking_task: 'Nói',
};

export function QuestionBrowser({
  defaultSkill,
  defaultLevel,
  selectedIds,
  onAdd,
  onPreview,
}: Props) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<QuestionQuery>({
    skill: defaultSkill || 'all',
    level: defaultLevel || 'all',
    type: 'all',
    page: 1,
    limit: 20,
  });

  const debouncedSearch = useDebounce(search, 300);

  const query = useMemo(
    () => ({
      ...filters,
      skill: filters.skill === 'all' ? undefined : filters.skill,
      level: filters.level === 'all' ? undefined : filters.level,
      type: filters.type === 'all' ? undefined : filters.type,
      search: debouncedSearch || undefined,
    }),
    [filters, debouncedSearch]
  );

  const { data, isLoading } = useQuestions(query);

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3 space-y-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm câu hỏi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={filters.skill || 'all'}
            onValueChange={(v) => setFilters((f) => ({ ...f, skill: v }))}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Kỹ năng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="reading">Reading</SelectItem>
              <SelectItem value="listening">Listening</SelectItem>
              <SelectItem value="writing">Writing</SelectItem>
              <SelectItem value="speaking">Speaking</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.type || 'all'}
            onValueChange={(v) => setFilters((f) => ({ ...f, type: v }))}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {Object.entries(questionTypes).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Question List */}
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="p-3 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-3 border rounded-lg">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : data?.items.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Không tìm thấy câu hỏi phù hợp</p>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {data?.items.map((question: any) => {
              const isSelected = selectedIds.includes(question.id);

              return (
                <div
                  key={question.id}
                  className={`p-3 border rounded-lg hover:bg-gray-50 transition ${
                    isSelected ? 'border-purple-300 bg-purple-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 line-clamp-2">
                        {question.text}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {questionTypes[question.type] || question.type}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {question.level}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onPreview(question.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={isSelected ? 'secondary' : 'default'}
                        size="icon"
                        className="h-8 w-8"
                        disabled={isSelected}
                        onClick={() => onAdd(question)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="p-3 border-t flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Trang {data.page}/{data.totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={data.page <= 1}
              onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) - 1 }))}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={data.page >= data.totalPages}
              onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) + 1 }))}
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 4. components/SelectedQuestionsList.tsx

```tsx
'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Props {
  questions: any[];
  onRemove: (id: string) => void;
  onReorder: (newOrder: any[]) => void;
  onPointsChange: (id: string, points: number) => void;
  onPreview: (id: string) => void;
}

export function SelectedQuestionsList({
  questions,
  onRemove,
  onReorder,
  onPointsChange,
  onPreview,
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id);
      const newIndex = questions.findIndex((q) => q.id === over.id);
      onReorder(arrayMove(questions, oldIndex, newIndex));
    }
  };

  if (questions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="text-lg mb-1">Chưa có câu hỏi</p>
          <p className="text-sm">Chọn câu hỏi từ ngân hàng bên trái</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={questions.map((q) => q.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="p-3 space-y-2">
            {questions.map((question, index) => (
              <SortableQuestionItem
                key={question.id}
                question={question}
                index={index}
                onRemove={() => onRemove(question.id)}
                onPointsChange={(points) => onPointsChange(question.id, points)}
                onPreview={() => onPreview(question.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </ScrollArea>
  );
}

interface SortableItemProps {
  question: any;
  index: number;
  onRemove: () => void;
  onPointsChange: (points: number) => void;
  onPreview: () => void;
}

function SortableQuestionItem({
  question,
  index,
  onRemove,
  onPointsChange,
  onPreview,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 border rounded-lg bg-white ${
        isDragging ? 'shadow-lg' : ''
      }`}
    >
      <div className="flex items-start gap-2">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        {/* Index */}
        <span className="text-sm text-gray-400 mt-1 w-6">
          {index + 1}.
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900 line-clamp-2">
            {question.text}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {question.type}
            </Badge>
          </div>
        </div>

        {/* Points */}
        <div className="flex items-center gap-1">
          <Input
            type="number"
            min={0.1}
            max={100}
            step={0.5}
            value={question.points}
            onChange={(e) => onPointsChange(parseFloat(e.target.value) || 1)}
            className="w-16 h-8 text-center text-sm"
          />
          <span className="text-xs text-gray-400">đ</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onPreview}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:text-red-600"
            onClick={onRemove}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### 5. components/QuestionPreviewModal.tsx

```tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useQuestionPreview } from '../hooks/useQuestions';

interface Props {
  questionId: string | null;
  open: boolean;
  onClose: () => void;
}

export function QuestionPreviewModal({ questionId, open, onClose }: Props) {
  const { data: question, isLoading } = useQuestionPreview(questionId);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Xem trước câu hỏi</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ) : question ? (
          <div className="space-y-4 py-4">
            {/* Meta */}
            <div className="flex items-center gap-2">
              <Badge variant="outline">{question.type}</Badge>
              <Badge variant="secondary">{question.level}</Badge>
              <Badge variant="secondary">{question.skill}</Badge>
            </div>

            {/* Passage if exists */}
            {question.passage && (
              <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-700 max-h-40 overflow-y-auto">
                {question.passage}
              </div>
            )}

            {/* Question Text */}
            <p className="text-lg font-medium text-gray-900">{question.text}</p>

            {/* Options for MCQ/TF */}
            {question.options && question.options.length > 0 && (
              <RadioGroup className="space-y-2">
                {question.options.map((option: any) => (
                  <div
                    key={option.id}
                    className={`flex items-center space-x-2 p-3 border rounded-lg ${
                      option.isCorrect
                        ? 'border-green-500 bg-green-50'
                        : ''
                    }`}
                  >
                    <RadioGroupItem
                      value={option.id}
                      id={option.id}
                      disabled
                      checked={option.isCorrect}
                    />
                    <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                      <span className="font-medium mr-2">{option.label}.</span>
                      {option.text}
                    </Label>
                    {option.isCorrect && (
                      <Badge className="bg-green-500">Đáp án đúng</Badge>
                    )}
                  </div>
                ))}
              </RadioGroup>
            )}

            {/* Essay/Speaking - Show sample answer if exists */}
            {(question.type === 'essay' || question.type === 'speaking_task') && question.sampleAnswer && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Đáp án mẫu:</p>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-sm">
                  {question.sampleAnswer}
                </div>
              </div>
            )}

            {/* Tags */}
            {question.tags && question.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Tags:</span>
                {question.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            Không tìm thấy câu hỏi
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
```

---

## 📦 Dependencies

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

---

## ✅ Acceptance Criteria

- [ ] Question browser filters work
- [ ] Search với debounce
- [ ] Add question to selection
- [ ] Remove question from selection
- [ ] Drag-drop reorder works
- [ ] Points editable per question
- [ ] Preview modal shows full question
- [ ] Correct answer highlighted
- [ ] Pagination trong browser
- [ ] Empty states

---

## 🧪 Test Cases

```typescript
describe('QuestionSelector', () => {
  it('filters questions by skill', async () => {
    // Select reading
    // Verify only reading questions shown
  });

  it('adds question to selection', async () => {
    // Click add button
    // Verify appears in right panel
  });

  it('reorders via drag-drop', async () => {
    // Drag item 1 to position 3
    // Verify new order
  });

  it('updates points', async () => {
    // Change points input
    // Verify total updated
  });
});
```

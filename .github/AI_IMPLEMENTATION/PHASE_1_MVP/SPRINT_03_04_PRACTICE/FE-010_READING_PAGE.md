# FE-010: Reading Practice Page

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-010 |
| **Phase** | 1 - MVP |
| **Sprint** | 3-4 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 4h |
| **Dependencies** | FE-008, FE-009 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Existing files ĐÃ CÓ SẴN:**
> - `components/reading/ReadingExercise.tsx` - ✅ Đã có full UI!
> - `components/reading/ReadingResult.tsx` - ✅ Đã có result display

**Action:**
- ❌ KHÔNG tạo mới UI components
- ✅ CREATE page route `app/(dashboard)/practice/reading/page.tsx`
- ✅ INTEGRATE existing `ReadingExercise.tsx` với practice API
- ✅ ADD React Query hooks để fetch data

---

## 🎯 Objective

INTEGRATE Reading Practice Page (dùng component có sẵn):
- Split view: Passage (left) + Questions (right)
- Highlight text trong passage
- Navigation giữa các câu hỏi
- Timer và progress tracking
- Submit và xem kết quả

---

## 💻 Implementation

### File Structure

```
src/app/practice/reading/
├── page.tsx
├── [sessionId]/
│   ├── page.tsx
│   └── result/
│       └── page.tsx
└── components/
    ├── ReadingLayout.tsx
    ├── PassageViewer.tsx
    ├── QuestionNavigator.tsx
    └── ReadingToolbar.tsx
```

### Step 1: Reading Layout

```tsx
// src/app/practice/reading/components/ReadingLayout.tsx
'use client';

import { useState, useRef, ReactNode } from 'react';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReadingLayoutProps {
  passage: ReactNode;
  questions: ReactNode;
  toolbar?: ReactNode;
  navigator?: ReactNode;
}

export default function ReadingLayout({
  passage,
  questions,
  toolbar,
  navigator,
}: ReadingLayoutProps) {
  const [splitRatio, setSplitRatio] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const handleMouseDown = () => {
    isDraggingRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const newRatio = ((e.clientX - rect.left) / rect.width) * 100;
    setSplitRatio(Math.min(Math.max(newRatio, 30), 70));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  // Add event listeners
  useState(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  });

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Toolbar */}
      {toolbar && (
        <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          {toolbar}
        </div>
      )}

      {/* Main Content */}
      <div 
        ref={containerRef}
        className="flex-1 flex overflow-hidden"
      >
        {/* Passage Panel */}
        <div 
          className="overflow-auto bg-white dark:bg-gray-800"
          style={{ width: `${splitRatio}%` }}
        >
          {passage}
        </div>

        {/* Resize Handle */}
        <div
          onMouseDown={handleMouseDown}
          className={cn(
            'w-2 flex-shrink-0 bg-gray-200 dark:bg-gray-700',
            'hover:bg-blue-300 dark:hover:bg-blue-700 cursor-col-resize',
            'flex items-center justify-center'
          )}
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>

        {/* Questions Panel */}
        <div 
          className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900"
          style={{ width: `${100 - splitRatio}%` }}
        >
          {questions}
        </div>
      </div>

      {/* Bottom Navigator */}
      {navigator && (
        <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          {navigator}
        </div>
      )}
    </div>
  );
}
```

### Step 2: Passage Viewer

```tsx
// src/app/practice/reading/components/PassageViewer.tsx
'use client';

import { useState, useCallback } from 'react';
import { Passage } from '@/types/practice.types';
import { ZoomIn, ZoomOut, HighlighterIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PassageViewerProps {
  passage: Passage;
  fontSize?: number;
  onFontSizeChange?: (size: number) => void;
}

export default function PassageViewer({
  passage,
  fontSize = 16,
  onFontSizeChange,
}: PassageViewerProps) {
  const [highlights, setHighlights] = useState<string[]>([]);
  const [isHighlightMode, setIsHighlightMode] = useState(false);

  const handleTextSelect = useCallback(() => {
    if (!isHighlightMode) return;
    
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const selectedText = selection.toString().trim();
      if (!highlights.includes(selectedText)) {
        setHighlights([...highlights, selectedText]);
      }
    }
  }, [isHighlightMode, highlights]);

  // Process content to add highlight spans
  const processedContent = highlights.reduce((content, highlight) => {
    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedHighlight})`, 'gi');
    return content.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
  }, passage.content || '');

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          {/* Font Size Controls */}
          <button
            onClick={() => onFontSizeChange?.(Math.max(12, fontSize - 2))}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Giảm cỡ chữ"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-500">{fontSize}px</span>
          <button
            onClick={() => onFontSizeChange?.(Math.min(24, fontSize + 2))}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Tăng cỡ chữ"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Highlight Toggle */}
        <button
          onClick={() => setIsHighlightMode(!isHighlightMode)}
          className={cn(
            'flex items-center px-3 py-1 rounded text-sm',
            isHighlightMode
              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          )}
        >
          <HighlighterIcon className="w-4 h-4 mr-1" />
          Highlight
        </button>
      </div>

      {/* Passage Content */}
      <div className="flex-1 overflow-auto p-6">
        {passage.title && (
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {passage.title}
          </h2>
        )}

        {passage.imageUrl && (
          <img
            src={passage.imageUrl}
            alt="Passage illustration"
            className="max-w-full h-auto mb-4 rounded-lg"
          />
        )}

        <div
          className="prose dark:prose-invert max-w-none"
          style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
          onMouseUp={handleTextSelect}
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
      </div>

      {/* Highlight List */}
      {highlights.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2">
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-sm text-gray-500">Đã highlight:</span>
            {highlights.map((h, i) => (
              <span
                key={i}
                className="inline-flex items-center px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs rounded"
              >
                {h.length > 20 ? h.slice(0, 20) + '...' : h}
                <button
                  onClick={() => setHighlights(highlights.filter((_, j) => j !== i))}
                  className="ml-1 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

### Step 3: Reading Toolbar

```tsx
// src/app/practice/reading/components/ReadingToolbar.tsx
'use client';

import { useState } from 'react';
import { Clock, Pause, Play, Flag, ArrowLeft, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReadingToolbarProps {
  timeSpent: number;
  timeLimit?: number;
  isPaused: boolean;
  progress: {
    answered: number;
    flagged: number;
    total: number;
  };
  onPause: () => void;
  onResume: () => void;
  onSubmit: () => void;
  onExit: () => void;
}

export default function ReadingToolbar({
  timeSpent,
  timeLimit,
  isPaused,
  progress,
  onPause,
  onResume,
  onSubmit,
  onExit,
}: ReadingToolbarProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const timeRemaining = timeLimit ? timeLimit - timeSpent : null;
  const isLowTime = timeRemaining !== null && timeRemaining < 300; // 5 minutes

  return (
    <div className="flex items-center justify-between px-4 py-3">
      {/* Left: Exit & Timer */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onExit}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Thoát
        </button>

        <div className={cn(
          'flex items-center px-3 py-1 rounded-lg',
          isLowTime 
            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 animate-pulse' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
        )}>
          <Clock className="w-4 h-4 mr-2" />
          {timeLimit ? (
            <span>Còn lại: {formatTime(timeRemaining!)}</span>
          ) : (
            <span>Đã làm: {formatTime(timeSpent)}</span>
          )}
        </div>

        <button
          onClick={isPaused ? onResume : onPause}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          title={isPaused ? 'Tiếp tục' : 'Tạm dừng'}
        >
          {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
        </button>
      </div>

      {/* Center: Progress */}
      <div className="flex items-center space-x-4 text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          Đã trả lời: <strong>{progress.answered}</strong> / {progress.total}
        </span>
        {progress.flagged > 0 && (
          <span className="flex items-center text-yellow-600">
            <Flag className="w-4 h-4 mr-1" />
            {progress.flagged}
          </span>
        )}
      </div>

      {/* Right: Submit */}
      <div className="flex items-center space-x-2">
        {showConfirm ? (
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">
            <span className="text-sm">Xác nhận nộp bài?</span>
            <button
              onClick={onSubmit}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Nộp
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400"
            >
              Hủy
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Send className="w-4 h-4 mr-2" />
            Nộp bài
          </button>
        )}
      </div>
    </div>
  );
}
```

### Step 4: Question Navigator

```tsx
// src/app/practice/reading/components/QuestionNavigator.tsx
'use client';

import { ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionNavigatorProps {
  currentIndex: number;
  totalQuestions: number;
  answeredQuestions: Set<number>;
  flaggedQuestions: Set<number>;
  onNavigate: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export default function QuestionNavigator({
  currentIndex,
  totalQuestions,
  answeredQuestions,
  flaggedQuestions,
  onNavigate,
  onPrevious,
  onNext,
}: QuestionNavigatorProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      {/* Previous Button */}
      <button
        onClick={onPrevious}
        disabled={currentIndex === 0}
        className={cn(
          'flex items-center px-4 py-2 rounded-lg',
          currentIndex === 0
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        )}
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Câu trước
      </button>

      {/* Question Pills */}
      <div className="flex items-center space-x-1 overflow-x-auto max-w-md">
        {Array.from({ length: totalQuestions }, (_, i) => (
          <button
            key={i}
            onClick={() => onNavigate(i)}
            className={cn(
              'relative w-8 h-8 rounded-full text-sm font-medium transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-blue-500',
              {
                'bg-blue-600 text-white': currentIndex === i,
                'bg-green-500 text-white': currentIndex !== i && answeredQuestions.has(i),
                'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300':
                  currentIndex !== i && !answeredQuestions.has(i),
              }
            )}
          >
            {i + 1}
            {flaggedQuestions.has(i) && (
              <Flag className="absolute -top-1 -right-1 w-3 h-3 text-yellow-500" fill="currentColor" />
            )}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={currentIndex === totalQuestions - 1}
        className={cn(
          'flex items-center px-4 py-2 rounded-lg',
          currentIndex === totalQuestions - 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        )}
      >
        Câu sau
        <ChevronRight className="w-5 h-5 ml-1" />
      </button>
    </div>
  );
}
```

### Step 5: Reading Practice Page

```tsx
// src/app/practice/reading/[sessionId]/page.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePracticeSession } from '@/hooks/usePracticeSession';
import { QuestionRenderer } from '@/components/practice/questions';
import ReadingLayout from '../components/ReadingLayout';
import ReadingToolbar from '../components/ReadingToolbar';
import PassageViewer from '../components/PassageViewer';
import QuestionNavigator from '../components/QuestionNavigator';
import { Loader2 } from 'lucide-react';

export default function ReadingPracticePage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();
  const [fontSize, setFontSize] = useState(16);

  const {
    session,
    questions,
    answers,
    currentIndex,
    currentQuestion,
    currentAnswer,
    isLoading,
    error,
    timeSpent,
    progress,
    loadSession,
    submitAnswer,
    goToQuestion,
    goNext,
    goPrevious,
    toggleFlag,
    pauseSession,
    resumeSession,
    completeSession,
    abandonSession,
  } = usePracticeSession({
    onSessionEnd: (session) => {
      router.push(`/practice/reading/${session.id}/result`);
    },
    onTimeUp: () => {
      // Auto-submit when time is up
    },
  });

  // Load session on mount
  useEffect(() => {
    if (sessionId) {
      loadSession(sessionId);
    }
  }, [sessionId, loadSession]);

  // Compute answered and flagged sets
  const answeredQuestions = useMemo(() => {
    const set = new Set<number>();
    questions.forEach((q, i) => {
      if (answers[q.id]?.answer || answers[q.id]?.selectedOptionId) {
        set.add(i);
      }
    });
    return set;
  }, [questions, answers]);

  const flaggedQuestions = useMemo(() => {
    const set = new Set<number>();
    questions.forEach((q, i) => {
      if (answers[q.id]?.isFlagged) {
        set.add(i);
      }
    });
    return set;
  }, [questions, answers]);

  // Get current passage (for now, use first passage or create mock)
  const currentPassage = useMemo(() => {
    // In real implementation, get passage from question or separate API
    return {
      id: 'mock',
      title: 'Reading Passage',
      content: currentQuestion?.context || '<p>Loading passage content...</p>',
      orderIndex: 0,
      questions: [],
    };
  }, [currentQuestion]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => router.push('/practice')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (!session || !currentQuestion) {
    return null;
  }

  const isPaused = session.status === 'paused';

  return (
    <ReadingLayout
      toolbar={
        <ReadingToolbar
          timeSpent={timeSpent}
          timeLimit={session.timeLimit || undefined}
          isPaused={isPaused}
          progress={{
            answered: progress.answered,
            flagged: progress.flagged,
            total: progress.total,
          }}
          onPause={pauseSession}
          onResume={resumeSession}
          onSubmit={completeSession}
          onExit={async () => {
            if (confirm('Bạn có chắc muốn thoát? Tiến độ sẽ được lưu.')) {
              await pauseSession();
              router.push('/practice');
            }
          }}
        />
      }
      passage={
        <PassageViewer
          passage={currentPassage}
          fontSize={fontSize}
          onFontSizeChange={setFontSize}
        />
      }
      questions={
        <div className="p-6">
          <QuestionRenderer
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            currentAnswer={currentAnswer || undefined}
            onAnswer={(answer) => submitAnswer(answer)}
            onFlag={toggleFlag}
            disabled={isPaused}
          />
        </div>
      }
      navigator={
        <QuestionNavigator
          currentIndex={currentIndex}
          totalQuestions={questions.length}
          answeredQuestions={answeredQuestions}
          flaggedQuestions={flaggedQuestions}
          onNavigate={goToQuestion}
          onPrevious={goPrevious}
          onNext={goNext}
        />
      }
    />
  );
}
```

---

## ✅ Acceptance Criteria

- [ ] Split view layout responsive
- [ ] Passage viewer với font size control
- [ ] Text highlighting functional
- [ ] Question navigation works
- [ ] Timer tracks correctly
- [ ] Pause/resume session
- [ ] Submit shows confirmation
- [ ] Progress saved on exit

---

## ⏭️ Next Task

→ `FE-011_LISTENING_PAGE.md` - Listening Practice Page

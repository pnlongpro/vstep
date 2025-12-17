# FE-013: Writing Practice Page

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-013 |
| **Phase** | 1 - MVP |
| **Sprint** | 3-4 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 4h |
| **Dependencies** | FE-008, FE-009 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Existing files ĐÃ CÓ SẴN:**
> - `components/writing/WritingExercise.tsx` - ✅ Đã có full UI!
> - `components/writing/WritingResult.tsx` - ✅ Đã có result display

**Action:**
- ❌ KHÔNG tạo mới WritingEditor UI
- ✅ CREATE page route `app/(dashboard)/practice/writing/page.tsx`
- ✅ INTEGRATE existing `WritingExercise.tsx` với practice API
- ✅ ADD React Query hooks + auto-save logic

---

## 🎯 Objective

INTEGRATE Writing Practice Page (dùng component có sẵn):
- Rich Text Editor với toolbar
- Word count và character count
- Auto-save draft
- AI scoring integration
- Feedback display với grammar highlights

---

## 💻 Implementation

### File Structure

```
src/app/practice/writing/
├── page.tsx
├── [sessionId]/
│   ├── page.tsx
│   └── result/
│       └── page.tsx
└── components/
    ├── WritingLayout.tsx
    ├── WritingEditor.tsx
    ├── WritingToolbar.tsx
    ├── TaskPrompt.tsx
    └── AiFeedbackPanel.tsx
```

### Step 1: Writing Editor Component

```tsx
// src/app/practice/writing/components/WritingEditor.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Underline from '@tiptap/extension-underline';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon,
  List, 
  ListOrdered,
  Undo,
  Redo,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WritingEditorProps {
  initialContent?: string;
  placeholder?: string;
  minWords?: number;
  maxWords?: number;
  disabled?: boolean;
  onChange?: (content: string, wordCount: number) => void;
  onSave?: (content: string) => void;
  autoSaveInterval?: number; // ms
}

export default function WritingEditor({
  initialContent = '',
  placeholder = 'Bắt đầu viết bài của bạn ở đây...',
  minWords = 150,
  maxWords = 300,
  disabled = false,
  onChange,
  onSave,
  autoSaveInterval = 30000, // 30 seconds
}: WritingEditorProps) {
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const lastSavedContentRef = useRef(initialContent);

  // Editor instance
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: {
          depth: 50,
        },
      }),
      Underline,
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount.configure({
        limit: maxWords * 10, // Rough character limit
      }),
    ],
    content: initialContent,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      const words = countWords(text);
      const chars = text.length;
      
      setWordCount(words);
      setCharCount(chars);
      
      onChange?.(editor.getHTML(), words);
    },
  });

  // Count words helper
  const countWords = (text: string): number => {
    return text
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 0).length;
  };

  // Auto-save effect
  useEffect(() => {
    if (!editor || !onSave || !autoSaveInterval) return;

    const interval = setInterval(() => {
      const currentContent = editor.getHTML();
      if (currentContent !== lastSavedContentRef.current) {
        setIsSaving(true);
        onSave(currentContent);
        lastSavedContentRef.current = currentContent;
        setLastSaved(new Date());
        setTimeout(() => setIsSaving(false), 1000);
      }
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [editor, onSave, autoSaveInterval]);

  // Manual save
  const handleSave = useCallback(() => {
    if (!editor || !onSave) return;
    setIsSaving(true);
    const content = editor.getHTML();
    onSave(content);
    lastSavedContentRef.current = content;
    setLastSaved(new Date());
    setTimeout(() => setIsSaving(false), 1000);
  }, [editor, onSave]);

  // Clear content
  const handleClear = useCallback(() => {
    if (!editor) return;
    if (confirm('Bạn có chắc muốn xóa toàn bộ nội dung?')) {
      editor.commands.clearContent();
    }
  }, [editor]);

  // Word count status
  const getWordCountStatus = () => {
    if (wordCount < minWords) {
      return { color: 'text-yellow-500', message: `Tối thiểu ${minWords} từ` };
    }
    if (wordCount > maxWords) {
      return { color: 'text-red-500', message: `Vượt quá ${maxWords} từ` };
    }
    return { color: 'text-green-500', message: 'Đạt yêu cầu' };
  };

  const wordCountStatus = getWordCountStatus();

  if (!editor) {
    return <div className="animate-pulse h-96 bg-gray-100 rounded-lg" />;
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            disabled={disabled}
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            disabled={disabled}
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            disabled={disabled}
          >
            <UnderlineIcon className="w-4 h-4" />
          </ToolbarButton>
          
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            disabled={disabled}
          >
            <List className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            disabled={disabled}
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>
          
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
          
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={disabled || !editor.can().undo()}
          >
            <Undo className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={disabled || !editor.can().redo()}
          >
            <Redo className="w-4 h-4" />
          </ToolbarButton>
          
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
          
          <ToolbarButton
            onClick={handleClear}
            disabled={disabled}
            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4" />
          </ToolbarButton>
        </div>

        {/* Save indicator */}
        <div className="flex items-center text-xs text-gray-500">
          {isSaving ? (
            <span className="flex items-center">
              <span className="animate-spin mr-1">⏳</span>
              Đang lưu...
            </span>
          ) : lastSaved ? (
            <span>
              Đã lưu lúc {lastSaved.toLocaleTimeString()}
            </span>
          ) : null}
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-auto">
        <EditorContent 
          editor={editor} 
          className={cn(
            'prose dark:prose-invert max-w-none p-6 min-h-[400px]',
            'focus-within:outline-none',
            disabled && 'opacity-60 cursor-not-allowed'
          )}
        />
      </div>

      {/* Word Count Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center space-x-4 text-sm">
          <span className={cn('font-medium', wordCountStatus.color)}>
            {wordCount} từ
            <span className="text-gray-400 font-normal ml-1">
              ({minWords} - {maxWords})
            </span>
          </span>
          <span className="text-gray-500">
            {charCount} ký tự
          </span>
        </div>
        <span className={cn('text-sm', wordCountStatus.color)}>
          {wordCountStatus.message}
        </span>
      </div>
    </div>
  );
}

// Toolbar button component
interface ToolbarButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  className?: string;
}

function ToolbarButton({ 
  children, 
  onClick, 
  isActive, 
  disabled, 
  className 
}: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
        isActive && 'bg-gray-200 dark:bg-gray-600 text-blue-600',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  );
}
```

### Step 2: Task Prompt Component

```tsx
// src/app/practice/writing/components/TaskPrompt.tsx
'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Target, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskPromptProps {
  title: string;
  content: string;
  taskType: 'task1' | 'task2';
  timeLimit?: number; // minutes
  wordLimit?: { min: number; max: number };
  tips?: string[];
}

export default function TaskPrompt({
  title,
  content,
  taskType,
  timeLimit,
  wordLimit,
  tips = [],
}: TaskPromptProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showTips, setShowTips] = useState(false);

  const taskLabels = {
    task1: { label: 'Task 1', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    task2: { label: 'Task 2', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <div className="flex items-center space-x-3">
          <span className={cn(
            'px-2 py-1 rounded text-xs font-medium',
            taskLabels[taskType].color
          )}>
            {taskLabels[taskType].label}
          </span>
          <h3 className="font-medium text-gray-800 dark:text-gray-200">
            {title}
          </h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          {/* Requirements */}
          <div className="flex items-center space-x-4 px-4 py-2 bg-gray-50 dark:bg-gray-900 text-sm">
            {timeLimit && (
              <span className="flex items-center text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4 mr-1" />
                {timeLimit} phút
              </span>
            )}
            {wordLimit && (
              <span className="flex items-center text-gray-600 dark:text-gray-400">
                <Target className="w-4 h-4 mr-1" />
                {wordLimit.min} - {wordLimit.max} từ
              </span>
            )}
          </div>

          {/* Task Description */}
          <div className="px-4 py-4">
            <div 
              className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>

          {/* Tips Section */}
          {tips.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowTips(!showTips)}
                className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <Info className="w-4 h-4 mr-2" />
                {showTips ? 'Ẩn gợi ý' : 'Xem gợi ý'}
              </button>
              
              {showTips && (
                <ul className="px-6 pb-4 space-y-2">
                  {tips.map((tip, index) => (
                    <li 
                      key={index}
                      className="text-sm text-gray-600 dark:text-gray-400 flex items-start"
                    >
                      <span className="text-blue-500 mr-2">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

### Step 3: AI Feedback Panel

```tsx
// src/app/practice/writing/components/AiFeedbackPanel.tsx
'use client';

import { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb, 
  ChevronDown,
  ChevronUp,
  FileText,
  Link as LinkIcon,
  BookOpen,
  Pen,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface GrammarError {
  text: string;
  suggestion: string;
  type: 'grammar' | 'spelling' | 'punctuation' | 'style';
  position: { start: number; end: number };
}

interface WritingScore {
  overall: number;
  taskAchievement: number;
  coherenceCohesion: number;
  lexicalResource: number;
  grammaticalRange: number;
}

interface AiFeedbackProps {
  isLoading?: boolean;
  score?: WritingScore;
  feedback?: string;
  suggestions?: string[];
  grammarErrors?: GrammarError[];
  onHighlightError?: (error: GrammarError) => void;
}

export default function AiFeedbackPanel({
  isLoading = false,
  score,
  feedback,
  suggestions = [],
  grammarErrors = [],
  onHighlightError,
}: AiFeedbackProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('score');

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            AI đang chấm bài viết của bạn...
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Thường mất khoảng 5-10 giây
          </p>
        </div>
      </div>
    );
  }

  if (!score) {
    return null;
  }

  const criteriaLabels = [
    { key: 'taskAchievement', label: 'Task Achievement', icon: FileText },
    { key: 'coherenceCohesion', label: 'Coherence & Cohesion', icon: LinkIcon },
    { key: 'lexicalResource', label: 'Lexical Resource', icon: BookOpen },
    { key: 'grammaticalRange', label: 'Grammatical Range', icon: Pen },
  ];

  const getScoreColor = (value: number) => {
    if (value >= 8) return 'text-green-500 bg-green-100 dark:bg-green-900/30';
    if (value >= 6) return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
    return 'text-red-500 bg-red-100 dark:bg-red-900/30';
  };

  const getErrorTypeLabel = (type: GrammarError['type']) => {
    const labels = {
      grammar: { text: 'Ngữ pháp', color: 'text-red-500 bg-red-100' },
      spelling: { text: 'Chính tả', color: 'text-orange-500 bg-orange-100' },
      punctuation: { text: 'Dấu câu', color: 'text-yellow-500 bg-yellow-100' },
      style: { text: 'Văn phong', color: 'text-blue-500 bg-blue-100' },
    };
    return labels[type];
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Overall Score */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Kết quả AI Scoring
          </h3>
          <div className={cn(
            'text-3xl font-bold px-4 py-2 rounded-lg',
            getScoreColor(score.overall)
          )}>
            {score.overall}/10
          </div>
        </div>

        {/* Criteria Scores */}
        <div className="grid grid-cols-2 gap-3">
          {criteriaLabels.map(({ key, label, icon: Icon }) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
            >
              <div className="flex items-center">
                <Icon className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {label}
                </span>
              </div>
              <span className={cn(
                'font-semibold',
                getScoreColor(score[key as keyof WritingScore] as number)
              )}>
                {score[key as keyof WritingScore]}/10
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Section */}
      <CollapsibleSection
        title="Nhận xét tổng quan"
        icon={CheckCircle2}
        isExpanded={expandedSection === 'feedback'}
        onToggle={() => setExpandedSection(
          expandedSection === 'feedback' ? null : 'feedback'
        )}
      >
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {feedback}
        </p>
      </CollapsibleSection>

      {/* Grammar Errors */}
      {grammarErrors.length > 0 && (
        <CollapsibleSection
          title={`Lỗi ngữ pháp (${grammarErrors.length})`}
          icon={AlertCircle}
          iconColor="text-red-500"
          isExpanded={expandedSection === 'errors'}
          onToggle={() => setExpandedSection(
            expandedSection === 'errors' ? null : 'errors'
          )}
        >
          <div className="space-y-3">
            {grammarErrors.map((error, index) => {
              const typeLabel = getErrorTypeLabel(error.type);
              return (
                <div
                  key={index}
                  onClick={() => onHighlightError?.(error)}
                  className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded',
                        typeLabel.color
                      )}>
                        {typeLabel.text}
                      </span>
                      <p className="mt-1 text-red-600 dark:text-red-400 line-through">
                        "{error.text}"
                      </p>
                      <p className="mt-1 text-green-600 dark:text-green-400">
                        → "{error.suggestion}"
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CollapsibleSection>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <CollapsibleSection
          title="Gợi ý cải thiện"
          icon={Lightbulb}
          iconColor="text-yellow-500"
          isExpanded={expandedSection === 'suggestions'}
          onToggle={() => setExpandedSection(
            expandedSection === 'suggestions' ? null : 'suggestions'
          )}
        >
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="flex items-start text-gray-700 dark:text-gray-300"
              >
                <span className="text-yellow-500 mr-2">💡</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </CollapsibleSection>
      )}
    </div>
  );
}

// Collapsible section component
interface CollapsibleSectionProps {
  title: string;
  icon: React.ElementType;
  iconColor?: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function CollapsibleSection({
  title,
  icon: Icon,
  iconColor = 'text-gray-500',
  isExpanded,
  onToggle,
  children,
}: CollapsibleSectionProps) {
  return (
    <div className="border-t border-gray-200 dark:border-gray-700">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <div className="flex items-center">
          <Icon className={cn('w-5 h-5 mr-2', iconColor)} />
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {title}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isExpanded && (
        <div className="px-6 pb-4">
          {children}
        </div>
      )}
    </div>
  );
}
```

### Step 4: Writing Practice Page

```tsx
// src/app/practice/writing/[sessionId]/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePracticeSession } from '@/hooks/usePracticeSession';
import { practiceService } from '@/services/practiceService';
import WritingEditor from '../components/WritingEditor';
import TaskPrompt from '../components/TaskPrompt';
import AiFeedbackPanel from '../components/AiFeedbackPanel';
import ReadingToolbar from '@/app/practice/reading/components/ReadingToolbar';
import { Loader2, Send, Save } from 'lucide-react';

export default function WritingPracticePage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();
  
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [isScoring, setIsScoring] = useState(false);

  const {
    session,
    questions,
    currentQuestion,
    isLoading,
    error,
    timeSpent,
    progress,
    loadSession,
    submitAnswer,
    pauseSession,
    resumeSession,
    completeSession,
  } = usePracticeSession({
    onSessionEnd: (session) => {
      router.push(`/practice/writing/${session.id}/result`);
    },
  });

  useEffect(() => {
    if (sessionId) {
      loadSession(sessionId);
    }
  }, [sessionId, loadSession]);

  // Handle content change
  const handleContentChange = useCallback((html: string, words: number) => {
    setContent(html);
    setWordCount(words);
  }, []);

  // Handle draft save
  const handleSave = useCallback(async (html: string) => {
    if (!session?.id || !currentQuestion?.id) return;
    
    try {
      await practiceService.saveDraftAnswer(session.id, currentQuestion.id, html);
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }, [session?.id, currentQuestion?.id]);

  // Submit for AI scoring
  const handleSubmitForScoring = useCallback(async () => {
    if (!session?.id || !currentQuestion?.id || !content) return;
    
    setIsSubmitting(true);
    setIsScoring(true);

    try {
      // Submit answer
      await submitAnswer({
        questionId: currentQuestion.id,
        answer: content,
        timeSpent,
      });

      // Queue for AI scoring
      const { jobId } = await practiceService.queueWritingForScoring(
        session.id,
        currentQuestion.id,
        content
      );

      // Poll for result
      const result = await pollForResult(jobId);
      setAiResult(result);
    } catch (error) {
      console.error('Scoring failed:', error);
    } finally {
      setIsSubmitting(false);
      setIsScoring(false);
    }
  }, [session?.id, currentQuestion?.id, content, timeSpent, submitAnswer]);

  // Poll for AI result
  const pollForResult = async (jobId: string): Promise<any> => {
    const maxAttempts = 30; // 30 seconds max
    let attempts = 0;

    while (attempts < maxAttempts) {
      const status = await practiceService.getAiJobStatus(jobId);
      
      if (status.status === 'completed') {
        return JSON.parse(status.result);
      }
      
      if (status.status === 'failed') {
        throw new Error(status.errorMessage);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    throw new Error('Scoring timeout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !session || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Session not found'}</p>
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

  const isPaused = session.status === 'paused';
  const taskType = currentQuestion.partNumber === 1 ? 'task1' : 'task2';
  const wordLimit = taskType === 'task1' 
    ? { min: 150, max: 200 } 
    : { min: 250, max: 300 };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Toolbar */}
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <ReadingToolbar
          timeSpent={timeSpent}
          timeLimit={session.timeLimit || undefined}
          isPaused={isPaused}
          progress={{
            answered: wordCount >= wordLimit.min ? 1 : 0,
            flagged: 0,
            total: 1,
          }}
          onPause={pauseSession}
          onResume={resumeSession}
          onSubmit={handleSubmitForScoring}
          onExit={async () => {
            await handleSave(content);
            router.push('/practice');
          }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Task & Editor */}
          <div className="lg:col-span-2 space-y-6">
            <TaskPrompt
              title={currentQuestion.content}
              content={currentQuestion.context || ''}
              taskType={taskType}
              timeLimit={taskType === 'task1' ? 20 : 40}
              wordLimit={wordLimit}
              tips={[
                'Đọc kỹ yêu cầu đề bài trước khi viết',
                'Lập dàn ý trước khi bắt đầu viết',
                'Kiểm tra lỗi chính tả và ngữ pháp trước khi nộp',
              ]}
            />

            <WritingEditor
              initialContent=""
              placeholder="Bắt đầu viết bài của bạn ở đây..."
              minWords={wordLimit.min}
              maxWords={wordLimit.max}
              disabled={isPaused || !!aiResult}
              onChange={handleContentChange}
              onSave={handleSave}
              autoSaveInterval={30000}
            />

            {/* Submit Button */}
            {!aiResult && (
              <button
                onClick={handleSubmitForScoring}
                disabled={isSubmitting || wordCount < wordLimit.min}
                className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Đang chấm bài...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Nộp bài và nhận kết quả AI
                  </>
                )}
              </button>
            )}
          </div>

          {/* Right: AI Feedback */}
          <div className="lg:col-span-1">
            <AiFeedbackPanel
              isLoading={isScoring}
              score={aiResult?.score}
              feedback={aiResult?.feedback}
              suggestions={aiResult?.suggestions}
              grammarErrors={aiResult?.grammarErrors}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## ✅ Acceptance Criteria

- [ ] Rich text editor với formatting tools
- [ ] Word count hiển thị real-time
- [ ] Auto-save draft mỗi 30 giây
- [ ] Task prompt collapsible với tips
- [ ] Submit triggers AI scoring
- [ ] AI feedback panel hiển thị đầy đủ
- [ ] Grammar errors clickable
- [ ] Score breakdown theo 4 tiêu chí

---

## 📦 Dependencies

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-character-count @tiptap/extension-underline
```

---

## ⏭️ Next Task

→ `FE-014_RESULT_SUMMARY.md` - Result Summary Page

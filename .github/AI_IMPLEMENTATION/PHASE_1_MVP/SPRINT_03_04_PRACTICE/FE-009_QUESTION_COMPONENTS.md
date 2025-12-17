# FE-009: Question Components

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | FE-009 |
| **Phase** | 1 - MVP |
| **Sprint** | 3-4 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 6h |
| **Dependencies** | FE-008 |

---

## ⚠️ QUAN TRỌNG - Đọc trước khi implement

> **Existing files:**
> - `components/practice/questions/` - ❌ Chưa có - **CẦN TẠO MỚI**
> - Question components là reusable, cần tạo mới

**Action:**
- ✅ CREATE reusable question components (cần thiết)
- ✅ Sử dụng shadcn/ui components có sẵn (RadioGroup, Checkbox, Input, etc.)

---

## 🎯 Objective

Implement reusable Question components:
- Multiple choice question
- True/False/Not Given
- Matching question
- Fill in the blank
- Short answer
- Essay question

---

## 💻 Implementation

### File Structure

```
src/components/practice/questions/
├── index.ts
├── QuestionRenderer.tsx
├── MultipleChoiceQuestion.tsx
├── TrueFalseQuestion.tsx
├── MatchingQuestion.tsx
├── FillBlankQuestion.tsx
├── ShortAnswerQuestion.tsx
├── EssayQuestion.tsx
└── QuestionWrapper.tsx
```

### Step 1: Question Wrapper

```tsx
// src/components/practice/questions/QuestionWrapper.tsx
'use client';

import { ReactNode } from 'react';
import { Flag, Check } from 'lucide-react';
import { Question } from '@/types/practice.types';
import { cn } from '@/lib/utils';

interface QuestionWrapperProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  isFlagged?: boolean;
  isAnswered?: boolean;
  showResult?: boolean;
  isCorrect?: boolean;
  onFlag?: () => void;
  children: ReactNode;
}

export default function QuestionWrapper({
  question,
  questionNumber,
  totalQuestions,
  isFlagged = false,
  isAnswered = false,
  showResult = false,
  isCorrect,
  onFlag,
  children,
}: QuestionWrapperProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium">
            {questionNumber}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            / {totalQuestions}
          </span>
          
          {/* Status indicators */}
          {showResult && (
            <span className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              isCorrect 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            )}>
              {isCorrect ? 'Đúng' : 'Sai'}
            </span>
          )}
          
          {isAnswered && !showResult && (
            <Check className="w-4 h-4 text-green-500" />
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Points */}
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {question.points} điểm
          </span>
          
          {/* Flag button */}
          {onFlag && (
            <button
              onClick={onFlag}
              className={cn(
                'p-2 rounded-lg transition-colors',
                isFlagged
                  ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400'
              )}
              title={isFlagged ? 'Bỏ đánh dấu' : 'Đánh dấu câu hỏi'}
            >
              <Flag className="w-4 h-4" fill={isFlagged ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>
      </div>

      {/* Question Content */}
      <div className="p-6">
        {/* Question Text */}
        <div 
          className="prose dark:prose-invert max-w-none mb-6"
          dangerouslySetInnerHTML={{ __html: question.content }}
        />

        {/* Question Image */}
        {question.imageUrl && (
          <div className="mb-6">
            <img
              src={question.imageUrl}
              alt="Question image"
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        )}

        {/* Answer Section */}
        {children}

        {/* Explanation (shown after answer) */}
        {showResult && question.explanation && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
              Giải thích
            </h4>
            <div 
              className="text-sm text-blue-700 dark:text-blue-400"
              dangerouslySetInnerHTML={{ __html: question.explanation }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
```

### Step 2: Multiple Choice Question

```tsx
// src/components/practice/questions/MultipleChoiceQuestion.tsx
'use client';

import { Question, QuestionOption } from '@/types/practice.types';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface MultipleChoiceQuestionProps {
  question: Question;
  selectedOptionId?: string;
  onSelect: (optionId: string) => void;
  showResult?: boolean;
  disabled?: boolean;
}

export default function MultipleChoiceQuestion({
  question,
  selectedOptionId,
  onSelect,
  showResult = false,
  disabled = false,
}: MultipleChoiceQuestionProps) {
  const options = question.options || [];

  const getOptionState = (option: QuestionOption) => {
    if (!showResult) {
      return selectedOptionId === option.id ? 'selected' : 'default';
    }
    
    if (option.isCorrect) {
      return 'correct';
    }
    
    if (selectedOptionId === option.id && !option.isCorrect) {
      return 'incorrect';
    }
    
    return 'default';
  };

  return (
    <div className="space-y-3">
      {options.map((option) => {
        const state = getOptionState(option);
        
        return (
          <button
            key={option.id}
            onClick={() => !disabled && onSelect(option.id)}
            disabled={disabled}
            className={cn(
              'w-full flex items-start p-4 rounded-lg border-2 text-left transition-all',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              {
                'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/10':
                  state === 'default' && !disabled,
                'border-blue-500 bg-blue-50 dark:bg-blue-900/20':
                  state === 'selected',
                'border-green-500 bg-green-50 dark:bg-green-900/20':
                  state === 'correct',
                'border-red-500 bg-red-50 dark:bg-red-900/20':
                  state === 'incorrect',
                'cursor-not-allowed opacity-60': disabled,
              }
            )}
          >
            {/* Option Label */}
            <span
              className={cn(
                'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 font-medium',
                {
                  'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300':
                    state === 'default',
                  'bg-blue-500 text-white': state === 'selected',
                  'bg-green-500 text-white': state === 'correct',
                  'bg-red-500 text-white': state === 'incorrect',
                }
              )}
            >
              {state === 'correct' ? (
                <Check className="w-4 h-4" />
              ) : state === 'incorrect' ? (
                <X className="w-4 h-4" />
              ) : (
                option.label
              )}
            </span>

            {/* Option Content */}
            <div className="flex-1">
              <span className="text-gray-800 dark:text-gray-200">
                {option.content}
              </span>
              {option.imageUrl && (
                <img
                  src={option.imageUrl}
                  alt={`Option ${option.label}`}
                  className="mt-2 max-w-xs rounded"
                />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
```

### Step 3: True/False/Not Given Question

```tsx
// src/components/practice/questions/TrueFalseQuestion.tsx
'use client';

import { Question } from '@/types/practice.types';
import { cn } from '@/lib/utils';
import { Check, X, HelpCircle } from 'lucide-react';

interface TrueFalseQuestionProps {
  question: Question;
  selectedAnswer?: string;
  onSelect: (answer: string) => void;
  showResult?: boolean;
  disabled?: boolean;
}

const OPTIONS = [
  { value: 'TRUE', label: 'True', icon: Check, color: 'green' },
  { value: 'FALSE', label: 'False', icon: X, color: 'red' },
  { value: 'NOT_GIVEN', label: 'Not Given', icon: HelpCircle, color: 'gray' },
];

export default function TrueFalseQuestion({
  question,
  selectedAnswer,
  onSelect,
  showResult = false,
  disabled = false,
}: TrueFalseQuestionProps) {
  const correctAnswer = question.correctAnswer;

  const getOptionState = (value: string) => {
    if (!showResult) {
      return selectedAnswer === value ? 'selected' : 'default';
    }
    
    if (correctAnswer === value) {
      return 'correct';
    }
    
    if (selectedAnswer === value && correctAnswer !== value) {
      return 'incorrect';
    }
    
    return 'default';
  };

  return (
    <div className="flex flex-wrap gap-3">
      {OPTIONS.map(({ value, label, icon: Icon, color }) => {
        const state = getOptionState(value);
        
        return (
          <button
            key={value}
            onClick={() => !disabled && onSelect(value)}
            disabled={disabled}
            className={cn(
              'flex items-center px-6 py-3 rounded-lg border-2 font-medium transition-all',
              'focus:outline-none focus:ring-2 focus:ring-blue-500',
              {
                'border-gray-200 dark:border-gray-700 hover:border-blue-300':
                  state === 'default' && !disabled,
                'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700':
                  state === 'selected',
                'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700':
                  state === 'correct',
                'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700':
                  state === 'incorrect',
                'cursor-not-allowed opacity-60': disabled,
              }
            )}
          >
            <Icon className={cn('w-5 h-5 mr-2', {
              'text-green-500': color === 'green',
              'text-red-500': color === 'red',
              'text-gray-500': color === 'gray',
            })} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
```

### Step 4: Fill in the Blank Question

```tsx
// src/components/practice/questions/FillBlankQuestion.tsx
'use client';

import { useState, useEffect } from 'react';
import { Question } from '@/types/practice.types';
import { cn } from '@/lib/utils';

interface FillBlankQuestionProps {
  question: Question;
  answers?: Record<number, string>;
  onChange: (answers: Record<number, string>) => void;
  showResult?: boolean;
  disabled?: boolean;
}

export default function FillBlankQuestion({
  question,
  answers = {},
  onChange,
  showResult = false,
  disabled = false,
}: FillBlankQuestionProps) {
  const [localAnswers, setLocalAnswers] = useState<Record<number, string>>(answers);

  // Parse content to find blanks (marked as ___1___, ___2___, etc.)
  const parseContent = (content: string) => {
    const parts: (string | { index: number })[] = [];
    const regex = /___(\d+)___/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index));
      }
      parts.push({ index: parseInt(match[1], 10) });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    return parts;
  };

  const parts = parseContent(question.content);
  
  // Get correct answers (format: "1:answer1|2:answer2")
  const correctAnswers: Record<number, string> = {};
  if (question.correctAnswer) {
    question.correctAnswer.split('|').forEach((pair) => {
      const [index, answer] = pair.split(':');
      correctAnswers[parseInt(index, 10)] = answer;
    });
  }

  const handleChange = (index: number, value: string) => {
    const newAnswers = { ...localAnswers, [index]: value };
    setLocalAnswers(newAnswers);
    onChange(newAnswers);
  };

  const isCorrect = (index: number) => {
    if (!showResult) return undefined;
    const userAnswer = localAnswers[index]?.toLowerCase().trim();
    const correct = correctAnswers[index]?.toLowerCase().trim();
    return userAnswer === correct;
  };

  return (
    <div className="prose dark:prose-invert max-w-none">
      <p className="leading-relaxed">
        {parts.map((part, i) => {
          if (typeof part === 'string') {
            return <span key={i}>{part}</span>;
          }

          const { index } = part;
          const correct = isCorrect(index);

          return (
            <span key={i} className="inline-flex items-center mx-1">
              <input
                type="text"
                value={localAnswers[index] || ''}
                onChange={(e) => handleChange(index, e.target.value)}
                disabled={disabled}
                placeholder={`(${index})`}
                className={cn(
                  'inline-block w-32 px-3 py-1 border-2 rounded-md text-center',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500',
                  {
                    'border-gray-300 dark:border-gray-600 dark:bg-gray-700':
                      correct === undefined,
                    'border-green-500 bg-green-50 dark:bg-green-900/20':
                      correct === true,
                    'border-red-500 bg-red-50 dark:bg-red-900/20':
                      correct === false,
                  }
                )}
              />
              {showResult && correct === false && (
                <span className="ml-2 text-sm text-green-600 dark:text-green-400">
                  ({correctAnswers[index]})
                </span>
              )}
            </span>
          );
        })}
      </p>
    </div>
  );
}
```

### Step 5: Short Answer Question

```tsx
// src/components/practice/questions/ShortAnswerQuestion.tsx
'use client';

import { useState } from 'react';
import { Question } from '@/types/practice.types';
import { cn } from '@/lib/utils';

interface ShortAnswerQuestionProps {
  question: Question;
  answer?: string;
  onChange: (answer: string) => void;
  showResult?: boolean;
  disabled?: boolean;
}

export default function ShortAnswerQuestion({
  question,
  answer = '',
  onChange,
  showResult = false,
  disabled = false,
}: ShortAnswerQuestionProps) {
  const correctAnswer = question.correctAnswer;
  const isCorrect = showResult && answer.toLowerCase().trim() === correctAnswer?.toLowerCase().trim();

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={answer}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Nhập câu trả lời của bạn..."
          className={cn(
            'w-full px-4 py-3 border-2 rounded-lg text-lg',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
            'dark:bg-gray-700 dark:text-white',
            {
              'border-gray-300 dark:border-gray-600': !showResult,
              'border-green-500 bg-green-50 dark:bg-green-900/20': showResult && isCorrect,
              'border-red-500 bg-red-50 dark:bg-red-900/20': showResult && !isCorrect,
            }
          )}
        />
        
        {question.wordLimit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
            Tối đa {question.wordLimit} từ
          </span>
        )}
      </div>

      {showResult && !isCorrect && correctAnswer && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <span className="text-sm text-green-700 dark:text-green-400">
            Đáp án đúng: <strong>{correctAnswer}</strong>
          </span>
        </div>
      )}
    </div>
  );
}
```

### Step 6: Essay Question

```tsx
// src/components/practice/questions/EssayQuestion.tsx
'use client';

import { useState, useEffect } from 'react';
import { Question } from '@/types/practice.types';
import { cn } from '@/lib/utils';

interface EssayQuestionProps {
  question: Question;
  answer?: string;
  onChange: (answer: string) => void;
  showResult?: boolean;
  disabled?: boolean;
  aiScore?: {
    overall: number;
    taskAchievement: number;
    coherenceCohesion: number;
    lexicalResource: number;
    grammaticalRange: number;
    feedback?: string;
  };
}

export default function EssayQuestion({
  question,
  answer = '',
  onChange,
  showResult = false,
  disabled = false,
  aiScore,
}: EssayQuestionProps) {
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    const words = answer.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
  }, [answer]);

  const wordLimit = question.wordLimit || 250;
  const isOverLimit = wordCount > wordLimit;
  const isUnderMinimum = wordCount < wordLimit * 0.8;

  return (
    <div className="space-y-4">
      {/* Task/Prompt */}
      {question.context && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Yêu cầu:</h4>
          <div 
            className="text-gray-700 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: question.context }}
          />
        </div>
      )}

      {/* Text Area */}
      <div className="relative">
        <textarea
          value={answer}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          rows={15}
          placeholder="Viết bài luận của bạn ở đây..."
          className={cn(
            'w-full px-4 py-3 border-2 rounded-lg resize-none',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
            'dark:bg-gray-700 dark:text-white',
            'font-serif text-lg leading-relaxed',
            {
              'border-gray-300 dark:border-gray-600': !isOverLimit,
              'border-yellow-500': isOverLimit,
            }
          )}
        />
      </div>

      {/* Word Count */}
      <div className="flex items-center justify-between text-sm">
        <span className={cn(
          'font-medium',
          {
            'text-gray-500': !isOverLimit && !isUnderMinimum,
            'text-yellow-600': isUnderMinimum,
            'text-red-600': isOverLimit,
          }
        )}>
          {wordCount} / {wordLimit} từ
        </span>
        
        {isUnderMinimum && !showResult && (
          <span className="text-yellow-600">
            Nên viết ít nhất {Math.floor(wordLimit * 0.8)} từ
          </span>
        )}
        {isOverLimit && (
          <span className="text-red-600">
            Vượt quá giới hạn từ
          </span>
        )}
      </div>

      {/* AI Score Results */}
      {showResult && aiScore && (
        <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
            Kết quả chấm AI
          </h4>
          
          {/* Overall Score */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {aiScore.overall.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <ScoreBar label="Task Achievement" score={aiScore.taskAchievement} max={10} />
            <ScoreBar label="Coherence & Cohesion" score={aiScore.coherenceCohesion} max={10} />
            <ScoreBar label="Lexical Resource" score={aiScore.lexicalResource} max={10} />
            <ScoreBar label="Grammatical Range" score={aiScore.grammaticalRange} max={10} />
          </div>

          {/* Feedback */}
          {aiScore.feedback && (
            <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
              <h5 className="font-medium mb-2">Nhận xét:</h5>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {aiScore.feedback}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ScoreBar({ label, score, max }: { label: string; score: number; max: number }) {
  const percentage = (score / max) * 100;
  
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span className="font-medium">{score.toFixed(1)}/{max}</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
```

### Step 7: Question Renderer

```tsx
// src/components/practice/questions/QuestionRenderer.tsx
'use client';

import { Question, SubmitAnswerRequest } from '@/types/practice.types';
import QuestionWrapper from './QuestionWrapper';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import TrueFalseQuestion from './TrueFalseQuestion';
import FillBlankQuestion from './FillBlankQuestion';
import ShortAnswerQuestion from './ShortAnswerQuestion';
import EssayQuestion from './EssayQuestion';

interface QuestionRendererProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  currentAnswer?: SubmitAnswerRequest;
  onAnswer: (answer: Partial<SubmitAnswerRequest>) => void;
  onFlag?: () => void;
  showResult?: boolean;
  isCorrect?: boolean;
  disabled?: boolean;
}

export default function QuestionRenderer({
  question,
  questionNumber,
  totalQuestions,
  currentAnswer,
  onAnswer,
  onFlag,
  showResult = false,
  isCorrect,
  disabled = false,
}: QuestionRendererProps) {
  const renderQuestionContent = () => {
    switch (question.type) {
      case 'multiple_choice':
        return (
          <MultipleChoiceQuestion
            question={question}
            selectedOptionId={currentAnswer?.selectedOptionId}
            onSelect={(optionId) => onAnswer({ selectedOptionId: optionId })}
            showResult={showResult}
            disabled={disabled}
          />
        );

      case 'true_false_ng':
        return (
          <TrueFalseQuestion
            question={question}
            selectedAnswer={currentAnswer?.answer}
            onSelect={(answer) => onAnswer({ answer })}
            showResult={showResult}
            disabled={disabled}
          />
        );

      case 'fill_blank':
        return (
          <FillBlankQuestion
            question={question}
            answers={currentAnswer?.answer ? JSON.parse(currentAnswer.answer) : {}}
            onChange={(answers) => onAnswer({ answer: JSON.stringify(answers) })}
            showResult={showResult}
            disabled={disabled}
          />
        );

      case 'short_answer':
        return (
          <ShortAnswerQuestion
            question={question}
            answer={currentAnswer?.answer}
            onChange={(answer) => onAnswer({ answer })}
            showResult={showResult}
            disabled={disabled}
          />
        );

      case 'essay':
        return (
          <EssayQuestion
            question={question}
            answer={currentAnswer?.answer}
            onChange={(answer) => onAnswer({ answer })}
            showResult={showResult}
            disabled={disabled}
          />
        );

      default:
        return (
          <div className="text-gray-500">
            Loại câu hỏi không được hỗ trợ: {question.type}
          </div>
        );
    }
  };

  const isAnswered = !!(currentAnswer?.answer || currentAnswer?.selectedOptionId);

  return (
    <QuestionWrapper
      question={question}
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      isFlagged={currentAnswer?.isFlagged}
      isAnswered={isAnswered}
      showResult={showResult}
      isCorrect={isCorrect}
      onFlag={onFlag}
    >
      {renderQuestionContent()}
    </QuestionWrapper>
  );
}
```

### Step 8: Index Export

```typescript
// src/components/practice/questions/index.ts
export { default as QuestionRenderer } from './QuestionRenderer';
export { default as QuestionWrapper } from './QuestionWrapper';
export { default as MultipleChoiceQuestion } from './MultipleChoiceQuestion';
export { default as TrueFalseQuestion } from './TrueFalseQuestion';
export { default as FillBlankQuestion } from './FillBlankQuestion';
export { default as ShortAnswerQuestion } from './ShortAnswerQuestion';
export { default as EssayQuestion } from './EssayQuestion';
```

---

## ✅ Acceptance Criteria

- [ ] Multiple choice renders correctly
- [ ] True/False/NG works
- [ ] Fill blank parses and tracks answers
- [ ] Short answer input functional
- [ ] Essay với word count
- [ ] Result states shown correctly
- [ ] Flag functionality works
- [ ] All components are accessible

---

## ⏭️ Next Task

→ `FE-010_READING_PAGE.md` - Reading Practice Page

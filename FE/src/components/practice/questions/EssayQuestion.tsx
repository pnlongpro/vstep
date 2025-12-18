'use client';

import { useState, useEffect, useCallback } from 'react';
import { Question } from '@/types/practice';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface EssayQuestionProps {
  question: Question;
  answer?: string;
  onChange: (answer: string) => void;
  onAutoSave?: (answer: string) => void;
  showResult?: boolean;
  disabled?: boolean;
}

export default function EssayQuestion({
  question,
  answer = '',
  onChange,
  onAutoSave,
  showResult = false,
  disabled = false,
}: EssayQuestionProps) {
  const [localAnswer, setLocalAnswer] = useState(answer);
  const wordCount = localAnswer.trim().split(/\s+/).filter((word) => word.length > 0).length;
  const wordLimit = question.wordLimit || 250;

  // Debounced auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localAnswer !== answer) {
        onChange(localAnswer);
        onAutoSave?.(localAnswer);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [localAnswer, answer, onChange, onAutoSave]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalAnswer(e.target.value);
  }, []);

  const isOverLimit = wordCount > wordLimit;

  return (
    <div className="space-y-4">
      <Textarea
        value={localAnswer}
        onChange={handleChange}
        placeholder="Viết bài luận của bạn ở đây..."
        disabled={disabled || showResult}
        rows={12}
        className={cn('w-full resize-none', isOverLimit && 'border-yellow-500')}
      />

      <div className="flex items-center justify-between text-sm">
        <span className={cn('text-gray-500', isOverLimit && 'text-yellow-600')}>
          {wordCount} / {wordLimit} từ
        </span>

        {isOverLimit && <span className="text-yellow-600">Bạn đã vượt quá giới hạn từ</span>}
      </div>

      {showResult && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-500">
            Bài viết của bạn đã được ghi nhận. Điểm số sẽ được cập nhật sau khi AI chấm bài.
          </p>
        </div>
      )}
    </div>
  );
}

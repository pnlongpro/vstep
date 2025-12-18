'use client';

import { Question } from '@/types/practice';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FillBlankQuestionProps {
  question: Question;
  answer?: string;
  onChange: (answer: string) => void;
  showResult?: boolean;
  disabled?: boolean;
}

export default function FillBlankQuestion({
  question,
  answer = '',
  onChange,
  showResult = false,
  disabled = false,
}: FillBlankQuestionProps) {
  const isCorrect = showResult && question.correctAnswer?.toLowerCase().trim() === answer.toLowerCase().trim();

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <span className="text-gray-600 dark:text-gray-400">Câu trả lời:</span>
        <Input
          value={answer}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Nhập câu trả lời..."
          disabled={disabled}
          className={cn(
            'max-w-md',
            showResult && (isCorrect ? 'border-green-500' : 'border-red-500'),
          )}
        />
      </div>

      {showResult && question.correctAnswer && (
        <div className="text-sm">
          <span className="text-gray-500">Đáp án đúng: </span>
          <span className="font-medium text-green-600 dark:text-green-400">{question.correctAnswer}</span>
        </div>
      )}
    </div>
  );
}

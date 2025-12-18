'use client';

import { ReactNode } from 'react';
import { Flag, Check } from 'lucide-react';
import { Question } from '@/types/practice';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
          <span className="text-sm text-gray-500 dark:text-gray-400">/ {totalQuestions}</span>

          {/* Status indicators */}
          {showResult && (
            <span
              className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
                isCorrect
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
              )}
            >
              {isCorrect ? 'Đúng' : 'Sai'}
            </span>
          )}

          {isAnswered && !showResult && <Check className="w-4 h-4 text-green-500" />}
        </div>

        <div className="flex items-center space-x-2">
          {onFlag && (
            <Button variant="ghost" size="sm" onClick={onFlag} className={cn(isFlagged && 'text-yellow-500')}>
              <Flag className="w-4 h-4" />
            </Button>
          )}
          <span className="text-xs text-gray-400">{question.points} điểm</span>
        </div>
      </div>

      {/* Question content */}
      <div className="p-6">
        <div className="mb-4">
          <p className="text-gray-900 dark:text-gray-100 text-base leading-relaxed">{question.content}</p>
          {question.context && <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">{question.context}</p>}
        </div>

        {/* Answer area */}
        <div className="mt-6">{children}</div>

        {/* Explanation (shown after submission) */}
        {showResult && question.explanation && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">Giải thích:</p>
            <p className="text-sm text-blue-800 dark:text-blue-400">{question.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}

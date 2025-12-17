'use client';

import { Question } from '@/types/practice';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface TrueFalseQuestionProps {
  question: Question;
  selectedAnswer?: string;
  onSelect: (answer: string) => void;
  showResult?: boolean;
  disabled?: boolean;
}

const OPTIONS = [
  { value: 'TRUE', label: 'True' },
  { value: 'FALSE', label: 'False' },
  { value: 'NOT_GIVEN', label: 'Not Given' },
];

export default function TrueFalseQuestion({
  question,
  selectedAnswer,
  onSelect,
  showResult = false,
  disabled = false,
}: TrueFalseQuestionProps) {
  const correctAnswer = question.correctAnswer;

  return (
    <RadioGroup value={selectedAnswer} onValueChange={onSelect} disabled={disabled} className="space-y-3">
      {OPTIONS.map((option) => {
        const isSelected = selectedAnswer === option.value;
        const isCorrect = correctAnswer === option.value;

        let optionStyle = 'border-gray-200 dark:border-gray-700';
        if (showResult) {
          if (isCorrect) {
            optionStyle = 'border-green-500 bg-green-50 dark:bg-green-900/20';
          } else if (isSelected && !isCorrect) {
            optionStyle = 'border-red-500 bg-red-50 dark:bg-red-900/20';
          }
        } else if (isSelected) {
          optionStyle = 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
        }

        return (
          <div
            key={option.value}
            className={cn(
              'flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors cursor-pointer',
              optionStyle,
              disabled ? 'cursor-not-allowed opacity-60' : 'hover:bg-gray-50 dark:hover:bg-gray-700',
            )}
            onClick={() => !disabled && onSelect(option.value)}
          >
            <RadioGroupItem value={option.value} id={option.value} />
            <Label htmlFor={option.value} className="flex-1 cursor-pointer text-gray-700 dark:text-gray-300">
              {option.label}
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );
}

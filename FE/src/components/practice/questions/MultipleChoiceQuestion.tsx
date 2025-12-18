'use client';

import { Question, QuestionOption } from '@/types/practice';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

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

  return (
    <RadioGroup value={selectedOptionId} onValueChange={onSelect} disabled={disabled} className="space-y-3">
      {options.map((option) => {
        const isSelected = selectedOptionId === option.id;
        const isCorrect = option.isCorrect;

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
            key={option.id}
            className={cn(
              'flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors cursor-pointer',
              optionStyle,
              disabled ? 'cursor-not-allowed opacity-60' : 'hover:bg-gray-50 dark:hover:bg-gray-700',
            )}
            onClick={() => !disabled && onSelect(option.id)}
          >
            <RadioGroupItem value={option.id} id={option.id} />
            <Label htmlFor={option.id} className="flex-1 cursor-pointer">
              <span className="font-medium text-gray-900 dark:text-gray-100 mr-2">{option.label}.</span>
              <span className="text-gray-700 dark:text-gray-300">{option.content}</span>
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );
}

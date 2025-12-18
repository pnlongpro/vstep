'use client';

import { Question } from '@/types/practice';
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
  answer?: string;
  selectedOptionId?: string;
  isFlagged?: boolean;
  isAnswered?: boolean;
  showResult?: boolean;
  isCorrect?: boolean;
  onAnswer: (answer: string) => void;
  onSelectOption?: (optionId: string) => void;
  onFlag?: () => void;
  onAutoSave?: (answer: string) => void;
  disabled?: boolean;
}

export default function QuestionRenderer({
  question,
  questionNumber,
  totalQuestions,
  answer,
  selectedOptionId,
  isFlagged = false,
  isAnswered = false,
  showResult = false,
  isCorrect,
  onAnswer,
  onSelectOption,
  onFlag,
  onAutoSave,
  disabled = false,
}: QuestionRendererProps) {
  const renderQuestionContent = () => {
    switch (question.type) {
      case 'multiple_choice':
        return (
          <MultipleChoiceQuestion
            question={question}
            selectedOptionId={selectedOptionId}
            onSelect={(optionId) => {
              onSelectOption?.(optionId);
              onAnswer(optionId);
            }}
            showResult={showResult}
            disabled={disabled}
          />
        );

      case 'true_false_ng':
        return (
          <TrueFalseQuestion
            question={question}
            selectedAnswer={answer}
            onSelect={onAnswer}
            showResult={showResult}
            disabled={disabled}
          />
        );

      case 'fill_blank':
        return (
          <FillBlankQuestion
            question={question}
            answer={answer}
            onChange={onAnswer}
            showResult={showResult}
            disabled={disabled}
          />
        );

      case 'short_answer':
        return (
          <ShortAnswerQuestion
            question={question}
            answer={answer}
            onChange={onAnswer}
            showResult={showResult}
            disabled={disabled}
          />
        );

      case 'essay':
        return (
          <EssayQuestion
            question={question}
            answer={answer}
            onChange={onAnswer}
            onAutoSave={onAutoSave}
            showResult={showResult}
            disabled={disabled}
          />
        );

      default:
        return <div className="text-gray-500">Loại câu hỏi không được hỗ trợ</div>;
    }
  };

  return (
    <QuestionWrapper
      question={question}
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      isFlagged={isFlagged}
      isAnswered={isAnswered}
      showResult={showResult}
      isCorrect={isCorrect}
      onFlag={onFlag}
    >
      {renderQuestionContent()}
    </QuestionWrapper>
  );
}

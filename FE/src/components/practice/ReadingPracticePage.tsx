'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Question, Passage, PracticeSession } from '@/types/practice';
import { QuestionRenderer } from '@/components/practice/questions';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Clock, Flag } from 'lucide-react';
import { useSubmitAnswer, useCompleteSession, useScoreSession } from '@/hooks/usePractice';

interface ReadingPracticePageProps {
  session: PracticeSession;
  questions: Question[];
  passages?: Passage[];
}

export default function ReadingPracticePage({ session, questions, passages }: ReadingPracticePageProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(session.currentQuestionIndex || 0);
  const [answers, setAnswers] = useState<Record<string, { answer?: string; optionId?: string; flagged?: boolean }>>({});
  const [timeSpent, setTimeSpent] = useState(session.timeSpent || 0);

  const submitAnswer = useSubmitAnswer(session.id);
  const completeSession = useCompleteSession();
  const scoreSession = useScoreSession();

  const currentQuestion = questions[currentIndex];
  const currentPassage = passages?.find((p) => p.questions.some((q) => q.id === currentQuestion?.id));

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setTimeSpent((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: { ...prev[currentQuestion.id], answer } }));
    submitAnswer.mutate({ questionId: currentQuestion.id, answer });
  };

  const handleSelectOption = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: { ...prev[currentQuestion.id], optionId } }));
    submitAnswer.mutate({ questionId: currentQuestion.id, selectedOptionId: optionId });
  };

  const handleFlag = () => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: { ...prev[currentQuestion.id], flagged: !prev[currentQuestion.id]?.flagged },
    }));
  };

  const handleComplete = async () => {
    await completeSession.mutateAsync(session.id);
    await scoreSession.mutateAsync(session.id);
    router.push(`/practice/result/${session.id}`);
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) setCurrentIndex(index);
  };

  if (!currentQuestion) return <div>Không có câu hỏi</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="font-semibold">Reading Practice</span>
            <span className="text-sm text-gray-500">{session.level}</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeSpent)}</span>
            </div>
            <Button onClick={handleComplete} variant="default">
              Nộp bài
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Passage */}
          {currentPassage && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 overflow-auto max-h-[70vh]">
              <h3 className="text-lg font-semibold mb-4">{currentPassage.title || 'Reading Passage'}</h3>
              <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: currentPassage.content || '' }} />
            </div>
          )}

          {/* Question */}
          <div>
            <QuestionRenderer
              question={currentQuestion}
              questionNumber={currentIndex + 1}
              totalQuestions={questions.length}
              answer={answers[currentQuestion.id]?.answer}
              selectedOptionId={answers[currentQuestion.id]?.optionId}
              isFlagged={answers[currentQuestion.id]?.flagged}
              isAnswered={!!answers[currentQuestion.id]?.answer || !!answers[currentQuestion.id]?.optionId}
              onAnswer={handleAnswer}
              onSelectOption={handleSelectOption}
              onFlag={handleFlag}
            />

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <Button variant="outline" onClick={() => goToQuestion(currentIndex - 1)} disabled={currentIndex === 0}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Trước
              </Button>
              <div className="flex flex-wrap gap-2 max-w-md">
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToQuestion(i)}
                    className={`w-8 h-8 rounded text-sm font-medium ${
                      i === currentIndex
                        ? 'bg-blue-500 text-white'
                        : answers[questions[i].id]
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <Button variant="outline" onClick={() => goToQuestion(currentIndex + 1)} disabled={currentIndex === questions.length - 1}>
                Sau <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

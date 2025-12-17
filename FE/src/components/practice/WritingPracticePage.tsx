'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Question, PracticeSession } from '@/types/practice';
import { EssayQuestion } from '@/components/practice/questions';
import { Button } from '@/components/ui/button';
import { Clock, Save } from 'lucide-react';
import { useSubmitAnswer, useCompleteSession, useAutoSaveDraft, useDraft } from '@/hooks/usePractice';

interface WritingPracticePageProps {
  session: PracticeSession;
  questions: Question[];
}

export default function WritingPracticePage({ session, questions }: WritingPracticePageProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeSpent, setTimeSpent] = useState(session.timeSpent || 0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const currentQuestion = questions[currentIndex];
  const { data: draft } = useDraft(session.id, currentQuestion?.id);
  const submitAnswer = useSubmitAnswer(session.id);
  const completeSession = useCompleteSession();
  const autoSaveDraft = useAutoSaveDraft();

  // Load draft
  useEffect(() => {
    if (draft?.content && !answers[currentQuestion?.id]) {
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: draft.content }));
    }
  }, [draft, currentQuestion?.id]);

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

  const handleAnswer = useCallback((answer: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));
  }, [currentQuestion?.id]);

  const handleAutoSave = useCallback(async (answer: string) => {
    await autoSaveDraft.mutateAsync({
      sessionId: session.id,
      questionId: currentQuestion.id,
      content: answer,
    });
    setLastSaved(new Date());
  }, [session.id, currentQuestion?.id, autoSaveDraft]);

  const handleSubmit = async () => {
    // Submit all answers
    for (const [questionId, answer] of Object.entries(answers)) {
      await submitAnswer.mutateAsync({ questionId, answer });
    }
    await completeSession.mutateAsync(session.id);
    router.push(`/practice/result/${session.id}`);
  };

  if (!currentQuestion) return <div>Không có câu hỏi</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <span className="font-semibold">Writing Practice - {session.level}</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeSpent)}</span>
            </div>
            {lastSaved && (
              <div className="flex items-center space-x-1 text-sm text-green-600">
                <Save className="w-3 h-3" />
                <span>Đã lưu</span>
              </div>
            )}
            <Button onClick={handleSubmit}>Nộp bài</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Task tabs */}
        {questions.length > 1 && (
          <div className="flex space-x-2 mb-6">
            {questions.map((q, i) => (
              <Button
                key={q.id}
                variant={i === currentIndex ? 'default' : 'outline'}
                onClick={() => setCurrentIndex(i)}
              >
                Task {i + 1}
              </Button>
            ))}
          </div>
        )}

        {/* Task description */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold mb-2">Task {currentIndex + 1}</h3>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{currentQuestion.content}</p>
          {currentQuestion.context && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">{currentQuestion.context}</p>
            </div>
          )}
        </div>

        {/* Essay editor */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <EssayQuestion
            question={currentQuestion}
            answer={answers[currentQuestion.id] || ''}
            onChange={handleAnswer}
            onAutoSave={handleAutoSave}
          />
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Question, Passage, PracticeSession } from '@/types/practice';
import { QuestionRenderer } from '@/components/practice/questions';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ChevronLeft, ChevronRight, Clock, Play, Pause, Volume2 } from 'lucide-react';
import { useSubmitAnswer, useCompleteSession, useScoreSession } from '@/hooks/usePractice';

interface ListeningPracticePageProps {
  session: PracticeSession;
  questions: Question[];
  passages?: Passage[];
}

export default function ListeningPracticePage({ session, questions, passages }: ListeningPracticePageProps) {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { answer?: string; optionId?: string }>>({});
  const [timeSpent, setTimeSpent] = useState(session.timeSpent || 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [volume, setVolume] = useState(1);

  const submitAnswer = useSubmitAnswer(session.id);
  const completeSession = useCompleteSession();
  const scoreSession = useScoreSession();

  const currentQuestion = questions[currentIndex];
  const currentPassage = passages?.find((p) => p.questions.some((q) => q.id === currentQuestion?.id));
  const audioUrl = currentPassage?.audioUrl || currentQuestion?.audioUrl;

  useEffect(() => {
    const timer = setInterval(() => setTimeSpent((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setAudioProgress(progress);
    }
  };

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: { answer } }));
    submitAnswer.mutate({ questionId: currentQuestion.id, answer });
  };

  const handleSelectOption = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: { optionId } }));
    submitAnswer.mutate({ questionId: currentQuestion.id, selectedOptionId: optionId });
  };

  const handleComplete = async () => {
    await completeSession.mutateAsync(session.id);
    await scoreSession.mutateAsync(session.id);
    router.push(`/practice/result/${session.id}`);
  };

  if (!currentQuestion) return <div>Không có câu hỏi</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <span className="font-semibold">Listening Practice - {session.level}</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeSpent)}</span>
            </div>
            <Button onClick={handleComplete}>Nộp bài</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Audio Player */}
        {audioUrl && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
            <audio ref={audioRef} src={audioUrl} onTimeUpdate={handleTimeUpdate} onEnded={() => setIsPlaying(false)} />
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon" onClick={togglePlay}>
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <div className="flex-1">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${audioProgress}%` }} />
                </div>
              </div>
              <div className="flex items-center space-x-2 w-32">
                <Volume2 className="w-4 h-4" />
                <Slider value={[volume * 100]} onValueChange={(v) => setVolume(v[0] / 100)} max={100} step={1} />
              </div>
            </div>
          </div>
        )}

        {/* Question */}
        <QuestionRenderer
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          answer={answers[currentQuestion.id]?.answer}
          selectedOptionId={answers[currentQuestion.id]?.optionId}
          isAnswered={!!answers[currentQuestion.id]}
          onAnswer={handleAnswer}
          onSelectOption={handleSelectOption}
        />

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button variant="outline" onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))} disabled={currentIndex === 0}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Trước
          </Button>
          <span className="text-gray-500">{currentIndex + 1} / {questions.length}</span>
          <Button variant="outline" onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))} disabled={currentIndex === questions.length - 1}>
            Sau <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

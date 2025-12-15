import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Clock, Save, CheckCircle } from 'lucide-react';

interface ReadingExerciseProps {
  exercise: any;
  onSubmit: (answers: Record<number, string>, timeSpent: number) => void;
  onBack: () => void;
}

export function ReadingExercise({ exercise, onSubmit, onBack }: ReadingExerciseProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [showTimer, setShowTimer] = useState(true);
  const [autoSaved, setAutoSaved] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Auto-save every 10 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      localStorage.setItem(
        `reading_draft_${exercise.id}`,
        JSON.stringify({ answers, timeSpent })
      );
      setAutoSaved(true);
      setTimeout(() => setAutoSaved(false), 2000);
    }, 10000);

    return () => clearInterval(autoSaveInterval);
  }, [answers, timeSpent, exercise.id]);

  // Load draft
  useEffect(() => {
    const draft = localStorage.getItem(`reading_draft_${exercise.id}`);
    if (draft) {
      const { answers: savedAnswers, timeSpent: savedTime } = JSON.parse(draft);
      setAnswers(savedAnswers);
      setTimeSpent(savedTime);
    }
  }, [exercise.id]);

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleSubmit = () => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < exercise.questions.length) {
      const confirm = window.confirm(
        `Bạn mới trả lời ${answeredCount}/${exercise.questions.length} câu. Bạn có chắc muốn nộp bài?`
      );
      if (!confirm) return;
    }

    localStorage.removeItem(`reading_draft_${exercise.id}`);
    onSubmit(answers, timeSpent);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = exercise.questions.length;

  return (
    <>
      {/* Header - Sticky at top */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-20 z-40 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="size-5" />
            </button>
            <div>
              <h3 className="font-medium">{exercise.title}</h3>
              <p className="text-sm text-gray-600">
                {exercise.level} - {exercise.type.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {autoSaved && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Save className="size-4" />
                <span>Đã lưu</span>
              </div>
            )}

            {showTimer && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="size-4 text-gray-600" />
                <span>{formatTime(timeSpent)}</span>
              </div>
            )}

            <div className="text-sm text-gray-600">
              <span className="text-blue-600">{answeredCount}</span>/{totalQuestions}
            </div>

            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <CheckCircle className="size-4" />
              Nộp bài
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-24">
        {/* Left Column - Passage */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 lg:sticky lg:top-52 lg:self-start max-h-[calc(100vh-200px)] overflow-y-auto">
          <h4 className="mb-4 text-blue-600">Đọc đoạn văn</h4>
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-line leading-relaxed text-gray-700">
              {exercise.passage}
            </div>
          </div>
        </div>

        {/* Right Column - Questions */}
        <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pb-8 pt-4">
          {exercise.questions.map((question: any, index: number) => (
            <div
              key={index}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
            >
              <div className="flex items-start gap-3 mb-4">
                <span
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    answers[index]
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {index + 1}
                </span>
                <p className="flex-1">{question.question}</p>
              </div>

              <div className="space-y-2 ml-11">
                {question.options.map((option: string, optIndex: number) => {
                  const optionLetter = String.fromCharCode(65 + optIndex);
                  return (
                    <label
                      key={optIndex}
                      className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        answers[index] === optionLetter
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question_${index}`}
                        value={optionLetter}
                        checked={answers[index] === optionLetter}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        className="mt-1"
                      />
                      <span className="flex-1">
                        <span className="mr-2">{optionLetter}.</span>
                        {option}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
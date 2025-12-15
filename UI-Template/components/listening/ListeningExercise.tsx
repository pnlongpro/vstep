import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Clock, CheckCircle, Play, Pause, Volume2 } from 'lucide-react';

interface ListeningExerciseProps {
  exercise: any;
  onSubmit: (answers: Record<number, string>, timeSpent: number) => void;
  onBack: () => void;
}

export function ListeningExercise({ exercise, onSubmit, onBack }: ListeningExerciseProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  // Check if exercise has sections (Part 2 & 3)
  const hasSections = exercise.sections && exercise.sections.length > 0;
  
  // Get all questions (either from sections or direct)
  const allQuestions = hasSections 
    ? exercise.sections.flatMap((section: any) => section.questions)
    : exercise.questions;

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Update audio when section changes
  useEffect(() => {
    if (audioRef.current && hasSections) {
      audioRef.current.pause();
      audioRef.current.load();
      setIsPlaying(false);
    }
  }, [currentSectionIndex, hasSections]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      // Ignore AbortError when play is interrupted
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Audio playback error:', error);
      }
      setIsPlaying(false);
    }
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleSubmit = () => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < allQuestions.length) {
      const confirm = window.confirm(
        `Bạn mới trả lời ${answeredCount}/${allQuestions.length} câu. Bạn có chắc muốn nộp bài?`
      );
      if (!confirm) return;
    }

    onSubmit(answers, timeSpent);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = allQuestions.length;

  // Get color scheme based on exercise type
  const getColorScheme = () => {
    if (exercise.type === 'long') {
      return {
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-600',
        buttonBg: 'bg-purple-600',
        buttonHover: 'hover:bg-purple-700',
        gradient: 'from-purple-50 to-indigo-50',
        border: 'border-purple-200',
      };
    } else if (exercise.type === 'lecture') {
      return {
        bgColor: 'bg-pink-100',
        textColor: 'text-pink-600',
        buttonBg: 'bg-pink-600',
        buttonHover: 'hover:bg-pink-700',
        gradient: 'from-pink-50 to-purple-50',
        border: 'border-pink-200',
      };
    } else {
      return {
        bgColor: 'bg-green-100',
        textColor: 'text-green-600',
        buttonBg: 'bg-green-600',
        buttonHover: 'hover:bg-green-700',
        gradient: 'from-green-50 to-blue-50',
        border: 'border-green-200',
      };
    }
  };

  const colors = getColorScheme();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 sticky top-20 z-40">
        <div className="flex items-center justify-between mb-4">
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
            <div className="flex items-center gap-2 text-sm">
              <Clock className="size-4 text-gray-600" />
              <span>{formatTime(timeSpent)}</span>
            </div>

            <div className="text-sm text-gray-600">
              <span className="text-green-600">{answeredCount}</span>/{totalQuestions}
            </div>

            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <CheckCircle className="size-4" />
              Nộp bài
            </button>
          </div>
        </div>

        {/* Audio Player - For Part 1 (no sections) */}
        {!hasSections && (
          <div className={`bg-gradient-to-r ${colors.gradient} rounded-lg p-4 border ${colors.border}`}>
            <div className="flex items-center gap-4 mb-3">
              <button
                onClick={togglePlayPause}
                className={`flex-shrink-0 w-12 h-12 ${colors.buttonBg} text-white rounded-full flex items-center justify-center ${colors.buttonHover} transition-colors`}
              >
                {isPlaying ? <Pause className="size-5" /> : <Play className="size-5 ml-0.5" />}
              </button>

              <div className="flex-1">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span className="flex items-center gap-1">
                    <Volume2 className="size-4" />
                    Audio
                  </span>
                  <span>00:00 / {Math.floor(exercise.duration / 60)}:{(exercise.duration % 60).toString().padStart(2, '0')}</span>
                </div>
                <div className="h-2 bg-white rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${colors.buttonBg} transition-all`} style={{ width: '0%' }} />
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-600 text-center">
              Lưu ý: Bạn chỉ được nghe 1 lần
            </p>

            {exercise.audioUrl && (
              <audio ref={audioRef} src={exercise.audioUrl} preload="metadata" />
            )}
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-4 pb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 Bạn có thể trả lời câu hỏi trong khi nghe hoặc sau khi nghe xong
          </p>
        </div>

        {/* Render sections if available (Part 2 & 3) */}
        {hasSections ? (
          exercise.sections.map((section: any, sectionIndex: number) => {
            // Calculate question offset
            let questionOffset = 0;
            for (let i = 0; i < sectionIndex; i++) {
              questionOffset += exercise.sections[i].questions.length;
            }

            return (
              <div key={sectionIndex} className="space-y-4">
                {/* Audio Player for each section */}
                <div className={`bg-gradient-to-r ${colors.gradient} rounded-xl p-6 border-2 ${colors.border}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => {
                          setCurrentSectionIndex(sectionIndex);
                          setTimeout(() => togglePlayPause(), 100);
                        }}
                        className={`w-14 h-14 ${colors.bgColor} ${colors.buttonHover} rounded-full flex items-center justify-center transition-all border-2 ${
                          currentSectionIndex === sectionIndex && isPlaying
                            ? 'border-green-500'
                            : colors.border
                        }`}
                      >
                        {currentSectionIndex === sectionIndex && isPlaying ? (
                          <Pause className={`size-6 ${colors.textColor}`} />
                        ) : (
                          <Play className={`size-6 ${colors.textColor} ml-1`} />
                        )}
                      </button>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Volume2 className={`size-5 ${colors.textColor}`} />
                          <span className={`text-sm ${colors.textColor}`}>
                            Audio: {section.title}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          {currentSectionIndex === sectionIndex && isPlaying 
                            ? 'Đang phát...' 
                            : 'Bạn sẽ nghe audio 1 lần duy nhất'}
                        </p>
                      </div>
                    </div>
                    <div className={`text-sm ${colors.textColor}`}>
                      00:00 / 03:00
                    </div>
                  </div>
                  {currentSectionIndex === sectionIndex && (
                    <audio ref={audioRef} src={section.audioUrl} />
                  )}
                </div>

                {/* Section Header */}
                <div className={`${colors.bgColor} rounded-lg p-4`}>
                  <h4 className={`${colors.textColor}`}>
                    {section.title}
                  </h4>
                </div>

                {/* Section Questions */}
                {section.questions.map((question: any, qIndex: number) => {
                  const questionIndex = questionOffset + qIndex;
                  return (
                    <div
                      key={questionIndex}
                      className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <span
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                            answers[questionIndex]
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {questionIndex + 1}
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
                                answers[questionIndex] === optionLetter
                                  ? 'border-green-600 bg-green-50'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`question_${questionIndex}`}
                                value={optionLetter}
                                checked={answers[questionIndex] === optionLetter}
                                onChange={(e) => handleAnswerChange(questionIndex, e.target.value)}
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
                  );
                })}
              </div>
            );
          })
        ) : (
          // Render direct questions for Part 1
          allQuestions.map((question: any, index: number) => (
            <div
              key={index}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
            >
              <div className="flex items-start gap-3 mb-4">
                <span
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    answers[index]
                      ? 'bg-green-600 text-white'
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
                          ? 'border-green-600 bg-green-50'
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
          ))
        )}
      </div>
    </div>
  );
}
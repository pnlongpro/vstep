import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Headphones, Play, Pause, Volume2, Maximize, Minimize } from 'lucide-react';
import { ListeningResult } from './listening/ListeningResult';
import { listeningPartsConfig } from '../data/partsConfig';

interface ListeningPartPracticeProps {
  onBack: () => void;
  level: 'B1' | 'B2' | 'C1';
  part: 1 | 2 | 3; // Part được chọn
}

export function ListeningPartPractice({ onBack, level, part }: ListeningPartPracticeProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Debug log
  console.log('🎯 ListeningPartPractice rendered with:', { level, part });
  console.log('🔍 Listening Part Config:', listeningPartsConfig[part - 1]);

  const currentPartConfig = listeningPartsConfig[part - 1];
  const totalQuestions = currentPartConfig.questions;

  // Update audio source when section changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      setIsPlaying(false);
    }
  }, [currentSectionIndex]);

  // Calculate answered count
  const answeredCount = Object.keys(answers).length;

  const toggleAudio = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          await audioRef.current.play();
          setIsPlaying(true);
        }
      } catch (error) {
        // Ignore AbortError when play is interrupted
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Audio playback error:', error);
        }
        setIsPlaying(false);
      }
    }
  };

  // Handle submit
  const handleSubmit = () => {
    const mockExercise = {
      id: 999,
      title: `Listening ${currentPartConfig.label} - ${level}`,
      description: `${currentPartConfig.title}`,
      level: level,
      type: 'part-practice',
      duration: part === 1 ? 10 : part === 2 ? 15 : 15,
      questions: Array.from({ length: totalQuestions }, (_, i) => ({
        id: i,
        question: `Question ${i + 1}`,
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 'A',
        explanation: 'This is a sample explanation.',
      })),
    };

    const correct = Math.floor(totalQuestions * 0.7);
    const percentage = (correct / totalQuestions) * 100;
    let vstepScore = 0;

    if (percentage >= 90) vstepScore = 10;
    else if (percentage >= 80) vstepScore = 9;
    else if (percentage >= 70) vstepScore = 8;
    else if (percentage >= 60) vstepScore = 7;
    else if (percentage >= 50) vstepScore = 6;
    else if (percentage >= 40) vstepScore = 5;
    else vstepScore = 4;

    const resultData = {
      correct,
      total: totalQuestions,
      percentage,
      vstepScore,
      timeSpent: mockExercise.duration,
      details: mockExercise.questions.map((q, index) => ({
        questionIndex: index,
        question: q.question,
        userAnswer: answers[index] || '',
        correctAnswer: q.correctAnswer,
        isCorrect: index < correct,
        explanation: q.explanation,
      })),
      exercise: mockExercise,
    };

    setResult(resultData);
    setShowResult(true);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setAnswers({});
    setCurrentSectionIndex(0);
  };

  // Fullscreen functionality
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // If showing result
  if (showResult && result) {
    return (
      <ListeningResult
        result={result}
        onTryAgain={handleTryAgain}
        onBackToList={onBack}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="size-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${currentPartConfig.bgColor} rounded-xl flex items-center justify-center`}>
                  <Headphones className={`size-6 ${currentPartConfig.textColor}`} />
                </div>
                <div>
                  <h2 className="text-xl">Listening {currentPartConfig.label} - {level}</h2>
                  <p className="text-sm text-gray-600">{currentPartConfig.title}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Đã trả lời</div>
                <div className="text-xl">
                  <span className={answeredCount === totalQuestions ? 'text-green-600' : 'text-indigo-600'}>
                    {answeredCount}
                  </span>
                  <span className="text-gray-400">/{totalQuestions}</span>
                </div>
              </div>
              <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                {isFullscreen ? <Minimize className="size-5" /> : <Maximize className="size-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          {/* Part Info */}
          <div className="mb-6">
            <div className={`inline-flex items-center gap-2 px-4 py-2 ${currentPartConfig.bgColor} rounded-lg mb-3`}>
              <Headphones className={`size-5 ${currentPartConfig.textColor}`} />
              <span className={currentPartConfig.textColor}>
                {currentPartConfig.label} - {currentPartConfig.title}
              </span>
            </div>
            <p className="text-gray-600">{currentPartConfig.description} - {totalQuestions} câu hỏi</p>
          </div>

          {/* Directions */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Directions:</strong> {part === 1 
                ? 'Listen to 8 short conversations. For each question, choose the correct answer A, B, C or D.'
                : part === 2
                ? 'Listen to 3 longer conversations. Answer questions about the main ideas and details.'
                : 'Listen to 3 academic lectures and answer questions about the content.'}
            </p>
          </div>

          {/* Audio Player - Only for Part 1 (no sections) */}
          {currentPartConfig.sections.length === 0 && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6 border-2 border-indigo-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={toggleAudio}
                    className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="size-6 text-white" />
                    ) : (
                      <Play className="size-6 text-white ml-1" />
                    )}
                  </button>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Volume2 className="size-5 text-indigo-600" />
                      <span className="text-sm text-indigo-900">
                        Audio cho Part {part}
                      </span>
                    </div>
                    <p className="text-xs text-indigo-700">
                      {isPlaying ? 'Đang phát...' : 'Bạn sẽ nghe audio 1 lần duy nhất'}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-indigo-600">
                  00:00 / 05:30
                </div>
              </div>
              {currentPartConfig.audioUrl && (
                <audio 
                  ref={audioRef} 
                  src={currentPartConfig.audioUrl}
                  onEnded={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
              )}
            </div>
          )}

          {/* Questions */}
          <div className="space-y-6">
            {currentPartConfig.sections.length === 0 ? (
              // Part 1: All questions without sections
              <>
                <h3 className="text-lg mb-4">Câu hỏi</h3>
                {Array.from({ length: currentPartConfig.questions }, (_, i) => (
                  <div key={i} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <p className="mb-3">
                      <span className="font-medium">{i + 1}.</span> Sample question {i + 1} for {currentPartConfig.title}?
                    </p>
                    <div className="space-y-2">
                      {['A', 'B', 'C', 'D'].map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={`question-${i}`}
                            value={option}
                            checked={answers[i] === option}
                            onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
                            className="w-4 h-4 text-indigo-600"
                          />
                          <span className="text-sm">{option}. Sample answer option for Part {part}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              // Part 2/3: Questions grouped by sections with audio
              <>
                {currentPartConfig.sections.map((section, sectionIndex) => {
                  let questionOffset = 0;
                  // Calculate question offset for this section
                  for (let i = 0; i < sectionIndex; i++) {
                    questionOffset += currentPartConfig.sections[i].questionCount;
                  }

                  return (
                    <div key={sectionIndex} className="mb-8">
                      {/* Audio Player for this section */}
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-4 border-2 border-indigo-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => {
                                setCurrentSectionIndex(sectionIndex);
                                setTimeout(() => toggleAudio(), 100);
                              }}
                              className={`w-14 h-14 ${currentPartConfig.bgColor} hover:opacity-80 rounded-full flex items-center justify-center transition-all border-2 ${
                                currentSectionIndex === sectionIndex && isPlaying
                                  ? 'border-green-500'
                                  : 'border-transparent'
                              }`}
                            >
                              {currentSectionIndex === sectionIndex && isPlaying ? (
                                <Pause className={`size-6 ${currentPartConfig.textColor}`} />
                              ) : (
                                <Play className={`size-6 ${currentPartConfig.textColor} ml-1`} />
                              )}
                            </button>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Volume2 className={`size-5 ${currentPartConfig.textColor}`} />
                                <span className={`text-sm ${currentPartConfig.textColor}`}>
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
                          <div className={`text-sm ${currentPartConfig.textColor}`}>
                            00:00 / 03:00
                          </div>
                        </div>
                        {currentSectionIndex === sectionIndex && (
                          <audio 
                            ref={audioRef} 
                            src={section.audioUrl}
                            onEnded={() => setIsPlaying(false)}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                          />
                        )}
                      </div>

                      {/* Section Questions */}
                      <div className="space-y-6">
                        {Array.from({ length: section.questionCount }, (_, i) => {
                          const questionIndex = questionOffset + i;
                          return (
                            <div key={questionIndex} className="border-b border-gray-200 pb-6 last:border-b-0">
                              <p className="mb-3">
                                <span className="font-medium">{questionIndex + 1}.</span> Sample question for {section.title}?
                              </p>
                              <div className="space-y-2">
                                {['A', 'B', 'C', 'D'].map((option) => (
                                  <label
                                    key={option}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                                  >
                                    <input
                                      type="radio"
                                      name={`question-${questionIndex}`}
                                      value={option}
                                      checked={answers[questionIndex] === option}
                                      onChange={(e) => setAnswers({ ...answers, [questionIndex]: e.target.value })}
                                      className="w-4 h-4 text-indigo-600"
                                    />
                                    <span className="text-sm">{option}. Sample answer option</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleSubmit}
              disabled={answeredCount === 0}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Nộp bài
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
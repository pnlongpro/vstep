import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Headphones, Play, Pause, Volume2, Maximize, Minimize } from 'lucide-react';
import { ListeningResult } from './listening/ListeningResult';
import { listeningPartsConfig } from '../data/partsConfig';

interface ListeningFullTestProps {
  onBack: () => void;
  level: 'B1' | 'B2' | 'C1';
}

export function ListeningFullTest({ onBack, level }: ListeningFullTestProps) {
  const [currentPart, setCurrentPart] = useState<1 | 2 | 3>(1);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Generate exam ID (format: L-B1-241214-001)
  const [examId] = useState(() => {
    const skillCode = 'L';
    const dateCode = new Date().toISOString().slice(2, 10).replace(/-/g, '').slice(0, 6); // YYMMDD
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const id = `${skillCode}-${level}-${dateCode}-${randomNum}`;
    console.log('🆔 Listening Exam ID:', id);
    return id;
  });

  const parts = listeningPartsConfig;

  // Update audio source when part or section changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load(); // Reload the new audio source
      setIsPlaying(false);
    }
  }, [currentPart, currentSectionIndex]);

  // Reset section index when changing parts
  useEffect(() => {
    setCurrentSectionIndex(0);
  }, [currentPart]);

  // Calculate answered count
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = parts.reduce((sum, part) => sum + part.questions, 0);

  // Calculate answered count per part
  const getPartAnsweredCount = (partId: number) => {
    // Calculate start and end question indices for this part
    let startIndex = 0;
    for (let i = 0; i < partId - 1; i++) {
      startIndex += parts[i].questions;
    }
    const endIndex = startIndex + parts[partId - 1].questions;
    
    // Count how many questions in this range have been answered
    let count = 0;
    for (let i = startIndex; i < endIndex; i++) {
      if (answers[i] !== undefined) {
        count++;
      }
    }
    return count;
  };

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
      title: `Listening Full Test - ${level}`,
      description: 'Bộ đề thi đầy đủ 3 Parts',
      level: level,
      type: 'full-test',
      duration: 40,
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
      timeSpent: 40,
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
    setCurrentPart(1);
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
    <div className={`min-h-screen bg-gray-50 ${isFullscreen ? 'fixed inset-0 z-50 overflow-auto' : ''}`}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="size-5" />
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl">Listening Full Test - {level}</h1>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-mono">
                    ID: {examId}
                  </span>
                </div>
                <p className="text-sm text-gray-600">35 câu hỏi · 40 phút</p>
              </div>
            </div>
            
            {/* Progress indicator */}
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-green-600">{answeredCount}</span>
                <span className="text-gray-400"> / {totalQuestions} câu</span>
              </div>
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title={isFullscreen ? 'Thoát chế độ toàn màn hình' : 'Chế độ toàn màn hình'}
              >
                {isFullscreen ? (
                  <Minimize className="size-5 text-gray-700" />
                ) : (
                  <Maximize className="size-5 text-gray-700" />
                )}
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Nộp bài
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Part Navigation Tabs */}
      <div className="bg-white border-b sticky top-[73px] z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-0 overflow-x-auto">
            {parts.map((part) => {
              const answeredInPart = getPartAnsweredCount(part.id);
              const isPartComplete = answeredInPart === part.questions;
              
              return (
                <button
                  key={part.id}
                  onClick={() => setCurrentPart(part.id as 1 | 2 | 3)}
                  className={`px-6 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                    currentPart === part.id
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{part.label}</span>
                    <span className={`text-xs ${
                      currentPart === part.id ? 'text-indigo-600' : 'text-gray-400'
                    }`}>
                      {answeredInPart}/{part.questions}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          {/* Part Info */}
          <div className="mb-6">
            <div className={`inline-flex items-center gap-2 px-4 py-2 ${parts[currentPart - 1].bgColor} rounded-lg mb-3`}>
              <Headphones className={`size-5 ${parts[currentPart - 1].textColor}`} />
              <span className={`${parts[currentPart - 1].textColor}`}>
                {parts[currentPart - 1].label} - {parts[currentPart - 1].title}
              </span>
            </div>
            <h2 className="text-2xl mb-2">
              Part {currentPart}: {parts[currentPart - 1].title}
            </h2>
            <p className="text-gray-600">
              {parts[currentPart - 1].questions} câu hỏi
            </p>
          </div>

          {/* Directions */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Directions:</strong> {currentPart === 1 
                ? 'Listen to 8 short conversations. For each question, choose the correct answer A, B, C or D.'
                : currentPart === 2
                ? 'Listen to 3 longer conversations. Answer questions about the main ideas and details.'
                : 'Listen to academic lectures and answer questions about the content.'}
            </p>
          </div>

          {/* Audio Player - Only for Part 1 (no sections) */}
          {parts[currentPart - 1].sections.length === 0 && (
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
                        Audio cho Part {currentPart}
                      </span>
                    </div>
                    <p className="text-xs text-indigo-700">Bạn sẽ nghe audio 1 lần duy nhất</p>
                  </div>
                </div>
                <div className="text-sm text-indigo-600">
                  00:00 / 05:30
                </div>
              </div>
              {parts[currentPart - 1]?.audioUrl && (
                <audio ref={audioRef} src={parts[currentPart - 1].audioUrl} />
              )}
            </div>
          )}
          
          {/* Questions */}
          <div className="space-y-6">
            <h3 className="text-lg mb-4">Câu hỏi (Current Part: {currentPart})</h3>
            {(() => {
              // Calculate start index for this part
              let startIndex = 0;
              for (let i = 0; i < currentPart - 1; i++) {
                startIndex += parts[i].questions;
              }
              const currentPartQuestions = parts[currentPart - 1].questions;
              const currentPartSections = parts[currentPart - 1].sections;
              
              console.log('🔍 Rendering questions for:', {
                currentPart,
                startIndex,
                currentPartQuestions,
                hasSections: currentPartSections.length > 0,
                sectionsCount: currentPartSections.length
              });
              
              // If part has sections (Part 2 & 3), render with section headers
              if (currentPartSections.length > 0) {
                let questionOffset = 0;
                return currentPartSections.map((section, sectionIndex) => {
                  const sectionQuestions = [];
                  for (let i = 0; i < section.questionCount; i++) {
                    const questionIndex = startIndex + questionOffset + i;
                    sectionQuestions.push(
                      <div key={questionIndex} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <p className="mb-3">
                          <span className="font-medium">{questionIndex + 1}.</span> {
                            currentPart === 2
                              ? `What is the main topic of the conversation?`
                              : `According to the lecture, what is the primary cause?`
                          }
                        </p>
                        <div className="space-y-2">
                          {['A', 'B', 'C', 'D'].map((option) => (
                            <label
                              key={option}
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name={`question_${questionIndex}`}
                                value={option}
                                checked={answers[questionIndex] === option}
                                onChange={(e) => setAnswers({ ...answers, [questionIndex]: e.target.value })}
                                className="w-4 h-4 text-indigo-600"
                              />
                              <span className="text-sm">{option}. Sample answer option for Part {currentPart}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  questionOffset += section.questionCount;
                  
                  return (
                    <div key={sectionIndex} className="mb-8">
                      {/* Audio Player for this section */}
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-4 border-2 border-indigo-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => {
                                setCurrentSectionIndex(sectionIndex);
                                // Wait for state update, then toggle audio
                                setTimeout(() => toggleAudio(), 100);
                              }}
                              className={`w-14 h-14 ${parts[currentPart - 1].bgColor} hover:opacity-80 rounded-full flex items-center justify-center transition-all border-2 ${
                                currentSectionIndex === sectionIndex && isPlaying
                                  ? 'border-green-500'
                                  : `border-${parts[currentPart - 1].textColor.replace('text-', '')}`
                              }`}
                            >
                              {currentSectionIndex === sectionIndex && isPlaying ? (
                                <Pause className={`size-6 ${parts[currentPart - 1].textColor}`} />
                              ) : (
                                <Play className={`size-6 ${parts[currentPart - 1].textColor} ml-1`} />
                              )}
                            </button>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Volume2 className={`size-5 ${parts[currentPart - 1].textColor}`} />
                                <span className={`text-sm ${parts[currentPart - 1].textColor}`}>
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
                          <div className={`text-sm ${parts[currentPart - 1].textColor}`}>
                            00:00 / 03:00
                          </div>
                        </div>
                        {currentSectionIndex === sectionIndex && (
                          <audio ref={audioRef} src={section.audioUrl} />
                        )}
                      </div>
                      
                      {/* Section Header */}
                      <div className={`${parts[currentPart - 1].bgColor} rounded-lg p-4 mb-4`}>
                        <h4 className={`${parts[currentPart - 1].textColor}`}>
                          {section.title}
                        </h4>
                      </div>
                      
                      {/* Section Questions */}
                      <div className="space-y-6">
                        {sectionQuestions}
                      </div>
                    </div>
                  );
                });
              }
              
              // Part 1: No sections, render all questions directly
              return Array.from({ length: currentPartQuestions }, (_, i) => {
                const questionIndex = startIndex + i;
                return (
                  <div key={questionIndex} className="border-b border-gray-200 pb-6">
                    <p className="mb-3">
                      <span className="font-medium">{questionIndex + 1}.</span> When is the man's appointment?
                    </p>
                    <div className="space-y-2">
                      {['A', 'B', 'C', 'D'].map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={`question_${questionIndex}`}
                            value={option}
                            checked={answers[questionIndex] === option}
                            onChange={(e) => setAnswers({ ...answers, [questionIndex]: e.target.value })}
                            className="w-4 h-4 text-indigo-600"
                          />
                          <span className="text-sm">{option}. Sample answer option for Part {currentPart}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              });
            })()}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => currentPart > 1 && setCurrentPart((currentPart - 1) as 1 | 2 | 3)}
              disabled={currentPart === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Part trước
            </button>
            {currentPart < 3 ? (
              <button
                onClick={() => setCurrentPart((currentPart + 1) as 1 | 2 | 3)}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Part tiếp theo →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Nộp bài
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
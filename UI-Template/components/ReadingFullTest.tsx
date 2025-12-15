import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Maximize, Minimize } from 'lucide-react';
import { ReadingResult } from './reading/ReadingResult';
import { readingQuestions } from '../data/readingData';
import { readingPartsConfig } from '../data/partsConfig';

interface ReadingFullTestProps {
  onBack: () => void;
  level: 'B1' | 'B2' | 'C1';
  examId?: string;
}

export function ReadingFullTest({ onBack, level, examId }: ReadingFullTestProps) {
  const [currentPart, setCurrentPart] = useState<1 | 2 | 3 | 4>(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Use provided examId or generate a fallback one
  const displayExamId = examId || 'R000';

  const parts = readingPartsConfig;

  // Debug log
  console.log('🔍 ReadingFullTest - Parts config:', parts.map(p => ({ id: p.id, questions: p.questions })));

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

  // Handle submit
  const handleSubmit = () => {
    // Create mock exercise data for result display
    const mockExercise = {
      id: 999,
      title: `Reading Full Test - ${level}`,
      description: 'Bộ đề thi đầy đủ 4 Parts',
      level: level,
      type: 'full-test',
      duration: 60,
      questions: Array.from({ length: totalQuestions }, (_, i) => ({
        id: i,
        question: `Question ${i + 1}`,
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 'A', // Mock correct answer
        explanation: 'This is a sample explanation.',
      })),
    };

    // Calculate score (mock: assume 70% correct)
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
      timeSpent: 60, // Mock time
      details: mockExercise.questions.map((q, index) => ({
        questionIndex: index,
        question: q.question,
        userAnswer: answers[index] || '',
        correctAnswer: q.correctAnswer,
        isCorrect: index < correct, // Mock: first 70% are correct
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

  // No need for fullscreen change listeners since we're using CSS-based fullscreen
  // Remove the useEffect for fullscreen changes

  // If showing result
  if (showResult && result) {
    return (
      <ReadingResult
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
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="size-5" />
              </button>
              <div>
                <h1 className="text-xl">Reading Test</h1>
                <p className="text-sm text-gray-600">ID: {displayExamId}</p>
              </div>
            </div>
            
            {/* Progress indicator */}
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-blue-600">{answeredCount}</span>
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
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Nộp bài
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Part Navigation Tabs */}
      <div className="bg-white border-b sticky top-[81px] z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 overflow-x-auto">
            {parts.map((part) => {
              const answeredInPart = getPartAnsweredCount(part.id);
              const isPartComplete = answeredInPart === part.questions;
              
              return (
                <button
                  key={part.id}
                  onClick={() => setCurrentPart(part.id as 1 | 2 | 3 | 4)}
                  className={`px-6 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                    currentPart === part.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{part.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      isPartComplete
                        ? 'bg-green-100 text-green-700'
                        : currentPart === part.id 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-600'
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
      <div className="max-w-7xl mx-auto px-6 pb-8 pt-6">
        {/* Part Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className={`inline-flex items-center gap-2 px-4 py-2 ${parts[currentPart - 1].bgColor} rounded-lg mb-3`}>
            <BookOpen className={`size-5 ${parts[currentPart - 1].textColor}`} />
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

        {/* Two Column Layout with Independent Scrollbars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column - Passage */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 lg:sticky lg:top-52 lg:self-start max-h-[calc(100vh-200px)] overflow-y-auto">
            <h4 className="mb-4 text-blue-600">Đọc đoạn văn</h4>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-line leading-relaxed text-gray-700">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt 
                ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco 
                laboris nisi ut aliquip ex ea commodo consequat.

                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt 
                mollit anim id est laborum.

                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
                totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae 
                dicta sunt explicabo.

                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur 
                magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem 
                ipsum quia dolor sit amet, consectetur, adipisci velit.

                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum 
                deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non 
                provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.

                Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est 
                eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas 
                assumenda est, omnis dolor repellendus.

                Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et 
                voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente 
                delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.

                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore 
                et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas 
                accumsan lacus vel facilisis.

                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo 
                consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat 
                nulla pariatur.

                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim 
                id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium 
                doloremque laudantium.
              </div>
            </div>
          </div>

          {/* Right Column - Questions */}
          <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pb-8 pt-4">
            {(() => {
              // Calculate start index for this part
              let startIndex = 0;
              for (let i = 0; i < currentPart - 1; i++) {
                startIndex += parts[i].questions;
              }
              const currentPartQuestions = parts[currentPart - 1].questions;
              
              return Array.from({ length: currentPartQuestions }, (_, i) => {
                const questionIndex = startIndex + i;
                return (
                  <div key={questionIndex} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-start gap-3 mb-4">
                      <span
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                          answers[questionIndex]
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {questionIndex + 1}
                      </span>
                      <p className="flex-1">This is a sample question for Part {currentPart}?</p>
                    </div>
                    <div className="space-y-2 ml-11">
                      {['A', 'B', 'C', 'D'].map((option) => {
                        const optionLetter = option;
                        return (
                          <label
                            key={option}
                            className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              answers[questionIndex] === optionLetter
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question_${questionIndex}`}
                              value={option}
                              checked={answers[questionIndex] === option}
                              onChange={(e) => setAnswers({ ...answers, [questionIndex]: e.target.value })}
                              className="mt-1"
                            />
                            <span className="flex-1">
                              <span className="mr-2">{option}.</span>
                              Sample answer option
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => currentPart > 1 && setCurrentPart((currentPart - 1) as 1 | 2 | 3 | 4)}
              disabled={currentPart === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Part trước
            </button>
            {currentPart < 4 ? (
              <button
                onClick={() => setCurrentPart((currentPart + 1) as 1 | 2 | 3 | 4)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
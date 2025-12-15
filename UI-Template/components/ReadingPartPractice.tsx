import { useState } from 'react';
import { ArrowLeft, BookOpen, Maximize, Minimize } from 'lucide-react';
import { ReadingResult } from './reading/ReadingResult';
import { readingPartsConfig } from '../data/partsConfig';

interface ReadingPartPracticeProps {
  onBack: () => void;
  level: 'B1' | 'B2' | 'C1';
  part: 1 | 2 | 3 | 4;
}

export function ReadingPartPractice({ onBack, level, part }: ReadingPartPracticeProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentPartConfig = readingPartsConfig[part - 1];
  const totalQuestions = currentPartConfig.questions;

  // Debug log
  console.log('🔍 ReadingPartPractice - Part:', part, 'Config:', currentPartConfig, 'Total Questions:', totalQuestions);

  // Calculate answered count
  const answeredCount = Object.keys(answers).length;

  const handleSubmit = () => {
    // Create mock exercise data for result display
    const mockExercise = {
      id: 999,
      title: `Reading ${currentPartConfig.label} - ${level}`,
      description: currentPartConfig.title,
      level: level,
      type: 'part-practice',
      duration: 15,
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
      timeSpent: 900, // 15 minutes
      details: mockExercise.questions.map((q, i) => ({
        questionIndex: i,
        question: q.question,
        userAnswer: answers[i] || '',
        correctAnswer: q.correctAnswer,
        isCorrect: answers[i] === q.correctAnswer,
        explanation: q.explanation,
      })),
      exercise: mockExercise,
    };

    setResult(resultData);
    setShowResult(true);
  };

  if (showResult && result) {
    return (
      <ReadingResult
        result={result}
        onTryAgain={() => {
          setShowResult(false);
          setAnswers({});
        }}
        onBackToList={onBack}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
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
                  <BookOpen className={`size-6 ${currentPartConfig.textColor}`} />
                </div>
                <div>
                  <h2 className="text-xl">Reading {currentPartConfig.label} - {level}</h2>
                  <p className="text-sm text-gray-600">{currentPartConfig.title}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Đã trả lời</div>
                <div className="text-xl">
                  <span className={answeredCount === totalQuestions ? 'text-green-600' : 'text-blue-600'}>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Reading Passage */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className={`inline-block px-4 py-2 ${currentPartConfig.bgColor} ${currentPartConfig.textColor} rounded-lg mb-4`}>
                {currentPartConfig.label}
              </div>
              <h3 className="text-xl mb-4">{currentPartConfig.title}</h3>
              
              {/* Mock Reading Passage */}
              <div className="prose max-w-none">
                <p className="mb-4">
                  This is a sample reading passage for {currentPartConfig.title}. In an actual test, this would contain
                  a complete reading text appropriate for {level} level students.
                </p>
                <p className="mb-4">
                  The passage would typically be 300-500 words long and cover topics such as science, technology,
                  history, culture, or current events. Students need to read carefully and answer {totalQuestions} questions
                  based on the content.
                </p>
                <p className="mb-4">
                  Each question type in the VSTEP reading test assesses different reading skills, including
                  understanding main ideas, identifying specific information, making inferences, and understanding
                  vocabulary in context.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Questions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h4 className="mb-4">Câu hỏi ({totalQuestions})</h4>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {Array.from({ length: totalQuestions }, (_, i) => (
                  <div key={i} className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors">
                    <div className="mb-2">
                      <span className="text-sm text-gray-600">Câu {i + 1}</span>
                    </div>
                    <p className="text-sm mb-3">Sample question {i + 1} for {currentPartConfig.title}?</p>
                    <div className="space-y-2">
                      {['A', 'B', 'C', 'D'].map((option) => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name={`question-${i}`}
                            value={option}
                            checked={answers[i] === option}
                            onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm group-hover:text-blue-600 transition-colors">
                            {option}. Sample option {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Nộp bài
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
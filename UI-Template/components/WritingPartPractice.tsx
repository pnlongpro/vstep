import { useState, useEffect } from 'react';
import { ArrowLeft, PenTool, Clock, Maximize, Minimize } from 'lucide-react';
import { WritingResult } from './writing/WritingResult';
import { writingPartsConfig } from '../data/partsConfig';

interface WritingPartPracticeProps {
  onBack: () => void;
  level: 'B1' | 'B2' | 'C1';
  part: 1 | 2;
}

export function WritingPartPractice({ onBack, level, part }: WritingPartPracticeProps) {
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentPartConfig = writingPartsConfig[part - 1];

  useEffect(() => {
    setTimeLeft(currentPartConfig.timeLimit * 60);
  }, [currentPartConfig.timeLimit]);

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, showResult]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const wordCount = answer.trim().split(/\s+/).filter(word => word.length > 0).length;

  const handleSubmit = () => {
    const mockExercise = {
      id: 999,
      title: `Writing ${currentPartConfig.label} - ${level}`,
      description: currentPartConfig.title,
      level: level,
      type: 'part-practice',
      task: part === 1 ? 'email' : 'essay',
      prompt: part === 1 
        ? 'You received an email from your friend. Write a reply.'
        : 'Some people think that... Discuss both views and give your opinion.',
      minWords: currentPartConfig.minWords,
    };

    // Mock AI scoring
    const resultData = {
      score: 7.5,
      feedback: {
        taskResponse: {
          score: 7,
          comment: 'Good response to the task with relevant ideas.',
        },
        coherenceCohesion: {
          score: 8,
          comment: 'Well-organized with clear progression.',
        },
        lexicalResource: {
          score: 7,
          comment: 'Good range of vocabulary with some flexibility.',
        },
        grammaticalRange: {
          score: 8,
          comment: 'Good control of grammar with few errors.',
        },
      },
      wordCount: wordCount,
      strengths: [
        'Clear structure and organization',
        'Good vocabulary range',
        'Appropriate tone and style',
      ],
      improvements: [
        'Add more specific examples',
        'Develop ideas more fully',
        'Check minor grammar errors',
      ],
      answer: answer,
      exercise: mockExercise,
    };

    setResult(resultData);
    setShowResult(true);
  };

  if (showResult && result) {
    return (
      <WritingResult
        result={result}
        onTryAgain={() => {
          setShowResult(false);
          setAnswer('');
          setTimeLeft(currentPartConfig.timeLimit * 60);
        }}
        onBackToList={onBack}
      />
    );
  }

  const prompt = part === 1 
    ? `You recently received an email from a friend asking for advice about studying abroad. Write a reply email (${currentPartConfig.minWords}-${currentPartConfig.maxWords} words).`
    : `Some people believe that technology has made our lives easier, while others think it has created new problems. Discuss both views and give your own opinion. Write at least ${currentPartConfig.minWords} words.`;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-cyan-50 to-emerald-50 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
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
                  <PenTool className={`size-6 ${currentPartConfig.textColor}`} />
                </div>
                <div>
                  <h2 className="text-xl">Writing {currentPartConfig.label} - {level}</h2>
                  <p className="text-sm text-gray-600">{currentPartConfig.title}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Clock className="size-5 text-gray-600" />
                <span className={`text-xl ${timeLeft < 300 ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Số từ</div>
                <div className={`text-xl ${
                  wordCount >= currentPartConfig.minWords && wordCount <= (currentPartConfig.maxWords || Infinity)
                    ? 'text-green-600'
                    : 'text-orange-600'
                }`}>
                  {wordCount}
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
          {/* Left: Instructions & Prompt */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <div className={`inline-block px-4 py-2 ${currentPartConfig.bgColor} ${currentPartConfig.textColor} rounded-lg mb-4`}>
                {currentPartConfig.label}
              </div>
              <h3 className="text-lg mb-4">Yêu cầu</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-1.5"></div>
                  <div>
                    <span className="text-gray-600">Loại bài:</span>{' '}
                    <span className="text-gray-900">{currentPartConfig.title}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-1.5"></div>
                  <div>
                    <span className="text-gray-600">Số từ tối thiểu:</span>{' '}
                    <span className="text-gray-900">{currentPartConfig.minWords} từ</span>
                  </div>
                </div>
                {currentPartConfig.maxWords && (
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-1.5"></div>
                    <div>
                      <span className="text-gray-600">Số từ tối đa:</span>{' '}
                      <span className="text-gray-900">{currentPartConfig.maxWords} từ</span>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-1.5"></div>
                  <div>
                    <span className="text-gray-600">Thời gian:</span>{' '}
                    <span className="text-gray-900">{currentPartConfig.timeLimit} phút</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm mb-2">📝 Đề bài</h4>
                <p className="text-sm text-gray-700">{prompt}</p>
              </div>
            </div>
          </div>

          {/* Right: Writing Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3>Bài làm của bạn</h3>
                
                {/* Word Count Display - More Prominent */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">Số từ hiện tại</div>
                    <div className={`text-2xl font-mono font-bold ${
                      wordCount >= currentPartConfig.minWords && wordCount <= (currentPartConfig.maxWords || Infinity)
                        ? 'text-green-600'
                        : wordCount < currentPartConfig.minWords
                        ? 'text-orange-600'
                        : 'text-red-600'
                    }`}>
                      {wordCount}
                    </div>
                  </div>
                  <div className="text-gray-300">/</div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">Yêu cầu</div>
                    <div className="text-2xl font-mono text-gray-600">
                      {currentPartConfig.minWords}
                      {currentPartConfig.maxWords && `-${currentPartConfig.maxWords}`}
                    </div>
                  </div>
                </div>
              </div>
              
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Bắt đầu viết bài của bạn tại đây..."
                className="w-full h-[600px] p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />

              {/* Submit Button */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm">
                  {wordCount < currentPartConfig.minWords && (
                    <span className="text-orange-600 font-medium">
                      ⚠️ Cần thêm {currentPartConfig.minWords - wordCount} từ nữa
                    </span>
                  )}
                  {wordCount >= currentPartConfig.minWords && wordCount <= (currentPartConfig.maxWords || Infinity) && (
                    <span className="text-green-600 font-medium">✓ Đạt yêu cầu số từ</span>
                  )}
                  {currentPartConfig.maxWords && wordCount > currentPartConfig.maxWords && (
                    <span className="text-red-600 font-medium">
                      ⚠️ Vượt quá {wordCount - currentPartConfig.maxWords} từ
                    </span>
                  )}
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={wordCount < currentPartConfig.minWords}
                  className={`px-8 py-3 bg-gradient-to-r ${
                    part === 1 ? 'from-cyan-600 to-blue-600' : 'from-emerald-600 to-green-600'
                  } text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Nộp bài
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
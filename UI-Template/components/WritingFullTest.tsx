import { useState, useEffect } from 'react';
import { ArrowLeft, PenTool, FileText, Maximize, Minimize } from 'lucide-react';
import { WritingResult } from './writing/WritingResult';
import { writingPartsConfig } from '../data/partsConfig';

interface WritingFullTestProps {
  onBack: () => void;
  level: 'B1' | 'B2' | 'C1';
}

export function WritingFullTest({ onBack, level }: WritingFullTestProps) {
  const [currentPart, setCurrentPart] = useState<1 | 2>(1);
  const [essay1, setEssay1] = useState('');
  const [essay2, setEssay2] = useState('');
  const [wordCount1, setWordCount1] = useState(0);
  const [wordCount2, setWordCount2] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Generate exam ID (format: W-B1-241214-001)
  const [examId] = useState(() => {
    const skillCode = 'W';
    const dateCode = new Date().toISOString().slice(2, 10).replace(/-/g, '').slice(0, 6); // YYMMDD
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const id = `${skillCode}-${level}-${dateCode}-${randomNum}`;
    console.log('🆔 Writing Exam ID:', id);
    return id;
  });

  const parts = writingPartsConfig;

  const currentEssay = currentPart === 1 ? essay1 : essay2;
  const setCurrentEssay = currentPart === 1 ? setEssay1 : setEssay2;

  useEffect(() => {
    const words = currentEssay.trim().split(/\s+/).filter(word => word.length > 0);
    if (currentPart === 1) {
      setWordCount1(words.length);
    } else {
      setWordCount2(words.length);
    }
  }, [currentEssay, currentPart]);

  // Auto-save every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      localStorage.setItem('writing_draft_part1', essay1);
      localStorage.setItem('writing_draft_part2', essay2);
    }, 10000);

    return () => clearInterval(timer);
  }, [essay1, essay2]);

  const currentWordCount = currentPart === 1 ? wordCount1 : wordCount2;
  const minWords = parts[currentPart - 1].minWords;
  const wordCountColor = currentWordCount >= minWords ? 'text-green-600' : 'text-orange-600';

  // Handle submit
  const handleSubmit = () => {
    if (wordCount1 < parts[0].minWords || wordCount2 < parts[1].minWords) {
      alert('Vui lòng hoàn thành đủ số từ tối thiểu cho cả 2 bài!');
      return;
    }

    const mockTask = {
      id: 999,
      title: `Writing Full Test - ${level}`,
      description: 'Bộ đề thi đầy đủ 2 Tasks',
      level: level,
      taskType: 'full-test',
      prompt: 'Full test với 2 tasks',
      minWords: parts[0].minWords + parts[1].minWords,
    };

    const resultData = {
      essay: `Task 1:\n${essay1}\n\nTask 2:\n${essay2}`,
      wordCount: wordCount1 + wordCount2,
      task: mockTask,
      aiScore: {
        taskAchievement: 7.5,
        coherenceCohesion: 7.0,
        lexicalResource: 7.5,
        grammaticalRange: 7.0,
        overall: 7.25,
      },
      feedback: {
        strengths: [
          'Bài viết đáp ứng được yêu cầu của đề bài',
          'Ý tưởng được trình bày rõ ràng và có logic',
          'Sử dụng từ vựng phù hợp với chủ đề',
        ],
        improvements: [
          'Nên sử dụng thêm các cụm từ nối để tăng tính liên kết',
          'Một số câu có thể được viết lại để tránh lặp từ',
          'Cần chú ý hơn đến cấu trúc câu phức',
        ],
      },
    };

    setResult(resultData);
    setShowResult(true);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setEssay1('');
    setEssay2('');
    setCurrentPart(1);
  };

  // Fullscreen functionality
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // If showing result
  if (showResult && result) {
    return (
      <WritingResult
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
                  <h1 className="text-xl">Writing Full Test - {level}</h1>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-mono">
                    ID: {examId}
                  </span>
                </div>
                <p className="text-sm text-gray-600">2 bài viết · 60 phút</p>
              </div>
            </div>
            
            {/* Progress indicator */}
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className={wordCount1 >= parts[0].minWords ? 'text-green-600' : 'text-gray-400'}>
                  Part 1: {wordCount1}/{parts[0].minWords}
                </span>
                <span className="text-gray-400 mx-2">|</span>
                <span className={wordCount2 >= parts[1].minWords ? 'text-green-600' : 'text-gray-400'}>
                  Part 2: {wordCount2}/{parts[1].minWords}
                </span>
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
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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
          <div className="flex gap-2 overflow-x-auto">
            {parts.map((part) => {
              const partWords = part.id === 1 ? wordCount1 : wordCount2;
              const isPartComplete = partWords >= part.minWords;
              
              return (
                <button
                  key={part.id}
                  onClick={() => setCurrentPart(part.id as 1 | 2)}
                  className={`px-6 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                    currentPart === part.id
                      ? 'border-green-600 text-green-600 bg-green-50'
                      : 'border-transparent text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{part.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      isPartComplete
                        ? 'bg-green-100 text-green-700'
                        : currentPart === part.id 
                        ? 'bg-yellow-100 text-yellow-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {partWords}/{part.minWords}+ từ
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
              <PenTool className={`size-5 ${parts[currentPart - 1].textColor}`} />
              <span className={`${parts[currentPart - 1].textColor}`}>
                {parts[currentPart - 1].label} - {parts[currentPart - 1].title}
              </span>
            </div>
            <h2 className="text-2xl mb-2">
              Part {currentPart}: {parts[currentPart - 1].title}
            </h2>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span>Tối thiểu: {parts[currentPart - 1].minWords} từ</span>
              <span>Thời gian đề xuất: {parts[currentPart - 1].time} phút</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <p className="text-sm text-blue-900 mb-3">
              <strong>Task:</strong>
            </p>
            <p className="text-sm text-blue-800 italic mb-3">
              "{parts[currentPart - 1].prompt}"
            </p>
            <p className="text-sm text-blue-900 mb-2">
              <strong>You should include:</strong>
            </p>
            <ul className="space-y-1 text-sm text-blue-800">
              {parts[currentPart - 1].requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Writing Area */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <FileText className="size-4 text-gray-600" />
                <span>Bài viết của bạn</span>
              </label>
              <div className={`text-sm ${wordCountColor}`}>
                <span className="font-medium">{currentWordCount}</span> / {minWords} từ
              </div>
            </div>
            
            <textarea
              value={currentEssay}
              onChange={(e) => setCurrentEssay(e.target.value)}
              placeholder={`Viết bài ${parts[currentPart - 1].title} của bạn tại đây...`}
              className="w-full h-96 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            
            <p className="text-xs text-gray-500">
              💾 Tự động lưu mỗi 10 giây
            </p>
          </div>

          {/* Guidelines */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm mb-2">💡 Gợi ý viết bài:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Đọc kỹ đề bài và yêu cầu</li>
              <li>• Lập dàn ý trước khi viết</li>
              <li>• Sử dụng từ vựng và cấu trúc câu đa dạng</li>
              <li>• Kiểm tra lỗi chính tả và ngữ pháp trước khi nộp</li>
            </ul>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => currentPart > 1 && setCurrentPart(1)}
              disabled={currentPart === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Part trước
            </button>
            {currentPart < 2 ? (
              <button
                onClick={() => setCurrentPart(2)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
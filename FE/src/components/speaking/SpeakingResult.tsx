import { Trophy, Clock, TrendingUp, RotateCcw, ArrowLeft, CheckCircle, Lightbulb, Volume2, FileText, BookOpen, Zap } from 'lucide-react';
import { useState } from 'react';

interface SpeakingResultProps {
  result: any;
  onTryAgain: () => void;
  onBackToList: () => void;
}

export function SpeakingResult({ result, onTryAgain, onBackToList }: SpeakingResultProps) {
  const [showTranscript, setShowTranscript] = useState(false);
  const [showSample, setShowSample] = useState(false);
  const { audioUrl, timeSpent, scores, transcript, feedback, sampleAnswer, task, partAudios } = result;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} phút ${secs} giây`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 7) return 'text-blue-600';
    if (score >= 6) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return 'bg-green-50 border-green-200';
    if (score >= 7) return 'bg-blue-50 border-blue-200';
    if (score >= 6) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  const overallScore = parseFloat(scores.overall);

  const criteria = [
    { 
      name: 'Fluency & Coherence', 
      score: scores.fluency, 
      description: 'Trôi chảy & mạch lạc',
      icon: Zap 
    },
    { 
      name: 'Lexical Resource', 
      score: scores.vocabulary, 
      description: 'Từ vựng',
      icon: BookOpen 
    },
    { 
      name: 'Grammatical Range', 
      score: scores.grammar, 
      description: 'Ngữ pháp',
      icon: FileText 
    },
    { 
      name: 'Pronunciation', 
      score: scores.pronunciation, 
      description: 'Phát âm',
      icon: Volume2 
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBackToList}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div>
          <h2 className="text-2xl">Kết quả chấm AI</h2>
          <p className="text-gray-600">{task.title}</p>
        </div>
      </div>

      {/* Overall Score */}
      <div className={`bg-white rounded-2xl p-8 shadow-sm border-2 ${getScoreBgColor(overallScore)}`}>
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-lg mb-4">
            <Trophy className={`size-12 ${getScoreColor(overallScore)}`} />
          </div>
          <h3 className="text-4xl mb-2">
            <span className={getScoreColor(overallScore)}>{scores.overall}</span>
            <span className="text-gray-400 text-2xl">/9.0</span>
          </h3>
          <p className="text-gray-600">Điểm tổng thể</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="size-5 text-orange-600" />
              <span className="text-sm text-gray-600">Thời gian nói</span>
            </div>
            <div className="text-2xl text-orange-600">{timeSpent}s</div>
            <div className="text-sm text-gray-500">Yêu cầu: {task.speakingTime}s</div>
          </div>

          <div className="bg-white rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="size-5 text-purple-600" />
              <span className="text-sm text-gray-600">Tốc độ nói</span>
            </div>
            <div className="text-2xl text-purple-600">{feedback.wordsPerMinute}</div>
            <div className="text-sm text-gray-500">từ/phút</div>
          </div>

          <div className="bg-white rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="size-5 text-blue-600" />
              <span className="text-sm text-gray-600">Cấp độ</span>
            </div>
            <div className="text-2xl text-blue-600">{task.level}</div>
            <div className="text-sm text-gray-500">{task.part.toUpperCase()}</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onTryAgain}
          className="flex-1 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="size-5" />
          Nói lại đề này
        </button>
        <button
          onClick={onBackToList}
          className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
        >
          Chọn đề khác
        </button>
      </div>

      {/* Audio Playback */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl mb-4">Bài nói của bạn</h3>
        
        {/* If Full Test (3 parts), show individual part audios */}
        {partAudios && partAudios.length === 3 ? (
          <div className="space-y-4">
            {partAudios.map((partAudio: any, index: number) => (
              <div key={index} className="border-2 border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">Part {index + 1}: {partAudio.title}</h4>
                    <p className="text-sm text-gray-600">{partAudio.duration}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    index === 0 ? 'bg-blue-100 text-blue-700' :
                    index === 1 ? 'bg-purple-100 text-purple-700' :
                    'bg-rose-100 text-rose-700'
                  }`}>
                    {partAudio.timeSpent}s
                  </div>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3 border border-orange-200">
                  <audio controls className="w-full" src={partAudio.audioUrl}>
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </div>
            ))}
            
            {/* Tổng hợp */}
            <div className="border-2 border-orange-300 rounded-lg p-4 bg-orange-50">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-orange-900">🎯 Tổng hợp cả 3 Parts</h4>
                  <p className="text-sm text-orange-700">Nghe liền mạch toàn bộ bài thi</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-3 border border-orange-300">
                <audio controls className="w-full" src={audioUrl}>
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          </div>
        ) : (
          // Single part audio (for Part Practice)
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
            <audio controls className="w-full" src={audioUrl}>
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>

      {/* Detailed Scores */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl mb-4">Chi tiết điểm theo tiêu chí</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {criteria.map((criterion, index) => {
            const score = parseFloat(criterion.score);
            const Icon = criterion.icon;
            return (
              <div key={index} className="p-4 border-2 border-gray-200 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <Icon className="size-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">{criterion.name}</p>
                      <p className="text-xs text-gray-600">{criterion.description}</p>
                    </div>
                  </div>
                  <div className={`text-2xl ${getScoreColor(score)}`}>
                    {criterion.score}
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      score >= 8 ? 'bg-green-500' :
                      score >= 7 ? 'bg-blue-500' :
                      score >= 6 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${(score / 9) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="size-5 text-green-600" />
            <h3 className="text-xl text-green-800">Điểm mạnh</h3>
          </div>
          <ul className="space-y-2">
            {feedback.strengths.map((strength: string, index: number) => (
              <li key={index} className="flex items-start gap-2 text-sm text-green-700">
                <span className="mt-1">✓</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="size-5 text-orange-600" />
            <h3 className="text-xl text-orange-800">Cần cải thiện</h3>
          </div>
          <ul className="space-y-2">
            {feedback.improvements.map((improvement: string, index: number) => (
              <li key={index} className="flex items-start gap-2 text-sm text-orange-700">
                <span className="mt-1">→</span>
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pronunciation Errors */}
      {feedback.pronunciationErrors && feedback.pronunciationErrors.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Volume2 className="size-5 text-red-600" />
            <h3 className="text-xl">Lỗi phát âm cần lưu ý</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {feedback.pronunciationErrors.map((error: any, index: number) => (
              <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-red-600">{error.word}</span>
                </div>
                <p className="text-sm text-gray-600">{error.issue}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transcript */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className="w-full flex items-center justify-between mb-4"
        >
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-blue-600" />
            <h3 className="text-xl">Transcript (Bản ghi)</h3>
          </div>
          <span className="text-sm text-blue-600">
            {showTranscript ? 'Ẩn' : 'Hiển thị'}
          </span>
        </button>

        {showTranscript && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="whitespace-pre-line leading-relaxed text-gray-700 italic">
              {transcript}
            </p>
            <p className="text-xs text-gray-500 mt-3">
              * Đây là bản transcript được AI tạo tự động. Có thể có sai sót nhỏ.
            </p>
          </div>
        )}
      </div>

      {/* Sample Answer */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <button
          onClick={() => setShowSample(!showSample)}
          className="w-full flex items-center justify-between mb-4"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="size-5 text-purple-600" />
            <h3 className="text-xl">Câu trả lời mẫu band cao</h3>
          </div>
          <span className="text-sm text-purple-600">
            {showSample ? 'Ẩn' : 'Hiển thị'}
          </span>
        </button>

        {showSample && (
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="whitespace-pre-line leading-relaxed text-gray-700">
              {sampleAnswer}
            </p>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
        <h3 className="text-xl mb-4">Gợi ý luyện tiếp</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm mb-2">Đề tương tự</p>
            <p className="text-xs text-gray-600">Speaking {task.level} - {task.part.toUpperCase()}</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm mb-2">Luyện phát âm</p>
            <p className="text-xs text-gray-600">Pronunciation Practice</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm mb-2">Nâng cao hơn</p>
            <p className="text-xs text-gray-600">
              Speaking {task.level === 'B1' ? 'B2' : 'C1'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
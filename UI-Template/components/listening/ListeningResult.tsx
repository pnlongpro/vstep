import { CheckCircle2, XCircle, Trophy, Clock, Target, TrendingUp, RotateCcw, ArrowLeft, FileText } from 'lucide-react';
import { useState } from 'react';

interface ListeningResultProps {
  result: any;
  onTryAgain: () => void;
  onBackToList: () => void;
}

export function ListeningResult({ result, onTryAgain, onBackToList }: ListeningResultProps) {
  const [showScript, setShowScript] = useState(false);
  const { correct, total, percentage, vstepScore, timeSpent, details, exercise } = result;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} phút ${secs} giây`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-blue-600';
    if (score >= 5) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return 'bg-green-50 border-green-200';
    if (score >= 6) return 'bg-blue-50 border-blue-200';
    if (score >= 5) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBackToList}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div>
          <h2 className="text-2xl">Kết quả làm bài</h2>
          <p className="text-gray-600">{exercise.title}</p>
        </div>
      </div>

      <div className={`bg-white rounded-2xl p-8 shadow-sm border-2 ${getScoreBgColor(vstepScore)}`}>
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-lg mb-4">
            <Trophy className={`size-12 ${getScoreColor(vstepScore)}`} />
          </div>
          <h3 className="text-4xl mb-2">
            <span className={getScoreColor(vstepScore)}>{vstepScore.toFixed(1)}</span>
            <span className="text-gray-400 text-2xl">/10</span>
          </h3>
          <p className="text-gray-600">Điểm VSTEP</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="size-5 text-green-600" />
              <span className="text-sm text-gray-600">Độ chính xác</span>
            </div>
            <div className="text-2xl text-green-600">{percentage.toFixed(1)}%</div>
            <div className="text-sm text-gray-500">
              {correct}/{total} câu đúng
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="size-5 text-purple-600" />
              <span className="text-sm text-gray-600">Thời gian</span>
            </div>
            <div className="text-2xl text-purple-600">{formatTime(timeSpent)}</div>
            <div className="text-sm text-gray-500">
              Dự kiến: {exercise.duration} phút
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="size-5 text-blue-600" />
              <span className="text-sm text-gray-600">Cấp độ</span>
            </div>
            <div className="text-2xl text-blue-600">{exercise.level}</div>
            <div className="text-sm text-gray-500">{exercise.type.toUpperCase()}</div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onTryAgain}
          className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="size-5" />
          Làm lại bài này
        </button>
        <button
          onClick={onBackToList}
          className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
        >
          Chọn bài khác
        </button>
      </div>

      {/* Script Toggle */}
      {exercise.transcript && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <button
            onClick={() => setShowScript(!showScript)}
            className="w-full flex items-center justify-between mb-4"
          >
            <div className="flex items-center gap-2">
              <FileText className="size-5 text-blue-600" />
              <span className="text-xl">Script Audio</span>
            </div>
            <span className="text-sm text-blue-600">
              {showScript ? 'Ẩn' : 'Hiển thị'}
            </span>
          </button>

          {showScript && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="whitespace-pre-line leading-relaxed text-gray-700">
                {exercise.transcript}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Detailed Results */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl mb-4">Chi tiết từng câu</h3>
        <div className="space-y-3">
          {details.map((detail: any, index: number) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${
                detail.isCorrect
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {detail.isCorrect ? (
                  <CheckCircle2 className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="mb-2">
                    <span className="text-sm text-gray-600">Câu {index + 1}:</span>{' '}
                    {detail.question}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Bạn chọn: </span>
                      <span
                        className={
                          detail.isCorrect ? 'text-green-600' : 'text-red-600'
                        }
                      >
                        {detail.userAnswer || 'Không trả lời'}
                      </span>
                    </div>
                    {!detail.isCorrect && (
                      <div>
                        <span className="text-gray-600">Đáp án đúng: </span>
                        <span className="text-green-600">{detail.correctAnswer}</span>
                      </div>
                    )}
                  </div>

                  {detail.explanation && !detail.isCorrect && (
                    <div className="mt-2 p-3 bg-white rounded border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Giải thích:</p>
                      <p className="text-sm text-gray-700">{detail.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
        <h3 className="text-xl mb-4">Gợi ý luyện tiếp</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm mb-2">Bài tương tự</p>
            <p className="text-xs text-gray-600">Listening {exercise.level} - Short Conversation</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm mb-2">Nâng cao hơn</p>
            <p className="text-xs text-gray-600">
              Listening {exercise.level === 'B1' ? 'B2' : 'C1'} - Lecture
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm mb-2">Ôn lại lỗi</p>
            <p className="text-xs text-gray-600">{total - correct} câu cần xem lại</p>
          </div>
        </div>
      </div>
    </div>
  );
}

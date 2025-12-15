import { Trophy, Clock, FileText, TrendingUp, RotateCcw, ArrowLeft, AlertTriangle, CheckCircle, Lightbulb, BookOpen, User, Target, TrendingDown, Calendar } from 'lucide-react';
import { useState } from 'react';

interface WritingResultProps {
  result: any;
  onTryAgain: () => void;
  onBackToList: () => void;
}

export function WritingResult({ result, onTryAgain, onBackToList }: WritingResultProps) {
  const [showSample, setShowSample] = useState(false);
  const { content, timeSpent, wordCount, scores, feedback, sampleAnswer, task } = result;

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
    { name: 'Task Achievement', score: scores.taskAchievement, description: 'Trả lời yêu cầu đề bài' },
    { name: 'Coherence & Cohesion', score: scores.coherenceCohesion, description: 'Mạch lạc & liên kết' },
    { name: 'Lexical Resource', score: scores.lexicalResource, description: 'Từ vựng' },
    { name: 'Grammatical Range', score: scores.grammaticalRange, description: 'Ngữ pháp' },
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
              <FileText className="size-5 text-purple-600" />
              <span className="text-sm text-gray-600">Số từ</span>
            </div>
            <div className="text-2xl text-purple-600">{wordCount}</div>
            <div className="text-sm text-gray-500">Yêu cầu: {task.minWords}+</div>
          </div>

          <div className="bg-white rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="size-5 text-blue-600" />
              <span className="text-sm text-gray-600">Thời gian</span>
            </div>
            <div className="text-2xl text-blue-600">{formatTime(timeSpent)}</div>
            <div className="text-sm text-gray-500">Đề xuất: {task.duration} phút</div>
          </div>

          <div className="bg-white rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="size-5 text-green-600" />
              <span className="text-sm text-gray-600">Cấp độ</span>
            </div>
            <div className="text-2xl text-green-600">{task.level}</div>
            <div className="text-sm text-gray-500">{task.taskNumber}</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onTryAgain}
          className="flex-1 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="size-5" />
          Viết lại đề này
        </button>
        <button
          onClick={onBackToList}
          className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
        >
          Chọn đề khác
        </button>
      </div>

      {/* Detailed Scores */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl mb-4">Chi tiết điểm theo tiêu chí</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {criteria.map((criterion, index) => {
            const score = parseFloat(criterion.score);
            return (
              <div key={index} className="p-4 border-2 border-gray-200 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">{criterion.name}</p>
                    <p className="text-xs text-gray-600">{criterion.description}</p>
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

      {/* Grammar Errors */}
      {feedback.grammarErrors.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="size-5 text-red-600" />
            <h3 className="text-xl">Lỗi ngữ pháp cần lưu ý</h3>
          </div>
          <div className="space-y-3">
            {feedback.grammarErrors.map((error: any, index: number) => (
              <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="mb-2">
                  <span className="text-sm text-gray-600">Lỗi: </span>
                  <span className="text-sm text-red-600 line-through">{error.text}</span>
                </div>
                <div className="mb-2">
                  <span className="text-sm text-gray-600">Sửa: </span>
                  <span className="text-sm text-green-600">{error.suggestion}</span>
                </div>
                <p className="text-xs text-gray-600">{error.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Your Writing */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl mb-4">Bài viết của bạn</h3>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="whitespace-pre-line leading-relaxed text-gray-700">
            {content}
          </p>
        </div>
      </div>

      {/* Sample Answer */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <button
          onClick={() => setShowSample(!showSample)}
          className="w-full flex items-center justify-between mb-4"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="size-5 text-purple-600" />
            <h3 className="text-xl">Bài mẫu band cao</h3>
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

      {/* ======= DETAILED TEACHER FEEDBACK ======= */}
      {feedback.detailedFeedback && (
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 shadow-lg border-2 border-indigo-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-md">
              <User className="size-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Phản hồi chi tiết từ giáo viên
              </h3>
              <p className="text-sm text-gray-600">Phân tích sâu và lời khuyên cá nhân hóa</p>
            </div>
          </div>

          {/* Overview */}
          <div className="bg-white rounded-xl p-6 mb-6 border border-indigo-100 shadow-sm">
            <h4 className="text-lg mb-3 flex items-center gap-2">
              <Lightbulb className="size-5 text-indigo-600" />
              Tổng quan
            </h4>
            <p className="text-gray-700 leading-relaxed">
              {feedback.detailedFeedback.overview}
            </p>
          </div>

          {/* Criteria Analysis */}
          <div className="mb-6">
            <h4 className="text-lg mb-4 flex items-center gap-2">
              <Target className="size-5 text-purple-600" />
              Phân tích chi tiết từng tiêu chí
            </h4>
            <div className="space-y-4">
              {feedback.detailedFeedback.criteriaAnalysis.map((item: any, index: number) => (
                <div key={index} className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-purple-900">{item.criterion}</h5>
                    <span className={`text-2xl ${getScoreColor(parseFloat(item.score))}`}>
                      {item.score}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                    {item.analysis}
                  </p>
                  
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                    <p className="text-sm text-purple-900 mb-2">💡 Gợi ý cải thiện:</p>
                    <ul className="space-y-1.5">
                      {item.suggestions.map((suggestion: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-purple-700">
                          <span className="mt-0.5">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Paragraph Analysis */}
          <div className="mb-6">
            <h4 className="text-lg mb-4 flex items-center gap-2">
              <FileText className="size-5 text-pink-600" />
              Phân tích từng phần bài viết
            </h4>
            <div className="space-y-4">
              {feedback.detailedFeedback.paragraphAnalysis.map((para: any, index: number) => (
                <div key={index} className="bg-white rounded-xl p-6 border border-pink-100 shadow-sm">
                  <h5 className="text-pink-900 mb-3">{para.title}</h5>
                  
                  <p className="text-sm text-gray-700 mb-4">
                    {para.content}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                      <p className="text-sm text-green-800 mb-2">✓ Điểm mạnh:</p>
                      <ul className="space-y-1">
                        {para.strengths.map((strength: string, idx: number) => (
                          <li key={idx} className="text-xs text-green-700">• {strength}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                      <p className="text-sm text-orange-800 mb-2">⚠ Điểm yếu:</p>
                      <ul className="space-y-1">
                        {para.weaknesses.map((weakness: string, idx: number) => (
                          <li key={idx} className="text-xs text-orange-700">• {weakness}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <p className="text-sm text-blue-800 mb-1">💬 Lời khuyên:</p>
                    <p className="text-sm text-blue-700">{para.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Plan */}
          <div className="mb-6">
            <h4 className="text-lg mb-4 flex items-center gap-2">
              <Calendar className="size-5 text-indigo-600" />
              Kế hoạch hành động để cải thiện
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {feedback.detailedFeedback.actionPlan.map((plan: any, index: number) => {
                const colors = [
                  { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', badge: 'bg-red-500' },
                  { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', badge: 'bg-orange-500' },
                  { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', badge: 'bg-blue-500' },
                ];
                const color = colors[index];
                
                return (
                  <div key={index} className={`${color.bg} rounded-xl p-5 border-2 ${color.border}`}>
                    <div className="flex items-center gap-2 mb-4">
                      <div className={`w-2 h-2 ${color.badge} rounded-full`}></div>
                      <h5 className={`${color.text}`}>{plan.priority}</h5>
                    </div>
                    <ul className="space-y-2">
                      {plan.items.map((item: string, idx: number) => (
                        <li key={idx} className={`flex items-start gap-2 text-sm ${color.text}`}>
                          <span className="mt-0.5">→</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Target & Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Target className="size-5 text-green-600" />
                <h5 className="text-green-900">Mục tiêu điểm số</h5>
              </div>
              <p className="text-3xl text-green-600 mb-1">{feedback.detailedFeedback.targetScore}</p>
              <p className="text-sm text-green-700">Có thể đạt được với luyện tập đúng cách</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="size-5 text-blue-600" />
                <h5 className="text-blue-900">Thời gian ước tính</h5>
              </div>
              <p className="text-3xl text-blue-600 mb-1">{feedback.detailedFeedback.estimatedTimeToImprove.split(' ')[0]}</p>
              <p className="text-sm text-blue-700">{feedback.detailedFeedback.estimatedTimeToImprove}</p>
            </div>
          </div>

          {/* Motivation Note */}
          <div className="mt-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 border-2 border-purple-200">
            <p className="text-center text-purple-900">
              💪 <strong>Hãy kiên trì!</strong> Mỗi bài luyện đều là một bước tiến. Với phản hồi chi tiết này, 
              bạn biết chính xác cần cải thiện gì để đạt điểm cao hơn. Chúc bạn thành công!
            </p>
          </div>
        </div>
      )}
      {/* ======= END DETAILED TEACHER FEEDBACK ======= */}

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
        <h3 className="text-xl mb-4">Gợi ý luyện tiếp</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm mb-2">Đề tương tự</p>
            <p className="text-xs text-gray-600">Writing {task.level} - Essay</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm mb-2">Nâng cao hơn</p>
            <p className="text-xs text-gray-600">
              Writing {task.level === 'B1' ? 'B2' : 'C1'}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm mb-2">Luyện từ vựng</p>
            <p className="text-xs text-gray-600">Vocabulary Builder</p>
          </div>
        </div>
      </div>
    </div>
  );
}